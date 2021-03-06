import { Token } from "./Tokens"

export default class RuntimeError extends Error {
  readonly token: Token
  constructor(token: Token, message: string) {
    super(message)
    this.token = token
    this.name = "RuntimeError"
  }
}