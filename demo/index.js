(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x3) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x3, {
    get: (a3, b3) => (typeof require !== "undefined" ? require : a3)[b3]
  }) : x3)(function(x3) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x3 + '" is not supported');
  });
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name2 in all)
      __defProp(target, name2, { get: all[name2], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/blob-polyfill/Blob.js
  var require_Blob = __commonJS({
    "node_modules/blob-polyfill/Blob.js"(exports) {
      (function(global2) {
        (function(factory) {
          if (typeof define === "function" && define.amd) {
            define(["exports"], factory);
          } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
            factory(exports);
          } else {
            factory(global2);
          }
        })(function(exports2) {
          "use strict";
          var BlobBuilder = global2.BlobBuilder || global2.WebKitBlobBuilder || global2.MSBlobBuilder || global2.MozBlobBuilder;
          var URL2 = global2.URL || global2.webkitURL || function(href, a3) {
            a3 = document.createElement("a");
            a3.href = href;
            return a3;
          };
          var origBlob = global2.Blob;
          var createObjectURL = URL2.createObjectURL;
          var revokeObjectURL = URL2.revokeObjectURL;
          var strTag = global2.Symbol && global2.Symbol.toStringTag;
          var blobSupported = false;
          var blobSupportsArrayBufferView = false;
          var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;
          try {
            blobSupported = new Blob(["\xE4"]).size === 2;
            blobSupportsArrayBufferView = new Blob([new Uint8Array([1, 2])]).size === 2;
          } catch (e3) {
          }
          function mapArrayBufferViews(ary) {
            return ary.map(function(chunk) {
              if (chunk.buffer instanceof ArrayBuffer) {
                var buf = chunk.buffer;
                if (chunk.byteLength !== buf.byteLength) {
                  var copy = new Uint8Array(chunk.byteLength);
                  copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
                  buf = copy.buffer;
                }
                return buf;
              }
              return chunk;
            });
          }
          function BlobBuilderConstructor(ary, options2) {
            options2 = options2 || {};
            var bb = new BlobBuilder();
            mapArrayBufferViews(ary).forEach(function(part) {
              bb.append(part);
            });
            return options2.type ? bb.getBlob(options2.type) : bb.getBlob();
          }
          function BlobConstructor(ary, options2) {
            return new origBlob(mapArrayBufferViews(ary), options2 || {});
          }
          if (global2.Blob) {
            BlobBuilderConstructor.prototype = Blob.prototype;
            BlobConstructor.prototype = Blob.prototype;
          }
          function stringEncode(string) {
            var pos = 0;
            var len = string.length;
            var Arr = global2.Uint8Array || Array;
            var at3 = 0;
            var tlen = Math.max(32, len + (len >> 1) + 7);
            var target = new Arr(tlen >> 3 << 3);
            while (pos < len) {
              var value = string.charCodeAt(pos++);
              if (value >= 55296 && value <= 56319) {
                if (pos < len) {
                  var extra = string.charCodeAt(pos);
                  if ((extra & 64512) === 56320) {
                    ++pos;
                    value = ((value & 1023) << 10) + (extra & 1023) + 65536;
                  }
                }
                if (value >= 55296 && value <= 56319) {
                  continue;
                }
              }
              if (at3 + 4 > target.length) {
                tlen += 8;
                tlen *= 1 + pos / string.length * 2;
                tlen = tlen >> 3 << 3;
                var update = new Uint8Array(tlen);
                update.set(target);
                target = update;
              }
              if ((value & 4294967168) === 0) {
                target[at3++] = value;
                continue;
              } else if ((value & 4294965248) === 0) {
                target[at3++] = value >> 6 & 31 | 192;
              } else if ((value & 4294901760) === 0) {
                target[at3++] = value >> 12 & 15 | 224;
                target[at3++] = value >> 6 & 63 | 128;
              } else if ((value & 4292870144) === 0) {
                target[at3++] = value >> 18 & 7 | 240;
                target[at3++] = value >> 12 & 63 | 128;
                target[at3++] = value >> 6 & 63 | 128;
              } else {
                continue;
              }
              target[at3++] = value & 63 | 128;
            }
            return target.slice(0, at3);
          }
          function stringDecode(buf) {
            var end = buf.length;
            var res = [];
            var i3 = 0;
            while (i3 < end) {
              var firstByte = buf[i3];
              var codePoint = null;
              var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
              if (i3 + bytesPerSequence <= end) {
                var secondByte, thirdByte, fourthByte, tempCodePoint;
                switch (bytesPerSequence) {
                  case 1:
                    if (firstByte < 128) {
                      codePoint = firstByte;
                    }
                    break;
                  case 2:
                    secondByte = buf[i3 + 1];
                    if ((secondByte & 192) === 128) {
                      tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                      if (tempCodePoint > 127) {
                        codePoint = tempCodePoint;
                      }
                    }
                    break;
                  case 3:
                    secondByte = buf[i3 + 1];
                    thirdByte = buf[i3 + 2];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                      tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                      if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                        codePoint = tempCodePoint;
                      }
                    }
                    break;
                  case 4:
                    secondByte = buf[i3 + 1];
                    thirdByte = buf[i3 + 2];
                    fourthByte = buf[i3 + 3];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                      tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                      if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                        codePoint = tempCodePoint;
                      }
                    }
                }
              }
              if (codePoint === null) {
                codePoint = 65533;
                bytesPerSequence = 1;
              } else if (codePoint > 65535) {
                codePoint -= 65536;
                res.push(codePoint >>> 10 & 1023 | 55296);
                codePoint = 56320 | codePoint & 1023;
              }
              res.push(codePoint);
              i3 += bytesPerSequence;
            }
            var len = res.length;
            var str = "";
            var j3 = 0;
            while (j3 < len) {
              str += String.fromCharCode.apply(String, res.slice(j3, j3 += 4096));
            }
            return str;
          }
          var textEncode = typeof TextEncoder === "function" ? TextEncoder.prototype.encode.bind(new TextEncoder()) : stringEncode;
          var textDecode = typeof TextDecoder === "function" ? TextDecoder.prototype.decode.bind(new TextDecoder()) : stringDecode;
          function FakeBlobBuilder() {
            function bufferClone(buf) {
              var view = new Array(buf.byteLength);
              var array = new Uint8Array(buf);
              var i3 = view.length;
              while (i3--) {
                view[i3] = array[i3];
              }
              return view;
            }
            function array2base64(input) {
              var byteToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
              var output = [];
              for (var i3 = 0; i3 < input.length; i3 += 3) {
                var byte1 = input[i3];
                var haveByte2 = i3 + 1 < input.length;
                var byte2 = haveByte2 ? input[i3 + 1] : 0;
                var haveByte3 = i3 + 2 < input.length;
                var byte3 = haveByte3 ? input[i3 + 2] : 0;
                var outByte1 = byte1 >> 2;
                var outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
                var outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
                var outByte4 = byte3 & 63;
                if (!haveByte3) {
                  outByte4 = 64;
                  if (!haveByte2) {
                    outByte3 = 64;
                  }
                }
                output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
              }
              return output.join("");
            }
            var create = Object.create || function(a3) {
              function c3() {
              }
              c3.prototype = a3;
              return new c3();
            };
            function getObjectTypeName(o3) {
              return Object.prototype.toString.call(o3).slice(8, -1);
            }
            function isPrototypeOf(c3, o3) {
              return typeof c3 === "object" && Object.prototype.isPrototypeOf.call(c3.prototype, o3);
            }
            function isDataView(o3) {
              return getObjectTypeName(o3) === "DataView" || isPrototypeOf(global2.DataView, o3);
            }
            var arrayBufferClassNames = [
              "Int8Array",
              "Uint8Array",
              "Uint8ClampedArray",
              "Int16Array",
              "Uint16Array",
              "Int32Array",
              "Uint32Array",
              "Float32Array",
              "Float64Array",
              "ArrayBuffer"
            ];
            function includes(a3, v3) {
              return a3.indexOf(v3) !== -1;
            }
            function isArrayBuffer(o3) {
              return includes(arrayBufferClassNames, getObjectTypeName(o3)) || isPrototypeOf(global2.ArrayBuffer, o3);
            }
            function concatTypedarrays(chunks) {
              var size = 0;
              var j3 = chunks.length;
              while (j3--) {
                size += chunks[j3].length;
              }
              var b3 = new Uint8Array(size);
              var offset = 0;
              for (var i3 = 0; i3 < chunks.length; i3++) {
                var chunk = chunks[i3];
                b3.set(chunk, offset);
                offset += chunk.byteLength || chunk.length;
              }
              return b3;
            }
            function Blob3(chunks, opts) {
              chunks = chunks || [];
              opts = opts == null ? {} : opts;
              for (var i3 = 0, len = chunks.length; i3 < len; i3++) {
                var chunk = chunks[i3];
                if (chunk instanceof Blob3) {
                  chunks[i3] = chunk._buffer;
                } else if (typeof chunk === "string") {
                  chunks[i3] = textEncode(chunk);
                } else if (isDataView(chunk)) {
                  chunks[i3] = bufferClone(chunk.buffer);
                } else if (isArrayBuffer(chunk)) {
                  chunks[i3] = bufferClone(chunk);
                } else {
                  chunks[i3] = textEncode(String(chunk));
                }
              }
              this._buffer = global2.Uint8Array ? concatTypedarrays(chunks) : [].concat.apply([], chunks);
              this.size = this._buffer.length;
              this.type = opts.type || "";
              if (/[^\u0020-\u007E]/.test(this.type)) {
                this.type = "";
              } else {
                this.type = this.type.toLowerCase();
              }
            }
            Blob3.prototype.arrayBuffer = function() {
              return Promise.resolve(this._buffer.buffer || this._buffer);
            };
            Blob3.prototype.text = function() {
              return Promise.resolve(textDecode(this._buffer));
            };
            Blob3.prototype.slice = function(start, end, type) {
              var slice = this._buffer.slice(start || 0, end || this._buffer.length);
              return new Blob3([slice], { type });
            };
            Blob3.prototype.toString = function() {
              return "[object Blob]";
            };
            function File2(chunks, name2, opts) {
              opts = opts || {};
              var a3 = Blob3.call(this, chunks, opts) || this;
              a3.name = name2.replace(/\//g, ":");
              a3.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date();
              a3.lastModified = +a3.lastModifiedDate;
              return a3;
            }
            File2.prototype = create(Blob3.prototype);
            File2.prototype.constructor = File2;
            if (Object.setPrototypeOf) {
              Object.setPrototypeOf(File2, Blob3);
            } else {
              try {
                File2.__proto__ = Blob3;
              } catch (e3) {
              }
            }
            File2.prototype.toString = function() {
              return "[object File]";
            };
            function FileReader2() {
              if (!(this instanceof FileReader2)) {
                throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
              }
              var delegate = document.createDocumentFragment();
              this.addEventListener = delegate.addEventListener;
              this.dispatchEvent = function(evt) {
                var local = this["on" + evt.type];
                if (typeof local === "function")
                  local(evt);
                delegate.dispatchEvent(evt);
              };
              this.removeEventListener = delegate.removeEventListener;
            }
            function _read(fr2, blob2, kind) {
              if (!(blob2 instanceof Blob3)) {
                throw new TypeError("Failed to execute '" + kind + "' on 'FileReader': parameter 1 is not of type 'Blob'.");
              }
              fr2.result = "";
              setTimeout(function() {
                this.readyState = FileReader2.LOADING;
                fr2.dispatchEvent(new Event("load"));
                fr2.dispatchEvent(new Event("loadend"));
              });
            }
            FileReader2.EMPTY = 0;
            FileReader2.LOADING = 1;
            FileReader2.DONE = 2;
            FileReader2.prototype.error = null;
            FileReader2.prototype.onabort = null;
            FileReader2.prototype.onerror = null;
            FileReader2.prototype.onload = null;
            FileReader2.prototype.onloadend = null;
            FileReader2.prototype.onloadstart = null;
            FileReader2.prototype.onprogress = null;
            FileReader2.prototype.readAsDataURL = function(blob2) {
              _read(this, blob2, "readAsDataURL");
              this.result = "data:" + blob2.type + ";base64," + array2base64(blob2._buffer);
            };
            FileReader2.prototype.readAsText = function(blob2) {
              _read(this, blob2, "readAsText");
              this.result = textDecode(blob2._buffer);
            };
            FileReader2.prototype.readAsArrayBuffer = function(blob2) {
              _read(this, blob2, "readAsText");
              this.result = (blob2._buffer.buffer || blob2._buffer).slice();
            };
            FileReader2.prototype.abort = function() {
            };
            URL2.createObjectURL = function(blob2) {
              return blob2 instanceof Blob3 ? "data:" + blob2.type + ";base64," + array2base64(blob2._buffer) : createObjectURL.call(URL2, blob2);
            };
            URL2.revokeObjectURL = function(url) {
              revokeObjectURL && revokeObjectURL.call(URL2, url);
            };
            var _send = global2.XMLHttpRequest && global2.XMLHttpRequest.prototype.send;
            if (_send) {
              XMLHttpRequest.prototype.send = function(data) {
                if (data instanceof Blob3) {
                  this.setRequestHeader("Content-Type", data.type);
                  _send.call(this, textDecode(data._buffer));
                } else {
                  _send.call(this, data);
                }
              };
            }
            exports2.Blob = Blob3;
            exports2.File = File2;
            exports2.FileReader = FileReader2;
            exports2.URL = URL2;
          }
          function fixFileAndXHR() {
            var isIE = !!global2.ActiveXObject || "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style;
            var _send = global2.XMLHttpRequest && global2.XMLHttpRequest.prototype.send;
            if (isIE && _send) {
              XMLHttpRequest.prototype.send = function(data) {
                if (data instanceof Blob) {
                  this.setRequestHeader("Content-Type", data.type);
                  _send.call(this, data);
                } else {
                  _send.call(this, data);
                }
              };
            }
            try {
              new File([], "");
              exports2.File = global2.File;
              exports2.FileReader = global2.FileReader;
            } catch (e3) {
              try {
                exports2.File = new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name.replace(/\\//g, ":");this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date();this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();
              } catch (e4) {
                exports2.File = function(b3, d3, c3) {
                  var blob2 = new Blob(b3, c3);
                  var t9 = c3 && void 0 !== c3.lastModified ? new Date(c3.lastModified) : new Date();
                  blob2.name = d3.replace(/\//g, ":");
                  blob2.lastModifiedDate = t9;
                  blob2.lastModified = +t9;
                  blob2.toString = function() {
                    return "[object File]";
                  };
                  if (strTag) {
                    blob2[strTag] = "File";
                  }
                  return blob2;
                };
              }
            }
          }
          if (blobSupported) {
            fixFileAndXHR();
            exports2.Blob = blobSupportsArrayBufferView ? global2.Blob : BlobConstructor;
          } else if (blobBuilderSupported) {
            fixFileAndXHR();
            exports2.Blob = BlobBuilderConstructor;
          } else {
            FakeBlobBuilder();
          }
          if (strTag) {
            if (!exports2.File.prototype[strTag])
              exports2.File.prototype[strTag] = "File";
            if (!exports2.Blob.prototype[strTag])
              exports2.Blob.prototype[strTag] = "Blob";
            if (!exports2.FileReader.prototype[strTag])
              exports2.FileReader.prototype[strTag] = "FileReader";
          }
          var blob = exports2.Blob.prototype;
          var stream;
          try {
            new ReadableStream({ type: "bytes" });
            stream = function stream2() {
              var position = 0;
              var blob2 = this;
              return new ReadableStream({
                type: "bytes",
                autoAllocateChunkSize: 524288,
                pull: function(controller) {
                  var v3 = controller.byobRequest.view;
                  var chunk = blob2.slice(position, position + v3.byteLength);
                  return chunk.arrayBuffer().then(function(buffer) {
                    var uint8array = new Uint8Array(buffer);
                    var bytesRead = uint8array.byteLength;
                    position += bytesRead;
                    v3.set(uint8array);
                    controller.byobRequest.respond(bytesRead);
                    if (position >= blob2.size)
                      controller.close();
                  });
                }
              });
            };
          } catch (e3) {
            try {
              new ReadableStream({});
              stream = function stream2(blob2) {
                var position = 0;
                return new ReadableStream({
                  pull: function(controller) {
                    var chunk = blob2.slice(position, position + 524288);
                    return chunk.arrayBuffer().then(function(buffer) {
                      position += buffer.byteLength;
                      var uint8array = new Uint8Array(buffer);
                      controller.enqueue(uint8array);
                      if (position == blob2.size)
                        controller.close();
                    });
                  }
                });
              };
            } catch (e4) {
              try {
                new Response("").body.getReader().read();
                stream = function stream2() {
                  return new Response(this).body;
                };
              } catch (e5) {
                stream = function stream2() {
                  throw new Error("Include https://github.com/MattiasBuelens/web-streams-polyfill");
                };
              }
            }
          }
          function promisify(obj) {
            return new Promise(function(resolve2, reject) {
              obj.onload = obj.onerror = function(evt) {
                obj.onload = obj.onerror = null;
                evt.type === "load" ? resolve2(obj.result || obj) : reject(new Error("Failed to read the blob/file"));
              };
            });
          }
          if (!blob.arrayBuffer) {
            blob.arrayBuffer = function arrayBuffer() {
              var fr2 = new FileReader();
              fr2.readAsArrayBuffer(this);
              return promisify(fr2);
            };
          }
          if (!blob.text) {
            blob.text = function text() {
              var fr2 = new FileReader();
              fr2.readAsText(this);
              return promisify(fr2);
            };
          }
          if (!blob.stream) {
            blob.stream = stream;
          }
        });
      })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || exports);
    }
  });

  // node_modules/cross-blob/browser.js
  var browser_exports = {};
  __export(browser_exports, {
    default: () => browser_default
  });
  var import_blob_polyfill, browser_default;
  var init_browser = __esm({
    "node_modules/cross-blob/browser.js"() {
      import_blob_polyfill = __toESM(require_Blob(), 1);
      browser_default = import_blob_polyfill.Blob;
    }
  });

  // node_modules/ajv/dist/compile/codegen/code.js
  var require_code = __commonJS({
    "node_modules/ajv/dist/compile/codegen/code.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
      var _CodeOrName = class {
      };
      exports._CodeOrName = _CodeOrName;
      exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
      var Name = class extends _CodeOrName {
        constructor(s3) {
          super();
          if (!exports.IDENTIFIER.test(s3))
            throw new Error("CodeGen: name must be a valid identifier");
          this.str = s3;
        }
        toString() {
          return this.str;
        }
        emptyStr() {
          return false;
        }
        get names() {
          return { [this.str]: 1 };
        }
      };
      exports.Name = Name;
      var _Code = class extends _CodeOrName {
        constructor(code) {
          super();
          this._items = typeof code === "string" ? [code] : code;
        }
        toString() {
          return this.str;
        }
        emptyStr() {
          if (this._items.length > 1)
            return false;
          const item = this._items[0];
          return item === "" || item === '""';
        }
        get str() {
          var _a;
          return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s3, c3) => `${s3}${c3}`, "");
        }
        get names() {
          var _a;
          return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c3) => {
            if (c3 instanceof Name)
              names[c3.str] = (names[c3.str] || 0) + 1;
            return names;
          }, {});
        }
      };
      exports._Code = _Code;
      exports.nil = new _Code("");
      function _3(strs, ...args) {
        const code = [strs[0]];
        let i3 = 0;
        while (i3 < args.length) {
          addCodeArg(code, args[i3]);
          code.push(strs[++i3]);
        }
        return new _Code(code);
      }
      exports._ = _3;
      var plus = new _Code("+");
      function str(strs, ...args) {
        const expr = [safeStringify2(strs[0])];
        let i3 = 0;
        while (i3 < args.length) {
          expr.push(plus);
          addCodeArg(expr, args[i3]);
          expr.push(plus, safeStringify2(strs[++i3]));
        }
        optimize(expr);
        return new _Code(expr);
      }
      exports.str = str;
      function addCodeArg(code, arg) {
        if (arg instanceof _Code)
          code.push(...arg._items);
        else if (arg instanceof Name)
          code.push(arg);
        else
          code.push(interpolate(arg));
      }
      exports.addCodeArg = addCodeArg;
      function optimize(expr) {
        let i3 = 1;
        while (i3 < expr.length - 1) {
          if (expr[i3] === plus) {
            const res = mergeExprItems(expr[i3 - 1], expr[i3 + 1]);
            if (res !== void 0) {
              expr.splice(i3 - 1, 3, res);
              continue;
            }
            expr[i3++] = "+";
          }
          i3++;
        }
      }
      function mergeExprItems(a3, b3) {
        if (b3 === '""')
          return a3;
        if (a3 === '""')
          return b3;
        if (typeof a3 == "string") {
          if (b3 instanceof Name || a3[a3.length - 1] !== '"')
            return;
          if (typeof b3 != "string")
            return `${a3.slice(0, -1)}${b3}"`;
          if (b3[0] === '"')
            return a3.slice(0, -1) + b3.slice(1);
          return;
        }
        if (typeof b3 == "string" && b3[0] === '"' && !(a3 instanceof Name))
          return `"${a3}${b3.slice(1)}`;
        return;
      }
      function strConcat(c1, c22) {
        return c22.emptyStr() ? c1 : c1.emptyStr() ? c22 : str`${c1}${c22}`;
      }
      exports.strConcat = strConcat;
      function interpolate(x3) {
        return typeof x3 == "number" || typeof x3 == "boolean" || x3 === null ? x3 : safeStringify2(Array.isArray(x3) ? x3.join(",") : x3);
      }
      function stringify2(x3) {
        return new _Code(safeStringify2(x3));
      }
      exports.stringify = stringify2;
      function safeStringify2(x3) {
        return JSON.stringify(x3).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
      }
      exports.safeStringify = safeStringify2;
      function getProperty(key) {
        return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _3`[${key}]`;
      }
      exports.getProperty = getProperty;
      function getEsmExportName(key) {
        if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
          return new _Code(`${key}`);
        }
        throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
      }
      exports.getEsmExportName = getEsmExportName;
      function regexpCode(rx) {
        return new _Code(rx.toString());
      }
      exports.regexpCode = regexpCode;
    }
  });

  // node_modules/ajv/dist/compile/codegen/scope.js
  var require_scope = __commonJS({
    "node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
      var code_1 = require_code();
      var ValueError = class extends Error {
        constructor(name2) {
          super(`CodeGen: "code" for ${name2} not defined`);
          this.value = name2.value;
        }
      };
      var UsedValueState;
      (function(UsedValueState2) {
        UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
        UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
      })(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
      exports.varKinds = {
        const: new code_1.Name("const"),
        let: new code_1.Name("let"),
        var: new code_1.Name("var")
      };
      var Scope = class {
        constructor({ prefixes, parent } = {}) {
          this._names = {};
          this._prefixes = prefixes;
          this._parent = parent;
        }
        toName(nameOrPrefix) {
          return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
        }
        name(prefix) {
          return new code_1.Name(this._newName(prefix));
        }
        _newName(prefix) {
          const ng = this._names[prefix] || this._nameGroup(prefix);
          return `${prefix}${ng.index++}`;
        }
        _nameGroup(prefix) {
          var _a, _b;
          if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
            throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
          }
          return this._names[prefix] = { prefix, index: 0 };
        }
      };
      exports.Scope = Scope;
      var ValueScopeName = class extends code_1.Name {
        constructor(prefix, nameStr) {
          super(nameStr);
          this.prefix = prefix;
        }
        setValue(value, { property, itemIndex }) {
          this.value = value;
          this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
        }
      };
      exports.ValueScopeName = ValueScopeName;
      var line = (0, code_1._)`\n`;
      var ValueScope = class extends Scope {
        constructor(opts) {
          super(opts);
          this._values = {};
          this._scope = opts.scope;
          this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
        }
        get() {
          return this._scope;
        }
        name(prefix) {
          return new ValueScopeName(prefix, this._newName(prefix));
        }
        value(nameOrPrefix, value) {
          var _a;
          if (value.ref === void 0)
            throw new Error("CodeGen: ref must be passed in value");
          const name2 = this.toName(nameOrPrefix);
          const { prefix } = name2;
          const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
          let vs = this._values[prefix];
          if (vs) {
            const _name = vs.get(valueKey);
            if (_name)
              return _name;
          } else {
            vs = this._values[prefix] = /* @__PURE__ */ new Map();
          }
          vs.set(valueKey, name2);
          const s3 = this._scope[prefix] || (this._scope[prefix] = []);
          const itemIndex = s3.length;
          s3[itemIndex] = value.ref;
          name2.setValue(value, { property: prefix, itemIndex });
          return name2;
        }
        getValue(prefix, keyOrRef) {
          const vs = this._values[prefix];
          if (!vs)
            return;
          return vs.get(keyOrRef);
        }
        scopeRefs(scopeName, values = this._values) {
          return this._reduceValues(values, (name2) => {
            if (name2.scopePath === void 0)
              throw new Error(`CodeGen: name "${name2}" has no value`);
            return (0, code_1._)`${scopeName}${name2.scopePath}`;
          });
        }
        scopeCode(values = this._values, usedValues, getCode) {
          return this._reduceValues(values, (name2) => {
            if (name2.value === void 0)
              throw new Error(`CodeGen: name "${name2}" has no value`);
            return name2.value.code;
          }, usedValues, getCode);
        }
        _reduceValues(values, valueCode, usedValues = {}, getCode) {
          let code = code_1.nil;
          for (const prefix in values) {
            const vs = values[prefix];
            if (!vs)
              continue;
            const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
            vs.forEach((name2) => {
              if (nameSet.has(name2))
                return;
              nameSet.set(name2, UsedValueState.Started);
              let c3 = valueCode(name2);
              if (c3) {
                const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
                code = (0, code_1._)`${code}${def} ${name2} = ${c3};${this.opts._n}`;
              } else if (c3 = getCode === null || getCode === void 0 ? void 0 : getCode(name2)) {
                code = (0, code_1._)`${code}${c3}${this.opts._n}`;
              } else {
                throw new ValueError(name2);
              }
              nameSet.set(name2, UsedValueState.Completed);
            });
          }
          return code;
        }
      };
      exports.ValueScope = ValueScope;
    }
  });

  // node_modules/ajv/dist/compile/codegen/index.js
  var require_codegen = __commonJS({
    "node_modules/ajv/dist/compile/codegen/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
      var code_1 = require_code();
      var scope_1 = require_scope();
      var code_2 = require_code();
      Object.defineProperty(exports, "_", { enumerable: true, get: function() {
        return code_2._;
      } });
      Object.defineProperty(exports, "str", { enumerable: true, get: function() {
        return code_2.str;
      } });
      Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
        return code_2.strConcat;
      } });
      Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
        return code_2.nil;
      } });
      Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
        return code_2.getProperty;
      } });
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return code_2.stringify;
      } });
      Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
        return code_2.regexpCode;
      } });
      Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
        return code_2.Name;
      } });
      var scope_2 = require_scope();
      Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
        return scope_2.Scope;
      } });
      Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
        return scope_2.ValueScope;
      } });
      Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
        return scope_2.ValueScopeName;
      } });
      Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
        return scope_2.varKinds;
      } });
      exports.operators = {
        GT: new code_1._Code(">"),
        GTE: new code_1._Code(">="),
        LT: new code_1._Code("<"),
        LTE: new code_1._Code("<="),
        EQ: new code_1._Code("==="),
        NEQ: new code_1._Code("!=="),
        NOT: new code_1._Code("!"),
        OR: new code_1._Code("||"),
        AND: new code_1._Code("&&"),
        ADD: new code_1._Code("+")
      };
      var Node = class {
        optimizeNodes() {
          return this;
        }
        optimizeNames(_names, _constants) {
          return this;
        }
      };
      var Def = class extends Node {
        constructor(varKind, name2, rhs) {
          super();
          this.varKind = varKind;
          this.name = name2;
          this.rhs = rhs;
        }
        render({ es5, _n: _n2 }) {
          const varKind = es5 ? scope_1.varKinds.var : this.varKind;
          const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
          return `${varKind} ${this.name}${rhs};` + _n2;
        }
        optimizeNames(names, constants) {
          if (!names[this.name.str])
            return;
          if (this.rhs)
            this.rhs = optimizeExpr(this.rhs, names, constants);
          return this;
        }
        get names() {
          return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
        }
      };
      var Assign = class extends Node {
        constructor(lhs, rhs, sideEffects) {
          super();
          this.lhs = lhs;
          this.rhs = rhs;
          this.sideEffects = sideEffects;
        }
        render({ _n: _n2 }) {
          return `${this.lhs} = ${this.rhs};` + _n2;
        }
        optimizeNames(names, constants) {
          if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
            return;
          this.rhs = optimizeExpr(this.rhs, names, constants);
          return this;
        }
        get names() {
          const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
          return addExprNames(names, this.rhs);
        }
      };
      var AssignOp = class extends Assign {
        constructor(lhs, op, rhs, sideEffects) {
          super(lhs, rhs, sideEffects);
          this.op = op;
        }
        render({ _n: _n2 }) {
          return `${this.lhs} ${this.op}= ${this.rhs};` + _n2;
        }
      };
      var Label = class extends Node {
        constructor(label) {
          super();
          this.label = label;
          this.names = {};
        }
        render({ _n: _n2 }) {
          return `${this.label}:` + _n2;
        }
      };
      var Break = class extends Node {
        constructor(label) {
          super();
          this.label = label;
          this.names = {};
        }
        render({ _n: _n2 }) {
          const label = this.label ? ` ${this.label}` : "";
          return `break${label};` + _n2;
        }
      };
      var Throw = class extends Node {
        constructor(error) {
          super();
          this.error = error;
        }
        render({ _n: _n2 }) {
          return `throw ${this.error};` + _n2;
        }
        get names() {
          return this.error.names;
        }
      };
      var AnyCode = class extends Node {
        constructor(code) {
          super();
          this.code = code;
        }
        render({ _n: _n2 }) {
          return `${this.code};` + _n2;
        }
        optimizeNodes() {
          return `${this.code}` ? this : void 0;
        }
        optimizeNames(names, constants) {
          this.code = optimizeExpr(this.code, names, constants);
          return this;
        }
        get names() {
          return this.code instanceof code_1._CodeOrName ? this.code.names : {};
        }
      };
      var ParentNode = class extends Node {
        constructor(nodes = []) {
          super();
          this.nodes = nodes;
        }
        render(opts) {
          return this.nodes.reduce((code, n3) => code + n3.render(opts), "");
        }
        optimizeNodes() {
          const { nodes } = this;
          let i3 = nodes.length;
          while (i3--) {
            const n3 = nodes[i3].optimizeNodes();
            if (Array.isArray(n3))
              nodes.splice(i3, 1, ...n3);
            else if (n3)
              nodes[i3] = n3;
            else
              nodes.splice(i3, 1);
          }
          return nodes.length > 0 ? this : void 0;
        }
        optimizeNames(names, constants) {
          const { nodes } = this;
          let i3 = nodes.length;
          while (i3--) {
            const n3 = nodes[i3];
            if (n3.optimizeNames(names, constants))
              continue;
            subtractNames(names, n3.names);
            nodes.splice(i3, 1);
          }
          return nodes.length > 0 ? this : void 0;
        }
        get names() {
          return this.nodes.reduce((names, n3) => addNames(names, n3.names), {});
        }
      };
      var BlockNode = class extends ParentNode {
        render(opts) {
          return "{" + opts._n + super.render(opts) + "}" + opts._n;
        }
      };
      var Root = class extends ParentNode {
      };
      var Else = class extends BlockNode {
      };
      Else.kind = "else";
      var If = class extends BlockNode {
        constructor(condition, nodes) {
          super(nodes);
          this.condition = condition;
        }
        render(opts) {
          let code = `if(${this.condition})` + super.render(opts);
          if (this.else)
            code += "else " + this.else.render(opts);
          return code;
        }
        optimizeNodes() {
          super.optimizeNodes();
          const cond = this.condition;
          if (cond === true)
            return this.nodes;
          let e3 = this.else;
          if (e3) {
            const ns = e3.optimizeNodes();
            e3 = this.else = Array.isArray(ns) ? new Else(ns) : ns;
          }
          if (e3) {
            if (cond === false)
              return e3 instanceof If ? e3 : e3.nodes;
            if (this.nodes.length)
              return this;
            return new If(not(cond), e3 instanceof If ? [e3] : e3.nodes);
          }
          if (cond === false || !this.nodes.length)
            return void 0;
          return this;
        }
        optimizeNames(names, constants) {
          var _a;
          this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
          if (!(super.optimizeNames(names, constants) || this.else))
            return;
          this.condition = optimizeExpr(this.condition, names, constants);
          return this;
        }
        get names() {
          const names = super.names;
          addExprNames(names, this.condition);
          if (this.else)
            addNames(names, this.else.names);
          return names;
        }
      };
      If.kind = "if";
      var For = class extends BlockNode {
      };
      For.kind = "for";
      var ForLoop = class extends For {
        constructor(iteration) {
          super();
          this.iteration = iteration;
        }
        render(opts) {
          return `for(${this.iteration})` + super.render(opts);
        }
        optimizeNames(names, constants) {
          if (!super.optimizeNames(names, constants))
            return;
          this.iteration = optimizeExpr(this.iteration, names, constants);
          return this;
        }
        get names() {
          return addNames(super.names, this.iteration.names);
        }
      };
      var ForRange = class extends For {
        constructor(varKind, name2, from, to) {
          super();
          this.varKind = varKind;
          this.name = name2;
          this.from = from;
          this.to = to;
        }
        render(opts) {
          const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
          const { name: name2, from, to } = this;
          return `for(${varKind} ${name2}=${from}; ${name2}<${to}; ${name2}++)` + super.render(opts);
        }
        get names() {
          const names = addExprNames(super.names, this.from);
          return addExprNames(names, this.to);
        }
      };
      var ForIter = class extends For {
        constructor(loop, varKind, name2, iterable) {
          super();
          this.loop = loop;
          this.varKind = varKind;
          this.name = name2;
          this.iterable = iterable;
        }
        render(opts) {
          return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
        }
        optimizeNames(names, constants) {
          if (!super.optimizeNames(names, constants))
            return;
          this.iterable = optimizeExpr(this.iterable, names, constants);
          return this;
        }
        get names() {
          return addNames(super.names, this.iterable.names);
        }
      };
      var Func = class extends BlockNode {
        constructor(name2, args, async) {
          super();
          this.name = name2;
          this.args = args;
          this.async = async;
        }
        render(opts) {
          const _async = this.async ? "async " : "";
          return `${_async}function ${this.name}(${this.args})` + super.render(opts);
        }
      };
      Func.kind = "func";
      var Return = class extends ParentNode {
        render(opts) {
          return "return " + super.render(opts);
        }
      };
      Return.kind = "return";
      var Try = class extends BlockNode {
        render(opts) {
          let code = "try" + super.render(opts);
          if (this.catch)
            code += this.catch.render(opts);
          if (this.finally)
            code += this.finally.render(opts);
          return code;
        }
        optimizeNodes() {
          var _a, _b;
          super.optimizeNodes();
          (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
          (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
          return this;
        }
        optimizeNames(names, constants) {
          var _a, _b;
          super.optimizeNames(names, constants);
          (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
          (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
          return this;
        }
        get names() {
          const names = super.names;
          if (this.catch)
            addNames(names, this.catch.names);
          if (this.finally)
            addNames(names, this.finally.names);
          return names;
        }
      };
      var Catch = class extends BlockNode {
        constructor(error) {
          super();
          this.error = error;
        }
        render(opts) {
          return `catch(${this.error})` + super.render(opts);
        }
      };
      Catch.kind = "catch";
      var Finally = class extends BlockNode {
        render(opts) {
          return "finally" + super.render(opts);
        }
      };
      Finally.kind = "finally";
      var CodeGen = class {
        constructor(extScope, opts = {}) {
          this._values = {};
          this._blockStarts = [];
          this._constants = {};
          this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
          this._extScope = extScope;
          this._scope = new scope_1.Scope({ parent: extScope });
          this._nodes = [new Root()];
        }
        toString() {
          return this._root.render(this.opts);
        }
        name(prefix) {
          return this._scope.name(prefix);
        }
        scopeName(prefix) {
          return this._extScope.name(prefix);
        }
        scopeValue(prefixOrName, value) {
          const name2 = this._extScope.value(prefixOrName, value);
          const vs = this._values[name2.prefix] || (this._values[name2.prefix] = /* @__PURE__ */ new Set());
          vs.add(name2);
          return name2;
        }
        getScopeValue(prefix, keyOrRef) {
          return this._extScope.getValue(prefix, keyOrRef);
        }
        scopeRefs(scopeName) {
          return this._extScope.scopeRefs(scopeName, this._values);
        }
        scopeCode() {
          return this._extScope.scopeCode(this._values);
        }
        _def(varKind, nameOrPrefix, rhs, constant) {
          const name2 = this._scope.toName(nameOrPrefix);
          if (rhs !== void 0 && constant)
            this._constants[name2.str] = rhs;
          this._leafNode(new Def(varKind, name2, rhs));
          return name2;
        }
        const(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
        }
        let(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
        }
        var(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
        }
        assign(lhs, rhs, sideEffects) {
          return this._leafNode(new Assign(lhs, rhs, sideEffects));
        }
        add(lhs, rhs) {
          return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
        }
        code(c3) {
          if (typeof c3 == "function")
            c3();
          else if (c3 !== code_1.nil)
            this._leafNode(new AnyCode(c3));
          return this;
        }
        object(...keyValues) {
          const code = ["{"];
          for (const [key, value] of keyValues) {
            if (code.length > 1)
              code.push(",");
            code.push(key);
            if (key !== value || this.opts.es5) {
              code.push(":");
              (0, code_1.addCodeArg)(code, value);
            }
          }
          code.push("}");
          return new code_1._Code(code);
        }
        if(condition, thenBody, elseBody) {
          this._blockNode(new If(condition));
          if (thenBody && elseBody) {
            this.code(thenBody).else().code(elseBody).endIf();
          } else if (thenBody) {
            this.code(thenBody).endIf();
          } else if (elseBody) {
            throw new Error('CodeGen: "else" body without "then" body');
          }
          return this;
        }
        elseIf(condition) {
          return this._elseNode(new If(condition));
        }
        else() {
          return this._elseNode(new Else());
        }
        endIf() {
          return this._endBlockNode(If, Else);
        }
        _for(node, forBody) {
          this._blockNode(node);
          if (forBody)
            this.code(forBody).endFor();
          return this;
        }
        for(iteration, forBody) {
          return this._for(new ForLoop(iteration), forBody);
        }
        forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
          const name2 = this._scope.toName(nameOrPrefix);
          return this._for(new ForRange(varKind, name2, from, to), () => forBody(name2));
        }
        forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
          const name2 = this._scope.toName(nameOrPrefix);
          if (this.opts.es5) {
            const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
            return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i3) => {
              this.var(name2, (0, code_1._)`${arr}[${i3}]`);
              forBody(name2);
            });
          }
          return this._for(new ForIter("of", varKind, name2, iterable), () => forBody(name2));
        }
        forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
          if (this.opts.ownProperties) {
            return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
          }
          const name2 = this._scope.toName(nameOrPrefix);
          return this._for(new ForIter("in", varKind, name2, obj), () => forBody(name2));
        }
        endFor() {
          return this._endBlockNode(For);
        }
        label(label) {
          return this._leafNode(new Label(label));
        }
        break(label) {
          return this._leafNode(new Break(label));
        }
        return(value) {
          const node = new Return();
          this._blockNode(node);
          this.code(value);
          if (node.nodes.length !== 1)
            throw new Error('CodeGen: "return" should have one node');
          return this._endBlockNode(Return);
        }
        try(tryBody, catchCode, finallyCode) {
          if (!catchCode && !finallyCode)
            throw new Error('CodeGen: "try" without "catch" and "finally"');
          const node = new Try();
          this._blockNode(node);
          this.code(tryBody);
          if (catchCode) {
            const error = this.name("e");
            this._currNode = node.catch = new Catch(error);
            catchCode(error);
          }
          if (finallyCode) {
            this._currNode = node.finally = new Finally();
            this.code(finallyCode);
          }
          return this._endBlockNode(Catch, Finally);
        }
        throw(error) {
          return this._leafNode(new Throw(error));
        }
        block(body, nodeCount) {
          this._blockStarts.push(this._nodes.length);
          if (body)
            this.code(body).endBlock(nodeCount);
          return this;
        }
        endBlock(nodeCount) {
          const len = this._blockStarts.pop();
          if (len === void 0)
            throw new Error("CodeGen: not in self-balancing block");
          const toClose = this._nodes.length - len;
          if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
            throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
          }
          this._nodes.length = len;
          return this;
        }
        func(name2, args = code_1.nil, async, funcBody) {
          this._blockNode(new Func(name2, args, async));
          if (funcBody)
            this.code(funcBody).endFunc();
          return this;
        }
        endFunc() {
          return this._endBlockNode(Func);
        }
        optimize(n3 = 1) {
          while (n3-- > 0) {
            this._root.optimizeNodes();
            this._root.optimizeNames(this._root.names, this._constants);
          }
        }
        _leafNode(node) {
          this._currNode.nodes.push(node);
          return this;
        }
        _blockNode(node) {
          this._currNode.nodes.push(node);
          this._nodes.push(node);
        }
        _endBlockNode(N1, N22) {
          const n3 = this._currNode;
          if (n3 instanceof N1 || N22 && n3 instanceof N22) {
            this._nodes.pop();
            return this;
          }
          throw new Error(`CodeGen: not in block "${N22 ? `${N1.kind}/${N22.kind}` : N1.kind}"`);
        }
        _elseNode(node) {
          const n3 = this._currNode;
          if (!(n3 instanceof If)) {
            throw new Error('CodeGen: "else" without "if"');
          }
          this._currNode = n3.else = node;
          return this;
        }
        get _root() {
          return this._nodes[0];
        }
        get _currNode() {
          const ns = this._nodes;
          return ns[ns.length - 1];
        }
        set _currNode(node) {
          const ns = this._nodes;
          ns[ns.length - 1] = node;
        }
      };
      exports.CodeGen = CodeGen;
      function addNames(names, from) {
        for (const n3 in from)
          names[n3] = (names[n3] || 0) + (from[n3] || 0);
        return names;
      }
      function addExprNames(names, from) {
        return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
      }
      function optimizeExpr(expr, names, constants) {
        if (expr instanceof code_1.Name)
          return replaceName(expr);
        if (!canOptimize(expr))
          return expr;
        return new code_1._Code(expr._items.reduce((items, c3) => {
          if (c3 instanceof code_1.Name)
            c3 = replaceName(c3);
          if (c3 instanceof code_1._Code)
            items.push(...c3._items);
          else
            items.push(c3);
          return items;
        }, []));
        function replaceName(n3) {
          const c3 = constants[n3.str];
          if (c3 === void 0 || names[n3.str] !== 1)
            return n3;
          delete names[n3.str];
          return c3;
        }
        function canOptimize(e3) {
          return e3 instanceof code_1._Code && e3._items.some((c3) => c3 instanceof code_1.Name && names[c3.str] === 1 && constants[c3.str] !== void 0);
        }
      }
      function subtractNames(names, from) {
        for (const n3 in from)
          names[n3] = (names[n3] || 0) - (from[n3] || 0);
      }
      function not(x3) {
        return typeof x3 == "boolean" || typeof x3 == "number" || x3 === null ? !x3 : (0, code_1._)`!${par(x3)}`;
      }
      exports.not = not;
      var andCode = mappend(exports.operators.AND);
      function and(...args) {
        return args.reduce(andCode);
      }
      exports.and = and;
      var orCode = mappend(exports.operators.OR);
      function or2(...args) {
        return args.reduce(orCode);
      }
      exports.or = or2;
      function mappend(op) {
        return (x3, y3) => x3 === code_1.nil ? y3 : y3 === code_1.nil ? x3 : (0, code_1._)`${par(x3)} ${op} ${par(y3)}`;
      }
      function par(x3) {
        return x3 instanceof code_1.Name ? x3 : (0, code_1._)`(${x3})`;
      }
    }
  });

  // node_modules/ajv/dist/compile/util.js
  var require_util = __commonJS({
    "node_modules/ajv/dist/compile/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
      var codegen_1 = require_codegen();
      var code_1 = require_code();
      function toHash(arr) {
        const hash = {};
        for (const item of arr)
          hash[item] = true;
        return hash;
      }
      exports.toHash = toHash;
      function alwaysValidSchema(it3, schema) {
        if (typeof schema == "boolean")
          return schema;
        if (Object.keys(schema).length === 0)
          return true;
        checkUnknownRules(it3, schema);
        return !schemaHasRules(schema, it3.self.RULES.all);
      }
      exports.alwaysValidSchema = alwaysValidSchema;
      function checkUnknownRules(it3, schema = it3.schema) {
        const { opts, self: self2 } = it3;
        if (!opts.strictSchema)
          return;
        if (typeof schema === "boolean")
          return;
        const rules = self2.RULES.keywords;
        for (const key in schema) {
          if (!rules[key])
            checkStrictMode(it3, `unknown keyword: "${key}"`);
        }
      }
      exports.checkUnknownRules = checkUnknownRules;
      function schemaHasRules(schema, rules) {
        if (typeof schema == "boolean")
          return !schema;
        for (const key in schema)
          if (rules[key])
            return true;
        return false;
      }
      exports.schemaHasRules = schemaHasRules;
      function schemaHasRulesButRef(schema, RULES) {
        if (typeof schema == "boolean")
          return !schema;
        for (const key in schema)
          if (key !== "$ref" && RULES.all[key])
            return true;
        return false;
      }
      exports.schemaHasRulesButRef = schemaHasRulesButRef;
      function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
        if (!$data) {
          if (typeof schema == "number" || typeof schema == "boolean")
            return schema;
          if (typeof schema == "string")
            return (0, codegen_1._)`${schema}`;
        }
        return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
      }
      exports.schemaRefOrVal = schemaRefOrVal;
      function unescapeFragment(str) {
        return unescapeJsonPointer(decodeURIComponent(str));
      }
      exports.unescapeFragment = unescapeFragment;
      function escapeFragment(str) {
        return encodeURIComponent(escapeJsonPointer(str));
      }
      exports.escapeFragment = escapeFragment;
      function escapeJsonPointer(str) {
        if (typeof str == "number")
          return `${str}`;
        return str.replace(/~/g, "~0").replace(/\//g, "~1");
      }
      exports.escapeJsonPointer = escapeJsonPointer;
      function unescapeJsonPointer(str) {
        return str.replace(/~1/g, "/").replace(/~0/g, "~");
      }
      exports.unescapeJsonPointer = unescapeJsonPointer;
      function eachItem(xs, f3) {
        if (Array.isArray(xs)) {
          for (const x3 of xs)
            f3(x3);
        } else {
          f3(xs);
        }
      }
      exports.eachItem = eachItem;
      function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
        return (gen, from, to, toName) => {
          const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
          return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
        };
      }
      exports.mergeEvaluated = {
        props: makeMergeEvaluated({
          mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
            gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
          }),
          mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
            if (from === true) {
              gen.assign(to, true);
            } else {
              gen.assign(to, (0, codegen_1._)`${to} || {}`);
              setEvaluated(gen, to, from);
            }
          }),
          mergeValues: (from, to) => from === true ? true : { ...from, ...to },
          resultToName: evaluatedPropsToName
        }),
        items: makeMergeEvaluated({
          mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
          mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
          mergeValues: (from, to) => from === true ? true : Math.max(from, to),
          resultToName: (gen, items) => gen.var("items", items)
        })
      };
      function evaluatedPropsToName(gen, ps) {
        if (ps === true)
          return gen.var("props", true);
        const props = gen.var("props", (0, codegen_1._)`{}`);
        if (ps !== void 0)
          setEvaluated(gen, props, ps);
        return props;
      }
      exports.evaluatedPropsToName = evaluatedPropsToName;
      function setEvaluated(gen, props, ps) {
        Object.keys(ps).forEach((p3) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p3)}`, true));
      }
      exports.setEvaluated = setEvaluated;
      var snippets = {};
      function useFunc(gen, f3) {
        return gen.scopeValue("func", {
          ref: f3,
          code: snippets[f3.code] || (snippets[f3.code] = new code_1._Code(f3.code))
        });
      }
      exports.useFunc = useFunc;
      var Type;
      (function(Type2) {
        Type2[Type2["Num"] = 0] = "Num";
        Type2[Type2["Str"] = 1] = "Str";
      })(Type = exports.Type || (exports.Type = {}));
      function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
        if (dataProp instanceof codegen_1.Name) {
          const isNumber = dataPropType === Type.Num;
          return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
        }
        return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
      }
      exports.getErrorPath = getErrorPath;
      function checkStrictMode(it3, msg, mode = it3.opts.strictSchema) {
        if (!mode)
          return;
        msg = `strict mode: ${msg}`;
        if (mode === true)
          throw new Error(msg);
        it3.self.logger.warn(msg);
      }
      exports.checkStrictMode = checkStrictMode;
    }
  });

  // node_modules/ajv/dist/compile/names.js
  var require_names = __commonJS({
    "node_modules/ajv/dist/compile/names.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var names = {
        data: new codegen_1.Name("data"),
        valCxt: new codegen_1.Name("valCxt"),
        instancePath: new codegen_1.Name("instancePath"),
        parentData: new codegen_1.Name("parentData"),
        parentDataProperty: new codegen_1.Name("parentDataProperty"),
        rootData: new codegen_1.Name("rootData"),
        dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
        vErrors: new codegen_1.Name("vErrors"),
        errors: new codegen_1.Name("errors"),
        this: new codegen_1.Name("this"),
        self: new codegen_1.Name("self"),
        scope: new codegen_1.Name("scope"),
        json: new codegen_1.Name("json"),
        jsonPos: new codegen_1.Name("jsonPos"),
        jsonLen: new codegen_1.Name("jsonLen"),
        jsonPart: new codegen_1.Name("jsonPart")
      };
      exports.default = names;
    }
  });

  // node_modules/ajv/dist/compile/errors.js
  var require_errors = __commonJS({
    "node_modules/ajv/dist/compile/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var names_1 = require_names();
      exports.keywordError = {
        message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
      };
      exports.keyword$DataError = {
        message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
      };
      function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
        const { it: it3 } = cxt;
        const { gen, compositeRule, allErrors } = it3;
        const errObj = errorObjectCode(cxt, error, errorPaths);
        if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
          addError(gen, errObj);
        } else {
          returnErrors(it3, (0, codegen_1._)`[${errObj}]`);
        }
      }
      exports.reportError = reportError;
      function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
        const { it: it3 } = cxt;
        const { gen, compositeRule, allErrors } = it3;
        const errObj = errorObjectCode(cxt, error, errorPaths);
        addError(gen, errObj);
        if (!(compositeRule || allErrors)) {
          returnErrors(it3, names_1.default.vErrors);
        }
      }
      exports.reportExtraError = reportExtraError;
      function resetErrorsCount(gen, errsCount) {
        gen.assign(names_1.default.errors, errsCount);
        gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
      }
      exports.resetErrorsCount = resetErrorsCount;
      function extendErrors({ gen, keyword, schemaValue, data, errsCount, it: it3 }) {
        if (errsCount === void 0)
          throw new Error("ajv implementation error");
        const err = gen.name("err");
        gen.forRange("i", errsCount, names_1.default.errors, (i3) => {
          gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i3}]`);
          gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it3.errorPath)));
          gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it3.errSchemaPath}/${keyword}`);
          if (it3.opts.verbose) {
            gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
            gen.assign((0, codegen_1._)`${err}.data`, data);
          }
        });
      }
      exports.extendErrors = extendErrors;
      function addError(gen, errObj) {
        const err = gen.const("err", errObj);
        gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
        gen.code((0, codegen_1._)`${names_1.default.errors}++`);
      }
      function returnErrors(it3, errs) {
        const { gen, validateName, schemaEnv } = it3;
        if (schemaEnv.$async) {
          gen.throw((0, codegen_1._)`new ${it3.ValidationError}(${errs})`);
        } else {
          gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
          gen.return(false);
        }
      }
      var E3 = {
        keyword: new codegen_1.Name("keyword"),
        schemaPath: new codegen_1.Name("schemaPath"),
        params: new codegen_1.Name("params"),
        propertyName: new codegen_1.Name("propertyName"),
        message: new codegen_1.Name("message"),
        schema: new codegen_1.Name("schema"),
        parentSchema: new codegen_1.Name("parentSchema")
      };
      function errorObjectCode(cxt, error, errorPaths) {
        const { createErrors } = cxt.it;
        if (createErrors === false)
          return (0, codegen_1._)`{}`;
        return errorObject(cxt, error, errorPaths);
      }
      function errorObject(cxt, error, errorPaths = {}) {
        const { gen, it: it3 } = cxt;
        const keyValues = [
          errorInstancePath(it3, errorPaths),
          errorSchemaPath(cxt, errorPaths)
        ];
        extraErrorProps(cxt, error, keyValues);
        return gen.object(...keyValues);
      }
      function errorInstancePath({ errorPath }, { instancePath }) {
        const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
        return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
      }
      function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
        let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
        if (schemaPath) {
          schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
        }
        return [E3.schemaPath, schPath];
      }
      function extraErrorProps(cxt, { params, message }, keyValues) {
        const { keyword, data, schemaValue, it: it3 } = cxt;
        const { opts, propertyName, topSchemaRef, schemaPath } = it3;
        keyValues.push([E3.keyword, keyword], [E3.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
        if (opts.messages) {
          keyValues.push([E3.message, typeof message == "function" ? message(cxt) : message]);
        }
        if (opts.verbose) {
          keyValues.push([E3.schema, schemaValue], [E3.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
        }
        if (propertyName)
          keyValues.push([E3.propertyName, propertyName]);
      }
    }
  });

  // node_modules/ajv/dist/compile/validate/boolSchema.js
  var require_boolSchema = __commonJS({
    "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
      var errors_1 = require_errors();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var boolError = {
        message: "boolean schema is false"
      };
      function topBoolOrEmptySchema(it3) {
        const { gen, schema, validateName } = it3;
        if (schema === false) {
          falseSchemaError(it3, false);
        } else if (typeof schema == "object" && schema.$async === true) {
          gen.return(names_1.default.data);
        } else {
          gen.assign((0, codegen_1._)`${validateName}.errors`, null);
          gen.return(true);
        }
      }
      exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
      function boolOrEmptySchema(it3, valid2) {
        const { gen, schema } = it3;
        if (schema === false) {
          gen.var(valid2, false);
          falseSchemaError(it3);
        } else {
          gen.var(valid2, true);
        }
      }
      exports.boolOrEmptySchema = boolOrEmptySchema;
      function falseSchemaError(it3, overrideAllErrors) {
        const { gen, data } = it3;
        const cxt = {
          gen,
          keyword: "false schema",
          data,
          schema: false,
          schemaCode: false,
          schemaValue: false,
          params: {},
          it: it3
        };
        (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
      }
    }
  });

  // node_modules/ajv/dist/compile/rules.js
  var require_rules = __commonJS({
    "node_modules/ajv/dist/compile/rules.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getRules = exports.isJSONType = void 0;
      var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
      var jsonTypes = new Set(_jsonTypes);
      function isJSONType(x3) {
        return typeof x3 == "string" && jsonTypes.has(x3);
      }
      exports.isJSONType = isJSONType;
      function getRules() {
        const groups = {
          number: { type: "number", rules: [] },
          string: { type: "string", rules: [] },
          array: { type: "array", rules: [] },
          object: { type: "object", rules: [] }
        };
        return {
          types: { ...groups, integer: true, boolean: true, null: true },
          rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
          post: { rules: [] },
          all: {},
          keywords: {}
        };
      }
      exports.getRules = getRules;
    }
  });

  // node_modules/ajv/dist/compile/validate/applicability.js
  var require_applicability = __commonJS({
    "node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
      function schemaHasRulesForType({ schema, self: self2 }, type) {
        const group = self2.RULES.types[type];
        return group && group !== true && shouldUseGroup(schema, group);
      }
      exports.schemaHasRulesForType = schemaHasRulesForType;
      function shouldUseGroup(schema, group) {
        return group.rules.some((rule) => shouldUseRule(schema, rule));
      }
      exports.shouldUseGroup = shouldUseGroup;
      function shouldUseRule(schema, rule) {
        var _a;
        return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
      }
      exports.shouldUseRule = shouldUseRule;
    }
  });

  // node_modules/ajv/dist/compile/validate/dataType.js
  var require_dataType = __commonJS({
    "node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
      var rules_1 = require_rules();
      var applicability_1 = require_applicability();
      var errors_1 = require_errors();
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var DataType;
      (function(DataType2) {
        DataType2[DataType2["Correct"] = 0] = "Correct";
        DataType2[DataType2["Wrong"] = 1] = "Wrong";
      })(DataType = exports.DataType || (exports.DataType = {}));
      function getSchemaTypes(schema) {
        const types = getJSONTypes(schema.type);
        const hasNull = types.includes("null");
        if (hasNull) {
          if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
        } else {
          if (!types.length && schema.nullable !== void 0) {
            throw new Error('"nullable" cannot be used without "type"');
          }
          if (schema.nullable === true)
            types.push("null");
        }
        return types;
      }
      exports.getSchemaTypes = getSchemaTypes;
      function getJSONTypes(ts) {
        const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
        if (types.every(rules_1.isJSONType))
          return types;
        throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
      }
      exports.getJSONTypes = getJSONTypes;
      function coerceAndCheckDataType(it3, types) {
        const { gen, data, opts } = it3;
        const coerceTo = coerceToTypes(types, opts.coerceTypes);
        const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it3, types[0]));
        if (checkTypes) {
          const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
          gen.if(wrongType, () => {
            if (coerceTo.length)
              coerceData(it3, types, coerceTo);
            else
              reportTypeError(it3);
          });
        }
        return checkTypes;
      }
      exports.coerceAndCheckDataType = coerceAndCheckDataType;
      var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
      function coerceToTypes(types, coerceTypes) {
        return coerceTypes ? types.filter((t9) => COERCIBLE.has(t9) || coerceTypes === "array" && t9 === "array") : [];
      }
      function coerceData(it3, types, coerceTo) {
        const { gen, data, opts } = it3;
        const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
        const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
        if (opts.coerceTypes === "array") {
          gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
        }
        gen.if((0, codegen_1._)`${coerced} !== undefined`);
        for (const t9 of coerceTo) {
          if (COERCIBLE.has(t9) || t9 === "array" && opts.coerceTypes === "array") {
            coerceSpecificType(t9);
          }
        }
        gen.else();
        reportTypeError(it3);
        gen.endIf();
        gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
          gen.assign(data, coerced);
          assignParentData(it3, coerced);
        });
        function coerceSpecificType(t9) {
          switch (t9) {
            case "string":
              gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
              return;
            case "number":
              gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
              return;
            case "integer":
              gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
              return;
            case "boolean":
              gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
              return;
            case "null":
              gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
              gen.assign(coerced, null);
              return;
            case "array":
              gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
          }
        }
      }
      function assignParentData({ gen, parentData, parentDataProperty }, expr) {
        gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
      }
      function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
        const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
        let cond;
        switch (dataType) {
          case "null":
            return (0, codegen_1._)`${data} ${EQ} null`;
          case "array":
            cond = (0, codegen_1._)`Array.isArray(${data})`;
            break;
          case "object":
            cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
          case "integer":
            cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
            break;
          case "number":
            cond = numCond();
            break;
          default:
            return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
        }
        return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
        function numCond(_cond = codegen_1.nil) {
          return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
        }
      }
      exports.checkDataType = checkDataType;
      function checkDataTypes(dataTypes, data, strictNums, correct) {
        if (dataTypes.length === 1) {
          return checkDataType(dataTypes[0], data, strictNums, correct);
        }
        let cond;
        const types = (0, util_1.toHash)(dataTypes);
        if (types.array && types.object) {
          const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
          cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
          delete types.null;
          delete types.array;
          delete types.object;
        } else {
          cond = codegen_1.nil;
        }
        if (types.number)
          delete types.integer;
        for (const t9 in types)
          cond = (0, codegen_1.and)(cond, checkDataType(t9, data, strictNums, correct));
        return cond;
      }
      exports.checkDataTypes = checkDataTypes;
      var typeError = {
        message: ({ schema }) => `must be ${schema}`,
        params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
      };
      function reportTypeError(it3) {
        const cxt = getTypeErrorContext(it3);
        (0, errors_1.reportError)(cxt, typeError);
      }
      exports.reportTypeError = reportTypeError;
      function getTypeErrorContext(it3) {
        const { gen, data, schema } = it3;
        const schemaCode = (0, util_1.schemaRefOrVal)(it3, schema, "type");
        return {
          gen,
          keyword: "type",
          data,
          schema: schema.type,
          schemaCode,
          schemaValue: schemaCode,
          parentSchema: schema,
          params: {},
          it: it3
        };
      }
    }
  });

  // node_modules/ajv/dist/compile/validate/defaults.js
  var require_defaults = __commonJS({
    "node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.assignDefaults = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      function assignDefaults(it3, ty) {
        const { properties, items } = it3.schema;
        if (ty === "object" && properties) {
          for (const key in properties) {
            assignDefault(it3, key, properties[key].default);
          }
        } else if (ty === "array" && Array.isArray(items)) {
          items.forEach((sch, i3) => assignDefault(it3, i3, sch.default));
        }
      }
      exports.assignDefaults = assignDefaults;
      function assignDefault(it3, prop, defaultValue) {
        const { gen, compositeRule, data, opts } = it3;
        if (defaultValue === void 0)
          return;
        const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
        if (compositeRule) {
          (0, util_1.checkStrictMode)(it3, `default is ignored for: ${childData}`);
          return;
        }
        let condition = (0, codegen_1._)`${childData} === undefined`;
        if (opts.useDefaults === "empty") {
          condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
        }
        gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
      }
    }
  });

  // node_modules/ajv/dist/vocabularies/code.js
  var require_code2 = __commonJS({
    "node_modules/ajv/dist/vocabularies/code.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var names_1 = require_names();
      var util_2 = require_util();
      function checkReportMissingProp(cxt, prop) {
        const { gen, data, it: it3 } = cxt;
        gen.if(noPropertyInData(gen, data, prop, it3.opts.ownProperties), () => {
          cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
          cxt.error();
        });
      }
      exports.checkReportMissingProp = checkReportMissingProp;
      function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
        return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
      }
      exports.checkMissingProp = checkMissingProp;
      function reportMissingProp(cxt, missing) {
        cxt.setParams({ missingProperty: missing }, true);
        cxt.error();
      }
      exports.reportMissingProp = reportMissingProp;
      function hasPropFunc(gen) {
        return gen.scopeValue("func", {
          ref: Object.prototype.hasOwnProperty,
          code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
        });
      }
      exports.hasPropFunc = hasPropFunc;
      function isOwnProperty(gen, data, property) {
        return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
      }
      exports.isOwnProperty = isOwnProperty;
      function propertyInData(gen, data, property, ownProperties) {
        const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
        return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
      }
      exports.propertyInData = propertyInData;
      function noPropertyInData(gen, data, property, ownProperties) {
        const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
        return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
      }
      exports.noPropertyInData = noPropertyInData;
      function allSchemaProperties(schemaMap) {
        return schemaMap ? Object.keys(schemaMap).filter((p3) => p3 !== "__proto__") : [];
      }
      exports.allSchemaProperties = allSchemaProperties;
      function schemaProperties(it3, schemaMap) {
        return allSchemaProperties(schemaMap).filter((p3) => !(0, util_1.alwaysValidSchema)(it3, schemaMap[p3]));
      }
      exports.schemaProperties = schemaProperties;
      function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it: it3 }, func, context, passSchema) {
        const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
        const valCxt = [
          [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
          [names_1.default.parentData, it3.parentData],
          [names_1.default.parentDataProperty, it3.parentDataProperty],
          [names_1.default.rootData, names_1.default.rootData]
        ];
        if (it3.opts.dynamicRef)
          valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
        const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
        return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
      }
      exports.callValidateCode = callValidateCode;
      var newRegExp = (0, codegen_1._)`new RegExp`;
      function usePattern({ gen, it: { opts } }, pattern) {
        const u3 = opts.unicodeRegExp ? "u" : "";
        const { regExp } = opts.code;
        const rx = regExp(pattern, u3);
        return gen.scopeValue("pattern", {
          key: rx.toString(),
          ref: rx,
          code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u3})`
        });
      }
      exports.usePattern = usePattern;
      function validateArray(cxt) {
        const { gen, data, keyword, it: it3 } = cxt;
        const valid2 = gen.name("valid");
        if (it3.allErrors) {
          const validArr = gen.let("valid", true);
          validateItems(() => gen.assign(validArr, false));
          return validArr;
        }
        gen.var(valid2, true);
        validateItems(() => gen.break());
        return valid2;
        function validateItems(notValid) {
          const len = gen.const("len", (0, codegen_1._)`${data}.length`);
          gen.forRange("i", 0, len, (i3) => {
            cxt.subschema({
              keyword,
              dataProp: i3,
              dataPropType: util_1.Type.Num
            }, valid2);
            gen.if((0, codegen_1.not)(valid2), notValid);
          });
        }
      }
      exports.validateArray = validateArray;
      function validateUnion(cxt) {
        const { gen, schema, keyword, it: it3 } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it3, sch));
        if (alwaysValid && !it3.opts.unevaluated)
          return;
        const valid2 = gen.let("valid", false);
        const schValid = gen.name("_valid");
        gen.block(() => schema.forEach((_sch, i3) => {
          const schCxt = cxt.subschema({
            keyword,
            schemaProp: i3,
            compositeRule: true
          }, schValid);
          gen.assign(valid2, (0, codegen_1._)`${valid2} || ${schValid}`);
          const merged = cxt.mergeValidEvaluated(schCxt, schValid);
          if (!merged)
            gen.if((0, codegen_1.not)(valid2));
        }));
        cxt.result(valid2, () => cxt.reset(), () => cxt.error(true));
      }
      exports.validateUnion = validateUnion;
    }
  });

  // node_modules/ajv/dist/compile/validate/keyword.js
  var require_keyword = __commonJS({
    "node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var code_1 = require_code2();
      var errors_1 = require_errors();
      function macroKeywordCode(cxt, def) {
        const { gen, keyword, schema, parentSchema, it: it3 } = cxt;
        const macroSchema = def.macro.call(it3.self, schema, parentSchema, it3);
        const schemaRef = useKeyword(gen, keyword, macroSchema);
        if (it3.opts.validateSchema !== false)
          it3.self.validateSchema(macroSchema, true);
        const valid2 = gen.name("valid");
        cxt.subschema({
          schema: macroSchema,
          schemaPath: codegen_1.nil,
          errSchemaPath: `${it3.errSchemaPath}/${keyword}`,
          topSchemaRef: schemaRef,
          compositeRule: true
        }, valid2);
        cxt.pass(valid2, () => cxt.error(true));
      }
      exports.macroKeywordCode = macroKeywordCode;
      function funcKeywordCode(cxt, def) {
        var _a;
        const { gen, keyword, schema, parentSchema, $data, it: it3 } = cxt;
        checkAsyncKeyword(it3, def);
        const validate3 = !$data && def.compile ? def.compile.call(it3.self, schema, parentSchema, it3) : def.validate;
        const validateRef = useKeyword(gen, keyword, validate3);
        const valid2 = gen.let("valid");
        cxt.block$data(valid2, validateKeyword);
        cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid2);
        function validateKeyword() {
          if (def.errors === false) {
            assignValid();
            if (def.modifying)
              modifyData(cxt);
            reportErrs(() => cxt.error());
          } else {
            const ruleErrs = def.async ? validateAsync() : validateSync();
            if (def.modifying)
              modifyData(cxt);
            reportErrs(() => addErrs(cxt, ruleErrs));
          }
        }
        function validateAsync() {
          const ruleErrs = gen.let("ruleErrs", null);
          gen.try(() => assignValid((0, codegen_1._)`await `), (e3) => gen.assign(valid2, false).if((0, codegen_1._)`${e3} instanceof ${it3.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e3}.errors`), () => gen.throw(e3)));
          return ruleErrs;
        }
        function validateSync() {
          const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
          gen.assign(validateErrs, null);
          assignValid(codegen_1.nil);
          return validateErrs;
        }
        function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
          const passCxt = it3.opts.passContext ? names_1.default.this : names_1.default.self;
          const passSchema = !("compile" in def && !$data || def.schema === false);
          gen.assign(valid2, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
        }
        function reportErrs(errors) {
          var _a2;
          gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid2), errors);
        }
      }
      exports.funcKeywordCode = funcKeywordCode;
      function modifyData(cxt) {
        const { gen, data, it: it3 } = cxt;
        gen.if(it3.parentData, () => gen.assign(data, (0, codegen_1._)`${it3.parentData}[${it3.parentDataProperty}]`));
      }
      function addErrs(cxt, errs) {
        const { gen } = cxt;
        gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
          gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
          (0, errors_1.extendErrors)(cxt);
        }, () => cxt.error());
      }
      function checkAsyncKeyword({ schemaEnv }, def) {
        if (def.async && !schemaEnv.$async)
          throw new Error("async keyword in sync schema");
      }
      function useKeyword(gen, keyword, result) {
        if (result === void 0)
          throw new Error(`keyword "${keyword}" failed to compile`);
        return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
      }
      function validSchemaType(schema, schemaType, allowUndefined = false) {
        return !schemaType.length || schemaType.some((st3) => st3 === "array" ? Array.isArray(schema) : st3 === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st3 || allowUndefined && typeof schema == "undefined");
      }
      exports.validSchemaType = validSchemaType;
      function validateKeywordUsage({ schema, opts, self: self2, errSchemaPath }, def, keyword) {
        if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
          throw new Error("ajv implementation error");
        }
        const deps = def.dependencies;
        if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
          throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
        }
        if (def.validateSchema) {
          const valid2 = def.validateSchema(schema[keyword]);
          if (!valid2) {
            const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self2.errorsText(def.validateSchema.errors);
            if (opts.validateSchema === "log")
              self2.logger.error(msg);
            else
              throw new Error(msg);
          }
        }
      }
      exports.validateKeywordUsage = validateKeywordUsage;
    }
  });

  // node_modules/ajv/dist/compile/validate/subschema.js
  var require_subschema = __commonJS({
    "node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      function getSubschema(it3, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
        if (keyword !== void 0 && schema !== void 0) {
          throw new Error('both "keyword" and "schema" passed, only one allowed');
        }
        if (keyword !== void 0) {
          const sch = it3.schema[keyword];
          return schemaProp === void 0 ? {
            schema: sch,
            schemaPath: (0, codegen_1._)`${it3.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
            errSchemaPath: `${it3.errSchemaPath}/${keyword}`
          } : {
            schema: sch[schemaProp],
            schemaPath: (0, codegen_1._)`${it3.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
            errSchemaPath: `${it3.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
          };
        }
        if (schema !== void 0) {
          if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
            throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
          }
          return {
            schema,
            schemaPath,
            topSchemaRef,
            errSchemaPath
          };
        }
        throw new Error('either "keyword" or "schema" must be passed');
      }
      exports.getSubschema = getSubschema;
      function extendSubschemaData(subschema, it3, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
        if (data !== void 0 && dataProp !== void 0) {
          throw new Error('both "data" and "dataProp" passed, only one allowed');
        }
        const { gen } = it3;
        if (dataProp !== void 0) {
          const { errorPath, dataPathArr, opts } = it3;
          const nextData = gen.let("data", (0, codegen_1._)`${it3.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
          dataContextProps(nextData);
          subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
          subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
          subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
        }
        if (data !== void 0) {
          const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
          dataContextProps(nextData);
          if (propertyName !== void 0)
            subschema.propertyName = propertyName;
        }
        if (dataTypes)
          subschema.dataTypes = dataTypes;
        function dataContextProps(_nextData) {
          subschema.data = _nextData;
          subschema.dataLevel = it3.dataLevel + 1;
          subschema.dataTypes = [];
          it3.definedProperties = /* @__PURE__ */ new Set();
          subschema.parentData = it3.data;
          subschema.dataNames = [...it3.dataNames, _nextData];
        }
      }
      exports.extendSubschemaData = extendSubschemaData;
      function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
        if (compositeRule !== void 0)
          subschema.compositeRule = compositeRule;
        if (createErrors !== void 0)
          subschema.createErrors = createErrors;
        if (allErrors !== void 0)
          subschema.allErrors = allErrors;
        subschema.jtdDiscriminator = jtdDiscriminator;
        subschema.jtdMetadata = jtdMetadata;
      }
      exports.extendSubschemaMode = extendSubschemaMode;
    }
  });

  // node_modules/fast-deep-equal/index.js
  var require_fast_deep_equal = __commonJS({
    "node_modules/fast-deep-equal/index.js"(exports, module) {
      "use strict";
      module.exports = function equal(a3, b3) {
        if (a3 === b3)
          return true;
        if (a3 && b3 && typeof a3 == "object" && typeof b3 == "object") {
          if (a3.constructor !== b3.constructor)
            return false;
          var length, i3, keys;
          if (Array.isArray(a3)) {
            length = a3.length;
            if (length != b3.length)
              return false;
            for (i3 = length; i3-- !== 0; )
              if (!equal(a3[i3], b3[i3]))
                return false;
            return true;
          }
          if (a3.constructor === RegExp)
            return a3.source === b3.source && a3.flags === b3.flags;
          if (a3.valueOf !== Object.prototype.valueOf)
            return a3.valueOf() === b3.valueOf();
          if (a3.toString !== Object.prototype.toString)
            return a3.toString() === b3.toString();
          keys = Object.keys(a3);
          length = keys.length;
          if (length !== Object.keys(b3).length)
            return false;
          for (i3 = length; i3-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(b3, keys[i3]))
              return false;
          for (i3 = length; i3-- !== 0; ) {
            var key = keys[i3];
            if (!equal(a3[key], b3[key]))
              return false;
          }
          return true;
        }
        return a3 !== a3 && b3 !== b3;
      };
    }
  });

  // node_modules/json-schema-traverse/index.js
  var require_json_schema_traverse = __commonJS({
    "node_modules/json-schema-traverse/index.js"(exports, module) {
      "use strict";
      var traverse = module.exports = function(schema, opts, cb) {
        if (typeof opts == "function") {
          cb = opts;
          opts = {};
        }
        cb = opts.cb || cb;
        var pre = typeof cb == "function" ? cb : cb.pre || function() {
        };
        var post = cb.post || function() {
        };
        _traverse(opts, pre, post, schema, "", schema);
      };
      traverse.keywords = {
        additionalItems: true,
        items: true,
        contains: true,
        additionalProperties: true,
        propertyNames: true,
        not: true,
        if: true,
        then: true,
        else: true
      };
      traverse.arrayKeywords = {
        items: true,
        allOf: true,
        anyOf: true,
        oneOf: true
      };
      traverse.propsKeywords = {
        $defs: true,
        definitions: true,
        properties: true,
        patternProperties: true,
        dependencies: true
      };
      traverse.skipKeywords = {
        default: true,
        enum: true,
        const: true,
        required: true,
        maximum: true,
        minimum: true,
        exclusiveMaximum: true,
        exclusiveMinimum: true,
        multipleOf: true,
        maxLength: true,
        minLength: true,
        pattern: true,
        format: true,
        maxItems: true,
        minItems: true,
        uniqueItems: true,
        maxProperties: true,
        minProperties: true
      };
      function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
        if (schema && typeof schema == "object" && !Array.isArray(schema)) {
          pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
          for (var key in schema) {
            var sch = schema[key];
            if (Array.isArray(sch)) {
              if (key in traverse.arrayKeywords) {
                for (var i3 = 0; i3 < sch.length; i3++)
                  _traverse(opts, pre, post, sch[i3], jsonPtr + "/" + key + "/" + i3, rootSchema, jsonPtr, key, schema, i3);
              }
            } else if (key in traverse.propsKeywords) {
              if (sch && typeof sch == "object") {
                for (var prop in sch)
                  _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
              }
            } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
              _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
            }
          }
          post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        }
      }
      function escapeJsonPtr(str) {
        return str.replace(/~/g, "~0").replace(/\//g, "~1");
      }
    }
  });

  // node_modules/ajv/dist/compile/resolve.js
  var require_resolve = __commonJS({
    "node_modules/ajv/dist/compile/resolve.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
      var util_1 = require_util();
      var equal = require_fast_deep_equal();
      var traverse = require_json_schema_traverse();
      var SIMPLE_INLINED = /* @__PURE__ */ new Set([
        "type",
        "format",
        "pattern",
        "maxLength",
        "minLength",
        "maxProperties",
        "minProperties",
        "maxItems",
        "minItems",
        "maximum",
        "minimum",
        "uniqueItems",
        "multipleOf",
        "required",
        "enum",
        "const"
      ]);
      function inlineRef(schema, limit = true) {
        if (typeof schema == "boolean")
          return true;
        if (limit === true)
          return !hasRef(schema);
        if (!limit)
          return false;
        return countKeys(schema) <= limit;
      }
      exports.inlineRef = inlineRef;
      var REF_KEYWORDS = /* @__PURE__ */ new Set([
        "$ref",
        "$recursiveRef",
        "$recursiveAnchor",
        "$dynamicRef",
        "$dynamicAnchor"
      ]);
      function hasRef(schema) {
        for (const key in schema) {
          if (REF_KEYWORDS.has(key))
            return true;
          const sch = schema[key];
          if (Array.isArray(sch) && sch.some(hasRef))
            return true;
          if (typeof sch == "object" && hasRef(sch))
            return true;
        }
        return false;
      }
      function countKeys(schema) {
        let count = 0;
        for (const key in schema) {
          if (key === "$ref")
            return Infinity;
          count++;
          if (SIMPLE_INLINED.has(key))
            continue;
          if (typeof schema[key] == "object") {
            (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
          }
          if (count === Infinity)
            return Infinity;
        }
        return count;
      }
      function getFullPath(resolver, id = "", normalize) {
        if (normalize !== false)
          id = normalizeId(id);
        const p3 = resolver.parse(id);
        return _getFullPath(resolver, p3);
      }
      exports.getFullPath = getFullPath;
      function _getFullPath(resolver, p3) {
        const serialized = resolver.serialize(p3);
        return serialized.split("#")[0] + "#";
      }
      exports._getFullPath = _getFullPath;
      var TRAILING_SLASH_HASH = /#\/?$/;
      function normalizeId(id) {
        return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
      }
      exports.normalizeId = normalizeId;
      function resolveUrl(resolver, baseId, id) {
        id = normalizeId(id);
        return resolver.resolve(baseId, id);
      }
      exports.resolveUrl = resolveUrl;
      var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
      function getSchemaRefs(schema, baseId) {
        if (typeof schema == "boolean")
          return {};
        const { schemaId, uriResolver } = this.opts;
        const schId = normalizeId(schema[schemaId] || baseId);
        const baseIds = { "": schId };
        const pathPrefix = getFullPath(uriResolver, schId, false);
        const localRefs = {};
        const schemaRefs = /* @__PURE__ */ new Set();
        traverse(schema, { allKeys: true }, (sch, jsonPtr, _3, parentJsonPtr) => {
          if (parentJsonPtr === void 0)
            return;
          const fullPath = pathPrefix + jsonPtr;
          let baseId2 = baseIds[parentJsonPtr];
          if (typeof sch[schemaId] == "string")
            baseId2 = addRef.call(this, sch[schemaId]);
          addAnchor.call(this, sch.$anchor);
          addAnchor.call(this, sch.$dynamicAnchor);
          baseIds[jsonPtr] = baseId2;
          function addRef(ref) {
            const _resolve = this.opts.uriResolver.resolve;
            ref = normalizeId(baseId2 ? _resolve(baseId2, ref) : ref);
            if (schemaRefs.has(ref))
              throw ambiguos(ref);
            schemaRefs.add(ref);
            let schOrRef = this.refs[ref];
            if (typeof schOrRef == "string")
              schOrRef = this.refs[schOrRef];
            if (typeof schOrRef == "object") {
              checkAmbiguosRef(sch, schOrRef.schema, ref);
            } else if (ref !== normalizeId(fullPath)) {
              if (ref[0] === "#") {
                checkAmbiguosRef(sch, localRefs[ref], ref);
                localRefs[ref] = sch;
              } else {
                this.refs[ref] = fullPath;
              }
            }
            return ref;
          }
          function addAnchor(anchor) {
            if (typeof anchor == "string") {
              if (!ANCHOR.test(anchor))
                throw new Error(`invalid anchor "${anchor}"`);
              addRef.call(this, `#${anchor}`);
            }
          }
        });
        return localRefs;
        function checkAmbiguosRef(sch1, sch2, ref) {
          if (sch2 !== void 0 && !equal(sch1, sch2))
            throw ambiguos(ref);
        }
        function ambiguos(ref) {
          return new Error(`reference "${ref}" resolves to more than one schema`);
        }
      }
      exports.getSchemaRefs = getSchemaRefs;
    }
  });

  // node_modules/ajv/dist/compile/validate/index.js
  var require_validate = __commonJS({
    "node_modules/ajv/dist/compile/validate/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
      var boolSchema_1 = require_boolSchema();
      var dataType_1 = require_dataType();
      var applicability_1 = require_applicability();
      var dataType_2 = require_dataType();
      var defaults_1 = require_defaults();
      var keyword_1 = require_keyword();
      var subschema_1 = require_subschema();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var resolve_1 = require_resolve();
      var util_1 = require_util();
      var errors_1 = require_errors();
      function validateFunctionCode(it3) {
        if (isSchemaObj(it3)) {
          checkKeywords(it3);
          if (schemaCxtHasRules(it3)) {
            topSchemaObjCode(it3);
            return;
          }
        }
        validateFunction(it3, () => (0, boolSchema_1.topBoolOrEmptySchema)(it3));
      }
      exports.validateFunctionCode = validateFunctionCode;
      function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
        if (opts.code.es5) {
          gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
            gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
            destructureValCxtES5(gen, opts);
            gen.code(body);
          });
        } else {
          gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
        }
      }
      function destructureValCxt(opts) {
        return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
      }
      function destructureValCxtES5(gen, opts) {
        gen.if(names_1.default.valCxt, () => {
          gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
          gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
          gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
          gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
          if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
        }, () => {
          gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
          gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
          gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
          gen.var(names_1.default.rootData, names_1.default.data);
          if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
        });
      }
      function topSchemaObjCode(it3) {
        const { schema, opts, gen } = it3;
        validateFunction(it3, () => {
          if (opts.$comment && schema.$comment)
            commentKeyword(it3);
          checkNoDefault(it3);
          gen.let(names_1.default.vErrors, null);
          gen.let(names_1.default.errors, 0);
          if (opts.unevaluated)
            resetEvaluated(it3);
          typeAndKeywords(it3);
          returnResults(it3);
        });
        return;
      }
      function resetEvaluated(it3) {
        const { gen, validateName } = it3;
        it3.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
        gen.if((0, codegen_1._)`${it3.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it3.evaluated}.props`, (0, codegen_1._)`undefined`));
        gen.if((0, codegen_1._)`${it3.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it3.evaluated}.items`, (0, codegen_1._)`undefined`));
      }
      function funcSourceUrl(schema, opts) {
        const schId = typeof schema == "object" && schema[opts.schemaId];
        return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
      }
      function subschemaCode(it3, valid2) {
        if (isSchemaObj(it3)) {
          checkKeywords(it3);
          if (schemaCxtHasRules(it3)) {
            subSchemaObjCode(it3, valid2);
            return;
          }
        }
        (0, boolSchema_1.boolOrEmptySchema)(it3, valid2);
      }
      function schemaCxtHasRules({ schema, self: self2 }) {
        if (typeof schema == "boolean")
          return !schema;
        for (const key in schema)
          if (self2.RULES.all[key])
            return true;
        return false;
      }
      function isSchemaObj(it3) {
        return typeof it3.schema != "boolean";
      }
      function subSchemaObjCode(it3, valid2) {
        const { schema, gen, opts } = it3;
        if (opts.$comment && schema.$comment)
          commentKeyword(it3);
        updateContext(it3);
        checkAsyncSchema(it3);
        const errsCount = gen.const("_errs", names_1.default.errors);
        typeAndKeywords(it3, errsCount);
        gen.var(valid2, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
      }
      function checkKeywords(it3) {
        (0, util_1.checkUnknownRules)(it3);
        checkRefsAndKeywords(it3);
      }
      function typeAndKeywords(it3, errsCount) {
        if (it3.opts.jtd)
          return schemaKeywords(it3, [], false, errsCount);
        const types = (0, dataType_1.getSchemaTypes)(it3.schema);
        const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it3, types);
        schemaKeywords(it3, types, !checkedTypes, errsCount);
      }
      function checkRefsAndKeywords(it3) {
        const { schema, errSchemaPath, opts, self: self2 } = it3;
        if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self2.RULES)) {
          self2.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
        }
      }
      function checkNoDefault(it3) {
        const { schema, opts } = it3;
        if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
          (0, util_1.checkStrictMode)(it3, "default is ignored in the schema root");
        }
      }
      function updateContext(it3) {
        const schId = it3.schema[it3.opts.schemaId];
        if (schId)
          it3.baseId = (0, resolve_1.resolveUrl)(it3.opts.uriResolver, it3.baseId, schId);
      }
      function checkAsyncSchema(it3) {
        if (it3.schema.$async && !it3.schemaEnv.$async)
          throw new Error("async schema in sync schema");
      }
      function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
        const msg = schema.$comment;
        if (opts.$comment === true) {
          gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
        } else if (typeof opts.$comment == "function") {
          const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
          const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
          gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
        }
      }
      function returnResults(it3) {
        const { gen, schemaEnv, validateName, ValidationError, opts } = it3;
        if (schemaEnv.$async) {
          gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
        } else {
          gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
          if (opts.unevaluated)
            assignEvaluated(it3);
          gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
        }
      }
      function assignEvaluated({ gen, evaluated, props, items }) {
        if (props instanceof codegen_1.Name)
          gen.assign((0, codegen_1._)`${evaluated}.props`, props);
        if (items instanceof codegen_1.Name)
          gen.assign((0, codegen_1._)`${evaluated}.items`, items);
      }
      function schemaKeywords(it3, types, typeErrors, errsCount) {
        const { gen, schema, data, allErrors, opts, self: self2 } = it3;
        const { RULES } = self2;
        if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
          gen.block(() => keywordCode(it3, "$ref", RULES.all.$ref.definition));
          return;
        }
        if (!opts.jtd)
          checkStrictTypes(it3, types);
        gen.block(() => {
          for (const group of RULES.rules)
            groupKeywords(group);
          groupKeywords(RULES.post);
        });
        function groupKeywords(group) {
          if (!(0, applicability_1.shouldUseGroup)(schema, group))
            return;
          if (group.type) {
            gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
            iterateKeywords(it3, group);
            if (types.length === 1 && types[0] === group.type && typeErrors) {
              gen.else();
              (0, dataType_2.reportTypeError)(it3);
            }
            gen.endIf();
          } else {
            iterateKeywords(it3, group);
          }
          if (!allErrors)
            gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
        }
      }
      function iterateKeywords(it3, group) {
        const { gen, schema, opts: { useDefaults } } = it3;
        if (useDefaults)
          (0, defaults_1.assignDefaults)(it3, group.type);
        gen.block(() => {
          for (const rule of group.rules) {
            if ((0, applicability_1.shouldUseRule)(schema, rule)) {
              keywordCode(it3, rule.keyword, rule.definition, group.type);
            }
          }
        });
      }
      function checkStrictTypes(it3, types) {
        if (it3.schemaEnv.meta || !it3.opts.strictTypes)
          return;
        checkContextTypes(it3, types);
        if (!it3.opts.allowUnionTypes)
          checkMultipleTypes(it3, types);
        checkKeywordTypes(it3, it3.dataTypes);
      }
      function checkContextTypes(it3, types) {
        if (!types.length)
          return;
        if (!it3.dataTypes.length) {
          it3.dataTypes = types;
          return;
        }
        types.forEach((t9) => {
          if (!includesType(it3.dataTypes, t9)) {
            strictTypesError(it3, `type "${t9}" not allowed by context "${it3.dataTypes.join(",")}"`);
          }
        });
        it3.dataTypes = it3.dataTypes.filter((t9) => includesType(types, t9));
      }
      function checkMultipleTypes(it3, ts) {
        if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
          strictTypesError(it3, "use allowUnionTypes to allow union type keyword");
        }
      }
      function checkKeywordTypes(it3, ts) {
        const rules = it3.self.RULES.all;
        for (const keyword in rules) {
          const rule = rules[keyword];
          if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it3.schema, rule)) {
            const { type } = rule.definition;
            if (type.length && !type.some((t9) => hasApplicableType(ts, t9))) {
              strictTypesError(it3, `missing type "${type.join(",")}" for keyword "${keyword}"`);
            }
          }
        }
      }
      function hasApplicableType(schTs, kwdT) {
        return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
      }
      function includesType(ts, t9) {
        return ts.includes(t9) || t9 === "integer" && ts.includes("number");
      }
      function strictTypesError(it3, msg) {
        const schemaPath = it3.schemaEnv.baseId + it3.errSchemaPath;
        msg += ` at "${schemaPath}" (strictTypes)`;
        (0, util_1.checkStrictMode)(it3, msg, it3.opts.strictTypes);
      }
      var KeywordCxt = class {
        constructor(it3, def, keyword) {
          (0, keyword_1.validateKeywordUsage)(it3, def, keyword);
          this.gen = it3.gen;
          this.allErrors = it3.allErrors;
          this.keyword = keyword;
          this.data = it3.data;
          this.schema = it3.schema[keyword];
          this.$data = def.$data && it3.opts.$data && this.schema && this.schema.$data;
          this.schemaValue = (0, util_1.schemaRefOrVal)(it3, this.schema, keyword, this.$data);
          this.schemaType = def.schemaType;
          this.parentSchema = it3.schema;
          this.params = {};
          this.it = it3;
          this.def = def;
          if (this.$data) {
            this.schemaCode = it3.gen.const("vSchema", getData(this.$data, it3));
          } else {
            this.schemaCode = this.schemaValue;
            if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
              throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
            }
          }
          if ("code" in def ? def.trackErrors : def.errors !== false) {
            this.errsCount = it3.gen.const("_errs", names_1.default.errors);
          }
        }
        result(condition, successAction, failAction) {
          this.failResult((0, codegen_1.not)(condition), successAction, failAction);
        }
        failResult(condition, successAction, failAction) {
          this.gen.if(condition);
          if (failAction)
            failAction();
          else
            this.error();
          if (successAction) {
            this.gen.else();
            successAction();
            if (this.allErrors)
              this.gen.endIf();
          } else {
            if (this.allErrors)
              this.gen.endIf();
            else
              this.gen.else();
          }
        }
        pass(condition, failAction) {
          this.failResult((0, codegen_1.not)(condition), void 0, failAction);
        }
        fail(condition) {
          if (condition === void 0) {
            this.error();
            if (!this.allErrors)
              this.gen.if(false);
            return;
          }
          this.gen.if(condition);
          this.error();
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
        fail$data(condition) {
          if (!this.$data)
            return this.fail(condition);
          const { schemaCode } = this;
          this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
        }
        error(append, errorParams, errorPaths) {
          if (errorParams) {
            this.setParams(errorParams);
            this._error(append, errorPaths);
            this.setParams({});
            return;
          }
          this._error(append, errorPaths);
        }
        _error(append, errorPaths) {
          ;
          (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
        }
        $dataError() {
          (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
        }
        reset() {
          if (this.errsCount === void 0)
            throw new Error('add "trackErrors" to keyword definition');
          (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
        }
        ok(cond) {
          if (!this.allErrors)
            this.gen.if(cond);
        }
        setParams(obj, assign) {
          if (assign)
            Object.assign(this.params, obj);
          else
            this.params = obj;
        }
        block$data(valid2, codeBlock, $dataValid = codegen_1.nil) {
          this.gen.block(() => {
            this.check$data(valid2, $dataValid);
            codeBlock();
          });
        }
        check$data(valid2 = codegen_1.nil, $dataValid = codegen_1.nil) {
          if (!this.$data)
            return;
          const { gen, schemaCode, schemaType, def } = this;
          gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
          if (valid2 !== codegen_1.nil)
            gen.assign(valid2, true);
          if (schemaType.length || def.validateSchema) {
            gen.elseIf(this.invalid$data());
            this.$dataError();
            if (valid2 !== codegen_1.nil)
              gen.assign(valid2, false);
          }
          gen.else();
        }
        invalid$data() {
          const { gen, schemaCode, schemaType, def, it: it3 } = this;
          return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
          function wrong$DataType() {
            if (schemaType.length) {
              if (!(schemaCode instanceof codegen_1.Name))
                throw new Error("ajv implementation error");
              const st3 = Array.isArray(schemaType) ? schemaType : [schemaType];
              return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st3, schemaCode, it3.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
            }
            return codegen_1.nil;
          }
          function invalid$DataSchema() {
            if (def.validateSchema) {
              const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
              return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
            }
            return codegen_1.nil;
          }
        }
        subschema(appl, valid2) {
          const subschema = (0, subschema_1.getSubschema)(this.it, appl);
          (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
          (0, subschema_1.extendSubschemaMode)(subschema, appl);
          const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
          subschemaCode(nextContext, valid2);
          return nextContext;
        }
        mergeEvaluated(schemaCxt, toName) {
          const { it: it3, gen } = this;
          if (!it3.opts.unevaluated)
            return;
          if (it3.props !== true && schemaCxt.props !== void 0) {
            it3.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it3.props, toName);
          }
          if (it3.items !== true && schemaCxt.items !== void 0) {
            it3.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it3.items, toName);
          }
        }
        mergeValidEvaluated(schemaCxt, valid2) {
          const { it: it3, gen } = this;
          if (it3.opts.unevaluated && (it3.props !== true || it3.items !== true)) {
            gen.if(valid2, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
            return true;
          }
        }
      };
      exports.KeywordCxt = KeywordCxt;
      function keywordCode(it3, keyword, def, ruleType) {
        const cxt = new KeywordCxt(it3, def, keyword);
        if ("code" in def) {
          def.code(cxt, ruleType);
        } else if (cxt.$data && def.validate) {
          (0, keyword_1.funcKeywordCode)(cxt, def);
        } else if ("macro" in def) {
          (0, keyword_1.macroKeywordCode)(cxt, def);
        } else if (def.compile || def.validate) {
          (0, keyword_1.funcKeywordCode)(cxt, def);
        }
      }
      var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
      var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
      function getData($data, { dataLevel, dataNames, dataPathArr }) {
        let jsonPointer;
        let data;
        if ($data === "")
          return names_1.default.rootData;
        if ($data[0] === "/") {
          if (!JSON_POINTER.test($data))
            throw new Error(`Invalid JSON-pointer: ${$data}`);
          jsonPointer = $data;
          data = names_1.default.rootData;
        } else {
          const matches = RELATIVE_JSON_POINTER.exec($data);
          if (!matches)
            throw new Error(`Invalid JSON-pointer: ${$data}`);
          const up = +matches[1];
          jsonPointer = matches[2];
          if (jsonPointer === "#") {
            if (up >= dataLevel)
              throw new Error(errorMsg("property/index", up));
            return dataPathArr[dataLevel - up];
          }
          if (up > dataLevel)
            throw new Error(errorMsg("data", up));
          data = dataNames[dataLevel - up];
          if (!jsonPointer)
            return data;
        }
        let expr = data;
        const segments = jsonPointer.split("/");
        for (const segment of segments) {
          if (segment) {
            data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
            expr = (0, codegen_1._)`${expr} && ${data}`;
          }
        }
        return expr;
        function errorMsg(pointerType, up) {
          return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
        }
      }
      exports.getData = getData;
    }
  });

  // node_modules/ajv/dist/runtime/validation_error.js
  var require_validation_error = __commonJS({
    "node_modules/ajv/dist/runtime/validation_error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var ValidationError = class extends Error {
        constructor(errors) {
          super("validation failed");
          this.errors = errors;
          this.ajv = this.validation = true;
        }
      };
      exports.default = ValidationError;
    }
  });

  // node_modules/ajv/dist/compile/ref_error.js
  var require_ref_error = __commonJS({
    "node_modules/ajv/dist/compile/ref_error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var resolve_1 = require_resolve();
      var MissingRefError = class extends Error {
        constructor(resolver, baseId, ref, msg) {
          super(msg || `can't resolve reference ${ref} from id ${baseId}`);
          this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
          this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
        }
      };
      exports.default = MissingRefError;
    }
  });

  // node_modules/ajv/dist/compile/index.js
  var require_compile = __commonJS({
    "node_modules/ajv/dist/compile/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
      var codegen_1 = require_codegen();
      var validation_error_1 = require_validation_error();
      var names_1 = require_names();
      var resolve_1 = require_resolve();
      var util_1 = require_util();
      var validate_1 = require_validate();
      var SchemaEnv = class {
        constructor(env) {
          var _a;
          this.refs = {};
          this.dynamicAnchors = {};
          let schema;
          if (typeof env.schema == "object")
            schema = env.schema;
          this.schema = env.schema;
          this.schemaId = env.schemaId;
          this.root = env.root || this;
          this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
          this.schemaPath = env.schemaPath;
          this.localRefs = env.localRefs;
          this.meta = env.meta;
          this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
          this.refs = {};
        }
      };
      exports.SchemaEnv = SchemaEnv;
      function compileSchema(sch) {
        const _sch = getCompilingSchema.call(this, sch);
        if (_sch)
          return _sch;
        const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
        const { es5, lines } = this.opts.code;
        const { ownProperties } = this.opts;
        const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
        let _ValidationError;
        if (sch.$async) {
          _ValidationError = gen.scopeValue("Error", {
            ref: validation_error_1.default,
            code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
          });
        }
        const validateName = gen.scopeName("validate");
        sch.validateName = validateName;
        const schemaCxt = {
          gen,
          allErrors: this.opts.allErrors,
          data: names_1.default.data,
          parentData: names_1.default.parentData,
          parentDataProperty: names_1.default.parentDataProperty,
          dataNames: [names_1.default.data],
          dataPathArr: [codegen_1.nil],
          dataLevel: 0,
          dataTypes: [],
          definedProperties: /* @__PURE__ */ new Set(),
          topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
          validateName,
          ValidationError: _ValidationError,
          schema: sch.schema,
          schemaEnv: sch,
          rootId,
          baseId: sch.baseId || rootId,
          schemaPath: codegen_1.nil,
          errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
          errorPath: (0, codegen_1._)`""`,
          opts: this.opts,
          self: this
        };
        let sourceCode;
        try {
          this._compilations.add(sch);
          (0, validate_1.validateFunctionCode)(schemaCxt);
          gen.optimize(this.opts.code.optimize);
          const validateCode = gen.toString();
          sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
          if (this.opts.code.process)
            sourceCode = this.opts.code.process(sourceCode, sch);
          const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
          const validate3 = makeValidate(this, this.scope.get());
          this.scope.value(validateName, { ref: validate3 });
          validate3.errors = null;
          validate3.schema = sch.schema;
          validate3.schemaEnv = sch;
          if (sch.$async)
            validate3.$async = true;
          if (this.opts.code.source === true) {
            validate3.source = { validateName, validateCode, scopeValues: gen._values };
          }
          if (this.opts.unevaluated) {
            const { props, items } = schemaCxt;
            validate3.evaluated = {
              props: props instanceof codegen_1.Name ? void 0 : props,
              items: items instanceof codegen_1.Name ? void 0 : items,
              dynamicProps: props instanceof codegen_1.Name,
              dynamicItems: items instanceof codegen_1.Name
            };
            if (validate3.source)
              validate3.source.evaluated = (0, codegen_1.stringify)(validate3.evaluated);
          }
          sch.validate = validate3;
          return sch;
        } catch (e3) {
          delete sch.validate;
          delete sch.validateName;
          if (sourceCode)
            this.logger.error("Error compiling schema, function code:", sourceCode);
          throw e3;
        } finally {
          this._compilations.delete(sch);
        }
      }
      exports.compileSchema = compileSchema;
      function resolveRef(root, baseId, ref) {
        var _a;
        ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
        const schOrFunc = root.refs[ref];
        if (schOrFunc)
          return schOrFunc;
        let _sch = resolve2.call(this, root, ref);
        if (_sch === void 0) {
          const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
          const { schemaId } = this.opts;
          if (schema)
            _sch = new SchemaEnv({ schema, schemaId, root, baseId });
        }
        if (_sch === void 0)
          return;
        return root.refs[ref] = inlineOrCompile.call(this, _sch);
      }
      exports.resolveRef = resolveRef;
      function inlineOrCompile(sch) {
        if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
          return sch.schema;
        return sch.validate ? sch : compileSchema.call(this, sch);
      }
      function getCompilingSchema(schEnv) {
        for (const sch of this._compilations) {
          if (sameSchemaEnv(sch, schEnv))
            return sch;
        }
      }
      exports.getCompilingSchema = getCompilingSchema;
      function sameSchemaEnv(s1, s22) {
        return s1.schema === s22.schema && s1.root === s22.root && s1.baseId === s22.baseId;
      }
      function resolve2(root, ref) {
        let sch;
        while (typeof (sch = this.refs[ref]) == "string")
          ref = sch;
        return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
      }
      function resolveSchema(root, ref) {
        const p3 = this.opts.uriResolver.parse(ref);
        const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p3);
        let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
        if (Object.keys(root.schema).length > 0 && refPath === baseId) {
          return getJsonPointer.call(this, p3, root);
        }
        const id = (0, resolve_1.normalizeId)(refPath);
        const schOrRef = this.refs[id] || this.schemas[id];
        if (typeof schOrRef == "string") {
          const sch = resolveSchema.call(this, root, schOrRef);
          if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
            return;
          return getJsonPointer.call(this, p3, sch);
        }
        if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
          return;
        if (!schOrRef.validate)
          compileSchema.call(this, schOrRef);
        if (id === (0, resolve_1.normalizeId)(ref)) {
          const { schema } = schOrRef;
          const { schemaId } = this.opts;
          const schId = schema[schemaId];
          if (schId)
            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
          return new SchemaEnv({ schema, schemaId, root, baseId });
        }
        return getJsonPointer.call(this, p3, schOrRef);
      }
      exports.resolveSchema = resolveSchema;
      var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
        "properties",
        "patternProperties",
        "enum",
        "dependencies",
        "definitions"
      ]);
      function getJsonPointer(parsedRef, { baseId, schema, root }) {
        var _a;
        if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
          return;
        for (const part of parsedRef.fragment.slice(1).split("/")) {
          if (typeof schema === "boolean")
            return;
          const partSchema = schema[(0, util_1.unescapeFragment)(part)];
          if (partSchema === void 0)
            return;
          schema = partSchema;
          const schId = typeof schema === "object" && schema[this.opts.schemaId];
          if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
          }
        }
        let env;
        if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
          const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
          env = resolveSchema.call(this, root, $ref);
        }
        const { schemaId } = this.opts;
        env = env || new SchemaEnv({ schema, schemaId, root, baseId });
        if (env.schema !== env.root.schema)
          return env;
        return void 0;
      }
    }
  });

  // node_modules/ajv/dist/refs/data.json
  var require_data = __commonJS({
    "node_modules/ajv/dist/refs/data.json"(exports, module) {
      module.exports = {
        $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
        description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
        type: "object",
        required: ["$data"],
        properties: {
          $data: {
            type: "string",
            anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
          }
        },
        additionalProperties: false
      };
    }
  });

  // node_modules/uri-js/dist/es5/uri.all.js
  var require_uri_all = __commonJS({
    "node_modules/uri-js/dist/es5/uri.all.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global2.URI = global2.URI || {});
      })(exports, function(exports2) {
        "use strict";
        function merge2() {
          for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
            sets[_key] = arguments[_key];
          }
          if (sets.length > 1) {
            sets[0] = sets[0].slice(0, -1);
            var xl = sets.length - 1;
            for (var x3 = 1; x3 < xl; ++x3) {
              sets[x3] = sets[x3].slice(1, -1);
            }
            sets[xl] = sets[xl].slice(1);
            return sets.join("");
          } else {
            return sets[0];
          }
        }
        function subexp(str) {
          return "(?:" + str + ")";
        }
        function typeOf(o3) {
          return o3 === void 0 ? "undefined" : o3 === null ? "null" : Object.prototype.toString.call(o3).split(" ").pop().split("]").shift().toLowerCase();
        }
        function toUpperCase(str) {
          return str.toUpperCase();
        }
        function toArray(obj) {
          return obj !== void 0 && obj !== null ? obj instanceof Array ? obj : typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj) : [];
        }
        function assign(target, source) {
          var obj = target;
          if (source) {
            for (var key in source) {
              obj[key] = source[key];
            }
          }
          return obj;
        }
        function buildExps(isIRI2) {
          var ALPHA$$ = "[A-Za-z]", CR$ = "[\\x0D]", DIGIT$$ = "[0-9]", DQUOTE$$ = "[\\x22]", HEXDIG$$2 = merge2(DIGIT$$, "[A-Fa-f]"), LF$$ = "[\\x0A]", SP$$ = "[\\x20]", PCT_ENCODED$2 = subexp(subexp("%[EFef]" + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2) + "|" + subexp("%" + HEXDIG$$2 + HEXDIG$$2)), GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]", SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", RESERVED$$ = merge2(GEN_DELIMS$$, SUB_DELIMS$$), UCSCHAR$$ = isIRI2 ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", IPRIVATE$$ = isIRI2 ? "[\\uE000-\\uF8FF]" : "[]", UNRESERVED$$2 = merge2(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]", UCSCHAR$$), SCHEME$ = subexp(ALPHA$$ + merge2(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*"), USERINFO$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge2(UNRESERVED$$2, SUB_DELIMS$$, "[\\:]")) + "*"), DEC_OCTET$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("[1-9]" + DIGIT$$) + "|" + DIGIT$$), DEC_OCTET_RELAXED$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("0?[1-9]" + DIGIT$$) + "|0?0?" + DIGIT$$), IPV4ADDRESS$ = subexp(DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$), H16$ = subexp(HEXDIG$$2 + "{1,4}"), LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$), IPV6ADDRESS1$ = subexp(subexp(H16$ + "\\:") + "{6}" + LS32$), IPV6ADDRESS2$ = subexp("\\:\\:" + subexp(H16$ + "\\:") + "{5}" + LS32$), IPV6ADDRESS3$ = subexp(subexp(H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{4}" + LS32$), IPV6ADDRESS4$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,1}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{3}" + LS32$), IPV6ADDRESS5$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,2}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{2}" + LS32$), IPV6ADDRESS6$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,3}" + H16$) + "?\\:\\:" + H16$ + "\\:" + LS32$), IPV6ADDRESS7$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,4}" + H16$) + "?\\:\\:" + LS32$), IPV6ADDRESS8$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,5}" + H16$) + "?\\:\\:" + H16$), IPV6ADDRESS9$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,6}" + H16$) + "?\\:\\:"), IPV6ADDRESS$ = subexp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join("|")), ZONEID$ = subexp(subexp(UNRESERVED$$2 + "|" + PCT_ENCODED$2) + "+"), IPV6ADDRZ$ = subexp(IPV6ADDRESS$ + "\\%25" + ZONEID$), IPV6ADDRZ_RELAXED$ = subexp(IPV6ADDRESS$ + subexp("\\%25|\\%(?!" + HEXDIG$$2 + "{2})") + ZONEID$), IPVFUTURE$ = subexp("[vV]" + HEXDIG$$2 + "+\\." + merge2(UNRESERVED$$2, SUB_DELIMS$$, "[\\:]") + "+"), IP_LITERAL$ = subexp("\\[" + subexp(IPV6ADDRZ_RELAXED$ + "|" + IPV6ADDRESS$ + "|" + IPVFUTURE$) + "\\]"), REG_NAME$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge2(UNRESERVED$$2, SUB_DELIMS$$)) + "*"), HOST$ = subexp(IP_LITERAL$ + "|" + IPV4ADDRESS$ + "(?!" + REG_NAME$ + ")|" + REG_NAME$), PORT$ = subexp(DIGIT$$ + "*"), AUTHORITY$ = subexp(subexp(USERINFO$ + "@") + "?" + HOST$ + subexp("\\:" + PORT$) + "?"), PCHAR$ = subexp(PCT_ENCODED$2 + "|" + merge2(UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@]")), SEGMENT$ = subexp(PCHAR$ + "*"), SEGMENT_NZ$ = subexp(PCHAR$ + "+"), SEGMENT_NZ_NC$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge2(UNRESERVED$$2, SUB_DELIMS$$, "[\\@]")) + "+"), PATH_ABEMPTY$ = subexp(subexp("\\/" + SEGMENT$) + "*"), PATH_ABSOLUTE$ = subexp("\\/" + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + "?"), PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$), PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$), PATH_EMPTY$ = "(?!" + PCHAR$ + ")", PATH$ = subexp(PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$), QUERY$ = subexp(subexp(PCHAR$ + "|" + merge2("[\\/\\?]", IPRIVATE$$)) + "*"), FRAGMENT$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"), HIER_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$), URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"), RELATIVE_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$), RELATIVE$ = subexp(RELATIVE_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"), URI_REFERENCE$ = subexp(URI$ + "|" + RELATIVE$), ABSOLUTE_URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?"), GENERIC_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", RELATIVE_REF$ = "^(){0}" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", ABSOLUTE_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?$", SAMEDOC_REF$ = "^" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", AUTHORITY_REF$ = "^" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?$";
          return {
            NOT_SCHEME: new RegExp(merge2("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
            NOT_USERINFO: new RegExp(merge2("[^\\%\\:]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
            NOT_HOST: new RegExp(merge2("[^\\%\\[\\]\\:]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
            NOT_PATH: new RegExp(merge2("[^\\%\\/\\:\\@]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
            NOT_PATH_NOSCHEME: new RegExp(merge2("[^\\%\\/\\@]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
            NOT_QUERY: new RegExp(merge2("[^\\%]", UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@\\/\\?]", IPRIVATE$$), "g"),
            NOT_FRAGMENT: new RegExp(merge2("[^\\%]", UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
            ESCAPE: new RegExp(merge2("[^]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
            UNRESERVED: new RegExp(UNRESERVED$$2, "g"),
            OTHER_CHARS: new RegExp(merge2("[^\\%]", UNRESERVED$$2, RESERVED$$), "g"),
            PCT_ENCODED: new RegExp(PCT_ENCODED$2, "g"),
            IPV4ADDRESS: new RegExp("^(" + IPV4ADDRESS$ + ")$"),
            IPV6ADDRESS: new RegExp("^\\[?(" + IPV6ADDRESS$ + ")" + subexp(subexp("\\%25|\\%(?!" + HEXDIG$$2 + "{2})") + "(" + ZONEID$ + ")") + "?\\]?$")
          };
        }
        var URI_PROTOCOL = buildExps(false);
        var IRI_PROTOCOL = buildExps(true);
        var slicedToArray = function() {
          function sliceIterator(arr, i3) {
            var _arr = [];
            var _n2 = true;
            var _d = false;
            var _e3 = void 0;
            try {
              for (var _i2 = arr[Symbol.iterator](), _s; !(_n2 = (_s = _i2.next()).done); _n2 = true) {
                _arr.push(_s.value);
                if (i3 && _arr.length === i3)
                  break;
              }
            } catch (err) {
              _d = true;
              _e3 = err;
            } finally {
              try {
                if (!_n2 && _i2["return"])
                  _i2["return"]();
              } finally {
                if (_d)
                  throw _e3;
              }
            }
            return _arr;
          }
          return function(arr, i3) {
            if (Array.isArray(arr)) {
              return arr;
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i3);
            } else {
              throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
          };
        }();
        var toConsumableArray = function(arr) {
          if (Array.isArray(arr)) {
            for (var i3 = 0, arr2 = Array(arr.length); i3 < arr.length; i3++)
              arr2[i3] = arr[i3];
            return arr2;
          } else {
            return Array.from(arr);
          }
        };
        var maxInt = 2147483647;
        var base = 36;
        var tMin = 1;
        var tMax = 26;
        var skew = 38;
        var damp = 700;
        var initialBias = 72;
        var initialN = 128;
        var delimiter = "-";
        var regexPunycode = /^xn--/;
        var regexNonASCII = /[^\0-\x7E]/;
        var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
        var errors = {
          "overflow": "Overflow: input needs wider integers to process",
          "not-basic": "Illegal input >= 0x80 (not a basic code point)",
          "invalid-input": "Invalid input"
        };
        var baseMinusTMin = base - tMin;
        var floor = Math.floor;
        var stringFromCharCode = String.fromCharCode;
        function error$1(type) {
          throw new RangeError(errors[type]);
        }
        function map(array, fn2) {
          var result = [];
          var length = array.length;
          while (length--) {
            result[length] = fn2(array[length]);
          }
          return result;
        }
        function mapDomain(string, fn2) {
          var parts = string.split("@");
          var result = "";
          if (parts.length > 1) {
            result = parts[0] + "@";
            string = parts[1];
          }
          string = string.replace(regexSeparators, ".");
          var labels = string.split(".");
          var encoded = map(labels, fn2).join(".");
          return result + encoded;
        }
        function ucs2decode(string) {
          var output = [];
          var counter = 0;
          var length = string.length;
          while (counter < length) {
            var value = string.charCodeAt(counter++);
            if (value >= 55296 && value <= 56319 && counter < length) {
              var extra = string.charCodeAt(counter++);
              if ((extra & 64512) == 56320) {
                output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
              } else {
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        }
        var ucs2encode = function ucs2encode2(array) {
          return String.fromCodePoint.apply(String, toConsumableArray(array));
        };
        var basicToDigit = function basicToDigit2(codePoint) {
          if (codePoint - 48 < 10) {
            return codePoint - 22;
          }
          if (codePoint - 65 < 26) {
            return codePoint - 65;
          }
          if (codePoint - 97 < 26) {
            return codePoint - 97;
          }
          return base;
        };
        var digitToBasic = function digitToBasic2(digit, flag) {
          return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
        };
        var adapt = function adapt2(delta, numPoints, firstTime) {
          var k3 = 0;
          delta = firstTime ? floor(delta / damp) : delta >> 1;
          delta += floor(delta / numPoints);
          for (; delta > baseMinusTMin * tMax >> 1; k3 += base) {
            delta = floor(delta / baseMinusTMin);
          }
          return floor(k3 + (baseMinusTMin + 1) * delta / (delta + skew));
        };
        var decode = function decode2(input) {
          var output = [];
          var inputLength = input.length;
          var i3 = 0;
          var n3 = initialN;
          var bias = initialBias;
          var basic = input.lastIndexOf(delimiter);
          if (basic < 0) {
            basic = 0;
          }
          for (var j3 = 0; j3 < basic; ++j3) {
            if (input.charCodeAt(j3) >= 128) {
              error$1("not-basic");
            }
            output.push(input.charCodeAt(j3));
          }
          for (var index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
            var oldi = i3;
            for (var w3 = 1, k3 = base; ; k3 += base) {
              if (index >= inputLength) {
                error$1("invalid-input");
              }
              var digit = basicToDigit(input.charCodeAt(index++));
              if (digit >= base || digit > floor((maxInt - i3) / w3)) {
                error$1("overflow");
              }
              i3 += digit * w3;
              var t9 = k3 <= bias ? tMin : k3 >= bias + tMax ? tMax : k3 - bias;
              if (digit < t9) {
                break;
              }
              var baseMinusT = base - t9;
              if (w3 > floor(maxInt / baseMinusT)) {
                error$1("overflow");
              }
              w3 *= baseMinusT;
            }
            var out = output.length + 1;
            bias = adapt(i3 - oldi, out, oldi == 0);
            if (floor(i3 / out) > maxInt - n3) {
              error$1("overflow");
            }
            n3 += floor(i3 / out);
            i3 %= out;
            output.splice(i3++, 0, n3);
          }
          return String.fromCodePoint.apply(String, output);
        };
        var encode = function encode2(input) {
          var output = [];
          input = ucs2decode(input);
          var inputLength = input.length;
          var n3 = initialN;
          var delta = 0;
          var bias = initialBias;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _currentValue2 = _step.value;
              if (_currentValue2 < 128) {
                output.push(stringFromCharCode(_currentValue2));
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
          var basicLength = output.length;
          var handledCPCount = basicLength;
          if (basicLength) {
            output.push(delimiter);
          }
          while (handledCPCount < inputLength) {
            var m3 = maxInt;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = void 0;
            try {
              for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var currentValue = _step2.value;
                if (currentValue >= n3 && currentValue < m3) {
                  m3 = currentValue;
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
            var handledCPCountPlusOne = handledCPCount + 1;
            if (m3 - n3 > floor((maxInt - delta) / handledCPCountPlusOne)) {
              error$1("overflow");
            }
            delta += (m3 - n3) * handledCPCountPlusOne;
            n3 = m3;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = void 0;
            try {
              for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _currentValue = _step3.value;
                if (_currentValue < n3 && ++delta > maxInt) {
                  error$1("overflow");
                }
                if (_currentValue == n3) {
                  var q3 = delta;
                  for (var k3 = base; ; k3 += base) {
                    var t9 = k3 <= bias ? tMin : k3 >= bias + tMax ? tMax : k3 - bias;
                    if (q3 < t9) {
                      break;
                    }
                    var qMinusT = q3 - t9;
                    var baseMinusT = base - t9;
                    output.push(stringFromCharCode(digitToBasic(t9 + qMinusT % baseMinusT, 0)));
                    q3 = floor(qMinusT / baseMinusT);
                  }
                  output.push(stringFromCharCode(digitToBasic(q3, 0)));
                  bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                  delta = 0;
                  ++handledCPCount;
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
            ++delta;
            ++n3;
          }
          return output.join("");
        };
        var toUnicode = function toUnicode2(input) {
          return mapDomain(input, function(string) {
            return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
          });
        };
        var toASCII = function toASCII2(input) {
          return mapDomain(input, function(string) {
            return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
          });
        };
        var punycode = {
          "version": "2.1.0",
          "ucs2": {
            "decode": ucs2decode,
            "encode": ucs2encode
          },
          "decode": decode,
          "encode": encode,
          "toASCII": toASCII,
          "toUnicode": toUnicode
        };
        var SCHEMES = {};
        function pctEncChar(chr) {
          var c3 = chr.charCodeAt(0);
          var e3 = void 0;
          if (c3 < 16)
            e3 = "%0" + c3.toString(16).toUpperCase();
          else if (c3 < 128)
            e3 = "%" + c3.toString(16).toUpperCase();
          else if (c3 < 2048)
            e3 = "%" + (c3 >> 6 | 192).toString(16).toUpperCase() + "%" + (c3 & 63 | 128).toString(16).toUpperCase();
          else
            e3 = "%" + (c3 >> 12 | 224).toString(16).toUpperCase() + "%" + (c3 >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (c3 & 63 | 128).toString(16).toUpperCase();
          return e3;
        }
        function pctDecChars(str) {
          var newStr = "";
          var i3 = 0;
          var il = str.length;
          while (i3 < il) {
            var c3 = parseInt(str.substr(i3 + 1, 2), 16);
            if (c3 < 128) {
              newStr += String.fromCharCode(c3);
              i3 += 3;
            } else if (c3 >= 194 && c3 < 224) {
              if (il - i3 >= 6) {
                var c22 = parseInt(str.substr(i3 + 4, 2), 16);
                newStr += String.fromCharCode((c3 & 31) << 6 | c22 & 63);
              } else {
                newStr += str.substr(i3, 6);
              }
              i3 += 6;
            } else if (c3 >= 224) {
              if (il - i3 >= 9) {
                var _c = parseInt(str.substr(i3 + 4, 2), 16);
                var c32 = parseInt(str.substr(i3 + 7, 2), 16);
                newStr += String.fromCharCode((c3 & 15) << 12 | (_c & 63) << 6 | c32 & 63);
              } else {
                newStr += str.substr(i3, 9);
              }
              i3 += 9;
            } else {
              newStr += str.substr(i3, 3);
              i3 += 3;
            }
          }
          return newStr;
        }
        function _normalizeComponentEncoding(components, protocol) {
          function decodeUnreserved2(str) {
            var decStr = pctDecChars(str);
            return !decStr.match(protocol.UNRESERVED) ? str : decStr;
          }
          if (components.scheme)
            components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved2).toLowerCase().replace(protocol.NOT_SCHEME, "");
          if (components.userinfo !== void 0)
            components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
          if (components.host !== void 0)
            components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved2).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
          if (components.path !== void 0)
            components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
          if (components.query !== void 0)
            components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
          if (components.fragment !== void 0)
            components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
          return components;
        }
        function _stripLeadingZeros(str) {
          return str.replace(/^0*(.*)/, "$1") || "0";
        }
        function _normalizeIPv4(host, protocol) {
          var matches = host.match(protocol.IPV4ADDRESS) || [];
          var _matches = slicedToArray(matches, 2), address = _matches[1];
          if (address) {
            return address.split(".").map(_stripLeadingZeros).join(".");
          } else {
            return host;
          }
        }
        function _normalizeIPv6(host, protocol) {
          var matches = host.match(protocol.IPV6ADDRESS) || [];
          var _matches2 = slicedToArray(matches, 3), address = _matches2[1], zone = _matches2[2];
          if (address) {
            var _address$toLowerCase$ = address.toLowerCase().split("::").reverse(), _address$toLowerCase$2 = slicedToArray(_address$toLowerCase$, 2), last = _address$toLowerCase$2[0], first = _address$toLowerCase$2[1];
            var firstFields = first ? first.split(":").map(_stripLeadingZeros) : [];
            var lastFields = last.split(":").map(_stripLeadingZeros);
            var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]);
            var fieldCount = isLastFieldIPv4Address ? 7 : 8;
            var lastFieldsStart = lastFields.length - fieldCount;
            var fields = Array(fieldCount);
            for (var x3 = 0; x3 < fieldCount; ++x3) {
              fields[x3] = firstFields[x3] || lastFields[lastFieldsStart + x3] || "";
            }
            if (isLastFieldIPv4Address) {
              fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);
            }
            var allZeroFields = fields.reduce(function(acc, field, index) {
              if (!field || field === "0") {
                var lastLongest = acc[acc.length - 1];
                if (lastLongest && lastLongest.index + lastLongest.length === index) {
                  lastLongest.length++;
                } else {
                  acc.push({ index, length: 1 });
                }
              }
              return acc;
            }, []);
            var longestZeroFields = allZeroFields.sort(function(a3, b3) {
              return b3.length - a3.length;
            })[0];
            var newHost = void 0;
            if (longestZeroFields && longestZeroFields.length > 1) {
              var newFirst = fields.slice(0, longestZeroFields.index);
              var newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
              newHost = newFirst.join(":") + "::" + newLast.join(":");
            } else {
              newHost = fields.join(":");
            }
            if (zone) {
              newHost += "%" + zone;
            }
            return newHost;
          } else {
            return host;
          }
        }
        var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
        var NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === void 0;
        function parse(uriString) {
          var options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var components = {};
          var protocol = options2.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
          if (options2.reference === "suffix")
            uriString = (options2.scheme ? options2.scheme + ":" : "") + "//" + uriString;
          var matches = uriString.match(URI_PARSE);
          if (matches) {
            if (NO_MATCH_IS_UNDEFINED) {
              components.scheme = matches[1];
              components.userinfo = matches[3];
              components.host = matches[4];
              components.port = parseInt(matches[5], 10);
              components.path = matches[6] || "";
              components.query = matches[7];
              components.fragment = matches[8];
              if (isNaN(components.port)) {
                components.port = matches[5];
              }
            } else {
              components.scheme = matches[1] || void 0;
              components.userinfo = uriString.indexOf("@") !== -1 ? matches[3] : void 0;
              components.host = uriString.indexOf("//") !== -1 ? matches[4] : void 0;
              components.port = parseInt(matches[5], 10);
              components.path = matches[6] || "";
              components.query = uriString.indexOf("?") !== -1 ? matches[7] : void 0;
              components.fragment = uriString.indexOf("#") !== -1 ? matches[8] : void 0;
              if (isNaN(components.port)) {
                components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : void 0;
              }
            }
            if (components.host) {
              components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);
            }
            if (components.scheme === void 0 && components.userinfo === void 0 && components.host === void 0 && components.port === void 0 && !components.path && components.query === void 0) {
              components.reference = "same-document";
            } else if (components.scheme === void 0) {
              components.reference = "relative";
            } else if (components.fragment === void 0) {
              components.reference = "absolute";
            } else {
              components.reference = "uri";
            }
            if (options2.reference && options2.reference !== "suffix" && options2.reference !== components.reference) {
              components.error = components.error || "URI is not a " + options2.reference + " reference.";
            }
            var schemeHandler = SCHEMES[(options2.scheme || components.scheme || "").toLowerCase()];
            if (!options2.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
              if (components.host && (options2.domainHost || schemeHandler && schemeHandler.domainHost)) {
                try {
                  components.host = punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
                } catch (e3) {
                  components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e3;
                }
              }
              _normalizeComponentEncoding(components, URI_PROTOCOL);
            } else {
              _normalizeComponentEncoding(components, protocol);
            }
            if (schemeHandler && schemeHandler.parse) {
              schemeHandler.parse(components, options2);
            }
          } else {
            components.error = components.error || "URI can not be parsed.";
          }
          return components;
        }
        function _recomposeAuthority(components, options2) {
          var protocol = options2.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
          var uriTokens = [];
          if (components.userinfo !== void 0) {
            uriTokens.push(components.userinfo);
            uriTokens.push("@");
          }
          if (components.host !== void 0) {
            uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function(_3, $1, $22) {
              return "[" + $1 + ($22 ? "%25" + $22 : "") + "]";
            }));
          }
          if (typeof components.port === "number" || typeof components.port === "string") {
            uriTokens.push(":");
            uriTokens.push(String(components.port));
          }
          return uriTokens.length ? uriTokens.join("") : void 0;
        }
        var RDS1 = /^\.\.?\//;
        var RDS2 = /^\/\.(\/|$)/;
        var RDS3 = /^\/\.\.(\/|$)/;
        var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
        function removeDotSegments(input) {
          var output = [];
          while (input.length) {
            if (input.match(RDS1)) {
              input = input.replace(RDS1, "");
            } else if (input.match(RDS2)) {
              input = input.replace(RDS2, "/");
            } else if (input.match(RDS3)) {
              input = input.replace(RDS3, "/");
              output.pop();
            } else if (input === "." || input === "..") {
              input = "";
            } else {
              var im = input.match(RDS5);
              if (im) {
                var s3 = im[0];
                input = input.slice(s3.length);
                output.push(s3);
              } else {
                throw new Error("Unexpected dot segment condition");
              }
            }
          }
          return output.join("");
        }
        function serialize(components) {
          var options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var protocol = options2.iri ? IRI_PROTOCOL : URI_PROTOCOL;
          var uriTokens = [];
          var schemeHandler = SCHEMES[(options2.scheme || components.scheme || "").toLowerCase()];
          if (schemeHandler && schemeHandler.serialize)
            schemeHandler.serialize(components, options2);
          if (components.host) {
            if (protocol.IPV6ADDRESS.test(components.host)) {
            } else if (options2.domainHost || schemeHandler && schemeHandler.domainHost) {
              try {
                components.host = !options2.iri ? punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode.toUnicode(components.host);
              } catch (e3) {
                components.error = components.error || "Host's domain name can not be converted to " + (!options2.iri ? "ASCII" : "Unicode") + " via punycode: " + e3;
              }
            }
          }
          _normalizeComponentEncoding(components, protocol);
          if (options2.reference !== "suffix" && components.scheme) {
            uriTokens.push(components.scheme);
            uriTokens.push(":");
          }
          var authority = _recomposeAuthority(components, options2);
          if (authority !== void 0) {
            if (options2.reference !== "suffix") {
              uriTokens.push("//");
            }
            uriTokens.push(authority);
            if (components.path && components.path.charAt(0) !== "/") {
              uriTokens.push("/");
            }
          }
          if (components.path !== void 0) {
            var s3 = components.path;
            if (!options2.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
              s3 = removeDotSegments(s3);
            }
            if (authority === void 0) {
              s3 = s3.replace(/^\/\//, "/%2F");
            }
            uriTokens.push(s3);
          }
          if (components.query !== void 0) {
            uriTokens.push("?");
            uriTokens.push(components.query);
          }
          if (components.fragment !== void 0) {
            uriTokens.push("#");
            uriTokens.push(components.fragment);
          }
          return uriTokens.join("");
        }
        function resolveComponents(base2, relative) {
          var options2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          var skipNormalization = arguments[3];
          var target = {};
          if (!skipNormalization) {
            base2 = parse(serialize(base2, options2), options2);
            relative = parse(serialize(relative, options2), options2);
          }
          options2 = options2 || {};
          if (!options2.tolerant && relative.scheme) {
            target.scheme = relative.scheme;
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
          } else {
            if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
              target.userinfo = relative.userinfo;
              target.host = relative.host;
              target.port = relative.port;
              target.path = removeDotSegments(relative.path || "");
              target.query = relative.query;
            } else {
              if (!relative.path) {
                target.path = base2.path;
                if (relative.query !== void 0) {
                  target.query = relative.query;
                } else {
                  target.query = base2.query;
                }
              } else {
                if (relative.path.charAt(0) === "/") {
                  target.path = removeDotSegments(relative.path);
                } else {
                  if ((base2.userinfo !== void 0 || base2.host !== void 0 || base2.port !== void 0) && !base2.path) {
                    target.path = "/" + relative.path;
                  } else if (!base2.path) {
                    target.path = relative.path;
                  } else {
                    target.path = base2.path.slice(0, base2.path.lastIndexOf("/") + 1) + relative.path;
                  }
                  target.path = removeDotSegments(target.path);
                }
                target.query = relative.query;
              }
              target.userinfo = base2.userinfo;
              target.host = base2.host;
              target.port = base2.port;
            }
            target.scheme = base2.scheme;
          }
          target.fragment = relative.fragment;
          return target;
        }
        function resolve2(baseURI, relativeURI, options2) {
          var schemelessOptions = assign({ scheme: "null" }, options2);
          return serialize(resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
        }
        function normalize(uri, options2) {
          if (typeof uri === "string") {
            uri = serialize(parse(uri, options2), options2);
          } else if (typeOf(uri) === "object") {
            uri = parse(serialize(uri, options2), options2);
          }
          return uri;
        }
        function equal(uriA, uriB, options2) {
          if (typeof uriA === "string") {
            uriA = serialize(parse(uriA, options2), options2);
          } else if (typeOf(uriA) === "object") {
            uriA = serialize(uriA, options2);
          }
          if (typeof uriB === "string") {
            uriB = serialize(parse(uriB, options2), options2);
          } else if (typeOf(uriB) === "object") {
            uriB = serialize(uriB, options2);
          }
          return uriA === uriB;
        }
        function escapeComponent(str, options2) {
          return str && str.toString().replace(!options2 || !options2.iri ? URI_PROTOCOL.ESCAPE : IRI_PROTOCOL.ESCAPE, pctEncChar);
        }
        function unescapeComponent(str, options2) {
          return str && str.toString().replace(!options2 || !options2.iri ? URI_PROTOCOL.PCT_ENCODED : IRI_PROTOCOL.PCT_ENCODED, pctDecChars);
        }
        var handler = {
          scheme: "http",
          domainHost: true,
          parse: function parse2(components, options2) {
            if (!components.host) {
              components.error = components.error || "HTTP URIs must have a host.";
            }
            return components;
          },
          serialize: function serialize2(components, options2) {
            var secure = String(components.scheme).toLowerCase() === "https";
            if (components.port === (secure ? 443 : 80) || components.port === "") {
              components.port = void 0;
            }
            if (!components.path) {
              components.path = "/";
            }
            return components;
          }
        };
        var handler$1 = {
          scheme: "https",
          domainHost: handler.domainHost,
          parse: handler.parse,
          serialize: handler.serialize
        };
        function isSecure(wsComponents) {
          return typeof wsComponents.secure === "boolean" ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
        }
        var handler$2 = {
          scheme: "ws",
          domainHost: true,
          parse: function parse2(components, options2) {
            var wsComponents = components;
            wsComponents.secure = isSecure(wsComponents);
            wsComponents.resourceName = (wsComponents.path || "/") + (wsComponents.query ? "?" + wsComponents.query : "");
            wsComponents.path = void 0;
            wsComponents.query = void 0;
            return wsComponents;
          },
          serialize: function serialize2(wsComponents, options2) {
            if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") {
              wsComponents.port = void 0;
            }
            if (typeof wsComponents.secure === "boolean") {
              wsComponents.scheme = wsComponents.secure ? "wss" : "ws";
              wsComponents.secure = void 0;
            }
            if (wsComponents.resourceName) {
              var _wsComponents$resourc = wsComponents.resourceName.split("?"), _wsComponents$resourc2 = slicedToArray(_wsComponents$resourc, 2), path2 = _wsComponents$resourc2[0], query = _wsComponents$resourc2[1];
              wsComponents.path = path2 && path2 !== "/" ? path2 : void 0;
              wsComponents.query = query;
              wsComponents.resourceName = void 0;
            }
            wsComponents.fragment = void 0;
            return wsComponents;
          }
        };
        var handler$3 = {
          scheme: "wss",
          domainHost: handler$2.domainHost,
          parse: handler$2.parse,
          serialize: handler$2.serialize
        };
        var O3 = {};
        var isIRI = true;
        var UNRESERVED$$ = "[A-Za-z0-9\\-\\.\\_\\~" + (isIRI ? "\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF" : "") + "]";
        var HEXDIG$$ = "[0-9A-Fa-f]";
        var PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$));
        var ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]";
        var QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]";
        var VCHAR$$ = merge2(QTEXT$$, '[\\"\\\\]');
        var SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]";
        var UNRESERVED = new RegExp(UNRESERVED$$, "g");
        var PCT_ENCODED = new RegExp(PCT_ENCODED$, "g");
        var NOT_LOCAL_PART = new RegExp(merge2("[^]", ATEXT$$, "[\\.]", '[\\"]', VCHAR$$), "g");
        var NOT_HFNAME = new RegExp(merge2("[^]", UNRESERVED$$, SOME_DELIMS$$), "g");
        var NOT_HFVALUE = NOT_HFNAME;
        function decodeUnreserved(str) {
          var decStr = pctDecChars(str);
          return !decStr.match(UNRESERVED) ? str : decStr;
        }
        var handler$4 = {
          scheme: "mailto",
          parse: function parse$$1(components, options2) {
            var mailtoComponents = components;
            var to = mailtoComponents.to = mailtoComponents.path ? mailtoComponents.path.split(",") : [];
            mailtoComponents.path = void 0;
            if (mailtoComponents.query) {
              var unknownHeaders = false;
              var headers = {};
              var hfields = mailtoComponents.query.split("&");
              for (var x3 = 0, xl = hfields.length; x3 < xl; ++x3) {
                var hfield = hfields[x3].split("=");
                switch (hfield[0]) {
                  case "to":
                    var toAddrs = hfield[1].split(",");
                    for (var _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) {
                      to.push(toAddrs[_x]);
                    }
                    break;
                  case "subject":
                    mailtoComponents.subject = unescapeComponent(hfield[1], options2);
                    break;
                  case "body":
                    mailtoComponents.body = unescapeComponent(hfield[1], options2);
                    break;
                  default:
                    unknownHeaders = true;
                    headers[unescapeComponent(hfield[0], options2)] = unescapeComponent(hfield[1], options2);
                    break;
                }
              }
              if (unknownHeaders)
                mailtoComponents.headers = headers;
            }
            mailtoComponents.query = void 0;
            for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
              var addr = to[_x2].split("@");
              addr[0] = unescapeComponent(addr[0]);
              if (!options2.unicodeSupport) {
                try {
                  addr[1] = punycode.toASCII(unescapeComponent(addr[1], options2).toLowerCase());
                } catch (e3) {
                  mailtoComponents.error = mailtoComponents.error || "Email address's domain name can not be converted to ASCII via punycode: " + e3;
                }
              } else {
                addr[1] = unescapeComponent(addr[1], options2).toLowerCase();
              }
              to[_x2] = addr.join("@");
            }
            return mailtoComponents;
          },
          serialize: function serialize$$1(mailtoComponents, options2) {
            var components = mailtoComponents;
            var to = toArray(mailtoComponents.to);
            if (to) {
              for (var x3 = 0, xl = to.length; x3 < xl; ++x3) {
                var toAddr = String(to[x3]);
                var atIdx = toAddr.lastIndexOf("@");
                var localPart = toAddr.slice(0, atIdx).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar);
                var domain = toAddr.slice(atIdx + 1);
                try {
                  domain = !options2.iri ? punycode.toASCII(unescapeComponent(domain, options2).toLowerCase()) : punycode.toUnicode(domain);
                } catch (e3) {
                  components.error = components.error || "Email address's domain name can not be converted to " + (!options2.iri ? "ASCII" : "Unicode") + " via punycode: " + e3;
                }
                to[x3] = localPart + "@" + domain;
              }
              components.path = to.join(",");
            }
            var headers = mailtoComponents.headers = mailtoComponents.headers || {};
            if (mailtoComponents.subject)
              headers["subject"] = mailtoComponents.subject;
            if (mailtoComponents.body)
              headers["body"] = mailtoComponents.body;
            var fields = [];
            for (var name2 in headers) {
              if (headers[name2] !== O3[name2]) {
                fields.push(name2.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar) + "=" + headers[name2].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar));
              }
            }
            if (fields.length) {
              components.query = fields.join("&");
            }
            return components;
          }
        };
        var URN_PARSE = /^([^\:]+)\:(.*)/;
        var handler$5 = {
          scheme: "urn",
          parse: function parse$$1(components, options2) {
            var matches = components.path && components.path.match(URN_PARSE);
            var urnComponents = components;
            if (matches) {
              var scheme = options2.scheme || urnComponents.scheme || "urn";
              var nid = matches[1].toLowerCase();
              var nss = matches[2];
              var urnScheme = scheme + ":" + (options2.nid || nid);
              var schemeHandler = SCHEMES[urnScheme];
              urnComponents.nid = nid;
              urnComponents.nss = nss;
              urnComponents.path = void 0;
              if (schemeHandler) {
                urnComponents = schemeHandler.parse(urnComponents, options2);
              }
            } else {
              urnComponents.error = urnComponents.error || "URN can not be parsed.";
            }
            return urnComponents;
          },
          serialize: function serialize$$1(urnComponents, options2) {
            var scheme = options2.scheme || urnComponents.scheme || "urn";
            var nid = urnComponents.nid;
            var urnScheme = scheme + ":" + (options2.nid || nid);
            var schemeHandler = SCHEMES[urnScheme];
            if (schemeHandler) {
              urnComponents = schemeHandler.serialize(urnComponents, options2);
            }
            var uriComponents = urnComponents;
            var nss = urnComponents.nss;
            uriComponents.path = (nid || options2.nid) + ":" + nss;
            return uriComponents;
          }
        };
        var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
        var handler$6 = {
          scheme: "urn:uuid",
          parse: function parse2(urnComponents, options2) {
            var uuidComponents = urnComponents;
            uuidComponents.uuid = uuidComponents.nss;
            uuidComponents.nss = void 0;
            if (!options2.tolerant && (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID))) {
              uuidComponents.error = uuidComponents.error || "UUID is not valid.";
            }
            return uuidComponents;
          },
          serialize: function serialize2(uuidComponents, options2) {
            var urnComponents = uuidComponents;
            urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
            return urnComponents;
          }
        };
        SCHEMES[handler.scheme] = handler;
        SCHEMES[handler$1.scheme] = handler$1;
        SCHEMES[handler$2.scheme] = handler$2;
        SCHEMES[handler$3.scheme] = handler$3;
        SCHEMES[handler$4.scheme] = handler$4;
        SCHEMES[handler$5.scheme] = handler$5;
        SCHEMES[handler$6.scheme] = handler$6;
        exports2.SCHEMES = SCHEMES;
        exports2.pctEncChar = pctEncChar;
        exports2.pctDecChars = pctDecChars;
        exports2.parse = parse;
        exports2.removeDotSegments = removeDotSegments;
        exports2.serialize = serialize;
        exports2.resolveComponents = resolveComponents;
        exports2.resolve = resolve2;
        exports2.normalize = normalize;
        exports2.equal = equal;
        exports2.escapeComponent = escapeComponent;
        exports2.unescapeComponent = unescapeComponent;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    }
  });

  // node_modules/ajv/dist/runtime/uri.js
  var require_uri = __commonJS({
    "node_modules/ajv/dist/runtime/uri.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var uri = require_uri_all();
      uri.code = 'require("ajv/dist/runtime/uri").default';
      exports.default = uri;
    }
  });

  // node_modules/ajv/dist/core.js
  var require_core = __commonJS({
    "node_modules/ajv/dist/core.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
      var validate_1 = require_validate();
      Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
        return validate_1.KeywordCxt;
      } });
      var codegen_1 = require_codegen();
      Object.defineProperty(exports, "_", { enumerable: true, get: function() {
        return codegen_1._;
      } });
      Object.defineProperty(exports, "str", { enumerable: true, get: function() {
        return codegen_1.str;
      } });
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return codegen_1.stringify;
      } });
      Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
        return codegen_1.nil;
      } });
      Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
        return codegen_1.Name;
      } });
      Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
        return codegen_1.CodeGen;
      } });
      var validation_error_1 = require_validation_error();
      var ref_error_1 = require_ref_error();
      var rules_1 = require_rules();
      var compile_1 = require_compile();
      var codegen_2 = require_codegen();
      var resolve_1 = require_resolve();
      var dataType_1 = require_dataType();
      var util_1 = require_util();
      var $dataRefSchema = require_data();
      var uri_1 = require_uri();
      var defaultRegExp = (str, flags) => new RegExp(str, flags);
      defaultRegExp.code = "new RegExp";
      var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
      var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
        "validate",
        "serialize",
        "parse",
        "wrapper",
        "root",
        "schema",
        "keyword",
        "pattern",
        "formats",
        "validate$data",
        "func",
        "obj",
        "Error"
      ]);
      var removedOptions = {
        errorDataPath: "",
        format: "`validateFormats: false` can be used instead.",
        nullable: '"nullable" keyword is supported by default.',
        jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
        extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
        missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
        processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
        sourceCode: "Use option `code: {source: true}`",
        strictDefaults: "It is default now, see option `strict`.",
        strictKeywords: "It is default now, see option `strict`.",
        uniqueItems: '"uniqueItems" keyword is always validated.',
        unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
        cache: "Map is used as cache, schema object as key.",
        serialize: "Map is used as cache, schema object as key.",
        ajvErrors: "It is default now."
      };
      var deprecatedOptions = {
        ignoreKeywordsWithRef: "",
        jsPropertySyntax: "",
        unicode: '"minLength"/"maxLength" account for unicode characters by default.'
      };
      var MAX_EXPRESSION = 200;
      function requiredOptions(o3) {
        var _a, _b, _c, _d, _e3, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r2, _s, _t2, _u, _v, _w, _x, _y, _z, _0;
        const s3 = o3.strict;
        const _optz = (_a = o3.code) === null || _a === void 0 ? void 0 : _a.optimize;
        const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
        const regExp = (_c = (_b = o3.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
        const uriResolver = (_d = o3.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
        return {
          strictSchema: (_f = (_e3 = o3.strictSchema) !== null && _e3 !== void 0 ? _e3 : s3) !== null && _f !== void 0 ? _f : true,
          strictNumbers: (_h = (_g = o3.strictNumbers) !== null && _g !== void 0 ? _g : s3) !== null && _h !== void 0 ? _h : true,
          strictTypes: (_k = (_j = o3.strictTypes) !== null && _j !== void 0 ? _j : s3) !== null && _k !== void 0 ? _k : "log",
          strictTuples: (_m = (_l = o3.strictTuples) !== null && _l !== void 0 ? _l : s3) !== null && _m !== void 0 ? _m : "log",
          strictRequired: (_p = (_o = o3.strictRequired) !== null && _o !== void 0 ? _o : s3) !== null && _p !== void 0 ? _p : false,
          code: o3.code ? { ...o3.code, optimize, regExp } : { optimize, regExp },
          loopRequired: (_q = o3.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
          loopEnum: (_r2 = o3.loopEnum) !== null && _r2 !== void 0 ? _r2 : MAX_EXPRESSION,
          meta: (_s = o3.meta) !== null && _s !== void 0 ? _s : true,
          messages: (_t2 = o3.messages) !== null && _t2 !== void 0 ? _t2 : true,
          inlineRefs: (_u = o3.inlineRefs) !== null && _u !== void 0 ? _u : true,
          schemaId: (_v = o3.schemaId) !== null && _v !== void 0 ? _v : "$id",
          addUsedSchema: (_w = o3.addUsedSchema) !== null && _w !== void 0 ? _w : true,
          validateSchema: (_x = o3.validateSchema) !== null && _x !== void 0 ? _x : true,
          validateFormats: (_y = o3.validateFormats) !== null && _y !== void 0 ? _y : true,
          unicodeRegExp: (_z = o3.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
          int32range: (_0 = o3.int32range) !== null && _0 !== void 0 ? _0 : true,
          uriResolver
        };
      }
      var Ajv2 = class {
        constructor(opts = {}) {
          this.schemas = {};
          this.refs = {};
          this.formats = {};
          this._compilations = /* @__PURE__ */ new Set();
          this._loading = {};
          this._cache = /* @__PURE__ */ new Map();
          opts = this.opts = { ...opts, ...requiredOptions(opts) };
          const { es5, lines } = this.opts.code;
          this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
          this.logger = getLogger(opts.logger);
          const formatOpt = opts.validateFormats;
          opts.validateFormats = false;
          this.RULES = (0, rules_1.getRules)();
          checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
          checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
          this._metaOpts = getMetaSchemaOptions.call(this);
          if (opts.formats)
            addInitialFormats.call(this);
          this._addVocabularies();
          this._addDefaultMetaSchema();
          if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
          if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
          addInitialSchemas.call(this);
          opts.validateFormats = formatOpt;
        }
        _addVocabularies() {
          this.addKeyword("$async");
        }
        _addDefaultMetaSchema() {
          const { $data, meta, schemaId } = this.opts;
          let _dataRefSchema = $dataRefSchema;
          if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
          }
          if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
        }
        defaultMeta() {
          const { meta, schemaId } = this.opts;
          return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
        }
        validate(schemaKeyRef, data) {
          let v3;
          if (typeof schemaKeyRef == "string") {
            v3 = this.getSchema(schemaKeyRef);
            if (!v3)
              throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
          } else {
            v3 = this.compile(schemaKeyRef);
          }
          const valid2 = v3(data);
          if (!("$async" in v3))
            this.errors = v3.errors;
          return valid2;
        }
        compile(schema, _meta) {
          const sch = this._addSchema(schema, _meta);
          return sch.validate || this._compileSchemaEnv(sch);
        }
        compileAsync(schema, meta) {
          if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
          }
          const { loadSchema } = this.opts;
          return runCompileAsync.call(this, schema, meta);
          async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
          }
          async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
              await runCompileAsync.call(this, { $ref }, true);
            }
          }
          async function _compileAsync(sch) {
            try {
              return this._compileSchemaEnv(sch);
            } catch (e3) {
              if (!(e3 instanceof ref_error_1.default))
                throw e3;
              checkLoaded.call(this, e3);
              await loadMissingSchema.call(this, e3.missingSchema);
              return _compileAsync.call(this, sch);
            }
          }
          function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
              throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
          }
          async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
              await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
              this.addSchema(_schema, ref, meta);
          }
          async function _loadSchema(ref) {
            const p3 = this._loading[ref];
            if (p3)
              return p3;
            try {
              return await (this._loading[ref] = loadSchema(ref));
            } finally {
              delete this._loading[ref];
            }
          }
        }
        addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
          if (Array.isArray(schema)) {
            for (const sch of schema)
              this.addSchema(sch, void 0, _meta, _validateSchema);
            return this;
          }
          let id;
          if (typeof schema === "object") {
            const { schemaId } = this.opts;
            id = schema[schemaId];
            if (id !== void 0 && typeof id != "string") {
              throw new Error(`schema ${schemaId} must be string`);
            }
          }
          key = (0, resolve_1.normalizeId)(key || id);
          this._checkUnique(key);
          this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
          return this;
        }
        addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
          this.addSchema(schema, key, true, _validateSchema);
          return this;
        }
        validateSchema(schema, throwOrLogError) {
          if (typeof schema == "boolean")
            return true;
          let $schema;
          $schema = schema.$schema;
          if ($schema !== void 0 && typeof $schema != "string") {
            throw new Error("$schema must be a string");
          }
          $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
          if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
          }
          const valid2 = this.validate($schema, schema);
          if (!valid2 && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
              this.logger.error(message);
            else
              throw new Error(message);
          }
          return valid2;
        }
        getSchema(keyRef) {
          let sch;
          while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
          if (sch === void 0) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
              return;
            this.refs[keyRef] = sch;
          }
          return sch.validate || this._compileSchemaEnv(sch);
        }
        removeSchema(schemaKeyRef) {
          if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
          }
          switch (typeof schemaKeyRef) {
            case "undefined":
              this._removeAllSchemas(this.schemas);
              this._removeAllSchemas(this.refs);
              this._cache.clear();
              return this;
            case "string": {
              const sch = getSchEnv.call(this, schemaKeyRef);
              if (typeof sch == "object")
                this._cache.delete(sch.schema);
              delete this.schemas[schemaKeyRef];
              delete this.refs[schemaKeyRef];
              return this;
            }
            case "object": {
              const cacheKey = schemaKeyRef;
              this._cache.delete(cacheKey);
              let id = schemaKeyRef[this.opts.schemaId];
              if (id) {
                id = (0, resolve_1.normalizeId)(id);
                delete this.schemas[id];
                delete this.refs[id];
              }
              return this;
            }
            default:
              throw new Error("ajv.removeSchema: invalid parameter");
          }
        }
        addVocabulary(definitions) {
          for (const def of definitions)
            this.addKeyword(def);
          return this;
        }
        addKeyword(kwdOrDef, def) {
          let keyword;
          if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
              this.logger.warn("these parameters are deprecated, see docs for addKeyword");
              def.keyword = keyword;
            }
          } else if (typeof kwdOrDef == "object" && def === void 0) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
              throw new Error("addKeywords: keyword must be string or non-empty array");
            }
          } else {
            throw new Error("invalid addKeywords parameters");
          }
          checkKeyword.call(this, keyword, def);
          if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
          }
          keywordMetaschema.call(this, def);
          const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
          };
          (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k3) => addRule.call(this, k3, definition) : (k3) => definition.type.forEach((t9) => addRule.call(this, k3, definition, t9)));
          return this;
        }
        getKeyword(keyword) {
          const rule = this.RULES.all[keyword];
          return typeof rule == "object" ? rule.definition : !!rule;
        }
        removeKeyword(keyword) {
          const { RULES } = this;
          delete RULES.keywords[keyword];
          delete RULES.all[keyword];
          for (const group of RULES.rules) {
            const i3 = group.rules.findIndex((rule) => rule.keyword === keyword);
            if (i3 >= 0)
              group.rules.splice(i3, 1);
          }
          return this;
        }
        addFormat(name2, format) {
          if (typeof format == "string")
            format = new RegExp(format);
          this.formats[name2] = format;
          return this;
        }
        errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
          if (!errors || errors.length === 0)
            return "No errors";
          return errors.map((e3) => `${dataVar}${e3.instancePath} ${e3.message}`).reduce((text, msg) => text + separator + msg);
        }
        $dataMetaSchema(metaSchema, keywordsJsonPointers) {
          const rules = this.RULES.all;
          metaSchema = JSON.parse(JSON.stringify(metaSchema));
          for (const jsonPointer of keywordsJsonPointers) {
            const segments = jsonPointer.split("/").slice(1);
            let keywords = metaSchema;
            for (const seg of segments)
              keywords = keywords[seg];
            for (const key in rules) {
              const rule = rules[key];
              if (typeof rule != "object")
                continue;
              const { $data } = rule.definition;
              const schema = keywords[key];
              if ($data && schema)
                keywords[key] = schemaOrData(schema);
            }
          }
          return metaSchema;
        }
        _removeAllSchemas(schemas, regex2) {
          for (const keyRef in schemas) {
            const sch = schemas[keyRef];
            if (!regex2 || regex2.test(keyRef)) {
              if (typeof sch == "string") {
                delete schemas[keyRef];
              } else if (sch && !sch.meta) {
                this._cache.delete(sch.schema);
                delete schemas[keyRef];
              }
            }
          }
        }
        _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
          let id;
          const { schemaId } = this.opts;
          if (typeof schema == "object") {
            id = schema[schemaId];
          } else {
            if (this.opts.jtd)
              throw new Error("schema must be object");
            else if (typeof schema != "boolean")
              throw new Error("schema must be object or boolean");
          }
          let sch = this._cache.get(schema);
          if (sch !== void 0)
            return sch;
          baseId = (0, resolve_1.normalizeId)(id || baseId);
          const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
          sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
          this._cache.set(sch.schema, sch);
          if (addSchema && !baseId.startsWith("#")) {
            if (baseId)
              this._checkUnique(baseId);
            this.refs[baseId] = sch;
          }
          if (validateSchema)
            this.validateSchema(schema, true);
          return sch;
        }
        _checkUnique(id) {
          if (this.schemas[id] || this.refs[id]) {
            throw new Error(`schema with key or id "${id}" already exists`);
          }
        }
        _compileSchemaEnv(sch) {
          if (sch.meta)
            this._compileMetaSchema(sch);
          else
            compile_1.compileSchema.call(this, sch);
          if (!sch.validate)
            throw new Error("ajv implementation error");
          return sch.validate;
        }
        _compileMetaSchema(sch) {
          const currentOpts = this.opts;
          this.opts = this._metaOpts;
          try {
            compile_1.compileSchema.call(this, sch);
          } finally {
            this.opts = currentOpts;
          }
        }
      };
      exports.default = Ajv2;
      Ajv2.ValidationError = validation_error_1.default;
      Ajv2.MissingRefError = ref_error_1.default;
      function checkOptions(checkOpts, options2, msg, log = "error") {
        for (const key in checkOpts) {
          const opt = key;
          if (opt in options2)
            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
        }
      }
      function getSchEnv(keyRef) {
        keyRef = (0, resolve_1.normalizeId)(keyRef);
        return this.schemas[keyRef] || this.refs[keyRef];
      }
      function addInitialSchemas() {
        const optsSchemas = this.opts.schemas;
        if (!optsSchemas)
          return;
        if (Array.isArray(optsSchemas))
          this.addSchema(optsSchemas);
        else
          for (const key in optsSchemas)
            this.addSchema(optsSchemas[key], key);
      }
      function addInitialFormats() {
        for (const name2 in this.opts.formats) {
          const format = this.opts.formats[name2];
          if (format)
            this.addFormat(name2, format);
        }
      }
      function addInitialKeywords(defs) {
        if (Array.isArray(defs)) {
          this.addVocabulary(defs);
          return;
        }
        this.logger.warn("keywords option as map is deprecated, pass array");
        for (const keyword in defs) {
          const def = defs[keyword];
          if (!def.keyword)
            def.keyword = keyword;
          this.addKeyword(def);
        }
      }
      function getMetaSchemaOptions() {
        const metaOpts = { ...this.opts };
        for (const opt of META_IGNORE_OPTIONS)
          delete metaOpts[opt];
        return metaOpts;
      }
      var noLogs = { log() {
      }, warn() {
      }, error() {
      } };
      function getLogger(logger) {
        if (logger === false)
          return noLogs;
        if (logger === void 0)
          return console;
        if (logger.log && logger.warn && logger.error)
          return logger;
        throw new Error("logger must implement log, warn and error methods");
      }
      var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
      function checkKeyword(keyword, def) {
        const { RULES } = this;
        (0, util_1.eachItem)(keyword, (kwd) => {
          if (RULES.keywords[kwd])
            throw new Error(`Keyword ${kwd} is already defined`);
          if (!KEYWORD_NAME.test(kwd))
            throw new Error(`Keyword ${kwd} has invalid name`);
        });
        if (!def)
          return;
        if (def.$data && !("code" in def || "validate" in def)) {
          throw new Error('$data keyword must have "code" or "validate" function');
        }
      }
      function addRule(keyword, definition, dataType) {
        var _a;
        const post = definition === null || definition === void 0 ? void 0 : definition.post;
        if (dataType && post)
          throw new Error('keyword with "post" flag cannot have "type"');
        const { RULES } = this;
        let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t9 }) => t9 === dataType);
        if (!ruleGroup) {
          ruleGroup = { type: dataType, rules: [] };
          RULES.rules.push(ruleGroup);
        }
        RULES.keywords[keyword] = true;
        if (!definition)
          return;
        const rule = {
          keyword,
          definition: {
            ...definition,
            type: (0, dataType_1.getJSONTypes)(definition.type),
            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
          }
        };
        if (definition.before)
          addBeforeRule.call(this, ruleGroup, rule, definition.before);
        else
          ruleGroup.rules.push(rule);
        RULES.all[keyword] = rule;
        (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
      }
      function addBeforeRule(ruleGroup, rule, before) {
        const i3 = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
        if (i3 >= 0) {
          ruleGroup.rules.splice(i3, 0, rule);
        } else {
          ruleGroup.rules.push(rule);
          this.logger.warn(`rule ${before} is not defined`);
        }
      }
      function keywordMetaschema(def) {
        let { metaSchema } = def;
        if (metaSchema === void 0)
          return;
        if (def.$data && this.opts.$data)
          metaSchema = schemaOrData(metaSchema);
        def.validateSchema = this.compile(metaSchema, true);
      }
      var $dataRef = {
        $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
      };
      function schemaOrData(schema) {
        return { anyOf: [schema, $dataRef] };
      }
    }
  });

  // node_modules/ajv/dist/vocabularies/core/id.js
  var require_id = __commonJS({
    "node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var def = {
        keyword: "id",
        code() {
          throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/core/ref.js
  var require_ref = __commonJS({
    "node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.callRef = exports.getValidate = void 0;
      var ref_error_1 = require_ref_error();
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var compile_1 = require_compile();
      var util_1 = require_util();
      var def = {
        keyword: "$ref",
        schemaType: "string",
        code(cxt) {
          const { gen, schema: $ref, it: it3 } = cxt;
          const { baseId, schemaEnv: env, validateName, opts, self: self2 } = it3;
          const { root } = env;
          if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
            return callRootRef();
          const schOrEnv = compile_1.resolveRef.call(self2, root, baseId, $ref);
          if (schOrEnv === void 0)
            throw new ref_error_1.default(it3.opts.uriResolver, baseId, $ref);
          if (schOrEnv instanceof compile_1.SchemaEnv)
            return callValidate(schOrEnv);
          return inlineRefSchema(schOrEnv);
          function callRootRef() {
            if (env === root)
              return callRef(cxt, validateName, env, env.$async);
            const rootName = gen.scopeValue("root", { ref: root });
            return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
          }
          function callValidate(sch) {
            const v3 = getValidate(cxt, sch);
            callRef(cxt, v3, sch, sch.$async);
          }
          function inlineRefSchema(sch) {
            const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
            const valid2 = gen.name("valid");
            const schCxt = cxt.subschema({
              schema: sch,
              dataTypes: [],
              schemaPath: codegen_1.nil,
              topSchemaRef: schName,
              errSchemaPath: $ref
            }, valid2);
            cxt.mergeEvaluated(schCxt);
            cxt.ok(valid2);
          }
        }
      };
      function getValidate(cxt, sch) {
        const { gen } = cxt;
        return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
      }
      exports.getValidate = getValidate;
      function callRef(cxt, v3, sch, $async) {
        const { gen, it: it3 } = cxt;
        const { allErrors, schemaEnv: env, opts } = it3;
        const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
        if ($async)
          callAsyncRef();
        else
          callSyncRef();
        function callAsyncRef() {
          if (!env.$async)
            throw new Error("async schema referenced by sync schema");
          const valid2 = gen.let("valid");
          gen.try(() => {
            gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v3, passCxt)}`);
            addEvaluatedFrom(v3);
            if (!allErrors)
              gen.assign(valid2, true);
          }, (e3) => {
            gen.if((0, codegen_1._)`!(${e3} instanceof ${it3.ValidationError})`, () => gen.throw(e3));
            addErrorsFrom(e3);
            if (!allErrors)
              gen.assign(valid2, false);
          });
          cxt.ok(valid2);
        }
        function callSyncRef() {
          cxt.result((0, code_1.callValidateCode)(cxt, v3, passCxt), () => addEvaluatedFrom(v3), () => addErrorsFrom(v3));
        }
        function addErrorsFrom(source) {
          const errs = (0, codegen_1._)`${source}.errors`;
          gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
          gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        }
        function addEvaluatedFrom(source) {
          var _a;
          if (!it3.opts.unevaluated)
            return;
          const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
          if (it3.props !== true) {
            if (schEvaluated && !schEvaluated.dynamicProps) {
              if (schEvaluated.props !== void 0) {
                it3.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it3.props);
              }
            } else {
              const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
              it3.props = util_1.mergeEvaluated.props(gen, props, it3.props, codegen_1.Name);
            }
          }
          if (it3.items !== true) {
            if (schEvaluated && !schEvaluated.dynamicItems) {
              if (schEvaluated.items !== void 0) {
                it3.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it3.items);
              }
            } else {
              const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
              it3.items = util_1.mergeEvaluated.items(gen, items, it3.items, codegen_1.Name);
            }
          }
        }
      }
      exports.callRef = callRef;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/core/index.js
  var require_core2 = __commonJS({
    "node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var id_1 = require_id();
      var ref_1 = require_ref();
      var core = [
        "$schema",
        "$id",
        "$defs",
        "$vocabulary",
        { keyword: "$comment" },
        "definitions",
        id_1.default,
        ref_1.default
      ];
      exports.default = core;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitNumber.js
  var require_limitNumber = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var ops = codegen_1.operators;
      var KWDs = {
        maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
        minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
        exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
        exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
      };
      var error = {
        message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
        params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
      };
      var def = {
        keyword: Object.keys(KWDs),
        type: "number",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/multipleOf.js
  var require_multipleOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
        params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
      };
      var def = {
        keyword: "multipleOf",
        type: "number",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, schemaCode, it: it3 } = cxt;
          const prec = it3.opts.multipleOfPrecision;
          const res = gen.let("res");
          const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
          cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/runtime/ucs2length.js
  var require_ucs2length = __commonJS({
    "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function ucs2length(str) {
        const len = str.length;
        let length = 0;
        let pos = 0;
        let value;
        while (pos < len) {
          length++;
          value = str.charCodeAt(pos++);
          if (value >= 55296 && value <= 56319 && pos < len) {
            value = str.charCodeAt(pos);
            if ((value & 64512) === 56320)
              pos++;
          }
        }
        return length;
      }
      exports.default = ucs2length;
      ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitLength.js
  var require_limitLength = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var ucs2length_1 = require_ucs2length();
      var error = {
        message({ keyword, schemaCode }) {
          const comp = keyword === "maxLength" ? "more" : "fewer";
          return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
        },
        params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
      };
      var def = {
        keyword: ["maxLength", "minLength"],
        type: "string",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode, it: it3 } = cxt;
          const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
          const len = it3.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
          cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/pattern.js
  var require_pattern = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var error = {
        message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
        params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
      };
      var def = {
        keyword: "pattern",
        type: "string",
        schemaType: "string",
        $data: true,
        error,
        code(cxt) {
          const { data, $data, schema, schemaCode, it: it3 } = cxt;
          const u3 = it3.opts.unicodeRegExp ? "u" : "";
          const regExp = $data ? (0, codegen_1._)`(new RegExp(${schemaCode}, ${u3}))` : (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitProperties.js
  var require_limitProperties = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message({ keyword, schemaCode }) {
          const comp = keyword === "maxProperties" ? "more" : "fewer";
          return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
        },
        params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
      };
      var def = {
        keyword: ["maxProperties", "minProperties"],
        type: "object",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
          cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/required.js
  var require_required = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var error = {
        message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
        params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
      };
      var def = {
        keyword: "required",
        type: "object",
        schemaType: "array",
        $data: true,
        error,
        code(cxt) {
          const { gen, schema, schemaCode, data, $data, it: it3 } = cxt;
          const { opts } = it3;
          if (!$data && schema.length === 0)
            return;
          const useLoop = schema.length >= opts.loopRequired;
          if (it3.allErrors)
            allErrorsMode();
          else
            exitOnErrorMode();
          if (opts.strictRequired) {
            const props = cxt.parentSchema.properties;
            const { definedProperties } = cxt.it;
            for (const requiredKey of schema) {
              if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
                const schemaPath = it3.schemaEnv.baseId + it3.errSchemaPath;
                const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
                (0, util_1.checkStrictMode)(it3, msg, it3.opts.strictRequired);
              }
            }
          }
          function allErrorsMode() {
            if (useLoop || $data) {
              cxt.block$data(codegen_1.nil, loopAllRequired);
            } else {
              for (const prop of schema) {
                (0, code_1.checkReportMissingProp)(cxt, prop);
              }
            }
          }
          function exitOnErrorMode() {
            const missing = gen.let("missing");
            if (useLoop || $data) {
              const valid2 = gen.let("valid", true);
              cxt.block$data(valid2, () => loopUntilMissing(missing, valid2));
              cxt.ok(valid2);
            } else {
              gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
              (0, code_1.reportMissingProp)(cxt, missing);
              gen.else();
            }
          }
          function loopAllRequired() {
            gen.forOf("prop", schemaCode, (prop) => {
              cxt.setParams({ missingProperty: prop });
              gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
            });
          }
          function loopUntilMissing(missing, valid2) {
            cxt.setParams({ missingProperty: missing });
            gen.forOf(missing, schemaCode, () => {
              gen.assign(valid2, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
              gen.if((0, codegen_1.not)(valid2), () => {
                cxt.error();
                gen.break();
              });
            }, codegen_1.nil);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitItems.js
  var require_limitItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message({ keyword, schemaCode }) {
          const comp = keyword === "maxItems" ? "more" : "fewer";
          return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
        },
        params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
      };
      var def = {
        keyword: ["maxItems", "minItems"],
        type: "array",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
          cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/runtime/equal.js
  var require_equal = __commonJS({
    "node_modules/ajv/dist/runtime/equal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var equal = require_fast_deep_equal();
      equal.code = 'require("ajv/dist/runtime/equal").default';
      exports.default = equal;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
  var require_uniqueItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var dataType_1 = require_dataType();
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var equal_1 = require_equal();
      var error = {
        message: ({ params: { i: i3, j: j3 } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j3} and ${i3} are identical)`,
        params: ({ params: { i: i3, j: j3 } }) => (0, codegen_1._)`{i: ${i3}, j: ${j3}}`
      };
      var def = {
        keyword: "uniqueItems",
        type: "array",
        schemaType: "boolean",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, $data, schema, parentSchema, schemaCode, it: it3 } = cxt;
          if (!$data && !schema)
            return;
          const valid2 = gen.let("valid");
          const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
          cxt.block$data(valid2, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
          cxt.ok(valid2);
          function validateUniqueItems() {
            const i3 = gen.let("i", (0, codegen_1._)`${data}.length`);
            const j3 = gen.let("j");
            cxt.setParams({ i: i3, j: j3 });
            gen.assign(valid2, true);
            gen.if((0, codegen_1._)`${i3} > 1`, () => (canOptimize() ? loopN : loopN2)(i3, j3));
          }
          function canOptimize() {
            return itemTypes.length > 0 && !itemTypes.some((t9) => t9 === "object" || t9 === "array");
          }
          function loopN(i3, j3) {
            const item = gen.name("item");
            const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it3.opts.strictNumbers, dataType_1.DataType.Wrong);
            const indices = gen.const("indices", (0, codegen_1._)`{}`);
            gen.for((0, codegen_1._)`;${i3}--;`, () => {
              gen.let(item, (0, codegen_1._)`${data}[${i3}]`);
              gen.if(wrongType, (0, codegen_1._)`continue`);
              if (itemTypes.length > 1)
                gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
              gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
                gen.assign(j3, (0, codegen_1._)`${indices}[${item}]`);
                cxt.error();
                gen.assign(valid2, false).break();
              }).code((0, codegen_1._)`${indices}[${item}] = ${i3}`);
            });
          }
          function loopN2(i3, j3) {
            const eql = (0, util_1.useFunc)(gen, equal_1.default);
            const outer = gen.name("outer");
            gen.label(outer).for((0, codegen_1._)`;${i3}--;`, () => gen.for((0, codegen_1._)`${j3} = ${i3}; ${j3}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i3}], ${data}[${j3}])`, () => {
              cxt.error();
              gen.assign(valid2, false).break(outer);
            })));
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/const.js
  var require_const = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var equal_1 = require_equal();
      var error = {
        message: "must be equal to constant",
        params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
      };
      var def = {
        keyword: "const",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, $data, schemaCode, schema } = cxt;
          if ($data || schema && typeof schema == "object") {
            cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
          } else {
            cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/enum.js
  var require_enum = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var equal_1 = require_equal();
      var error = {
        message: "must be equal to one of the allowed values",
        params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
      };
      var def = {
        keyword: "enum",
        schemaType: "array",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, $data, schema, schemaCode, it: it3 } = cxt;
          if (!$data && schema.length === 0)
            throw new Error("enum must have non-empty array");
          const useLoop = schema.length >= it3.opts.loopEnum;
          let eql;
          const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
          let valid2;
          if (useLoop || $data) {
            valid2 = gen.let("valid");
            cxt.block$data(valid2, loopEnum);
          } else {
            if (!Array.isArray(schema))
              throw new Error("ajv implementation error");
            const vSchema = gen.const("vSchema", schemaCode);
            valid2 = (0, codegen_1.or)(...schema.map((_x, i3) => equalCode(vSchema, i3)));
          }
          cxt.pass(valid2);
          function loopEnum() {
            gen.assign(valid2, false);
            gen.forOf("v", schemaCode, (v3) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v3})`, () => gen.assign(valid2, true).break()));
          }
          function equalCode(vSchema, i3) {
            const sch = schema[i3];
            return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i3}])` : (0, codegen_1._)`${data} === ${sch}`;
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/index.js
  var require_validation = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var limitNumber_1 = require_limitNumber();
      var multipleOf_1 = require_multipleOf();
      var limitLength_1 = require_limitLength();
      var pattern_1 = require_pattern();
      var limitProperties_1 = require_limitProperties();
      var required_1 = require_required();
      var limitItems_1 = require_limitItems();
      var uniqueItems_1 = require_uniqueItems();
      var const_1 = require_const();
      var enum_1 = require_enum();
      var validation = [
        limitNumber_1.default,
        multipleOf_1.default,
        limitLength_1.default,
        pattern_1.default,
        limitProperties_1.default,
        required_1.default,
        limitItems_1.default,
        uniqueItems_1.default,
        { keyword: "type", schemaType: ["string", "array"] },
        { keyword: "nullable", schemaType: "boolean" },
        const_1.default,
        enum_1.default
      ];
      exports.default = validation;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
  var require_additionalItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateAdditionalItems = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var error = {
        message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
        params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
      };
      var def = {
        keyword: "additionalItems",
        type: "array",
        schemaType: ["boolean", "object"],
        before: "uniqueItems",
        error,
        code(cxt) {
          const { parentSchema, it: it3 } = cxt;
          const { items } = parentSchema;
          if (!Array.isArray(items)) {
            (0, util_1.checkStrictMode)(it3, '"additionalItems" is ignored when "items" is not an array of schemas');
            return;
          }
          validateAdditionalItems(cxt, items);
        }
      };
      function validateAdditionalItems(cxt, items) {
        const { gen, schema, data, keyword, it: it3 } = cxt;
        it3.items = true;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items.length });
          cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it3, schema)) {
          const valid2 = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
          gen.if((0, codegen_1.not)(valid2), () => validateItems(valid2));
          cxt.ok(valid2);
        }
        function validateItems(valid2) {
          gen.forRange("i", items.length, len, (i3) => {
            cxt.subschema({ keyword, dataProp: i3, dataPropType: util_1.Type.Num }, valid2);
            if (!it3.allErrors)
              gen.if((0, codegen_1.not)(valid2), () => gen.break());
          });
        }
      }
      exports.validateAdditionalItems = validateAdditionalItems;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/items.js
  var require_items = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateTuple = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var code_1 = require_code2();
      var def = {
        keyword: "items",
        type: "array",
        schemaType: ["object", "array", "boolean"],
        before: "uniqueItems",
        code(cxt) {
          const { schema, it: it3 } = cxt;
          if (Array.isArray(schema))
            return validateTuple(cxt, "additionalItems", schema);
          it3.items = true;
          if ((0, util_1.alwaysValidSchema)(it3, schema))
            return;
          cxt.ok((0, code_1.validateArray)(cxt));
        }
      };
      function validateTuple(cxt, extraItems, schArr = cxt.schema) {
        const { gen, parentSchema, data, keyword, it: it3 } = cxt;
        checkStrictTuple(parentSchema);
        if (it3.opts.unevaluated && schArr.length && it3.items !== true) {
          it3.items = util_1.mergeEvaluated.items(gen, schArr.length, it3.items);
        }
        const valid2 = gen.name("valid");
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        schArr.forEach((sch, i3) => {
          if ((0, util_1.alwaysValidSchema)(it3, sch))
            return;
          gen.if((0, codegen_1._)`${len} > ${i3}`, () => cxt.subschema({
            keyword,
            schemaProp: i3,
            dataProp: i3
          }, valid2));
          cxt.ok(valid2);
        });
        function checkStrictTuple(sch) {
          const { opts, errSchemaPath } = it3;
          const l3 = schArr.length;
          const fullTuple = l3 === sch.minItems && (l3 === sch.maxItems || sch[extraItems] === false);
          if (opts.strictTuples && !fullTuple) {
            const msg = `"${keyword}" is ${l3}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
            (0, util_1.checkStrictMode)(it3, msg, opts.strictTuples);
          }
        }
      }
      exports.validateTuple = validateTuple;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
  var require_prefixItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var items_1 = require_items();
      var def = {
        keyword: "prefixItems",
        type: "array",
        schemaType: ["array"],
        before: "uniqueItems",
        code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/items2020.js
  var require_items2020 = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var code_1 = require_code2();
      var additionalItems_1 = require_additionalItems();
      var error = {
        message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
        params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
      };
      var def = {
        keyword: "items",
        type: "array",
        schemaType: ["object", "boolean"],
        before: "uniqueItems",
        error,
        code(cxt) {
          const { schema, parentSchema, it: it3 } = cxt;
          const { prefixItems } = parentSchema;
          it3.items = true;
          if ((0, util_1.alwaysValidSchema)(it3, schema))
            return;
          if (prefixItems)
            (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
          else
            cxt.ok((0, code_1.validateArray)(cxt));
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/contains.js
  var require_contains = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var error = {
        message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
        params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
      };
      var def = {
        keyword: "contains",
        type: "array",
        schemaType: ["object", "boolean"],
        before: "uniqueItems",
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, schema, parentSchema, data, it: it3 } = cxt;
          let min;
          let max;
          const { minContains, maxContains } = parentSchema;
          if (it3.opts.next) {
            min = minContains === void 0 ? 1 : minContains;
            max = maxContains;
          } else {
            min = 1;
          }
          const len = gen.const("len", (0, codegen_1._)`${data}.length`);
          cxt.setParams({ min, max });
          if (max === void 0 && min === 0) {
            (0, util_1.checkStrictMode)(it3, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
            return;
          }
          if (max !== void 0 && min > max) {
            (0, util_1.checkStrictMode)(it3, `"minContains" > "maxContains" is always invalid`);
            cxt.fail();
            return;
          }
          if ((0, util_1.alwaysValidSchema)(it3, schema)) {
            let cond = (0, codegen_1._)`${len} >= ${min}`;
            if (max !== void 0)
              cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
            cxt.pass(cond);
            return;
          }
          it3.items = true;
          const valid2 = gen.name("valid");
          if (max === void 0 && min === 1) {
            validateItems(valid2, () => gen.if(valid2, () => gen.break()));
          } else if (min === 0) {
            gen.let(valid2, true);
            if (max !== void 0)
              gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
          } else {
            gen.let(valid2, false);
            validateItemsWithCount();
          }
          cxt.result(valid2, () => cxt.reset());
          function validateItemsWithCount() {
            const schValid = gen.name("_valid");
            const count = gen.let("count", 0);
            validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
          }
          function validateItems(_valid, block) {
            gen.forRange("i", 0, len, (i3) => {
              cxt.subschema({
                keyword: "contains",
                dataProp: i3,
                dataPropType: util_1.Type.Num,
                compositeRule: true
              }, _valid);
              block();
            });
          }
          function checkLimits(count) {
            gen.code((0, codegen_1._)`${count}++`);
            if (max === void 0) {
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid2, true).break());
            } else {
              gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid2, false).break());
              if (min === 1)
                gen.assign(valid2, true);
              else
                gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid2, true));
            }
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/dependencies.js
  var require_dependencies = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var code_1 = require_code2();
      exports.error = {
        message: ({ params: { property, depsCount, deps } }) => {
          const property_ies = depsCount === 1 ? "property" : "properties";
          return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
        },
        params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      };
      var def = {
        keyword: "dependencies",
        type: "object",
        schemaType: "object",
        error: exports.error,
        code(cxt) {
          const [propDeps, schDeps] = splitDependencies(cxt);
          validatePropertyDeps(cxt, propDeps);
          validateSchemaDeps(cxt, schDeps);
        }
      };
      function splitDependencies({ schema }) {
        const propertyDeps = {};
        const schemaDeps = {};
        for (const key in schema) {
          if (key === "__proto__")
            continue;
          const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
          deps[key] = schema[key];
        }
        return [propertyDeps, schemaDeps];
      }
      function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
        const { gen, data, it: it3 } = cxt;
        if (Object.keys(propertyDeps).length === 0)
          return;
        const missing = gen.let("missing");
        for (const prop in propertyDeps) {
          const deps = propertyDeps[prop];
          if (deps.length === 0)
            continue;
          const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it3.opts.ownProperties);
          cxt.setParams({
            property: prop,
            depsCount: deps.length,
            deps: deps.join(", ")
          });
          if (it3.allErrors) {
            gen.if(hasProperty, () => {
              for (const depProp of deps) {
                (0, code_1.checkReportMissingProp)(cxt, depProp);
              }
            });
          } else {
            gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
      }
      exports.validatePropertyDeps = validatePropertyDeps;
      function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
        const { gen, data, keyword, it: it3 } = cxt;
        const valid2 = gen.name("valid");
        for (const prop in schemaDeps) {
          if ((0, util_1.alwaysValidSchema)(it3, schemaDeps[prop]))
            continue;
          gen.if((0, code_1.propertyInData)(gen, data, prop, it3.opts.ownProperties), () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid2);
            cxt.mergeValidEvaluated(schCxt, valid2);
          }, () => gen.var(valid2, true));
          cxt.ok(valid2);
        }
      }
      exports.validateSchemaDeps = validateSchemaDeps;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
  var require_propertyNames = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var error = {
        message: "property name must be valid",
        params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
      };
      var def = {
        keyword: "propertyNames",
        type: "object",
        schemaType: ["object", "boolean"],
        error,
        code(cxt) {
          const { gen, schema, data, it: it3 } = cxt;
          if ((0, util_1.alwaysValidSchema)(it3, schema))
            return;
          const valid2 = gen.name("valid");
          gen.forIn("key", data, (key) => {
            cxt.setParams({ propertyName: key });
            cxt.subschema({
              keyword: "propertyNames",
              data: key,
              dataTypes: ["string"],
              propertyName: key,
              compositeRule: true
            }, valid2);
            gen.if((0, codegen_1.not)(valid2), () => {
              cxt.error(true);
              if (!it3.allErrors)
                gen.break();
            });
          });
          cxt.ok(valid2);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
  var require_additionalProperties = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var util_1 = require_util();
      var error = {
        message: "must NOT have additional properties",
        params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
      };
      var def = {
        keyword: "additionalProperties",
        type: ["object"],
        schemaType: ["boolean", "object"],
        allowUndefined: true,
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, schema, parentSchema, data, errsCount, it: it3 } = cxt;
          if (!errsCount)
            throw new Error("ajv implementation error");
          const { allErrors, opts } = it3;
          it3.props = true;
          if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it3, schema))
            return;
          const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
          const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
          checkAdditionalProperties();
          cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
          function checkAdditionalProperties() {
            gen.forIn("key", data, (key) => {
              if (!props.length && !patProps.length)
                additionalPropertyCode(key);
              else
                gen.if(isAdditional(key), () => additionalPropertyCode(key));
            });
          }
          function isAdditional(key) {
            let definedProp;
            if (props.length > 8) {
              const propsSchema = (0, util_1.schemaRefOrVal)(it3, parentSchema.properties, "properties");
              definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
            } else if (props.length) {
              definedProp = (0, codegen_1.or)(...props.map((p3) => (0, codegen_1._)`${key} === ${p3}`));
            } else {
              definedProp = codegen_1.nil;
            }
            if (patProps.length) {
              definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p3) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p3)}.test(${key})`));
            }
            return (0, codegen_1.not)(definedProp);
          }
          function deleteAdditional(key) {
            gen.code((0, codegen_1._)`delete ${data}[${key}]`);
          }
          function additionalPropertyCode(key) {
            if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
              deleteAdditional(key);
              return;
            }
            if (schema === false) {
              cxt.setParams({ additionalProperty: key });
              cxt.error();
              if (!allErrors)
                gen.break();
              return;
            }
            if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it3, schema)) {
              const valid2 = gen.name("valid");
              if (opts.removeAdditional === "failing") {
                applyAdditionalSchema(key, valid2, false);
                gen.if((0, codegen_1.not)(valid2), () => {
                  cxt.reset();
                  deleteAdditional(key);
                });
              } else {
                applyAdditionalSchema(key, valid2);
                if (!allErrors)
                  gen.if((0, codegen_1.not)(valid2), () => gen.break());
              }
            }
          }
          function applyAdditionalSchema(key, valid2, errors) {
            const subschema = {
              keyword: "additionalProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            };
            if (errors === false) {
              Object.assign(subschema, {
                compositeRule: true,
                createErrors: false,
                allErrors: false
              });
            }
            cxt.subschema(subschema, valid2);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/properties.js
  var require_properties = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var validate_1 = require_validate();
      var code_1 = require_code2();
      var util_1 = require_util();
      var additionalProperties_1 = require_additionalProperties();
      var def = {
        keyword: "properties",
        type: "object",
        schemaType: "object",
        code(cxt) {
          const { gen, schema, parentSchema, data, it: it3 } = cxt;
          if (it3.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(it3, additionalProperties_1.default, "additionalProperties"));
          }
          const allProps = (0, code_1.allSchemaProperties)(schema);
          for (const prop of allProps) {
            it3.definedProperties.add(prop);
          }
          if (it3.opts.unevaluated && allProps.length && it3.props !== true) {
            it3.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it3.props);
          }
          const properties = allProps.filter((p3) => !(0, util_1.alwaysValidSchema)(it3, schema[p3]));
          if (properties.length === 0)
            return;
          const valid2 = gen.name("valid");
          for (const prop of properties) {
            if (hasDefault(prop)) {
              applyPropertySchema(prop);
            } else {
              gen.if((0, code_1.propertyInData)(gen, data, prop, it3.opts.ownProperties));
              applyPropertySchema(prop);
              if (!it3.allErrors)
                gen.else().var(valid2, true);
              gen.endIf();
            }
            cxt.it.definedProperties.add(prop);
            cxt.ok(valid2);
          }
          function hasDefault(prop) {
            return it3.opts.useDefaults && !it3.compositeRule && schema[prop].default !== void 0;
          }
          function applyPropertySchema(prop) {
            cxt.subschema({
              keyword: "properties",
              schemaProp: prop,
              dataProp: prop
            }, valid2);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
  var require_patternProperties = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var util_2 = require_util();
      var def = {
        keyword: "patternProperties",
        type: "object",
        schemaType: "object",
        code(cxt) {
          const { gen, schema, data, parentSchema, it: it3 } = cxt;
          const { opts } = it3;
          const patterns = (0, code_1.allSchemaProperties)(schema);
          const alwaysValidPatterns = patterns.filter((p3) => (0, util_1.alwaysValidSchema)(it3, schema[p3]));
          if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it3.opts.unevaluated || it3.props === true)) {
            return;
          }
          const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
          const valid2 = gen.name("valid");
          if (it3.props !== true && !(it3.props instanceof codegen_1.Name)) {
            it3.props = (0, util_2.evaluatedPropsToName)(gen, it3.props);
          }
          const { props } = it3;
          validatePatternProperties();
          function validatePatternProperties() {
            for (const pat of patterns) {
              if (checkProperties)
                checkMatchingProperties(pat);
              if (it3.allErrors) {
                validateProperties(pat);
              } else {
                gen.var(valid2, true);
                validateProperties(pat);
                gen.if(valid2);
              }
            }
          }
          function checkMatchingProperties(pat) {
            for (const prop in checkProperties) {
              if (new RegExp(pat).test(prop)) {
                (0, util_1.checkStrictMode)(it3, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
              }
            }
          }
          function validateProperties(pat) {
            gen.forIn("key", data, (key) => {
              gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
                const alwaysValid = alwaysValidPatterns.includes(pat);
                if (!alwaysValid) {
                  cxt.subschema({
                    keyword: "patternProperties",
                    schemaProp: pat,
                    dataProp: key,
                    dataPropType: util_2.Type.Str
                  }, valid2);
                }
                if (it3.opts.unevaluated && props !== true) {
                  gen.assign((0, codegen_1._)`${props}[${key}]`, true);
                } else if (!alwaysValid && !it3.allErrors) {
                  gen.if((0, codegen_1.not)(valid2), () => gen.break());
                }
              });
            });
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/not.js
  var require_not = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var util_1 = require_util();
      var def = {
        keyword: "not",
        schemaType: ["object", "boolean"],
        trackErrors: true,
        code(cxt) {
          const { gen, schema, it: it3 } = cxt;
          if ((0, util_1.alwaysValidSchema)(it3, schema)) {
            cxt.fail();
            return;
          }
          const valid2 = gen.name("valid");
          cxt.subschema({
            keyword: "not",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, valid2);
          cxt.failResult(valid2, () => cxt.reset(), () => cxt.error());
        },
        error: { message: "must NOT be valid" }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/anyOf.js
  var require_anyOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var def = {
        keyword: "anyOf",
        schemaType: "array",
        trackErrors: true,
        code: code_1.validateUnion,
        error: { message: "must match a schema in anyOf" }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/oneOf.js
  var require_oneOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var error = {
        message: "must match exactly one schema in oneOf",
        params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
      };
      var def = {
        keyword: "oneOf",
        schemaType: "array",
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, schema, parentSchema, it: it3 } = cxt;
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          if (it3.opts.discriminator && parentSchema.discriminator)
            return;
          const schArr = schema;
          const valid2 = gen.let("valid", false);
          const passing = gen.let("passing", null);
          const schValid = gen.name("_valid");
          cxt.setParams({ passing });
          gen.block(validateOneOf);
          cxt.result(valid2, () => cxt.reset(), () => cxt.error(true));
          function validateOneOf() {
            schArr.forEach((sch, i3) => {
              let schCxt;
              if ((0, util_1.alwaysValidSchema)(it3, sch)) {
                gen.var(schValid, true);
              } else {
                schCxt = cxt.subschema({
                  keyword: "oneOf",
                  schemaProp: i3,
                  compositeRule: true
                }, schValid);
              }
              if (i3 > 0) {
                gen.if((0, codegen_1._)`${schValid} && ${valid2}`).assign(valid2, false).assign(passing, (0, codegen_1._)`[${passing}, ${i3}]`).else();
              }
              gen.if(schValid, () => {
                gen.assign(valid2, true);
                gen.assign(passing, i3);
                if (schCxt)
                  cxt.mergeEvaluated(schCxt, codegen_1.Name);
              });
            });
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/allOf.js
  var require_allOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var util_1 = require_util();
      var def = {
        keyword: "allOf",
        schemaType: "array",
        code(cxt) {
          const { gen, schema, it: it3 } = cxt;
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const valid2 = gen.name("valid");
          schema.forEach((sch, i3) => {
            if ((0, util_1.alwaysValidSchema)(it3, sch))
              return;
            const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i3 }, valid2);
            cxt.ok(valid2);
            cxt.mergeEvaluated(schCxt);
          });
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/if.js
  var require_if = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util();
      var error = {
        message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
        params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
      };
      var def = {
        keyword: "if",
        schemaType: ["object", "boolean"],
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, parentSchema, it: it3 } = cxt;
          if (parentSchema.then === void 0 && parentSchema.else === void 0) {
            (0, util_1.checkStrictMode)(it3, '"if" without "then" and "else" is ignored');
          }
          const hasThen = hasSchema(it3, "then");
          const hasElse = hasSchema(it3, "else");
          if (!hasThen && !hasElse)
            return;
          const valid2 = gen.let("valid", true);
          const schValid = gen.name("_valid");
          validateIf();
          cxt.reset();
          if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
          } else if (hasThen) {
            gen.if(schValid, validateClause("then"));
          } else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
          }
          cxt.pass(valid2, () => cxt.error(true));
          function validateIf() {
            const schCxt = cxt.subschema({
              keyword: "if",
              compositeRule: true,
              createErrors: false,
              allErrors: false
            }, schValid);
            cxt.mergeEvaluated(schCxt);
          }
          function validateClause(keyword, ifClause) {
            return () => {
              const schCxt = cxt.subschema({ keyword }, schValid);
              gen.assign(valid2, schValid);
              cxt.mergeValidEvaluated(schCxt, valid2);
              if (ifClause)
                gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
              else
                cxt.setParams({ ifClause: keyword });
            };
          }
        }
      };
      function hasSchema(it3, keyword) {
        const schema = it3.schema[keyword];
        return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it3, schema);
      }
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/thenElse.js
  var require_thenElse = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var util_1 = require_util();
      var def = {
        keyword: ["then", "else"],
        schemaType: ["object", "boolean"],
        code({ keyword, parentSchema, it: it3 }) {
          if (parentSchema.if === void 0)
            (0, util_1.checkStrictMode)(it3, `"${keyword}" without "if" is ignored`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/index.js
  var require_applicator = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var additionalItems_1 = require_additionalItems();
      var prefixItems_1 = require_prefixItems();
      var items_1 = require_items();
      var items2020_1 = require_items2020();
      var contains_1 = require_contains();
      var dependencies_1 = require_dependencies();
      var propertyNames_1 = require_propertyNames();
      var additionalProperties_1 = require_additionalProperties();
      var properties_1 = require_properties();
      var patternProperties_1 = require_patternProperties();
      var not_1 = require_not();
      var anyOf_1 = require_anyOf();
      var oneOf_1 = require_oneOf();
      var allOf_1 = require_allOf();
      var if_1 = require_if();
      var thenElse_1 = require_thenElse();
      function getApplicator(draft2020 = false) {
        const applicator = [
          not_1.default,
          anyOf_1.default,
          oneOf_1.default,
          allOf_1.default,
          if_1.default,
          thenElse_1.default,
          propertyNames_1.default,
          additionalProperties_1.default,
          dependencies_1.default,
          properties_1.default,
          patternProperties_1.default
        ];
        if (draft2020)
          applicator.push(prefixItems_1.default, items2020_1.default);
        else
          applicator.push(additionalItems_1.default, items_1.default);
        applicator.push(contains_1.default);
        return applicator;
      }
      exports.default = getApplicator;
    }
  });

  // node_modules/ajv/dist/vocabularies/format/format.js
  var require_format = __commonJS({
    "node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
        params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
      };
      var def = {
        keyword: "format",
        type: ["number", "string"],
        schemaType: "string",
        $data: true,
        error,
        code(cxt, ruleType) {
          const { gen, data, $data, schema, schemaCode, it: it3 } = cxt;
          const { opts, errSchemaPath, schemaEnv, self: self2 } = it3;
          if (!opts.validateFormats)
            return;
          if ($data)
            validate$DataFormat();
          else
            validateFormat();
          function validate$DataFormat() {
            const fmts = gen.scopeValue("formats", {
              ref: self2.formats,
              code: opts.code.formats
            });
            const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
            const fType = gen.let("fType");
            const format = gen.let("format");
            gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
            cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
            function unknownFmt() {
              if (opts.strictSchema === false)
                return codegen_1.nil;
              return (0, codegen_1._)`${schemaCode} && !${format}`;
            }
            function invalidFmt() {
              const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
              const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
              return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
            }
          }
          function validateFormat() {
            const formatDef = self2.formats[schema];
            if (!formatDef) {
              unknownFormat();
              return;
            }
            if (formatDef === true)
              return;
            const [fmtType, format, fmtRef] = getFormat(formatDef);
            if (fmtType === ruleType)
              cxt.pass(validCondition());
            function unknownFormat() {
              if (opts.strictSchema === false) {
                self2.logger.warn(unknownMsg());
                return;
              }
              throw new Error(unknownMsg());
              function unknownMsg() {
                return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
              }
            }
            function getFormat(fmtDef) {
              const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
              const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
              if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
                return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
              }
              return ["string", fmtDef, fmt];
            }
            function validCondition() {
              if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
                if (!schemaEnv.$async)
                  throw new Error("async format in sync schema");
                return (0, codegen_1._)`await ${fmtRef}(${data})`;
              }
              return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
            }
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/format/index.js
  var require_format2 = __commonJS({
    "node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var format_1 = require_format();
      var format = [format_1.default];
      exports.default = format;
    }
  });

  // node_modules/ajv/dist/vocabularies/metadata.js
  var require_metadata = __commonJS({
    "node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.contentVocabulary = exports.metadataVocabulary = void 0;
      exports.metadataVocabulary = [
        "title",
        "description",
        "default",
        "deprecated",
        "readOnly",
        "writeOnly",
        "examples"
      ];
      exports.contentVocabulary = [
        "contentMediaType",
        "contentEncoding",
        "contentSchema"
      ];
    }
  });

  // node_modules/ajv/dist/vocabularies/draft7.js
  var require_draft7 = __commonJS({
    "node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var core_1 = require_core2();
      var validation_1 = require_validation();
      var applicator_1 = require_applicator();
      var format_1 = require_format2();
      var metadata_1 = require_metadata();
      var draft7Vocabularies = [
        core_1.default,
        validation_1.default,
        (0, applicator_1.default)(),
        format_1.default,
        metadata_1.metadataVocabulary,
        metadata_1.contentVocabulary
      ];
      exports.default = draft7Vocabularies;
    }
  });

  // node_modules/ajv/dist/vocabularies/discriminator/types.js
  var require_types = __commonJS({
    "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DiscrError = void 0;
      var DiscrError;
      (function(DiscrError2) {
        DiscrError2["Tag"] = "tag";
        DiscrError2["Mapping"] = "mapping";
      })(DiscrError = exports.DiscrError || (exports.DiscrError = {}));
    }
  });

  // node_modules/ajv/dist/vocabularies/discriminator/index.js
  var require_discriminator = __commonJS({
    "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var types_1 = require_types();
      var compile_1 = require_compile();
      var util_1 = require_util();
      var error = {
        message: ({ params: { discrError, tagName: tagName4 } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName4}" must be string` : `value of tag "${tagName4}" must be in oneOf`,
        params: ({ params: { discrError, tag, tagName: tagName4 } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName4}, tagValue: ${tag}}`
      };
      var def = {
        keyword: "discriminator",
        type: "object",
        schemaType: "object",
        error,
        code(cxt) {
          const { gen, data, schema, parentSchema, it: it3 } = cxt;
          const { oneOf } = parentSchema;
          if (!it3.opts.discriminator) {
            throw new Error("discriminator: requires discriminator option");
          }
          const tagName4 = schema.propertyName;
          if (typeof tagName4 != "string")
            throw new Error("discriminator: requires propertyName");
          if (schema.mapping)
            throw new Error("discriminator: mapping is not supported");
          if (!oneOf)
            throw new Error("discriminator: requires oneOf keyword");
          const valid2 = gen.let("valid", false);
          const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName4)}`);
          gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName: tagName4 }));
          cxt.ok(valid2);
          function validateMapping() {
            const mapping = getMapping();
            gen.if(false);
            for (const tagValue in mapping) {
              gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
              gen.assign(valid2, applyTagSchema(mapping[tagValue]));
            }
            gen.else();
            cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName: tagName4 });
            gen.endIf();
          }
          function applyTagSchema(schemaProp) {
            const _valid = gen.name("valid");
            const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
            cxt.mergeEvaluated(schCxt, codegen_1.Name);
            return _valid;
          }
          function getMapping() {
            var _a;
            const oneOfMapping = {};
            const topRequired = hasRequired(parentSchema);
            let tagRequired = true;
            for (let i3 = 0; i3 < oneOf.length; i3++) {
              let sch = oneOf[i3];
              if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it3.self.RULES)) {
                sch = compile_1.resolveRef.call(it3.self, it3.schemaEnv.root, it3.baseId, sch === null || sch === void 0 ? void 0 : sch.$ref);
                if (sch instanceof compile_1.SchemaEnv)
                  sch = sch.schema;
              }
              const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName4];
              if (typeof propSch != "object") {
                throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName4}"`);
              }
              tagRequired = tagRequired && (topRequired || hasRequired(sch));
              addMappings(propSch, i3);
            }
            if (!tagRequired)
              throw new Error(`discriminator: "${tagName4}" must be required`);
            return oneOfMapping;
            function hasRequired({ required }) {
              return Array.isArray(required) && required.includes(tagName4);
            }
            function addMappings(sch, i3) {
              if (sch.const) {
                addMapping(sch.const, i3);
              } else if (sch.enum) {
                for (const tagValue of sch.enum) {
                  addMapping(tagValue, i3);
                }
              } else {
                throw new Error(`discriminator: "properties/${tagName4}" must have "const" or "enum"`);
              }
            }
            function addMapping(tagValue, i3) {
              if (typeof tagValue != "string" || tagValue in oneOfMapping) {
                throw new Error(`discriminator: "${tagName4}" values must be unique strings`);
              }
              oneOfMapping[tagValue] = i3;
            }
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/refs/json-schema-draft-07.json
  var require_json_schema_draft_07 = __commonJS({
    "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
      module.exports = {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "http://json-schema.org/draft-07/schema#",
        title: "Core schema meta-schema",
        definitions: {
          schemaArray: {
            type: "array",
            minItems: 1,
            items: { $ref: "#" }
          },
          nonNegativeInteger: {
            type: "integer",
            minimum: 0
          },
          nonNegativeIntegerDefault0: {
            allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
          },
          simpleTypes: {
            enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
          },
          stringArray: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
            default: []
          }
        },
        type: ["object", "boolean"],
        properties: {
          $id: {
            type: "string",
            format: "uri-reference"
          },
          $schema: {
            type: "string",
            format: "uri"
          },
          $ref: {
            type: "string",
            format: "uri-reference"
          },
          $comment: {
            type: "string"
          },
          title: {
            type: "string"
          },
          description: {
            type: "string"
          },
          default: true,
          readOnly: {
            type: "boolean",
            default: false
          },
          examples: {
            type: "array",
            items: true
          },
          multipleOf: {
            type: "number",
            exclusiveMinimum: 0
          },
          maximum: {
            type: "number"
          },
          exclusiveMaximum: {
            type: "number"
          },
          minimum: {
            type: "number"
          },
          exclusiveMinimum: {
            type: "number"
          },
          maxLength: { $ref: "#/definitions/nonNegativeInteger" },
          minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
          pattern: {
            type: "string",
            format: "regex"
          },
          additionalItems: { $ref: "#" },
          items: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
            default: true
          },
          maxItems: { $ref: "#/definitions/nonNegativeInteger" },
          minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
          uniqueItems: {
            type: "boolean",
            default: false
          },
          contains: { $ref: "#" },
          maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
          minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
          required: { $ref: "#/definitions/stringArray" },
          additionalProperties: { $ref: "#" },
          definitions: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {}
          },
          properties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {}
          },
          patternProperties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            propertyNames: { format: "regex" },
            default: {}
          },
          dependencies: {
            type: "object",
            additionalProperties: {
              anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
            }
          },
          propertyNames: { $ref: "#" },
          const: true,
          enum: {
            type: "array",
            items: true,
            minItems: 1,
            uniqueItems: true
          },
          type: {
            anyOf: [
              { $ref: "#/definitions/simpleTypes" },
              {
                type: "array",
                items: { $ref: "#/definitions/simpleTypes" },
                minItems: 1,
                uniqueItems: true
              }
            ]
          },
          format: { type: "string" },
          contentMediaType: { type: "string" },
          contentEncoding: { type: "string" },
          if: { $ref: "#" },
          then: { $ref: "#" },
          else: { $ref: "#" },
          allOf: { $ref: "#/definitions/schemaArray" },
          anyOf: { $ref: "#/definitions/schemaArray" },
          oneOf: { $ref: "#/definitions/schemaArray" },
          not: { $ref: "#" }
        },
        default: true
      };
    }
  });

  // node_modules/ajv/dist/ajv.js
  var require_ajv = __commonJS({
    "node_modules/ajv/dist/ajv.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
      var core_1 = require_core();
      var draft7_1 = require_draft7();
      var discriminator_1 = require_discriminator();
      var draft7MetaSchema = require_json_schema_draft_07();
      var META_SUPPORT_DATA = ["/properties"];
      var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
      var Ajv2 = class extends core_1.default {
        _addVocabularies() {
          super._addVocabularies();
          draft7_1.default.forEach((v3) => this.addVocabulary(v3));
          if (this.opts.discriminator)
            this.addKeyword(discriminator_1.default);
        }
        _addDefaultMetaSchema() {
          super._addDefaultMetaSchema();
          if (!this.opts.meta)
            return;
          const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
          this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
          this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
        }
        defaultMeta() {
          return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
        }
      };
      module.exports = exports = Ajv2;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.default = Ajv2;
      var validate_1 = require_validate();
      Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
        return validate_1.KeywordCxt;
      } });
      var codegen_1 = require_codegen();
      Object.defineProperty(exports, "_", { enumerable: true, get: function() {
        return codegen_1._;
      } });
      Object.defineProperty(exports, "str", { enumerable: true, get: function() {
        return codegen_1.str;
      } });
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return codegen_1.stringify;
      } });
      Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
        return codegen_1.nil;
      } });
      Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
        return codegen_1.Name;
      } });
      Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
        return codegen_1.CodeGen;
      } });
    }
  });

  // node_modules/ajv-formats/dist/formats.js
  var require_formats = __commonJS({
    "node_modules/ajv-formats/dist/formats.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
      function fmtDef(validate3, compare) {
        return { validate: validate3, compare };
      }
      exports.fullFormats = {
        date: fmtDef(date, compareDate),
        time: fmtDef(time, compareTime),
        "date-time": fmtDef(date_time, compareDateTime),
        duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
        uri,
        "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
        "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
        url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
        email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
        ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
        ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
        regex: regex2,
        uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
        "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
        "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
        "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
        byte,
        int32: { type: "number", validate: validateInt32 },
        int64: { type: "number", validate: validateInt64 },
        float: { type: "number", validate: validateNumber },
        double: { type: "number", validate: validateNumber },
        password: true,
        binary: true
      };
      exports.fastFormats = {
        ...exports.fullFormats,
        date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
        time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareTime),
        "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
        uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
        "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
        email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
      };
      exports.formatNames = Object.keys(exports.fullFormats);
      function isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      }
      var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
      var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function date(str) {
        const matches = DATE.exec(str);
        if (!matches)
          return false;
        const year = +matches[1];
        const month = +matches[2];
        const day = +matches[3];
        return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
      }
      function compareDate(d1, d22) {
        if (!(d1 && d22))
          return void 0;
        if (d1 > d22)
          return 1;
        if (d1 < d22)
          return -1;
        return 0;
      }
      var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
      function time(str, withTimeZone) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hour = +matches[1];
        const minute = +matches[2];
        const second = +matches[3];
        const timeZone = matches[5];
        return (hour <= 23 && minute <= 59 && second <= 59 || hour === 23 && minute === 59 && second === 60) && (!withTimeZone || timeZone !== "");
      }
      function compareTime(t1, t22) {
        if (!(t1 && t22))
          return void 0;
        const a1 = TIME.exec(t1);
        const a22 = TIME.exec(t22);
        if (!(a1 && a22))
          return void 0;
        t1 = a1[1] + a1[2] + a1[3] + (a1[4] || "");
        t22 = a22[1] + a22[2] + a22[3] + (a22[4] || "");
        if (t1 > t22)
          return 1;
        if (t1 < t22)
          return -1;
        return 0;
      }
      var DATE_TIME_SEPARATOR = /t|\s/i;
      function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1], true);
      }
      function compareDateTime(dt1, dt22) {
        if (!(dt1 && dt22))
          return void 0;
        const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
        const [d22, t22] = dt22.split(DATE_TIME_SEPARATOR);
        const res = compareDate(d1, d22);
        if (res === void 0)
          return void 0;
        return res || compareTime(t1, t22);
      }
      var NOT_URI_FRAGMENT = /\/|:/;
      var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
      function uri(str) {
        return NOT_URI_FRAGMENT.test(str) && URI.test(str);
      }
      var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
      function byte(str) {
        BYTE.lastIndex = 0;
        return BYTE.test(str);
      }
      var MIN_INT32 = -(2 ** 31);
      var MAX_INT32 = 2 ** 31 - 1;
      function validateInt32(value) {
        return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
      }
      function validateInt64(value) {
        return Number.isInteger(value);
      }
      function validateNumber() {
        return true;
      }
      var Z_ANCHOR = /[^\\]\\Z/;
      function regex2(str) {
        if (Z_ANCHOR.test(str))
          return false;
        try {
          new RegExp(str);
          return true;
        } catch (e3) {
          return false;
        }
      }
    }
  });

  // node_modules/ajv-formats/dist/limit.js
  var require_limit = __commonJS({
    "node_modules/ajv-formats/dist/limit.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.formatLimitDefinition = void 0;
      var ajv_1 = require_ajv();
      var codegen_1 = require_codegen();
      var ops = codegen_1.operators;
      var KWDs = {
        formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
        formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
        formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
        formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
      };
      var error = {
        message: ({ keyword, schemaCode }) => codegen_1.str`should be ${KWDs[keyword].okStr} ${schemaCode}`,
        params: ({ keyword, schemaCode }) => codegen_1._`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
      };
      exports.formatLimitDefinition = {
        keyword: Object.keys(KWDs),
        type: "string",
        schemaType: "string",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, schemaCode, keyword, it: it3 } = cxt;
          const { opts, self: self2 } = it3;
          if (!opts.validateFormats)
            return;
          const fCxt = new ajv_1.KeywordCxt(it3, self2.RULES.all.format.definition, "format");
          if (fCxt.$data)
            validate$DataFormat();
          else
            validateFormat();
          function validate$DataFormat() {
            const fmts = gen.scopeValue("formats", {
              ref: self2.formats,
              code: opts.code.formats
            });
            const fmt = gen.const("fmt", codegen_1._`${fmts}[${fCxt.schemaCode}]`);
            cxt.fail$data(codegen_1.or(codegen_1._`typeof ${fmt} != "object"`, codegen_1._`${fmt} instanceof RegExp`, codegen_1._`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
          }
          function validateFormat() {
            const format = fCxt.schema;
            const fmtDef = self2.formats[format];
            if (!fmtDef || fmtDef === true)
              return;
            if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
              throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
            }
            const fmt = gen.scopeValue("formats", {
              key: format,
              ref: fmtDef,
              code: opts.code.formats ? codegen_1._`${opts.code.formats}${codegen_1.getProperty(format)}` : void 0
            });
            cxt.fail$data(compareCode(fmt));
          }
          function compareCode(fmt) {
            return codegen_1._`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
          }
        },
        dependencies: ["format"]
      };
      var formatLimitPlugin = (ajv2) => {
        ajv2.addKeyword(exports.formatLimitDefinition);
        return ajv2;
      };
      exports.default = formatLimitPlugin;
    }
  });

  // node_modules/ajv-formats/dist/index.js
  var require_dist = __commonJS({
    "node_modules/ajv-formats/dist/index.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var formats_1 = require_formats();
      var limit_1 = require_limit();
      var codegen_1 = require_codegen();
      var fullName = new codegen_1.Name("fullFormats");
      var fastName = new codegen_1.Name("fastFormats");
      var formatsPlugin = (ajv2, opts = { keywords: true }) => {
        if (Array.isArray(opts)) {
          addFormats2(ajv2, opts, formats_1.fullFormats, fullName);
          return ajv2;
        }
        const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
        const list = opts.formats || formats_1.formatNames;
        addFormats2(ajv2, list, formats, exportName);
        if (opts.keywords)
          limit_1.default(ajv2);
        return ajv2;
      };
      formatsPlugin.get = (name2, mode = "full") => {
        const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
        const f3 = formats[name2];
        if (!f3)
          throw new Error(`Unknown format "${name2}"`);
        return f3;
      };
      function addFormats2(ajv2, list, fs, exportName) {
        var _a;
        var _b;
        (_a = (_b = ajv2.opts.code).formats) !== null && _a !== void 0 ? _a : _b.formats = codegen_1._`require("ajv-formats/dist/formats").${exportName}`;
        for (const f3 of list)
          ajv2.addFormat(f3, fs[f3]);
      }
      module.exports = exports = formatsPlugin;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.default = formatsPlugin;
    }
  });

  // src/common/utils/languages.ts
  var languages_exports = {};
  __export(languages_exports, {
    js: () => js,
    json: () => json
  });
  var js = ["js", "mjs", "cjs", "javascript"];
  var json = ["json"];

  // src/common/utils/path.ts
  var fullSuffix = (fileName = "") => fileName.split(".").slice(1);
  var suffix = (fileName = "") => {
    const suffix2 = fullSuffix(fileName);
    return suffix2.join(".");
  };

  // node_modules/remote-esm/utils/path.js
  var regex = new RegExp("https?:", "g");
  var get = (path2, rel = "", keepRelativeImports = false) => {
    const windowLocation = globalThis?.location?.origin;
    let pathMatch = false;
    let relMatch = false;
    if (windowLocation) {
      relMatch = rel.includes(windowLocation);
      if (relMatch) {
        rel = rel.replace(windowLocation, "");
        if (rel[0] === "/")
          rel = rel.slice(1);
      }
      pathMatch = path2.includes(windowLocation);
      if (pathMatch) {
        path2 = path2.replace(windowLocation, "");
        if (path2[0] === "/")
          path2 = path2.slice(1);
      }
    }
    if (!keepRelativeImports)
      rel = rel.split("/").filter((v3) => v3 != "..").join("/");
    if (rel[rel.length - 1] === "/")
      rel = rel.slice(0, -1);
    let dirTokens = rel.split("/");
    if (dirTokens.length === 1 && dirTokens[0] === "")
      dirTokens = [];
    const potentialFile = dirTokens.pop();
    if (potentialFile) {
      const splitPath2 = potentialFile.split(".");
      if (splitPath2.length == 1 || splitPath2.length > 1 && splitPath2.includes(""))
        dirTokens.push(potentialFile);
    }
    const splitPath = path2.split("/");
    const pathTokens = splitPath.filter((str, i3) => {
      if (splitPath[i3 - 1] && regex.test(splitPath[i3 - 1]))
        return true;
      else
        return !!str;
    });
    const extensionTokens = pathTokens.filter((str, i3) => {
      if (str === "..") {
        dirTokens.pop();
        return false;
      } else if (str === ".")
        return false;
      else
        return true;
    });
    const newPath = (relMatch || !rel && pathMatch ? `${windowLocation}/` : ``) + [...dirTokens, ...extensionTokens].join("/");
    return newPath;
  };

  // node_modules/remote-esm/utils/request.js
  var getURL = (path2) => {
    let url;
    try {
      url = new URL(path2).href;
    } catch {
      url = get(path2, globalThis.location.href);
    }
    return url;
  };
  var handleFetch = async (path2, options2 = {}, progressCallback) => {
    if (!options2.mode)
      options2.mode = "cors";
    const url = getURL(path2);
    const response = await fetchRemote(url, options2, progressCallback);
    if (!response)
      throw new Error("No response received.");
    const type = response.type.split(";")[0];
    return {
      url,
      type,
      buffer: response.buffer
    };
  };
  var fetchRemote = async (url, options2 = {}, progressCallback) => {
    const response = await globalThis.fetch(url, options2);
    return new Promise(async (resolve2) => {
      if (response) {
        const type = response.headers.get("Content-Type");
        if (globalThis.REMOTEESM_NODE) {
          const buffer = await response.arrayBuffer();
          resolve2({ buffer, type });
        } else {
          const reader = response.body.getReader();
          const bytes = parseInt(response.headers.get("Content-Length"), 10);
          let bytesReceived = 0;
          let buffer = [];
          const processBuffer = async ({ done, value }) => {
            if (done) {
              const config = {};
              if (typeof type === "string")
                config.type = type;
              const blob = new Blob(buffer, config);
              const ab = await blob.arrayBuffer();
              resolve2({ buffer: new Uint8Array(ab), type });
              return;
            }
            bytesReceived += value.length;
            const chunk = value;
            buffer.push(chunk);
            if (progressCallback instanceof Function)
              progressCallback(response.headers.get("Range"), bytesReceived / bytes, bytes);
            return reader.read().then(processBuffer);
          };
          reader.read().then(processBuffer);
        }
      } else {
        console.warn("Response not received!", options2.headers);
        resolve2(void 0);
      }
    });
  };

  // node_modules/remote-esm/index.js
  globalThis.REMOTEESM_TEXT_REFERENCES = {};
  globalThis.REMOTEESM_NODE = false;
  var ready = new Promise(async (resolve2, reject) => {
    try {
      if (typeof process === "object") {
        globalThis.REMOTEESM_NODE = true;
        globalThis.fetch = (await import("node-fetch")).default;
        if (typeof globalThis.fetch !== "function")
          globalThis.fetch = fetch;
        const Blob3 = (await Promise.resolve().then(() => (init_browser(), browser_exports))).default;
        globalThis.Blob = Blob3;
        if (typeof globalThis.Blob !== "function")
          globalThis.Blob = Blob3;
        resolve2(true);
      } else
        resolve2(true);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
  var re = /import([ \n\t]*(?:(?:\* (?:as .+))|(?:[^ \n\t\{\}]+[ \n\t]*,?)|(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\}))[ \n\t]*)from[ \n\t]*(['"])([^'"\n]+)(?:['"])([ \n\t]*assert[ \n\t]*{type:[ \n\t]*(['"])([^'"\n]+)(?:['"])})?/g;
  var moduleDataURI = (text, mimeType = "text/javascript") => `data:${mimeType};base64,` + btoa(text);
  var importFromText = async (text, path2) => {
    const extension = path2.split(".").slice(-1)[0];
    const isJSON = extension === "json";
    let mimeType = isJSON ? "application/json" : "application/javascript";
    const uri = moduleDataURI(text, mimeType);
    let imported = await (isJSON ? import(uri, { assert: { type: "json" } }) : import(uri)).catch((e3) => {
      if (e3.message.includes("Unexpected token"))
        throw new Error("Failed to fetch");
      else
        throw e3;
    });
    const ref = {};
    for (let key in imported) {
      Object.defineProperty(ref, key, {
        get: () => imported[key],
        enumerable: true
      });
    }
    globalThis.REMOTEESM_TEXT_REFERENCES[path2] = uri;
    return imported;
  };
  var resolve = get;
  var getText = async (uri) => await globalThis.fetch(uri).then((res) => res.text());
  var safeImport = async (uri, {
    root,
    onImport = () => {
    },
    outputText,
    forceImportFromText
  } = {}) => {
    await ready;
    const extension = uri.split(".").slice(-1)[0];
    const isJSON = extension === "json";
    let module = !forceImportFromText ? await (isJSON ? import(uri, { assert: { type: "json" } }) : import(uri)).catch(() => {
    }) : void 0;
    let text;
    if (!module) {
      text = await getText(uri);
      try {
        module = await importFromText(text, uri);
      } catch (e3) {
        const base = get("", uri);
        let childBase = base;
        const importInfo = [];
        let m3;
        do {
          m3 = re.exec(text);
          if (m3 == null)
            m3 = re.exec(text);
          if (m3) {
            text = text.replace(m3[0], ``);
            const wildcard = !!m3[1].match(/\*\s+as/);
            const variables = m3[1].replace(/\*\s+as/, "").trim();
            importInfo.push({
              path: m3[3],
              variables,
              wildcard
            });
          }
        } while (m3);
        for (let i3 in importInfo) {
          const { variables, wildcard, path: path2 } = importInfo[i3];
          let correctPath = get(path2, childBase);
          const dependentFilePath = get(correctPath);
          const dependentFileWithoutRoot = get(dependentFilePath.replace(root ?? "", ""));
          let ref = globalThis.REMOTEESM_TEXT_REFERENCES[dependentFilePath];
          if (!ref) {
            const extension2 = correctPath.split(".").slice(-1)[0];
            const info = await handleFetch(correctPath);
            let blob = new Blob([info.buffer], { type: info.type });
            const isJS = extension2.includes("js");
            const newURI = dependentFileWithoutRoot;
            const newText = await blob.text();
            let importedText = isJS ? await new Promise(async (resolve2) => {
              await safeImport(newURI, {
                root: uri,
                onImport: (path3, info2) => {
                  onImport(path3, info2);
                  if (path3 == newURI)
                    resolve2(info2.text);
                },
                outputText: true,
                forceImportFromText
              });
            }) : newText;
            await importFromText(importedText, correctPath);
          }
          text = `import ${wildcard ? "* as " : ""}${variables} from "${globalThis.REMOTEESM_TEXT_REFERENCES[correctPath]}";
${text}`;
        }
        module = await importFromText(text, uri);
      }
    }
    onImport(uri, {
      text: outputText ? text ?? await getText(uri) : void 0,
      module
    });
    return module;
  };
  var remote_esm_default = safeImport;

  // src/common/get.ts
  var cache = {};
  var get2 = async (relPath, relativeTo = "", onImport) => {
    let type = suffix(relPath);
    const isJSON = !type || type.includes("json");
    const fullPath = resolve(relPath, relativeTo);
    if (!cache[fullPath]) {
      cache[fullPath] = remote_esm_default(fullPath, { onImport }).catch((e3) => {
        if (e3.message.includes("Failed to fetch"))
          throw new Error("404");
        else
          throw e3;
      });
      const res = await cache[fullPath];
      if (isJSON)
        cache[fullPath] = res?.default ?? {};
      else
        cache[fullPath] = res;
    }
    return isJSON ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath];
  };
  var get_default = get2;

  // src/common/utils/check.ts
  var import_meta = {};
  var valid = (input, options2, location) => {
    const errors = [];
    const isUndefined = options2?.relativeTo === void 0;
    const isString = typeof input === "string";
    const isObject = typeof input === "object";
    let error;
    if (isString) {
      const hasRelTo = !isUndefined && "relativeTo" in options2;
      if (!hasRelTo && !options2._remote) {
        if (import_meta.url) {
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

  // node_modules/es-plugins/src/parse.js
  var ARGUMENT_NAMES = /([^,]*)/g;
  function getFnParamInfo(fn2) {
    var fstr = fn2.toString();
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
    const matches = innerMatch.match(ARGUMENT_NAMES).filter((e3) => !!e3);
    const info = /* @__PURE__ */ new Map();
    matches.forEach((v3) => {
      let [name2, value] = v3.split("=");
      name2 = name2.trim();
      name2 = name2.replace(/\d+$/, "");
      const spread = name2.includes("...");
      name2 = name2.replace("...", "");
      try {
        if (name2)
          info.set(name2, {
            state: value ? (0, eval)(`(${value})`) : value,
            spread
          });
      } catch (e3) {
        info.set(name2, {});
        console.warn(`Argument ${name2} could not be parsed for`, fn2.toString(), value);
      }
    });
    return info;
  }
  var parse_default = getFnParamInfo;

  // node_modules/es-plugins/src/index.js
  var isNode = "process" in globalThis;
  var ESPlugin = class {
    tag;
    graph;
    parent;
    element;
    parentNode;
    children = {};
    tagName;
    style;
    attributes;
    #toRun = false;
    #resolveReady;
    #ready = new Promise((resolve2) => this.#resolveReady = resolve2);
    constructor(node, options2 = {}) {
      let parentNode;
      Object.defineProperty(this, "parentNode", {
        get: () => parentNode,
        set: (el) => {
          parentNode = el;
          if (el) {
            if (this.element) {
              parentNode.appendChild(this.element);
              if (typeof this.onrender === "function")
                this.onrender();
            } else {
            }
          } else if (this.element)
            this.element.remove();
        },
        enumerable: true
      });
      let element;
      Object.defineProperty(this, "element", {
        get: () => element,
        set: (el) => {
          element = el;
          if (this.parentNode) {
            this.parentNode.appendChild(el);
            if (typeof this.onrender === "function")
              this.onrender();
          }
        },
        enumerable: true
      });
      this.tag = options2.tag ?? "graph";
      Object.assign(this, node);
      this.parent = options2.parent;
      const getParentNode = () => options2.parentNode ?? this.parent?.parentNode;
      this.parentNode = getParentNode();
      if (this.graph) {
        for (let tag in this.graph.nodes) {
          const node2 = this.graph.nodes[tag];
          if (!(node2 instanceof ESPlugin)) {
            const clonedOptions = Object.assign({}, Object.assign(options2));
            this.graph.nodes[tag] = new ESPlugin(node2, Object.assign(clonedOptions, {
              tag,
              parent: this
            }));
            if (typeof options2.onPlugin === "function")
              options2.onPlugin(this.graph.nodes[tag]);
          } else {
            node2.tag = tag;
            node2.parent = this;
          }
        }
      }
      if ("default" in this) {
        if (options2._arguments !== false) {
          const args = parse_default(node.default) ?? /* @__PURE__ */ new Map();
          if (args.size === 0)
            args.set("default", {});
          const input = args.keys().next().value;
          if (this.arguments) {
            for (let key in this.arguments) {
              const o3 = args.get(key);
              o3.state = this.arguments[key];
              if (input === key)
                this.#toRun = true;
            }
          }
          this.arguments = args;
          this.graph = {
            nodes: {},
            ports: {
              input,
              output: input
            }
          };
          Array.from(args.entries()).forEach(([arg], i3) => {
            const module = {
              default: async (input2) => {
                const o3 = args.get(arg);
                o3.state = input2;
                if (i3 === 0) {
                  const res = await this.run();
                  return res;
                } else
                  return input2;
              }
            };
            const clonedOptions = Object.assign({}, Object.assign(options2));
            this.graph.nodes[arg] = new ESPlugin(module, Object.assign(clonedOptions, {
              tag: arg,
              parent: this,
              _arguments: false
            }));
            if (typeof options2.onPlugin === "function")
              options2.onPlugin(this.graph.nodes[arg]);
          });
          const originalDefault = this.default.bind(this);
          this.default = async (...argsArr) => {
            let updatedArgs = [];
            let i3 = 0;
            args.forEach((o3, k3) => {
              const argO = args.get(k3);
              const currentArg = argO.spread ? argsArr.slice(i3) : argsArr[i3];
              let update = currentArg !== void 0 ? currentArg : o3.state;
              argO.state = update;
              if (!argO.spread)
                update = [update];
              updatedArgs.push(...update);
              i3++;
            });
            const res = await originalDefault(...updatedArgs);
            return res;
          };
        }
      }
      if (options2.activate !== false) {
        if (typeof this.oncreate === "function")
          this.oncreate();
        if (this.loop) {
          setInterval(() => {
            this.run();
          }, this.loop);
        }
        if (isNode) {
        } else {
          if (this.tagName)
            this.element = document.createElement(this.tagName);
          this.parentNode = getParentNode() ?? document.body;
          if (this.element) {
            if (this.attributes) {
              for (let attribute in this.attributes) {
                const value = this.attributes[attribute];
                if (typeof value === "function") {
                  const boundValue = value.bind(this);
                  this.element[attribute] = (ev) => boundValue(ev);
                } else
                  this.element[attribute] = value;
              }
            }
          }
        }
      }
    }
    init = async () => {
      const edgesTarget = this.parent;
      const runIfMatch = async (target, tag) => {
        const newTag = target.tag ? tag ? `${target.tag}.${tag}` : target.tag : tag;
        if (target?.graph?.edges) {
          const splitTags = tag.split(".");
          let isOutput = target;
          for (let i3 in splitTags.slice(0, -1)) {
            const str = splitTags[i3];
            const innerPorts = target.graph.nodes[str]?.graph?.ports;
            const plusOne = Number.parseInt(i3) + 1;
            if (innerPorts?.output === splitTags[plusOne])
              isOutput = target.graph.nodes[str];
            else {
              isOutput = void 0;
              break;
            }
          }
          const found = target.graph.edges[tag] ?? target.graph.edges[newTag] ?? (isOutput ? target.graph.edges[splitTags[0]] : void 0);
          for (let tag2 in found) {
            let toRun = target;
            tag2.split(".").forEach((str) => toRun = toRun.graph.nodes[str]);
            this.children[tag2] = toRun;
          }
        }
        if (target.parent)
          await runIfMatch(target.parent, newTag);
      };
      if (edgesTarget)
        await runIfMatch(edgesTarget, this.tag);
      this.#resolveReady(true);
      if (this.#toRun)
        this.run();
    };
    run = async (...args) => {
      let results = {
        default: {},
        children: {}
      };
      await this.#ready;
      if (!("default" in this) && this.graph) {
        const input = this.graph.ports?.input;
        if (input) {
          const output = this.graph.ports?.output;
          const outputFallback = this.graph.nodes[output].graph?.ports ? `${output}.${this.graph.nodes[output].graph.ports.input}` : output;
          const node = this.graph.nodes[input];
          const res = await node.run(...args);
          results.children = Object.assign(results.children, res.children);
          results.default = (res.children[output] ?? res.children[outputFallback]).default;
        }
      } else {
        results.default = await this.default(...args);
      }
      if (results.default !== void 0) {
        for (let tag in this.children) {
          const args2 = !Array.isArray(results.default) ? [results.default] : results.default;
          const res = await this.children[tag].run(...args2);
          results.children[tag] = "default" in res ? res.default : res;
          for (let child in res.children)
            results.children[child] = res.children[child];
        }
      }
      this.#toRun = false;
      return results;
    };
  };
  var src_default = ESPlugin;

  // src/wasl-core/index.ts
  var isSrc = (str) => {
    return typeof str === "string" && Object.values(languages_exports).find((arr) => arr.includes(str.split(".").slice(-1)[0]));
  };
  var merge = (main, override, deleteSrc = false) => {
    const copy = Object.assign({}, main);
    if (override) {
      if (deleteSrc) {
        const ogSrc = override.src ?? override;
        delete override.src;
        if ("default" in ogSrc)
          return ogSrc.default;
      }
      const keys = Object.keys(copy);
      const newKeys = new Set(Object.keys(override));
      keys.forEach((k3) => {
        newKeys.delete(k3);
        if (typeof override[k3] === "object")
          copy[k3] = merge(copy[k3], override[k3]);
        else if (k3 in override)
          copy[k3] = override[k3];
      });
      newKeys.forEach((k3) => {
        copy[k3] = override[k3];
      });
    }
    return copy;
  };
  var checkFiles = (key, filesystem) => {
    const isJSON = suffix(key).slice(-4) === "json" ? true : false;
    const output = isJSON && filesystem[key] ? JSON.parse(JSON.stringify(filesystem[key])) : filesystem[key];
    return output;
  };
  var remove = (original, search, key = original, o3) => {
    console.error(`Source was not ${original ? `resolved for ${original}` : `specified for ${key}`}. ${search ? `If available, refer to this object directly as options.filesystem["${search}"]. ` : ""}${o3 ? `Automatically removing ${key} from the WASL file.` : ""}`);
    if (o3)
      delete o3[key];
  };
  var basePkgPath = "./package.json";
  var onError = (e3, { errors, warnings }) => {
    const item = {
      message: e3.message,
      file: e3.file,
      node: e3.node
    };
    const arr = e3.type === "warning" ? warnings : errors;
    arr.push(item);
  };
  var getWithErrorLog = async (...args) => {
    const o3 = args.slice(-1)[0];
    const path2 = args[0];
    args = args.slice(0, -1);
    return await get_default(...args).catch((e3) => onError({
      message: e3.message,
      file: path2
    }, o3));
  };
  var getSrc = async (target, info, options2, graph = {}) => {
    const nodes = graph.nodes;
    const edges = graph.edges;
    let {
      relativeToResolved,
      mainPath,
      url,
      onImport
    } = info;
    const isImportMode = !!url;
    relativeToResolved = options2._remote ?? relativeToResolved;
    for (let name2 in target) {
      const node = target[name2];
      const isObj = node && typeof node === "object";
      if (isObj) {
        let ogSrc = node.src ?? "";
        if (isSrc(ogSrc) || nodes && edges && !ogSrc) {
          node.src = null;
          let passToNested = null;
          let fullPath, _remote = options2._remote;
          try {
            new URL(ogSrc);
            fullPath = ogSrc;
            _remote = ogSrc;
          } catch {
            fullPath = relativeToResolved ? resolve(ogSrc, mainPath) : resolve(ogSrc);
          }
          if (isImportMode) {
            node.src = await getWithErrorLog(fullPath, void 0, onImport, options2);
            if (_remote) {
              if (!node.src) {
                const got = await getSrc([node], info, options2, { nodes: [node] });
                node.src = got[0].src ?? got[0];
                passToNested = resolve(ogSrc);
              }
            }
            passToNested = resolve(ogSrc, url, true);
            if (!node.src)
              remove(ogSrc, fullPath, name2, target);
          } else {
            if (options2.filesystem) {
              const res = checkFiles(fullPath, options2.filesystem);
              if (res) {
                if (res.default || fullPath.includes(".json"))
                  node.src = passToNested = res;
                else {
                  onError({
                    type: "warning",
                    message: `Node (${name2}) at ${fullPath} does not have a default export.`,
                    file: ogSrc
                  }, options2);
                  node.src = passToNested = { default: res };
                }
              } else
                remove(ogSrc, fullPath, name2, target);
            } else {
              onError({
                message: "No options.filesystem field to get JavaScript objects",
                file: ogSrc
              }, options2);
            }
          }
          if (node.src && node.src.graph)
            node.src = await load(passToNested, {
              relativeTo: relativeToResolved || options2.relativeTo,
              filesystem: options2.filesystem,
              errors: options2.errors,
              warnings: options2.warnings,
              files: options2.files,
              _internal: ogSrc,
              _deleteSrc: options2._deleteSrc,
              _remote
            });
        } else {
          for (let key in node) {
            if (key === "src" && node.src) {
              const language = node.src.language;
              if (!language || js.includes(language)) {
                if (node.src.text) {
                  const esmImport = async (text) => {
                    try {
                      let imported = await importFromText(text);
                      if (imported.default && Object.keys(imported).length === 1)
                        imported = imported.default;
                      return imported;
                    } catch (e3) {
                      console.error("Import did not work. Probably relies on something...");
                      onError({
                        message: e3.message,
                        file: name2
                      }, options2);
                    }
                  };
                  const esm = await esmImport(node.src.text);
                  if (esm) {
                    delete node.src.text;
                    if (typeof esm === "object")
                      node.src = { default: Object.assign(node.src, esm) };
                    else
                      node.src = esm;
                  } else {
                    onError({
                      message: "Could not import this text as ESM",
                      file: node.src
                    }, options2);
                  }
                } else {
                  const expectedFunctions = ["default", "oncreate", "onrender"];
                  for (let key2 in node.src) {
                    try {
                      if (expectedFunctions.includes(key2) && typeof node.src[key2] === "string")
                        node.src[key2] = (0, eval)(`(${node.src[key2]})`);
                    } catch (e3) {
                      onError({
                        message: `Field ${key2} could not be parsed`,
                        file: node.src[key2]
                      }, options2);
                    }
                  }
                }
              } else {
                console.warn(`Text is in ${language}, not JavaScript. This is not currently parsable automatically.`);
                onError({
                  message: `Source is in ${language}. Currently only JavaScript is supported.`,
                  file: ogSrc
                }, options2);
              }
            } else if (node[key] && typeof node[key] === "object") {
              const optsCopy = Object.assign({}, options2);
              optsCopy._deleteSrc = true;
              await getSrc(node[key], info, optsCopy, { nodes: node[key] });
            }
          }
        }
      }
    }
    for (let name2 in nodes) {
      const node = nodes[name2];
      if (node?.src && typeof node?.src === "object") {
        if (node.src.default) {
          const fnString = node.src.default.toString();
          const keyword = "function";
          if (fnString.slice(0, keyword.length) === keyword) {
            onError({
              type: "warning",
              message: `Default export may be stateful.`,
              node: name2
            }, options2);
          }
        }
        if (node.src.graph) {
          for (let nestedName in node.plugins) {
            const nestedNode = node.src.graph.nodes[nestedName];
            if (nestedNode) {
              if (node.plugins) {
                for (let key in node.plugins[nestedName]) {
                  const newInfo = node.plugins[nestedName][key];
                  if (typeof newInfo === "object") {
                    const optsCopy = Object.assign({}, options2);
                    optsCopy._deleteSrc = true;
                    const ogSrc = newInfo.src;
                    const newInfoForNode = await getSrc({ [key]: newInfo }, info, optsCopy, {
                      nodes: newInfo
                    });
                    const newVal = newInfoForNode[key];
                    if (newVal) {
                      let chosenVal = newVal.src ?? newVal;
                      if ("default" in chosenVal && Object.keys(chosenVal).length === 1)
                        chosenVal = chosenVal.default;
                      nestedNode[key] = chosenVal;
                    } else {
                      onError({
                        message: `Could not resolve ${ogSrc}`
                      }, options2);
                    }
                  } else
                    nestedNode[key] = newInfo;
                }
              }
            } else {
              onError({
                message: `Plugin target '${nestedName}' does not exist`,
                node: name2
              }, options2);
            }
          }
        } else if (edges) {
          if (!("default" in node.src)) {
            onError({
              message: "No default export.",
              node: name2
            }, options2);
          }
        }
        nodes[name2] = merge(node.src, node, options2._deleteSrc);
      }
    }
    return target;
  };
  var load = async (urlOrObject, options2 = {}, urlArg = "") => {
    const clonedOptions = Object.assign({ errors: [], warnings: [], files: {} }, options2);
    let {
      relativeTo,
      errors,
      warnings
    } = clonedOptions;
    const internalLoadCall = clonedOptions._internal;
    const onImport = (path2, info) => {
      clonedOptions.files[path2] = info;
    };
    const isString = typeof urlOrObject === "string";
    let object, url = urlArg, relativeToResolved = "";
    if (url || isString) {
      if (!url)
        url = urlOrObject;
      delete clonedOptions.filesystem;
      relativeToResolved = relativeTo;
    } else if (typeof urlOrObject === "object") {
      object = Object.assign({}, urlOrObject);
      delete clonedOptions.relativeTo;
      if (typeof internalLoadCall === "string")
        relativeToResolved = resolve(internalLoadCall, clonedOptions.relativeTo);
    }
    try {
      new URL(url);
      clonedOptions._remote = url;
      relativeToResolved = relativeTo = "";
    } catch {
    }
    errors.push(...valid(urlOrObject, clonedOptions, "load"));
    let pkg;
    const mainPath = await resolve(url, relativeToResolved);
    if (url) {
      const main = await getWithErrorLog(mainPath, void 0, onImport, { errors, warnings });
      const pkgUrl = resolve(basePkgPath, mainPath, true);
      pkg = await getWithErrorLog(pkgUrl, void 0, onImport, { errors, warnings });
      if (pkg)
        object = Object.assign(pkg, main);
    } else {
      if (clonedOptions.filesystem) {
        const pkgPath = resolve(basePkgPath, relativeToResolved);
        pkg = checkFiles(pkgPath, clonedOptions.filesystem);
        if (pkg)
          object = Object.assign(pkg, isString ? {} : object);
        else
          remove(basePkgPath, pkgPath);
      } else {
        const pkgPath = resolve(basePkgPath, mainPath);
        if (relativeToResolved) {
          pkg = await getWithErrorLog(pkgPath, { errors, warnings });
          if (pkg)
            object = Object.assign(pkg, isString ? {} : object);
        }
      }
    }
    if (errors.length === 0) {
      const nodes = object.graph.nodes;
      await getSrc(nodes, {
        mainPath,
        relativeToResolved,
        url,
        object,
        onImport
      }, clonedOptions, object.graph);
      const drill = (parent, callback) => {
        const nodes2 = parent.graph.nodes;
        for (let tag in nodes2) {
          const res = callback(nodes2[tag], {
            tag,
            parent,
            options: clonedOptions
          });
          if (res)
            nodes2[tag] = res;
        }
      };
      const plugins = [];
      const drillToTest = (target) => {
        drill(target, (node, info) => {
          const edges = info.parent.graph.edges;
          for (let output in edges) {
            const getTarget = (o3, str) => {
              return o3.graph?.nodes?.[str] ?? o3[str];
            };
            let outTarget = info.parent.graph.nodes;
            output.split(".").forEach((str) => outTarget = getTarget(outTarget, str));
            if (!outTarget) {
              onError({
                message: `Node '${output}' (output) does not exist to create an edge.`,
                file: url
              }, info.options);
            }
            for (let input in edges[output]) {
              let inTarget = nodes;
              input.split(".").forEach((str) => inTarget = getTarget(inTarget, str));
              if (!inTarget) {
                onError({
                  message: `Node '${input}' (input) does not exist to create an edge.`,
                  file: url
                }, info.options);
              }
            }
          }
        });
      };
      if (!internalLoadCall) {
        new src_default(object, {
          activate: clonedOptions.activate,
          onPlugin: (o3) => plugins.push(o3),
          parentNode: clonedOptions.parentNode
        });
        drillToTest(object);
        for (let i3 in plugins)
          await plugins[i3].init();
      }
      return object;
    }
  };
  var wasl_core_default = load;

  // src/common/utils/latest.js
  var version = "0.0.0";
  var latest_default = version;

  // versions/0.0.0/component.schema.json
  var component_schema_default = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://raw.github.com/brainsatplay/wasl/versions/0.0.0/component.schema.json",
    title: "Component",
    description: "A component for the Web Application Specification Language",
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      description: {
        type: "string"
      },
      version: {
        type: "string",
        pattern: "^([^.]+)(.[^.]+)*?$"
      },
      author: {
        type: "string"
      },
      main: {
        type: "string",
        format: "uri-reference"
      },
      type: {
        type: "string",
        pattern: "^(module|commonjs)$"
      },
      repository: {
        type: "string",
        format: "uri"
      },
      graph: {
        $ref: "graph.schema.json"
      }
    },
    required: ["graph"]
  };

  // versions/0.0.0/graph.schema.json
  var graph_schema_default = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://raw.github.com/brainsatplay/wasl/versions/0.0.0/graph.schema.json",
    title: "Graph",
    description: "The logic of the application to assemble.",
    type: "object",
    properties: {
      nodes: {
        $ref: "nodes.schema.json"
      },
      edges: {
        $ref: "edges.schema.json"
      },
      ports: {
        $ref: "ports.schema.json"
      }
    },
    required: ["nodes"]
  };

  // versions/0.0.0/edges.schema.json
  var edges_schema_default = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://raw.github.com/brainsatplay/wasl/versions/0.0.0/edges.schema.json",
    title: "Edges",
    description: "The way that nodes are connected",
    type: "object",
    patternProperties: {
      "^([^.]+)(.[^.]+)*?$": {
        type: "object",
        patternProperties: {
          "^([^.]+)(.[^.]+)*?$": {
            type: "object",
            properties: {
              protocol: {
                $comment: "Can be inferred from the href property of each node",
                type: "string",
                pattern: "^(http|websockets|webrtc)$"
              }
            },
            additionalProperties: false
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }
  };

  // versions/0.0.0/nodes.schema.json
  var nodes_schema_default = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://raw.github.com/brainsatplay/wasl/versions/0.0.0/nodes.schema.json",
    title: "Nodes",
    description: "The composable units of the graph",
    type: "object",
    patternProperties: {
      "^(.+)$": {
        type: "object",
        properties: {
          src: {
            anyOf: [
              {
                type: "string",
                format: "uri-reference"
              },
              {
                type: "object",
                $ref: "component.schema.json"
              },
              {
                type: "object",
                $comment: "The raw JSON",
                properties: {
                  default: {
                    description: "The stringified stateless function that this node uses to handle upstream information in the graph"
                  },
                  tagName: {
                    type: "string"
                  },
                  innerHTML: {
                    type: "string"
                  },
                  innerText: {
                    type: "string"
                  },
                  style: {
                    anyOf: [
                      {
                        type: "string",
                        format: "uri-reference"
                      },
                      {
                        type: "object"
                      }
                    ]
                  },
                  attributes: {
                    type: "object",
                    description: "A set of HTML Element events for the node to listen to",
                    patternProperties: {
                      "^on(.+)$": {
                        description: "A stringified function to handle an event"
                      }
                    }
                  },
                  onrender: {
                    description: "A stringified function that responds to when this node's information is rendered as an HTML element"
                  }
                },
                required: ["default"]
              },
              {
                type: "object",
                properties: {
                  language: {
                    type: "string"
                  },
                  text: {
                    type: "string"
                  }
                },
                additionalProperties: false
              }
            ]
          },
          href: {
            anyOf: [
              {
                type: "string"
              }
            ]
          },
          extensions: {
            type: "object",
            patternProperties: {
              "^.*$": {
                type: "object",
                patternProperties: {
                  "^.*$": {}
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          },
          plugins: {
            type: "object",
            patternProperties: {
              "^.*$": {
                type: "object",
                patternProperties: {
                  "^.*$": {}
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          },
          arguments: {
            type: "object",
            $comment: "Generated by wasl.load"
          }
        },
        required: ["src"]
      }
    },
    additionalProperties: false
  };

  // versions/0.0.0/ports.schema.json
  var ports_schema_default = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://raw.github.com/brainsatplay/wasl/versions/0.0.0/ports.schema.json",
    title: "Ports",
    description: "Parts of your application that you wish to expose as an API.",
    type: "object",
    properties: {
      input: {
        description: "Inputs to your application.",
        $ref: "port.schema.json"
      },
      output: {
        description: "Outputs of your application.",
        $ref: "port.schema.json"
      }
    },
    additionalProperties: false
  };

  // versions/0.0.0/port.schema.json
  var port_schema_default = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://raw.github.com/brainsatplay/wasl/versions/0.0.0/port.schema.json",
    title: "Port",
    description: "Exposed components of your application.",
    anyOf: [
      {
        type: "string"
      },
      {
        type: "object",
        patternProperties: {
          "^(.+)$": {}
        }
      }
    ]
  };

  // src/common/utils/schema.registry.js
  var schema_registry_default = {
    ["0.0.0"]: {
      "graph.schema.json": graph_schema_default,
      "nodes.schema.json": nodes_schema_default,
      "edges.schema.json": edges_schema_default,
      "component.schema.json": component_schema_default,
      "ports.schema.json": ports_schema_default,
      "port.schema.json": port_schema_default
    }
  };

  // src/common/utils/get.js
  var schemaCache = {};
  var getSchema = async (v3 = latest_default) => {
    if (!schemaCache[v3]) {
      schemaCache[v3] = {};
      const og = schema_registry_default[v3];
      if (!og) {
        console.error("Schema not properly linked in the wasl library", v3, name);
      }
      for (let schema in og) {
        const keysWithDollarSign = Object.keys(og[schema]).filter((k3) => k3.includes("$"));
        keysWithDollarSign.forEach((k3) => delete og[schema][k3]);
      }
      schemaCache[v3] = og;
    }
    return schemaCache[v3];
  };
  var getSchemas = async (v3 = latest_default, name2 = "component.schema.json") => {
    const o3 = { main: null, all: [] };
    const schemas = await getSchema(v3);
    const keys = Object.keys(schemas);
    o3.main = schemas[name2];
    keys.forEach((k3) => {
      o3.all.push({ ref: schemas[k3], name: k3 });
    });
    return o3;
  };

  // src/wasl-validate/index.ts
  var import_ajv = __toESM(require_ajv(), 1);
  var import_ajv_formats = __toESM(require_dist(), 1);
  var activeVersion = null;
  var ajv = new import_ajv.default({
    allErrors: true
  });
  (0, import_ajv_formats.default)(ajv);
  var validate = async (urlOrObject, options2 = {}) => {
    const clone = Object.assign({ errors: [], warnings: [] }, options2);
    let { version: version2, relativeTo, errors } = clone;
    if (!version2)
      version2 = latest_default;
    let schemaValid;
    let data = urlOrObject;
    try {
      new URL(urlOrObject);
      clone._remote = urlOrObject;
      delete clone.relativeTo;
      relativeTo = "";
    } catch {
    }
    const inputErrors = valid(urlOrObject, clone, "validate");
    const inputIsValid = inputErrors.length === 0;
    errors.push(...inputErrors);
    if (typeof urlOrObject === "string") {
      data = await get_default(urlOrObject, relativeTo).catch((e3) => {
        errors.push({
          message: e3.message,
          file: urlOrObject
        });
      });
    }
    if (errors.length === 0) {
      activeVersion = version2;
      let schemas = await getSchemas(version2);
      const schemaCopy = JSON.parse(JSON.stringify(schemas.main));
      schemas.all.forEach((s3) => {
        const schema = ajv.getSchema(s3.name);
        if (!schema)
          ajv.addSchema(s3.ref, s3.name);
      });
      const ajvValidate = await ajv.compile(schemaCopy);
      schemaValid = ajvValidate(data);
      if (ajvValidate.errors)
        errors.push(...ajvValidate.errors);
      if (inputIsValid && !clone._internal) {
        clone._internal = true;
        const loaded = await wasl_core_default(data, clone, typeof urlOrObject === "string" ? urlOrObject : void 0);
        if (loaded)
          schemaValid = await validate(loaded, clone);
      }
    }
    return schemaValid && inputIsValid;
  };
  var wasl_validate_default = validate;

  // ../htil/content/signals/index.wasl.json
  var index_wasl_default = {
    graph: {
      nodes: {
        synthetic: {
          src: "../../plugins/devices/synthetic/index.js"
        },
        ganglion: {
          src: "../../plugins/devices/ganglion/index.js"
        },
        muse: {
          src: "../../plugins/devices/muse/index.js"
        },
        datastreams: {
          src: "../../plugins/datastreams/index.wasl.json"
        },
        ui: {
          src: "../../plugins/ui/index.wasl.json"
        }
      },
      edges: {
        "ui.button_1": {
          synthetic: {}
        },
        synthetic: {
          "datastreams.start": {}
        },
        "ui.button_2": {
          ganglion: {}
        },
        ganglion: {
          "datastreams.start": {}
        },
        "ui.button_3": {
          muse: {}
        },
        muse: {
          "datastreams.start": {}
        },
        "datastreams.start": {
          "ui.display": {}
        }
      }
    }
  };

  // ../htil/plugins/datastreams/index.wasl.json
  var index_wasl_default2 = {
    graph: {
      nodes: {
        start: {
          src: "plugins/start/index.js"
        }
      },
      ports: {
        input: {
          start: "start"
        },
        output: "start"
      }
    }
  };

  // ../htil/plugins/ui/index.wasl.json
  var index_wasl_default3 = {
    graph: {
      nodes: {
        button_1: {
          attributes: {
            innerHTML: "Start synthetic data generation"
          },
          src: "plugins/button/index.js"
        },
        button_2: {
          attributes: {
            innerHTML: "Connect Ganglion"
          },
          src: "plugins/button/index.js"
        },
        button_3: {
          attributes: {
            innerHTML: "Connect Muse"
          },
          src: "plugins/button/index.js"
        },
        display: {
          src: "plugins/display/index.js"
        }
      },
      ports: {
        input: {
          data: "display"
        },
        output: "button_1"
      }
    }
  };

  // ../htil/content/signals/package.json
  var package_default = {
    name: "signals"
  };

  // ../htil/plugins/datastreams/package.json
  var package_default2 = {
    name: "datastream"
  };

  // ../htil/plugins/ui/package.json
  var package_default3 = {
    name: "ui"
  };

  // ../htil/plugins/ui/plugins/button/index.js
  var button_exports = {};
  __export(button_exports, {
    attributes: () => attributes,
    default: () => button_default,
    tagName: () => tagName
  });
  var tagName = "button";
  var attributes = {
    innerHTML: "Click Me",
    onmousedown: function() {
      const pressed = this;
      pressed.run(true);
      const onMouseUp = () => {
        pressed.run(false);
        globalThis.removeEventListener("mouseup", onMouseUp);
      };
      globalThis.addEventListener("mouseup", onMouseUp);
    }
  };
  var button_default = (pressed) => pressed;

  // ../htil/plugins/ui/plugins/display/index.js
  var display_exports = {};
  __export(display_exports, {
    default: () => display_default,
    onrender: () => onrender,
    style: () => style,
    tagName: () => tagName2
  });
  var tagName2 = "div";
  var style = {
    width: "300px",
    height: "100px",
    padding: "25px"
  };
  function onrender() {
    this.paragraphs = {};
  }
  function display_default(id, data) {
    if (!this.paragraphs[id]) {
      this.paragraphs[id] = document.createElement("p");
      this.element.appendChild(this.paragraphs[id]);
    }
    this.paragraphs[id].innerHTML = `<b>${id}:</b> ${data}`;
  }

  // ../htil/plugins/devices/synthetic/index.js
  var synthetic_exports = {};
  __export(synthetic_exports, {
    default: () => synthetic_default
  });
  var looping = false;
  var freqs = [1, 4, 8];
  var customDevice = {
    label: "mydevice",
    onconnect: (device) => {
      looping = true;
      const animate = (callback) => {
        if (looping) {
          const t9 = Date.now() / 1e3;
          let channels = [];
          freqs.forEach((f3) => {
            const y3 = Math.sin(2 * f3 * Math.PI * t9);
            channels.push(y3);
          });
          callback(channels);
          setTimeout(() => animate(callback), 1e3 / 60);
        }
      };
      animate(device.ondata);
    },
    ondisconnect: async (device) => looping = false,
    ondata: (channels) => {
      return channels;
    },
    protocols: []
  };
  var synthetic_default = (trigger) => trigger ? customDevice : void 0;

  // ../htil/plugins/devices/muse/index.js
  var muse_exports = {};
  __export(muse_exports, {
    default: () => muse_default
  });

  // node_modules/.cache/cdn.jsdelivr.net/npm/@brainsatplay/muse@0.0.1/dist/index.esm.js
  function t(t9, e3, n3, r3) {
    return new (n3 || (n3 = Promise))(function(i3, o3) {
      function s3(t10) {
        try {
          c3(r3.next(t10));
        } catch (t11) {
          o3(t11);
        }
      }
      function u3(t10) {
        try {
          c3(r3.throw(t10));
        } catch (t11) {
          o3(t11);
        }
      }
      function c3(t10) {
        var e4;
        t10.done ? i3(t10.value) : (e4 = t10.value, e4 instanceof n3 ? e4 : new n3(function(t11) {
          t11(e4);
        })).then(s3, u3);
      }
      c3((r3 = r3.apply(t9, e3 || [])).next());
    });
  }
  var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  function n(t9) {
    if (t9.__esModule)
      return t9;
    var e3 = Object.defineProperty({}, "__esModule", { value: true });
    return Object.keys(t9).forEach(function(n3) {
      var r3 = Object.getOwnPropertyDescriptor(t9, n3);
      Object.defineProperty(e3, n3, r3.get ? r3 : { enumerable: true, get: function() {
        return t9[n3];
      } });
    }), e3;
  }
  var r = {};
  var i = function(t9, e3) {
    return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t10, e4) {
      t10.__proto__ = e4;
    } || function(t10, e4) {
      for (var n3 in e4)
        e4.hasOwnProperty(n3) && (t10[n3] = e4[n3]);
    }, i(t9, e3);
  };
  function o(t9, e3) {
    function n3() {
      this.constructor = t9;
    }
    i(t9, e3), t9.prototype = null === e3 ? Object.create(e3) : (n3.prototype = e3.prototype, new n3());
  }
  function s(t9) {
    return "function" == typeof t9;
  }
  var u = false;
  var c = { Promise: void 0, set useDeprecatedSynchronousErrorHandling(t9) {
    t9 && new Error().stack;
    u = t9;
  }, get useDeprecatedSynchronousErrorHandling() {
    return u;
  } };
  function a(t9) {
    setTimeout(function() {
      throw t9;
    }, 0);
  }
  var h = { closed: true, next: function(t9) {
  }, error: function(t9) {
    if (c.useDeprecatedSynchronousErrorHandling)
      throw t9;
    a(t9);
  }, complete: function() {
  } };
  var l = function() {
    return Array.isArray || function(t9) {
      return t9 && "number" == typeof t9.length;
    };
  }();
  function f(t9) {
    return null !== t9 && "object" == typeof t9;
  }
  var p = function() {
    function t9(t10) {
      return Error.call(this), this.message = t10 ? t10.length + " errors occurred during unsubscription:\n" + t10.map(function(t11, e3) {
        return e3 + 1 + ") " + t11.toString();
      }).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t10, this;
    }
    return t9.prototype = Object.create(Error.prototype), t9;
  }();
  var d = function() {
    function t9(t10) {
      this.closed = false, this._parentOrParents = null, this._subscriptions = null, t10 && (this._ctorUnsubscribe = true, this._unsubscribe = t10);
    }
    return t9.prototype.unsubscribe = function() {
      var e3;
      if (!this.closed) {
        var n3 = this, r3 = n3._parentOrParents, i3 = n3._ctorUnsubscribe, o3 = n3._unsubscribe, u3 = n3._subscriptions;
        if (this.closed = true, this._parentOrParents = null, this._subscriptions = null, r3 instanceof t9)
          r3.remove(this);
        else if (null !== r3)
          for (var c3 = 0; c3 < r3.length; ++c3) {
            r3[c3].remove(this);
          }
        if (s(o3)) {
          i3 && (this._unsubscribe = void 0);
          try {
            o3.call(this);
          } catch (t10) {
            e3 = t10 instanceof p ? b(t10.errors) : [t10];
          }
        }
        if (l(u3)) {
          c3 = -1;
          for (var a3 = u3.length; ++c3 < a3; ) {
            var h3 = u3[c3];
            if (f(h3))
              try {
                h3.unsubscribe();
              } catch (t10) {
                e3 = e3 || [], t10 instanceof p ? e3 = e3.concat(b(t10.errors)) : e3.push(t10);
              }
          }
        }
        if (e3)
          throw new p(e3);
      }
    }, t9.prototype.add = function(e3) {
      var n3 = e3;
      if (!e3)
        return t9.EMPTY;
      switch (typeof e3) {
        case "function":
          n3 = new t9(e3);
        case "object":
          if (n3 === this || n3.closed || "function" != typeof n3.unsubscribe)
            return n3;
          if (this.closed)
            return n3.unsubscribe(), n3;
          if (!(n3 instanceof t9)) {
            var r3 = n3;
            (n3 = new t9())._subscriptions = [r3];
          }
          break;
        default:
          throw new Error("unrecognized teardown " + e3 + " added to Subscription.");
      }
      var i3 = n3._parentOrParents;
      if (null === i3)
        n3._parentOrParents = this;
      else if (i3 instanceof t9) {
        if (i3 === this)
          return n3;
        n3._parentOrParents = [i3, this];
      } else {
        if (-1 !== i3.indexOf(this))
          return n3;
        i3.push(this);
      }
      var o3 = this._subscriptions;
      return null === o3 ? this._subscriptions = [n3] : o3.push(n3), n3;
    }, t9.prototype.remove = function(t10) {
      var e3 = this._subscriptions;
      if (e3) {
        var n3 = e3.indexOf(t10);
        -1 !== n3 && e3.splice(n3, 1);
      }
    }, t9.EMPTY = function(t10) {
      return t10.closed = true, t10;
    }(new t9()), t9;
  }();
  function b(t9) {
    return t9.reduce(function(t10, e3) {
      return t10.concat(e3 instanceof p ? e3.errors : e3);
    }, []);
  }
  var v = function() {
    return "function" == typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random();
  }();
  var y = function(t9) {
    function e3(n3, r3, i3) {
      var o3 = t9.call(this) || this;
      switch (o3.syncErrorValue = null, o3.syncErrorThrown = false, o3.syncErrorThrowable = false, o3.isStopped = false, arguments.length) {
        case 0:
          o3.destination = h;
          break;
        case 1:
          if (!n3) {
            o3.destination = h;
            break;
          }
          if ("object" == typeof n3) {
            n3 instanceof e3 ? (o3.syncErrorThrowable = n3.syncErrorThrowable, o3.destination = n3, n3.add(o3)) : (o3.syncErrorThrowable = true, o3.destination = new m(o3, n3));
            break;
          }
        default:
          o3.syncErrorThrowable = true, o3.destination = new m(o3, n3, r3, i3);
      }
      return o3;
    }
    return o(e3, t9), e3.prototype[v] = function() {
      return this;
    }, e3.create = function(t10, n3, r3) {
      var i3 = new e3(t10, n3, r3);
      return i3.syncErrorThrowable = false, i3;
    }, e3.prototype.next = function(t10) {
      this.isStopped || this._next(t10);
    }, e3.prototype.error = function(t10) {
      this.isStopped || (this.isStopped = true, this._error(t10));
    }, e3.prototype.complete = function() {
      this.isStopped || (this.isStopped = true, this._complete());
    }, e3.prototype.unsubscribe = function() {
      this.closed || (this.isStopped = true, t9.prototype.unsubscribe.call(this));
    }, e3.prototype._next = function(t10) {
      this.destination.next(t10);
    }, e3.prototype._error = function(t10) {
      this.destination.error(t10), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.destination.complete(), this.unsubscribe();
    }, e3.prototype._unsubscribeAndRecycle = function() {
      var t10 = this._parentOrParents;
      return this._parentOrParents = null, this.unsubscribe(), this.closed = false, this.isStopped = false, this._parentOrParents = t10, this;
    }, e3;
  }(d);
  var m = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3, u3 = t9.call(this) || this;
      u3._parentSubscriber = e4;
      var c3 = u3;
      return s(n3) ? o3 = n3 : n3 && (o3 = n3.next, r3 = n3.error, i3 = n3.complete, n3 !== h && (s((c3 = Object.create(n3)).unsubscribe) && u3.add(c3.unsubscribe.bind(c3)), c3.unsubscribe = u3.unsubscribe.bind(u3))), u3._context = c3, u3._next = o3, u3._error = r3, u3._complete = i3, u3;
    }
    return o(e3, t9), e3.prototype.next = function(t10) {
      if (!this.isStopped && this._next) {
        var e4 = this._parentSubscriber;
        c.useDeprecatedSynchronousErrorHandling && e4.syncErrorThrowable ? this.__tryOrSetError(e4, this._next, t10) && this.unsubscribe() : this.__tryOrUnsub(this._next, t10);
      }
    }, e3.prototype.error = function(t10) {
      if (!this.isStopped) {
        var e4 = this._parentSubscriber, n3 = c.useDeprecatedSynchronousErrorHandling;
        if (this._error)
          n3 && e4.syncErrorThrowable ? (this.__tryOrSetError(e4, this._error, t10), this.unsubscribe()) : (this.__tryOrUnsub(this._error, t10), this.unsubscribe());
        else if (e4.syncErrorThrowable)
          n3 ? (e4.syncErrorValue = t10, e4.syncErrorThrown = true) : a(t10), this.unsubscribe();
        else {
          if (this.unsubscribe(), n3)
            throw t10;
          a(t10);
        }
      }
    }, e3.prototype.complete = function() {
      var t10 = this;
      if (!this.isStopped) {
        var e4 = this._parentSubscriber;
        if (this._complete) {
          var n3 = function() {
            return t10._complete.call(t10._context);
          };
          c.useDeprecatedSynchronousErrorHandling && e4.syncErrorThrowable ? (this.__tryOrSetError(e4, n3), this.unsubscribe()) : (this.__tryOrUnsub(n3), this.unsubscribe());
        } else
          this.unsubscribe();
      }
    }, e3.prototype.__tryOrUnsub = function(t10, e4) {
      try {
        t10.call(this._context, e4);
      } catch (t11) {
        if (this.unsubscribe(), c.useDeprecatedSynchronousErrorHandling)
          throw t11;
        a(t11);
      }
    }, e3.prototype.__tryOrSetError = function(t10, e4, n3) {
      if (!c.useDeprecatedSynchronousErrorHandling)
        throw new Error("bad call");
      try {
        e4.call(this._context, n3);
      } catch (e5) {
        return c.useDeprecatedSynchronousErrorHandling ? (t10.syncErrorValue = e5, t10.syncErrorThrown = true, true) : (a(e5), true);
      }
      return false;
    }, e3.prototype._unsubscribe = function() {
      var t10 = this._parentSubscriber;
      this._context = null, this._parentSubscriber = null, t10.unsubscribe();
    }, e3;
  }(y);
  function w(t9) {
    for (; t9; ) {
      var e3 = t9, n3 = e3.closed, r3 = e3.destination, i3 = e3.isStopped;
      if (n3 || i3)
        return false;
      t9 = r3 && r3 instanceof y ? r3 : null;
    }
    return true;
  }
  var x = function() {
    return "function" == typeof Symbol && Symbol.observable || "@@observable";
  }();
  function _(t9) {
    return t9;
  }
  function g() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return S(t9);
  }
  function S(t9) {
    return 0 === t9.length ? _ : 1 === t9.length ? t9[0] : function(e3) {
      return t9.reduce(function(t10, e4) {
        return e4(t10);
      }, e3);
    };
  }
  var E = function() {
    function t9(t10) {
      this._isScalar = false, t10 && (this._subscribe = t10);
    }
    return t9.prototype.lift = function(e3) {
      var n3 = new t9();
      return n3.source = this, n3.operator = e3, n3;
    }, t9.prototype.subscribe = function(t10, e3, n3) {
      var r3 = this.operator, i3 = function(t11, e4, n4) {
        if (t11) {
          if (t11 instanceof y)
            return t11;
          if (t11[v])
            return t11[v]();
        }
        return t11 || e4 || n4 ? new y(t11, e4, n4) : new y(h);
      }(t10, e3, n3);
      if (r3 ? i3.add(r3.call(i3, this.source)) : i3.add(this.source || c.useDeprecatedSynchronousErrorHandling && !i3.syncErrorThrowable ? this._subscribe(i3) : this._trySubscribe(i3)), c.useDeprecatedSynchronousErrorHandling && i3.syncErrorThrowable && (i3.syncErrorThrowable = false, i3.syncErrorThrown))
        throw i3.syncErrorValue;
      return i3;
    }, t9.prototype._trySubscribe = function(t10) {
      try {
        return this._subscribe(t10);
      } catch (e3) {
        c.useDeprecatedSynchronousErrorHandling && (t10.syncErrorThrown = true, t10.syncErrorValue = e3), w(t10) ? t10.error(e3) : console.warn(e3);
      }
    }, t9.prototype.forEach = function(t10, e3) {
      var n3 = this;
      return new (e3 = C(e3))(function(e4, r3) {
        var i3;
        i3 = n3.subscribe(function(e5) {
          try {
            t10(e5);
          } catch (t11) {
            r3(t11), i3 && i3.unsubscribe();
          }
        }, r3, e4);
      });
    }, t9.prototype._subscribe = function(t10) {
      var e3 = this.source;
      return e3 && e3.subscribe(t10);
    }, t9.prototype[x] = function() {
      return this;
    }, t9.prototype.pipe = function() {
      for (var t10 = [], e3 = 0; e3 < arguments.length; e3++)
        t10[e3] = arguments[e3];
      return 0 === t10.length ? this : S(t10)(this);
    }, t9.prototype.toPromise = function(t10) {
      var e3 = this;
      return new (t10 = C(t10))(function(t11, n3) {
        var r3;
        e3.subscribe(function(t12) {
          return r3 = t12;
        }, function(t12) {
          return n3(t12);
        }, function() {
          return t11(r3);
        });
      });
    }, t9.create = function(e3) {
      return new t9(e3);
    }, t9;
  }();
  function C(t9) {
    if (t9 || (t9 = c.Promise || Promise), !t9)
      throw new Error("no Promise impl found");
    return t9;
  }
  var N = function() {
    function t9() {
      return Error.call(this), this.message = "object unsubscribed", this.name = "ObjectUnsubscribedError", this;
    }
    return t9.prototype = Object.create(Error.prototype), t9;
  }();
  var T = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this) || this;
      return r3.subject = e4, r3.subscriber = n3, r3.closed = false, r3;
    }
    return o(e3, t9), e3.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.closed = true;
        var t10 = this.subject, e4 = t10.observers;
        if (this.subject = null, e4 && 0 !== e4.length && !t10.isStopped && !t10.closed) {
          var n3 = e4.indexOf(this.subscriber);
          -1 !== n3 && e4.splice(n3, 1);
        }
      }
    }, e3;
  }(d);
  var I = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this, e4) || this;
      return n3.destination = e4, n3;
    }
    return o(e3, t9), e3;
  }(y);
  var V = function(t9) {
    function e3() {
      var e4 = t9.call(this) || this;
      return e4.observers = [], e4.closed = false, e4.isStopped = false, e4.hasError = false, e4.thrownError = null, e4;
    }
    return o(e3, t9), e3.prototype[v] = function() {
      return new I(this);
    }, e3.prototype.lift = function(t10) {
      var e4 = new j(this, this);
      return e4.operator = t10, e4;
    }, e3.prototype.next = function(t10) {
      if (this.closed)
        throw new N();
      if (!this.isStopped)
        for (var e4 = this.observers, n3 = e4.length, r3 = e4.slice(), i3 = 0; i3 < n3; i3++)
          r3[i3].next(t10);
    }, e3.prototype.error = function(t10) {
      if (this.closed)
        throw new N();
      this.hasError = true, this.thrownError = t10, this.isStopped = true;
      for (var e4 = this.observers, n3 = e4.length, r3 = e4.slice(), i3 = 0; i3 < n3; i3++)
        r3[i3].error(t10);
      this.observers.length = 0;
    }, e3.prototype.complete = function() {
      if (this.closed)
        throw new N();
      this.isStopped = true;
      for (var t10 = this.observers, e4 = t10.length, n3 = t10.slice(), r3 = 0; r3 < e4; r3++)
        n3[r3].complete();
      this.observers.length = 0;
    }, e3.prototype.unsubscribe = function() {
      this.isStopped = true, this.closed = true, this.observers = null;
    }, e3.prototype._trySubscribe = function(e4) {
      if (this.closed)
        throw new N();
      return t9.prototype._trySubscribe.call(this, e4);
    }, e3.prototype._subscribe = function(t10) {
      if (this.closed)
        throw new N();
      return this.hasError ? (t10.error(this.thrownError), d.EMPTY) : this.isStopped ? (t10.complete(), d.EMPTY) : (this.observers.push(t10), new T(this, t10));
    }, e3.prototype.asObservable = function() {
      var t10 = new E();
      return t10.source = this, t10;
    }, e3.create = function(t10, e4) {
      return new j(t10, e4);
    }, e3;
  }(E);
  var j = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this) || this;
      return r3.destination = e4, r3.source = n3, r3;
    }
    return o(e3, t9), e3.prototype.next = function(t10) {
      var e4 = this.destination;
      e4 && e4.next && e4.next(t10);
    }, e3.prototype.error = function(t10) {
      var e4 = this.destination;
      e4 && e4.error && this.destination.error(t10);
    }, e3.prototype.complete = function() {
      var t10 = this.destination;
      t10 && t10.complete && this.destination.complete();
    }, e3.prototype._subscribe = function(t10) {
      return this.source ? this.source.subscribe(t10) : d.EMPTY;
    }, e3;
  }(V);
  function O() {
    return function(t9) {
      return t9.lift(new P(t9));
    };
  }
  var P = function() {
    function t9(t10) {
      this.connectable = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      var n3 = this.connectable;
      n3._refCount++;
      var r3 = new A(t10, n3), i3 = e3.subscribe(r3);
      return r3.closed || (r3.connection = n3.connect()), i3;
    }, t9;
  }();
  var A = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.connectable = n3, r3;
    }
    return o(e3, t9), e3.prototype._unsubscribe = function() {
      var t10 = this.connectable;
      if (t10) {
        this.connectable = null;
        var e4 = t10._refCount;
        if (e4 <= 0)
          this.connection = null;
        else if (t10._refCount = e4 - 1, e4 > 1)
          this.connection = null;
        else {
          var n3 = this.connection, r3 = t10._connection;
          this.connection = null, !r3 || n3 && r3 !== n3 || r3.unsubscribe();
        }
      } else
        this.connection = null;
    }, e3;
  }(y);
  var k = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this) || this;
      return r3.source = e4, r3.subjectFactory = n3, r3._refCount = 0, r3._isComplete = false, r3;
    }
    return o(e3, t9), e3.prototype._subscribe = function(t10) {
      return this.getSubject().subscribe(t10);
    }, e3.prototype.getSubject = function() {
      var t10 = this._subject;
      return t10 && !t10.isStopped || (this._subject = this.subjectFactory()), this._subject;
    }, e3.prototype.connect = function() {
      var t10 = this._connection;
      return t10 || (this._isComplete = false, (t10 = this._connection = new d()).add(this.source.subscribe(new R(this.getSubject(), this))), t10.closed && (this._connection = null, t10 = d.EMPTY)), t10;
    }, e3.prototype.refCount = function() {
      return O()(this);
    }, e3;
  }(E);
  var F = function() {
    var t9 = k.prototype;
    return { operator: { value: null }, _refCount: { value: 0, writable: true }, _subject: { value: null, writable: true }, _connection: { value: null, writable: true }, _subscribe: { value: t9._subscribe }, _isComplete: { value: t9._isComplete, writable: true }, getSubject: { value: t9.getSubject }, connect: { value: t9.connect }, refCount: { value: t9.refCount } };
  }();
  var R = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.connectable = n3, r3;
    }
    return o(e3, t9), e3.prototype._error = function(e4) {
      this._unsubscribe(), t9.prototype._error.call(this, e4);
    }, e3.prototype._complete = function() {
      this.connectable._isComplete = true, this._unsubscribe(), t9.prototype._complete.call(this);
    }, e3.prototype._unsubscribe = function() {
      var t10 = this.connectable;
      if (t10) {
        this.connectable = null;
        var e4 = t10._connection;
        t10._refCount = 0, t10._subject = null, t10._connection = null, e4 && e4.unsubscribe();
      }
    }, e3;
  }(I);
  var M = function() {
    function t9(t10, e3, n3, r3) {
      this.keySelector = t10, this.elementSelector = e3, this.durationSelector = n3, this.subjectSelector = r3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new D(t10, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    }, t9;
  }();
  var D = function(t9) {
    function e3(e4, n3, r3, i3, o3) {
      var s3 = t9.call(this, e4) || this;
      return s3.keySelector = n3, s3.elementSelector = r3, s3.durationSelector = i3, s3.subjectSelector = o3, s3.groups = null, s3.attemptedToUnsubscribe = false, s3.count = 0, s3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4;
      try {
        e4 = this.keySelector(t10);
      } catch (t11) {
        return void this.error(t11);
      }
      this._group(t10, e4);
    }, e3.prototype._group = function(t10, e4) {
      var n3 = this.groups;
      n3 || (n3 = this.groups = /* @__PURE__ */ new Map());
      var r3, i3 = n3.get(e4);
      if (this.elementSelector)
        try {
          r3 = this.elementSelector(t10);
        } catch (t11) {
          this.error(t11);
        }
      else
        r3 = t10;
      if (!i3) {
        i3 = this.subjectSelector ? this.subjectSelector() : new V(), n3.set(e4, i3);
        var o3 = new z(e4, i3, this);
        if (this.destination.next(o3), this.durationSelector) {
          var s3 = void 0;
          try {
            s3 = this.durationSelector(new z(e4, i3));
          } catch (t11) {
            return void this.error(t11);
          }
          this.add(s3.subscribe(new W(e4, i3, this)));
        }
      }
      i3.closed || i3.next(r3);
    }, e3.prototype._error = function(t10) {
      var e4 = this.groups;
      e4 && (e4.forEach(function(e5, n3) {
        e5.error(t10);
      }), e4.clear()), this.destination.error(t10);
    }, e3.prototype._complete = function() {
      var t10 = this.groups;
      t10 && (t10.forEach(function(t11, e4) {
        t11.complete();
      }), t10.clear()), this.destination.complete();
    }, e3.prototype.removeGroup = function(t10) {
      this.groups.delete(t10);
    }, e3.prototype.unsubscribe = function() {
      this.closed || (this.attemptedToUnsubscribe = true, 0 === this.count && t9.prototype.unsubscribe.call(this));
    }, e3;
  }(y);
  var W = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, n3) || this;
      return i3.key = e4, i3.group = n3, i3.parent = r3, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.complete();
    }, e3.prototype._unsubscribe = function() {
      var t10 = this.parent, e4 = this.key;
      this.key = this.parent = null, t10 && t10.removeGroup(e4);
    }, e3;
  }(y);
  var z = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this) || this;
      return i3.key = e4, i3.groupSubject = n3, i3.refCountSubscription = r3, i3;
    }
    return o(e3, t9), e3.prototype._subscribe = function(t10) {
      var e4 = new d(), n3 = this.refCountSubscription, r3 = this.groupSubject;
      return n3 && !n3.closed && e4.add(new B(n3)), e4.add(r3.subscribe(t10)), e4;
    }, e3;
  }(E);
  var B = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this) || this;
      return n3.parent = e4, e4.count++, n3;
    }
    return o(e3, t9), e3.prototype.unsubscribe = function() {
      var e4 = this.parent;
      e4.closed || this.closed || (t9.prototype.unsubscribe.call(this), e4.count -= 1, 0 === e4.count && e4.attemptedToUnsubscribe && e4.unsubscribe());
    }, e3;
  }(d);
  var U = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this) || this;
      return n3._value = e4, n3;
    }
    return o(e3, t9), Object.defineProperty(e3.prototype, "value", { get: function() {
      return this.getValue();
    }, enumerable: true, configurable: true }), e3.prototype._subscribe = function(e4) {
      var n3 = t9.prototype._subscribe.call(this, e4);
      return n3 && !n3.closed && e4.next(this._value), n3;
    }, e3.prototype.getValue = function() {
      if (this.hasError)
        throw this.thrownError;
      if (this.closed)
        throw new N();
      return this._value;
    }, e3.prototype.next = function(e4) {
      t9.prototype.next.call(this, this._value = e4);
    }, e3;
  }(V);
  var Y = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4, n3) || this;
      return r3.scheduler = e4, r3.work = n3, r3.pending = false, r3;
    }
    return o(e3, t9), e3.prototype.schedule = function(t10, e4) {
      if (void 0 === e4 && (e4 = 0), this.closed)
        return this;
      this.state = t10;
      var n3 = this.id, r3 = this.scheduler;
      return null != n3 && (this.id = this.recycleAsyncId(r3, n3, e4)), this.pending = true, this.delay = e4, this.id = this.id || this.requestAsyncId(r3, this.id, e4), this;
    }, e3.prototype.requestAsyncId = function(t10, e4, n3) {
      return void 0 === n3 && (n3 = 0), setInterval(t10.flush.bind(t10, this), n3);
    }, e3.prototype.recycleAsyncId = function(t10, e4, n3) {
      if (void 0 === n3 && (n3 = 0), null !== n3 && this.delay === n3 && false === this.pending)
        return e4;
      clearInterval(e4);
    }, e3.prototype.execute = function(t10, e4) {
      if (this.closed)
        return new Error("executing a cancelled action");
      this.pending = false;
      var n3 = this._execute(t10, e4);
      if (n3)
        return n3;
      false === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
    }, e3.prototype._execute = function(t10, e4) {
      var n3 = false, r3 = void 0;
      try {
        this.work(t10);
      } catch (t11) {
        n3 = true, r3 = !!t11 && t11 || new Error(t11);
      }
      if (n3)
        return this.unsubscribe(), r3;
    }, e3.prototype._unsubscribe = function() {
      var t10 = this.id, e4 = this.scheduler, n3 = e4.actions, r3 = n3.indexOf(this);
      this.work = null, this.state = null, this.pending = false, this.scheduler = null, -1 !== r3 && n3.splice(r3, 1), null != t10 && (this.id = this.recycleAsyncId(e4, t10, null)), this.delay = null;
    }, e3;
  }(function(t9) {
    function e3(e4, n3) {
      return t9.call(this) || this;
    }
    return o(e3, t9), e3.prototype.schedule = function(t10, e4) {
      return this;
    }, e3;
  }(d));
  var G = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4, n3) || this;
      return r3.scheduler = e4, r3.work = n3, r3;
    }
    return o(e3, t9), e3.prototype.schedule = function(e4, n3) {
      return void 0 === n3 && (n3 = 0), n3 > 0 ? t9.prototype.schedule.call(this, e4, n3) : (this.delay = n3, this.state = e4, this.scheduler.flush(this), this);
    }, e3.prototype.execute = function(e4, n3) {
      return n3 > 0 || this.closed ? t9.prototype.execute.call(this, e4, n3) : this._execute(e4, n3);
    }, e3.prototype.requestAsyncId = function(e4, n3, r3) {
      return void 0 === r3 && (r3 = 0), null !== r3 && r3 > 0 || null === r3 && this.delay > 0 ? t9.prototype.requestAsyncId.call(this, e4, n3, r3) : e4.flush(this);
    }, e3;
  }(Y);
  var q = function() {
    function t9(e3, n3) {
      void 0 === n3 && (n3 = t9.now), this.SchedulerAction = e3, this.now = n3;
    }
    return t9.prototype.schedule = function(t10, e3, n3) {
      return void 0 === e3 && (e3 = 0), new this.SchedulerAction(this, t10).schedule(n3, e3);
    }, t9.now = function() {
      return Date.now();
    }, t9;
  }();
  var L = function(t9) {
    function e3(n3, r3) {
      void 0 === r3 && (r3 = q.now);
      var i3 = t9.call(this, n3, function() {
        return e3.delegate && e3.delegate !== i3 ? e3.delegate.now() : r3();
      }) || this;
      return i3.actions = [], i3.active = false, i3.scheduled = void 0, i3;
    }
    return o(e3, t9), e3.prototype.schedule = function(n3, r3, i3) {
      return void 0 === r3 && (r3 = 0), e3.delegate && e3.delegate !== this ? e3.delegate.schedule(n3, r3, i3) : t9.prototype.schedule.call(this, n3, r3, i3);
    }, e3.prototype.flush = function(t10) {
      var e4 = this.actions;
      if (this.active)
        e4.push(t10);
      else {
        var n3;
        this.active = true;
        do {
          if (n3 = t10.execute(t10.state, t10.delay))
            break;
        } while (t10 = e4.shift());
        if (this.active = false, n3) {
          for (; t10 = e4.shift(); )
            t10.unsubscribe();
          throw n3;
        }
      }
    }, e3;
  }(q);
  var H = new (function(t9) {
    function e3() {
      return null !== t9 && t9.apply(this, arguments) || this;
    }
    return o(e3, t9), e3;
  }(L))(G);
  var K = H;
  var Q = new E(function(t9) {
    return t9.complete();
  });
  function J(t9) {
    return t9 ? function(t10) {
      return new E(function(e3) {
        return t10.schedule(function() {
          return e3.complete();
        });
      });
    }(t9) : Q;
  }
  function X(t9) {
    return t9 && "function" == typeof t9.schedule;
  }
  var Z;
  var $ = function(t9) {
    return function(e3) {
      for (var n3 = 0, r3 = t9.length; n3 < r3 && !e3.closed; n3++)
        e3.next(t9[n3]);
      e3.complete();
    };
  };
  function tt(t9, e3) {
    return new E(function(n3) {
      var r3 = new d(), i3 = 0;
      return r3.add(e3.schedule(function() {
        i3 !== t9.length ? (n3.next(t9[i3++]), n3.closed || r3.add(this.schedule())) : n3.complete();
      })), r3;
    });
  }
  function et(t9, e3) {
    return e3 ? tt(t9, e3) : new E($(t9));
  }
  function nt() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = t9[t9.length - 1];
    return X(n3) ? (t9.pop(), tt(t9, n3)) : et(t9);
  }
  function rt(t9, e3) {
    return new E(e3 ? function(n3) {
      return e3.schedule(it, 0, { error: t9, subscriber: n3 });
    } : function(e4) {
      return e4.error(t9);
    });
  }
  function it(t9) {
    var e3 = t9.error;
    t9.subscriber.error(e3);
  }
  Z || (Z = {});
  var ot = function() {
    function t9(t10, e3, n3) {
      this.kind = t10, this.value = e3, this.error = n3, this.hasValue = "N" === t10;
    }
    return t9.prototype.observe = function(t10) {
      switch (this.kind) {
        case "N":
          return t10.next && t10.next(this.value);
        case "E":
          return t10.error && t10.error(this.error);
        case "C":
          return t10.complete && t10.complete();
      }
    }, t9.prototype.do = function(t10, e3, n3) {
      switch (this.kind) {
        case "N":
          return t10 && t10(this.value);
        case "E":
          return e3 && e3(this.error);
        case "C":
          return n3 && n3();
      }
    }, t9.prototype.accept = function(t10, e3, n3) {
      return t10 && "function" == typeof t10.next ? this.observe(t10) : this.do(t10, e3, n3);
    }, t9.prototype.toObservable = function() {
      switch (this.kind) {
        case "N":
          return nt(this.value);
        case "E":
          return rt(this.error);
        case "C":
          return J();
      }
      throw new Error("unexpected notification kind value");
    }, t9.createNext = function(e3) {
      return void 0 !== e3 ? new t9("N", e3) : t9.undefinedValueNotification;
    }, t9.createError = function(e3) {
      return new t9("E", void 0, e3);
    }, t9.createComplete = function() {
      return t9.completeNotification;
    }, t9.completeNotification = new t9("C"), t9.undefinedValueNotification = new t9("N", void 0), t9;
  }();
  var st = function() {
    function t9(t10, e3) {
      void 0 === e3 && (e3 = 0), this.scheduler = t10, this.delay = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ut(t10, this.scheduler, this.delay));
    }, t9;
  }();
  var ut = function(t9) {
    function e3(e4, n3, r3) {
      void 0 === r3 && (r3 = 0);
      var i3 = t9.call(this, e4) || this;
      return i3.scheduler = n3, i3.delay = r3, i3;
    }
    return o(e3, t9), e3.dispatch = function(t10) {
      var e4 = t10.notification, n3 = t10.destination;
      e4.observe(n3), this.unsubscribe();
    }, e3.prototype.scheduleMessage = function(t10) {
      this.destination.add(this.scheduler.schedule(e3.dispatch, this.delay, new ct(t10, this.destination)));
    }, e3.prototype._next = function(t10) {
      this.scheduleMessage(ot.createNext(t10));
    }, e3.prototype._error = function(t10) {
      this.scheduleMessage(ot.createError(t10)), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.scheduleMessage(ot.createComplete()), this.unsubscribe();
    }, e3;
  }(y);
  var ct = function() {
    return function(t9, e3) {
      this.notification = t9, this.destination = e3;
    };
  }();
  var at = function(t9) {
    function e3(e4, n3, r3) {
      void 0 === e4 && (e4 = Number.POSITIVE_INFINITY), void 0 === n3 && (n3 = Number.POSITIVE_INFINITY);
      var i3 = t9.call(this) || this;
      return i3.scheduler = r3, i3._events = [], i3._infiniteTimeWindow = false, i3._bufferSize = e4 < 1 ? 1 : e4, i3._windowTime = n3 < 1 ? 1 : n3, n3 === Number.POSITIVE_INFINITY ? (i3._infiniteTimeWindow = true, i3.next = i3.nextInfiniteTimeWindow) : i3.next = i3.nextTimeWindow, i3;
    }
    return o(e3, t9), e3.prototype.nextInfiniteTimeWindow = function(e4) {
      if (!this.isStopped) {
        var n3 = this._events;
        n3.push(e4), n3.length > this._bufferSize && n3.shift();
      }
      t9.prototype.next.call(this, e4);
    }, e3.prototype.nextTimeWindow = function(e4) {
      this.isStopped || (this._events.push(new ht(this._getNow(), e4)), this._trimBufferThenGetEvents()), t9.prototype.next.call(this, e4);
    }, e3.prototype._subscribe = function(t10) {
      var e4, n3 = this._infiniteTimeWindow, r3 = n3 ? this._events : this._trimBufferThenGetEvents(), i3 = this.scheduler, o3 = r3.length;
      if (this.closed)
        throw new N();
      if (this.isStopped || this.hasError ? e4 = d.EMPTY : (this.observers.push(t10), e4 = new T(this, t10)), i3 && t10.add(t10 = new ut(t10, i3)), n3)
        for (var s3 = 0; s3 < o3 && !t10.closed; s3++)
          t10.next(r3[s3]);
      else
        for (s3 = 0; s3 < o3 && !t10.closed; s3++)
          t10.next(r3[s3].value);
      return this.hasError ? t10.error(this.thrownError) : this.isStopped && t10.complete(), e4;
    }, e3.prototype._getNow = function() {
      return (this.scheduler || K).now();
    }, e3.prototype._trimBufferThenGetEvents = function() {
      for (var t10 = this._getNow(), e4 = this._bufferSize, n3 = this._windowTime, r3 = this._events, i3 = r3.length, o3 = 0; o3 < i3 && !(t10 - r3[o3].time < n3); )
        o3++;
      return i3 > e4 && (o3 = Math.max(o3, i3 - e4)), o3 > 0 && r3.splice(0, o3), r3;
    }, e3;
  }(V);
  var ht = function() {
    return function(t9, e3) {
      this.time = t9, this.value = e3;
    };
  }();
  var lt = function(t9) {
    function e3() {
      var e4 = null !== t9 && t9.apply(this, arguments) || this;
      return e4.value = null, e4.hasNext = false, e4.hasCompleted = false, e4;
    }
    return o(e3, t9), e3.prototype._subscribe = function(e4) {
      return this.hasError ? (e4.error(this.thrownError), d.EMPTY) : this.hasCompleted && this.hasNext ? (e4.next(this.value), e4.complete(), d.EMPTY) : t9.prototype._subscribe.call(this, e4);
    }, e3.prototype.next = function(t10) {
      this.hasCompleted || (this.value = t10, this.hasNext = true);
    }, e3.prototype.error = function(e4) {
      this.hasCompleted || t9.prototype.error.call(this, e4);
    }, e3.prototype.complete = function() {
      this.hasCompleted = true, this.hasNext && t9.prototype.next.call(this, this.value), t9.prototype.complete.call(this);
    }, e3;
  }(V);
  var ft = 1;
  var pt = function() {
    return Promise.resolve();
  }();
  var dt = {};
  function bt(t9) {
    return t9 in dt && (delete dt[t9], true);
  }
  var vt = function(t9) {
    var e3 = ft++;
    return dt[e3] = true, pt.then(function() {
      return bt(e3) && t9();
    }), e3;
  };
  var yt = function(t9) {
    bt(t9);
  };
  var mt = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4, n3) || this;
      return r3.scheduler = e4, r3.work = n3, r3;
    }
    return o(e3, t9), e3.prototype.requestAsyncId = function(e4, n3, r3) {
      return void 0 === r3 && (r3 = 0), null !== r3 && r3 > 0 ? t9.prototype.requestAsyncId.call(this, e4, n3, r3) : (e4.actions.push(this), e4.scheduled || (e4.scheduled = vt(e4.flush.bind(e4, null))));
    }, e3.prototype.recycleAsyncId = function(e4, n3, r3) {
      if (void 0 === r3 && (r3 = 0), null !== r3 && r3 > 0 || null === r3 && this.delay > 0)
        return t9.prototype.recycleAsyncId.call(this, e4, n3, r3);
      0 === e4.actions.length && (yt(n3), e4.scheduled = void 0);
    }, e3;
  }(Y);
  var wt = function(t9) {
    function e3() {
      return null !== t9 && t9.apply(this, arguments) || this;
    }
    return o(e3, t9), e3.prototype.flush = function(t10) {
      this.active = true, this.scheduled = void 0;
      var e4, n3 = this.actions, r3 = -1, i3 = n3.length;
      t10 = t10 || n3.shift();
      do {
        if (e4 = t10.execute(t10.state, t10.delay))
          break;
      } while (++r3 < i3 && (t10 = n3.shift()));
      if (this.active = false, e4) {
        for (; ++r3 < i3 && (t10 = n3.shift()); )
          t10.unsubscribe();
        throw e4;
      }
    }, e3;
  }(L);
  var xt = new wt(mt);
  var _t = xt;
  var gt = new L(Y);
  var St = gt;
  var Et = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4, n3) || this;
      return r3.scheduler = e4, r3.work = n3, r3;
    }
    return o(e3, t9), e3.prototype.requestAsyncId = function(e4, n3, r3) {
      return void 0 === r3 && (r3 = 0), null !== r3 && r3 > 0 ? t9.prototype.requestAsyncId.call(this, e4, n3, r3) : (e4.actions.push(this), e4.scheduled || (e4.scheduled = requestAnimationFrame(function() {
        return e4.flush(null);
      })));
    }, e3.prototype.recycleAsyncId = function(e4, n3, r3) {
      if (void 0 === r3 && (r3 = 0), null !== r3 && r3 > 0 || null === r3 && this.delay > 0)
        return t9.prototype.recycleAsyncId.call(this, e4, n3, r3);
      0 === e4.actions.length && (cancelAnimationFrame(n3), e4.scheduled = void 0);
    }, e3;
  }(Y);
  var Ct = function(t9) {
    function e3() {
      return null !== t9 && t9.apply(this, arguments) || this;
    }
    return o(e3, t9), e3.prototype.flush = function(t10) {
      this.active = true, this.scheduled = void 0;
      var e4, n3 = this.actions, r3 = -1, i3 = n3.length;
      t10 = t10 || n3.shift();
      do {
        if (e4 = t10.execute(t10.state, t10.delay))
          break;
      } while (++r3 < i3 && (t10 = n3.shift()));
      if (this.active = false, e4) {
        for (; ++r3 < i3 && (t10 = n3.shift()); )
          t10.unsubscribe();
        throw e4;
      }
    }, e3;
  }(L);
  var Nt = new Ct(Et);
  var Tt = Nt;
  var It = function(t9) {
    function e3(e4, n3) {
      void 0 === e4 && (e4 = Vt), void 0 === n3 && (n3 = Number.POSITIVE_INFINITY);
      var r3 = t9.call(this, e4, function() {
        return r3.frame;
      }) || this;
      return r3.maxFrames = n3, r3.frame = 0, r3.index = -1, r3;
    }
    return o(e3, t9), e3.prototype.flush = function() {
      for (var t10, e4, n3 = this.actions, r3 = this.maxFrames; (e4 = n3[0]) && e4.delay <= r3 && (n3.shift(), this.frame = e4.delay, !(t10 = e4.execute(e4.state, e4.delay))); )
        ;
      if (t10) {
        for (; e4 = n3.shift(); )
          e4.unsubscribe();
        throw t10;
      }
    }, e3.frameTimeFactor = 10, e3;
  }(L);
  var Vt = function(t9) {
    function e3(e4, n3, r3) {
      void 0 === r3 && (r3 = e4.index += 1);
      var i3 = t9.call(this, e4, n3) || this;
      return i3.scheduler = e4, i3.work = n3, i3.index = r3, i3.active = true, i3.index = e4.index = r3, i3;
    }
    return o(e3, t9), e3.prototype.schedule = function(n3, r3) {
      if (void 0 === r3 && (r3 = 0), !this.id)
        return t9.prototype.schedule.call(this, n3, r3);
      this.active = false;
      var i3 = new e3(this.scheduler, this.work);
      return this.add(i3), i3.schedule(n3, r3);
    }, e3.prototype.requestAsyncId = function(t10, n3, r3) {
      void 0 === r3 && (r3 = 0), this.delay = t10.frame + r3;
      var i3 = t10.actions;
      return i3.push(this), i3.sort(e3.sortActions), true;
    }, e3.prototype.recycleAsyncId = function(t10, e4, n3) {
    }, e3.prototype._execute = function(e4, n3) {
      if (true === this.active)
        return t9.prototype._execute.call(this, e4, n3);
    }, e3.sortActions = function(t10, e4) {
      return t10.delay === e4.delay ? t10.index === e4.index ? 0 : t10.index > e4.index ? 1 : -1 : t10.delay > e4.delay ? 1 : -1;
    }, e3;
  }(Y);
  function jt() {
  }
  var Ot = function() {
    function t9() {
      return Error.call(this), this.message = "argument out of range", this.name = "ArgumentOutOfRangeError", this;
    }
    return t9.prototype = Object.create(Error.prototype), t9;
  }();
  var Pt = function() {
    function t9() {
      return Error.call(this), this.message = "no elements in sequence", this.name = "EmptyError", this;
    }
    return t9.prototype = Object.create(Error.prototype), t9;
  }();
  var At = function() {
    function t9() {
      return Error.call(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this;
    }
    return t9.prototype = Object.create(Error.prototype), t9;
  }();
  function kt(t9, e3) {
    return function(n3) {
      if ("function" != typeof t9)
        throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
      return n3.lift(new Ft(t9, e3));
    };
  }
  var Ft = function() {
    function t9(t10, e3) {
      this.project = t10, this.thisArg = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Rt(t10, this.project, this.thisArg));
    }, t9;
  }();
  var Rt = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.project = n3, i3.count = 0, i3.thisArg = r3 || i3, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4;
      try {
        e4 = this.project.call(this.thisArg, t10, this.count++);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.destination.next(e4);
    }, e3;
  }(y);
  function Mt(t9) {
    var e3 = this, n3 = t9.args, r3 = t9.subscriber, i3 = t9.params, o3 = i3.callbackFunc, s3 = i3.context, u3 = i3.scheduler, c3 = i3.subject;
    if (!c3) {
      c3 = i3.subject = new lt();
      try {
        o3.apply(s3, n3.concat([function() {
          for (var t10 = [], n4 = 0; n4 < arguments.length; n4++)
            t10[n4] = arguments[n4];
          var r4 = t10.length <= 1 ? t10[0] : t10;
          e3.add(u3.schedule(Dt, 0, { value: r4, subject: c3 }));
        }]));
      } catch (t10) {
        c3.error(t10);
      }
    }
    this.add(c3.subscribe(r3));
  }
  function Dt(t9) {
    var e3 = t9.value, n3 = t9.subject;
    n3.next(e3), n3.complete();
  }
  function Wt(t9) {
    var e3 = this, n3 = t9.params, r3 = t9.subscriber, i3 = t9.context, o3 = n3.callbackFunc, s3 = n3.args, u3 = n3.scheduler, c3 = n3.subject;
    if (!c3) {
      c3 = n3.subject = new lt();
      try {
        o3.apply(i3, s3.concat([function() {
          for (var t10 = [], n4 = 0; n4 < arguments.length; n4++)
            t10[n4] = arguments[n4];
          var r4 = t10.shift();
          if (r4)
            e3.add(u3.schedule(Bt, 0, { err: r4, subject: c3 }));
          else {
            var i4 = t10.length <= 1 ? t10[0] : t10;
            e3.add(u3.schedule(zt, 0, { value: i4, subject: c3 }));
          }
        }]));
      } catch (t10) {
        this.add(u3.schedule(Bt, 0, { err: t10, subject: c3 }));
      }
    }
    this.add(c3.subscribe(r3));
  }
  function zt(t9) {
    var e3 = t9.value, n3 = t9.subject;
    n3.next(e3), n3.complete();
  }
  function Bt(t9) {
    var e3 = t9.err;
    t9.subject.error(e3);
  }
  var Ut = function(t9) {
    function e3() {
      return null !== t9 && t9.apply(this, arguments) || this;
    }
    return o(e3, t9), e3.prototype.notifyNext = function(t10, e4, n3, r3, i3) {
      this.destination.next(e4);
    }, e3.prototype.notifyError = function(t10, e4) {
      this.destination.error(t10);
    }, e3.prototype.notifyComplete = function(t10) {
      this.destination.complete();
    }, e3;
  }(y);
  var Yt = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this) || this;
      return i3.parent = e4, i3.outerValue = n3, i3.outerIndex = r3, i3.index = 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.parent.notifyNext(this.outerValue, t10, this.outerIndex, this.index++, this);
    }, e3.prototype._error = function(t10) {
      this.parent.notifyError(t10, this), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.parent.notifyComplete(this), this.unsubscribe();
    }, e3;
  }(y);
  function Gt() {
    return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
  }
  var qt = Gt();
  var Lt = function(t9) {
    return t9 && "number" == typeof t9.length && "function" != typeof t9;
  };
  function Ht(t9) {
    return !!t9 && "function" != typeof t9.subscribe && "function" == typeof t9.then;
  }
  var Kt = function(t9) {
    if (t9 && "function" == typeof t9[x])
      return r3 = t9, function(t10) {
        var e4 = r3[x]();
        if ("function" != typeof e4.subscribe)
          throw new TypeError("Provided object does not correctly implement Symbol.observable");
        return e4.subscribe(t10);
      };
    if (Lt(t9))
      return $(t9);
    if (Ht(t9))
      return n3 = t9, function(t10) {
        return n3.then(function(e4) {
          t10.closed || (t10.next(e4), t10.complete());
        }, function(e4) {
          return t10.error(e4);
        }).then(null, a), t10;
      };
    if (t9 && "function" == typeof t9[qt])
      return e3 = t9, function(t10) {
        for (var n4 = e3[qt](); ; ) {
          var r4 = void 0;
          try {
            r4 = n4.next();
          } catch (e4) {
            return t10.error(e4), t10;
          }
          if (r4.done) {
            t10.complete();
            break;
          }
          if (t10.next(r4.value), t10.closed)
            break;
        }
        return "function" == typeof n4.return && t10.add(function() {
          n4.return && n4.return();
        }), t10;
      };
    var e3, n3, r3, i3 = f(t9) ? "an invalid object" : "'" + t9 + "'";
    throw new TypeError("You provided " + i3 + " where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.");
  };
  function Qt(t9, e3, n3, r3, i3) {
    if (void 0 === i3 && (i3 = new Yt(t9, n3, r3)), !i3.closed)
      return e3 instanceof E ? e3.subscribe(i3) : Kt(e3)(i3);
  }
  var Jt = {};
  var Xt = function() {
    function t9(t10) {
      this.resultSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Zt(t10, this.resultSelector));
    }, t9;
  }();
  var Zt = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.resultSelector = n3, r3.active = 0, r3.values = [], r3.observables = [], r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.values.push(Jt), this.observables.push(t10);
    }, e3.prototype._complete = function() {
      var t10 = this.observables, e4 = t10.length;
      if (0 === e4)
        this.destination.complete();
      else {
        this.active = e4, this.toRespond = e4;
        for (var n3 = 0; n3 < e4; n3++) {
          var r3 = t10[n3];
          this.add(Qt(this, r3, void 0, n3));
        }
      }
    }, e3.prototype.notifyComplete = function(t10) {
      0 == (this.active -= 1) && this.destination.complete();
    }, e3.prototype.notifyNext = function(t10, e4, n3) {
      var r3 = this.values, i3 = r3[n3], o3 = this.toRespond ? i3 === Jt ? --this.toRespond : this.toRespond : 0;
      r3[n3] = e4, 0 === o3 && (this.resultSelector ? this._tryResultSelector(r3) : this.destination.next(r3.slice()));
    }, e3.prototype._tryResultSelector = function(t10) {
      var e4;
      try {
        e4 = this.resultSelector.apply(this, t10);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.destination.next(e4);
    }, e3;
  }(Ut);
  function $t(t9, e3) {
    if (null != t9) {
      if (function(t10) {
        return t10 && "function" == typeof t10[x];
      }(t9))
        return function(t10, e4) {
          return new E(function(n3) {
            var r3 = new d();
            return r3.add(e4.schedule(function() {
              var i3 = t10[x]();
              r3.add(i3.subscribe({ next: function(t11) {
                r3.add(e4.schedule(function() {
                  return n3.next(t11);
                }));
              }, error: function(t11) {
                r3.add(e4.schedule(function() {
                  return n3.error(t11);
                }));
              }, complete: function() {
                r3.add(e4.schedule(function() {
                  return n3.complete();
                }));
              } }));
            })), r3;
          });
        }(t9, e3);
      if (Ht(t9))
        return function(t10, e4) {
          return new E(function(n3) {
            var r3 = new d();
            return r3.add(e4.schedule(function() {
              return t10.then(function(t11) {
                r3.add(e4.schedule(function() {
                  n3.next(t11), r3.add(e4.schedule(function() {
                    return n3.complete();
                  }));
                }));
              }, function(t11) {
                r3.add(e4.schedule(function() {
                  return n3.error(t11);
                }));
              });
            })), r3;
          });
        }(t9, e3);
      if (Lt(t9))
        return tt(t9, e3);
      if (function(t10) {
        return t10 && "function" == typeof t10[qt];
      }(t9) || "string" == typeof t9)
        return function(t10, e4) {
          if (!t10)
            throw new Error("Iterable cannot be null");
          return new E(function(n3) {
            var r3, i3 = new d();
            return i3.add(function() {
              r3 && "function" == typeof r3.return && r3.return();
            }), i3.add(e4.schedule(function() {
              r3 = t10[qt](), i3.add(e4.schedule(function() {
                if (!n3.closed) {
                  var t11, e5;
                  try {
                    var i4 = r3.next();
                    t11 = i4.value, e5 = i4.done;
                  } catch (t12) {
                    return void n3.error(t12);
                  }
                  e5 ? n3.complete() : (n3.next(t11), this.schedule());
                }
              }));
            })), i3;
          });
        }(t9, e3);
    }
    throw new TypeError((null !== t9 && typeof t9 || t9) + " is not observable");
  }
  function te(t9, e3) {
    return e3 ? $t(t9, e3) : t9 instanceof E ? t9 : new E(Kt(t9));
  }
  var ee = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this) || this;
      return n3.parent = e4, n3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.parent.notifyNext(t10);
    }, e3.prototype._error = function(t10) {
      this.parent.notifyError(t10), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.parent.notifyComplete(), this.unsubscribe();
    }, e3;
  }(y);
  var ne = function(t9) {
    function e3() {
      return null !== t9 && t9.apply(this, arguments) || this;
    }
    return o(e3, t9), e3.prototype.notifyNext = function(t10) {
      this.destination.next(t10);
    }, e3.prototype.notifyError = function(t10) {
      this.destination.error(t10);
    }, e3.prototype.notifyComplete = function() {
      this.destination.complete();
    }, e3;
  }(y);
  function re2(t9, e3) {
    if (!e3.closed) {
      if (t9 instanceof E)
        return t9.subscribe(e3);
      var n3;
      try {
        n3 = Kt(t9)(e3);
      } catch (t10) {
        e3.error(t10);
      }
      return n3;
    }
  }
  function ie(t9, e3, n3) {
    return void 0 === n3 && (n3 = Number.POSITIVE_INFINITY), "function" == typeof e3 ? function(r3) {
      return r3.pipe(ie(function(n4, r4) {
        return te(t9(n4, r4)).pipe(kt(function(t10, i3) {
          return e3(n4, t10, r4, i3);
        }));
      }, n3));
    } : ("number" == typeof e3 && (n3 = e3), function(e4) {
      return e4.lift(new oe(t9, n3));
    });
  }
  var oe = function() {
    function t9(t10, e3) {
      void 0 === e3 && (e3 = Number.POSITIVE_INFINITY), this.project = t10, this.concurrent = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new se(t10, this.project, this.concurrent));
    }, t9;
  }();
  var se = function(t9) {
    function e3(e4, n3, r3) {
      void 0 === r3 && (r3 = Number.POSITIVE_INFINITY);
      var i3 = t9.call(this, e4) || this;
      return i3.project = n3, i3.concurrent = r3, i3.hasCompleted = false, i3.buffer = [], i3.active = 0, i3.index = 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.active < this.concurrent ? this._tryNext(t10) : this.buffer.push(t10);
    }, e3.prototype._tryNext = function(t10) {
      var e4, n3 = this.index++;
      try {
        e4 = this.project(t10, n3);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.active++, this._innerSub(e4);
    }, e3.prototype._innerSub = function(t10) {
      var e4 = new ee(this), n3 = this.destination;
      n3.add(e4);
      var r3 = re2(t10, e4);
      r3 !== e4 && n3.add(r3);
    }, e3.prototype._complete = function() {
      this.hasCompleted = true, 0 === this.active && 0 === this.buffer.length && this.destination.complete(), this.unsubscribe();
    }, e3.prototype.notifyNext = function(t10) {
      this.destination.next(t10);
    }, e3.prototype.notifyComplete = function() {
      var t10 = this.buffer;
      this.active--, t10.length > 0 ? this._next(t10.shift()) : 0 === this.active && this.hasCompleted && this.destination.complete();
    }, e3;
  }(ne);
  var ue = ie;
  function ce(t9) {
    return void 0 === t9 && (t9 = Number.POSITIVE_INFINITY), ie(_, t9);
  }
  function ae() {
    return ce(1);
  }
  function he() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return ae()(nt.apply(void 0, t9));
  }
  function le(t9) {
    return new E(function(e3) {
      var n3;
      try {
        n3 = t9();
      } catch (t10) {
        return void e3.error(t10);
      }
      return (n3 ? te(n3) : J()).subscribe(e3);
    });
  }
  function fe(t9, e3) {
    return new E(function(n3) {
      var r3 = t9.length;
      if (0 !== r3)
        for (var i3 = new Array(r3), o3 = 0, s3 = 0, u3 = function(u4) {
          var c4 = te(t9[u4]), a3 = false;
          n3.add(c4.subscribe({ next: function(t10) {
            a3 || (a3 = true, s3++), i3[u4] = t10;
          }, error: function(t10) {
            return n3.error(t10);
          }, complete: function() {
            ++o3 !== r3 && a3 || (s3 === r3 && n3.next(e3 ? e3.reduce(function(t10, e4, n4) {
              return t10[e4] = i3[n4], t10;
            }, {}) : i3), n3.complete());
          } }));
        }, c3 = 0; c3 < r3; c3++)
          u3(c3);
      else
        n3.complete();
    });
  }
  function pe(t9, e3, n3, r3, i3) {
    var o3;
    if (function(t10) {
      return t10 && "function" == typeof t10.addEventListener && "function" == typeof t10.removeEventListener;
    }(t9)) {
      var s3 = t9;
      t9.addEventListener(e3, n3, i3), o3 = function() {
        return s3.removeEventListener(e3, n3, i3);
      };
    } else if (function(t10) {
      return t10 && "function" == typeof t10.on && "function" == typeof t10.off;
    }(t9)) {
      var u3 = t9;
      t9.on(e3, n3), o3 = function() {
        return u3.off(e3, n3);
      };
    } else if (function(t10) {
      return t10 && "function" == typeof t10.addListener && "function" == typeof t10.removeListener;
    }(t9)) {
      var c3 = t9;
      t9.addListener(e3, n3), o3 = function() {
        return c3.removeListener(e3, n3);
      };
    } else {
      if (!t9 || !t9.length)
        throw new TypeError("Invalid event target");
      for (var a3 = 0, h3 = t9.length; a3 < h3; a3++)
        pe(t9[a3], e3, n3, r3, i3);
    }
    r3.add(o3);
  }
  function de(t9) {
    var e3 = t9.subscriber, n3 = t9.condition;
    if (!e3.closed) {
      if (t9.needIterate)
        try {
          t9.state = t9.iterate(t9.state);
        } catch (t10) {
          return void e3.error(t10);
        }
      else
        t9.needIterate = true;
      if (n3) {
        var r3 = void 0;
        try {
          r3 = n3(t9.state);
        } catch (t10) {
          return void e3.error(t10);
        }
        if (!r3)
          return void e3.complete();
        if (e3.closed)
          return;
      }
      var i3;
      try {
        i3 = t9.resultSelector(t9.state);
      } catch (t10) {
        return void e3.error(t10);
      }
      if (!e3.closed && (e3.next(i3), !e3.closed))
        return this.schedule(t9);
    }
  }
  function be(t9) {
    return !l(t9) && t9 - parseFloat(t9) + 1 >= 0;
  }
  function ve(t9) {
    var e3 = t9.subscriber, n3 = t9.counter, r3 = t9.period;
    e3.next(n3), this.schedule({ subscriber: e3, counter: n3 + 1, period: r3 }, r3);
  }
  function ye() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = Number.POSITIVE_INFINITY, r3 = null, i3 = t9[t9.length - 1];
    return X(i3) ? (r3 = t9.pop(), t9.length > 1 && "number" == typeof t9[t9.length - 1] && (n3 = t9.pop())) : "number" == typeof i3 && (n3 = t9.pop()), null === r3 && 1 === t9.length && t9[0] instanceof E ? t9[0] : ce(n3)(et(t9, r3));
  }
  var me = new E(jt);
  function we(t9) {
    var e3 = t9.keys, n3 = t9.index, r3 = t9.subscriber, i3 = t9.subscription, o3 = t9.obj;
    if (!r3.closed)
      if (n3 < e3.length) {
        var s3 = e3[n3];
        r3.next([s3, o3[s3]]), i3.add(this.schedule({ keys: e3, index: n3 + 1, subscriber: r3, subscription: i3, obj: o3 }));
      } else
        r3.complete();
  }
  function xe(t9, e3) {
    function n3() {
      return !n3.pred.apply(n3.thisArg, arguments);
    }
    return n3.pred = t9, n3.thisArg = e3, n3;
  }
  function _e(t9, e3) {
    return function(n3) {
      return n3.lift(new ge(t9, e3));
    };
  }
  var ge = function() {
    function t9(t10, e3) {
      this.predicate = t10, this.thisArg = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Se(t10, this.predicate, this.thisArg));
    }, t9;
  }();
  var Se = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.predicate = n3, i3.thisArg = r3, i3.count = 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4;
      try {
        e4 = this.predicate.call(this.thisArg, t10, this.count++);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      e4 && this.destination.next(t10);
    }, e3;
  }(y);
  function Ee() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    if (1 === t9.length) {
      if (!l(t9[0]))
        return t9[0];
      t9 = t9[0];
    }
    return et(t9, void 0).lift(new Ce());
  }
  var Ce = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Ne(t10));
    }, t9;
  }();
  var Ne = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this, e4) || this;
      return n3.hasFirst = false, n3.observables = [], n3.subscriptions = [], n3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.observables.push(t10);
    }, e3.prototype._complete = function() {
      var t10 = this.observables, e4 = t10.length;
      if (0 === e4)
        this.destination.complete();
      else {
        for (var n3 = 0; n3 < e4 && !this.hasFirst; n3++) {
          var r3 = Qt(this, t10[n3], void 0, n3);
          this.subscriptions && this.subscriptions.push(r3), this.add(r3);
        }
        this.observables = null;
      }
    }, e3.prototype.notifyNext = function(t10, e4, n3) {
      if (!this.hasFirst) {
        this.hasFirst = true;
        for (var r3 = 0; r3 < this.subscriptions.length; r3++)
          if (r3 !== n3) {
            var i3 = this.subscriptions[r3];
            i3.unsubscribe(), this.remove(i3);
          }
        this.subscriptions = null;
      }
      this.destination.next(e4);
    }, e3;
  }(Ut);
  function Te(t9) {
    var e3 = t9.start, n3 = t9.index, r3 = t9.count, i3 = t9.subscriber;
    n3 >= r3 ? i3.complete() : (i3.next(e3), i3.closed || (t9.index = n3 + 1, t9.start = e3 + 1, this.schedule(t9)));
  }
  function Ie(t9, e3, n3) {
    void 0 === t9 && (t9 = 0);
    var r3 = -1;
    return be(e3) ? r3 = Number(e3) < 1 ? 1 : Number(e3) : X(e3) && (n3 = e3), X(n3) || (n3 = St), new E(function(e4) {
      var i3 = be(t9) ? t9 : +t9 - n3.now();
      return n3.schedule(Ve, i3, { index: 0, period: r3, subscriber: e4 });
    });
  }
  function Ve(t9) {
    var e3 = t9.index, n3 = t9.period, r3 = t9.subscriber;
    if (r3.next(e3), !r3.closed) {
      if (-1 === n3)
        return r3.complete();
      t9.index = e3 + 1, this.schedule(t9, n3);
    }
  }
  function je() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = t9[t9.length - 1];
    return "function" == typeof n3 && t9.pop(), et(t9, void 0).lift(new Oe(n3));
  }
  var Oe = function() {
    function t9(t10) {
      this.resultSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Pe(t10, this.resultSelector));
    }, t9;
  }();
  var Pe = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.resultSelector = n3, i3.iterators = [], i3.active = 0, i3.resultSelector = "function" == typeof n3 ? n3 : void 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this.iterators;
      l(t10) ? e4.push(new ke(t10)) : "function" == typeof t10[qt] ? e4.push(new Ae(t10[qt]())) : e4.push(new Fe(this.destination, this, t10));
    }, e3.prototype._complete = function() {
      var t10 = this.iterators, e4 = t10.length;
      if (this.unsubscribe(), 0 !== e4) {
        this.active = e4;
        for (var n3 = 0; n3 < e4; n3++) {
          var r3 = t10[n3];
          if (r3.stillUnsubscribed)
            this.destination.add(r3.subscribe());
          else
            this.active--;
        }
      } else
        this.destination.complete();
    }, e3.prototype.notifyInactive = function() {
      this.active--, 0 === this.active && this.destination.complete();
    }, e3.prototype.checkIterators = function() {
      for (var t10 = this.iterators, e4 = t10.length, n3 = this.destination, r3 = 0; r3 < e4; r3++) {
        if ("function" == typeof (s3 = t10[r3]).hasValue && !s3.hasValue())
          return;
      }
      var i3 = false, o3 = [];
      for (r3 = 0; r3 < e4; r3++) {
        var s3, u3 = (s3 = t10[r3]).next();
        if (s3.hasCompleted() && (i3 = true), u3.done)
          return void n3.complete();
        o3.push(u3.value);
      }
      this.resultSelector ? this._tryresultSelector(o3) : n3.next(o3), i3 && n3.complete();
    }, e3.prototype._tryresultSelector = function(t10) {
      var e4;
      try {
        e4 = this.resultSelector.apply(this, t10);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.destination.next(e4);
    }, e3;
  }(y);
  var Ae = function() {
    function t9(t10) {
      this.iterator = t10, this.nextResult = t10.next();
    }
    return t9.prototype.hasValue = function() {
      return true;
    }, t9.prototype.next = function() {
      var t10 = this.nextResult;
      return this.nextResult = this.iterator.next(), t10;
    }, t9.prototype.hasCompleted = function() {
      var t10 = this.nextResult;
      return Boolean(t10 && t10.done);
    }, t9;
  }();
  var ke = function() {
    function t9(t10) {
      this.array = t10, this.index = 0, this.length = 0, this.length = t10.length;
    }
    return t9.prototype[qt] = function() {
      return this;
    }, t9.prototype.next = function(t10) {
      var e3 = this.index++, n3 = this.array;
      return e3 < this.length ? { value: n3[e3], done: false } : { value: null, done: true };
    }, t9.prototype.hasValue = function() {
      return this.array.length > this.index;
    }, t9.prototype.hasCompleted = function() {
      return this.array.length === this.index;
    }, t9;
  }();
  var Fe = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.parent = n3, i3.observable = r3, i3.stillUnsubscribed = true, i3.buffer = [], i3.isComplete = false, i3;
    }
    return o(e3, t9), e3.prototype[qt] = function() {
      return this;
    }, e3.prototype.next = function() {
      var t10 = this.buffer;
      return 0 === t10.length && this.isComplete ? { value: null, done: true } : { value: t10.shift(), done: false };
    }, e3.prototype.hasValue = function() {
      return this.buffer.length > 0;
    }, e3.prototype.hasCompleted = function() {
      return 0 === this.buffer.length && this.isComplete;
    }, e3.prototype.notifyComplete = function() {
      this.buffer.length > 0 ? (this.isComplete = true, this.parent.notifyInactive()) : this.destination.complete();
    }, e3.prototype.notifyNext = function(t10) {
      this.buffer.push(t10), this.parent.checkIterators();
    }, e3.prototype.subscribe = function() {
      return re2(this.observable, new ee(this));
    }, e3;
  }(ne);
  var Re = Object.freeze({ __proto__: null, Observable: E, ConnectableObservable: k, GroupedObservable: z, observable: x, Subject: V, BehaviorSubject: U, ReplaySubject: at, AsyncSubject: lt, asap: _t, asapScheduler: xt, async: St, asyncScheduler: gt, queue: K, queueScheduler: H, animationFrame: Tt, animationFrameScheduler: Nt, VirtualTimeScheduler: It, VirtualAction: Vt, Scheduler: q, Subscription: d, Subscriber: y, Notification: ot, get NotificationKind() {
    return Z;
  }, pipe: g, noop: jt, identity: _, isObservable: function(t9) {
    return !!t9 && (t9 instanceof E || "function" == typeof t9.lift && "function" == typeof t9.subscribe);
  }, ArgumentOutOfRangeError: Ot, EmptyError: Pt, ObjectUnsubscribedError: N, UnsubscriptionError: p, TimeoutError: At, bindCallback: function t2(e3, n3, r3) {
    if (n3) {
      if (!X(n3))
        return function() {
          for (var i3 = [], o3 = 0; o3 < arguments.length; o3++)
            i3[o3] = arguments[o3];
          return t2(e3, r3).apply(void 0, i3).pipe(kt(function(t9) {
            return l(t9) ? n3.apply(void 0, t9) : n3(t9);
          }));
        };
      r3 = n3;
    }
    return function() {
      for (var t9 = [], n4 = 0; n4 < arguments.length; n4++)
        t9[n4] = arguments[n4];
      var i3, o3 = this, s3 = { context: o3, subject: i3, callbackFunc: e3, scheduler: r3 };
      return new E(function(n5) {
        if (r3) {
          var u3 = { args: t9, subscriber: n5, params: s3 };
          return r3.schedule(Mt, 0, u3);
        }
        if (!i3) {
          i3 = new lt();
          try {
            e3.apply(o3, t9.concat([function() {
              for (var t10 = [], e4 = 0; e4 < arguments.length; e4++)
                t10[e4] = arguments[e4];
              i3.next(t10.length <= 1 ? t10[0] : t10), i3.complete();
            }]));
          } catch (t10) {
            w(i3) ? i3.error(t10) : console.warn(t10);
          }
        }
        return i3.subscribe(n5);
      });
    };
  }, bindNodeCallback: function t3(e3, n3, r3) {
    if (n3) {
      if (!X(n3))
        return function() {
          for (var i3 = [], o3 = 0; o3 < arguments.length; o3++)
            i3[o3] = arguments[o3];
          return t3(e3, r3).apply(void 0, i3).pipe(kt(function(t9) {
            return l(t9) ? n3.apply(void 0, t9) : n3(t9);
          }));
        };
      r3 = n3;
    }
    return function() {
      for (var t9 = [], n4 = 0; n4 < arguments.length; n4++)
        t9[n4] = arguments[n4];
      var i3 = { subject: void 0, args: t9, callbackFunc: e3, scheduler: r3, context: this };
      return new E(function(n5) {
        var o3 = i3.context, s3 = i3.subject;
        if (r3)
          return r3.schedule(Wt, 0, { params: i3, subscriber: n5, context: o3 });
        if (!s3) {
          s3 = i3.subject = new lt();
          try {
            e3.apply(o3, t9.concat([function() {
              for (var t10 = [], e4 = 0; e4 < arguments.length; e4++)
                t10[e4] = arguments[e4];
              var n6 = t10.shift();
              n6 ? s3.error(n6) : (s3.next(t10.length <= 1 ? t10[0] : t10), s3.complete());
            }]));
          } catch (t10) {
            w(s3) ? s3.error(t10) : console.warn(t10);
          }
        }
        return s3.subscribe(n5);
      });
    };
  }, combineLatest: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = void 0, r3 = void 0;
    return X(t9[t9.length - 1]) && (r3 = t9.pop()), "function" == typeof t9[t9.length - 1] && (n3 = t9.pop()), 1 === t9.length && l(t9[0]) && (t9 = t9[0]), et(t9, r3).lift(new Xt(n3));
  }, concat: he, defer: le, empty: J, forkJoin: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    if (1 === t9.length) {
      var n3 = t9[0];
      if (l(n3))
        return fe(n3, null);
      if (f(n3) && Object.getPrototypeOf(n3) === Object.prototype) {
        var r3 = Object.keys(n3);
        return fe(r3.map(function(t10) {
          return n3[t10];
        }), r3);
      }
    }
    if ("function" == typeof t9[t9.length - 1]) {
      var i3 = t9.pop();
      return fe(t9 = 1 === t9.length && l(t9[0]) ? t9[0] : t9, null).pipe(kt(function(t10) {
        return i3.apply(void 0, t10);
      }));
    }
    return fe(t9, null);
  }, from: te, fromEvent: function t4(e3, n3, r3, i3) {
    return s(r3) && (i3 = r3, r3 = void 0), i3 ? t4(e3, n3, r3).pipe(kt(function(t9) {
      return l(t9) ? i3.apply(void 0, t9) : i3(t9);
    })) : new E(function(t9) {
      pe(e3, n3, function(e4) {
        arguments.length > 1 ? t9.next(Array.prototype.slice.call(arguments)) : t9.next(e4);
      }, t9, r3);
    });
  }, fromEventPattern: function t5(e3, n3, r3) {
    return r3 ? t5(e3, n3).pipe(kt(function(t9) {
      return l(t9) ? r3.apply(void 0, t9) : r3(t9);
    })) : new E(function(t9) {
      var r4, i3 = function() {
        for (var e4 = [], n4 = 0; n4 < arguments.length; n4++)
          e4[n4] = arguments[n4];
        return t9.next(1 === e4.length ? e4[0] : e4);
      };
      try {
        r4 = e3(i3);
      } catch (e4) {
        return void t9.error(e4);
      }
      if (s(n3))
        return function() {
          return n3(i3, r4);
        };
    });
  }, generate: function(t9, e3, n3, r3, i3) {
    var o3, s3;
    if (1 == arguments.length) {
      var u3 = t9;
      s3 = u3.initialState, e3 = u3.condition, n3 = u3.iterate, o3 = u3.resultSelector || _, i3 = u3.scheduler;
    } else
      void 0 === r3 || X(r3) ? (s3 = t9, o3 = _, i3 = r3) : (s3 = t9, o3 = r3);
    return new E(function(t10) {
      var r4 = s3;
      if (i3)
        return i3.schedule(de, 0, { subscriber: t10, iterate: n3, condition: e3, resultSelector: o3, state: r4 });
      for (; ; ) {
        if (e3) {
          var u4 = void 0;
          try {
            u4 = e3(r4);
          } catch (e4) {
            return void t10.error(e4);
          }
          if (!u4) {
            t10.complete();
            break;
          }
        }
        var c3 = void 0;
        try {
          c3 = o3(r4);
        } catch (e4) {
          return void t10.error(e4);
        }
        if (t10.next(c3), t10.closed)
          break;
        try {
          r4 = n3(r4);
        } catch (e4) {
          return void t10.error(e4);
        }
      }
    });
  }, iif: function(t9, e3, n3) {
    return void 0 === e3 && (e3 = Q), void 0 === n3 && (n3 = Q), le(function() {
      return t9() ? e3 : n3;
    });
  }, interval: function(t9, e3) {
    return void 0 === t9 && (t9 = 0), void 0 === e3 && (e3 = St), (!be(t9) || t9 < 0) && (t9 = 0), e3 && "function" == typeof e3.schedule || (e3 = St), new E(function(n3) {
      return n3.add(e3.schedule(ve, t9, { subscriber: n3, counter: 0, period: t9 })), n3;
    });
  }, merge: ye, never: function() {
    return me;
  }, of: nt, onErrorResumeNext: function t6() {
    for (var e3 = [], n3 = 0; n3 < arguments.length; n3++)
      e3[n3] = arguments[n3];
    if (0 === e3.length)
      return Q;
    var r3 = e3[0], i3 = e3.slice(1);
    return 1 === e3.length && l(r3) ? t6.apply(void 0, r3) : new E(function(e4) {
      var n4 = function() {
        return e4.add(t6.apply(void 0, i3).subscribe(e4));
      };
      return te(r3).subscribe({ next: function(t9) {
        e4.next(t9);
      }, error: n4, complete: n4 });
    });
  }, pairs: function(t9, e3) {
    return new E(e3 ? function(n3) {
      var r3 = Object.keys(t9), i3 = new d();
      return i3.add(e3.schedule(we, 0, { keys: r3, index: 0, subscriber: n3, subscription: i3, obj: t9 })), i3;
    } : function(e4) {
      for (var n3 = Object.keys(t9), r3 = 0; r3 < n3.length && !e4.closed; r3++) {
        var i3 = n3[r3];
        t9.hasOwnProperty(i3) && e4.next([i3, t9[i3]]);
      }
      e4.complete();
    });
  }, partition: function(t9, e3, n3) {
    return [_e(e3, n3)(new E(Kt(t9))), _e(xe(e3, n3))(new E(Kt(t9)))];
  }, race: Ee, range: function(t9, e3, n3) {
    return void 0 === t9 && (t9 = 0), new E(function(r3) {
      void 0 === e3 && (e3 = t9, t9 = 0);
      var i3 = 0, o3 = t9;
      if (n3)
        return n3.schedule(Te, 0, { index: i3, count: e3, start: t9, subscriber: r3 });
      for (; ; ) {
        if (i3++ >= e3) {
          r3.complete();
          break;
        }
        if (r3.next(o3++), r3.closed)
          break;
      }
    });
  }, throwError: rt, timer: Ie, using: function(t9, e3) {
    return new E(function(n3) {
      var r3, i3;
      try {
        r3 = t9();
      } catch (t10) {
        return void n3.error(t10);
      }
      try {
        i3 = e3(r3);
      } catch (t10) {
        return void n3.error(t10);
      }
      var o3 = (i3 ? te(i3) : Q).subscribe(n3);
      return function() {
        o3.unsubscribe(), r3 && r3.unsubscribe();
      };
    });
  }, zip: je, scheduled: $t, EMPTY: Q, NEVER: me, config: c });
  var Me = n(Re);
  function De(t9) {
    return function(e3) {
      return e3.lift(new We(t9));
    };
  }
  var We = function() {
    function t9(t10) {
      this.durationSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ze(t10, this.durationSelector));
    }, t9;
  }();
  var ze = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.durationSelector = n3, r3.hasValue = false, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      if (this.value = t10, this.hasValue = true, !this.throttled) {
        var e4 = void 0;
        try {
          e4 = (0, this.durationSelector)(t10);
        } catch (t11) {
          return this.destination.error(t11);
        }
        var n3 = re2(e4, new ee(this));
        !n3 || n3.closed ? this.clearThrottle() : this.add(this.throttled = n3);
      }
    }, e3.prototype.clearThrottle = function() {
      var t10 = this, e4 = t10.value, n3 = t10.hasValue, r3 = t10.throttled;
      r3 && (this.remove(r3), this.throttled = void 0, r3.unsubscribe()), n3 && (this.value = void 0, this.hasValue = false, this.destination.next(e4));
    }, e3.prototype.notifyNext = function() {
      this.clearThrottle();
    }, e3.prototype.notifyComplete = function() {
      this.clearThrottle();
    }, e3;
  }(ne);
  var Be = function() {
    function t9(t10) {
      this.closingNotifier = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Ue(t10, this.closingNotifier));
    }, t9;
  }();
  var Ue = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.buffer = [], r3.add(re2(n3, new ee(r3))), r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.buffer.push(t10);
    }, e3.prototype.notifyNext = function() {
      var t10 = this.buffer;
      this.buffer = [], this.destination.next(t10);
    }, e3;
  }(ne);
  var Ye = function() {
    function t9(t10, e3) {
      this.bufferSize = t10, this.startBufferEvery = e3, this.subscriberClass = e3 && t10 !== e3 ? qe : Ge;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new this.subscriberClass(t10, this.bufferSize, this.startBufferEvery));
    }, t9;
  }();
  var Ge = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.bufferSize = n3, r3.buffer = [], r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this.buffer;
      e4.push(t10), e4.length == this.bufferSize && (this.destination.next(e4), this.buffer = []);
    }, e3.prototype._complete = function() {
      var e4 = this.buffer;
      e4.length > 0 && this.destination.next(e4), t9.prototype._complete.call(this);
    }, e3;
  }(y);
  var qe = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.bufferSize = n3, i3.startBufferEvery = r3, i3.buffers = [], i3.count = 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this, n3 = e4.bufferSize, r3 = e4.startBufferEvery, i3 = e4.buffers, o3 = e4.count;
      this.count++, o3 % r3 == 0 && i3.push([]);
      for (var s3 = i3.length; s3--; ) {
        var u3 = i3[s3];
        u3.push(t10), u3.length === n3 && (i3.splice(s3, 1), this.destination.next(u3));
      }
    }, e3.prototype._complete = function() {
      for (var e4 = this.buffers, n3 = this.destination; e4.length > 0; ) {
        var r3 = e4.shift();
        r3.length > 0 && n3.next(r3);
      }
      t9.prototype._complete.call(this);
    }, e3;
  }(y);
  var Le = function() {
    function t9(t10, e3, n3, r3) {
      this.bufferTimeSpan = t10, this.bufferCreationInterval = e3, this.maxBufferSize = n3, this.scheduler = r3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Ke(t10, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
    }, t9;
  }();
  var He = function() {
    return function() {
      this.buffer = [];
    };
  }();
  var Ke = function(t9) {
    function e3(e4, n3, r3, i3, o3) {
      var s3 = t9.call(this, e4) || this;
      s3.bufferTimeSpan = n3, s3.bufferCreationInterval = r3, s3.maxBufferSize = i3, s3.scheduler = o3, s3.contexts = [];
      var u3 = s3.openContext();
      if (s3.timespanOnly = null == r3 || r3 < 0, s3.timespanOnly) {
        var c3 = { subscriber: s3, context: u3, bufferTimeSpan: n3 };
        s3.add(u3.closeAction = o3.schedule(Qe, n3, c3));
      } else {
        var a3 = { subscriber: s3, context: u3 }, h3 = { bufferTimeSpan: n3, bufferCreationInterval: r3, subscriber: s3, scheduler: o3 };
        s3.add(u3.closeAction = o3.schedule(Xe, n3, a3)), s3.add(o3.schedule(Je, r3, h3));
      }
      return s3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      for (var e4, n3 = this.contexts, r3 = n3.length, i3 = 0; i3 < r3; i3++) {
        var o3 = n3[i3], s3 = o3.buffer;
        s3.push(t10), s3.length == this.maxBufferSize && (e4 = o3);
      }
      e4 && this.onBufferFull(e4);
    }, e3.prototype._error = function(e4) {
      this.contexts.length = 0, t9.prototype._error.call(this, e4);
    }, e3.prototype._complete = function() {
      for (var e4 = this.contexts, n3 = this.destination; e4.length > 0; ) {
        var r3 = e4.shift();
        n3.next(r3.buffer);
      }
      t9.prototype._complete.call(this);
    }, e3.prototype._unsubscribe = function() {
      this.contexts = null;
    }, e3.prototype.onBufferFull = function(t10) {
      this.closeContext(t10);
      var e4 = t10.closeAction;
      if (e4.unsubscribe(), this.remove(e4), !this.closed && this.timespanOnly) {
        t10 = this.openContext();
        var n3 = this.bufferTimeSpan, r3 = { subscriber: this, context: t10, bufferTimeSpan: n3 };
        this.add(t10.closeAction = this.scheduler.schedule(Qe, n3, r3));
      }
    }, e3.prototype.openContext = function() {
      var t10 = new He();
      return this.contexts.push(t10), t10;
    }, e3.prototype.closeContext = function(t10) {
      this.destination.next(t10.buffer);
      var e4 = this.contexts;
      (e4 ? e4.indexOf(t10) : -1) >= 0 && e4.splice(e4.indexOf(t10), 1);
    }, e3;
  }(y);
  function Qe(t9) {
    var e3 = t9.subscriber, n3 = t9.context;
    n3 && e3.closeContext(n3), e3.closed || (t9.context = e3.openContext(), t9.context.closeAction = this.schedule(t9, t9.bufferTimeSpan));
  }
  function Je(t9) {
    var e3 = t9.bufferCreationInterval, n3 = t9.bufferTimeSpan, r3 = t9.subscriber, i3 = t9.scheduler, o3 = r3.openContext();
    r3.closed || (r3.add(o3.closeAction = i3.schedule(Xe, n3, { subscriber: r3, context: o3 })), this.schedule(t9, e3));
  }
  function Xe(t9) {
    var e3 = t9.subscriber, n3 = t9.context;
    e3.closeContext(n3);
  }
  var Ze = function() {
    function t9(t10, e3) {
      this.openings = t10, this.closingSelector = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new $e(t10, this.openings, this.closingSelector));
    }, t9;
  }();
  var $e = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.closingSelector = r3, i3.contexts = [], i3.add(Qt(i3, n3)), i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      for (var e4 = this.contexts, n3 = e4.length, r3 = 0; r3 < n3; r3++)
        e4[r3].buffer.push(t10);
    }, e3.prototype._error = function(e4) {
      for (var n3 = this.contexts; n3.length > 0; ) {
        var r3 = n3.shift();
        r3.subscription.unsubscribe(), r3.buffer = null, r3.subscription = null;
      }
      this.contexts = null, t9.prototype._error.call(this, e4);
    }, e3.prototype._complete = function() {
      for (var e4 = this.contexts; e4.length > 0; ) {
        var n3 = e4.shift();
        this.destination.next(n3.buffer), n3.subscription.unsubscribe(), n3.buffer = null, n3.subscription = null;
      }
      this.contexts = null, t9.prototype._complete.call(this);
    }, e3.prototype.notifyNext = function(t10, e4) {
      t10 ? this.closeBuffer(t10) : this.openBuffer(e4);
    }, e3.prototype.notifyComplete = function(t10) {
      this.closeBuffer(t10.context);
    }, e3.prototype.openBuffer = function(t10) {
      try {
        var e4 = this.closingSelector.call(this, t10);
        e4 && this.trySubscribe(e4);
      } catch (t11) {
        this._error(t11);
      }
    }, e3.prototype.closeBuffer = function(t10) {
      var e4 = this.contexts;
      if (e4 && t10) {
        var n3 = t10.buffer, r3 = t10.subscription;
        this.destination.next(n3), e4.splice(e4.indexOf(t10), 1), this.remove(r3), r3.unsubscribe();
      }
    }, e3.prototype.trySubscribe = function(t10) {
      var e4 = this.contexts, n3 = new d(), r3 = { buffer: [], subscription: n3 };
      e4.push(r3);
      var i3 = Qt(this, t10, r3);
      !i3 || i3.closed ? this.closeBuffer(r3) : (i3.context = r3, this.add(i3), n3.add(i3));
    }, e3;
  }(Ut);
  var tn = function() {
    function t9(t10) {
      this.closingSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new en(t10, this.closingSelector));
    }, t9;
  }();
  var en = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.closingSelector = n3, r3.subscribing = false, r3.openBuffer(), r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.buffer.push(t10);
    }, e3.prototype._complete = function() {
      var e4 = this.buffer;
      e4 && this.destination.next(e4), t9.prototype._complete.call(this);
    }, e3.prototype._unsubscribe = function() {
      this.buffer = void 0, this.subscribing = false;
    }, e3.prototype.notifyNext = function() {
      this.openBuffer();
    }, e3.prototype.notifyComplete = function() {
      this.subscribing ? this.complete() : this.openBuffer();
    }, e3.prototype.openBuffer = function() {
      var t10 = this.closingSubscription;
      t10 && (this.remove(t10), t10.unsubscribe());
      var e4, n3 = this.buffer;
      this.buffer && this.destination.next(n3), this.buffer = [];
      try {
        e4 = (0, this.closingSelector)();
      } catch (t11) {
        return this.error(t11);
      }
      t10 = new d(), this.closingSubscription = t10, this.add(t10), this.subscribing = true, t10.add(re2(e4, new ee(this))), this.subscribing = false;
    }, e3;
  }(ne);
  var nn = function() {
    function t9(t10) {
      this.selector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new rn(t10, this.selector, this.caught));
    }, t9;
  }();
  var rn = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.selector = n3, i3.caught = r3, i3;
    }
    return o(e3, t9), e3.prototype.error = function(e4) {
      if (!this.isStopped) {
        var n3 = void 0;
        try {
          n3 = this.selector(e4, this.caught);
        } catch (e5) {
          return void t9.prototype.error.call(this, e5);
        }
        this._unsubscribeAndRecycle();
        var r3 = new ee(this);
        this.add(r3);
        var i3 = re2(n3, r3);
        i3 !== r3 && this.add(i3);
      }
    }, e3;
  }(ne);
  function on(t9, e3) {
    return ie(t9, e3, 1);
  }
  var sn = function() {
    function t9(t10, e3) {
      this.predicate = t10, this.source = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new un(t10, this.predicate, this.source));
    }, t9;
  }();
  var un = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.predicate = n3, i3.source = r3, i3.count = 0, i3.index = 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.predicate ? this._tryPredicate(t10) : this.count++;
    }, e3.prototype._tryPredicate = function(t10) {
      var e4;
      try {
        e4 = this.predicate(t10, this.index++, this.source);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      e4 && this.count++;
    }, e3.prototype._complete = function() {
      this.destination.next(this.count), this.destination.complete();
    }, e3;
  }(y);
  var cn = function() {
    function t9(t10) {
      this.durationSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new an(t10, this.durationSelector));
    }, t9;
  }();
  var an = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.durationSelector = n3, r3.hasValue = false, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      try {
        var e4 = this.durationSelector.call(this, t10);
        e4 && this._tryNext(t10, e4);
      } catch (t11) {
        this.destination.error(t11);
      }
    }, e3.prototype._complete = function() {
      this.emitValue(), this.destination.complete();
    }, e3.prototype._tryNext = function(t10, e4) {
      var n3 = this.durationSubscription;
      this.value = t10, this.hasValue = true, n3 && (n3.unsubscribe(), this.remove(n3)), (n3 = re2(e4, new ee(this))) && !n3.closed && this.add(this.durationSubscription = n3);
    }, e3.prototype.notifyNext = function() {
      this.emitValue();
    }, e3.prototype.notifyComplete = function() {
      this.emitValue();
    }, e3.prototype.emitValue = function() {
      if (this.hasValue) {
        var e4 = this.value, n3 = this.durationSubscription;
        n3 && (this.durationSubscription = void 0, n3.unsubscribe(), this.remove(n3)), this.value = void 0, this.hasValue = false, t9.prototype._next.call(this, e4);
      }
    }, e3;
  }(ne);
  var hn = function() {
    function t9(t10, e3) {
      this.dueTime = t10, this.scheduler = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ln(t10, this.dueTime, this.scheduler));
    }, t9;
  }();
  var ln = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.dueTime = n3, i3.scheduler = r3, i3.debouncedSubscription = null, i3.lastValue = null, i3.hasValue = false, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.clearDebounce(), this.lastValue = t10, this.hasValue = true, this.add(this.debouncedSubscription = this.scheduler.schedule(fn, this.dueTime, this));
    }, e3.prototype._complete = function() {
      this.debouncedNext(), this.destination.complete();
    }, e3.prototype.debouncedNext = function() {
      if (this.clearDebounce(), this.hasValue) {
        var t10 = this.lastValue;
        this.lastValue = null, this.hasValue = false, this.destination.next(t10);
      }
    }, e3.prototype.clearDebounce = function() {
      var t10 = this.debouncedSubscription;
      null !== t10 && (this.remove(t10), t10.unsubscribe(), this.debouncedSubscription = null);
    }, e3;
  }(y);
  function fn(t9) {
    t9.debouncedNext();
  }
  function pn(t9) {
    return void 0 === t9 && (t9 = null), function(e3) {
      return e3.lift(new dn(t9));
    };
  }
  var dn = function() {
    function t9(t10) {
      this.defaultValue = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new bn(t10, this.defaultValue));
    }, t9;
  }();
  var bn = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.defaultValue = n3, r3.isEmpty = true, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.isEmpty = false, this.destination.next(t10);
    }, e3.prototype._complete = function() {
      this.isEmpty && this.destination.next(this.defaultValue), this.destination.complete();
    }, e3;
  }(y);
  function vn(t9) {
    return t9 instanceof Date && !isNaN(+t9);
  }
  var yn = function() {
    function t9(t10, e3) {
      this.delay = t10, this.scheduler = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new mn(t10, this.delay, this.scheduler));
    }, t9;
  }();
  var mn = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.delay = n3, i3.scheduler = r3, i3.queue = [], i3.active = false, i3.errored = false, i3;
    }
    return o(e3, t9), e3.dispatch = function(t10) {
      for (var e4 = t10.source, n3 = e4.queue, r3 = t10.scheduler, i3 = t10.destination; n3.length > 0 && n3[0].time - r3.now() <= 0; )
        n3.shift().notification.observe(i3);
      if (n3.length > 0) {
        var o3 = Math.max(0, n3[0].time - r3.now());
        this.schedule(t10, o3);
      } else
        this.unsubscribe(), e4.active = false;
    }, e3.prototype._schedule = function(t10) {
      this.active = true, this.destination.add(t10.schedule(e3.dispatch, this.delay, { source: this, destination: this.destination, scheduler: t10 }));
    }, e3.prototype.scheduleNotification = function(t10) {
      if (true !== this.errored) {
        var e4 = this.scheduler, n3 = new wn(e4.now() + this.delay, t10);
        this.queue.push(n3), false === this.active && this._schedule(e4);
      }
    }, e3.prototype._next = function(t10) {
      this.scheduleNotification(ot.createNext(t10));
    }, e3.prototype._error = function(t10) {
      this.errored = true, this.queue = [], this.destination.error(t10), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.scheduleNotification(ot.createComplete()), this.unsubscribe();
    }, e3;
  }(y);
  var wn = function() {
    return function(t9, e3) {
      this.time = t9, this.notification = e3;
    };
  }();
  var xn = function() {
    function t9(t10) {
      this.delayDurationSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new _n(t10, this.delayDurationSelector));
    }, t9;
  }();
  var _n = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.delayDurationSelector = n3, r3.completed = false, r3.delayNotifierSubscriptions = [], r3.index = 0, r3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function(t10, e4, n3, r3, i3) {
      this.destination.next(t10), this.removeSubscription(i3), this.tryComplete();
    }, e3.prototype.notifyError = function(t10, e4) {
      this._error(t10);
    }, e3.prototype.notifyComplete = function(t10) {
      var e4 = this.removeSubscription(t10);
      e4 && this.destination.next(e4), this.tryComplete();
    }, e3.prototype._next = function(t10) {
      var e4 = this.index++;
      try {
        var n3 = this.delayDurationSelector(t10, e4);
        n3 && this.tryDelay(n3, t10);
      } catch (t11) {
        this.destination.error(t11);
      }
    }, e3.prototype._complete = function() {
      this.completed = true, this.tryComplete(), this.unsubscribe();
    }, e3.prototype.removeSubscription = function(t10) {
      t10.unsubscribe();
      var e4 = this.delayNotifierSubscriptions.indexOf(t10);
      return -1 !== e4 && this.delayNotifierSubscriptions.splice(e4, 1), t10.outerValue;
    }, e3.prototype.tryDelay = function(t10, e4) {
      var n3 = Qt(this, t10, e4);
      n3 && !n3.closed && (this.destination.add(n3), this.delayNotifierSubscriptions.push(n3));
    }, e3.prototype.tryComplete = function() {
      this.completed && 0 === this.delayNotifierSubscriptions.length && this.destination.complete();
    }, e3;
  }(Ut);
  var gn = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this) || this;
      return r3.source = e4, r3.subscriptionDelay = n3, r3;
    }
    return o(e3, t9), e3.prototype._subscribe = function(t10) {
      this.subscriptionDelay.subscribe(new Sn(t10, this.source));
    }, e3;
  }(E);
  var Sn = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this) || this;
      return r3.parent = e4, r3.source = n3, r3.sourceSubscribed = false, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.subscribeToSource();
    }, e3.prototype._error = function(t10) {
      this.unsubscribe(), this.parent.error(t10);
    }, e3.prototype._complete = function() {
      this.unsubscribe(), this.subscribeToSource();
    }, e3.prototype.subscribeToSource = function() {
      this.sourceSubscribed || (this.sourceSubscribed = true, this.unsubscribe(), this.source.subscribe(this.parent));
    }, e3;
  }(y);
  var En = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Cn(t10));
    }, t9;
  }();
  var Cn = function(t9) {
    function e3(e4) {
      return t9.call(this, e4) || this;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      t10.observe(this.destination);
    }, e3;
  }(y);
  var Nn = function() {
    function t9(t10, e3) {
      this.keySelector = t10, this.flushes = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Tn(t10, this.keySelector, this.flushes));
    }, t9;
  }();
  var Tn = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.keySelector = n3, i3.values = /* @__PURE__ */ new Set(), r3 && i3.add(re2(r3, new ee(i3))), i3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function() {
      this.values.clear();
    }, e3.prototype.notifyError = function(t10) {
      this._error(t10);
    }, e3.prototype._next = function(t10) {
      this.keySelector ? this._useKeySelector(t10) : this._finalizeNext(t10, t10);
    }, e3.prototype._useKeySelector = function(t10) {
      var e4, n3 = this.destination;
      try {
        e4 = this.keySelector(t10);
      } catch (t11) {
        return void n3.error(t11);
      }
      this._finalizeNext(e4, t10);
    }, e3.prototype._finalizeNext = function(t10, e4) {
      var n3 = this.values;
      n3.has(t10) || (n3.add(t10), this.destination.next(e4));
    }, e3;
  }(ne);
  function In(t9, e3) {
    return function(n3) {
      return n3.lift(new Vn(t9, e3));
    };
  }
  var Vn = function() {
    function t9(t10, e3) {
      this.compare = t10, this.keySelector = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new jn(t10, this.compare, this.keySelector));
    }, t9;
  }();
  var jn = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.keySelector = r3, i3.hasKey = false, "function" == typeof n3 && (i3.compare = n3), i3;
    }
    return o(e3, t9), e3.prototype.compare = function(t10, e4) {
      return t10 === e4;
    }, e3.prototype._next = function(t10) {
      var e4;
      try {
        var n3 = this.keySelector;
        e4 = n3 ? n3(t10) : t10;
      } catch (t11) {
        return this.destination.error(t11);
      }
      var r3 = false;
      if (this.hasKey)
        try {
          r3 = (0, this.compare)(this.key, e4);
        } catch (t11) {
          return this.destination.error(t11);
        }
      else
        this.hasKey = true;
      r3 || (this.key = e4, this.destination.next(t10));
    }, e3;
  }(y);
  function On(t9) {
    return void 0 === t9 && (t9 = kn), function(e3) {
      return e3.lift(new Pn(t9));
    };
  }
  var Pn = function() {
    function t9(t10) {
      this.errorFactory = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new An(t10, this.errorFactory));
    }, t9;
  }();
  var An = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.errorFactory = n3, r3.hasValue = false, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.hasValue = true, this.destination.next(t10);
    }, e3.prototype._complete = function() {
      if (this.hasValue)
        return this.destination.complete();
      var t10 = void 0;
      try {
        t10 = this.errorFactory();
      } catch (e4) {
        t10 = e4;
      }
      this.destination.error(t10);
    }, e3;
  }(y);
  function kn() {
    return new Pt();
  }
  function Fn(t9) {
    return function(e3) {
      return 0 === t9 ? J() : e3.lift(new Rn(t9));
    };
  }
  var Rn = function() {
    function t9(t10) {
      if (this.total = t10, this.total < 0)
        throw new Ot();
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Mn(t10, this.total));
    }, t9;
  }();
  var Mn = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.total = n3, r3.count = 0, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this.total, n3 = ++this.count;
      n3 <= e4 && (this.destination.next(t10), n3 === e4 && (this.destination.complete(), this.unsubscribe()));
    }, e3;
  }(y);
  var Dn = function() {
    function t9(t10, e3, n3) {
      this.predicate = t10, this.thisArg = e3, this.source = n3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Wn(t10, this.predicate, this.thisArg, this.source));
    }, t9;
  }();
  var Wn = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3 = t9.call(this, e4) || this;
      return o3.predicate = n3, o3.thisArg = r3, o3.source = i3, o3.index = 0, o3.thisArg = r3 || o3, o3;
    }
    return o(e3, t9), e3.prototype.notifyComplete = function(t10) {
      this.destination.next(t10), this.destination.complete();
    }, e3.prototype._next = function(t10) {
      var e4 = false;
      try {
        e4 = this.predicate.call(this.thisArg, t10, this.index++, this.source);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      e4 || this.notifyComplete(false);
    }, e3.prototype._complete = function() {
      this.notifyComplete(true);
    }, e3;
  }(y);
  var zn = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Bn(t10));
    }, t9;
  }();
  var Bn = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this, e4) || this;
      return n3.hasCompleted = false, n3.hasSubscription = false, n3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.hasSubscription || (this.hasSubscription = true, this.add(re2(t10, new ee(this))));
    }, e3.prototype._complete = function() {
      this.hasCompleted = true, this.hasSubscription || this.destination.complete();
    }, e3.prototype.notifyComplete = function() {
      this.hasSubscription = false, this.hasCompleted && this.destination.complete();
    }, e3;
  }(ne);
  var Un = function() {
    function t9(t10) {
      this.project = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Yn(t10, this.project));
    }, t9;
  }();
  var Yn = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.project = n3, r3.hasSubscription = false, r3.hasCompleted = false, r3.index = 0, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.hasSubscription || this.tryNext(t10);
    }, e3.prototype.tryNext = function(t10) {
      var e4, n3 = this.index++;
      try {
        e4 = this.project(t10, n3);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.hasSubscription = true, this._innerSub(e4);
    }, e3.prototype._innerSub = function(t10) {
      var e4 = new ee(this), n3 = this.destination;
      n3.add(e4);
      var r3 = re2(t10, e4);
      r3 !== e4 && n3.add(r3);
    }, e3.prototype._complete = function() {
      this.hasCompleted = true, this.hasSubscription || this.destination.complete(), this.unsubscribe();
    }, e3.prototype.notifyNext = function(t10) {
      this.destination.next(t10);
    }, e3.prototype.notifyError = function(t10) {
      this.destination.error(t10);
    }, e3.prototype.notifyComplete = function() {
      this.hasSubscription = false, this.hasCompleted && this.destination.complete();
    }, e3;
  }(ne);
  var Gn = function() {
    function t9(t10, e3, n3) {
      this.project = t10, this.concurrent = e3, this.scheduler = n3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new qn(t10, this.project, this.concurrent, this.scheduler));
    }, t9;
  }();
  var qn = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3 = t9.call(this, e4) || this;
      return o3.project = n3, o3.concurrent = r3, o3.scheduler = i3, o3.index = 0, o3.active = 0, o3.hasCompleted = false, r3 < Number.POSITIVE_INFINITY && (o3.buffer = []), o3;
    }
    return o(e3, t9), e3.dispatch = function(t10) {
      var e4 = t10.subscriber, n3 = t10.result, r3 = t10.value, i3 = t10.index;
      e4.subscribeToProjection(n3, r3, i3);
    }, e3.prototype._next = function(t10) {
      var n3 = this.destination;
      if (n3.closed)
        this._complete();
      else {
        var r3 = this.index++;
        if (this.active < this.concurrent) {
          n3.next(t10);
          try {
            var i3 = (0, this.project)(t10, r3);
            if (this.scheduler) {
              var o3 = { subscriber: this, result: i3, value: t10, index: r3 };
              this.destination.add(this.scheduler.schedule(e3.dispatch, 0, o3));
            } else
              this.subscribeToProjection(i3, t10, r3);
          } catch (t11) {
            n3.error(t11);
          }
        } else
          this.buffer.push(t10);
      }
    }, e3.prototype.subscribeToProjection = function(t10, e4, n3) {
      this.active++, this.destination.add(re2(t10, new ee(this)));
    }, e3.prototype._complete = function() {
      this.hasCompleted = true, this.hasCompleted && 0 === this.active && this.destination.complete(), this.unsubscribe();
    }, e3.prototype.notifyNext = function(t10) {
      this._next(t10);
    }, e3.prototype.notifyComplete = function() {
      var t10 = this.buffer;
      this.active--, t10 && t10.length > 0 && this._next(t10.shift()), this.hasCompleted && 0 === this.active && this.destination.complete();
    }, e3;
  }(ne);
  var Ln = function() {
    function t9(t10) {
      this.callback = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Hn(t10, this.callback));
    }, t9;
  }();
  var Hn = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.add(new d(n3)), r3;
    }
    return o(e3, t9), e3;
  }(y);
  var Kn = function() {
    function t9(t10, e3, n3, r3) {
      this.predicate = t10, this.source = e3, this.yieldIndex = n3, this.thisArg = r3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Qn(t10, this.predicate, this.source, this.yieldIndex, this.thisArg));
    }, t9;
  }();
  var Qn = function(t9) {
    function e3(e4, n3, r3, i3, o3) {
      var s3 = t9.call(this, e4) || this;
      return s3.predicate = n3, s3.source = r3, s3.yieldIndex = i3, s3.thisArg = o3, s3.index = 0, s3;
    }
    return o(e3, t9), e3.prototype.notifyComplete = function(t10) {
      var e4 = this.destination;
      e4.next(t10), e4.complete(), this.unsubscribe();
    }, e3.prototype._next = function(t10) {
      var e4 = this.predicate, n3 = this.thisArg, r3 = this.index++;
      try {
        e4.call(n3 || this, t10, r3, this.source) && this.notifyComplete(this.yieldIndex ? r3 : t10);
      } catch (t11) {
        this.destination.error(t11);
      }
    }, e3.prototype._complete = function() {
      this.notifyComplete(this.yieldIndex ? -1 : void 0);
    }, e3;
  }(y);
  var Jn = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Xn(t10));
    }, t9;
  }();
  var Xn = function(t9) {
    function e3() {
      return null !== t9 && t9.apply(this, arguments) || this;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
    }, e3;
  }(y);
  var Zn = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new $n(t10));
    }, t9;
  }();
  var $n = function(t9) {
    function e3(e4) {
      return t9.call(this, e4) || this;
    }
    return o(e3, t9), e3.prototype.notifyComplete = function(t10) {
      var e4 = this.destination;
      e4.next(t10), e4.complete();
    }, e3.prototype._next = function(t10) {
      this.notifyComplete(false);
    }, e3.prototype._complete = function() {
      this.notifyComplete(true);
    }, e3;
  }(y);
  function tr(t9) {
    return function(e3) {
      return 0 === t9 ? J() : e3.lift(new er(t9));
    };
  }
  var er = function() {
    function t9(t10) {
      if (this.total = t10, this.total < 0)
        throw new Ot();
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new nr(t10, this.total));
    }, t9;
  }();
  var nr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.total = n3, r3.ring = new Array(), r3.count = 0, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this.ring, n3 = this.total, r3 = this.count++;
      e4.length < n3 ? e4.push(t10) : e4[r3 % n3] = t10;
    }, e3.prototype._complete = function() {
      var t10 = this.destination, e4 = this.count;
      if (e4 > 0)
        for (var n3 = this.count >= this.total ? this.total : this.count, r3 = this.ring, i3 = 0; i3 < n3; i3++) {
          var o3 = e4++ % n3;
          t10.next(r3[o3]);
        }
      t10.complete();
    }, e3;
  }(y);
  var rr = function() {
    function t9(t10) {
      this.value = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ir(t10, this.value));
    }, t9;
  }();
  var ir = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.value = n3, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.destination.next(this.value);
    }, e3;
  }(y);
  var or = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new sr(t10));
    }, t9;
  }();
  var sr = function(t9) {
    function e3(e4) {
      return t9.call(this, e4) || this;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.destination.next(ot.createNext(t10));
    }, e3.prototype._error = function(t10) {
      var e4 = this.destination;
      e4.next(ot.createError(t10)), e4.complete();
    }, e3.prototype._complete = function() {
      var t10 = this.destination;
      t10.next(ot.createComplete()), t10.complete();
    }, e3;
  }(y);
  function ur(t9, e3) {
    var n3 = false;
    return arguments.length >= 2 && (n3 = true), function(r3) {
      return r3.lift(new cr(t9, e3, n3));
    };
  }
  var cr = function() {
    function t9(t10, e3, n3) {
      void 0 === n3 && (n3 = false), this.accumulator = t10, this.seed = e3, this.hasSeed = n3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ar(t10, this.accumulator, this.seed, this.hasSeed));
    }, t9;
  }();
  var ar = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3 = t9.call(this, e4) || this;
      return o3.accumulator = n3, o3._seed = r3, o3.hasSeed = i3, o3.index = 0, o3;
    }
    return o(e3, t9), Object.defineProperty(e3.prototype, "seed", { get: function() {
      return this._seed;
    }, set: function(t10) {
      this.hasSeed = true, this._seed = t10;
    }, enumerable: true, configurable: true }), e3.prototype._next = function(t10) {
      if (this.hasSeed)
        return this._tryNext(t10);
      this.seed = t10, this.destination.next(t10);
    }, e3.prototype._tryNext = function(t10) {
      var e4, n3 = this.index++;
      try {
        e4 = this.accumulator(this.seed, t10, n3);
      } catch (t11) {
        this.destination.error(t11);
      }
      this.seed = e4, this.destination.next(e4);
    }, e3;
  }(y);
  function hr(t9, e3) {
    return arguments.length >= 2 ? function(n3) {
      return g(ur(t9, e3), tr(1), pn(e3))(n3);
    } : function(e4) {
      return g(ur(function(e5, n3, r3) {
        return t9(e5, n3, r3 + 1);
      }), tr(1))(e4);
    };
  }
  var lr = function() {
    function t9(t10, e3, n3) {
      this.accumulator = t10, this.seed = e3, this.concurrent = n3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new fr(t10, this.accumulator, this.seed, this.concurrent));
    }, t9;
  }();
  var fr = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3 = t9.call(this, e4) || this;
      return o3.accumulator = n3, o3.acc = r3, o3.concurrent = i3, o3.hasValue = false, o3.hasCompleted = false, o3.buffer = [], o3.active = 0, o3.index = 0, o3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      if (this.active < this.concurrent) {
        var e4 = this.index++, n3 = this.destination, r3 = void 0;
        try {
          r3 = (0, this.accumulator)(this.acc, t10, e4);
        } catch (t11) {
          return n3.error(t11);
        }
        this.active++, this._innerSub(r3);
      } else
        this.buffer.push(t10);
    }, e3.prototype._innerSub = function(t10) {
      var e4 = new ee(this), n3 = this.destination;
      n3.add(e4);
      var r3 = re2(t10, e4);
      r3 !== e4 && n3.add(r3);
    }, e3.prototype._complete = function() {
      this.hasCompleted = true, 0 === this.active && 0 === this.buffer.length && (false === this.hasValue && this.destination.next(this.acc), this.destination.complete()), this.unsubscribe();
    }, e3.prototype.notifyNext = function(t10) {
      var e4 = this.destination;
      this.acc = t10, this.hasValue = true, e4.next(t10);
    }, e3.prototype.notifyComplete = function() {
      var t10 = this.buffer;
      this.active--, t10.length > 0 ? this._next(t10.shift()) : 0 === this.active && this.hasCompleted && (false === this.hasValue && this.destination.next(this.acc), this.destination.complete());
    }, e3;
  }(ne);
  function pr(t9, e3) {
    return function(n3) {
      var r3;
      if (r3 = "function" == typeof t9 ? t9 : function() {
        return t9;
      }, "function" == typeof e3)
        return n3.lift(new dr(r3, e3));
      var i3 = Object.create(n3, F);
      return i3.source = n3, i3.subjectFactory = r3, i3;
    };
  }
  var dr = function() {
    function t9(t10, e3) {
      this.subjectFactory = t10, this.selector = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      var n3 = this.selector, r3 = this.subjectFactory(), i3 = n3(r3).subscribe(t10);
      return i3.add(e3.subscribe(r3)), i3;
    }, t9;
  }();
  var br = function() {
    function t9(t10) {
      this.nextSources = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new vr(t10, this.nextSources));
    }, t9;
  }();
  var vr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.destination = e4, r3.nextSources = n3, r3;
    }
    return o(e3, t9), e3.prototype.notifyError = function() {
      this.subscribeToNextSource();
    }, e3.prototype.notifyComplete = function() {
      this.subscribeToNextSource();
    }, e3.prototype._error = function(t10) {
      this.subscribeToNextSource(), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.subscribeToNextSource(), this.unsubscribe();
    }, e3.prototype.subscribeToNextSource = function() {
      var t10 = this.nextSources.shift();
      if (t10) {
        var e4 = new ee(this), n3 = this.destination;
        n3.add(e4);
        var r3 = re2(t10, e4);
        r3 !== e4 && n3.add(r3);
      } else
        this.destination.complete();
    }, e3;
  }(ne);
  var yr = function() {
    function t9() {
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new mr(t10));
    }, t9;
  }();
  var mr = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this, e4) || this;
      return n3.hasPrev = false, n3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4;
      this.hasPrev ? e4 = [this.prev, t10] : this.hasPrev = true, this.prev = t10, e4 && this.destination.next(e4);
    }, e3;
  }(y);
  function wr(t9, e3) {
    return function(n3) {
      for (var r3 = n3, i3 = 0; i3 < e3; i3++) {
        var o3 = null != r3 ? r3[t9[i3]] : void 0;
        if (void 0 === o3)
          return;
        r3 = o3;
      }
      return r3;
    };
  }
  var xr = function() {
    function t9(t10, e3) {
      this.count = t10, this.source = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new _r(t10, this.count, this.source));
    }, t9;
  }();
  var _r = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.count = n3, i3.source = r3, i3;
    }
    return o(e3, t9), e3.prototype.complete = function() {
      if (!this.isStopped) {
        var e4 = this.source, n3 = this.count;
        if (0 === n3)
          return t9.prototype.complete.call(this);
        n3 > -1 && (this.count = n3 - 1), e4.subscribe(this._unsubscribeAndRecycle());
      }
    }, e3;
  }(y);
  var gr = function() {
    function t9(t10) {
      this.notifier = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Sr(t10, this.notifier, e3));
    }, t9;
  }();
  var Sr = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.notifier = n3, i3.source = r3, i3.sourceIsBeingSubscribedTo = true, i3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function() {
      this.sourceIsBeingSubscribedTo = true, this.source.subscribe(this);
    }, e3.prototype.notifyComplete = function() {
      if (false === this.sourceIsBeingSubscribedTo)
        return t9.prototype.complete.call(this);
    }, e3.prototype.complete = function() {
      if (this.sourceIsBeingSubscribedTo = false, !this.isStopped) {
        if (this.retries || this.subscribeToRetries(), !this.retriesSubscription || this.retriesSubscription.closed)
          return t9.prototype.complete.call(this);
        this._unsubscribeAndRecycle(), this.notifications.next(void 0);
      }
    }, e3.prototype._unsubscribe = function() {
      var t10 = this.notifications, e4 = this.retriesSubscription;
      t10 && (t10.unsubscribe(), this.notifications = void 0), e4 && (e4.unsubscribe(), this.retriesSubscription = void 0), this.retries = void 0;
    }, e3.prototype._unsubscribeAndRecycle = function() {
      var e4 = this._unsubscribe;
      return this._unsubscribe = null, t9.prototype._unsubscribeAndRecycle.call(this), this._unsubscribe = e4, this;
    }, e3.prototype.subscribeToRetries = function() {
      var e4;
      this.notifications = new V();
      try {
        e4 = (0, this.notifier)(this.notifications);
      } catch (e5) {
        return t9.prototype.complete.call(this);
      }
      this.retries = e4, this.retriesSubscription = re2(e4, new ee(this));
    }, e3;
  }(ne);
  var Er = function() {
    function t9(t10, e3) {
      this.count = t10, this.source = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Cr(t10, this.count, this.source));
    }, t9;
  }();
  var Cr = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.count = n3, i3.source = r3, i3;
    }
    return o(e3, t9), e3.prototype.error = function(e4) {
      if (!this.isStopped) {
        var n3 = this.source, r3 = this.count;
        if (0 === r3)
          return t9.prototype.error.call(this, e4);
        r3 > -1 && (this.count = r3 - 1), n3.subscribe(this._unsubscribeAndRecycle());
      }
    }, e3;
  }(y);
  var Nr = function() {
    function t9(t10, e3) {
      this.notifier = t10, this.source = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Tr(t10, this.notifier, this.source));
    }, t9;
  }();
  var Tr = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.notifier = n3, i3.source = r3, i3;
    }
    return o(e3, t9), e3.prototype.error = function(e4) {
      if (!this.isStopped) {
        var n3 = this.errors, r3 = this.retries, i3 = this.retriesSubscription;
        if (r3)
          this.errors = void 0, this.retriesSubscription = void 0;
        else {
          n3 = new V();
          try {
            r3 = (0, this.notifier)(n3);
          } catch (e5) {
            return t9.prototype.error.call(this, e5);
          }
          i3 = re2(r3, new ee(this));
        }
        this._unsubscribeAndRecycle(), this.errors = n3, this.retries = r3, this.retriesSubscription = i3, n3.next(e4);
      }
    }, e3.prototype._unsubscribe = function() {
      var t10 = this.errors, e4 = this.retriesSubscription;
      t10 && (t10.unsubscribe(), this.errors = void 0), e4 && (e4.unsubscribe(), this.retriesSubscription = void 0), this.retries = void 0;
    }, e3.prototype.notifyNext = function() {
      var t10 = this._unsubscribe;
      this._unsubscribe = null, this._unsubscribeAndRecycle(), this._unsubscribe = t10, this.source.subscribe(this);
    }, e3;
  }(ne);
  var Ir = function() {
    function t9(t10) {
      this.notifier = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      var n3 = new Vr(t10), r3 = e3.subscribe(n3);
      return r3.add(re2(this.notifier, new ee(n3))), r3;
    }, t9;
  }();
  var Vr = function(t9) {
    function e3() {
      var e4 = null !== t9 && t9.apply(this, arguments) || this;
      return e4.hasValue = false, e4;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.value = t10, this.hasValue = true;
    }, e3.prototype.notifyNext = function() {
      this.emitValue();
    }, e3.prototype.notifyComplete = function() {
      this.emitValue();
    }, e3.prototype.emitValue = function() {
      this.hasValue && (this.hasValue = false, this.destination.next(this.value));
    }, e3;
  }(ne);
  var jr = function() {
    function t9(t10, e3) {
      this.period = t10, this.scheduler = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Or(t10, this.period, this.scheduler));
    }, t9;
  }();
  var Or = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.period = n3, i3.scheduler = r3, i3.hasValue = false, i3.add(r3.schedule(Pr, n3, { subscriber: i3, period: n3 })), i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.lastValue = t10, this.hasValue = true;
    }, e3.prototype.notifyNext = function() {
      this.hasValue && (this.hasValue = false, this.destination.next(this.lastValue));
    }, e3;
  }(y);
  function Pr(t9) {
    var e3 = t9.subscriber, n3 = t9.period;
    e3.notifyNext(), this.schedule(t9, n3);
  }
  var Ar = function() {
    function t9(t10, e3) {
      this.compareTo = t10, this.comparator = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new kr(t10, this.compareTo, this.comparator));
    }, t9;
  }();
  var kr = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.compareTo = n3, i3.comparator = r3, i3._a = [], i3._b = [], i3._oneComplete = false, i3.destination.add(n3.subscribe(new Fr(e4, i3))), i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this._oneComplete && 0 === this._b.length ? this.emit(false) : (this._a.push(t10), this.checkValues());
    }, e3.prototype._complete = function() {
      this._oneComplete ? this.emit(0 === this._a.length && 0 === this._b.length) : this._oneComplete = true, this.unsubscribe();
    }, e3.prototype.checkValues = function() {
      for (var t10 = this, e4 = t10._a, n3 = t10._b, r3 = t10.comparator; e4.length > 0 && n3.length > 0; ) {
        var i3 = e4.shift(), o3 = n3.shift(), s3 = false;
        try {
          s3 = r3 ? r3(i3, o3) : i3 === o3;
        } catch (t11) {
          this.destination.error(t11);
        }
        s3 || this.emit(false);
      }
    }, e3.prototype.emit = function(t10) {
      var e4 = this.destination;
      e4.next(t10), e4.complete();
    }, e3.prototype.nextB = function(t10) {
      this._oneComplete && 0 === this._a.length ? this.emit(false) : (this._b.push(t10), this.checkValues());
    }, e3.prototype.completeB = function() {
      this._oneComplete ? this.emit(0 === this._a.length && 0 === this._b.length) : this._oneComplete = true;
    }, e3;
  }(y);
  var Fr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.parent = n3, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.parent.nextB(t10);
    }, e3.prototype._error = function(t10) {
      this.parent.error(t10), this.unsubscribe();
    }, e3.prototype._complete = function() {
      this.parent.completeB(), this.unsubscribe();
    }, e3;
  }(y);
  function Rr() {
    return new V();
  }
  var Mr = function() {
    function t9(t10, e3) {
      this.predicate = t10, this.source = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Dr(t10, this.predicate, this.source));
    }, t9;
  }();
  var Dr = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.predicate = n3, i3.source = r3, i3.seenValue = false, i3.index = 0, i3;
    }
    return o(e3, t9), e3.prototype.applySingleValue = function(t10) {
      this.seenValue ? this.destination.error("Sequence contains more than one element") : (this.seenValue = true, this.singleValue = t10);
    }, e3.prototype._next = function(t10) {
      var e4 = this.index++;
      this.predicate ? this.tryNext(t10, e4) : this.applySingleValue(t10);
    }, e3.prototype.tryNext = function(t10, e4) {
      try {
        this.predicate(t10, e4, this.source) && this.applySingleValue(t10);
      } catch (t11) {
        this.destination.error(t11);
      }
    }, e3.prototype._complete = function() {
      var t10 = this.destination;
      this.index > 0 ? (t10.next(this.seenValue ? this.singleValue : void 0), t10.complete()) : t10.error(new Pt());
    }, e3;
  }(y);
  var Wr = function() {
    function t9(t10) {
      this.total = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new zr(t10, this.total));
    }, t9;
  }();
  var zr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.total = n3, r3.count = 0, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      ++this.count > this.total && this.destination.next(t10);
    }, e3;
  }(y);
  var Br = function() {
    function t9(t10) {
      if (this._skipCount = t10, this._skipCount < 0)
        throw new Ot();
    }
    return t9.prototype.call = function(t10, e3) {
      return 0 === this._skipCount ? e3.subscribe(new y(t10)) : e3.subscribe(new Ur(t10, this._skipCount));
    }, t9;
  }();
  var Ur = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3._skipCount = n3, r3._count = 0, r3._ring = new Array(n3), r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this._skipCount, n3 = this._count++;
      if (n3 < e4)
        this._ring[n3] = t10;
      else {
        var r3 = n3 % e4, i3 = this._ring, o3 = i3[r3];
        i3[r3] = t10, this.destination.next(o3);
      }
    }, e3;
  }(y);
  var Yr = function() {
    function t9(t10) {
      this.notifier = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Gr(t10, this.notifier));
    }, t9;
  }();
  var Gr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      r3.hasValue = false;
      var i3 = new ee(r3);
      r3.add(i3), r3.innerSubscription = i3;
      var o3 = re2(n3, i3);
      return o3 !== i3 && (r3.add(o3), r3.innerSubscription = o3), r3;
    }
    return o(e3, t9), e3.prototype._next = function(e4) {
      this.hasValue && t9.prototype._next.call(this, e4);
    }, e3.prototype.notifyNext = function() {
      this.hasValue = true, this.innerSubscription && this.innerSubscription.unsubscribe();
    }, e3.prototype.notifyComplete = function() {
    }, e3;
  }(ne);
  var qr = function() {
    function t9(t10) {
      this.predicate = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Lr(t10, this.predicate));
    }, t9;
  }();
  var Lr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.predicate = n3, r3.skipping = true, r3.index = 0, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this.destination;
      this.skipping && this.tryCallPredicate(t10), this.skipping || e4.next(t10);
    }, e3.prototype.tryCallPredicate = function(t10) {
      try {
        var e4 = this.predicate(t10, this.index++);
        this.skipping = Boolean(e4);
      } catch (t11) {
        this.destination.error(t11);
      }
    }, e3;
  }(y);
  var Hr = function(t9) {
    function e3(e4, n3, r3) {
      void 0 === n3 && (n3 = 0), void 0 === r3 && (r3 = _t);
      var i3 = t9.call(this) || this;
      return i3.source = e4, i3.delayTime = n3, i3.scheduler = r3, (!be(n3) || n3 < 0) && (i3.delayTime = 0), r3 && "function" == typeof r3.schedule || (i3.scheduler = _t), i3;
    }
    return o(e3, t9), e3.create = function(t10, n3, r3) {
      return void 0 === n3 && (n3 = 0), void 0 === r3 && (r3 = _t), new e3(t10, n3, r3);
    }, e3.dispatch = function(t10) {
      var e4 = t10.source, n3 = t10.subscriber;
      return this.add(e4.subscribe(n3));
    }, e3.prototype._subscribe = function(t10) {
      var n3 = this.delayTime, r3 = this.source;
      return this.scheduler.schedule(e3.dispatch, n3, { source: r3, subscriber: t10 });
    }, e3;
  }(E);
  var Kr = function() {
    function t9(t10, e3) {
      this.scheduler = t10, this.delay = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return new Hr(e3, this.delay, this.scheduler).subscribe(t10);
    }, t9;
  }();
  function Qr(t9, e3) {
    return "function" == typeof e3 ? function(n3) {
      return n3.pipe(Qr(function(n4, r3) {
        return te(t9(n4, r3)).pipe(kt(function(t10, i3) {
          return e3(n4, t10, r3, i3);
        }));
      }));
    } : function(e4) {
      return e4.lift(new Jr(t9));
    };
  }
  var Jr = function() {
    function t9(t10) {
      this.project = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Xr(t10, this.project));
    }, t9;
  }();
  var Xr = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.project = n3, r3.index = 0, r3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4, n3 = this.index++;
      try {
        e4 = this.project(t10, n3);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this._innerSub(e4);
    }, e3.prototype._innerSub = function(t10) {
      var e4 = this.innerSubscription;
      e4 && e4.unsubscribe();
      var n3 = new ee(this), r3 = this.destination;
      r3.add(n3), this.innerSubscription = re2(t10, n3), this.innerSubscription !== n3 && r3.add(this.innerSubscription);
    }, e3.prototype._complete = function() {
      var e4 = this.innerSubscription;
      e4 && !e4.closed || t9.prototype._complete.call(this), this.unsubscribe();
    }, e3.prototype._unsubscribe = function() {
      this.innerSubscription = void 0;
    }, e3.prototype.notifyComplete = function() {
      this.innerSubscription = void 0, this.isStopped && t9.prototype._complete.call(this);
    }, e3.prototype.notifyNext = function(t10) {
      this.destination.next(t10);
    }, e3;
  }(ne);
  var Zr = function() {
    function t9(t10) {
      this.notifier = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      var n3 = new $r(t10), r3 = re2(this.notifier, new ee(n3));
      return r3 && !n3.seenValue ? (n3.add(r3), e3.subscribe(n3)) : n3;
    }, t9;
  }();
  var $r = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this, e4) || this;
      return n3.seenValue = false, n3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function() {
      this.seenValue = true, this.complete();
    }, e3.prototype.notifyComplete = function() {
    }, e3;
  }(ne);
  var ti = function() {
    function t9(t10, e3) {
      this.predicate = t10, this.inclusive = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ei(t10, this.predicate, this.inclusive));
    }, t9;
  }();
  var ei = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.predicate = n3, i3.inclusive = r3, i3.index = 0, i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4, n3 = this.destination;
      try {
        e4 = this.predicate(t10, this.index++);
      } catch (t11) {
        return void n3.error(t11);
      }
      this.nextOrComplete(t10, e4);
    }, e3.prototype.nextOrComplete = function(t10, e4) {
      var n3 = this.destination;
      Boolean(e4) ? n3.next(t10) : (this.inclusive && n3.next(t10), n3.complete());
    }, e3;
  }(y);
  var ni = function() {
    function t9(t10, e3, n3) {
      this.nextOrObserver = t10, this.error = e3, this.complete = n3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ri(t10, this.nextOrObserver, this.error, this.complete));
    }, t9;
  }();
  var ri = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3 = t9.call(this, e4) || this;
      return o3._tapNext = jt, o3._tapError = jt, o3._tapComplete = jt, o3._tapError = r3 || jt, o3._tapComplete = i3 || jt, s(n3) ? (o3._context = o3, o3._tapNext = n3) : n3 && (o3._context = n3, o3._tapNext = n3.next || jt, o3._tapError = n3.error || jt, o3._tapComplete = n3.complete || jt), o3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      try {
        this._tapNext.call(this._context, t10);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.destination.next(t10);
    }, e3.prototype._error = function(t10) {
      try {
        this._tapError.call(this._context, t10);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.destination.error(t10);
    }, e3.prototype._complete = function() {
      try {
        this._tapComplete.call(this._context);
      } catch (t10) {
        return void this.destination.error(t10);
      }
      return this.destination.complete();
    }, e3;
  }(y);
  var ii = { leading: true, trailing: false };
  var oi = function() {
    function t9(t10, e3, n3) {
      this.durationSelector = t10, this.leading = e3, this.trailing = n3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new si(t10, this.durationSelector, this.leading, this.trailing));
    }, t9;
  }();
  var si = function(t9) {
    function e3(e4, n3, r3, i3) {
      var o3 = t9.call(this, e4) || this;
      return o3.destination = e4, o3.durationSelector = n3, o3._leading = r3, o3._trailing = i3, o3._hasValue = false, o3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this._hasValue = true, this._sendValue = t10, this._throttled || (this._leading ? this.send() : this.throttle(t10));
    }, e3.prototype.send = function() {
      var t10 = this._hasValue, e4 = this._sendValue;
      t10 && (this.destination.next(e4), this.throttle(e4)), this._hasValue = false, this._sendValue = void 0;
    }, e3.prototype.throttle = function(t10) {
      var e4 = this.tryDurationSelector(t10);
      e4 && this.add(this._throttled = re2(e4, new ee(this)));
    }, e3.prototype.tryDurationSelector = function(t10) {
      try {
        return this.durationSelector(t10);
      } catch (t11) {
        return this.destination.error(t11), null;
      }
    }, e3.prototype.throttlingDone = function() {
      var t10 = this._throttled, e4 = this._trailing;
      t10 && t10.unsubscribe(), this._throttled = void 0, e4 && this.send();
    }, e3.prototype.notifyNext = function() {
      this.throttlingDone();
    }, e3.prototype.notifyComplete = function() {
      this.throttlingDone();
    }, e3;
  }(ne);
  var ui = function() {
    function t9(t10, e3, n3, r3) {
      this.duration = t10, this.scheduler = e3, this.leading = n3, this.trailing = r3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new ci(t10, this.duration, this.scheduler, this.leading, this.trailing));
    }, t9;
  }();
  var ci = function(t9) {
    function e3(e4, n3, r3, i3, o3) {
      var s3 = t9.call(this, e4) || this;
      return s3.duration = n3, s3.scheduler = r3, s3.leading = i3, s3.trailing = o3, s3._hasTrailingValue = false, s3._trailingValue = null, s3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      this.throttled ? this.trailing && (this._trailingValue = t10, this._hasTrailingValue = true) : (this.add(this.throttled = this.scheduler.schedule(ai, this.duration, { subscriber: this })), this.leading ? this.destination.next(t10) : this.trailing && (this._trailingValue = t10, this._hasTrailingValue = true));
    }, e3.prototype._complete = function() {
      this._hasTrailingValue ? (this.destination.next(this._trailingValue), this.destination.complete()) : this.destination.complete();
    }, e3.prototype.clearThrottle = function() {
      var t10 = this.throttled;
      t10 && (this.trailing && this._hasTrailingValue && (this.destination.next(this._trailingValue), this._trailingValue = null, this._hasTrailingValue = false), t10.unsubscribe(), this.remove(t10), this.throttled = null);
    }, e3;
  }(y);
  function ai(t9) {
    t9.subscriber.clearThrottle();
  }
  var hi = function() {
    return function(t9, e3) {
      this.value = t9, this.interval = e3;
    };
  }();
  function li(t9, e3, n3) {
    return void 0 === n3 && (n3 = St), function(r3) {
      var i3 = vn(t9), o3 = i3 ? +t9 - n3.now() : Math.abs(t9);
      return r3.lift(new fi(o3, i3, e3, n3));
    };
  }
  var fi = function() {
    function t9(t10, e3, n3, r3) {
      this.waitFor = t10, this.absoluteTimeout = e3, this.withObservable = n3, this.scheduler = r3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new pi(t10, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    }, t9;
  }();
  var pi = function(t9) {
    function e3(e4, n3, r3, i3, o3) {
      var s3 = t9.call(this, e4) || this;
      return s3.absoluteTimeout = n3, s3.waitFor = r3, s3.withObservable = i3, s3.scheduler = o3, s3.scheduleTimeout(), s3;
    }
    return o(e3, t9), e3.dispatchTimeout = function(t10) {
      var e4 = t10.withObservable;
      t10._unsubscribeAndRecycle(), t10.add(re2(e4, new ee(t10)));
    }, e3.prototype.scheduleTimeout = function() {
      var t10 = this.action;
      t10 ? this.action = t10.schedule(this, this.waitFor) : this.add(this.action = this.scheduler.schedule(e3.dispatchTimeout, this.waitFor, this));
    }, e3.prototype._next = function(e4) {
      this.absoluteTimeout || this.scheduleTimeout(), t9.prototype._next.call(this, e4);
    }, e3.prototype._unsubscribe = function() {
      this.action = void 0, this.scheduler = null, this.withObservable = null;
    }, e3;
  }(ne);
  var di = function() {
    return function(t9, e3) {
      this.value = t9, this.timestamp = e3;
    };
  }();
  function bi(t9, e3, n3) {
    return 0 === n3 ? [e3] : (t9.push(e3), t9);
  }
  var vi = function() {
    function t9(t10) {
      this.windowBoundaries = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      var n3 = new yi(t10), r3 = e3.subscribe(n3);
      return r3.closed || n3.add(re2(this.windowBoundaries, new ee(n3))), r3;
    }, t9;
  }();
  var yi = function(t9) {
    function e3(e4) {
      var n3 = t9.call(this, e4) || this;
      return n3.window = new V(), e4.next(n3.window), n3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function() {
      this.openWindow();
    }, e3.prototype.notifyError = function(t10) {
      this._error(t10);
    }, e3.prototype.notifyComplete = function() {
      this._complete();
    }, e3.prototype._next = function(t10) {
      this.window.next(t10);
    }, e3.prototype._error = function(t10) {
      this.window.error(t10), this.destination.error(t10);
    }, e3.prototype._complete = function() {
      this.window.complete(), this.destination.complete();
    }, e3.prototype._unsubscribe = function() {
      this.window = null;
    }, e3.prototype.openWindow = function() {
      var t10 = this.window;
      t10 && t10.complete();
      var e4 = this.destination, n3 = this.window = new V();
      e4.next(n3);
    }, e3;
  }(ne);
  var mi = function() {
    function t9(t10, e3) {
      this.windowSize = t10, this.startWindowEvery = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new wi(t10, this.windowSize, this.startWindowEvery));
    }, t9;
  }();
  var wi = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.destination = e4, i3.windowSize = n3, i3.startWindowEvery = r3, i3.windows = [new V()], i3.count = 0, e4.next(i3.windows[0]), i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      for (var e4 = this.startWindowEvery > 0 ? this.startWindowEvery : this.windowSize, n3 = this.destination, r3 = this.windowSize, i3 = this.windows, o3 = i3.length, s3 = 0; s3 < o3 && !this.closed; s3++)
        i3[s3].next(t10);
      var u3 = this.count - r3 + 1;
      if (u3 >= 0 && u3 % e4 == 0 && !this.closed && i3.shift().complete(), ++this.count % e4 == 0 && !this.closed) {
        var c3 = new V();
        i3.push(c3), n3.next(c3);
      }
    }, e3.prototype._error = function(t10) {
      var e4 = this.windows;
      if (e4)
        for (; e4.length > 0 && !this.closed; )
          e4.shift().error(t10);
      this.destination.error(t10);
    }, e3.prototype._complete = function() {
      var t10 = this.windows;
      if (t10)
        for (; t10.length > 0 && !this.closed; )
          t10.shift().complete();
      this.destination.complete();
    }, e3.prototype._unsubscribe = function() {
      this.count = 0, this.windows = null;
    }, e3;
  }(y);
  var xi = function() {
    function t9(t10, e3, n3, r3) {
      this.windowTimeSpan = t10, this.windowCreationInterval = e3, this.maxWindowSize = n3, this.scheduler = r3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new gi(t10, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
    }, t9;
  }();
  var _i = function(t9) {
    function e3() {
      var e4 = null !== t9 && t9.apply(this, arguments) || this;
      return e4._numberOfNextedValues = 0, e4;
    }
    return o(e3, t9), e3.prototype.next = function(e4) {
      this._numberOfNextedValues++, t9.prototype.next.call(this, e4);
    }, Object.defineProperty(e3.prototype, "numberOfNextedValues", { get: function() {
      return this._numberOfNextedValues;
    }, enumerable: true, configurable: true }), e3;
  }(V);
  var gi = function(t9) {
    function e3(e4, n3, r3, i3, o3) {
      var s3 = t9.call(this, e4) || this;
      s3.destination = e4, s3.windowTimeSpan = n3, s3.windowCreationInterval = r3, s3.maxWindowSize = i3, s3.scheduler = o3, s3.windows = [];
      var u3 = s3.openWindow();
      if (null !== r3 && r3 >= 0) {
        var c3 = { subscriber: s3, window: u3, context: null }, a3 = { windowTimeSpan: n3, windowCreationInterval: r3, subscriber: s3, scheduler: o3 };
        s3.add(o3.schedule(Ci, n3, c3)), s3.add(o3.schedule(Ei, r3, a3));
      } else {
        var h3 = { subscriber: s3, window: u3, windowTimeSpan: n3 };
        s3.add(o3.schedule(Si, n3, h3));
      }
      return s3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      for (var e4 = this.windows, n3 = e4.length, r3 = 0; r3 < n3; r3++) {
        var i3 = e4[r3];
        i3.closed || (i3.next(t10), i3.numberOfNextedValues >= this.maxWindowSize && this.closeWindow(i3));
      }
    }, e3.prototype._error = function(t10) {
      for (var e4 = this.windows; e4.length > 0; )
        e4.shift().error(t10);
      this.destination.error(t10);
    }, e3.prototype._complete = function() {
      for (var t10 = this.windows; t10.length > 0; ) {
        var e4 = t10.shift();
        e4.closed || e4.complete();
      }
      this.destination.complete();
    }, e3.prototype.openWindow = function() {
      var t10 = new _i();
      return this.windows.push(t10), this.destination.next(t10), t10;
    }, e3.prototype.closeWindow = function(t10) {
      t10.complete();
      var e4 = this.windows;
      e4.splice(e4.indexOf(t10), 1);
    }, e3;
  }(y);
  function Si(t9) {
    var e3 = t9.subscriber, n3 = t9.windowTimeSpan, r3 = t9.window;
    r3 && e3.closeWindow(r3), t9.window = e3.openWindow(), this.schedule(t9, n3);
  }
  function Ei(t9) {
    var e3 = t9.windowTimeSpan, n3 = t9.subscriber, r3 = t9.scheduler, i3 = t9.windowCreationInterval, o3 = n3.openWindow(), s3 = this, u3 = { action: s3, subscription: null }, c3 = { subscriber: n3, window: o3, context: u3 };
    u3.subscription = r3.schedule(Ci, e3, c3), s3.add(u3.subscription), s3.schedule(t9, i3);
  }
  function Ci(t9) {
    var e3 = t9.subscriber, n3 = t9.window, r3 = t9.context;
    r3 && r3.action && r3.subscription && r3.action.remove(r3.subscription), e3.closeWindow(n3);
  }
  var Ni = function() {
    function t9(t10, e3) {
      this.openings = t10, this.closingSelector = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Ti(t10, this.openings, this.closingSelector));
    }, t9;
  }();
  var Ti = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      return i3.openings = n3, i3.closingSelector = r3, i3.contexts = [], i3.add(i3.openSubscription = Qt(i3, n3, n3)), i3;
    }
    return o(e3, t9), e3.prototype._next = function(t10) {
      var e4 = this.contexts;
      if (e4)
        for (var n3 = e4.length, r3 = 0; r3 < n3; r3++)
          e4[r3].window.next(t10);
    }, e3.prototype._error = function(e4) {
      var n3 = this.contexts;
      if (this.contexts = null, n3)
        for (var r3 = n3.length, i3 = -1; ++i3 < r3; ) {
          var o3 = n3[i3];
          o3.window.error(e4), o3.subscription.unsubscribe();
        }
      t9.prototype._error.call(this, e4);
    }, e3.prototype._complete = function() {
      var e4 = this.contexts;
      if (this.contexts = null, e4)
        for (var n3 = e4.length, r3 = -1; ++r3 < n3; ) {
          var i3 = e4[r3];
          i3.window.complete(), i3.subscription.unsubscribe();
        }
      t9.prototype._complete.call(this);
    }, e3.prototype._unsubscribe = function() {
      var t10 = this.contexts;
      if (this.contexts = null, t10)
        for (var e4 = t10.length, n3 = -1; ++n3 < e4; ) {
          var r3 = t10[n3];
          r3.window.unsubscribe(), r3.subscription.unsubscribe();
        }
    }, e3.prototype.notifyNext = function(t10, e4, n3, r3, i3) {
      if (t10 === this.openings) {
        var o3 = void 0;
        try {
          o3 = (0, this.closingSelector)(e4);
        } catch (t11) {
          return this.error(t11);
        }
        var s3 = new V(), u3 = new d(), c3 = { window: s3, subscription: u3 };
        this.contexts.push(c3);
        var a3 = Qt(this, o3, c3);
        a3.closed ? this.closeWindow(this.contexts.length - 1) : (a3.context = c3, u3.add(a3)), this.destination.next(s3);
      } else
        this.closeWindow(this.contexts.indexOf(t10));
    }, e3.prototype.notifyError = function(t10) {
      this.error(t10);
    }, e3.prototype.notifyComplete = function(t10) {
      t10 !== this.openSubscription && this.closeWindow(this.contexts.indexOf(t10.context));
    }, e3.prototype.closeWindow = function(t10) {
      if (-1 !== t10) {
        var e4 = this.contexts, n3 = e4[t10], r3 = n3.window, i3 = n3.subscription;
        e4.splice(t10, 1), r3.complete(), i3.unsubscribe();
      }
    }, e3;
  }(Ut);
  var Ii = function() {
    function t9(t10) {
      this.closingSelector = t10;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Vi(t10, this.closingSelector));
    }, t9;
  }();
  var Vi = function(t9) {
    function e3(e4, n3) {
      var r3 = t9.call(this, e4) || this;
      return r3.destination = e4, r3.closingSelector = n3, r3.openWindow(), r3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function(t10, e4, n3, r3, i3) {
      this.openWindow(i3);
    }, e3.prototype.notifyError = function(t10) {
      this._error(t10);
    }, e3.prototype.notifyComplete = function(t10) {
      this.openWindow(t10);
    }, e3.prototype._next = function(t10) {
      this.window.next(t10);
    }, e3.prototype._error = function(t10) {
      this.window.error(t10), this.destination.error(t10), this.unsubscribeClosingNotification();
    }, e3.prototype._complete = function() {
      this.window.complete(), this.destination.complete(), this.unsubscribeClosingNotification();
    }, e3.prototype.unsubscribeClosingNotification = function() {
      this.closingNotification && this.closingNotification.unsubscribe();
    }, e3.prototype.openWindow = function(t10) {
      void 0 === t10 && (t10 = null), t10 && (this.remove(t10), t10.unsubscribe());
      var e4 = this.window;
      e4 && e4.complete();
      var n3, r3 = this.window = new V();
      this.destination.next(r3);
      try {
        n3 = (0, this.closingSelector)();
      } catch (t11) {
        return this.destination.error(t11), void this.window.error(t11);
      }
      this.add(this.closingNotification = Qt(this, n3));
    }, e3;
  }(Ut);
  var ji = function() {
    function t9(t10, e3) {
      this.observables = t10, this.project = e3;
    }
    return t9.prototype.call = function(t10, e3) {
      return e3.subscribe(new Oi(t10, this.observables, this.project));
    }, t9;
  }();
  var Oi = function(t9) {
    function e3(e4, n3, r3) {
      var i3 = t9.call(this, e4) || this;
      i3.observables = n3, i3.project = r3, i3.toRespond = [];
      var o3 = n3.length;
      i3.values = new Array(o3);
      for (var s3 = 0; s3 < o3; s3++)
        i3.toRespond.push(s3);
      for (s3 = 0; s3 < o3; s3++) {
        var u3 = n3[s3];
        i3.add(Qt(i3, u3, void 0, s3));
      }
      return i3;
    }
    return o(e3, t9), e3.prototype.notifyNext = function(t10, e4, n3) {
      this.values[n3] = e4;
      var r3 = this.toRespond;
      if (r3.length > 0) {
        var i3 = r3.indexOf(n3);
        -1 !== i3 && r3.splice(i3, 1);
      }
    }, e3.prototype.notifyComplete = function() {
    }, e3.prototype._next = function(t10) {
      if (0 === this.toRespond.length) {
        var e4 = [t10].concat(this.values);
        this.project ? this._tryProject(e4) : this.destination.next(e4);
      }
    }, e3.prototype._tryProject = function(t10) {
      var e4;
      try {
        e4 = this.project.apply(this, t10);
      } catch (t11) {
        return void this.destination.error(t11);
      }
      this.destination.next(e4);
    }, e3;
  }(Ut);
  var Pi = Object.freeze({ __proto__: null, audit: De, auditTime: function(t9, e3) {
    return void 0 === e3 && (e3 = St), De(function() {
      return Ie(t9, e3);
    });
  }, buffer: function(t9) {
    return function(e3) {
      return e3.lift(new Be(t9));
    };
  }, bufferCount: function(t9, e3) {
    return void 0 === e3 && (e3 = null), function(n3) {
      return n3.lift(new Ye(t9, e3));
    };
  }, bufferTime: function(t9) {
    var e3 = arguments.length, n3 = St;
    X(arguments[arguments.length - 1]) && (n3 = arguments[arguments.length - 1], e3--);
    var r3 = null;
    e3 >= 2 && (r3 = arguments[1]);
    var i3 = Number.POSITIVE_INFINITY;
    return e3 >= 3 && (i3 = arguments[2]), function(e4) {
      return e4.lift(new Le(t9, r3, i3, n3));
    };
  }, bufferToggle: function(t9, e3) {
    return function(n3) {
      return n3.lift(new Ze(t9, e3));
    };
  }, bufferWhen: function(t9) {
    return function(e3) {
      return e3.lift(new tn(t9));
    };
  }, catchError: function(t9) {
    return function(e3) {
      var n3 = new nn(t9), r3 = e3.lift(n3);
      return n3.caught = r3;
    };
  }, combineAll: function(t9) {
    return function(e3) {
      return e3.lift(new Xt(t9));
    };
  }, combineLatest: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = null;
    return "function" == typeof t9[t9.length - 1] && (n3 = t9.pop()), 1 === t9.length && l(t9[0]) && (t9 = t9[0].slice()), function(e4) {
      return e4.lift.call(te([e4].concat(t9)), new Xt(n3));
    };
  }, concat: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return function(e4) {
      return e4.lift.call(he.apply(void 0, [e4].concat(t9)));
    };
  }, concatAll: ae, concatMap: on, concatMapTo: function(t9, e3) {
    return on(function() {
      return t9;
    }, e3);
  }, count: function(t9) {
    return function(e3) {
      return e3.lift(new sn(t9, e3));
    };
  }, debounce: function(t9) {
    return function(e3) {
      return e3.lift(new cn(t9));
    };
  }, debounceTime: function(t9, e3) {
    return void 0 === e3 && (e3 = St), function(n3) {
      return n3.lift(new hn(t9, e3));
    };
  }, defaultIfEmpty: pn, delay: function(t9, e3) {
    void 0 === e3 && (e3 = St);
    var n3 = vn(t9) ? +t9 - e3.now() : Math.abs(t9);
    return function(t10) {
      return t10.lift(new yn(n3, e3));
    };
  }, delayWhen: function(t9, e3) {
    return e3 ? function(n3) {
      return new gn(n3, e3).lift(new xn(t9));
    } : function(e4) {
      return e4.lift(new xn(t9));
    };
  }, dematerialize: function() {
    return function(t9) {
      return t9.lift(new En());
    };
  }, distinct: function(t9, e3) {
    return function(n3) {
      return n3.lift(new Nn(t9, e3));
    };
  }, distinctUntilChanged: In, distinctUntilKeyChanged: function(t9, e3) {
    return In(function(n3, r3) {
      return e3 ? e3(n3[t9], r3[t9]) : n3[t9] === r3[t9];
    });
  }, elementAt: function(t9, e3) {
    if (t9 < 0)
      throw new Ot();
    var n3 = arguments.length >= 2;
    return function(r3) {
      return r3.pipe(_e(function(e4, n4) {
        return n4 === t9;
      }), Fn(1), n3 ? pn(e3) : On(function() {
        return new Ot();
      }));
    };
  }, endWith: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return function(e4) {
      return he(e4, nt.apply(void 0, t9));
    };
  }, every: function(t9, e3) {
    return function(n3) {
      return n3.lift(new Dn(t9, e3, n3));
    };
  }, exhaust: function() {
    return function(t9) {
      return t9.lift(new zn());
    };
  }, exhaustMap: function t7(e3, n3) {
    return n3 ? function(r3) {
      return r3.pipe(t7(function(t9, r4) {
        return te(e3(t9, r4)).pipe(kt(function(e4, i3) {
          return n3(t9, e4, r4, i3);
        }));
      }));
    } : function(t9) {
      return t9.lift(new Un(e3));
    };
  }, expand: function(t9, e3, n3) {
    return void 0 === e3 && (e3 = Number.POSITIVE_INFINITY), e3 = (e3 || 0) < 1 ? Number.POSITIVE_INFINITY : e3, function(r3) {
      return r3.lift(new Gn(t9, e3, n3));
    };
  }, filter: _e, finalize: function(t9) {
    return function(e3) {
      return e3.lift(new Ln(t9));
    };
  }, find: function(t9, e3) {
    if ("function" != typeof t9)
      throw new TypeError("predicate is not a function");
    return function(n3) {
      return n3.lift(new Kn(t9, n3, false, e3));
    };
  }, findIndex: function(t9, e3) {
    return function(n3) {
      return n3.lift(new Kn(t9, n3, true, e3));
    };
  }, first: function(t9, e3) {
    var n3 = arguments.length >= 2;
    return function(r3) {
      return r3.pipe(t9 ? _e(function(e4, n4) {
        return t9(e4, n4, r3);
      }) : _, Fn(1), n3 ? pn(e3) : On(function() {
        return new Pt();
      }));
    };
  }, groupBy: function(t9, e3, n3, r3) {
    return function(i3) {
      return i3.lift(new M(t9, e3, n3, r3));
    };
  }, ignoreElements: function() {
    return function(t9) {
      return t9.lift(new Jn());
    };
  }, isEmpty: function() {
    return function(t9) {
      return t9.lift(new Zn());
    };
  }, last: function(t9, e3) {
    var n3 = arguments.length >= 2;
    return function(r3) {
      return r3.pipe(t9 ? _e(function(e4, n4) {
        return t9(e4, n4, r3);
      }) : _, tr(1), n3 ? pn(e3) : On(function() {
        return new Pt();
      }));
    };
  }, map: kt, mapTo: function(t9) {
    return function(e3) {
      return e3.lift(new rr(t9));
    };
  }, materialize: function() {
    return function(t9) {
      return t9.lift(new or());
    };
  }, max: function(t9) {
    return hr("function" == typeof t9 ? function(e3, n3) {
      return t9(e3, n3) > 0 ? e3 : n3;
    } : function(t10, e3) {
      return t10 > e3 ? t10 : e3;
    });
  }, merge: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return function(e4) {
      return e4.lift.call(ye.apply(void 0, [e4].concat(t9)));
    };
  }, mergeAll: ce, mergeMap: ie, flatMap: ue, mergeMapTo: function(t9, e3, n3) {
    return void 0 === n3 && (n3 = Number.POSITIVE_INFINITY), "function" == typeof e3 ? ie(function() {
      return t9;
    }, e3, n3) : ("number" == typeof e3 && (n3 = e3), ie(function() {
      return t9;
    }, n3));
  }, mergeScan: function(t9, e3, n3) {
    return void 0 === n3 && (n3 = Number.POSITIVE_INFINITY), function(r3) {
      return r3.lift(new lr(t9, e3, n3));
    };
  }, min: function(t9) {
    return hr("function" == typeof t9 ? function(e3, n3) {
      return t9(e3, n3) < 0 ? e3 : n3;
    } : function(t10, e3) {
      return t10 < e3 ? t10 : e3;
    });
  }, multicast: pr, observeOn: function(t9, e3) {
    return void 0 === e3 && (e3 = 0), function(n3) {
      return n3.lift(new st(t9, e3));
    };
  }, onErrorResumeNext: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return 1 === t9.length && l(t9[0]) && (t9 = t9[0]), function(e4) {
      return e4.lift(new br(t9));
    };
  }, pairwise: function() {
    return function(t9) {
      return t9.lift(new yr());
    };
  }, partition: function(t9, e3) {
    return function(n3) {
      return [_e(t9, e3)(n3), _e(xe(t9, e3))(n3)];
    };
  }, pluck: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = t9.length;
    if (0 === n3)
      throw new Error("list of properties cannot be empty.");
    return function(e4) {
      return kt(wr(t9, n3))(e4);
    };
  }, publish: function(t9) {
    return t9 ? pr(function() {
      return new V();
    }, t9) : pr(new V());
  }, publishBehavior: function(t9) {
    return function(e3) {
      return pr(new U(t9))(e3);
    };
  }, publishLast: function() {
    return function(t9) {
      return pr(new lt())(t9);
    };
  }, publishReplay: function(t9, e3, n3, r3) {
    n3 && "function" != typeof n3 && (r3 = n3);
    var i3 = "function" == typeof n3 ? n3 : void 0, o3 = new at(t9, e3, r3);
    return function(t10) {
      return pr(function() {
        return o3;
      }, i3)(t10);
    };
  }, race: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return function(e4) {
      return 1 === t9.length && l(t9[0]) && (t9 = t9[0]), e4.lift.call(Ee.apply(void 0, [e4].concat(t9)));
    };
  }, reduce: hr, repeat: function(t9) {
    return void 0 === t9 && (t9 = -1), function(e3) {
      return 0 === t9 ? J() : t9 < 0 ? e3.lift(new xr(-1, e3)) : e3.lift(new xr(t9 - 1, e3));
    };
  }, repeatWhen: function(t9) {
    return function(e3) {
      return e3.lift(new gr(t9));
    };
  }, retry: function(t9) {
    return void 0 === t9 && (t9 = -1), function(e3) {
      return e3.lift(new Er(t9, e3));
    };
  }, retryWhen: function(t9) {
    return function(e3) {
      return e3.lift(new Nr(t9, e3));
    };
  }, refCount: O, sample: function(t9) {
    return function(e3) {
      return e3.lift(new Ir(t9));
    };
  }, sampleTime: function(t9, e3) {
    return void 0 === e3 && (e3 = St), function(n3) {
      return n3.lift(new jr(t9, e3));
    };
  }, scan: ur, sequenceEqual: function(t9, e3) {
    return function(n3) {
      return n3.lift(new Ar(t9, e3));
    };
  }, share: function() {
    return function(t9) {
      return O()(pr(Rr)(t9));
    };
  }, shareReplay: function(t9, e3, n3) {
    var r3;
    return r3 = t9 && "object" == typeof t9 ? t9 : { bufferSize: t9, windowTime: e3, refCount: false, scheduler: n3 }, function(t10) {
      return t10.lift(function(t11) {
        var e4, n4, r4 = t11.bufferSize, i3 = void 0 === r4 ? Number.POSITIVE_INFINITY : r4, o3 = t11.windowTime, s3 = void 0 === o3 ? Number.POSITIVE_INFINITY : o3, u3 = t11.refCount, c3 = t11.scheduler, a3 = 0, h3 = false, l3 = false;
        return function(t12) {
          var r5;
          a3++, !e4 || h3 ? (h3 = false, e4 = new at(i3, s3, c3), r5 = e4.subscribe(this), n4 = t12.subscribe({ next: function(t13) {
            e4.next(t13);
          }, error: function(t13) {
            h3 = true, e4.error(t13);
          }, complete: function() {
            l3 = true, n4 = void 0, e4.complete();
          } }), l3 && (n4 = void 0)) : r5 = e4.subscribe(this), this.add(function() {
            a3--, r5.unsubscribe(), r5 = void 0, n4 && !l3 && u3 && 0 === a3 && (n4.unsubscribe(), n4 = void 0, e4 = void 0);
          });
        };
      }(r3));
    };
  }, single: function(t9) {
    return function(e3) {
      return e3.lift(new Mr(t9, e3));
    };
  }, skip: function(t9) {
    return function(e3) {
      return e3.lift(new Wr(t9));
    };
  }, skipLast: function(t9) {
    return function(e3) {
      return e3.lift(new Br(t9));
    };
  }, skipUntil: function(t9) {
    return function(e3) {
      return e3.lift(new Yr(t9));
    };
  }, skipWhile: function(t9) {
    return function(e3) {
      return e3.lift(new qr(t9));
    };
  }, startWith: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    var n3 = t9[t9.length - 1];
    return X(n3) ? (t9.pop(), function(e4) {
      return he(t9, e4, n3);
    }) : function(e4) {
      return he(t9, e4);
    };
  }, subscribeOn: function(t9, e3) {
    return void 0 === e3 && (e3 = 0), function(n3) {
      return n3.lift(new Kr(t9, e3));
    };
  }, switchAll: function() {
    return Qr(_);
  }, switchMap: Qr, switchMapTo: function(t9, e3) {
    return e3 ? Qr(function() {
      return t9;
    }, e3) : Qr(function() {
      return t9;
    });
  }, take: Fn, takeLast: tr, takeUntil: function(t9) {
    return function(e3) {
      return e3.lift(new Zr(t9));
    };
  }, takeWhile: function(t9, e3) {
    return void 0 === e3 && (e3 = false), function(n3) {
      return n3.lift(new ti(t9, e3));
    };
  }, tap: function(t9, e3, n3) {
    return function(r3) {
      return r3.lift(new ni(t9, e3, n3));
    };
  }, throttle: function(t9, e3) {
    return void 0 === e3 && (e3 = ii), function(n3) {
      return n3.lift(new oi(t9, !!e3.leading, !!e3.trailing));
    };
  }, throttleTime: function(t9, e3, n3) {
    return void 0 === e3 && (e3 = St), void 0 === n3 && (n3 = ii), function(r3) {
      return r3.lift(new ui(t9, e3, n3.leading, n3.trailing));
    };
  }, throwIfEmpty: On, timeInterval: function(t9) {
    return void 0 === t9 && (t9 = St), function(e3) {
      return le(function() {
        return e3.pipe(ur(function(e4, n3) {
          var r3 = e4.current;
          return { value: n3, current: t9.now(), last: r3 };
        }, { current: t9.now(), value: void 0, last: void 0 }), kt(function(t10) {
          var e4 = t10.current, n3 = t10.last, r3 = t10.value;
          return new hi(r3, e4 - n3);
        }));
      });
    };
  }, timeout: function(t9, e3) {
    return void 0 === e3 && (e3 = St), li(t9, rt(new At()), e3);
  }, timeoutWith: li, timestamp: function(t9) {
    return void 0 === t9 && (t9 = St), kt(function(e3) {
      return new di(e3, t9.now());
    });
  }, toArray: function() {
    return hr(bi, []);
  }, window: function(t9) {
    return function(e3) {
      return e3.lift(new vi(t9));
    };
  }, windowCount: function(t9, e3) {
    return void 0 === e3 && (e3 = 0), function(n3) {
      return n3.lift(new mi(t9, e3));
    };
  }, windowTime: function(t9) {
    var e3 = St, n3 = null, r3 = Number.POSITIVE_INFINITY;
    return X(arguments[3]) && (e3 = arguments[3]), X(arguments[2]) ? e3 = arguments[2] : be(arguments[2]) && (r3 = Number(arguments[2])), X(arguments[1]) ? e3 = arguments[1] : be(arguments[1]) && (n3 = Number(arguments[1])), function(i3) {
      return i3.lift(new xi(t9, n3, r3, e3));
    };
  }, windowToggle: function(t9, e3) {
    return function(n3) {
      return n3.lift(new Ni(t9, e3));
    };
  }, windowWhen: function(t9) {
    return function(e3) {
      return e3.lift(new Ii(t9));
    };
  }, withLatestFrom: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return function(e4) {
      var n3;
      "function" == typeof t9[t9.length - 1] && (n3 = t9.pop());
      var r3 = t9;
      return e4.lift(new ji(r3, n3));
    };
  }, zip: function() {
    for (var t9 = [], e3 = 0; e3 < arguments.length; e3++)
      t9[e3] = arguments[e3];
    return function(e4) {
      return e4.lift.call(je.apply(void 0, [e4].concat(t9)));
    };
  }, zipAll: function(t9) {
    return function(e3) {
      return e3.lift(new Oe(t9));
    };
  } });
  var Ai = n(Pi);
  var ki = {};
  Object.defineProperty(ki, "__esModule", { value: true });
  var Fi = Ai;
  function Ri(t9) {
    for (var e3 = [], n3 = 0; n3 < t9.length; n3++)
      n3 % 3 == 0 ? e3.push(t9[n3] << 4 | t9[n3 + 1] >> 4) : (e3.push((15 & t9[n3]) << 8 | t9[n3 + 1]), n3++);
    return e3;
  }
  function Mi(t9) {
    for (var e3 = [], n3 = 0; n3 < t9.length; n3 += 3)
      e3.push(t9[n3] << 16 | t9[n3 + 1] << 8 | t9[n3 + 2]);
    return e3;
  }
  function Di(t9, e3) {
    function n3(n4) {
      return { x: e3 * t9.getInt16(n4), y: e3 * t9.getInt16(n4 + 2), z: e3 * t9.getInt16(n4 + 4) };
    }
    return { sequenceId: t9.getUint16(0), samples: [n3(2), n3(8), n3(14)] };
  }
  ki.parseControl = function(t9) {
    return t9.pipe(Fi.concatMap(function(t10) {
      return t10.split("");
    }), Fi.scan(function(t10, e3) {
      return t10.indexOf("}") >= 0 ? e3 : t10 + e3;
    }, ""), Fi.filter(function(t10) {
      return t10.indexOf("}") >= 0;
    }), Fi.map(function(t10) {
      return JSON.parse(t10);
    }));
  }, ki.decodeUnsigned12BitData = Ri, ki.decodeUnsigned24BitData = Mi, ki.decodeEEGSamples = function(t9) {
    return Ri(t9).map(function(t10) {
      return 0.48828125 * (t10 - 2048);
    });
  }, ki.decodePPGSamples = function(t9) {
    return Mi(t9);
  }, ki.parseTelemetry = function(t9) {
    return { sequenceId: t9.getUint16(0), batteryLevel: t9.getUint16(2) / 512, fuelGaugeVoltage: 2.2 * t9.getUint16(4), temperature: t9.getUint16(8) };
  }, ki.parseAccelerometer = function(t9) {
    return Di(t9, 610352e-10);
  }, ki.parseGyroscope = function(t9) {
    return Di(t9, 74768e-7);
  };
  var Wi = {};
  var zi = e && e.__awaiter || function(t9, e3, n3, r3) {
    return new (n3 || (n3 = Promise))(function(i3, o3) {
      function s3(t10) {
        try {
          c3(r3.next(t10));
        } catch (t11) {
          o3(t11);
        }
      }
      function u3(t10) {
        try {
          c3(r3.throw(t10));
        } catch (t11) {
          o3(t11);
        }
      }
      function c3(t10) {
        t10.done ? i3(t10.value) : new n3(function(e4) {
          e4(t10.value);
        }).then(s3, u3);
      }
      c3((r3 = r3.apply(t9, e3 || [])).next());
    });
  };
  var Bi = e && e.__generator || function(t9, e3) {
    var n3, r3, i3, o3, s3 = { label: 0, sent: function() {
      if (1 & i3[0])
        throw i3[1];
      return i3[1];
    }, trys: [], ops: [] };
    return o3 = { next: u3(0), throw: u3(1), return: u3(2) }, "function" == typeof Symbol && (o3[Symbol.iterator] = function() {
      return this;
    }), o3;
    function u3(o4) {
      return function(u4) {
        return function(o5) {
          if (n3)
            throw new TypeError("Generator is already executing.");
          for (; s3; )
            try {
              if (n3 = 1, r3 && (i3 = 2 & o5[0] ? r3.return : o5[0] ? r3.throw || ((i3 = r3.return) && i3.call(r3), 0) : r3.next) && !(i3 = i3.call(r3, o5[1])).done)
                return i3;
              switch (r3 = 0, i3 && (o5 = [2 & o5[0], i3.value]), o5[0]) {
                case 0:
                case 1:
                  i3 = o5;
                  break;
                case 4:
                  return s3.label++, { value: o5[1], done: false };
                case 5:
                  s3.label++, r3 = o5[1], o5 = [0];
                  continue;
                case 7:
                  o5 = s3.ops.pop(), s3.trys.pop();
                  continue;
                default:
                  if (!(i3 = s3.trys, (i3 = i3.length > 0 && i3[i3.length - 1]) || 6 !== o5[0] && 2 !== o5[0])) {
                    s3 = 0;
                    continue;
                  }
                  if (3 === o5[0] && (!i3 || o5[1] > i3[0] && o5[1] < i3[3])) {
                    s3.label = o5[1];
                    break;
                  }
                  if (6 === o5[0] && s3.label < i3[1]) {
                    s3.label = i3[1], i3 = o5;
                    break;
                  }
                  if (i3 && s3.label < i3[2]) {
                    s3.label = i3[2], s3.ops.push(o5);
                    break;
                  }
                  i3[2] && s3.ops.pop(), s3.trys.pop();
                  continue;
              }
              o5 = e3.call(t9, s3);
            } catch (t10) {
              o5 = [6, t10], r3 = 0;
            } finally {
              n3 = i3 = 0;
            }
          if (5 & o5[0])
            throw o5[1];
          return { value: o5[0] ? o5[1] : void 0, done: true };
        }([o4, u4]);
      };
    }
  };
  Object.defineProperty(Wi, "__esModule", { value: true });
  var Ui = Me;
  var Yi = Ai;
  Wi.decodeResponse = function(t9) {
    return new TextDecoder().decode(t9.subarray(1, 1 + t9[0]));
  }, Wi.encodeCommand = function(t9) {
    var e3 = new TextEncoder().encode("X" + t9 + "\n");
    return e3[0] = e3.length - 1, e3;
  }, Wi.observableCharacteristic = function(t9) {
    return zi(this, void 0, void 0, function() {
      var e3;
      return Bi(this, function(n3) {
        switch (n3.label) {
          case 0:
            return [4, t9.startNotifications()];
          case 1:
            return n3.sent(), e3 = Ui.fromEvent(t9.service.device, "gattserverdisconnected"), [2, Ui.fromEvent(t9, "characteristicvaluechanged").pipe(Yi.takeUntil(e3), Yi.map(function(t10) {
              return t10.target.value;
            }))];
        }
      });
    });
  };
  var Gi = {};
  Object.defineProperty(Gi, "__esModule", { value: true });
  var qi = Me;
  var Li = Ai;
  var Hi = r;
  Gi.zipSamples = function(t9) {
    var e3 = [], n3 = null;
    return t9.pipe(Li.mergeMap(function(t10) {
      if (t10.timestamp !== n3 && (n3 = t10.timestamp, e3.length)) {
        var r3 = qi.from([e3.slice()]);
        return e3.splice(0, e3.length, t10), r3;
      }
      return e3.push(t10), qi.from([]);
    }), Li.concat(qi.from([e3])), Li.mergeMap(function(t10) {
      var e4 = t10[0].samples.map(function(e5, n4) {
        for (var r3 = [NaN, NaN, NaN, NaN, NaN], i3 = 0, o3 = t10; i3 < o3.length; i3++) {
          var s3 = o3[i3];
          r3[s3.electrode] = s3.samples[n4];
        }
        return { data: r3, index: t10[0].index, timestamp: t10[0].timestamp + 1e3 * n4 / Hi.EEG_FREQUENCY };
      });
      return qi.from(e4);
    }));
  };
  var Ki = {};
  Object.defineProperty(Ki, "__esModule", { value: true });
  var Qi = Me;
  var Ji = Ai;
  var Xi = r;
  Ki.zipSamplesPpg = function(t9) {
    var e3 = [], n3 = null;
    return t9.pipe(Ji.mergeMap(function(t10) {
      if (t10.timestamp !== n3 && (n3 = t10.timestamp, e3.length)) {
        var r3 = Qi.from([e3.slice()]);
        return e3.splice(0, e3.length, t10), r3;
      }
      return e3.push(t10), Qi.from([]);
    }), Ji.concat(Qi.from([e3])), Ji.mergeMap(function(t10) {
      var e4 = t10[0].samples.map(function(e5, n4) {
        for (var r3 = [NaN, NaN, NaN], i3 = 0, o3 = t10; i3 < o3.length; i3++) {
          var s3 = o3[i3];
          r3[s3.ppgChannel] = s3.samples[n4];
        }
        return { data: r3, index: t10[0].index, timestamp: t10[0].timestamp + 1e3 * n4 / Xi.PPG_FREQUENCY };
      });
      return Qi.from(e4);
    }));
  }, function(t9) {
    var n3 = e && e.__awaiter || function(t10, e3, n4, r4) {
      return new (n4 || (n4 = Promise))(function(i4, o4) {
        function s4(t11) {
          try {
            c4(r4.next(t11));
          } catch (t12) {
            o4(t12);
          }
        }
        function u4(t11) {
          try {
            c4(r4.throw(t11));
          } catch (t12) {
            o4(t12);
          }
        }
        function c4(t11) {
          t11.done ? i4(t11.value) : new n4(function(e4) {
            e4(t11.value);
          }).then(s4, u4);
        }
        c4((r4 = r4.apply(t10, e3 || [])).next());
      });
    }, r3 = e && e.__generator || function(t10, e3) {
      var n4, r4, i4, o4, s4 = { label: 0, sent: function() {
        if (1 & i4[0])
          throw i4[1];
        return i4[1];
      }, trys: [], ops: [] };
      return o4 = { next: u4(0), throw: u4(1), return: u4(2) }, "function" == typeof Symbol && (o4[Symbol.iterator] = function() {
        return this;
      }), o4;
      function u4(o5) {
        return function(u5) {
          return function(o6) {
            if (n4)
              throw new TypeError("Generator is already executing.");
            for (; s4; )
              try {
                if (n4 = 1, r4 && (i4 = 2 & o6[0] ? r4.return : o6[0] ? r4.throw || ((i4 = r4.return) && i4.call(r4), 0) : r4.next) && !(i4 = i4.call(r4, o6[1])).done)
                  return i4;
                switch (r4 = 0, i4 && (o6 = [2 & o6[0], i4.value]), o6[0]) {
                  case 0:
                  case 1:
                    i4 = o6;
                    break;
                  case 4:
                    return s4.label++, { value: o6[1], done: false };
                  case 5:
                    s4.label++, r4 = o6[1], o6 = [0];
                    continue;
                  case 7:
                    o6 = s4.ops.pop(), s4.trys.pop();
                    continue;
                  default:
                    if (!(i4 = s4.trys, (i4 = i4.length > 0 && i4[i4.length - 1]) || 6 !== o6[0] && 2 !== o6[0])) {
                      s4 = 0;
                      continue;
                    }
                    if (3 === o6[0] && (!i4 || o6[1] > i4[0] && o6[1] < i4[3])) {
                      s4.label = o6[1];
                      break;
                    }
                    if (6 === o6[0] && s4.label < i4[1]) {
                      s4.label = i4[1], i4 = o6;
                      break;
                    }
                    if (i4 && s4.label < i4[2]) {
                      s4.label = i4[2], s4.ops.push(o6);
                      break;
                    }
                    i4[2] && s4.ops.pop(), s4.trys.pop();
                    continue;
                }
                o6 = e3.call(t10, s4);
              } catch (t11) {
                o6 = [6, t11], r4 = 0;
              } finally {
                n4 = i4 = 0;
              }
            if (5 & o6[0])
              throw o6[1];
            return { value: o6[0] ? o6[1] : void 0, done: true };
          }([o5, u5]);
        };
      }
    };
    Object.defineProperty(t9, "__esModule", { value: true });
    var i3 = Me, o3 = Ai, s3 = ki, u3 = Wi, c3 = Gi;
    t9.zipSamples = c3.zipSamples;
    var a3 = Ki;
    t9.zipSamplesPpg = a3.zipSamplesPpg, t9.MUSE_SERVICE = 65165;
    var h3 = ["273e000f-4c4d-454d-96be-f03bac821358", "273e0010-4c4d-454d-96be-f03bac821358", "273e0011-4c4d-454d-96be-f03bac821358"];
    t9.PPG_FREQUENCY = 64, t9.PPG_SAMPLES_PER_READING = 6;
    var l3 = ["273e0003-4c4d-454d-96be-f03bac821358", "273e0004-4c4d-454d-96be-f03bac821358", "273e0005-4c4d-454d-96be-f03bac821358", "273e0006-4c4d-454d-96be-f03bac821358", "273e0007-4c4d-454d-96be-f03bac821358"];
    t9.EEG_FREQUENCY = 256, t9.EEG_SAMPLES_PER_READING = 12, t9.ppgChannelNames = ["ambient", "infrared", "red"], t9.channelNames = ["TP9", "AF7", "AF8", "TP10", "AUX"];
    var f3 = function() {
      function e3() {
        this.enableAux = false, this.enablePpg = false, this.deviceName = "", this.connectionStatus = new i3.BehaviorSubject(false), this.gatt = null, this.lastIndex = null, this.lastTimestamp = null;
      }
      return e3.prototype.connect = function(e4) {
        return n3(this, void 0, void 0, function() {
          var n4, c4, a4, f4, p3, d3, b3, v3, y3, m3, w3, x3, _3, g3, S3, E3, C3, N3, T3, I3, V3, j3 = this;
          return r3(this, function(O3) {
            switch (O3.label) {
              case 0:
                return e4 ? (this.gatt = e4, [3, 4]) : [3, 1];
              case 1:
                return [4, navigator.bluetooth.requestDevice({ filters: [{ services: [t9.MUSE_SERVICE] }] })];
              case 2:
                return n4 = O3.sent(), c4 = this, [4, n4.gatt.connect()];
              case 3:
                c4.gatt = O3.sent(), O3.label = 4;
              case 4:
                return this.deviceName = this.gatt.device.name || null, [4, this.gatt.getPrimaryService(t9.MUSE_SERVICE)];
              case 5:
                return a4 = O3.sent(), i3.fromEvent(this.gatt.device, "gattserverdisconnected").pipe(o3.first()).subscribe(function() {
                  j3.gatt = null, j3.connectionStatus.next(false);
                }), f4 = this, [4, a4.getCharacteristic("273e0001-4c4d-454d-96be-f03bac821358")];
              case 6:
                return f4.controlChar = O3.sent(), p3 = this, [4, u3.observableCharacteristic(this.controlChar)];
              case 7:
                return p3.rawControlData = O3.sent().pipe(o3.map(function(t10) {
                  return u3.decodeResponse(new Uint8Array(t10.buffer));
                }), o3.share()), this.controlResponses = s3.parseControl(this.rawControlData), [4, a4.getCharacteristic("273e000b-4c4d-454d-96be-f03bac821358")];
              case 8:
                return d3 = O3.sent(), b3 = this, [4, u3.observableCharacteristic(d3)];
              case 9:
                return b3.telemetryData = O3.sent().pipe(o3.map(s3.parseTelemetry)), [4, a4.getCharacteristic("273e0009-4c4d-454d-96be-f03bac821358")];
              case 10:
                return v3 = O3.sent(), y3 = this, [4, u3.observableCharacteristic(v3)];
              case 11:
                return y3.gyroscopeData = O3.sent().pipe(o3.map(s3.parseGyroscope)), [4, a4.getCharacteristic("273e000a-4c4d-454d-96be-f03bac821358")];
              case 12:
                return m3 = O3.sent(), w3 = this, [4, u3.observableCharacteristic(m3)];
              case 13:
                if (w3.accelerometerData = O3.sent().pipe(o3.map(s3.parseAccelerometer)), this.eventMarkers = new i3.Subject(), !this.enablePpg)
                  return [3, 18];
                this.ppgCharacteristics = [], x3 = [], _3 = h3.length, g3 = function(e5) {
                  var n5, i4, c5, l4;
                  return r3(this, function(r4) {
                    switch (r4.label) {
                      case 0:
                        return n5 = h3[e5], [4, a4.getCharacteristic(n5)];
                      case 1:
                        return i4 = r4.sent(), l4 = (c5 = x3).push, [4, u3.observableCharacteristic(i4)];
                      case 2:
                        return l4.apply(c5, [r4.sent().pipe(o3.map(function(n6) {
                          var r5 = n6.getUint16(0);
                          return { index: r5, ppgChannel: e5, samples: s3.decodePPGSamples(new Uint8Array(n6.buffer).subarray(2)), timestamp: j3.getTimestamp(r5, t9.PPG_SAMPLES_PER_READING, t9.PPG_FREQUENCY) };
                        }))]), S3.ppgCharacteristics.push(i4), [2];
                    }
                  });
                }, S3 = this, E3 = 0, O3.label = 14;
              case 14:
                return E3 < _3 ? [5, g3(E3)] : [3, 17];
              case 15:
                O3.sent(), O3.label = 16;
              case 16:
                return E3++, [3, 14];
              case 17:
                this.ppgReadings = i3.merge.apply(void 0, x3), O3.label = 18;
              case 18:
                this.eegCharacteristics = [], C3 = [], N3 = this.enableAux ? l3.length : 4, T3 = function(e5) {
                  var n5, i4, c5, h4;
                  return r3(this, function(r4) {
                    switch (r4.label) {
                      case 0:
                        return n5 = l3[e5], [4, a4.getCharacteristic(n5)];
                      case 1:
                        return i4 = r4.sent(), h4 = (c5 = C3).push, [4, u3.observableCharacteristic(i4)];
                      case 2:
                        return h4.apply(c5, [r4.sent().pipe(o3.map(function(n6) {
                          var r5 = n6.getUint16(0);
                          return { electrode: e5, index: r5, samples: s3.decodeEEGSamples(new Uint8Array(n6.buffer).subarray(2)), timestamp: j3.getTimestamp(r5, t9.EEG_SAMPLES_PER_READING, t9.EEG_FREQUENCY) };
                        }))]), I3.eegCharacteristics.push(i4), [2];
                    }
                  });
                }, I3 = this, V3 = 0, O3.label = 19;
              case 19:
                return V3 < N3 ? [5, T3(V3)] : [3, 22];
              case 20:
                O3.sent(), O3.label = 21;
              case 21:
                return V3++, [3, 19];
              case 22:
                return this.eegReadings = i3.merge.apply(void 0, C3), this.connectionStatus.next(true), [2];
            }
          });
        });
      }, e3.prototype.sendCommand = function(t10) {
        return n3(this, void 0, void 0, function() {
          return r3(this, function(e4) {
            switch (e4.label) {
              case 0:
                return [4, this.controlChar.writeValue(u3.encodeCommand(t10))];
              case 1:
                return e4.sent(), [2];
            }
          });
        });
      }, e3.prototype.start = function() {
        return n3(this, void 0, void 0, function() {
          var t10;
          return r3(this, function(e4) {
            switch (e4.label) {
              case 0:
                return [4, this.pause()];
              case 1:
                return e4.sent(), t10 = "p21", this.enablePpg ? t10 = "p50" : this.enableAux && (t10 = "p20"), [4, this.controlChar.writeValue(u3.encodeCommand(t10))];
              case 2:
                return e4.sent(), [4, this.controlChar.writeValue(u3.encodeCommand("s"))];
              case 3:
                return e4.sent(), [4, this.resume()];
              case 4:
                return e4.sent(), [2];
            }
          });
        });
      }, e3.prototype.pause = function() {
        return n3(this, void 0, void 0, function() {
          return r3(this, function(t10) {
            switch (t10.label) {
              case 0:
                return [4, this.sendCommand("h")];
              case 1:
                return t10.sent(), [2];
            }
          });
        });
      }, e3.prototype.resume = function() {
        return n3(this, void 0, void 0, function() {
          return r3(this, function(t10) {
            switch (t10.label) {
              case 0:
                return [4, this.sendCommand("d")];
              case 1:
                return t10.sent(), [2];
            }
          });
        });
      }, e3.prototype.deviceInfo = function() {
        return n3(this, void 0, void 0, function() {
          var t10;
          return r3(this, function(e4) {
            switch (e4.label) {
              case 0:
                return t10 = this.controlResponses.pipe(o3.filter(function(t11) {
                  return !!t11.fw;
                }), o3.take(1)).toPromise(), [4, this.sendCommand("v1")];
              case 1:
                return e4.sent(), [2, t10];
            }
          });
        });
      }, e3.prototype.injectMarker = function(t10, e4) {
        return void 0 === e4 && (e4 = new Date().getTime()), n3(this, void 0, void 0, function() {
          return r3(this, function(n4) {
            switch (n4.label) {
              case 0:
                return [4, this.eventMarkers.next({ value: t10, timestamp: e4 })];
              case 1:
                return n4.sent(), [2];
            }
          });
        });
      }, e3.prototype.disconnect = function() {
        this.gatt && (this.lastIndex = null, this.lastTimestamp = null, this.gatt.disconnect(), this.connectionStatus.next(false));
      }, e3.prototype.getTimestamp = function(t10, e4, n4) {
        var r4 = 1 / n4 * 1e3 * e4;
        for (null !== this.lastIndex && null !== this.lastTimestamp || (this.lastIndex = t10, this.lastTimestamp = new Date().getTime() - r4); this.lastIndex - t10 > 4096; )
          t10 += 65536;
        return t10 === this.lastIndex ? this.lastTimestamp : t10 > this.lastIndex ? (this.lastTimestamp += r4 * (t10 - this.lastIndex), this.lastIndex = t10, this.lastTimestamp) : this.lastTimestamp - r4 * (this.lastIndex - t10);
      }, e3;
    }();
    t9.MuseClient = f3;
  }(r);
  var Zi = ["TP9", "AF7", "AF8", "TP10"];
  var $i = { label: "muse", device: r.MuseClient, onconnect: (e3) => t(void 0, void 0, void 0, function* () {
    let t9 = e3.device;
    yield t9.start(), t9.eegReadings.subscribe((t10) => {
      let n3 = {};
      n3[Zi[t10.electrode]] = t10.samples, e3.ondata(n3, t10.timestamp);
    });
  }), protocols: ["bluetooth"] };

  // ../htil/plugins/devices/muse/index.js
  var muse_default = (trigger) => trigger ? $i : void 0;

  // ../htil/plugins/devices/ganglion/index.js
  var ganglion_exports = {};
  __export(ganglion_exports, {
    default: () => ganglion_default
  });

  // node_modules/.cache/cdn.jsdelivr.net/npm/@brainsatplay/ganglion@0.0.2/dist/index.esm.js
  var e2 = function(t9, n3) {
    return e2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e3, t10) {
      e3.__proto__ = t10;
    } || function(e3, t10) {
      for (var n4 in t10)
        Object.prototype.hasOwnProperty.call(t10, n4) && (e3[n4] = t10[n4]);
    }, e2(t9, n3);
  };
  function t8(t9, n3) {
    if ("function" != typeof n3 && null !== n3)
      throw new TypeError("Class extends value " + String(n3) + " is not a constructor or null");
    function r3() {
      this.constructor = t9;
    }
    e2(t9, n3), t9.prototype = null === n3 ? Object.create(n3) : (r3.prototype = n3.prototype, new r3());
  }
  function n2(e3, t9, n3, r3) {
    return new (n3 || (n3 = Promise))(function(a3, o3) {
      function i3(e4) {
        try {
          l3(r3.next(e4));
        } catch (e5) {
          o3(e5);
        }
      }
      function c3(e4) {
        try {
          l3(r3.throw(e4));
        } catch (e5) {
          o3(e5);
        }
      }
      function l3(e4) {
        var t10;
        e4.done ? a3(e4.value) : (t10 = e4.value, t10 instanceof n3 ? t10 : new n3(function(e5) {
          e5(t10);
        })).then(i3, c3);
      }
      l3((r3 = r3.apply(e3, t9 || [])).next());
    });
  }
  function r2(e3, t9) {
    var n3, r3, a3, o3, i3 = { label: 0, sent: function() {
      if (1 & a3[0])
        throw a3[1];
      return a3[1];
    }, trys: [], ops: [] };
    return o3 = { next: c3(0), throw: c3(1), return: c3(2) }, "function" == typeof Symbol && (o3[Symbol.iterator] = function() {
      return this;
    }), o3;
    function c3(o4) {
      return function(c4) {
        return function(o5) {
          if (n3)
            throw new TypeError("Generator is already executing.");
          for (; i3; )
            try {
              if (n3 = 1, r3 && (a3 = 2 & o5[0] ? r3.return : o5[0] ? r3.throw || ((a3 = r3.return) && a3.call(r3), 0) : r3.next) && !(a3 = a3.call(r3, o5[1])).done)
                return a3;
              switch (r3 = 0, a3 && (o5 = [2 & o5[0], a3.value]), o5[0]) {
                case 0:
                case 1:
                  a3 = o5;
                  break;
                case 4:
                  return i3.label++, { value: o5[1], done: false };
                case 5:
                  i3.label++, r3 = o5[1], o5 = [0];
                  continue;
                case 7:
                  o5 = i3.ops.pop(), i3.trys.pop();
                  continue;
                default:
                  if (!(a3 = i3.trys, (a3 = a3.length > 0 && a3[a3.length - 1]) || 6 !== o5[0] && 2 !== o5[0])) {
                    i3 = 0;
                    continue;
                  }
                  if (3 === o5[0] && (!a3 || o5[1] > a3[0] && o5[1] < a3[3])) {
                    i3.label = o5[1];
                    break;
                  }
                  if (6 === o5[0] && i3.label < a3[1]) {
                    i3.label = a3[1], a3 = o5;
                    break;
                  }
                  if (a3 && i3.label < a3[2]) {
                    i3.label = a3[2], i3.ops.push(o5);
                    break;
                  }
                  a3[2] && i3.ops.pop(), i3.trys.pop();
                  continue;
              }
              o5 = t9.call(e3, i3);
            } catch (e4) {
              o5 = [6, e4], r3 = 0;
            } finally {
              n3 = a3 = 0;
            }
          if (5 & o5[0])
            throw o5[1];
          return { value: o5[0] ? o5[1] : void 0, done: true };
        }([o4, c4]);
      };
    }
  }
  function a2(e3) {
    var t9 = "function" == typeof Symbol && Symbol.iterator, n3 = t9 && e3[t9], r3 = 0;
    if (n3)
      return n3.call(e3);
    if (e3 && "number" == typeof e3.length)
      return { next: function() {
        return e3 && r3 >= e3.length && (e3 = void 0), { value: e3 && e3[r3++], done: !e3 };
      } };
    throw new TypeError(t9 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function o2(e3, t9) {
    var n3 = "function" == typeof Symbol && e3[Symbol.iterator];
    if (!n3)
      return e3;
    var r3, a3, o3 = n3.call(e3), i3 = [];
    try {
      for (; (void 0 === t9 || t9-- > 0) && !(r3 = o3.next()).done; )
        i3.push(r3.value);
    } catch (e4) {
      a3 = { error: e4 };
    } finally {
      try {
        r3 && !r3.done && (n3 = o3.return) && n3.call(o3);
      } finally {
        if (a3)
          throw a3.error;
      }
    }
    return i3;
  }
  function i2(e3, t9, n3) {
    if (n3 || 2 === arguments.length)
      for (var r3, a3 = 0, o3 = t9.length; a3 < o3; a3++)
        !r3 && a3 in t9 || (r3 || (r3 = Array.prototype.slice.call(t9, 0, a3)), r3[a3] = t9[a3]);
    return e3.concat(r3 || Array.prototype.slice.call(t9));
  }
  function c2(e3) {
    return this instanceof c2 ? (this.v = e3, this) : new c2(e3);
  }
  function l2(e3, t9, n3) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r3, a3 = n3.apply(e3, t9 || []), o3 = [];
    return r3 = {}, i3("next"), i3("throw"), i3("return"), r3[Symbol.asyncIterator] = function() {
      return this;
    }, r3;
    function i3(e4) {
      a3[e4] && (r3[e4] = function(t10) {
        return new Promise(function(n4, r4) {
          o3.push([e4, t10, n4, r4]) > 1 || l3(e4, t10);
        });
      });
    }
    function l3(e4, t10) {
      try {
        (n4 = a3[e4](t10)).value instanceof c2 ? Promise.resolve(n4.value.v).then(u3, s3) : f3(o3[0][2], n4);
      } catch (e5) {
        f3(o3[0][3], e5);
      }
      var n4;
    }
    function u3(e4) {
      l3("next", e4);
    }
    function s3(e4) {
      l3("throw", e4);
    }
    function f3(e4, t10) {
      e4(t10), o3.shift(), o3.length && l3(o3[0][0], o3[0][1]);
    }
  }
  function u2(e3) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var t9, n3 = e3[Symbol.asyncIterator];
    return n3 ? n3.call(e3) : (e3 = a2(e3), t9 = {}, r3("next"), r3("throw"), r3("return"), t9[Symbol.asyncIterator] = function() {
      return this;
    }, t9);
    function r3(n4) {
      t9[n4] = e3[n4] && function(t10) {
        return new Promise(function(r4, a3) {
          (function(e4, t11, n5, r5) {
            Promise.resolve(r5).then(function(t12) {
              e4({ value: t12, done: n5 });
            }, t11);
          })(r4, a3, (t10 = e3[n4](t10)).done, t10.value);
        });
      };
    }
  }
  function s2(e3, t9, n3) {
    return t9 in e3 ? Object.defineProperty(e3, t9, { value: n3, enumerable: true, configurable: true, writable: true }) : e3[t9] = n3, e3;
  }
  function f2(e3, t9) {
    (null == t9 || t9 > e3.length) && (t9 = e3.length);
    for (var n3 = 0, r3 = new Array(t9); n3 < t9; n3++)
      r3[n3] = e3[n3];
    return r3;
  }
  function C2(e3, t9) {
    return function(e4) {
      if (Array.isArray(e4))
        return e4;
    }(e3) || function(e4, t10) {
      var n3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
      if (null != n3) {
        var r3, a3, o3 = [], i3 = true, c3 = false;
        try {
          for (n3 = n3.call(e4); !(i3 = (r3 = n3.next()).done) && (o3.push(r3.value), !t10 || o3.length !== t10); i3 = true)
            ;
        } catch (e5) {
          c3 = true, a3 = e5;
        } finally {
          try {
            i3 || null == n3.return || n3.return();
          } finally {
            if (c3)
              throw a3;
          }
        }
        return o3;
      }
    }(e3, t9) || function(e4, t10) {
      if (e4) {
        if ("string" == typeof e4)
          return f2(e4, t10);
        var n3 = Object.prototype.toString.call(e4).slice(8, -1);
        return "Object" === n3 && e4.constructor && (n3 = e4.constructor.name), "Map" === n3 || "Set" === n3 ? Array.from(e4) : "Arguments" === n3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3) ? f2(e4, t10) : void 0;
      }
    }(e3, t9) || function() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function h2(e3, t9, n3, r3, a3, o3, i3) {
    try {
      var c3 = e3[o3](i3), l3 = c3.value;
    } catch (e4) {
      return void n3(e4);
    }
    c3.done ? t9(l3) : Promise.resolve(l3).then(r3, a3);
  }
  function d2(e3) {
    return function() {
      var t9 = this, n3 = arguments;
      return new Promise(function(r3, a3) {
        var o3 = e3.apply(t9, n3);
        function i3(e4) {
          h2(o3, r3, a3, i3, c3, "next", e4);
        }
        function c3(e4) {
          h2(o3, r3, a3, i3, c3, "throw", e4);
        }
        i3(void 0);
      });
    };
  }
  function m2(e3, t9) {
    if (!(e3 instanceof t9))
      throw new TypeError("Cannot call a class as a function");
  }
  function p2(e3, t9) {
    for (var n3 = 0; n3 < t9.length; n3++) {
      var r3 = t9[n3];
      r3.enumerable = r3.enumerable || false, r3.configurable = true, "value" in r3 && (r3.writable = true), Object.defineProperty(e3, r3.key, r3);
    }
  }
  var B2 = { exports: {} };
  !function(e3) {
    var t9 = function(e4) {
      var t10, n3 = Object.prototype, r3 = n3.hasOwnProperty, a3 = "function" == typeof Symbol ? Symbol : {}, o3 = a3.iterator || "@@iterator", i3 = a3.asyncIterator || "@@asyncIterator", c3 = a3.toStringTag || "@@toStringTag";
      function l3(e5, t11, n4) {
        return Object.defineProperty(e5, t11, { value: n4, enumerable: true, configurable: true, writable: true }), e5[t11];
      }
      try {
        l3({}, "");
      } catch (e5) {
        l3 = function(e6, t11, n4) {
          return e6[t11] = n4;
        };
      }
      function u3(e5, t11, n4, r4) {
        var a4 = t11 && t11.prototype instanceof p3 ? t11 : p3, o4 = Object.create(a4.prototype), i4 = new D3(r4 || []);
        return o4._invoke = function(e6, t12, n5) {
          var r5 = f3;
          return function(a5, o5) {
            if (r5 === h3)
              throw new Error("Generator is already running");
            if (r5 === d3) {
              if ("throw" === a5)
                throw o5;
              return E3();
            }
            for (n5.method = a5, n5.arg = o5; ; ) {
              var i5 = n5.delegate;
              if (i5) {
                var c4 = g3(i5, n5);
                if (c4) {
                  if (c4 === m3)
                    continue;
                  return c4;
                }
              }
              if ("next" === n5.method)
                n5.sent = n5._sent = n5.arg;
              else if ("throw" === n5.method) {
                if (r5 === f3)
                  throw r5 = d3, n5.arg;
                n5.dispatchException(n5.arg);
              } else
                "return" === n5.method && n5.abrupt("return", n5.arg);
              r5 = h3;
              var l4 = s3(e6, t12, n5);
              if ("normal" === l4.type) {
                if (r5 = n5.done ? d3 : C3, l4.arg === m3)
                  continue;
                return { value: l4.arg, done: n5.done };
              }
              "throw" === l4.type && (r5 = d3, n5.method = "throw", n5.arg = l4.arg);
            }
          };
        }(e5, n4, i4), o4;
      }
      function s3(e5, t11, n4) {
        try {
          return { type: "normal", arg: e5.call(t11, n4) };
        } catch (e6) {
          return { type: "throw", arg: e6 };
        }
      }
      e4.wrap = u3;
      var f3 = "suspendedStart", C3 = "suspendedYield", h3 = "executing", d3 = "completed", m3 = {};
      function p3() {
      }
      function B3() {
      }
      function y3() {
      }
      var I3 = {};
      l3(I3, o3, function() {
        return this;
      });
      var O3 = Object.getPrototypeOf, S3 = O3 && O3(O3(x3([])));
      S3 && S3 !== n3 && r3.call(S3, o3) && (I3 = S3);
      var b3 = y3.prototype = p3.prototype = Object.create(I3);
      function v3(e5) {
        ["next", "throw", "return"].forEach(function(t11) {
          l3(e5, t11, function(e6) {
            return this._invoke(t11, e6);
          });
        });
      }
      function w3(e5, t11) {
        function n4(a5, o4, i4, c4) {
          var l4 = s3(e5[a5], e5, o4);
          if ("throw" !== l4.type) {
            var u4 = l4.arg, f4 = u4.value;
            return f4 && "object" == typeof f4 && r3.call(f4, "__await") ? t11.resolve(f4.__await).then(function(e6) {
              n4("next", e6, i4, c4);
            }, function(e6) {
              n4("throw", e6, i4, c4);
            }) : t11.resolve(f4).then(function(e6) {
              u4.value = e6, i4(u4);
            }, function(e6) {
              return n4("throw", e6, i4, c4);
            });
          }
          c4(l4.arg);
        }
        var a4;
        this._invoke = function(e6, r4) {
          function o4() {
            return new t11(function(t12, a5) {
              n4(e6, r4, t12, a5);
            });
          }
          return a4 = a4 ? a4.then(o4, o4) : o4();
        };
      }
      function g3(e5, n4) {
        var r4 = e5.iterator[n4.method];
        if (r4 === t10) {
          if (n4.delegate = null, "throw" === n4.method) {
            if (e5.iterator.return && (n4.method = "return", n4.arg = t10, g3(e5, n4), "throw" === n4.method))
              return m3;
            n4.method = "throw", n4.arg = new TypeError("The iterator does not provide a 'throw' method");
          }
          return m3;
        }
        var a4 = s3(r4, e5.iterator, n4.arg);
        if ("throw" === a4.type)
          return n4.method = "throw", n4.arg = a4.arg, n4.delegate = null, m3;
        var o4 = a4.arg;
        return o4 ? o4.done ? (n4[e5.resultName] = o4.value, n4.next = e5.nextLoc, "return" !== n4.method && (n4.method = "next", n4.arg = t10), n4.delegate = null, m3) : o4 : (n4.method = "throw", n4.arg = new TypeError("iterator result is not an object"), n4.delegate = null, m3);
      }
      function P3(e5) {
        var t11 = { tryLoc: e5[0] };
        1 in e5 && (t11.catchLoc = e5[1]), 2 in e5 && (t11.finallyLoc = e5[2], t11.afterLoc = e5[3]), this.tryEntries.push(t11);
      }
      function k3(e5) {
        var t11 = e5.completion || {};
        t11.type = "normal", delete t11.arg, e5.completion = t11;
      }
      function D3(e5) {
        this.tryEntries = [{ tryLoc: "root" }], e5.forEach(P3, this), this.reset(true);
      }
      function x3(e5) {
        if (e5) {
          var n4 = e5[o3];
          if (n4)
            return n4.call(e5);
          if ("function" == typeof e5.next)
            return e5;
          if (!isNaN(e5.length)) {
            var a4 = -1, i4 = function n5() {
              for (; ++a4 < e5.length; )
                if (r3.call(e5, a4))
                  return n5.value = e5[a4], n5.done = false, n5;
              return n5.value = t10, n5.done = true, n5;
            };
            return i4.next = i4;
          }
        }
        return { next: E3 };
      }
      function E3() {
        return { value: t10, done: true };
      }
      return B3.prototype = y3, l3(b3, "constructor", y3), l3(y3, "constructor", B3), B3.displayName = l3(y3, c3, "GeneratorFunction"), e4.isGeneratorFunction = function(e5) {
        var t11 = "function" == typeof e5 && e5.constructor;
        return !!t11 && (t11 === B3 || "GeneratorFunction" === (t11.displayName || t11.name));
      }, e4.mark = function(e5) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(e5, y3) : (e5.__proto__ = y3, l3(e5, c3, "GeneratorFunction")), e5.prototype = Object.create(b3), e5;
      }, e4.awrap = function(e5) {
        return { __await: e5 };
      }, v3(w3.prototype), l3(w3.prototype, i3, function() {
        return this;
      }), e4.AsyncIterator = w3, e4.async = function(t11, n4, r4, a4, o4) {
        void 0 === o4 && (o4 = Promise);
        var i4 = new w3(u3(t11, n4, r4, a4), o4);
        return e4.isGeneratorFunction(n4) ? i4 : i4.next().then(function(e5) {
          return e5.done ? e5.value : i4.next();
        });
      }, v3(b3), l3(b3, c3, "Generator"), l3(b3, o3, function() {
        return this;
      }), l3(b3, "toString", function() {
        return "[object Generator]";
      }), e4.keys = function(e5) {
        var t11 = [];
        for (var n4 in e5)
          t11.push(n4);
        return t11.reverse(), function n5() {
          for (; t11.length; ) {
            var r4 = t11.pop();
            if (r4 in e5)
              return n5.value = r4, n5.done = false, n5;
          }
          return n5.done = true, n5;
        };
      }, e4.values = x3, D3.prototype = { constructor: D3, reset: function(e5) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t10, this.done = false, this.delegate = null, this.method = "next", this.arg = t10, this.tryEntries.forEach(k3), !e5)
          for (var n4 in this)
            "t" === n4.charAt(0) && r3.call(this, n4) && !isNaN(+n4.slice(1)) && (this[n4] = t10);
      }, stop: function() {
        this.done = true;
        var e5 = this.tryEntries[0].completion;
        if ("throw" === e5.type)
          throw e5.arg;
        return this.rval;
      }, dispatchException: function(e5) {
        if (this.done)
          throw e5;
        var n4 = this;
        function a4(r4, a5) {
          return c4.type = "throw", c4.arg = e5, n4.next = r4, a5 && (n4.method = "next", n4.arg = t10), !!a5;
        }
        for (var o4 = this.tryEntries.length - 1; o4 >= 0; --o4) {
          var i4 = this.tryEntries[o4], c4 = i4.completion;
          if ("root" === i4.tryLoc)
            return a4("end");
          if (i4.tryLoc <= this.prev) {
            var l4 = r3.call(i4, "catchLoc"), u4 = r3.call(i4, "finallyLoc");
            if (l4 && u4) {
              if (this.prev < i4.catchLoc)
                return a4(i4.catchLoc, true);
              if (this.prev < i4.finallyLoc)
                return a4(i4.finallyLoc);
            } else if (l4) {
              if (this.prev < i4.catchLoc)
                return a4(i4.catchLoc, true);
            } else {
              if (!u4)
                throw new Error("try statement without catch or finally");
              if (this.prev < i4.finallyLoc)
                return a4(i4.finallyLoc);
            }
          }
        }
      }, abrupt: function(e5, t11) {
        for (var n4 = this.tryEntries.length - 1; n4 >= 0; --n4) {
          var a4 = this.tryEntries[n4];
          if (a4.tryLoc <= this.prev && r3.call(a4, "finallyLoc") && this.prev < a4.finallyLoc) {
            var o4 = a4;
            break;
          }
        }
        o4 && ("break" === e5 || "continue" === e5) && o4.tryLoc <= t11 && t11 <= o4.finallyLoc && (o4 = null);
        var i4 = o4 ? o4.completion : {};
        return i4.type = e5, i4.arg = t11, o4 ? (this.method = "next", this.next = o4.finallyLoc, m3) : this.complete(i4);
      }, complete: function(e5, t11) {
        if ("throw" === e5.type)
          throw e5.arg;
        return "break" === e5.type || "continue" === e5.type ? this.next = e5.arg : "return" === e5.type ? (this.rval = this.arg = e5.arg, this.method = "return", this.next = "end") : "normal" === e5.type && t11 && (this.next = t11), m3;
      }, finish: function(e5) {
        for (var t11 = this.tryEntries.length - 1; t11 >= 0; --t11) {
          var n4 = this.tryEntries[t11];
          if (n4.finallyLoc === e5)
            return this.complete(n4.completion, n4.afterLoc), k3(n4), m3;
        }
      }, catch: function(e5) {
        for (var t11 = this.tryEntries.length - 1; t11 >= 0; --t11) {
          var n4 = this.tryEntries[t11];
          if (n4.tryLoc === e5) {
            var r4 = n4.completion;
            if ("throw" === r4.type) {
              var a4 = r4.arg;
              k3(n4);
            }
            return a4;
          }
        }
        throw new Error("illegal catch attempt");
      }, delegateYield: function(e5, n4, r4) {
        return this.delegate = { iterator: x3(e5), resultName: n4, nextLoc: r4 }, "next" === this.method && (this.arg = t10), m3;
      } }, e4;
    }(e3.exports);
    try {
      regeneratorRuntime = t9;
    } catch (e4) {
      "object" == typeof globalThis ? globalThis.regeneratorRuntime = t9 : Function("r", "regeneratorRuntime = r")(t9);
    }
  }(B2);
  var y2 = B2.exports;
  function I2(e3) {
    return "function" == typeof e3;
  }
  function O2(e3) {
    var t9 = e3(function(e4) {
      Error.call(e4), e4.stack = new Error().stack;
    });
    return t9.prototype = Object.create(Error.prototype), t9.prototype.constructor = t9, t9;
  }
  var S2 = O2(function(e3) {
    return function(t9) {
      e3(this), this.message = t9 ? t9.length + " errors occurred during unsubscription:\n" + t9.map(function(e4, t10) {
        return t10 + 1 + ") " + e4.toString();
      }).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t9;
    };
  });
  function b2(e3, t9) {
    if (e3) {
      var n3 = e3.indexOf(t9);
      0 <= n3 && e3.splice(n3, 1);
    }
  }
  var v2 = function() {
    function e3(e4) {
      this.initialTeardown = e4, this.closed = false, this._parentage = null, this._finalizers = null;
    }
    var t9;
    return e3.prototype.unsubscribe = function() {
      var e4, t10, n3, r3, c3;
      if (!this.closed) {
        this.closed = true;
        var l3 = this._parentage;
        if (l3)
          if (this._parentage = null, Array.isArray(l3))
            try {
              for (var u3 = a2(l3), s3 = u3.next(); !s3.done; s3 = u3.next()) {
                s3.value.remove(this);
              }
            } catch (t11) {
              e4 = { error: t11 };
            } finally {
              try {
                s3 && !s3.done && (t10 = u3.return) && t10.call(u3);
              } finally {
                if (e4)
                  throw e4.error;
              }
            }
          else
            l3.remove(this);
        var f3 = this.initialTeardown;
        if (I2(f3))
          try {
            f3();
          } catch (e5) {
            c3 = e5 instanceof S2 ? e5.errors : [e5];
          }
        var C3 = this._finalizers;
        if (C3) {
          this._finalizers = null;
          try {
            for (var h3 = a2(C3), d3 = h3.next(); !d3.done; d3 = h3.next()) {
              var m3 = d3.value;
              try {
                P2(m3);
              } catch (e5) {
                c3 = null != c3 ? c3 : [], e5 instanceof S2 ? c3 = i2(i2([], o2(c3)), o2(e5.errors)) : c3.push(e5);
              }
            }
          } catch (e5) {
            n3 = { error: e5 };
          } finally {
            try {
              d3 && !d3.done && (r3 = h3.return) && r3.call(h3);
            } finally {
              if (n3)
                throw n3.error;
            }
          }
        }
        if (c3)
          throw new S2(c3);
      }
    }, e3.prototype.add = function(t10) {
      var n3;
      if (t10 && t10 !== this)
        if (this.closed)
          P2(t10);
        else {
          if (t10 instanceof e3) {
            if (t10.closed || t10._hasParent(this))
              return;
            t10._addParent(this);
          }
          (this._finalizers = null !== (n3 = this._finalizers) && void 0 !== n3 ? n3 : []).push(t10);
        }
    }, e3.prototype._hasParent = function(e4) {
      var t10 = this._parentage;
      return t10 === e4 || Array.isArray(t10) && t10.includes(e4);
    }, e3.prototype._addParent = function(e4) {
      var t10 = this._parentage;
      this._parentage = Array.isArray(t10) ? (t10.push(e4), t10) : t10 ? [t10, e4] : e4;
    }, e3.prototype._removeParent = function(e4) {
      var t10 = this._parentage;
      t10 === e4 ? this._parentage = null : Array.isArray(t10) && b2(t10, e4);
    }, e3.prototype.remove = function(t10) {
      var n3 = this._finalizers;
      n3 && b2(n3, t10), t10 instanceof e3 && t10._removeParent(this);
    }, e3.EMPTY = ((t9 = new e3()).closed = true, t9), e3;
  }();
  var w2 = v2.EMPTY;
  function g2(e3) {
    return e3 instanceof v2 || e3 && "closed" in e3 && I2(e3.remove) && I2(e3.add) && I2(e3.unsubscribe);
  }
  function P2(e3) {
    I2(e3) ? e3() : e3.unsubscribe();
  }
  var k2 = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: false, useDeprecatedNextContext: false };
  var D2 = { setTimeout: function(e3, t9) {
    for (var n3 = [], r3 = 2; r3 < arguments.length; r3++)
      n3[r3 - 2] = arguments[r3];
    var a3 = D2.delegate;
    return (null == a3 ? void 0 : a3.setTimeout) ? a3.setTimeout.apply(a3, i2([e3, t9], o2(n3))) : setTimeout.apply(void 0, i2([e3, t9], o2(n3)));
  }, clearTimeout: function(e3) {
    var t9 = D2.delegate;
    return ((null == t9 ? void 0 : t9.clearTimeout) || clearTimeout)(e3);
  }, delegate: void 0 };
  function x2(e3) {
    D2.setTimeout(function() {
      throw e3;
    });
  }
  function E2() {
  }
  var A2 = N2("C", void 0, void 0);
  function N2(e3, t9, n3) {
    return { kind: e3, value: t9, error: n3 };
  }
  var T2 = null;
  function R2(e3) {
    if (k2.useDeprecatedSynchronousErrorHandling) {
      var t9 = !T2;
      if (t9 && (T2 = { errorThrown: false, error: null }), e3(), t9) {
        var n3 = T2, r3 = n3.errorThrown, a3 = n3.error;
        if (T2 = null, r3)
          throw a3;
      }
    } else
      e3();
  }
  var F2 = function(e3) {
    function n3(t9) {
      var n4 = e3.call(this) || this;
      return n4.isStopped = false, t9 ? (n4.destination = t9, g2(t9) && t9.add(n4)) : n4.destination = H2, n4;
    }
    return t8(n3, e3), n3.create = function(e4, t9, n4) {
      return new M2(e4, t9, n4);
    }, n3.prototype.next = function(e4) {
      this.isStopped ? j2(function(e5) {
        return N2("N", e5, void 0);
      }(e4), this) : this._next(e4);
    }, n3.prototype.error = function(e4) {
      this.isStopped ? j2(N2("E", void 0, e4), this) : (this.isStopped = true, this._error(e4));
    }, n3.prototype.complete = function() {
      this.isStopped ? j2(A2, this) : (this.isStopped = true, this._complete());
    }, n3.prototype.unsubscribe = function() {
      this.closed || (this.isStopped = true, e3.prototype.unsubscribe.call(this), this.destination = null);
    }, n3.prototype._next = function(e4) {
      this.destination.next(e4);
    }, n3.prototype._error = function(e4) {
      try {
        this.destination.error(e4);
      } finally {
        this.unsubscribe();
      }
    }, n3.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }, n3;
  }(v2);
  var G2 = Function.prototype.bind;
  function U2(e3, t9) {
    return G2.call(e3, t9);
  }
  var L2 = function() {
    function e3(e4) {
      this.partialObserver = e4;
    }
    return e3.prototype.next = function(e4) {
      var t9 = this.partialObserver;
      if (t9.next)
        try {
          t9.next(e4);
        } catch (e5) {
          _2(e5);
        }
    }, e3.prototype.error = function(e4) {
      var t9 = this.partialObserver;
      if (t9.error)
        try {
          t9.error(e4);
        } catch (e5) {
          _2(e5);
        }
      else
        _2(e4);
    }, e3.prototype.complete = function() {
      var e4 = this.partialObserver;
      if (e4.complete)
        try {
          e4.complete();
        } catch (e5) {
          _2(e5);
        }
    }, e3;
  }();
  var M2 = function(e3) {
    function n3(t9, n4, r3) {
      var a3, o3, i3 = e3.call(this) || this;
      I2(t9) || !t9 ? a3 = { next: null != t9 ? t9 : void 0, error: null != n4 ? n4 : void 0, complete: null != r3 ? r3 : void 0 } : i3 && k2.useDeprecatedNextContext ? ((o3 = Object.create(t9)).unsubscribe = function() {
        return i3.unsubscribe();
      }, a3 = { next: t9.next && U2(t9.next, o3), error: t9.error && U2(t9.error, o3), complete: t9.complete && U2(t9.complete, o3) }) : a3 = t9;
      return i3.destination = new L2(a3), i3;
    }
    return t8(n3, e3), n3;
  }(F2);
  function _2(e3) {
    x2(e3);
  }
  function j2(e3, t9) {
    var n3 = k2.onStoppedNotification;
    n3 && D2.setTimeout(function() {
      return n3(e3, t9);
    });
  }
  var H2 = { closed: true, next: E2, error: function(e3) {
    throw e3;
  }, complete: E2 };
  var z2 = "function" == typeof Symbol && Symbol.observable || "@@observable";
  function Q2(e3) {
    return e3;
  }
  function V2(e3) {
    return 0 === e3.length ? Q2 : 1 === e3.length ? e3[0] : function(t9) {
      return e3.reduce(function(e4, t10) {
        return t10(e4);
      }, t9);
    };
  }
  var W2 = function() {
    function e3(e4) {
      e4 && (this._subscribe = e4);
    }
    return e3.prototype.lift = function(t9) {
      var n3 = new e3();
      return n3.source = this, n3.operator = t9, n3;
    }, e3.prototype.subscribe = function(e4, t9, n3) {
      var r3, a3 = this, o3 = (r3 = e4) && r3 instanceof F2 || function(e5) {
        return e5 && I2(e5.next) && I2(e5.error) && I2(e5.complete);
      }(r3) && g2(r3) ? e4 : new M2(e4, t9, n3);
      return R2(function() {
        var e5 = a3, t10 = e5.operator, n4 = e5.source;
        o3.add(t10 ? t10.call(o3, n4) : n4 ? a3._subscribe(o3) : a3._trySubscribe(o3));
      }), o3;
    }, e3.prototype._trySubscribe = function(e4) {
      try {
        return this._subscribe(e4);
      } catch (t9) {
        e4.error(t9);
      }
    }, e3.prototype.forEach = function(e4, t9) {
      var n3 = this;
      return new (t9 = Y2(t9))(function(t10, r3) {
        var a3 = new M2({ next: function(t11) {
          try {
            e4(t11);
          } catch (e5) {
            r3(e5), a3.unsubscribe();
          }
        }, error: r3, complete: t10 });
        n3.subscribe(a3);
      });
    }, e3.prototype._subscribe = function(e4) {
      var t9;
      return null === (t9 = this.source) || void 0 === t9 ? void 0 : t9.subscribe(e4);
    }, e3.prototype[z2] = function() {
      return this;
    }, e3.prototype.pipe = function() {
      for (var e4 = [], t9 = 0; t9 < arguments.length; t9++)
        e4[t9] = arguments[t9];
      return V2(e4)(this);
    }, e3.prototype.toPromise = function(e4) {
      var t9 = this;
      return new (e4 = Y2(e4))(function(e5, n3) {
        var r3;
        t9.subscribe(function(e6) {
          return r3 = e6;
        }, function(e6) {
          return n3(e6);
        }, function() {
          return e5(r3);
        });
      });
    }, e3.create = function(t9) {
      return new e3(t9);
    }, e3;
  }();
  function Y2(e3) {
    var t9;
    return null !== (t9 = null != e3 ? e3 : k2.Promise) && void 0 !== t9 ? t9 : Promise;
  }
  function q2(e3) {
    return function(t9) {
      if (function(e4) {
        return I2(null == e4 ? void 0 : e4.lift);
      }(t9))
        return t9.lift(function(t10) {
          try {
            return e3(t10, this);
          } catch (e4) {
            this.error(e4);
          }
        });
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  function Z2(e3, t9, n3, r3, a3) {
    return new $2(e3, t9, n3, r3, a3);
  }
  var $2 = function(e3) {
    function n3(t9, n4, r3, a3, o3, i3) {
      var c3 = e3.call(this, t9) || this;
      return c3.onFinalize = o3, c3.shouldUnsubscribe = i3, c3._next = n4 ? function(e4) {
        try {
          n4(e4);
        } catch (e5) {
          t9.error(e5);
        }
      } : e3.prototype._next, c3._error = a3 ? function(e4) {
        try {
          a3(e4);
        } catch (e5) {
          t9.error(e5);
        } finally {
          this.unsubscribe();
        }
      } : e3.prototype._error, c3._complete = r3 ? function() {
        try {
          r3();
        } catch (e4) {
          t9.error(e4);
        } finally {
          this.unsubscribe();
        }
      } : e3.prototype._complete, c3;
    }
    return t8(n3, e3), n3.prototype.unsubscribe = function() {
      var t9;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var n4 = this.closed;
        e3.prototype.unsubscribe.call(this), !n4 && (null === (t9 = this.onFinalize) || void 0 === t9 || t9.call(this));
      }
    }, n3;
  }(F2);
  var X2 = O2(function(e3) {
    return function() {
      e3(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
    };
  });
  var K2 = function(e3) {
    function n3() {
      var t9 = e3.call(this) || this;
      return t9.closed = false, t9.currentObservers = null, t9.observers = [], t9.isStopped = false, t9.hasError = false, t9.thrownError = null, t9;
    }
    return t8(n3, e3), n3.prototype.lift = function(e4) {
      var t9 = new J2(this, this);
      return t9.operator = e4, t9;
    }, n3.prototype._throwIfClosed = function() {
      if (this.closed)
        throw new X2();
    }, n3.prototype.next = function(e4) {
      var t9 = this;
      R2(function() {
        var n4, r3;
        if (t9._throwIfClosed(), !t9.isStopped) {
          t9.currentObservers || (t9.currentObservers = Array.from(t9.observers));
          try {
            for (var o3 = a2(t9.currentObservers), i3 = o3.next(); !i3.done; i3 = o3.next()) {
              i3.value.next(e4);
            }
          } catch (e5) {
            n4 = { error: e5 };
          } finally {
            try {
              i3 && !i3.done && (r3 = o3.return) && r3.call(o3);
            } finally {
              if (n4)
                throw n4.error;
            }
          }
        }
      });
    }, n3.prototype.error = function(e4) {
      var t9 = this;
      R2(function() {
        if (t9._throwIfClosed(), !t9.isStopped) {
          t9.hasError = t9.isStopped = true, t9.thrownError = e4;
          for (var n4 = t9.observers; n4.length; )
            n4.shift().error(e4);
        }
      });
    }, n3.prototype.complete = function() {
      var e4 = this;
      R2(function() {
        if (e4._throwIfClosed(), !e4.isStopped) {
          e4.isStopped = true;
          for (var t9 = e4.observers; t9.length; )
            t9.shift().complete();
        }
      });
    }, n3.prototype.unsubscribe = function() {
      this.isStopped = this.closed = true, this.observers = this.currentObservers = null;
    }, Object.defineProperty(n3.prototype, "observed", { get: function() {
      var e4;
      return (null === (e4 = this.observers) || void 0 === e4 ? void 0 : e4.length) > 0;
    }, enumerable: false, configurable: true }), n3.prototype._trySubscribe = function(t9) {
      return this._throwIfClosed(), e3.prototype._trySubscribe.call(this, t9);
    }, n3.prototype._subscribe = function(e4) {
      return this._throwIfClosed(), this._checkFinalizedStatuses(e4), this._innerSubscribe(e4);
    }, n3.prototype._innerSubscribe = function(e4) {
      var t9 = this, n4 = this, r3 = n4.hasError, a3 = n4.isStopped, o3 = n4.observers;
      return r3 || a3 ? w2 : (this.currentObservers = null, o3.push(e4), new v2(function() {
        t9.currentObservers = null, b2(o3, e4);
      }));
    }, n3.prototype._checkFinalizedStatuses = function(e4) {
      var t9 = this, n4 = t9.hasError, r3 = t9.thrownError, a3 = t9.isStopped;
      n4 ? e4.error(r3) : a3 && e4.complete();
    }, n3.prototype.asObservable = function() {
      var e4 = new W2();
      return e4.source = this, e4;
    }, n3.create = function(e4, t9) {
      return new J2(e4, t9);
    }, n3;
  }(W2);
  var J2 = function(e3) {
    function n3(t9, n4) {
      var r3 = e3.call(this) || this;
      return r3.destination = t9, r3.source = n4, r3;
    }
    return t8(n3, e3), n3.prototype.next = function(e4) {
      var t9, n4;
      null === (n4 = null === (t9 = this.destination) || void 0 === t9 ? void 0 : t9.next) || void 0 === n4 || n4.call(t9, e4);
    }, n3.prototype.error = function(e4) {
      var t9, n4;
      null === (n4 = null === (t9 = this.destination) || void 0 === t9 ? void 0 : t9.error) || void 0 === n4 || n4.call(t9, e4);
    }, n3.prototype.complete = function() {
      var e4, t9;
      null === (t9 = null === (e4 = this.destination) || void 0 === e4 ? void 0 : e4.complete) || void 0 === t9 || t9.call(e4);
    }, n3.prototype._subscribe = function(e4) {
      var t9, n4;
      return null !== (n4 = null === (t9 = this.source) || void 0 === t9 ? void 0 : t9.subscribe(e4)) && void 0 !== n4 ? n4 : w2;
    }, n3;
  }(K2);
  var ee2 = function(e3) {
    function n3(t9) {
      var n4 = e3.call(this) || this;
      return n4._value = t9, n4;
    }
    return t8(n3, e3), Object.defineProperty(n3.prototype, "value", { get: function() {
      return this.getValue();
    }, enumerable: false, configurable: true }), n3.prototype._subscribe = function(t9) {
      var n4 = e3.prototype._subscribe.call(this, t9);
      return !n4.closed && t9.next(this._value), n4;
    }, n3.prototype.getValue = function() {
      var e4 = this, t9 = e4.hasError, n4 = e4.thrownError, r3 = e4._value;
      if (t9)
        throw n4;
      return this._throwIfClosed(), r3;
    }, n3.prototype.next = function(t9) {
      e3.prototype.next.call(this, this._value = t9);
    }, n3;
  }(K2);
  var te2 = new W2(function(e3) {
    return e3.complete();
  });
  var ne2 = function(e3) {
    return e3 && "number" == typeof e3.length && "function" != typeof e3;
  };
  var re3 = "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
  function ae2(e3) {
    if (e3 instanceof W2)
      return e3;
    if (null != e3) {
      if (function(e4) {
        return I2(e4[z2]);
      }(e3))
        return u3 = e3, new W2(function(e4) {
          var t10 = u3[z2]();
          if (I2(t10.subscribe))
            return t10.subscribe(e4);
          throw new TypeError("Provided object does not correctly implement Symbol.observable");
        });
      if (ne2(e3))
        return i3 = e3, new W2(function(e4) {
          for (var t10 = 0; t10 < i3.length && !e4.closed; t10++)
            e4.next(i3[t10]);
          e4.complete();
        });
      if (I2(null == (o3 = e3) ? void 0 : o3.then))
        return n3 = e3, new W2(function(e4) {
          n3.then(function(t10) {
            e4.closed || (e4.next(t10), e4.complete());
          }, function(t10) {
            return e4.error(t10);
          }).then(null, x2);
        });
      if (function(e4) {
        return Symbol.asyncIterator && I2(null == e4 ? void 0 : e4[Symbol.asyncIterator]);
      }(e3))
        return oe2(e3);
      if (function(e4) {
        return I2(null == e4 ? void 0 : e4[re3]);
      }(e3))
        return t9 = e3, new W2(function(e4) {
          var n4, r3;
          try {
            for (var o4 = a2(t9), i4 = o4.next(); !i4.done; i4 = o4.next()) {
              var c3 = i4.value;
              if (e4.next(c3), e4.closed)
                return;
            }
          } catch (e5) {
            n4 = { error: e5 };
          } finally {
            try {
              i4 && !i4.done && (r3 = o4.return) && r3.call(o4);
            } finally {
              if (n4)
                throw n4.error;
            }
          }
          e4.complete();
        });
      if (function(e4) {
        return I2(null == e4 ? void 0 : e4.getReader);
      }(e3))
        return oe2(function(e4) {
          return l2(this, arguments, function() {
            var t10, n4, a3;
            return r2(this, function(r3) {
              switch (r3.label) {
                case 0:
                  t10 = e4.getReader(), r3.label = 1;
                case 1:
                  r3.trys.push([1, , 9, 10]), r3.label = 2;
                case 2:
                  return [4, c2(t10.read())];
                case 3:
                  return n4 = r3.sent(), a3 = n4.value, n4.done ? [4, c2(void 0)] : [3, 5];
                case 4:
                  return [2, r3.sent()];
                case 5:
                  return [4, c2(a3)];
                case 6:
                  return [4, r3.sent()];
                case 7:
                  return r3.sent(), [3, 2];
                case 8:
                  return [3, 10];
                case 9:
                  return t10.releaseLock(), [7];
                case 10:
                  return [2];
              }
            });
          });
        }(e3));
    }
    var t9, n3, o3, i3, u3;
    throw function(e4) {
      return new TypeError("You provided " + (null !== e4 && "object" == typeof e4 ? "an invalid object" : "'" + e4 + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
    }(e3);
  }
  function oe2(e3) {
    return new W2(function(t9) {
      (function(e4, t10) {
        var a3, o3, i3, c3;
        return n2(this, void 0, void 0, function() {
          var n3, l3;
          return r2(this, function(r3) {
            switch (r3.label) {
              case 0:
                r3.trys.push([0, 5, 6, 11]), a3 = u2(e4), r3.label = 1;
              case 1:
                return [4, a3.next()];
              case 2:
                if ((o3 = r3.sent()).done)
                  return [3, 4];
                if (n3 = o3.value, t10.next(n3), t10.closed)
                  return [2];
                r3.label = 3;
              case 3:
                return [3, 1];
              case 4:
                return [3, 11];
              case 5:
                return l3 = r3.sent(), i3 = { error: l3 }, [3, 11];
              case 6:
                return r3.trys.push([6, , 9, 10]), o3 && !o3.done && (c3 = a3.return) ? [4, c3.call(a3)] : [3, 8];
              case 7:
                r3.sent(), r3.label = 8;
              case 8:
                return [3, 10];
              case 9:
                if (i3)
                  throw i3.error;
                return [7];
              case 10:
                return [7];
              case 11:
                return t10.complete(), [2];
            }
          });
        });
      })(e3, t9).catch(function(e4) {
        return t9.error(e4);
      });
    });
  }
  var ie2 = O2(function(e3) {
    return function() {
      e3(this), this.name = "EmptyError", this.message = "no elements in sequence";
    };
  });
  function ce2(e3, t9) {
    return q2(function(n3, r3) {
      var a3 = 0;
      n3.subscribe(Z2(r3, function(n4) {
        r3.next(e3.call(t9, n4, a3++));
      }));
    });
  }
  var le2 = Array.isArray;
  function ue2(e3) {
    return ce2(function(t9) {
      return function(e4, t10) {
        return le2(t10) ? e4.apply(void 0, i2([], o2(t10))) : e4(t10);
      }(e3, t9);
    });
  }
  function se2(e3, t9, n3) {
    return void 0 === n3 && (n3 = 1 / 0), I2(t9) ? se2(function(n4, r3) {
      return ce2(function(e4, a3) {
        return t9(n4, e4, r3, a3);
      })(ae2(e3(n4, r3)));
    }, n3) : ("number" == typeof t9 && (n3 = t9), q2(function(t10, r3) {
      return function(e4, t11, n4, r4, a3, o3, i3, c3) {
        var l3 = [], u3 = 0, s3 = 0, f3 = false, C3 = function() {
          !f3 || l3.length || u3 || t11.complete();
        }, h3 = function(e5) {
          return u3 < r4 ? d3(e5) : l3.push(e5);
        }, d3 = function(e5) {
          o3 && t11.next(e5), u3++;
          var c4 = false;
          ae2(n4(e5, s3++)).subscribe(Z2(t11, function(e6) {
            null == a3 || a3(e6), o3 ? h3(e6) : t11.next(e6);
          }, function() {
            c4 = true;
          }, void 0, function() {
            if (c4)
              try {
                u3--;
                for (var e6 = function() {
                  var e7 = l3.shift();
                  i3 ? function(e8, t12, n5, r5, a4) {
                    void 0 === r5 && (r5 = 0), void 0 === a4 && (a4 = false);
                    var o4 = t12.schedule(function() {
                      n5(), a4 ? e8.add(this.schedule(null, r5)) : this.unsubscribe();
                    }, r5);
                    e8.add(o4);
                  }(t11, i3, function() {
                    return d3(e7);
                  }) : d3(e7);
                }; l3.length && u3 < r4; )
                  e6();
                C3();
              } catch (e7) {
                t11.error(e7);
              }
          }));
        };
        return e4.subscribe(Z2(t11, h3, function() {
          f3 = true, C3();
        })), function() {
          null == c3 || c3();
        };
      }(t10, r3, e3, n3);
    }));
  }
  var fe2 = ["addListener", "removeListener"];
  var Ce2 = ["addEventListener", "removeEventListener"];
  var he2 = ["on", "off"];
  function de2(e3, t9, n3, r3) {
    if (I2(n3) && (r3 = n3, n3 = void 0), r3)
      return de2(e3, t9, n3).pipe(ue2(r3));
    var a3 = o2(function(e4) {
      return I2(e4.addEventListener) && I2(e4.removeEventListener);
    }(e3) ? Ce2.map(function(r4) {
      return function(a4) {
        return e3[r4](t9, a4, n3);
      };
    }) : function(e4) {
      return I2(e4.addListener) && I2(e4.removeListener);
    }(e3) ? fe2.map(me2(e3, t9)) : function(e4) {
      return I2(e4.on) && I2(e4.off);
    }(e3) ? he2.map(me2(e3, t9)) : [], 2), i3 = a3[0], c3 = a3[1];
    if (!i3 && ne2(e3))
      return se2(function(e4) {
        return de2(e4, t9, n3);
      })(ae2(e3));
    if (!i3)
      throw new TypeError("Invalid event target");
    return new W2(function(e4) {
      var t10 = function() {
        for (var t11 = [], n4 = 0; n4 < arguments.length; n4++)
          t11[n4] = arguments[n4];
        return e4.next(1 < t11.length ? t11 : t11[0]);
      };
      return i3(t10), function() {
        return c3(t10);
      };
    });
  }
  function me2(e3, t9) {
    return function(n3) {
      return function(r3) {
        return e3[n3](t9, r3);
      };
    };
  }
  function pe2(e3, t9) {
    return q2(function(n3, r3) {
      var a3 = 0;
      n3.subscribe(Z2(r3, function(n4) {
        return e3.call(t9, n4, a3++) && r3.next(n4);
      }));
    });
  }
  function Be2(e3) {
    return q2(function(t9, n3) {
      var r3 = false;
      t9.subscribe(Z2(n3, function(e4) {
        r3 = true, n3.next(e4);
      }, function() {
        r3 || n3.next(e3), n3.complete();
      }));
    });
  }
  function ye2(e3) {
    return e3 <= 0 ? function() {
      return te2;
    } : q2(function(t9, n3) {
      var r3 = 0;
      t9.subscribe(Z2(n3, function(t10) {
        ++r3 <= e3 && (n3.next(t10), e3 <= r3 && n3.complete());
      }));
    });
  }
  function Ie2(e3) {
    return void 0 === e3 && (e3 = Oe2), q2(function(t9, n3) {
      var r3 = false;
      t9.subscribe(Z2(n3, function(e4) {
        r3 = true, n3.next(e4);
      }, function() {
        return r3 ? n3.complete() : n3.error(e3());
      }));
    });
  }
  function Oe2() {
    return new ie2();
  }
  function Se2(e3) {
    return q2(function(t9, n3) {
      ae2(e3).subscribe(Z2(n3, function() {
        return n3.complete();
      }, E2)), !n3.closed && t9.subscribe(n3);
    });
  }
  function be2(e3, t9, n3) {
    var r3 = I2(e3) || t9 || n3 ? { next: e3, error: t9, complete: n3 } : e3;
    return r3 ? q2(function(e4, t10) {
      var n4;
      null === (n4 = r3.subscribe) || void 0 === n4 || n4.call(r3);
      var a3 = true;
      e4.subscribe(Z2(t10, function(e5) {
        var n5;
        null === (n5 = r3.next) || void 0 === n5 || n5.call(r3, e5), t10.next(e5);
      }, function() {
        var e5;
        a3 = false, null === (e5 = r3.complete) || void 0 === e5 || e5.call(r3), t10.complete();
      }, function(e5) {
        var n5;
        a3 = false, null === (n5 = r3.error) || void 0 === n5 || n5.call(r3, e5), t10.error(e5);
      }, function() {
        var e5, t11;
        a3 && (null === (e5 = r3.unsubscribe) || void 0 === e5 || e5.call(r3)), null === (t11 = r3.finalize) || void 0 === t11 || t11.call(r3);
      }));
    }) : Q2;
  }
  function ve2(e3) {
    return ve2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
      return typeof e4;
    } : function(e4) {
      return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
    }, ve2(e3);
  }
  var we2 = "\nLIS3DH Registers\n0x07.0\n0x08.0\n0x09.0\n0x0A.0\n0x0B.0\n0x0C.0\n0x0D.0\n0x0E.0\n0x0F.33\n\n0x1F.0\n0x20.8\n0x21.0\n0x22.0\n0x23.18\n0x24.0\n0x25.0\n0x26.0\n0x27.0\n0x28.0\n0x29.0\n0x2A.0\n0x2B.0\n0x2C.0\n0x2D.0\n0x2E.0\n0x2F.20\n0x30.0\n0x31.0\n0x32.0\n0x33.0\n\n0x38.0\n0x39.0\n0x3A.0\n0x3B.0\n0x3C.0\n0x3D.0\n";
  var ge2 = "\nLIS3DH Registers\n0x07 00\n0x08 00\n0x09 00\n0x0A 00\n0x0B 00\n0x0C 00\n0x0D 00\n0x0E 00\n0x0F 33\n\n0x1F 00\n0x20 08\n0x21 00\n0x22 00\n0x23 18\n0x24 00\n0x25 00\n0x26 00\n0x27 00\n0x28 00\n0x29 00\n0x2A 00\n0x2B 00\n0x2C 00\n0x2D 00\n0x2E 00\n0x2F 20\n0x30 00\n0x31 00\n0x32 00\n0x33 00\n\n0x38 00\n0x39 00\n0x3A 00\n0x3B 00\n0x3C 00\n0x3D 00\n";
  var Pe2 = "\nBoard ADS Registers\nADS_ID, 00, 3E, 0, 0, 1, 1, 1, 1, 1, 0\nCONFIG1, 01, 96, 1, 0, 0, 1, 0, 1, 1, 0\nCONFIG2, 02, C0, 1, 1, 0, 0, 0, 0, 0, 0\nCONFIG3, 03, EC, 1, 1, 1, 0, 1, 1, 0, 0\nLOFF, 04, 02, 0, 0, 0, 0, 0, 0, 1, 0\nCH1SET, 05, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH2SET, 06, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH3SET, 07, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH4SET, 08, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH5SET, 09, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH6SET, 0A, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH7SET, 0B, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH8SET, 0C, 68, 0, 1, 1, 0, 1, 0, 0, 0\nBIAS_SENSP, 0D, FF, 1, 1, 1, 1, 1, 1, 1, 1\nBIAS_SENSN, 0E, FF, 1, 1, 1, 1, 1, 1, 1, 1\nLOFF_SENSP, 0F, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_SENSN, 10, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_FLIP, 11, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_STATP, 12, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_STATN, 13, 00, 0, 0, 0, 0, 0, 0, 0, 0\nGPIO, 14, 0F, 0, 0, 0, 0, 1, 1, 1, 1\nMISC1, 15, 00, 0, 0, 0, 0, 0, 0, 0, 0\nMISC2, 16, 00, 0, 0, 0, 0, 0, 0, 0, 0\nCONFIG4, 17, 00, 0, 0, 0, 0, 0, 0, 0, 0\n";
  var ke2 = "\nDaisy ADS Registers\nADS_ID, 00, 3E, 0, 0, 1, 1, 1, 1, 1, 0\nCONFIG1, 01, 96, 1, 0, 0, 1, 0, 1, 1, 0\nCONFIG2, 02, C0, 1, 1, 0, 0, 0, 0, 0, 0\nCONFIG3, 03, EC, 1, 1, 1, 0, 1, 1, 0, 0\nLOFF, 04, 02, 0, 0, 0, 0, 0, 0, 1, 0\nCH1SET, 05, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH2SET, 06, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH3SET, 07, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH4SET, 08, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH5SET, 09, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH6SET, 0A, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH7SET, 0B, 68, 0, 1, 1, 0, 1, 0, 0, 0\nCH8SET, 0C, 68, 0, 1, 1, 0, 1, 0, 0, 0\nBIAS_SENSP, 0D, FF, 1, 1, 1, 1, 1, 1, 1, 1\nBIAS_SENSN, 0E, FF, 1, 1, 1, 1, 1, 1, 1, 1\nLOFF_SENSP, 0F, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_SENSN, 10, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_FLIP, 11, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_STATP, 12, 00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_STATN, 13, 00, 0, 0, 0, 0, 0, 0, 0, 0\nGPIO, 14, 0F, 0, 0, 0, 0, 1, 1, 1, 1\nMISC1, 15, 00, 0, 0, 0, 0, 0, 0, 0, 0\nMISC2, 16, 00, 0, 0, 0, 0, 0, 0, 0, 0\nCONFIG4, 17, 00, 0, 0, 0, 0, 0, 0, 0, 0\n";
  var De2 = { OBCIChannelOff1: "1", OBCIChannelOff2: "2", OBCIChannelOff3: "3", OBCIChannelOff4: "4", OBCIChannelOff5: "5", OBCIChannelOff6: "6", OBCIChannelOff7: "7", OBCIChannelOff8: "8", OBCIChannelOff9: "q", OBCIChannelOff10: "w", OBCIChannelOff11: "e", OBCIChannelOff12: "r", OBCIChannelOff13: "t", OBCIChannelOff14: "y", OBCIChannelOff15: "u", OBCIChannelOff16: "i", commandChannelOff: function(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 1:
          t9("1");
          break;
        case 2:
          t9("2");
          break;
        case 3:
          t9("3");
          break;
        case 4:
          t9("4");
          break;
        case 5:
          t9("5");
          break;
        case 6:
          t9("6");
          break;
        case 7:
          t9("7");
          break;
        case 8:
          t9("8");
          break;
        case 9:
          t9("q");
          break;
        case 10:
          t9("w");
          break;
        case 11:
          t9("e");
          break;
        case 12:
          t9("r");
          break;
        case 13:
          t9("t");
          break;
        case 14:
          t9("y");
          break;
        case 15:
          t9("u");
          break;
        case 16:
          t9("i");
          break;
        default:
          n3(Error("Error [commandChannelOff]: Invalid Channel Number"));
      }
    });
  }, OBCIChannelOn1: "!", OBCIChannelOn2: "@", OBCIChannelOn3: "#", OBCIChannelOn4: "$", OBCIChannelOn5: "%", OBCIChannelOn6: "^", OBCIChannelOn7: "&", OBCIChannelOn8: "*", OBCIChannelOn9: "Q", OBCIChannelOn10: "W", OBCIChannelOn11: "E", OBCIChannelOn12: "R", OBCIChannelOn13: "T", OBCIChannelOn14: "Y", OBCIChannelOn15: "U", OBCIChannelOn16: "I", commandChannelOn: function(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 1:
          t9("!");
          break;
        case 2:
          t9("@");
          break;
        case 3:
          t9("#");
          break;
        case 4:
          t9("$");
          break;
        case 5:
          t9("%");
          break;
        case 6:
          t9("^");
          break;
        case 7:
          t9("&");
          break;
        case 8:
          t9("*");
          break;
        case 9:
          t9("Q");
          break;
        case 10:
          t9("W");
          break;
        case 11:
          t9("E");
          break;
        case 12:
          t9("R");
          break;
        case 13:
          t9("T");
          break;
        case 14:
          t9("Y");
          break;
        case 15:
          t9("U");
          break;
        case 16:
          t9("I");
          break;
        default:
          n3(Error("Error [commandChannelOn]: Invalid Channel Number"));
      }
    });
  }, OBCITestSignalConnectToDC: "p", OBCITestSignalConnectToGround: "0", OBCITestSignalConnectToPulse1xFast: "=", OBCITestSignalConnectToPulse1xSlow: "-", OBCITestSignalConnectToPulse2xFast: "]", OBCITestSignalConnectToPulse2xSlow: "[", getTestSignalCommand: function(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case "dc":
          t9("p");
          break;
        case "ground":
          t9("0");
          break;
        case "pulse1xFast":
          t9("=");
          break;
        case "pulse1xSlow":
          t9("-");
          break;
        case "pulse2xFast":
          t9("]");
          break;
        case "pulse2xSlow":
          t9("[");
          break;
        case "none":
          t9("d");
          break;
        default:
          n3(Error("Invalid selection! Check your spelling."));
      }
    });
  }, OBCIChannelCmdADCNormal: "0", OBCIChannelCmdADCShorted: "1", OBCIChannelCmdADCBiasDRP: "6", OBCIChannelCmdADCBiasDRN: "7", OBCIChannelCmdADCBiasMethod: "2", OBCIChannelCmdADCMVDD: "3", OBCIChannelCmdADCTemp: "4", OBCIChannelCmdADCTestSig: "5", OBCIChannelCmdBiasInclude: "1", OBCIChannelCmdBiasRemove: "0", OBCIChannelCmdChannel1: "1", OBCIChannelCmdChannel2: "2", OBCIChannelCmdChannel3: "3", OBCIChannelCmdChannel4: "4", OBCIChannelCmdChannel5: "5", OBCIChannelCmdChannel6: "6", OBCIChannelCmdChannel7: "7", OBCIChannelCmdChannel8: "8", OBCIChannelCmdChannel9: "Q", OBCIChannelCmdChannel10: "W", OBCIChannelCmdChannel11: "E", OBCIChannelCmdChannel12: "R", OBCIChannelCmdChannel13: "T", OBCIChannelCmdChannel14: "Y", OBCIChannelCmdChannel15: "U", OBCIChannelCmdChannel16: "I", commandChannelForCmd: Re2, OBCIChannelCmdGain1: "0", OBCIChannelCmdGain2: "1", OBCIChannelCmdGain4: "2", OBCIChannelCmdGain6: "3", OBCIChannelCmdGain8: "4", OBCIChannelCmdGain12: "5", OBCIChannelCmdGain24: "6", commandForGain: Te2, gainForCommand: function(e3) {
    switch (String(e3)) {
      case "0":
        return 1;
      case "1":
        return 2;
      case "2":
        return 4;
      case "3":
        return 6;
      case "4":
        return 8;
      case "5":
        return 12;
      case "6":
        return 24;
      default:
        throw new Error("Invalid gain setting of ".concat(e3, " gain must be (0,1,2,3,4,5,6)"));
    }
  }, OBCIChannelCmdLatch: "X", OBCIChannelCmdPowerOff: "1", OBCIChannelCmdPowerOn: "0", OBCIChannelCmdSet: "x", OBCIChannelCmdSRB1Connect: "1", OBCIChannelCmdSRB1Diconnect: "0", OBCIChannelCmdSRB2Connect: "1", OBCIChannelCmdSRB2Diconnect: "0", channelSettingsObjectDefault: Fe2, channelSettingsArrayInit: function(e3) {
    for (var t9 = [], n3 = 0; n3 < e3; n3++)
      t9.push(Fe2(n3));
    return t9;
  }, OBCIStringADCNormal: "normal", OBCIStringADCShorted: "shorted", OBCIStringADCBiasMethod: "biasMethod", OBCIStringADCMvdd: "mvdd", OBCIStringADCTemp: "temp", OBCIStringADCTestSig: "testSig", OBCIStringADCBiasDrp: "biasDrp", OBCIStringADCBiasDrn: "biasDrn", commandForADCString: Ne2, inputTypeForCommand: function(e3) {
    switch (String(e3)) {
      case "0":
        return "normal";
      case "1":
        return "shorted";
      case "2":
        return "biasMethod";
      case "3":
        return "mvdd";
      case "4":
        return "temp";
      case "5":
        return "testSig";
      case "6":
        return "biasDrp";
      case "7":
        return "biasDrn";
      default:
        throw new Error("Invalid input type, must be less than 8");
    }
  }, OBCIChannelDefaultAllSet: "d", OBCIChannelDefaultAllGet: "D", OBCIChannelImpedanceLatch: "Z", OBCIChannelImpedanceSet: "z", OBCIChannelImpedanceTestSignalApplied: "1", OBCIChannelImpedanceTestSignalAppliedNot: "0", OBCISDLogForHour1: "G", OBCISDLogForHour2: "H", OBCISDLogForHour4: "J", OBCISDLogForHour12: "K", OBCISDLogForHour24: "L", OBCISDLogForMin5: "A", OBCISDLogForMin15: "S", OBCISDLogForMin30: "F", OBCISDLogForSec14: "a", OBCISDLogStop: "j", OBCIStringSDHour1: "1hour", OBCIStringSDHour2: "2hour", OBCIStringSDHour4: "4hour", OBCIStringSDHour12: "12hour", OBCIStringSDHour24: "24hour", OBCIStringSDMin5: "5min", OBCIStringSDMin15: "15min", OBCIStringSDMin30: "30min", OBCIStringSDSec14: "14sec", sdSettingForString: function(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case "1hour":
          t9("G");
          break;
        case "2hour":
          t9("H");
          break;
        case "4hour":
          t9("J");
          break;
        case "12hour":
          t9("K");
          break;
        case "24hour":
          t9("L");
          break;
        case "5min":
          t9("A");
          break;
        case "15min":
          t9("S");
          break;
        case "30min":
          t9("F");
          break;
        case "14sec":
          t9("a");
          break;
        default:
          n3(Error(TypeError));
      }
    });
  }, OBCIStreamStart: "b", OBCIStreamStop: "s", OBCIAccelStart: "n", OBCIAccelStop: "N", OBCIMiscQueryRegisterSettings: "?", OBCIMiscQueryRegisterSettingsChannel1: "CH1SET", OBCIMiscQueryRegisterSettingsChannel2: "CH2SET", OBCIMiscQueryRegisterSettingsChannel3: "CH3SET", OBCIMiscQueryRegisterSettingsChannel4: "CH4SET", OBCIMiscQueryRegisterSettingsChannel5: "CH5SET", OBCIMiscQueryRegisterSettingsChannel6: "CH6SET", OBCIMiscQueryRegisterSettingsChannel7: "CH7SET", OBCIMiscQueryRegisterSettingsChannel8: "CH8SET", channelSettingsKeyForChannel: function(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 1:
          t9(new Buffer("CH1SET"));
          break;
        case 2:
          t9(new Buffer("CH2SET"));
          break;
        case 3:
          t9(new Buffer("CH3SET"));
          break;
        case 4:
          t9(new Buffer("CH4SET"));
          break;
        case 5:
          t9(new Buffer("CH5SET"));
          break;
        case 6:
          t9(new Buffer("CH6SET"));
          break;
        case 7:
          t9(new Buffer("CH7SET"));
          break;
        case 8:
          t9(new Buffer("CH8SET"));
          break;
        default:
          n3(Error("Invalid channel number"));
      }
    });
  }, OBCIMiscSoftReset: "v", OBCIChannelMaxNumber8: "c", OBCIChannelMaxNumber16: "C", OBCIChannelMaxNumber8NoDaisyToRemove: "", OBCIChannelMaxNumber8SuccessDaisyRemoved: "daisy removed", OBCIChannelMaxNumber16DaisyAlreadyAttached: "16", OBCIChannelMaxNumber16DaisyAttached: "daisy attached16", OBCIChannelMaxNumber16NoDaisyAttached: "no daisy to attach!8", OBCIFilterDisable: "g", OBCIFilterEnable: "f", OBCITrigger: "`", OBCINumberOfChannelsCyton: 8, OBCINumberOfChannelsCytonBLE: 2, OBCINumberOfChannelsDaisy: 16, OBCINumberOfChannelsDefault: 8, OBCINumberOfChannelsGanglion: 4, OBCIBoardCyton: "cyton", OBCIBoardCytonBLE: "cytonBLE", OBCIBoardDaisy: "daisy", OBCIBoardDefault: "default", OBCIBoardGanglion: "ganglion", OBCIBoardNone: "none", numberOfChannelsForBoardType: function(e3) {
    switch (e3) {
      case "daisy":
        return 16;
      case "ganglion":
        return 4;
      case "none":
        return 0;
      case "cytonBLE":
        return 2;
      default:
        return 8;
    }
  }, boardTypeForNumberOfChannels: function(e3) {
    switch (e3) {
      case 16:
        return "daisy";
      case 4:
        return "ganglion";
      case 0:
        return "none";
      case 2:
        return "cytonBLE";
      default:
        return "cyton";
    }
  }, OBCISampleRate1000: 1e3, OBCISampleRate125: 125, OBCISampleRate12800: 12800, OBCISampleRate1600: 1600, OBCISampleRate16000: 16e3, OBCISampleRate200: 200, OBCISampleRate2000: 2e3, OBCISampleRate250: 250, OBCISampleRate25600: 25600, OBCISampleRate3200: 3200, OBCISampleRate400: 400, OBCISampleRate4000: 4e3, OBCISampleRate500: 500, OBCISampleRate6400: 6400, OBCISampleRate800: 800, OBCISampleRate8000: 8e3, OBCISampleNumberMax: 255, OBCIPacketSize: 33, OBCIPacketSizeBLECyton: 20, OBCIPacketSizeBLERaw: 12, OBCIByteStart: 160, OBCIByteStop: 192, OBCIErrorInvalidByteLength: "Invalid Packet Byte Length", OBCIErrorInvalidByteStart: "Invalid Start Byte", OBCIErrorInvalidByteStop: "Invalid Stop Byte", OBCIErrorInvalidData: "Invalid data - try again", OBCIErrorInvalidType: "Invalid type - check comments for input type", OBCIErrorMissingRegisterSetting: "Missing register setting", OBCIErrorMissingRequiredProperty: "Missing property in JSON", OBCIErrorNobleAlreadyScanning: "Scan already under way", OBCIErrorNobleNotAlreadyScanning: "No scan started", OBCIErrorNobleNotInPoweredOnState: "Please turn blue tooth on.", OBCIErrorTimeSyncIsNull: "'this.sync.curSyncObj' must not be null", OBCIErrorTimeSyncNoComma: "Missed the time sync sent confirmation. Try sync again", OBCIErrorUndefinedOrNullInput: "Undefined or Null Input", OBCIMasterBufferSize: 4096, OBCILeadOffDriveInAmps: 6e-9, OBCILeadOffFrequencyHz: 31.5, getChannelSetter: function(e3, t9, n3, r3, a3, o3, i3) {
    var c3, l3, u3, s3;
    return new Promise(function(f3, C3) {
      xe2(e3) || C3(Error("channelNumber must be of type 'number' ")), Ee2(t9) || C3(Error("powerDown must be of type 'boolean' ")), xe2(n3) || C3(Error("gain must be of type 'number' ")), Ae2(r3) || C3(Error("inputType must be of type 'string' ")), Ee2(a3) || C3(Error("bias must be of type 'boolean' ")), Ee2(o3) || C3(Error("srb1 must be of type 'boolean' ")), Ee2(i3) || C3(Error("srb2 must be of type 'boolean' "));
      var h3 = Re2(e3).catch(function(e4) {
        return C3(e4);
      });
      c3 = t9 ? "1" : "0";
      var d3 = Te2(n3).catch(function(e4) {
        return C3(e4);
      }), m3 = Ne2(r3).catch(function(e4) {
        return C3(e4);
      });
      l3 = a3 ? "1" : "0", u3 = o3 ? "1" : "0", s3 = i3 ? "1" : "0";
      var p3 = { channelNumber: e3, powerDown: t9, gain: n3, inputType: r3, bias: a3, srb2: o3, srb1: i3 };
      Promise.all([h3, d3, m3]).then(function(e4) {
        var t10 = ["x", e4[0], c3, e4[1], e4[2], l3, u3, s3, "X"];
        f3({ commandArray: t10, newChannelSettingsObject: p3 });
      });
    });
  }, getImpedanceSetter: function(e3, t9, n3) {
    var r3, a3;
    return new Promise(function(o3, i3) {
      xe2(e3) || i3(Error("channelNumber must be of type 'number' ")), Ee2(t9) || i3(Error("pInputApplied must be of type 'boolean' ")), Ee2(n3) || i3(Error("nInputApplied must be of type 'boolean' ")), a3 = t9 ? "1" : "0", r3 = n3 ? "1" : "0", Re2(e3).then(function(e4) {
        o3(["z", e4, a3, r3, "Z"]);
      }).catch(function(e4) {
        return i3(e4);
      });
    });
  }, getSampleRateSetter: function(e3, t9) {
    return new Promise(function(n3, r3) {
      if (!Ae2(e3))
        return r3(Error("board type must be of type 'string' "));
      if (!xe2(t9))
        return r3(Error("sampleRate must be of type 'number' "));
      var a3;
      if (t9 = Math.floor(t9), "cyton" === e3 || "daisy" === e3)
        a3 = Ue2;
      else {
        if ("ganglion" !== e3)
          return r3(Error("boardType must be either ".concat("cyton", " or ").concat("ganglion")));
        a3 = Le2;
      }
      a3(t9).then(function(e4) {
        n3(["~", e4]);
      }).catch(function(e4) {
        return r3(e4);
      });
    });
  }, getBoardModeSetter: function(e3) {
    return new Promise(function(t9, n3) {
      if (!Ae2(e3))
        return n3(Error("board mode must be of type 'string' "));
      Me2(e3).then(function(e4) {
        t9(["/", e4]);
      }).catch(function(e4) {
        return n3(e4);
      });
    });
  }, OBCIWriteIntervalDelayMSLong: 50, OBCIWriteIntervalDelayMSNone: 0, OBCIWriteIntervalDelayMSShort: 10, OBCISyncTimeSent: ",", OBCISyncTimeSet: "<", OBCIRadioKey: 240, OBCIRadioCmdChannelGet: 0, OBCIRadioCmdChannelSet: 1, OBCIRadioCmdChannelSetOverride: 2, OBCIRadioCmdPollTimeGet: 3, OBCIRadioCmdPollTimeSet: 4, OBCIRadioCmdBaudRateSetDefault: 5, OBCIRadioCmdBaudRateSetFast: 6, OBCIRadioCmdSystemStatus: 7, OBCIImpedanceTextBad: "bad", OBCIImpedanceTextGood: "good", OBCIImpedanceTextInit: "init", OBCIImpedanceTextOk: "ok", OBCIImpedanceTextNone: "none", OBCIImpedanceThresholdBadMax: 1e6, OBCIImpedanceSeriesResistor: 2200, getTextForRawImpedance: function(e3) {
    return e3 > 0 && e3 < 5e3 ? "good" : e3 > 5001 && e3 < 1e4 ? "ok" : e3 > 10001 && e3 < 1e6 ? "bad" : "none";
  }, OBCISimulatorPortName: "OpenBCISimulator", OBCIStreamPacketStandardAccel: 0, OBCIStreamPacketStandardRawAux: 1, OBCIStreamPacketUserDefinedType: 2, OBCIStreamPacketAccelTimeSyncSet: 3, OBCIStreamPacketAccelTimeSynced: 4, OBCIStreamPacketRawAuxTimeSyncSet: 5, OBCIStreamPacketRawAuxTimeSynced: 6, OBCIStreamPacketImpedance: 7, isNumber: xe2, isBoolean: Ee2, isString: Ae2, isUndefined: function(e3) {
    return void 0 === e3;
  }, isNull: function(e3) {
    return null === e3;
  }, OBCIPacketPositionStartByte: 0, OBCIPacketPositionStopByte: 32, OBCIPacketPositionStartAux: 26, OBCIPacketPositionStopAux: 31, OBCIPacketPositionChannelDataStart: 2, OBCIPacketPositionChannelDataStop: 25, OBCIPacketPositionSampleNumber: 1, OBCIPacketPositionTimeSyncAuxStart: 26, OBCIPacketPositionTimeSyncAuxStop: 28, OBCIPacketPositionTimeSyncTimeStart: 28, OBCIPacketPositionTimeSyncTimeStop: 32, OBCISimulatorLineNoiseHz60: "60Hz", OBCISimulatorLineNoiseHz50: "50Hz", OBCISimulatorLineNoiseNone: "none", OBCISimulatorFragmentationRandom: "random", OBCISimulatorFragmentationFullBuffers: "fullBuffers", OBCISimulatorFragmentationOneByOne: "oneByOne", OBCISimulatorFragmentationNone: "none", OBCIFirmwareV1: "v1", OBCIFirmwareV2: "v2", OBCIFirmwareV3: "v3", OBCIAccelAxisX: 7, OBCIAccelAxisY: 8, OBCIAccelAxisZ: 9, OBCIStreamPacketTimeByteSize: 4, OBCIParseDaisy: "Daisy", OBCIParseFailure: "Failure", OBCIParseFirmware: "v2", OBCIParseEOT: "$$$", OBCIParseSuccess: "Success", OBCIParsingChannelSettings: 2, OBCIParsingEOT: 4, OBCIParsingNormal: 3, OBCIParsingReset: 0, OBCIParsingTimeSyncSent: 1, OBCITimeoutProcessBytes: 500, OBCISimulatorRawAux: "rawAux", OBCISimulatorStandard: "standard", OBCIRadioChannelMax: 25, OBCIRadioChannelMin: 1, OBCIRadioPollTimeMax: 255, OBCIRadioPollTimeMin: 0, OBCITimeSyncArraySize: 10, OBCITimeSyncMultiplierWithSyncConf: 0.9, OBCITimeSyncMultiplierWithoutSyncConf: 0.75, OBCITimeSyncThresholdTransFailureMS: 10, OBCIBoardModeSet: "/", OBCIBoardModeCmdDefault: "0", OBCIBoardModeCmdDebug: "1", OBCIBoardModeCmdAnalog: "2", OBCIBoardModeCmdDigital: "3", OBCIBoardModeCmdGetCur: "/", OBCIBoardModeAnalog: "analog", OBCIBoardModeDefault: "default", OBCIBoardModeDebug: "debug", OBCIBoardModeDigital: "digital", OBCISampleRateSet: "~", OBCISampleRateCmdCyton16000: "0", OBCISampleRateCmdCyton8000: "1", OBCISampleRateCmdCyton4000: "2", OBCISampleRateCmdCyton2000: "3", OBCISampleRateCmdCyton1000: "4", OBCISampleRateCmdCyton500: "5", OBCISampleRateCmdCyton250: "6", OBCISampleRateCmdGang25600: "0", OBCISampleRateCmdGang12800: "1", OBCISampleRateCmdGang6400: "2", OBCISampleRateCmdGang3200: "3", OBCISampleRateCmdGang1600: "4", OBCISampleRateCmdGang800: "5", OBCISampleRateCmdGang400: "6", OBCISampleRateCmdGang200: "7", OBCISampleRateCmdGetCur: "~", OBCIWifiAttach: "{", OBCIWifiRemove: "}", OBCIWifiReset: ";", OBCIWifiStatus: ":", OBCIRadioBaudRateDefault: 115200, OBCIRadioBaudRateDefaultStr: "default", OBCIRadioBaudRateFast: 230400, OBCIRadioBaudRateFastStr: "fast", OBCIEmitterAccelerometer: "accelerometer", OBCIEmitterBlePoweredUp: "blePoweredOn", OBCIEmitterClose: "close", OBCIEmitterDroppedPacket: "droppedPacket", OBCIEmitterEot: "eot", OBCIEmitterError: "error", OBCIEmitterGanglionFound: "ganglionFound", OBCIEmitterHardSet: "hardSet", OBCIEmitterImpedance: "impedance", OBCIEmitterImpedanceArray: "impedanceArray", OBCIEmitterMessage: "message", OBCIEmitterQuery: "query", OBCIEmitterRawDataPacket: "rawDataPacket", OBCIEmitterReady: "ready", OBCIEmitterRFduino: "rfduino", OBCIEmitterSample: "sample", OBCIEmitterScanStopped: "scanStopped", OBCIEmitterSynced: "synced", OBCIEmitterWifiShield: "wifiShield", OBCIGanglionAccelAxisX: 1, OBCIGanglionAccelAxisY: 2, OBCIGanglionAccelAxisZ: 3, OBCIGanglionBleSearchTime: 2e4, OBCIGanglionByteIdUncompressed: 0, OBCIGanglionByteId18Bit: { max: 100, min: 1 }, OBCIGanglionByteId19Bit: { max: 200, min: 101 }, OBCIGanglionByteIdImpedanceChannel1: 201, OBCIGanglionByteIdImpedanceChannel2: 202, OBCIGanglionByteIdImpedanceChannel3: 203, OBCIGanglionByteIdImpedanceChannel4: 204, OBCIGanglionByteIdImpedanceChannelReference: 205, OBCIGanglionByteIdMultiPacket: 206, OBCIGanglionByteIdMultiPacketStop: 207, OBCIGanglionMCP3912Gain: 51, OBCIGanglionMCP3912Vref: 1.2, OBCIGanglionPacketSize: 20, OBCIGanglionPacket18Bit: { auxByte: 20, byteId: 0, dataStart: 1, dataStop: 19 }, OBCIGanglionPacket19Bit: { byteId: 0, dataStart: 1, dataStop: 20 }, OBCIGanglionPrefix: "Ganglion", OBCIGanglionSamplesPerPacket: 2, OBCIGanglionSyntheticDataEnable: "t", OBCIGanglionSyntheticDataDisable: "T", OBCIGanglionImpedanceStart: "z", OBCIGanglionImpedanceStop: "Z", OBCIGanglionScaleFactorPerCountVolts: 18699498629276494e-25, SimbleeUuidService: "fe84", SimbleeUuidReceive: "2d30c082f39f4ce6923f3484ea480596", SimbleeUuidSend: "2d30c083f39f4ce6923f3484ea480596", SimbleeUuidDisconnect: "2d30c084f39f4ce6923f3484ea480596", RFduinoUuidService: "2220", RFduinoUuidReceive: "2221", RFduinoUuidSend: "2222", RFduinoUuidSendTwo: "2223", OBCICytonBLESamplesPerPacket: 3, OBCIGanglionAccelScaleFactor: 0.016, OBCINobleEmitterPeripheralConnect: "connect", OBCINobleEmitterPeripheralDisconnect: "disconnect", OBCINobleEmitterPeripheralDiscover: "discover", OBCINobleEmitterPeripheralServicesDiscover: "servicesDiscover", OBCINobleEmitterServiceCharacteristicsDiscover: "characteristicsDiscover", OBCINobleEmitterServiceRead: "read", OBCINobleEmitterDiscover: "discover", OBCINobleEmitterScanStart: "scanStart", OBCINobleEmitterScanStop: "scanStop", OBCINobleEmitterStateChange: "stateChange", OBCINobleStatePoweredOn: "poweredOn", getPeripheralLocalNames: function(e3) {
    return new Promise(function(t9, n3) {
      var r3 = [];
      return e3.forEach(function(e4) {
        r3.push(e4.advertisement.localName);
      }), r3.length > 0 ? t9(r3) : n3(Error("No peripherals discovered with prefix equal to ".concat("Ganglion")));
    });
  }, getPeripheralWithLocalName: function(e3, t9) {
    return new Promise(function(n3, r3) {
      return "object" !== ve2(e3) ? r3(Error("pArray must be of type Object")) : (e3.forEach(function(e4) {
        if (e4.advertisement.hasOwnProperty("localName") && e4.advertisement.localName === t9)
          return n3(e4);
      }), r3(Error("No peripheral found with localName: ".concat(t9))));
    });
  }, getVersionNumber: function(e3) {
    return Number(e3[1]);
  }, isPeripheralGanglion: function(e3) {
    if (e3 && e3.hasOwnProperty("advertisement") && null !== e3.advertisement && e3.advertisement.hasOwnProperty("localName") && void 0 !== e3.advertisement.localName && null !== e3.advertisement.localName && e3.advertisement.localName.indexOf("Ganglion") > -1)
      return true;
    return false;
  }, commandSampleRateForCmdCyton: Ue2, commandSampleRateForCmdGanglion: Le2, commandBoardModeForMode: Me2, rawDataToSampleObjectDefault: function(e3) {
    void 0 === e3 && (e3 = 8);
    return { accelArray: [0, 0, 0], channelSettings: De2.channelSettingsArrayInit(e3), decompressedSamples: Ge2(e3), lastSampleNumber: 0, rawDataPacket: Buffer.alloc(33), rawDataPackets: [], scale: true, sendCounts: false, timeOffset: 0, verbose: false };
  }, OBCIProtocolBLE: "ble", OBCIProtocolSerial: "serial", OBCIProtocolWifi: "wifi", OBCIRegisterQueryAccelerometerFirmwareV1: we2, OBCIRegisterQueryAccelerometerFirmwareV3: ge2, OBCIRegisterQueryCyton: Pe2, OBCIRegisterQueryCytonDaisy: ke2, OBCIRegisterQueryNameMISC1: "MISC1", OBCIRegisterQueryNameBIASSENSP: "BIAS_SENSP", OBCIRegisterQueryNameCHnSET: ["CH1SET", "CH2SET", "CH3SET", "CH4SET", "CH5SET", "CH6SET", "CH7SET", "CH8SET"], OBCIRegisterQuerySizeCytonFirmwareV1: Pe2.length + we2.length, OBCIRegisterQuerySizeCytonDaisyFirmwareV1: Pe2.length + ke2.length + we2.length, OBCIRegisterQuerySizeCytonFirmwareV3: Pe2.length + ge2.length, OBCIRegisterQuerySizeCytonDaisyFirmwareV3: Pe2.length + ke2.length + ge2.length };
  function xe2(e3) {
    return "number" == typeof e3;
  }
  function Ee2(e3) {
    return "boolean" == typeof e3;
  }
  function Ae2(e3) {
    return "string" == typeof e3;
  }
  function Ne2(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case "normal":
          t9("0");
          break;
        case "shorted":
          t9("1");
          break;
        case "biasMethod":
          t9("2");
          break;
        case "mvdd":
          t9("3");
          break;
        case "temp":
          t9("4");
          break;
        case "testSig":
          t9("5");
          break;
        case "biasDrp":
          t9("6");
          break;
        case "biasDrn":
          t9("7");
          break;
        default:
          n3(Error("Invalid ADC string"));
      }
    });
  }
  function Te2(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 1:
          t9("0");
          break;
        case 2:
          t9("1");
          break;
        case 4:
          t9("2");
          break;
        case 6:
          t9("3");
          break;
        case 8:
          t9("4");
          break;
        case 12:
          t9("5");
          break;
        case 24:
          t9("6");
          break;
        default:
          n3(Error("Invalid gain setting of " + e3 + " gain must be (1,2,4,6,8,12,24)"));
      }
    });
  }
  function Re2(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 1:
          t9("1");
          break;
        case 2:
          t9("2");
          break;
        case 3:
          t9("3");
          break;
        case 4:
          t9("4");
          break;
        case 5:
          t9("5");
          break;
        case 6:
          t9("6");
          break;
        case 7:
          t9("7");
          break;
        case 8:
          t9("8");
          break;
        case 9:
          t9("Q");
          break;
        case 10:
          t9("W");
          break;
        case 11:
          t9("E");
          break;
        case 12:
          t9("R");
          break;
        case 13:
          t9("T");
          break;
        case 14:
          t9("Y");
          break;
        case 15:
          t9("U");
          break;
        case 16:
          t9("I");
          break;
        default:
          n3(Error("Invalid channel number"));
      }
    });
  }
  function Fe2(e3) {
    return { channelNumber: e3, powerDown: false, gain: 24, inputType: "normal", bias: true, srb2: true, srb1: false };
  }
  function Ge2(e3) {
    for (var t9 = [], n3 = 0; n3 < 3; n3++)
      t9.push(new Array(e3));
    return t9;
  }
  function Ue2(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 16e3:
          t9("0");
          break;
        case 8e3:
          t9("1");
          break;
        case 4e3:
          t9("2");
          break;
        case 2e3:
          t9("3");
          break;
        case 1e3:
          t9("4");
          break;
        case 500:
          t9("5");
          break;
        case 250:
          t9("6");
          break;
        default:
          n3(Error("Invalid sample rate"));
      }
    });
  }
  function Le2(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case 25600:
          t9("0");
          break;
        case 12800:
          t9("1");
          break;
        case 6400:
          t9("2");
          break;
        case 3200:
          t9("3");
          break;
        case 1600:
          t9("4");
          break;
        case 800:
          t9("5");
          break;
        case 400:
          t9("6");
          break;
        case 200:
          t9("7");
          break;
        default:
          n3(Error("Invalid sample rate"));
      }
    });
  }
  function Me2(e3) {
    return new Promise(function(t9, n3) {
      switch (e3) {
        case "default":
          t9("0");
          break;
        case "debug":
          t9("1");
          break;
        case "analog":
          t9("2");
          break;
        case "digital":
          t9("3");
          break;
        default:
          n3(Error("Invalid sample rate"));
      }
    });
  }
  var _e2 = 2e-3 / Math.pow(2, 4);
  var je2 = { extractRawDataPackets: function(e3) {
    if (!e3)
      return { buffer: e3, rawDataPackets: [] };
    var t9 = e3.length, n3 = [];
    if (t9 < De2.OBCIPacketSize)
      return { buffer: e3, rawDataPackets: n3 };
    for (var r3 = 0; r3 <= t9 - De2.OBCIPacketSize; ) {
      if (e3[r3] === De2.OBCIByteStart && St2(e3[r3 + De2.OBCIPacketSize - 1])) {
        var a3;
        a3 = Uint8Array.from(e3.slice(r3, r3 + De2.OBCIPacketSize)), n3.push(a3);
        var o3 = void 0;
        o3 = r3 > 0 ? Uint8Array.concat([Uint8Array.from(e3.slice(0, r3)), Uint8Array.from(e3.slice(r3 + De2.OBCIPacketSize))]) : Uint8Array.from(e3.slice(De2.OBCIPacketSize)), e3 = 0 === o3.length ? null : Uint8Array.from(o3), r3 = -1, t9 -= De2.OBCIPacketSize;
      }
      r3++;
    }
    return { buffer: e3, rawDataPackets: n3 };
  }, extractRawBLEDataPackets: function(e3) {
    var t9 = [];
    if (De2.isNull(e3))
      return t9;
    if (e3.byteLength !== De2.OBCIPacketSizeBLECyton)
      return t9;
    var n3 = [0, 0, 0];
    n3[0] = e3[1], n3[1] = n3[0] + 1, n3[1] > 255 && (n3[1] -= 256), n3[2] = n3[1] + 1, n3[2] > 255 && (n3[2] -= 256);
    for (var r3 = 0; r3 < De2.OBCICytonBLESamplesPerPacket; r3++) {
      var a3 = je2.samplePacketZero(n3[r3]);
      a3[0] = De2.OBCIByteStart, a3[De2.OBCIPacketPositionStopByte] = e3[0], e3.copy(a3, De2.OBCIPacketPositionChannelDataStart, De2.OBCIPacketPositionChannelDataStart + 6 * r3, De2.OBCIPacketPositionChannelDataStart + 6 + 6 * r3), t9.push(a3);
    }
    return t9;
  }, transformRawDataPacketToSample: Ke2, transformRawDataPacketsToSample: function(e3) {
    for (var t9 = [], n3 = 0; n3 < e3.rawDataPackets.length; n3++) {
      e3.rawDataPacket = e3.rawDataPackets[n3];
      var r3 = Ke2(e3);
      t9.push(r3), r3.hasOwnProperty("sampleNumber") ? e3.lastSampleNumber = r3.sampleNumber : r3.hasOwnProperty("impedanceValue") || (e3.lastSampleNumber = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber]);
    }
    return t9;
  }, convertGanglionArrayToBuffer: function(e3, t9) {
    for (var n3 = 0; n3 < De2.OBCINumberOfChannelsGanglion; n3++)
      t9.writeInt16BE(e3[n3] >> 8, 3 * n3), t9.writeInt8(255 & e3[n3], 3 * n3 + 2);
  }, getRawPacketType: ft2, getFromTimePacketAccel: ot2, getFromTimePacketTime: at2, getFromTimePacketRawAux: it2, ganglionFillRawDataPacket: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.rawDataPacket) || De2.isNull(e3.rawDataPacket) || De2.isUndefined(e3.data) || De2.isNull(e3.data))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (!e3.hasOwnProperty("sampleNumber"))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    if (e3.data.byteLength !== De2.OBCIPacketSizeBLERaw)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    e3.data.copy(e3.rawDataPacket, De2.OBCIPacketPositionChannelDataStart), e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber] = e3.sampleNumber, e3.rawDataPacket[De2.OBCIPacketPositionStartByte] = De2.OBCIByteStart, e3.rawDataPacket[De2.OBCIPacketPositionStopByte] = De2.OBCIStreamPacketStandardRawAux;
  }, parsePacketStandardAccel: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.rawDataPacket) || De2.isNull(e3.rawDataPacket))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    if (e3.rawDataPacket[0] !== De2.OBCIByteStart)
      throw new Error(De2.OBCIErrorInvalidByteStart);
    var t9 = {};
    (De2.isUndefined(e3.scale) || De2.isNull(e3.scale)) && (e3.scale = true);
    e3.scale ? t9.accelData = ct2(e3.rawDataPacket.slice(De2.OBCIPacketPositionStartAux, De2.OBCIPacketPositionStopAux + 1)) : t9.accelDataCounts = lt2(e3.rawDataPacket.slice(De2.OBCIPacketPositionStartAux, De2.OBCIPacketPositionStopAux + 1));
    e3.scale ? t9.channelData = ut2(e3) : t9.channelDataCounts = st2(e3);
    return t9.auxData = Uint8Array.from(e3.rawDataPacket.slice(De2.OBCIPacketPositionStartAux, De2.OBCIPacketPositionStopAux + 1)), t9.sampleNumber = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber], t9.startByte = e3.rawDataPacket[0], t9.stopByte = e3.rawDataPacket[De2.OBCIPacketPositionStopByte], t9.valid = true, t9.timestamp = Date.now(), t9.boardTime = 0, t9;
  }, parsePacketStandardRawAux: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.rawDataPacket) || De2.isNull(e3.rawDataPacket))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    if (e3.rawDataPacket[0] !== De2.OBCIByteStart)
      throw new Error(De2.OBCIErrorInvalidByteStart);
    var t9 = {};
    (De2.isUndefined(e3.scale) || De2.isNull(e3.scale)) && (e3.scale = true);
    e3.scale ? t9.channelData = ut2(e3) : t9.channelDataCounts = st2(e3);
    return t9.auxData = Uint8Array.from(e3.rawDataPacket.slice(De2.OBCIPacketPositionStartAux, De2.OBCIPacketPositionStopAux + 1)), t9.sampleNumber = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber], t9.startByte = e3.rawDataPacket[0], t9.stopByte = e3.rawDataPacket[De2.OBCIPacketPositionStopByte], t9.valid = true, t9.timestamp = Date.now(), t9.boardTime = 0, t9;
  }, parsePacketTimeSyncedAccel: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.rawDataPacket) || De2.isNull(e3.rawDataPacket))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    if (e3.rawDataPacket[0] !== De2.OBCIByteStart)
      throw new Error(De2.OBCIErrorInvalidByteStart);
    var t9 = {};
    t9.sampleNumber = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber], t9.startByte = e3.rawDataPacket[0], t9.stopByte = e3.rawDataPacket[De2.OBCIPacketPositionStopByte], t9.boardTime = at2(e3.rawDataPacket), e3.hasOwnProperty("timeOffset") ? t9.timestamp = t9.boardTime + e3.timeOffset : t9.timestamp = Date.now();
    t9.auxData = it2(e3.rawDataPacket), (De2.isUndefined(e3.scale) || De2.isNull(e3.scale)) && (e3.scale = true);
    e3.scale ? t9.channelData = ut2(e3) : t9.channelDataCounts = st2(e3);
    ot2(e3) && (e3.scale ? t9.accelData = e3.accelArray : t9.accelDataCounts = e3.accelArray);
    return t9.valid = true, t9;
  }, parsePacketTimeSyncedRawAux: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.rawDataPacket) || De2.isNull(e3.rawDataPacket))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    if (e3.rawDataPacket[0] !== De2.OBCIByteStart)
      throw new Error(De2.OBCIErrorInvalidByteStart);
    var t9 = {};
    t9.sampleNumber = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber], t9.startByte = e3.rawDataPacket[0], t9.stopByte = e3.rawDataPacket[De2.OBCIPacketPositionStopByte], t9.boardTime = at2(e3.rawDataPacket), e3.hasOwnProperty("timeOffset") ? t9.timestamp = t9.boardTime + e3.timeOffset : t9.timestamp = Date.now();
    t9.auxData = it2(e3.rawDataPacket), (De2.isUndefined(e3.scale) || De2.isNull(e3.scale)) && (e3.scale = true);
    e3.scale ? t9.channelData = ut2(e3) : t9.channelDataCounts = st2(e3);
    return t9.valid = true, t9;
  }, parsePacketImpedance: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.rawDataPacket) || De2.isNull(e3.rawDataPacket))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    var t9 = {};
    t9.channelNumber = e3.rawDataPacket[1], 5 === t9.channelNumber && (t9.channelNumber = 0);
    return t9.impedanceValue = Number(e3.rawDataPacket.toString().match(/\d+/)[0]), t9;
  }, convertSampleToPacketStandard: function(e3) {
    var t9 = new Uint8Array(De2.OBCIPacketSize);
    t9.fill(0), t9[0] = De2.OBCIByteStart, t9[1] = e3.sampleNumber;
    for (var n3 = 0; n3 < De2.OBCINumberOfChannelsDefault; n3++) {
      mt2(e3.channelData[n3]).copy(t9, 2 + 3 * n3);
    }
    for (var r3 = 0; r3 < 3; r3++) {
      pt2(e3.auxData[r3]).copy(t9, De2.OBCIPacketSize - 1 - 6 + 2 * r3);
    }
    return t9[De2.OBCIPacketSize - 1] = De2.OBCIByteStop, t9;
  }, convertSampleToPacketRawAux: function(e3, t9) {
    var n3 = new Uint8Array(De2.OBCIPacketSize);
    n3.fill(0), n3[0] = De2.OBCIByteStart, n3[1] = e3.sampleNumber;
    for (var r3 = 0; r3 < De2.OBCINumberOfChannelsDefault; r3++) {
      mt2(e3.channelData[r3]).copy(n3, 2 + 3 * r3);
    }
    return t9.copy(n3, 26), n3[De2.OBCIPacketSize - 1] = Ot2(De2.OBCIStreamPacketStandardRawAux), n3;
  }, convertSampleToPacketAccelTimeSyncSet: function(e3, t9) {
    var n3 = It2(e3, t9);
    return n3[De2.OBCIPacketPositionStopByte] = Ot2(De2.OBCIStreamPacketAccelTimeSyncSet), n3;
  }, convertSampleToPacketAccelTimeSynced: It2, convertSampleToPacketRawAuxTimeSyncSet: function(e3, t9, n3) {
    var r3 = yt2(e3, t9, n3);
    return r3[De2.OBCIPacketPositionStopByte] = Ot2(De2.OBCIStreamPacketRawAuxTimeSyncSet), r3;
  }, convertSampleToPacketRawAuxTimeSynced: yt2, debugPrettyPrint: function(e3) {
    if (null == e3)
      console.log("== Sample is undefined ==");
    else {
      console.log("-- Sample --"), console.log("---- Start Byte: " + e3.startByte), console.log("---- Sample Number: " + e3.sampleNumber);
      for (var t9 = 0; t9 < 8; t9++)
        console.log("---- Channel Data " + (t9 + 1) + ": " + e3.channelData[t9]);
      if (e3.accelData)
        for (var n3 = 0; n3 < 3; n3++)
          console.log("---- Accel Data " + n3 + ": " + e3.accelData[n3]);
      e3.auxData && console.log("---- Aux Data " + e3.auxData), console.log("---- Stop Byte: " + e3.stopByte);
    }
  }, samplePrintHeader: function() {
    return "All voltages in Volts!sampleNumber, channel1, channel2, channel3, channel4, channel5, channel6, channel7, channel8, aux1, aux2, aux3\n";
  }, samplePrintLine: function(e3) {
    return new Promise(function(t9, n3) {
      null == e3 && n3(Error("undefined sample")), t9(e3.sampleNumber + "," + e3.channelData[0].toFixed(8) + "," + e3.channelData[1].toFixed(8) + "," + e3.channelData[2].toFixed(8) + "," + e3.channelData[3].toFixed(8) + "," + e3.channelData[4].toFixed(8) + "," + e3.channelData[5].toFixed(8) + "," + e3.channelData[6].toFixed(8) + "," + e3.channelData[7].toFixed(8) + "," + e3.auxData[0].toFixed(8) + "," + e3.auxData[1].toFixed(8) + "," + e3.auxData[2].toFixed(8) + "\n");
    });
  }, floatTo3ByteBuffer: mt2, floatTo2ByteBuffer: pt2, impedanceCalculationForChannel: function(e3, t9) {
    var n3 = Math.sqrt(2);
    return new Promise(function(r3, a3) {
      null == e3 && a3(Error("Sample Object cannot be null or undefined")), void 0 !== e3.channelData && null !== e3.channelData || a3(Error("Channel cannot be null or undefined")), (t9 < 1 || t9 > De2.OBCINumberOfChannelsDefault) && a3(Error("Channel number invalid."));
      var o3 = t9 - 1;
      e3.channelData[o3] < 0 && (e3.channelData[o3] *= -1), r3(n3 * e3.channelData[o3] / De2.OBCILeadOffDriveInAmps);
    });
  }, impedanceCalculationForAllChannels: function(e3) {
    var t9 = Math.sqrt(2);
    return new Promise(function(n3, r3) {
      null == e3 && r3(Error("Sample Object cannot be null or undefined")), void 0 !== e3.channelData && null !== e3.channelData || r3(Error("Channel cannot be null or undefined"));
      for (var a3 = [], o3 = e3.channelData.length, i3 = 0; i3 < o3; i3++) {
        e3.channelData[i3] < 0 && (e3.channelData[i3] *= -1);
        var c3 = t9 * e3.channelData[i3] / De2.OBCILeadOffDriveInAmps;
        a3.push(c3);
      }
      e3.impedances = a3, n3(e3);
    });
  }, interpret16bitAsInt32: function(e3) {
    var t9 = 0;
    return e3[0] > 127 && (t9 = 65535), t9 << 16 | e3[0] << 8 | e3[1];
  }, interpret24bitAsInt32: function(e3) {
    var t9 = 0;
    return e3[0] > 127 && (t9 = 255), t9 << 24 | e3[0] << 16 | e3[1] << 8 | e3[2];
  }, impedanceArray: function(e3) {
    for (var t9 = [], n3 = 0; n3 < e3; n3++)
      t9.push(Xe2(n3 + 1));
    return t9;
  }, impedanceObject: Xe2, impedanceSummarize: function(e3) {
    e3.raw > De2.OBCIImpedanceThresholdBadMax ? e3.text = De2.OBCIImpedanceTextNone : e3.text = De2.getTextForRawImpedance(e3.raw);
  }, newSample: ht2, newSampleNoScale: dt2, scaleFactorAux: _e2, impedanceCalculateArray: function(e3, t9) {
    if (t9.buffer.push(e3.channelData), t9.count++, t9.count >= t9.window) {
      for (var n3 = [], r3 = 0; r3 < e3.channelData.length; r3++) {
        for (var a3 = 0, o3 = 0; o3 < t9.window; o3++)
          t9.buffer[r3][o3] > a3 && (a3 = t9.buffer[r3][o3]);
        for (var i3 = 0, c3 = 0; c3 < t9.window; c3++)
          t9.buffer[r3][c3] < i3 && (i3 = t9.buffer[r3][c3]);
        var l3 = a3 - i3;
        n3.push(l3 / 2 / De2.OBCILeadOffDriveInAmps);
      }
      return t9.count = 0, n3;
    }
    return null;
  }, impedanceTestObjDefault: function(e3) {
    var t9 = e3 || {};
    return t9.active = false, t9.buffer = [], t9.count = 0, t9.isTestingPInput = false, t9.isTestingNInput = false, t9.onChannel = 0, t9.sampleNumber = 0, t9.continuousMode = false, t9.impedanceForChannel = 0, t9.window = 40, t9;
  }, samplePacket: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 0, 0, 1, 0, 2, Ot2(De2.OBCIStreamPacketStandardAccel)]);
  }, samplePacketZero: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Ot2(De2.OBCIStreamPacketStandardAccel)]);
  }, samplePacketReal: function(e3) {
    return new Uint8Array([160, Ct2(e3), 143, 242, 64, 143, 223, 244, 144, 43, 182, 143, 191, 191, 127, 255, 255, 127, 255, 255, 148, 37, 52, 32, 182, 125, 0, 224, 0, 224, 15, 112, Ot2(De2.OBCIStreamPacketStandardAccel)]);
  }, samplePacketStandardRawAux: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 1, 2, 3, 4, 5, Ot2(De2.OBCIStreamPacketStandardRawAux)]);
  }, samplePacketAccelTimeSyncSet: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 1, 0, 0, 0, 1, Ot2(De2.OBCIStreamPacketAccelTimeSyncSet)]);
  }, samplePacketAccelTimeSynced: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 1, 0, 0, 0, 1, Ot2(De2.OBCIStreamPacketAccelTimeSynced)]);
  }, samplePacketRawAuxTimeSyncSet: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 1, 0, 0, 0, 1, Ot2(De2.OBCIStreamPacketRawAuxTimeSyncSet)]);
  }, samplePacketRawAuxTimeSynced: function(e3) {
    return new Uint8Array([160, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 1, 0, 0, 0, 1, Ot2(De2.OBCIStreamPacketRawAuxTimeSynced)]);
  }, samplePacketImpedance: function(e3) {
    return new Uint8Array([160, e3, 54, 52, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Ot2(De2.OBCIStreamPacketImpedance)]);
  }, samplePacketUserDefined: function() {
    return new Uint8Array([160, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, Ot2(De2.OBCIStreamPacketUserDefinedType)]);
  }, samplePacketCytonBLE: function(e3) {
    return new Uint8Array([192, Ct2(e3), 0, 0, 1, 0, 0, 2, 0, 0, 10, 0, 0, 20, 0, 0, 100, 0, 0, 200]);
  }, getBiasSetFromADSRegisterQuery: tt2, getBooleanFromRegisterQuery: Je2, getChannelDataArray: ut2, getChannelDataArrayNoScale: st2, getDataArrayAccel: ct2, getDataArrayAccelNoScale: lt2, getFirmware: function(e3) {
    var t9 = e3.toString().match(/v\d.\d*.\d*/);
    if (t9) {
      var n3 = t9[0].split(".");
      return { major: Number(n3[0][1]), minor: Number(n3[1]), patch: Number(n3[2]), raw: t9[0] };
    }
    return t9;
  }, getSRB1FromADSRegisterQuery: et2, getNumFromThreeCSVADSRegisterQuery: nt2, isEven: Bt2, isOdd: function(e3) {
    return e3 % 2 == 1;
  }, isStopByte: St2, isTimeSyncSetConfirmationInBuffer: function(e3) {
    if (e3) {
      var t9 = e3.length;
      switch (t9) {
        case 0:
          return false;
        case 1:
          return e3[0] === De2.OBCISyncTimeSent.charCodeAt(0);
        case 2:
          return e3[1] === De2.OBCIByteStart ? e3[0] === De2.OBCISyncTimeSent.charCodeAt(0) : !!St2(e3[0]) && e3[1] === De2.OBCISyncTimeSent.charCodeAt(0);
        default:
          if (e3[0] === De2.OBCISyncTimeSent.charCodeAt(0) && e3[1] === De2.OBCIByteStart)
            return true;
          for (var n3 = 1; n3 < t9; n3++)
            if (n3 === t9 - 1) {
              if (St2(e3[n3 - 1]))
                return e3[n3] === De2.OBCISyncTimeSent.charCodeAt(0);
            } else if (St2(e3[n3 - 1]) && e3[n3 + 1] === De2.OBCIByteStart)
              return e3[n3] === De2.OBCISyncTimeSent.charCodeAt(0);
          return false;
      }
    }
  }, makeDaisySampleObject: function(e3, t9) {
    var n3 = {};
    e3.hasOwnProperty("channelData") && (n3.channelData = e3.channelData.concat(t9.channelData));
    e3.hasOwnProperty("channelDataCounts") && (n3.channelDataCounts = e3.channelDataCounts.concat(t9.channelDataCounts));
    n3.sampleNumber = Math.floor(t9.sampleNumber / 2), n3.auxData = { lower: e3.auxData, upper: t9.auxData }, n3.stopByte = e3.stopByte, n3.timestamp = (e3.timestamp + t9.timestamp) / 2, n3._timestamps = { lower: e3.timestamp, upper: t9.timestamp }, e3.hasOwnProperty("accelData") && (e3.accelData[0] > 0 || e3.accelData[1] > 0 || e3.accelData[2] > 0 ? n3.accelData = e3.accelData : n3.accelData = t9.accelData);
    e3.hasOwnProperty("accelDataCounts") && (e3.accelDataCounts[0] > 0 || e3.accelDataCounts[1] > 0 || e3.accelDataCounts[2] > 0 ? n3.accelDataCounts = e3.accelDataCounts : n3.accelDataCounts = t9.accelDataCounts);
    return n3.valid = true, n3;
  }, makeDaisySampleObjectWifi: function(e3, t9) {
    var n3 = {};
    e3.hasOwnProperty("channelData") && (n3.channelData = e3.channelData.concat(t9.channelData));
    e3.hasOwnProperty("channelDataCounts") && (n3.channelDataCounts = e3.channelDataCounts.concat(t9.channelDataCounts));
    n3.sampleNumber = t9.sampleNumber, n3.auxData = { lower: e3.auxData, upper: t9.auxData }, e3.hasOwnProperty("timestamp") && (n3.timestamp = e3.timestamp);
    n3.stopByte = e3.stopByte, n3._timestamps = { lower: e3.timestamp, upper: t9.timestamp }, e3.hasOwnProperty("accelData") && (e3.accelData[0] > 0 || e3.accelData[1] > 0 || e3.accelData[2] > 0 ? n3.accelData = e3.accelData : n3.accelData = t9.accelData);
    e3.hasOwnProperty("accelDataCounts") && (e3.accelDataCounts[0] > 0 || e3.accelDataCounts[1] > 0 || e3.accelDataCounts[2] > 0 ? n3.accelDataCounts = e3.accelDataCounts : n3.accelDataCounts = t9.accelDataCounts);
    return n3.valid = true, n3;
  }, makeTailByteFromPacketType: Ot2, newSyncObject: function() {
    return { boardTime: 0, correctedTransmissionTime: false, error: null, timeSyncSent: 0, timeSyncSentConfirmation: 0, timeSyncSetPacket: 0, timeRoundTrip: 0, timeTransmission: 0, timeOffset: 0, timeOffsetMaster: 0, valid: false };
  }, setChSetFromADSRegisterQuery: rt2, stripToEOTBuffer: function(e3) {
    var t9 = e3.indexOf(De2.OBCIParseEOT);
    if (!(t9 >= 0))
      return e3;
    t9 += De2.OBCIParseEOT.length;
    return t9 < e3.byteLength ? Uint8Array.from(e3.slice(t9)) : null;
  }, syncChannelSettingsWithRawData: function(e3) {
    if (De2.isUndefined(e3) || De2.isUndefined(e3.channelSettings) || De2.isNull(e3.channelSettings) || De2.isUndefined(e3.data) || De2.isNull(e3.data))
      throw new Error(De2.OBCIErrorUndefinedOrNullInput);
    if (!Array.isArray(e3.channelSettings))
      throw new Error("".concat(De2.OBCIErrorInvalidType, " channelSettings"));
    if (e3.channelSettings.length === De2.OBCINumberOfChannelsCyton) {
      if (e3.data.toString().match(/Daisy ADS/))
        throw new Error("raw data mismatch - expected only cyton register info but also found daisy");
      if (null == e3.data.toString().match(/Board ADS/))
        throw new Error(De2.OBCIErrorInvalidData);
    } else {
      if (null == e3.data.toString().match(/Daisy ADS/))
        throw new Error("raw data mismatch - expected daisy register info but none found");
      if (null == e3.data.toString().match(/Board ADS/))
        throw new Error("no Board ADS info found");
    }
    e3.channelSettings.forEach(function(e4) {
      if (!(e4.hasOwnProperty("channelNumber") && e4.hasOwnProperty("powerDown") && e4.hasOwnProperty("gain") && e4.hasOwnProperty("inputType") && e4.hasOwnProperty("bias") && e4.hasOwnProperty("srb2") && e4.hasOwnProperty("srb1")))
        throw new Error(De2.OBCIErrorMissingRequiredProperty);
    });
    var t9 = null, n3 = false, r3 = false, a3 = e3.data.toString().match(/Board ADS/), o3 = e3.data.toString().slice(a3.index, De2.OBCIRegisterQueryCyton.length);
    et2(o3) && (n3 = true);
    if (e3.channelSettings.length > De2.OBCINumberOfChannelsCyton) {
      var i3 = e3.data.toString().match(/Daisy ADS/);
      t9 = e3.data.toString().slice(i3.index, i3.index + De2.OBCIRegisterQueryCytonDaisy.length), et2(o3) && (r3 = true);
    }
    e3.channelSettings.forEach(function(e4) {
      e4.channelNumber < De2.OBCINumberOfChannelsCyton ? (rt2(o3, e4), e4.bias = tt2(o3, e4.channelNumber), e4.srb1 = n3) : (rt2(t9, e4), e4.bias = tt2(t9, e4.channelNumber - De2.OBCINumberOfChannelsCyton), e4.srb1 = r3);
    });
  }, droppedPacketCheck: function(e3, t9) {
    if (e3 === De2.OBCISampleNumberMax && 0 === t9)
      return null;
    if (t9 - e3 == 1)
      return null;
    var n3 = [];
    if (e3 > t9) {
      for (var r3 = De2.OBCISampleNumberMax - e3, a3 = 0; a3 < r3; a3++)
        n3.push(e3 + a3 + 1);
      e3 = -1;
    }
    for (var o3 = 1; o3 < t9 - e3; o3++)
      n3.push(e3 + o3);
    return n3;
  }, convert18bitAsInt32: Ye2, convert19bitAsInt32: qe2, decompressDeltas18Bit: Ze2, decompressDeltas19Bit: $e2, sampleCompressedData: function(e3) {
    return new Uint8Array([e3, 0, 0, 0, 0, 8, 0, 5, 0, 0, 72, 0, 9, 240, 1, 176, 0, 48, 0, 8]);
  }, sampleBLERaw: function() {
    return new Uint8Array([0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4]);
  }, sampleImpedanceChannel1: function() {
    return new Uint8Array([De2.OBCIGanglionByteIdImpedanceChannel1, 0, 0, 1]);
  }, sampleImpedanceChannel2: function() {
    return new Uint8Array([De2.OBCIGanglionByteIdImpedanceChannel2, 0, 0, 1]);
  }, sampleImpedanceChannel3: function() {
    return new Uint8Array([De2.OBCIGanglionByteIdImpedanceChannel3, 0, 0, 1]);
  }, sampleImpedanceChannel4: function() {
    return new Uint8Array([De2.OBCIGanglionByteIdImpedanceChannel4, 0, 0, 1]);
  }, sampleImpedanceChannelReference: function() {
    return new Uint8Array([De2.OBCIGanglionByteIdImpedanceChannelReference, 0, 0, 1]);
  }, sampleMultiBytePacket: function(e3) {
    var t9 = new Uint8Array([De2.OBCIGanglionByteIdMultiPacket]);
    return Uint8Array.concat([t9, e3]);
  }, sampleMultiBytePacketStop: function(e3) {
    var t9 = new Uint8Array([De2.OBCIGanglionByteIdMultiPacketStop]);
    return Uint8Array.concat([t9, e3]);
  }, sampleOtherData: function(e3) {
    var t9 = new Uint8Array([255]);
    return Uint8Array.concat([t9, e3]);
  }, sampleUncompressedData: function() {
    return new Uint8Array([0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 1, 2, 3, 4, 5, 6, 7]);
  }, parseGanglion: function(e3) {
    var t9 = parseInt(e3.rawDataPacket[0]);
    if (t9 <= De2.OBCIGanglionByteId19Bit.max)
      return We2(e3);
    switch (t9) {
      case De2.OBCIGanglionByteIdMultiPacket:
        return He2(e3);
      case De2.OBCIGanglionByteIdMultiPacketStop:
        return ze2(e3);
      case De2.OBCIGanglionByteIdImpedanceChannel1:
      case De2.OBCIGanglionByteIdImpedanceChannel2:
      case De2.OBCIGanglionByteIdImpedanceChannel3:
      case De2.OBCIGanglionByteIdImpedanceChannel4:
      case De2.OBCIGanglionByteIdImpedanceChannelReference:
        return function(e4) {
          var t10;
          switch (parseInt(e4.rawDataPacket[0])) {
            case De2.OBCIGanglionByteIdImpedanceChannel1:
              t10 = 1;
              break;
            case De2.OBCIGanglionByteIdImpedanceChannel2:
              t10 = 2;
              break;
            case De2.OBCIGanglionByteIdImpedanceChannel3:
              t10 = 3;
              break;
            case De2.OBCIGanglionByteIdImpedanceChannel4:
              t10 = 4;
              break;
            case De2.OBCIGanglionByteIdImpedanceChannelReference:
              t10 = 0;
          }
          var n3 = { channelNumber: t10, impedanceValue: 0 }, r3 = e4.rawDataPacket.length;
          for (; Number.isNaN(Number(e4.rawDataPacket.slice(1, r3))) && 0 !== r3; )
            r3--;
          0 !== r3 && (n3.impedanceValue = Number(e4.rawDataPacket.slice(1, r3)));
          return n3;
        }(e3);
      default:
        return null;
    }
  }, processMultiBytePacket: He2, processMultiBytePacketStop: ze2 };
  function He2(e3) {
    e3.multiPacketBuffer ? e3.multiPacketBuffer = Uint8Array.concat([Uint8Array.from(e3.multiPacketBuffer), Uint8Array.from(e3.rawDataPacket.slice(De2.OBCIGanglionPacket19Bit.dataStart, De2.OBCIGanglionPacket19Bit.dataStop))]) : e3.multiPacketBuffer = e3.rawDataPacket.slice(De2.OBCIGanglionPacket19Bit.dataStart, De2.OBCIGanglionPacket19Bit.dataStop);
  }
  function ze2(e3) {
    He2(e3);
    var t9 = e3.multiPacketBuffer.toString();
    return e3.multiPacketBuffer = null, { message: t9 };
  }
  function Qe2(e3, t9) {
    for (var n3 = 1; n3 < 3; n3++)
      for (var r3 = 0; r3 < 4; r3++)
        e3.decompressedSamples[n3][r3] = e3.decompressedSamples[n3 - 1][r3] - t9[n3 - 1][r3];
  }
  function Ve2(e3, t9, n3) {
    var r3;
    if (n3)
      (r3 = dt2(e3)).channelDataCounts = t9;
    else {
      r3 = ht2(e3);
      for (var a3 = 0; a3 < De2.OBCINumberOfChannelsGanglion; a3++)
        r3.channelData.push(t9[a3] * De2.OBCIGanglionScaleFactorPerCountVolts);
    }
    return r3.timestamp = Date.now(), r3;
  }
  function We2(e3) {
    return parseInt(e3.rawDataPacket[0]) === De2.OBCIGanglionByteIdUncompressed ? function(e4) {
      e4.lastSampleNumber = De2.OBCIGanglionByteIdUncompressed;
      for (var t9 = 0; t9 < 4; t9++)
        e4.decompressedSamples[0][t9] = je2.interpret24bitAsInt32(e4.rawDataPacket.slice(1 + 3 * t9, 1 + 3 * t9 + 3));
      return [Ve2(0, e4.decompressedSamples[0], e4.sendCounts)];
    }(e3) : function(e4) {
      e4.lastSampleNumber = parseInt(e4.rawDataPacket[0]);
      var t9 = [];
      if (e4.lastSampleNumber <= De2.OBCIGanglionByteId18Bit.max)
        switch (Qe2(e4, Ze2(e4.rawDataPacket.slice(De2.OBCIGanglionPacket18Bit.dataStart, De2.OBCIGanglionPacket18Bit.dataStop))), t9.push(Ve2(2 * e4.lastSampleNumber - 1, e4.decompressedSamples[1], e4.sendCounts)), t9.push(Ve2(2 * e4.lastSampleNumber, e4.decompressedSamples[2], e4.sendCounts)), e4.lastSampleNumber % 10) {
          case De2.OBCIGanglionAccelAxisX:
            e4.accelArray[0] = e4.sendCounts ? e4.rawDataPacket.readInt8(De2.OBCIGanglionPacket18Bit.auxByte - 1) : e4.rawDataPacket.readInt8(De2.OBCIGanglionPacket18Bit.auxByte - 1) * De2.OBCIGanglionAccelScaleFactor;
            break;
          case De2.OBCIGanglionAccelAxisY:
            e4.accelArray[1] = e4.sendCounts ? e4.rawDataPacket.readInt8(De2.OBCIGanglionPacket18Bit.auxByte - 1) : e4.rawDataPacket.readInt8(De2.OBCIGanglionPacket18Bit.auxByte - 1) * De2.OBCIGanglionAccelScaleFactor;
            break;
          case De2.OBCIGanglionAccelAxisZ:
            e4.accelArray[2] = e4.sendCounts ? e4.rawDataPacket.readInt8(De2.OBCIGanglionPacket18Bit.auxByte - 1) : e4.rawDataPacket.readInt8(De2.OBCIGanglionPacket18Bit.auxByte - 1) * De2.OBCIGanglionAccelScaleFactor, e4.sendCounts ? t9[0].accelData = e4.accelArray : t9[0].accelDataCounts = e4.accelArray;
        }
      else
        Qe2(e4, $e2(e4.rawDataPacket.slice(De2.OBCIGanglionPacket19Bit.dataStart, De2.OBCIGanglionPacket19Bit.dataStop))), t9.push(Ve2(2 * (e4.lastSampleNumber - 100) - 1, e4.decompressedSamples[1], e4.sendCounts)), t9.push(Ve2(2 * (e4.lastSampleNumber - 100), e4.decompressedSamples[2], e4.sendCounts));
      for (var n3 = 0; n3 < De2.OBCINumberOfChannelsGanglion; n3++)
        e4.decompressedSamples[0][n3] = e4.decompressedSamples[2][n3];
      return t9;
    }(e3);
  }
  function Ye2(e3) {
    var t9 = 0;
    return true & e3[2] && (t9 = 16383), t9 << 18 | e3[0] << 16 | e3[1] << 8 | e3[2];
  }
  function qe2(e3) {
    var t9 = 0;
    return true & e3[2] && (t9 = 8191), t9 << 19 | e3[0] << 16 | e3[1] << 8 | e3[2];
  }
  function Ze2(e3) {
    var t9 = new Array(De2.OBCIGanglionSamplesPerPacket);
    t9[0] = [0, 0, 0, 0], t9[1] = [0, 0, 0, 0];
    for (var n3, r3 = [], a3 = 0; a3 < De2.OBCIGanglionSamplesPerPacket; a3++)
      r3.push([0, 0, 0, 0]);
    return n3 = new Uint8Array([e3[0] >> 6, (63 & e3[0]) << 2 | e3[1] >> 6, (63 & e3[1]) << 2 | e3[2] >> 6]), r3[0][0] = Ye2(n3), n3 = new Uint8Array([(63 & e3[2]) >> 4, e3[2] << 4 | e3[3] >> 4, e3[3] << 4 | e3[4] >> 4]), r3[0][1] = Ye2(n3), n3 = new Uint8Array([(15 & e3[4]) >> 2, e3[4] << 6 | e3[5] >> 2, e3[5] << 6 | e3[6] >> 2]), r3[0][2] = Ye2(n3), n3 = new Uint8Array([3 & e3[6], e3[7], e3[8]]), r3[0][3] = Ye2(n3), n3 = new Uint8Array([e3[9] >> 6, (63 & e3[9]) << 2 | e3[10] >> 6, (63 & e3[10]) << 2 | e3[11] >> 6]), r3[1][0] = Ye2(n3), n3 = new Uint8Array([(63 & e3[11]) >> 4, e3[11] << 4 | e3[12] >> 4, e3[12] << 4 | e3[13] >> 4]), r3[1][1] = Ye2(n3), n3 = new Uint8Array([(15 & e3[13]) >> 2, e3[13] << 6 | e3[14] >> 2, e3[14] << 6 | e3[15] >> 2]), r3[1][2] = Ye2(n3), n3 = new Uint8Array([3 & e3[15], e3[16], e3[17]]), r3[1][3] = Ye2(n3), r3;
  }
  function $e2(e3) {
    var t9 = new Array(De2.OBCIGanglionSamplesPerPacket);
    t9[0] = [0, 0, 0, 0], t9[1] = [0, 0, 0, 0];
    for (var n3, r3 = [], a3 = 0; a3 < De2.OBCIGanglionSamplesPerPacket; a3++)
      r3.push([0, 0, 0, 0]);
    return n3 = new Uint8Array([e3[0] >> 5, (31 & e3[0]) << 3 | e3[1] >> 5, (31 & e3[1]) << 3 | e3[2] >> 5]), r3[0][0] = qe2(n3), n3 = new Uint8Array([(31 & e3[2]) >> 2, e3[2] << 6 | e3[3] >> 2, e3[3] << 6 | e3[4] >> 2]), r3[0][1] = qe2(n3), n3 = new Uint8Array([(3 & e3[4]) << 1 | e3[5] >> 7, (127 & e3[5]) << 1 | e3[6] >> 7, (127 & e3[6]) << 1 | e3[7] >> 7]), r3[0][2] = qe2(n3), n3 = new Uint8Array([(127 & e3[7]) >> 4, (15 & e3[7]) << 4 | e3[8] >> 4, (15 & e3[8]) << 4 | e3[9] >> 4]), r3[0][3] = qe2(n3), n3 = new Uint8Array([(15 & e3[9]) >> 1, e3[9] << 7 | e3[10] >> 1, e3[10] << 7 | e3[11] >> 1]), r3[1][0] = qe2(n3), n3 = new Uint8Array([(1 & e3[11]) << 2 | e3[12] >> 6, e3[12] << 2 | e3[13] >> 6, e3[13] << 2 | e3[14] >> 6]), r3[1][1] = qe2(n3), n3 = new Uint8Array([(56 & e3[14]) >> 3, (7 & e3[14]) << 5 | (248 & e3[15]) >> 3, (7 & e3[15]) << 5 | (248 & e3[16]) >> 3]), r3[1][2] = qe2(n3), n3 = new Uint8Array([7 & e3[16], e3[17], e3[18]]), r3[1][3] = qe2(n3), r3;
  }
  function Xe2(e3) {
    return { channel: e3, P: { raw: -1, text: De2.OBCIImpedanceTextInit }, N: { raw: -1, text: De2.OBCIImpedanceTextInit } };
  }
  function Ke2(e3) {
    var t9;
    try {
      switch (ft2(e3.rawDataPacket[De2.OBCIPacketPositionStopByte])) {
        case De2.OBCIStreamPacketStandardAccel:
          t9 = je2.parsePacketStandardAccel(e3);
          break;
        case De2.OBCIStreamPacketStandardRawAux:
          t9 = je2.parsePacketStandardRawAux(e3);
          break;
        case De2.OBCIStreamPacketAccelTimeSyncSet:
        case De2.OBCIStreamPacketAccelTimeSynced:
          t9 = je2.parsePacketTimeSyncedAccel(e3);
          break;
        case De2.OBCIStreamPacketRawAuxTimeSyncSet:
        case De2.OBCIStreamPacketRawAuxTimeSynced:
          t9 = je2.parsePacketTimeSyncedRawAux(e3);
          break;
        case De2.OBCIStreamPacketImpedance:
          t9 = je2.parsePacketImpedance(e3);
          break;
        default:
          t9 = { error: "bad stop byte ".concat(e3.rawDataPacket.slice(32, 33).toString("hex")), valid: false, rawDataPacket: e3.rawDataPacket }, e3.verbose && console.log(t9.error);
      }
    } catch (n3) {
      t9 = { error: n3, valid: false, rawDataPacket: e3.rawDataPacket }, e3.verbose && console.log(n3);
    }
    return t9;
  }
  function Je2(e3, t9, n3) {
    var r3 = e3.match(t9);
    if (r3) {
      var a3 = parseInt(e3.charAt(r3.index + n3));
      if (Number.isNaN(a3))
        throw new Error(De2.OBCIErrorInvalidData);
      return Boolean(a3);
    }
    throw new Error(De2.OBCIErrorMissingRegisterSetting);
  }
  function et2(e3) {
    return Je2(e3, De2.OBCIRegisterQueryNameMISC1, 21);
  }
  function tt2(e3, t9) {
    return Je2(e3, De2.OBCIRegisterQueryNameBIASSENSP, 20 + 3 * t9);
  }
  function nt2(e3, t9, n3) {
    var r3 = e3.match(t9);
    if (r3) {
      var a3 = parseInt(e3.charAt(r3.index + n3)), o3 = parseInt(e3.charAt(r3.index + n3 + 3)), i3 = parseInt(e3.charAt(r3.index + n3 + 6));
      if (Number.isNaN(a3) || Number.isNaN(o3) || Number.isNaN(i3))
        throw new Error(De2.OBCIErrorInvalidData);
      return a3 << 2 | o3 << 1 | i3;
    }
    throw new Error(De2.OBCIErrorMissingRegisterSetting);
  }
  function rt2(e3, t9) {
    var n3 = De2.OBCIRegisterQueryNameCHnSET[t9.channelNumber];
    void 0 === n3 && (n3 = De2.OBCIRegisterQueryNameCHnSET[t9.channelNumber - De2.OBCINumberOfChannelsCyton]), t9.powerDown = Je2(e3, n3, 16), t9.gain = De2.gainForCommand(nt2(e3, n3, 19)), t9.inputType = De2.inputTypeForCommand(nt2(e3, n3, 31)), t9.srb2 = Je2(e3, n3, 28);
  }
  function at2(e3) {
    var t9 = De2.OBCIPacketSize - 1;
    if (e3.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    return e3.readUInt32BE(t9 - De2.OBCIStreamPacketTimeByteSize);
  }
  function ot2(e3) {
    var t9 = De2.OBCIPacketSize - 1 - De2.OBCIStreamPacketTimeByteSize - 2;
    if (e3.rawDataPacket.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    var n3 = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber], r3 = je2.interpret16bitAsInt32(e3.rawDataPacket.slice(t9, t9 + 2));
    switch (n3 % 10) {
      case De2.OBCIAccelAxisX:
        return e3.accelArray[0] = e3.scale ? r3 * _e2 : r3, false;
      case De2.OBCIAccelAxisY:
        return e3.accelArray[1] = e3.scale ? r3 * _e2 : r3, false;
      case De2.OBCIAccelAxisZ:
        return e3.accelArray[2] = e3.scale ? r3 * _e2 : r3, true;
      default:
        return false;
    }
  }
  function it2(e3) {
    if (e3.byteLength !== De2.OBCIPacketSize)
      throw new Error(De2.OBCIErrorInvalidByteLength);
    return Uint8Array.from(e3.slice(De2.OBCIPacketPositionTimeSyncAuxStart, De2.OBCIPacketPositionTimeSyncAuxStop));
  }
  function ct2(e3) {
    for (var t9 = [], n3 = 0; n3 < 3; n3++) {
      var r3 = 2 * n3;
      t9.push(je2.interpret16bitAsInt32(e3.slice(r3, r3 + 2)) * _e2);
    }
    return t9;
  }
  function lt2(e3) {
    for (var t9 = [], n3 = 0; n3 < 3; n3++) {
      var r3 = 2 * n3;
      t9.push(je2.interpret16bitAsInt32(e3.slice(r3, r3 + 2)));
    }
    return t9;
  }
  function ut2(e3) {
    if (!Array.isArray(e3.channelSettings))
      throw new Error("Error [getChannelDataArray]: Channel Settings must be an array!");
    e3.hasOwnProperty("protocol") || (e3.protocol = De2.OBCIProtocolSerial);
    var t9 = [], n3 = e3.channelSettings.length, r3 = e3.rawDataPacket[De2.OBCIPacketPositionSampleNumber], a3 = n3 === De2.OBCINumberOfChannelsDaisy, o3 = De2.OBCINumberOfChannelsCyton;
    a3 || (o3 = e3.channelSettings.length);
    for (var i3 = 0; i3 < o3; i3++) {
      if (!e3.channelSettings[i3].hasOwnProperty("gain"))
        throw new Error("Error [getChannelDataArray]: Invalid channel settings object at index ".concat(i3));
      if (!De2.isNumber(e3.channelSettings[i3].gain))
        throw new Error("Error [getChannelDataArray]: Property gain of channelSettingsObject not or type Number");
      var c3 = 0;
      if (e3.protocol === De2.OBCIProtocolSerial)
        c3 = Bt2(r3) && a3 ? 4.5 / e3.channelSettings[i3 + De2.OBCINumberOfChannelsDefault].gain / (Math.pow(2, 23) - 1) : 4.5 / e3.channelSettings[i3].gain / (Math.pow(2, 23) - 1);
      else if (e3.protocol === De2.OBCIProtocolWifi)
        c3 = a3 ? e3.lastSampleNumber === r3 ? 4.5 / e3.channelSettings[i3 + De2.OBCINumberOfChannelsDefault].gain / (Math.pow(2, 23) - 1) : 4.5 / e3.channelSettings[i3].gain / (Math.pow(2, 23) - 1) : e3.channelSettings.length === De2.OBCINumberOfChannelsCyton ? 4.5 / e3.channelSettings[i3].gain / (Math.pow(2, 23) - 1) : De2.OBCIGanglionScaleFactorPerCountVolts;
      else {
        if (e3.protocol !== De2.OBCIProtocolBLE)
          throw new Error("Error [getChannelDataArray]: Invalid protocol must be wifi or serial");
        c3 = 4.5 / e3.channelSettings[i3].gain / (Math.pow(2, 23) - 1);
      }
      t9.push(c3 * je2.interpret24bitAsInt32(e3.rawDataPacket.slice(3 * i3 + De2.OBCIPacketPositionChannelDataStart, 3 * i3 + De2.OBCIPacketPositionChannelDataStart + 3)));
    }
    return t9;
  }
  function st2(e3) {
    if (!Array.isArray(e3.channelSettings))
      throw new Error("Error [getChannelDataArrayNoScale]: Channel Settings must be an array!");
    var t9 = [], n3 = e3.channelSettings.length;
    n3 > De2.OBCINumberOfChannelsDefault && (n3 = De2.OBCINumberOfChannelsDefault);
    for (var r3 = 0; r3 < n3; r3++)
      t9.push(je2.interpret24bitAsInt32(e3.rawDataPacket.slice(3 * r3 + De2.OBCIPacketPositionChannelDataStart, 3 * r3 + De2.OBCIPacketPositionChannelDataStart + 3)));
    return t9;
  }
  function ft2(e3) {
    return 15 & e3;
  }
  function Ct2(e3) {
    return e3 || 0 === e3 ? e3 > 255 && (e3 = 255) : e3 = 69, e3;
  }
  function ht2(e3) {
    return e3 || 0 === e3 ? e3 > 255 && (e3 = 255) : e3 = 0, { startByte: De2.OBCIByteStart, sampleNumber: e3, channelData: [], accelData: [], auxData: null, stopByte: De2.OBCIByteStop, boardTime: 0, timestamp: 0, valid: true };
  }
  function dt2(e3) {
    return e3 || 0 === e3 ? e3 > 255 && (e3 = 255) : e3 = 0, { startByte: De2.OBCIByteStart, sampleNumber: e3, channelDataCounts: [], accelDataCounts: [], auxData: null, stopByte: De2.OBCIByteStop, boardTime: 0, timestamp: 0, valid: true };
  }
  function mt2(e3) {
    var t9 = new Uint8Array(3);
    t9.fill(0);
    var n3 = e3 / (0.1875 / (Math.pow(2, 23) - 1));
    return n3 = Math.floor(n3), t9[2] = 255 & n3, t9[1] = (65280 & n3) >> 8, t9[0] = (n3 & 255 << 16) >> 16, t9;
  }
  function pt2(e3) {
    var t9 = new Uint8Array(2);
    t9.fill(0);
    var n3 = e3 / _e2;
    return n3 = Math.floor(n3), t9[1] = 255 & n3, t9[0] = (65280 & n3) >> 8, t9;
  }
  function Bt2(e3) {
    return e3 % 2 == 0;
  }
  function yt2(e3, t9, n3) {
    var r3 = new Uint8Array(De2.OBCIPacketSize);
    r3.fill(0), r3[0] = De2.OBCIByteStart, r3[1] = e3.sampleNumber;
    for (var a3 = 0; a3 < De2.OBCINumberOfChannelsDefault; a3++) {
      mt2(e3.channelData[a3]).copy(r3, 2 + 3 * a3);
    }
    return n3.copy(r3, 26), r3.writeInt32BE(t9, 28), r3[De2.OBCIPacketSize - 1] = Ot2(De2.OBCIStreamPacketRawAuxTimeSynced), r3;
  }
  function It2(e3, t9) {
    var n3 = new Uint8Array(De2.OBCIPacketSize);
    n3.fill(0), n3[0] = De2.OBCIByteStart, n3[1] = e3.sampleNumber;
    for (var r3 = 0; r3 < De2.OBCINumberOfChannelsDefault; r3++) {
      mt2(e3.channelData[r3]).copy(n3, 2 + 3 * r3);
    }
    return n3.writeInt32BE(t9, 28), n3[De2.OBCIPacketSize - 1] = Ot2(De2.OBCIStreamPacketAccelTimeSynced), n3;
  }
  function Ot2(e3) {
    return (e3 < 0 || e3 > 15) && (e3 = 0), De2.OBCIByteStop | e3;
  }
  function St2(e3) {
    return (240 & e3) === De2.OBCIByteStop;
  }
  function bt2(e3, t9) {
    if (null == e3)
      return {};
    var n3, r3, a3 = function(e4, t10) {
      if (null == e4)
        return {};
      var n4, r4, a4 = {}, o4 = Object.keys(e4);
      for (r4 = 0; r4 < o4.length; r4++)
        n4 = o4[r4], t10.indexOf(n4) >= 0 || (a4[n4] = e4[n4]);
      return a4;
    }(e3, t9);
    if (Object.getOwnPropertySymbols) {
      var o3 = Object.getOwnPropertySymbols(e3);
      for (r3 = 0; r3 < o3.length; r3++)
        n3 = o3[r3], t9.indexOf(n3) >= 0 || Object.prototype.propertyIsEnumerable.call(e3, n3) && (a3[n3] = e3[n3]);
    }
    return a3;
  }
  var vt2 = ["channelData"];
  function wt2(e3, t9) {
    var n3 = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var r3 = Object.getOwnPropertySymbols(e3);
      t9 && (r3 = r3.filter(function(t10) {
        return Object.getOwnPropertyDescriptor(e3, t10).enumerable;
      })), n3.push.apply(n3, r3);
    }
    return n3;
  }
  function gt2(e3) {
    for (var t9 = 1; t9 < arguments.length; t9++) {
      var n3 = null != arguments[t9] ? arguments[t9] : {};
      t9 % 2 ? wt2(Object(n3), true).forEach(function(t10) {
        s2(e3, t10, n3[t10]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(n3)) : wt2(Object(n3)).forEach(function(t10) {
        Object.defineProperty(e3, t10, Object.getOwnPropertyDescriptor(n3, t10));
      });
    }
    return e3;
  }
  var Pt2 = function(e3) {
    var t9 = e3.channelData;
    return gt2(gt2({}, bt2(e3, vt2)), {}, { data: t9 });
  };
  var kt2 = { reader: "2d30c082-f39f-4ce6-923f-3484ea480596", writer: "2d30c083-f39f-4ce6-923f-3484ea480596", connection: "2d30c084-f39f-4ce6-923f-3484ea480596" };
  var Dt2 = { filters: [{ namePrefix: "Ganglion-" }], optionalServices: [65156] };
  var xt2 = { start: "b", accelData: "n" };
  function Et2(e3, t9) {
    var n3 = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var r3 = Object.getOwnPropertySymbols(e3);
      t9 && (r3 = r3.filter(function(t10) {
        return Object.getOwnPropertyDescriptor(e3, t10).enumerable;
      })), n3.push.apply(n3, r3);
    }
    return n3;
  }
  function At2(e3) {
    for (var t9 = 1; t9 < arguments.length; t9++) {
      var n3 = null != arguments[t9] ? arguments[t9] : {};
      t9 % 2 ? Et2(Object(n3), true).forEach(function(t10) {
        s2(e3, t10, n3[t10]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(n3)) : Et2(Object(n3)).forEach(function(t10) {
        Object.defineProperty(e3, t10, Object.getOwnPropertyDescriptor(n3, t10));
      });
    }
    return e3;
  }
  function Nt2(e3) {
    var t9 = parseInt(e3.rawDataPacket[0]);
    if (t9 <= De2.OBCIGanglionByteId19Bit.max)
      return We2(e3);
    switch (t9) {
      case De2.OBCIGanglionByteIdMultiPacket:
        return processMultiBytePacket(e3);
      case De2.OBCIGanglionByteIdMultiPacketStop:
        return processMultiBytePacketStop(e3);
      case De2.OBCIGanglionByteIdImpedanceChannel1:
      case De2.OBCIGanglionByteIdImpedanceChannel2:
      case De2.OBCIGanglionByteIdImpedanceChannel3:
      case De2.OBCIGanglionByteIdImpedanceChannel4:
      case De2.OBCIGanglionByteIdImpedanceChannelReference:
        return processImpedanceData(e3);
      default:
        return null;
    }
  }
  var Tt2 = function() {
    function e3() {
      var t10 = this, n4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      function r4(e4) {
        return { channelNumber: e4, powerDown: false, gain: 24, inputType: "normal", bias: true, srb2: true, srb1: false };
      }
      m2(this, e3), this.options = n4, this.gatt = null, this.device = null, this.deviceName = null, this.service = null, this.characteristics = null, this.onDisconnect$ = new K2(), this.boardName = "ganglion", this.channelSize = 4;
      var a4 = function(e4) {
        for (var t11 = [], n5 = 0; n5 < e4; n5++)
          t11.push(r4(n5));
        return t11;
      };
      function o4(e4) {
        for (var t11 = [], n5 = 0; n5 < 3; n5++)
          t11.push(new Array(e4));
        return t11;
      }
      this.rawDataPacketToSample = { accelArray: [0, 0, 0], channelSettings: a4(4), decompressedSamples: o4(4), lastSampleNumber: 0, rawDataPacket: new Uint8Array(33).buffer, rawDataPackets: [], scale: true, sendCounts: false, timeOffset: 0, verbose: false }, this.connectionStatus = new ee2(false), this.stream = new K2().pipe(ce2(function(e4) {
        return t10.eventToBufferMapper(e4);
      }), be2(function(e4) {
        return t10.setRawDataPacket(e4);
      }), ce2(function() {
        return Nt2(t10.rawDataPacketToSample);
      }), se2(function(e4) {
        return e4;
      }), ce2(Pt2), Se2(this.onDisconnect$)), this.accelData = this.stream.pipe(pe2(function(e4) {
        return e4.accelData.length;
      }));
    }
    var t9, n3, r3, a3, o3;
    return t9 = e3, n3 = [{ key: "eventToBufferMapper", value: function(e4) {
      return new Uint8Array(e4.target.value.buffer);
    } }, { key: "setRawDataPacket", value: function(e4) {
      this.rawDataPacketToSample.rawDataPacket = e4;
    } }, { key: "connect", value: (o3 = d2(y2.mark(function e4() {
      return y2.wrap(function(e5) {
        for (; ; )
          switch (e5.prev = e5.next) {
            case 0:
              return e5.next = 2, navigator.bluetooth.requestDevice(Dt2);
            case 2:
              return this.device = e5.sent, this.addDisconnectedEvent(), e5.next = 6, this.device.gatt.connect();
            case 6:
              return this.gatt = e5.sent, this.deviceName = this.gatt.device.name, e5.next = 10, this.gatt.getPrimaryService(65156);
            case 10:
              return this.service = e5.sent, e5.t0 = this, e5.next = 14, this.service.getCharacteristics();
            case 14:
              e5.t1 = e5.sent, e5.t0.setCharacteristics.call(e5.t0, e5.t1), this.connectionStatus.next(true);
            case 17:
            case "end":
              return e5.stop();
          }
      }, e4, this);
    })), function() {
      return o3.apply(this, arguments);
    }) }, { key: "setCharacteristics", value: function(e4) {
      this.characteristics = Object.entries(kt2).reduce(function(t10, n4) {
        var r4 = C2(n4, 2), a4 = r4[0], o4 = r4[1];
        return At2(At2({}, t10), {}, s2({}, a4, e4.find(function(e5) {
          return e5.uuid === o4;
        })));
      }, {});
    } }, { key: "start", value: (a3 = d2(y2.mark(function e4() {
      var t10, n4, r4, a4, o4 = this;
      return y2.wrap(function(e5) {
        for (; ; )
          switch (e5.prev = e5.next) {
            case 0:
              if (t10 = this.characteristics, n4 = t10.reader, r4 = t10.writer, a4 = Object.entries(xt2).reduce(function(e6, t11) {
                var n5 = C2(t11, 2), r5 = n5[0], a5 = n5[1];
                return At2(At2({}, e6), {}, s2({}, r5, new TextEncoder().encode(a5)));
              }, {}), n4.startNotifications(), n4.addEventListener("characteristicvaluechanged", function(e6) {
                o4.stream.next(e6);
              }), !this.options.accelData) {
                e5.next = 8;
                break;
              }
              return e5.next = 7, r4.writeValue(a4.accelData);
            case 7:
              n4.readValue();
            case 8:
              return e5.next = 10, r4.writeValue(a4.start);
            case 10:
              n4.readValue();
            case 11:
            case "end":
              return e5.stop();
          }
      }, e4, this);
    })), function() {
      return a3.apply(this, arguments);
    }) }, { key: "addDisconnectedEvent", value: function() {
      var e4 = this;
      de2(this.device, "gattserverdisconnected").pipe(function(e5, t10) {
        var n4 = arguments.length >= 2;
        return function(r4) {
          return r4.pipe(e5 ? pe2(function(t11, n5) {
            return e5(t11, n5, r4);
          }) : Q2, ye2(1), n4 ? Be2(t10) : Ie2(function() {
            return new ie2();
          }));
        };
      }()).subscribe(function() {
        e4.gatt = null, e4.device = null, e4.deviceName = null, e4.service = null, e4.characteristics = null, e4.connectionStatus.next(false);
      });
    } }, { key: "disconnect", value: function() {
      this.gatt && (this.onDisconnect$.next(), this.gatt.disconnect());
    } }], n3 && p2(t9.prototype, n3), r3 && p2(t9, r3), Object.defineProperty(t9, "prototype", { writable: false }), e3;
  }();
  var Rt2 = ["FP1", "FP2", "C3", "C4"];
  var Ft2 = { label: "ganglion", device: Tt2, onconnect: (e3) => n2(void 0, void 0, void 0, function* () {
    let t9 = e3.device;
    yield t9.start(), t9.stream.subscribe((t10) => {
      let n3 = {};
      t10.data.forEach((e4, t11) => n3[Rt2[t11]] = e4), e3.ondata(n3, t10.timestamp);
    });
  }), protocols: ["bluetooth"] };

  // ../htil/plugins/devices/ganglion/index.js
  var ganglion_default = (trigger) => trigger ? Ft2 : void 0;

  // ../htil/plugins/datastreams/plugins/start/index.js
  var start_exports = {};
  __export(start_exports, {
    default: () => start_default,
    tagName: () => tagName3
  });

  // node_modules/.cache/cdn.jsdelivr.net/npm/datastreams-api/dist/index.esm.js
  function __awaiter(thisArg, _arguments, P3, generator) {
    function adopt(value) {
      return value instanceof P3 ? value : new P3(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P3 || (P3 = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e3) {
          reject(e3);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e3) {
          reject(e3);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  var DataTrackConstraints = class {
    constructor(track) {
      this.channelCount = void 0;
      this.latency = void 0;
      this.sampleRate = void 0;
      this.sampleSize = void 0;
      this.volume = void 0;
      this.whiteBalanceMode = void 0;
      this.exposureMode = void 0;
      this.focusMode = void 0;
      this.pointOfInterest = void 0;
      this.exposureCompensation = void 0;
      this.colorTemperature = void 0;
      this.iso = void 0;
      this.brightness = void 0;
      this.contrast = void 0;
      this.saturation = void 0;
      this.sharpness = void 0;
      this.focusDistance = void 0;
      this.zoom = void 0;
      this.torch = void 0;
      this.aspectRatio = void 0;
      this.frameRate = void 0;
      this.height = void 0;
      this.width = void 0;
      this.resizeMode = void 0;
      this.cursor = ["always", "motion", "never"];
      this.displaySurface = ["application", "browser", "monitor", "window"];
      this.logicalSurface = false;
      console.error("TODO: Get Constraints", track);
      return this;
    }
  };
  var DataTrackSettings = class extends DataTrackConstraints {
    constructor(track) {
      super(track);
      let constraints = track.getConstraints();
      this.deviceId = constraints.deviceId;
      this.groupId = constraints.groupId;
      this.autoGainControl = constraints.autoGainControl;
      this.channelCount = constraints.channelCount;
      this.echoCancellation = constraints.echoCancellation;
      this.latency = constraints.latency;
      this.noiseSuppression = constraints.noiseSuppression;
      this.sampleRate = constraints.sampleRate;
      this.sampleSize = constraints.sampleSize;
      this.volume = constraints.volume;
      this.aspectRatio = constraints.aspectRatio;
      this.facingMode = constraints.facingMode;
      this.frameRate = constraints.frameRate;
      this.height = constraints.height;
      this.width = constraints.width;
      this.resizeMode = constraints.resizeMode;
      this.cursor = constraints.cursor;
      this.displaySurface = constraints.displaySurface;
      this.logicalSurface = constraints.logicalSurface;
    }
  };
  var DataTrackCapabilities = class {
    constructor(track) {
      console.error("TODO: Get Capabilities", track);
    }
  };
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }
  var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  function validate2(uuid) {
    return typeof uuid === "string" && REGEX.test(uuid);
  }
  var byteToHex = [];
  for (i3 = 0; i3 < 256; ++i3) {
    byteToHex.push((i3 + 256).toString(16).substr(1));
  }
  var i3;
  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!validate2(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  function v4(options2, buf, offset) {
    options2 = options2 || {};
    var rnds = options2.random || (options2.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i3 = 0; i3 < 16; ++i3) {
        buf[offset + i3] = rnds[i3];
      }
      return buf;
    }
    return stringify(rnds);
  }
  var randomUUID = () => {
    if (globalThis.crypto)
      return globalThis.crypto.randomUUID();
    else
      return v4();
  };
  var DataStreamTrack = class extends EventTarget {
    constructor(device, track, contentHint = "") {
      var _a, _b, _c, _d, _e3, _f, _g, _h;
      super();
      this.contentHint = "";
      this.enabled = false;
      this.isolated = false;
      this.muted = false;
      this.remote = false;
      this.id = "";
      this.kind = "";
      this.label = "";
      this.readyState = "live";
      this.data = [];
      this.timestamps = [];
      this.writable = new WritableStream({
        start: () => {
        },
        write: (chunk) => this.addData(chunk, Date.now())
      });
      this.callbacks = /* @__PURE__ */ new Map();
      this.pipeline = [];
      this._bufferSize = 256 * 60 * 2;
      this.deinit = () => {
        this.dispatchEvent(new Event("ended"));
      };
      this.applyConstraints = () => __awaiter(this, void 0, void 0, function* () {
      });
      this.clone = () => {
        return this;
      };
      this.getCapabilities = () => {
        return new DataTrackCapabilities(this);
      };
      this.getConstraints = () => {
        return new DataTrackConstraints(this);
      };
      this.getSettings = () => {
        return new DataTrackSettings(this);
      };
      this.stop = () => {
        this.readable.cancel();
        this.writable.abort();
      };
      this.addData = (values, timestamps = [Date.now()]) => {
        if (!Array.isArray(values))
          values = [values];
        this.data.push(...values);
        if (!Array.isArray(timestamps))
          timestamps = [timestamps];
        const lastTime = timestamps[timestamps.length - 1];
        if (values.length !== timestamps.length)
          timestamps = Array.from({ length: values.length }, (_3, i3) => {
            var _a2;
            return (_a2 = timestamps === null || timestamps === void 0 ? void 0 : timestamps[i3]) !== null && _a2 !== void 0 ? _a2 : lastTime;
          });
        this.timestamps.push(...timestamps);
        if (this.controller)
          values.forEach((v3) => {
            var _a2;
            return (_a2 = this.controller) === null || _a2 === void 0 ? void 0 : _a2.enqueue(v3);
          });
        const diff = this.data.length - this._bufferSize;
        for (let i3 = diff; i3 > 0; i3--)
          this.data.shift();
        this.ondata(values, timestamps);
      };
      this.ondata = (data, timestamp) => {
        this.callbacks.forEach((f3) => {
          f3(data, timestamp);
        });
      };
      this.subscribe = (callback) => {
        let id = randomUUID();
        this.callbacks.set(id, callback);
        return id;
      };
      this.unsubscribe = (id) => this.callbacks.delete(id);
      this.id = (_a = device === null || device === void 0 ? void 0 : device.id) !== null && _a !== void 0 ? _a : randomUUID();
      this.kind = (_c = (_b = device === null || device === void 0 ? void 0 : device.constraints) === null || _b === void 0 ? void 0 : _b.kind) !== null && _c !== void 0 ? _c : this.kind;
      this.label = (_e3 = (_d = device === null || device === void 0 ? void 0 : device.constraints) === null || _d === void 0 ? void 0 : _d.label) !== null && _e3 !== void 0 ? _e3 : this.label;
      this.callbacks = /* @__PURE__ */ new Map();
      this.data = [];
      if (typeof this.contentHint === "string")
        this.contentHint = contentHint;
      this._bufferSize = (_g = (_f = device === null || device === void 0 ? void 0 : device.constraints) === null || _f === void 0 ? void 0 : _f.bufferSize) !== null && _g !== void 0 ? _g : this._bufferSize;
      this.pipeline = [];
      const pull = () => {
      };
      const cancel = () => this.controller = void 0;
      this.readable = new ReadableStream({
        start: (controller) => {
          this.controller = controller;
        },
        pull,
        cancel
      });
      if (track) {
        if ("MediaStreamTrackProcessor" in globalThis) {
          const readable = (_h = new MediaStreamTrackProcessor({ track })) === null || _h === void 0 ? void 0 : _h.readable;
          const [r1, r22] = readable.tee();
          r1.pipeTo(new WritableStream({
            start: () => {
            },
            write: (chunk) => this.addData(chunk, Date.now())
          }));
          this.readable = r22;
        } else {
          alert("Your browser does not support the experimental MediaStreamTrack API for Insertable Streams of Media");
        }
      }
    }
    get [Symbol.toStringTag]() {
      return "DataStreamTrack";
    }
  };
  var DataDeviceInfo = (constraints) => {
    const protocols = /* @__PURE__ */ new Set();
    if (Array.isArray(constraints.protocols))
      constraints.protocols.forEach((str) => protocols.add(str));
    else {
      if (constraints.serviceUUID)
        protocols.add("bluetooth");
      if (constraints.usbVendorId)
        protocols.add("serial");
      if (constraints.url) {
        protocols.add("wifi");
        protocols.add("websocket");
      }
    }
    return {
      deviceId: randomUUID(),
      groupId: randomUUID(),
      kind: constraints.kind,
      label: constraints.label,
      protocols: Array.from(protocols),
      modes: constraints === null || constraints === void 0 ? void 0 : constraints.modes
    };
  };
  var DataStream = class extends MediaStream {
    constructor(arg = []) {
      super(arg);
      this.tracks = /* @__PURE__ */ new Map();
      this.addTrack = this.addTrack;
      this.getDataTracks = () => [...this.tracks.values()];
      this._addTrack = this.addTrack;
      this._getTracks = this.getTracks;
      this._removeTrack = this.removeTrack;
      this.addTrack = (track) => {
        if (![...this.tracks.values()].includes(track)) {
          if (track instanceof MediaStreamTrack) {
            this._addTrack(track);
            track = new DataStreamTrack(void 0, track);
          }
          this.tracks.set(track.contentHint || this.tracks.size, track);
          this.dispatchEvent(new CustomEvent("addtrack", { detail: track }));
        }
        return track;
      };
      this.removeTrack = (track) => {
        if ([...this.tracks.values()].includes(track)) {
          try {
            this._removeTrack(track);
          } catch (_a) {
          }
          for (let [key, value] of this.tracks.entries()) {
            if (value === track) {
              this.tracks.delete(key);
              this.dispatchEvent(new CustomEvent("removetrack", { detail: track }));
            }
          }
        }
        return track;
      };
      this.getTracks = () => {
        const mediaTracks = this._getTracks();
        const dataTracks = this.getDataTracks();
        return [...mediaTracks, ...dataTracks];
      };
      this.addEventListener("addtrack", (ev) => {
        ev.track = ev.detail;
        delete ev.detail;
      });
      this.addEventListener("removetrack", (ev) => {
        ev.track = ev.detail;
        delete ev.detail;
      });
      let arr = !Array.isArray(arg) ? [...arg.getTracks()] : [...arg];
      arr.forEach((t9) => this.addTrack(t9));
    }
    get [Symbol.toStringTag]() {
      return "DataStream";
    }
  };
  var Device = class {
    constructor(constraints) {
      var _a;
      this.id = randomUUID();
      this._ondata = (data) => data;
      this.active = false;
      this.debug = false;
      this.init = (constraints2) => {
        var _a2, _b, _c;
        if (this.active)
          this.disconnect();
        if (constraints2) {
          Object.assign(this.constraints, constraints2);
          this.onconnect = (_a2 = this.constraints.onconnect) !== null && _a2 !== void 0 ? _a2 : this.onconnect;
          this.ondisconnect = (_b = this.constraints.ondisconnect) !== null && _b !== void 0 ? _b : this.ondisconnect;
          if (this.constraints.ondata)
            this._ondata = this.constraints.ondata;
          this.onerror = (_c = this.constraints.onerror) !== null && _c !== void 0 ? _c : this.onerror;
          if (this.constraints.encode instanceof Function)
            this.encode = this.constraints.encode;
          else
            this.encoder = new TextEncoder();
          if (this.constraints.decode instanceof Function)
            this.decode = this.constraints.decode;
          else
            this.decoder = new TextDecoder("utf-8");
          if (this.constraints.oninit instanceof Function)
            this.oninit = this.constraints.oninit;
        }
        this.oninit(this);
      };
      this.connect = () => __awaiter(this, void 0, void 0, function* () {
        if (!(this.device instanceof Device) && this.device.connect)
          yield this.device.connect();
        this.active = true;
        this._connect();
        this.onconnect(this);
      });
      this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
        var _b;
        if (!(this.device instanceof Device) && this.device.disconnect)
          yield this.device.disconnect();
        this.active = false;
        (_b = this.stream) === null || _b === void 0 ? void 0 : _b.tracks.forEach((t9) => {
          var _a2;
          return (_a2 = this.stream) === null || _a2 === void 0 ? void 0 : _a2.removeTrack(t9);
        });
        this._disconnect();
        this.ondisconnect(this);
      });
      this._connect = () => __awaiter(this, void 0, void 0, function* () {
      });
      this._disconnect = () => __awaiter(this, void 0, void 0, function* () {
      });
      this.send = (msg, from) => __awaiter(this, void 0, void 0, function* () {
        this.onsend(msg, from);
      });
      this.encode = (msg, _3) => this.encoder.encode(msg);
      this.decode = (msg, _3) => this.decoder.decode(msg);
      this.oninit = (_3 = this) => __awaiter(this, void 0, void 0, function* () {
      });
      this.onconnect = (target = this) => __awaiter(this, void 0, void 0, function* () {
        return this.debug ? console.log(`${target.constructor.name} connected!`) : {};
      });
      this.ondisconnect = (target = this) => __awaiter(this, void 0, void 0, function* () {
        return this.debug ? console.log(`${target.constructor.name} disconnected!`) : {};
      });
      this.onsend = (msg, from) => __awaiter(this, void 0, void 0, function* () {
        return this.debug ? console.log(`Sent ${msg} from ${from}`) : {};
      });
      this.onerror = (err) => __awaiter(this, void 0, void 0, function* () {
        return this.debug ? console.log(`${this.constructor.name} Error: ${err}`) : {};
      });
      this.ondata = (data, timestamps = [Date.now()], charName) => {
        if (this._ondata instanceof Function) {
          let obj = this._ondata(data, charName);
          if (this.stream) {
            const keys = Object.keys(obj);
            keys.forEach((key) => {
              var _a2;
              if (this.stream) {
                let track = (_a2 = this.stream.tracks.get(key)) !== null && _a2 !== void 0 ? _a2 : this._createTrack(String(key));
                if (track instanceof DataStreamTrack)
                  track.addData(obj[key], timestamps);
              }
            });
          }
        }
      };
      this._createTrack = (contentHint) => {
        if (this.stream) {
          const newTrack = new DataStreamTrack(this, void 0, contentHint);
          return this.stream.addTrack(newTrack);
        } else
          return void 0;
      };
      if (Array.isArray(constraints)) {
        this.constraints = constraints[0];
        this.options = [...constraints];
      } else {
        this.constraints = constraints;
        this.options = [constraints];
      }
      this.device = this.constraints.device ? new this.constraints.device(this.constraints) : this;
      this.stream = this.constraints.stream;
      this.debug = (_a = this.constraints.debug) !== null && _a !== void 0 ? _a : false;
      this.init(this.constraints);
    }
  };
  var Bluetooth = class extends Device {
    constructor(constraints) {
      super(constraints);
      this.characteristics = {};
      this.connect = () => __awaiter(this, void 0, void 0, function* () {
        let filters = [];
        filters.push({ services: this.options.map((o3) => typeof o3.serviceUUID === "string" ? o3.serviceUUID.toLowerCase() : o3.serviceUUID).filter((str) => !!str) });
        this.options.forEach((o3) => {
          if (o3.namePrefix)
            filters.push({ namePrefix: o3.namePrefix });
        });
        yield navigator.bluetooth.requestDevice({
          filters
        }).then((source) => {
          this.source = source;
          let gatt = source.gatt;
          if (gatt)
            return gatt.connect();
          else
            return Promise.reject();
        }).then((server) => {
          var _a;
          const serviceUUID = (_a = this.options.find((o3) => {
            var _a2;
            return (o3 === null || o3 === void 0 ? void 0 : o3.namePrefix) && ((_a2 = server.device.name) === null || _a2 === void 0 ? void 0 : _a2.includes(o3.namePrefix));
          })) === null || _a === void 0 ? void 0 : _a.serviceUUID;
          if (serviceUUID) {
            this.server = server;
            return server.getPrimaryService(serviceUUID);
          } else
            return Promise.reject();
        }).then((service) => __awaiter(this, void 0, void 0, function* () {
          this.service = service;
          if (this.source)
            this.source.addEventListener("gattserverdisconnected", () => {
              this.ondisconnect(this);
            });
          for (let name2 in this.constraints.characteristics)
            yield this.connectCharacteristic(name2, this.constraints.characteristics[name2]);
          this.onconnect(this);
        })).catch((err) => {
          console.error(err);
          this.onerror(err);
          return Promise.reject();
        });
      });
      this._disconnect = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.disconnect();
      });
      this.send = (msg, charName) => __awaiter(this, void 0, void 0, function* () {
        if (this.transmitCharacteristic)
          return this.transmitCharacteristic.writeValue(this.encode(msg, charName));
      });
      this.onnotification = (e3, charName) => {
        this.ondata(this.decode(e3.target.value, charName), Date.now(), charName);
      };
      this.connectCharacteristic = (name2, value) => __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(value))
          yield Promise.all(value.map((val, i3) => this.connectCharacteristic(`${name2}${i3}`, val)));
        else {
          value = typeof value === "string" ? value.toLowerCase() : value;
          if (this.service) {
            const characteristic = yield this.service.getCharacteristic(value);
            this.characteristics[name2] = characteristic;
            let props = characteristic.properties;
            if (props.write || props.writeWithoutResponse) {
              this.transmitCharacteristic = characteristic;
            }
            if (props.notify) {
              characteristic.addEventListener("characteristicvaluechanged", (e3) => {
                this.onnotification(e3, name2);
              });
              return characteristic.startNotifications();
            }
          }
        }
      });
      console.log(constraints);
    }
  };
  var SerialDevice = class extends Device {
    constructor(constraints) {
      super(constraints);
      this.displayPorts = [];
      this.encodedBuffer = "";
      this.connected = false;
      this.recordData = false;
      this.recorded = [];
      this.port = null;
      this.decoder = new TextDecoder();
      this.subscribed = false;
      this.readable = null;
      this.writer = null;
      this.monitoring = false;
      this.newSamples = 0;
      this.monitorSamples = 1e4;
      this.monitorData = [];
      this.monitorIdx = 0;
      this.connect = () => __awaiter(this, void 0, void 0, function* () {
        let { usbVendorId, usbProductId } = this.constraints;
        console.log(this.constraints);
        var re4 = /[0-9A-Fa-f]{6}/g;
        if (!!usbVendorId && typeof usbVendorId !== "string" && !re4.test(usbVendorId + ""))
          usbVendorId = `0x${usbVendorId.toString(16)}`;
        if (!!usbProductId && typeof usbProductId !== "string" && !re4.test(usbProductId + ""))
          usbProductId = `0x${usbProductId.toString(16)}`;
        const filters = [
          {
            usbVendorId,
            usbProductId
          }
        ];
        yield navigator.serial.requestPort({ filters }).then(this.onPortSelected);
      });
      this.send = (msg) => __awaiter(this, void 0, void 0, function* () {
        msg += "\n";
        var encodedString = unescape(encodeURIComponent(msg));
        var bytes = new Uint8Array(encodedString.length);
        for (var i3 = 0; i3 < encodedString.length; ++i3)
          bytes[i3] = encodedString.charCodeAt(i3);
        if (navigator.serial) {
          if (this.port.writable) {
            const writer = this.port.writable.getWriter();
            yield writer.write(bytes.buffer);
            writer.releaseLock();
          }
        }
      });
      this.subscribe = (port = this.port) => __awaiter(this, void 0, void 0, function* () {
        if (port.readable && this.subscribed === true) {
          this.readable = port.readable;
          console.error("Managing the readable stream internally");
          let transform = (value) => __awaiter(this, void 0, void 0, function* () {
            console.log("streaming");
            if (!this.subscribed)
              throw Error("Device disconnected");
            this.onReceive(value);
            return value;
          });
          const transformer = new TransformStream({ transform });
          this.readable.pipeThrough(transformer).pipeTo(new WritableStream({})).then(() => console.log("All data successfully written!")).catch((e3) => this.handleError(e3));
          return true;
        } else
          return false;
      });
      this.handleError = (error) => __awaiter(this, void 0, void 0, function* () {
        console.log(error);
        if (error.message.includes("framing") || error.message.includes("overflow") || error.message.includes("overrun") || error.message.includes("Overflow") || error.message.includes("break")) {
          this.subscribed = false;
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (this.readable) {
              yield this.readable.cancel();
              this.readable = null;
            }
            this.subscribed = true;
            this.subscribe(this.port);
          }), 30);
        } else if (error.message.includes("parity") || error.message.includes("Parity")) {
          if (this.port) {
            this.subscribed = false;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
              if (this.readable) {
                yield this.readable.cancel();
                this.readable = null;
              }
              yield this.port.close();
              this.connected = false;
              setTimeout(() => {
                this.onPortSelected(this.port);
              }, 100);
            }), 50);
          }
        } else {
          yield this._disconnect();
        }
      });
      this.onPortSelected = (port) => __awaiter(this, void 0, void 0, function* () {
        this.port = port;
        navigator.serial.addEventListener("disconnect", this.disconnect);
        let serialOptions = { baudRate: 115200, bufferSize: 1e3 };
        if (typeof this.constraints.serial === "object")
          Object.assign(serialOptions, this.constraints.serial);
        if (typeof this.constraints.usb === "object")
          Object.assign(serialOptions, this.constraints.usb);
        try {
          yield port.open(serialOptions);
        } catch (err) {
          yield port.open(serialOptions);
        }
        this.active = true;
        this.onconnect(this);
        this.connected = true;
        this.subscribed = true;
        yield this.subscribe(port);
      });
      this.onReceive = (input) => {
        this.encodedBuffer += this.decoder.decode(input);
        var index;
        while ((index = this.encodedBuffer.indexOf("\n")) >= 0) {
          var line = this.encodedBuffer.substr(0, index + 1);
          if (this.recordData == true) {
            this.recorded.push(line);
          }
          if (this.monitoring = true) {
            this.newSamples++;
            this.monitorData.push(line);
          }
          this.ondata(line);
          this.encodedBuffer = this.encodedBuffer.substr(index + 1);
        }
      };
      this._disconnect = () => __awaiter(this, void 0, void 0, function* () {
        this.closePort();
      });
      this.closePort = (port = this.port) => __awaiter(this, void 0, void 0, function* () {
        if (this.port) {
          this.subscribed = false;
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
              console.log("clsing", this.readable);
              if (this.readable) {
                yield this.readable.cancel();
                this.readable = null;
              }
              yield port.close();
              this.connected = false;
            } catch (err) {
              console.error(err);
            }
          }), 50);
        }
      });
      if (navigator.serial)
        this.decoder = new TextDecoder();
      else {
        console.log("ERROR: Cannot locate navigator.serial. Enable #experimental-web-platform-features in chrome://flags");
        alert("Serial support not found. Enable #experimental-web-platform-features in chrome://flags or use a chrome extension");
      }
    }
  };
  var DataTrackSupportedConstraints = class {
    constructor(stream) {
      console.log("Logic not implemented", stream);
    }
  };
  var safeParse = (input) => {
    if (typeof input === "string")
      input = JSON.parse(input);
    if (typeof input === "object") {
      for (let key in input) {
        let value = input[key];
        let regex2 = new RegExp("(|[a-zA-Z]w*|([a-zA-Z]w*(,s*[a-zA-Z]w*)*))s*=>");
        let func = typeof value === "string" ? value.substring(0, 8) == "function" : false;
        let arrow = typeof value === "string" ? regex2.test(value) : false;
        try {
          input[key] = func || arrow ? new Function(value) : value;
        } catch (e3) {
          input[key] = value;
        }
        if (typeof input[key] === "object")
          safeParse(input[key]);
      }
      return input;
    } else
      return {};
  };
  var safeStringify = (input) => {
    for (let key in input) {
      if (input[key] instanceof Function)
        input[key] = input[key].toString();
      if (input[key] instanceof Object)
        safeStringify(input[key]);
    }
    return JSON.stringify(input);
  };
  var Websocket = class {
    constructor(url = "http://localhost", protocols) {
      this.sendBuffer = [];
      this.callbacks = /* @__PURE__ */ new Map();
      this.ready = false;
      this._onopen = () => {
        this.ready = true;
        this.sendBuffer.forEach((msg) => {
          if (this.ws)
            this.ws.send(msg);
        });
        this.onopen();
      };
      this._onclose = () => {
        this.ready = false;
        this.onclose();
      };
      this._onerror = (e3) => {
        console.error(e3);
        this.onerror(e3);
        return e3;
      };
      this._onmessage = (res) => {
        try {
          let parsed = safeParse(res.data);
          if (parsed.error)
            console.error(parsed.error);
          else {
            let callbackId = parsed.callbackId;
            let data = parsed;
            if (callbackId) {
              data = data.data;
              let callback = this.callbacks.get(callbackId);
              if (callback)
                callback(data);
            }
            if (data)
              this.onmessage(data);
          }
        } catch (e3) {
          console.error("Error parsing WebSocket message from server: ", res.data, e3);
        }
      };
      this.onopen = () => {
      };
      this.onclose = () => {
      };
      this.onerror = () => {
      };
      this.onmessage = () => {
      };
      this.addEventListener = (name2, callback) => {
        if (this.ws) {
          if (name2 === "message")
            this.ws.addEventListener(name2, (res) => {
              callback(JSON.parse(res.data));
            });
          else
            this.ws.addEventListener(name2, callback);
        }
      };
      this.close = () => {
        if (this.ws)
          this.ws.close();
      };
      this.send = (data, service = "websocket") => {
        return new Promise((resolve2) => {
          let callbackId = randomUUID();
          let callback = (data2) => {
            resolve2(data2);
            this.callbacks.delete(callbackId);
          };
          this.callbacks.set(callbackId, callback);
          let o3 = { data, callbackId, service };
          let msg = safeStringify(o3);
          if (this.ready && this.ws) {
            this.ws.send(msg);
          } else
            this.sendBuffer.push(msg);
        });
      };
      this.url = url;
      let urlObj = new URL(url);
      const toPass = [];
      Object.keys(protocols).forEach((str) => {
        toPass.push(`${str}.brainsatplay.com%${protocols[str]}`);
      });
      console.log(toPass);
      if (urlObj.protocol === "http:")
        this.ws = new WebSocket(`ws://` + urlObj.host, toPass.join(";"));
      else if (urlObj.protocol === "https:")
        this.ws = new WebSocket(`wss://` + urlObj.host, toPass.join(";"));
      else {
        console.log("invalid protocol");
        return;
      }
      this.sendBuffer = [];
      this.callbacks = /* @__PURE__ */ new Map();
      this.ws.onopen = this._onopen;
      this.ws.onerror = this._onerror;
      this.ws.onmessage = this._onmessage;
      this.ws.onclose = this._onclose;
      globalThis.onunload = globalThis.onbeforeunload = () => {
        if (this.ws)
          this.ws.onclose = () => {
          };
        console.log("C:OSING");
        this.close();
      };
    }
  };
  var WebSocketDevice = class extends Device {
    constructor(constraints) {
      super(constraints);
      this._connect = () => __awaiter(this, void 0, void 0, function* () {
        if (!this.socket || this.socket.url != this.constraints.url) {
          this.socket = new Websocket(this.constraints.url, { services: ["websocket"] });
          this.socket.onmessage = (msg) => {
            if (msg.service === "websocket")
              this.ondata(msg.data, msg === null || msg === void 0 ? void 0 : msg.timestamp);
          };
        }
      });
      this._disconnect = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close();
      });
      this.send = (msg) => __awaiter(this, void 0, void 0, function* () {
        var _b;
        return (_b = this.socket) === null || _b === void 0 ? void 0 : _b.send(msg);
      });
    }
  };
  var DataDevices = class extends EventTarget {
    constructor() {
      super();
      this.devices = [];
      this.load = (devices) => {
        if (Array.isArray(devices))
          this.devices.push(...devices);
        else if (!!devices)
          this.devices.push(devices);
      };
      this.enumerateDevices = () => __awaiter(this, void 0, void 0, function* () {
        let usb = yield navigator.usb.getDevices();
        let serial = yield navigator.serial.getPorts();
        let bluetooth = [];
        let media = yield navigator.mediaDevices.enumerateDevices();
        return [...media, ...serial, ...usb, ...bluetooth];
      });
      this.getSupportedDevices = (filter) => __awaiter(this, void 0, void 0, function* () {
        let media = [];
        if (!filter || filter === "media") {
          media = yield navigator.mediaDevices.enumerateDevices();
        }
        return [...media, ...this.devices];
      });
      this.getDeviceInfo = (constraints) => DataDeviceInfo(constraints);
      this.getSupportedConstraints = () => __awaiter(this, void 0, void 0, function* () {
        return new DataTrackSupportedConstraints(this);
      });
      this.getDevice = (constraints, fallback = false) => {
        var _a, _b;
        let filtered = [...this.devices];
        const protocols = [];
        if (constraints.bluetooth)
          protocols.push("bluetooth");
        if (constraints.usb || constraints.serial)
          protocols.push("usb", "serial");
        if (constraints.websocket)
          protocols.push("websocket");
        if (protocols.length > 0)
          filtered = filtered.filter((o3) => {
            if (o3["protocols"])
              return o3["protocols"].find((k3) => protocols.includes(k3));
          });
        const label = constraints["label"];
        if (label)
          filtered = filtered.filter((o3) => label === o3.label);
        const mode = constraints["mode"];
        if (mode) {
          filtered = filtered.filter((o3) => {
            if (o3["modes"])
              return o3["modes"].includes(mode);
          });
        }
        if (filtered.length === 0)
          filtered.push(constraints);
        const found = filtered === null || filtered === void 0 ? void 0 : filtered[0];
        const customDevice2 = !!((_a = filtered === null || filtered === void 0 ? void 0 : filtered[0]) === null || _a === void 0 ? void 0 : _a.device);
        if (protocols.length === 0)
          protocols.push(...(_b = found === null || found === void 0 ? void 0 : found.protocols) !== null && _b !== void 0 ? _b : []);
        const getGenericDevice = () => {
          return new Device(found ? filtered.map((o3) => Object.assign(o3, constraints)) : constraints);
        };
        if (customDevice2)
          return getGenericDevice();
        else {
          if (found && (protocols.includes("bluetooth") && (found === null || found === void 0 ? void 0 : found.serviceUUID)))
            return new Bluetooth(filtered.map((o3) => Object.assign(o3, constraints)));
          else if (found && (protocols.includes("usb") || protocols.includes("serial") && (found === null || found === void 0 ? void 0 : found.usbVendorId) && (found === null || found === void 0 ? void 0 : found.usbProductId)))
            return new SerialDevice(filtered.map((o3) => Object.assign(o3, constraints)));
          else if (found && protocols.includes("websocket"))
            return new WebSocketDevice(filtered.map((o3) => Object.assign(o3, constraints)));
          else if (fallback)
            return getGenericDevice();
        }
        return;
      };
      this.startDataStream = (constraints = {}, stream = new DataStream()) => __awaiter(this, void 0, void 0, function* () {
        let device;
        constraints.stream = stream;
        const copy = Object.assign({}, constraints);
        if (copy.device || (constraints.video || constraints.audio || constraints.screen)) {
          device = new Device(copy);
        } else {
          device = this.getDevice(copy);
          if (!device) {
            let info = DataDeviceInfo(constraints);
            info.protocols.forEach((str) => copy[str] = true);
            device = this.getDevice(copy, true);
          }
        }
        if (device)
          yield device.connect().then((res) => res).catch((e3) => {
            console.warn("Device not connected");
            throw e3;
          });
        return device;
      });
      this.getUserDevice = (constraints = {}) => __awaiter(this, void 0, void 0, function* () {
        let mediaStream;
        if (constraints.video || constraints.audio)
          mediaStream = yield navigator.mediaDevices.getUserMedia(constraints);
        let stream = new DataStream(mediaStream);
        if (constraints.screen) {
          let displayStream = yield navigator.mediaDevices.getDisplayMedia({ video: true });
          displayStream.getTracks().forEach(stream.addTrack);
        }
        const device = yield this.startDataStream(constraints, stream);
        stream.getTracks().forEach((t9) => {
          t9.applyConstraints(constraints);
        });
        return device;
      });
    }
    get [Symbol.toStringTag]() {
      return "DataDevices";
    }
  };
  var pipeline = [];
  var bound = [];
  var addSource = (source, bound2) => bound2.push(source);
  var addSink = (sink, bound2) => bound2[bound2.length - 1].pipeTo(sink);
  var addTransform = (o3, pipeline2, bound2) => {
    pipeline2.push(o3);
    bound2.push(bound2[bound2.length - 1].pipeThrough(o3));
  };
  self.onmessage = (e3) => __awaiter(void 0, void 0, void 0, function* () {
    if (e3.data.cmd === "init")
      e3.data.data.source.pipeThrough(e3.data.data.transformer).pipeTo(e3.data.data.sink);
    if (e3.data.cmd === "add")
      addTransform(e3.data.data, pipeline, bound);
    if (e3.data.cmd === "source")
      addSource(e3.data.data, bound);
    if (e3.data.cmd === "sink")
      addSink(e3.data.data, bound);
  });

  // ../htil/plugins/datastreams/plugins/index.js
  var dataDevices = new DataDevices();
  var plugins_default = dataDevices;

  // ../htil/plugins/datastreams/plugins/start/index.js
  var operator = async function(input, ...recursiveData) {
    if (input === "data")
      return recursiveData;
    else {
      return await plugins_default.getUserDevice(input).then((device) => {
        const ontrack = (track) => {
          track.subscribe((data, timestamp) => {
            console.log("running", data, timestamp);
            this.run("data", track.contentHint, data, timestamp);
          });
        };
        device.stream.getTracks().forEach(ontrack);
        device.stream.onaddtrack = ontrack;
      });
    }
  };
  var tagName3 = "div";
  var start_default = operator;

  // demos/signals.js
  var import_meta2 = {};
  var path = "../../phaser/index.wasl.json";
  var options = {
    relativeTo: import_meta2.url,
    filesystem: {
      "package.json": package_default,
      "plugins/ui/package.json": package_default3,
      "plugins/ui/index.wasl.json": index_wasl_default3,
      "plugins/ui/plugins/button/index.js": button_exports,
      "plugins/ui/plugins/display/index.js": display_exports,
      "plugins/devices/synthetic/index.js": synthetic_exports,
      "plugins/devices/muse/index.js": muse_exports,
      "plugins/devices/ganglion/index.js": ganglion_exports,
      "plugins/datastreams/package.json": package_default2,
      "plugins/datastreams/index.wasl.json": index_wasl_default2,
      "plugins/datastreams/plugins/start/index.js": start_exports
    }
  };

  // index.js
  var printError = (arr, type, severity = "Error") => {
    arr.forEach((e3) => {
      const log = severity === "Warning" ? console.warn : console.error;
      log(`${severity} (${type})`, e3);
    });
  };
  var startExecution = async () => {
    options.activate = true;
    options.parentNode = document.getElementById("container");
    console.log("------------------ IMPORT MODE ------------------");
    const importOptions = Object.assign({ errors: [], warnings: [], files: {} }, options);
    const res = await wasl_validate_default(path, importOptions);
    console.log("validate (import)", res);
    if (res) {
      const o3 = await wasl_core_default(path, importOptions);
      console.log("load (import)", o3);
    }
    printError(importOptions.errors, "import");
    printError(importOptions.warnings, "import", "Warning");
    if (index_wasl_default) {
      console.log("------------------ REFERENCE MODE ------------------");
      const refOptions = Object.assign({ errors: [], warnings: [], files: {} }, options);
      const res2 = await wasl_validate_default(index_wasl_default, refOptions);
      console.log("validate (reference)", res2);
      if (res2) {
        const o3 = await wasl_core_default(index_wasl_default, refOptions);
        console.log("load (reference)", o3);
      }
      printError(refOptions.errors, "reference");
      printError(refOptions.warnings, "reference", "Warning");
    }
  };
  startExecution();
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
