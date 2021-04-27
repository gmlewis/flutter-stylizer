//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert'

import * as vscode from 'vscode'
import * as stylizer from '../../extension'
const fs = require('fs')
const path = require('path')

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {
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

  test("Classes are found", async () => {
    const source = `// test.dart
class myClass extends Widget {

}`
    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)
    assert.strictEqual(got[0].lines.length, 3)
  })

  test("Named constructors are kept intact", async () => {
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
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType],
        stylizer.EntityType[want[i]],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test("Private constructors are kept intact", async () => {
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
      stylizer.EntityType.Unknown,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType],
        stylizer.EntityType[want[i]],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test("Handle overridden getters with bodies", async () => {
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
      stylizer.EntityType.OverrideMethod,  // extra?!?
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType],
        stylizer.EntityType[want[i]],
        `line #${i + 1}: ${line.line}`)
    }
  })

  test("Issue#9: constructor false positive", async () => {
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
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
        `line #${i + 1}: ${line.line}`)
    }
  })

  test("Issue#11: run on basic_classes.dart with default memberOrdering", async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'basic_classes_default_order.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,                 // line #7: class Class1 {
      stylizer.EntityType.PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      stylizer.EntityType.PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      stylizer.EntityType.BuildMethod,             // line #10:   @override
      stylizer.EntityType.BuildMethod,             // line #11:   build() {}  // build method
      stylizer.EntityType.BlankLine,               // line #12:
      stylizer.EntityType.StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      stylizer.EntityType.StaticPrivateVariable,   // line #14:
      stylizer.EntityType.StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      stylizer.EntityType.StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      stylizer.EntityType.BlankLine,               // line #17:
      stylizer.EntityType.StaticPrivateVariable,   // line #18:   /* This is a
      stylizer.EntityType.StaticPrivateVariable,   // line #19:    * random multi-
      stylizer.EntityType.StaticPrivateVariable,   // line #20:    * line comment
      stylizer.EntityType.StaticPrivateVariable,   // line #21:    * somewhere in the middle
      stylizer.EntityType.StaticPrivateVariable,   // line #22:    * of the class */
      stylizer.EntityType.StaticPrivateVariable,   // line #23:
      stylizer.EntityType.StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      stylizer.EntityType.StaticPrivateVariable,   // line #25:   static double _spvni;
      stylizer.EntityType.PrivateInstanceVariable, // line #26:   int _pvini;
      stylizer.EntityType.StaticVariable,          // line #27:   static int sv;
      stylizer.EntityType.InstanceVariable,        // line #28:   int v;
      stylizer.EntityType.InstanceVariable,        // line #29:   final double fv = 42.0;
      stylizer.EntityType.MainConstructor,         // line #30:   Class1();
      stylizer.EntityType.NamedConstructor,        // line #31:   Class1.fromNum();
      stylizer.EntityType.OtherMethod,             // line #32:   var myfunc = (int n) => n;
      stylizer.EntityType.OtherMethod,             // line #33:   get vv => v; // getter
      stylizer.EntityType.OverrideMethod,          // line #34:   @override
      stylizer.EntityType.OverrideMethod,          // line #35:   toString() {
      stylizer.EntityType.OverrideMethod,          // line #36:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      stylizer.EntityType.OverrideMethod,          // line #37:     return '';
      stylizer.EntityType.OverrideMethod,          // line #38:   }
      stylizer.EntityType.BlankLine,               // line #39:
      stylizer.EntityType.InstanceVariable,        // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      stylizer.EntityType.InstanceVariable,        // line #41:   /*
      stylizer.EntityType.InstanceVariable,        // line #42:     '''
      stylizer.EntityType.InstanceVariable,        // line #43:     """
      stylizer.EntityType.InstanceVariable,        // line #44:     //
      stylizer.EntityType.InstanceVariable,        // line #45:   */
      stylizer.EntityType.InstanceVariable,        // line #46:   const a = """
      stylizer.EntityType.InstanceVariable,        // line #47:    '${b}
      stylizer.EntityType.InstanceVariable,        // line #48:    '''
      stylizer.EntityType.InstanceVariable,        // line #49:   """
      stylizer.EntityType.InstanceVariable,        // line #50:   const b = '''
      stylizer.EntityType.InstanceVariable,        // line #51:     {  (  ))) """ {{{} ))))
      stylizer.EntityType.InstanceVariable,        // line #52:   '''
      stylizer.EntityType.InstanceVariable,        // line #53:   const c = { '{{{((... """ ${'((('}' }
      stylizer.EntityType.BlankLine,               // line #54: }
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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

  test("Issue#11: run on basic_classes.dart with custom memberOrdering", async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'basic_classes_custom_order.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, false)
    assert.strictEqual(got.length, 1)

    const want = [
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
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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

  test("Issue#16: support new public-override-variables feature", async () => {
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
      stylizer.EntityType.Unknown,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OverrideVariable,
      stylizer.EntityType.OverrideVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.OverrideMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
        `line #${i + 1}: ${line.line}`)
    }
  })

  test("Issue#17: function-type variable is not a function", async () => {
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
      stylizer.EntityType.Unknown,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
        `line #${i + 1}: ${line.line}`)
    }
  })

  test("Issue#18: case 1: groupAndSortGetterMethods=false, sortOtherMethods=false", async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case1.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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

  test("Issue#18: case 2: groupAndSortGetterMethods=false, sortOtherMethods=true", async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case2.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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

  test("Issue#18: case 3: groupAndSortGetterMethods=true, sortOtherMethods=false", async () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case3.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.GetterMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.GetterMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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

  test("Issue#18: case 4: groupAndSortGetterMethods=true, sortOtherMethods=true", async () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case4.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.GetterMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.PrivateInstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.GetterMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.OtherMethod,
      stylizer.EntityType.BlankLine,
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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

  test("Issue#19: factory contructor should not be duplicated", async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue19.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue19_want.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.InstanceVariable,
      stylizer.EntityType.BlankLine,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.MainConstructor,
      stylizer.EntityType.BlankLine,
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
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
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
