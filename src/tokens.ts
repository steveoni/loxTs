export enum TokenType {
  // single-character tokens
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  LeftBrace = "LeftBrace",
  RightBrace = "RightBrace",
  Comma = "Comma",
  Dot = "Dot",
  Minus = "Minus",
  Plus = "Plus",
  SemiColon = "SemiColon",
  Slash = "Slash",
  Star = "Star",

  // one or two character tokens.
  Bang = "Bang",
  BangEqual = "BangEqual",
  Equal = "Equal",
  EqualEqual = "EqualEqual",
  Greater = "Greater",
  GreaterEqual = "GreaterEqual",
  Less = "Less",
  LessEqual = "LessEqual",

  // Literals
  Identifier = "Identifier",
  String = "String",
  Number = "Number",

  // keywords
  And = "And",
  Class = "Class",
  Else = "Else",
  False = "False",
  Fun = "Fun",
  For = "For",
  If = "If",
  Nil = "Nil",
  Or = "Or",
  Print = "Print",
  Return = "Return",
  Super = "Super",
  This = "This",
  True = "True",
  Var = "Var",
  While = "While",
  Eof = "Eof"
}
export class Token {
  type: TokenType
  lexeme: string
  literal: string | number
  line: number

  constructor(type: TokenType, lexeme: string, literal: string | number, line: number) {
    this.type = type
    this.lexeme = lexeme
    this.literal = literal
    this.line = line
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }

}