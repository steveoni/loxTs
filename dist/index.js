"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lox_1 = __importDefault(require("./lox"));
function main() {
    const args = process.argv.slice(2);
    const code = new lox_1.default(args);
}
main();
//# sourceMappingURL=index.js.map