import { TokenType, Token } from './tokens'
import * as Exprs from './Expr';
import Lox from './lox';

class Parser {
  private readonly tokens: Token[]
  private current = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  private expression(): Exprs.Expr {
    return this.equality()
  }

  private equality(): Exprs.Expr {
    let expr = this.comparison()

    while (this.match(TokenType.BangEqual, TokenType.EqualEqual)) {
      const operator = this.previous()
      const right = this.comparison()
      expr = new Exprs.BinaryExpr(expr, operator, right)
    }
    return expr
  }

  private match(...types: TokenType[]): boolean {
    for (const typee of types) {
      if (this.check(typee)) {
        this.advance()
        return true
      }
    }

    return false
  }

  private check(Ttype: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === Ttype
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.Eof
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private comparison(): Exprs.Expr {
    let expr = this.term()

    while (this.match(TokenType.Greater, TokenType.GreaterEqual, TokenType.Less, TokenType.LessEqual)) {
      const operator = this.previous()
      const right = this.term()
      expr  = new Exprs.BinaryExpr(expr, operator, right)
    }
    return expr
  }

  private term(): Exprs.Expr {
    let expr = this.factor()

    while (this.match(TokenType.Minus, TokenType.Plus)) {
      const operator = this.previous()
      const right = this.factor()
      expr = new Exprs.BinaryExpr(expr, operator, right)
    }
    return expr
  }

  private factor(): Exprs.Expr {
    let expr = this.unary()

    while (this.match(TokenType.Slash, TokenType.Star)) {
      const operator = this.previous()
      const right = this.unary()
      expr = new Exprs.BinaryExpr(expr, operator, right)
    }
    return expr
  }

  private unary(): Exprs.Expr {
    if (this.match(TokenType.Bang, TokenType.Minus)) {
      const operator = this.previous()
      const right = this.unary()
      return new Exprs.UnaryExpr(operator, right)
    }
    return this.primary()
  }

  private primary(): Exprs.Expr {
    if (this.match(TokenType.False)) return new Exprs.LiteralExpr(false);
    if (this.match(TokenType.True)) return new Exprs.LiteralExpr(true);
    if (this.match(TokenType.Nil)) return new Exprs.LiteralExpr(null);

    if (this.match(TokenType.Number, TokenType.String)) {
      return new Exprs.LiteralExpr(this.previous().literal)
    }

    if (this.match(TokenType.LeftParen)) {
      const expr = this.expression()
      this.consume(TokenType.RightParen, "Expect ')' after expression.")
      return new Exprs.GroupingExpr(expr)
    }
  }

  private consume(ttype: TokenType, message: string): Token {
    if (this.check(ttype)) return this.advance();
    throw this.error(this.peek(), message)
  }

  private error(token: Token, message: string): ParseError {
    Lox.error(token, message)
    return new ParseError()
  }

}

class ParseError extends Error {

}

