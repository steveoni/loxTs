"use strict";
//currently .at is not present in some old version of nodejs
// https://stackoverflow.com/questions/68464114/why-am-i-getting-at-is-not-a-function/70557417
Object.defineProperty(exports, "__esModule", { value: true });
exports.poly = void 0;
function poly() {
    function at(n) {
        // ToInteger() abstract op
        n = Math.trunc(n) || 0;
        // Allow negative indexing from the end
        if (n < 0)
            n += this.length;
        // OOB access is guaranteed to return undefined
        if (n < 0 || n >= this.length)
            return undefined;
        // Otherwise, this is just normal property access
        return this[n];
    }
    const TypedArray = Reflect.getPrototypeOf(Int8Array);
    for (const C of [Array, String, TypedArray]) {
        Object.defineProperty(C.prototype, "at", { value: at,
            writable: true,
            enumerable: false,
            configurable: true });
    }
}
exports.poly = poly;
//# sourceMappingURL=pollyfill.js.map