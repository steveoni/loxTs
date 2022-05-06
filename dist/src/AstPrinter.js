// import * as Expr from './Expr';
// export default class AstPrinter implements Expr.Visitor<string> {
//   print(expr: Expr.Expr): string {
//     return expr.accept(this)
//   }
//   visitBinaryExpr(expr: Expr.BinaryExpr): string {
//     return this.parenthesize(expr.operator.lexeme, expr.left, expr.right)
//   }
//   visitGroupingExpr(expr: Expr.GroupingExpr): string {
//     return this.parenthesize("group", expr.expression)
//   }
//   visitLiteralExpr(expr: Expr.LiteralExpr): string {
//     if (expr.value == null) return "nil";
//     return expr.value.toString()
//   }
//   visitUnaryExpr(expr: Expr.UnaryExpr): string {
//     return this.parenthesize(expr.operator.lexeme, expr.right)
//   }
//   private parenthesize(name: string, ...exprs: Expr.Expr[]): string {
//     const builder = []
//     builder.push("(")
//     builder.push(name)
//     for (const expr of exprs) {
//       builder.push(" ")
//       builder.push(expr.accept(this))
//     }
//     builder.push(")");
//     return builder.join("")
//   }
// }
//# sourceMappingURL=AstPrinter.js.map