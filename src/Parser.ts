import { TokenType, Token } from './Tokens'
import * as Exprs from './Expr';
import Lox from './Lox';
import { Stmt, 
         ExpressionStmt, 
         PrintStmt, 
         VarStmt, 
         BlockStmt,
         IfStmt,
         WhileStmt, 
         FunctionStmt,
         ReturnStmt,
         ClassStmt} from './Stmt'

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
      if (this.match(TokenType.Class)) return this.classDeclaration()
      if (this.match(TokenType.Fun)) return this.function("function")
      if (this.match(TokenType.Var)) return this.varDeclaration()
      return this.statement()
    } catch (error) {
      this.synchronize()
      return null;
    }
  }

  private classDeclaration(): Stmt {
    const name = this.consume(TokenType.Identifier, "Expect class name")
    let superClass: Exprs.VariableExpr = null;
    if (this.match(TokenType.Less)) {
      this.consume(TokenType.Identifier, "Expect superclass name.")
      superClass = new Exprs.VariableExpr(this.previous())
    }
    this.consume(TokenType.LeftBrace, "Expect '{' before class body.")
    const methods: FunctionStmt[] = [];
    while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
      methods.push(this.function("method"))
    }
    this.consume(TokenType.RightBrace, "Expect '}' after class body.")
    return new ClassStmt(name, superClass, methods)
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

  private whileStatement() {
    this.consume(TokenType.LeftParen, "Expect '(' after 'while'.")
    const condition = this.expression()
    this.consume(TokenType.RightParen, "Expect ')' after condition.")
    const body = this.statement()
    return new WhileStmt(condition, body)
  }

  private statement(): Stmt {
    if (this.match(TokenType.For)) return this.forStatement()
    if (this.match(TokenType.If)) return this.ifStatement()
    if (this.match(TokenType.Print)) return this.printStatement();
    if (this.match(TokenType.Return)) return this.returnStatement();
    if (this.match(TokenType.While)) return this.whileStatement()
    if (this.match(TokenType.LeftBrace)) return new BlockStmt(this.block())

    return this.expressionStatement();
  }

  private forStatement(): Stmt {
    this.consume(TokenType.LeftParen, "Expect '(' after 'for'.")
    let initializer: Stmt
    if (this.match(TokenType.SemiColon)) {
      initializer = null;
    } else if (this.match(TokenType.Var)) {
      initializer = this.varDeclaration()
    } else {
      initializer = this.expressionStatement()
    }

    let condition: Exprs.Expr = null
    if (!this.check(TokenType.SemiColon)) {
      condition = this.expression()
    }
    this.consume(TokenType.SemiColon, "Expect ';' after loop condition")

    let increment: Exprs.Expr = null;
    if (!this.check(TokenType.RightParen)) {
      increment = this.expression()
    }
    this.consume(TokenType.RightParen, "Expect ')' after for clauses.")
    let body = this.statement()

    if (increment != null) {
      body = new BlockStmt(
        [
          body,
          new ExpressionStmt(increment)
        ]
      )
    }
    if (condition === null) condition = new Exprs.LiteralExpr(true);
    body = new WhileStmt(condition, body)

    if (initializer != null ) {
      body = new BlockStmt([initializer, body])
    }
    return body
  }

  private ifStatement(): Stmt {
    this.consume(TokenType.LeftParen, "Expect '('  after 'if'.")
    const condition = this.expression()
    this.consume(TokenType.RightParen, "Expect ')' after if condition.")
    const thenBranch = this.statement()
    let elseBranch = null;
    if (this.match(TokenType.Else)) {
      elseBranch = this.statement()
    }
    return new IfStmt(condition, thenBranch, elseBranch)
  }

  private printStatement(): Stmt {
    const value = this.expression()
    this.consume(TokenType.SemiColon, "Expect ';' after value.")
    return new PrintStmt(value)
  }

  private returnStatement(): Stmt {
    const keyword = this.previous()
    let value: Exprs.Expr = null;
    if (!this.check(TokenType.SemiColon)) {
      value = this.expression();
    }
    this.consume(TokenType.SemiColon, "Expect ';' after return value.")
    return new ReturnStmt(keyword, value)
  }

  private expressionStatement(): Stmt {
    const value = this.expression()
    this.consume(TokenType.SemiColon, "Expect ';' after value.")
    return new ExpressionStmt(value)
  }

  private function (kind: string): FunctionStmt {
    const name = this.consume(TokenType.Identifier, `Expect ${kind} name.`)
    this.consume(TokenType.LeftParen, `Expect ( after ${kind} name.`)
    const parameters: Token[] = []
    if (!this.check(TokenType.RightParen)) {
      do {
        if (parameters.length >= 255 ) {
          this.error(this.peek(), "Can't have more than 255 parameters.")
        }
        parameters.push(
          this.consume(TokenType.Identifier, "Expect parameter name.")
        )
      } while (this.match(TokenType.Comma))
    }
    this.consume(TokenType.RightParen, "Expect ')' after parameters.")
    this.consume(TokenType.LeftBrace, `Expect '{' before ${kind} body`)
    const body = this.block()
    return new FunctionStmt(name, parameters, body)
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
    let expr = this.or()

    if ( this.match(TokenType.Equal) ) {
      const equals = this.previous()
      const value = this.assignment()

      if (expr instanceof Exprs.VariableExpr ) {
        const name = (expr as Exprs.VariableExpr).name
        return new Exprs.AssignExpr(name, value)
      } 
      else if ( expr instanceof Exprs.GetExpr) {
        const get = expr as Exprs.GetExpr
        return new Exprs.SetExpr(get.obj, get.name, value)
      }

      this.error(equals, "Invalid assignment target.")
    }

    return expr
  }


  private or(): Exprs.Expr {
    let expr = this.and()

    while (this.match(TokenType.Or)) {
      const operator = this.previous()
      const right = this.and()
      expr = new Exprs.LogicalExpr(expr, operator, right)
    }
    return expr
  }

  private and(): Exprs.Expr {
    let expr = this.equality()
    while( this.match(TokenType.And)) {
      const operator = this.previous()
      const right = this.equality()
      expr = new Exprs.LogicalExpr(expr, operator, right)
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
    return this.call()
  }

  private call(): Exprs.Expr {
    let expr = this.primary()
    while (true) {
      if (this.match(TokenType.LeftParen)) {
        expr = this.finishCall(expr)
      } else if (this.match(TokenType.Dot)) {
        const name = this.consume(TokenType.Identifier,
          "Expect property name after '.' .")
          expr = new Exprs.GetExpr(expr, name)  
      } 
      else {
        break;
      }
    }
    return expr;
  }

  private finishCall(callee: Exprs.Expr): Exprs.Expr {
    const argument: Exprs.Expr[] = []
    if (!this.check(TokenType.RightParen)) {
      do {
        if (argument.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 arguments")
        }
        argument.push(this.expression())
      } while (this.match(TokenType.Comma))
    }

    const paren = this.consume(TokenType.RightParen,
      "Expect ')' after arguments.")
    return new Exprs.CallExpr(callee, paren, argument)
  }

  private primary(): Exprs.Expr {
    if (this.match(TokenType.False)) return new Exprs.LiteralExpr(false);
    if (this.match(TokenType.True)) return new Exprs.LiteralExpr(true);
    if (this.match(TokenType.Nil)) return new Exprs.LiteralExpr(null);

    if (this.match(TokenType.Number, TokenType.String)) {
      return new Exprs.LiteralExpr(this.previous().literal)
    }

    if (this.match(TokenType.Super)) {
      const keyword = this.previous();
      this.consume(TokenType.Dot, "Expect '.' after 'super'.")
      const method = this.consume(TokenType.Identifier,
        "Expect superclass method name");
      return new Exprs.SuperExpr(keyword, method)
    }

    if (this.match(TokenType.This)) return new Exprs.ThisExpr(this.previous())

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

