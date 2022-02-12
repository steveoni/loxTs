"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // single-character tokens
    TokenType["LeftParen"] = "LeftParen";
    TokenType["RightParen"] = "RightParen";
    TokenType["LeftBrace"] = "LeftBrace";
    TokenType["RightBrace"] = "RightBrace";
    TokenType["Comma"] = "Comma";
    TokenType["Dot"] = "Dot";
    TokenType["Minus"] = "Minus";
    TokenType["Plus"] = "Plus";
    TokenType["SemiColon"] = "SemiColon";
    TokenType["Slash"] = "Slash";
    TokenType["Star"] = "Star";
    // one or two character tokens.
    TokenType["Bang"] = "Bang";
    TokenType["BangEqual"] = "BangEqual";
    TokenType["Equal"] = "Equal";
    TokenType["EqualEqual"] = "EqualEqual";
    TokenType["Greater"] = "Greater";
    TokenType["GreaterEqual"] = "GreaterEqual";
    TokenType["Less"] = "Less";
    TokenType["LessEqual"] = "LessEqual";
    // Literals
    TokenType["Identifier"] = "Identifier";
    TokenType["String"] = "String";
    TokenType["Number"] = "Number";
    // keywords
    TokenType["And"] = "And";
    TokenType["Class"] = "Class";
    TokenType["Else"] = "Else";
    TokenType["False"] = "False";
    TokenType["Fun"] = "Fun";
    TokenType["For"] = "For";
    TokenType["If"] = "If";
    TokenType["Nil"] = "Nil";
    TokenType["Or"] = "Or";
    TokenType["Print"] = "Print";
    TokenType["Return"] = "Return";
    TokenType["Super"] = "Super";
    TokenType["This"] = "This";
    TokenType["True"] = "True";
    TokenType["Var"] = "Var";
    TokenType["While"] = "While";
    TokenType["Eof"] = "Eof";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
    toString() {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}
exports.Token = Token;
//# sourceMappingURL=tokens.js.map