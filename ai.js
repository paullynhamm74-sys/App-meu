// Meu Prato: usa o Claude direto no app instalado, com a chave da API da própria usuária.
// A chave fica salva só neste celular (localStorage) e vai apenas para api.anthropic.com.
// Imita a interface de claude.use("sample") usada pelas telas, para o mesmo código servir nos dois lugares.
(function () {
  var KEY = "mp:apikey";
  var MODEL = "claude-opus-5-5";
  function getKey() { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
  window.__apiKey = {
    get: getKey,
    set: function (k) { try { localStorage.setItem(KEY, String(k || "").trim()); } catch (e) {} },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };

  // reduz a foto para ~1.2 MP em JPEG antes de mandar
  function toImageBlock(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var scale = Math.min(1, Math.sqrt(1200000 / (img.width * img.height)));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        var data = c.toDataURL("image/jpeg", 0.85).split(",")[1];
        resolve({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: data } });
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject({ code: "image_rejected", message: "imagem inválida" }); };
      img.src = url;
    });
  }

  function mapError(e) {
    if (e && e.code) return e;
    var A = window.Anthropic;
    if (e && e.name === "AbortError" || (A && e instanceof A.APIUserAbortError)) return { code: "cancelled", message: "cancelado" };
    if (A && e instanceof A.AuthenticationError) return { code: "bad_key", message: "chave inválida" };
    if (A && e instanceof A.PermissionDeniedError) return { code: "bad_key", message: "sem permissão" };
    if (A && e instanceof A.RateLimitError) return { code: "rate_limited", message: "limite" };
    if (A && e instanceof A.BadRequestError) {
      var msg = String(e.message || "");
      if (/credit|balance|billing/i.test(msg)) return { code: "no_credit", message: msg };
      return { code: "invalid_request", message: msg };
    }
    if (A && e instanceof A.APIConnectionError) return { code: "upstream_error", message: "sem conexão" };
    return { code: "upstream_error", message: String(e && e.message || e) };
  }

  function textOf(content) {
    return content.filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("\n").trim();
  }

  window.__apiSample = function () {
    if (!getKey() || !window.Anthropic) return null;
    var client = new window.Anthropic({ apiKey: getKey(), dangerouslyAllowBrowser: true, maxRetries: 1 });

    function run(input, opts) {
      opts = opts || {};
      var turns = typeof input === "string" ? [{ role: "user", content: input }] : input.slice();
      // junta turnos seguidos do mesmo papel
      var msgs = [];
      turns.forEach(function (t) {
        var last = msgs[msgs.length - 1];
        if (last && last.role === t.role) last.content[0].text += "\n\n" + t.content;
        else msgs.push({ role: t.role, content: [{ type: "text", text: t.content }] });
      });
      var imgs = opts.images ? (opts.images.length !== undefined && !(opts.images instanceof Blob) ? Array.prototype.slice.call(opts.images) : [opts.images]) : [];
      var tools = (opts.tools || []).map(function (t) {
        return { name: t.name, description: t.description, input_schema: t.inputSchema || { type: "object", properties: {} } };
      });
      return Promise.all(imgs.map(toImageBlock)).then(function (blocks) {
        var lastUser = msgs[msgs.length - 1];
        lastUser.content = blocks.concat(lastUser.content);
        var allText = "";
        function round(n) {
          var params = {
            model: MODEL, max_tokens: 16000, messages: msgs,
            output_config: { effort: opts.effort || "low" },
            betas: ["server-side-fallback-2026-07-01"], fallbacks: "default"
          };
          if (tools.length) params.tools = tools;
          return client.beta.messages.create(params, { signal: opts.signal }).then(function (res) {
            if (res.stop_reason === "refusal") throw { code: "refused", message: "recusado" };
            var t = textOf(res.content);
            if (t) { allText = allText ? allText + "\n\n" + t : t; if (opts.onText) opts.onText({ text: allText, delta: t }); }
            var uses = res.content.filter(function (b) { return b.type === "tool_use"; });
            if (res.stop_reason !== "tool_use" || !uses.length || n >= 5) return allText;
            msgs.push({ role: "assistant", content: res.content });
            return Promise.all(uses.map(function (u) {
              var tool = (opts.tools || []).filter(function (x) { return x.name === u.name; })[0];
              return Promise.resolve().then(function () {
                if (!tool) throw new Error("ferramenta desconhecida");
                return tool.execute(u.input || {}, { signal: opts.signal });
              }).then(function (out) {
                return { type: "tool_result", tool_use_id: u.id, content: typeof out === "string" ? out : JSON.stringify(out) };
              }, function (err) {
                return { type: "tool_result", tool_use_id: u.id, content: "Error: " + (err && err.message || err), is_error: true };
              });
            })).then(function (results) {
              msgs.push({ role: "user", content: results });
              return round(n + 1);
            });
          });
        }
        return round(0);
      }).then(function (text) {
        if (!text) throw { code: "empty_completion", message: "sem resposta" };
        return { text: text, truncated: false, modelTierApplied: "default" };
      }).catch(function (e) { throw mapError(e); });
    }

    var fn = function (input, opts) { return run(input, opts); };
    fn.json = function (input, opts) {
      return run(input, opts).then(function (r) {
        var t = r.text, m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (m) t = m[1];
        try { return JSON.parse(t); } catch (e) {}
        var a = t.indexOf("{"), b = t.lastIndexOf("}");
        if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
        throw { code: "invalid_json", message: "json inválido", text: r.text };
      });
    };
    fn.limits = function () {
      return Promise.resolve({ maxPromptBytes: 262144, images: { maxCount: 4, maxInputBytes: 20000000, mediaTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"] }, tools: { maxCount: 8 } });
    };
    fn.viaApi = true;
    return fn;
  };
})();
