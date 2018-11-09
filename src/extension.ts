'use strict';
import * as vscode from 'vscode';

const commentRE = /^(.*?)\s*\/\/.*$/;

enum EntityType {
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
    startOffset: number;
    endOffset: number;
    entityType: EntityType = EntityType.Unknown;

    constructor(line: string, startOffset: number) {
        this.line = line;
        this.startOffset = startOffset;
        this.endOffset = startOffset + line.length - 1;
        let m = commentRE.exec(line);
        this.stripped = (m ? m[1] : this.line).trim();
        if (this.stripped.length === 0) {
            this.entityType = (line.indexOf('//') >= 0) ?
                EntityType.SingleLineComment : EntityType.BlankLine;
        }
    }
}

// DartEntity represents a single, independent feature of a DartClass.
class DartEntity {
    entityType: EntityType = EntityType.Unknown;
    lines: Array<DartLine> = [];
    name: string = "";  // Used for sorting, but could be "".
}

class DartClass {
    editor: vscode.TextEditor;
    className: string;
    classOffset: number;
    openCurlyOffset: number;
    closeCurlyOffset: number;
    fullBuf: string = "";
    lines: Array<DartLine> = [];  // Line 0 is always the open curly brace.
    theConstructor: DartEntity | undefined = undefined;
    namedConstructors: Array<DartEntity> = [];
    staticVariables: Array<DartEntity> = [];
    instanceVariables: Array<DartEntity> = [];
    overrideMethods: Array<DartEntity> = [];
    otherMethods: Array<DartEntity> = [];
    buildMethod: DartEntity | undefined = undefined;

    constructor(editor: vscode.TextEditor, className: string, classOffset: number, openCurlyOffset: number, closeCurlyOffset: number) {
        this.editor = editor;
        this.className = className;
        this.classOffset = classOffset;
        this.openCurlyOffset = openCurlyOffset;
        this.closeCurlyOffset = closeCurlyOffset;
    }

    async findFeatures(buf: string) {
        this.fullBuf = buf;
        let lines = buf.split('\n');
        console.log("lines.length=" + lines.length);
        let lineOffset = 0;
        lines.forEach((line) => {
            this.lines.push(new DartLine(line, lineOffset));
            lineOffset += line.length;
        });

        this.identifyMultiLineComments();
        await this.identifyMainConstructor();
        await this.identifyNamedConstructors();
        await this.identifyOverrideMethods();
        await this.identifyOtherMethods();
        await this.identifyStaticVariables();
        await this.identifyInstanceVariables();

        this.lines.forEach((line, index) => console.log('line #' + index.toString() + ' type=' + EntityType[line.entityType] + ': ' + line.line));
    }

