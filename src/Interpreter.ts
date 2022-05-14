import * as Expr from './Expr';
import { TokenType, Token } from './Tokens'
import RuntimeError from './RuntimeError'
import Lox from './Lox';
import * as Stmt from './Stmt'
import Environment from './Environment'
import LoxCallable from './LoxCallable';
import LoxFunction from './LoxFunction';
import Return from './Return';
import LoxClass from './LoxClass';
import LoxInstance from './LoxInstance';

export default class Interpreter implements Expr.Visitor<any>, Stmt.Visitor<void> {
  readonly globals = new Environment()
  private environment = new Environment()
  private readonly locals = new Map<Expr.Expr, number>()

  constructor() {
    this.environment = this.globals
    this.globals.define("clock",{

      arity(): number {
        return 0;
      },

      call(interpreter: Interpreter, argument: any[]): any {
        const date = new Date()
        return date.getMilliseconds() / 1000.0
      },

      toString(): string {
        return "<native fn>"
      }
    } as LoxCallable)
  }

  public visitLiteralExpr(expr: Expr.LiteralExpr) {
    return expr.value
  }

  public visitLogicalExpr(expr: Expr.LogicalExpr) {
    const left: any = this.evaluate(expr.left)

    if (expr.operator.type === TokenType.Or) {
      if (this.isTruthy(left)) return left;
    }
    else {
      if (!this.isTruthy(left)) return left
    }
    return this.evaluate(expr.right)
  }

  public visitSetExpr(expr: Expr.SetExpr) {
    let obj = this.evaluate(expr.obj)
    if (!(obj instanceof LoxInstance)) {
      throw new RuntimeError(expr.name,
        "Only instances have fields.")
    }

    const value = this.evaluate(expr.value)
    obj = obj as LoxInstance
    obj.set(expr.name, value)
    return value;
  }

  public visitGroupingExpr(expr: Expr.GroupingExpr) {
    return this.evaluate(expr)
  }

  private evaluate(expr: Expr.Expr) {
    return expr.accept(this)
  }

  private execute(stmt: Stmt.Stmt) {
    stmt.accept(this)
  }

  public resolve(expr: Expr.Expr, depth: number) {
    this.locals.set(expr, depth);
  }

  executeBlock(statements: Stmt.Stmt[], environment: Environment ) {
    const previous = this.environment;

    try {
      this.environment = environment

      for (const statement of statements) {
        this.execute(statement)
      }

    } finally {
      this.environment = previous
    }
  }

  public visitBlockStmt(stmt: Stmt.BlockStmt) {
    this.executeBlock(stmt.statements, new Environment(this.environment))
    return null;
  }

  public visitClassStmt(stmt: Stmt.ClassStmt) {
    this.environment.define(stmt.name.lexeme, null)
    const klass = new LoxClass(stmt.name.lexeme)
    this.environment.assign(stmt.name, klass)
    return null;
  }

  public visitExpressionStmt(stmt: Stmt.ExpressionStmt) {
    this.evaluate(stmt.expression)
    return null
  }

  public visitFunctionStmt(stmt: Stmt.FunctionStmt) {
    const func = new LoxFunction(stmt, this.environment)
    this.environment.define(stmt.name.lexeme, func)
    return null;
  }

  public visitIfStmt(stmt: Stmt.IfStmt) {
    const cond = this.evaluate(stmt.condition)
    if (this.isTruthy(cond)) {
      this.execute(stmt.thenBranch)
    } 
    else if (stmt.elseBranch != null) {
      this.execute(stmt.elseBranch)
    }
    return null;
  }

  public visitPrintStmt(stmt: Stmt.PrintStmt) {
    const value = this.evaluate(stmt.expression)
    console.log(this.stringify(value))
    return null
  }

  public visitReturnStmt(stmt: Stmt.ReturnStmt) {
    let value:any = null;
    if (stmt.value !=null) value = this.evaluate(stmt.value)

    throw new Return(value)
  }

  public visitVarStmt(stmt: Stmt.VarStmt) {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer)
    }

    this.environment.define(stmt.name.lexeme, value)
    return null;
  }

  public visitWhileStmt(stmt: Stmt.WhileStmt) {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body)
    }
    return null;
  }

  public visitAssignExpr(expr: Expr.AssignExpr): any{
    const value = this.evaluate(expr.value)
    const distance = this.locals.get(expr)
    if (distance !== null) {
      this.environment.assignAt(distance, expr.name, value)
    } else {
      this.globals.assign(expr.name, value)
    }
    return value;
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

  public visitVariableExpr(expr: Expr.VariableExpr) {
    return this.lookUpVariable(expr.name, expr)
  }

  private lookUpVariable(name: Token, expr: Expr.Expr) {
    const distance: number = this.locals.get(expr)
    if (distance != null) {
      return this.environment.getAt(distance, name.lexeme)
    } else {
      return this.globals.get(name)
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
        return this.isEqual(left, right)
    }
  }

  public visitCallExpr(expr: Expr.CallExpr) {
    const callee = this.evaluate(expr.callee)
    const argumentss: any[] = []
    for (const argument of expr.argument) {
      argumentss.push(this.evaluate(argument))
    }

    if (!("call" in callee)) {
      throw new RuntimeError(expr.paren,
        "Can only call functions and classes.")
    }

    const func = callee as LoxCallable
    if (argumentss.length != func.arity()) {
      throw new RuntimeError(expr.paren, 
        `Expected ${func.arity()} arguments but got ${argumentss.length}`)
    }
    return func.call(this, argumentss)
  }


  public visitGetExpr(expr: Expr.GetExpr): any {
    const obj = this.evaluate(expr.obj)
    if (obj instanceof LoxInstance) {
      return (obj as LoxInstance).get(expr.name)
    }

    throw new RuntimeError(expr.name,
      "Only instances have properties.");
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

  interpret(statements: Stmt.Stmt[]): void {
    try {
      for (let i = 0; i < statements.length; i++) {
        this.execute(statements[i])
      }
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