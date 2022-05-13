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
const Tokens_1 = require("./Tokens");
const Exprs = __importStar(require("./Expr"));
const Lox_1 = __importDefault(require("./Lox"));
const Stmt_1 = require("./Stmt");
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }
        return statements;
    }
    expression() {
        return this.assignment();
    }
    declaration() {
        try {
            if (this.match(Tokens_1.TokenType.Fun))
                return this.function("function");
            if (this.match(Tokens_1.TokenType.Var))
                return this.varDeclaration();
            return this.statement();
        }
        catch (error) {
            this.synchronize();
            return null;
        }
    }
    varDeclaration() {
        const name = this.consume(Tokens_1.TokenType.Identifier, "Expect variable name.");
        let initializer;
        if (this.match(Tokens_1.TokenType.Equal)) {
            initializer = this.expression();
        }
        this.consume(Tokens_1.TokenType.SemiColon, "Expect ';' after variable declaration.");
        return new Stmt_1.VarStmt(name, initializer);
    }
    whileStatement() {
        this.consume(Tokens_1.TokenType.LeftParen, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(Tokens_1.TokenType.RightParen, "Expect ')' after condition.");
        const body = this.statement();
        return new Stmt_1.WhileStmt(condition, body);
    }
    statement() {
        if (this.match(Tokens_1.TokenType.For))
            return this.forStatement();
        if (this.match(Tokens_1.TokenType.If))
            return this.ifStatement();
        if (this.match(Tokens_1.TokenType.Print))
            return this.printStatement();
        if (this.match(Tokens_1.TokenType.Return))
            return this.returnStatement();
        if (this.match(Tokens_1.TokenType.While))
            return this.whileStatement();
        if (this.match(Tokens_1.TokenType.LeftBrace))
            return new Stmt_1.BlockStmt(this.block());
        return this.expressionStatement();
    }
    forStatement() {
        this.consume(Tokens_1.TokenType.LeftParen, "Expect '(' after 'for'.");
        let initializer;
        if (this.match(Tokens_1.TokenType.SemiColon)) {
            initializer = null;
        }
        else if (this.match(Tokens_1.TokenType.Var)) {
            initializer = this.varDeclaration();
        }
        else {
            initializer = this.expressionStatement();
        }
        let condition = null;
        if (!this.check(Tokens_1.TokenType.SemiColon)) {
            condition = this.expression();
        }
        this.consume(Tokens_1.TokenType.SemiColon, "Expect ';' after loop condition");
        let increment = null;
        if (!this.check(Tokens_1.TokenType.RightParen)) {
            increment = this.expression();
        }
        this.consume(Tokens_1.TokenType.RightParen, "Expect ')' after for clauses.");
        let body = this.statement();
        if (increment != null) {
            body = new Stmt_1.BlockStmt([
                body,
                new Stmt_1.ExpressionStmt(increment)
            ]);
        }
        if (condition === null)
            condition = new Exprs.LiteralExpr(true);
        body = new Stmt_1.WhileStmt(condition, body);
        if (initializer != null) {
            body = new Stmt_1.BlockStmt([initializer, body]);
        }
        return body;
    }
    ifStatement() {
        this.consume(Tokens_1.TokenType.LeftParen, "Expect '('  after 'if'.");
        const condition = this.expression();
        this.consume(Tokens_1.TokenType.RightParen, "Expect ')' after if condition.");
        const thenBranch = this.statement();
        let elseBranch = null;
        if (this.match(Tokens_1.TokenType.Else)) {
            elseBranch = this.statement();
        }
        return new Stmt_1.IfStmt(condition, thenBranch, elseBranch);
    }
    printStatement() {
        const value = this.expression();
        this.consume(Tokens_1.TokenType.SemiColon, "Expect ';' after value.");
        return new Stmt_1.PrintStmt(value);
    }
    returnStatement() {
        const keyword = this.previous();
        let value = null;
        if (!this.check(Tokens_1.TokenType.SemiColon)) {
            value = this.expression();
        }
        this.consume(Tokens_1.TokenType.SemiColon, "Expect ';' after return value.");
        return new Stmt_1.ReturnStmt(keyword, value);
    }
    expressionStatement() {
        const value = this.expression();
        this.consume(Tokens_1.TokenType.SemiColon, "Expect ';' after value.");
        return new Stmt_1.ExpressionStmt(value);
    }
    function(kind) {
        const name = this.consume(Tokens_1.TokenType.Identifier, `Expect ${kind} name.`);
        this.consume(Tokens_1.TokenType.LeftParen, `Expect ( after ${kind} name.`);
        const parameters = [];
        if (!this.check(Tokens_1.TokenType.RightParen)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.");
                }
                parameters.push(this.consume(Tokens_1.TokenType.Identifier, "Expect parameter name."));
            } while (this.match(Tokens_1.TokenType.Comma));
        }
        this.consume(Tokens_1.TokenType.RightParen, "Expect ')' after parameters.");
        this.consume(Tokens_1.TokenType.LeftBrace, `Expect '{' before ${kind} body`);
        const body = this.block();
        return new Stmt_1.FunctionStmt(name, parameters, body);
    }
    block() {
        const statements = [];
        while (!this.check(Tokens_1.TokenType.RightBrace) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(Tokens_1.TokenType.RightBrace, "Expect '}' after block.");
        return statements;
    }
    assignment() {
        let expr = this.or();
        if (this.match(Tokens_1.TokenType.Equal)) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr instanceof Exprs.VariableExpr) {
                const name = expr.name;
                return new Exprs.AssignExpr(name, value);
            }
            this.error(equals, "Invalid assignment target.");
        }
        return expr;
    }
    or() {
        let expr = this.and();
        while (this.match(Tokens_1.TokenType.Or)) {
            const operator = this.previous();
            const right = this.and();
            expr = new Exprs.LogicalExpr(expr, operator, right);
        }
        return expr;
    }
    and() {
        let expr = this.equality();
        while (this.match(Tokens_1.TokenType.And)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new Exprs.LogicalExpr(expr, operator, right);
        }
        return expr;
    }
    equality() {
        let expr = this.comparison();
        while (this.match(Tokens_1.TokenType.BangEqual, Tokens_1.TokenType.EqualEqual)) {
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
        return this.peek().type === Tokens_1.TokenType.Eof;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    comparison() {
        let expr = this.term();
        while (this.match(Tokens_1.TokenType.Greater, Tokens_1.TokenType.GreaterEqual, Tokens_1.TokenType.Less, Tokens_1.TokenType.LessEqual)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(Tokens_1.TokenType.Minus, Tokens_1.TokenType.Plus)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(Tokens_1.TokenType.Slash, Tokens_1.TokenType.Star)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Exprs.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(Tokens_1.TokenType.Bang, Tokens_1.TokenType.Minus)) {
            const operator = this.previous();
            const right = this.unary();
            return new Exprs.UnaryExpr(operator, right);
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        while (true) {
            if (this.match(Tokens_1.TokenType.LeftParen)) {
                expr = this.finishCall(expr);
            }
            else {
                break;
            }
        }
        return expr;
    }
    finishCall(callee) {
        const argument = [];
        if (!this.check(Tokens_1.TokenType.RightParen)) {
            do {
                if (argument.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 arguments");
                }
                argument.push(this.expression());
            } while (this.match(Tokens_1.TokenType.Comma));
        }
        const paren = this.consume(Tokens_1.TokenType.RightParen, "Expect ')' after arguments.");
        return new Exprs.CallExpr(callee, paren, argument);
    }
    primary() {
        if (this.match(Tokens_1.TokenType.False))
            return new Exprs.LiteralExpr(false);
        if (this.match(Tokens_1.TokenType.True))
            return new Exprs.LiteralExpr(true);
        if (this.match(Tokens_1.TokenType.Nil))
            return new Exprs.LiteralExpr(null);
        if (this.match(Tokens_1.TokenType.Number, Tokens_1.TokenType.String)) {
            return new Exprs.LiteralExpr(this.previous().literal);
        }
        if (this.match(Tokens_1.TokenType.Identifier)) {
            return new Exprs.VariableExpr(this.previous());
        }
        if (this.match(Tokens_1.TokenType.LeftParen)) {
            const expr = this.expression();
            this.consume(Tokens_1.TokenType.RightParen, "Expect ')' after expression.");
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
        Lox_1.default.error(token, message);
        return new ParseError();
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === Tokens_1.TokenType.SemiColon)
                return;
            switch (this.peek().type) {
                case Tokens_1.TokenType.Class:
                case Tokens_1.TokenType.Fun:
                case Tokens_1.TokenType.Var:
                case Tokens_1.TokenType.For:
                case Tokens_1.TokenType.If:
                case Tokens_1.TokenType.While:
                case Tokens_1.TokenType.Print:
                case Tokens_1.TokenType.Return:
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