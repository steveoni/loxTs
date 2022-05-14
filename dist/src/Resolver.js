"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lox_1 = __importDefault(require("./Lox"));
const pollyfill_1 = require("./pollyfill");
(0, pollyfill_1.poly)();
var FunctionType;
(function (FunctionType) {
    FunctionType[FunctionType["None"] = 0] = "None";
    FunctionType[FunctionType["FUNC"] = 1] = "FUNC";
})(FunctionType || (FunctionType = {}));
class Resolver {
    constructor(interpreter) {
        this.scopes = [];
        this.currentFunction = FunctionType.None;
        this.interpreter = interpreter;
    }
    visitBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
    }
    visitClassStmt(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        return null;
    }
    resolve(statements) {
        if (statements) {
            for (let statement of statements) {
                this.resolveStmt(statement);
            }
        }
    }
    resolveStmt(stmt) {
        stmt.accept(this);
    }
    resolveExpr(expr) {
        expr.accept(this);
    }
    beginScope() {
        this.scopes.push(new Map());
    }
    endScope() {
        this.scopes.pop();
    }
    visitVarStmt(stmt) {
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolveExpr(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    }
    declare(name) {
        if (this.scopes.length === 0)
            return;
        const scope = this.scopes.at(-1);
        if (scope.has(name.lexeme)) {
            Lox_1.default.error(name, "Already a variable with this name in this scope");
        }
        scope.set(name.lexeme, false);
    }
    define(name) {
        if (this.scopes.length === 0)
            return;
        this.scopes.at(-1).set(name.lexeme, true);
    }
    visitVariableExpr(expr) {
        if (this.scopes.length > 0 &&
            this.scopes.at(-1).get(expr.name.lexeme) === false) {
            Lox_1.default.error(expr.name, "Can't read local variable in its own initializer.");
        }
        this.resolveLocal(expr, expr.name);
        return null;
    }
    resolveLocal(expr, name) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name.lexeme)) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }
    visitAssignExpr(expr) {
        this.resolveExpr(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }
    visitFunctionStmt(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolveFunction(stmt, FunctionType.FUNC);
        return null;
    }
    resolveFunction(func, funcType) {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = funcType;
        this.beginScope();
        for (let param of func.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolve(func.body);
        this.endScope();
        this.currentFunction = enclosingFunction;
    }
    visitExpressionStmt(stmt) {
        this.resolveExpr(stmt.expression);
        return null;
    }
    visitIfStmt(stmt) {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.thenBranch);
        if (stmt.elseBranch != null)
            this.resolveStmt(stmt.elseBranch);
        return null;
    }
    visitPrintStmt(stmt) {
        this.resolveExpr(stmt.expression);
        return null;
    }
    visitReturnStmt(stmt) {
        if (this.currentFunction === FunctionType.None) {
            Lox_1.default.error(stmt.keyword, "Can't return from top-level code");
        }
        if (stmt.value != null) {
            this.resolveExpr(stmt.value);
        }
        return null;
    }
    visitWhileStmt(stmt) {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.body);
        return null;
    }
    visitBinaryExpr(expr) {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
        return null;
    }
    visitCallExpr(expr) {
        this.resolveExpr(expr.callee);
        for (const argument of expr.argument) {
            this.resolveExpr(argument);
        }
        return null;
    }
    visitGetExpr(expr) {
        this.resolveExpr(expr.obj);
        return null;
    }
    visitGroupingExpr(expr) {
        this.resolveExpr(expr.expression);
        return null;
    }
    visitLiteralExpr(expr) {
        return null;
    }
    visitLogicalExpr(expr) {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
        return null;
    }
    visitUnaryExpr(expr) {
        this.resolveExpr(expr.right);
        return null;
    }
}
exports.default = Resolver;
//# sourceMappingURL=Resolver.js.map