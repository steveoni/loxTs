"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhileStmt = exports.VarStmt = exports.ReturnStmt = exports.PrintStmt = exports.IfStmt = exports.FunctionStmt = exports.ExpressionStmt = exports.BlockStmt = void 0;
class BlockStmt {
    constructor(statements) {
        this.statements = statements;
    }
    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }
}
exports.BlockStmt = BlockStmt;
class ExpressionStmt {
    constructor(expression) {
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}
exports.ExpressionStmt = ExpressionStmt;
class FunctionStmt {
    constructor(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitFunctionStmt(this);
    }
}
exports.FunctionStmt = FunctionStmt;
class IfStmt {
    constructor(condition, thenBranch, elseBranch) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
    accept(visitor) {
        return visitor.visitIfStmt(this);
    }
}
exports.IfStmt = IfStmt;
class PrintStmt {
    constructor(expression) {
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}
exports.PrintStmt = PrintStmt;
class ReturnStmt {
    constructor(keyword, value) {
        this.keyword = keyword;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitReturnStmt(this);
    }
}
exports.ReturnStmt = ReturnStmt;
class VarStmt {
    constructor(name, initializer) {
        this.name = name;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitVarStmt(this);
    }
}
exports.VarStmt = VarStmt;
class WhileStmt {
    constructor(condition, body) {
        this.condition = condition;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitWhileStmt(this);
    }
}
exports.WhileStmt = WhileStmt;
//# sourceMappingURL=Stmt.js.map