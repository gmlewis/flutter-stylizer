//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';

import * as vscode from 'vscode';
import * as stylizer from '../../extension';
const fs = require('fs');

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

    test("Handle overridden getters with bodies", async () => {
        var source = `class CurvedAnimation extends Animation<double>
    with AnimationWithParentMixin<double> {
  @override
  double get value {
    final Curve activeCurve = _useForwardCurve ? curve : reverseCurve;

    final double t = parent.value;
    if (activeCurve == null) return t;
    if (t == 0.0 || t == 1.0) {
      assert(() {
        final double transformedValue = activeCurve.transform(t);
        final double roundedTransformedValue =
            transformedValue.round().toDouble();
        if (roundedTransformedValue != t) {
          throw FlutterError('Invalid curve endpoint at $t.\n'
              'Curves must map 0.0 to near zero and 1.0 to near one but '
              'is near $roundedTransformedValue.');
        }
        return true;
      }());
      return t;
    }
    return activeCurve.transform(t);
  }

  @override
  String toString() {
    if (reverseCurve == null) return '$parent\u27A9$curve';
    if (_useForwardCurve)
      return '$parent\u27A9$curve\u2092\u2099/$reverseCurve';
    return '$parent\u27A9$curve/$reverseCurve\u2092\u2099';
  }
}`;
        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 33);

        let want = [
            stylizer.EntityType.Unknown,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
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

    test("Issue#9: constructor false positive", async () => {
        var source = `class PGDateTime {
// value xor isInfinity
PGDateTime({
    this.value,
    this.isInfinity = false,
}) : assert((value != null || isInfinity == true) &&
            !(value != null && isInfinity == true));

PGDateTime.infinity() {
    isInfinity = true;
}

PGDateTime.now() {
    value = DateTime.now();
    isInfinity = false;
}

PGDateTime.fromDateTime(this.value) : isInfinity = false;

bool isInfinity = false;
DateTime value;

static PGDateTime parse(String formattedString) =>
    formattedString == 'infinity'
        ? PGDateTime.infinity()
        : PGDateTime(value: DateTime.parse(formattedString).toLocal());
}`;

        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 27);

        let want = [
            stylizer.EntityType.Unknown,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.InstanceVariable,
            stylizer.EntityType.InstanceVariable,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.BlankLine,
        ];

        for (let i = 0; i < got[0].lines.length; i++) {
            let line = got[0].lines[i];
            assert.equal(
                stylizer.EntityType[line.entityType].toString(),
                stylizer.EntityType[want[i]].toString(),
                'line #' + i.toString() + ': ' + line.line);
        }
    });

    test("Issue#11: run on basic_classes.dart with default memberOrdering", async () => {
        let source = fs.readFileSync('src/test/suite/testfiles/basic_classes.dart', 'utf8');
        let wantSource = fs.readFileSync('src/test/suite/testfiles/basic_classes_default_order.txt', 'utf8');

        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 33);

        let want = [
            stylizer.EntityType.Unknown,
            stylizer.EntityType.PrivateInstanceVariable,
            stylizer.EntityType.PrivateInstanceVariable,
            stylizer.EntityType.BuildMethod,
            stylizer.EntityType.BuildMethod,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.PrivateInstanceVariable,
            stylizer.EntityType.StaticVariable,
            stylizer.EntityType.InstanceVariable,
            stylizer.EntityType.InstanceVariable,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.BlankLine,
        ];

        for (let i = 0; i < got[0].lines.length; i++) {
            let line = got[0].lines[i];
            assert.equal(
                stylizer.EntityType[line.entityType].toString(),
                stylizer.EntityType[want[i]].toString(),
                'line #' + i.toString() + ': ' + line.line);
        }

        const memberOrdering = [
            'public-constructor',
            'named-constructors',
            'public-static-variables',
            'public-instance-variables',
            'private-static-variables',
            'private-instance-variables',
            'public-override-methods',
            'public-other-methods',
            'build-method'
        ];

        let lines = stylizer.reorderClass(memberOrdering, got[0]);
        const wantLines = wantSource.split('\n');
        assert.equal(lines.length, wantLines.length);

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            assert.equal(
                line,
                wantLines[i],
                'line #' + i.toString());
        }
    });

    test("Issue#11: run on basic_classes.dart with custom memberOrdering", async () => {
        let source = fs.readFileSync('src/test/suite/testfiles/basic_classes.dart', 'utf8');
        let wantSource = fs.readFileSync('src/test/suite/testfiles/basic_classes_custom_order.txt', 'utf8');

        let doc = await newDoc();
        let editor = await newEditor(doc, source);
        let got = await stylizer.getClasses(editor!);
        assert.equal(got.length, 1);
        assert.equal(got[0].lines.length, 33);

        let want = [
            stylizer.EntityType.Unknown,
            stylizer.EntityType.PrivateInstanceVariable,
            stylizer.EntityType.PrivateInstanceVariable,
            stylizer.EntityType.BuildMethod,
            stylizer.EntityType.BuildMethod,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.MultiLineComment,
            stylizer.EntityType.BlankLine,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.StaticPrivateVariable,
            stylizer.EntityType.PrivateInstanceVariable,
            stylizer.EntityType.StaticVariable,
            stylizer.EntityType.InstanceVariable,
            stylizer.EntityType.InstanceVariable,
            stylizer.EntityType.MainConstructor,
            stylizer.EntityType.NamedConstructor,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OtherMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.OverrideMethod,
            stylizer.EntityType.BlankLine,
        ];

        for (let i = 0; i < got[0].lines.length; i++) {
            let line = got[0].lines[i];
            assert.equal(
                stylizer.EntityType[line.entityType].toString(),
                stylizer.EntityType[want[i]].toString(),
                'line #' + i.toString() + ': ' + line.line);
        }

        const memberOrdering = [
            'public-constructor',
            'named-constructors',
            'public-static-variables',
            'public-instance-variables',
            'public-override-methods',
            'public-other-methods',
            'private-static-variables',
            'private-instance-variables',
            'build-method',
        ];

        let lines = stylizer.reorderClass(memberOrdering, got[0]);
        const wantLines = wantSource.split('\n');
        assert.equal(lines.length, wantLines.length);

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            assert.equal(
                line,
                wantLines[i],
                'line #' + i.toString());
        }
    });
});
