import Interpreter from "./Interpreter";
import LoxCallable from "./LoxCallable";
import LoxInstance from "./LoxInstance";

export default class LoxClass implements LoxCallable {
  readonly name: string
  constructor(name: string) {
    this.name = name;
  }

  public call(interpret: Interpreter, argument: any[]): any {
    const instance = new LoxInstance(this);
    return instance;
  }

  public arity(): number {
    return 0;
  }

  
  public toString() {
    return this.name;
  }
}