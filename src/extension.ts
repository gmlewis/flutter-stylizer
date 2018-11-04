'use strict';
import * as vscode from 'vscode';

class DartClass {
    classOffset: number;
    openCurlyOffset: number;
    closeCurlyOffset: number;
    constructor(classOffset: number, openCurlyOffset: number, closeCurlyOffset: number) {
        this.classOffset = classOffset;
        this.openCurlyOffset = openCurlyOffset;
        this.closeCurlyOffset = closeCurlyOffset;
    }
}

const matchClassRE = /^class\s+(\S+)\s*.*$/mg;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "flutter-stylizer" is now active!');

    let disposable = vscode.commands.registerCommand('extension.flutterStylizer', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const classes = getClasses(editor.document);
        console.log("Found " + classes.length.toString() + " classes.");
        if (classes.length === 0) {
            return;
        }

        vscode.window.showInformationMessage('Hello World!');
    });

    const getClasses = (document: vscode.TextDocument) => {
        let classes = new Array<DartClass>();
        const buf = document.getText();
        console.log('buf.length=', buf.length);
        while (true) {
            let mm = matchClassRE.exec(buf);
            console.log('mm=', mm);
            if (!mm) { break; }
            let className = mm[1];
            console.log('className=' + className);
            let classOffset = buf.indexOf(mm[0]);
            console.log('classOffset=' + classOffset.toString());
            let openCurlyOffset = findOpenCurlyOffset(buf, classOffset);
            console.log('openCurlyOffset=', openCurlyOffset);
            if (openCurlyOffset <= classOffset) {
                console.log('expected "{" after "class" at offset ' + classOffset.toString());
                return classes;
            }
            let closeCurlyOffset = findMatchingCurly(document, openCurlyOffset);
            if (closeCurlyOffset <= openCurlyOffset) {
                console.log('expected "}" after "{" at offset ' + openCurlyOffset.toString());
            }
        };
        return classes;
    };

    const findOpenCurlyOffset = (buf: string, startOffset: number) => {
        let offset = buf.substring(startOffset).indexOf('{');
        return startOffset + offset;
    };

    const findMatchingCurly = (document: vscode.TextDocument, openCurlyOffset: number) => {
        return 0;
    };

    context.subscriptions.push(disposable);
}

export function deactivate() {
}