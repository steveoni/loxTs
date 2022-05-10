"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Return extends Error {
    constructor(value) {
        super(null);
        this.value = value;
        this.name = "Return Error";
    }
}
exports.default = Return;
//# sourceMappingURL=Return.js.map