    private identifyMultiLineComments() {
        let inComment = false;
        for (let i = 1; i < this.lines.length; i++) {
            let line = this.lines[i];
            if (line.entityType !== EntityType.Unknown) {
                continue;
            }
            if (inComment) {
                this.lines[i].entityType = EntityType.MultiLineComment;
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
                this.lines[i].entityType = EntityType.MultiLineComment;
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
            if (line.entityType !== EntityType.Unknown) {
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
                this.lines[i].entityType = EntityType.MainConstructor;
                this.theConstructor = await this.markMethod(i, className, EntityType.MainConstructor);
                break;
            }
        }
    }

    private async identifyNamedConstructors() {
        const className = this.className + '.';
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.entityType !== EntityType.Unknown) {
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
                // console.log('namedContructor=', namedConstructor);
                this.lines[i].entityType = EntityType.NamedConstructor;
                let entity = await this.markMethod(i, namedConstructor, EntityType.NamedConstructor);
                this.namedConstructors.push(entity);
            }
        }
    }

    private async identifyOverrideMethods() {
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.entityType !== EntityType.Unknown) {
                continue;
            }

            if (line.stripped.startsWith('@override') && i < this.lines.length - 1) {
                const offset = this.lines[i + 1].stripped.indexOf('(');
                if (offset >= 0) {
                    const ss = this.lines[i + 1].stripped.substring(0, offset);
                    const nameOffset = ss.lastIndexOf(' ') + 1;
                    const name = ss.substring(nameOffset);
                    const entityType = (name === 'build') ? EntityType.BuildMethod : EntityType.OverrideMethod;
                    this.lines[i].entityType = entityType;
                    let entity = await this.markMethod(i + 1, name, entityType);
                    entity.lines.unshift(this.lines[i]);
                    if (name === 'build') {
                        this.buildMethod = entity;
                    } else {
                        this.overrideMethods.push(entity);
                    }
                }
            }
        }
    }

    private async identifyOtherMethods() {
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.entityType !== EntityType.Unknown) {
                continue;
            }

            let entity = await this.scanMethod(i);
            console.log('identifyOtherMethods: entity=', entity);
            if (entity.entityType === EntityType.Unknown) {
                continue;
            }

            // TODO: Parameters can span multiple lines.
            const offset1 = line.stripped.indexOf(' = (');
            const offset2 = line.stripped.indexOf(') => {');  // TODO: curly brace unnecessary for valid method.
            const offset3 = line.stripped.indexOf(') {');
            if (offset1 >= 0 && (offset2 > offset1 || offset3 > offset1)) {
                this.lines[i].entityType = EntityType.OtherMethod;
                const ss = line.stripped.substring(0, offset1);
                const nameOffset = ss.lastIndexOf(' ') + 1;
                const name = ss.substring(nameOffset);
                let entity = await this.markMethod(i, name, EntityType.OtherMethod);
                this.otherMethods.push(entity);
                continue;
            }

            const offset = line.stripped.indexOf('(');
            if (offset >= 0 && (offset2 > offset1 || offset3 > offset1)) {
                const ss = line.stripped.substring(0, offset);
                const nameOffset = ss.lastIndexOf(' ') + 1;
                const name = ss.substring(nameOffset);
                let entity = await this.markMethod(i, name, EntityType.OtherMethod);
                this.otherMethods.push(entity);
            }
        }
    }

    private async identifyStaticVariables() {
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.entityType !== EntityType.Unknown) {
                continue;
            }

            if (line.stripped.startsWith('static ')) {  // could have static (class) methods.
                let entity = this.findSemicolon(i, EntityType.StaticVariable);
                this.staticVariables.push(entity);
            }
        }
    }

    private async identifyInstanceVariables() {
        for (let i = 1; i < this.lines.length; i++) {
            const line = this.lines[i];
            if (line.entityType !== EntityType.Unknown) {
                continue;
            }
            let entity = this.findSemicolon(i, EntityType.InstanceVariable); // Need to skip parens.
            this.instanceVariables.push(entity);
        }
    }

    private async scanMethod(lineNum: number): Promise<DartEntity> {
        let entity = new DartEntity;
        // entity.lines = [this.lines[lineNum]];
        // let numLines = 0;
        // while (numLines + lineNum < this.lines.length && this.lines[numLines + lineNum].stripped.indexOf(';') < 0) {
        //     numLines++;
        //     entity.lines.push(this.lines[numLines + lineNum]);
        // }

        let sequence = new Array<string>();

        while (true) {
            console.log('entity.lines=', entity.lines);
            const result = DartClass.findFirstOf(['(', '[', '{', '=>', '= '], entity);
            const firstOpenerOffset = result[0];
            const firstOpener = result[1];
            if (firstOpenerOffset < 0) {
                break;
            }
            sequence.push(firstOpener);

            if (firstOpener === '(' || firstOpener === '[' || firstOpener === '{') {
                console.log('line=', this.lines[lineNum].line);
                const lineOffset = this.fullBuf.indexOf(this.lines[lineNum].line);
                // const firstOpener = this.fullBuf[firstOpenerOffset + lineOffset];
                // console.log('firstOpener=', firstOpener);
                const firstCloserOffset = await findMatchingParen(this.editor, this.openCurlyOffset + firstOpenerOffset + lineOffset);
                console.log('lineOffset=', lineOffset, ', firstOpenerOffset=', firstOpenerOffset, ', openBracket=', firstOpenerOffset + lineOffset, 'firstCloserOffset=', firstCloserOffset);
            }
        }

        // let firstEquals = DartClass.findFirstOf(['='], entity);
        // let firstOpenCurly = DartClass.findFirstOf(['{'], entity);
        // console.log('firstEquals=', firstEquals, ', firstOpenerOffset=', firstOpenerOffset, ', firstOpenCurly=', firstOpenCurly);
        return entity;
    }

    private static findFirstOf(syms: Array<string>, entity: DartEntity): [number, string] {
        let soFar = 0;
        for (let i = 0; i < entity.lines.length; i++) {
            let pos: number | undefined = undefined;
            let result = "";
            for (let j = 0; j < syms.length; j++) {
                let p = entity.lines[i].line.indexOf(syms[j]);
                if (pos === undefined || (p >= 0 && p < pos)) {
                    pos = p;
                    result = syms[j];
                }
            }
            if (pos !== undefined && pos >= 0) {
                return [soFar + pos, result];
            }
            soFar += entity.lines[i].line.length;
        }
        return [-1, ""];
    }

    private async markMethod(lineNum: number, methodName: string, entityType: EntityType): Promise<DartEntity> {
        let entity = new DartEntity;
        entity.entityType = entityType;
        entity.lines = [];
        entity.name = methodName;

        // Identify all lines within the main (or factory) constructor.
        const lineOffset = this.fullBuf.indexOf(this.lines[lineNum].line);
        // console.log('lineOffset=', lineOffset, '+', this.openCurlyOffset, '=', lineOffset + this.openCurlyOffset);
        const inLineOffset = this.lines[lineNum].line.indexOf(methodName);
        const relOpenParenOffset = lineOffset + inLineOffset + methodName.length - 1;
        const absOpenParenOffset = this.openCurlyOffset + relOpenParenOffset;
        // console.log('inLineOffset=', inLineOffset, ', len=', methodName.length, ', paren=', absOpenParenOffset);
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
            this.lines[lineNum + i].entityType = entityType;
            entity.lines.push(this.lines[lineNum + i]);
        }

        // Preserve the comment lines leading up to the method.
        for (lineNum--; lineNum > 0; lineNum--) {
            if (this.lines[lineNum].entityType === EntityType.SingleLineComment) {
                this.lines[lineNum].entityType = entityType;
                entity.lines.unshift(this.lines[lineNum]);
                continue;
            }
            break;
        }
        return entity;
    }

    private findSemicolon(lineNum: number, entityType: EntityType): DartEntity {
        let entity = new DartEntity;
        entity.entityType = entityType;
        entity.lines = [];

        for (let i = 0; i + lineNum < this.lines.length; i++) {
            this.lines[i + lineNum].entityType = entityType;
            entity.lines.push(this.lines[i + lineNum]);
            if (this.lines[i + lineNum].stripped.indexOf(';') >= 0) {
                break;
            }
        }

        // Preserve the comment lines leading up to the entity.
        for (lineNum--; lineNum > 0; lineNum--) {
            if (this.lines[lineNum].entityType === EntityType.SingleLineComment) {
                this.lines[lineNum].entityType = entityType;
                entity.lines.unshift(this.lines[lineNum]);
                continue;
            }
            break;
        }
        return entity;
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