import { readFileSync } from 'fs'
import { createInterface } from "readline"
import Scanner from './scanner'
import { Token, TokenType } from './Tokens'
import Parser from './Parser'
import RuntimeError from './RuntimeError'
import Interpreter from './Interpreter'

export default class Lox {
  static hadError = false
  static hadRuntimeError = false
  private static readonly interpreter = new Interpreter()
  constructor(args: string[]) {

    if (args.length > 0) {
      this.runFile(args[0])
    }
    else {
      this.runPrompt()
    }
  }

  private runFile(path: string): void {

    try {
      const source = readFileSync(path).toString()
      this.run(source)
    }
    catch (e) {
      console.error(e)
    }

    if (Lox.hadError) process.exit(65)
    if (Lox.hadRuntimeError) process.exit(70)
  }

  private runPrompt(): void {
    //REPL
    console.log('Welcome To LOX TS:')

    const cli = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    cli.on("line", (line) => {
      line = line.trim()

      if (line == "exit") cli.close()

      try {
        this.run(line)
        Lox.hadError = false
      }
      catch (e) {
        console.error(e)
      }
      cli.prompt()
    })

    cli.on("close", () => {
      process.exit(0)
    })

    cli.prompt()
  }

  private run(source: string) {
    const scanner = new Scanner(source)
    const tokens = scanner.scanTokens()
    const parser = new Parser(tokens)
    const statements = parser.parse()

    if (Lox.hadError) return;
    console.log(statements[1])
    Lox.interpreter.interpret(statements)
  }

  // static error(line: number, message: string): void {
  //   this.report(line, "", message)
  // }

  private static report(line: number, where: string, message: string) {
    console.error(
      `[Line ${line} ] Error ${where} : ${message}`
    )

    Lox.hadError = true
  }

  static error(token: Token | number, message: string) {
    if (token instanceof Token) {
      if (token.type == TokenType.Eof) {
        this.report(token.line, " at end", message)
      }
      else {
        this.report(token.line, ` at '${token.lexeme}'`, message)
      }
    }
    else {
      this.report(token, "", message)
    }
  }

  static runtimeError(error: RuntimeError) {
    console.error(`${error.message} + 
      \n[Line ${error.token.line}]`)
    Lox.hadRuntimeError = true;
  }

}