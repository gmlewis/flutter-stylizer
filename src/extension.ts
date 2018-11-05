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

    let disposable = vscode.commands.registerCommand('extension.flutterStylizer', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const classes = await getClasses(editor);
        console.log("Found " + classes.length.toString() + " classes.");
        if (classes.length === 0) {
            return;
        }

        vscode.window.showInformationMessage('Hello World!');
    });

    const getClasses = async (editor: vscode.TextEditor) => {
        let document = editor.document;
        let classes = new Array<DartClass>();
        const buf = document.getText();
        console.log('buf.length=', buf.length);
        while (true) {
            let mm = matchClassRE.exec(buf);
            // console.log('mm=', mm);
            if (!mm) { break; }
            let className = mm[1];
            console.log('className=' + className);
            let classOffset = buf.indexOf(mm[0]);
            console.log('classOffset=', classOffset);
            let openCurlyOffset = findOpenCurlyOffset(buf, classOffset);
            console.log('openCurlyOffset=', openCurlyOffset);
            if (openCurlyOffset <= classOffset) {
                console.log('expected "{" after "class" at offset ' + classOffset.toString());
                return classes;
            }
            let closeCurlyOffset = await findMatchingCurly(editor, openCurlyOffset);
            console.log('closeCurlyOffset=', closeCurlyOffset);
            if (closeCurlyOffset <= openCurlyOffset) {
                console.log('expected "}" after "{" at offset ' + openCurlyOffset.toString());
            }
            classes.push(new DartClass(classOffset, openCurlyOffset, closeCurlyOffset));
        }
        return classes;
    };

    const findOpenCurlyOffset = (buf: string, startOffset: number) => {
        const offset = buf.substring(startOffset).indexOf('{');
        return startOffset + offset;
    };

    const findMatchingCurly = async (editor: vscode.TextEditor, openCurlyOffset: number) => {
        // console.log('findMatchingCurly: openCurlyOffset=' + openCurlyOffset.toString());
        const position = editor.document.positionAt(openCurlyOffset);
        editor.selection = new vscode.Selection(position, position);
        // console.log('before moving cursor: offset=' + editor.document.offsetAt(editor.selection.active).toString());
        await vscode.commands.executeCommand('editor.action.jumpToBracket');
        const result = editor.document.offsetAt(editor.selection.active);
        // console.log('after moving cursor: offset=' + result.toString());
        return result;
    };

    context.subscriptions.push(disposable);
}

export function deactivate() {
}