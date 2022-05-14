import * as Expr from "./Expr";
import Interpreter from "./Interpreter";
import Lox from "./Lox";
import * as Stmt from "./Stmt";
import { Token } from "./Tokens";
import { poly } from "./pollyfill";

poly();

enum FunctionType {
  None,
  FUNC,
  METHOD,
  INITIALIZER
}

enum ClassType {
  NONE,
  CLASS
}

export default class Resolver implements Expr.Visitor<void>, Stmt.Visitor<void> {
  private readonly interpreter: Interpreter
  private readonly scopes: Array<Map<string, boolean>> = []
  private currentFunction: FunctionType = FunctionType.None
  private currentClass = ClassType.NONE
  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter
  }

  public visitBlockStmt(stmt: Stmt.BlockStmt) {
    this.beginScope()
    this.resolve(stmt.statements)
    this.endScope()
  }

  public visitClassStmt(stmt: Stmt.ClassStmt) {
    const enclosingClass = this.currentClass
    this.currentClass = ClassType.CLASS
    this.declare(stmt.name)
    this.define(stmt.name);
    this.beginScope();
    this.scopes.at(-1).set("this", true)

    for (const method of stmt.methods) {
      let declaration = FunctionType.METHOD
      if (method.name.lexeme === "init") {
        declaration = FunctionType.INITIALIZER
      }
      this.resolveFunction(method, declaration)
    }
    this.endScope()
    this.currentClass = enclosingClass
    return null;
  }

  public resolve (statements: Stmt.Stmt[]) { 
    if (statements) {
      for (let statement of statements) {
        this.resolveStmt(statement)
      }
    }
  }

  public resolveStmt(stmt: Stmt.Stmt) {
    stmt.accept(this)
  }

  public resolveExpr(expr: Expr.Expr) {
    expr.accept(this)
  }

  private beginScope() {
    this.scopes.push(new Map<string, boolean>())
  }

  private endScope() {
    this.scopes.pop()
  }

  public visitVarStmt (stmt: Stmt.VarStmt) {
    this.declare(stmt.name)
    if (stmt.initializer != null) {
      this.resolveExpr(stmt.initializer)
    }
    this.define(stmt.name)
    return null;
  }

  private declare(name: Token) {
    if (this.scopes.length === 0) return;
    const scope: Map<string, boolean> = this.scopes.at(-1)
    if (scope.has(name.lexeme)) {
      Lox.error(name,
        "Already a variable with this name in this scope");
    }
    scope.set(name.lexeme, false)
  }

  private define(name: Token) {
    if (this.scopes.length === 0) return;
    this.scopes.at(-1).set(name.lexeme, true);
  }

  public visitVariableExpr(expr: Expr.VariableExpr) {
    if (this.scopes.length > 0 && 
        this.scopes.at(-1).get(expr.name.lexeme) === false) {
          Lox.error(expr.name,
            "Can't read local variable in its own initializer.")
    }
    this.resolveLocal(expr, expr.name)
    return null;
  }

  private resolveLocal(expr: Expr.Expr, name: Token) {
    for (let i = this.scopes.length -1; i >=0; i--) {
      if (this.scopes[i].has(name.lexeme) ) {
        this.interpreter.resolve(expr, this.scopes.length -1 -i)
        return;
      }
    }
  }

  public visitAssignExpr(expr: Expr.AssignExpr) {
    this.resolveExpr(expr.value)
    this.resolveLocal(expr, expr.name)
    return null;
  }

  public visitFunctionStmt(stmt: Stmt.FunctionStmt) {
    this.declare(stmt.name)
    this.define(stmt.name)
    this.resolveFunction(stmt, FunctionType.FUNC)
    return null;
  }

  private resolveFunction(func: Stmt.FunctionStmt, funcType: FunctionType) {
    const enclosingFunction = this.currentFunction
    this.currentFunction = funcType
    this.beginScope();
    for (let param of func.params) {
      this.declare(param)
      this.define(param)
    }
    this.resolve(func.body)
    this.endScope()
    this.currentFunction = enclosingFunction
  }

  public visitExpressionStmt(stmt: Stmt.ExpressionStmt) {
    this.resolveExpr(stmt.expression)
    return null;
  }

  public visitIfStmt(stmt: Stmt.IfStmt) {
    this.resolveExpr(stmt.condition)
    this.resolveStmt(stmt.thenBranch)
    if (stmt.elseBranch != null) this.resolveStmt(stmt.elseBranch)
    return null;
  }

  public visitPrintStmt(stmt: Stmt.PrintStmt) {
    this.resolveExpr(stmt.expression)
    return null;
  }

  public visitReturnStmt(stmt: Stmt.ReturnStmt) {
    if (this.currentFunction === FunctionType.None) {
      Lox.error(stmt.keyword, "Can't return from top-level code");
    }
    if (stmt.value != null) {
      if (this.currentFunction === FunctionType.INITIALIZER) {
        Lox.error(stmt.keyword,
          "Can't return a value from an initializer.");
      }
      this.resolveExpr(stmt.value)
    }
    return null;
  }

  public visitWhileStmt(stmt: Stmt.WhileStmt) {
    this.resolveExpr(stmt.condition)
    this.resolveStmt(stmt.body)
    return null;
  }

  public visitBinaryExpr(expr: Expr.BinaryExpr) {
    this.resolveExpr(expr.left)
    this.resolveExpr(expr.right)
    return null;
  }

  public visitCallExpr(expr: Expr.CallExpr) {
    this.resolveExpr(expr.callee)
    for (const argument of expr.argument) {
      this.resolveExpr(argument)
    }
    return null;
  }

  public visitGetExpr(expr: Expr.GetExpr) {
    this.resolveExpr(expr.obj)
    return null;
  }

  public visitGroupingExpr(expr: Expr.GroupingExpr) {
    this.resolveExpr(expr.expression)
    return null;
  }

  public visitLiteralExpr(expr: Expr.LiteralExpr) {
    return null;
  }

  public visitLogicalExpr(expr: Expr.LogicalExpr) {
    this.resolveExpr(expr.left)
    this.resolveExpr(expr.right)
    return null;
  }

  public visitSetExpr(expr: Expr.SetExpr) {
    this.resolveExpr(expr.value)
    this.resolveExpr(expr.obj)
    return null;
  }

  public visitThisExpr(expr: Expr.ThisExpr) {
    if (this.currentClass === ClassType.NONE) {
      Lox.error(expr.keyword,
        "Can't use 'this' outside of a class.")
      return null;
    }
    this.resolveLocal(expr, expr.keyword)
    return null;
  }

  public visitUnaryExpr(expr: Expr.UnaryExpr) {
    this.resolveExpr(expr.right)
    return null;
  }


}