var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// ../common/utils/path.ts
var fullSuffix = (fileName = "") => fileName.split(".").slice(1);
var suffix = (fileName = "") => {
  const suffix2 = fullSuffix(fileName);
  return suffix2.join(".");
};

// ../../node_modules/esmpile/dist/index.esm.js
var Ee = Object.defineProperty;
var U = (t, e) => {
  for (var s in e)
    Ee(t, s, { get: e[s], enumerable: true });
};
var b = {};
U(b, { absolute: () => y, base: () => K, extension: () => m, get: () => p, noBase: () => x, pathId: () => R, url: () => j });
var w = "application/javascript";
var H = (t) => !t || t === "application/javascript";
var L = { js: w, mjs: w, cjs: w, ts: "text/typescript", json: "application/json", html: "text/html", css: "text/css", txt: "text/plain", svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", mp3: "audio/mpeg", mp4: "video/mp4", webm: "video/webm", ogg: "application/ogg", wav: "audio/wav" };
var S = (t) => L[t];
var M = { nodeModules: { nodeModules: "node_modules", relativeTo: "./" } };
var v = "://";
var p = (t, e = "", s = false, n = false) => {
  if (j(t))
    return t;
  let i = "", o = (l) => (i = l.includes(v) ? l.split(v).splice(0, 1) : void 0, i ? l.replace(`${i}${v}`, "") : l);
  t.includes(v) && (t = o(t)), e.includes(v) && (e = o(e)), s || (e = e.split("/").filter((l) => l != "..").join("/")), e[e.length - 1] === "/" && (e = e.slice(0, -1));
  let r = e.split("/");
  if (r.length === 1 && r[0] === "" && (r = []), !n) {
    let l = r.pop();
    if (l) {
      let f = l.split(".");
      (f.length == 1 || f.length > 1 && f.includes("")) && r.push(l);
    }
  }
  let d = t.split("/").filter((l, f) => !!l).filter((l, f) => l === ".." ? (r.pop(), false) : l !== "."), u = [...r, ...d].join("/");
  return i ? i + "://" + u : u;
};
function y(t, e) {
  let s = t[0] !== ".", n = j(t);
  return s && (e || !n);
}
function j(t) {
  try {
    return new URL(t), true;
  } catch {
    return false;
  }
}
var m = (t) => {
  let e = t.split("/").slice(-1)[0].split(".").slice(-1)[0];
  if (L[e])
    return e;
};
var K = (t) => t.substring(0, t.lastIndexOf("/"));
var x = (t, e, s) => {
  t = globalThis.location ? t.replace(`${K(globalThis.location.href)}/`, "./") : t;
  let n = y(t, true), i = e.relativeTo ?? M.nodeModules.relativeTo, o = e.nodeModules ?? M.nodeModules.nodeModules;
  if (n)
    return t;
  {
    let r = t;
    return s && (r = r.replace(`${o}/`, "")), r = r.replace(`${i.split("/").slice(0, -1).join("/")}/`, ""), r[0] !== "." && (r = `./${r}`), r;
  }
};
var R = (t, e) => p(x(t, e));
var C = {};
U(C, { getMainPath: () => Z, path: () => k, resolve: () => Q, transformation: () => E });
var k = (t) => {
  let e = t.nodeModules ?? M.nodeModules.nodeModules, s = t.relativeTo ?? M.nodeModules.relativeTo;
  return p(e, s);
};
var Q = async (t, e) => {
  let s = k(e), n = t.split("/"), i = p(t, s);
  if (n.length > 1) {
    if (m(i))
      return i;
    i += "/package.json";
  }
  return await Z(t, i, e).catch((o) => {
    console.warn(`${i} does not exist or is not at the root of the project.`);
  });
};
var X = (t, e, s) => p(t, s, false, e.split("/").length === 1);
var Te = (t, e = t) => X("package.json", t, e);
var Z = async (t, e = t, s = {}) => {
  let n = await Ue(t, e, s);
  if (!n)
    return e;
  let i = n.module || n.main || "index.js";
  return X(i, t, e);
};
var Ue = async (t, e = t, s) => {
  let n = Te(t, e);
  return (await (j(n) ? import(n, { assert: { type: "json" } }) : import(new URL(n, window.location.href).href, { assert: { type: "json" } }))).default;
};
var E = { name: "node_modules", handler: Q };
var F = {};
U(F, { get: () => N });
var te = ["ts", "js"];
var ee = [...te, E];
var se = (t) => {
  let e = m(t), s = y(t), n = s ? t.split("/").length === 1 : false, i = !e;
  if (!n && s && i) {
    let o = te.map((r) => ({ extension: r, name: `${E.name} + ${r}`, handler: E.handler }));
    return t.split("/").length === 1 ? [E, ...o] : [...o, E];
  } else
    return s ? [...ee].reverse() : i ? [...ee] : [];
};
var ve = "was not resolved locally. You can provide a direct reference to use in";
var O = (t, e = t) => new Error(`${t} ${ve} options.filesystem._fallbacks['${e}'].`);
var ne = (t, e = "js") => {
  let s = y(t), n = t.split("/"), i = m(t);
  return (!s || s && n.length > 1) && !i ? `${t}.${e}` : t;
};
var oe = async (t, e, s, n) => {
  let i = typeof e;
  if (i === "string" && (!n || n === "string"))
    return ne(t, e);
  if (i === "object" && (!n || n === "object"))
    return e.extension && (t = ne(t, e.extension)), await e.handler(t, s).catch((o) => {
      throw O(t, x(t, s));
    });
};
var $e = (t) => {
  let e;
  try {
    e = new URL(t).href;
  } catch {
    e = p(t, globalThis.location.href);
  }
  return e;
};
var re = async (t, e = {}) => {
  e.fetch || (e.fetch = {}), e.fetch.mode || (e.fetch.mode = "cors");
  let s = $e(t), n = e?.callbacks?.progress?.fetch, i = await Be(s, e, { path: t, progress: n });
  if (!i.buffer)
    throw new Error("No response received.");
  let o = i.type.split(";")[0];
  return { ...i, url: s, type: o };
};
var Be = async (t, e = {}, s) => {
  let n = s.path ?? t, i = p(x(n, e)), o = await globalThis.fetch(t, e.fetch), r = 0, a = [], c = 0, d = typeof s.progress == "function", u = await new Promise(async (f) => {
    if (o) {
      c = parseInt(o.headers.get("Content-Length"), 10);
      let h = o.headers.get("Content-Type");
      if (globalThis.REMOTEESM_NODE) {
        let g = await o.arrayBuffer();
        f({ buffer: g, type: h });
      } else {
        let g = o.body.getReader(), $ = async ({ done: B, value: q }) => {
          if (B) {
            let z = {};
            typeof h == "string" && (z.type = h);
            let xe = await new Blob(a, z).arrayBuffer();
            f({ buffer: new Uint8Array(xe), type: h });
            return;
          }
          r += q.length;
          let ye = q;
          return a.push(ye), d && s.progress(i, r, c, null, null, o.headers.get("Range")), g.read().then($);
        };
        g.read().then($);
      }
    } else
      console.warn("Response not received!", e.headers), f(void 0);
  }), l = { response: o, ...u };
  if (d) {
    let f = [null, null];
    o.ok ? f[0] = l : f[1] = l, s.progress(i, r, c, ...f, o.headers.get("Range"));
  }
  return l;
};
var ae = new TextDecoder("utf-8");
var P = async (t, e, s) => {
  let n = { uri: t, text: { original: "", updated: "" }, buffer: null };
  if (globalThis.REMOTEESM_NODE) {
    let i = t.replace("file://", "");
    n.buffer = globalThis.fs.readFileSync(i), n.text.original = n.text.updated = ae.decode(n.buffer);
  } else {
    let i = await re(t, e), o = i.response;
    if (n.response = o, o.ok) {
      if (s) {
        let r = o.headers.get("Content-Type");
        if (!r.includes(s))
          throw new Error(`Expected Content Type ${s} but received ${r} for  ${t}`);
      }
      n.buffer = i.buffer, n.text.original = n.text.updated = ae.decode(n.buffer);
    } else
      throw new Error(o.statusText);
  }
  return n;
};
var le = async (t, e, s) => {
  let n = se(t), i;
  if (n.length > 0) {
    do {
      let o = n.shift(), r = o?.name ?? o, a = (l) => {
        e.debug && console.error(`Import using ${r ?? o} transformation failed for ${t}`);
      }, c = await oe(t, o, e), d = p(c, e.relativeTo);
      i = await s(d, e, o ? null : "application/javascript").then((l) => (e.debug && console.warn(`Import using ${r ?? o} transformation succeeded for ${t}`), l)).catch(a);
    } while (!i && n.length > 0);
    if (!i)
      throw new Error(`No valid transformation found for ${t}`);
  } else
    i = await s(p(t, e.relativeTo), e);
  return i;
};
var ce = async (t, e) => {
  let n = m(t) === "json", i = {};
  return await le(t, e, async (o) => {
    i.uri = o, i.result = await (n ? import(o, { assert: { type: "json" } }) : import(o));
  }), i;
};
var de = async (t, e) => await le(t, e, P);
var Se = /\/\/# sourceMappingURL=(.*\.map)/;
var N = async (t, e, s, n = true) => {
  if (s || (s = (await P(t, e)).text.original), s) {
    let i = s.match(Se);
    if (i) {
      let o = async () => {
        let r = p(i[1], t), c = (await P(r, e)).text.original;
        c.slice(0, 3) === ")]}" && (console.warn("Removing source map invalidation characters"), c = c.substring(c.indexOf(`
`)));
        let d = { result: JSON.parse(c) };
        return d.text = { original: c, updated: null }, d;
      };
      return n ? o() : o;
    }
  }
};
var J = {};
U(J, { script: () => A });
var A = async (t) => await new Promise((e, s) => {
  let n = document.createElement("script"), i = false;
  n.onload = n.onreadystatechange = function() {
    !i && (!this.readyState || this.readyState == "complete") && (i = true, e(window));
  }, n.onerror = s, n.src = t, document.body.insertAdjacentElement("beforeend", n);
});
var we = {};
U(we, { default: () => T, get: () => I });
var V = {};
U(V, { datauri: () => Pe, objecturl: () => _e });
function Re(t) {
  let e = "", s = new Uint8Array(t), n = s.byteLength;
  for (let i = 0; i < n; i++)
    e += String.fromCharCode(s[i]);
  return window.btoa(e);
}
var ue = (t, e = w, s = false) => {
  let i = (typeof t == "string" ? "text" : "buffer") === "buffer" ? Re(t) : btoa(s ? unescape(encodeURIComponent(t)) : t);
  return `data:${e};base64,` + i;
};
function pe(t, e = w) {
  typeof t == "string" && (t = new TextEncoder().encode(t));
  let s = new Blob([t], { type: e });
  return URL.createObjectURL(s);
}
var Pe = async (...t) => await he(ue, ...t);
var _e = async (...t) => await he(pe, ...t);
var Ie = async (t, e) => await (e ? import(t, { assert: { type: "json" } }) : import(t)).catch((s) => {
  throw s;
});
async function he(t, e, s, n) {
  let i, o;
  if (!n) {
    let a = m(s);
    n = S(a);
  }
  let r = n === "application/json";
  try {
    i = t(e, n), o = await Ie(i, r);
  } catch (a) {
    i = t(e, n, true), H(n) ? o = i = await Le(i, a).catch((c) => {
      throw c;
    }) : o = i;
  }
  return { encoded: i, module: o };
}
async function Le(t, e) {
  if (e.message.includes("The string to be encoded contains characters outside of the Latin1 range.") || e.message.includes("Cannot set properties of undefined"))
    return await A(t);
  throw e;
}
var De = { compilerOptions: { target: "ES2015", module: "ES2020", strict: false, esModuleInterop: true } };
var me = (t, e = "text") => {
  if (window.ts) {
    let s = e !== "buffer" ? t[e].updated : new TextDecoder().decode(t[e]);
    return t.text.updated = window.ts.transpile(s, De.compilerOptions), e === "buffer" ? (t.buffer = new TextEncoder().encode(t.text.updated), t.buffer) : t.text.updated;
  } else
    throw new Error("Must load TypeScript extension to compile TypeScript files using remoteESM.load.script(...);");
};
var Y;
var ge;
var be;
var Ne = new Promise(async (t, e) => {
  try {
    if (typeof process == "object") {
      if (Y || (globalThis.REMOTEESM_NODE = true, Y = globalThis.fetch = (await import("node-fetch")).default, typeof globalThis.fetch != "function" && (globalThis.fetch = Y)), ge || (ge = globalThis.fs = (await import("fs")).default), !be) {
        let s = (await import("node:buffer")).default;
        be = globalThis.Blob = s.Blob;
      }
      t(true);
    } else
      t(true);
  } catch (s) {
    e(s);
  }
});
var G = Ne;
globalThis.REMOTEESM_BUNDLES || (globalThis.REMOTEESM_BUNDLES = { global: {} });
var _ = globalThis.REMOTEESM_BUNDLES.global;
var W = "No buffer or text to bundle for";
var Ae = /[^\n]*(?<![\/\/])(import)\s+([ \t]*(?:(?:\* (?:as .+))|(?:[^ \t\{\}]+[ \t]*,?)|(?:[ \t]*\{(?:[ \t]*[^ \t"'\{\}]+[ \t]*,?)+\}))[ \t]*)from[ \t]*(['"])([^'"\n]+)(?:['"])([ \t]*assert[ \t]*{[ \n\t]*type:[ \n\t]*(['"])([^'"\n]+)(?:['"])[\n\t]*})?;?/gm;
function I(t, e = this.options) {
  let s = t ? R(t, e) : void 0, n = globalThis.REMOTEESM_BUNDLES[e.collection];
  n || (n = globalThis.REMOTEESM_BUNDLES[e.collection] = {});
  let i = n[s];
  return i ? e && (i.options = e) : i = new T(t, e), i;
}
var T = class {
  filename = "bundle.esmpile.js";
  uri;
  #t;
  get url() {
    return this.#t;
  }
  set url(e) {
    let s = this.options._esmpile;
    s.entrypoint || (s.entrypoint = this), this.uri || (this.uri = e), e.includes(this.#e.relativeTo) || (e = p(e, this.#e.relativeTo)), this.#t = e;
    let n = R(this.url, this.options);
    this.name !== n && (this.name = n), this.updateCollection(this.options.collection);
  }
  status = null;
  #e;
  get options() {
    return this.#e;
  }
  set options(e = {}) {
    e._esmpile || (e._esmpile = this.#e?._esmpile ?? { circular: /* @__PURE__ */ new Set() }), e.collection || (e.collection = this.#e?.collection), this.#e = e, e.output || (e.output = {}), this.bundler = e.bundler, this.updateCollection(this.options.collection), typeof e?.callbacks?.progress?.file == "function" && (this.callbacks.file = e.callbacks.progress.file), e.fetch || (e.fetch = {}), e.fetch = Object.assign({}, e.fetch), e.fetch.signal = this.controller.signal;
  }
  controller = new AbortController();
  #s;
  get bundler() {
    return this.#s;
  }
  set bundler(e) {
    this.setBundleInfo(e), this.setBundler(e, false);
  }
  setBundleInfo = (e) => {
    this.#e._esmpile.lastBundler = this.#s, this.#s = this.#e.bundler = e;
    let s = this.#e.output;
    e && (s[e] = true, s.text = true), this.derived.compile = !this.#e.forceNativeImport && (s.text || s.datauri || s.objecturl);
  };
  setBundler = async (e, s = true) => {
    s && this.setBundleInfo(e);
    let n = this.#e._esmpile, i = n.lastBundle, o = n.lastBundle === e;
    if (!o || n.lastBundle && o && !i) {
      let r = n.entrypoint;
      if (e) {
        let c = Array.from(this.dependencies.entries());
        await Promise.all(c.map(async ([d, u]) => {
          u.bundler = e, await u.result;
        }));
      }
      ["success", "failed"].includes(r?.status) && (e ? i ? this.encoded = await this.bundle(i) : this.result = await this.resolve() : this.result = await this.resolve());
    }
  };
  #i;
  get name() {
    return this.#i;
  }
  set name(e) {
    if (e !== this.#i) {
      let s = globalThis.REMOTEESM_BUNDLES[this.collection];
      s && (_[this.name] === s[this.name] && delete _[this.name], delete s[this.name]), this.#i = e;
      let i = e.split("/").pop().split(".");
      this.filename = [...i.slice(0, -1), "esmpile", "js"].join("."), _[this.name] ? this.options.collection != "global" && console.warn(`Duplicating global bundle (${this.name})`, this.name) : _[this.name] = this;
    }
  }
  #n;
  get collection() {
    return this.#n;
  }
  set collection(e) {
    this.#n = e;
    let s = globalThis.REMOTEESM_BUNDLES[e];
    s || (s = globalThis.REMOTEESM_BUNDLES[e] = {}), this.name && (s[this.name] ? s[this.name] !== this && console.warn(`Trying to duplicate bundle in bundle ${e} (${this.name})`, this.name) : s[this.name] = this);
  }
  #o;
  #r;
  get text() {
    return this.#o;
  }
  set text(e) {
    this.#o = e, this.encoded = this.bundle("text").catch((s) => {
      if (!s.message.includes(W))
        throw s;
    });
  }
  set buffer(e) {
    this.#r = e, this.encoded = this.bundle("buffer").catch((s) => {
      if (!s.message.includes(W))
        throw s;
    });
  }
  dependencies = /* @__PURE__ */ new Map();
  dependents = /* @__PURE__ */ new Map();
  get entries() {
    let e = [], s = (n) => {
      n.dependencies.forEach((i) => {
        !e.includes(i) && i !== this && (e.push(i), s(i));
      });
    };
    return s(this), e;
  }
  encodings = {};
  info = {};
  imports = [];
  link = void 0;
  result = void 0;
  callbacks = { file: void 0 };
  derived = { compile: false, dependencies: { n: 0, resolved: 0 } };
  constructor(e, s = {}) {
    this.options = s, this.url = e;
  }
  import = async () => {
    this.status = "importing";
    let e = await ce(this.url, this.options);
    if (e?.result)
      return e.result;
    this.status = "fallback";
  };
  get = I;
  compile = async () => {
    this.status = "compiling", await G;
    try {
      let e = await de(this.url, this.options).catch((s) => {
        throw s;
      });
      try {
        e && (this.info = e, this.url = this.info.uri, this.buffer = this.info.buffer, await this.encoded);
      } catch {
        this.imports = {};
        let n = [];
        Array.from(this.info.text.updated.matchAll(Ae)).forEach(([r, a, c, d, u]) => {
          if (u) {
            let l = !!c.match(/\*\s+as/), f = c.replace(/\*\s+as/, "").trim(), g = y(u) ? u : p(u, this.url), $ = k(this.options);
            g = g.replace(`${$}/`, "");
            let B = { name: g, path: u, prefix: a, variables: f, wildcard: l, current: { line: r, path: u }, original: r, counter: 0, bundle: null };
            this.imports[g] || (this.imports[g] = []), this.imports[g].push(B), n.push(B);
          }
        }), this.derived.dependencies.resolved = 0, this.derived.dependencies.n = this.imports.length;
        let o = n.map(async (r, a) => {
          await this.updateImport(r, a), this.derived.dependencies.resolved++;
        });
        await Promise.all(o), this.text = this.info.text.updated;
      }
    } catch (e) {
      throw e;
    }
    return await this.encoded, this.result;
  };
  updateImportPath = (e, s) => {
    if (s === e.current.path)
      return;
    let { prefix: n, variables: i, wildcard: o, bundle: r } = e, a = "";
    if (typeof s == "string")
      a = `${n} ${o ? "* as " : ""}${i} from "${s}"; // Imported from ${r.name}

`;
    else {
      let d = i.replace("{", "").replace("}", "") === i, u = i.replace("{", "").replace("}", "").split(",").map((f) => f.trim()), l = (f) => {
        let h = "";
        o || (d ? h = ".default" : h = `.${f}`), a += `${n === "import" ? "" : "export "}const ${f} = (await globalThis.REMOTEESM_BUNDLES["${r.collection}"]["${r.name}"].result)${h};

`;
      };
      u.forEach(l);
    }
    this.info.text.updated = this.info.text.updated.replace(e.current.line, a), e.current.line = a, e.current.path = s;
  };
  updateImport = async (e) => {
    let s = e.path, n = e.name, i = this.get(n);
    if (e.bundle = i, this.addDependency(i), i.status)
      await i.result;
    else {
      let r = { output: {}, ...this.options };
      r.output.text = true, await (await this.get(n, r)).resolve(s);
    }
    let o = await i.encoded;
    return this.updateImportPath(e, o), i;
  };
  notify = (e, s) => {
    let n = e !== void 0, i = s !== void 0;
    this.callbacks.file && this.callbacks.file(this.name, this.derived.dependencies.resolved, this.derived.dependencies.n, n ? this : void 0, i ? s : void 0);
  };
  get buffer() {
    return this.#r;
  }
  bundle = (e = "buffer") => (this.options._esmpile.lastBundle = e, new Promise(async (s, n) => {
    try {
      let i = e === "text" ? this.info.text.updated : this.buffer;
      i || (this.info.fallback ? this.encoded = this.info.fallback : n(new Error(`${W} ${this.name}`)));
      let o = m(this.url), r = S(o);
      switch (r) {
        case "text/typescript":
          i = me(this.info, e), r = w;
          break;
      }
      let a = [], c = this.options.output;
      c?.datauri && a.push("datauri"), c?.objecturl && a.push("objecturl");
      for (let l in a) {
        let f = a[l], h = await V[f](i, this.url, r);
        h && (this.result = h.module, this.encodings[f] = await h.encoded);
      }
      let d = this.bundler === "objecturl" ? this.encodings.objecturl : this.encodings.datauri, u = Array.from(this.dependents.values()).map((l) => l.updateDependency(this, d));
      await Promise.all(u), s(d);
    } catch (i) {
      n(i);
    }
  }));
  delete = () => {
    this.objecturl && window.URL.revokeObjectURL(this.objecturl);
  };
  addDependency = (e) => {
    let s = false;
    this.dependents.has(e.url) && (s = true), this.dependencies.set(e.url, e), e.dependencies.has(this.url) && (s = true), e.dependents.set(this.url, this), s && (this.options._esmpile.circular.add(this.url, e.url), this.options._esmpile.circular.add(e.url), this.circular(e), e.circular(this));
  };
  removeDependency = (e) => {
    this.dependencies.delete(e.name), e.dependents.delete(this.name);
  };
  updateDependency = async (e, s) => {
    this.imports[e.url].forEach((i) => this.updateImportPath(i, s));
  };
  updateCollection = (e) => {
    e ? this.collection = e : this.collection = this.options.collection = Object.keys(globalThis.REMOTEESM_BUNDLES).length;
  };
  download = async (e = this.filename) => {
    this.bundler != "datauri" && await this.setBundler("datauri");
    let s = this.encodings.datauri.split(",")[0].split(":")[1].split(";")[0], n = atob(this.encodings.datauri.split(",")[1]), i = [];
    for (var o = 0; o < n.length; o++)
      i.push(n.charCodeAt(o));
    let r = new Uint8Array(i), a = new Blob([r], { type: s }), c = URL.createObjectURL(a);
    if (globalThis.REMOTEESM_NODE)
      await G, globalThis.fs.writeFileSync(e, r), console.log(`Wrote bundle contents to ${e}`);
    else {
      var d = document.createElement("a");
      document.body.appendChild(d), d.style = "display: none", d.href = c, d.download = e, d.click();
    }
  };
  circular = async (e) => {
    let s = await this.resolve().catch((n) => {
      console.warn(`Circular dependency detected: Fallback to direct import for ${this.url} failed...`, n);
      let i = `Circular dependency cannot be resolved: ${this.uri} <-> ${e.uri}.`;
      throw new Error(i);
    });
    console.warn(`Circular dependency detected: Fallback to direct import for ${this.url} was successful!`, s);
  };
  resolve = async (e = this.uri) => (this.status = "resolving", this.result = void 0, this.encoded = void 0, this.result = new Promise(async (s, n) => {
    let i, o = this.options._esmpile.circular.has(this.url), r = o || !this.derived.compile;
    try {
      i = r ? await this.import().catch(async (a) => {
        if (this.#e.fallback === false)
          throw a;
        await this.setBundler("objecturl");
      }) : void 0;
      try {
        if (!i) {
          if (o)
            throw new Error(`Failed to import ${this.url} natively.`);
          i = await this.compile();
        }
      } catch (a) {
        if (this.options.fetch?.signal?.aborted)
          throw a;
        {
          let c = y(e) ? x(e, this.options, true) : x(this.url, this.options, true);
          console.warn(`Failed to fetch ${e}. Checking filesystem references...`);
          let d = this.options.filesystem?._fallbacks?.[c];
          if (d)
            console.warn(`Got fallback reference (module only) for ${e}.`), i = d, Object.defineProperty(info, "fallback", { value: true, enumerable: false });
          else {
            let u = "was not resolved locally. You can provide a direct reference to use in";
            throw a.message.includes(u) ? a : O(e, c);
          }
        }
      }
      await this.encoded, this.status = "success", this.notify(this), s(i);
    } catch (a) {
      this.status = "failed", this.notify(null, a), n(a);
    }
  }), this.result);
  sources = async () => await N(this.#t, this.#e, this.info.text.original);
};
var Ze = p;
var et = b;
var tt = T;

// ../common/get.ts
var cache = {};
var get = async (relPath, relativeTo = "", onImport, options = {}) => {
  let type = suffix(relPath);
  const isJSON = !type || type.includes("json");
  const fullPath = relPath[0] === "." ? Ze(relPath, relativeTo) : relPath;
  const isFunc = typeof onImport === "function";
  const bundle = cache[fullPath]?.imported ?? [];
  if (!cache[fullPath]) {
    const opts = {
      debug: true,
      callbacks: {
        progress: {
          fetch: options.callbacks?.progress?.fetch,
          file: options.callbacks?.progress?.file
        }
      },
      bundler: "objecturl",
      filesystem: options.filesystem,
      nodeModules: options.nodeModules,
      relativeTo: options.relativeTo
    };
    const bundle2 = new tt(relPath, opts);
    const res = await bundle2.resolve();
    if (isFunc)
      onImport(bundle2);
    cache[fullPath] = bundle2;
    if (isJSON)
      cache[fullPath] = res?.default ?? {};
    else
      cache[fullPath] = res;
  } else if (isFunc)
    onImport(bundle);
  return isJSON ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath];
};
var get_default = get;

// ../common/utils/check.ts
var valid = (input, options, location) => {
  const errors = [];
  const isUndefined = options?.relativeTo === void 0;
  const isString = typeof input === "string";
  const isObject = typeof input === "object";
  let error;
  if (isString) {
    const hasRelTo = !isUndefined && "relativeTo" in options;
    if (!hasRelTo && !options._remote) {
      if (import.meta.url) {
        error = { message: "Not a valid relativeTo key (required) in options", file: input };
        console.warn(`[wasl-${location}] Import Mode Error: Please pass a valid string to options.relativeTo (ideally import.meta.url).`);
      } else {
        error = { message: "import.meta.url is not supported", file: input };
        console.warn(`[wasl-${location}] Import Mode Error: import.meta.url is not available. Does your bundler support it?`);
      }
    }
  } else if (!isObject) {
    error = { message: "Not a valid object passed in the first argument", file: null };
    console.warn(`[wasl-${location}] Reference Mode Error: Please pass a valid object in the first argument and pass file object references via the options.filesystem field.`);
  }
  if (error) {
    error.function = location;
    errors.push(error);
  }
  return errors;
};

// utils.ts
var merge = (main, override) => {
  const copy = Object.assign({}, main);
  if (override) {
    const keys = Object.keys(copy);
    const newKeys = new Set(Object.keys(override));
    keys.forEach((k2) => {
      if (k2 === "channels")
        copy[k2] = Object.assign({}, copy[k2]);
      newKeys.delete(k2);
      if (typeof override[k2] === "object" && !Array.isArray(override[k2])) {
        if (typeof copy[k2] === "object")
          copy[k2] = merge(copy[k2], override[k2]);
        else
          copy[k2] = override[k2];
      } else if (k2 in override)
        copy[k2] = override[k2];
    });
    newKeys.forEach((k2) => {
      copy[k2] = override[k2];
    });
  }
  return copy;
};
var checkFiles = (key, filesystem) => {
  const isJSON = suffix(key).slice(-4) === "json" ? true : false;
  const output = isJSON && filesystem[key] ? JSON.parse(JSON.stringify(filesystem[key])) : filesystem[key];
  return output;
};
var remove = (original, search, key = original, o, message) => {
  if (message)
    console.error(message);
  else
    console.error(`Source was not ${original ? `resolved for ${original}` : `specified for ${key}`}. ${search ? `If available, refer to this object directly as options.filesystem["${search}"]. ` : ""}${o ? `Automatically removing ${key} from the WASL file.` : ""}`);
  if (o)
    delete o[key];
};

// html.ts
function from(element, options) {
  options.parentNode = element;
  const ref = { components: {} };
  const toIgnore = ["id"];
  const drill = (el, ref2) => {
    if (ref2.components) {
      for (let child of el.children) {
        const childRef = ref2.components[child.id] = { element: child };
        if (child.children.length > 0)
          childRef.components = {};
        for (let attribute of child.attributes) {
          if (!toIgnore.includes(attribute.name)) {
            const split = attribute.name.split(".");
            let target = childRef;
            split.forEach((substr, i) => {
              substr = substr.split("-").map((str, i2) => {
                if (i2 > 0)
                  return str[0].toUpperCase() + str.slice(1);
                else
                  return str;
              }).join("");
              if (i === split.length - 1) {
                const val = attribute.value;
                if (val !== "") {
                  if (!isNaN(val))
                    target[substr] = Number(val);
                  else
                    target[substr] = val;
                } else
                  target[substr] = true;
              } else {
                if (!target[substr])
                  target[substr] = {};
                target = target[substr];
              }
            });
          }
        }
        drill(child, childRef);
      }
    }
  };
  drill(element, ref);
  return ref;
}

// ../../node_modules/es-plugins/dist/index.esm.js
function parseFunctionFromText(method = "") {
  let getFunctionBody = (methodString) => {
    return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, "$2$3$4");
  };
  let getFunctionHead = (methodString) => {
    let startindex = methodString.indexOf("=>") + 1;
    if (startindex <= 0) {
      startindex = methodString.indexOf("){");
    }
    if (startindex <= 0) {
      startindex = methodString.indexOf(") {");
    }
    return methodString.slice(0, methodString.indexOf("{", startindex) + 1);
  };
  let newFuncHead = getFunctionHead(method);
  let newFuncBody = getFunctionBody(method);
  let newFunc;
  if (newFuncHead.includes("function")) {
    let varName = newFuncHead.split("(")[1].split(")")[0];
    newFunc = new Function(varName, newFuncBody);
  } else {
    if (newFuncHead.substring(0, 6) === newFuncBody.substring(0, 6)) {
      let varName = newFuncHead.split("(")[1].split(")")[0];
      newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf("{") + 1, newFuncBody.length - 1));
    } else {
      try {
        newFunc = (0, eval)(newFuncHead + newFuncBody + "}");
      } catch {
      }
    }
  }
  return newFunc;
}
var EventHandler = class {
  constructor() {
    this.pushToState = {};
    this.data = {};
    this.triggers = {};
    this.setState = (updateObj) => {
      Object.assign(this.data, updateObj);
      for (const prop of Object.getOwnPropertyNames(updateObj)) {
        if (this.triggers[prop])
          this.triggers[prop].forEach((obj) => obj.onchange(this.data[prop]));
      }
      return this.data;
    };
    this.subscribeTrigger = (key, onchange) => {
      if (key) {
        if (!this.triggers[key]) {
          this.triggers[key] = [];
        }
        let l = this.triggers[key].length;
        this.triggers[key].push({ idx: l, onchange });
        return this.triggers[key].length - 1;
      } else
        return void 0;
    };
    this.unsubscribeTrigger = (key, sub) => {
      let triggers = this.triggers[key];
      if (triggers) {
        if (!sub)
          delete this.triggers[key];
        else {
          let idx = void 0;
          let obj = triggers.find((o, i) => {
            if (o.idx === sub) {
              idx = i;
              return true;
            }
          });
          if (obj)
            triggers.splice(idx, 1);
          return true;
        }
      }
    };
    this.subscribeTriggerOnce = (key, onchange) => {
      let sub;
      let changed = (value) => {
        onchange(value);
        this.unsubscribeTrigger(key, sub);
      };
      sub = this.subscribeTrigger(key, changed);
    };
  }
};
var state = new EventHandler();
function addLocalState(props) {
  if (!this._state)
    this._state = {};
  for (let k2 in props) {
    if (k2 === "_state" || k2 === "graph")
      continue;
    else {
      this._state[k2] = props[k2];
      if (k2 in this)
        this[k2] = props[k2];
      else
        Object.defineProperty(this, k2, {
          get: () => {
            this._state[k2];
          },
          set: (v2) => {
            this._state[k2] = v2;
            if (this.state.triggers[this._unique])
              this.setState({ [this._unique]: this._state });
          },
          enumerable: true,
          configurable: true
        });
    }
  }
}
var GraphNode = class {
  constructor(properties = {}, parent, graph) {
    this.nodes = /* @__PURE__ */ new Map();
    this._initial = {};
    this._unique = `${Math.random()}`;
    this.state = state;
    this.isLooping = false;
    this.isAnimating = false;
    this.looper = void 0;
    this.animation = void 0;
    this.forward = true;
    this.backward = false;
    this.reactive = false;
    this.runSync = false;
    this.firstRun = true;
    this.DEBUGNODE = false;
    this.addLocalState = addLocalState;
    this.operator = (...args) => {
      return args;
    };
    this.runOp = (...args) => {
      if (this.DEBUGNODE)
        console.time(this.tag);
      let result = this.operator(...args);
      if (result instanceof Promise) {
        result.then((res) => {
          if (res !== void 0)
            this.setState({ [this.tag]: res });
          if (this.DEBUGNODE) {
            console.timeEnd(this.tag);
            if (result !== void 0)
              console.log(`${this.tag} result:`, result);
          }
          ;
          return res;
        });
      } else {
        if (result !== void 0)
          this.setState({ [this.tag]: result });
        if (this.DEBUGNODE) {
          console.timeEnd(this.tag);
          if (result !== void 0)
            console.log(`${this.tag} result:`, result);
        }
        ;
      }
      return result;
    };
    this.setOperator = (operator) => {
      if (typeof operator !== "function")
        return operator;
      this.operator = operator.bind(this);
      return operator;
    };
    this.runAsync = (...args) => {
      return new Promise((res, rej) => {
        res(this.run(...args));
      });
    };
    this.transformArgs = (args = []) => args;
    this.isRunSync = () => {
      return !(this.children && this.forward || this.parent && this.backward || this.repeat || this.delay || this.frame || this.recursive || this.branch);
    };
    this.run = (...args) => {
      if (typeof this.transformArgs === "function")
        args = this.transformArgs(args, this);
      if (this.firstRun) {
        this.firstRun = false;
        this.runSync = this.isRunSync();
        if (this.animate && !this.isAnimating) {
          this.runAnimation(this.animation, args);
        }
        if (this.loop && typeof this.loop === "number" && !this.isLooping) {
          this.runLoop(this.looper, args);
        }
        if (this.loop || this.animate)
          return;
      }
      if (this.runSync) {
        let res = this.runOp(...args);
        return res;
      }
      return new Promise(async (resolve) => {
        if (this) {
          let run = (node, tick = 0, ...input) => {
            return new Promise(async (r) => {
              tick++;
              let res = await node.runOp(...input);
              if (node.repeat) {
                while (tick < node.repeat) {
                  if (node.delay) {
                    setTimeout(async () => {
                      r(await run(node, tick, ...input));
                    }, node.delay);
                    break;
                  } else if (node.frame && window?.requestAnimationFrame) {
                    requestAnimationFrame(async () => {
                      r(await run(node, tick, ...input));
                    });
                    break;
                  } else
                    res = await node.runOp(...input);
                  tick++;
                }
                if (tick === node.repeat) {
                  r(res);
                  return;
                }
              } else if (node.recursive) {
                while (tick < node.recursive) {
                  if (node.delay) {
                    setTimeout(async () => {
                      r(await run(node, tick, ...res));
                    }, node.delay);
                    break;
                  } else if (node.frame && window?.requestAnimationFrame) {
                    requestAnimationFrame(async () => {
                      r(await run(node, tick, ...res));
                    });
                    break;
                  } else
                    res = await node.runOp(...res);
                  tick++;
                }
                if (tick === node.recursive) {
                  r(res);
                  return;
                }
              } else {
                r(res);
                return;
              }
            });
          };
          let runnode = async () => {
            let res = await run(this, void 0, ...args);
            if (res !== void 0) {
              if (this.backward && this.parent instanceof GraphNode) {
                if (Array.isArray(res))
                  await this.runParent(this, ...res);
                else
                  await this.runParent(this, res);
              }
              if (this.children && this.forward) {
                if (Array.isArray(res))
                  await this.runChildren(this, ...res);
                else
                  await this.runChildren(this, res);
              }
              if (this.branch) {
                this.runBranch(this, res);
              }
            }
            return res;
          };
          if (this.delay) {
            setTimeout(async () => {
              resolve(await runnode());
            }, this.delay);
          } else if (this.frame && window?.requestAnimationFrame) {
            requestAnimationFrame(async () => {
              resolve(await runnode());
            });
          } else {
            resolve(await runnode());
          }
        } else
          resolve(void 0);
      });
    };
    this.runParent = async (n, ...args) => {
      if (n.backward && n.parent) {
        if (typeof n.parent === "string") {
          if (n.graph && n.graph?.get(n.parent)) {
            n.parent = n.graph;
            if (n.parent)
              this.nodes.set(n.parent.tag, n.parent);
          } else
            n.parent = this.nodes.get(n.parent);
        }
        if (n.parent instanceof GraphNode)
          await n.parent.run(...args);
      }
    };
    this.runChildren = async (n, ...args) => {
      if (typeof n.children === "object") {
        for (const key in n.children) {
          if (typeof n.children[key] === "string") {
            if (n.graph && n.graph?.get(n.children[key])) {
              n.children[key] = n.graph.get(n.children[key]);
              if (!n.nodes.get(n.children[key].tag))
                n.nodes.set(n.children[key].tag, n.children[key]);
            }
            if (!n.children[key] && n.nodes.get(n.children[key]))
              n.children[key] = n.nodes.get(n.children[key]);
          } else if (typeof n.children[key] === "undefined" || n.children[key] === true) {
            if (n.graph && n.graph?.get(key)) {
              n.children[key] = n.graph.get(key);
              if (!n.nodes.get(n.children[key].tag))
                n.nodes.set(n.children[key].tag, n.children[key]);
            }
            if (!n.children[key] && n.nodes.get(key))
              n.children[key] = n.nodes.get(key);
          }
          if (n.children[key]?.runOp)
            await n.children[key].run(...args);
        }
      }
    };
    this.runBranch = async (n, output) => {
      if (n.branch) {
        let keys = Object.keys(n.branch);
        await Promise.all(keys.map(async (k2) => {
          if (typeof n.branch[k2].if === "object")
            n.branch[k2].if = stringifyFast(n.branch[k2].if);
          let pass = false;
          if (typeof n.branch[k2].if === "function") {
            pass = n.branch[k2].if(output);
          } else {
            if (typeof output === "object") {
              if (stringifyFast(output) === n.branch[k2].if)
                pass = true;
            } else if (output === n.branch[k2].if)
              pass = true;
          }
          if (pass) {
            if (n.branch[k2].then.run) {
              if (Array.isArray(output))
                await n.branch[k2].then.run(...output);
              else
                await n.branch[k2].then.run(...output);
            } else if (typeof n.branch[k2].then === "function") {
              if (Array.isArray(output))
                await n.branch[k2].then(...output);
              else
                await n.branch[k2].then(output);
            } else if (typeof n.branch[k2].then === "string") {
              if (n.graph)
                n.branch[k2].then = n.graph.nodes.get(n.branch[k2].then);
              else
                n.branch[k2].then = n.nodes.get(n.branch[k2].then);
              if (n.branch[k2].then.run) {
                if (Array.isArray(output))
                  await n.branch[k2].then.run(...output);
                else
                  await n.branch[k2].then.run(...output);
              }
            }
          }
          return pass;
        }));
      }
    };
    this.runAnimation = (animation = this.animation, args = []) => {
      this.animation = animation;
      if (!animation)
        this.animation = this.operator;
      if (this.animate && !this.isAnimating && "requestAnimationFrame" in window) {
        this.isAnimating = true;
        let anim = async () => {
          if (this.isAnimating) {
            if (this.DEBUGNODE)
              console.time(this.tag);
            let result = this.animation.call(this, ...args);
            if (result instanceof Promise) {
              result = await result;
            }
            if (this.DEBUGNODE) {
              console.timeEnd(this.tag);
              if (result !== void 0)
                console.log(`${this.tag} result:`, result);
            }
            ;
            if (result !== void 0) {
              if (this.tag)
                this.setState({ [this.tag]: result });
              if (this.backward && this.parent?.run) {
                if (Array.isArray(result))
                  await this.runParent(this, ...result);
                else
                  await this.runParent(this, result);
              }
              if (this.children && this.forward) {
                if (Array.isArray(result))
                  await this.runChildren(this, ...result);
                else
                  await this.runChildren(this, result);
              }
              if (this.branch) {
                this.runBranch(this, result);
              }
              this.setState({ [this.tag]: result });
            }
            requestAnimationFrame(anim);
          }
        };
        requestAnimationFrame(anim);
      }
    };
    this.runLoop = (loop = this.looper, args = [], timeout = this.loop) => {
      this.looper = loop;
      if (!loop)
        this.looper = this.operator;
      if (typeof timeout === "number" && !this.isLooping) {
        this.isLooping = true;
        let looping = async () => {
          if (this.isLooping) {
            if (this.DEBUGNODE)
              console.time(this.tag);
            let result = this.looper.call(this, ...args);
            if (result instanceof Promise) {
              result = await result;
            }
            if (this.DEBUGNODE) {
              console.timeEnd(this.tag);
              if (result !== void 0)
                console.log(`${this.tag} result:`, result);
            }
            ;
            if (result !== void 0) {
              if (this.tag)
                this.setState({ [this.tag]: result });
              if (this.backward && this.parent?.run) {
                if (Array.isArray(result))
                  await this.runParent(this, ...result);
                else
                  await this.runParent(this, result);
              }
              if (this.children && this.forward) {
                if (Array.isArray(result))
                  await this.runChildren(this, ...result);
                else
                  await this.runChildren(this, result);
              }
              if (this.branch) {
                this.runBranch(this, result);
              }
              this.setState({ [this.tag]: result });
            }
            setTimeout(async () => {
              await looping();
            }, timeout);
          }
        };
        looping();
      }
    };
    this.setParent = (parent2) => {
      this.parent = parent2;
      if (this.backward)
        this.runSync = false;
    };
    this.setChildren = (children) => {
      this.children = children;
      if (this.forward)
        this.runSync = false;
    };
    this.add = (n = {}) => {
      if (typeof n === "function")
        n = { operator: n };
      if (n?.node instanceof GraphNode)
        n = n.node;
      if (!(n instanceof GraphNode))
        n = new GraphNode(n.node ?? n, this, this.graph);
      this.nodes.set(n.tag, n);
      if (this.graph) {
        this.graph.nodes.set(n.tag, n);
        this.graph.nNodes = this.graph.nodes.size;
      }
      return n;
    };
    this.remove = (n) => {
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n?.tag) {
        this.nodes.delete(n.tag);
        if (this.children[n.tag])
          delete this.children[n.tag];
        if (this.graph) {
          this.graph.nodes.delete(n.tag);
          this.graph.nNodes = this.graph.nodes.size;
        }
        this.nodes.forEach((n2) => {
          if (n2.nodes.get(n2.tag)) {
            n2.nodes.delete(n2.tag);
            if (n2.children[n2.tag])
              delete n2.children[n2.tag];
            if (n2.parent?.tag === n2.tag)
              delete n2.parent;
          }
        });
        if (n.ondelete)
          n.ondelete(n);
      }
      if (typeof this._state === "object") {
        this.state.unsubscribeTrigger(this._unique);
      }
    };
    this.append = (n, parentNode = this) => {
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n?.nodes) {
        parentNode.addChildren(n);
        if (n.forward)
          n.runSync = false;
      }
    };
    this.subscribe = (callback, tag = this.tag) => {
      if (typeof callback === "string") {
        if (this.graph)
          callback = this.graph.get(callback);
        else
          callback = this.nodes.get(callback);
      }
      if (typeof callback === "function") {
        return this.state.subscribeTrigger(tag, callback);
      } else if (callback)
        return this.state.subscribeTrigger(tag, (res) => {
          callback.run(res);
        });
    };
    this.unsubscribe = (sub, tag = this.tag) => {
      return this.state.unsubscribeTrigger(tag, sub);
    };
    this.subscribeState = (callback) => {
      if (!this.reactive) {
        return void 0;
      } else {
        if (typeof callback === "string") {
          if (this.graph)
            callback = this.graph.get(callback);
          else
            callback = this.nodes.get(callback);
        }
        if (typeof callback === "function") {
          return this.state.subscribeTrigger(this._unique, callback);
        } else if (callback)
          return this.state.subscribeTrigger(this._unique, (_state) => {
            callback.run(_state);
          });
      }
    };
    this.addChildren = (children) => {
      if (!this.children)
        this.children = {};
      if (typeof children === "object") {
        Object.assign(this.children, children);
      }
      this.convertChildrenToNodes();
      if (this.forward)
        this.runSync = false;
    };
    this.callParent = (...args) => {
      if (typeof this.parent === "string") {
        if (this.graph && this.graph?.get(this.parent)) {
          this.parent = this.graph;
          if (this.parent)
            this.nodes.set(this.parent.tag, this.parent);
        } else
          this.parent = this.nodes.get(this.parent);
      }
      if (typeof this.parent?.operator === "function")
        return this.parent.runOp(...args);
    };
    this.callChildren = (...args) => {
      let result;
      if (typeof this.children === "object") {
        for (const key in this.children) {
          if (this.children[key]?.runOp)
            this.children[key].runOp(...args);
        }
      }
      return result;
    };
    this.getProps = (n = this, getInitial = true) => {
      let baseprops = {
        tag: n.tag,
        operator: n.operator,
        graph: n.graph,
        children: n.children,
        parent: n.parent,
        forward: n.forward,
        backward: n.bacward,
        loop: n.loop,
        animate: n.animate,
        frame: n.frame,
        delay: n.delay,
        recursive: n.recursive,
        repeat: n.repeat,
        branch: n.branch,
        oncreate: n.oncreate,
        reactive: n.reactive,
        DEBUGNODE: n.DEBUGNODE
      };
      if (!getInitial) {
        let uniqueprops = {};
        for (const key in this._initial) {
          uniqueprops[key] = this[key];
        }
        return Object.assign(baseprops, uniqueprops);
      } else
        return {
          tag: n.tag,
          operator: n.operator,
          graph: n.graph,
          children: n.children,
          parent: n.parent,
          forward: n.forward,
          backward: n.bacward,
          loop: n.loop,
          animate: n.animate,
          frame: n.frame,
          delay: n.delay,
          recursive: n.recursive,
          repeat: n.repeat,
          branch: n.branch,
          oncreate: n.oncreate,
          reactive: n.reactive,
          DEBUGNODE: n.DEBUGNODE,
          ...this._initial
        };
    };
    this.setProps = (props = {}) => {
      let tmp = Object.assign({}, props);
      if (tmp.children) {
        this.addChildren(props.children);
        delete tmp.children;
      }
      if (tmp.operator) {
        this.setOperator(props.operator);
        delete tmp.operator;
      }
      Object.assign(tmp, props);
      this.runSync = this.isRunSync();
    };
    this.removeTree = (n) => {
      if (n) {
        if (typeof n === "string")
          n = this.nodes.get(n);
      }
      if (n?.nodes) {
        let checked = {};
        const recursivelyRemove = (node) => {
          if (typeof node.children === "object" && !checked[node.tag]) {
            checked[node.tag] = true;
            for (const key in node.children) {
              if (node.children[key].stopNode)
                node.children[key].stopNode();
              if (node.children[key].tag) {
                if (this.nodes.get(node.children[key].tag))
                  this.nodes.delete(node.children[key].tag);
                this.nodes.forEach((n2) => {
                  if (n2.nodes.get(node.children[key].tag))
                    n2.nodes.delete(node.children[key].tag);
                  if (n2.children?.[key] instanceof GraphNode)
                    delete n2.children[key];
                });
                if (node.children[key].ondelete && !this.graph)
                  node.children[key].ondelete(node.children[key]);
                recursivelyRemove(node.children[key]);
              }
            }
          }
        };
        if (n.stopNode)
          n.stopNode();
        if (n.tag) {
          this.nodes.delete(n.tag);
          if (this.children?.[n.tag])
            delete this.children[n.tag];
          if (this.parent?.tag === n.tag)
            delete this.parent;
          if (this[n.tag] instanceof GraphNode)
            delete this[n.tag];
          this.nodes.forEach((n2) => {
            if (n2?.tag) {
              if (n2.nodes.get(n2.tag))
                n2.nodes.delete(n2.tag);
              if (n2.children?.[n2.tag] instanceof GraphNode)
                delete n2.children[n2.tag];
            }
          });
          recursivelyRemove(n);
          if (this.graph)
            this.graph.removeTree(n, checked);
          else if (n.ondelete)
            n.ondelete(n);
        }
      }
    };
    this.checkNodesHaveChildMapped = (n, child, checked = {}) => {
      let tag = n.tag;
      if (!tag)
        tag = n.name;
      if (!checked[tag]) {
        checked[tag] = true;
        if (n.children) {
          if (child.tag in n.children) {
            if (n.children[child.tag] instanceof GraphNode) {
              if (!n.nodes.get(child.tag))
                n.nodes.set(child.tag, child);
              n.children[child.tag] = child;
              if (!n.firstRun)
                n.firstRun = true;
            }
          }
        }
        if (n.parent instanceof GraphNode) {
          if (n.nodes.get(child.tag))
            n.parent.nodes.set(child.tag, child);
          if (n.parent.children) {
            this.checkNodesHaveChildMapped(n.parent, child, checked);
          } else if (n.nodes) {
            n.nodes.forEach((n2) => {
              if (!checked[n2.tag]) {
                this.checkNodesHaveChildMapped(n2, child, checked);
              }
            });
          }
        }
        if (n.graph) {
          if (n.parent && n.parent.name !== n.graph.name) {
            n.graph.nodes.forEach((n2) => {
              if (!checked[n2.tag]) {
                this.checkNodesHaveChildMapped(n2, child, checked);
              }
            });
          }
        }
      }
    };
    this.convertChildrenToNodes = (n = this) => {
      if (n?.children) {
        for (const key in n.children) {
          if (!(n.children[key] instanceof GraphNode)) {
            if (typeof n.children[key] === "object") {
              if (!n.children[key].tag)
                n.children[key].tag = key;
              if (!n.nodes.get(n.children[key].tag)) {
                n.children[key] = new GraphNode(n.children[key], n, n.graph);
                this.checkNodesHaveChildMapped(n, n.children[key]);
              }
            } else {
              if (typeof n.children[key] === "undefined" || n.children[key] == true) {
                n.children[key] = n.graph.get(key);
                if (!n.children[key])
                  n.children[key] = n.nodes.get(key);
              } else if (typeof n.children[key] === "string") {
                let k2 = n.children[key];
                n.children[key] = n.graph.get(k2);
                if (!n.children[key])
                  n.children[key] = n.nodes.get(key);
              }
              if (n.children[key] instanceof GraphNode) {
                n.nodes.set(n.children[key].tag, n.children[key]);
                this.checkNodesHaveChildMapped(n, n.children[key]);
                if (!(n.children[key].tag in n))
                  n[n.children[key].tag] = n.children[key];
              }
            }
          }
        }
      }
      return n.children;
    };
    this.stopLooping = (n = this) => {
      n.isLooping = false;
    };
    this.stopAnimating = (n = this) => {
      n.isAnimating = false;
    };
    this.stopNode = (n = this) => {
      n.stopAnimating(n);
      n.stopLooping(n);
    };
    this.subscribeNode = (n) => {
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n.tag)
        this.nodes.set(n.tag, n);
      if (n)
        return this.state.subscribeTrigger(this.tag, (res) => {
          if (Array.isArray(res))
            n.run(...res);
          else
            n.run(res);
        });
    };
    this.print = (n = this, printChildren = true, nodesPrinted = []) => {
      let dummyNode = new GraphNode();
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n instanceof GraphNode) {
        nodesPrinted.push(n.tag);
        let jsonToPrint = {
          tag: n.tag,
          operator: n.operator.toString()
        };
        if (n.parent)
          jsonToPrint.parent = n.parent.tag;
        if (typeof n.children === "object") {
          for (const key in n.children) {
            if (typeof n.children[key] === "string")
              return n.children[key];
            if (nodesPrinted.includes(n.children[key].tag))
              return n.children[key].tag;
            else if (!printChildren) {
              return n.children[key].tag;
            } else
              return n.children[key].print(n.children[key], printChildren, nodesPrinted);
          }
        }
        for (const prop in n) {
          if (prop === "parent" || prop === "children")
            continue;
          if (typeof dummyNode[prop] === "undefined") {
            if (typeof n[prop] === "function") {
              jsonToPrint[prop] = n[prop].toString();
            } else if (typeof n[prop] === "object") {
              jsonToPrint[prop] = JSON.stringifyWithCircularRefs(n[prop]);
            } else {
              jsonToPrint[prop] = n[prop];
            }
          }
        }
        return JSON.stringify(jsonToPrint);
      }
    };
    this.reconstruct = (json) => {
      let parsed = reconstructObject(json);
      if (parsed)
        return this.add(parsed);
    };
    this.setState = (data) => {
      this.state.setState(data);
    };
    this.DEBUGNODES = (debugging = true) => {
      this.DEBUGNODE = debugging;
      this.nodes.forEach((n) => {
        if (debugging)
          n.DEBUGNODE = true;
        else
          n.DEBUGNODE = false;
      });
    };
    if (typeof properties === "function") {
      properties = { operator: properties };
    }
    if (typeof properties === "object") {
      if (properties instanceof GraphNode && properties._initial)
        Object.assign(properties, properties._initial);
      if (properties instanceof Graph) {
        let source = properties;
        properties = {
          source,
          operator: (input) => {
            if (typeof input === "object") {
              let result = {};
              for (const key in input) {
                if (typeof source[key] === "function") {
                  if (Array.isArray(input[key]))
                    result[key] = source[key](...input[key]);
                  else
                    result[key] = source[key](input[key]);
                } else {
                  source[key] = input[key];
                  result[key] = source[key];
                }
              }
              return result;
            }
            return source;
          }
        };
        if (source.operator)
          properties.operator = source.operator;
        if (source.children)
          properties.children = source.children;
        if (source.forward)
          properties.forward = source.forward;
        if (source.backward)
          properties.backward = source.backward;
        if (source.repeat)
          properties.repeat = source.repeat;
        if (source.recursive)
          properties.recursive = source.recursive;
        if (source.loop)
          properties.loop = source.loop;
        if (source.animate)
          properties.animate = source.animate;
        if (source.looper)
          properties.looper = source.looper;
        if (source.animation)
          properties.animation = source.animation;
        if (source.delay)
          properties.delay = source.delay;
        if (source.oncreate)
          properties.oncreate = source.oncreate;
        if (source.node) {
          if (source.node._initial)
            Object.assign(properties, source.node._initial);
        }
        if (source._initial)
          Object.assign(properties, source._initial);
        if (source.tag)
          properties.tag = source.tag;
        this.nodes = source.nodes;
        source.node = this;
        if (graph) {
          source.nodes.forEach((n) => {
            if (!graph.nodes.get(n.tag)) {
              graph.nodes.set(n.tag, n);
              graph.nNodes++;
            }
          });
        }
      }
      if (typeof parent === "string") {
        if (graph)
          parent = graph.nodes.get(parent);
        else
          parent = void 0;
      }
      if (properties.tag && (graph || parent)) {
        let hasnode;
        if (graph?.nodes) {
          hasnode = graph.nodes.get(properties.tag);
        }
        if (!hasnode && parent?.nodes) {
          hasnode = parent.nodes.get(properties.tag);
        }
        if (hasnode) {
          if (this.reactive) {
            this.addLocalState(hasnode);
          }
          if (!this.source)
            this.source = hasnode;
          let props = hasnode.getProps();
          delete props.graph;
          delete props.parent;
          for (let k2 in props) {
            const desc = Object.getOwnPropertyDescriptor(properties, k2);
            if (desc && desc.get && !desc.set)
              properties = Object.assign({}, properties);
            else
              properties[k2] = props[k2];
          }
        }
      }
      if (properties?.operator) {
        properties.operator = this.setOperator(properties.operator);
      }
      if (!properties.tag && graph) {
        properties.tag = `node${graph.nNodes}`;
      } else if (!properties.tag) {
        properties.tag = `node${Math.floor(Math.random() * 1e10)}`;
      }
      let keys = Object.getOwnPropertyNames(this);
      for (const key in properties) {
        if (!keys.includes(key))
          this._initial[key] = properties[key];
      }
      if (properties.children)
        this._initial.children = Object.assign({}, properties.children);
      Object.assign(this, properties);
      if (!this.tag) {
        if (graph) {
          this.tag = `node${graph.nNodes}`;
        } else {
          this.tag = `node${Math.floor(Math.random() * 1e10)}`;
        }
      }
      if (graph) {
        this.graph = graph;
        if (graph.nodes.get(this.tag)) {
          this.tag = `${this.tag}${graph.nNodes + 1}`;
        }
        graph.nodes.set(this.tag, this);
        graph.nNodes++;
        this.state = graph.state;
      }
      if (this.reactive) {
        addLocalState(properties);
        if (typeof this.reactive === "function") {
          this.state.subscribeTrigger(this._unique, this.reactive);
        }
      }
      if (typeof parent === "object") {
        this.parent = parent;
        if (parent instanceof GraphNode || parent instanceof Graph)
          parent.nodes.set(this.tag, this);
      }
      if (typeof properties.tree === "object") {
        for (const key in properties.tree) {
          if (typeof properties.tree[key] === "object") {
            if ((!properties.tree[key]).tag) {
              properties.tree[key].tag = key;
            }
          }
          let node = new GraphNode(properties.tree[key], this, graph);
          this.nodes.set(node.tag, node);
        }
      }
      if (this.children)
        this.convertChildrenToNodes(this);
      if (this.parent instanceof GraphNode || this.parent instanceof Graph)
        this.checkNodesHaveChildMapped(this.parent, this);
      if (typeof this.oncreate === "function")
        this.oncreate(this);
      if (!this.firstRun)
        this.firstRun = true;
      if (this.animation && !this.animate)
        this.animate = true;
    } else
      return properties;
  }
};
var Graph = class {
  constructor(tree, tag, props) {
    this.nNodes = 0;
    this.nodes = /* @__PURE__ */ new Map();
    this.state = new EventHandler();
    this._unique = `${Math.random()}`;
    this.tree = {};
    this.addLocalState = addLocalState;
    this.add = (n = {}) => {
      if (n?.node instanceof GraphNode)
        n = n.node;
      let props2 = n;
      if (!(n instanceof GraphNode))
        n = new GraphNode(props2?.node ?? props2, this, this);
      else {
        this.nNodes = this.nodes.size;
        if (n.tag) {
          this.tree[n.tag] = props2;
          this.nodes.set(n.tag, n);
        }
      }
      return n;
    };
    this.setTree = (tree2 = this.tree) => {
      if (!tree2)
        return;
      for (const node in tree2) {
        const n = this.nodes.get(node);
        if (!n) {
          if (typeof tree2[node] === "function") {
            this.add({ tag: node, operator: tree2[node] });
          } else if (typeof tree2[node] === "object" && !Array.isArray(tree2[node])) {
            if (!tree2[node].tag)
              tree2[node].tag = node;
            let newNode = this.add(tree2[node]);
            if (tree2[node].aliases) {
              tree2[node].aliases.forEach((a) => {
                this.nodes.set(a, newNode);
              });
            }
          } else {
            this.add({ tag: node, operator: (...args) => {
              return tree2[node];
            } });
          }
        } else {
          if (typeof tree2[node] === "function") {
            n.setOperator(tree2[node]);
          } else if (typeof tree2[node] === "object") {
            if (tree2[node] instanceof GraphNode) {
              this.add(tree2[node]);
            } else if (tree2[node] instanceof Graph) {
              let source = tree2[node];
              let properties = {};
              if (source.operator)
                properties.operator = source.operator;
              if (source.children)
                properties.children = source.children;
              if (source.forward)
                properties.forward = source.forward;
              if (source.backward)
                properties.backward = source.backward;
              if (source.repeat)
                properties.repeat = source.repeat;
              if (source.recursive)
                properties.recursive = source.recursive;
              if (source.loop)
                properties.loop = source.loop;
              if (source.animate)
                properties.animate = source.animate;
              if (source.looper)
                properties.looper = source.looper;
              if (source.animation)
                properties.animation = source.animation;
              if (source.delay)
                properties.delay = source.delay;
              if (source.tag)
                properties.tag = source.tag;
              if (source.oncreate)
                properties.oncreate = source.oncreate;
              if (source.node?._initial)
                Object.assign(properties, source.node._initial);
              properties.nodes = source.nodes;
              properties.source = source;
              n.setProps(properties);
            } else {
              n.setProps(tree2[node]);
            }
          }
        }
      }
      this.nodes.forEach((node) => {
        if (typeof node.children === "object") {
          for (const key in node.children) {
            if (typeof node.children[key] === "string") {
              if (this.nodes.get(node.children[key])) {
                node.children[key] = this.nodes.get(node.children[key]);
              }
            } else if (node.children[key] === true || typeof node.children[key] === "undefined") {
              if (this.nodes.get(key)) {
                node.children[key] = this.nodes.get(key);
              }
            }
            if (node.children[key] instanceof GraphNode) {
              node.checkNodesHaveChildMapped(node, node.children[key]);
            }
          }
        }
        if (typeof node.parent === "string") {
          if (this.nodes.get(node.parent)) {
            node.parent = this.nodes.get(node.parent);
            node.nodes.set(node.parent.tag, node.parent);
          }
        }
      });
    };
    this.get = (tag2) => {
      return this.nodes.get(tag2);
    };
    this.set = (n) => {
      return this.nodes.set(n.tag, n);
    };
    this.run = (n, ...args) => {
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n?.run)
        return n.run(...args);
      else
        return void 0;
    };
    this.runAsync = (n, ...args) => {
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n?.run)
        return new Promise((res, rej) => {
          res(n.run(...args));
        });
      else
        return new Promise((res, rej) => {
          res(void 0);
        });
    };
    this.removeTree = (n, checked) => {
      if (n) {
        if (typeof n === "string")
          n = this.nodes.get(n);
      }
      if (n?.nodes) {
        let checked2 = {};
        const recursivelyRemove = (node) => {
          if (typeof node.children === "object" && !checked2[node.tag]) {
            checked2[node.tag] = true;
            for (const key in node.children) {
              if (node.children[key]?.stopNode)
                node.children[key].stopNode();
              if (node.children[key]?.tag) {
                if (this.nodes.get(node.children[key].tag))
                  this.nodes.delete(node.children[key].tag);
                this.nodes.forEach((n2) => {
                  if (n2.nodes.get(node.children[key].tag))
                    n2.nodes.delete(node.children[key].tag);
                  if (n2.children?.[key] instanceof GraphNode)
                    delete n2.children[key];
                });
                if (node.children[key].ondelete)
                  node.children[key].ondelete(node.children[key]);
                recursivelyRemove(node.children[key]);
              }
            }
          }
        };
        if (n.stopNode)
          n.stopNode();
        if (n.tag) {
          this.nodes.delete(n.tag);
          if (this.parent?.tag === n.tag)
            delete this.parent;
          if (this[n.tag] instanceof GraphNode)
            delete this[n.tag];
          this.nodes.forEach((n2) => {
            if (n2?.tag) {
              if (n2.nodes.get(n2.tag))
                n2.nodes.delete(n2.tag);
              if (n2.children?.[n2.tag] instanceof GraphNode)
                delete n2.children[n2.tag];
            }
          });
          recursivelyRemove(n);
          if (n.ondelete)
            n.ondelete(n);
        }
      }
    };
    this.remove = (n) => {
      if (typeof n === "string")
        n = this.nodes.get(n);
      if (n?.nodes) {
        if (n.stopNode)
          n.stopNode();
        if (n?.tag) {
          if (this.nodes.get(n.tag)) {
            this.nodes.delete(n.tag);
            this.nodes.forEach((n2) => {
              if (n2.nodes.get(n2.tag))
                n2.nodes.delete(n2.tag);
            });
          }
        }
        if (n.ondelete)
          n.ondelete(n);
      }
      return n;
    };
    this.append = (n, parentNode) => {
      parentNode.addChildren(n);
    };
    this.callParent = async (n, ...args) => {
      if (n?.parent) {
        return await n.callParent(...args);
      }
    };
    this.callChildren = async (n, ...args) => {
      if (n?.children) {
        return await n.callChildren(...args);
      }
    };
    this.subscribe = (n, callback) => {
      if (!callback)
        return;
      if (n?.subscribe && typeof callback === "function") {
        return n.subscribe(callback);
      } else if (callback instanceof GraphNode || typeof callback === "string")
        return this.subscribeNode(n, callback);
      else if (typeof n == "string") {
        return this.state.subscribeTrigger(n, callback);
      }
    };
    this.unsubscribe = (tag2, sub) => {
      return this.state.unsubscribeTrigger(tag2, sub);
    };
    this.subscribeState = (callback) => {
      if (!this.reactive) {
        return void 0;
      } else {
        if (typeof callback === "string") {
          if (this.graph)
            callback = this.graph.get(callback);
          else
            callback = this.nodes.get(callback);
        }
        if (typeof callback === "function") {
          return this.state.subscribeTrigger(this._unique, callback);
        } else if (callback)
          return this.state.subscribeTrigger(this._unique, (_state) => {
            callback.run(_state);
          });
      }
    };
    this.subscribeNode = (inputNode, outputNode) => {
      let tag2;
      if (inputNode?.tag)
        tag2 = inputNode.tag;
      else if (typeof inputNode === "string")
        tag2 = inputNode;
      if (typeof outputNode === "string")
        outputNode = this.nodes.get(outputNode);
      if (inputNode && outputNode) {
        let sub = this.state.subscribeTrigger(tag2, (res) => {
          if (Array.isArray(res))
            outputNode.run(...res);
          else
            outputNode.run(res);
        });
        return sub;
      }
    };
    this.stopNode = (n) => {
      if (typeof n === "string") {
        n = this.nodes.get(n);
      }
      if (n?.stopNode) {
        n.stopNode();
      }
    };
    this.print = (n, printChildren = true) => {
      if (n?.print)
        return n.print(n, printChildren);
      else {
        let printed = `{`;
        this.nodes.forEach((n2) => {
          printed += `
"${n2.tag}:${n2.print(n2, printChildren)}"`;
        });
        return printed;
      }
    };
    this.reconstruct = (json) => {
      let parsed = reconstructObject(json);
      if (parsed)
        return this.add(parsed);
    };
    this.create = (operator, parentNode, props2) => {
      return createNode(operator, parentNode, props2, this);
    };
    this.setState = (data) => {
      this.state.setState(data);
    };
    this.DEBUGNODES = (debugging = true) => {
      this.nodes.forEach((n) => {
        if (debugging)
          n.DEBUGNODE = true;
        else
          n.DEBUGNODE = false;
      });
    };
    this.tag = tag ? tag : `graph${Math.floor(Math.random() * 1e11)}`;
    if (props) {
      if (props.reactive) {
        this.addLocalState(props);
      } else
        Object.assign(this, props);
      this._initial = props;
    }
    if (tree || Object.keys(this.tree).length > 0)
      this.setTree(tree);
  }
};
function reconstructObject(json = "{}") {
  try {
    let parsed = typeof json === "string" ? JSON.parse(json) : json;
    const parseObj = (obj) => {
      for (const prop in obj) {
        if (typeof obj[prop] === "string") {
          let funcParsed = parseFunctionFromText(obj[prop]);
          if (typeof funcParsed === "function") {
            obj[prop] = funcParsed;
          }
        } else if (typeof obj[prop] === "object") {
          parseObj(obj[prop]);
        }
      }
      return obj;
    };
    return parseObj(parsed);
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
var stringifyWithCircularRefs = function() {
  const refs = /* @__PURE__ */ new Map();
  const parents = [];
  const path = ["this"];
  function clear() {
    refs.clear();
    parents.length = 0;
    path.length = 1;
  }
  function updateParents(key, value) {
    var idx = parents.length - 1;
    var prev = parents[idx];
    if (typeof prev === "object") {
      if (prev[key] === value || idx === 0) {
        path.push(key);
        parents.push(value.pushed);
      } else {
        while (idx-- >= 0) {
          prev = parents[idx];
          if (typeof prev === "object") {
            if (prev[key] === value) {
              idx += 2;
              parents.length = idx;
              path.length = idx;
              --idx;
              parents[idx] = value;
              path[idx] = key;
              break;
            }
          }
          idx--;
        }
      }
    }
  }
  function checkCircular(key, value) {
    if (value != null) {
      if (typeof value === "object") {
        if (key) {
          updateParents(key, value);
        }
        let other = refs.get(value);
        if (other) {
          return "[Circular Reference]" + other;
        } else {
          refs.set(value, path.join("."));
        }
      }
    }
    return value;
  }
  return function stringifyWithCircularRefs2(obj, space) {
    try {
      parents.push(obj);
      return JSON.stringify(obj, checkCircular, space);
    } finally {
      clear();
    }
  };
}();
if (JSON.stringifyWithCircularRefs === void 0) {
  JSON.stringifyWithCircularRefs = stringifyWithCircularRefs;
}
var stringifyFast = function() {
  const refs = /* @__PURE__ */ new Map();
  const parents = [];
  const path = ["this"];
  function clear() {
    refs.clear();
    parents.length = 0;
    path.length = 1;
  }
  function updateParents(key, value) {
    var idx = parents.length - 1;
    if (parents[idx]) {
      var prev = parents[idx];
      if (typeof prev === "object") {
        if (prev[key] === value || idx === 0) {
          path.push(key);
          parents.push(value.pushed);
        } else {
          while (idx-- >= 0) {
            prev = parents[idx];
            if (typeof prev === "object") {
              if (prev[key] === value) {
                idx += 2;
                parents.length = idx;
                path.length = idx;
                --idx;
                parents[idx] = value;
                path[idx] = key;
                break;
              }
            }
            idx++;
          }
        }
      }
    }
  }
  function checkValues(key, value) {
    let val;
    if (value != null) {
      if (typeof value === "object") {
        let c = value.constructor.name;
        if (key && c === "Object") {
          updateParents(key, value);
        }
        let other = refs.get(value);
        if (other) {
          return "[Circular Reference]" + other;
        } else {
          refs.set(value, path.join("."));
        }
        if (c === "Array") {
          if (value.length > 20) {
            val = value.slice(value.length - 20);
          } else
            val = value;
        } else if (c.includes("Set")) {
          val = Array.from(value);
        } else if (c !== "Object" && c !== "Number" && c !== "String" && c !== "Boolean") {
          val = "instanceof_" + c;
        } else if (c === "Object") {
          let obj = {};
          for (const prop in value) {
            if (value[prop] == null) {
              obj[prop] = value[prop];
            } else if (Array.isArray(value[prop])) {
              if (value[prop].length > 20)
                obj[prop] = value[prop].slice(value[prop].length - 20);
              else
                obj[prop] = value[prop];
            } else if (value[prop].constructor.name === "Object") {
              obj[prop] = {};
              for (const p2 in value[prop]) {
                if (Array.isArray(value[prop][p2])) {
                  if (value[prop][p2].length > 20)
                    obj[prop][p2] = value[prop][p2].slice(value[prop][p2].length - 20);
                  else
                    obj[prop][p2] = value[prop][p2];
                } else {
                  if (value[prop][p2] != null) {
                    let con = value[prop][p2].constructor.name;
                    if (con.includes("Set")) {
                      obj[prop][p2] = Array.from(value[prop][p2]);
                    } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                      obj[prop][p2] = "instanceof_" + con;
                    } else {
                      obj[prop][p2] = value[prop][p2];
                    }
                  } else {
                    obj[prop][p2] = value[prop][p2];
                  }
                }
              }
            } else {
              let con = value[prop].constructor.name;
              if (con.includes("Set")) {
                obj[prop] = Array.from(value[prop]);
              } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                obj[prop] = "instanceof_" + con;
              } else {
                obj[prop] = value[prop];
              }
            }
          }
          val = obj;
        } else {
          val = value;
        }
      } else {
        val = value;
      }
    }
    return val;
  }
  return function stringifyFast2(obj, space) {
    parents.push(obj);
    let res = JSON.stringify(obj, checkValues, space);
    clear();
    return res;
  };
}();
if (JSON.stringifyFast === void 0) {
  JSON.stringifyFast = stringifyFast;
}
function createNode(operator, parentNode, props, graph) {
  if (typeof props === "object") {
    props.operator = operator;
    return new GraphNode(props, parentNode, graph);
  }
  return new GraphNode({ operator }, parentNode, graph);
}
var DOMElement = class extends HTMLElement {
  template = function(self2 = this, props) {
    return `<div> Custom Fragment Props: ${JSON.stringify(props)} </div>`;
  };
  props = {};
  useShadow = false;
  styles;
  oncreate;
  onresize;
  ondelete;
  onchanged;
  renderonchanged = false;
  FRAGMENT;
  STYLE;
  attachedShadow = false;
  obsAttributes = ["props", "options", "onchanged", "onresize", "ondelete", "oncreate", "template"];
  get observedAttributes() {
    return this.obsAttributes;
  }
  get obsAttributes() {
    return this.obsAttributes;
  }
  set obsAttributes(att) {
    if (typeof att === "string") {
      this.obsAttributes.push(att);
    } else if (Array.isArray(att))
      this.obsAttributes = att;
  }
  static get tag() {
    return this.name.toLowerCase() + "-";
  }
  static addElement(tag = this.tag, cls = this, extend = void 0) {
    addCustomElement(cls, tag, extend);
  }
  attributeChangedCallback = (name2, old, val) => {
    if (name2 === "onchanged") {
      let onchanged = val;
      if (typeof onchanged === "string")
        onchanged = parseFunctionFromText2(onchanged);
      if (typeof onchanged === "function") {
        this.onchanged = onchanged;
        this.state.data.props = this.props;
        this.state.unsubscribeTrigger("props");
        this.state.subscribeTrigger("props", this.onchanged);
        let changed = new CustomEvent("changed", { detail: { props: this.props, self: this } });
        this.state.subscribeTrigger("props", () => {
          this.dispatchEvent(changed);
        });
      }
    } else if (name2 === "onresize") {
      let onresize = val;
      if (typeof onresize === "string")
        onresize = parseFunctionFromText2(onresize);
      if (typeof onresize === "function") {
        if (this.ONRESIZE) {
          try {
            window.removeEventListener("resize", this.ONRESIZE);
          } catch (err) {
          }
        }
        this.ONRESIZE = (ev) => {
          this.onresize(this.props, this);
        };
        this.onresize = onresize;
        window.addEventListener("resize", this.ONRESIZE);
      }
    } else if (name2 === "ondelete") {
      let ondelete = val;
      if (typeof ondelete === "string")
        ondelete = parseFunctionFromText2(ondelete);
      if (typeof ondelete === "function") {
        this.ondelete = () => {
          if (this.ONRESIZE)
            window.removeEventListener("resize", this.ONRESIZE);
          this.state.unsubscribeTrigger("props");
          if (ondelete)
            ondelete(this.props, this);
        };
      }
    } else if (name2 === "oncreate") {
      let oncreate = val;
      if (typeof oncreate === "string")
        oncreate = parseFunctionFromText2(oncreate);
      if (typeof oncreate === "function") {
        this.oncreate = oncreate;
      }
    } else if (name2 === "renderonchanged") {
      let rpc = val;
      if (typeof this.renderonchanged === "number")
        this.unsubscribeTrigger(this.renderonchanged);
      if (typeof rpc === "string")
        rpc = parseFunctionFromText2(rpc);
      if (typeof rpc === "function") {
        this.renderonchanged = this.state.subscribeTrigger("props", (p2) => {
          this.render(p2);
          rpc(this, p2);
        });
      } else if (rpc != false)
        this.renderonchanged = this.state.subscribeTrigger("props", this.render);
    } else if (name2 === "props") {
      let newProps = val;
      if (typeof newProps === "string")
        newProps = JSON.parse(newProps);
      Object.assign(this.props, newProps);
      this.state.setState({ props: this.props });
    } else if (name2 === "template") {
      let template = val;
      this.template = template;
      this.render(this.props);
      let created = new CustomEvent("created", { detail: { props: this.props } });
      this.dispatchEvent(created);
    } else {
      let parsed = val;
      if (name2.includes("eval_")) {
        name2 = name2.split("_");
        name2.shift();
        name2 = name2.join();
        parsed = parseFunctionFromText2(val);
      } else if (typeof val === "string") {
        try {
          parsed = JSON.parse(val);
        } catch (err) {
          parsed = val;
        }
      }
      this[name2] = parsed;
      if (name2 !== "props" && this.props)
        this.props[name2] = parsed;
    }
  };
  connectedCallback() {
    if (!this.props)
      this.props = {};
    let newProps = this.getAttribute("props");
    if (typeof newProps === "string")
      newProps = JSON.parse(newProps);
    Object.assign(this.props, newProps);
    this.state.setState({ props: this.props });
    Array.from(this.attributes).forEach((att) => {
      let name2 = att.name;
      let parsed = att.value;
      if (name2.includes("eval_") || name2.includes("()")) {
        if (name2.includes("eval_"))
          name2 = name2.split("_");
        else if (name2.includes("()"))
          name2 = name2.substring(0, name2.indexOf("("));
        name2.shift();
        name2 = name2.join();
        parsed = parseFunctionFromText2(att.value);
      } else if (typeof att.value === "string") {
        try {
          parsed = JSON.parse(att.value);
        } catch (err) {
          parsed = att.value;
        }
      }
      if (!this[name2]) {
        Object.defineProperties(this, att, {
          value: parsed,
          writable: true,
          get() {
            return this[name2];
          },
          set(val) {
            this.setAttribute(name2, val);
          }
        });
      }
      this[name2] = parsed;
      if (name2 !== "props")
        this.props[name2] = parsed;
      this.obsAttributes.push(name2);
    });
    let resizeevent = new CustomEvent("resized", { detail: { props: this.props, self: this } });
    let changed = new CustomEvent("changed", { detail: { props: this.props, self: this } });
    let deleted = new CustomEvent("deleted", { detail: { props: this.props, self: this } });
    let created = new CustomEvent("created", { detail: { props: this.props, self: this } });
    this.render(this.props);
    this.dispatchEvent(created);
    this.state.subscribeTrigger("props", () => {
      this.dispatchEvent(changed);
    });
    if (typeof this.onresize === "function") {
      if (this.ONRESIZE) {
        try {
          window.removeEventListener("resize", this.ONRESIZE);
        } catch (err) {
        }
      }
      this.ONRESIZE = (ev) => {
        this.onresize(this, this.props);
        this.dispatchEvent(resizeevent);
      };
      window.addEventListener("resize", this.ONRESIZE);
    }
    if (typeof this.ondelete === "function") {
      let ondelete = this.ondelete;
      this.ondelete = (props = this.props) => {
        if (this.ONRESIZE)
          window.removeEventListener("resize", this.ONRESIZE);
        this.state.unsubscribeTrigger("props");
        this.dispatchEvent(deleted);
        ondelete(this, props);
      };
    }
    if (typeof this.onchanged === "function") {
      this.state.data.props = this.props;
      this.state.subscribeTrigger("props", this.onchanged);
    }
    if (this.renderonchanged) {
      let rpc = this.renderonchanged;
      if (typeof this.renderonchanged === "number")
        this.unsubscribeTrigger(this.renderonchanged);
      if (typeof rpc === "string")
        rpc = parseFunctionFromText2(rpc);
      if (typeof rpc === "function") {
        this.renderonchanged = this.state.subscribeTrigger("props", (p2) => {
          this.render(p2);
          rpc(this, p2);
        });
      } else if (rpc !== false)
        this.renderonchanged = this.state.subscribeTrigger("props", this.render);
    }
  }
  constructor() {
    super();
  }
  delete = () => {
    this.remove();
    if (typeof this.ondelete === "function")
      this.ondelete(this.props);
  };
  render = (props = this.props) => {
    if (typeof this.template === "function")
      this.templateResult = this.template(this, props);
    else
      this.templateResult = this.template;
    if (this.styles)
      this.templateResult = `<style>${this.styles}</style>${this.templateResult}`;
    const t = document.createElement("template");
    if (typeof this.templateResult === "string")
      t.innerHTML = this.templateResult;
    else if (this.templateResult instanceof HTMLElement) {
      if (this.templateResult.parentNode) {
        this.templateResult.parentNode.removeChild(this.templateResult);
      }
      t.appendChild(this.templateResult);
    }
    const fragment = t.content;
    if (this.FRAGMENT) {
      if (this.useShadow) {
        if (this.STYLE)
          this.shadowRoot.removeChild(this.STYLE);
        this.shadowRoot.removeChild(this.FRAGMENT);
      } else
        this.removeChild(this.FRAGMENT);
    }
    if (this.useShadow) {
      if (!this.attachedShadow) {
        this.attachShadow({ mode: "open" }).innerHTML = "<slot></slot>";
        this.attachedShadow = true;
      }
      if (this.styles) {
        let style = document.createElement("style");
        style.textContent = this.styles;
        this.shadowRoot.prepend(style);
        this.STYLE = style;
      }
      this.shadowRoot.prepend(fragment);
      this.FRAGMENT = this.shadowRoot.childNodes[0];
    } else {
      this.prepend(fragment);
      this.FRAGMENT = this.childNodes[0];
    }
    let rendered = new CustomEvent("rendered", { detail: { props: this.props, self: this } });
    this.dispatchEvent(rendered);
    if (this.oncreate)
      this.oncreate(this, props);
  };
  state = {
    pushToState: {},
    data: {},
    triggers: {},
    setState(updateObj) {
      Object.assign(this.pushToState, updateObj);
      if (Object.keys(this.triggers).length > 0) {
        for (const prop of Object.getOwnPropertyNames(this.triggers)) {
          if (this.pushToState[prop]) {
            this.data[prop] = this.pushToState[prop];
            delete this.pushToState[prop];
            this.triggers[prop].forEach((obj) => {
              obj.onchanged(this.data[prop]);
            });
          }
        }
      }
      return this.pushToState;
    },
    subscribeTrigger(key, onchanged = (res) => {
    }) {
      if (key) {
        if (!this.triggers[key]) {
          this.triggers[key] = [];
        }
        let l = this.triggers[key].length;
        this.triggers[key].push({ idx: l, onchanged });
        return this.triggers[key].length - 1;
      } else
        return void 0;
    },
    unsubscribeTrigger(key, sub) {
      let triggers = this.triggers[key];
      if (triggers) {
        if (!sub)
          delete this.triggers[key];
        else {
          let idx = void 0;
          let obj = triggers.find((o, i) => {
            if (o.idx === sub) {
              idx = i;
              return true;
            }
          });
          if (obj)
            triggers.splice(idx, 1);
          return true;
        }
      }
    },
    subscribeTriggerOnce(key = void 0, onchanged = (value) => {
    }) {
      let sub;
      let changed = (value) => {
        onchanged(value);
        this.unsubscribeTrigger(key, sub);
      };
      sub = this.subscribeTrigger(key, changed);
    }
  };
  get props() {
    return this.props;
  }
  set props(newProps = {}) {
    this.setAttribute("props", newProps);
  }
  get template() {
    return this.template;
  }
  set template(template) {
    this.setAttribute("template", template);
  }
  get render() {
    return this.render;
  }
  get delete() {
    return this.delete;
  }
  get state() {
    return this.state;
  }
  get onchanged() {
    return this.onchanged;
  }
  set onchanged(onchanged) {
    this.setAttribute("onchanged", onchanged);
  }
  get styles() {
    return this.styles;
  }
  set styles(templateStr) {
    this.styles = templateStr;
    if (this.querySelector("style")) {
      this.querySelector("style").innerHTML = templateStr;
    } else {
      this.render();
    }
  }
  get renderonchanged() {
    return this.renderonchanged;
  }
  set renderonchanged(onchanged) {
    this.setAttribute("renderonchanged", onchanged);
  }
  get onresize() {
    return this.props;
  }
  set onresize(onresize) {
    this.setAttribute("onresize", onresize);
  }
  get ondelete() {
    return this.props;
  }
  set ondelete(ondelete) {
    this.setAttribute("ondelete", ondelete);
  }
  get oncreate() {
    return this.oncreate;
  }
  set oncreate(oncreate) {
    this.setAttribute("oncreated", oncreate);
  }
};
function addCustomElement(cls, tag, extend = null) {
  try {
    if (extend) {
      if (tag)
        window.customElements.define(tag, cls, { extends: extend });
      else
        window.customElements.define(cls.name.toLowerCase() + "-", cls, { extends: extend });
    } else {
      if (tag)
        window.customElements.define(tag, cls);
      else
        window.customElements.define(cls.name.toLowerCase() + "-", cls);
    }
  } catch (err) {
  }
}
function parseFunctionFromText2(method) {
  let getFunctionBody = (methodString) => {
    return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, "$2$3$4");
  };
  let getFunctionHead = (methodString) => {
    let startindex = methodString.indexOf(")");
    return methodString.slice(0, methodString.indexOf("{", startindex) + 1);
  };
  let newFuncHead = getFunctionHead(method);
  let newFuncBody = getFunctionBody(method);
  let newFunc;
  try {
    if (newFuncHead.includes("function")) {
      let varName = newFuncHead.split("(")[1].split(")")[0];
      newFunc = new Function(varName, newFuncBody);
    } else {
      if (newFuncHead.substring(0, 6) === newFuncBody.substring(0, 6)) {
        let varName = newFuncHead.split("(")[1].split(")")[0];
        newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf("{") + 1, newFuncBody.length - 1));
      } else {
        try {
          newFunc = (0, eval)(newFuncHead + newFuncBody + "}");
        } catch (err) {
          newFunc = (0, eval)(method);
        }
      }
    }
  } catch (err) {
  }
  return newFunc;
}
var Service = class extends Graph {
  constructor(options = {}) {
    super(void 0, options.name ? options.name : `service${Math.floor(Math.random() * 1e14)}`, options.props);
    this.routes = {};
    this.loadDefaultRoutes = false;
    this.keepState = true;
    this.firstLoad = true;
    this.customRoutes = {};
    this.customChildren = {};
    this.init = (options2) => {
      if (options2)
        options2 = Object.assign({}, options2);
      else
        options2 = {};
      if (options2.customRoutes)
        Object.assign(options2.customRoutes, this.customRoutes);
      else
        options2.customRoutes = this.customRoutes;
      if (options2.customChildren)
        Object.assign(options2.customChildren, this.customChildren);
      else
        options2.customChildren = this.customChildren;
      if (Array.isArray(options2.routes)) {
        options2.routes.forEach((r) => {
          this.load(r, options2.includeClassName, options2.routeFormat, options2.customRoutes, options2.customChildren, options2.sharedState);
        });
      } else if (options2.routes || (Object.keys(this.routes).length > 0 || this.loadDefaultRoutes) && this.firstLoad)
        this.load(options2.routes, options2.includeClassName, options2.routeFormat, options2.customRoutes, options2.customChildren, options2.sharedState);
    };
    this.load = (routes, includeClassName = true, routeFormat = ".", customRoutes = this.customRoutes, customChildren = this.customChildren, sharedState = true) => {
      if (!routes && !this.loadDefaultRoutes && (Object.keys(this.routes).length > 0 || this.firstLoad))
        return;
      if (this.firstLoad)
        this.firstLoad = false;
      if (customRoutes)
        customRoutes = Object.assign(this.customRoutes, customRoutes);
      else
        customRoutes = this.customRoutes;
      let service;
      let allRoutes = {};
      if (routes) {
        if (!(routes instanceof Graph) && routes?.name && !routes.setTree) {
          if (routes.module) {
            let mod = routes;
            routes = {};
            Object.getOwnPropertyNames(routes.module).forEach((prop) => {
              if (includeClassName)
                routes[mod.name + routeFormat + prop] = routes.module[prop];
              else
                routes[prop] = routes.module[prop];
            });
          } else if (typeof routes === "function") {
            service = new routes({ loadDefaultRoutes: this.loadDefaultRoutes });
            service.load();
            if (sharedState)
              service.state = this.state;
            routes = service.routes;
            if (service.customRoutes && !this.customRoutes)
              this.customRoutes = service.customRoutes;
            else if (service.customRoutes && this.customRoutes)
              Object.assign(this.customRoutes, service.customRoutes);
            if (service.customChildren && !this.customChildren)
              this.customChildren = service.customChildren;
            else if (service.customChildren && this.customChildren)
              Object.assign(this.customChildren, service.customChildren);
          }
        } else if (routes instanceof Graph || routes.source instanceof Graph || routes.setTree) {
          service = routes;
          routes = {};
          if (sharedState)
            service.state = this.state;
          if (includeClassName) {
            let name2 = service.name;
            if (!name2) {
              name2 = service.tag;
              service.name = name2;
            }
            if (!name2) {
              name2 = `graph${Math.floor(Math.random() * 1e15)}`;
              service.name = name2;
              service.tag = name2;
            }
          }
          if (service.customRoutes && !this.customRoutes)
            this.customRoutes = service.customRoutes;
          else if (service.customRoutes && this.customRoutes)
            Object.assign(this.customRoutes, service.customRoutes);
          if (service.customChildren && !this.customChildren)
            this.customChildren = service.customChildren;
          else if (service.customChildren && this.customChildren)
            Object.assign(this.customChildren, service.customChildren);
          service.nodes.forEach((node) => {
            routes[node.tag] = node;
            let checked = {};
            let checkChildGraphNodes = (nd, par) => {
              if (!checked[nd.tag] || par && includeClassName && !checked[par?.tag + routeFormat + nd.tag]) {
                if (!par)
                  checked[nd.tag] = true;
                else
                  checked[par.tag + routeFormat + nd.tag] = true;
                if (nd instanceof Graph || nd.source instanceof Graph || nd.setTree) {
                  if (sharedState)
                    nd.state = this.state;
                  if (includeClassName) {
                    let nm = nd.name;
                    if (!nm) {
                      nm = nd.tag;
                      nd.name = nm;
                    }
                    if (!nm) {
                      nm = `graph${Math.floor(Math.random() * 1e15)}`;
                      nd.name = nm;
                      nd.tag = nm;
                    }
                  }
                  nd.nodes.forEach((n) => {
                    if (includeClassName && !routes[nd.tag + routeFormat + n.tag])
                      routes[nd.tag + routeFormat + n.tag] = n;
                    else if (!routes[n.tag])
                      routes[n.tag] = n;
                    checkChildGraphNodes(n, nd);
                  });
                }
              }
            };
            checkChildGraphNodes(node);
          });
        } else if (typeof routes === "object") {
          let name2 = routes.constructor.name;
          if (name2 === "Object") {
            name2 = Object.prototype.toString.call(routes);
            if (name2)
              name2 = name2.split(" ")[1];
            if (name2)
              name2 = name2.split("]")[0];
          }
          if (name2 && name2 !== "Object") {
            let module = routes;
            routes = {};
            Object.getOwnPropertyNames(module).forEach((route) => {
              if (includeClassName)
                routes[name2 + routeFormat + route] = module[route];
              else
                routes[route] = module[route];
            });
          }
        }
        if ((service instanceof Graph || service?.setTree) && service.name && includeClassName) {
          routes = Object.assign({}, routes);
          for (const prop in routes) {
            let route = routes[prop];
            delete routes[prop];
            routes[service.name + routeFormat + prop] = route;
          }
        }
      }
      if (this.loadDefaultRoutes) {
        let rts = Object.assign({}, this.defaultRoutes);
        if (routes) {
          Object.assign(rts, this.routes);
          routes = Object.assign(rts, routes);
        } else
          routes = Object.assign(rts, this.routes);
        this.loadDefaultRoutes = false;
      }
      if (!routes)
        routes = this.routes;
      let incr = 0;
      for (const tag in routes) {
        incr++;
        let childrenIter = (route, routeKey) => {
          if (typeof route === "object") {
            if (!route.tag)
              route.tag = routeKey;
            if (typeof route?.children === "object") {
              nested:
                for (const key in route.children) {
                  incr++;
                  if (typeof route.children[key] === "object") {
                    let rt = route.children[key];
                    if (rt.tag && allRoutes[rt.tag])
                      continue;
                    if (customChildren) {
                      for (const k22 in customChildren) {
                        rt = customChildren[k22](rt, key, route, routes, allRoutes);
                        if (!rt)
                          continue nested;
                      }
                    }
                    if (rt.id && !rt.tag) {
                      rt.tag = rt.id;
                    }
                    let k2;
                    if (rt.tag) {
                      if (allRoutes[rt.tag]) {
                        let randkey = `${rt.tag}${incr}`;
                        allRoutes[randkey] = rt;
                        rt.tag = randkey;
                        childrenIter(allRoutes[randkey], key);
                        k2 = randkey;
                      } else {
                        allRoutes[rt.tag] = rt;
                        childrenIter(allRoutes[rt.tag], key);
                        k2 = rt.tag;
                      }
                    } else {
                      if (allRoutes[key]) {
                        let randkey = `${key}${incr}`;
                        allRoutes[randkey] = rt;
                        rt.tag = randkey;
                        childrenIter(allRoutes[randkey], key);
                        k2 = randkey;
                      } else {
                        allRoutes[key] = rt;
                        childrenIter(allRoutes[key], key);
                        k2 = key;
                      }
                    }
                    if (service?.name && includeClassName) {
                      allRoutes[service.name + routeFormat + k2] = rt;
                      delete allRoutes[k2];
                    } else
                      allRoutes[k2] = rt;
                  }
                }
            }
          }
        };
        allRoutes[tag] = routes[tag];
        childrenIter(routes[tag], tag);
      }
      top:
        for (const route in allRoutes) {
          if (typeof allRoutes[route] === "object") {
            let r = allRoutes[route];
            if (typeof r === "object") {
              if (customRoutes) {
                for (const key in customRoutes) {
                  r = customRoutes[key](r, route, allRoutes);
                  if (!r)
                    continue top;
                }
              }
              if (r.get) {
                if (typeof r.get == "object") {
                }
              }
              if (r.post) {
              }
              if (r.delete) {
              }
              if (r.put) {
              }
              if (r.head) {
              }
              if (r.patch) {
              }
              if (r.options) {
              }
              if (r.connect) {
              }
              if (r.trace) {
              }
              if (r.post && !r.operator) {
                allRoutes[route].operator = r.post;
              } else if (!r.operator && typeof r.get == "function") {
                allRoutes[route].operator = r.get;
              }
            }
          }
        }
      for (const route in routes) {
        if (typeof routes[route] === "object") {
          if (this.routes[route]) {
            if (typeof this.routes[route] === "object")
              Object.assign(this.routes[route], routes[route]);
            else
              this.routes[route] = routes[route];
          } else
            this.routes[route] = routes[route];
        } else if (this.routes[route]) {
          if (typeof this.routes[route] === "object")
            Object.assign(this.routes[route], routes[route]);
          else
            this.routes[route] = routes[route];
        } else
          this.routes[route] = routes[route];
      }
      if (service) {
        for (const key in this.routes) {
          if (this.routes[key] instanceof GraphNode || this.routes[key].constructor.name.includes("GraphNode")) {
            this.nodes.set(key, this.routes[key]);
            this.nNodes = this.nodes.size;
          }
        }
      } else
        this.setTree(this.routes);
      for (const prop in routes) {
        if (this.routes[prop]?.aliases) {
          let aliases = this.routes[prop].aliases;
          aliases.forEach((a) => {
            if (service?.name && includeClassName)
              routes[service.name + routeFormat + a] = this.routes[prop];
            else
              routes[a] = this.routes[prop];
          });
        }
      }
      return this.routes;
    };
    this.unload = (routes = this.routes) => {
      if (!routes)
        return;
      let service;
      if (!(routes instanceof Service) && typeof routes === "function") {
        service = new Service();
        routes = service.routes;
      } else if (routes instanceof Service) {
        routes = routes.routes;
      }
      for (const r in routes) {
        delete this.routes[r];
        if (this.nodes.get(r))
          this.remove(r);
      }
      return this.routes;
    };
    this.handleMethod = (route, method, args) => {
      let m2 = method.toLowerCase();
      let src = this.nodes.get(route);
      if (!src) {
        src = this.routes[route];
        if (!src)
          src = this.tree[route];
      }
      if (src?.[m2]) {
        if (!(src[m2] instanceof Function)) {
          if (args)
            src[m2] = args;
          return src[m2];
        } else
          return src[m2](args);
      } else
        return this.handleServiceMessage({ route, args, method });
    };
    this.transmit = (...args) => {
      if (typeof args[0] === "object") {
        if (args[0].method) {
          return this.handleMethod(args[0].route, args[0].method, args[0].args);
        } else if (args[0].route) {
          return this.handleServiceMessage(args[0]);
        } else if (args[0].node) {
          return this.handleGraphNodeCall(args[0].node, args[0].args);
        } else if (this.keepState) {
          if (args[0].route)
            this.setState({ [args[0].route]: args[0].args });
          if (args[0].node)
            this.setState({ [args[0].node]: args[0].args });
        }
        return args;
      } else
        return args;
    };
    this.receive = (...args) => {
      if (args[0]) {
        if (typeof args[0] === "string") {
          let substr = args[0].substring(0, 8);
          if (substr.includes("{") || substr.includes("[")) {
            if (substr.includes("\\"))
              args[0] = args[0].replace(/\\/g, "");
            if (args[0][0] === '"') {
              args[0] = args[0].substring(1, args[0].length - 1);
            }
            ;
            args[0] = JSON.parse(args[0]);
          }
        }
      }
      if (typeof args[0] === "object") {
        if (args[0].method) {
          return this.handleMethod(args[0].route, args[0].method, args[0].args);
        } else if (args[0].route) {
          return this.handleServiceMessage(args[0]);
        } else if (args[0].node) {
          return this.handleGraphNodeCall(args[0].node, args[0].args);
        } else if (this.keepState) {
          if (args[0].route)
            this.setState({ [args[0].route]: args[0].args });
          if (args[0].node)
            this.setState({ [args[0].node]: args[0].args });
        }
        return args;
      } else
        return args;
    };
    this.pipe = (source, destination, endpoint, method, callback) => {
      if (source instanceof GraphNode) {
        if (callback)
          return source.subscribe((res) => {
            let mod = callback(res);
            if (mod !== void 0)
              this.transmit({ route: destination, args: mod, method });
            else
              this.transmit({ route: destination, args: res, method }, endpoint);
          });
        else
          return this.subscribe(source, (res) => {
            this.transmit({ route: destination, args: res, method }, endpoint);
          });
      } else if (typeof source === "string")
        return this.subscribe(source, (res) => {
          this.transmit({ route: destination, args: res, method }, endpoint);
        });
    };
    this.pipeOnce = (source, destination, endpoint, method, callback) => {
      if (source instanceof GraphNode) {
        if (callback)
          return source.state.subscribeTriggerOnce(source.tag, (res) => {
            let mod = callback(res);
            if (mod !== void 0)
              this.transmit({ route: destination, args: mod, method });
            else
              this.transmit({ route: destination, args: res, method }, endpoint);
          });
        else
          return this.state.subscribeTriggerOnce(source.tag, (res) => {
            this.transmit({ route: destination, args: res, method }, endpoint);
          });
      } else if (typeof source === "string")
        return this.state.subscribeTriggerOnce(source, (res) => {
          this.transmit({ route: destination, args: res, method }, endpoint);
        });
    };
    this.terminate = (...args) => {
      this.nodes.forEach((n) => {
        n.stopNode();
      });
    };
    this.recursivelyAssign = (target, obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          if (typeof target[key] === "object" && !Array.isArray(target[key]))
            this.recursivelyAssign(target[key], obj[key]);
          else
            target[key] = this.recursivelyAssign({}, obj[key]);
        } else
          target[key] = obj[key];
      }
      return target;
    };
    this.defaultRoutes = {
      "/": {
        get: () => {
          return this.print();
        },
        aliases: [""]
      },
      ping: () => {
        console.log("ping");
        return "pong";
      },
      echo: (...args) => {
        this.transmit(...args);
        return args;
      },
      assign: (source) => {
        if (typeof source === "object") {
          Object.assign(this, source);
          return true;
        }
        return false;
      },
      recursivelyAssign: (source) => {
        if (typeof source === "object") {
          this.recursivelyAssign(this, source);
          return true;
        }
        return false;
      },
      log: {
        post: (...args) => {
          console.log("Log: ", ...args);
        },
        aliases: ["info"]
      },
      error: (message) => {
        let er = new Error(message);
        console.error(message);
        return er;
      },
      state: (key) => {
        if (key) {
          return this.state.data[key];
        } else
          return this.state.data;
      },
      printState: (key) => {
        if (key) {
          return stringifyWithCircularRefs(this.state.data[key]);
        } else
          return stringifyWithCircularRefs(this.state.data);
      },
      spliceTypedArray: this.spliceTypedArray,
      transmit: this.transmit,
      receive: this.receive,
      load: this.load,
      unload: this.unload,
      pipe: this.pipe,
      terminate: this.terminate,
      run: this.run,
      subscribe: this.subscribe,
      subscribeNode: this.subscribeNode,
      unsubscribe: this.unsubscribe,
      stopNode: this.stopNode,
      get: this.get,
      add: this.add,
      remove: this.remove,
      setTree: this.setTree,
      setState: this.setState,
      print: this.print,
      reconstruct: this.reconstruct,
      handleMethod: this.handleMethod,
      handleServiceMessage: this.handleServiceMessage,
      handleGraphNodeCall: this.handleGraphNodeCall
    };
    if (options.name)
      this.name = options.name;
    else
      options.name = this.tag;
    if ("loadDefaultRoutes" in options) {
      this.loadDefaultRoutes = options.loadDefaultRoutes;
      this.routes = Object.assign(this.defaultRoutes, this.routes);
    }
    if (options || Object.keys(this.routes).length > 0)
      this.init(options);
  }
  handleServiceMessage(message) {
    let call;
    if (typeof message === "object") {
      if (message.route)
        call = message.route;
      else if (message.node)
        call = message.node;
    }
    if (call) {
      if (Array.isArray(message.args))
        return this.run(call, ...message.args);
      else
        return this.run(call, message.args);
    } else
      return message;
  }
  handleGraphNodeCall(route, args) {
    if (!route)
      return args;
    if (args?.args) {
      this.handleServiceMessage(args);
    } else if (Array.isArray(args))
      return this.run(route, ...args);
    else
      return this.run(route, args);
  }
  isTypedArray(x2) {
    return ArrayBuffer.isView(x2) && Object.prototype.toString.call(x2) !== "[object DataView]";
  }
  spliceTypedArray(arr, start, end) {
    let s = arr.subarray(0, start);
    let e;
    if (end) {
      e = arr.subarray(end + 1);
    }
    let n;
    if (s.length > 0 || e?.length > 0)
      n = new arr.constructor(s.length + e.length);
    if (s.length > 0)
      n.set(s);
    if (e && e.length > 0)
      n.set(e, s.length);
    return n;
  }
};
var DOMService = class extends Service {
  constructor(options, parentNode, interpreters) {
    super({ props: options?.props, name: options?.name ? options.name : `dom${Math.floor(Math.random() * 1e15)}` });
    this.loadDefaultRoutes = false;
    this.keepState = true;
    this.parentNode = document.body;
    this.interpreters = {
      md: (template, options2) => {
        if (typeof markdownit === "undefined") {
          document.head.insertAdjacentHTML("beforeend", `
                    <script src='https://unpkg.com/markdown-it@latest/dist/markdown-it.min.js'><\/script>`);
        }
        let md = globalThis.markdownit();
        let html = md.render(template);
        options2.template = html;
      },
      jsx: (template, options2) => {
        if (!options2.parentNode)
          options2.parentNode = this.parentNode;
        if (typeof options2.parentNode === "string")
          options2.parentNode = document.getElementById(options2.parentNode);
        if (typeof ReactDOM === "undefined") {
          document.head.insertAdjacentHTML("beforeend", `
                    <script src='https://unpkg.com/react@latest/umd/react.production.min.js'><\/script>
                    <script src='https://unpkg.com/react-dom@latest/umd/react-dom.production.min.js'><\/script>`);
        }
        options2.template = "";
        let onrender = options2.onrender;
        options2.onrender = (self2, info2) => {
          const modal = ReactDOM.createPortal(template, options2.id);
          onrender(self2, info2);
        };
      }
    };
    this.customRoutes = {
      "dom": (r, route, routes) => {
        if (!(r instanceof GraphNode)) {
          if (r.element?.parentNode?.id && r.graph?.parentNode?.id) {
            if (r.graph.parentNode.id === r.element.id) {
              r.parentNode = this.parentNode;
            }
          } else {
            if (r.template) {
              if (!r.tag)
                r.tag = route;
              this.addComponent(r, r.generateChildElementNodes);
            } else if (r.context) {
              if (!r.tag)
                r.tag = route;
              this.addCanvasComponent(r);
            } else if (r.tagName || r.element) {
              if (!r.tag)
                r.tag = route;
              this.addElement(r, r.generateChildElementNodes);
            }
          }
        }
        return r;
      }
    };
    this.customChildren = {
      "dom": (rt, routeKey, parent, routes, checked) => {
        if ((parent.tag || parent.id) && (parent.template || parent.context || parent.tagName || parent.element) && (rt.template || rt.context || rt.tagName || rt.element) && !rt.parentNode) {
          if (parent.tag)
            rt.parentNode = parent.tag;
          if (parent.id)
            rt.parentNode = parent.id;
        }
        return rt;
      }
    };
    this.elements = {};
    this.components = {};
    this.templates = {};
    this.addElement = (options2, generateChildElementNodes = false) => {
      let elm = this.createElement(options2);
      if (!options2.element)
        options2.element = elm;
      if (!options2.operator)
        options2.operator = function(props) {
          if (typeof props === "object")
            for (const key in props) {
              if (this.element) {
                if (typeof this.element[key] === "function" && typeof props[key] !== "function") {
                  if (Array.isArray(props[key]))
                    this.element[key](...props[key]);
                  else
                    this.element[key](props[key]);
                } else if (key === "style") {
                  Object.assign(this.element[key], props[key]);
                } else
                  this.element[key] = props[key];
              }
            }
          return props;
        };
      let node = this.resolveGraphNode(elm, options2);
      let divs = Array.from(elm.querySelectorAll("*"));
      if (generateChildElementNodes) {
        divs = divs.map((d, i) => this.addElement({ element: d }));
      }
      this.elements[options2.id] = { element: elm, node, parentNode: options2.parentNode, divs };
      if (!node.ondelete)
        node.ondelete = (node2) => {
          elm.remove();
          if (options2.onremove)
            options2.onremove.call(this.elements[options2.id].node, elm, this.elements[options2.id]);
        };
      if (options2.onresize) {
        let onresize = options2.onresize;
        options2.onresize = (ev) => {
          onresize.call(this.elements[options2.id].node, ev, elm, this.elements[options2.id]);
        };
        window.addEventListener("resize", options2.onresize);
      }
      return this.elements[options2.id];
    };
    this.createElement = (options2) => {
      let elm;
      if (options2.element) {
        if (typeof options2.element === "string") {
          elm = document.querySelector(options2.element);
          if (!elm)
            elm = document.getElementById(options2.element);
        } else
          elm = options2.element;
      } else if (options2.tagName)
        elm = document.createElement(options2.tagName);
      else if (options2.id && document.getElementById(options2.id))
        elm = document.getElementById(options2.id);
      if (!elm)
        return void 0;
      this.updateOptions(options2, elm);
      return elm;
    };
    this.updateOptions = (options2, element) => {
      if (!options2.id && options2.tag)
        options2.id = options2.tag;
      if (!options2.tag && options2.id)
        options2.tag = options2.id;
      if (!options2.id)
        options2.id = `${options2.tagName ?? "element"}${Math.floor(Math.random() * 1e15)}`;
      let p2 = options2.parentNode;
      delete options2.parentNode;
      Object.defineProperty(options2, "parentNode", {
        get: function() {
          return element.parentNode;
        },
        set: (v2) => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
          this.resolveParentNode(element, v2 ? v2 : this.parentNode, options2, options2.onrender);
        },
        enumerable: true,
        configurable: true
      });
      options2.parentNode = p2 ? p2 : this.parentNode;
      element.id = options2.id;
      if (options2.style)
        Object.assign(element.style, options2.style);
      if (options2.attributes) {
        for (let key in options2.attributes) {
          if (typeof options2.attributes[key] === "function")
            element[key] = (...args) => options2.attributes[key](...args);
          else
            element[key] = options2.attributes[key];
        }
      }
      if (!options2.attributes?.innerHTML && options2.innerHTML) {
        element.innerHTML = options2.innerHTML;
      } else if (!options2.attributes?.innerText && options2.innerText) {
        element.innerText = options2.innerText;
      }
      return options2;
    };
    this.resolveParentNode = (elm, parentNode2, options2, oncreate) => {
      if (!elm.parentNode) {
        setTimeout(() => {
          if (typeof parentNode2 === "string")
            parentNode2 = document.getElementById(parentNode2);
          if (parentNode2 && typeof parentNode2 === "object") {
            parentNode2.appendChild(elm);
          }
          if (oncreate)
            oncreate.call(elm.node, elm, this.elements[options2.id]);
          if (elm.node.animation || elm.node.animate) {
            elm.node.runAnimation();
          }
          if (elm.node.looper || typeof elm.node.loop === "number" && elm.node.loop) {
            elm.node.runLoop();
          }
        }, 0.01);
      }
    };
    this.resolveGraphNode = (element, options2) => {
      let node;
      if (this.nodes.get(options2.id)?.element?.parentNode?.id === options2.parentNode || this.nodes.get(options2.id)?.parentNode === options2.parentNode) {
        node = this.nodes.get(options2.id);
      } else {
        let parentId = options2.parentNode instanceof HTMLElement ? options2.parentNode?.id : typeof options2.parentNode === "string" ? options2.parentNode : void 0;
        let parent;
        if (parentId)
          parent = this.nodes.get(parentId);
        node = new GraphNode(options2 instanceof Graph ? options2 : Object.assign({}, options2), parent, this);
      }
      delete node.parentNode;
      Object.defineProperty(node, "parentNode", {
        get: function() {
          return element.parentNode;
        },
        set: (v2) => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
          this.resolveParentNode(element, v2 ? v2 : this.parentNode, options2, options2.onrender);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(node, "element", {
        get: () => element,
        set: (v2) => {
          element = v2;
          node.nodes.forEach((n) => {
            if (node.source?._unique === n.graph?._unique)
              n.parentNode = element;
          });
        }
      });
      node.element = element;
      element.node = node;
      let initialOptions = options2._initial ?? options2;
      for (let key in initialOptions) {
        if (typeof initialOptions[key] === "function") {
          const desc = Object.getOwnPropertyDescriptor(initialOptions, key);
          if (desc && desc.get && !desc.set)
            initialOptions = Object.assign({}, initialOptions);
          initialOptions[key] = initialOptions[key].bind(node);
        } else if (key === "attributes") {
          for (let key2 in initialOptions.attributes) {
            if (typeof initialOptions.attributes[key2] === "function") {
              initialOptions.attributes[key2] = initialOptions.attributes[key2].bind(node);
            }
          }
        }
      }
      return node;
    };
    this.addComponent = (options2, generateChildElementNodes = true) => {
      if (options2.onrender) {
        let oncreate = options2.onrender;
        options2.onrender = (element) => {
          oncreate.call(element.node, element, options2);
        };
      }
      if (options2.onresize) {
        let onresize = options2.onresize;
        options2.onresize = (element) => {
          onresize.call(element.node, element, options2);
        };
      }
      if (options2.onremove) {
        let ondelete = options2.onremove;
        options2.onremove = (element) => {
          ondelete.call(element.node, self, options2);
        };
      }
      if (typeof options2.renderonchanged === "function") {
        let renderonchanged = options2.renderonchanged;
        options2.renderonchanged = (element) => {
          renderonchanged.call(element.node, element, options2);
        };
      }
      if (options2.interpreter && options2.interpreter !== "wc") {
        this.interpreters[options2.interpreter](options2.template, options2);
      }
      class CustomElement extends DOMElement {
        constructor() {
          super(...arguments);
          this.props = options2.props;
          this.styles = options2.styles;
          this.useShadow = options2.useShadow;
          this.template = options2.template;
          this.oncreate = options2.onrender;
          this.onresize = options2.onresize;
          this.ondelete = options2.onremove;
          this.renderonchanged = options2.renderonchanged;
        }
      }
      if (!options2.tagName)
        options2.tagName = `custom-element${Math.random() * 1e15}`;
      CustomElement.addElement(options2.tagName);
      let elm = document.createElement(options2.tagName);
      let completeOptions = this.updateOptions(options2, elm);
      this.templates[completeOptions.id] = completeOptions;
      let divs = Array.from(elm.querySelectorAll("*"));
      if (generateChildElementNodes) {
        divs = divs.map((d) => this.addElement({ element: d }));
      }
      if (!options2.element)
        options2.element = elm;
      if (!options2.operator)
        options2.operator = function op(props) {
          if (typeof props === "object")
            for (const key in props) {
              if (this.element) {
                if (typeof this.element[key] === "function" && typeof props[key] !== "function") {
                  if (Array.isArray(props[key]))
                    this.element[key](...props[key]);
                  else
                    this.element[key](props[key]);
                } else if (key === "style") {
                  Object.assign(this.element[key], props[key]);
                } else
                  this.element[key] = props[key];
              }
            }
          return props;
        };
      let node = this.resolveGraphNode(elm, options2);
      if (!node.ondelete)
        node.ondelete = (node2) => {
          elm.delete();
        };
      this.components[completeOptions.id] = {
        element: elm,
        class: CustomElement,
        node,
        divs,
        ...completeOptions
      };
      return this.components[completeOptions.id];
    };
    this.addCanvasComponent = (options2) => {
      if (!options2.canvas) {
        options2.template = `<canvas `;
        if (options2.width)
          options2.template += `width="${options2.width}"`;
        if (options2.height)
          options2.template += `height="${options2.height}"`;
        options2.template += ` ></canvas>`;
      } else
        options2.template = options2.canvas;
      if (options2.onrender) {
        let oncreate = options2.onrender;
        options2.onrender = (element) => {
          oncreate.call(element.node, element, options2);
        };
      }
      if (options2.onresize) {
        let onresize = options2.onresize;
        options2.onresize = (element) => {
          onresize.call(element.node, element, options2);
        };
      }
      if (options2.ondelete) {
        let ondelete = options2.onremove;
        options2.onremove = (element) => {
          ondelete.call(element.node, element, options2);
        };
      }
      if (typeof options2.renderonchanged === "function") {
        let renderonchanged = options2.renderonchanged;
        options2.renderonchanged = (element) => {
          renderonchanged.call(element.node, element, options2);
        };
      }
      class CustomElement extends DOMElement {
        constructor() {
          super(...arguments);
          this.props = options2.props;
          this.styles = options2.styles;
          this.template = options2.template;
          this.oncreate = options2.onrender;
          this.onresize = options2.onresize;
          this.ondelete = options2.onremove;
          this.renderonchanged = options2.renderonchanged;
        }
      }
      if (!options2.tagName)
        options2.tagName = `custom-element${Math.random() * 1e15}`;
      CustomElement.addElement(options2.tagName);
      let elm = document.createElement(options2.tagName);
      const completeOptions = this.updateOptions(options2, elm);
      let animation = () => {
        if (this.components[completeOptions.id]?.animating) {
          this.components[completeOptions.id].draw(this.components[completeOptions.id].element, this.components[completeOptions.id]);
          requestAnimationFrame(animation);
        }
      };
      this.templates[completeOptions.id] = completeOptions;
      if (!options2.element)
        options2.element = elm;
      if (!options2.operator)
        options2.operator = function op(props) {
          if (typeof props === "object")
            for (const key in props) {
              if (this.element) {
                if (typeof this.element[key] === "function" && typeof props[key] !== "function") {
                  if (Array.isArray(props[key]))
                    this.element[key](...props[key]);
                  else
                    this.element[key](props[key]);
                } else if (key === "style") {
                  Object.assign(this.element[key], props[key]);
                } else
                  this.element[key] = props[key];
              }
            }
          return props;
        };
      let node = this.resolveGraphNode(elm, options2);
      if (!node.ondelete)
        node.ondelete = (node2) => {
          elm.delete();
        };
      let canvas = elm.querySelector("canvas");
      if (completeOptions.style)
        Object.assign(canvas.style, completeOptions.style);
      let context;
      if (typeof completeOptions.context === "object")
        context = options2.context;
      else if (typeof completeOptions.context === "string")
        context = canvas.getContext(completeOptions.context);
      this.components[completeOptions.id] = {
        element: elm,
        class: CustomElement,
        template: completeOptions.template,
        canvas,
        node,
        ...completeOptions
      };
      this.components[completeOptions.id].context = context;
      elm.canvas = canvas;
      elm.context = context;
      node.canvas = canvas;
      node.context = context;
      return this.components[completeOptions.id];
    };
    this.terminate = (element) => {
      if (typeof element === "object") {
        if (element.animating)
          element.animating = false;
        if (element.element)
          element = element.element;
      } else if (typeof element === "string" && this.components[element]) {
        if (this.components[element].node.isAnimating)
          this.components[element].node.stopNode();
        if (this.components[element].divs)
          this.components[element].divs.forEach((d) => this.terminate(d));
        let temp = this.components[element].element;
        delete this.components[element];
        element = temp;
      } else if (typeof element === "string" && this.elements[element]) {
        if (this.elements[element].divs)
          this.elements[element].divs.forEach((d) => this.terminate(d));
        let temp = this.elements[element].element;
        if (this.elements[element].onresize)
          window.removeEventListener("resize", this.elements[element].onresize);
        if (this.elements[element].ondelete)
          this.elements[element].ondelete(temp, this.elements[element]);
        delete this.elements[element];
        element = temp;
      }
      if (element) {
        if (this.nodes.get(element.id)) {
          this.removeTree(element.id);
        }
        if (element instanceof DOMElement)
          element.delete();
        else if (element?.parentNode) {
          element.parentNode.removeChild(element);
        }
        return true;
      }
      return false;
    };
    this.defaultRoutes = {
      addElement: this.addElement,
      addComponent: this.addComponent,
      addCanvasComponent: this.addCanvasComponent,
      terminate: this.terminate
    };
    if (options?.parentNode)
      parentNode = options.parentNode;
    if (typeof parentNode === "string")
      parentNode = document.getElementById(parentNode);
    if (parentNode instanceof HTMLElement)
      this.parentNode = parentNode;
    if (interpreters) {
      Object.assign(this.interpreters, interpreters);
    }
    this.init(options);
  }
};
var Router = class extends Service {
  constructor(options) {
    super(options);
    this.name = "router";
    this.connections = {};
    this.sources = {};
    this.services = {};
    this.serviceConnections = {};
    this.users = {};
    this.addUser = async (info2, connections, config, receiving) => {
      if (!info2._id) {
        info2._id = `user${Math.floor(Math.random() * 1e15)}`;
      }
      let user = Object.assign({}, info2);
      if (connections) {
        for (const key in connections) {
          if (typeof connections[key] === "object") {
            if (!connections[key].connection._id) {
              await new Promise((res, rej) => {
                let start = performance.now();
                let checker = () => {
                  if (!connections[key].connection._id) {
                    if (performance.now() - start > 3e3) {
                      delete connections[key];
                      rej(false);
                    } else {
                      setTimeout(() => {
                        checker();
                      }, 100);
                    }
                  } else {
                    res(true);
                  }
                };
                checker();
              }).catch((er) => {
                console.error("Connections timed out:", er);
              });
            }
          }
        }
        for (const key in connections) {
          connections[key] = this.addConnection(connections[key], user._id);
        }
      }
      if (config) {
        for (const c in config) {
          this.openConnection(config[c].service, config[c], user._id, config[c].args);
        }
      }
      let send = (message, ...a) => {
        let connection = this.getConnection(user._id, "send");
        if (connection?.send)
          return connection.send(message, ...a);
      };
      let request = (message, method, ...a) => {
        let connection = this.getConnection(user._id, "request");
        if (connection?.request)
          return connection.request(message, method, ...a);
      };
      let post = (route, args, method, ...a) => {
        let connection = this.getConnection(user._id, "post");
        if (connection?.post)
          return connection.post(route, args, method, ...a);
      };
      let run = (route, args, method, ...a) => {
        let connection = this.getConnection(user._id, "run");
        if (connection?.run)
          return connection.run(route, args, method, ...a);
      };
      let subscribe = (route, callback, ...a) => {
        let connection = this.getConnection(user._id, "subscribe");
        if (connection?.subscribe)
          return connection.subscribe(route, callback, ...a);
      };
      let unsubscribe = (route, sub, ...a) => {
        let connection = this.getConnection(user._id, "unsubscribe");
        if (connection?.unsubscribe)
          return connection.unsubscribe(route, sub, ...a);
      };
      let terminate = () => {
        return this.removeUser(user);
      };
      user.send = send;
      user.request = request;
      user.post = post;
      user.run = run;
      user.subscribe = subscribe;
      user.unsubscribe = unsubscribe;
      user.terminate = terminate;
      this.users[user._id] = user;
      if (connections && !receiving) {
        let connectionIds = {};
        let pass = false;
        Object.keys(connections).map((k2, i) => {
          if (connections[k2]?._id) {
            connectionIds[`${i}`] = connections[k2]?._id;
            pass = true;
          }
        });
        if (pass) {
          user.send({
            route: "addUser",
            args: [
              { _id: user._id },
              connectionIds,
              void 0,
              true
            ]
          });
        }
      }
      return user;
    };
    this.getConnection = (sourceId, hasMethod) => {
      if (this.sources[sourceId]) {
        if (this.order) {
          for (let i = 0; i < this.order.length; i++) {
            let k2 = this.order[i];
            for (const key in this.sources[sourceId]) {
              if (this.sources[sourceId][key].service) {
                if (typeof this.sources[sourceId][key].service === "object") {
                  if (this.sources[sourceId][key].service.tag === k2) {
                    if (this.sources[sourceId][key].connectionType && this.sources[sourceId][key].service?.name) {
                      if (!this.serviceConnections[this.sources[sourceId][key].service.name]) {
                        this.removeConnection(this.sources[sourceId][key]);
                        continue;
                      }
                    }
                    return this.sources[sourceId][key];
                  }
                } else if (this.sources[sourceId][key].service === k2) {
                  if (this.sources[sourceId][key].connectionType && this.sources[sourceId][key].service?.name) {
                    if (!this.serviceConnections[this.sources[sourceId][key].service.name])
                      this.removeConnection(this.sources[sourceId][key]);
                    continue;
                  }
                  return this.sources[sourceId][key];
                }
              }
            }
          }
        } else {
          for (const k2 in this.sources[sourceId]) {
            if (this.sources[sourceId][k2].connectionType && this.sources[sourceId][k2].service?.name) {
              if (!this.serviceConnections[this.sources[sourceId][k2].service.name]) {
                this.removeConnection(this.sources[sourceId][k2]);
                continue;
              }
            }
            if (hasMethod && this.sources[sourceId][k2][hasMethod]) {
              return this.sources[sourceId][k2];
            } else {
              return this.sources[sourceId][k2];
            }
          }
        }
      } else if (this.order) {
        for (let i = 0; i < this.order.length; i++) {
          let k2 = this.order[i];
          if (this.sources[k2]?.[sourceId]) {
            if (this.sources[k2][sourceId].connectionType && this.sources[k2][sourceId].service?.name) {
              if (!this.serviceConnections[this.sources[k2][sourceId].service.service.name]) {
                this.removeConnection(this.sources[k2][sourceId].service);
                continue;
              }
            }
            if (hasMethod && this.sources[k2][sourceId]?.[hasMethod]) {
              return this.sources[k2][sourceId];
            } else {
              return this.sources[k2][sourceId];
            }
          }
        }
      }
      if (typeof sourceId === "string" && this.connections[sourceId] && this.connections[sourceId].send) {
        return this.connections[sourceId];
      }
    };
    this.getConnections = (sourceId, hasMethod, props) => {
      if (this.sources[sourceId]) {
        if (!props && !hasMethod)
          return this.sources[sourceId];
        let found = {};
        for (const key in this.sources[sourceId]) {
          if (typeof this.sources[sourceId][key] === "object") {
            if (!this.sources[sourceId][key]._id) {
              for (const k2 in this.sources[sourceId][key]) {
                if (typeof this.sources[sourceId][key][k2] === "object") {
                  let pass = true;
                  if (hasMethod && !this.sources[sourceId][key][k2][hasMethod])
                    pass = false;
                  for (const p2 in props) {
                    if (typeof this.sources[sourceId][key][k2][p2] === "object" && typeof props[p2] === "object") {
                      for (const pp in props[p2]) {
                        if (props[p2][pp] !== this.sources[sourceId][key][k2][p2][pp]) {
                          pass = false;
                          break;
                        }
                      }
                    } else if (this.sources[sourceId][key][k2][p2] !== props[p2]) {
                      pass = false;
                    } else {
                      pass = false;
                      break;
                    }
                  }
                  if (pass) {
                    found[this.sources[sourceId][key][k2]._id] = this.sources[sourceId][key][k2];
                  }
                }
              }
            } else {
              let pass = true;
              if (hasMethod && !this.sources[sourceId][key][hasMethod])
                pass = false;
              for (const p2 in props) {
                if (typeof this.sources[sourceId][key][p2] === "object" && typeof props[p2] === "object") {
                  for (const pp in props[p2]) {
                    if (props[p2][pp] !== this.sources[sourceId][key][p2][pp]) {
                      pass = false;
                      break;
                    }
                  }
                } else if (this.sources[sourceId][key][p2] !== props[p2]) {
                  pass = false;
                } else {
                  pass = false;
                  break;
                }
              }
              if (pass) {
                if (this.getConnection(this.sources[sourceId][key], hasMethod))
                  found[this.sources[sourceId][key]._id] = this.sources[sourceId][key];
              }
            }
          }
        }
      }
    };
    this.addConnection = (options2, source) => {
      let settings = {};
      if (typeof options2 === "string") {
        if (this.connections[options2]) {
          options2 = this.connections[options2];
        } else {
          for (const j2 in this.serviceConnections) {
            for (const k2 in this.serviceConnections[j2]) {
              if (this.serviceConnections[j2][k2][options2]) {
                options2 = { connection: this.serviceConnections[j2][k2][options2] };
                options2.service = j2;
                settings.connectionType = j2;
                settings.connectionsKey = k2;
                break;
              }
            }
          }
        }
        if (typeof options2 === "string" && this.nodes.get(options2))
          options2 = { connection: this.nodes.get(options2) };
      }
      if (!options2 || typeof options2 === "string")
        return void 0;
      if (source)
        settings.source = source;
      if (options2.connection instanceof GraphNode) {
        settings.connection = options2.connection;
        let node = settings.connection;
        settings.send = async (message) => {
          if (message.method) {
            if (Array.isArray(message.args)) {
              return node[message.method]?.(...message.args);
            } else
              return node[message.method]?.(message.args);
          } else {
            if (Array.isArray(message.args)) {
              return node.run(...message.args);
            } else
              return node.run(message.args);
          }
        };
        settings.request = async (message, method) => {
          if (method) {
            if (Array.isArray(message.args)) {
              return node[method]?.(...message.args);
            } else
              return node[method]?.(message.args);
          } else {
            if (Array.isArray(message.args)) {
              return node.run(...message.args);
            } else
              return node.run(message.args);
          }
        };
        settings.post = async (route, args, method) => {
          if (route && node.get(route)) {
            let n = node.get(route);
            if (method) {
              if (Array.isArray(args)) {
                return n[method]?.(...args);
              } else
                return n[method]?.(args);
            } else {
              if (Array.isArray(args)) {
                return n.run(...args);
              } else
                return n.run(args);
            }
          } else {
            if (method) {
              if (Array.isArray(args)) {
                return node[method]?.(...args);
              } else
                return node[method]?.(args);
            } else {
              if (Array.isArray(args)) {
                return node.run(...args);
              } else
                return node.run(args);
            }
          }
        };
        settings.run = settings.post;
        settings.subscribe = async (route, callback) => {
          return node.subscribe(callback, route);
        };
        settings.unsubscribe = async (route, sub) => {
          return node.unsubscribe(sub, route);
        };
        settings.terminate = () => {
          node.graph.remove(node);
          return true;
        };
        settings.onclose = options2.onclose;
        if (settings.onclose) {
          let oldondelete;
          if (node.ondelete)
            oldondelete = node.ondelete;
          node.ondelete = (n) => {
            if (settings.onclose)
              settings.onclose(settings, n);
            if (oldondelete)
              oldondelete(n);
          };
        }
      } else if (options2.connection instanceof Graph) {
        if (options2.connection.nodes.get("open"))
          settings.service = options2.connection;
        let graph = settings.connection;
        settings.send = async (message) => {
          if (Array.isArray(message.args))
            graph.run(message.route, ...message.args);
          else
            graph.run(message.route, message.args);
        };
        settings.request = async (message, method) => {
          if (!message.route)
            return void 0;
          if (method) {
            if (Array.isArray(message.args)) {
              return graph.nodes.get(message.route)[method]?.(...message.args);
            } else
              return graph.nodes.get(message.route)[method]?.(message.args);
          } else {
            if (Array.isArray(message.args)) {
              return graph.run(message.route, ...message.args);
            } else
              return graph.run(message.route, message.args);
          }
        };
        settings.post = async (route, args, method) => {
          if (route && graph.get(route)) {
            let n = graph.get(route);
            if (method) {
              if (Array.isArray(args)) {
                return n[method]?.(...args);
              } else
                return n[method]?.(args);
            } else {
              if (Array.isArray(args)) {
                return n.run(...args);
              } else
                return n.run(args);
            }
          }
        };
        settings.run = settings.post;
        settings.subscribe = async (route, callback) => {
          return graph.subscribe(route, callback);
        };
        settings.unsubscribe = async (route, sub) => {
          return graph.unsubscribe(route, sub);
        };
        settings.terminate = (n) => {
          graph.remove(n);
          return true;
        };
      } else if (!(options2._id && this.connections[options2._id])) {
        let c = options2.connection;
        if (typeof c === "string") {
          if (this.connections[c])
            c = this.connections[c];
          else if (options2.service) {
            if (typeof options2.service === "string") {
              options2.service = this.services[options2.service];
            }
            if (typeof options2.service === "object") {
              if (options2.service.connections) {
                for (const key in options2.service.connections) {
                  if (options2.service.connections[key][c]) {
                    c = options2.service.connections[key][c];
                    settings.connectionType = key;
                    settings.connectionsKey = c;
                    break;
                  }
                }
              }
            }
          } else {
            for (const j2 in this.serviceConnections) {
              for (const k2 in this.serviceConnections[j2]) {
                if (this.serviceConnections[j2][k2][c]) {
                  c = this.serviceConnections[j2][k2][c];
                  options2.service = j2;
                  settings.connectionType = j2;
                  settings.connectionsKey = k2;
                  break;
                }
              }
            }
          }
        }
        if (typeof c !== "object")
          return void 0;
        settings._id = c._id;
        settings.send = c.send;
        settings.request = c.request;
        settings.run = c.run;
        settings.post = c.post;
        settings.subscribe = c.subscribe;
        settings.unsubscribe = c.unsubscribe;
        settings.terminate = c.terminate;
        settings.onclose = options2.onclose;
        if (settings.onclose) {
          if (!(c.onclose && settings.onclose.toString() === c.onclose.toString())) {
            let oldonclose = c.onclose;
            c.onclose = (...args) => {
              if (settings.onclose)
                settings.onclose(settings, ...args);
              if (this.users[settings.source] && Object.keys(this.sources[settings.source]).length === 0) {
                this.removeUser(settings.source, false);
              }
              if (oldonclose)
                oldonclose(...args);
            };
          }
        } else {
          let oldonclose = c.onclose;
          c.onclose = (...args) => {
            this.removeConnection(settings);
            if (this.users[settings.source] && Object.keys(this.sources[settings.source]).length === 0) {
              this.removeUser(settings.source, false);
            }
            if (oldonclose)
              oldonclose(...args);
          };
        }
        if (options2.service) {
          if (typeof options2.service === "string")
            options2.service = this.services[options2.service];
          settings.service = options2.service;
        } else if (c.graph)
          settings.service = c.graph;
      }
      if (!settings.source && options2.source) {
        settings.source = options2.source;
      } else if (!settings.source && options2.service) {
        settings.source = typeof options2.service === "object" ? options2.service.name : void 0;
      } else if (!settings.source && (settings.connection instanceof GraphNode || settings.connection instanceof Graph)) {
        settings.source = "local";
        if (!this.order.indexOf("local"))
          this.order.unshift("local");
      }
      if (!settings._id)
        settings._id = `connection${Math.floor(Math.random() * 1e15)}`;
      if (settings.source) {
        if (!this.sources[settings.source])
          this.sources[settings.source] = {};
        this.sources[settings.source][settings._id] = settings;
      }
      if (!this.connections[settings._id])
        this.connections[settings._id] = settings;
      return settings;
    };
    this.removeConnection = (connection, terminate = false) => {
      if (typeof connection === "object" && connection._id)
        connection = connection._id;
      if (typeof connection === "string") {
        if (this.connections[connection]) {
          if (terminate && this.connections[connection])
            this.connections[connection].terminate();
          delete this.connections[connection];
          for (const key in this.sources) {
            if (this.sources[key][connection])
              delete this.sources[key][connection];
            else {
              for (const k2 in this.sources[key]) {
                if (this.sources[key][k2]?.[connection]) {
                  delete this.sources[key][connection];
                }
              }
            }
          }
          return true;
        } else if (this.sources[connection]) {
          for (const key in this.sources[connection]) {
            this.removeConnection(this.sources[connection][key], terminate);
          }
          return true;
        }
      }
    };
    this.addService = (service, connections, includeClassName, routeFormat, syncServices, source, order) => {
      this.load(service, includeClassName, routeFormat, this.customRoutes, this.customChildren);
      this.services[service.name] = service;
      if (connections) {
        if (typeof connections === "string")
          this.addServiceConnections(service, connections, source);
        else {
          for (const c in connections) {
            this.addServiceConnections(service, c, source);
          }
        }
      }
      if (syncServices)
        this.syncServices();
      if (order)
        this.order = order;
      else {
        if (!this.order)
          this.order = [];
        this.order.push(service.name);
      }
    };
    this.addServiceConnections = (service, connectionsKey, source) => {
      if (typeof service === "string") {
        service = this.services[service];
      }
      if (connectionsKey && service[connectionsKey]) {
        let newConnections = {};
        if (!this.serviceConnections[service.name])
          this.serviceConnections[service.name] = {};
        this.serviceConnections[service.name][connectionsKey] = service[connectionsKey];
        for (const key in service[connectionsKey]) {
          if (!this.connections[key]) {
            newConnections[key] = this.addConnection({ connection: service[connectionsKey][key], service }, source);
            newConnections[key].connectionType = connectionsKey;
          }
        }
        return newConnections;
      }
    };
    this.openConnection = async (service, options2, source, ...args) => {
      if (typeof service === "string") {
        service = this.services[service];
      }
      if (service instanceof Service) {
        let connection = service.run("open", options2, ...args);
        if (connection instanceof Promise) {
          return connection.then(async (info2) => {
            if (!info2._id) {
              await new Promise((res, rej) => {
                let start = performance.now();
                let checker = () => {
                  if (!info2._id) {
                    if (performance.now() - start > 3e3) {
                      rej(false);
                    } else {
                      setTimeout(() => {
                        checker();
                      }, 100);
                    }
                  } else {
                    res(true);
                  }
                };
                checker();
              }).catch((er) => {
                console.error("Connections timed out:", er);
              });
            }
            if (info2._id)
              this.addConnection({ connection: info2, service }, source);
          });
        } else if (connection) {
          if (!connection._id) {
            await new Promise((res, rej) => {
              let start = performance.now();
              let checker = () => {
                if (!connection._id) {
                  if (performance.now() - start > 3e3) {
                    rej(false);
                  } else {
                    setTimeout(() => {
                      checker();
                    }, 100);
                  }
                } else {
                  res(true);
                }
              };
              checker();
            }).catch((er) => {
              console.error("Connections timed out:", er);
            });
          }
          if (connection._id)
            return this.addConnection({ connection, service }, source);
        }
      }
    };
    this.terminate = (connection) => {
      if (typeof connection === "string")
        connection = this.connections[connection];
      return connection.terminate();
    };
    this.subscribeThroughConnection = (route, relay, endpoint, callback, ...args) => {
      if (typeof relay === "string") {
        relay = this.getConnection(relay, "run");
      }
      if (typeof relay === "object")
        return new Promise((res, rej) => {
          relay.run("routeConnections", [route, endpoint, relay._id, ...args]).then((sub) => {
            this.subscribe(endpoint, (res2) => {
              if (res2?.callbackId === route) {
                if (!callback)
                  this.setState({ [endpoint]: res2.args });
                else if (typeof callback === "string") {
                  this.setState({ [callback]: res2.args });
                } else
                  callback(res2.args);
              }
            });
            res(sub);
          }).catch(rej);
        });
    };
    this.routeConnections = (route, transmitter, receiver, ...args) => {
      let rxsrc;
      if (typeof receiver === "string") {
        if (this.sources[receiver]) {
          rxsrc = receiver;
        }
        receiver = this.getConnection(receiver, "send");
      }
      if (typeof transmitter === "string") {
        transmitter = this.getConnection(transmitter, "subscribe");
      }
      if (transmitter?.subscribe && receiver?.send) {
        let res = new Promise((res2, rej) => {
          transmitter.subscribe(route, transmitter._id, (res3) => {
            if (!this.connections[receiver._id] && rxsrc) {
              if (this.sources[rxsrc]) {
                rxsrc = receiver;
                Object.keys(this.sources[rxsrc]).forEach((k2) => {
                  if (this.sources[receiver][k2].send) {
                    receiver = this.sources[receiver][k2];
                  }
                });
              }
            }
            if (this.connections[receiver._id])
              receiver.send({ callbackId: route, args: res3 });
          }, ...args).then((sub) => {
            res2(sub);
          });
        });
        return res;
      }
    };
    this.syncServices = () => {
      for (const name2 in this.services) {
        if ("users" in this.services[name2])
          this.services[name2].users = this.users;
        this.nodes.forEach((n, tag) => {
          if (!this.services[name2].nodes.get(n.tag)) {
            this.services[name2].nodes.set(n.tag, n);
          } else {
            if (!this.services[name2].nodes.get(tag) && n._UNIQUE !== this.services[name2].nodes.get(n.tag)._UNIQUE)
              this.services[name2].nodes.set(tag, n);
          }
        });
      }
    };
    this.setUserData = (user, data) => {
      if (user) {
        if (typeof user === "string") {
          user = this.users[user];
          if (!user)
            return false;
        }
      }
      if (data) {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
      }
      if (typeof data === "object") {
        this.recursivelyAssign(user, data);
        return true;
      }
    };
    this.routes = {
      addUser: this.addUser,
      removeUser: this.removeUser,
      getConnection: this.getConnection,
      addConnection: this.addConnection,
      removeConnection: this.removeConnection,
      addService: this.addService,
      addServiceConnections: this.addServiceConnections,
      openConnection: this.openConnection,
      terminate: this.terminate,
      routeConnections: this.routeConnections,
      subscribeThroughConnection: this.subscribeThroughConnection,
      syncServices: this.syncServices
    };
    this.load(this.routes);
    if (options) {
      if (options.order)
        this.order = options.order;
      if (options.services) {
        for (const key in options.services) {
          let opt = options.services[key];
          if (opt instanceof Service) {
            opt.service.name = key;
            opt.service.tag = key;
            this.addService(opt.service, opt.connections, options.includeClassName, options.routeFormat, options.syncServices);
          } else if (typeof opt === "function") {
            let service = new opt();
            service.name = key;
            service.tag = key;
            if (service)
              this.addService(service, service.connections, options.includeClassName, options.routeFormat, options.syncServices);
          } else {
            if (typeof opt.service === "function") {
              let service = new opt.service({ name: key });
              service.name = key;
              service.tag = key;
              if (service)
                this.addService(service, void 0, options.includeClassName, options.routeFormat, options.syncServices);
              opt.service = service;
            } else if (opt.service instanceof Service) {
              opt.service.name = key;
              opt.service.tag = key;
              this.addService(opt.service, void 0, options.includeClassName, options.routeFormat, options.syncServices);
            }
            if (typeof opt.service === "object") {
              if (opt.connections) {
                if (Array.isArray(opt.connections)) {
                  opt.connections.forEach((k2) => {
                    this.addServiceConnections(opt[key].service, k2);
                  });
                } else
                  this.addServiceConnections(opt.service, opt.connections);
              }
              if (opt.config) {
                for (const c in opt.config) {
                  this.openConnection(opt.service, opt.config[c], opt.config[c].source, opt.config[c].args);
                }
              }
            }
          }
        }
      }
    }
  }
  removeUser(profile, terminate) {
    if (terminate)
      this.removeConnection(profile, terminate);
    if (typeof profile === "string")
      profile = this.users[profile];
    if (typeof profile === "object" && profile._id) {
      delete this.users[profile._id];
      if (profile.onclose)
        profile.onclose(profile);
    }
    return true;
  }
};
var transform_default = (tag, node) => {
  const args = node.arguments;
  let graph;
  Array.from(args.keys()).forEach((arg, i) => node[`${arg}`] = args.get(arg).state);
  const originalOperator = node.operator;
  if (typeof originalOperator === "function") {
    node.operator = function(...argsArr) {
      let updatedArgs = [];
      let i = 0;
      args.forEach((o, k2) => {
        const argO = args.get(k2);
        const proxy = `${k2}`;
        const currentArg = argO.spread ? argsArr.slice(i) : argsArr[i];
        const target = graph.node ?? graph;
        let update = currentArg !== void 0 ? currentArg : target[proxy];
        target[proxy] = update;
        if (!argO.spread)
          update = [update];
        updatedArgs.push(...update);
        i++;
      });
      return originalOperator.call(this ?? node, ...updatedArgs);
    };
  }
  graph = new Graph({}, tag, node);
  return graph;
};
var ARGUMENT_NAMES = /([^,]*)/g;
function getFnParamInfo(fn) {
  var fstr = fn.toString();
  const openPar = fstr.indexOf("(");
  const closePar = fstr.indexOf(")");
  const getFirstBracket = (str, offset = 0) => {
    const fb = offset + str.indexOf("{");
    if (fb < closePar && fb > openPar) {
      return getFirstBracket(str.slice(fb), offset + fb);
    } else
      return fb;
  };
  const firstBracket = getFirstBracket(fstr);
  let innerMatch;
  if (firstBracket === -1 || closePar < firstBracket)
    innerMatch = fstr.slice(fstr.indexOf("(") + 1, fstr.indexOf(")"));
  else
    innerMatch = fstr.match(/([a-zA-Z]\w*|\([a-zA-Z]\w*(,\s*[a-zA-Z]\w*)*\)) =>/)?.[1];
  if (!innerMatch)
    return void 0;
  const matches = innerMatch.match(ARGUMENT_NAMES).filter((e) => !!e);
  const info2 = /* @__PURE__ */ new Map();
  matches.forEach((v2) => {
    let [name2, value] = v2.split("=");
    name2 = name2.trim();
    name2 = name2.replace(/\d+$/, "");
    const spread = name2.includes("...");
    name2 = name2.replace("...", "");
    try {
      if (name2)
        info2.set(name2, {
          state: value ? (0, eval)(`(${value})`) : value,
          spread
        });
    } catch (e) {
      info2.set(name2, {});
      console.warn(`Argument ${name2} could not be parsed for`, fn.toString(), value);
    }
  });
  return info2;
}
var parse_default = getFnParamInfo;
var isNode = "process" in globalThis;
var ESPlugin = class {
  #initial;
  #options;
  #instance;
  #graph;
  #router;
  #cache = {};
  #plugins = {};
  #active = false;
  listeners = {
    pool: {
      in: {},
      out: {}
    },
    active: {},
    includeParent: {}
  };
  plugins = {};
  #toRun = false;
  #runProps = true;
  get initial() {
    return this.#initial;
  }
  get instance() {
    return this.#instance;
  }
  get graph() {
    return this.#graph;
  }
  set graph(v2) {
    this.#graph = v2;
  }
  constructor(node, options = {}, parent) {
    this.#initial = node;
    this.#options = options;
    this.#router = options._router ? options._router : options._router = new Router({
      linkServices: false,
      includeClassName: false
    });
    do {
      this.#initial = this.initial.initial ?? this.initial;
    } while (this.initial instanceof ESPlugin);
    const hasDefault = "default" in this.initial;
    let hasComponents = !!node.components;
    const parentHasComponents = !!parent?.components;
    const isFunctionCollection = !parentHasComponents && !hasDefault && !hasComponents;
    if (isFunctionCollection) {
      let newNode = { components: {} };
      for (let namedExport in node)
        newNode.components[namedExport] = { default: node[namedExport] };
      this.#initial = newNode;
      hasComponents = true;
      this.#runProps = false;
    }
    if (hasComponents) {
      const toNotify = [];
      const components = this.initial.components;
      for (let tag in components) {
        const node2 = components[tag];
        if (!(node2 instanceof ESPlugin)) {
          const clonedOptions = Object.assign({}, Object.assign(options));
          const plugin = new ESPlugin(node2, Object.assign(clonedOptions, { tag }), node);
          this.#plugins[tag] = plugin;
          toNotify.push(plugin);
        } else
          this.#cache[tag] = this.#plugins[tag] = node2;
      }
      const thisTag = this.#options.tag;
      toNotify.forEach((o) => {
        let tag = o.#options.tag;
        if (thisTag)
          tag = `${thisTag}.${tag}`;
        this.plugins[o.#options.tag] = o;
        if (typeof options.onPlugin === "function")
          options.onPlugin(tag, o);
      });
    } else
      this.graph = this.#create(options.tag ?? "defaultESPluginTag", this.initial);
    Object.defineProperty(this, "tag", {
      get: () => this.graph?.tag,
      enumerable: true
    });
  }
  #createTree = () => {
    let tree = {};
    for (let tag in this.#plugins) {
      let thisNode = this.#plugins[tag].graph;
      if (this.#cache[tag]) {
        let gs = this.#cache[tag].graph;
        const ref = gs.node ? gs.node : gs;
        thisNode = {};
        for (let key in ref._initial)
          thisNode[key] = ref[key];
        thisNode.tag = tag;
        gs.state.triggers = {};
      }
      tree[tag] = this.#create(tag, thisNode);
    }
    return tree;
  };
  #activate = () => {
    if (this.initial.components) {
      let tree = this.#createTree();
      const props = this.#instance ?? this.initial;
      this.graph = isNode ? new Graph(tree, this.#options.tag, props) : new DOMService({ routes: tree, name: this.#options.tag, props: this.#runProps ? props : void 0 }, this.#options.parentNode);
      this.#router.load(this.graph);
      for (let tag in this.#plugins) {
        const cache2 = this.#cache[tag];
        if (cache2)
          cache2.graph = tree[tag];
      }
    }
  };
  start = async (defer) => {
    if (this.#active === false) {
      this.#active = true;
      const activateFuncs = [];
      for (let key in this.plugins) {
        const o = this.plugins[key];
        await o.start((f2) => {
          activateFuncs.push(f2);
        });
      }
      this.#activate();
      const f = async (top) => {
        const toRun = [];
        for (let f2 of activateFuncs)
          toRun.push(...await f2(top));
        const listeners = [{ reference: {} }, { reference: {} }];
        let toListenTo = {
          ...this.initial.listeners
        };
        let listenTo = false;
        for (let key in this.initial.children) {
          if (!(this.initial.children[key] instanceof GraphNode))
            listenTo = true;
        }
        const basePath = this.getPath();
        if (listenTo) {
          toListenTo[basePath] = true;
        }
        Object.entries(toListenTo).forEach(([key, value]) => {
          for (let target in value)
            listeners[1].reference[target] = true;
          listeners[0].reference[key] = true;
        });
        const targets = [
          {
            reference: this.initial.children,
            condition: (child) => child === void 0,
            map: false
          },
          ...listeners
        ];
        targets.forEach((o) => {
          for (let path in o.reference) {
            if (!o.condition || o.condition(o.reference[path])) {
              const updated = `${top.graph.name}.${path}`;
              let split = updated.split(".");
              const lastKey = split.pop();
              const absolute = path.split(".").slice(0, -1);
              const relative = [...basePath ? basePath.split(".") : [], ...absolute];
              let last = top.graph;
              let resolved = this.#router.nodes.get(updated);
              if (resolved)
                last = this.#router.nodes.get(split.join(".")) ?? top.graph;
              else {
                const get2 = (str, target) => target.nodes.get(str) ?? target[str];
                split = relative;
                try {
                  split.forEach((str) => last = get2(str, last));
                  resolved = lastKey ? get2(lastKey, last) : last;
                } catch {
                  last = top.graph;
                  split = absolute;
                  absolute.forEach((str) => last = get2(str, last));
                  resolved = lastKey ? get2(lastKey, last) : last;
                }
              }
              const used = split.join(".");
              const relJoin = relative.join(".");
              const isSame = basePath === path;
              const mainPath = basePath && !isSame && o.map !== false ? `${basePath}.${path}` : path;
              o.reference[mainPath] = { resolved, last, lastKey, path: {
                used,
                absolute: absolute ? absolute.join(".") : null,
                relative: relative ? relJoin : null
              } };
            }
          }
        });
        let listenerPool = {
          in: listeners[1].reference,
          out: listeners[0].reference
        };
        const getKey = (key) => basePath ? `${basePath}.${key}` : key;
        for (let key in toListenTo) {
          const mainKey = getKey(key);
          const base = top.listeners.active[mainKey] = {};
          for (let inner in toListenTo[key]) {
            const newKey = getKey(inner);
            base[newKey] = toListenTo[key][inner];
          }
        }
        for (let key in this.listeners.includeParent)
          top.listeners.includeParent[key] = this.listeners.includeParent[key];
        for (let type in listenerPool) {
          top.listeners.pool[type] = {
            ...listenerPool[type],
            ...top.listeners.pool[type]
          };
        }
        this.listeners = top.listeners;
        for (let key in listenerPool.out) {
          const node = listenerPool.out[key].resolved;
          if (node instanceof GraphNode) {
            const path = this.getPath(node, true);
            if (this.listeners.includeParent[path])
              this.listeners.includeParent[path] = true;
            this.subscribe(node);
          }
        }
        if (this.#toRun)
          toRun.push(this.run);
        return toRun;
      };
      const graph = this.initial.components;
      if (graph) {
        const ports = graph.ports;
        let firstNode, lastNode;
        if (ports) {
          firstNode = await this.graph.get(ports.input);
          lastNode = this.graph.get(ports.output);
        } else {
          const nodes = Array.from(this.graph.nodes.values());
          firstNode = nodes[0];
          lastNode = nodes.slice(-1)[0];
        }
        if (lastNode) {
          const path = this.getPath(lastNode, true);
          this.listeners.includeParent[path] = lastNode;
        }
        if (firstNode && !this.#initial.default)
          this.#initial.operator = async function(...args) {
            await firstNode.run(...args);
          };
        else
          this.#initial.operator = this.#initial.default;
      }
      if (typeof defer === "function")
        defer(f);
      else {
        const toRun = await f(this);
        for (let key in this.listeners.includeParent) {
          const toResolve = this.listeners.includeParent[key];
          if (toResolve !== true) {
            this.subscribe(toResolve);
            this.listeners.includeParent[key] = true;
          }
        }
        await Promise.all(toRun.map((f2) => f2()));
      }
    }
  };
  getPath = (graph = this.graph, includeTag = false) => {
    const basePath = [];
    let target = graph;
    do {
      if (target instanceof GraphNode)
        target = { node: target };
      if (target.node) {
        basePath.push(target.node.name);
        target = target.node.graph;
      }
    } while (target.node);
    if (includeTag)
      return [...basePath.reverse(), graph.tag].join(".");
    else
      return basePath.reverse().join(".");
  };
  subscribe = (node) => {
    const path = this.getPath(node) || node.tag;
    const targets = [node.children];
    for (let key in this.listeners.active[path]) {
      const res = this.listeners.pool.in[key];
      if (res)
        this.listeners.active[path][key] = res;
      else
        delete this.listeners.active[path][key];
    }
    targets.push(this.listeners.active[path]);
    let aggregatedParent = false;
    const aggregate = (arr) => {
      const aggregate2 = {};
      arr.forEach((o) => {
        for (let key in o) {
          if (!(key in aggregate2))
            aggregate2[key] = [o[key]];
          else {
            const ref1 = aggregate2[key];
            const ref2 = o[key];
            const message = `Both children and listeners are declared for ${key}`;
            const getId = (o2) => o2._unique ?? o2.resolved._unique ?? o2.last._unique;
            const aggregateIds = ref1.map(getId);
            if (!aggregateIds.includes(getId(ref2))) {
              console.warn(`${message}. Aggregating`, ref1, ref2);
              ref1.push(ref2);
            } else
              console.warn(`${message}. Removing`, ref2);
          }
        }
      });
      return aggregate2;
    };
    let aggregated = aggregate(targets);
    node.subscribe((args) => {
      if (path in this.listeners.includeParent && !aggregatedParent) {
        aggregated = aggregate([aggregated, node.graph.children]);
        aggregatedParent = true;
      }
      for (let tag in aggregated)
        aggregated[tag].forEach((info2) => this.resolve(args, info2, aggregated));
    });
  };
  resolve = (args, info2) => {
    if (info2.resolved instanceof GraphNode)
      info2 = info2.resolved;
    if (info2 instanceof GraphNode) {
      if (Array.isArray(args))
        this.#runGraph(info2, ...args);
      else
        this.#runGraph(info2, args);
    } else {
      let res;
      if (typeof info2.resolved === "function") {
        if (Array.isArray(args))
          res = info2.resolved.call(info2.last, ...args);
        else
          res = info2.resolved.call(info2.last, args);
      } else
        res = info2.resolved = info2.last[info2.lastKey] = args;
      let resolved = this.listeners.active[`${info2.path.used}.${info2.lastKey}`];
      if (!resolved)
        resolved = this.listeners.active[info2.lastKey];
      for (let key in resolved)
        this.resolve(res, this.listeners.pool.in[key]);
    }
  };
  stop = () => {
    if (this.#active === true) {
      for (let k2 in this.nested)
        this.nested[k2].stop();
      if (this.graph)
        this.graph.nodes.forEach((n) => {
          this.graph.removeTree(n);
          n.stopNode();
          this.graph.state.triggers = {};
        });
      this.#active = false;
    }
  };
  #create = (tag, info2) => {
    if (typeof info2 === "function")
      info2 = { default: info2 };
    if (!info2 || info2 instanceof Graph)
      return info2;
    else {
      let activeInfo;
      if (info2 instanceof ESPlugin) {
        activeInfo = info2.instance;
        info2 = info2.initial;
      }
      const args = info2.default instanceof Function ? parse_default(info2.default) ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
      if (args.size === 0)
        args.set("default", {});
      let argsArray = Array.from(args.entries());
      const input = argsArray[0][0];
      if (info2.arguments) {
        const isArray = Array.isArray(info2.arguments);
        let i = 0;
        for (let key in info2.arguments) {
          const v2 = info2.arguments[key];
          if (isArray) {
            argsArray[i].state = v2;
            if (i == 0)
              this.#toRun = true;
          } else {
            const got = args.get(key);
            if (got) {
              got.state = v2;
              if (input === key)
                this.#toRun = true;
            }
          }
          i++;
        }
      }
      const gsIn = {
        arguments: args,
        operator: info2.default,
        tag,
        default: info2.default
      };
      var props = Object.getOwnPropertyNames(info2);
      const onActive = ["arguments", "default", "tag", "operator"];
      props.forEach((key) => {
        if (!onActive.includes(key))
          gsIn[key] = info2[key];
      });
      if (activeInfo) {
        for (let key in activeInfo) {
          if (!onActive.includes(key))
            gsIn[key] = activeInfo[key];
        }
      }
      this.#instance = gsIn;
      return transform_default(tag, gsIn);
    }
  };
  #runGraph = async (graph = this.graph, ...args) => {
    if (graph instanceof Graph) {
      if (graph.node)
        return graph.node.run(...args);
      else {
        if (args.length === 0)
          return this.#runDefault(graph);
        else if (graph.nodes.has(args[0]))
          return graph.run(...args);
        else
          return this.#runDefault(graph, ...args);
      }
    } else
      return await graph.run(...args);
  };
  #runDefault = (graph, ...args) => graph.run(graph.nodes.values().next().value, ...args);
  run = async (...args) => this.#runGraph(this.graph, ...args);
};
var src_default = ESPlugin;

