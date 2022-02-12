import Lox from "./lox"
import AstPrinter from "./AstPrinter"
import * as Expr from './Expr'
import {TokenType, Token} from './tokens'

function main(){
  // const args = process.argv.slice(2)
  // const code = new Lox(args)
  const expression = new Expr.BinaryExpr(
    new Expr.UnaryExpr(
      new Token(TokenType.Minus, "-", null, 1),
      new Expr.LiteralExpr(123)
    ),
    new Token(TokenType.Star, '*', null, 1),
    new Expr.GroupingExpr(
      new Expr.LiteralExpr(45.67)
    )
  )

  const expres = new Expr.BinaryExpr(
    new Expr.BinaryExpr(
      new Expr.LiteralExpr(1),
      new Token(TokenType.Plus, "+", null, 1),
      new Expr.LiteralExpr(2),
    ),
    new Token(TokenType.Star, "*", null, 1),
    new Expr.BinaryExpr(
      new Expr.LiteralExpr(4),
      new Token(TokenType.Minus, "-", null, 1),
      new Expr.LiteralExpr(3),
    )
  )

  console.log(new AstPrinter().print(expres))
}
main()