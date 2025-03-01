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

    const SECURE_CONTEXTS_INFO_URL = "https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts";
    class ContextInsecureError extends Error {
        constructor(message = "Secure context required, see " + SECURE_CONTEXTS_INFO_URL) {
            super(message);
            this.name = this.constructor.name;
            this.code = ErrorCode$1.ERR_WEBEID_CONTEXT_INSECURE;
        }
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

    function pageScript() {
        let hasDeprecationWarningDisplayed = false;
        const eidPromises = {};
        window.addEventListener("message", function (event) {
            if (event.source !== window)
                return;
            if (event.data.src && (event.data.src === "background.js")) {
                console.log("Page received: ");
                console.log(event.data);
                if (event.data.nonce) {
                    const p = eidPromises[event.data.nonce];
                    if (event.data.result === "ok") {
                        if (event.data.signature !== undefined) {
                            p.resolve({ hex: event.data.signature });
                        }
                        else if (event.data.version !== undefined) {
                            p.resolve(event.data.extension + "/" + event.data.version);
                        }
                        else if (event.data.cert !== undefined) {
                            p.resolve({ hex: event.data.cert });
                        }
                        else {
                            console.log("No idea how to handle message");
                            console.log(event.data);
                        }
                    }
                    else {
                        p.reject(new Error(event.data.result));
                    }
                    delete eidPromises[event.data.nonce];
                }
                else {
                    console.log("No nonce in event msg");
                }
            }
        }, false);
        function nonce() {
            let val = "";
            const hex = "abcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 16; i++)
                val += hex.charAt(Math.floor(Math.random() * hex.length));
            return val;
        }
        function messagePromise(msg) {
            if (!hasDeprecationWarningDisplayed) {
                console.warn("TokenSigning API is deprecated. Please consider switching to the new Web-eID library.");
                hasDeprecationWarningDisplayed = true;
            }
            return new Promise(function (resolve, reject) {
                window.postMessage(msg, "*");
                eidPromises[msg.nonce] = { resolve, reject };
            });
        }
        window.TokenSigning = class TokenSigning {
            getCertificate(options) {
                const msg = {
                    src: "page.js",
                    nonce: nonce(),
                    type: "CERT",
                    lang: options.lang,
                    filter: options.filter,
                };
                console.log("getCertificate()");
                return messagePromise(msg);
            }
            sign(cert, hash, options) {
                const msg = {
                    src: "page.js",
                    nonce: nonce(),
                    type: "SIGN",
                    cert: cert.hex,
                    hash: hash.hex,
                    hashtype: hash.type,
                    lang: options.lang,
                    info: options.info,
                };
                console.log("sign()");
                return messagePromise(msg);
            }
            getVersion() {
                const msg = {
                    src: "page.js",
                    nonce: nonce(),
                    type: "VERSION",
                };
                console.log("getVersion()");
                return messagePromise(msg);
            }
        };
    }

    function injectPageScript() {
        if (!document.querySelector("script[data-name='TokenSigning']")) {
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.dataset.name = "TokenSigning";
            s.dataset.by = "Web-eID extension";
            if (browser.runtime.getManifest()["manifest_version"] >= 3) {
                s.src = browser.runtime.getURL("token-signing-page-script.js");
            }
            else {
                s.innerHTML = "(" + pageScript + ")();";
            }
            (document.head || document.documentElement).appendChild(s);
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

    function isWebeidEvent(event) {
        var _a, _b, _c;
        return (event.source === window &&
            ((_c = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.action) === null || _b === void 0 ? void 0 : _b.startsWith) === null || _c === void 0 ? void 0 : _c.call(_b, "web-eid:")));
    }
    function isTokenSigningEvent(event) {
        return (event.source === window &&
            event.data.nonce &&
            ["VERSION", "CERT", "SIGN"].includes(event.data.type));
    }
    async function send(message) {
        const response = await browser.runtime.sendMessage(message);
        return response;
    }
    window.addEventListener("message", async (event) => {
        var _a;
        if (isWebeidEvent(event)) {
            if (event.data.action === Action$1.WARNING)
                return;
            config.DEBUG && console.log("Web-eID event: ", JSON.stringify(event));
            if (!window.isSecureContext) {
                const response = {
                    action: event.data.action + "_FAILURE",
                    error: new ContextInsecureError(),
                };
                window.postMessage(response, event.origin);
            }
            else {
                let response;
                switch (event.data.action) {
                    case Action$1.STATUS: {
                        window.postMessage({ action: Action$1.STATUS_ACK }, event.origin);
                        response = await send(event.data);
                        break;
                    }
                    case Action$1.AUTHENTICATE: {
                        window.postMessage({ action: Action$1.AUTHENTICATE_ACK }, event.origin);
                        response = await send(event.data);
                        break;
                    }
                    case Action$1.SIGN: {
                        window.postMessage({ action: Action$1.SIGN_ACK }, event.origin);
                        response = await send(event.data);
                        break;
                    }
                    case Action$1.GET_SIGNING_CERTIFICATE: {
                        window.postMessage({ action: Action$1.GET_SIGNING_CERTIFICATE_ACK }, event.origin);
                        response = await send(event.data);
                        break;
                    }
                }
                if (response) {
                    window.postMessage(response, event.origin);
                }
            }
        }
        else if (config.TOKEN_SIGNING_BACKWARDS_COMPATIBILITY && isTokenSigningEvent(event)) {
            config.DEBUG && console.log("TokenSigning event:", JSON.stringify(event));
            if (!window.isSecureContext) {
                console.error(new ContextInsecureError());
                const nonce = event.data.nonce;
                const response = tokenSigningResponse("technical_error", nonce);
                window.postMessage(response, event.origin);
            }
            else {
                const response = await send(event.data);
                (_a = response === null || response === void 0 ? void 0 : response.warnings) === null || _a === void 0 ? void 0 : _a.forEach((warning) => console.warn(warning));
                window.postMessage(response, event.origin);
            }
        }
    });
    if (config.TOKEN_SIGNING_BACKWARDS_COMPATIBILITY) {
        injectPageScript();
    }

})();
