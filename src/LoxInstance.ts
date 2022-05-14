import LoxClass from "./LoxClass"
import LoxFunction from "./LoxFunction";
import RuntimeError from "./RuntimeError";
import { Token } from "./Tokens";

export default class LoxInstance {
  private klass: LoxClass
  private readonly fields = new Map<string, any>()
  constructor(klass: LoxClass) {
    this.klass = klass
  }

  get(name: Token): any {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme)
    }

    const method: LoxFunction = this.klass.findMethod(name.lexeme)
    if (method !== null) return method.bind(this);

    throw new RuntimeError(name,
      `Undefined property ${name.lexeme}.`)
  }

  set(name: Token, value: any) {
    this.fields.set(name.lexeme, value)
  }

  public toString() {
    return `${this.klass.name} instance`;
  }
}