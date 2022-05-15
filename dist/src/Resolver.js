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
    FunctionType[FunctionType["METHOD"] = 2] = "METHOD";
    FunctionType[FunctionType["INITIALIZER"] = 3] = "INITIALIZER";
})(FunctionType || (FunctionType = {}));
var ClassType;
(function (ClassType) {
    ClassType[ClassType["NONE"] = 0] = "NONE";
    ClassType[ClassType["CLASS"] = 1] = "CLASS";
    ClassType[ClassType["SUBCLASS"] = 2] = "SUBCLASS";
})(ClassType || (ClassType = {}));
class Resolver {
    constructor(interpreter) {
        this.scopes = [];
        this.currentFunction = FunctionType.None;
        this.currentClass = ClassType.NONE;
        this.interpreter = interpreter;
    }
    visitBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
    }
    visitClassStmt(stmt) {
        const enclosingClass = this.currentClass;
        this.currentClass = ClassType.CLASS;
        this.declare(stmt.name);
        this.define(stmt.name);
        if (stmt.superclass !== null &&
            (stmt.name.lexeme === stmt.superclass.name.lexeme)) {
            Lox_1.default.error(stmt.superclass.name, "A class can't inherit from itself.");
        }
        if (stmt.superclass != null) {
            this.currentClass = ClassType.SUBCLASS;
            this.resolveExpr(stmt.superclass);
        }
        if (stmt.superclass !== null) {
            this.beginScope();
            this.scopes.at(-1).set("super", true);
        }
        this.beginScope();
        this.scopes.at(-1).set("this", true);
        for (const method of stmt.methods) {
            let declaration = FunctionType.METHOD;
            if (method.name.lexeme === "init") {
                declaration = FunctionType.INITIALIZER;
            }
            this.resolveFunction(method, declaration);
        }
        this.endScope();
        if (stmt.superclass !== null)
            this.endScope();
        this.currentClass = enclosingClass;
        return null;
    }
    resolve(statements) {
        if (statements) {
            for (const statement of statements) {
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
            if (this.currentFunction === FunctionType.INITIALIZER) {
                Lox_1.default.error(stmt.keyword, "Can't return a value from an initializer.");
            }
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
    visitSetExpr(expr) {
        this.resolveExpr(expr.value);
        this.resolveExpr(expr.obj);
        return null;
    }
    visitSuperExpr(expr) {
        if (this.currentClass === ClassType.NONE) {
            Lox_1.default.error(expr.keyword, "Can't use 'super' outside of a class.");
        }
        else if (this.currentClass !== ClassType.SUBCLASS) {
            Lox_1.default.error(expr.keyword, "Can't use 'super' in a class with no superclass.");
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
    visitThisExpr(expr) {
        if (this.currentClass === ClassType.NONE) {
            Lox_1.default.error(expr.keyword, "Can't use 'this' outside of a class.");
            return null;
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
    visitUnaryExpr(expr) {
        this.resolveExpr(expr.right);
        return null;
    }
}
exports.default = Resolver;
//# sourceMappingURL=Resolver.js.map