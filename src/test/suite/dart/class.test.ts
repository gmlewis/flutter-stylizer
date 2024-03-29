/*
Copyright © 2021 Glenn M. Lewis

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as assert from 'assert'
import * as vscode from 'vscode'

import { Class } from '../../../dart/class'
import { defaultMemberOrdering, Client, Options } from '../../../dart/dart'
import { Editor } from '../../../dart/editor'
import { EntityType } from '../../../dart/entity'
import { setupEditor } from './editor.test'

const fs = require('fs')
const path = require('path')

export const runParsePhase = (opts: Options | null, source: string, wantClasses: EntityType[][] | null): [Client, Class[]] => {
  let verbose = false
  const testOpts: Options = {
    GroupAndSortGetterMethods: false,
    GroupAndSortVariableTypes: false,
    MemberOrdering: defaultMemberOrdering,
    ProcessEnumsLikeClasses: false,
    SortClassesWithinFile: false,
    SortOtherMethods: false,
    SeparatePrivateMethods: false,
    Verbose: false,
  }
  if (opts !== null) {
    testOpts.GroupAndSortGetterMethods = opts.GroupAndSortGetterMethods
    testOpts.GroupAndSortVariableTypes = opts.GroupAndSortVariableTypes || false
    testOpts.MemberOrdering = opts.MemberOrdering
    testOpts.ProcessEnumsLikeClasses = opts.ProcessEnumsLikeClasses || false
    testOpts.SortClassesWithinFile = opts.SortClassesWithinFile
    testOpts.SortOtherMethods = opts.SortOtherMethods
    testOpts.SeparatePrivateMethods = opts.SeparatePrivateMethods
    verbose = opts.Verbose || false
  }

  const e = new Editor(source, testOpts.ProcessEnumsLikeClasses || false, verbose)

  const c = new Client(e, testOpts)
  const [gotAll, err] = e.getClasses(testOpts.GroupAndSortGetterMethods || false, testOpts.SeparatePrivateMethods || false)
  if (err !== null) {
    throw Error(err.message)  // Make the compiler happy.
  }

  if (!wantClasses || !wantClasses.length) {
    return [c, gotAll]
  }

  assert.strictEqual(gotAll.length, wantClasses.length, 'getClasses')

  for (let k = 0; k < wantClasses.length; k++) {
    const got = gotAll[k]
    const want: EntityType[] = wantClasses[k]
    if (got.lines.length !== want.length) {
      for (let i = 0; i < got.lines.length; i++) {
        const line = got.lines[i]
        console.log(`EntityType.${EntityType[line.entityType]}, // line #${line.originalIndex + 1}: ${line.line}`)
      }
    }
    assert.strictEqual(got.lines.length, want.length, 'getClasses lines')

    for (let i = 0; i < got.lines.length; i++) {
      const line = got.lines[i]
      assert.strictEqual(EntityType[line.entityType], EntityType[want[i]], `entitype: line #${line.originalIndex + 1}: ${line.line}`)
    }
  }

  return [c, gotAll]
}

export const runFullStylizer = (opts: Options | null, source: string, wantSource: string, want: EntityType[][] | null): Class[] => {
  const [c, got] = runParsePhase(opts, source, want)

  const edits = c.generateEdits(got)

  const newBuf = c.rewriteClasses(source, edits)
  const gotLines = newBuf.split('\n')
  const wantLines = wantSource.split('\n')
  if (gotLines.length !== wantLines.length) {
    console.log(gotLines)
  }
  assert.strictEqual(gotLines.length, wantLines.length, `rewriteClasses: newBuf=${newBuf}`)

  for (let i = 0; i < gotLines.length; i++) {
    const line = gotLines[i].replace(/\r/g, '')
    if (i < wantLines.length) {
      assert.strictEqual(line, wantLines[i], `line #${i + 1}: ${line}`)
    } else if (i >= wantLines.length) {
      assert.strictEqual(line, null, `line #${i + 1}: ${line}`)
    }
  }

  return got
}

suite('Mixin Tests', () => {
  test('Mixins are found', () => {
    const source = `// test.dart
mixin myMixin {

}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.BlankLine,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })
})

suite('Class Tests', () => {
  var myExtDir = (vscode.extensions.getExtension('gmlewis-vscode.flutter-stylizer') || {}).extensionPath || process.env.VSCODE_CWD
  const testfilesDir = path.join(myExtDir, 'src', 'test', 'suite', 'testfiles')

  test('Classes are found', () => {
    const source = `// test.dart
class myClass extends Widget {

}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.BlankLine,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('MainHandler no false positives - ignore enums', () => {
    const source = `// test.dart
class ScannerErrorCode extends ErrorCode {
  /**
   * Parameters:
   * 0: the token that was expected but not found
   */
  static const ScannerErrorCode EXPECTED_TOKEN =
  const ScannerErrorCode('EXPECTED_TOKEN', "Expected to find '{0}'.");

  /**
   * Parameters:
   * 0: the illegal character
   */
  static const ScannerErrorCode ILLEGAL_CHARACTER =
  const ScannerErrorCode('ILLEGAL_CHARACTER', "Illegal character '{0}'.");
}`

    const want: EntityType[] = [
      EntityType.Unknown,        // line #2: {
      EntityType.StaticVariable, // line #3:   /**
      EntityType.StaticVariable, // line #4:    * Parameters:
      EntityType.StaticVariable, // line #5:    * 0: the token that was expected but not found
      EntityType.StaticVariable, // line #6:    */
      EntityType.StaticVariable, // line #7:   static const ScannerErrorCode EXPECTED_TOKEN =
      EntityType.StaticVariable, // line #8:       const ScannerErrorCode('EXPECTED_TOKEN', "Expected to find '{0}'.");
      EntityType.BlankLine,      // line #9:
      EntityType.StaticVariable, // line #10:   /**
      EntityType.StaticVariable, // line #11:    * Parameters:
      EntityType.StaticVariable, // line #12:    * 0: the illegal character
      EntityType.StaticVariable, // line #13:    */
      EntityType.StaticVariable, // line #14:   static const ScannerErrorCode ILLEGAL_CHARACTER =
      EntityType.StaticVariable, // line #15:       const ScannerErrorCode('ILLEGAL_CHARACTER', "Illegal character '{0}'.");
      EntityType.BlankLine,      // line #16:
    ]

    runParsePhase(null, source, [want])
  })

  test('MainHandler with enums', () => {
    const source = `// from: https://dart.dev/guides/language/language-tour#enumerated-types
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int tires;
  final int passengers;
  final int carbonPerKilometer;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;
}`

    const want: EntityType[] = [
      EntityType.Unknown,          // line #2: {
      EntityType.LeaveUnmodified,  // line #3:   car(tires: 4, passengers: 5, carbonPerKilometer: 400),
      EntityType.LeaveUnmodified,  // line #4:   bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
      EntityType.LeaveUnmodified,  // line #5:   bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);
      EntityType.BlankLine,        // line #6:
      EntityType.MainConstructor,  // line #7:   const Vehicle({
      EntityType.MainConstructor,  // line #8:     required this.tires,
      EntityType.MainConstructor,  // line #9:     required this.passengers,
      EntityType.MainConstructor,  // line #10:     required this.carbonPerKilometer,
      EntityType.MainConstructor,  // line #11:   });
      EntityType.BlankLine,        // line #12:
      EntityType.InstanceVariable, // line #13:   final int tires;
      EntityType.InstanceVariable, // line #14:   final int passengers;
      EntityType.InstanceVariable, // line #15:   final int carbonPerKilometer;
      EntityType.BlankLine,        // line #16:
      EntityType.OtherMethod,      // line #17:   int get carbonFootprint => (carbonPerKilometer / passengers).round();
      EntityType.BlankLine,        // line #18:
      EntityType.OverrideMethod,   // line #19:   @override
      EntityType.OverrideMethod,   // line #20:   int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;
      EntityType.BlankLine,        // line #21:
    ]

    const opts: Options = {
      MemberOrdering: defaultMemberOrdering,
      ProcessEnumsLikeClasses: true,
      SortClassesWithinFile: true,
    }
    runParsePhase(opts, source, [want])
  })

  test('OverrideMethod', () => {
    const source = `// test.dart
