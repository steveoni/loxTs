"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lox_1 = __importDefault(require("./lox"));
const tokens_1 = require("./tokens");
const KEYWORDS = {
    and: tokens_1.TokenType.And,
    class: tokens_1.TokenType.Class,
    else: tokens_1.TokenType.Else,
    false: tokens_1.TokenType.False,
    for: tokens_1.TokenType.For,
    fun: tokens_1.TokenType.Fun,
    if: tokens_1.TokenType.If,
    nil: tokens_1.TokenType.Nil,
    or: tokens_1.TokenType.Or,
    print: tokens_1.TokenType.Print,
    super: tokens_1.TokenType.Super,
    this: tokens_1.TokenType.This,
    true: tokens_1.TokenType.True,
    var: tokens_1.TokenType.Var,
    while: tokens_1.TokenType.While,
    return: tokens_1.TokenType.Return
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
        this.tokens.push(new tokens_1.Token(tokens_1.TokenType.Eof, "", null, this.line));
        return this.tokens;
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            case "(":
                this.addToken(tokens_1.TokenType.LeftParen);
                break;
            case ")":
                this.addToken(tokens_1.TokenType.RightParen);
                break;
            case "{":
                this.addToken(tokens_1.TokenType.LeftBrace);
                break;
            case "}":
                this.addToken(tokens_1.TokenType.RightBrace);
                break;
            case ',':
                this.addToken(tokens_1.TokenType.Comma);
                break;
            case ".":
                this.addToken(tokens_1.TokenType.Dot);
                break;
            case '-':
                this.addToken(tokens_1.TokenType.Minus);
                break;
            case '+':
                this.addToken(tokens_1.TokenType.Plus);
                break;
            case ';':
                this.addToken(tokens_1.TokenType.SemiColon);
                break;
            case '*':
                this.addToken(tokens_1.TokenType.Star);
                break;
            case '!':
                this.addToken(this.match("=") ? tokens_1.TokenType.BangEqual : tokens_1.TokenType.Bang);
                break;
            case '=':
                this.addToken(this.match("=") ? tokens_1.TokenType.EqualEqual : tokens_1.TokenType.Equal);
                break;
            case '<':
                this.addToken(this.match("=") ? tokens_1.TokenType.LessEqual : tokens_1.TokenType.Less);
                break;
            case '>':
                this.addToken(this.match("=") ? tokens_1.TokenType.GreaterEqual : tokens_1.TokenType.Greater);
                break;
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(tokens_1.TokenType.Slash);
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
                    lox_1.default.error(this.line, "Unexpected character.");
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
            this.tokens.push(new tokens_1.Token(type, text, literal, this.line));
        }
        else {
            this.tokens.push(new tokens_1.Token(type, text, null, this.line));
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
            lox_1.default.error(this.line, "Unterminated string");
            return;
        }
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(tokens_1.TokenType.String, value);
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
        this.addToken(tokens_1.TokenType.Number, parseFloat(this.source.substring(this.start, this.current)));
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
            types = tokens_1.TokenType.Identifier;
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