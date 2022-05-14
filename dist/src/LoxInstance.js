"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeError_1 = __importDefault(require("./RuntimeError"));
class LoxInstance {
    constructor(klass) {
        this.field = new Map();
        this.klass = klass;
    }
    get(name) {
        if (this.field.has(name.lexeme)) {
            return this.field.get(name.lexeme);
        }
        throw new RuntimeError_1.default(name, `Undefined property ${name.lexeme}.`);
    }
    toString() {
        return `${this.klass.name} instance`;
    }
}
exports.default = LoxInstance;
//# sourceMappingURL=LoxInstance.js.map