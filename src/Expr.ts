import { Token } from "./tokens";


export interface Expr {
  accept<R>(visitor: Visitor<R>): R
}

export interface Visitor<R> {
  visitAssignExpr ( expr: AssignExpr ): R
  visitBinaryExpr ( expr: BinaryExpr ): R
  visitCallExpr ( expr: CallExpr ): R
  visitGetExpr ( expr: GetExpr ): R
  visitGroupingExpr ( expr: GroupingExpr ): R
  visitLiteralExpr ( expr: LiteralExpr ): R
  visitLogicalExpr ( expr: LogicalExpr ): R
  visitUnaryExpr ( expr: UnaryExpr ): R
  visitSetExpr ( expr: SetExpr ): R
  visitThisExpr ( expr: ThisExpr ): R
  visitVariableExpr ( expr: VariableExpr ): R
  }

export class AssignExpr implements Expr {
  name: Token
  value: Expr
  constructor ( name: Token, value: Expr ) {
    this.name = name;
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitAssignExpr (this);
  }
}

export class BinaryExpr implements Expr {
  left: Expr
  operator: Token
  right: Expr
  constructor ( left: Expr, operator: Token, right: Expr ) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitBinaryExpr (this);
  }
}

export class CallExpr implements Expr {
  callee: Expr
  paren: Token
  argument: Expr[]
  constructor ( callee: Expr, paren: Token, argument: Expr[] ) {
    this.callee = callee;
    this.paren = paren;
    this.argument = argument;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitCallExpr (this);
  }
}

export class GetExpr implements Expr {
  obj: Expr
  name: Token
  constructor ( obj: Expr, name: Token ) {
    this.obj = obj;
    this.name = name;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitGetExpr (this);
  }
}

export class GroupingExpr implements Expr {
  expression: Expr
  constructor ( expression: Expr ) {
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitGroupingExpr (this);
  }
}

export class LiteralExpr implements Expr {
  value: string | number | boolean
  constructor ( value: string | number | boolean ) {
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitLiteralExpr (this);
  }
}

export class LogicalExpr implements Expr {
  left: Expr
  operator: Token
  right: Expr
  constructor ( left: Expr, operator: Token, right: Expr ) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitLogicalExpr (this);
  }
}

export class UnaryExpr implements Expr {
  operator: Token
  right: Expr
  constructor ( operator: Token, right: Expr ) {
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitUnaryExpr (this);
  }
}

export class SetExpr implements Expr {
  obj: Expr
  name: Token
  value: Expr
  constructor ( obj: Expr, name: Token, value: Expr ) {
    this.obj = obj;
    this.name = name;
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitSetExpr (this);
  }
}

export class ThisExpr implements Expr {
  keyword: Token
  constructor ( keyword: Token ) {
    this.keyword = keyword;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitThisExpr (this);
  }
}

export class VariableExpr implements Expr {
  name: Token
  constructor ( name: Token ) {
    this.name = name;
  }

  accept<R>(visitor: Visitor<R>): R{
    return visitor.visitVariableExpr (this);
  }
}

