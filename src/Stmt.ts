import { Token } from "./tokens";
import { Expr } from "./Expr";


export interface Stmt {
  accept<R>(visitor: Visitor<R>): R
}

export interface Visitor<R> {
  visitBlockStmt ( expr: BlockStmt ): R
  visitExpressionStmt ( expr: ExpressionStmt ): R
  visitIfStmt ( expr: IfStmt ): R
  visitPrintStmt ( expr: PrintStmt ): R
  visitVarStmt ( expr: VarStmt ): R
  visitWhileStmt ( expr: WhileStmt ): R
  }

export class BlockStmt implements Stmt {
  statements: Stmt[]
  constructor ( statements: Stmt[] ) {
    this.statements = statements;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitBlockStmt (this);
  }
}

export class ExpressionStmt implements Stmt {
  expression: Expr
  constructor ( expression: Expr ) {
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitExpressionStmt (this);
  }
}

export class IfStmt implements Stmt {
  condition: Expr
  thenBranch: Stmt
  elseBranch: Stmt
  constructor ( condition: Expr, thenBranch: Stmt, elseBranch: Stmt ) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitIfStmt (this);
  }
}

export class PrintStmt implements Stmt {
  expression: Expr 
  constructor ( expression: Expr  ) {
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitPrintStmt (this);
  }
}

export class VarStmt implements Stmt {
  name: Token
  initializer: Expr
  constructor ( name: Token, initializer: Expr ) {
    this.name = name;
    this.initializer = initializer;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitVarStmt (this);
  }
}

export class WhileStmt implements Stmt {
  condition: Expr
  body: Stmt
  constructor ( condition: Expr, body: Stmt ) {
    this.condition = condition;
    this.body = body;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitWhileStmt (this);
  }
}

