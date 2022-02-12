import { Token } from "./tokens";


export interface Expr {
  accept<R>(visitor: Visitor<R>): R
}

export interface Visitor<R> {
  visitBinaryExpr ( expr: BinaryExpr ): R
  visitGroupingExpr ( expr: GroupingExpr ): R
  visitLiteralExpr ( expr: LiteralExpr ): R
  visitUnaryExpr ( expr: UnaryExpr ): R
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

