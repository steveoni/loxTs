"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableExpr = exports.ThisExpr = exports.SetExpr = exports.UnaryExpr = exports.LogicalExpr = exports.LiteralExpr = exports.GroupingExpr = exports.GetExpr = exports.CallExpr = exports.BinaryExpr = exports.AssignExpr = void 0;
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
class CallExpr {
    constructor(callee, paren, argument) {
        this.callee = callee;
        this.paren = paren;
        this.argument = argument;
    }
    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
}
exports.CallExpr = CallExpr;
class GetExpr {
    constructor(obj, name) {
        this.obj = obj;
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitGetExpr(this);
    }
}
exports.GetExpr = GetExpr;
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
class SetExpr {
    constructor(obj, name, value) {
        this.obj = obj;
        this.name = name;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitSetExpr(this);
    }
}
exports.SetExpr = SetExpr;
class ThisExpr {
    constructor(keyword) {
        this.keyword = keyword;
    }
    accept(visitor) {
        return visitor.visitThisExpr(this);
    }
}
exports.ThisExpr = ThisExpr;
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