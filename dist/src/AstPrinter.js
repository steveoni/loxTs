"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AstPrinter {
    print(expr) {
        return expr.accept(this);
    }
    visitBinaryExpr(expr) {
        console.log("Binary here");
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }
    visitGroupingExpr(expr) {
        return this.parenthesize("group", expr.expression);
    }
    visitLiteralExpr(expr) {
        if (expr.value == null)
            return "nil";
        return expr.value.toString();
    }
    visitUnaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }
    parenthesize(name, ...exprs) {
        const builder = [];
        builder.push("(");
        for (const expr of exprs) {
            builder.push(" ");
            builder.push(expr.accept(this));
        }
        builder.push(name);
        builder.push(")");
        return builder.join("");
    }
}
exports.default = AstPrinter;
//# sourceMappingURL=AstPrinter.js.map