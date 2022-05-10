import Environment from "./Environment";
import Interpreter from "./Interpreter";
import LoxCallable from "./LoxCallable";
import { FunctionStmt, Stmt } from "./Stmt";

export default class LoxFunction implements LoxCallable {
  private readonly declaration: FunctionStmt
  private readonly closure: Environment
  constructor(declaration: FunctionStmt, closure: Environment) {
    this.closure = closure
    this.declaration = declaration
  }

  public call(interpreter: Interpreter, argument: any[]): any {
    const enviroment = new Environment(this.closure)
    for (let i=0; i < this.declaration.params.length; i++) {
      enviroment.define(this.declaration.params[i].lexeme, argument[i])
    }

    try {
      interpreter.executeBlock(this.declaration.body, enviroment)
    } catch (returnValue) {
      return returnValue.value
    }
    return null;
  }

  public arity(): number {
    return this.declaration.params.length;
  }

  public toString(): string {
    return `<fn ${this.declaration.name.lexeme} >`;
  }

}