//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';

import * as vscode from 'vscode';
import * as stylizer from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {

    const newDoc = async () => {
        let doc = await vscode.workspace.openTextDocument({ language: 'dart' });
        await vscode.window.showTextDocument(doc);
        return doc;
    };

    const newEditor = async (doc: vscode.TextDocument, source: string) => {
        const editor = vscode.window.activeTextEditor;
        await editor!.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(doc.positionAt(0), source);
        });
        assert.notEqual(editor, null);
        return editor!;
    };

    test("Classes are found", async function() {
        var source = `// test.dart
class myClass extends Widget {

}`;
        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 3);
    });
});