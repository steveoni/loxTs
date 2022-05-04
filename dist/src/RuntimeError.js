"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuntimeError extends Error {
    constructor(token, message) {
        super(message);
        this.token = token;
        this.name = "RuntimeError";
    }
}
exports.default = RuntimeError;
//# sourceMappingURL=RuntimeError.js.map