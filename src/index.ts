import Lox from "./lox"
import AstPrinter from "./AstPrinter"
import * as Expr from './Expr'
import { TokenType, Token } from './tokens'

function main() {
  const args = process.argv.slice(2)
  const code = new Lox(args)

}
main()