class C {
  /// If this expression is both in a getter and setter context, the
  /// [AuxiliaryElements] will be set to hold onto the static element from the
  /// getter context.
  @Deprecated('Use CompoundAssignmentExpression.readElement and/or '
      'CompoundAssignmentExpression.writeElement')
  @override
  AuxiliaryElements auxiliaryElements;
}`

    const want: EntityType[] = [
      EntityType.Unknown,          // line #2: {
      EntityType.OverrideVariable, // line #3:   /// If this expression is both in a getter and setter context, the
      EntityType.OverrideVariable, // line #4:   /// [AuxiliaryElements] will be set to hold onto the static element from the
      EntityType.OverrideVariable, // line #5:   /// getter context.
      EntityType.OverrideVariable, // line #6:   @Deprecated('Use CompoundAssignmentExpression.readElement and/or '
      EntityType.OverrideVariable, // line #7:       'CompoundAssignmentExpression.writeElement')
      EntityType.OverrideVariable, // line #8:   @override
      EntityType.OverrideVariable, // line #9:   AuxiliaryElements auxiliaryElements;
      EntityType.BlankLine,        // line #10:
    ]

    runParsePhase(null, source, [want])
  })

  test('NamedConstructor', () => {
    const source = `// test.dart
class C {
  void method_if_then_else(int? x) {
    if (x == null) {
      x;
    } else {
      /*nonNullable*/ x;
    }
  }

  C.constructor_if_then_else(int? x) {
    if (x == null) {
      x;
    } else {
      /*nonNullable*/ x;
    }
  }

