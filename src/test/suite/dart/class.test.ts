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
import { Class } from '../../../dart/class'
import { defaultMemberOrdering, Client, Options } from '../../../dart/dart'
import { Editor } from '../../../dart/editor'
import { EntityType } from '../../../dart/entity'

export const runParsePhase = (opts: Options, source: string, want: EntityType[]): [Client, Class[]] => {
  let verbose = false
  const testOpts: Options = {
    GroupAndSortGetterMethods: false,
    MemberOrdering: defaultMemberOrdering,
    SortOtherMethods: false,
    Verbose: false,
  }
  if (opts !== null) {
    testOpts.GroupAndSortGetterMethods = opts.GroupAndSortGetterMethods
    testOpts.MemberOrdering = opts.MemberOrdering
    testOpts.SortOtherMethods = opts.SortOtherMethods
    verbose = opts.Verbose
  }

  const e = new Editor(source, verbose)

  const c: Client = { opts: testOpts }
  const [got, err] = e.getClasses(testOpts.GroupAndSortGetterMethods)
  if (err !== null) {
    throw err!
  }

  if (want.length > 0) {
    assert.strictEqual(got.length, 1, "getClasses")
    assert.strictEqual(got[0].lines.length, want.length, "getClasses lines")

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      // fmt.Printf("%v, // line #%v: %v\n", line.entityType, line.originalIndex+1, line.line)
      assert.strictEqual(line.entityType, want[i], `entitype: line #${line.originalIndex + 1}: ${line.line}`)
    }
  }

  return [c, got]
}

func runFullStylizer(t * testing.T, opts * Options, source, wantSource string, want[]EntityType)[] * Class {
  t.Helper()

  c, got := runParsePhase(t, opts, source, want)

  edits:= c.generateEdits(got)
  if len(want) > 0 {
    if want := 1; len(edits) != want {
      t.Errorf("got %v edits, want %v", len(edits), want)
    }
  }

  newBuf:= c.rewriteClasses(source, edits)
  gotLines:= strings.Split(newBuf, "\n")
  wantLines:= strings.Split(wantSource, "\n")
  if len(gotLines) != len(wantLines) {
    t.Errorf("rewriteClasses = %v lines, want %v lines", len(gotLines), len(wantLines))
    t.Errorf("rewriteClasses got:\n%v", newBuf)
  }

  for i := 0; i < len(gotLines); i++ {
    line:= strings.ReplaceAll(gotLines[i], "\r", "")
    if i < len(wantLines) && line != wantLines[i] {
      t.Errorf("line #%v: got:\n%v\nwant:\n%v", i + 1, line, wantLines[i])
    } else if i >= len(wantLines) {
      t.Errorf("line #%v: got:\n%v", i + 1, line)
    }
  }

  return got
}

