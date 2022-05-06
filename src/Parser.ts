import { TokenType, Token } from './tokens'
import * as Exprs from './Expr';
import Lox from './lox';
import { Stmt, ExpressionStmt, PrintStmt, VarStmt, BlockStmt } from './Stmt'

export default class Parser {
  private readonly tokens: Token[]
  private current = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  public parse(): Stmt[] {
    const statements: Stmt[] = []
    while (!this.isAtEnd()) {
      statements.push(this.declaration())
    }
    return statements
  }

  private expression(): Exprs.Expr {
    return this.assignment()
  }

  private declaration(): Stmt {
    try {
      if (this.match(TokenType.Var)) return this.varDeclaration()
      return this.statement()
    } catch (error) {
      this.synchronize()
      return null;
    }
  }

  private varDeclaration(): Stmt {
    const name = this.consume(TokenType.Identifier, "Expect variable name.")
    let initializer: Exprs.Expr;
    if (this.match(TokenType.Equal)) {
      initializer = this.expression()
    }

    this.consume(TokenType.SemiColon, "Expect ';' after variable declaration.")
    return new VarStmt(name, initializer)
  }

  private statement(): Stmt {
    if (this.match(TokenType.Print)) return this.printStatement();
    if (this.match(TokenType.LeftBrace)) return new BlockStmt(this.block())

    return this.expressionStatement();
  }

  private printStatement(): Stmt {
    const value = this.expression()
    this.consume(TokenType.SemiColon, "Expect ';' after value.")
    return new PrintStmt(value)
  }

  private expressionStatement(): Stmt {
    const value = this.expression()
    this.consume(TokenType.SemiColon, "Expect ';' after value.")
    return new ExpressionStmt(value)
  }

  private block(): Stmt[] {
    const statements: Stmt[] = []

    while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
      statements.push(this.declaration())
    }

    this.consume(TokenType.RightBrace, "Expect '}' after block.")
    return statements
  }

  private assignment(): Exprs.Expr {
    let expr = this.equality()

    if ( this.match(TokenType.Equal) ) {
      const equals = this.previous()
      const value = this.assignment()

      if (expr instanceof Exprs.VariableExpr ) {
        const name = (expr as Exprs.VariableExpr).name
        return new Exprs.AssignExpr(name, value)
      }

      this.error(equals, "Invalid assignment target.")
    }

    return expr
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
      expr = new Exprs.BinaryExpr(expr, operator, right)
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

    if (this.match(TokenType.Identifier)) {
      return new Exprs.VariableExpr(this.previous())
    }

    if (this.match(TokenType.LeftParen)) {
      const expr = this.expression()
      this.consume(TokenType.RightParen, "Expect ')' after expression.")
      return new Exprs.GroupingExpr(expr)
    }

    throw this.error(this.peek(), "Expect expression.")
  }

  private consume(ttype: TokenType, message: string): Token {
    if (this.check(ttype)) return this.advance();
    throw this.error(this.peek(), message)
  }

  private error(token: Token, message: string): ParseError {
    Lox.error(token, message)
    return new ParseError()
  }

  private synchronize() {
    this.advance()

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SemiColon) return;

      switch (this.peek().type) {
        case TokenType.Class:
        case TokenType.Fun:
        case TokenType.Var:
        case TokenType.For:
        case TokenType.If:
        case TokenType.While:
        case TokenType.Print:
        case TokenType.Return:
          return;
      }
      this.advance()
    }
  }
}

class ParseError extends Error {

}

