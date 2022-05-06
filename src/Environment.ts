import RuntimeError from './RuntimeError'
import { Token } from './tokens'

export default class Environment {
  readonly enclosing: Environment
  private readonly values = new Map<string, any>()

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing || null;
  }

  define(name: string, value: any) {
    this.values.set(name, value)
  }

  get(name: Token): any {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme)
    }

    if ( this.enclosing != null ) return this.enclosing.get(name)

    throw new RuntimeError(name,
      `Undefined variable ${name.lexeme}.`)
  }

  assign(name: Token, value: any) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value)
      return;
    }

    if (this.enclosing != null ) {
      this.enclosing.assign(name, value)
      return;
    }
    throw new RuntimeError(name,
      `Undefined variable ${name.lexeme}.`)
  }
}