// index.ts
var basePkgPath = "./package.json";
var moduleStringTag = "[object Module]";
var _filesystem, _input, _options, _url, _cache, _main, _mode, _onImport, _throw;
var WASL = class {
  constructor(urlOrObject, options = {}, url) {
    this.errors = [];
    this.warnings = [];
    this.files = {};
    this.original = {};
    this.resolved = {};
    this.debug = void 0;
    __privateAdd(this, _filesystem, void 0);
    __privateAdd(this, _input, {});
    __privateAdd(this, _options, {});
    __privateAdd(this, _url, void 0);
    __privateAdd(this, _cache, {});
    __privateAdd(this, _main, "");
    __privateAdd(this, _mode, "import");
    __privateAdd(this, _onImport, (path, info2) => this.files[path] = info2);
    __privateAdd(this, _throw, (e) => {
      const item = {
        message: e.message,
        file: e.file,
        node: e.node
      };
      const arr = e.type === "warning" ? this.warnings : this.errors;
      arr.push(item);
    });
    this.init = async (urlOrObject = __privateGet(this, _input), options = __privateGet(this, _options), url = "") => {
      this.debug = void 0;
      const internalLoadCall = options._internal;
      const isFromValidator = !__privateGet(this, _main) && typeof internalLoadCall === "string";
      if (!__privateGet(this, _input))
        __privateSet(this, _input, urlOrObject);
      if (!__privateGet(this, _options))
        __privateSet(this, _options, options);
      if (!__privateGet(this, _filesystem))
        __privateSet(this, _filesystem, options.filesystem);
      if (!internalLoadCall) {
        if (!url)
          url = __privateGet(this, _url);
        try {
          new URL(url ?? urlOrObject);
          options.relativeTo = "";
        } catch {
        }
      } else if (internalLoadCall === true)
        url = __privateGet(this, _main);
      if (isFromValidator)
        url = __privateSet(this, _main, internalLoadCall);
      const clonedOptions = Object.assign({}, options);
      const innerTopLevel = clonedOptions._top === true;
      const isString = typeof urlOrObject === "string";
      const isHTML = urlOrObject instanceof HTMLElement;
      let mode, object, mainPath;
      if (isHTML) {
        object = from(urlOrObject, options);
        if (options.path)
          mode = "import";
        else {
          if (options.filesystem)
            mode = "reference";
          else
            mode = "import";
        }
      } else if (typeof urlOrObject === "object") {
        object = Object.assign({}, urlOrObject);
        if (typeof internalLoadCall === "string")
          url = mainPath = Ze(internalLoadCall);
        mode = "reference";
      } else if (url || isString) {
        if (!url)
          url = urlOrObject[0] === "." ? Ze(urlOrObject, options.relativeTo ?? "") : urlOrObject;
        mode = "import";
      } else
        console.error("Mode is not supported...");
      if (!internalLoadCall)
        __privateSet(this, _mode, mode);
      mode = clonedOptions._modeOverride ?? __privateGet(this, _mode);
      this.errors.push(...valid(urlOrObject, clonedOptions, "load"));
      this.original = object;
      switch (mode) {
        case "reference":
          if (!innerTopLevel) {
            if (__privateGet(this, _filesystem)) {
              const pkgPath = Ze(basePkgPath, url);
              const pkg = checkFiles(pkgPath, __privateGet(this, _filesystem));
              if (pkg)
                object = Object.assign(pkg, isString ? {} : object);
            }
          }
          break;
        default:
          if (!object) {
            mainPath = await Ze(url);
            this.original = await this.get(mainPath, void 0);
            object = JSON.parse(JSON.stringify(this.original));
            if (!innerTopLevel) {
              const pkgUrl = Ze(basePkgPath, mainPath, true);
              const pkg = await this.get(pkgUrl, void 0);
              if (pkg)
                object = Object.assign(pkg, object);
            }
          }
          break;
      }
      if (!internalLoadCall)
        __privateSet(this, _main, mainPath);
      else if (__privateGet(this, _mode) === "reference" && !__privateGet(this, _main))
        __privateSet(this, _main, "");
      if (this.errors.length === 0) {
        const copy = isHTML ? this.original : JSON.parse(JSON.stringify(this.original));
        this.resolved = await this.resolve(copy, { mainPath, mode }, options);
        const drill = (parent, callback) => {
          const nodes = parent.components;
          for (let tag in nodes) {
            const res = callback(nodes[tag], {
              tag,
              parent,
              options: clonedOptions
            });
            if (res)
              nodes[tag] = res;
          }
        };
        const drillToTest = (target) => {
          drill(target, (node, info2) => {
            const connections = info2.parent.listeners;
            for (let output in connections) {
              const getTarget = (o, str) => o.components?.[str] ?? o[str];
              let outTarget = info2.parent.components;
              output.split(".").forEach((str) => outTarget = getTarget(outTarget, str));
              if (!outTarget) {
                __privateGet(this, _throw).call(this, {
                  message: `Node '${output}' (output) does not exist to create an edge.`,
                  file: url
                });
              }
              for (let input in connections[output]) {
                let inTarget = this.resolved.components;
                input.split(".").forEach((str) => inTarget = getTarget(inTarget, str));
                if (!inTarget) {
                  __privateGet(this, _throw).call(this, {
                    message: `Node '${input}' (input) does not exist to create an edge.`,
                    file: url
                  });
                }
              }
            }
          });
        };
        if (internalLoadCall === void 0) {
          if (clonedOptions.output !== "object") {
            this.plugin = new src_default(this.resolved, {
              activate: clonedOptions.activate,
              parentNode: clonedOptions.parentNode
            });
            return this.plugin;
          } else
            this.original = this.resolved;
          drillToTest(this.resolved);
        }
        return this.resolved;
      }
    };
    this.start = async () => {
      if (this.plugin)
        return await this.plugin.start();
    };
    this.stop = async () => {
      if (this.plugin)
        return await this.plugin.stop();
    };
    this.get = async (...args) => await get_default(args[0], args[1], __privateGet(this, _onImport), __privateGet(this, _options)).catch((e) => e);
    this.resolveSource = async (path, modeOverride, {
      useCache = true,
      mode = "reference"
    } = {}) => {
      const activeMode = modeOverride ?? mode;
      let res = null;
      if (activeMode === "import") {
        if (__privateGet(this, _cache)[path] && useCache) {
          console.warn("Found cached component", path);
          res = __privateGet(this, _cache)[path];
        } else
          res = await this.get(path, void 0);
      } else if (__privateGet(this, _filesystem))
        res = checkFiles(path, __privateGet(this, _filesystem));
      else {
        __privateGet(this, _throw).call(this, {
          message: "No options.filesystem field to get JavaScript objects",
          file: path
        });
      }
      return res;
    };
    this.search = async (input, searchKey = "src", {
      condition = (value) => typeof value === "string",
      onFound = async (o, acc = []) => acc.push(o),
      mainPath,
      nestedKey,
      mode
    }) => {
      const top = input;
      let found;
      const pathMap = {};
      const drill = async (input2, tree = []) => {
        const parentInfo = tree[tree.length - 1];
        const path = tree.map((o) => o.key);
        const graphSlice = path.slice(-3);
        const get2 = (pathInfo = path) => {
          let target = top;
          pathInfo.forEach((str, i) => target = target[str]);
          return target;
        };
        const set = (input3, key = searchKey, pathInfo = path) => {
          let target = top;
          pathInfo.forEach((str, i) => {
            if (!target[str])
              target[str] = {};
            target = target[str];
          });
          target[key] = input3;
        };
        if (condition(input2[searchKey])) {
          const isComponent = graphSlice.slice(-2)[0] === "components";
          let target = pathMap;
          path.forEach((str, i) => target = target[str] ?? target);
          const pathArray = Array.isArray(target) ? path.map((str, i) => target[i] ?? str) : path;
          let o = {
            mainPath,
            mode,
            isComponent,
            paths: {
              original: path,
              remapped: pathArray
            },
            get: get2,
            set,
            key: searchKey,
            value: input2[searchKey],
            setParent: function(input3, path2 = this.paths.remapped, fallbackKey) {
              let target2 = top;
              path2.forEach((str, i) => {
                if (i === path2.length - 1) {
                  if (fallbackKey && target2[str] && Object.keys(target2[str]).length > 1) {
                    console.warn(`Setting ${fallbackKey} instead of replacing parent for ${path2.join(".")}`);
                    target2[str][fallbackKey] = input3;
                  } else
                    target2[str] = input3;
                } else {
                  if (!target2[str])
                    target2[str] = {};
                  target2 = target2[str];
                }
              });
            },
            parent: parentInfo?.reference,
            name: parentInfo?.key
          };
          input2[searchKey] = null;
          if (onFound) {
            const got = await onFound(o, found);
            if (got && typeof got === "object")
              found = got;
          }
        }
        if (nestedKey) {
          const offset = path.length - graphSlice.length;
          for (let key in nestedKey) {
            let i = 0;
            const pattern = nestedKey[key].pattern;
            const match = pattern ? pattern.reduce((a, o) => {
              let str = o?.key ?? o;
              let adjacencies = o?.adjacencies;
              if (typeof str === "string")
                a *= graphSlice[i] === str ? 1 : 0;
              if (adjacencies)
                a *= adjacencies.reduce((a2, str2) => {
                  a2 *= str2 in get2(path.slice(0, offset + i)) ? 1 : 0;
                  return a2;
                }, 1);
              i++;
              return a;
            }, 1) : 1;
            const projection = nestedKey[key].projection ?? pattern;
            if (match) {
              await nestedKey[key].function(input2, {
                get: (key2, additionalPath = []) => get2([...path, ...additionalPath, key2]),
                set: (key2, name2, value, additionalPath = []) => {
                  const base = [...path.slice(0, offset), ...projection.map((str, i2) => !str ? graphSlice[i2] : str)];
                  const passed = [...base, ...additionalPath, name2];
                  set(value, key2, passed);
                  let targets = [
                    {
                      target: pathMap,
                      update: passed,
                      array: graphSlice
                    }
                  ];
                  const create = (target, array) => {
                    array.forEach((str) => {
                      if (!target[str])
                        target[str] = {};
                      target = target[str];
                    });
                    return target;
                  };
                  targets.forEach((o) => {
                    const target = create(o.target, o.array);
                    if (o.update)
                      target[name2] = o.update;
                    o.target = target;
                  });
                },
                delete: () => delete get2([...path])[key]
              });
            }
          }
        }
        for (let key in input2) {
          if (input2[key] && typeof input2[key] === "object" && !(input2[key] instanceof HTMLElement))
            await drill(input2[key], [...tree, { reference: input2, key }]);
        }
      };
      await drill(input);
      return found;
    };
    this.findSources = async (graph, events, opts) => {
      return await this.search(graph, void 0, {
        mode: opts.mode,
        nestedKey: events.nested,
        onFound: async (o, acc = {}) => {
          o.type = "local";
          try {
            new URL(o.value);
            o.type = "remote";
          } catch {
          }
          const isRemote = o.type === "remote";
          const isAbsolute = o.value[0] !== ".";
          const main = o.mainPath || __privateGet(this, _main);
          const rootRelativeTo = __privateGet(this, _options).relativeTo;
          const isMainAbsolute = main?.[0] !== ".";
          let absoluteMain;
          if (!main)
            absoluteMain = rootRelativeTo;
          if (isMainAbsolute)
            absoluteMain = main;
          else
            absoluteMain = main.includes(rootRelativeTo) ? main : Ze(main, rootRelativeTo);
          if (isRemote)
            o.path = o.value;
          else if (isAbsolute)
            o.path = await C.resolve(o.value, {
              rootRelativeTo,
              nodeModules: __privateGet(this, _options).nodeModules
            });
          else {
            if (main) {
              o.path = Ze(o.value, absoluteMain);
              o.id = Ze(o.value, main);
            } else
              o.path = o.id = Ze(o.value);
          }
          if (isRemote || isAbsolute)
            o.id = o.path;
          if (isRemote)
            o.mode = "import";
          const ext = o.value.split("/").pop().split(".").slice(1).join(".");
          if (ext === "wasl.json") {
            if (events.components)
              await events.components(o);
            return null;
          } else {
            if (!acc[ext])
              acc[ext] = {};
            if (!acc[ext][o.path])
              acc[ext][o.path] = [];
            acc[ext][o.path].push(o);
            return acc;
          }
        },
        mainPath: opts.mainPath
      });
    };
    this.resolve = async (graph, context, opts = {}) => {
      const remote = [];
      const nested = [];
      const foundInternal = {};
      const events = {
        components: (info2) => this.handleComponent(info2, events, context, opts, remote, foundInternal),
        nested: {
          overrides: {
            pattern: ["components", null, { key: "overrides", adjacencies: ["src"] }],
            projection: ["components", null, "components"],
            function: (value, info2) => this.handleOverride(value, info2, nested),
            update: (o, info2) => {
              o.mainPath = info2.path;
            }
          }
        }
      };
      const found = await this.findSources(graph, events, context) ?? {};
      this.flattenInto(foundInternal, found);
      const tic = performance.now();
      const total = Object.keys(found).reduce((acc, key) => acc + Object.keys(found[key]).length, 0);
      let i = 0;
      await Promise.all(Object.values(found).map(async (typeInfo) => {
        await Promise.all(Object.entries(typeInfo).map(async ([path, pathInfo]) => {
          const res = await this.resolveSource(path, pathInfo[0].mode);
          await Promise.all(pathInfo.map(async (info2) => await this.handleResolved(res, info2)));
          i++;
          const pathId = et.pathId(path, __privateGet(this, _options));
          if (opts.callbacks?.progress?.source instanceof Function)
            opts.callbacks.progress?.source(pathId, i, total);
        }));
      }));
      const toc = performance.now();
      console.log("Resolved", total, "sources in", toc - tic, "ms");
      return graph;
    };
    this.updateContext = (info2, context) => {
      return {
        ...context,
        mainPath: info2.path,
        mode: info2.type === "remote" ? "import" : context.mode
      };
    };
    this.flattenInto = (o1, o2) => {
      for (let type in o1) {
        for (let path in o1[type]) {
          if (!o2[type])
            o2[type] = {};
          if (!o2[type][path])
            o2[type][path] = [];
          o2[type][path].push(...o1[type][path]);
        }
      }
    };
    this.handleResolved = (res, info2) => {
      const ogSrc = info2.value;
      const name2 = info2.name;
      const isError = res instanceof Error;
      const isModule = res && (!!Object.keys(res).reduce((a, b2) => {
        const desc = Object.getOwnPropertyDescriptor(res, b2);
        const isModule2 = desc && desc.get && !desc.set ? 1 : 0;
        return a + isModule2;
      }, 0) || Object.prototype.toString.call(res) === moduleStringTag);
      const isWASL = info2.path.includes("wasl.json");
      const deepSource = (!isModule || !info2.isComponent) && !isWASL;
      const handlers = {
        _format: {
          "path": info2.path,
          "datauri": res,
          "object": res
        }
      };
      const parent = info2.parent[info2.name];
      for (let name3 in handlers._format) {
        if (parent._format === name3)
          res = handlers._format[name3];
        delete parent[name3];
      }
      if (!res || isError) {
        remove(ogSrc, info2.id, name2, deepSource ? void 0 : info2.parent, res);
        if (res)
          __privateGet(this, _throw).call(this, { message: res.message, file: info2.path, type: "warning" });
        return;
      }
      if (res !== void 0) {
        if (deepSource)
          info2.setParent(isModule && res.default ? res.default : res, void 0, info2.key);
        else {
          info2.set(res);
          const ref = info2.get();
          info2.setParent(merge(ref[info2.key], ref));
        }
        return res;
      }
    };
    this.handleComponent = async (info2, events, context, opts, acc = [], list = {}) => {
      const newContext = this.updateContext(info2, context);
      info2.mode = newContext.mode;
      const res = await this.resolveSource(info2.path, info2.mode, newContext);
      if (!res) {
        console.error("Not resolved", info2.path, info2);
        return;
      }
      const found = await this.findSources(res, events, newContext);
      if (opts.callbacks?.progress.components instanceof Function)
        opts.callbacks.progress.components(info2.path, acc.length, res);
      if (found)
        this.flattenInto(found, list);
      await this.handleResolved(res, info2);
      acc.push(info2);
      return acc;
    };
    this.handleOverride = async (value, info2, acc = [], pathUpdate = []) => {
      for (let nestedName in value) {
        const nestedNode = info2.get(nestedName, pathUpdate);
        if (nestedNode) {
          for (let key in value[nestedName]) {
            if (key === "components")
              this.handleOverride(value[nestedName][key], info2, [], [...pathUpdate, nestedName, key]);
            else {
              const newInfo = value[nestedName][key];
              if (newInfo)
                info2.set(key, nestedName, newInfo, pathUpdate);
            }
          }
        } else
          __privateGet(this, _throw).call(this, {
            message: `Plugin target '${nestedName}' does not exist`,
            node: name
          });
        acc.push(value);
      }
      return acc;
      info2.delete();
    };
    __privateSet(this, _input, urlOrObject);
    __privateSet(this, _options, options);
    __privateSet(this, _url, url);
  }
};
_filesystem = new WeakMap();
_input = new WeakMap();
_options = new WeakMap();
_url = new WeakMap();
_cache = new WeakMap();
_main = new WeakMap();
_mode = new WeakMap();
_onImport = new WeakMap();
_throw = new WeakMap();
var core_default = WASL;
export {
  core_default as default
};
