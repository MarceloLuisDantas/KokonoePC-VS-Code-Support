import * as vscode from 'vscode';

interface ParsedDocument {
    labels: Map<string, number>;
    defines: Map<string, number>;
}

function parseDocument(
    document: vscode.TextDocument
): ParsedDocument {
    const text = document.getText();

    const labels = new Map<string, number>();
    const defines = new Map<string, number>();

    const labelRegex =
        /([a-zA-Z_][a-zA-Z0-9_]*):/gm;

    const defineRegex =
        /^\s*\.define\s+([A-Z_][A-Z0-9_]*)\s+(\d+|\$[0-9A-Fa-f]+|b[01]+)\s*$/gm;

    let match: RegExpExecArray | null;

    while ((match = labelRegex.exec(text)) !== null) {
        labels.set(match[1], match.index);
    }

    while ((match = defineRegex.exec(text)) !== null) {
        defines.set(match[1], match.index);
    }

    return {
        labels,
        defines
    };
}

function updateDiagnostics(
    document: vscode.TextDocument,
    diagnostics: vscode.DiagnosticCollection
) {
    const text = document.getText();
    const errors: vscode.Diagnostic[] = [];

    const labelRegex =
        /([a-zA-Z_][a-zA-Z0-9_]*):/gm;

    const defineRegex =
        /^\s*\.define\s+([A-Z_][A-Z0-9_]*)\s+(\d+|\$[0-9A-Fa-f]+|b[01]+)\s*$/gm;

    const labels = new Map<string, number>();
    const defines = new Map<string, number>();

    let match: RegExpExecArray | null;

    //
    // Labels
    //
    while ((match = labelRegex.exec(text)) !== null) {
        const name = match[1];

        if (labels.has(name)) {
            const range = new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + name.length)
            );

            errors.push(
                new vscode.Diagnostic(
                    range,
                    `Duplicate label '${name}'`,
                    vscode.DiagnosticSeverity.Error
                )
            );
        }

        labels.set(name, match.index);
    }

    //
    // Defines
    //
    while ((match = defineRegex.exec(text)) !== null) {
        const name = match[1];

        const start =
            match.index +
            match[0].indexOf(name);

        const range = new vscode.Range(
            document.positionAt(start),
            document.positionAt(start + name.length)
        );

        if (defines.has(name)) {
            errors.push(
                new vscode.Diagnostic(
                    range,
                    `Duplicate define '${name}'`,
                    vscode.DiagnosticSeverity.Error
                )
            );
        }

        if (labels.has(name)) {
            errors.push(
                new vscode.Diagnostic(
                    range,
                    `Define '${name}' conflicts with label '${name}'`,
                    vscode.DiagnosticSeverity.Error
                )
            );
        }

        defines.set(name, start);
    }

    //
    // Label x Define
    //
    for (const [name, pos] of labels) {
        if (defines.has(name)) {
            const range = new vscode.Range(
                document.positionAt(pos),
                document.positionAt(pos + name.length)
            );

            errors.push(
                new vscode.Diagnostic(
                    range,
                    `Label '${name}' conflicts with define '${name}'`,
                    vscode.DiagnosticSeverity.Error
                )
            );
        }
    }

    //
    // Undefined jumps
    //
    const jumpRegex =
        /\b(jmp|jal|beq|bne|bge|blt)\s+\**([a-zA-Z_][a-zA-Z0-9_]*)/gm;

    while ((match = jumpRegex.exec(text)) !== null) {
        const target = match[2];

        if (
            !labels.has(target) &&
            !defines.has(target)
        ) {
            const start =
                match.index +
                match[0].lastIndexOf(target);

            const range = new vscode.Range(
                document.positionAt(start),
                document.positionAt(start + target.length)
            );

            errors.push(
                new vscode.Diagnostic(
                    range,
                    `Undefined symbol '${target}'`,
                    vscode.DiagnosticSeverity.Error
                )
            );
        }
    }

    diagnostics.set(document.uri, errors);
}

export function activate(
    context: vscode.ExtensionContext
) {
    const diagnostics =
        vscode.languages.createDiagnosticCollection(
            "kokonoepc"
        );

    context.subscriptions.push(diagnostics);

    //
    // Completion
    //
    const completionProvider =
        vscode.languages.registerCompletionItemProvider(
            "kokonoepc",
            {
                provideCompletionItems(document) {
                    const items: vscode.CompletionItem[] = [];

                    const opcodes = [
                        "nop", "write", "adc", "sub",
                        "mlt", "div", "inc", "dec",
                        "and", "or", "sll", "srl",
                        "rol", "ror", "cmp", "jmp",
                        "jr", "jal", "beq", "bne",
                        "bge", "blt", "push", "pop",
                        "clc", "cln", "clo",
                        "sec", "sen", "seo"
                    ];

                    for (const opcode of opcodes) {
                        items.push(
                            new vscode.CompletionItem(
                                opcode,
                                vscode.CompletionItemKind.Keyword
                            )
                        );
                    }

                    const directives = [
                        ".text",
                        ".data",
                        ".global",
                        ".string",
                        ".int8",
                        ".int16",
                        ".byte",
                        ".word",
                        ".define"
                    ];

                    for (const directive of directives) {
                        items.push(
                            new vscode.CompletionItem(
                                directive,
                                vscode.CompletionItemKind.Module
                            )
                        );
                    }

                    const parsed =
                        parseDocument(document);

                    for (const label of parsed.labels.keys()) {
                        items.push(
                            new vscode.CompletionItem(
                                label,
                                vscode.CompletionItemKind.Reference
                            )
                        );
                    }

                    for (const define of parsed.defines.keys()) {
                        items.push(
                            new vscode.CompletionItem(
                                define,
                                vscode.CompletionItemKind.Constant
                            )
                        );
                    }

                    return items;
                }
            }
        );

    context.subscriptions.push(completionProvider);

    //
    // Diagnostics
    //
    if (
        vscode.window.activeTextEditor &&
        vscode.window.activeTextEditor.document.languageId ===
        "kokonoepc"
    ) {
        updateDiagnostics(
            vscode.window.activeTextEditor.document,
            diagnostics
        );
    }

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(
            document => {
                if (
                    document.languageId ===
                    "kokonoepc"
                ) {
                    updateDiagnostics(
                        document,
                        diagnostics
                    );
                }
            }
        )
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(
            event => {
                if (
                    event.document.languageId ===
                    "kokonoepc"
                ) {
                    updateDiagnostics(
                        event.document,
                        diagnostics
                    );
                }
            }
        )
    );

    //
    // Go To Definition
    //
    const definitionProvider =
        vscode.languages.registerDefinitionProvider(
            "kokonoepc",
            {
                provideDefinition(
                    document,
                    position
                ) {
                    const range =
                        document.getWordRangeAtPosition(
                            position
                        );

                    if (!range) {
                        return null;
                    }

                    const word =
                        document.getText(range);

                    const parsed =
                        parseDocument(document);

                    if (parsed.labels.has(word)) {
                        return new vscode.Location(
                            document.uri,
                            document.positionAt(
                                parsed.labels.get(word)!
                            )
                        );
                    }

                    if (parsed.defines.has(word)) {
                        return new vscode.Location(
                            document.uri,
                            document.positionAt(
                                parsed.defines.get(word)!
                            )
                        );
                    }

                    return null;
                }
            }
        );

    context.subscriptions.push(
        definitionProvider
    );
}