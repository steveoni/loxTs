"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AstPrinter_1 = __importDefault(require("./AstPrinter"));
const Expr = __importStar(require("./Expr"));
const tokens_1 = require("./tokens");
function main() {
    // const args = process.argv.slice(2)
    // const code = new Lox(args)
    const expression = new Expr.BinaryExpr(new Expr.UnaryExpr(new tokens_1.Token(tokens_1.TokenType.Minus, "-", null, 1), new Expr.LiteralExpr(123)), new tokens_1.Token(tokens_1.TokenType.Star, '*', null, 1), new Expr.GroupingExpr(new Expr.LiteralExpr(45.67)));
    const expres = new Expr.BinaryExpr(new Expr.BinaryExpr(new Expr.LiteralExpr(1), new tokens_1.Token(tokens_1.TokenType.Plus, "+", null, 1), new Expr.LiteralExpr(2)), new tokens_1.Token(tokens_1.TokenType.Star, "*", null, 1), new Expr.BinaryExpr(new Expr.LiteralExpr(4), new tokens_1.Token(tokens_1.TokenType.Minus, "-", null, 1), new Expr.LiteralExpr(3)));
    console.log(new AstPrinter_1.default().print(expres));
}
main();
//# sourceMappingURL=index.js.map