"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("./Environment"));
class LoxFunction {
    constructor(declaration, closure, isInitializer) {
        this.closure = closure;
        this.declaration = declaration;
        this.isInitializer = isInitializer;
    }
    call(interpreter, argument) {
        const enviroment = new Environment_1.default(this.closure);
        for (let i = 0; i < this.declaration.params.length; i++) {
            enviroment.define(this.declaration.params[i].lexeme, argument[i]);
        }
        try {
            interpreter.executeBlock(this.declaration.body, enviroment);
        }
        catch (returnValue) {
            if (this.isInitializer)
                return this.closure.getAt(0, "this");
            return returnValue.value;
        }
        if (this.isInitializer)
            return this.closure.getAt(0, "this");
        return null;
    }
    arity() {
        return this.declaration.params.length;
    }
    toString() {
        return `<fn ${this.declaration.name.lexeme} >`;
    }
    bind(instance) {
        const enviroment = new Environment_1.default(this.closure);
        enviroment.define("this", instance);
        return new LoxFunction(this.declaration, enviroment, this.isInitializer);
    }
}
exports.default = LoxFunction;
//# sourceMappingURL=LoxFunction.js.map