"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const readline_1 = require("readline");
const scanner_1 = __importDefault(require("./scanner"));
const tokens_1 = require("./tokens");
const Parser_1 = __importDefault(require("./Parser"));
const Interpreter_1 = __importDefault(require("./Interpreter"));
class Lox {
    constructor(args) {
        if (args.length > 0) {
            this.runFile(args[0]);
        }
        else {
            this.runPrompt();
        }
    }
    runFile(path) {
        try {
            const source = (0, fs_1.readFileSync)(path).toString();
            this.run(source);
        }
        catch (e) {
            console.error(e);
        }
        if (Lox.hadError)
            process.exit(65);
        if (Lox.hadRuntimeError)
            process.exit(70);
    }
    runPrompt() {
        //REPL
        console.log('Welcome To LOX TS:');
        const cli = (0, readline_1.createInterface)({
            input: process.stdin,
            output: process.stdout
        });
        cli.on("line", (line) => {
            line = line.trim();
            if (line == "exit")
                cli.close();
            try {
                this.run(line);
                Lox.hadError = false;
            }
            catch (e) {
                console.error(e);
            }
            cli.prompt();
        });
        cli.on("close", () => {
            process.exit(0);
        });
        cli.prompt();
    }
    run(source) {
        const scanner = new scanner_1.default(source);
        const tokens = scanner.scanTokens();
        const parser = new Parser_1.default(tokens);
        const statements = parser.parse();
        if (Lox.hadError)
            return;
        console.log(statements[1]);
        Lox.interpreter.interpret(statements);
    }
    // static error(line: number, message: string): void {
    //   this.report(line, "", message)
    // }
    static report(line, where, message) {
        console.error(`[Line ${line} ] Error ${where} : ${message}`);
        Lox.hadError = true;
    }
    static error(token, message) {
        if (token instanceof tokens_1.Token) {
            if (token.type == tokens_1.TokenType.Eof) {
                this.report(token.line, " at end", message);
            }
            else {
                this.report(token.line, ` at '${token.lexeme}'`, message);
            }
        }
        else {
            this.report(token, "", message);
        }
    }
    static runtimeError(error) {
        console.error(`${error.message} + 
      \n[Line ${error.token.line}]`);
        Lox.hadRuntimeError = true;
    }
}
exports.default = Lox;
Lox.hadError = false;
Lox.hadRuntimeError = false;
Lox.interpreter = new Interpreter_1.default();
//# sourceMappingURL=Lox.js.map