func TestClassesAreFound(t * testing.T) {
  const source = `// test.dart
class myClass extends Widget {

}`

  want:= []EntityType{
    Unknown,
      BlankLine,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestMainHandler_NoFalsePositives(t * testing.T) {
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

  want:= []EntityType{
    Unknown,        // line #2: {
      StaticVariable, // line #3:   /**
      StaticVariable, // line #4:    * Parameters:
      StaticVariable, // line #5:    * 0: the token that was expected but not found
      StaticVariable, // line #6:    */
      StaticVariable, // line #7:   static const ScannerErrorCode EXPECTED_TOKEN =
      StaticVariable, // line #8:       const ScannerErrorCode('EXPECTED_TOKEN', "Expected to find '{0}'.");
      BlankLine,      // line #9:
      StaticVariable, // line #10:   /**
      StaticVariable, // line #11:    * Parameters:
      StaticVariable, // line #12:    * 0: the illegal character
      StaticVariable, // line #13:    */
      StaticVariable, // line #14:   static const ScannerErrorCode ILLEGAL_CHARACTER =
      StaticVariable, // line #15:       const ScannerErrorCode('ILLEGAL_CHARACTER', "Illegal character '{0}'.");
      BlankLine,      // line #16:
	}

  runParsePhase(t, nil, source, want)
}

func TestOverrideMethod(t * testing.T) {
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

  want:= []EntityType{
    Unknown,          // line #2: {
      OverrideVariable, // line #3:   /// If this expression is both in a getter and setter context, the
      OverrideVariable, // line #4:   /// [AuxiliaryElements] will be set to hold onto the static element from the
      OverrideVariable, // line #5:   /// getter context.
      OverrideVariable, // line #6:   @Deprecated('Use CompoundAssignmentExpression.readElement and/or '
      OverrideVariable, // line #7:       'CompoundAssignmentExpression.writeElement')
      OverrideVariable, // line #8:   @override
      OverrideVariable, // line #9:   AuxiliaryElements auxiliaryElements;
      BlankLine,        // line #10:
	}

  runParsePhase(t, nil, source, want)
}

func TestNamedConstructor(t * testing.T) {
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

  want:= []EntityType{
    Unknown,          // line #2: {
      OtherMethod,      // line #3:   void method_if_then_else(int? x) {
      OtherMethod,      // line #4:     if (x == null) {
      OtherMethod,      // line #5:       x;
      OtherMethod,      // line #6:     } else {
      OtherMethod,      // line #7:       /*nonNullable*/ x;
      OtherMethod,      // line #8:     }
      OtherMethod,      // line #9:   }
      BlankLine,        // line #10:
      NamedConstructor, // line #11:   C.constructor_if_then_else(int? x) {
      NamedConstructor, // line #12:     if (x == null) {
      NamedConstructor, // line #13:       x;
      NamedConstructor, // line #14:     } else {
      NamedConstructor, // line #15:       /*nonNullable*/ x;
      NamedConstructor, // line #16:     }
      NamedConstructor, // line #17:   }
      BlankLine,        // line #18:
      NamedConstructor, // line #11:   C.withDetails(this.callingMethod, this.code, this.message,
      NamedConstructor, // line #12:       {Object details})
      NamedConstructor, // line #13:       : data = details == null ? null : <String, dynamic>{} {
      NamedConstructor, // line #14:     if (details != null) {
      NamedConstructor, // line #15:       data['details'] = details;
      NamedConstructor, // line #16:     }
      NamedConstructor, // line #17:   }
      BlankLine,        // line #18:
	}

  runParsePhase(t, nil, source, want)
}

func TestNamedConstructorsAreKeptIntact(t * testing.T) {
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

  want:= []EntityType{
    Unknown,          // line #1: {
      NamedConstructor, // line #2: 	AnimationController.unbounded({
      NamedConstructor, // line #3: 	double value = 0.0,
      NamedConstructor, // line #4: 	this.duration,
      NamedConstructor, // line #5: 	this.debugLabel,
      NamedConstructor, // line #6: 	@required TickerProvider vsync,
      NamedConstructor, // line #7: 	this.animationBehavior = AnimationBehavior.preserve,
      NamedConstructor, // line #8: 	}) : assert(value != null),
      NamedConstructor, // line #9: 			assert(vsync != null),
      NamedConstructor, // line #10: 			lowerBound = double.negativeInfinity,
      NamedConstructor, // line #11: 			upperBound = double.infinity,
      NamedConstructor, // line #12: 			_direction = _AnimationDirection.forward {
      NamedConstructor, // line #13: 	_ticker = vsync.createTicker(_tick);
      NamedConstructor, // line #14: 	_internalSetValue(value);
      NamedConstructor, // line #15: 	}
      BlankLine,        // line #16:
	}

  runParsePhase(t, nil, source, want)
}

func TestPrivateConstructorsAreKeptIntact(t * testing.T) {
  const source = `class _InterpolationSimulation extends Simulation {
_InterpolationSimulation(this._begin, this._end, Duration duration, this._curve, double scale)
	: assert(_begin != null),
		assert(_end != null),
		assert(duration != null && duration.inMicroseconds > 0),
		_durationInSeconds = (duration.inMicroseconds * scale) / Duration.microsecondsPerSecond;
}`

  want:= []EntityType{
    Unknown,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestHandleOverriddenGettersWithBodies(t * testing.T) {
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

  want:= []EntityType{
    Unknown,        // line #1: {
      OverrideMethod, // line #2:   @override
      OverrideMethod, // line #3:   double get value {
      OverrideMethod, // line #4:     final Curve activeCurve = _useForwardCurve ? curve : reverseCurve;
      OverrideMethod, // line #5:
      OverrideMethod, // line #6:     final double t = parent.value;
      OverrideMethod, // line #7:     if (activeCurve == null) return t;
      OverrideMethod, // line #8:     if (t == 0.0 || t == 1.0) {
      OverrideMethod, // line #9:       assert(() {
      OverrideMethod, // line #10:         final double transformedValue = activeCurve.transform(t);
      OverrideMethod, // line #11:         final double roundedTransformedValue =
      OverrideMethod, // line #12:             transformedValue.round().toDouble();
      OverrideMethod, // line #13:         if (roundedTransformedValue != t) {
      OverrideMethod, // line #14:           throw FlutterError('Invalid curve endpoint at $t.\n'
      OverrideMethod, // line #15:               'Curves must map 0.0 to near zero and 1.0 to near one but '
      OverrideMethod, // line #16:               'is near $roundedTransformedValue.');
      OverrideMethod, // line #17:         }
      OverrideMethod, // line #18:         return true;
      OverrideMethod, // line #19:       }());
      OverrideMethod, // line #20:       return t;
      OverrideMethod, // line #21:     }
      OverrideMethod, // line #22:     return activeCurve.transform(t);
      OverrideMethod, // line #23:   }
      BlankLine,      // line #24:
      OverrideMethod, // line #25:   @override
      OverrideMethod, // line #26:   String toString() {
      OverrideMethod, // line #27:     if (reverseCurve == null) return '$parent\u27A9$curve';
      OverrideMethod, // line #28:     if (_useForwardCurve)
      OverrideMethod, // line #29:       return '$parent\u27A9$curve\u2092\u2099/$reverseCurve';
      OverrideMethod, // line #30:     return '$parent\u27A9$curve/$reverseCurve\u2092\u2099';
      OverrideMethod, // line #31:   }
      BlankLine,      // line #32: }`
	}

  runParsePhase(t, nil, source, want)
}

func TestIssue9_ConstructorFalsePositive(t * testing.T) {
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

  want:= []EntityType{
    Unknown,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      BlankLine,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      BlankLine,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      BlankLine,
      NamedConstructor,
      BlankLine,
      InstanceVariable,
      InstanceVariable,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestGetOnSeparateLine(t * testing.T) {
  source:= `class _LinkedNodeImpl extends Object
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
  wantSource:= `class _LinkedNodeImpl extends Object
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

  want:= []EntityType{
    Unknown,                 // line #1: {
      PrivateInstanceVariable, // line #2:   final fb.BufferContext _bc;
      PrivateInstanceVariable, // line #3:   final int _bcOffset;
      BlankLine,               // line #4:
      MainConstructor,         // line #5:   _LinkedNodeImpl(this._bc, this._bcOffset);
      BlankLine,               // line #6:
      OverrideMethod,          // line #7:   @override
      OverrideMethod,          // line #8:   idl.LinkedNodeTypeSubstitution
      OverrideMethod,          // line #9:       get redirectingConstructorInvocation_substitution {
      OverrideMethod,          // line #10:     assert(kind == idl.LinkedNodeKind.redirectingConstructorInvocation);
      OverrideMethod,          // line #11:     _variantField_38 ??= const _LinkedNodeTypeSubstitutionReader()
      OverrideMethod,          // line #12:         .vTableGet(_bc, _bcOffset, 38, null);
      OverrideMethod,          // line #13:     return _variantField_38;
      OverrideMethod,          // line #14:   }
      BlankLine,               // line #15:
	}

  runFullStylizer(t, nil, source, wantSource, want)
  // Run again to make sure no extra blank lines are added.
  runFullStylizer(t, nil, wantSource, wantSource, nil)
}

func TestOperatorOverrides(t * testing.T) {
  source:= `class Op {
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

  want:= []EntityType{
    Unknown,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestMarkMethodOffsetAlignment(t * testing.T) {
  source:= `class MarkMethod {
  @override
  // TODO(gmlewis) Implement this by looking in the BUILD file for 'deps'
  //  lists.
  Map<String, List<Folder>> packagesAvailableTo(String libraryPath) =>
      <String, List<Folder>>{};
}`

  want:= []EntityType{
    Unknown,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestMultipleDecorators(t * testing.T) {
  source:= `class MultipleDecorators {
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

  want:= []EntityType{
    Unknown,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
      OverrideMethod,
      BlankLine,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
      InstanceVariable,
      InstanceVariable,
      InstanceVariable,
      InstanceVariable,
      InstanceVariable,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestWhiteSpaceAfterFunctionNames(t * testing.T) {
  source:= `class C {
  @override Widget build ( BuildContext context ) { }
	myFunc                 () => null;
}`

  want:= []EntityType{
    Unknown,
      BuildMethod,
      OtherMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestEmbeddedMultilineComments(t * testing.T) {
  source:= `class C {
  dynamic /*member: C.x:assigned={a}*/ x = /*declared={a, b}*/ (int a, int b) {
    a = 0;
  };
}`

  want:= []EntityType{
    Unknown,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

//go:embed testfiles/basic_classes_default_order.txt
var basicClassesDefaultOrder string

func TestIssue11_RunWithDefaultMemberOrdering(t * testing.T) {
  source:= basicClasses
  wantSource:= basicClassesDefaultOrder

  want:= []EntityType{
    Unknown,                 // line #7: class Class1 {
      PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      BuildMethod,             // line #10:   @override
      BuildMethod,             // line #11:   build() {} // build method
      BlankLine,               // line #12:
      StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      StaticPrivateVariable,   // line #14:
      StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      BlankLine,               // line #17:
      MultiLineComment,        // line #18:   /* This is a
      MultiLineComment,        // line #19:    * random multi-
      MultiLineComment,        // line #20:    * line comment
      MultiLineComment,        // line #21:    * somewhere in the middle
      MultiLineComment,        // line #22:    * of the class */
      BlankLine,               // line #23:
      StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      StaticPrivateVariable,   // line #25:   static double _spvni = 0;
      PrivateInstanceVariable, // line #26:   int _pvini = 1;
      StaticVariable,          // line #27:   static int sv = 0;
      InstanceVariable,        // line #28:   int v = 2;
      InstanceVariable,        // line #29:   final double fv = 42.0;
      MainConstructor,         // line #30:   Class1();
      NamedConstructor,        // line #31:   Class1.fromNum();
      OtherMethod,             // line #32:   var myfunc = (int n) => n;
      OtherMethod,             // line #33:   get vv => v; // getter
      OverrideMethod,          // line #34:   @override
      OverrideMethod,          // line #35:   toString() {
      OverrideMethod,          // line #36:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      OverrideMethod,          // line #37:     return '';
      OverrideMethod,          // line #38:   }
      BlankLine,               // line #39:
      StaticVariable,          // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      StaticVariable,          // line #41:   /*
      StaticVariable,          // line #42:     '''
      StaticVariable,          // line #43:     """
      StaticVariable,          // line #44:     //
      StaticVariable,          // line #45:   */
      StaticVariable,          // line #46:   static const a = """;
      StaticVariable,          // line #47:    '${b};
      StaticVariable,          // line #48:    ''' ;
      StaticVariable,          // line #49:   """;
      StaticVariable,          // line #50:   static const b = ''';
      StaticVariable,          // line #51:     {  (  ))) """ {{{} ))));
      StaticVariable,          // line #52:   ''';
      StaticVariable,          // line #53:   static const c = {'{{{((... """ ${'((('};'};
      BlankLine,               // line #54: }
	}

  runFullStylizer(t, nil, source, wantSource, want)
}

//go:embed testfiles/basic_classes_custom_order.txt
var basicClassesCustomOrder string

func TestIssue11_RunWithCustomMemberOrdering(t * testing.T) {
  source:= basicClasses
  wantSource:= basicClassesCustomOrder

  want:= []EntityType{
    Unknown,                 // line #1: {
      PrivateInstanceVariable, // line #2:   // _pvi is a private instance variable.
      PrivateInstanceVariable, // line #3:   List<String> _pvi = ['one', 'two'];
      BuildMethod,             // line #4:   @override
      BuildMethod,             // line #5:   build() {} // build method
      BlankLine,               // line #6:
      StaticPrivateVariable,   // line #7:   // This is a random single-line comment somewhere in the class.
      StaticPrivateVariable,   // line #8:
      StaticPrivateVariable,   // line #9:   // _spv is a static private variable.
      StaticPrivateVariable,   // line #10:   static final String _spv = 'spv';
      BlankLine,               // line #11:
      MultiLineComment,        // line #12:   /* This is a
      MultiLineComment,        // line #13:    * random multi-
      MultiLineComment,        // line #14:    * line comment
      MultiLineComment,        // line #15:    * somewhere in the middle
      MultiLineComment,        // line #16:    * of the class */
      BlankLine,               // line #17:
      StaticPrivateVariable,   // line #18:   // _spvni is a static private variable with no initializer.
      StaticPrivateVariable,   // line #19:   static double _spvni = 0;
      PrivateInstanceVariable, // line #20:   int _pvini = 1;
      StaticVariable,          // line #21:   static int sv = 0;
      InstanceVariable,        // line #22:   int v = 2;
      InstanceVariable,        // line #23:   final double fv = 42.0;
      MainConstructor,         // line #24:   Class1();
      NamedConstructor,        // line #25:   Class1.fromNum();
      OtherMethod,             // line #26:   var myfunc = (int n) => n;
      OtherMethod,             // line #27:   get vv => v; // getter
      OverrideMethod,          // line #28:   @override
      OverrideMethod,          // line #29:   toString() {
      OverrideMethod,          // line #30:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      OverrideMethod,          // line #31:     return '';
      OverrideMethod,          // line #32:   }
      BlankLine,               // line #33:
      StaticVariable,          // line #34:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      StaticVariable,          // line #35:   /*
      StaticVariable,          // line #36:     '''
      StaticVariable,          // line #37:     """
      StaticVariable,          // line #38:     //
      StaticVariable,          // line #39:   */
      StaticVariable,          // line #40:   static const a = """;
      StaticVariable,          // line #41:    '${b};
      StaticVariable,          // line #42:    ''' ;
      StaticVariable,          // line #43:   """;
      StaticVariable,          // line #44:   static const b = ''';
      StaticVariable,          // line #45:     {  (  ))) """ {{{} ))));
      StaticVariable,          // line #46:   ''';
      StaticVariable,          // line #47:   static const c = {'{{{((... """ ${'((('};'};
      BlankLine,               // line #48:
	}

  opts:= & Options{
    MemberOrdering: []string{
      "public-constructor",
        "named-constructors",
        "public-static-variables",
        "public-instance-variables",
        "public-override-variables",
        "public-override-methods",
        "public-other-methods",
        "private-static-variables",
        "private-instance-variables",
        "build-method",
		},
  }

  runFullStylizer(t, opts, source, wantSource, want)
}

func TestIssue16SupportNewPublicOverrideVariablesFeature(t * testing.T) {
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

  want:= []EntityType{
    Unknown,
      InstanceVariable,
      InstanceVariable,
      InstanceVariable,
      BlankLine,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      BlankLine,
      OverrideVariable,
      OverrideVariable,
      BlankLine,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      OverrideMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

func TestIssue17FunctionTypeVariableIsNotAFunction(t * testing.T) {
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
  want:= []EntityType{
    Unknown,
      InstanceVariable,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runParsePhase(t, nil, source, want)
}

//go:embed testfiles/issue18.dart.txt
var issue18_dart_txt string

//go:embed testfiles/issue18_case1.txt
var issue18_case1_txt string

//go:embed testfiles/issue18_case2.txt
var issue18_case2_txt string

//go:embed testfiles/issue18_case3.txt
var issue18_case3_txt string

//go:embed testfiles/issue18_case4.txt
var issue18_case4_txt string

func TestIssue18Case1(t * testing.T) {
  const groupAndSortGetterMethods = false
  const sortOtherMethods = false
  source:= issue18_dart_txt
  wantSource:= issue18_case1_txt

  opts:= & Options{
    GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
        SortOtherMethods: sortOtherMethods,
	}

  want:= []EntityType{
    Unknown,
      PrivateInstanceVariable,
      BlankLine,
      MainConstructor,
      BlankLine,
      OtherMethod,
      BlankLine,
      PrivateInstanceVariable,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runFullStylizer(t, opts, source, wantSource, want)
}

func TestIssue18Case2(t * testing.T) {
  const groupAndSortGetterMethods = false
  const sortOtherMethods = true
  source:= issue18_dart_txt
  wantSource:= issue18_case2_txt

  opts:= & Options{
    GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
        SortOtherMethods: sortOtherMethods,
	}

  want:= []EntityType{
    Unknown,
      PrivateInstanceVariable,
      BlankLine,
      MainConstructor,
      BlankLine,
      OtherMethod,
      BlankLine,
      PrivateInstanceVariable,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runFullStylizer(t, opts, source, wantSource, want)
}

func TestIssue18Case3(t * testing.T) {
  const groupAndSortGetterMethods = true
  const sortOtherMethods = false
  source:= issue18_dart_txt
  wantSource:= issue18_case3_txt

  opts:= & Options{
    GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
        SortOtherMethods: sortOtherMethods,
	}

  want:= []EntityType{
    Unknown,
      PrivateInstanceVariable,
      BlankLine,
      MainConstructor,
      BlankLine,
      GetterMethod,
      BlankLine,
      PrivateInstanceVariable,
      BlankLine,
      OtherMethod,
      BlankLine,
      GetterMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runFullStylizer(t, opts, source, wantSource, want)
}

func TestIssue18Case4(t * testing.T) {
  const groupAndSortGetterMethods = true
  const sortOtherMethods = true
  source:= issue18_dart_txt
  wantSource:= issue18_case4_txt

  opts:= & Options{
    GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
        SortOtherMethods: sortOtherMethods,
	}

  want:= []EntityType{
    Unknown,
      PrivateInstanceVariable,
      BlankLine,
      MainConstructor,
      BlankLine,
      GetterMethod,
      BlankLine,
      PrivateInstanceVariable,
      BlankLine,
      OtherMethod,
      BlankLine,
      GetterMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
      OtherMethod,
      BlankLine,
      OtherMethod,
      OtherMethod,
      OtherMethod,
      BlankLine,
	}

  runFullStylizer(t, opts, source, wantSource, want)
}

//go:embed testfiles/issue19.dart.txt
var issue19_dart_txt string

//go:embed testfiles/issue19_want.txt
var issue19_want_txt string

func TestIssue19_FactoryConstructorShouldNotBeDuplicated(t * testing.T) {
  const groupAndSortGetterMethods = true
  const sortOtherMethods = true
  source:= issue19_dart_txt
  wantSource:= issue19_want_txt

  opts:= & Options{
    GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: defaultMemberOrdering,
        SortOtherMethods: sortOtherMethods,
	}

  want:= []EntityType{
    Unknown,
      InstanceVariable,
      InstanceVariable,
      InstanceVariable,
      BlankLine,
      MainConstructor,
      MainConstructor,
      MainConstructor,
      BlankLine,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      NamedConstructor,
      BlankLine,
	}

  runFullStylizer(t, opts, source, wantSource, want)
}

func TestFindFeatures_linux_mac(t * testing.T) {
  bc, bcLineOffset, bcOCO, bcCCO := setupEditor(t, "class Class1 {", basicClasses)

  uc:= NewClass(bc, "Class1", bcOCO, bcCCO, false)

  want:= []EntityType{
    Unknown,                 // line #7: class Class1 {
      PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      BuildMethod,             // line #10:   @override
      BuildMethod,             // line #11:   build() {} // build method
      BlankLine,               // line #12:
      StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      StaticPrivateVariable,   // line #14:
      StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      BlankLine,               // line #17:
      MultiLineComment,        // line #18:   /* This is a
      MultiLineComment,        // line #19:    * random multi-
      MultiLineComment,        // line #20:    * line comment
      MultiLineComment,        // line #21:    * somewhere in the middle
      MultiLineComment,        // line #22:    * of the class */
      BlankLine,               // line #23:
      StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      StaticPrivateVariable,   // line #25:   static double _spvni = 0;
      PrivateInstanceVariable, // line #26:   int _pvini = 1;
      StaticVariable,          // line #27:   static int sv = 0;
      InstanceVariable,        // line #28:   int v = 2;
      InstanceVariable,        // line #29:   final double fv = 42.0;
      MainConstructor,         // line #30:   Class1();
      NamedConstructor,        // line #31:   Class1.fromNum();
      OtherMethod,             // line #32:   var myfunc = (int n) => n;
      OtherMethod,             // line #33:   get vv => v; // getter
      OverrideMethod,          // line #34:   @override
      OverrideMethod,          // line #35:   toString() {
      OverrideMethod,          // line #36:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      OverrideMethod,          // line #37:     return '';
      OverrideMethod,          // line #38:   }
      BlankLine,               // line #39:
      StaticVariable,          // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      StaticVariable,          // line #41:   /*
      StaticVariable,          // line #42:     '''
      StaticVariable,          // line #43:     """
      StaticVariable,          // line #44:     //
      StaticVariable,          // line #45:   */
      StaticVariable,          // line #46:   static const a = """;
      StaticVariable,          // line #47:    '${b};
      StaticVariable,          // line #48:    ''' ;
      StaticVariable,          // line #49:   """;
      StaticVariable,          // line #50:   static const b = ''';
      StaticVariable,          // line #51:     {  (  ))) """ {{{} ))));
      StaticVariable,          // line #52:   ''';
      StaticVariable,          // line #53:   static const c = { '{{{((... """ ${'((('};'};
      BlankLine,               // line #54: }
	}

  t.Run("*nix file", func(t * testing.T) {
    if err := uc.FindFeatures(); err !== null) {
    t.Fatalf("FindFeatures: %v", err)
  }

  if len(uc.lines) != len(want) {
    t.Fatalf("lines mismatch: got = %v, want %v", len(uc.lines), len(want))
  }

  for i, line := range uc.lines {
    // fmt.Printf("%v, // line #%v: %v\n", line.entityType, i+1, line.line)
    if line.entityType != want[i] {
      t.Errorf("line #%v: entityType = %v, want %v", bcLineOffset + i + 1, line.entityType, want[i])
    }
  }
})
}

func TestFindFeatures_windoze(t * testing.T) {
  wz, wzLineOffset, wzOCO, wzCCO := setupEditor(t, "class Class1 {", bcWindoze)

  wc:= NewClass(wz, "Class1", wzOCO, wzCCO, false)

  want:= []EntityType{
    Unknown,                 // line #7: class Class1 {
      PrivateInstanceVariable, // line #8:   // _pvi is a private instance variable.
      PrivateInstanceVariable, // line #9:   List<String> _pvi = ['one', 'two'];
      BuildMethod,             // line #10:   @override
      BuildMethod,             // line #11:   build() {} // build method
      BlankLine,               // line #12:
      StaticPrivateVariable,   // line #13:   // This is a random single-line comment somewhere in the class.
      StaticPrivateVariable,   // line #14:
      StaticPrivateVariable,   // line #15:   // _spv is a static private variable.
      StaticPrivateVariable,   // line #16:   static final String _spv = 'spv';
      BlankLine,               // line #17:
      MultiLineComment,        // line #18:   /* This is a
      MultiLineComment,        // line #19:    * random multi-
      MultiLineComment,        // line #20:    * line comment
      MultiLineComment,        // line #21:    * somewhere in the middle
      MultiLineComment,        // line #22:    * of the class */
      BlankLine,               // line #23:
      StaticPrivateVariable,   // line #24:   // _spvni is a static private variable with no initializer.
      StaticPrivateVariable,   // line #25:   static double _spvni = 0;
      PrivateInstanceVariable, // line #26:   int _pvini = 1;
      StaticVariable,          // line #27:   static int sv = 0;
      InstanceVariable,        // line #28:   int v = 2;
      InstanceVariable,        // line #29:   final double fv = 42.0;
      MainConstructor,         // line #30:   Class1();
      NamedConstructor,        // line #31:   Class1.fromNum();
      OtherMethod,             // line #32:   var myfunc = (int n) => n;
      OtherMethod,             // line #33:   get vv => v; // getter
      OverrideMethod,          // line #34:   @override
      OverrideMethod,          // line #35:   toString() {
      OverrideMethod,          // line #36:     print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
      OverrideMethod,          // line #37:     return '';
      OverrideMethod,          // line #38:   }
      BlankLine,               // line #39:
      StaticVariable,          // line #40:   // "Here is 'where we add ${ text to "trip 'up' ''' the ${dart parser}.
      StaticVariable,          // line #41:   /*
      StaticVariable,          // line #42:     '''
      StaticVariable,          // line #43:     """
      StaticVariable,          // line #44:     //
      StaticVariable,          // line #45:   */
      StaticVariable,          // line #46:   static const a = """;
      StaticVariable,          // line #47:    '${b};
      StaticVariable,          // line #48:    ''' ;
      StaticVariable,          // line #49:   """;
      StaticVariable,          // line #50:   static const b = ''';
      StaticVariable,          // line #51:     {  (  ))) """ {{{} ))));
      StaticVariable,          // line #52:   ''';
      StaticVariable,          // line #53:   static const c = { '{{{((... """ ${'((('};'};
      BlankLine,               // line #54: }
	}

  t.Run("windoze file", func(t * testing.T) {
    if err := wc.FindFeatures(); err !== null) {
    t.Fatalf("FindFeatures: %v", err)
  }

  if len(wc.lines) != len(want) {
    t.Fatalf("lines mismatch: got = %v, want %v", len(wc.lines), len(want))
  }

  for i, line := range wc.lines {
    // fmt.Printf("%v, // line #%v: %v\n", line.entityType, i+1, line.line)
    if line.entityType != want[i] {
      t.Errorf("line #%v: entityType = %v, want %v", wzLineOffset + i + 1, line.entityType, want[i])
    }
  }
})
}
