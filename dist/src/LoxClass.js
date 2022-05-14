"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoxInstance_1 = __importDefault(require("./LoxInstance"));
class LoxClass {
    constructor(name, methods) {
        this.name = name;
        this.methods = methods;
    }
    call(interpret, argument) {
        const instance = new LoxInstance_1.default(this);
        const initializer = this.findMethod("init");
        if (initializer !== null) {
            initializer.bind(instance).call(interpret, argument);
        }
        return instance;
    }
    arity() {
        const initializer = this.findMethod("init");
        if (initializer === null)
            return 0;
        return initializer.arity();
    }
    findMethod(name) {
        if (this.methods.has(name)) {
            return this.methods.get(name);
        }
        return null;
    }
    toString() {
        return this.name;
    }
}
exports.default = LoxClass;
//# sourceMappingURL=LoxClass.js.map