  C.withDetails(this.callingMethod, this.code, this.message,
      {Object details})
      : data = details == null ? null : <String, dynamic>{} {
    if (details != null) {
      data['details'] = details;
    }
  }
}`

    const want: EntityType[] = [
      EntityType.Unknown,          // line #2: {
      EntityType.OtherMethod,      // line #3:   void method_if_then_else(int? x) {
      EntityType.OtherMethod,      // line #4:     if (x == null) {
      EntityType.OtherMethod,      // line #5:       x;
      EntityType.OtherMethod,      // line #6:     } else {
      EntityType.OtherMethod,      // line #7:       /*nonNullable*/ x;
      EntityType.OtherMethod,      // line #8:     }
      EntityType.OtherMethod,      // line #9:   }
      EntityType.BlankLine,        // line #10:
      EntityType.NamedConstructor, // line #11:   C.constructor_if_then_else(int? x) {
      EntityType.NamedConstructor, // line #12:     if (x == null) {
      EntityType.NamedConstructor, // line #13:       x;
      EntityType.NamedConstructor, // line #14:     } else {
      EntityType.NamedConstructor, // line #15:       /*nonNullable*/ x;
      EntityType.NamedConstructor, // line #16:     }
      EntityType.NamedConstructor, // line #17:   }
      EntityType.BlankLine,        // line #18:
      EntityType.NamedConstructor, // line #11:   C.withDetails(this.callingMethod, this.code, this.message,
      EntityType.NamedConstructor, // line #12:       {Object details})
      EntityType.NamedConstructor, // line #13:       : data = details == null ? null : <String, dynamic>{} {
      EntityType.NamedConstructor, // line #14:     if (details != null) {
      EntityType.NamedConstructor, // line #15:       data['details'] = details;
      EntityType.NamedConstructor, // line #16:     }
      EntityType.NamedConstructor, // line #17:   }
      EntityType.BlankLine,        // line #18:
    ]

    runParsePhase(null, source, [want])
  })

  test('NamedConstructors are kept intact', () => {
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

    const want: EntityType[] = [
      EntityType.Unknown,          // line #1: {
      EntityType.NamedConstructor, // line #2: 	AnimationController.unbounded({
      EntityType.NamedConstructor, // line #3: 	double value = 0.0,
      EntityType.NamedConstructor, // line #4: 	this.duration,
      EntityType.NamedConstructor, // line #5: 	this.debugLabel,
      EntityType.NamedConstructor, // line #6: 	@required TickerProvider vsync,
      EntityType.NamedConstructor, // line #7: 	this.animationBehavior = AnimationBehavior.preserve,
      EntityType.NamedConstructor, // line #8: 	}) : assert(value != null),
      EntityType.NamedConstructor, // line #9: 			assert(vsync != null),
      EntityType.NamedConstructor, // line #10: 			lowerBound = double.negativeInfinity,
      EntityType.NamedConstructor, // line #11: 			upperBound = double.infinity,
      EntityType.NamedConstructor, // line #12: 			_direction = _AnimationDirection.forward {
      EntityType.NamedConstructor, // line #13: 	_ticker = vsync.createTicker(_tick);
      EntityType.NamedConstructor, // line #14: 	_internalSetValue(value);
      EntityType.NamedConstructor, // line #15: 	}
      EntityType.BlankLine,        // line #16:
    ]

    runParsePhase(null, source, [want])
  })

  test('PrivateConstructors are kept intact', () => {
    const source = `class _InterpolationSimulation extends Simulation {
_InterpolationSimulation(this._begin, this._end, Duration duration, this._curve, double scale)
  : assert(_begin != null),
    assert(_end != null),
    assert(duration != null && duration.inMicroseconds > 0),
    _durationInSeconds = (duration.inMicroseconds * scale) / Duration.microsecondsPerSecond;
}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.MainConstructor,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('Handle overridden getters with bodies', () => {
    const source = String.raw`class CurvedAnimation extends Animation<double>
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

    const want: EntityType[] = [
      EntityType.Unknown,        // line #1: {
      EntityType.OverrideMethod, // line #2:   @override
      EntityType.OverrideMethod, // line #3:   double get value {
      EntityType.OverrideMethod, // line #4:     final Curve activeCurve = _useForwardCurve ? curve : reverseCurve;
      EntityType.OverrideMethod, // line #5:
      EntityType.OverrideMethod, // line #6:     final double t = parent.value;
      EntityType.OverrideMethod, // line #7:     if (activeCurve == null) return t;
      EntityType.OverrideMethod, // line #8:     if (t == 0.0 || t == 1.0) {
      EntityType.OverrideMethod, // line #9:       assert(() {
      EntityType.OverrideMethod, // line #10:         final double transformedValue = activeCurve.transform(t);
      EntityType.OverrideMethod, // line #11:         final double roundedTransformedValue =
      EntityType.OverrideMethod, // line #12:             transformedValue.round().toDouble();
      EntityType.OverrideMethod, // line #13:         if (roundedTransformedValue != t) {
      EntityType.OverrideMethod, // line #14:           throw FlutterError('Invalid curve endpoint at $t.\n'
      EntityType.OverrideMethod, // line #15:               'Curves must map 0.0 to near zero and 1.0 to near one but '
      EntityType.OverrideMethod, // line #16:               'is near $roundedTransformedValue.');
      EntityType.OverrideMethod, // line #17:         }
      EntityType.OverrideMethod, // line #18:         return true;
      EntityType.OverrideMethod, // line #19:       }());
      EntityType.OverrideMethod, // line #20:       return t;
      EntityType.OverrideMethod, // line #21:     }
      EntityType.OverrideMethod, // line #22:     return activeCurve.transform(t);
      EntityType.OverrideMethod, // line #23:   }
      EntityType.BlankLine,      // line #24:
      EntityType.OverrideMethod, // line #25:   @override
      EntityType.OverrideMethod, // line #26:   String toString() {
      EntityType.OverrideMethod, // line #27:     if (reverseCurve == null) return '$parent\u27A9$curve';
      EntityType.OverrideMethod, // line #28:     if (_useForwardCurve)
      EntityType.OverrideMethod, // line #29:       return '$parent\u27A9$curve\u2092\u2099/$reverseCurve';
      EntityType.OverrideMethod, // line #30:     return '$parent\u27A9$curve/$reverseCurve\u2092\u2099';
      EntityType.OverrideMethod, // line #31:   }
      EntityType.BlankLine,      // line #32: }`
    ]

    runParsePhase(null, source, [want])
  })

  test('Issue#9: Constructor false positive', () => {
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

    const want: EntityType[] = [
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

    runParsePhase(null, source, [want])
  })

  test('Get on separate line', () => {
    const source = `class _LinkedNodeImpl extends Object
    with _LinkedNodeMixin
    implements idl.LinkedNode {
  final fb.BufferContext _bc;
  final int _bcOffset;

  _LinkedNodeImpl(this._bc, this._bcOffset);

  @override
  idl.LinkedNodeTypeSubstitution
      get redirectingConstructorInvocation_substitution {
    assert(kind == idl.LinkedNodeKind.redirectingConstructorInvocation);
    _variantField_38 ??= const _LinkedNodeTypeSubstitutionReader()
        .vTableGet(_bc, _bcOffset, 38, null);
    return _variantField_38;
  }
}`
    const wantSource = `class _LinkedNodeImpl extends Object
    with _LinkedNodeMixin
    implements idl.LinkedNode {
  _LinkedNodeImpl(this._bc, this._bcOffset);

  final fb.BufferContext _bc;
  final int _bcOffset;

  @override
  idl.LinkedNodeTypeSubstitution
      get redirectingConstructorInvocation_substitution {
    assert(kind == idl.LinkedNodeKind.redirectingConstructorInvocation);
    _variantField_38 ??= const _LinkedNodeTypeSubstitutionReader()
        .vTableGet(_bc, _bcOffset, 38, null);
    return _variantField_38;
  }
}`

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #1: {
      EntityType.PrivateInstanceVariable, // line #2:   final fb.BufferContext _bc;
      EntityType.PrivateInstanceVariable, // line #3:   final int _bcOffset;
      EntityType.BlankLine,               // line #4:
      EntityType.MainConstructor,         // line #5:   _LinkedNodeImpl(this._bc, this._bcOffset);
      EntityType.BlankLine,               // line #6:
      EntityType.OverrideMethod,          // line #7:   @override
      EntityType.OverrideMethod,          // line #8:   idl.LinkedNodeTypeSubstitution
      EntityType.OverrideMethod,          // line #9:       get redirectingConstructorInvocation_substitution {
      EntityType.OverrideMethod,          // line #10:     assert(kind == idl.LinkedNodeKind.redirectingConstructorInvocation);
      EntityType.OverrideMethod,          // line #11:     _variantField_38 ??= const _LinkedNodeTypeSubstitutionReader()
      EntityType.OverrideMethod,          // line #12:         .vTableGet(_bc, _bcOffset, 38, null);
      EntityType.OverrideMethod,          // line #13:     return _variantField_38;
      EntityType.OverrideMethod,          // line #14:   }
      EntityType.BlankLine,               // line #15:
    ]

    runFullStylizer(null, source, wantSource, [want])
    // Run again to make sure no extra blank lines are added.
    runFullStylizer(null, wantSource, wantSource, [])
  })

  test('Operator overrides', () => {
    const source = `class Op {
  @override
  dynamic operator [](int index) => nodes[index].value;

  @override
  operator []=(int index, value) {
    throw UnsupportedError('Cannot modify an unmodifiable List');
  }

  @override
  bool operator <=(Object other) {
    return true;
  }

  @override
  bool operator==(Object other) {
    return true;
  }

  @override
  bool operator >=(Object other) {
    return true;
  }
}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('Mark method offset alignment', () => {
    const source = `class MarkMethod {
  @override
  // TODO(gmlewis) Implement this by looking in the BUILD file for 'deps'
  //  lists.
  Map<String, List<Folder>> packagesAvailableTo(String libraryPath) =>
      <String, List<Folder>>{};
}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('Multiple decorators', () => {
    const source = `class MultipleDecorators {
  @override
  @failingTest
  @deprecated
  test_initializer_literal_map_untyped_empty() async {
    fail('times out.');
  }

  @override _TransformationsDemoState createState() => _TransformationsDemoState();

  @Deprecated('do not use this')
  @failingTest
  @override
  test_initializer_literal_map_untyped_empty() async {
    fail('times out.');
  }

  @ThisDecorator('is'
    'completely'
    'made'
    'up')
  final String do_not_use;
}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.OverrideMethod,
      EntityType.BlankLine,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.InstanceVariable,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('White space after function names', () => {
    const source = `class C {
  @override Widget build ( BuildContext context ) { }
  myFunc                 () => null;
}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.BuildMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('Embedded multiline comments', () => {
    const source = `class C {
  dynamic /*member: C.x:assigned={a}*/ x = /*declared={a, b}*/ (int a, int b) {
    a = 0;
  };
}`

    const want: EntityType[] = [
      EntityType.Unknown,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.OtherMethod,
      EntityType.BlankLine,
    ]

    runParsePhase(null, source, [want])
  })

  test('Issue#11 - Run with default member ordering', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'basic_classes_default_order.txt'), 'utf8')

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #7: class Class1 {
      EntityType.PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      EntityType.PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      EntityType.BuildMethod,             // line #10:   @override
      EntityType.BuildMethod,             // line #11:   build() {} // build method
      EntityType.BlankLine,               // line #12:
      EntityType.StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      EntityType.StaticPrivateVariable,   // line #14:
      EntityType.StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      EntityType.StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      EntityType.BlankLine,               // line #17:
      EntityType.MultiLineComment,        // line #18:   /* This is a
      EntityType.MultiLineComment,        // line #19:    * random multi-
      EntityType.MultiLineComment,        // line #20:    * line comment
      EntityType.MultiLineComment,        // line #21:    * somewhere in the middle
      EntityType.MultiLineComment,        // line #22:    * of the class */
      EntityType.BlankLine,               // line #23:
      EntityType.StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      EntityType.StaticPrivateVariable,   // line #25:   static double _spvni = 0;
      EntityType.PrivateInstanceVariable, // line #26:   int _pvini = 1;
      EntityType.StaticVariable,          // line #27:   static int sv = 0;
      EntityType.InstanceVariable,        // line #28:   int v = 2;
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
      EntityType.StaticVariable,          // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      EntityType.StaticVariable,          // line #41:   /*
      EntityType.StaticVariable,          // line #42:     '''
      EntityType.StaticVariable,          // line #43:     """
      EntityType.StaticVariable,          // line #44:     //
      EntityType.StaticVariable,          // line #45:   */
      EntityType.StaticVariable,          // line #46:   static const a = """;
      EntityType.StaticVariable,          // line #47:    '${b};
      EntityType.StaticVariable,          // line #48:    ''' ;
      EntityType.StaticVariable,          // line #49:   """;
      EntityType.StaticVariable,          // line #50:   static const b = ''';
      EntityType.StaticVariable,          // line #51:     {  (  ))) """ {{{} ))));
      EntityType.StaticVariable,          // line #52:   ''';
      EntityType.StaticVariable,          // line #53:   static const c = {'{{{((... """ ${'((('};'};
      EntityType.BlankLine,               // line #54: }
    ]

    runFullStylizer(null, source, wantSource, [want])
  })

  test('Issue#11 - Run with custom member ordering', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'basic_classes_custom_order.txt'), 'utf8')

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #1: {
      EntityType.PrivateInstanceVariable, // line #2:   // _pvi is a private instance variable.
      EntityType.PrivateInstanceVariable, // line #3:   List<String> _pvi = ['one', 'two'];
      EntityType.BuildMethod,             // line #4:   @override
      EntityType.BuildMethod,             // line #5:   build() {} // build method
      EntityType.BlankLine,               // line #6:
      EntityType.StaticPrivateVariable,   // line #7:   // This is a random single-line comment somewhere in the class.
      EntityType.StaticPrivateVariable,   // line #8:
      EntityType.StaticPrivateVariable,   // line #9:   // _spv is a static private variable.
      EntityType.StaticPrivateVariable,   // line #10:   static final String _spv = 'spv';
      EntityType.BlankLine,               // line #11:
      EntityType.MultiLineComment,        // line #12:   /* This is a
      EntityType.MultiLineComment,        // line #13:    * random multi-
      EntityType.MultiLineComment,        // line #14:    * line comment
      EntityType.MultiLineComment,        // line #15:    * somewhere in the middle
      EntityType.MultiLineComment,        // line #16:    * of the class */
      EntityType.BlankLine,               // line #17:
      EntityType.StaticPrivateVariable,   // line #18:   // _spvni is a static private variable with no initializer.
      EntityType.StaticPrivateVariable,   // line #19:   static double _spvni = 0;
      EntityType.PrivateInstanceVariable, // line #20:   int _pvini = 1;
      EntityType.StaticVariable,          // line #21:   static int sv = 0;
      EntityType.InstanceVariable,        // line #22:   int v = 2;
      EntityType.InstanceVariable,        // line #23:   final double fv = 42.0;
      EntityType.MainConstructor,         // line #24:   Class1();
      EntityType.NamedConstructor,        // line #25:   Class1.fromNum();
      EntityType.OtherMethod,             // line #26:   var myfunc = (int n) => n;
      EntityType.OtherMethod,             // line #27:   get vv => v; // getter
      EntityType.OverrideMethod,          // line #28:   @override
      EntityType.OverrideMethod,          // line #29:   toString() {
      EntityType.OverrideMethod,          // line #30:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      EntityType.OverrideMethod,          // line #31:     return '';
      EntityType.OverrideMethod,          // line #32:   }
      EntityType.BlankLine,               // line #33:
      EntityType.StaticVariable,          // line #34:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      EntityType.StaticVariable,          // line #35:   /*
      EntityType.StaticVariable,          // line #36:     '''
      EntityType.StaticVariable,          // line #37:     """
      EntityType.StaticVariable,          // line #38:     //
      EntityType.StaticVariable,          // line #39:   */
      EntityType.StaticVariable,          // line #40:   static const a = """;
      EntityType.StaticVariable,          // line #41:    '${b};
      EntityType.StaticVariable,          // line #42:    ''' ;
      EntityType.StaticVariable,          // line #43:   """;
      EntityType.StaticVariable,          // line #44:   static const b = ''';
      EntityType.StaticVariable,          // line #45:     {  (  ))) """ {{{} ))));
      EntityType.StaticVariable,          // line #46:   ''';
      EntityType.StaticVariable,          // line #47:   static const c = {'{{{((... """ ${'((('};'};
      EntityType.BlankLine,               // line #48:
    ]

    const opts = {
      MemberOrdering: [
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
      ],
    }

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('Issue#16 - Support new public override variables feature', () => {
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

    const want: EntityType[] = [
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

    runParsePhase(null, source, [want])
  })

  test('Issue#17 - Function type variable is not a function', () => {
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

    const want: EntityType[] = [
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

    runParsePhase(null, source, [want])
  })

  test('Issue#18 - Case 1', () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false
    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case1.txt'), 'utf8')

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    const want: EntityType[] = [
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

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('Issue#18 - Case 2', () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = true
    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case2.txt'), 'utf8')

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    const want: EntityType[] = [
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

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('Issue#18 - Case 3', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = false
    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case3.txt'), 'utf8')

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    const want: EntityType[] = [
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

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('Issue#18 - Case 4', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true
    const source = fs.readFileSync(path.join(testfilesDir, 'issue18.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue18_case4.txt'), 'utf8')

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    const want: EntityType[] = [
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

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('Issue#19 - Factory constructor should not be duplicated', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true
    const source = fs.readFileSync(path.join(testfilesDir, 'issue19.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue19_want.txt'), 'utf8')

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    const want: EntityType[] = [
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

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('findFeatures on linux and mac', () => {
    const basicClasses = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
    const [bc, bcLineOffset, bcOCO, bcCCO] = setupEditor('class Class1 {', basicClasses)

    const uc = new Class(bc, 'class', 'Class1', bcOCO, bcCCO, false, false)

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #7: class Class1 {
      EntityType.PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      EntityType.PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      EntityType.BuildMethod,             // line #10:   @override
      EntityType.BuildMethod,             // line #11:   build() {} // build method
      EntityType.BlankLine,               // line #12:
      EntityType.StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      EntityType.StaticPrivateVariable,   // line #14:
      EntityType.StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      EntityType.StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      EntityType.BlankLine,               // line #17:
      EntityType.MultiLineComment,        // line #18:   /* This is a
      EntityType.MultiLineComment,        // line #19:    * random multi-
      EntityType.MultiLineComment,        // line #20:    * line comment
      EntityType.MultiLineComment,        // line #21:    * somewhere in the middle
      EntityType.MultiLineComment,        // line #22:    * of the class */
      EntityType.BlankLine,               // line #23:
      EntityType.StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      EntityType.StaticPrivateVariable,   // line #25:   static double _spvni = 0;
      EntityType.PrivateInstanceVariable, // line #26:   int _pvini = 1;
      EntityType.StaticVariable,          // line #27:   static int sv = 0;
      EntityType.InstanceVariable,        // line #28:   int v = 2;
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
      EntityType.StaticVariable,          // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      EntityType.StaticVariable,          // line #41:   /*
      EntityType.StaticVariable,          // line #42:     '''
      EntityType.StaticVariable,          // line #43:     """
      EntityType.StaticVariable,          // line #44:     //
      EntityType.StaticVariable,          // line #45:   */
      EntityType.StaticVariable,          // line #46:   static const a = """;
      EntityType.StaticVariable,          // line #47:    '${b};
      EntityType.StaticVariable,          // line #48:    ''' ;
      EntityType.StaticVariable,          // line #49:   """;
      EntityType.StaticVariable,          // line #50:   static const b = ''';
      EntityType.StaticVariable,          // line #51:     {  (  ))) """ {{{} ))));
      EntityType.StaticVariable,          // line #52:   ''';
      EntityType.StaticVariable,          // line #53:   static const c = { '{{{((... """ ${'((('};'};
      EntityType.BlankLine,               // line #54: }
    ]

    const err = uc.findFeatures()
    assert.strictEqual(err, null)

    assert.strictEqual(uc.lines.length, want.length, 'lines mismatch')

    uc.lines.forEach((line, i) => {
      assert.strictEqual(line.entityType, want[i], `entityType: line #${bcLineOffset + i + 1}: ${line.line}`)
    })
  })

  test('findFeatures on windows', () => {
    const bcWindoze = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.windz.txt'), 'utf8')
    const [wz, wzLineOffset, wzOCO, wzCCO] = setupEditor('class Class1 {', bcWindoze)

    const wc = new Class(wz, 'class', 'Class1', wzOCO, wzCCO, false, false)

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #7: class Class1 {
      EntityType.PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      EntityType.PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      EntityType.BuildMethod,             // line #10:   @override
      EntityType.BuildMethod,             // line #11:   build() {} // build method
      EntityType.BlankLine,               // line #12:
      EntityType.StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      EntityType.StaticPrivateVariable,   // line #14:
      EntityType.StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      EntityType.StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      EntityType.BlankLine,               // line #17:
      EntityType.MultiLineComment,        // line #18:   /* This is a
      EntityType.MultiLineComment,        // line #19:    * random multi-
      EntityType.MultiLineComment,        // line #20:    * line comment
      EntityType.MultiLineComment,        // line #21:    * somewhere in the middle
      EntityType.MultiLineComment,        // line #22:    * of the class */
      EntityType.BlankLine,               // line #23:
      EntityType.StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      EntityType.StaticPrivateVariable,   // line #25:   static double _spvni = 0;
      EntityType.PrivateInstanceVariable, // line #26:   int _pvini = 1;
      EntityType.StaticVariable,          // line #27:   static int sv = 0;
      EntityType.InstanceVariable,        // line #28:   int v = 2;
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
      EntityType.StaticVariable,          // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      EntityType.StaticVariable,          // line #41:   /*
      EntityType.StaticVariable,          // line #42:     '''
      EntityType.StaticVariable,          // line #43:     """
      EntityType.StaticVariable,          // line #44:     //
      EntityType.StaticVariable,          // line #45:   */
      EntityType.StaticVariable,          // line #46:   static const a = """;
      EntityType.StaticVariable,          // line #47:    '${b};
      EntityType.StaticVariable,          // line #48:    ''' ;
      EntityType.StaticVariable,          // line #49:   """;
      EntityType.StaticVariable,          // line #50:   static const b = ''';
      EntityType.StaticVariable,          // line #51:     {  (  ))) """ {{{} ))));
      EntityType.StaticVariable,          // line #52:   ''';
      EntityType.StaticVariable,          // line #53:   static const c = { '{{{((... """ ${'((('};'};
      EntityType.BlankLine,               // line #54: }
    ]

    const err = wc.findFeatures()
    assert.strictEqual(err, null)

    assert.strictEqual(wc.lines.length, want.length, 'lines mismatch')

    wc.lines.forEach((line, i) => {
      assert.strictEqual(line.entityType, want[i], `entityType: line #${wzLineOffset + i + 1}: ${line.line}`)
    })
  })

  test('Multiple classes with comments', () => {
    const classA = `class ClassA {
  ClassA();
}`
    const classB = `/// ClassB comment1
/// ClassB comment2
class ClassB {
  ClassB();
}`
    const classC = `/* ClassC comment1
   ClassC comment2
   ClassC comment 3 */
class ClassC {
  ClassC._();

  static const String kColleted = 'Collected';
}`
    const classD = `@JsonSerializable()
class ClassD {
  ClassD();
}`
    const classE = `/// ClassE comment1
@reflectiveTest
class ClassE {
  ClassE();
}`
    const abstractClassF = `/// ClassF comment1
abstract class ClassF {
  ClassF();
}`
    const classG = `class _ClassG {
  _ClassG();
}`
    const mainFunc = `main() {
}`
    const randomStuff = `typedef DisposeHandler = Future Function();

Version _versionFromString(String input) =>
    input == null ? null : Version.parse(input);`
    const enumVehicle = `// from: https://dart.dev/guides/language/language-tour#enumerated-types
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int tires;
  final int passengers;
  final int carbonPerKilometer;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;
}`

    const tests = [
      {
        name: "sorted classes",
        parts: [mainFunc, randomStuff, enumVehicle, classA, classB, classC, classD, classE, abstractClassF, classG],
        processEnums: false,
        want: `main() {
}

typedef DisposeHandler = Future Function();

Version _versionFromString(String input) =>
    input == null ? null : Version.parse(input);

// from: https://dart.dev/guides/language/language-tour#enumerated-types
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int tires;
  final int passengers;
  final int carbonPerKilometer;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;
}

class ClassA {
  ClassA();
}

/// ClassB comment1
/// ClassB comment2
class ClassB {
  ClassB();
}

/* ClassC comment1
   ClassC comment2
   ClassC comment 3 */
class ClassC {
  ClassC._();

  static const String kColleted = 'Collected';
}

@JsonSerializable()
class ClassD {
  ClassD();
}

/// ClassE comment1
@reflectiveTest
class ClassE {
  ClassE();
}

/// ClassF comment1
abstract class ClassF {
  ClassF();
}

class _ClassG {
  _ClassG();
}`,
      },
      {
        name: "reversed classes",
        parts: [
          mainFunc,
          randomStuff,
          enumVehicle,
          classG,
          abstractClassF,
          classE,
          classD,
          classC,
          classB,
          classA,
        ],
        processEnums: false,
        want: `main() {
}

typedef DisposeHandler = Future Function();

Version _versionFromString(String input) =>
    input == null ? null : Version.parse(input);

// from: https://dart.dev/guides/language/language-tour#enumerated-types
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int tires;
  final int passengers;
  final int carbonPerKilometer;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;
}

class ClassA {
  ClassA();
}

/// ClassB comment1
/// ClassB comment2
class ClassB {
  ClassB();
}

/* ClassC comment1
   ClassC comment2
   ClassC comment 3 */
class ClassC {
  ClassC._();

  static const String kColleted = 'Collected';
}

@JsonSerializable()
class ClassD {
  ClassD();
}

/// ClassE comment1
@reflectiveTest
class ClassE {
  ClassE();
}

/// ClassF comment1
abstract class ClassF {
  ClassF();
}

class _ClassG {
  _ClassG();
}`,
      },

      {
        name: "sorted classes with enums",
        parts: [mainFunc, randomStuff, enumVehicle, classA, classB, classC, classD, classE, abstractClassF, classG],
        processEnums: true,
        want: `main() {
}

typedef DisposeHandler = Future Function();

Version _versionFromString(String input) =>
    input == null ? null : Version.parse(input);

// from: https://dart.dev/guides/language/language-tour#enumerated-types
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int carbonPerKilometer;
  final int passengers;
  final int tires;

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();
}

class ClassA {
  ClassA();
}

/// ClassB comment1
/// ClassB comment2
class ClassB {
  ClassB();
}

/* ClassC comment1
   ClassC comment2
   ClassC comment 3 */
class ClassC {
  ClassC._();

  static const String kColleted = 'Collected';
}

@JsonSerializable()
class ClassD {
  ClassD();
}

/// ClassE comment1
@reflectiveTest
class ClassE {
  ClassE();
}

/// ClassF comment1
abstract class ClassF {
  ClassF();
}

class _ClassG {
  _ClassG();
}`,
      },
      {
        name: "reversed classes with enums",
        parts: [
          mainFunc,
          randomStuff,
          enumVehicle,
          classG,
          abstractClassF,
          classE,
          classD,
          classC,
          classB,
          classA,
        ],
        processEnums: true,
        want: `main() {
}

typedef DisposeHandler = Future Function();

Version _versionFromString(String input) =>
    input == null ? null : Version.parse(input);

// from: https://dart.dev/guides/language/language-tour#enumerated-types
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int carbonPerKilometer;
  final int passengers;
  final int tires;

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();
}

class ClassA {
  ClassA();
}

/// ClassB comment1
/// ClassB comment2
class ClassB {
  ClassB();
}

/* ClassC comment1
   ClassC comment2
   ClassC comment 3 */
class ClassC {
  ClassC._();

  static const String kColleted = 'Collected';
}

@JsonSerializable()
class ClassD {
  ClassD();
}

/// ClassE comment1
@reflectiveTest
class ClassE {
  ClassE();
}

/// ClassF comment1
abstract class ClassF {
  ClassF();
}

class _ClassG {
  _ClassG();
}`,
      },
    ]


    for (let tt of tests) {
      const source = tt.parts.join("\n\n")
      const opts: Options = {
        MemberOrdering: defaultMemberOrdering,
        ProcessEnumsLikeClasses: tt.processEnums,
        SortClassesWithinFile: true,
      }

      console.log(`running sub-test: ${tt.name}`)
      runFullStylizer(opts, source, tt.want, [])
      // Run again to make sure no extra blank lines are added.
      runFullStylizer(opts, tt.want, tt.want, [])
    }
  })
})