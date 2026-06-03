import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerCompletionItemProvider(
        'kokonoepc', {
        provideCompletionItems() {
            const items: vscode.CompletionItem[] = [];

            const opcodes: [string, string][] = [
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
                items.push(
                    new vscode.CompletionItem(
                        opcode[0],
                        vscode.CompletionItemKind.Keyword
                    )
                );
            }

            const directives = [
                ".text", ".data", ".global",
                ".string", ".int8", ".int16",
                ".byte", ".word"
            ];

            for (const directive of directives) {
                items.push(
                    new vscode.CompletionItem(
                        directive,
                        vscode.CompletionItemKind.Module
                    )
                );
            }

            return items;
        }
    }
    );
    context.subscriptions.push(provider);
}