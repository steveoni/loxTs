"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableExpr = exports.UnaryExpr = exports.LogicalExpr = exports.LiteralExpr = exports.GroupingExpr = exports.BinaryExpr = exports.AssignExpr = void 0;
class AssignExpr {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitAssignExpr(this);
    }
}
exports.AssignExpr = AssignExpr;
class BinaryExpr {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
exports.BinaryExpr = BinaryExpr;
class GroupingExpr {
    constructor(expression) {
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
exports.GroupingExpr = GroupingExpr;
class LiteralExpr {
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
exports.LiteralExpr = LiteralExpr;
class LogicalExpr {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
}
exports.LogicalExpr = LogicalExpr;
class UnaryExpr {
    constructor(operator, right) {
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}
exports.UnaryExpr = UnaryExpr;
class VariableExpr {
    constructor(name) {
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}
exports.VariableExpr = VariableExpr;
//# sourceMappingURL=Expr.js.map