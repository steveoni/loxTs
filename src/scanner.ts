import Lox from "./lox";
import { TokenType, Token } from "./tokens";



const KEYWORDS = {
  and:   TokenType.And,
  class: TokenType.Class,
  else:  TokenType.Else,
  false: TokenType.False,
  for:   TokenType.For,
  fun:   TokenType.Fun,
  if:    TokenType.If,
  nil:   TokenType.Nil,
  or:    TokenType.Or,
  print: TokenType.Print,
  super: TokenType.Super,
  this:  TokenType.This,
  true:  TokenType.True,
  var:   TokenType.Var,
  while: TokenType.While
}


export default class Scanner {
  private source: string
  private tokens: Array<Token> = []
  private start: number = 0
  private current: number = 0
  private line: number =1
  constructor(source: string) {
    this.source = source
  }

  scanTokens(): Array<Token> {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.Eof, "", null, this.line))
    return this.tokens
  }

  private isAtEnd(): boolean{
    return this.current >= this.source.length
  }

  private scanToken(): void {
    const c: string = this.advance()
    switch(c) {
      case "(":
        this.addToken(TokenType.LeftParen)
        break;
      case ")":
        this.addToken(TokenType.RightParen)
        break;
      case "{":
        this.addToken(TokenType.LeftBrace)
        break;
      case "}":
        this.addToken(TokenType.RightBrace)
        break;
      case ',':
        this.addToken(TokenType.Comma)
        break;
      case ".":
        this.addToken(TokenType.Dot)
        break;
      case '-':
        this.addToken(TokenType.Minus)
        break;
      case '+':
        this.addToken(TokenType.Plus)
        break;
      case ';':
        this.addToken(TokenType.SemiColon)
        break;
      case '*':
        this.addToken(TokenType.Star)
        break;
      case '!':
        this.addToken(this.match("=") ? TokenType.BangEqual : TokenType.Bang)
        break;
      case '=':
        this.addToken(this.match("=") ? TokenType.EqualEqual : TokenType.Equal)
        break;
      case '<':
        this.addToken(this.match("=") ? TokenType.LessEqual : TokenType.Less)
        break;
      case '>':
        this.addToken(this.match("=") ? TokenType.GreaterEqual : TokenType.Greater)
        break;
      case '/':
        if (this.match('/')) {
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance()
        }
        else {
          this.addToken(TokenType.Slash)
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++
        break;
      case '"':
        this.string()
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        }
        else if (this.isAlpha(c)) {
          this.identifier()
        }
        else {
          Lox.error(this.line, "Unexpected character.")
        }
        break;
    }
  }

  private advance(): string {
    return this.source.charAt(this.current++)
  }

  private addToken(type: TokenType, literal?: string | number): void {
    const text: string = this.source.substring(this.start, this.current)
    if (literal) {
      this.tokens.push(new Token(type, text, literal, this.line))
    }
    else {
      this.tokens.push(new Token(type, text, null, this.line))
    }
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++
    return true
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current)
  }

  private string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line +=1
      this.advance()
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string" )
      return;
    }

    this.advance()
    const value = this.source.substring(this.start +1, this.current -1)
    this.addToken(TokenType.String, value)
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9'
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();

    // llok for a factorial part
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      this.advance()

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(TokenType.Number, parseFloat(this.source.substring(this.start, this.current)))
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current +1)
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current)
    let types: TokenType = KEYWORDS[text]
    if (types == null) types = TokenType.Identifier
    this.addToken(types)
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c == '_'
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c)
  }
}