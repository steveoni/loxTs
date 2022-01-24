import { readFileSync } from 'fs'
import { createInterface } from "readline"
import Scanner from './scanner'

export default class Lox {
  static hadError: boolean = false
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
    catch (e){
      console.error(e)
    }

    if (Lox.hadError) process.exit(65)
  }

  private runPrompt(): void {
    //REPL
    console.log('Welcome To LOX TS:')

    const cli = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    cli.on("line", (line)=>{
      line = line.trim()

      if (line == "close") cli.close()

      try {
        this.run(line)
      } 
      catch (e) {
        console.error(e)
      }
      cli.prompt()
    })

    cli.on("close", ()=> {
      process.exit(0)
    })

    cli.prompt()
  }

  private run(source: string) {
    const scanner = new Scanner(source)
    const tokens = scanner.addTokens()

    for (let token of tokens) {
      console.log(token)
    }
  }

  static error(line: number, message: string): void {
    this.report(line, "", message)
  };

  private static report(line: number, where: string, message: string) {
    console.error(
      `[Line ${line} ] Error ${where} : ${message}`
    )

    Lox.hadError = true
  }
  
}