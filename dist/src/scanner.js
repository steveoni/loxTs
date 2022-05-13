"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lox_1 = __importDefault(require("./Lox"));
const Tokens_1 = require("./Tokens");
const KEYWORDS = {
    and: Tokens_1.TokenType.And,
    class: Tokens_1.TokenType.Class,
    else: Tokens_1.TokenType.Else,
    false: Tokens_1.TokenType.False,
    for: Tokens_1.TokenType.For,
    fun: Tokens_1.TokenType.Fun,
    if: Tokens_1.TokenType.If,
    nil: Tokens_1.TokenType.Nil,
    or: Tokens_1.TokenType.Or,
    print: Tokens_1.TokenType.Print,
    super: Tokens_1.TokenType.Super,
    this: Tokens_1.TokenType.This,
    true: Tokens_1.TokenType.True,
    var: Tokens_1.TokenType.Var,
    while: Tokens_1.TokenType.While,
    return: Tokens_1.TokenType.Return
};
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.source = source;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Tokens_1.Token(Tokens_1.TokenType.Eof, "", null, this.line));
        return this.tokens;
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            case "(":
                this.addToken(Tokens_1.TokenType.LeftParen);
                break;
            case ")":
                this.addToken(Tokens_1.TokenType.RightParen);
                break;
            case "{":
                this.addToken(Tokens_1.TokenType.LeftBrace);
                break;
            case "}":
                this.addToken(Tokens_1.TokenType.RightBrace);
                break;
            case ',':
                this.addToken(Tokens_1.TokenType.Comma);
                break;
            case ".":
                this.addToken(Tokens_1.TokenType.Dot);
                break;
            case '-':
                this.addToken(Tokens_1.TokenType.Minus);
                break;
            case '+':
                this.addToken(Tokens_1.TokenType.Plus);
                break;
            case ';':
                this.addToken(Tokens_1.TokenType.SemiColon);
                break;
            case '*':
                this.addToken(Tokens_1.TokenType.Star);
                break;
            case '!':
                this.addToken(this.match("=") ? Tokens_1.TokenType.BangEqual : Tokens_1.TokenType.Bang);
                break;
            case '=':
                this.addToken(this.match("=") ? Tokens_1.TokenType.EqualEqual : Tokens_1.TokenType.Equal);
                break;
            case '<':
                this.addToken(this.match("=") ? Tokens_1.TokenType.LessEqual : Tokens_1.TokenType.Less);
                break;
            case '>':
                this.addToken(this.match("=") ? Tokens_1.TokenType.GreaterEqual : Tokens_1.TokenType.Greater);
                break;
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(Tokens_1.TokenType.Slash);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.string();
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    Lox_1.default.error(this.line, "Unexpected character.");
                }
                break;
        }
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    addToken(type, literal) {
        const text = this.source.substring(this.start, this.current);
        if (typeof literal === "number" || typeof literal === "string") {
            this.tokens.push(new Tokens_1.Token(type, text, literal, this.line));
        }
        else {
            this.tokens.push(new Tokens_1.Token(type, text, null, this.line));
        }
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expected)
            return false;
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.current);
    }
    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() === '\n')
                this.line += 1;
            this.advance();
        }
        if (this.isAtEnd()) {
            Lox_1.default.error(this.line, "Unterminated string");
            return;
        }
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(Tokens_1.TokenType.String, value);
    }
    isDigit(c) {
        return c >= '0' && c <= '9';
    }
    number() {
        while (this.isDigit(this.peek()))
            this.advance();
        // llok for a factorial part
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        this.addToken(Tokens_1.TokenType.Number, parseFloat(this.source.substring(this.start, this.current)));
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        const text = this.source.substring(this.start, this.current);
        let types = KEYWORDS[text];
        if (types == null)
            types = Tokens_1.TokenType.Identifier;
        this.addToken(types);
    }
    isAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
}
exports.default = Scanner;
//# sourceMappingURL=scanner.js.map