"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider('kokonoepc', {
        provideCompletionItems() {
            const items = [];
            const opcodes = [
                ["nop", "does nothingdoes nothing for 1 cycle"],
                ["write", "writes X to Y"],
                ["adc", "adds with carry"],
                ["sub", "subtracts"],
                ["mlt", "multiplies"],
                ["div", "divides"],
                ["inc", "increments [reg/mem]"],
                ["dec", "decrements [reg/mem]"],
                ["and", "logic and"],
                ["or", "logic or"],
                ["sll", "shift left logic"],
                ["srl", "shift right logic"],
                ["rol", "rotate left"],
                ["ror", "rotate right"],
                ["cmp", "compares"],
                ["jmp", "jumps to addres"],
                ["jr", "jumps to addres in reg"],
                ["jal", "jump and link"],
                ["beq", "branch if equals"],
                ["bne", "branch if not equals"],
                ["bge", "branch on greater or equal"],
                ["blt", "branch on less than"],
                ["push", "pushes [reg/mem] onto the stack"],
                ["pop", "pops the value on top of stack"],
                ["clc", "clears the carry flag"],
                ["cln", "clears the negative flag"],
                ["clo", "clears the overflow flag"],
                ["sec", "sets the carry flag"],
                ["sen", "sets the negative flag"],
                ["seo", "sets the overflow flag"]
            ];
            for (const opcode of opcodes) {
                items.push(new vscode.CompletionItem(opcode[0], vscode.CompletionItemKind.Keyword));
            }
            const directives = [
                ".text", ".data", ".global",
                ".string", ".int8", ".int16",
                ".byte", ".word"
            ];
            for (const directive of directives) {
                items.push(new vscode.CompletionItem(directive, vscode.CompletionItemKind.Module));
            }
            return items;
        }
    });
    context.subscriptions.push(provider);
}
//# sourceMappingURL=extension.js.map