'use strict';
import * as vscode from 'vscode';

const commentRE = /^(.*?)\s*\/\/.*$/;

enum LineType {
    Unknown,
    BlankLine,
    SingleLineComment,
    MultiLineComment,
    MainConstructor,
    NamedConstructor,
    StaticVariable,
    InstanceVariable,
    OverrideMethod,
    OtherMethod,
    BuildMethod,
}

class DartLine {
    line: string;
    stripped: string;
    lineType: LineType;

    constructor(line: string) {
        this.line = line;
        let m = commentRE.exec(line);
        this.stripped = (m ? m[1] : this.line).trim();
        this.lineType = LineType.Unknown;
        if (this.stripped.length === 0) {
            this.lineType = (line.indexOf('//') >= 0) ?
                LineType.SingleLineComment : LineType.BlankLine;
            return;
        }
    }
}

class DartClass {
    editor: vscode.TextEditor;
    className: string;
    classOffset: number;
    openCurlyOffset: number;
    closeCurlyOffset: number;
    fullBuf: string;
    lines: Array<DartLine>;  // Line 0 is always the open curly brace.

    constructor(editor: vscode.TextEditor, className: string, classOffset: number, openCurlyOffset: number, closeCurlyOffset: number) {
        this.editor = editor;
        this.className = className;
        this.classOffset = classOffset;
        this.openCurlyOffset = openCurlyOffset;
        this.closeCurlyOffset = closeCurlyOffset;
        this.fullBuf = "";
        this.lines = [];
    }

    async findFeatures(buf: string) {
        this.fullBuf = buf;
        let lines = buf.split('\n');
        console.log("lines.length=" + lines.length);
        lines.forEach((line) => this.lines.push(new DartLine(line)));

        this.identifyMultiLineComments();
        await this.identifyMainConstructor();
        await this.identifyNamedConstructors();

        this.lines.forEach((line, index) => console.log('line #' + index.toString() + ' type=' + LineType[line.lineType] + ': ' + line.line));
    }

    private identifyMultiLineComments() {
        let inComment = false;
        for (let i = 1; i < this.lines.length; i++) {
            let line = this.lines[i];
            if (line.lineType !== LineType.Unknown) {
                continue;
            }
            if (inComment) {
                this.lines[i].lineType = LineType.MultiLineComment;
                // Note: a multiline comment followed by code on the same
                // line is not supported.
                let endComment = line.stripped.indexOf('*/');
                if (endComment >= 0) {
                    inComment = false;
                    if (line.stripped.lastIndexOf('/*') > endComment + 1) {
                        inComment = true;
                    }
                }
                continue;
            }
            let startComment = line.stripped.indexOf('/*');
            if (startComment >= 0) {
                inComment = true;
                this.lines[i].lineType = LineType.MultiLineComment;
                if (line.stripped.lastIndexOf('*/') > startComment + 1) {
                    inComment = false;
                }
            }
        }
    }

