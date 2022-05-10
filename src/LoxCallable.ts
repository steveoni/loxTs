import Interpreter from "./Interpreter";

export default interface LoxCallable {
  call(interpreter: Interpreter, atguments: any[]): any;
  arity(): number;
}