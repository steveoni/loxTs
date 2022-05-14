import Environment from "./Environment";
import Interpreter from "./Interpreter";
import LoxCallable from "./LoxCallable";
import LoxInstance from "./LoxInstance";
import { FunctionStmt, Stmt } from "./Stmt";

export default class LoxFunction implements LoxCallable {
  private readonly declaration: FunctionStmt
  private readonly closure: Environment
  private readonly isInitializer: boolean
  constructor(declaration: FunctionStmt, closure: Environment, isInitializer: boolean) {
    this.closure = closure
    this.declaration = declaration
    this.isInitializer = isInitializer
  }

  public call(interpreter: Interpreter, argument: any[]): any {
    const enviroment = new Environment(this.closure)
    for (let i=0; i < this.declaration.params.length; i++) {
      enviroment.define(this.declaration.params[i].lexeme, argument[i])
    }

    try {
      interpreter.executeBlock(this.declaration.body, enviroment)
    } catch (returnValue) {
      if (this.isInitializer) return this.closure.getAt(0, "this")
      return returnValue.value
    }
    if (this.isInitializer) return this.closure.getAt(0, "this")
    return null;
  }

  public arity(): number {
    return this.declaration.params.length;
  }

  public toString(): string {
    return `<fn ${this.declaration.name.lexeme} >`;
  }

  bind(instance: LoxInstance) {
    const enviroment = new Environment(this.closure)
    enviroment.define("this", instance)
    return new LoxFunction(this.declaration, enviroment, this.isInitializer)
  }

}