    private async identifyMainConstructor() {
        const className = this.className + '(';
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.lineType !== LineType.Unknown) {
                continue;
            }
            const offset = line.stripped.indexOf(className);
            if (offset >= 0) {
                if (offset > 0) {
                    const char = line.stripped.substring(offset - 1, offset);
                    if (char !== ' ' && char !== '\t') {
                        continue;
                    }
                }
                this.lines[i].lineType = LineType.MainConstructor;
                await this.markMethod(i, className, LineType.MainConstructor);
                break;
            }
        }
    }

    private async identifyNamedConstructors() {
        const className = this.className + '.';
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.lineType !== LineType.Unknown) {
                continue;
            }
            const offset = line.stripped.indexOf(className);
            if (offset >= 0) {
                if (offset > 0) {
                    const char = line.stripped.substring(offset - 1, offset);
                    if (char !== ' ' && char !== '\t') {
                        continue;
                    }
                }
                const openParenOffset = offset + line.stripped.substring(offset).indexOf('(');
                const namedConstructor = line.stripped.substring(offset, openParenOffset);
                console.log('namedContructor=', namedConstructor);
                this.lines[i].lineType = LineType.NamedConstructor;
                await this.markMethod(i, namedConstructor, LineType.NamedConstructor);
            }
        }
    }

    private async markMethod(lineNum: number, className: string, lineType: LineType) {
        // Identify all lines within the main (or factory) constructor.
        const lineOffset = this.fullBuf.indexOf(this.lines[lineNum].line);
        // console.log('lineOffset=', lineOffset, '+', this.openCurlyOffset, '=', lineOffset + this.openCurlyOffset);
        const inLineOffset = this.lines[lineNum].line.indexOf(className);
        const relOpenParenOffset = lineOffset + inLineOffset + className.length - 1;
        const absOpenParenOffset = this.openCurlyOffset + relOpenParenOffset;
        // console.log('inLineOffset=', inLineOffset, ', len=', className.length, ', paren=', absOpenParenOffset);
        const absCloseParenOffset = await findMatchingParen(this.editor, absOpenParenOffset);
        // console.log('absCloseParenOffset=', absCloseParenOffset);
        const relCloseParenOffset = absCloseParenOffset - this.openCurlyOffset;
        // console.log('relCloseParenOffset=', relCloseParenOffset, ', subtring=', this.fullBuf.substring(relCloseParenOffset));
        const curlyDeltaOffset = this.fullBuf.substring(relCloseParenOffset).indexOf('{');
        // console.log('curlyDeltaOffset=', curlyDeltaOffset);
        const absOpenCurlyOffset = absCloseParenOffset + curlyDeltaOffset;
        // console.log('absOpenCurlyOffset=', absOpenCurlyOffset);
        const absCloseCurlyOffset = await findMatchingParen(this.editor, absOpenCurlyOffset);
        // console.log('absCloseCurlyOffset=', absCloseCurlyOffset);
        const relCloseCurlyOffset = absCloseCurlyOffset - this.openCurlyOffset;
        const constructorBuf = this.fullBuf.substring(lineOffset, relCloseCurlyOffset + 1);
        // console.log('contructorBuf=', constructorBuf);
        const numLines = constructorBuf.split('\n').length;
        // console.log('numLines=', numLines);
        for (let i = 0; i < numLines; i++) {
            this.lines[lineNum + i].lineType = lineType;
        }

        // Preserve the comment lines leading up to the method.
        for (lineNum--; lineNum > 0; lineNum--) {
            if (this.lines[lineNum].lineType === LineType.SingleLineComment) {
                this.lines[lineNum].lineType = lineType;
                continue;
            }
            break;
        }
    }
}

const matchClassRE = /^class\s+(\S+)\s*.*$/mg;

const findMatchingParen = async (editor: vscode.TextEditor, openParenOffset: number) => {
    // console.log('findMatchingParen: openParenOffset=' + openParenOffset.toString());
    const position = editor.document.positionAt(openParenOffset);
    editor.selection = new vscode.Selection(position, position);
    // console.log('before moving cursor: offset=' + editor.document.offsetAt(editor.selection.active).toString());
    await vscode.commands.executeCommand('editor.action.jumpToBracket');
    const result = editor.document.offsetAt(editor.selection.active);
    // console.log('after moving cursor: offset=' + result.toString());
    return result;
};

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
            let closeCurlyOffset = await findMatchingParen(editor, openCurlyOffset);
            console.log('closeCurlyOffset=', closeCurlyOffset);
            if (closeCurlyOffset <= openCurlyOffset) {
                console.log('expected "}" after "{" at offset ' + openCurlyOffset.toString());
                return classes;
            }
            let dartClass = new DartClass(editor, className, classOffset, openCurlyOffset, closeCurlyOffset);
            await dartClass.findFeatures(buf.substring(openCurlyOffset, closeCurlyOffset));
            classes.push(dartClass);
        }
        return classes;
    };

    const findOpenCurlyOffset = (buf: string, startOffset: number) => {
        const offset = buf.substring(startOffset).indexOf('{');
        return startOffset + offset;
    };

    context.subscriptions.push(disposable);
}

export function deactivate() {
}