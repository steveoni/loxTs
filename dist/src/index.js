"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lox_1 = __importDefault(require("./Lox"));
function main() {
    const args = process.argv.slice(2);
    const code = new Lox_1.default(args);
}
main();
//# sourceMappingURL=index.js.map