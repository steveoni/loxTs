"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tokens_1 = require("./Tokens");
const RuntimeError_1 = __importDefault(require("./RuntimeError"));
const Lox_1 = __importDefault(require("./Lox"));
const Environment_1 = __importDefault(require("./Environment"));
const LoxFunction_1 = __importDefault(require("./LoxFunction"));
const Return_1 = __importDefault(require("./Return"));
class Interpreter {
    constructor() {
        this.globals = new Environment_1.default();
        this.environment = new Environment_1.default();
        this.locals = new Map();
        this.environment = this.globals;
        this.globals.define("clock", {
            arity() {
                return 0;
            },
            call(interpreter, argument) {
                const date = new Date();
                return date.getMilliseconds() / 1000.0;
            },
            toString() {
                return "<native fn>";
            }
        });
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitLogicalExpr(expr) {
        const left = this.evaluate(expr.left);
        if (expr.operator.type === Tokens_1.TokenType.Or) {
            if (this.isTruthy(left))
                return left;
        }
        else {
            if (!this.isTruthy(left))
                return left;
        }
        return this.evaluate(expr.right);
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
    resolve(expr, depth) {
        this.locals.set(expr, depth);
    }
    executeBlock(statements, environment) {
        const previous = this.environment;
        try {
            this.environment = environment;
            for (const statement of statements) {
                this.execute(statement);
            }
        }
        finally {
            this.environment = previous;
        }
    }
    visitBlockStmt(stmt) {
        this.executeBlock(stmt.statements, new Environment_1.default(this.environment));
        return null;
    }
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
        return null;
    }
    visitFunctionStmt(stmt) {
        const func = new LoxFunction_1.default(stmt, this.environment);
        this.environment.define(stmt.name.lexeme, func);
        return null;
    }
    visitIfStmt(stmt) {
        const cond = this.evaluate(stmt.condition);
        if (this.isTruthy(cond)) {
            this.execute(stmt.thenBranch);
        }
        else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    }
    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        return null;
    }
    visitReturnStmt(stmt) {
        let value = null;
        if (stmt.value != null)
            value = this.evaluate(stmt.value);
        throw new Return_1.default(value);
    }
    visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
        return null;
    }
    visitWhileStmt(stmt) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
        return null;
    }
    visitAssignExpr(expr) {
        const value = this.evaluate(expr.value);
        const distance = this.locals.get(expr);
        if (distance !== null) {
            this.environment.assignAt(distance, expr.name, value);
        }
        else {
            this.globals.assign(expr.name, value);
        }
        return value;
    }
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case Tokens_1.TokenType.Minus:
                this.checkNumberOperand(expr.operator, right);
                return -right;
                break;
            case Tokens_1.TokenType.Bang:
                return !this.isTruthy(right);
        }
    }
    visitVariableExpr(expr) {
        return this.lookUpVariable(expr.name, expr);
    }
    lookUpVariable(name, expr) {
        const distance = this.locals.get(expr);
        if (distance != null) {
            console.log("distance", distance, name);
            console.log(this.environment);
            return this.environment.getAt(distance, name.lexeme);
        }
        else {
            console.log("global", name);
            console.log(this.globals);
            return this.globals.get(name);
        }
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
            case Tokens_1.TokenType.Minus:
                this.checkNumberOperands(expr.operator, left, right);
                return left - right;
            case Tokens_1.TokenType.Slash:
                this.checkNumberOperands(expr.operator, left, right);
                return left / right;
            case Tokens_1.TokenType.Star:
                this.checkNumberOperands(expr.operator, left, right);
                return left * right;
            case Tokens_1.TokenType.Plus:
                if (typeof left === "number" && typeof right === "number") {
                    return left + right;
                }
                if (typeof left === "string" && typeof right === "string") {
                    return left + right;
                }
                throw new RuntimeError_1.default(expr.operator, "Operands must be two numbers or two strings.");
            case Tokens_1.TokenType.Greater:
                this.checkNumberOperands(expr.operator, left, right);
                return left > right;
            case Tokens_1.TokenType.GreaterEqual:
                this.checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case Tokens_1.TokenType.Less:
                this.checkNumberOperands(expr.operator, left, right);
                return left < right;
            case Tokens_1.TokenType.LessEqual:
                this.checkNumberOperands(expr.operator, left, right);
                return left <= right;
            case Tokens_1.TokenType.BangEqual:
                return !this.isEqual(left, right);
            case Tokens_1.TokenType.EqualEqual:
                return this.isEqual(left, right);
        }
    }
    visitCallExpr(expr) {
        const callee = this.evaluate(expr.callee);
        const argumentss = [];
        for (const argument of expr.arguments) {
            argumentss.push(this.evaluate(argument));
        }
        if (!("call" in callee)) {
            throw new RuntimeError_1.default(expr.paren, "Can only call functions and classes.");
        }
        const func = callee;
        if (argumentss.length != func.arity()) {
            throw new RuntimeError_1.default(expr.paren, `Expected ${func.arity()} arguments but got ${argumentss.length}`);
        }
        return func.call(this, argumentss);
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
            Lox_1.default.runtimeError(error);
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