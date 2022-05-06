"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("./tokens");
const RuntimeError_1 = __importDefault(require("./RuntimeError"));
const lox_1 = __importDefault(require("./lox"));
const Environment_1 = __importDefault(require("./Environment"));
class Interpreter {
    constructor() {
        this.environment = new Environment_1.default();
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr);
    }
    evaluate(expr) {
        return expr.accept(this);
    }
    execute(stmt) {
        stmt.accept(this);
    }
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
        return null;
    }
    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        return null;
    }
    visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
        return null;
    }
    visitAssignExpr(expr) {
        const value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
    }
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case tokens_1.TokenType.Minus:
                this.checkNumberOperand(expr.operator, right);
                return -right;
                break;
            case tokens_1.TokenType.Bang:
                return !this.isTruthy(right);
        }
    }
    visitVariableExpr(expr) {
        return this.environment.get(expr.name);
    }
    checkNumberOperand(operator, operand) {
        if (typeof operand === "number")
            return;
        throw new RuntimeError_1.default(operator, "Operand must be a number");
    }
    isTruthy(obj) {
        if (obj == null)
            return false;
        if (typeof obj === "boolean")
            return obj;
        return true;
    }
    visitBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case tokens_1.TokenType.Minus:
                this.checkNumberOperands(expr.operator, left, right);
                return left - right;
            case tokens_1.TokenType.Slash:
                this.checkNumberOperands(expr.operator, left, right);
                return left / right;
            case tokens_1.TokenType.Star:
                this.checkNumberOperands(expr.operator, left, right);
                return left * right;
            case tokens_1.TokenType.Plus:
                if (typeof left === "number" && typeof right === "number") {
                    return left + right;
                }
                if (typeof left === "string" && typeof right === "string") {
                    return left + right;
                }
                throw new RuntimeError_1.default(expr.operator, "Operands must be two numbers or two strings.");
            case tokens_1.TokenType.Greater:
                this.checkNumberOperands(expr.operator, left, right);
                return left > right;
            case tokens_1.TokenType.GreaterEqual:
                this.checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case tokens_1.TokenType.Less:
                this.checkNumberOperands(expr.operator, left, right);
                return left < right;
            case tokens_1.TokenType.LessEqual:
                this.checkNumberOperands(expr.operator, left, right);
                return left <= right;
            case tokens_1.TokenType.BangEqual:
                return !this.isEqual(left, right);
            case tokens_1.TokenType.EqualEqual:
                return !this.isEqual(left, right);
        }
    }
    checkNumberOperands(operator, left, right) {
        if (typeof left === "number" && typeof right === "number")
            return;
        throw new RuntimeError_1.default(operator, "operands must be numbers");
    }
    isEqual(a, b) {
        if (a == null && b == null)
            return true;
        if (a == null)
            return false;
        return (a === b);
    }
    interpret(statements) {
        try {
            for (let i = 0; i < statements.length; i++) {
                this.execute(statements[i]);
            }
        }
        catch (error) {
            lox_1.default.runtimeError(error);
        }
    }
    stringify(obj) {
        if (obj === null)
            return "nil";
        if (typeof obj === "number") {
            let text = obj.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }
        return obj.toString();
    }
}
exports.default = Interpreter;
//# sourceMappingURL=Interpreter.js.map