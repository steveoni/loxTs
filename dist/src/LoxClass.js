"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoxInstance_1 = __importDefault(require("./LoxInstance"));
class LoxClass {
    constructor(name) {
        this.name = name;
    }
    call(interpret, argument) {
        const instance = new LoxInstance_1.default(this);
        return instance;
    }
    arity() {
        return 0;
    }
    toString() {
        return this.name;
    }
}
exports.default = LoxClass;
//# sourceMappingURL=LoxClass.js.map