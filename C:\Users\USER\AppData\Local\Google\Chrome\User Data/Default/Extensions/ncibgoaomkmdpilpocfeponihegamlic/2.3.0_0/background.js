/**
 * MIT License
 *
 * Copyright (c) 2020-2024 Estonian Information System Authority
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
    'use strict';

    (function() {
        const env = {"TOKEN_SIGNING_BACKWARDS_COMPATIBILITY":"true"};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define("webextension-polyfill", ["module"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod);
        global.browser = mod.exports;
      }
    })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : window, function (module) {
      if (!globalThis.chrome?.runtime?.id) {
        throw new Error("This script should only be loaded in a browser extension.");
      }
      if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
        const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
        const wrapAPIs = extensionAPIs => {
          const apiMetadata = {
            "alarms": {
              "clear": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "clearAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "get": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "bookmarks": {
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getChildren": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getRecent": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getSubTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTree": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "browserAction": {
              "disable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "enable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "getBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getBadgeText": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "openPopup": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setBadgeText": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "browsingData": {
              "remove": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "removeCache": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCookies": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeDownloads": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFormData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeHistory": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeLocalStorage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePasswords": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePluginData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "settings": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "commands": {
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "contextMenus": {
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "cookies": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAllCookieStores": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "set": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "devtools": {
              "inspectedWindow": {
                "eval": {
                  "minArgs": 1,
                  "maxArgs": 2,
                  "singleCallbackArg": false
                }
              },
              "panels": {
                "create": {
                  "minArgs": 3,
                  "maxArgs": 3,
                  "singleCallbackArg": true
                },
                "elements": {
                  "createSidebarPane": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              }
            },
            "downloads": {
              "cancel": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "download": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "erase": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFileIcon": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "open": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "pause": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFile": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "resume": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "extension": {
              "isAllowedFileSchemeAccess": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "isAllowedIncognitoAccess": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "history": {
              "addUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "deleteRange": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getVisits": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "i18n": {
              "detectLanguage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAcceptLanguages": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "identity": {
              "launchWebAuthFlow": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "idle": {
              "queryState": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "management": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getSelf": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setEnabled": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "uninstallSelf": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "notifications": {
              "clear": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPermissionLevel": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "pageAction": {
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "hide": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "permissions": {
              "contains": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "request": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "runtime": {
              "getBackgroundPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPlatformInfo": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "openOptionsPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "requestUpdateCheck": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "sendMessage": {
                "minArgs": 1,
                "maxArgs": 3
              },
              "sendNativeMessage": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "setUninstallURL": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "sessions": {
              "getDevices": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getRecentlyClosed": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "restore": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "storage": {
              "local": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "managed": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "sync": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              }
            },
            "tabs": {
              "captureVisibleTab": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "detectLanguage": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "discard": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "duplicate": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "executeScript": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getZoom": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getZoomSettings": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goBack": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goForward": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "highlight": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "insertCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "query": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "reload": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "sendMessage": {
                "minArgs": 2,
                "maxArgs": 3
              },
              "setZoom": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "setZoomSettings": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "update": {
                "minArgs": 1,
                "maxArgs": 2
              }
            },
            "topSites": {
              "get": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "webNavigation": {
              "getAllFrames": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFrame": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "webRequest": {
              "handlerBehaviorChanged": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "windows": {
              "create": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getLastFocused": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            }
          };
          if (Object.keys(apiMetadata).length === 0) {
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          }
          /**
           * A WeakMap subclass which creates and stores a value for any key which does
           * not exist when accessed, but behaves exactly as an ordinary WeakMap
           * otherwise.
           *
           * @param {function} createItem
           *        A function which will be called in order to create the value for any
           *        key which does not exist, the first time it is accessed. The
           *        function receives, as its only argument, the key being created.
           */
          class DefaultWeakMap extends WeakMap {
            constructor(createItem, items = undefined) {
              super(items);
              this.createItem = createItem;
            }
            get(key) {
              if (!this.has(key)) {
                this.set(key, this.createItem(key));
              }
              return super.get(key);
            }
          }
          /**
           * Returns true if the given object is an object with a `then` method, and can
           * therefore be assumed to behave as a Promise.
           *
           * @param {*} value The value to test.
           * @returns {boolean} True if the value is thenable.
           */
          const isThenable = value => {
            return value && typeof value === "object" && typeof value.then === "function";
          };
          /**
           * Creates and returns a function which, when called, will resolve or reject
           * the given promise based on how it is called:
           *
           * - If, when called, `chrome.runtime.lastError` contains a non-null object,
           *   the promise is rejected with that value.
           * - If the function is called with exactly one argument, the promise is
           *   resolved to that value.
           * - Otherwise, the promise is resolved to an array containing all of the
           *   function's arguments.
           *
           * @param {object} promise
           *        An object containing the resolution and rejection functions of a
           *        promise.
           * @param {function} promise.resolve
           *        The promise's resolution function.
           * @param {function} promise.reject
           *        The promise's rejection function.
           * @param {object} metadata
           *        Metadata about the wrapped method which has created the callback.
           * @param {boolean} metadata.singleCallbackArg
           *        Whether or not the promise is resolved with only the first
           *        argument of the callback, alternatively an array of all the
           *        callback arguments is resolved. By default, if the callback
           *        function is invoked with only a single argument, that will be
           *        resolved to the promise, while all arguments will be resolved as
           *        an array if multiple are given.
           *
           * @returns {function}
           *        The generated callback function.
           */
          const makeCallback = (promise, metadata) => {
            return (...callbackArgs) => {
              if (extensionAPIs.runtime.lastError) {
                promise.reject(new Error(extensionAPIs.runtime.lastError.message));
              } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                promise.resolve(callbackArgs[0]);
              } else {
                promise.resolve(callbackArgs);
              }
            };
          };
          const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
          /**
           * Creates a wrapper function for a method with the given name and metadata.
           *
           * @param {string} name
           *        The name of the method which is being wrapped.
           * @param {object} metadata
           *        Metadata about the method being wrapped.
           * @param {integer} metadata.minArgs
           *        The minimum number of arguments which must be passed to the
           *        function. If called with fewer than this number of arguments, the
           *        wrapper will raise an exception.
           * @param {integer} metadata.maxArgs
           *        The maximum number of arguments which may be passed to the
           *        function. If called with more than this number of arguments, the
           *        wrapper will raise an exception.
           * @param {boolean} metadata.singleCallbackArg
           *        Whether or not the promise is resolved with only the first
           *        argument of the callback, alternatively an array of all the
           *        callback arguments is resolved. By default, if the callback
           *        function is invoked with only a single argument, that will be
           *        resolved to the promise, while all arguments will be resolved as
           *        an array if multiple are given.
           *
           * @returns {function(object, ...*)}
           *       The generated wrapper function.
           */
          const wrapAsyncFunction = (name, metadata) => {
            return function asyncFunctionWrapper(target, ...args) {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                if (metadata.fallbackToNoCallback) {
                  try {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  } catch (cbError) {
                    console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                    target[name](...args);
                    metadata.fallbackToNoCallback = false;
                    metadata.noCallback = true;
                    resolve();
                  }
                } else if (metadata.noCallback) {
                  target[name](...args);
                  resolve();
                } else {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                }
              });
            };
          };
          /**
           * Wraps an existing method of the target object, so that calls to it are
           * intercepted by the given wrapper function. The wrapper function receives,
           * as its first argument, the original `target` object, followed by each of
           * the arguments passed to the original method.
           *
           * @param {object} target
           *        The original target object that the wrapped method belongs to.
           * @param {function} method
           *        The method being wrapped. This is used as the target of the Proxy
           *        object which is created to wrap the method.
           * @param {function} wrapper
           *        The wrapper function which is called in place of a direct invocation
           *        of the wrapped method.
           *
           * @returns {Proxy<function>}
           *        A Proxy object for the given method, which invokes the given wrapper
           *        method in its place.
           */
          const wrapMethod = (target, method, wrapper) => {
            return new Proxy(method, {
              apply(targetMethod, thisObj, args) {
                return wrapper.call(thisObj, target, ...args);
              }
            });
          };
          let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
          /**
           * Wraps an object in a Proxy which intercepts and wraps certain methods
           * based on the given `wrappers` and `metadata` objects.
           *
           * @param {object} target
           *        The target object to wrap.
           *
           * @param {object} [wrappers = {}]
           *        An object tree containing wrapper functions for special cases. Any
           *        function present in this object tree is called in place of the
           *        method in the same location in the `target` object tree. These
           *        wrapper methods are invoked as described in {@see wrapMethod}.
           *
           * @param {object} [metadata = {}]
           *        An object tree containing metadata used to automatically generate
           *        Promise-based wrapper functions for asynchronous. Any function in
           *        the `target` object tree which has a corresponding metadata object
           *        in the same location in the `metadata` tree is replaced with an
           *        automatically-generated wrapper function, as described in
           *        {@see wrapAsyncFunction}
           *
           * @returns {Proxy<object>}
           */
          const wrapObject = (target, wrappers = {}, metadata = {}) => {
            let cache = Object.create(null);
            let handlers = {
              has(proxyTarget, prop) {
                return prop in target || prop in cache;
              },
              get(proxyTarget, prop, receiver) {
                if (prop in cache) {
                  return cache[prop];
                }
                if (!(prop in target)) {
                  return undefined;
                }
                let value = target[prop];
                if (typeof value === "function") {
                  if (typeof wrappers[prop] === "function") {
                    value = wrapMethod(target, target[prop], wrappers[prop]);
                  } else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else {
                    value = value.bind(target);
                  }
                } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                  value = wrapObject(value, wrappers[prop], metadata[prop]);
                } else if (hasOwnProperty(metadata, "*")) {
                  value = wrapObject(value, wrappers[prop], metadata["*"]);
                } else {
                  Object.defineProperty(cache, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                      return target[prop];
                    },
                    set(value) {
                      target[prop] = value;
                    }
                  });
                  return value;
                }
                cache[prop] = value;
                return value;
              },
              set(proxyTarget, prop, value, receiver) {
                if (prop in cache) {
                  cache[prop] = value;
                } else {
                  target[prop] = value;
                }
                return true;
              },
              defineProperty(proxyTarget, prop, desc) {
                return Reflect.defineProperty(cache, prop, desc);
              },
              deleteProperty(proxyTarget, prop) {
                return Reflect.deleteProperty(cache, prop);
              }
            };
            let proxyTarget = Object.create(target);
            return new Proxy(proxyTarget, handlers);
          };
          /**
           * Creates a set of wrapper functions for an event object, which handles
           * wrapping of listener functions that those messages are passed.
           *
           * A single wrapper is created for each listener function, and stored in a
           * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
           * retrieve the original wrapper, so that  attempts to remove a
           * previously-added listener work as expected.
           *
           * @param {DefaultWeakMap<function, function>} wrapperMap
           *        A DefaultWeakMap object which will create the appropriate wrapper
           *        for a given listener function when one does not exist, and retrieve
           *        an existing one when it does.
           *
           * @returns {object}
           */
          const wrapEvent = wrapperMap => ({
            addListener(target, listener, ...args) {
              target.addListener(wrapperMap.get(listener), ...args);
            },
            hasListener(target, listener) {
              return target.hasListener(wrapperMap.get(listener));
            },
            removeListener(target, listener) {
              target.removeListener(wrapperMap.get(listener));
            }
          });
          const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
            if (typeof listener !== "function") {
              return listener;
            }
            /**
             * Wraps an onRequestFinished listener function so that it will return a
             * `getContent()` property which returns a `Promise` rather than using a
             * callback API.
             *
             * @param {object} req
             *        The HAR entry object representing the network request.
             */
            return function onRequestFinished(req) {
              const wrappedReq = wrapObject(req, {}
              , {
                getContent: {
                  minArgs: 0,
                  maxArgs: 0
                }
              });
              listener(wrappedReq);
            };
          });
          const onMessageWrappers = new DefaultWeakMap(listener => {
            if (typeof listener !== "function") {
              return listener;
            }
            /**
             * Wraps a message listener function so that it may send responses based on
             * its return value, rather than by returning a sentinel value and calling a
             * callback. If the listener function returns a Promise, the response is
             * sent when the promise either resolves or rejects.
             *
             * @param {*} message
             *        The message sent by the other end of the channel.
             * @param {object} sender
             *        Details about the sender of the message.
             * @param {function(*)} sendResponse
             *        A callback which, when called with an arbitrary argument, sends
             *        that value as a response.
             * @returns {boolean}
             *        True if the wrapped listener returned a Promise, which will later
             *        yield a response. False otherwise.
             */
            return function onMessage(message, sender, sendResponse) {
              let didCallSendResponse = false;
              let wrappedSendResponse;
              let sendResponsePromise = new Promise(resolve => {
                wrappedSendResponse = function (response) {
                  didCallSendResponse = true;
                  resolve(response);
                };
              });
              let result;
              try {
                result = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result = Promise.reject(err);
              }
              const isResultThenable = result !== true && isThenable(result);
              if (result !== true && !isResultThenable && !didCallSendResponse) {
                return false;
              }
              const sendPromisedResult = promise => {
                promise.then(msg => {
                  sendResponse(msg);
                }, error => {
                  let message;
                  if (error && (error instanceof Error || typeof error.message === "string")) {
                    message = error.message;
                  } else {
                    message = "An unexpected error occurred";
                  }
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: true,
                    message
                  });
                }).catch(err => {
                  console.error("Failed to send onMessage rejected reply", err);
                });
              };
              if (isResultThenable) {
                sendPromisedResult(result);
              } else {
                sendPromisedResult(sendResponsePromise);
              }
              return true;
            };
          });
          const wrappedSendMessageCallback = ({
            reject,
            resolve
          }, reply) => {
            if (extensionAPIs.runtime.lastError) {
              if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                resolve();
              } else {
                reject(new Error(extensionAPIs.runtime.lastError.message));
              }
            } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
              reject(new Error(reply.message));
            } else {
              resolve(reply);
            }
          };
          const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
            if (args.length < metadata.minArgs) {
              throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
            }
            if (args.length > metadata.maxArgs) {
              throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
            }
            return new Promise((resolve, reject) => {
              const wrappedCb = wrappedSendMessageCallback.bind(null, {
                resolve,
                reject
              });
              args.push(wrappedCb);
              apiNamespaceObj.sendMessage(...args);
            });
          };
          const staticWrappers = {
            devtools: {
              network: {
                onRequestFinished: wrapEvent(onRequestFinishedWrappers)
              }
            },
            runtime: {
              onMessage: wrapEvent(onMessageWrappers),
              onMessageExternal: wrapEvent(onMessageWrappers),
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          };
          const settingMetadata = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          apiMetadata.privacy = {
            network: {
              "*": settingMetadata
            },
            services: {
              "*": settingMetadata
            },
            websites: {
              "*": settingMetadata
            }
          };
          return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
        };
        module.exports = wrapAPIs(chrome);
      } else {
        module.exports = globalThis.browser;
      }
    });

    var Action;
    (function (Action) {
        Action["WARNING"] = "web-eid:warning";
        Action["STATUS"] = "web-eid:status";
        Action["STATUS_ACK"] = "web-eid:status-ack";
        Action["STATUS_SUCCESS"] = "web-eid:status-success";
        Action["STATUS_FAILURE"] = "web-eid:status-failure";
        Action["AUTHENTICATE"] = "web-eid:authenticate";
        Action["AUTHENTICATE_ACK"] = "web-eid:authenticate-ack";
        Action["AUTHENTICATE_SUCCESS"] = "web-eid:authenticate-success";
        Action["AUTHENTICATE_FAILURE"] = "web-eid:authenticate-failure";
        Action["GET_SIGNING_CERTIFICATE"] = "web-eid:get-signing-certificate";
        Action["GET_SIGNING_CERTIFICATE_ACK"] = "web-eid:get-signing-certificate-ack";
        Action["GET_SIGNING_CERTIFICATE_SUCCESS"] = "web-eid:get-signing-certificate-success";
        Action["GET_SIGNING_CERTIFICATE_FAILURE"] = "web-eid:get-signing-certificate-failure";
        Action["SIGN"] = "web-eid:sign";
        Action["SIGN_ACK"] = "web-eid:sign-ack";
        Action["SIGN_SUCCESS"] = "web-eid:sign-success";
        Action["SIGN_FAILURE"] = "web-eid:sign-failure";
    })(Action || (Action = {}));
    var Action$1 = Action;

    var libraryConfig = Object.freeze({
        VERSION: "2.0.2",
        EXTENSION_HANDSHAKE_TIMEOUT: 1000,
        NATIVE_APP_HANDSHAKE_TIMEOUT: 5 * 1000,
        DEFAULT_USER_INTERACTION_TIMEOUT: 2 * 60 * 1000,
        MAX_EXTENSION_LOAD_DELAY: 1000,
    });

    var ErrorCode;
    (function (ErrorCode) {
        ErrorCode["ERR_WEBEID_ACTION_TIMEOUT"] = "ERR_WEBEID_ACTION_TIMEOUT";
        ErrorCode["ERR_WEBEID_USER_TIMEOUT"] = "ERR_WEBEID_USER_TIMEOUT";
        ErrorCode["ERR_WEBEID_VERSION_MISMATCH"] = "ERR_WEBEID_VERSION_MISMATCH";
        ErrorCode["ERR_WEBEID_VERSION_INVALID"] = "ERR_WEBEID_VERSION_INVALID";
        ErrorCode["ERR_WEBEID_EXTENSION_UNAVAILABLE"] = "ERR_WEBEID_EXTENSION_UNAVAILABLE";
        ErrorCode["ERR_WEBEID_NATIVE_UNAVAILABLE"] = "ERR_WEBEID_NATIVE_UNAVAILABLE";
        ErrorCode["ERR_WEBEID_UNKNOWN_ERROR"] = "ERR_WEBEID_UNKNOWN_ERROR";
        ErrorCode["ERR_WEBEID_CONTEXT_INSECURE"] = "ERR_WEBEID_CONTEXT_INSECURE";
        ErrorCode["ERR_WEBEID_USER_CANCELLED"] = "ERR_WEBEID_USER_CANCELLED";
        ErrorCode["ERR_WEBEID_NATIVE_INVALID_ARGUMENT"] = "ERR_WEBEID_NATIVE_INVALID_ARGUMENT";
        ErrorCode["ERR_WEBEID_NATIVE_FATAL"] = "ERR_WEBEID_NATIVE_FATAL";
        ErrorCode["ERR_WEBEID_ACTION_PENDING"] = "ERR_WEBEID_ACTION_PENDING";
        ErrorCode["ERR_WEBEID_MISSING_PARAMETER"] = "ERR_WEBEID_MISSING_PARAMETER";
    })(ErrorCode || (ErrorCode = {}));
    var ErrorCode$1 = ErrorCode;

    class UserTimeoutError extends Error {
        constructor(message = "user failed to respond in time") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_USER_TIMEOUT;
        }
    }

    /**
     * Convert between byte array, Base64 and hexadecimal string formats.
     *
     * @example
     *  new ByteArray([ 72, 101, 108, 108, 111 ]).toBase64() // SGVsbG8=
     *  new ByteArray().fromHex("48656c6c6f").toBase64()     // SGVsbG8=
     *  new ByteArray().fromBase64("SGVsbG8=").toHex()       // 48656c6c6f
     *  new ByteArray().fromHex("48656c6c6f").valueOf()      // [72, 101, 108, 108, 111]
     */
    class ByteArray {
        get length() {
            return this.data.length;
        }
        constructor(byteArray) {
            this.data = byteArray || [];
        }
        fromBase64(base64) {
            this.data = atob(base64).split("").map(c => c.charCodeAt(0));
            return this;
        }
        toBase64() {
            return btoa(this.data.reduce((acc, curr) => acc += String.fromCharCode(curr), ""));
        }
        fromHex(hex) {
            const data = [];
            for (let i = 0; i < hex.length; i += 2) {
                data.push(parseInt(hex.substr(i, 2), 16));
            }
            this.data = data;
            return this;
        }
        toHex() {
            return this.data.map((byte) => ("0" + (byte & 0xFF).toString(16)).slice(-2)).join("");
        }
        valueOf() {
            return this.data;
        }
    }

    class NativeUnavailableError extends Error {
        constructor(message = "Web-eID native application is not available") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_NATIVE_UNAVAILABLE;
        }
    }

    class UnknownError extends Error {
        constructor(message = "an unknown error occurred") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_UNKNOWN_ERROR;
        }
    }

    class ActionPendingError extends Error {
        constructor(message = "same action for Web-eID browser extension is already pending") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_ACTION_PENDING;
        }
    }

    class ActionTimeoutError extends Error {
        constructor(message = "extension message timeout") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_ACTION_TIMEOUT;
        }
    }

    const SECURE_CONTEXTS_INFO_URL = "https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts";
    class ContextInsecureError extends Error {
        constructor(message = "Secure context required, see " + SECURE_CONTEXTS_INFO_URL) {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_CONTEXT_INSECURE;
        }
    }

    class ExtensionUnavailableError extends Error {
        constructor(message = "Web-eID extension is not available") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_EXTENSION_UNAVAILABLE;
        }
    }

    class NativeFatalError extends Error {
        constructor(message = "native application terminated with a fatal error") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_NATIVE_FATAL;
        }
    }

    class NativeInvalidArgumentError extends Error {
        constructor(message = "native application received an invalid argument") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_NATIVE_INVALID_ARGUMENT;
        }
    }

    class UserCancelledError extends Error {
        constructor(message = "request was cancelled by the user") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_USER_CANCELLED;
        }
    }

    class VersionInvalidError extends Error {
        constructor(message = "invalid version string") {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_VERSION_INVALID;
        }
    }

    function tmpl(strings, requiresUpdate) {
        return `Update required for Web-eID ${requiresUpdate}`;
    }
    class VersionMismatchError extends Error {
        constructor(message, versions, requiresUpdate) {
            if (!message) {
                if (!requiresUpdate) {
                    message = "requiresUpdate not provided";
                }
                else if (requiresUpdate.extension && requiresUpdate.nativeApp) {
                    message = tmpl `${"extension and native app"}`;
                }
                else if (requiresUpdate.extension) {
                    message = tmpl `${"extension"}`;
                }
                else if (requiresUpdate.nativeApp) {
                    message = tmpl `${"native app"}`;
                }
            }
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_VERSION_MISMATCH;
            this.requiresUpdate = requiresUpdate;
            if (versions) {
                const { library, extension, nativeApp } = versions;
                Object.assign(this, { library, extension, nativeApp });
            }
        }
    }

    const errorCodeToErrorClass = {
        [ErrorCode$1.ERR_WEBEID_ACTION_PENDING]: ActionPendingError,
        [ErrorCode$1.ERR_WEBEID_ACTION_TIMEOUT]: ActionTimeoutError,
        [ErrorCode$1.ERR_WEBEID_CONTEXT_INSECURE]: ContextInsecureError,
        [ErrorCode$1.ERR_WEBEID_EXTENSION_UNAVAILABLE]: ExtensionUnavailableError,
        [ErrorCode$1.ERR_WEBEID_NATIVE_INVALID_ARGUMENT]: NativeInvalidArgumentError,
        [ErrorCode$1.ERR_WEBEID_NATIVE_FATAL]: NativeFatalError,
        [ErrorCode$1.ERR_WEBEID_NATIVE_UNAVAILABLE]: NativeUnavailableError,
        [ErrorCode$1.ERR_WEBEID_USER_CANCELLED]: UserCancelledError,
        [ErrorCode$1.ERR_WEBEID_USER_TIMEOUT]: UserTimeoutError,
        [ErrorCode$1.ERR_WEBEID_VERSION_INVALID]: VersionInvalidError,
        [ErrorCode$1.ERR_WEBEID_VERSION_MISMATCH]: VersionMismatchError,
    };
    function serializeError(error) {
        const { message, name, fileName, lineNumber, columnNumber, stack, } = error;
        return {
            ...(Object.fromEntries(Object.getOwnPropertyNames(error)
                .map((prop) => [prop, error[prop]]))),
            message,
            name,
            fileName,
            lineNumber,
            columnNumber,
            stack,
        };
    }
    function deserializeError(errorObject) {
        let error;
        if (typeof errorObject.code == "string" && errorObject.code in errorCodeToErrorClass) {
            const CustomError = errorCodeToErrorClass[errorObject.code];
            error = new CustomError();
        }
        else {
            error = new UnknownError();
        }
        for (const [key, value] of Object.entries(errorObject)) {
            error[key] = value;
        }
        return error;
    }

    /**
     * Calculates the size of an object's JSON representation in bytes
     *
     * @param object Any JSON stringifyable object
     *
     * @returns Size in bytes
     */
    function calculateJsonSize(object) {
        const objectString = JSON.stringify(object);
        const objectStringBlob = new Blob([objectString]);
        return objectStringBlob.size;
    }

    var _a, _b;
    var config = Object.freeze({
        NATIVE_APP_NAME: "eu.webeid",
        VERSION: "2.3.0",
        NATIVE_MESSAGE_MAX_BYTES: 8192,
        NATIVE_GRACEFUL_DISCONNECT_TIMEOUT: 2000,
        TOKEN_SIGNING_BACKWARDS_COMPATIBILITY: ((_a = process.env.TOKEN_SIGNING_BACKWARDS_COMPATIBILITY) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === "TRUE",
        TOKEN_SIGNING_USER_INTERACTION_TIMEOUT: 1000 * 60 * 5,
        DEBUG: ((_b = process.env.DEBUG) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === "TRUE",
    });

    /**
     * Sleeps for a specified time before resolving the returned promise.
     *
     * @param milliseconds Time in milliseconds until the promise is resolved
     *
     * @returns Empty promise
     */
    function sleep(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), milliseconds);
        });
    }
    /**
     * Throws an error after a specified time has passed.
     *
     * Useful in combination with Promise.race(...)
     *
     * @param milliseconds Time in milliseconds until the promise is rejected
     * @param error Error object which will be used to reject the promise
     *
     * @example
     *   await Promise.race([
     *     doAsyncOperation(),
     *     throwAfterTimeout(3600, new TimeoutError()),
     *   ])
     */
    async function throwAfterTimeout(milliseconds, error) {
        await sleep(milliseconds);
        throw error;
    }

    var NativeAppState;
    (function (NativeAppState) {
        NativeAppState[NativeAppState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
        NativeAppState[NativeAppState["CONNECTING"] = 1] = "CONNECTING";
        NativeAppState[NativeAppState["CONNECTED"] = 2] = "CONNECTED";
        NativeAppState[NativeAppState["DISCONNECTED"] = 3] = "DISCONNECTED";
    })(NativeAppState || (NativeAppState = {}));
    class NativeAppService {
        constructor() {
            this.state = NativeAppState.UNINITIALIZED;
            this.port = null;
            this.pending = null;
            this.activeConnection = null;
        }
        async connect() {
            var _a;
            this.state = NativeAppState.CONNECTING;
            this.port = browser.runtime.connectNative(config.NATIVE_APP_NAME);
            this.port.onDisconnect.addListener(this.disconnectListener.bind(this));
            try {
                const message = await this.nextMessage(libraryConfig.NATIVE_APP_HANDSHAKE_TIMEOUT);
                if (message.version) {
                    this.state = NativeAppState.CONNECTED;
                    new Promise((resolve, reject) => this.activeConnection = { resolve, reject });
                    return message;
                }
                if (message) {
                    throw new NativeUnavailableError(`expected native application to reply with a version, got ${JSON.stringify(message)}`);
                }
                else if (this.port.error) {
                    throw new NativeUnavailableError(this.port.error.message);
                }
                else {
                    throw new NativeUnavailableError("unexpected error");
                }
            }
            catch (error) {
                if (this.port.error) {
                    console.error(this.port.error);
                }
                if (error instanceof Error) {
                    throw error;
                }
                else if ((_a = this.port.error) === null || _a === void 0 ? void 0 : _a.message) {
                    throw new NativeUnavailableError(this.port.error.message);
                }
                else {
                    throw new NativeUnavailableError("unexpected error");
                }
            }
        }
        async disconnectListener() {
            var _a, _b, _c, _d;
            config.DEBUG && console.log("Native app disconnected");
            (_a = chrome === null || chrome === void 0 ? void 0 : chrome.runtime) === null || _a === void 0 ? void 0 : _a.lastError;
            await new Promise((resolve) => setTimeout(resolve));
            (_b = this.activeConnection) === null || _b === void 0 ? void 0 : _b.resolve();
            this.state = NativeAppState.DISCONNECTED;
            (_d = (_c = this.pending) === null || _c === void 0 ? void 0 : _c.reject) === null || _d === void 0 ? void 0 : _d.call(_c, new UnknownError("native application closed the connection before a response"));
            this.pending = null;
        }
        disconnectForcefully() {
            var _a, _b, _c;
            this.state = NativeAppState.DISCONNECTED;
            (_b = (_a = this.pending) === null || _a === void 0 ? void 0 : _a.reject) === null || _b === void 0 ? void 0 : _b.call(_a, new UnknownError("extension closed connection to native app prematurely"));
            this.pending = null;
            (_c = this.port) === null || _c === void 0 ? void 0 : _c.disconnect();
        }
        close() {
            if (this.state == NativeAppState.DISCONNECTED)
                return;
            this.disconnectForcefully();
        }
        send(message) {
            switch (this.state) {
                case NativeAppState.CONNECTED: {
                    return new Promise((resolve, reject) => {
                        var _a, _b;
                        this.pending = { resolve, reject };
                        const onResponse = async (message) => {
                            var _a;
                            (_a = this.port) === null || _a === void 0 ? void 0 : _a.onMessage.removeListener(onResponse);
                            try {
                                await Promise.race([
                                    this.activeConnection,
                                    throwAfterTimeout(config.NATIVE_GRACEFUL_DISCONNECT_TIMEOUT, new Error("Native application did not disconnect after response")),
                                ]);
                            }
                            catch (error) {
                                console.error(error);
                                this.disconnectForcefully();
                            }
                            finally {
                                const error = message === null || message === void 0 ? void 0 : message.error;
                                if (error) {
                                    reject(deserializeError(error));
                                }
                                else {
                                    resolve(message);
                                }
                                this.pending = null;
                            }
                        };
                        (_a = this.port) === null || _a === void 0 ? void 0 : _a.onMessage.addListener(onResponse);
                        config.DEBUG && console.log("Sending message to native app", JSON.stringify(message));
                        const messageSize = calculateJsonSize(message);
                        if (messageSize > config.NATIVE_MESSAGE_MAX_BYTES) {
                            throw new Error(`native application message exceeded ${config.NATIVE_MESSAGE_MAX_BYTES} bytes`);
                        }
                        (_b = this.port) === null || _b === void 0 ? void 0 : _b.postMessage(message);
                    });
                }
                case NativeAppState.UNINITIALIZED: {
                    return Promise.reject(new Error("unable to send message, native application port is not initialized yet"));
                }
                case NativeAppState.CONNECTING: {
                    return Promise.reject(new Error("unable to send message, native application port is still connecting"));
                }
                case NativeAppState.DISCONNECTED: {
                    return Promise.reject(new Error("unable to send message, native application port is disconnected"));
                }
                default: {
                    return Promise.reject(new Error("unable to send message, unexpected native app state"));
                }
            }
        }
        nextMessage(timeout) {
            return new Promise((resolve, reject) => {
                let cleanup = null;
                let timer = null;
                const onMessageListener = (message) => {
                    cleanup === null || cleanup === void 0 ? void 0 : cleanup();
                    if (message.error) {
                        reject(deserializeError(message.error));
                    }
                    else {
                        resolve(message);
                    }
                };
                const onDisconnectListener = () => {
                    cleanup === null || cleanup === void 0 ? void 0 : cleanup();
                    reject(new NativeUnavailableError("a message from native application was expected, but native application closed connection"));
                };
                cleanup = () => {
                    var _a, _b;
                    (_a = this.port) === null || _a === void 0 ? void 0 : _a.onDisconnect.removeListener(onDisconnectListener);
                    (_b = this.port) === null || _b === void 0 ? void 0 : _b.onMessage.removeListener(onMessageListener);
                    if (timer)
                        clearTimeout(timer);
                };
                timer = setTimeout(() => {
                    cleanup === null || cleanup === void 0 ? void 0 : cleanup();
                    reject(new NativeUnavailableError(`a message from native application was expected, but message wasn't received in ${timeout}ms`));
                }, timeout);
                if (!this.port) {
                    return reject(new NativeUnavailableError("missing native application port"));
                }
                this.port.onDisconnect.addListener(onDisconnectListener);
                this.port.onMessage.addListener(onMessageListener);
            });
        }
    }

    /**
     * Helper function to compose a token signing response message
     *
     * @param result Token signing result from the native application
     * @param nonce  The nonce related to the action
     * @param optional Optional message fields to be included in the response
     *
     * @returns A token signing response object
     */
    function tokenSigningResponse(result, nonce, optional) {
        const response = {
            nonce,
            result,
            src: "background.js",
            extension: config.VERSION,
            isWebeid: true,
            ...(optional ? optional : {}),
        };
        return response;
    }

    function errorToResponse(nonce, error) {
        if (error.code === ErrorCode$1.ERR_WEBEID_USER_CANCELLED) {
            return tokenSigningResponse("user_cancel", nonce);
        }
        else if (error.code === ErrorCode$1.ERR_WEBEID_NATIVE_FATAL ||
            error.code === ErrorCode$1.ERR_WEBEID_NATIVE_INVALID_ARGUMENT) {
            const nativeException = serializeError(error);
            return tokenSigningResponse("driver_error", nonce, { nativeException });
        }
        else {
            return tokenSigningResponse("technical_error", nonce, { error });
        }
    }

    /**
     * Map of ISO 639-2 three-letter language codes to ISO 639-1 two-letter language codes.
     *
     * This is only a partial list used for backwards compatibility.
     *
     * @see https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
     */
    var threeLetterLanguageCodes = {
        "est": "et",
        "eng": "en",
        "rus": "ru",
        "lit": "lt",
        "lat": "lv",
        "tur": "tr",
        "ces": "cs",
        "slk": "sk",
    };

    async function getCertificate(nonce, sourceUrl, lang, filter = "SIGN") {
        if (lang && Object.keys(threeLetterLanguageCodes).includes(lang)) {
            lang = threeLetterLanguageCodes[lang];
        }
        const nativeAppService = new NativeAppService();
        if (filter !== "SIGN") {
            const { message, name, stack } = new Error("Web-eID only allows signing with a signing certificate");
            return tokenSigningResponse("not_allowed", nonce, {
                message,
                name,
                stack,
            });
        }
        try {
            const nativeAppStatus = await nativeAppService.connect();
            config.DEBUG && console.log("Get certificate: connected to native", nativeAppStatus);
            const message = {
                command: "get-signing-certificate",
                arguments: {
                    origin: (new URL(sourceUrl)).origin,
                    ...(lang ? { lang } : {}),
                },
            };
            const response = await Promise.race([
                nativeAppService.send(message),
                throwAfterTimeout(config.TOKEN_SIGNING_USER_INTERACTION_TIMEOUT, new UserTimeoutError()),
            ]);
            if (!(response === null || response === void 0 ? void 0 : response.certificate)) {
                return tokenSigningResponse("no_certificates", nonce);
            }
            else {
                return tokenSigningResponse("ok", nonce, {
                    cert: new ByteArray().fromBase64(response.certificate).toHex(),
                });
            }
        }
        catch (error) {
            console.error(error);
            return errorToResponse(nonce, error);
        }
        finally {
            nativeAppService.close();
        }
    }

    const digestCommandToHashFunction = {
        "sha224": "SHA-224",
        "sha256": "SHA-256",
        "sha384": "SHA-384",
        "sha512": "SHA-512",
        "sha3-224": "SHA3-224",
        "sha3-256": "SHA3-256",
        "sha3-384": "SHA3-384",
        "sha3-512": "SHA3-512",
    };
    const hashFunctionToLength = {
        "SHA-224": 28,
        "SHA-256": 32,
        "SHA-384": 48,
        "SHA-512": 64,
        "SHA3-224": 28,
        "SHA3-256": 32,
        "SHA3-384": 48,
        "SHA3-512": 64,
    };
    async function sign$1(nonce, sourceUrl, certificate, hash, algorithm, lang) {
        if (lang && Object.keys(threeLetterLanguageCodes).includes(lang)) {
            lang = threeLetterLanguageCodes[lang];
        }
        const nativeAppService = new NativeAppService();
        try {
            const warnings = [];
            const nativeAppStatus = await nativeAppService.connect();
            config.DEBUG && console.log("Sign: connected to native", nativeAppStatus);
            let hashFunction = (Object.keys(digestCommandToHashFunction).includes(algorithm)
                ? digestCommandToHashFunction[algorithm]
                : algorithm);
            const expectedHashByteLength = (Object.keys(hashFunctionToLength).includes(hashFunction)
                ? hashFunctionToLength[hashFunction]
                : undefined);
            const hashByteArray = new ByteArray().fromHex(hash);
            if (hashByteArray.length !== expectedHashByteLength) {
                warnings.push(`${algorithm} hash must be ${expectedHashByteLength} bytes long.\n` +
                    `The provided hash was ${hashByteArray.length} bytes long.\n` +
                    "See further details at https://github.com/web-eid/web-eid-webextension#hwcrypto-compatibility");
                const autodetectedHashFunction = Object.keys(hashFunctionToLength).find((hashFunctionName) => (hashFunctionToLength[hashFunctionName] == hashByteArray.length));
                if (autodetectedHashFunction) {
                    warnings.push(`Changed the algorithm from ${hashFunction} to ${autodetectedHashFunction} in order to match the hash length`);
                    hashFunction = autodetectedHashFunction;
                }
            }
            const message = {
                command: "sign",
                arguments: {
                    hashFunction,
                    hash: hashByteArray.toBase64(),
                    origin: (new URL(sourceUrl)).origin,
                    certificate: new ByteArray().fromHex(certificate).toBase64(),
                    ...(lang ? { lang } : {}),
                },
            };
            const response = await Promise.race([
                nativeAppService.send(message),
                throwAfterTimeout(config.TOKEN_SIGNING_USER_INTERACTION_TIMEOUT, new UserTimeoutError()),
            ]);
            if (!(response === null || response === void 0 ? void 0 : response.signature)) {
                return tokenSigningResponse("technical_error", nonce);
            }
            else {
                return tokenSigningResponse("ok", nonce, {
                    signature: new ByteArray().fromBase64(response.signature).toHex(),
                    warnings,
                });
            }
        }
        catch (error) {
            console.error(error);
            return errorToResponse(nonce, error);
        }
        finally {
            nativeAppService.close();
        }
    }

    async function status$1(nonce) {
        const nativeAppService = new NativeAppService();
        try {
            const nativeAppStatus = await nativeAppService.connect();
            const version = nativeAppStatus.version.replace("+", ".");
            if (!version) {
                throw new Error("missing native application version");
            }
            const message = {
                command: "quit",
                arguments: {},
            };
            await nativeAppService.send(message);
            return tokenSigningResponse("ok", nonce, { version });
        }
        catch (error) {
            console.error(error);
            return errorToResponse(nonce, error);
        }
        finally {
            nativeAppService.close();
        }
    }

    var TokenSigningAction = {
        status: status$1,
        getCertificate,
        sign: sign$1,
    };

    const semverPattern = new RegExp("^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)" +
        "(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$");
    var IdentifierDiff;
    (function (IdentifierDiff) {
        IdentifierDiff[IdentifierDiff["NEWER"] = 1] = "NEWER";
        IdentifierDiff[IdentifierDiff["SAME"] = 0] = "SAME";
        IdentifierDiff[IdentifierDiff["OLDER"] = -1] = "OLDER";
    })(IdentifierDiff || (IdentifierDiff = {}));
    function parseSemver(string = "") {
        const result = string.match(semverPattern);
        const [, majorStr, minorStr, patchStr, rc, build] = result ? result : [];
        const major = parseInt(majorStr, 10);
        const minor = parseInt(minorStr, 10);
        const patch = parseInt(patchStr, 10);
        for (const indentifier of [major, minor, patch]) {
            if (Number.isNaN(indentifier)) {
                throw new VersionInvalidError(`Invalid SemVer string '${string}'`);
            }
        }
        return { major, minor, patch, rc, build, string };
    }
    /**
     * Compares two Semver objects.
     *
     * @param {Semver} a First SemVer object
     * @param {Semver} b Second Semver object
     *
     * @returns {SemverDiff} Diff for major, minor and patch.
     */
    function compareSemver(a, b) {
        return {
            major: Math.sign(a.major - b.major),
            minor: Math.sign(a.minor - b.minor),
            patch: Math.sign(a.patch - b.patch),
        };
    }

    /**
     * Checks if update is required.
     *
     * @param status Object containing SemVer version strings for library, extension and native app.
     *
     * @returns Object which specifies if the extension or native app should be updated.
     */
    function checkCompatibility(versions) {
        const [librarySemver, extensionSemver, nativeAppSemver,] = [
            parseSemver(versions.library),
            parseSemver(versions.extension),
            parseSemver(versions.nativeApp),
        ];
        return {
            extension: (compareSemver(extensionSemver, librarySemver).major === IdentifierDiff.OLDER),
            nativeApp: (compareSemver(nativeAppSemver, librarySemver).major === IdentifierDiff.OLDER ||
                compareSemver(nativeAppSemver, extensionSemver).major === IdentifierDiff.OLDER),
        };
    }

    function actionErrorHandler(action, originalError, libraryVersion, nativeAppVersion) {
        let error;
        if (!nativeAppVersion || (originalError === null || originalError === void 0 ? void 0 : originalError.code) === ErrorCode$1.ERR_WEBEID_USER_CANCELLED) {
            error = originalError;
        }
        else {
            const versions = {
                extension: config.VERSION,
                library: libraryVersion,
                nativeApp: nativeAppVersion,
            };
            const requiresUpdate = checkCompatibility(versions);
            error = ((requiresUpdate.extension || requiresUpdate.nativeApp)
                ? new VersionMismatchError(undefined, versions, requiresUpdate)
                : originalError);
        }
        return {
            action,
            error: serializeError(error),
        };
    }

    /**
     * Returns the URL where the PostMessage API's message originated
     *
     * @param sender PostMessage API's message sender
     * @returns
     */
    function getSenderUrl(sender) {
        if (!sender.url) {
            throw new UnknownError("missing sender url");
        }
        return sender.url;
    }

    async function authenticate(challengeNonce, sender, libraryVersion, userInteractionTimeout, lang) {
        let nativeAppService;
        let nativeAppStatus;
        try {
            nativeAppService = new NativeAppService();
            nativeAppStatus = await nativeAppService.connect();
            config.DEBUG && console.log("Authenticate: connected to native", nativeAppStatus);
            const message = {
                command: "authenticate",
                arguments: {
                    challengeNonce,
                    origin: (new URL(getSenderUrl(sender))).origin,
                    ...(lang ? { lang } : {}),
                },
            };
            const response = await Promise.race([
                nativeAppService.send(message),
                throwAfterTimeout(userInteractionTimeout, new UserTimeoutError()),
            ]);
            config.DEBUG && console.log("Authenticate: authentication token received");
            const isResponseValid = ((response === null || response === void 0 ? void 0 : response.unverifiedCertificate) &&
                (response === null || response === void 0 ? void 0 : response.algorithm) &&
                (response === null || response === void 0 ? void 0 : response.signature) &&
                (response === null || response === void 0 ? void 0 : response.format) &&
                (response === null || response === void 0 ? void 0 : response.appVersion));
            if (isResponseValid) {
                return { action: Action$1.AUTHENTICATE_SUCCESS, ...response };
            }
            else {
                throw new UnknownError("unexpected response from native application");
            }
        }
        catch (error) {
            console.error("Authenticate:", error);
            return actionErrorHandler(Action$1.AUTHENTICATE_FAILURE, error, libraryVersion, nativeAppStatus === null || nativeAppStatus === void 0 ? void 0 : nativeAppStatus.version);
        }
        finally {
            nativeAppService === null || nativeAppService === void 0 ? void 0 : nativeAppService.close();
        }
    }

    async function getSigningCertificate(sender, libraryVersion, userInteractionTimeout, lang) {
        let nativeAppService;
        let nativeAppStatus;
        try {
            nativeAppService = new NativeAppService();
            nativeAppStatus = await nativeAppService.connect();
            config.DEBUG && console.log("getSigningCertificate: connected to native", nativeAppStatus);
            const message = {
                command: "get-signing-certificate",
                arguments: {
                    origin: (new URL(getSenderUrl(sender))).origin,
                    ...(lang ? { lang } : {}),
                },
            };
            const response = await Promise.race([
                nativeAppService.send(message),
                throwAfterTimeout(userInteractionTimeout, new UserTimeoutError()),
            ]);
            const isResponseValid = ((response === null || response === void 0 ? void 0 : response.certificate) &&
                (response === null || response === void 0 ? void 0 : response.supportedSignatureAlgorithms.length));
            if (isResponseValid) {
                return { action: Action$1.GET_SIGNING_CERTIFICATE_SUCCESS, ...response };
            }
            else {
                throw new UnknownError("unexpected response from native application");
            }
        }
        catch (error) {
            console.error("GetSigningCertificate:", error);
            return actionErrorHandler(Action$1.GET_SIGNING_CERTIFICATE_FAILURE, error, libraryVersion, nativeAppStatus === null || nativeAppStatus === void 0 ? void 0 : nativeAppStatus.version);
        }
        finally {
            nativeAppService === null || nativeAppService === void 0 ? void 0 : nativeAppService.close();
        }
    }

    async function sign(certificate, hash, hashFunction, sender, libraryVersion, userInteractionTimeout, lang) {
        let nativeAppService;
        let nativeAppStatus;
        try {
            nativeAppService = new NativeAppService();
            nativeAppStatus = await nativeAppService.connect();
            config.DEBUG && console.log("Sign: connected to native", nativeAppStatus);
            const message = {
                command: "sign",
                arguments: {
                    hash,
                    hashFunction,
                    certificate,
                    origin: (new URL(getSenderUrl(sender))).origin,
                    ...(lang ? { lang } : {}),
                },
            };
            const response = await Promise.race([
                nativeAppService.send(message),
                throwAfterTimeout(userInteractionTimeout, new UserTimeoutError()),
            ]);
            const isResponseValid = ((response === null || response === void 0 ? void 0 : response.signature) &&
                (response === null || response === void 0 ? void 0 : response.signatureAlgorithm.hashFunction) &&
                (response === null || response === void 0 ? void 0 : response.signatureAlgorithm.paddingScheme) &&
                (response === null || response === void 0 ? void 0 : response.signatureAlgorithm.cryptoAlgorithm));
            if (isResponseValid) {
                return { action: Action$1.SIGN_SUCCESS, ...response };
            }
            else {
                throw new UnknownError("unexpected response from native application");
            }
        }
        catch (error) {
            console.error("Sign:", error);
            return actionErrorHandler(Action$1.SIGN_FAILURE, error, libraryVersion, nativeAppStatus === null || nativeAppStatus === void 0 ? void 0 : nativeAppStatus.version);
        }
        finally {
            nativeAppService === null || nativeAppService === void 0 ? void 0 : nativeAppService.close();
        }
    }

    async function status(libraryVersion) {
        const extensionVersion = config.VERSION;
        const nativeAppService = new NativeAppService();
        try {
            const status = await nativeAppService.connect();
            const nativeApp = (status.version.startsWith("v")
                ? status.version.substring(1)
                : status.version);
            await nativeAppService.send({
                command: "quit",
                arguments: {},
            });
            const componentVersions = {
                library: libraryVersion,
                extension: extensionVersion,
                nativeApp,
            };
            const requiresUpdate = checkCompatibility(componentVersions);
            if (requiresUpdate.extension || requiresUpdate.nativeApp) {
                throw new VersionMismatchError(undefined, componentVersions, requiresUpdate);
            }
            return {
                action: Action$1.STATUS_SUCCESS,
                ...componentVersions,
            };
        }
        catch (error) {
            error.extension = extensionVersion;
            console.error("Status:", error);
            return {
                action: Action$1.STATUS_FAILURE,
                error: serializeError(error),
            };
        }
        finally {
            nativeAppService.close();
        }
    }

    async function onAction(message, sender) {
        var _a, _b, _c, _d, _e, _f;
        switch (message.action) {
            case Action$1.AUTHENTICATE:
                return await authenticate(message.challengeNonce, sender, message.libraryVersion, ((_a = message.options) === null || _a === void 0 ? void 0 : _a.userInteractionTimeout) || libraryConfig.DEFAULT_USER_INTERACTION_TIMEOUT, (_b = message.options) === null || _b === void 0 ? void 0 : _b.lang);
            case Action$1.GET_SIGNING_CERTIFICATE:
                return await getSigningCertificate(sender, message.libraryVersion, ((_c = message.options) === null || _c === void 0 ? void 0 : _c.userInteractionTimeout) || libraryConfig.DEFAULT_USER_INTERACTION_TIMEOUT, (_d = message.options) === null || _d === void 0 ? void 0 : _d.lang);
            case Action$1.SIGN:
                return await sign(message.certificate, message.hash, message.hashFunction, sender, message.libraryVersion, ((_e = message.options) === null || _e === void 0 ? void 0 : _e.userInteractionTimeout) || libraryConfig.DEFAULT_USER_INTERACTION_TIMEOUT, (_f = message.options) === null || _f === void 0 ? void 0 : _f.lang);
            case Action$1.STATUS:
                return await status(message.libraryVersion);
        }
    }
    async function onTokenSigningAction(message, sender) {
        if (!sender.url)
            return;
        switch (message.type) {
            case "VERSION": {
                return await TokenSigningAction.status(message.nonce);
            }
            case "CERT": {
                return await TokenSigningAction.getCertificate(message.nonce, sender.url, message.lang, message.filter);
            }
            case "SIGN": {
                return await TokenSigningAction.sign(message.nonce, sender.url, message.cert, message.hash, message.hashtype, message.lang);
            }
        }
    }
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action) {
            onAction(message, sender).then(sendResponse);
        }
        else if (message.type) {
            onTokenSigningAction(message, sender).then(sendResponse);
        }
        return true;
    });

})();
//# sourceMappingURL=background.js.map
