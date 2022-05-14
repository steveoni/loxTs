import Interpreter from "./Interpreter";
import LoxCallable from "./LoxCallable";
import LoxFunction from "./LoxFunction";
import LoxInstance from "./LoxInstance";

export default class LoxClass implements LoxCallable {
  readonly name: string
  private readonly methods: Map<string, LoxFunction>
  constructor(name: string, methods: Map<string, LoxFunction>) {
    this.name = name;
    this.methods = methods
  }

  public call(interpret: Interpreter, argument: any[]): any {
    const instance = new LoxInstance(this);
    const initializer = this.findMethod("init");
    if (initializer !== null) {
      initializer.bind(instance).call(interpret, argument)
    }
    return instance;
  }

  public arity(): number {
    const initializer = this.findMethod("init")
    if (initializer === null) return 0;
    return initializer.arity()
  }

  findMethod(name: string): LoxFunction {
    if (this.methods.has(name)) {
      return this.methods.get(name)
    }

    return null;
  }

  
  public toString() {
    return this.name;
  }
}