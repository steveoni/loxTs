import * as Expr from './Expr';
import { TokenType, Token } from './tokens'
import RuntimeError from './RuntimeError'
import Lox from './lox';

export default class Interpreter implements Expr.Visitor<any> {

  public visitLiteralExpr(expr: Expr.LiteralExpr) {
    return expr.value
  }

  public visitGroupingExpr(expr: Expr.GroupingExpr) {
    return this.evaluate(expr)
  }

  private evaluate(expr: Expr.Expr) {
    return expr.accept(this)
  }
  public visitUnaryExpr(expr: Expr.UnaryExpr) {
    const right = this.evaluate(expr.right)

    switch (expr.operator.type) {
      case TokenType.Minus:
        this.checkNumberOperand(expr.operator, right)
        return - (right as number)
        break;
      case TokenType.Bang:
        return !this.isTruthy(right)
    }
  }

  private checkNumberOperand(operator: Token, operand: any) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number")
  }

  private isTruthy(obj: any) {
    if (obj == null) return false;
    if (typeof obj === "boolean") return obj as Boolean
    return true
  }

  public visitBinaryExpr(expr: Expr.BinaryExpr) {
    const left = this.evaluate(expr.left)
    const right = this.evaluate(expr.right)

    switch (expr.operator.type) {
      case TokenType.Minus:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) - (right as number)
      case TokenType.Slash:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) / (right as number)
      case TokenType.Star:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) * (right as number)
      case TokenType.Plus:
        if (typeof left === "number" && typeof right === "number") {
          return (left as number) + (right as number)
        }

        if (typeof left === "string" && typeof right === "string") {
          return (left as string) + (right as string)
        }

        throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.")
      case TokenType.Greater:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) > (right as number)
      case TokenType.GreaterEqual:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) >= (right as number)
      case TokenType.Less:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) < (right as number)
      case TokenType.LessEqual:
        this.checkNumberOperands(expr.operator, left, right)
        return (left as number) <= (right as number)
      case TokenType.BangEqual:
        return !this.isEqual(left, right)
      case TokenType.EqualEqual:
        return !this.isEqual(left, right)
    }
  }

  private checkNumberOperands(operator: Token, left: any, right: any) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "operands must be numbers")
  }

  private isEqual(a: any, b: any): boolean {
    if (a == null && b == null) return true;
    if (a == null) return false;

    return (a === b)
  }

  interpret(expression: Expr.Expr): void {
    try {
      const value = this.evaluate(expression)
      console.log(this.stringify(value))
    } catch (error) {
      Lox.runtimeError(error)
    }
  }

  stringify(obj: any) {
    if (obj === null) return "nil";

    if (typeof obj === "number") {
      let text = obj.toString()
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length - 2)
      }
      return text
    }
    return obj.toString()
  }

}