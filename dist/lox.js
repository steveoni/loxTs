"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const readline_1 = require("readline");
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
            throw new Error(e);
        }
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
            if (line == "close")
                cli.close();
            try {
                this.run(line);
            }
            catch (e) {
                throw new Error(e);
            }
            cli.prompt();
        });
        cli.on("close", () => {
            process.exit(0);
        });
        cli.prompt();
    }
    run(source) {
        console.log(source);
    }
}
exports.default = Lox;
//# sourceMappingURL=lox.js.map