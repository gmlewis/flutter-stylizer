//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert'

import * as vscode from 'vscode'
import * as stylizer from '../../extension'
const fs = require('fs')
const path = require('path')

import { EntityType } from '../../dart/entity'

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')

  const newDoc = async () => {
    const doc = await vscode.workspace.openTextDocument({ language: 'dart' })
    await vscode.window.showTextDocument(doc)
    return doc
  }

  const newEditor = async (doc: vscode.TextDocument, source: string) => {
    const editor = vscode.window.activeTextEditor
    await editor!.edit((editBuilder: vscode.TextEditorEdit) => {
      editBuilder.insert(doc.positionAt(0), source)
    })
    assert.notStrictEqual(editor, null)
    return editor!
  }

  test('Classes are found', async () => {
    const source = `// test.dart
class myClass extends Widget {

}`
    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)
    assert.strictEqual(got[0].lines.length, 3)
  })

  test('Named constructors are kept intact', async () => {
    const source = `class AnimationController extends Animation<double>
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
}`
    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test('Private constructors are kept intact', async () => {
    const source = `class _InterpolationSimulation extends Simulation {
  _InterpolationSimulation(this._begin, this._end, Duration duration, this._curve, double scale)
    : assert(_begin != null),
      assert(_end != null),
      assert(duration != null && duration.inMicroseconds > 0),
      _durationInSeconds = (duration.inMicroseconds * scale) / Duration.microsecondsPerSecond;
}`
    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test('Handle overridden getters with bodies', async () => {
    const source = `class CurvedAnimation extends Animation<double>
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
}`
    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,  // extra?!?
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test('Issue#9: constructor false positive', async () => {
    const source = `class PGDateTime {
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
}`

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.BlankLine,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.BlankLine,
      EntityType.NamedConstructor,
      EntityType.BlankLine,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test('Issue#11: run on basic_classes.dart with default memberOrdering', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'basic_classes_default_order.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,                 // line #7: class Class1 {
      EntityType.PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      EntityType.PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      EntityType.BuildMethod,             // line #10:   @override
      EntityType.BuildMethod,             // line #11:   build() {}  // build method
      EntityType.BlankLine,               // line #12:
      EntityType.StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      EntityType.StaticPrivateVariable,   // line #14:
      EntityType.StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      EntityType.StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      EntityType.BlankLine,               // line #17:
      EntityType.StaticPrivateVariable,   // line #18:   /* This is a
      EntityType.StaticPrivateVariable,   // line #19:    * random multi-
      EntityType.StaticPrivateVariable,   // line #20:    * line comment
      EntityType.StaticPrivateVariable,   // line #21:    * somewhere in the middle
      EntityType.StaticPrivateVariable,   // line #22:    * of the class */
      EntityType.StaticPrivateVariable,   // line #23:
      EntityType.StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      EntityType.StaticPrivateVariable,   // line #25:   static double _spvni;
      EntityType.PrivateInstanceVariable, // line #26:   int _pvini;
      EntityType.StaticVariable,          // line #27:   static int sv;
      EntityType.InstanceVariable,        // line #28:   int v;
      EntityType.InstanceVariable,        // line #29:   final double fv = 42.0;
      EntityType.MainConstructor,         // line #30:   Class1();
      EntityType.NamedConstructor,        // line #31:   Class1.fromNum();
      EntityType.OtherMethod,             // line #32:   var myfunc = (int n) => n;
      EntityType.OtherMethod,             // line #33:   get vv => v; // getter
      EntityType.OverrideMethod,          // line #34:   @override
      EntityType.OverrideMethod,          // line #35:   toString() {
      EntityType.OverrideMethod,          // line #36:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      EntityType.OverrideMethod,          // line #37:     return '';
      EntityType.OverrideMethod,          // line #38:   }
      EntityType.BlankLine,               // line #39:
      EntityType.InstanceVariable,        // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      EntityType.InstanceVariable,        // line #41:   /*
      EntityType.InstanceVariable,        // line #42:     '''
      EntityType.InstanceVariable,        // line #43:     """
      EntityType.InstanceVariable,        // line #44:     //
      EntityType.InstanceVariable,        // line #45:   */
      EntityType.InstanceVariable,        // line #46:   const a = """
      EntityType.InstanceVariable,        // line #47:    '${b}
      EntityType.InstanceVariable,        // line #48:    '''
      EntityType.InstanceVariable,        // line #49:   """
      EntityType.InstanceVariable,        // line #50:   const b = '''
      EntityType.InstanceVariable,        // line #51:     {  (  ))) """ {{{} ))))
      EntityType.InstanceVariable,        // line #52:   '''
      EntityType.InstanceVariable,        // line #53:   const c = { '{{{((... """ ${'((('}' }
      EntityType.BlankLine,               // line #54: }
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'build-method'
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], false, false)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })

  test('Issue#11: run on basic_classes.dart with custom memberOrdering', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'basic_classes_custom_order.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.PrivateInstanceVariable,
      EntityType.PrivateInstanceVariable,
      EntityType.BuildMethod,
      EntityType.BuildMethod,
      EntityType.BlankLine,
      EntityType.StaticPrivateVariable,
      EntityType.StaticPrivateVariable,
      EntityType.StaticPrivateVariable,
      EntityType.StaticPrivateVariable,
      EntityType.BlankLine,
      EntityType.MultiLineComment,
      EntityType.MultiLineComment,
      EntityType.MultiLineComment,
      EntityType.MultiLineComment,
      EntityType.MultiLineComment,
      EntityType.BlankLine,
      EntityType.StaticPrivateVariable,
      EntityType.StaticPrivateVariable,
      EntityType.PrivateInstanceVariable,
      EntityType.StaticVariable,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.MainConstructor,
      EntityType.NamedConstructor,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'public-override-methods',
      'public-other-methods',
      'private-static-variables',
      'private-instance-variables',
      'build-method',
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], false, false)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })

  test('Issue#16: support new public-override-variables feature', async () => {
    const source = `
class Chat extends Equatable implements SubscriptionObject {
  final String displayName;
  final ChatText? lastText;
  final List<User> users;

  Chat({
    required this.id,
    required this.users,
    required this.lastText,
    required this.displayName,
  });

  @override
  final String id;

  @override
  List<Object?> get props => [
        id,
        users,
        lastText,
        displayName,
      ];
}
`

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.BlankLine,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.OverrideVariable,
      EntityType.OverrideVariable,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test('Issue#17: function-type variable is not a function', async () => {
    const source = `
class Test {
  final String Function() functionName;

  String fun(){
    return "fun";
  }

  Function makeAdder(int addBy) {
    return (int i) => addBy + i;
  }
}
`

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.InstanceVariable,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test('Issue#18: case 1: groupAndSortGetterMethods=false, sortOtherMethods=false', async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case1.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'build-method'
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], groupAndSortGetterMethods, sortOtherMethods)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })

  test('Issue#18: case 2: groupAndSortGetterMethods=false, sortOtherMethods=true', async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case2.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'build-method'
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], groupAndSortGetterMethods, sortOtherMethods)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })

  test('Issue#18: case 3: groupAndSortGetterMethods=true, sortOtherMethods=false', async () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case3.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.GetterMethod,
      EntityType.BlankLine,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.GetterMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'build-method'
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], groupAndSortGetterMethods, sortOtherMethods)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })

  test('Issue#18: case 4: groupAndSortGetterMethods=true, sortOtherMethods=true', async () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case4.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.GetterMethod,
      EntityType.BlankLine,
      EntityType.PrivateInstanceVariable,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.GetterMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.BlankLine,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'build-method'
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], groupAndSortGetterMethods, sortOtherMethods)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })

  test('Issue#19: factory contructor should not be duplicated', async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue19.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue19_want.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      EntityType.Unknown,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.BlankLine,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.BlankLine,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.NamedConstructor,
      EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        line.entityType,
        want[i],
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'build-method'
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], groupAndSortGetterMethods, sortOtherMethods)
    const wantLines = wantSource.split('\n')
    assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })
})
