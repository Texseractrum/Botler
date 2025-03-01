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

    let isPatched = false;
    let isRetried = false;
    const patchHwcryptoFunction = (hwc) => (fnName) => {
        const originalFn = hwc[fnName];
        hwc[fnName] = async function (...args) {
            try {
                return await originalFn.apply(this, args);
            }
            catch (error) {
                const isNoImpl = (error === null || error === void 0 ? void 0 : error.message) === "no_implementation";
                if (isNoImpl && !isRetried) {
                    isRetried = true;
                    await hwc.use("chrome");
                    return await originalFn.apply(this, args);
                }
                else {
                    throw error;
                }
            }
        };
    };
    function patchHwcrypto() {
        const hwc = globalThis === null || globalThis === void 0 ? void 0 : globalThis.hwcrypto;
        if (!hwc || isPatched)
            return;
        ["debug", "sign", "getCertificate"].forEach(patchHwcryptoFunction(hwc));
        isPatched = true;
    }

    pageScript();
    patchHwcrypto();

})();
