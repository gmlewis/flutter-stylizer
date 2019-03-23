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

    test("Classes are found", async () => {
        var source = `// test.dart
class myClass extends Widget {

}`;
        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 3);
    });

    test("Named constructors are kept intact", async () => {
        var source = `class AnimationController extends Animation<double>
with AnimationEagerListenerMixin, AnimationLocalListenersMixin, AnimationLocalStatusListenersMixin {
    AnimationController.unbounded({
    double value = 0.0,
    this.duration,
    this.debugLabel,
    @required TickerProvider vsync,
    this.animationBehavior = AnimationBehavior.preserve,
    }) : assert(value != null),
        assert(vsync != null),
        lowerBound = double.negativeInfinity,
        upperBound = double.infinity,
        _direction = _AnimationDirection.forward {
    _ticker = vsync.createTicker(_tick);
    _internalSetValue(value);
    }
}`;
        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 16);

        let want = [
            stylizer.EntityType.Unknown,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.BlankLine,
        ];

        for (let i = 0; i < got[0].lines.length; i++) {
            let line = got[0].lines[i];
            assert.equal(
                stylizer.EntityType[line.entityType],
                stylizer.EntityType[want[i]],
                'line #' + i.toString() + ': ' + line.line);
        }
    });

    test("Private constructors are kept intact", async () => {
        var source = `class _InterpolationSimulation extends Simulation {
  _InterpolationSimulation(this._begin, this._end, Duration duration, this._curve, double scale)
    : assert(_begin != null),
      assert(_end != null),
      assert(duration != null && duration.inMicroseconds > 0),
      _durationInSeconds = (duration.inMicroseconds * scale) / Duration.microsecondsPerSecond;
}`;
        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 7);

        let want = [
            stylizer.EntityType.Unknown,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.BlankLine,
        ];

        for (let i = 0; i < got[0].lines.length; i++) {
            let line = got[0].lines[i];
            assert.equal(
                stylizer.EntityType[line.entityType],
                stylizer.EntityType[want[i]],
                'line #' + i.toString() + ': ' + line.line);
        }
    });
});