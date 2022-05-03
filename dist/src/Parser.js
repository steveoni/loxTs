"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("./tokens");
const Exprs = __importStar(require("./Expr"));
const lox_1 = __importDefault(require("./lox"));
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        try {
            return this.expression();
        }
        catch (err) {
            if (err instanceof ParseError) {
                return null;
            }
        }
    }
    expression() {
        return this.equality();
    }
    equality() {
        let expr = this.comparison();
        while (this.match(tokens_1.TokenType.BangEqual, tokens_1.TokenType.EqualEqual)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    match(...types) {
        for (const typee of types) {
            if (this.check(typee)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    check(Ttype) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === Ttype;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    isAtEnd() {
        return this.peek().type === tokens_1.TokenType.Eof;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    comparison() {
        let expr = this.term();
        while (this.match(tokens_1.TokenType.Greater, tokens_1.TokenType.GreaterEqual, tokens_1.TokenType.Less, tokens_1.TokenType.LessEqual)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(tokens_1.TokenType.Minus, tokens_1.TokenType.Plus)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(tokens_1.TokenType.Slash, tokens_1.TokenType.Star)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(tokens_1.TokenType.Bang, tokens_1.TokenType.Minus)) {
            const operator = this.previous();
            const right = this.unary();
            return new Exprs.UnaryExpr(operator, right);
        }
        return this.primary();
    }
    primary() {
        if (this.match(tokens_1.TokenType.False))
            return new Exprs.LiteralExpr(false);
        if (this.match(tokens_1.TokenType.True))
            return new Exprs.LiteralExpr(true);
        if (this.match(tokens_1.TokenType.Nil))
            return new Exprs.LiteralExpr(null);
        if (this.match(tokens_1.TokenType.Number, tokens_1.TokenType.String)) {
            return new Exprs.LiteralExpr(this.previous().literal);
        }
        if (this.match(tokens_1.TokenType.LeftParen)) {
            const expr = this.expression();
            this.consume(tokens_1.TokenType.RightParen, "Expect ')' after expression.");
            return new Exprs.GroupingExpr(expr);
        }
        throw this.error(this.peek(), "Expect expression.");
    }
    consume(ttype, message) {
        if (this.check(ttype))
            return this.advance();
        throw this.error(this.peek(), message);
    }
    error(token, message) {
        lox_1.default.error(token, message);
        return new ParseError();
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === tokens_1.TokenType.SemiColon)
                return;
            switch (this.peek().type) {
                case tokens_1.TokenType.Class:
                case tokens_1.TokenType.Fun:
                case tokens_1.TokenType.Var:
                case tokens_1.TokenType.For:
                case tokens_1.TokenType.If:
                case tokens_1.TokenType.While:
                case tokens_1.TokenType.Print:
                case tokens_1.TokenType.Return:
                    return;
            }
            this.advance();
        }
    }
}
exports.default = Parser;
class ParseError extends Error {
}
//# sourceMappingURL=Parser.js.map