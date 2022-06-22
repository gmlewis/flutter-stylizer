/*
Copyright © 2022 Glenn M. Lewis

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

import { findSequenceAndLeadingText } from '../../../dart/class'

suite('Class Features Tests', () => {
  test('Sequence and Leading Text are found from Features', () => {
    const tests = [
      {
        features: `static SemanticsBinding? get instance => _instance;`,
        sequence: "=>;",
        leadingText: "static SemanticsBinding? get instance",
      },
      {
        features: `static SemanticsBinding? _instance;`,
        sequence: ";",
        leadingText: "static SemanticsBinding? _instance",
      },
      {
        features: `void handleAccessibilityFeaturesChanged() {  }`,
        sequence: "(){}",
        leadingText: "void handleAccessibilityFeaturesChanged",
      },
      {
        features: `ui.SemanticsUpdateBuilder createSemanticsUpdateBuilder() {  }`,
        sequence: "(){}",
        leadingText: "ui.SemanticsUpdateBuilder createSemanticsUpdateBuilder",
      },
      {
        features: `ui.AccessibilityFeatures get accessibilityFeatures => _accessibilityFeatures;`,
        sequence: "=>;",
        leadingText: "ui.AccessibilityFeatures get accessibilityFeatures",
      },
      {
        features: `late ui.AccessibilityFeatures _accessibilityFeatures;`,
        sequence: ";",
        leadingText: "late ui.AccessibilityFeatures _accessibilityFeatures",
      },
      {
        features: `bool get disableAnimations {        }`,
        sequence: "{}",
        leadingText: "bool get disableAnimations",
      },
      {
        features: `final String name;`,
        sequence: ";",
        leadingText: "final String name",
      },
      {
        features: `final bool useNameForMissingBlock;`,
        sequence: ";",
        leadingText: "final bool useNameForMissingBlock",
      },
      {
        features: `String get missingBlockName => useNameForMissingBlock ? name : null;`,
        sequence: "=>;",
        leadingText: "String get missingBlockName",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static const BlockKind catchClause = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind catchClause",
      },
      {
        features: `static const BlockKind classDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind classDeclaration",
      },
      {
        features: `static const BlockKind enumDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind enumDeclaration",
      },
      {
        features: `static const BlockKind extensionDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind extensionDeclaration",
      },
      {
        features: `static const BlockKind finallyClause = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind finallyClause",
      },
      {
        features: `static const BlockKind functionBody = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind functionBody",
      },
      {
        features: `static const BlockKind invalid = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind invalid",
      },
      {
        features: `static const BlockKind mixinDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind mixinDeclaration",
      },
      {
        features: `static const BlockKind statement = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind statement",
      },
      {
        features: `static const BlockKind switchStatement = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind switchStatement",
      },
      {
        features: `static const BlockKind tryStatement = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind tryStatement",
      },
      {
        features: `static const BlockKind catchClause = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind catchClause",
      },
      {
        features: `static const BlockKind classDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind classDeclaration",
      },
      {
        features: `static const BlockKind enumDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind enumDeclaration",
      },
      {
        features: `static const BlockKind extensionDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind extensionDeclaration",
      },
      {
        features: `static const BlockKind finallyClause = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind finallyClause",
      },
      {
        features: `static const BlockKind functionBody = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind functionBody",
      },
      {
        features: `static const BlockKind invalid = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind invalid",
      },
      {
        features: `static const BlockKind mixinDeclaration = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind mixinDeclaration",
      },
      {
        features: `static const BlockKind statement = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind statement",
      },
      {
        features: `static const BlockKind switchStatement = const BlockKind._( );`,
        sequence: "=();",
        leadingText: "static const BlockKind switchStatement",
      },
      {
        features: `static const BlockKind tryStatement = const BlockKind._();`,
        sequence: "=();",
        leadingText: "static const BlockKind tryStatement",
      },
      {
        features: `final String name;`,
        sequence: ";",
        leadingText: "final String name",
      },
      {
        features: `final bool useNameForMissingBlock;`,
        sequence: ";",
        leadingText: "final bool useNameForMissingBlock",
      },
      {
        features: `String get missingBlockName => useNameForMissingBlock ? name : null;`,
        sequence: "=>;",
        leadingText: "String get missingBlockName",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static const ScannerErrorCode EXPECTED_TOKEN = const ScannerErrorCode();`,
        sequence: "=();",
        leadingText: "static const ScannerErrorCode EXPECTED_TOKEN",
      },
      {
        features: `static const ScannerErrorCode ILLEGAL_CHARACTER = const ScannerErrorCode();`,
        sequence: "=();",
        leadingText: "static const ScannerErrorCode ILLEGAL_CHARACTER",
      },
      {
        features: `void method_if_then_else() {      }`,
        sequence: "(){}",
        leadingText: "void method_if_then_else",
      },
      {
        features: `bool isInfinity = false;`,
        sequence: "=;",
        leadingText: "bool isInfinity",
      },
      {
        features: `DateTime value;`,
        sequence: ";",
        leadingText: "DateTime value",
      },
      {
        features: `static PGDateTime parse() => formattedString == '' ? PGDateTime.infinity() : PGDateTime();`,
        sequence: "()=>==()();",
        leadingText: "static PGDateTime parse",
      },
      {
        features: `final fb.BufferContext _bc;`,
        sequence: ";",
        leadingText: "final fb.BufferContext _bc",
      },
      {
        features: `final int _bcOffset;`,
        sequence: ";",
        leadingText: "final int _bcOffset",
      },
      {
        features: `final fb.BufferContext _bc;`,
        sequence: ";",
        leadingText: "final fb.BufferContext _bc",
      },
      {
        features: `final int _bcOffset;`,
        sequence: ";",
        leadingText: "final int _bcOffset",
      },
      {
        features: `final String do_not_use;`,
        sequence: ";",
        leadingText: "final String do_not_use",
      },
      {
        features: `myFunc                 () => null;`,
        sequence: "()=>;",
        leadingText: "myFunc",
      },
      {
        features: `dynamic  x =  () {  }`,
        sequence: "=(){}",
        leadingText: "dynamic  x",
      },
      {
        features: `List<String> _pvi = ['', ''];`,
        sequence: "=[];",
        leadingText: "List<String> _pvi",
      },
      {
        features: `static final String _spv = '';`,
        sequence: "=;",
        leadingText: "static final String _spv",
      },
      {
        features: `static double _spvni = 0;`,
        sequence: "=;",
        leadingText: "static double _spvni",
      },
      {
        features: `int _pvini = 1;`,
        sequence: "=;",
        leadingText: "int _pvini",
      },
      {
        features: `static int sv = 0;`,
        sequence: "=;",
        leadingText: "static int sv",
      },
      {
        features: `int v = 2;`,
        sequence: "=;",
        leadingText: "int v",
      },
      {
        features: `final double fv = 42.0;`,
        sequence: "=;",
        leadingText: "final double fv",
      },
      {
        features: `var myfunc = () => n;`,
        sequence: "=()=>;",
        leadingText: "var myfunc",
      },
      {
        features: `get vv => v;`,
        sequence: "=>;",
        leadingText: "get vv",
      },
      {
        features: `static const a = """   """;`,
        sequence: "=;",
        leadingText: "static const a",
      },
      {
        features: `static const b = '''  ''';`,
        sequence: "=;",
        leadingText: "static const b",
      },
      {
        features: `static const c = {}`,
        sequence: "={}",
        leadingText: "static const c",
      },
      {
        features: `List<String> _pvi = ['', ''];`,
        sequence: "=[];",
        leadingText: "List<String> _pvi",
      },
      {
        features: `static final String _spv = '';`,
        sequence: "=;",
        leadingText: "static final String _spv",
      },
      {
        features: `static double _spvni = 0;`,
        sequence: "=;",
        leadingText: "static double _spvni",
      },
      {
        features: `int _pvini = 1;`,
        sequence: "=;",
        leadingText: "int _pvini",
      },
      {
        features: `static int sv = 0;`,
        sequence: "=;",
        leadingText: "static int sv",
      },
      {
        features: `int v = 2;`,
        sequence: "=;",
        leadingText: "int v",
      },
      {
        features: `final double fv = 42.0;`,
        sequence: "=;",
        leadingText: "final double fv",
      },
      {
        features: `var myfunc = () => n;`,
        sequence: "=()=>;",
        leadingText: "var myfunc",
      },
      {
        features: `get vv => v;`,
        sequence: "=>;",
        leadingText: "get vv",
      },
      {
        features: `static const a = """   """;`,
        sequence: "=;",
        leadingText: "static const a",
      },
      {
        features: `static const b = '''  ''';`,
        sequence: "=;",
        leadingText: "static const b",
      },
      {
        features: `static const c = {}`,
        sequence: "={}",
        leadingText: "static const c",
      },
      {
        features: `final String displayName;`,
        sequence: ";",
        leadingText: "final String displayName",
      },
      {
        features: `final ChatText? lastText;`,
        sequence: ";",
        leadingText: "final ChatText? lastText",
      },
      {
        features: `final List<User> users;`,
        sequence: ";",
        leadingText: "final List<User> users",
      },
      {
        features: `final String Function() functionName;`,
        sequence: ";",
        leadingText: "final String Function() functionName",
      },
      {
        features: `String fun(){  }`,
        sequence: "(){}",
        leadingText: "String fun",
      },
      {
        features: `Function makeAdder() {  }`,
        sequence: "(){}",
        leadingText: "Function makeAdder",
      },
      {
        features: `double _aBalance;`,
        sequence: ";",
        leadingText: "double _aBalance",
      },
      {
        features: `double get aBalance => _aBalance;`,
        sequence: "=>;",
        leadingText: "double get aBalance",
      },
      {
        features: `double _balance;`,
        sequence: ";",
        leadingText: "double _balance",
      },
      {
        features: `void utility() {}`,
        sequence: "(){}",
        leadingText: "void utility",
      },
      {
        features: `double get balance => _balance;`,
        sequence: "=>;",
        leadingText: "double get balance",
      },
      {
        features: `bool isValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isValid",
      },
      {
        features: `void printer() {}`,
        sequence: "(){}",
        leadingText: "void printer",
      },
      {
        features: `bool isNotValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isNotValid",
      },
      {
        features: `double _aBalance;`,
        sequence: ";",
        leadingText: "double _aBalance",
      },
      {
        features: `double get aBalance => _aBalance;`,
        sequence: "=>;",
        leadingText: "double get aBalance",
      },
      {
        features: `double _balance;`,
        sequence: ";",
        leadingText: "double _balance",
      },
      {
        features: `void utility() {}`,
        sequence: "(){}",
        leadingText: "void utility",
      },
      {
        features: `double get balance => _balance;`,
        sequence: "=>;",
        leadingText: "double get balance",
      },
      {
        features: `bool isValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isValid",
      },
      {
        features: `void printer() {}`,
        sequence: "(){}",
        leadingText: "void printer",
      },
      {
        features: `bool isNotValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isNotValid",
      },
      {
        features: `double _aBalance;`,
        sequence: ";",
        leadingText: "double _aBalance",
      },
      {
        features: `double get aBalance => _aBalance;`,
        sequence: "=>;",
        leadingText: "double get aBalance",
      },
      {
        features: `double _balance;`,
        sequence: ";",
        leadingText: "double _balance",
      },
      {
        features: `void utility() {}`,
        sequence: "(){}",
        leadingText: "void utility",
      },
      {
        features: `double get balance => _balance;`,
        sequence: "=>;",
        leadingText: "double get balance",
      },
      {
        features: `bool isValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isValid",
      },
      {
        features: `void printer() {}`,
        sequence: "(){}",
        leadingText: "void printer",
      },
      {
        features: `bool isNotValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isNotValid",
      },
      {
        features: `double _aBalance;`,
        sequence: ";",
        leadingText: "double _aBalance",
      },
      {
        features: `double get aBalance => _aBalance;`,
        sequence: "=>;",
        leadingText: "double get aBalance",
      },
      {
        features: `double _balance;`,
        sequence: ";",
        leadingText: "double _balance",
      },
      {
        features: `void utility() {}`,
        sequence: "(){}",
        leadingText: "void utility",
      },
      {
        features: `double get balance => _balance;`,
        sequence: "=>;",
        leadingText: "double get balance",
      },
      {
        features: `bool isValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isValid",
      },
      {
        features: `void printer() {}`,
        sequence: "(){}",
        leadingText: "void printer",
      },
      {
        features: `bool isNotValid() {  }`,
        sequence: "(){}",
        leadingText: "bool isNotValid",
      },
      {
        features: `final int modifiedObjectToken;`,
        sequence: ";",
        leadingText: "final int modifiedObjectToken",
      },
      {
        features: `final int attributeType;`,
        sequence: ";",
        leadingText: "final int attributeType",
      },
      {
        features: `final Uint8List signatureBlob;`,
        sequence: ";",
        leadingText: "final Uint8List signatureBlob",
      },
      {
        features: `List<String> _pvi = ['', ''];`,
        sequence: "=[];",
        leadingText: "List<String> _pvi",
      },
      {
        features: `static final String _spv = '';`,
        sequence: "=;",
        leadingText: "static final String _spv",
      },
      {
        features: `static double _spvni = 0;`,
        sequence: "=;",
        leadingText: "static double _spvni",
      },
      {
        features: `int _pvini = 1;`,
        sequence: "=;",
        leadingText: "int _pvini",
      },
      {
        features: `static int sv = 0;`,
        sequence: "=;",
        leadingText: "static int sv",
      },
      {
        features: `int v = 2;`,
        sequence: "=;",
        leadingText: "int v",
      },
      {
        features: `final double fv = 42.0;`,
        sequence: "=;",
        leadingText: "final double fv",
      },
      {
        features: `var myfunc = () => n;`,
        sequence: "=()=>;",
        leadingText: "var myfunc",
      },
      {
        features: `get vv => v;`,
        sequence: "=>;",
        leadingText: "get vv",
      },
      {
        features: `static const a = """   """;`,
        sequence: "=;",
        leadingText: "static const a",
      },
      {
        features: `static const b = '''  ''';`,
        sequence: "=;",
        leadingText: "static const b",
      },
      {
        features: `static const c = {}`,
        sequence: "={}",
        leadingText: "static const c",
      },
      {
        features: `List<String> _pvi = ['', ''];`,
        sequence: "=[];",
        leadingText: "List<String> _pvi",
      },
      {
        features: `static final String _spv = '';`,
        sequence: "=;",
        leadingText: "static final String _spv",
      },
      {
        features: `static double _spvni = 0;`,
        sequence: "=;",
        leadingText: "static double _spvni",
      },
      {
        features: `int _pvini = 1;`,
        sequence: "=;",
        leadingText: "int _pvini",
      },
      {
        features: `static int sv = 0;`,
        sequence: "=;",
        leadingText: "static int sv",
      },
      {
        features: `int v = 2;`,
        sequence: "=;",
        leadingText: "int v",
      },
      {
        features: `final double fv = 42.0;`,
        sequence: "=;",
        leadingText: "final double fv",
      },
      {
        features: `var myfunc = () => n;`,
        sequence: "=()=>;",
        leadingText: "var myfunc",
      },
      {
        features: `get vv => v;`,
        sequence: "=>;",
        leadingText: "get vv",
      },
      {
        features: `static const a = """   """;`,
        sequence: "=;",
        leadingText: "static const a",
      },
      {
        features: `static const b = '''  ''';`,
        sequence: "=;",
        leadingText: "static const b",
      },
      {
        features: `static const c = {}`,
        sequence: "={}",
        leadingText: "static const c",
      },
      {
        features: `final Map<Node, AssignedVariablesNodeInfo<Variable>> _info = new Map<Node, AssignedVariablesNodeInfo<Variable>>.identity();`,
        sequence: "=();",
        leadingText: "final Map<Node, AssignedVariablesNodeInfo<Variable>> _info",
      },
      {
        features: `final AssignedVariablesNodeInfo<Variable> _anywhere = new AssignedVariablesNodeInfo<Variable>();`,
        sequence: "=();",
        leadingText: "final AssignedVariablesNodeInfo<Variable> _anywhere",
      },
      {
        features: `final List<AssignedVariablesNodeInfo<Variable>> _stack = [ new AssignedVariablesNodeInfo<Variable>() ];`,
        sequence: "=[()];",
        leadingText: "final List<AssignedVariablesNodeInfo<Variable>> _stack",
      },
      {
        features: `final Set<AssignedVariablesNodeInfo<Variable>> _deferredInfos = new Set<AssignedVariablesNodeInfo<Variable>>.identity();`,
        sequence: "=();",
        leadingText: "final Set<AssignedVariablesNodeInfo<Variable>> _deferredInfos",
      },
      {
        features: `void beginNode() {  }`,
        sequence: "(){}",
        leadingText: "void beginNode",
      },
      {
        features: `void declare() {  }`,
        sequence: "(){}",
        leadingText: "void declare",
      },
      {
        features: `AssignedVariablesNodeInfo<Variable> deferNode() {              }`,
        sequence: "(){}",
        leadingText: "AssignedVariablesNodeInfo<Variable> deferNode",
      },
      {
        features: `void discardNode() {      }`,
        sequence: "(){}",
        leadingText: "void discardNode",
      },
      {
        features: `void endNode() {  }`,
        sequence: "(){}",
        leadingText: "void endNode",
      },
      {
        features: `void finish() {               }`,
        sequence: "(){}",
        leadingText: "void finish",
      },
      {
        features: `void reassignInfo() {         }`,
        sequence: "(){}",
        leadingText: "void reassignInfo",
      },
      {
        features: `void storeInfo() {    }`,
        sequence: "(){}",
        leadingText: "void storeInfo",
      },
      {
        features: `String toString() {      }`,
        sequence: "(){}",
        leadingText: "String toString",
      },
      {
        features: `void write() {   }`,
        sequence: "(){}",
        leadingText: "void write",
      },
      {
        features: `AssignedVariablesNodeInfo<Variable> _getInfoForNode() {    }`,
        sequence: "(){}",
        leadingText: "AssignedVariablesNodeInfo<Variable> _getInfoForNode",
      },
      {
        features: `void _printOn() {    }`,
        sequence: "(){}",
        leadingText: "void _printOn",
      },
      {
        features: `Set<Variable> get capturedAnywhere => _anywhere._captured;`,
        sequence: "=>;",
        leadingText: "Set<Variable> get capturedAnywhere",
      },
      {
        features: `Set<Variable> get declaredAtTopLevel => _stack.first._declared;`,
        sequence: "=>;",
        leadingText: "Set<Variable> get declaredAtTopLevel",
      },
      {
        features: `Set<Variable> get writtenAnywhere => _anywhere._written;`,
        sequence: "=>;",
        leadingText: "Set<Variable> get writtenAnywhere",
      },
      {
        features: `Set<Variable> capturedInNode() => _getInfoForNode()._captured;`,
        sequence: "()=>();",
        leadingText: "Set<Variable> capturedInNode",
      },
      {
        features: `Set<Variable> declaredInNode() => _getInfoForNode()._declared;`,
        sequence: "()=>();",
        leadingText: "Set<Variable> declaredInNode",
      },
      {
        features: `bool isTracked() => _info.containsKey();`,
        sequence: "()=>();",
        leadingText: "bool isTracked",
      },
      {
        features: `String toString() {      }`,
        sequence: "(){}",
        leadingText: "String toString",
      },
      {
        features: `Set<Variable> writtenInNode() => _getInfoForNode()._written;`,
        sequence: "()=>();",
        leadingText: "Set<Variable> writtenInNode",
      },
      {
        features: `final Set<Variable> _written = new Set<Variable>.identity();`,
        sequence: "=();",
        leadingText: "final Set<Variable> _written",
      },
      {
        features: `final Set<Variable> _captured = new Set<Variable>.identity();`,
        sequence: "=();",
        leadingText: "final Set<Variable> _captured",
      },
      {
        features: `final Set<Variable> _declared = new Set<Variable>.identity();`,
        sequence: "=();",
        leadingText: "final Set<Variable> _declared",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `final FlowModel<Variable, Type> after;`,
        sequence: ";",
        leadingText: "final FlowModel<Variable, Type> after",
      },
      {
        features: `final FlowModel<Variable, Type> ifTrue;`,
        sequence: ";",
        leadingText: "final FlowModel<Variable, Type> ifTrue",
      },
      {
        features: `final FlowModel<Variable, Type> ifFalse;`,
        sequence: ";",
        leadingText: "final FlowModel<Variable, Type> ifFalse",
      },
      {
        features: `static ExpressionInfo<Variable, Type> invert<Variable, Type>( ) => new ExpressionInfo<Variable, Type>();`,
        sequence: "()=>();",
        leadingText: "static ExpressionInfo<Variable, Type> invert<Variable, Type>",
      },
      {
        features: `bool get isReachable;`,
        sequence: ";",
        leadingText: "bool get isReachable",
      },
      {
        features: `void asExpression_end();`,
        sequence: "();",
        leadingText: "void asExpression_end",
      },
      {
        features: `void assert_afterCondition();`,
        sequence: "();",
        leadingText: "void assert_afterCondition",
      },
      {
        features: `void assert_begin();`,
        sequence: "();",
        leadingText: "void assert_begin",
      },
      {
        features: `void assert_end();`,
        sequence: "();",
        leadingText: "void assert_end",
      },
      {
        features: `void booleanLiteral();`,
        sequence: "();",
        leadingText: "void booleanLiteral",
      },
      {
        features: `void conditional_elseBegin();`,
        sequence: "();",
        leadingText: "void conditional_elseBegin",
      },
      {
        features: `void conditional_end( );`,
        sequence: "();",
        leadingText: "void conditional_end",
      },
      {
        features: `void conditional_thenBegin();`,
        sequence: "();",
        leadingText: "void conditional_thenBegin",
      },
      {
        features: `void doStatement_bodyBegin();`,
        sequence: "();",
        leadingText: "void doStatement_bodyBegin",
      },
      {
        features: `void doStatement_conditionBegin();`,
        sequence: "();",
        leadingText: "void doStatement_conditionBegin",
      },
      {
        features: `void doStatement_end();`,
        sequence: "();",
        leadingText: "void doStatement_end",
      },
      {
        features: `void equalityOp_end( );`,
        sequence: "();",
        leadingText: "void equalityOp_end",
      },
      {
        features: `void equalityOp_rightBegin();`,
        sequence: "();",
        leadingText: "void equalityOp_rightBegin",
      },
      {
        features: `void finish();`,
        sequence: "();",
        leadingText: "void finish",
      },
      {
        features: `void for_bodyBegin();`,
        sequence: "();",
        leadingText: "void for_bodyBegin",
      },
      {
        features: `void for_conditionBegin();`,
        sequence: "();",
        leadingText: "void for_conditionBegin",
      },
      {
        features: `void for_end();`,
        sequence: "();",
        leadingText: "void for_end",
      },
      {
        features: `void for_updaterBegin();`,
        sequence: "();",
        leadingText: "void for_updaterBegin",
      },
      {
        features: `void forEach_bodyBegin();`,
        sequence: "();",
        leadingText: "void forEach_bodyBegin",
      },
      {
        features: `void forEach_end();`,
        sequence: "();",
        leadingText: "void forEach_end",
      },
      {
        features: `void functionExpression_begin();`,
        sequence: "();",
        leadingText: "void functionExpression_begin",
      },
      {
        features: `void functionExpression_end();`,
        sequence: "();",
        leadingText: "void functionExpression_end",
      },
      {
        features: `void handleBreak();`,
        sequence: "();",
        leadingText: "void handleBreak",
      },
      {
        features: `void handleContinue();`,
        sequence: "();",
        leadingText: "void handleContinue",
      },
      {
        features: `void handleExit();`,
        sequence: "();",
        leadingText: "void handleExit",
      },
      {
        features: `void ifNullExpression_end();`,
        sequence: "();",
        leadingText: "void ifNullExpression_end",
      },
      {
        features: `void ifNullExpression_rightBegin();`,
        sequence: "();",
        leadingText: "void ifNullExpression_rightBegin",
      },
      {
        features: `void ifStatement_elseBegin();`,
        sequence: "();",
        leadingText: "void ifStatement_elseBegin",
      },
      {
        features: `void ifStatement_end();`,
        sequence: "();",
        leadingText: "void ifStatement_end",
      },
      {
        features: `void ifStatement_thenBegin();`,
        sequence: "();",
        leadingText: "void ifStatement_thenBegin",
      },
      {
        features: `void initialize();`,
        sequence: "();",
        leadingText: "void initialize",
      },
      {
        features: `bool isAssigned();`,
        sequence: "();",
        leadingText: "bool isAssigned",
      },
      {
        features: `void isExpression_end( );`,
        sequence: "();",
        leadingText: "void isExpression_end",
      },
      {
        features: `void logicalBinaryOp_end( );`,
        sequence: "();",
        leadingText: "void logicalBinaryOp_end",
      },
      {
        features: `void logicalBinaryOp_rightBegin( );`,
        sequence: "();",
        leadingText: "void logicalBinaryOp_rightBegin",
      },
      {
        features: `void logicalNot_end();`,
        sequence: "();",
        leadingText: "void logicalNot_end",
      },
      {
        features: `void nonNullAssert_end();`,
        sequence: "();",
        leadingText: "void nonNullAssert_end",
      },
      {
        features: `void nullAwareAccess_end();`,
        sequence: "();",
        leadingText: "void nullAwareAccess_end",
      },
      {
        features: `void nullAwareAccess_rightBegin();`,
        sequence: "();",
        leadingText: "void nullAwareAccess_rightBegin",
      },
      {
        features: `void nullLiteral();`,
        sequence: "();",
        leadingText: "void nullLiteral",
      },
      {
        features: `void parenthesizedExpression( );`,
        sequence: "();",
        leadingText: "void parenthesizedExpression",
      },
      {
        features: `Type promotedType();`,
        sequence: "();",
        leadingText: "Type promotedType",
      },
      {
        features: `void switchStatement_beginCase();`,
        sequence: "();",
        leadingText: "void switchStatement_beginCase",
      },
      {
        features: `void switchStatement_end();`,
        sequence: "();",
        leadingText: "void switchStatement_end",
      },
      {
        features: `void switchStatement_expressionEnd();`,
        sequence: "();",
        leadingText: "void switchStatement_expressionEnd",
      },
      {
        features: `void tryCatchStatement_bodyBegin();`,
        sequence: "();",
        leadingText: "void tryCatchStatement_bodyBegin",
      },
      {
        features: `void tryCatchStatement_bodyEnd();`,
        sequence: "();",
        leadingText: "void tryCatchStatement_bodyEnd",
      },
      {
        features: `void tryCatchStatement_catchBegin( );`,
        sequence: "();",
        leadingText: "void tryCatchStatement_catchBegin",
      },
      {
        features: `void tryCatchStatement_catchEnd();`,
        sequence: "();",
        leadingText: "void tryCatchStatement_catchEnd",
      },
      {
        features: `void tryCatchStatement_end();`,
        sequence: "();",
        leadingText: "void tryCatchStatement_end",
      },
      {
        features: `void tryFinallyStatement_bodyBegin();`,
        sequence: "();",
        leadingText: "void tryFinallyStatement_bodyBegin",
      },
      {
        features: `void tryFinallyStatement_end();`,
        sequence: "();",
        leadingText: "void tryFinallyStatement_end",
      },
      {
        features: `void tryFinallyStatement_finallyBegin();`,
        sequence: "();",
        leadingText: "void tryFinallyStatement_finallyBegin",
      },
      {
        features: `Type variableRead();`,
        sequence: "();",
        leadingText: "Type variableRead",
      },
      {
        features: `void whileStatement_bodyBegin();`,
        sequence: "();",
        leadingText: "void whileStatement_bodyBegin",
      },
      {
        features: `void whileStatement_conditionBegin();`,
        sequence: "();",
        leadingText: "void whileStatement_conditionBegin",
      },
      {
        features: `void whileStatement_end();`,
        sequence: "();",
        leadingText: "void whileStatement_end",
      },
      {
        features: `void write();`,
        sequence: "();",
        leadingText: "void write",
      },
      {
        features: `_FlowAnalysisImpl<Node, Statement, Expression, Variable, Type> _wrapped;`,
        sequence: ";",
        leadingText: "_FlowAnalysisImpl<Node, Statement, Expression, Variable, Type> _wrapped",
      },
      {
        features: `bool _exceptionOccurred = false;`,
        sequence: "=;",
        leadingText: "bool _exceptionOccurred",
      },
      {
        features: `T _wrap<T>( ) {                   }`,
        sequence: "(){}",
        leadingText: "T _wrap<T>",
      },
      {
        features: `final bool reachable;`,
        sequence: ";",
        leadingText: "final bool reachable",
      },
      {
        features: `final Map<Variable, VariableModel<Type>  > variableInfo;`,
        sequence: ";",
        leadingText: "final Map<Variable, VariableModel<Type>  > variableInfo",
      },
      {
        features: `final VariableModel<Type> _freshVariableInfo;`,
        sequence: ";",
        leadingText: "final VariableModel<Type> _freshVariableInfo",
      },
      {
        features: `VariableModel<Type> infoFor() => variableInfo[variable] ?? _freshVariableInfo;`,
        sequence: "()=>[];",
        leadingText: "VariableModel<Type> infoFor",
      },
      {
        features: `FlowModel<Variable, Type> initialize() {     }`,
        sequence: "(){}",
        leadingText: "FlowModel<Variable, Type> initialize",
      },
      {
        features: `FlowModel<Variable, Type> removePromotedAll(  ) {                      }`,
        sequence: "(){}",
        leadingText: "FlowModel<Variable, Type> removePromotedAll",
      },
      {
        features: `FlowModel<Variable, Type> restrict(   ) {                                             }`,
        sequence: "(){}",
        leadingText: "FlowModel<Variable, Type> restrict",
      },
      {
        features: `FlowModel<Variable, Type> setReachable() {    }`,
        sequence: "(){}",
        leadingText: "FlowModel<Variable, Type> setReachable",
      },
      {
        features: `ExpressionInfo<Variable, Type> tryMarkNonNullable( ) {             }`,
        sequence: "(){}",
        leadingText: "ExpressionInfo<Variable, Type> tryMarkNonNullable",
      },
      {
        features: `ExpressionInfo<Variable, Type> tryPromote(   ) {               }`,
        sequence: "(){}",
        leadingText: "ExpressionInfo<Variable, Type> tryPromote",
      },
      {
        features: `FlowModel<Variable, Type> write( ) {      }`,
        sequence: "(){}",
        leadingText: "FlowModel<Variable, Type> write",
      },
      {
        features: `ExpressionInfo<Variable, Type> _finishTypeTest(    ) {                     }`,
        sequence: "(){}",
        leadingText: "ExpressionInfo<Variable, Type> _finishTypeTest",
      },
      {
        features: `FlowModel<Variable, Type> _updateVariableInfo( ) {     }`,
        sequence: "(){}",
        leadingText: "FlowModel<Variable, Type> _updateVariableInfo",
      },
      {
        features: `static FlowModel<Variable, Type> join<Variable, Type>(    ) {              }`,
        sequence: "(){}",
        leadingText: "static FlowModel<Variable, Type> join<Variable, Type>",
      },
      {
        features: `static Map<Variable, VariableModel<Type>> joinVariableInfo<Variable, Type>(    ) {                          }`,
        sequence: "(){}",
        leadingText: "static Map<Variable, VariableModel<Type>> joinVariableInfo<Variable, Type>",
      },
      {
        features: `static FlowModel<Variable, Type> _identicalOrNew<Variable, Type>(    ) {           }`,
        sequence: "(){}",
        leadingText: "static FlowModel<Variable, Type> _identicalOrNew<Variable, Type>",
      },
      {
        features: `static bool _variableInfosEqual<Variable, Type>(  ) {           }`,
        sequence: "(){}",
        leadingText: "static bool _variableInfosEqual<Variable, Type>",
      },
      {
        features: `bool isSameType();`,
        sequence: "();",
        leadingText: "bool isSameType",
      },
      {
        features: `bool isSubtypeOf();`,
        sequence: "();",
        leadingText: "bool isSubtypeOf",
      },
      {
        features: `Type  promoteToNonNull();`,
        sequence: "();",
        leadingText: "Type  promoteToNonNull",
      },
      {
        features: `Type tryPromoteToType();`,
        sequence: "();",
        leadingText: "Type tryPromoteToType",
      },
      {
        features: `Type variableType();`,
        sequence: "();",
        leadingText: "Type variableType",
      },
      {
        features: `final List<Type> promotedTypes;`,
        sequence: ";",
        leadingText: "final List<Type> promotedTypes",
      },
      {
        features: `final List<Type> tested;`,
        sequence: ";",
        leadingText: "final List<Type> tested",
      },
      {
        features: `final bool assigned;`,
        sequence: ";",
        leadingText: "final bool assigned",
      },
      {
        features: `final bool writeCaptured;`,
        sequence: ";",
        leadingText: "final bool writeCaptured",
      },
      {
        features: `VariableModel<Type> discardPromotions() {   }`,
        sequence: "(){}",
        leadingText: "VariableModel<Type> discardPromotions",
      },
      {
        features: `VariableModel<Type> initialize() {     }`,
        sequence: "(){}",
        leadingText: "VariableModel<Type> initialize",
      },
      {
        features: `VariableModel<Type> restrict( ) {                                    }`,
        sequence: "(){}",
        leadingText: "VariableModel<Type> restrict",
      },
      {
        features: `VariableModel<Type> write( ) {                                }`,
        sequence: "(){}",
        leadingText: "VariableModel<Type> write",
      },
      {
        features: `VariableModel<Type> writeCapture() {  }`,
        sequence: "(){}",
        leadingText: "VariableModel<Type> writeCapture",
      },
      {
        features: `List<Type> _tryPromoteToTypeOfInterest(   ) {                                                    }`,
        sequence: "(){}",
        leadingText: "List<Type> _tryPromoteToTypeOfInterest",
      },
      {
        features: `static VariableModel<Type> join<Type>(   ) {          }`,
        sequence: "(){}",
        leadingText: "static VariableModel<Type> join<Type>",
      },
      {
        features: `static List<Type> joinPromotedTypes<Type>( ) {               }`,
        sequence: "(){}",
        leadingText: "static List<Type> joinPromotedTypes<Type>",
      },
      {
        features: `static List<Type> joinTested<Type>( ) {                           }`,
        sequence: "(){}",
        leadingText: "static List<Type> joinTested<Type>",
      },
      {
        features: `static List<Type> _addToPromotedTypes<Type>( ) => promotedTypes == null ? [promoted] : ();`,
        sequence: "()=>==[]();",
        leadingText: "static List<Type> _addToPromotedTypes<Type>",
      },
      {
        features: `static List<Type> _addTypeToUniqueList<Type>( ) {   }`,
        sequence: "(){}",
        leadingText: "static List<Type> _addTypeToUniqueList<Type>",
      },
      {
        features: `static VariableModel<Type> _identicalOrNew<Type>(      ) {               }`,
        sequence: "(){}",
        leadingText: "static VariableModel<Type> _identicalOrNew<Type>",
      },
      {
        features: `static bool _typeListContains<Type>(   ) {     }`,
        sequence: "(){}",
        leadingText: "static bool _typeListContains<Type>",
      },
      {
        features: `ExpressionInfo<Variable, Type> _conditionInfo;`,
        sequence: ";",
        leadingText: "ExpressionInfo<Variable, Type> _conditionInfo",
      },
      {
        features: `final ExpressionInfo<Variable, Type> _conditionInfo;`,
        sequence: ";",
        leadingText: "final ExpressionInfo<Variable, Type> _conditionInfo",
      },
      {
        features: `FlowModel<Variable, Type> _breakModel;`,
        sequence: ";",
        leadingText: "FlowModel<Variable, Type> _breakModel",
      },
      {
        features: `FlowModel<Variable, Type> _continueModel;`,
        sequence: ";",
        leadingText: "FlowModel<Variable, Type> _continueModel",
      },
      {
        features: `ExpressionInfo<Variable, Type> _thenInfo;`,
        sequence: ";",
        leadingText: "ExpressionInfo<Variable, Type> _thenInfo",
      },
      {
        features: `final TypeOperations<Variable, Type> typeOperations;`,
        sequence: ";",
        leadingText: "final TypeOperations<Variable, Type> typeOperations",
      },
      {
        features: `final List<_FlowContext> _stack = [];`,
        sequence: "=[];",
        leadingText: "final List<_FlowContext> _stack",
      },
      {
        features: `final Map<Statement, _BranchTargetContext<Variable, Type>> _statementToContext = {}`,
        sequence: "={}",
        leadingText: "final Map<Statement, _BranchTargetContext<Variable, Type>> _statementToContext",
      },
      {
        features: `FlowModel<Variable, Type> _current;`,
        sequence: ";",
        leadingText: "FlowModel<Variable, Type> _current",
      },
      {
        features: `Expression _expressionWithInfo;`,
        sequence: ";",
        leadingText: "Expression _expressionWithInfo",
      },
      {
        features: `ExpressionInfo<Variable, Type> _expressionInfo;`,
        sequence: ";",
        leadingText: "ExpressionInfo<Variable, Type> _expressionInfo",
      },
      {
        features: `int _functionNestingLevel = 0;`,
        sequence: "=;",
        leadingText: "int _functionNestingLevel",
      },
      {
        features: `final AssignedVariables<Node, Variable> _assignedVariables;`,
        sequence: ";",
        leadingText: "final AssignedVariables<Node, Variable> _assignedVariables",
      },
      {
        features: `void _dumpState() {        }`,
        sequence: "(){}",
        leadingText: "void _dumpState",
      },
      {
        features: `ExpressionInfo<Variable, Type> _expressionEnd() => _getExpressionInfo() ?? new ExpressionInfo();`,
        sequence: "()=>()();",
        leadingText: "ExpressionInfo<Variable, Type> _expressionEnd",
      },
      {
        features: `ExpressionInfo<Variable, Type> _getExpressionInfo() {        }`,
        sequence: "(){}",
        leadingText: "ExpressionInfo<Variable, Type> _getExpressionInfo",
      },
      {
        features: `FlowModel<Variable, Type> _join( ) => FlowModel.join();`,
        sequence: "()=>();",
        leadingText: "FlowModel<Variable, Type> _join",
      },
      {
        features: `void _storeExpressionInfo( ) {    }`,
        sequence: "(){}",
        leadingText: "void _storeExpressionInfo",
      },
      {
        features: `FlowModel<Variable, Type> _afterThen;`,
        sequence: ";",
        leadingText: "FlowModel<Variable, Type> _afterThen",
      },
      {
        features: `final FlowModel<Variable, Type> _previous;`,
        sequence: ";",
        leadingText: "final FlowModel<Variable, Type> _previous",
      },
      {
        features: `final FlowModel<Variable, Type> _previous;`,
        sequence: ";",
        leadingText: "final FlowModel<Variable, Type> _previous",
      },
      {
        features: `FlowModel<Variable, Type> _beforeCatch;`,
        sequence: ";",
        leadingText: "FlowModel<Variable, Type> _beforeCatch",
      },
      {
        features: `FlowModel<Variable, Type> _afterBodyAndCatches;`,
        sequence: ";",
        leadingText: "FlowModel<Variable, Type> _afterBodyAndCatches",
      },
      {
        features: `final Variable _variable;`,
        sequence: ";",
        leadingText: "final Variable _variable",
      },
      {
        features: `final ExpressionInfo<Variable, Type> _conditionInfo;`,
        sequence: ";",
        leadingText: "final ExpressionInfo<Variable, Type> _conditionInfo",
      },
      {
        features: `final String typeName;`,
        sequence: ";",
        leadingText: "final String typeName",
      },
      {
        features: `final int _attributes;`,
        sequence: ";",
        leadingText: "final int _attributes",
      },
      {
        features: `final int baseTypeToken;`,
        sequence: ";",
        leadingText: "final int baseTypeToken",
      },
      {
        features: `final TypeIdentifier? typeSpec;`,
        sequence: ";",
        leadingText: "final TypeIdentifier? typeSpec",
      },
      {
        features: `final _interfaces = <TypeDef>[];`,
        sequence: "=[];",
        leadingText: "final _interfaces",
      },
      {
        features: `final _fields = <Field>[];`,
        sequence: "=[];",
        leadingText: "final _fields",
      },
      {
        features: `final _methods = <Method>[];`,
        sequence: "=[];",
        leadingText: "final _methods",
      },
      {
        features: `final _properties = <Property>[];`,
        sequence: "=[];",
        leadingText: "final _properties",
      },
      {
        features: `final _events = <Event>[];`,
        sequence: "=[];",
        leadingText: "final _events",
      },
      {
        features: `TypeVisibility get typeVisibility => TypeVisibility.values[_attributes & CorTypeAttr.tdVisibilityMask];`,
        sequence: "=>[];",
        leadingText: "TypeVisibility get typeVisibility",
      },
      {
        features: `TypeLayout get typeLayout {           }`,
        sequence: "{}",
        leadingText: "TypeLayout get typeLayout",
      },
      {
        features: `bool get isClass => _attributes & CorTypeAttr.tdClassSemanticsMask == CorTypeAttr.tdClass;`,
        sequence: "=>==;",
        leadingText: "bool get isClass",
      },
      {
        features: `bool get isInterface => _attributes & CorTypeAttr.tdClassSemanticsMask == CorTypeAttr.tdInterface;`,
        sequence: "=>==;",
        leadingText: "bool get isInterface",
      },
      {
        features: `bool get isAbstract => _attributes & CorTypeAttr.tdAbstract == CorTypeAttr.tdAbstract;`,
        sequence: "=>==;",
        leadingText: "bool get isAbstract",
      },
      {
        features: `bool get isSealed => _attributes & CorTypeAttr.tdSealed == CorTypeAttr.tdSealed;`,
        sequence: "=>==;",
        leadingText: "bool get isSealed",
      },
      {
        features: `bool get isSpecialName => _attributes & CorTypeAttr.tdSpecialName == CorTypeAttr.tdSpecialName;`,
        sequence: "=>==;",
        leadingText: "bool get isSpecialName",
      },
      {
        features: `bool get isImported => _attributes & CorTypeAttr.tdImport == CorTypeAttr.tdImport;`,
        sequence: "=>==;",
        leadingText: "bool get isImported",
      },
      {
        features: `bool get isSerializable => _attributes & CorTypeAttr.tdSerializable == CorTypeAttr.tdSerializable;`,
        sequence: "=>==;",
        leadingText: "bool get isSerializable",
      },
      {
        features: `bool get isWindowsRuntime => _attributes & CorTypeAttr.tdWindowsRuntime == CorTypeAttr.tdWindowsRuntime;`,
        sequence: "=>==;",
        leadingText: "bool get isWindowsRuntime",
      },
      {
        features: `bool get isRTSpecialName => _attributes & CorTypeAttr.tdRTSpecialName == CorTypeAttr.tdRTSpecialName;`,
        sequence: "=>==;",
        leadingText: "bool get isRTSpecialName",
      },
      {
        features: `StringFormat get stringFormat {             }`,
        sequence: "{}",
        leadingText: "StringFormat get stringFormat",
      },
      {
        features: `bool get isBeforeFieldInit => _attributes & CorTypeAttr.tdBeforeFieldInit == CorTypeAttr.tdBeforeFieldInit;`,
        sequence: "=>==;",
        leadingText: "bool get isBeforeFieldInit",
      },
      {
        features: `bool get isForwarder => _attributes & CorTypeAttr.tdForwarder == CorTypeAttr.tdForwarder;`,
        sequence: "=>==;",
        leadingText: "bool get isForwarder",
      },
      {
        features: `bool get isDelegate => parent?.typeName == '';`,
        sequence: "=>==;",
        leadingText: "bool get isDelegate",
      },
      {
        features: `ClassLayout get classLayout => ClassLayout();`,
        sequence: "=>();",
        leadingText: "ClassLayout get classLayout",
      },
      {
        features: `bool get isSystemType => systemTokens.containsValue();`,
        sequence: "=>();",
        leadingText: "bool get isSystemType",
      },
      {
        features: `TypeDef processInterfaceToken() {                }`,
        sequence: "(){}",
        leadingText: "TypeDef processInterfaceToken",
      },
      {
        features: `List<TypeDef> get interfaces {                      }`,
        sequence: "{}",
        leadingText: "List<TypeDef> get interfaces",
      },
      {
        features: `List<Field> get fields {                      }`,
        sequence: "{}",
        leadingText: "List<Field> get fields",
      },
      {
        features: `List<Method> get methods {                      }`,
        sequence: "{}",
        leadingText: "List<Method> get methods",
      },
      {
        features: `List<Property> get properties {                       }`,
        sequence: "{}",
        leadingText: "List<Property> get properties",
      },
      {
        features: `List<Event> get events {                      }`,
        sequence: "{}",
        leadingText: "List<Event> get events",
      },
      {
        features: `Field? findField() {      }`,
        sequence: "(){}",
        leadingText: "Field? findField",
      },
      {
        features: `Method? findMethod() {                 }`,
        sequence: "(){}",
        leadingText: "Method? findMethod",
      },
      {
        features: `TypeDef? get parent => token == 0 ? null : TypeDef.fromToken();`,
        sequence: "=>==();",
        leadingText: "TypeDef? get parent",
      },
      {
        features: `String? getCustomGUIDAttribute() {                    }`,
        sequence: "(){}",
        leadingText: "String? getCustomGUIDAttribute",
      },
      {
        features: `String? get guid {      }`,
        sequence: "{}",
        leadingText: "String? get guid",
      },
      {
        features: `final Map<dynamic, SnackBar Function()> _snackbars = {}`,
        sequence: "={}",
        leadingText: "final Map<dynamic, SnackBar Function()> _snackbars",
      },
      {
        features: `SnackBar Function() getSnackbar() {  }`,
        sequence: "(){}",
        leadingText: "SnackBar Function() getSnackbar",
      },
      {
        features: `final GlobalKey<ScaffoldMessengerState> snackbarKey = GlobalKey<ScaffoldMessengerState>();`,
        sequence: "=();",
        leadingText: "final GlobalKey<ScaffoldMessengerState> snackbarKey",
      },
      {
        features: `bool containsKey() {  }`,
        sequence: "(){}",
        leadingText: "bool containsKey",
      },
      {
        features: `void registerSnackbar( ) {  }`,
        sequence: "(){}",
        leadingText: "void registerSnackbar",
      },
      {
        features: `final Map<dynamic, Widget Function()> _dialogs = {}`,
        sequence: "={}",
        leadingText: "final Map<dynamic, Widget Function()> _dialogs",
      },
      {
        features: `late Function() _dialogHandler;`,
        sequence: ";",
        leadingText: "late Function() _dialogHandler",
      },
      {
        features: `late Completer<DialogReponse>? _dialogCompleter;`,
        sequence: ";",
        leadingText: "late Completer<DialogReponse>? _dialogCompleter",
      },
      {
        features: `late final NavigatorService _navigatorService;`,
        sequence: ";",
        leadingText: "late final NavigatorService _navigatorService",
      },
      {
        features: `final String name;`,
        sequence: ";",
        leadingText: "final String name",
      },
      {
        features: `final Version version;`,
        sequence: ";",
        leadingText: "final Version version",
      },
      {
        features: `final String description;`,
        sequence: ";",
        leadingText: "final String description",
      },
      {
        features: `final String homepage;`,
        sequence: ";",
        leadingText: "final String homepage",
      },
      {
        features: `final String publishTo;`,
        sequence: ";",
        leadingText: "final String publishTo",
      },
      {
        features: `final Uri repository;`,
        sequence: ";",
        leadingText: "final Uri repository",
      },
      {
        features: `final Uri issueTracker;`,
        sequence: ";",
        leadingText: "final Uri issueTracker",
      },
      {
        features: `String get author {     }`,
        sequence: "{}",
        leadingText: "String get author",
      },
      {
        features: `final List<String> authors;`,
        sequence: ";",
        leadingText: "final List<String> authors",
      },
      {
        features: `final String documentation;`,
        sequence: ";",
        leadingText: "final String documentation",
      },
      {
        features: `final Map<String, VersionConstraint> environment;`,
        sequence: ";",
        leadingText: "final Map<String, VersionConstraint> environment",
      },
      {
        features: `final Map<String, Dependency> dependencies;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> dependencies",
      },
      {
        features: `final Map<String, Dependency> devDependencies;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> devDependencies",
      },
      {
        features: `final Map<String, Dependency> dependencyOverrides;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> dependencyOverrides",
      },
      {
        features: `final Map<String, dynamic> flutter;`,
        sequence: ";",
        leadingText: "final Map<String, dynamic> flutter",
      },
      {
        features: `static List<String> _normalizeAuthors() {         }`,
        sequence: "(){}",
        leadingText: "static List<String> _normalizeAuthors",
      },
      {
        features: `final String name;`,
        sequence: ";",
        leadingText: "final String name",
      },
      {
        features: `final Version version;`,
        sequence: ";",
        leadingText: "final Version version",
      },
      {
        features: `final String description;`,
        sequence: ";",
        leadingText: "final String description",
      },
      {
        features: `final String homepage;`,
        sequence: ";",
        leadingText: "final String homepage",
      },
      {
        features: `final String publishTo;`,
        sequence: ";",
        leadingText: "final String publishTo",
      },
      {
        features: `final Uri repository;`,
        sequence: ";",
        leadingText: "final Uri repository",
      },
      {
        features: `final Uri issueTracker;`,
        sequence: ";",
        leadingText: "final Uri issueTracker",
      },
      {
        features: `String get author {     }`,
        sequence: "{}",
        leadingText: "String get author",
      },
      {
        features: `final List<String> authors;`,
        sequence: ";",
        leadingText: "final List<String> authors",
      },
      {
        features: `final String documentation;`,
        sequence: ";",
        leadingText: "final String documentation",
      },
      {
        features: `final Map<String, VersionConstraint> environment;`,
        sequence: ";",
        leadingText: "final Map<String, VersionConstraint> environment",
      },
      {
        features: `final Map<String, Dependency> dependencies;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> dependencies",
      },
      {
        features: `final Map<String, Dependency> devDependencies;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> devDependencies",
      },
      {
        features: `final Map<String, Dependency> dependencyOverrides;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> dependencyOverrides",
      },
      {
        features: `final Map<String, dynamic> flutter;`,
        sequence: ";",
        leadingText: "final Map<String, dynamic> flutter",
      },
      {
        features: `static List<String> _normalizeAuthors() {         }`,
        sequence: "(){}",
        leadingText: "static List<String> _normalizeAuthors",
      },
      {
        features: `final List<String> authors;`,
        sequence: ";",
        leadingText: "final List<String> authors",
      },
      {
        features: `final Map<String, Dependency> dependencies;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> dependencies",
      },
      {
        features: `final Map<String, Dependency> dependencyOverrides;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> dependencyOverrides",
      },
      {
        features: `final String description;`,
        sequence: ";",
        leadingText: "final String description",
      },
      {
        features: `final Map<String, Dependency> devDependencies;`,
        sequence: ";",
        leadingText: "final Map<String, Dependency> devDependencies",
      },
      {
        features: `final String documentation;`,
        sequence: ";",
        leadingText: "final String documentation",
      },
      {
        features: `final Map<String, VersionConstraint> environment;`,
        sequence: ";",
        leadingText: "final Map<String, VersionConstraint> environment",
      },
      {
        features: `final Map<String, dynamic> flutter;`,
        sequence: ";",
        leadingText: "final Map<String, dynamic> flutter",
      },
      {
        features: `final String homepage;`,
        sequence: ";",
        leadingText: "final String homepage",
      },
      {
        features: `final Uri issueTracker;`,
        sequence: ";",
        leadingText: "final Uri issueTracker",
      },
      {
        features: `final String name;`,
        sequence: ";",
        leadingText: "final String name",
      },
      {
        features: `final String publishTo;`,
        sequence: ";",
        leadingText: "final String publishTo",
      },
      {
        features: `final Uri repository;`,
        sequence: ";",
        leadingText: "final Uri repository",
      },
      {
        features: `final Version version;`,
        sequence: ";",
        leadingText: "final Version version",
      },
      {
        features: `String get author {     }`,
        sequence: "{}",
        leadingText: "String get author",
      },
      {
        features: `static List<String> _normalizeAuthors() {         }`,
        sequence: "(){}",
        leadingText: "static List<String> _normalizeAuthors",
      },
      {
        features: `final Scope _parent;`,
        sequence: ";",
        leadingText: "final Scope _parent",
      },
      {
        features: `final Map<String, Element> _getters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _getters",
      },
      {
        features: `final Map<String, Element> _setters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _setters",
      },
      {
        features: `Scope get parent => _parent;`,
        sequence: "=>;",
        leadingText: "Scope get parent",
      },
      {
        features: `void _addGetter() {  }`,
        sequence: "(){}",
        leadingText: "void _addGetter",
      },
      {
        features: `void _addPropertyAccessor() {      }`,
        sequence: "(){}",
        leadingText: "void _addPropertyAccessor",
      },
      {
        features: `void _addSetter() {  }`,
        sequence: "(){}",
        leadingText: "void _addSetter",
      },
      {
        features: `void _addTo() {   }`,
        sequence: "(){}",
        leadingText: "void _addTo",
      },
      {
        features: `final LibraryElement _element;`,
        sequence: ";",
        leadingText: "final LibraryElement _element",
      },
      {
        features: `final List<ExtensionElement> extensions = [];`,
        sequence: "=[];",
        leadingText: "final List<ExtensionElement> extensions",
      },
      {
        features: `bool shouldIgnoreUndefined(   ) {                                              }`,
        sequence: "(){}",
        leadingText: "bool shouldIgnoreUndefined",
      },
      {
        features: `void _addExtension() {     }`,
        sequence: "(){}",
        leadingText: "void _addExtension",
      },
      {
        features: `void _addUnitElements() {        }`,
        sequence: "(){}",
        leadingText: "void _addUnitElements",
      },
      {
        features: `void add() {  }`,
        sequence: "(){}",
        leadingText: "void add",
      },
      {
        features: `final LibraryElement _library;`,
        sequence: ";",
        leadingText: "final LibraryElement _library",
      },
      {
        features: `final Map<String, Element> _getters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _getters",
      },
      {
        features: `final Map<String, Element> _setters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _setters",
      },
      {
        features: `final Set<ExtensionElement> _extensions = {}`,
        sequence: "={}",
        leadingText: "final Set<ExtensionElement> _extensions",
      },
      {
        features: `LibraryElement _deferredLibrary;`,
        sequence: ";",
        leadingText: "LibraryElement _deferredLibrary",
      },
      {
        features: `void _add() {         }`,
        sequence: "(){}",
        leadingText: "void _add",
      },
      {
        features: `void _addTo(   ) {          }`,
        sequence: "(){}",
        leadingText: "void _addTo",
      },
      {
        features: `Element _merge() {                     }`,
        sequence: "(){}",
        leadingText: "Element _merge",
      },
      {
        features: `static void _addElement(   ) {      }`,
        sequence: "(){}",
        leadingText: "static void _addElement",
      },
      {
        features: `static bool _isSdkElement() {        }`,
        sequence: "(){}",
        leadingText: "static bool _isSdkElement",
      },
      {
        features: `final LibraryElement _library;`,
        sequence: ";",
        leadingText: "final LibraryElement _library",
      },
      {
        features: `final PrefixScope _nullPrefixScope;`,
        sequence: ";",
        leadingText: "final PrefixScope _nullPrefixScope",
      },
      {
        features: `List<ExtensionElement> _extensions;`,
        sequence: ";",
        leadingText: "List<ExtensionElement> _extensions",
      },
      {
        features: `List<ExtensionElement> get extensions {      }`,
        sequence: "{}",
        leadingText: "List<ExtensionElement> get extensions",
      },
      {
        features: `final Scope _parent;`,
        sequence: ";",
        leadingText: "final Scope _parent",
      },
      {
        features: `final Map<String, Element> _getters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _getters",
      },
      {
        features: `final Map<String, Element> _setters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _setters",
      },
      {
        features: `Scope get parent => _parent;`,
        sequence: "=>;",
        leadingText: "Scope get parent",
      },
      {
        features: `void _addGetter() {  }`,
        sequence: "(){}",
        leadingText: "void _addGetter",
      },
      {
        features: `void _addPropertyAccessor() {      }`,
        sequence: "(){}",
        leadingText: "void _addPropertyAccessor",
      },
      {
        features: `void _addSetter() {  }`,
        sequence: "(){}",
        leadingText: "void _addSetter",
      },
      {
        features: `void _addTo() {   }`,
        sequence: "(){}",
        leadingText: "void _addTo",
      },
      {
        features: `final LibraryElement _element;`,
        sequence: ";",
        leadingText: "final LibraryElement _element",
      },
      {
        features: `final List<ExtensionElement> extensions = [];`,
        sequence: "=[];",
        leadingText: "final List<ExtensionElement> extensions",
      },
      {
        features: `bool shouldIgnoreUndefined(   ) {                                              }`,
        sequence: "(){}",
        leadingText: "bool shouldIgnoreUndefined",
      },
      {
        features: `void _addExtension() {     }`,
        sequence: "(){}",
        leadingText: "void _addExtension",
      },
      {
        features: `void _addUnitElements() {        }`,
        sequence: "(){}",
        leadingText: "void _addUnitElements",
      },
      {
        features: `void add() {  }`,
        sequence: "(){}",
        leadingText: "void add",
      },
      {
        features: `final LibraryElement _library;`,
        sequence: ";",
        leadingText: "final LibraryElement _library",
      },
      {
        features: `final Map<String, Element> _getters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _getters",
      },
      {
        features: `final Map<String, Element> _setters = {}`,
        sequence: "={}",
        leadingText: "final Map<String, Element> _setters",
      },
      {
        features: `final Set<ExtensionElement> _extensions = {}`,
        sequence: "={}",
        leadingText: "final Set<ExtensionElement> _extensions",
      },
      {
        features: `LibraryElement _deferredLibrary;`,
        sequence: ";",
        leadingText: "LibraryElement _deferredLibrary",
      },
      {
        features: `void _add() {         }`,
        sequence: "(){}",
        leadingText: "void _add",
      },
      {
        features: `void _addTo(   ) {          }`,
        sequence: "(){}",
        leadingText: "void _addTo",
      },
      {
        features: `Element _merge() {                     }`,
        sequence: "(){}",
        leadingText: "Element _merge",
      },
      {
        features: `static void _addElement(   ) {      }`,
        sequence: "(){}",
        leadingText: "static void _addElement",
      },
      {
        features: `static bool _isSdkElement() {        }`,
        sequence: "(){}",
        leadingText: "static bool _isSdkElement",
      },
      {
        features: `final LibraryElement _library;`,
        sequence: ";",
        leadingText: "final LibraryElement _library",
      },
      {
        features: `final PrefixScope _nullPrefixScope;`,
        sequence: ";",
        leadingText: "final PrefixScope _nullPrefixScope",
      },
      {
        features: `List<ExtensionElement> _extensions;`,
        sequence: ";",
        leadingText: "List<ExtensionElement> _extensions",
      },
      {
        features: `List<ExtensionElement> get extensions {      }`,
        sequence: "{}",
        leadingText: "List<ExtensionElement> get extensions",
      },
      {
        features: `myMethod(){}`,
        sequence: "(){}",
        leadingText: "myMethod",
      },
      {
        features: `_myMethod(){}`,
        sequence: "(){}",
        leadingText: "_myMethod",
      },
      {
        features: `myMethod(){}`,
        sequence: "(){}",
        leadingText: "myMethod",
      },
      {
        features: `_myMethod(){}`,
        sequence: "(){}",
        leadingText: "_myMethod",
      },
      {
        features: `TypeAssertions _assertions;`,
        sequence: ";",
        leadingText: "TypeAssertions _assertions",
      },
      {
        features: `Asserter<DartType> _isDynamic;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isDynamic",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOfDynamic;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOfDynamic",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOfInt;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOfInt",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOfNull;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOfNull",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOrOfInt;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOrOfInt",
      },
      {
        features: `Asserter<DartType> _isInt;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isInt",
      },
      {
        features: `Asserter<DartType> _isNull;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isNull",
      },
      {
        features: `Asserter<DartType> _isNum;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isNum",
      },
      {
        features: `Asserter<DartType> _isObject;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isObject",
      },
      {
        features: `Asserter<DartType> _isString;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isString",
      },
      {
        features: `AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, DartType> _isFunction2Of;`,
        sequence: ";",
        leadingText: "AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, DartType> _isFunction2Of",
      },
      {
        features: `AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOf",
      },
      {
        features: `AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOrOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOrOf",
      },
      {
        features: `AsserterBuilderBuilder<Asserter<DartType>, List<Asserter<DartType>>, DartType> _isInstantiationOf;`,
        sequence: ";",
        leadingText: "AsserterBuilderBuilder<Asserter<DartType>, List<Asserter<DartType>>, DartType> _isInstantiationOf",
      },
      {
        features: `AsserterBuilder<Asserter<DartType>, InterfaceType> _isListOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder<Asserter<DartType>, InterfaceType> _isListOf",
      },
      {
        features: `AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, InterfaceType> _isMapOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, InterfaceType> _isMapOf",
      },
      {
        features: `AsserterBuilder<DartType, DartType> _isType;`,
        sequence: ";",
        leadingText: "AsserterBuilder<DartType, DartType> _isType",
      },
      {
        features: `AsserterBuilder<Element, DartType> _hasElement;`,
        sequence: ";",
        leadingText: "AsserterBuilder<Element, DartType> _hasElement",
      },
      {
        features: `CompilationUnit get unit => result.unit;`,
        sequence: "=>;",
        leadingText: "CompilationUnit get unit",
      },
      {
        features: `test_async_method_propagation() async {                                                      }`,
        sequence: "(){}",
        leadingText: "test_async_method_propagation",
      },
      {
        features: `test_async_propagation() async {                                                    }`,
        sequence: "(){}",
        leadingText: "test_async_propagation",
      },
      {
        features: `test_cascadeExpression() async {                             }`,
        sequence: "(){}",
        leadingText: "test_cascadeExpression",
      },
      {
        features: `test_constrainedByBounds1() async {                  }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds1",
      },
      {
        features: `test_constrainedByBounds2() async {                  }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds2",
      },
      {
        features: `test_constrainedByBounds3() async {               }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds3",
      },
      {
        features: `test_constrainedByBounds4() async {                    }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds4",
      },
      {
        features: `test_constrainedByBounds5() async {                      }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds5",
      },
      {
        features: `test_constructorInitializer_propagation() async {             }`,
        sequence: "(){}",
        leadingText: "test_constructorInitializer_propagation",
      },
      {
        features: `test_factoryConstructor_propagation() async {                        }`,
        sequence: "(){}",
        leadingText: "test_factoryConstructor_propagation",
      },
      {
        features: `test_fieldDeclaration_propagation() async {           }`,
        sequence: "(){}",
        leadingText: "test_fieldDeclaration_propagation",
      },
      {
        features: `test_functionDeclaration_body_propagation() async {                                       }`,
        sequence: "(){}",
        leadingText: "test_functionDeclaration_body_propagation",
      },
      {
        features: `test_functionLiteral_assignment_typedArguments() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_assignment_typedArguments",
      },
      {
        features: `test_functionLiteral_assignment_unTypedArguments() async {                                    }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_assignment_unTypedArguments",
      },
      {
        features: `test_functionLiteral_body_propagation() async {                                         }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_body_propagation",
      },
      {
        features: `test_functionLiteral_functionExpressionInvocation_typedArguments() async {                                  }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionExpressionInvocation_typedArguments",
      },
      {
        features: `test_functionLiteral_functionExpressionInvocation_unTypedArguments() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionExpressionInvocation_unTypedArguments",
      },
      {
        features: `test_functionLiteral_functionInvocation_typedArguments() async {                                }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionInvocation_typedArguments",
      },
      {
        features: `test_functionLiteral_functionInvocation_unTypedArguments() async {                               }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionInvocation_unTypedArguments",
      },
      {
        features: `test_functionLiteral_methodInvocation_typedArguments() async {                                  }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_methodInvocation_typedArguments",
      },
      {
        features: `test_functionLiteral_methodInvocation_unTypedArguments() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_methodInvocation_unTypedArguments",
      },
      {
        features: `test_functionLiteral_unTypedArgument_propagation() async {                                          }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_unTypedArgument_propagation",
      },
      {
        features: `test_futureOr_assignFromFuture() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_assignFromFuture",
      },
      {
        features: `test_futureOr_assignFromValue() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_assignFromValue",
      },
      {
        features: `test_futureOr_asyncExpressionBody() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_asyncExpressionBody",
      },
      {
        features: `test_futureOr_asyncReturn() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_asyncReturn",
      },
      {
        features: `test_futureOr_await() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_await",
      },
      {
        features: `test_futureOr_downwards1() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards1",
      },
      {
        features: `test_futureOr_downwards2() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards2",
      },
      {
        features: `test_futureOr_downwards3() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards3",
      },
      {
        features: `test_futureOr_downwards4() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards4",
      },
      {
        features: `test_futureOr_downwards5() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards5",
      },
      {
        features: `test_futureOr_downwards6() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards6",
      },
      {
        features: `test_futureOr_downwards7() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards7",
      },
      {
        features: `test_futureOr_downwards8() async {           }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards8",
      },
      {
        features: `test_futureOr_downwards9() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards9",
      },
      {
        features: `test_futureOr_methods1() async {      }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods1",
      },
      {
        features: `test_futureOr_methods2() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods2",
      },
      {
        features: `test_futureOr_methods3() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods3",
      },
      {
        features: `test_futureOr_methods4() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods4",
      },
      {
        features: `test_futureOr_no_return() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_no_return",
      },
      {
        features: `test_futureOr_no_return_value() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_no_return_value",
      },
      {
        features: `test_futureOr_return_null() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_return_null",
      },
      {
        features: `test_futureOr_upwards1() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_upwards1",
      },
      {
        features: `test_futureOr_upwards2() async {          }`,
        sequence: "(){}",
        leadingText: "test_futureOr_upwards2",
      },
      {
        features: `test_futureOrNull_no_return() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOrNull_no_return",
      },
      {
        features: `test_futureOrNull_no_return_value() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOrNull_no_return_value",
      },
      {
        features: `test_futureOrNull_return_null() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOrNull_return_null",
      },
      {
        features: `test_generic_partial() async {                                                }`,
        sequence: "(){}",
        leadingText: "test_generic_partial",
      },
      {
        features: `test_inferConstructor_unknownTypeLowerBound() async {                   }`,
        sequence: "(){}",
        leadingText: "test_inferConstructor_unknownTypeLowerBound",
      },
      {
        features: `test_inference_error_arguments() async {                         }`,
        sequence: "(){}",
        leadingText: "test_inference_error_arguments",
      },
      {
        features: `test_inference_error_arguments2() async {                            }`,
        sequence: "(){}",
        leadingText: "test_inference_error_arguments2",
      },
      {
        features: `test_inference_error_extendsFromReturn() async {                     }`,
        sequence: "(){}",
        leadingText: "test_inference_error_extendsFromReturn",
      },
      {
        features: `test_inference_error_extendsFromReturn2() async {                          }`,
        sequence: "(){}",
        leadingText: "test_inference_error_extendsFromReturn2",
      },
      {
        features: `test_inference_error_genericFunction() async {                          }`,
        sequence: "(){}",
        leadingText: "test_inference_error_genericFunction",
      },
      {
        features: `test_inference_error_returnContext() async {                        }`,
        sequence: "(){}",
        leadingText: "test_inference_error_returnContext",
      },
      {
        features: `test_inference_hints() async {           }`,
        sequence: "(){}",
        leadingText: "test_inference_hints",
      },
      {
        features: `test_inference_simplePolymorphicRecursion_function() async {                         }`,
        sequence: "(){}",
        leadingText: "test_inference_simplePolymorphicRecursion_function",
      },
      {
        features: `test_inference_simplePolymorphicRecursion_interface() async {                         }`,
        sequence: "(){}",
        leadingText: "test_inference_simplePolymorphicRecursion_interface",
      },
      {
        features: `test_inference_simplePolymorphicRecursion_simple() async {                        }`,
        sequence: "(){}",
        leadingText: "test_inference_simplePolymorphicRecursion_simple",
      },
      {
        features: `test_inferGenericInstantiation() async {                      }`,
        sequence: "(){}",
        leadingText: "test_inferGenericInstantiation",
      },
      {
        features: `test_inferGenericInstantiation2() async {                        }`,
        sequence: "(){}",
        leadingText: "test_inferGenericInstantiation2",
      },
      {
        features: `test_inferredFieldDeclaration_propagation() async {                                    }`,
        sequence: "(){}",
        leadingText: "test_inferredFieldDeclaration_propagation",
      },
      {
        features: `test_instanceCreation() async {                                                                                                                                                                                                                                                                                         }`,
        sequence: "(){}",
        leadingText: "test_instanceCreation",
      },
      {
        features: `test_listLiteral_nested() async {                                      }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_nested",
      },
      {
        features: `test_listLiteral_simple() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple",
      },
      {
        features: `test_listLiteral_simple_const() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple_const",
      },
      {
        features: `test_listLiteral_simple_disabled() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple_disabled",
      },
      {
        features: `test_listLiteral_simple_subtype() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple_subtype",
      },
      {
        features: `test_mapLiteral_nested() async {                                                 }`,
        sequence: "(){}",
        leadingText: "test_mapLiteral_nested",
      },
      {
        features: `test_mapLiteral_simple() async {                                      }`,
        sequence: "(){}",
        leadingText: "test_mapLiteral_simple",
      },
      {
        features: `test_mapLiteral_simple_disabled() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_mapLiteral_simple_disabled",
      },
      {
        features: `test_methodDeclaration_body_propagation() async {                          }`,
        sequence: "(){}",
        leadingText: "test_methodDeclaration_body_propagation",
      },
      {
        features: `test_partialTypes1() async {                   }`,
        sequence: "(){}",
        leadingText: "test_partialTypes1",
      },
      {
        features: `test_pinning_multipleConstraints1() async {                       }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints1",
      },
      {
        features: `test_pinning_multipleConstraints2() async {                    }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints2",
      },
      {
        features: `test_pinning_multipleConstraints3() async {                       }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints3",
      },
      {
        features: `test_pinning_multipleConstraints4() async {                     }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints4",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant1() async {                        }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant1",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant2() async {                       }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant2",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant3() async {                        }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant3",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant4() async {                        }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant4",
      },
      {
        features: `test_redirectedConstructor_named() async {                          }`,
        sequence: "(){}",
        leadingText: "test_redirectedConstructor_named",
      },
      {
        features: `test_redirectedConstructor_self() async {       }`,
        sequence: "(){}",
        leadingText: "test_redirectedConstructor_self",
      },
      {
        features: `test_redirectedConstructor_unnamed() async {                        }`,
        sequence: "(){}",
        leadingText: "test_redirectedConstructor_unnamed",
      },
      {
        features: `test_redirectingConstructor_propagation() async {              }`,
        sequence: "(){}",
        leadingText: "test_redirectingConstructor_propagation",
      },
      {
        features: `test_returnType_variance1() async {               }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance1",
      },
      {
        features: `test_returnType_variance2() async {               }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance2",
      },
      {
        features: `test_returnType_variance3() async {                }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance3",
      },
      {
        features: `test_returnType_variance4() async {                }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance4",
      },
      {
        features: `test_returnType_variance5() async {                 }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance5",
      },
      {
        features: `test_returnType_variance6() async {                 }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance6",
      },
      {
        features: `test_superConstructorInvocation_propagation() async {                }`,
        sequence: "(){}",
        leadingText: "test_superConstructorInvocation_propagation",
      },
      {
        features: `void _expectInferenceError() {          }`,
        sequence: "(){}",
        leadingText: "void _expectInferenceError",
      },
      {
        features: `Future<MethodInvocation> _testFutureOr( ) async {           }`,
        sequence: "(){}",
        leadingText: "Future<MethodInvocation> _testFutureOr",
      },
      {
        features: `void expectStaticInvokeType() {   }`,
        sequence: "(){}",
        leadingText: "void expectStaticInvokeType",
      },
      {
        features: `test_dynamicObjectGetter_hashCode() async {          }`,
        sequence: "(){}",
        leadingText: "test_dynamicObjectGetter_hashCode",
      },
      {
        features: `test_futureOr_promotion1() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion1",
      },
      {
        features: `test_futureOr_promotion2() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion2",
      },
      {
        features: `test_futureOr_promotion3() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion3",
      },
      {
        features: `test_futureOr_promotion4() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion4",
      },
      {
        features: `test_generalizedVoid_assignToVoidOk() async {         }`,
        sequence: "(){}",
        leadingText: "test_generalizedVoid_assignToVoidOk",
      },
      {
        features: `test_genericFunction() async {       }`,
        sequence: "(){}",
        leadingText: "test_genericFunction",
      },
      {
        features: `test_genericFunction_bounds() async {    }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_bounds",
      },
      {
        features: `test_genericFunction_parameter() async {       }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_parameter",
      },
      {
        features: `test_genericFunction_static() async {           }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_static",
      },
      {
        features: `test_genericFunction_typedef() async {                                            }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_typedef",
      },
      {
        features: `test_genericFunction_upwardsAndDownwards() async {    }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_upwardsAndDownwards",
      },
      {
        features: `test_genericFunction_upwardsAndDownwards_Object() async {              }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_upwardsAndDownwards_Object",
      },
      {
        features: `test_genericMethod() async {                  }`,
        sequence: "(){}",
        leadingText: "test_genericMethod",
      },
      {
        features: `test_genericMethod_explicitTypeParams() async {                  }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_explicitTypeParams",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_explicit() async {                                         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_explicit",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_functionTypedParameter_explicit() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_functionTypedParameter_explicit",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_functionTypedParameter_inferred() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_functionTypedParameter_inferred",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_inferred() async {                                         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_inferred",
      },
      {
        features: `test_genericMethod_functionInvocation_explicit() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_explicit",
      },
      {
        features: `test_genericMethod_functionInvocation_functionTypedParameter_explicit() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_functionTypedParameter_explicit",
      },
      {
        features: `test_genericMethod_functionInvocation_functionTypedParameter_inferred() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_functionTypedParameter_inferred",
      },
      {
        features: `test_genericMethod_functionInvocation_inferred() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_inferred",
      },
      {
        features: `test_genericMethod_functionTypedParameter() async {                   }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionTypedParameter",
      },
      {
        features: `test_genericMethod_functionTypedParameter_tearoff() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionTypedParameter_tearoff",
      },
      {
        features: `test_genericMethod_implicitDynamic() async {                      }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_implicitDynamic",
      },
      {
        features: `test_genericMethod_max_doubleDouble() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_doubleDouble",
      },
      {
        features: `test_genericMethod_max_doubleDouble_prefixed() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_doubleDouble_prefixed",
      },
      {
        features: `test_genericMethod_max_doubleInt() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_doubleInt",
      },
      {
        features: `test_genericMethod_max_intDouble() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_intDouble",
      },
      {
        features: `test_genericMethod_max_intInt() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_intInt",
      },
      {
        features: `test_genericMethod_nestedBound() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedBound",
      },
      {
        features: `test_genericMethod_nestedCapture() async {              }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedCapture",
      },
      {
        features: `test_genericMethod_nestedCaptureBounds() async {                }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedCaptureBounds",
      },
      {
        features: `test_genericMethod_nestedFunctions() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedFunctions",
      },
      {
        features: `test_genericMethod_override() async {               }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override",
      },
      {
        features: `test_genericMethod_override_bounds() async {               }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_bounds",
      },
      {
        features: `test_genericMethod_override_covariant_field() async {           }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_covariant_field",
      },
      {
        features: `test_genericMethod_override_differentContextsSameBounds() async {               }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_differentContextsSameBounds",
      },
      {
        features: `test_genericMethod_override_invalidContravariantTypeParamBounds() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidContravariantTypeParamBounds",
      },
      {
        features: `test_genericMethod_override_invalidCovariantTypeParamBounds() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidCovariantTypeParamBounds",
      },
      {
        features: `test_genericMethod_override_invalidReturnType() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidReturnType",
      },
      {
        features: `test_genericMethod_override_invalidTypeParamCount() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidTypeParamCount",
      },
      {
        features: `test_genericMethod_propagatedType_promotion() async {                       }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_propagatedType_promotion",
      },
      {
        features: `test_genericMethod_tearoff() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_tearoff",
      },
      {
        features: `test_genericMethod_tearoff_instantiated() async {                             }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_tearoff_instantiated",
      },
      {
        features: `test_genericMethod_then() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_then",
      },
      {
        features: `test_genericMethod_then_prefixed() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_then_prefixed",
      },
      {
        features: `test_genericMethod_then_propagatedType() async {                }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_then_propagatedType",
      },
      {
        features: `test_genericMethod_toplevel_field_staticTearoff() async {              }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_toplevel_field_staticTearoff",
      },
      {
        features: `test_implicitBounds() async {                              }`,
        sequence: "(){}",
        leadingText: "test_implicitBounds",
      },
      {
        features: `test_instantiateToBounds_class_error_extension_malbounded() async {         }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_extension_malbounded",
      },
      {
        features: `test_instantiateToBounds_class_error_instantiation_malbounded() async {              }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_instantiation_malbounded",
      },
      {
        features: `test_instantiateToBounds_class_error_recursion() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_recursion",
      },
      {
        features: `test_instantiateToBounds_class_error_recursion_self() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_recursion_self",
      },
      {
        features: `test_instantiateToBounds_class_error_recursion_self2() async {       }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_recursion_self2",
      },
      {
        features: `test_instantiateToBounds_class_error_typedef() async {       }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_typedef",
      },
      {
        features: `test_instantiateToBounds_class_ok_implicitDynamic_multi() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_implicitDynamic_multi",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_after() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_after",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_after2() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_after2",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_before() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_before",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_multi() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_multi",
      },
      {
        features: `test_instantiateToBounds_class_ok_simpleBounds() async {                      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_simpleBounds",
      },
      {
        features: `test_instantiateToBounds_generic_function_error_malbounded() async {               }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_generic_function_error_malbounded",
      },
      {
        features: `test_instantiateToBounds_method_ok_referenceOther_before() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_referenceOther_before",
      },
      {
        features: `test_instantiateToBounds_method_ok_referenceOther_before2() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_referenceOther_before2",
      },
      {
        features: `test_instantiateToBounds_method_ok_simpleBounds() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_simpleBounds",
      },
      {
        features: `test_instantiateToBounds_method_ok_simpleBounds2() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_simpleBounds2",
      },
      {
        features: `test_issue32396() async {       }`,
        sequence: "(){}",
        leadingText: "test_issue32396",
      },
      {
        features: `test_objectMethodOnFunctions_Anonymous() async {                                }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Anonymous",
      },
      {
        features: `test_objectMethodOnFunctions_Function() async {                                }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Function",
      },
      {
        features: `test_objectMethodOnFunctions_Static() async {                                }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Static",
      },
      {
        features: `test_objectMethodOnFunctions_Typedef() async {                                  }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Typedef",
      },
      {
        features: `test_returnOfInvalidType_object_void() async {     }`,
        sequence: "(){}",
        leadingText: "test_returnOfInvalidType_object_void",
      },
      {
        features: `test_setterWithDynamicTypeIsError() async {          }`,
        sequence: "(){}",
        leadingText: "test_setterWithDynamicTypeIsError",
      },
      {
        features: `test_setterWithExplicitVoidType_returningVoid() async {        }`,
        sequence: "(){}",
        leadingText: "test_setterWithExplicitVoidType_returningVoid",
      },
      {
        features: `test_setterWithNoVoidType() async {           }`,
        sequence: "(){}",
        leadingText: "test_setterWithNoVoidType",
      },
      {
        features: `test_setterWithNoVoidType_returningVoid() async {        }`,
        sequence: "(){}",
        leadingText: "test_setterWithNoVoidType_returningVoid",
      },
      {
        features: `test_setterWithOtherTypeIsError() async {          }`,
        sequence: "(){}",
        leadingText: "test_setterWithOtherTypeIsError",
      },
      {
        features: `test_ternaryOperator_null_left() async {         }`,
        sequence: "(){}",
        leadingText: "test_ternaryOperator_null_left",
      },
      {
        features: `test_ternaryOperator_null_right() async {         }`,
        sequence: "(){}",
        leadingText: "test_ternaryOperator_null_right",
      },
      {
        features: `void _assertLocalVarType() {   }`,
        sequence: "(){}",
        leadingText: "void _assertLocalVarType",
      },
      {
        features: `void _assertTopVarType() {   }`,
        sequence: "(){}",
        leadingText: "void _assertTopVarType",
      },
      {
        features: `Future<void> _objectMethodOnFunctions_helper2( ) async {        }`,
        sequence: "(){}",
        leadingText: "Future<void> _objectMethodOnFunctions_helper2",
      },
      {
        features: `test_foreachInference_dynamic_disabled() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_dynamic_disabled",
      },
      {
        features: `test_foreachInference_reusedVar_disabled() async {           }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_reusedVar_disabled",
      },
      {
        features: `test_foreachInference_var() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_var",
      },
      {
        features: `test_foreachInference_var_iterable() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_var_iterable",
      },
      {
        features: `test_foreachInference_var_stream() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_var_stream",
      },
      {
        features: `test_inconsistentMethodInheritance_inferFunctionTypeFromTypedef() async {                 }`,
        sequence: "(){}",
        leadingText: "test_inconsistentMethodInheritance_inferFunctionTypeFromTypedef",
      },
      {
        features: `test_localVariableInference_bottom_disabled() async {        }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_bottom_disabled",
      },
      {
        features: `test_localVariableInference_constant() async {        }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_constant",
      },
      {
        features: `test_localVariableInference_declaredType_disabled() async {        }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_declaredType_disabled",
      },
      {
        features: `test_localVariableInference_noInitializer_disabled() async {             }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_noInitializer_disabled",
      },
      {
        features: `test_localVariableInference_transitive_field_inferred_lexical() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_inferred_lexical",
      },
      {
        features: `test_localVariableInference_transitive_field_inferred_reversed() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_inferred_reversed",
      },
      {
        features: `test_localVariableInference_transitive_field_lexical() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_lexical",
      },
      {
        features: `test_localVariableInference_transitive_field_reversed() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_reversed",
      },
      {
        features: `test_localVariableInference_transitive_list_local() async {         }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_list_local",
      },
      {
        features: `test_localVariableInference_transitive_local() async {         }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_local",
      },
      {
        features: `test_localVariableInference_transitive_topLevel_inferred_lexical() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_topLevel_inferred_lexical",
      },
      {
        features: `test_localVariableInference_transitive_toplevel_inferred_reversed() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_toplevel_inferred_reversed",
      },
      {
        features: `test_localVariableInference_transitive_topLevel_lexical() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_topLevel_lexical",
      },
      {
        features: `test_localVariableInference_transitive_topLevel_reversed() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_topLevel_reversed",
      },
      {
        features: `TypeAssertions _assertions;`,
        sequence: ";",
        leadingText: "TypeAssertions _assertions",
      },
      {
        features: `Asserter<DartType> _isDynamic;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isDynamic",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOfDynamic;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOfDynamic",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOfInt;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOfInt",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOfNull;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOfNull",
      },
      {
        features: `Asserter<InterfaceType> _isFutureOrOfInt;`,
        sequence: ";",
        leadingText: "Asserter<InterfaceType> _isFutureOrOfInt",
      },
      {
        features: `Asserter<DartType> _isInt;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isInt",
      },
      {
        features: `Asserter<DartType> _isNull;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isNull",
      },
      {
        features: `Asserter<DartType> _isNum;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isNum",
      },
      {
        features: `Asserter<DartType> _isObject;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isObject",
      },
      {
        features: `Asserter<DartType> _isString;`,
        sequence: ";",
        leadingText: "Asserter<DartType> _isString",
      },
      {
        features: `AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, DartType> _isFunction2Of;`,
        sequence: ";",
        leadingText: "AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, DartType> _isFunction2Of",
      },
      {
        features: `AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOf",
      },
      {
        features: `AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOrOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder<List<Asserter<DartType>>, InterfaceType> _isFutureOrOf",
      },
      {
        features: `AsserterBuilderBuilder<Asserter<DartType>, List<Asserter<DartType>>, DartType> _isInstantiationOf;`,
        sequence: ";",
        leadingText: "AsserterBuilderBuilder<Asserter<DartType>, List<Asserter<DartType>>, DartType> _isInstantiationOf",
      },
      {
        features: `AsserterBuilder<Asserter<DartType>, InterfaceType> _isListOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder<Asserter<DartType>, InterfaceType> _isListOf",
      },
      {
        features: `AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, InterfaceType> _isMapOf;`,
        sequence: ";",
        leadingText: "AsserterBuilder2<Asserter<DartType>, Asserter<DartType>, InterfaceType> _isMapOf",
      },
      {
        features: `AsserterBuilder<DartType, DartType> _isType;`,
        sequence: ";",
        leadingText: "AsserterBuilder<DartType, DartType> _isType",
      },
      {
        features: `AsserterBuilder<Element, DartType> _hasElement;`,
        sequence: ";",
        leadingText: "AsserterBuilder<Element, DartType> _hasElement",
      },
      {
        features: `CompilationUnit get unit => result.unit;`,
        sequence: "=>;",
        leadingText: "CompilationUnit get unit",
      },
      {
        features: `test_async_method_propagation() async {                                                      }`,
        sequence: "(){}",
        leadingText: "test_async_method_propagation",
      },
      {
        features: `test_async_propagation() async {                                                    }`,
        sequence: "(){}",
        leadingText: "test_async_propagation",
      },
      {
        features: `test_cascadeExpression() async {                             }`,
        sequence: "(){}",
        leadingText: "test_cascadeExpression",
      },
      {
        features: `test_constrainedByBounds1() async {                  }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds1",
      },
      {
        features: `test_constrainedByBounds2() async {                  }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds2",
      },
      {
        features: `test_constrainedByBounds3() async {               }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds3",
      },
      {
        features: `test_constrainedByBounds4() async {                    }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds4",
      },
      {
        features: `test_constrainedByBounds5() async {                      }`,
        sequence: "(){}",
        leadingText: "test_constrainedByBounds5",
      },
      {
        features: `test_constructorInitializer_propagation() async {             }`,
        sequence: "(){}",
        leadingText: "test_constructorInitializer_propagation",
      },
      {
        features: `test_factoryConstructor_propagation() async {                        }`,
        sequence: "(){}",
        leadingText: "test_factoryConstructor_propagation",
      },
      {
        features: `test_fieldDeclaration_propagation() async {           }`,
        sequence: "(){}",
        leadingText: "test_fieldDeclaration_propagation",
      },
      {
        features: `test_functionDeclaration_body_propagation() async {                                       }`,
        sequence: "(){}",
        leadingText: "test_functionDeclaration_body_propagation",
      },
      {
        features: `test_functionLiteral_assignment_typedArguments() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_assignment_typedArguments",
      },
      {
        features: `test_functionLiteral_assignment_unTypedArguments() async {                                    }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_assignment_unTypedArguments",
      },
      {
        features: `test_functionLiteral_body_propagation() async {                                         }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_body_propagation",
      },
      {
        features: `test_functionLiteral_functionExpressionInvocation_typedArguments() async {                                  }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionExpressionInvocation_typedArguments",
      },
      {
        features: `test_functionLiteral_functionExpressionInvocation_unTypedArguments() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionExpressionInvocation_unTypedArguments",
      },
      {
        features: `test_functionLiteral_functionInvocation_typedArguments() async {                                }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionInvocation_typedArguments",
      },
      {
        features: `test_functionLiteral_functionInvocation_unTypedArguments() async {                               }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_functionInvocation_unTypedArguments",
      },
      {
        features: `test_functionLiteral_methodInvocation_typedArguments() async {                                  }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_methodInvocation_typedArguments",
      },
      {
        features: `test_functionLiteral_methodInvocation_unTypedArguments() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_methodInvocation_unTypedArguments",
      },
      {
        features: `test_functionLiteral_unTypedArgument_propagation() async {                                          }`,
        sequence: "(){}",
        leadingText: "test_functionLiteral_unTypedArgument_propagation",
      },
      {
        features: `test_futureOr_assignFromFuture() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_assignFromFuture",
      },
      {
        features: `test_futureOr_assignFromValue() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_assignFromValue",
      },
      {
        features: `test_futureOr_asyncExpressionBody() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_asyncExpressionBody",
      },
      {
        features: `test_futureOr_asyncReturn() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_asyncReturn",
      },
      {
        features: `test_futureOr_await() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_await",
      },
      {
        features: `test_futureOr_downwards1() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards1",
      },
      {
        features: `test_futureOr_downwards2() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards2",
      },
      {
        features: `test_futureOr_downwards3() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards3",
      },
      {
        features: `test_futureOr_downwards4() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards4",
      },
      {
        features: `test_futureOr_downwards5() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards5",
      },
      {
        features: `test_futureOr_downwards6() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards6",
      },
      {
        features: `test_futureOr_downwards7() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards7",
      },
      {
        features: `test_futureOr_downwards8() async {           }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards8",
      },
      {
        features: `test_futureOr_downwards9() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_downwards9",
      },
      {
        features: `test_futureOr_methods1() async {      }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods1",
      },
      {
        features: `test_futureOr_methods2() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods2",
      },
      {
        features: `test_futureOr_methods3() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods3",
      },
      {
        features: `test_futureOr_methods4() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_methods4",
      },
      {
        features: `test_futureOr_no_return() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_no_return",
      },
      {
        features: `test_futureOr_no_return_value() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_no_return_value",
      },
      {
        features: `test_futureOr_return_null() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_return_null",
      },
      {
        features: `test_futureOr_upwards1() async {        }`,
        sequence: "(){}",
        leadingText: "test_futureOr_upwards1",
      },
      {
        features: `test_futureOr_upwards2() async {          }`,
        sequence: "(){}",
        leadingText: "test_futureOr_upwards2",
      },
      {
        features: `test_futureOrNull_no_return() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOrNull_no_return",
      },
      {
        features: `test_futureOrNull_no_return_value() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOrNull_no_return_value",
      },
      {
        features: `test_futureOrNull_return_null() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOrNull_return_null",
      },
      {
        features: `test_generic_partial() async {                                                }`,
        sequence: "(){}",
        leadingText: "test_generic_partial",
      },
      {
        features: `test_inferConstructor_unknownTypeLowerBound() async {                   }`,
        sequence: "(){}",
        leadingText: "test_inferConstructor_unknownTypeLowerBound",
      },
      {
        features: `test_inference_error_arguments() async {                         }`,
        sequence: "(){}",
        leadingText: "test_inference_error_arguments",
      },
      {
        features: `test_inference_error_arguments2() async {                            }`,
        sequence: "(){}",
        leadingText: "test_inference_error_arguments2",
      },
      {
        features: `test_inference_error_extendsFromReturn() async {                     }`,
        sequence: "(){}",
        leadingText: "test_inference_error_extendsFromReturn",
      },
      {
        features: `test_inference_error_extendsFromReturn2() async {                          }`,
        sequence: "(){}",
        leadingText: "test_inference_error_extendsFromReturn2",
      },
      {
        features: `test_inference_error_genericFunction() async {                          }`,
        sequence: "(){}",
        leadingText: "test_inference_error_genericFunction",
      },
      {
        features: `test_inference_error_returnContext() async {                        }`,
        sequence: "(){}",
        leadingText: "test_inference_error_returnContext",
      },
      {
        features: `test_inference_hints() async {           }`,
        sequence: "(){}",
        leadingText: "test_inference_hints",
      },
      {
        features: `test_inference_simplePolymorphicRecursion_function() async {                         }`,
        sequence: "(){}",
        leadingText: "test_inference_simplePolymorphicRecursion_function",
      },
      {
        features: `test_inference_simplePolymorphicRecursion_interface() async {                         }`,
        sequence: "(){}",
        leadingText: "test_inference_simplePolymorphicRecursion_interface",
      },
      {
        features: `test_inference_simplePolymorphicRecursion_simple() async {                        }`,
        sequence: "(){}",
        leadingText: "test_inference_simplePolymorphicRecursion_simple",
      },
      {
        features: `test_inferGenericInstantiation() async {                      }`,
        sequence: "(){}",
        leadingText: "test_inferGenericInstantiation",
      },
      {
        features: `test_inferGenericInstantiation2() async {                        }`,
        sequence: "(){}",
        leadingText: "test_inferGenericInstantiation2",
      },
      {
        features: `test_inferredFieldDeclaration_propagation() async {                                    }`,
        sequence: "(){}",
        leadingText: "test_inferredFieldDeclaration_propagation",
      },
      {
        features: `test_instanceCreation() async {                                                                                                                                                                                                                                                                                         }`,
        sequence: "(){}",
        leadingText: "test_instanceCreation",
      },
      {
        features: `test_listLiteral_nested() async {                                      }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_nested",
      },
      {
        features: `test_listLiteral_simple() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple",
      },
      {
        features: `test_listLiteral_simple_const() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple_const",
      },
      {
        features: `test_listLiteral_simple_disabled() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple_disabled",
      },
      {
        features: `test_listLiteral_simple_subtype() async {                                 }`,
        sequence: "(){}",
        leadingText: "test_listLiteral_simple_subtype",
      },
      {
        features: `test_mapLiteral_nested() async {                                                 }`,
        sequence: "(){}",
        leadingText: "test_mapLiteral_nested",
      },
      {
        features: `test_mapLiteral_simple() async {                                      }`,
        sequence: "(){}",
        leadingText: "test_mapLiteral_simple",
      },
      {
        features: `test_mapLiteral_simple_disabled() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_mapLiteral_simple_disabled",
      },
      {
        features: `test_methodDeclaration_body_propagation() async {                          }`,
        sequence: "(){}",
        leadingText: "test_methodDeclaration_body_propagation",
      },
      {
        features: `test_partialTypes1() async {                   }`,
        sequence: "(){}",
        leadingText: "test_partialTypes1",
      },
      {
        features: `test_pinning_multipleConstraints1() async {                       }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints1",
      },
      {
        features: `test_pinning_multipleConstraints2() async {                    }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints2",
      },
      {
        features: `test_pinning_multipleConstraints3() async {                       }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints3",
      },
      {
        features: `test_pinning_multipleConstraints4() async {                     }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints4",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant1() async {                        }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant1",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant2() async {                       }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant2",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant3() async {                        }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant3",
      },
      {
        features: `test_pinning_multipleConstraints_contravariant4() async {                        }`,
        sequence: "(){}",
        leadingText: "test_pinning_multipleConstraints_contravariant4",
      },
      {
        features: `test_redirectedConstructor_named() async {                          }`,
        sequence: "(){}",
        leadingText: "test_redirectedConstructor_named",
      },
      {
        features: `test_redirectedConstructor_self() async {       }`,
        sequence: "(){}",
        leadingText: "test_redirectedConstructor_self",
      },
      {
        features: `test_redirectedConstructor_unnamed() async {                        }`,
        sequence: "(){}",
        leadingText: "test_redirectedConstructor_unnamed",
      },
      {
        features: `test_redirectingConstructor_propagation() async {              }`,
        sequence: "(){}",
        leadingText: "test_redirectingConstructor_propagation",
      },
      {
        features: `test_returnType_variance1() async {               }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance1",
      },
      {
        features: `test_returnType_variance2() async {               }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance2",
      },
      {
        features: `test_returnType_variance3() async {                }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance3",
      },
      {
        features: `test_returnType_variance4() async {                }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance4",
      },
      {
        features: `test_returnType_variance5() async {                 }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance5",
      },
      {
        features: `test_returnType_variance6() async {                 }`,
        sequence: "(){}",
        leadingText: "test_returnType_variance6",
      },
      {
        features: `test_superConstructorInvocation_propagation() async {                }`,
        sequence: "(){}",
        leadingText: "test_superConstructorInvocation_propagation",
      },
      {
        features: `void _expectInferenceError() {          }`,
        sequence: "(){}",
        leadingText: "void _expectInferenceError",
      },
      {
        features: `Future<MethodInvocation> _testFutureOr( ) async {           }`,
        sequence: "(){}",
        leadingText: "Future<MethodInvocation> _testFutureOr",
      },
      {
        features: `void expectStaticInvokeType() {   }`,
        sequence: "(){}",
        leadingText: "void expectStaticInvokeType",
      },
      {
        features: `test_dynamicObjectGetter_hashCode() async {          }`,
        sequence: "(){}",
        leadingText: "test_dynamicObjectGetter_hashCode",
      },
      {
        features: `test_futureOr_promotion1() async {       }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion1",
      },
      {
        features: `test_futureOr_promotion2() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion2",
      },
      {
        features: `test_futureOr_promotion3() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion3",
      },
      {
        features: `test_futureOr_promotion4() async {         }`,
        sequence: "(){}",
        leadingText: "test_futureOr_promotion4",
      },
      {
        features: `test_generalizedVoid_assignToVoidOk() async {         }`,
        sequence: "(){}",
        leadingText: "test_generalizedVoid_assignToVoidOk",
      },
      {
        features: `test_genericFunction() async {       }`,
        sequence: "(){}",
        leadingText: "test_genericFunction",
      },
      {
        features: `test_genericFunction_bounds() async {    }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_bounds",
      },
      {
        features: `test_genericFunction_parameter() async {       }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_parameter",
      },
      {
        features: `test_genericFunction_static() async {           }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_static",
      },
      {
        features: `test_genericFunction_typedef() async {                                            }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_typedef",
      },
      {
        features: `test_genericFunction_upwardsAndDownwards() async {    }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_upwardsAndDownwards",
      },
      {
        features: `test_genericFunction_upwardsAndDownwards_Object() async {              }`,
        sequence: "(){}",
        leadingText: "test_genericFunction_upwardsAndDownwards_Object",
      },
      {
        features: `test_genericMethod() async {                  }`,
        sequence: "(){}",
        leadingText: "test_genericMethod",
      },
      {
        features: `test_genericMethod_explicitTypeParams() async {                  }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_explicitTypeParams",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_explicit() async {                                         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_explicit",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_functionTypedParameter_explicit() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_functionTypedParameter_explicit",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_functionTypedParameter_inferred() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_functionTypedParameter_inferred",
      },
      {
        features: `test_genericMethod_functionExpressionInvocation_inferred() async {                                         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionExpressionInvocation_inferred",
      },
      {
        features: `test_genericMethod_functionInvocation_explicit() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_explicit",
      },
      {
        features: `test_genericMethod_functionInvocation_functionTypedParameter_explicit() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_functionTypedParameter_explicit",
      },
      {
        features: `test_genericMethod_functionInvocation_functionTypedParameter_inferred() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_functionTypedParameter_inferred",
      },
      {
        features: `test_genericMethod_functionInvocation_inferred() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionInvocation_inferred",
      },
      {
        features: `test_genericMethod_functionTypedParameter() async {                   }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionTypedParameter",
      },
      {
        features: `test_genericMethod_functionTypedParameter_tearoff() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_functionTypedParameter_tearoff",
      },
      {
        features: `test_genericMethod_implicitDynamic() async {                      }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_implicitDynamic",
      },
      {
        features: `test_genericMethod_max_doubleDouble() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_doubleDouble",
      },
      {
        features: `test_genericMethod_max_doubleDouble_prefixed() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_doubleDouble_prefixed",
      },
      {
        features: `test_genericMethod_max_doubleInt() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_doubleInt",
      },
      {
        features: `test_genericMethod_max_intDouble() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_intDouble",
      },
      {
        features: `test_genericMethod_max_intInt() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_max_intInt",
      },
      {
        features: `test_genericMethod_nestedBound() async {         }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedBound",
      },
      {
        features: `test_genericMethod_nestedCapture() async {              }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedCapture",
      },
      {
        features: `test_genericMethod_nestedCaptureBounds() async {                }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedCaptureBounds",
      },
      {
        features: `test_genericMethod_nestedFunctions() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_nestedFunctions",
      },
      {
        features: `test_genericMethod_override() async {               }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override",
      },
      {
        features: `test_genericMethod_override_bounds() async {               }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_bounds",
      },
      {
        features: `test_genericMethod_override_covariant_field() async {           }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_covariant_field",
      },
      {
        features: `test_genericMethod_override_differentContextsSameBounds() async {               }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_differentContextsSameBounds",
      },
      {
        features: `test_genericMethod_override_invalidContravariantTypeParamBounds() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidContravariantTypeParamBounds",
      },
      {
        features: `test_genericMethod_override_invalidCovariantTypeParamBounds() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidCovariantTypeParamBounds",
      },
      {
        features: `test_genericMethod_override_invalidReturnType() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidReturnType",
      },
      {
        features: `test_genericMethod_override_invalidTypeParamCount() async {          }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_override_invalidTypeParamCount",
      },
      {
        features: `test_genericMethod_propagatedType_promotion() async {                       }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_propagatedType_promotion",
      },
      {
        features: `test_genericMethod_tearoff() async {                                     }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_tearoff",
      },
      {
        features: `test_genericMethod_tearoff_instantiated() async {                             }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_tearoff_instantiated",
      },
      {
        features: `test_genericMethod_then() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_then",
      },
      {
        features: `test_genericMethod_then_prefixed() async {            }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_then_prefixed",
      },
      {
        features: `test_genericMethod_then_propagatedType() async {                }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_then_propagatedType",
      },
      {
        features: `test_genericMethod_toplevel_field_staticTearoff() async {              }`,
        sequence: "(){}",
        leadingText: "test_genericMethod_toplevel_field_staticTearoff",
      },
      {
        features: `test_implicitBounds() async {                              }`,
        sequence: "(){}",
        leadingText: "test_implicitBounds",
      },
      {
        features: `test_instantiateToBounds_class_error_extension_malbounded() async {         }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_extension_malbounded",
      },
      {
        features: `test_instantiateToBounds_class_error_instantiation_malbounded() async {              }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_instantiation_malbounded",
      },
      {
        features: `test_instantiateToBounds_class_error_recursion() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_recursion",
      },
      {
        features: `test_instantiateToBounds_class_error_recursion_self() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_recursion_self",
      },
      {
        features: `test_instantiateToBounds_class_error_recursion_self2() async {       }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_recursion_self2",
      },
      {
        features: `test_instantiateToBounds_class_error_typedef() async {       }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_error_typedef",
      },
      {
        features: `test_instantiateToBounds_class_ok_implicitDynamic_multi() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_implicitDynamic_multi",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_after() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_after",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_after2() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_after2",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_before() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_before",
      },
      {
        features: `test_instantiateToBounds_class_ok_referenceOther_multi() async {      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_referenceOther_multi",
      },
      {
        features: `test_instantiateToBounds_class_ok_simpleBounds() async {                      }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_class_ok_simpleBounds",
      },
      {
        features: `test_instantiateToBounds_generic_function_error_malbounded() async {               }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_generic_function_error_malbounded",
      },
      {
        features: `test_instantiateToBounds_method_ok_referenceOther_before() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_referenceOther_before",
      },
      {
        features: `test_instantiateToBounds_method_ok_referenceOther_before2() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_referenceOther_before2",
      },
      {
        features: `test_instantiateToBounds_method_ok_simpleBounds() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_simpleBounds",
      },
      {
        features: `test_instantiateToBounds_method_ok_simpleBounds2() async {            }`,
        sequence: "(){}",
        leadingText: "test_instantiateToBounds_method_ok_simpleBounds2",
      },
      {
        features: `test_issue32396() async {       }`,
        sequence: "(){}",
        leadingText: "test_issue32396",
      },
      {
        features: `test_objectMethodOnFunctions_Anonymous() async {                                }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Anonymous",
      },
      {
        features: `test_objectMethodOnFunctions_Function() async {                                }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Function",
      },
      {
        features: `test_objectMethodOnFunctions_Static() async {                                }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Static",
      },
      {
        features: `test_objectMethodOnFunctions_Typedef() async {                                  }`,
        sequence: "(){}",
        leadingText: "test_objectMethodOnFunctions_Typedef",
      },
      {
        features: `test_returnOfInvalidType_object_void() async {     }`,
        sequence: "(){}",
        leadingText: "test_returnOfInvalidType_object_void",
      },
      {
        features: `test_setterWithDynamicTypeIsError() async {          }`,
        sequence: "(){}",
        leadingText: "test_setterWithDynamicTypeIsError",
      },
      {
        features: `test_setterWithExplicitVoidType_returningVoid() async {        }`,
        sequence: "(){}",
        leadingText: "test_setterWithExplicitVoidType_returningVoid",
      },
      {
        features: `test_setterWithNoVoidType() async {           }`,
        sequence: "(){}",
        leadingText: "test_setterWithNoVoidType",
      },
      {
        features: `test_setterWithNoVoidType_returningVoid() async {        }`,
        sequence: "(){}",
        leadingText: "test_setterWithNoVoidType_returningVoid",
      },
      {
        features: `test_setterWithOtherTypeIsError() async {          }`,
        sequence: "(){}",
        leadingText: "test_setterWithOtherTypeIsError",
      },
      {
        features: `test_ternaryOperator_null_left() async {         }`,
        sequence: "(){}",
        leadingText: "test_ternaryOperator_null_left",
      },
      {
        features: `test_ternaryOperator_null_right() async {         }`,
        sequence: "(){}",
        leadingText: "test_ternaryOperator_null_right",
      },
      {
        features: `void _assertLocalVarType() {   }`,
        sequence: "(){}",
        leadingText: "void _assertLocalVarType",
      },
      {
        features: `void _assertTopVarType() {   }`,
        sequence: "(){}",
        leadingText: "void _assertTopVarType",
      },
      {
        features: `Future<void> _objectMethodOnFunctions_helper2( ) async {        }`,
        sequence: "(){}",
        leadingText: "Future<void> _objectMethodOnFunctions_helper2",
      },
      {
        features: `test_foreachInference_dynamic_disabled() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_dynamic_disabled",
      },
      {
        features: `test_foreachInference_reusedVar_disabled() async {           }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_reusedVar_disabled",
      },
      {
        features: `test_foreachInference_var() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_var",
      },
      {
        features: `test_foreachInference_var_iterable() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_var_iterable",
      },
      {
        features: `test_foreachInference_var_stream() async {          }`,
        sequence: "(){}",
        leadingText: "test_foreachInference_var_stream",
      },
      {
        features: `test_inconsistentMethodInheritance_inferFunctionTypeFromTypedef() async {                 }`,
        sequence: "(){}",
        leadingText: "test_inconsistentMethodInheritance_inferFunctionTypeFromTypedef",
      },
      {
        features: `test_localVariableInference_bottom_disabled() async {        }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_bottom_disabled",
      },
      {
        features: `test_localVariableInference_constant() async {        }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_constant",
      },
      {
        features: `test_localVariableInference_declaredType_disabled() async {        }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_declaredType_disabled",
      },
      {
        features: `test_localVariableInference_noInitializer_disabled() async {             }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_noInitializer_disabled",
      },
      {
        features: `test_localVariableInference_transitive_field_inferred_lexical() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_inferred_lexical",
      },
      {
        features: `test_localVariableInference_transitive_field_inferred_reversed() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_inferred_reversed",
      },
      {
        features: `test_localVariableInference_transitive_field_lexical() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_lexical",
      },
      {
        features: `test_localVariableInference_transitive_field_reversed() async {              }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_field_reversed",
      },
      {
        features: `test_localVariableInference_transitive_list_local() async {         }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_list_local",
      },
      {
        features: `test_localVariableInference_transitive_local() async {         }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_local",
      },
      {
        features: `test_localVariableInference_transitive_topLevel_inferred_lexical() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_topLevel_inferred_lexical",
      },
      {
        features: `test_localVariableInference_transitive_toplevel_inferred_reversed() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_toplevel_inferred_reversed",
      },
      {
        features: `test_localVariableInference_transitive_topLevel_lexical() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_topLevel_lexical",
      },
      {
        features: `test_localVariableInference_transitive_topLevel_reversed() async {          }`,
        sequence: "(){}",
        leadingText: "test_localVariableInference_transitive_topLevel_reversed",
      },
      {
        features: `Stream<Event> onEvent();`,
        sequence: "();",
        leadingText: "Stream<Event> onEvent",
      },
      {
        features: `Future<Response> callServiceExtension( );`,
        sequence: "();",
        leadingText: "Future<Response> callServiceExtension",
      },
      {
        features: `Future<Breakpoint> addBreakpoint(     );`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpoint",
      },
      {
        features: `Future<Breakpoint> addBreakpointWithScriptUri(     );`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpointWithScriptUri",
      },
      {
        features: `Future<Breakpoint> addBreakpointAtEntry();`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpointAtEntry",
      },
      {
        features: `Future<Success> clearCpuSamples();`,
        sequence: "();",
        leadingText: "Future<Success> clearCpuSamples",
      },
      {
        features: `Future<Success> clearVMTimeline();`,
        sequence: "();",
        leadingText: "Future<Success> clearVMTimeline",
      },
      {
        features: `Future<Response> invoke(      );`,
        sequence: "();",
        leadingText: "Future<Response> invoke",
      },
      {
        features: `Future<Response> evaluate(      );`,
        sequence: "();",
        leadingText: "Future<Response> evaluate",
      },
      {
        features: `Future<Response> evaluateInFrame(      );`,
        sequence: "();",
        leadingText: "Future<Response> evaluateInFrame",
      },
      {
        features: `Future<AllocationProfile> getAllocationProfile( );`,
        sequence: "();",
        leadingText: "Future<AllocationProfile> getAllocationProfile",
      },
      {
        features: `Future<ClassList> getClassList();`,
        sequence: "();",
        leadingText: "Future<ClassList> getClassList",
      },
      {
        features: `Future<CpuSamples> getCpuSamples( );`,
        sequence: "();",
        leadingText: "Future<CpuSamples> getCpuSamples",
      },
      {
        features: `Future<FlagList> getFlagList();`,
        sequence: "();",
        leadingText: "Future<FlagList> getFlagList",
      },
      {
        features: `Future<InboundReferences> getInboundReferences( );`,
        sequence: "();",
        leadingText: "Future<InboundReferences> getInboundReferences",
      },
      {
        features: `Future<InstanceSet> getInstances( );`,
        sequence: "();",
        leadingText: "Future<InstanceSet> getInstances",
      },
      {
        features: `Future<Isolate> getIsolate();`,
        sequence: "();",
        leadingText: "Future<Isolate> getIsolate",
      },
      {
        features: `Future<IsolateGroup> getIsolateGroup();`,
        sequence: "();",
        leadingText: "Future<IsolateGroup> getIsolateGroup",
      },
      {
        features: `Future<MemoryUsage> getMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<MemoryUsage> getMemoryUsage",
      },
      {
        features: `Future<MemoryUsage> getIsolateGroupMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<MemoryUsage> getIsolateGroupMemoryUsage",
      },
      {
        features: `Future<ScriptList> getScripts();`,
        sequence: "();",
        leadingText: "Future<ScriptList> getScripts",
      },
      {
        features: `Future<Obj> getObject(     );`,
        sequence: "();",
        leadingText: "Future<Obj> getObject",
      },
      {
        features: `Future<PortList> getPorts();`,
        sequence: "();",
        leadingText: "Future<PortList> getPorts",
      },
      {
        features: `Future<RetainingPath> getRetainingPath( );`,
        sequence: "();",
        leadingText: "Future<RetainingPath> getRetainingPath",
      },
      {
        features: `Future<ProcessMemoryUsage> getProcessMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<ProcessMemoryUsage> getProcessMemoryUsage",
      },
      {
        features: `Future<Stack> getStack();`,
        sequence: "();",
        leadingText: "Future<Stack> getStack",
      },
      {
        features: `Future<ProtocolList> getSupportedProtocols();`,
        sequence: "();",
        leadingText: "Future<ProtocolList> getSupportedProtocols",
      },
      {
        features: `Future<SourceReport> getSourceReport(        );`,
        sequence: "();",
        leadingText: "Future<SourceReport> getSourceReport",
      },
      {
        features: `Future<Version> getVersion();`,
        sequence: "();",
        leadingText: "Future<Version> getVersion",
      },
      {
        features: `Future<VM> getVM();`,
        sequence: "();",
        leadingText: "Future<VM> getVM",
      },
      {
        features: `Future<Timeline> getVMTimeline();`,
        sequence: "();",
        leadingText: "Future<Timeline> getVMTimeline",
      },
      {
        features: `Future<TimelineFlags> getVMTimelineFlags();`,
        sequence: "();",
        leadingText: "Future<TimelineFlags> getVMTimelineFlags",
      },
      {
        features: `Future<Timestamp> getVMTimelineMicros();`,
        sequence: "();",
        leadingText: "Future<Timestamp> getVMTimelineMicros",
      },
      {
        features: `Future<Success> pause();`,
        sequence: "();",
        leadingText: "Future<Success> pause",
      },
      {
        features: `Future<Success> kill();`,
        sequence: "();",
        leadingText: "Future<Success> kill",
      },
      {
        features: `Future<Success> registerService();`,
        sequence: "();",
        leadingText: "Future<Success> registerService",
      },
      {
        features: `Future<ReloadReport> reloadSources(      );`,
        sequence: "();",
        leadingText: "Future<ReloadReport> reloadSources",
      },
      {
        features: `Future<Success> removeBreakpoint();`,
        sequence: "();",
        leadingText: "Future<Success> removeBreakpoint",
      },
      {
        features: `Future<Success> requestHeapSnapshot();`,
        sequence: "();",
        leadingText: "Future<Success> requestHeapSnapshot",
      },
      {
        features: `Future<Success> resume( );`,
        sequence: "();",
        leadingText: "Future<Success> resume",
      },
      {
        features: `Future<Success> setExceptionPauseMode( );`,
        sequence: "();",
        leadingText: "Future<Success> setExceptionPauseMode",
      },
      {
        features: `Future<Response> setFlag();`,
        sequence: "();",
        leadingText: "Future<Response> setFlag",
      },
      {
        features: `Future<Success> setLibraryDebuggable( );`,
        sequence: "();",
        leadingText: "Future<Success> setLibraryDebuggable",
      },
      {
        features: `Future<Success> setName();`,
        sequence: "();",
        leadingText: "Future<Success> setName",
      },
      {
        features: `Future<Success> setVMName();`,
        sequence: "();",
        leadingText: "Future<Success> setVMName",
      },
      {
        features: `Future<Success> setVMTimelineFlags();`,
        sequence: "();",
        leadingText: "Future<Success> setVMTimelineFlags",
      },
      {
        features: `Future<Success> streamCancel();`,
        sequence: "();",
        leadingText: "Future<Success> streamCancel",
      },
      {
        features: `Future<Success> streamListen();`,
        sequence: "();",
        leadingText: "Future<Success> streamListen",
      },
      {
        features: `Future<Map<String, Object>> get future => _completer.future;`,
        sequence: "=>;",
        leadingText: "Future<Map<String, Object>> get future",
      },
      {
        features: `final _completer = Completer<Map<String, Object>>();`,
        sequence: "=();",
        leadingText: "final _completer",
      },
      {
        features: `final dynamic originalId;`,
        sequence: ";",
        leadingText: "final dynamic originalId",
      },
      {
        features: `void complete() {   }`,
        sequence: "(){}",
        leadingText: "void complete",
      },
      {
        features: `final Stream<Map<String, Object>> _requestStream;`,
        sequence: ";",
        leadingText: "final Stream<Map<String, Object>> _requestStream",
      },
      {
        features: `final StreamSink<Map<String, Object>> _responseSink;`,
        sequence: ";",
        leadingText: "final StreamSink<Map<String, Object>> _responseSink",
      },
      {
        features: `final ServiceExtensionRegistry _serviceExtensionRegistry;`,
        sequence: ";",
        leadingText: "final ServiceExtensionRegistry _serviceExtensionRegistry",
      },
      {
        features: `final VmServiceInterface _serviceImplementation;`,
        sequence: ";",
        leadingText: "final VmServiceInterface _serviceImplementation",
      },
      {
        features: `int _nextServiceRequestId = 0;`,
        sequence: "=;",
        leadingText: "int _nextServiceRequestId",
      },
      {
        features: `final _streamSubscriptions = <String, StreamSubscription>{}`,
        sequence: "={}",
        leadingText: "final _streamSubscriptions",
      },
      {
        features: `Future get done => _doneCompleter.future;`,
        sequence: "=>;",
        leadingText: "Future get done",
      },
      {
        features: `final _doneCompleter = Completer<Null>();`,
        sequence: "=();",
        leadingText: "final _doneCompleter",
      },
      {
        features: `final _pendingServiceExtensionRequests = <dynamic, _PendingServiceRequest>{}`,
        sequence: "={}",
        leadingText: "final _pendingServiceExtensionRequests",
      },
      {
        features: `Future<Map<String, Object>> _forwardServiceExtensionRequest( ) {           }`,
        sequence: "(){}",
        leadingText: "Future<Map<String, Object>> _forwardServiceExtensionRequest",
      },
      {
        features: `void _delegateRequest() async {                                                                                                                                                                                                                                                                                                                                                                    }`,
        sequence: "(){}",
        leadingText: "void _delegateRequest",
      },
      {
        features: `StreamSubscription _streamSub;`,
        sequence: ";",
        leadingText: "StreamSubscription _streamSub",
      },
      {
        features: `Function _writeMessage;`,
        sequence: ";",
        leadingText: "Function _writeMessage",
      },
      {
        features: `int _id = 0;`,
        sequence: "=;",
        leadingText: "int _id",
      },
      {
        features: `Map<String, Completer> _completers = {}`,
        sequence: "={}",
        leadingText: "Map<String, Completer> _completers",
      },
      {
        features: `Map<String, String> _methodCalls = {}`,
        sequence: "={}",
        leadingText: "Map<String, String> _methodCalls",
      },
      {
        features: `Map<String, ServiceCallback> _services = {}`,
        sequence: "={}",
        leadingText: "Map<String, ServiceCallback> _services",
      },
      {
        features: `Log _log;`,
        sequence: ";",
        leadingText: "Log _log",
      },
      {
        features: `StreamController<String> _onSend = StreamController.broadcast();`,
        sequence: "=();",
        leadingText: "StreamController<String> _onSend",
      },
      {
        features: `StreamController<String> _onReceive = StreamController.broadcast();`,
        sequence: "=();",
        leadingText: "StreamController<String> _onReceive",
      },
      {
        features: `final Completer _onDoneCompleter = Completer();`,
        sequence: "=();",
        leadingText: "final Completer _onDoneCompleter",
      },
      {
        features: `Map<String, StreamController<Event>> _eventControllers = {}`,
        sequence: "={}",
        leadingText: "Map<String, StreamController<Event>> _eventControllers",
      },
      {
        features: `StreamController<Event> _getEventController() {       }`,
        sequence: "(){}",
        leadingText: "StreamController<Event> _getEventController",
      },
      {
        features: `DisposeHandler _disposeHandler;`,
        sequence: ";",
        leadingText: "DisposeHandler _disposeHandler",
      },
      {
        features: `Stream<Event> get onVMEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onVMEvent",
      },
      {
        features: `Stream<Event> get onIsolateEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onIsolateEvent",
      },
      {
        features: `Stream<Event> get onDebugEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onDebugEvent",
      },
      {
        features: `Stream<Event> get onGCEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onGCEvent",
      },
      {
        features: `Stream<Event> get onExtensionEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onExtensionEvent",
      },
      {
        features: `Stream<Event> get onTimelineEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onTimelineEvent",
      },
      {
        features: `Stream<Event> get onLoggingEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onLoggingEvent",
      },
      {
        features: `Stream<Event> get onServiceEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onServiceEvent",
      },
      {
        features: `Stream<Event> get onHeapSnapshotEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onHeapSnapshotEvent",
      },
      {
        features: `Stream<Event> get onStdoutEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onStdoutEvent",
      },
      {
        features: `Stream<Event> get onStderrEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onStderrEvent",
      },
      {
        features: `Future<Response> callMethod() {  }`,
        sequence: "(){}",
        leadingText: "Future<Response> callMethod",
      },
      {
        features: `Stream<String> get onSend => _onSend.stream;`,
        sequence: "=>;",
        leadingText: "Stream<String> get onSend",
      },
      {
        features: `Stream<String> get onReceive => _onReceive.stream;`,
        sequence: "=>;",
        leadingText: "Stream<String> get onReceive",
      },
      {
        features: `void dispose() {              }`,
        sequence: "(){}",
        leadingText: "void dispose",
      },
      {
        features: `Future get onDone => _onDoneCompleter.future;`,
        sequence: "=>;",
        leadingText: "Future get onDone",
      },
      {
        features: `Future<T> _call<T>() {               }`,
        sequence: "(){}",
        leadingText: "Future<T> _call<T>",
      },
      {
        features: `void registerServiceCallback() {     }`,
        sequence: "(){}",
        leadingText: "void registerServiceCallback",
      },
      {
        features: `void _processMessage() {             }`,
        sequence: "(){}",
        leadingText: "void _processMessage",
      },
      {
        features: `void _processMessageByteData() {                 }`,
        sequence: "(){}",
        leadingText: "void _processMessageByteData",
      },
      {
        features: `void _processMessageStr() {                       }`,
        sequence: "(){}",
        leadingText: "void _processMessageStr",
      },
      {
        features: `void _processResponse() {                   }`,
        sequence: "(){}",
        leadingText: "void _processResponse",
      },
      {
        features: `Future _processRequest() async {        }`,
        sequence: "(){}",
        leadingText: "Future _processRequest",
      },
      {
        features: `Future _processNotification() async {          }`,
        sequence: "(){}",
        leadingText: "Future _processNotification",
      },
      {
        features: `Future<Map> _routeRequest() async {                  }`,
        sequence: "(){}",
        leadingText: "Future<Map> _routeRequest",
      },
      {
        features: `static const int kServerError = -32000;`,
        sequence: "=;",
        leadingText: "static const int kServerError",
      },
      {
        features: `static const int kInvalidRequest = -32600;`,
        sequence: "=;",
        leadingText: "static const int kInvalidRequest",
      },
      {
        features: `static const int kMethodNotFound = -32601;`,
        sequence: "=;",
        leadingText: "static const int kMethodNotFound",
      },
      {
        features: `static const int kInvalidParams = -32602;`,
        sequence: "=;",
        leadingText: "static const int kInvalidParams",
      },
      {
        features: `static const int kInternalError = -32603;`,
        sequence: "=;",
        leadingText: "static const int kInternalError",
      },
      {
        features: `static RPCError parse() {  }`,
        sequence: "(){}",
        leadingText: "static RPCError parse",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final int code;`,
        sequence: ";",
        leadingText: "final int code",
      },
      {
        features: `final String message;`,
        sequence: ";",
        leadingText: "final String message",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `String get details => data == null ? null : data[''];`,
        sequence: "=>==[];",
        leadingText: "String get details",
      },
      {
        features: `Map<String, dynamic> toMap() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toMap",
      },
      {
        features: `String toString() {      }`,
        sequence: "(){}",
        leadingText: "String toString",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final Sentinel sentinel;`,
        sequence: ";",
        leadingText: "final Sentinel sentinel",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ExtensionData parse() => json == null ? null : ExtensionData._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ExtensionData parse",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `void warning();`,
        sequence: "();",
        leadingText: "void warning",
      },
      {
        features: `void severe();`,
        sequence: "();",
        leadingText: "void severe",
      },
      {
        features: `void warning() {}`,
        sequence: "(){}",
        leadingText: "void warning",
      },
      {
        features: `void severe() {}`,
        sequence: "(){}",
        leadingText: "void severe",
      },
      {
        features: `static const String kDart = '';`,
        sequence: "=;",
        leadingText: "static const String kDart",
      },
      {
        features: `static const String kNative = '';`,
        sequence: "=;",
        leadingText: "static const String kNative",
      },
      {
        features: `static const String kStub = '';`,
        sequence: "=;",
        leadingText: "static const String kStub",
      },
      {
        features: `static const String kTag = '';`,
        sequence: "=;",
        leadingText: "static const String kTag",
      },
      {
        features: `static const String kCollected = '';`,
        sequence: "=;",
        leadingText: "static const String kCollected",
      },
      {
        features: `static const String kUnhandledException = '';`,
        sequence: "=;",
        leadingText: "static const String kUnhandledException",
      },
      {
        features: `static const String kLanguageError = '';`,
        sequence: "=;",
        leadingText: "static const String kLanguageError",
      },
      {
        features: `static const String kInternalError = '';`,
        sequence: "=;",
        leadingText: "static const String kInternalError",
      },
      {
        features: `static const String kTerminationError = '';`,
        sequence: "=;",
        leadingText: "static const String kTerminationError",
      },
      {
        features: `static const String kVM = '';`,
        sequence: "=;",
        leadingText: "static const String kVM",
      },
      {
        features: `static const String kIsolate = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolate",
      },
      {
        features: `static const String kDebug = '';`,
        sequence: "=;",
        leadingText: "static const String kDebug",
      },
      {
        features: `static const String kGC = '';`,
        sequence: "=;",
        leadingText: "static const String kGC",
      },
      {
        features: `static const String kExtension = '';`,
        sequence: "=;",
        leadingText: "static const String kExtension",
      },
      {
        features: `static const String kTimeline = '';`,
        sequence: "=;",
        leadingText: "static const String kTimeline",
      },
      {
        features: `static const String kLogging = '';`,
        sequence: "=;",
        leadingText: "static const String kLogging",
      },
      {
        features: `static const String kService = '';`,
        sequence: "=;",
        leadingText: "static const String kService",
      },
      {
        features: `static const String kHeapSnapshot = '';`,
        sequence: "=;",
        leadingText: "static const String kHeapSnapshot",
      },
      {
        features: `static const String kStdout = '';`,
        sequence: "=;",
        leadingText: "static const String kStdout",
      },
      {
        features: `static const String kStderr = '';`,
        sequence: "=;",
        leadingText: "static const String kStderr",
      },
      {
        features: `static const String kVMUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kVMUpdate",
      },
      {
        features: `static const String kVMFlagUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kVMFlagUpdate",
      },
      {
        features: `static const String kIsolateStart = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateStart",
      },
      {
        features: `static const String kIsolateRunnable = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateRunnable",
      },
      {
        features: `static const String kIsolateExit = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateExit",
      },
      {
        features: `static const String kIsolateUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateUpdate",
      },
      {
        features: `static const String kIsolateReload = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateReload",
      },
      {
        features: `static const String kServiceExtensionAdded = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceExtensionAdded",
      },
      {
        features: `static const String kPauseStart = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseStart",
      },
      {
        features: `static const String kPauseExit = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseExit",
      },
      {
        features: `static const String kPauseBreakpoint = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseBreakpoint",
      },
      {
        features: `static const String kPauseInterrupted = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseInterrupted",
      },
      {
        features: `static const String kPauseException = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseException",
      },
      {
        features: `static const String kPausePostRequest = '';`,
        sequence: "=;",
        leadingText: "static const String kPausePostRequest",
      },
      {
        features: `static const String kResume = '';`,
        sequence: "=;",
        leadingText: "static const String kResume",
      },
      {
        features: `static const String kNone = '';`,
        sequence: "=;",
        leadingText: "static const String kNone",
      },
      {
        features: `static const String kBreakpointAdded = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointAdded",
      },
      {
        features: `static const String kBreakpointResolved = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointResolved",
      },
      {
        features: `static const String kBreakpointRemoved = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointRemoved",
      },
      {
        features: `static const String kGC = '';`,
        sequence: "=;",
        leadingText: "static const String kGC",
      },
      {
        features: `static const String kWriteEvent = '';`,
        sequence: "=;",
        leadingText: "static const String kWriteEvent",
      },
      {
        features: `static const String kInspect = '';`,
        sequence: "=;",
        leadingText: "static const String kInspect",
      },
      {
        features: `static const String kExtension = '';`,
        sequence: "=;",
        leadingText: "static const String kExtension",
      },
      {
        features: `static const String kLogging = '';`,
        sequence: "=;",
        leadingText: "static const String kLogging",
      },
      {
        features: `static const String kTimelineEvents = '';`,
        sequence: "=;",
        leadingText: "static const String kTimelineEvents",
      },
      {
        features: `static const String kTimelineStreamSubscriptionsUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kTimelineStreamSubscriptionsUpdate",
      },
      {
        features: `static const String kServiceRegistered = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceRegistered",
      },
      {
        features: `static const String kServiceUnregistered = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceUnregistered",
      },
      {
        features: `static const String kPlainInstance = '';`,
        sequence: "=;",
        leadingText: "static const String kPlainInstance",
      },
      {
        features: `static const String kNull = '';`,
        sequence: "=;",
        leadingText: "static const String kNull",
      },
      {
        features: `static const String kBool = '';`,
        sequence: "=;",
        leadingText: "static const String kBool",
      },
      {
        features: `static const String kDouble = '';`,
        sequence: "=;",
        leadingText: "static const String kDouble",
      },
      {
        features: `static const String kInt = '';`,
        sequence: "=;",
        leadingText: "static const String kInt",
      },
      {
        features: `static const String kString = '';`,
        sequence: "=;",
        leadingText: "static const String kString",
      },
      {
        features: `static const String kList = '';`,
        sequence: "=;",
        leadingText: "static const String kList",
      },
      {
        features: `static const String kMap = '';`,
        sequence: "=;",
        leadingText: "static const String kMap",
      },
      {
        features: `static const String kFloat32x4 = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32x4",
      },
      {
        features: `static const String kFloat64x2 = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64x2",
      },
      {
        features: `static const String kInt32x4 = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32x4",
      },
      {
        features: `static const String kUint8ClampedList = '';`,
        sequence: "=;",
        leadingText: "static const String kUint8ClampedList",
      },
      {
        features: `static const String kUint8List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint8List",
      },
      {
        features: `static const String kUint16List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint16List",
      },
      {
        features: `static const String kUint32List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint32List",
      },
      {
        features: `static const String kUint64List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint64List",
      },
      {
        features: `static const String kInt8List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt8List",
      },
      {
        features: `static const String kInt16List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt16List",
      },
      {
        features: `static const String kInt32List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32List",
      },
      {
        features: `static const String kInt64List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt64List",
      },
      {
        features: `static const String kFloat32List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32List",
      },
      {
        features: `static const String kFloat64List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64List",
      },
      {
        features: `static const String kInt32x4List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32x4List",
      },
      {
        features: `static const String kFloat32x4List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32x4List",
      },
      {
        features: `static const String kFloat64x2List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64x2List",
      },
      {
        features: `static const String kStackTrace = '';`,
        sequence: "=;",
        leadingText: "static const String kStackTrace",
      },
      {
        features: `static const String kClosure = '';`,
        sequence: "=;",
        leadingText: "static const String kClosure",
      },
      {
        features: `static const String kMirrorReference = '';`,
        sequence: "=;",
        leadingText: "static const String kMirrorReference",
      },
      {
        features: `static const String kRegExp = '';`,
        sequence: "=;",
        leadingText: "static const String kRegExp",
      },
      {
        features: `static const String kWeakProperty = '';`,
        sequence: "=;",
        leadingText: "static const String kWeakProperty",
      },
      {
        features: `static const String kType = '';`,
        sequence: "=;",
        leadingText: "static const String kType",
      },
      {
        features: `static const String kTypeParameter = '';`,
        sequence: "=;",
        leadingText: "static const String kTypeParameter",
      },
      {
        features: `static const String kTypeRef = '';`,
        sequence: "=;",
        leadingText: "static const String kTypeRef",
      },
      {
        features: `static const String kBoundedType = '';`,
        sequence: "=;",
        leadingText: "static const String kBoundedType",
      },
      {
        features: `static const String kReceivePort = '';`,
        sequence: "=;",
        leadingText: "static const String kReceivePort",
      },
      {
        features: `static const String kCollected = '';`,
        sequence: "=;",
        leadingText: "static const String kCollected",
      },
      {
        features: `static const String kExpired = '';`,
        sequence: "=;",
        leadingText: "static const String kExpired",
      },
      {
        features: `static const String kNotInitialized = '';`,
        sequence: "=;",
        leadingText: "static const String kNotInitialized",
      },
      {
        features: `static const String kBeingInitialized = '';`,
        sequence: "=;",
        leadingText: "static const String kBeingInitialized",
      },
      {
        features: `static const String kOptimizedOut = '';`,
        sequence: "=;",
        leadingText: "static const String kOptimizedOut",
      },
      {
        features: `static const String kFree = '';`,
        sequence: "=;",
        leadingText: "static const String kFree",
      },
      {
        features: `static const String kRegular = '';`,
        sequence: "=;",
        leadingText: "static const String kRegular",
      },
      {
        features: `static const String kAsyncCausal = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncCausal",
      },
      {
        features: `static const String kAsyncSuspensionMarker = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncSuspensionMarker",
      },
      {
        features: `static const String kAsyncActivation = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncActivation",
      },
      {
        features: `static const String kCoverage = '';`,
        sequence: "=;",
        leadingText: "static const String kCoverage",
      },
      {
        features: `static const String kPossibleBreakpoints = '';`,
        sequence: "=;",
        leadingText: "static const String kPossibleBreakpoints",
      },
      {
        features: `static const String kNone = '';`,
        sequence: "=;",
        leadingText: "static const String kNone",
      },
      {
        features: `static const String kUnhandled = '';`,
        sequence: "=;",
        leadingText: "static const String kUnhandled",
      },
      {
        features: `static const String kAll = '';`,
        sequence: "=;",
        leadingText: "static const String kAll",
      },
      {
        features: `static const String kInto = '';`,
        sequence: "=;",
        leadingText: "static const String kInto",
      },
      {
        features: `static const String kOver = '';`,
        sequence: "=;",
        leadingText: "static const String kOver",
      },
      {
        features: `static const String kOverAsyncSuspension = '';`,
        sequence: "=;",
        leadingText: "static const String kOverAsyncSuspension",
      },
      {
        features: `static const String kOut = '';`,
        sequence: "=;",
        leadingText: "static const String kOut",
      },
      {
        features: `static const String kRewind = '';`,
        sequence: "=;",
        leadingText: "static const String kRewind",
      },
      {
        features: `static AllocationProfile parse() => json == null ? null : AllocationProfile._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static AllocationProfile parse",
      },
      {
        features: `List<ClassHeapStats> members;`,
        sequence: ";",
        leadingText: "List<ClassHeapStats> members",
      },
      {
        features: `MemoryUsage memoryUsage;`,
        sequence: ";",
        leadingText: "MemoryUsage memoryUsage",
      },
      {
        features: `int dateLastAccumulatorReset;`,
        sequence: ";",
        leadingText: "int dateLastAccumulatorReset",
      },
      {
        features: `int dateLastServiceGC;`,
        sequence: ";",
        leadingText: "int dateLastServiceGC",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static BoundField parse() => json == null ? null : BoundField._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static BoundField parse",
      },
      {
        features: `FieldRef decl;`,
        sequence: ";",
        leadingText: "FieldRef decl",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static BoundVariable parse() => json == null ? null : BoundVariable._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static BoundVariable parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `int declarationTokenPos;`,
        sequence: ";",
        leadingText: "int declarationTokenPos",
      },
      {
        features: `int scopeStartTokenPos;`,
        sequence: ";",
        leadingText: "int scopeStartTokenPos",
      },
      {
        features: `int scopeEndTokenPos;`,
        sequence: ";",
        leadingText: "int scopeEndTokenPos",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Breakpoint parse() => json == null ? null : Breakpoint._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Breakpoint parse",
      },
      {
        features: `int breakpointNumber;`,
        sequence: ";",
        leadingText: "int breakpointNumber",
      },
      {
        features: `bool resolved;`,
        sequence: ";",
        leadingText: "bool resolved",
      },
      {
        features: `bool isSyntheticAsyncContinuation;`,
        sequence: ";",
        leadingText: "bool isSyntheticAsyncContinuation",
      },
      {
        features: `dynamic location;`,
        sequence: ";",
        leadingText: "dynamic location",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Breakpoint && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ClassRef parse() => json == null ? null : ClassRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ClassRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Class parse() => json == null ? null : Class._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Class parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ErrorRef error;`,
        sequence: ";",
        leadingText: "ErrorRef error",
      },
      {
        features: `bool isAbstract;`,
        sequence: ";",
        leadingText: "bool isAbstract",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `LibraryRef library;`,
        sequence: ";",
        leadingText: "LibraryRef library",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `ClassRef superClass;`,
        sequence: ";",
        leadingText: "ClassRef superClass",
      },
      {
        features: `InstanceRef superType;`,
        sequence: ";",
        leadingText: "InstanceRef superType",
      },
      {
        features: `List<InstanceRef> interfaces;`,
        sequence: ";",
        leadingText: "List<InstanceRef> interfaces",
      },
      {
        features: `InstanceRef mixin;`,
        sequence: ";",
        leadingText: "InstanceRef mixin",
      },
      {
        features: `List<FieldRef> fields;`,
        sequence: ";",
        leadingText: "List<FieldRef> fields",
      },
      {
        features: `List<FuncRef> functions;`,
        sequence: ";",
        leadingText: "List<FuncRef> functions",
      },
      {
        features: `List<ClassRef> subclasses;`,
        sequence: ";",
        leadingText: "List<ClassRef> subclasses",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Class && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ClassHeapStats parse() => json == null ? null : ClassHeapStats._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassHeapStats parse",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `int accumulatedSize;`,
        sequence: ";",
        leadingText: "int accumulatedSize",
      },
      {
        features: `int bytesCurrent;`,
        sequence: ";",
        leadingText: "int bytesCurrent",
      },
      {
        features: `int instancesAccumulated;`,
        sequence: ";",
        leadingText: "int instancesAccumulated",
      },
      {
        features: `int instancesCurrent;`,
        sequence: ";",
        leadingText: "int instancesCurrent",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ClassList parse() => json == null ? null : ClassList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassList parse",
      },
      {
        features: `List<ClassRef> classes;`,
        sequence: ";",
        leadingText: "List<ClassRef> classes",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static CodeRef parse() => json == null ? null : CodeRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CodeRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is CodeRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Code parse() => json == null ? null : Code._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Code parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Code && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ContextRef parse() => json == null ? null : ContextRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ContextRef parse",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ContextRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Context parse() => json == null ? null : Context._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Context parse",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `Context parent;`,
        sequence: ";",
        leadingText: "Context parent",
      },
      {
        features: `List<ContextElement> variables;`,
        sequence: ";",
        leadingText: "List<ContextElement> variables",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Context && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ContextElement parse() => json == null ? null : ContextElement._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ContextElement parse",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `Map<String, dynamic> toJson() {      }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static CpuSamples parse() => json == null ? null : CpuSamples._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CpuSamples parse",
      },
      {
        features: `int samplePeriod;`,
        sequence: ";",
        leadingText: "int samplePeriod",
      },
      {
        features: `int maxStackDepth;`,
        sequence: ";",
        leadingText: "int maxStackDepth",
      },
      {
        features: `int sampleCount;`,
        sequence: ";",
        leadingText: "int sampleCount",
      },
      {
        features: `int timeSpan;`,
        sequence: ";",
        leadingText: "int timeSpan",
      },
      {
        features: `int timeOriginMicros;`,
        sequence: ";",
        leadingText: "int timeOriginMicros",
      },
      {
        features: `int timeExtentMicros;`,
        sequence: ";",
        leadingText: "int timeExtentMicros",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `List<ProfileFunction> functions;`,
        sequence: ";",
        leadingText: "List<ProfileFunction> functions",
      },
      {
        features: `List<CpuSample> samples;`,
        sequence: ";",
        leadingText: "List<CpuSample> samples",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static CpuSample parse() => json == null ? null : CpuSample._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CpuSample parse",
      },
      {
        features: `int tid;`,
        sequence: ";",
        leadingText: "int tid",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `String vmTag;`,
        sequence: ";",
        leadingText: "String vmTag",
      },
      {
        features: `String userTag;`,
        sequence: ";",
        leadingText: "String userTag",
      },
      {
        features: `bool truncated;`,
        sequence: ";",
        leadingText: "bool truncated",
      },
      {
        features: `List<int> stack;`,
        sequence: ";",
        leadingText: "List<int> stack",
      },
      {
        features: `Map<String, dynamic> toJson() {           }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ErrorRef parse() => json == null ? null : ErrorRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ErrorRef parse",
      },
      {
        features: `String message;`,
        sequence: ";",
        leadingText: "String message",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ErrorRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Error parse() => json == null ? null : Error._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Error parse",
      },
      {
        features: `String message;`,
        sequence: ";",
        leadingText: "String message",
      },
      {
        features: `InstanceRef exception;`,
        sequence: ";",
        leadingText: "InstanceRef exception",
      },
      {
        features: `InstanceRef stacktrace;`,
        sequence: ";",
        leadingText: "InstanceRef stacktrace",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Error && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Event parse() => json == null ? null : Event._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Event parse",
      },
      {
        features: `IsolateRef isolate;`,
        sequence: ";",
        leadingText: "IsolateRef isolate",
      },
      {
        features: `VMRef vm;`,
        sequence: ";",
        leadingText: "VMRef vm",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `Breakpoint breakpoint;`,
        sequence: ";",
        leadingText: "Breakpoint breakpoint",
      },
      {
        features: `List<Breakpoint> pauseBreakpoints;`,
        sequence: ";",
        leadingText: "List<Breakpoint> pauseBreakpoints",
      },
      {
        features: `Frame topFrame;`,
        sequence: ";",
        leadingText: "Frame topFrame",
      },
      {
        features: `InstanceRef exception;`,
        sequence: ";",
        leadingText: "InstanceRef exception",
      },
      {
        features: `String bytes;`,
        sequence: ";",
        leadingText: "String bytes",
      },
      {
        features: `InstanceRef inspectee;`,
        sequence: ";",
        leadingText: "InstanceRef inspectee",
      },
      {
        features: `String extensionRPC;`,
        sequence: ";",
        leadingText: "String extensionRPC",
      },
      {
        features: `String extensionKind;`,
        sequence: ";",
        leadingText: "String extensionKind",
      },
      {
        features: `ExtensionData extensionData;`,
        sequence: ";",
        leadingText: "ExtensionData extensionData",
      },
      {
        features: `List<TimelineEvent> timelineEvents;`,
        sequence: ";",
        leadingText: "List<TimelineEvent> timelineEvents",
      },
      {
        features: `List<String> updatedStreams;`,
        sequence: ";",
        leadingText: "List<String> updatedStreams",
      },
      {
        features: `bool atAsyncSuspension;`,
        sequence: ";",
        leadingText: "bool atAsyncSuspension",
      },
      {
        features: `String status;`,
        sequence: ";",
        leadingText: "String status",
      },
      {
        features: `LogRecord logRecord;`,
        sequence: ";",
        leadingText: "LogRecord logRecord",
      },
      {
        features: `String service;`,
        sequence: ";",
        leadingText: "String service",
      },
      {
        features: `String method;`,
        sequence: ";",
        leadingText: "String method",
      },
      {
        features: `String alias;`,
        sequence: ";",
        leadingText: "String alias",
      },
      {
        features: `String flag;`,
        sequence: ";",
        leadingText: "String flag",
      },
      {
        features: `String newValue;`,
        sequence: ";",
        leadingText: "String newValue",
      },
      {
        features: `bool last;`,
        sequence: ";",
        leadingText: "bool last",
      },
      {
        features: `ByteData data;`,
        sequence: ";",
        leadingText: "ByteData data",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static FieldRef parse() => json == null ? null : FieldRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FieldRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ObjRef owner;`,
        sequence: ";",
        leadingText: "ObjRef owner",
      },
      {
        features: `InstanceRef declaredType;`,
        sequence: ";",
        leadingText: "InstanceRef declaredType",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isFinal;`,
        sequence: ";",
        leadingText: "bool isFinal",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is FieldRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Field parse() => json == null ? null : Field._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Field parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ObjRef owner;`,
        sequence: ";",
        leadingText: "ObjRef owner",
      },
      {
        features: `InstanceRef declaredType;`,
        sequence: ";",
        leadingText: "InstanceRef declaredType",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isFinal;`,
        sequence: ";",
        leadingText: "bool isFinal",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `InstanceRef staticValue;`,
        sequence: ";",
        leadingText: "InstanceRef staticValue",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Field && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Flag parse() => json == null ? null : Flag._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Flag parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String comment;`,
        sequence: ";",
        leadingText: "String comment",
      },
      {
        features: `bool modified;`,
        sequence: ";",
        leadingText: "bool modified",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static FlagList parse() => json == null ? null : FlagList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FlagList parse",
      },
      {
        features: `List<Flag> flags;`,
        sequence: ";",
        leadingText: "List<Flag> flags",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Frame parse() => json == null ? null : Frame._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Frame parse",
      },
      {
        features: `int index;`,
        sequence: ";",
        leadingText: "int index",
      },
      {
        features: `FuncRef function;`,
        sequence: ";",
        leadingText: "FuncRef function",
      },
      {
        features: `CodeRef code;`,
        sequence: ";",
        leadingText: "CodeRef code",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `List<BoundVariable> vars;`,
        sequence: ";",
        leadingText: "List<BoundVariable> vars",
      },
      {
        features: `String kind;`,
        sequence: ";",
        leadingText: "String kind",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static FuncRef parse() => json == null ? null : FuncRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FuncRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic owner;`,
        sequence: ";",
        leadingText: "dynamic owner",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is FuncRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Func parse() => json == null ? null : Func._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Func parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic owner;`,
        sequence: ";",
        leadingText: "dynamic owner",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `CodeRef code;`,
        sequence: ";",
        leadingText: "CodeRef code",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Func && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InstanceRef parse() => json == null ? null : InstanceRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InstanceRef parse",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `bool valueAsStringIsTruncated;`,
        sequence: ";",
        leadingText: "bool valueAsStringIsTruncated",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ClassRef typeClass;`,
        sequence: ";",
        leadingText: "ClassRef typeClass",
      },
      {
        features: `ClassRef parameterizedClass;`,
        sequence: ";",
        leadingText: "ClassRef parameterizedClass",
      },
      {
        features: `InstanceRef pattern;`,
        sequence: ";",
        leadingText: "InstanceRef pattern",
      },
      {
        features: `FuncRef closureFunction;`,
        sequence: ";",
        leadingText: "FuncRef closureFunction",
      },
      {
        features: `ContextRef closureContext;`,
        sequence: ";",
        leadingText: "ContextRef closureContext",
      },
      {
        features: `int portId;`,
        sequence: ";",
        leadingText: "int portId",
      },
      {
        features: `InstanceRef allocationLocation;`,
        sequence: ";",
        leadingText: "InstanceRef allocationLocation",
      },
      {
        features: `String debugName;`,
        sequence: ";",
        leadingText: "String debugName",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is InstanceRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Instance parse() => json == null ? null : Instance._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Instance parse",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `bool valueAsStringIsTruncated;`,
        sequence: ";",
        leadingText: "bool valueAsStringIsTruncated",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `int offset;`,
        sequence: ";",
        leadingText: "int offset",
      },
      {
        features: `int count;`,
        sequence: ";",
        leadingText: "int count",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ClassRef typeClass;`,
        sequence: ";",
        leadingText: "ClassRef typeClass",
      },
      {
        features: `ClassRef parameterizedClass;`,
        sequence: ";",
        leadingText: "ClassRef parameterizedClass",
      },
      {
        features: `List<BoundField> fields;`,
        sequence: ";",
        leadingText: "List<BoundField> fields",
      },
      {
        features: `List<dynamic> elements;`,
        sequence: ";",
        leadingText: "List<dynamic> elements",
      },
      {
        features: `List<MapAssociation> associations;`,
        sequence: ";",
        leadingText: "List<MapAssociation> associations",
      },
      {
        features: `String bytes;`,
        sequence: ";",
        leadingText: "String bytes",
      },
      {
        features: `InstanceRef mirrorReferent;`,
        sequence: ";",
        leadingText: "InstanceRef mirrorReferent",
      },
      {
        features: `InstanceRef pattern;`,
        sequence: ";",
        leadingText: "InstanceRef pattern",
      },
      {
        features: `FuncRef closureFunction;`,
        sequence: ";",
        leadingText: "FuncRef closureFunction",
      },
      {
        features: `ContextRef closureContext;`,
        sequence: ";",
        leadingText: "ContextRef closureContext",
      },
      {
        features: `bool isCaseSensitive;`,
        sequence: ";",
        leadingText: "bool isCaseSensitive",
      },
      {
        features: `bool isMultiLine;`,
        sequence: ";",
        leadingText: "bool isMultiLine",
      },
      {
        features: `InstanceRef propertyKey;`,
        sequence: ";",
        leadingText: "InstanceRef propertyKey",
      },
      {
        features: `InstanceRef propertyValue;`,
        sequence: ";",
        leadingText: "InstanceRef propertyValue",
      },
      {
        features: `TypeArgumentsRef typeArguments;`,
        sequence: ";",
        leadingText: "TypeArgumentsRef typeArguments",
      },
      {
        features: `int parameterIndex;`,
        sequence: ";",
        leadingText: "int parameterIndex",
      },
      {
        features: `InstanceRef targetType;`,
        sequence: ";",
        leadingText: "InstanceRef targetType",
      },
      {
        features: `InstanceRef bound;`,
        sequence: ";",
        leadingText: "InstanceRef bound",
      },
      {
        features: `int portId;`,
        sequence: ";",
        leadingText: "int portId",
      },
      {
        features: `InstanceRef allocationLocation;`,
        sequence: ";",
        leadingText: "InstanceRef allocationLocation",
      },
      {
        features: `String debugName;`,
        sequence: ";",
        leadingText: "String debugName",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Instance && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateRef parse() => json == null ? null : IsolateRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateRef parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolate;`,
        sequence: ";",
        leadingText: "bool isSystemIsolate",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Isolate parse() => json == null ? null : Isolate._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Isolate parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolate;`,
        sequence: ";",
        leadingText: "bool isSystemIsolate",
      },
      {
        features: `List<IsolateFlag> isolateFlags;`,
        sequence: ";",
        leadingText: "List<IsolateFlag> isolateFlags",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `bool runnable;`,
        sequence: ";",
        leadingText: "bool runnable",
      },
      {
        features: `int livePorts;`,
        sequence: ";",
        leadingText: "int livePorts",
      },
      {
        features: `bool pauseOnExit;`,
        sequence: ";",
        leadingText: "bool pauseOnExit",
      },
      {
        features: `Event pauseEvent;`,
        sequence: ";",
        leadingText: "Event pauseEvent",
      },
      {
        features: `LibraryRef rootLib;`,
        sequence: ";",
        leadingText: "LibraryRef rootLib",
      },
      {
        features: `List<LibraryRef> libraries;`,
        sequence: ";",
        leadingText: "List<LibraryRef> libraries",
      },
      {
        features: `List<Breakpoint> breakpoints;`,
        sequence: ";",
        leadingText: "List<Breakpoint> breakpoints",
      },
      {
        features: `Error error;`,
        sequence: ";",
        leadingText: "Error error",
      },
      {
        features: `List<String> extensionRPCs;`,
        sequence: ";",
        leadingText: "List<String> extensionRPCs",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Isolate && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateFlag parse() => json == null ? null : IsolateFlag._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateFlag parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateGroupRef parse() => json == null ? null : IsolateGroupRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateGroupRef parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolateGroup;`,
        sequence: ";",
        leadingText: "bool isSystemIsolateGroup",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateGroupRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateGroup parse() => json == null ? null : IsolateGroup._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateGroup parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolateGroup;`,
        sequence: ";",
        leadingText: "bool isSystemIsolateGroup",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateGroup && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InboundReferences parse() => json == null ? null : InboundReferences._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InboundReferences parse",
      },
      {
        features: `List<InboundReference> references;`,
        sequence: ";",
        leadingText: "List<InboundReference> references",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InboundReference parse() => json == null ? null : InboundReference._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InboundReference parse",
      },
      {
        features: `ObjRef source;`,
        sequence: ";",
        leadingText: "ObjRef source",
      },
      {
        features: `int parentListIndex;`,
        sequence: ";",
        leadingText: "int parentListIndex",
      },
      {
        features: `FieldRef parentField;`,
        sequence: ";",
        leadingText: "FieldRef parentField",
      },
      {
        features: `Map<String, dynamic> toJson() {        }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InstanceSet parse() => json == null ? null : InstanceSet._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InstanceSet parse",
      },
      {
        features: `int totalCount;`,
        sequence: ";",
        leadingText: "int totalCount",
      },
      {
        features: `List<ObjRef> instances;`,
        sequence: ";",
        leadingText: "List<ObjRef> instances",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static LibraryRef parse() => json == null ? null : LibraryRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LibraryRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is LibraryRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Library parse() => json == null ? null : Library._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Library parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `bool debuggable;`,
        sequence: ";",
        leadingText: "bool debuggable",
      },
      {
        features: `List<LibraryDependency> dependencies;`,
        sequence: ";",
        leadingText: "List<LibraryDependency> dependencies",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `List<FieldRef> variables;`,
        sequence: ";",
        leadingText: "List<FieldRef> variables",
      },
      {
        features: `List<FuncRef> functions;`,
        sequence: ";",
        leadingText: "List<FuncRef> functions",
      },
      {
        features: `List<ClassRef> classes;`,
        sequence: ";",
        leadingText: "List<ClassRef> classes",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Library && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static LibraryDependency parse() => json == null ? null : LibraryDependency._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LibraryDependency parse",
      },
      {
        features: `bool isImport;`,
        sequence: ";",
        leadingText: "bool isImport",
      },
      {
        features: `bool isDeferred;`,
        sequence: ";",
        leadingText: "bool isDeferred",
      },
      {
        features: `String prefix;`,
        sequence: ";",
        leadingText: "String prefix",
      },
      {
        features: `LibraryRef target;`,
        sequence: ";",
        leadingText: "LibraryRef target",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static LogRecord parse() => json == null ? null : LogRecord._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LogRecord parse",
      },
      {
        features: `InstanceRef message;`,
        sequence: ";",
        leadingText: "InstanceRef message",
      },
      {
        features: `int time;`,
        sequence: ";",
        leadingText: "int time",
      },
      {
        features: `int level;`,
        sequence: ";",
        leadingText: "int level",
      },
      {
        features: `int sequenceNumber;`,
        sequence: ";",
        leadingText: "int sequenceNumber",
      },
      {
        features: `InstanceRef loggerName;`,
        sequence: ";",
        leadingText: "InstanceRef loggerName",
      },
      {
        features: `InstanceRef zone;`,
        sequence: ";",
        leadingText: "InstanceRef zone",
      },
      {
        features: `InstanceRef error;`,
        sequence: ";",
        leadingText: "InstanceRef error",
      },
      {
        features: `InstanceRef stackTrace;`,
        sequence: ";",
        leadingText: "InstanceRef stackTrace",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static MapAssociation parse() => json == null ? null : MapAssociation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static MapAssociation parse",
      },
      {
        features: `dynamic key;`,
        sequence: ";",
        leadingText: "dynamic key",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static MemoryUsage parse() => json == null ? null : MemoryUsage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static MemoryUsage parse",
      },
      {
        features: `int externalUsage;`,
        sequence: ";",
        leadingText: "int externalUsage",
      },
      {
        features: `int heapCapacity;`,
        sequence: ";",
        leadingText: "int heapCapacity",
      },
      {
        features: `int heapUsage;`,
        sequence: ";",
        leadingText: "int heapUsage",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Message parse() => json == null ? null : Message._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Message parse",
      },
      {
        features: `int index;`,
        sequence: ";",
        leadingText: "int index",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String messageObjectId;`,
        sequence: ";",
        leadingText: "String messageObjectId",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `FuncRef handler;`,
        sequence: ";",
        leadingText: "FuncRef handler",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NativeFunction parse() => json == null ? null : NativeFunction._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NativeFunction parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `Map<String, dynamic> toJson() {      }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NullValRef parse() => json == null ? null : NullValRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NullValRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is NullValRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NullVal parse() => json == null ? null : NullVal._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NullVal parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is NullVal && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ObjRef parse() => json == null ? null : ObjRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ObjRef parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool fixedId;`,
        sequence: ";",
        leadingText: "bool fixedId",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ObjRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Obj parse() => json == null ? null : Obj._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Obj parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool fixedId;`,
        sequence: ";",
        leadingText: "bool fixedId",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Obj && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static PortList parse() => json == null ? null : PortList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static PortList parse",
      },
      {
        features: `List<InstanceRef> ports;`,
        sequence: ";",
        leadingText: "List<InstanceRef> ports",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProfileFunction parse() => json == null ? null : ProfileFunction._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProfileFunction parse",
      },
      {
        features: `String kind;`,
        sequence: ";",
        leadingText: "String kind",
      },
      {
        features: `int inclusiveTicks;`,
        sequence: ";",
        leadingText: "int inclusiveTicks",
      },
      {
        features: `int exclusiveTicks;`,
        sequence: ";",
        leadingText: "int exclusiveTicks",
      },
      {
        features: `String resolvedUrl;`,
        sequence: ";",
        leadingText: "String resolvedUrl",
      },
      {
        features: `dynamic function;`,
        sequence: ";",
        leadingText: "dynamic function",
      },
      {
        features: `Map<String, dynamic> toJson() {          }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProtocolList parse() => json == null ? null : ProtocolList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProtocolList parse",
      },
      {
        features: `List<Protocol> protocols;`,
        sequence: ";",
        leadingText: "List<Protocol> protocols",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Protocol parse() => json == null ? null : Protocol._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Protocol parse",
      },
      {
        features: `String protocolName;`,
        sequence: ";",
        leadingText: "String protocolName",
      },
      {
        features: `int major;`,
        sequence: ";",
        leadingText: "int major",
      },
      {
        features: `int minor;`,
        sequence: ";",
        leadingText: "int minor",
      },
      {
        features: `Map<String, dynamic> toJson() {        }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProcessMemoryUsage parse() => json == null ? null : ProcessMemoryUsage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProcessMemoryUsage parse",
      },
      {
        features: `ProcessMemoryItem root;`,
        sequence: ";",
        leadingText: "ProcessMemoryItem root",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProcessMemoryItem parse() => json == null ? null : ProcessMemoryItem._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProcessMemoryItem parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String description;`,
        sequence: ";",
        leadingText: "String description",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `List<ProcessMemoryItem> children;`,
        sequence: ";",
        leadingText: "List<ProcessMemoryItem> children",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ReloadReport parse() => json == null ? null : ReloadReport._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ReloadReport parse",
      },
      {
        features: `bool success;`,
        sequence: ";",
        leadingText: "bool success",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static RetainingObject parse() => json == null ? null : RetainingObject._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static RetainingObject parse",
      },
      {
        features: `ObjRef value;`,
        sequence: ";",
        leadingText: "ObjRef value",
      },
      {
        features: `int parentListIndex;`,
        sequence: ";",
        leadingText: "int parentListIndex",
      },
      {
        features: `ObjRef parentMapKey;`,
        sequence: ";",
        leadingText: "ObjRef parentMapKey",
      },
      {
        features: `String parentField;`,
        sequence: ";",
        leadingText: "String parentField",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static RetainingPath parse() => json == null ? null : RetainingPath._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static RetainingPath parse",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `String gcRootType;`,
        sequence: ";",
        leadingText: "String gcRootType",
      },
      {
        features: `List<RetainingObject> elements;`,
        sequence: ";",
        leadingText: "List<RetainingObject> elements",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Response parse() => json == null ? null : Response._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Response parse",
      },
      {
        features: `Map<String, dynamic> json;`,
        sequence: ";",
        leadingText: "Map<String, dynamic> json",
      },
      {
        features: `String type;`,
        sequence: ";",
        leadingText: "String type",
      },
      {
        features: `Map<String, dynamic> toJson() {    }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Sentinel parse() => json == null ? null : Sentinel._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Sentinel parse",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ScriptRef parse() => json == null ? null : ScriptRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ScriptRef parse",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ScriptRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Script parse() => json == null ? null : Script._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Script parse",
      },
      {
        features: `final _tokenToLine = <int, int>{}`,
        sequence: "={}",
        leadingText: "final _tokenToLine",
      },
      {
        features: `final _tokenToColumn = <int, int>{}`,
        sequence: "={}",
        leadingText: "final _tokenToColumn",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `LibraryRef library;`,
        sequence: ";",
        leadingText: "LibraryRef library",
      },
      {
        features: `int lineOffset;`,
        sequence: ";",
        leadingText: "int lineOffset",
      },
      {
        features: `int columnOffset;`,
        sequence: ";",
        leadingText: "int columnOffset",
      },
      {
        features: `String source;`,
        sequence: ";",
        leadingText: "String source",
      },
      {
        features: `List<List<int>> tokenPosTable;`,
        sequence: ";",
        leadingText: "List<List<int>> tokenPosTable",
      },
      {
        features: `int getLineNumberFromTokenPos() => _tokenToLine[tokenPos];`,
        sequence: "()=>[];",
        leadingText: "int getLineNumberFromTokenPos",
      },
      {
        features: `int getColumnNumberFromTokenPos() => _tokenToColumn[tokenPos];`,
        sequence: "()=>[];",
        leadingText: "int getColumnNumberFromTokenPos",
      },
      {
        features: `void _parseTokenPosTable() {                 }`,
        sequence: "(){}",
        leadingText: "void _parseTokenPosTable",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Script && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ScriptList parse() => json == null ? null : ScriptList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ScriptList parse",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceLocation parse() => json == null ? null : SourceLocation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceLocation parse",
      },
      {
        features: `ScriptRef script;`,
        sequence: ";",
        leadingText: "ScriptRef script",
      },
      {
        features: `int tokenPos;`,
        sequence: ";",
        leadingText: "int tokenPos",
      },
      {
        features: `int endTokenPos;`,
        sequence: ";",
        leadingText: "int endTokenPos",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceReport parse() => json == null ? null : SourceReport._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReport parse",
      },
      {
        features: `List<SourceReportRange> ranges;`,
        sequence: ";",
        leadingText: "List<SourceReportRange> ranges",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceReportCoverage parse() => json == null ? null : SourceReportCoverage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReportCoverage parse",
      },
      {
        features: `List<int> hits;`,
        sequence: ";",
        leadingText: "List<int> hits",
      },
      {
        features: `List<int> misses;`,
        sequence: ";",
        leadingText: "List<int> misses",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceReportRange parse() => json == null ? null : SourceReportRange._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReportRange parse",
      },
      {
        features: `int scriptIndex;`,
        sequence: ";",
        leadingText: "int scriptIndex",
      },
      {
        features: `int startPos;`,
        sequence: ";",
        leadingText: "int startPos",
      },
      {
        features: `int endPos;`,
        sequence: ";",
        leadingText: "int endPos",
      },
      {
        features: `bool compiled;`,
        sequence: ";",
        leadingText: "bool compiled",
      },
      {
        features: `ErrorRef error;`,
        sequence: ";",
        leadingText: "ErrorRef error",
      },
      {
        features: `SourceReportCoverage coverage;`,
        sequence: ";",
        leadingText: "SourceReportCoverage coverage",
      },
      {
        features: `List<int> possibleBreakpoints;`,
        sequence: ";",
        leadingText: "List<int> possibleBreakpoints",
      },
      {
        features: `Map<String, dynamic> toJson() {             }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Stack parse() => json == null ? null : Stack._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Stack parse",
      },
      {
        features: `List<Frame> frames;`,
        sequence: ";",
        leadingText: "List<Frame> frames",
      },
      {
        features: `List<Frame> asyncCausalFrames;`,
        sequence: ";",
        leadingText: "List<Frame> asyncCausalFrames",
      },
      {
        features: `List<Frame> awaiterFrames;`,
        sequence: ";",
        leadingText: "List<Frame> awaiterFrames",
      },
      {
        features: `List<Message> messages;`,
        sequence: ";",
        leadingText: "List<Message> messages",
      },
      {
        features: `bool truncated;`,
        sequence: ";",
        leadingText: "bool truncated",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Success parse() => json == null ? null : Success._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Success parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Timeline parse() => json == null ? null : Timeline._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Timeline parse",
      },
      {
        features: `List<TimelineEvent> traceEvents;`,
        sequence: ";",
        leadingText: "List<TimelineEvent> traceEvents",
      },
      {
        features: `int timeOriginMicros;`,
        sequence: ";",
        leadingText: "int timeOriginMicros",
      },
      {
        features: `int timeExtentMicros;`,
        sequence: ";",
        leadingText: "int timeExtentMicros",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TimelineEvent parse() => json == null ? null : TimelineEvent._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TimelineEvent parse",
      },
      {
        features: `Map<String, dynamic> json;`,
        sequence: ";",
        leadingText: "Map<String, dynamic> json",
      },
      {
        features: `Map<String, dynamic> toJson() {    }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TimelineFlags parse() => json == null ? null : TimelineFlags._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TimelineFlags parse",
      },
      {
        features: `String recorderName;`,
        sequence: ";",
        leadingText: "String recorderName",
      },
      {
        features: `List<String> availableStreams;`,
        sequence: ";",
        leadingText: "List<String> availableStreams",
      },
      {
        features: `List<String> recordedStreams;`,
        sequence: ";",
        leadingText: "List<String> recordedStreams",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Timestamp parse() => json == null ? null : Timestamp._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Timestamp parse",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TypeArgumentsRef parse() => json == null ? null : TypeArgumentsRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TypeArgumentsRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is TypeArgumentsRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TypeArguments parse() => json == null ? null : TypeArguments._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TypeArguments parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `List<InstanceRef> types;`,
        sequence: ";",
        leadingText: "List<InstanceRef> types",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is TypeArguments && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static UnresolvedSourceLocation parse() => json == null ? null : UnresolvedSourceLocation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static UnresolvedSourceLocation parse",
      },
      {
        features: `ScriptRef script;`,
        sequence: ";",
        leadingText: "ScriptRef script",
      },
      {
        features: `String scriptUri;`,
        sequence: ";",
        leadingText: "String scriptUri",
      },
      {
        features: `int tokenPos;`,
        sequence: ";",
        leadingText: "int tokenPos",
      },
      {
        features: `int line;`,
        sequence: ";",
        leadingText: "int line",
      },
      {
        features: `int column;`,
        sequence: ";",
        leadingText: "int column",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Version parse() => json == null ? null : Version._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Version parse",
      },
      {
        features: `int major;`,
        sequence: ";",
        leadingText: "int major",
      },
      {
        features: `int minor;`,
        sequence: ";",
        leadingText: "int minor",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static VMRef parse() => json == null ? null : VMRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VMRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static VM parse() => json == null ? null : VM._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VM parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int architectureBits;`,
        sequence: ";",
        leadingText: "int architectureBits",
      },
      {
        features: `String hostCPU;`,
        sequence: ";",
        leadingText: "String hostCPU",
      },
      {
        features: `String operatingSystem;`,
        sequence: ";",
        leadingText: "String operatingSystem",
      },
      {
        features: `String targetCPU;`,
        sequence: ";",
        leadingText: "String targetCPU",
      },
      {
        features: `String version;`,
        sequence: ";",
        leadingText: "String version",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `List<IsolateGroupRef> isolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> isolateGroups",
      },
      {
        features: `List<IsolateRef> systemIsolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> systemIsolates",
      },
      {
        features: `List<IsolateGroupRef> systemIsolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> systemIsolateGroups",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `Stream<Event> onEvent();`,
        sequence: "();",
        leadingText: "Stream<Event> onEvent",
      },
      {
        features: `Future<Response> callServiceExtension( );`,
        sequence: "();",
        leadingText: "Future<Response> callServiceExtension",
      },
      {
        features: `Future<Breakpoint> addBreakpoint(     );`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpoint",
      },
      {
        features: `Future<Breakpoint> addBreakpointWithScriptUri(     );`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpointWithScriptUri",
      },
      {
        features: `Future<Breakpoint> addBreakpointAtEntry();`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpointAtEntry",
      },
      {
        features: `Future<Success> clearCpuSamples();`,
        sequence: "();",
        leadingText: "Future<Success> clearCpuSamples",
      },
      {
        features: `Future<Success> clearVMTimeline();`,
        sequence: "();",
        leadingText: "Future<Success> clearVMTimeline",
      },
      {
        features: `Future<Response> invoke(      );`,
        sequence: "();",
        leadingText: "Future<Response> invoke",
      },
      {
        features: `Future<Response> evaluate(      );`,
        sequence: "();",
        leadingText: "Future<Response> evaluate",
      },
      {
        features: `Future<Response> evaluateInFrame(      );`,
        sequence: "();",
        leadingText: "Future<Response> evaluateInFrame",
      },
      {
        features: `Future<AllocationProfile> getAllocationProfile( );`,
        sequence: "();",
        leadingText: "Future<AllocationProfile> getAllocationProfile",
      },
      {
        features: `Future<ClassList> getClassList();`,
        sequence: "();",
        leadingText: "Future<ClassList> getClassList",
      },
      {
        features: `Future<CpuSamples> getCpuSamples( );`,
        sequence: "();",
        leadingText: "Future<CpuSamples> getCpuSamples",
      },
      {
        features: `Future<FlagList> getFlagList();`,
        sequence: "();",
        leadingText: "Future<FlagList> getFlagList",
      },
      {
        features: `Future<InboundReferences> getInboundReferences( );`,
        sequence: "();",
        leadingText: "Future<InboundReferences> getInboundReferences",
      },
      {
        features: `Future<InstanceSet> getInstances( );`,
        sequence: "();",
        leadingText: "Future<InstanceSet> getInstances",
      },
      {
        features: `Future<Isolate> getIsolate();`,
        sequence: "();",
        leadingText: "Future<Isolate> getIsolate",
      },
      {
        features: `Future<IsolateGroup> getIsolateGroup();`,
        sequence: "();",
        leadingText: "Future<IsolateGroup> getIsolateGroup",
      },
      {
        features: `Future<MemoryUsage> getMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<MemoryUsage> getMemoryUsage",
      },
      {
        features: `Future<MemoryUsage> getIsolateGroupMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<MemoryUsage> getIsolateGroupMemoryUsage",
      },
      {
        features: `Future<ScriptList> getScripts();`,
        sequence: "();",
        leadingText: "Future<ScriptList> getScripts",
      },
      {
        features: `Future<Obj> getObject(     );`,
        sequence: "();",
        leadingText: "Future<Obj> getObject",
      },
      {
        features: `Future<PortList> getPorts();`,
        sequence: "();",
        leadingText: "Future<PortList> getPorts",
      },
      {
        features: `Future<RetainingPath> getRetainingPath( );`,
        sequence: "();",
        leadingText: "Future<RetainingPath> getRetainingPath",
      },
      {
        features: `Future<ProcessMemoryUsage> getProcessMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<ProcessMemoryUsage> getProcessMemoryUsage",
      },
      {
        features: `Future<Stack> getStack();`,
        sequence: "();",
        leadingText: "Future<Stack> getStack",
      },
      {
        features: `Future<ProtocolList> getSupportedProtocols();`,
        sequence: "();",
        leadingText: "Future<ProtocolList> getSupportedProtocols",
      },
      {
        features: `Future<SourceReport> getSourceReport(        );`,
        sequence: "();",
        leadingText: "Future<SourceReport> getSourceReport",
      },
      {
        features: `Future<Version> getVersion();`,
        sequence: "();",
        leadingText: "Future<Version> getVersion",
      },
      {
        features: `Future<VM> getVM();`,
        sequence: "();",
        leadingText: "Future<VM> getVM",
      },
      {
        features: `Future<Timeline> getVMTimeline();`,
        sequence: "();",
        leadingText: "Future<Timeline> getVMTimeline",
      },
      {
        features: `Future<TimelineFlags> getVMTimelineFlags();`,
        sequence: "();",
        leadingText: "Future<TimelineFlags> getVMTimelineFlags",
      },
      {
        features: `Future<Timestamp> getVMTimelineMicros();`,
        sequence: "();",
        leadingText: "Future<Timestamp> getVMTimelineMicros",
      },
      {
        features: `Future<Success> pause();`,
        sequence: "();",
        leadingText: "Future<Success> pause",
      },
      {
        features: `Future<Success> kill();`,
        sequence: "();",
        leadingText: "Future<Success> kill",
      },
      {
        features: `Future<Success> registerService();`,
        sequence: "();",
        leadingText: "Future<Success> registerService",
      },
      {
        features: `Future<ReloadReport> reloadSources(      );`,
        sequence: "();",
        leadingText: "Future<ReloadReport> reloadSources",
      },
      {
        features: `Future<Success> removeBreakpoint();`,
        sequence: "();",
        leadingText: "Future<Success> removeBreakpoint",
      },
      {
        features: `Future<Success> requestHeapSnapshot();`,
        sequence: "();",
        leadingText: "Future<Success> requestHeapSnapshot",
      },
      {
        features: `Future<Success> resume( );`,
        sequence: "();",
        leadingText: "Future<Success> resume",
      },
      {
        features: `Future<Success> setExceptionPauseMode( );`,
        sequence: "();",
        leadingText: "Future<Success> setExceptionPauseMode",
      },
      {
        features: `Future<Response> setFlag();`,
        sequence: "();",
        leadingText: "Future<Response> setFlag",
      },
      {
        features: `Future<Success> setLibraryDebuggable( );`,
        sequence: "();",
        leadingText: "Future<Success> setLibraryDebuggable",
      },
      {
        features: `Future<Success> setName();`,
        sequence: "();",
        leadingText: "Future<Success> setName",
      },
      {
        features: `Future<Success> setVMName();`,
        sequence: "();",
        leadingText: "Future<Success> setVMName",
      },
      {
        features: `Future<Success> setVMTimelineFlags();`,
        sequence: "();",
        leadingText: "Future<Success> setVMTimelineFlags",
      },
      {
        features: `Future<Success> streamCancel();`,
        sequence: "();",
        leadingText: "Future<Success> streamCancel",
      },
      {
        features: `Future<Success> streamListen();`,
        sequence: "();",
        leadingText: "Future<Success> streamListen",
      },
      {
        features: `Future<Map<String, Object>> get future => _completer.future;`,
        sequence: "=>;",
        leadingText: "Future<Map<String, Object>> get future",
      },
      {
        features: `final _completer = Completer<Map<String, Object>>();`,
        sequence: "=();",
        leadingText: "final _completer",
      },
      {
        features: `final dynamic originalId;`,
        sequence: ";",
        leadingText: "final dynamic originalId",
      },
      {
        features: `void complete() {   }`,
        sequence: "(){}",
        leadingText: "void complete",
      },
      {
        features: `final Stream<Map<String, Object>> _requestStream;`,
        sequence: ";",
        leadingText: "final Stream<Map<String, Object>> _requestStream",
      },
      {
        features: `final StreamSink<Map<String, Object>> _responseSink;`,
        sequence: ";",
        leadingText: "final StreamSink<Map<String, Object>> _responseSink",
      },
      {
        features: `final ServiceExtensionRegistry _serviceExtensionRegistry;`,
        sequence: ";",
        leadingText: "final ServiceExtensionRegistry _serviceExtensionRegistry",
      },
      {
        features: `final VmServiceInterface _serviceImplementation;`,
        sequence: ";",
        leadingText: "final VmServiceInterface _serviceImplementation",
      },
      {
        features: `int _nextServiceRequestId = 0;`,
        sequence: "=;",
        leadingText: "int _nextServiceRequestId",
      },
      {
        features: `final _streamSubscriptions = <String, StreamSubscription>{}`,
        sequence: "={}",
        leadingText: "final _streamSubscriptions",
      },
      {
        features: `Future get done => _doneCompleter.future;`,
        sequence: "=>;",
        leadingText: "Future get done",
      },
      {
        features: `final _doneCompleter = Completer<Null>();`,
        sequence: "=();",
        leadingText: "final _doneCompleter",
      },
      {
        features: `final _pendingServiceExtensionRequests = <dynamic, _PendingServiceRequest>{}`,
        sequence: "={}",
        leadingText: "final _pendingServiceExtensionRequests",
      },
      {
        features: `Future<Map<String, Object>> _forwardServiceExtensionRequest( ) {           }`,
        sequence: "(){}",
        leadingText: "Future<Map<String, Object>> _forwardServiceExtensionRequest",
      },
      {
        features: `void _delegateRequest() async {                                                                                                                                                                                                                                                                                                                                                                    }`,
        sequence: "(){}",
        leadingText: "void _delegateRequest",
      },
      {
        features: `StreamSubscription _streamSub;`,
        sequence: ";",
        leadingText: "StreamSubscription _streamSub",
      },
      {
        features: `Function _writeMessage;`,
        sequence: ";",
        leadingText: "Function _writeMessage",
      },
      {
        features: `int _id = 0;`,
        sequence: "=;",
        leadingText: "int _id",
      },
      {
        features: `Map<String, Completer> _completers = {}`,
        sequence: "={}",
        leadingText: "Map<String, Completer> _completers",
      },
      {
        features: `Map<String, String> _methodCalls = {}`,
        sequence: "={}",
        leadingText: "Map<String, String> _methodCalls",
      },
      {
        features: `Map<String, ServiceCallback> _services = {}`,
        sequence: "={}",
        leadingText: "Map<String, ServiceCallback> _services",
      },
      {
        features: `Log _log;`,
        sequence: ";",
        leadingText: "Log _log",
      },
      {
        features: `StreamController<String> _onSend = StreamController.broadcast();`,
        sequence: "=();",
        leadingText: "StreamController<String> _onSend",
      },
      {
        features: `StreamController<String> _onReceive = StreamController.broadcast();`,
        sequence: "=();",
        leadingText: "StreamController<String> _onReceive",
      },
      {
        features: `final Completer _onDoneCompleter = Completer();`,
        sequence: "=();",
        leadingText: "final Completer _onDoneCompleter",
      },
      {
        features: `Map<String, StreamController<Event>> _eventControllers = {}`,
        sequence: "={}",
        leadingText: "Map<String, StreamController<Event>> _eventControllers",
      },
      {
        features: `StreamController<Event> _getEventController() {       }`,
        sequence: "(){}",
        leadingText: "StreamController<Event> _getEventController",
      },
      {
        features: `DisposeHandler _disposeHandler;`,
        sequence: ";",
        leadingText: "DisposeHandler _disposeHandler",
      },
      {
        features: `Stream<Event> get onVMEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onVMEvent",
      },
      {
        features: `Stream<Event> get onIsolateEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onIsolateEvent",
      },
      {
        features: `Stream<Event> get onDebugEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onDebugEvent",
      },
      {
        features: `Stream<Event> get onGCEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onGCEvent",
      },
      {
        features: `Stream<Event> get onExtensionEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onExtensionEvent",
      },
      {
        features: `Stream<Event> get onTimelineEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onTimelineEvent",
      },
      {
        features: `Stream<Event> get onLoggingEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onLoggingEvent",
      },
      {
        features: `Stream<Event> get onServiceEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onServiceEvent",
      },
      {
        features: `Stream<Event> get onHeapSnapshotEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onHeapSnapshotEvent",
      },
      {
        features: `Stream<Event> get onStdoutEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onStdoutEvent",
      },
      {
        features: `Stream<Event> get onStderrEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onStderrEvent",
      },
      {
        features: `Future<Response> callMethod() {  }`,
        sequence: "(){}",
        leadingText: "Future<Response> callMethod",
      },
      {
        features: `Stream<String> get onSend => _onSend.stream;`,
        sequence: "=>;",
        leadingText: "Stream<String> get onSend",
      },
      {
        features: `Stream<String> get onReceive => _onReceive.stream;`,
        sequence: "=>;",
        leadingText: "Stream<String> get onReceive",
      },
      {
        features: `void dispose() {              }`,
        sequence: "(){}",
        leadingText: "void dispose",
      },
      {
        features: `Future get onDone => _onDoneCompleter.future;`,
        sequence: "=>;",
        leadingText: "Future get onDone",
      },
      {
        features: `Future<T> _call<T>() {               }`,
        sequence: "(){}",
        leadingText: "Future<T> _call<T>",
      },
      {
        features: `void registerServiceCallback() {     }`,
        sequence: "(){}",
        leadingText: "void registerServiceCallback",
      },
      {
        features: `void _processMessage() {             }`,
        sequence: "(){}",
        leadingText: "void _processMessage",
      },
      {
        features: `void _processMessageByteData() {                 }`,
        sequence: "(){}",
        leadingText: "void _processMessageByteData",
      },
      {
        features: `void _processMessageStr() {                       }`,
        sequence: "(){}",
        leadingText: "void _processMessageStr",
      },
      {
        features: `void _processResponse() {                   }`,
        sequence: "(){}",
        leadingText: "void _processResponse",
      },
      {
        features: `Future _processRequest() async {        }`,
        sequence: "(){}",
        leadingText: "Future _processRequest",
      },
      {
        features: `Future _processNotification() async {          }`,
        sequence: "(){}",
        leadingText: "Future _processNotification",
      },
      {
        features: `Future<Map> _routeRequest() async {                  }`,
        sequence: "(){}",
        leadingText: "Future<Map> _routeRequest",
      },
      {
        features: `static const int kServerError = -32000;`,
        sequence: "=;",
        leadingText: "static const int kServerError",
      },
      {
        features: `static const int kInvalidRequest = -32600;`,
        sequence: "=;",
        leadingText: "static const int kInvalidRequest",
      },
      {
        features: `static const int kMethodNotFound = -32601;`,
        sequence: "=;",
        leadingText: "static const int kMethodNotFound",
      },
      {
        features: `static const int kInvalidParams = -32602;`,
        sequence: "=;",
        leadingText: "static const int kInvalidParams",
      },
      {
        features: `static const int kInternalError = -32603;`,
        sequence: "=;",
        leadingText: "static const int kInternalError",
      },
      {
        features: `static RPCError parse() {  }`,
        sequence: "(){}",
        leadingText: "static RPCError parse",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final int code;`,
        sequence: ";",
        leadingText: "final int code",
      },
      {
        features: `final String message;`,
        sequence: ";",
        leadingText: "final String message",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `String get details => data == null ? null : data[''];`,
        sequence: "=>==[];",
        leadingText: "String get details",
      },
      {
        features: `Map<String, dynamic> toMap() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toMap",
      },
      {
        features: `String toString() {      }`,
        sequence: "(){}",
        leadingText: "String toString",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final Sentinel sentinel;`,
        sequence: ";",
        leadingText: "final Sentinel sentinel",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ExtensionData parse() => json == null ? null : ExtensionData._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ExtensionData parse",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `void warning();`,
        sequence: "();",
        leadingText: "void warning",
      },
      {
        features: `void severe();`,
        sequence: "();",
        leadingText: "void severe",
      },
      {
        features: `void warning() {}`,
        sequence: "(){}",
        leadingText: "void warning",
      },
      {
        features: `void severe() {}`,
        sequence: "(){}",
        leadingText: "void severe",
      },
      {
        features: `static const String kDart = '';`,
        sequence: "=;",
        leadingText: "static const String kDart",
      },
      {
        features: `static const String kNative = '';`,
        sequence: "=;",
        leadingText: "static const String kNative",
      },
      {
        features: `static const String kStub = '';`,
        sequence: "=;",
        leadingText: "static const String kStub",
      },
      {
        features: `static const String kTag = '';`,
        sequence: "=;",
        leadingText: "static const String kTag",
      },
      {
        features: `static const String kCollected = '';`,
        sequence: "=;",
        leadingText: "static const String kCollected",
      },
      {
        features: `static const String kUnhandledException = '';`,
        sequence: "=;",
        leadingText: "static const String kUnhandledException",
      },
      {
        features: `static const String kLanguageError = '';`,
        sequence: "=;",
        leadingText: "static const String kLanguageError",
      },
      {
        features: `static const String kInternalError = '';`,
        sequence: "=;",
        leadingText: "static const String kInternalError",
      },
      {
        features: `static const String kTerminationError = '';`,
        sequence: "=;",
        leadingText: "static const String kTerminationError",
      },
      {
        features: `static const String kVM = '';`,
        sequence: "=;",
        leadingText: "static const String kVM",
      },
      {
        features: `static const String kIsolate = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolate",
      },
      {
        features: `static const String kDebug = '';`,
        sequence: "=;",
        leadingText: "static const String kDebug",
      },
      {
        features: `static const String kGC = '';`,
        sequence: "=;",
        leadingText: "static const String kGC",
      },
      {
        features: `static const String kExtension = '';`,
        sequence: "=;",
        leadingText: "static const String kExtension",
      },
      {
        features: `static const String kTimeline = '';`,
        sequence: "=;",
        leadingText: "static const String kTimeline",
      },
      {
        features: `static const String kLogging = '';`,
        sequence: "=;",
        leadingText: "static const String kLogging",
      },
      {
        features: `static const String kService = '';`,
        sequence: "=;",
        leadingText: "static const String kService",
      },
      {
        features: `static const String kHeapSnapshot = '';`,
        sequence: "=;",
        leadingText: "static const String kHeapSnapshot",
      },
      {
        features: `static const String kStdout = '';`,
        sequence: "=;",
        leadingText: "static const String kStdout",
      },
      {
        features: `static const String kStderr = '';`,
        sequence: "=;",
        leadingText: "static const String kStderr",
      },
      {
        features: `static const String kVMUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kVMUpdate",
      },
      {
        features: `static const String kVMFlagUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kVMFlagUpdate",
      },
      {
        features: `static const String kIsolateStart = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateStart",
      },
      {
        features: `static const String kIsolateRunnable = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateRunnable",
      },
      {
        features: `static const String kIsolateExit = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateExit",
      },
      {
        features: `static const String kIsolateUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateUpdate",
      },
      {
        features: `static const String kIsolateReload = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateReload",
      },
      {
        features: `static const String kServiceExtensionAdded = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceExtensionAdded",
      },
      {
        features: `static const String kPauseStart = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseStart",
      },
      {
        features: `static const String kPauseExit = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseExit",
      },
      {
        features: `static const String kPauseBreakpoint = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseBreakpoint",
      },
      {
        features: `static const String kPauseInterrupted = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseInterrupted",
      },
      {
        features: `static const String kPauseException = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseException",
      },
      {
        features: `static const String kPausePostRequest = '';`,
        sequence: "=;",
        leadingText: "static const String kPausePostRequest",
      },
      {
        features: `static const String kResume = '';`,
        sequence: "=;",
        leadingText: "static const String kResume",
      },
      {
        features: `static const String kNone = '';`,
        sequence: "=;",
        leadingText: "static const String kNone",
      },
      {
        features: `static const String kBreakpointAdded = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointAdded",
      },
      {
        features: `static const String kBreakpointResolved = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointResolved",
      },
      {
        features: `static const String kBreakpointRemoved = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointRemoved",
      },
      {
        features: `static const String kGC = '';`,
        sequence: "=;",
        leadingText: "static const String kGC",
      },
      {
        features: `static const String kWriteEvent = '';`,
        sequence: "=;",
        leadingText: "static const String kWriteEvent",
      },
      {
        features: `static const String kInspect = '';`,
        sequence: "=;",
        leadingText: "static const String kInspect",
      },
      {
        features: `static const String kExtension = '';`,
        sequence: "=;",
        leadingText: "static const String kExtension",
      },
      {
        features: `static const String kLogging = '';`,
        sequence: "=;",
        leadingText: "static const String kLogging",
      },
      {
        features: `static const String kTimelineEvents = '';`,
        sequence: "=;",
        leadingText: "static const String kTimelineEvents",
      },
      {
        features: `static const String kTimelineStreamSubscriptionsUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kTimelineStreamSubscriptionsUpdate",
      },
      {
        features: `static const String kServiceRegistered = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceRegistered",
      },
      {
        features: `static const String kServiceUnregistered = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceUnregistered",
      },
      {
        features: `static const String kPlainInstance = '';`,
        sequence: "=;",
        leadingText: "static const String kPlainInstance",
      },
      {
        features: `static const String kNull = '';`,
        sequence: "=;",
        leadingText: "static const String kNull",
      },
      {
        features: `static const String kBool = '';`,
        sequence: "=;",
        leadingText: "static const String kBool",
      },
      {
        features: `static const String kDouble = '';`,
        sequence: "=;",
        leadingText: "static const String kDouble",
      },
      {
        features: `static const String kInt = '';`,
        sequence: "=;",
        leadingText: "static const String kInt",
      },
      {
        features: `static const String kString = '';`,
        sequence: "=;",
        leadingText: "static const String kString",
      },
      {
        features: `static const String kList = '';`,
        sequence: "=;",
        leadingText: "static const String kList",
      },
      {
        features: `static const String kMap = '';`,
        sequence: "=;",
        leadingText: "static const String kMap",
      },
      {
        features: `static const String kFloat32x4 = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32x4",
      },
      {
        features: `static const String kFloat64x2 = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64x2",
      },
      {
        features: `static const String kInt32x4 = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32x4",
      },
      {
        features: `static const String kUint8ClampedList = '';`,
        sequence: "=;",
        leadingText: "static const String kUint8ClampedList",
      },
      {
        features: `static const String kUint8List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint8List",
      },
      {
        features: `static const String kUint16List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint16List",
      },
      {
        features: `static const String kUint32List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint32List",
      },
      {
        features: `static const String kUint64List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint64List",
      },
      {
        features: `static const String kInt8List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt8List",
      },
      {
        features: `static const String kInt16List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt16List",
      },
      {
        features: `static const String kInt32List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32List",
      },
      {
        features: `static const String kInt64List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt64List",
      },
      {
        features: `static const String kFloat32List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32List",
      },
      {
        features: `static const String kFloat64List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64List",
      },
      {
        features: `static const String kInt32x4List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32x4List",
      },
      {
        features: `static const String kFloat32x4List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32x4List",
      },
      {
        features: `static const String kFloat64x2List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64x2List",
      },
      {
        features: `static const String kStackTrace = '';`,
        sequence: "=;",
        leadingText: "static const String kStackTrace",
      },
      {
        features: `static const String kClosure = '';`,
        sequence: "=;",
        leadingText: "static const String kClosure",
      },
      {
        features: `static const String kMirrorReference = '';`,
        sequence: "=;",
        leadingText: "static const String kMirrorReference",
      },
      {
        features: `static const String kRegExp = '';`,
        sequence: "=;",
        leadingText: "static const String kRegExp",
      },
      {
        features: `static const String kWeakProperty = '';`,
        sequence: "=;",
        leadingText: "static const String kWeakProperty",
      },
      {
        features: `static const String kType = '';`,
        sequence: "=;",
        leadingText: "static const String kType",
      },
      {
        features: `static const String kTypeParameter = '';`,
        sequence: "=;",
        leadingText: "static const String kTypeParameter",
      },
      {
        features: `static const String kTypeRef = '';`,
        sequence: "=;",
        leadingText: "static const String kTypeRef",
      },
      {
        features: `static const String kBoundedType = '';`,
        sequence: "=;",
        leadingText: "static const String kBoundedType",
      },
      {
        features: `static const String kReceivePort = '';`,
        sequence: "=;",
        leadingText: "static const String kReceivePort",
      },
      {
        features: `static const String kCollected = '';`,
        sequence: "=;",
        leadingText: "static const String kCollected",
      },
      {
        features: `static const String kExpired = '';`,
        sequence: "=;",
        leadingText: "static const String kExpired",
      },
      {
        features: `static const String kNotInitialized = '';`,
        sequence: "=;",
        leadingText: "static const String kNotInitialized",
      },
      {
        features: `static const String kBeingInitialized = '';`,
        sequence: "=;",
        leadingText: "static const String kBeingInitialized",
      },
      {
        features: `static const String kOptimizedOut = '';`,
        sequence: "=;",
        leadingText: "static const String kOptimizedOut",
      },
      {
        features: `static const String kFree = '';`,
        sequence: "=;",
        leadingText: "static const String kFree",
      },
      {
        features: `static const String kRegular = '';`,
        sequence: "=;",
        leadingText: "static const String kRegular",
      },
      {
        features: `static const String kAsyncCausal = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncCausal",
      },
      {
        features: `static const String kAsyncSuspensionMarker = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncSuspensionMarker",
      },
      {
        features: `static const String kAsyncActivation = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncActivation",
      },
      {
        features: `static const String kCoverage = '';`,
        sequence: "=;",
        leadingText: "static const String kCoverage",
      },
      {
        features: `static const String kPossibleBreakpoints = '';`,
        sequence: "=;",
        leadingText: "static const String kPossibleBreakpoints",
      },
      {
        features: `static const String kNone = '';`,
        sequence: "=;",
        leadingText: "static const String kNone",
      },
      {
        features: `static const String kUnhandled = '';`,
        sequence: "=;",
        leadingText: "static const String kUnhandled",
      },
      {
        features: `static const String kAll = '';`,
        sequence: "=;",
        leadingText: "static const String kAll",
      },
      {
        features: `static const String kInto = '';`,
        sequence: "=;",
        leadingText: "static const String kInto",
      },
      {
        features: `static const String kOver = '';`,
        sequence: "=;",
        leadingText: "static const String kOver",
      },
      {
        features: `static const String kOverAsyncSuspension = '';`,
        sequence: "=;",
        leadingText: "static const String kOverAsyncSuspension",
      },
      {
        features: `static const String kOut = '';`,
        sequence: "=;",
        leadingText: "static const String kOut",
      },
      {
        features: `static const String kRewind = '';`,
        sequence: "=;",
        leadingText: "static const String kRewind",
      },
      {
        features: `static AllocationProfile parse() => json == null ? null : AllocationProfile._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static AllocationProfile parse",
      },
      {
        features: `List<ClassHeapStats> members;`,
        sequence: ";",
        leadingText: "List<ClassHeapStats> members",
      },
      {
        features: `MemoryUsage memoryUsage;`,
        sequence: ";",
        leadingText: "MemoryUsage memoryUsage",
      },
      {
        features: `int dateLastAccumulatorReset;`,
        sequence: ";",
        leadingText: "int dateLastAccumulatorReset",
      },
      {
        features: `int dateLastServiceGC;`,
        sequence: ";",
        leadingText: "int dateLastServiceGC",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static BoundField parse() => json == null ? null : BoundField._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static BoundField parse",
      },
      {
        features: `FieldRef decl;`,
        sequence: ";",
        leadingText: "FieldRef decl",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static BoundVariable parse() => json == null ? null : BoundVariable._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static BoundVariable parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `int declarationTokenPos;`,
        sequence: ";",
        leadingText: "int declarationTokenPos",
      },
      {
        features: `int scopeStartTokenPos;`,
        sequence: ";",
        leadingText: "int scopeStartTokenPos",
      },
      {
        features: `int scopeEndTokenPos;`,
        sequence: ";",
        leadingText: "int scopeEndTokenPos",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Breakpoint parse() => json == null ? null : Breakpoint._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Breakpoint parse",
      },
      {
        features: `int breakpointNumber;`,
        sequence: ";",
        leadingText: "int breakpointNumber",
      },
      {
        features: `bool resolved;`,
        sequence: ";",
        leadingText: "bool resolved",
      },
      {
        features: `bool isSyntheticAsyncContinuation;`,
        sequence: ";",
        leadingText: "bool isSyntheticAsyncContinuation",
      },
      {
        features: `dynamic location;`,
        sequence: ";",
        leadingText: "dynamic location",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Breakpoint && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ClassRef parse() => json == null ? null : ClassRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ClassRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Class parse() => json == null ? null : Class._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Class parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ErrorRef error;`,
        sequence: ";",
        leadingText: "ErrorRef error",
      },
      {
        features: `bool isAbstract;`,
        sequence: ";",
        leadingText: "bool isAbstract",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `LibraryRef library;`,
        sequence: ";",
        leadingText: "LibraryRef library",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `ClassRef superClass;`,
        sequence: ";",
        leadingText: "ClassRef superClass",
      },
      {
        features: `InstanceRef superType;`,
        sequence: ";",
        leadingText: "InstanceRef superType",
      },
      {
        features: `List<InstanceRef> interfaces;`,
        sequence: ";",
        leadingText: "List<InstanceRef> interfaces",
      },
      {
        features: `InstanceRef mixin;`,
        sequence: ";",
        leadingText: "InstanceRef mixin",
      },
      {
        features: `List<FieldRef> fields;`,
        sequence: ";",
        leadingText: "List<FieldRef> fields",
      },
      {
        features: `List<FuncRef> functions;`,
        sequence: ";",
        leadingText: "List<FuncRef> functions",
      },
      {
        features: `List<ClassRef> subclasses;`,
        sequence: ";",
        leadingText: "List<ClassRef> subclasses",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Class && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ClassHeapStats parse() => json == null ? null : ClassHeapStats._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassHeapStats parse",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `int accumulatedSize;`,
        sequence: ";",
        leadingText: "int accumulatedSize",
      },
      {
        features: `int bytesCurrent;`,
        sequence: ";",
        leadingText: "int bytesCurrent",
      },
      {
        features: `int instancesAccumulated;`,
        sequence: ";",
        leadingText: "int instancesAccumulated",
      },
      {
        features: `int instancesCurrent;`,
        sequence: ";",
        leadingText: "int instancesCurrent",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ClassList parse() => json == null ? null : ClassList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassList parse",
      },
      {
        features: `List<ClassRef> classes;`,
        sequence: ";",
        leadingText: "List<ClassRef> classes",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static CodeRef parse() => json == null ? null : CodeRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CodeRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is CodeRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Code parse() => json == null ? null : Code._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Code parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Code && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ContextRef parse() => json == null ? null : ContextRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ContextRef parse",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ContextRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Context parse() => json == null ? null : Context._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Context parse",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `Context parent;`,
        sequence: ";",
        leadingText: "Context parent",
      },
      {
        features: `List<ContextElement> variables;`,
        sequence: ";",
        leadingText: "List<ContextElement> variables",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Context && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ContextElement parse() => json == null ? null : ContextElement._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ContextElement parse",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `Map<String, dynamic> toJson() {      }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static CpuSamples parse() => json == null ? null : CpuSamples._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CpuSamples parse",
      },
      {
        features: `int samplePeriod;`,
        sequence: ";",
        leadingText: "int samplePeriod",
      },
      {
        features: `int maxStackDepth;`,
        sequence: ";",
        leadingText: "int maxStackDepth",
      },
      {
        features: `int sampleCount;`,
        sequence: ";",
        leadingText: "int sampleCount",
      },
      {
        features: `int timeSpan;`,
        sequence: ";",
        leadingText: "int timeSpan",
      },
      {
        features: `int timeOriginMicros;`,
        sequence: ";",
        leadingText: "int timeOriginMicros",
      },
      {
        features: `int timeExtentMicros;`,
        sequence: ";",
        leadingText: "int timeExtentMicros",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `List<ProfileFunction> functions;`,
        sequence: ";",
        leadingText: "List<ProfileFunction> functions",
      },
      {
        features: `List<CpuSample> samples;`,
        sequence: ";",
        leadingText: "List<CpuSample> samples",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static CpuSample parse() => json == null ? null : CpuSample._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CpuSample parse",
      },
      {
        features: `int tid;`,
        sequence: ";",
        leadingText: "int tid",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `String vmTag;`,
        sequence: ";",
        leadingText: "String vmTag",
      },
      {
        features: `String userTag;`,
        sequence: ";",
        leadingText: "String userTag",
      },
      {
        features: `bool truncated;`,
        sequence: ";",
        leadingText: "bool truncated",
      },
      {
        features: `List<int> stack;`,
        sequence: ";",
        leadingText: "List<int> stack",
      },
      {
        features: `Map<String, dynamic> toJson() {           }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ErrorRef parse() => json == null ? null : ErrorRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ErrorRef parse",
      },
      {
        features: `String message;`,
        sequence: ";",
        leadingText: "String message",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ErrorRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Error parse() => json == null ? null : Error._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Error parse",
      },
      {
        features: `String message;`,
        sequence: ";",
        leadingText: "String message",
      },
      {
        features: `InstanceRef exception;`,
        sequence: ";",
        leadingText: "InstanceRef exception",
      },
      {
        features: `InstanceRef stacktrace;`,
        sequence: ";",
        leadingText: "InstanceRef stacktrace",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Error && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Event parse() => json == null ? null : Event._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Event parse",
      },
      {
        features: `IsolateRef isolate;`,
        sequence: ";",
        leadingText: "IsolateRef isolate",
      },
      {
        features: `VMRef vm;`,
        sequence: ";",
        leadingText: "VMRef vm",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `Breakpoint breakpoint;`,
        sequence: ";",
        leadingText: "Breakpoint breakpoint",
      },
      {
        features: `List<Breakpoint> pauseBreakpoints;`,
        sequence: ";",
        leadingText: "List<Breakpoint> pauseBreakpoints",
      },
      {
        features: `Frame topFrame;`,
        sequence: ";",
        leadingText: "Frame topFrame",
      },
      {
        features: `InstanceRef exception;`,
        sequence: ";",
        leadingText: "InstanceRef exception",
      },
      {
        features: `String bytes;`,
        sequence: ";",
        leadingText: "String bytes",
      },
      {
        features: `InstanceRef inspectee;`,
        sequence: ";",
        leadingText: "InstanceRef inspectee",
      },
      {
        features: `String extensionRPC;`,
        sequence: ";",
        leadingText: "String extensionRPC",
      },
      {
        features: `String extensionKind;`,
        sequence: ";",
        leadingText: "String extensionKind",
      },
      {
        features: `ExtensionData extensionData;`,
        sequence: ";",
        leadingText: "ExtensionData extensionData",
      },
      {
        features: `List<TimelineEvent> timelineEvents;`,
        sequence: ";",
        leadingText: "List<TimelineEvent> timelineEvents",
      },
      {
        features: `List<String> updatedStreams;`,
        sequence: ";",
        leadingText: "List<String> updatedStreams",
      },
      {
        features: `bool atAsyncSuspension;`,
        sequence: ";",
        leadingText: "bool atAsyncSuspension",
      },
      {
        features: `String status;`,
        sequence: ";",
        leadingText: "String status",
      },
      {
        features: `LogRecord logRecord;`,
        sequence: ";",
        leadingText: "LogRecord logRecord",
      },
      {
        features: `String service;`,
        sequence: ";",
        leadingText: "String service",
      },
      {
        features: `String method;`,
        sequence: ";",
        leadingText: "String method",
      },
      {
        features: `String alias;`,
        sequence: ";",
        leadingText: "String alias",
      },
      {
        features: `String flag;`,
        sequence: ";",
        leadingText: "String flag",
      },
      {
        features: `String newValue;`,
        sequence: ";",
        leadingText: "String newValue",
      },
      {
        features: `bool last;`,
        sequence: ";",
        leadingText: "bool last",
      },
      {
        features: `ByteData data;`,
        sequence: ";",
        leadingText: "ByteData data",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static FieldRef parse() => json == null ? null : FieldRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FieldRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ObjRef owner;`,
        sequence: ";",
        leadingText: "ObjRef owner",
      },
      {
        features: `InstanceRef declaredType;`,
        sequence: ";",
        leadingText: "InstanceRef declaredType",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isFinal;`,
        sequence: ";",
        leadingText: "bool isFinal",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is FieldRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Field parse() => json == null ? null : Field._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Field parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ObjRef owner;`,
        sequence: ";",
        leadingText: "ObjRef owner",
      },
      {
        features: `InstanceRef declaredType;`,
        sequence: ";",
        leadingText: "InstanceRef declaredType",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isFinal;`,
        sequence: ";",
        leadingText: "bool isFinal",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `InstanceRef staticValue;`,
        sequence: ";",
        leadingText: "InstanceRef staticValue",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Field && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Flag parse() => json == null ? null : Flag._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Flag parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String comment;`,
        sequence: ";",
        leadingText: "String comment",
      },
      {
        features: `bool modified;`,
        sequence: ";",
        leadingText: "bool modified",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static FlagList parse() => json == null ? null : FlagList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FlagList parse",
      },
      {
        features: `List<Flag> flags;`,
        sequence: ";",
        leadingText: "List<Flag> flags",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Frame parse() => json == null ? null : Frame._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Frame parse",
      },
      {
        features: `int index;`,
        sequence: ";",
        leadingText: "int index",
      },
      {
        features: `FuncRef function;`,
        sequence: ";",
        leadingText: "FuncRef function",
      },
      {
        features: `CodeRef code;`,
        sequence: ";",
        leadingText: "CodeRef code",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `List<BoundVariable> vars;`,
        sequence: ";",
        leadingText: "List<BoundVariable> vars",
      },
      {
        features: `String kind;`,
        sequence: ";",
        leadingText: "String kind",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static FuncRef parse() => json == null ? null : FuncRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FuncRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic owner;`,
        sequence: ";",
        leadingText: "dynamic owner",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is FuncRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Func parse() => json == null ? null : Func._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Func parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic owner;`,
        sequence: ";",
        leadingText: "dynamic owner",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `CodeRef code;`,
        sequence: ";",
        leadingText: "CodeRef code",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Func && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InstanceRef parse() => json == null ? null : InstanceRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InstanceRef parse",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `bool valueAsStringIsTruncated;`,
        sequence: ";",
        leadingText: "bool valueAsStringIsTruncated",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ClassRef typeClass;`,
        sequence: ";",
        leadingText: "ClassRef typeClass",
      },
      {
        features: `ClassRef parameterizedClass;`,
        sequence: ";",
        leadingText: "ClassRef parameterizedClass",
      },
      {
        features: `InstanceRef pattern;`,
        sequence: ";",
        leadingText: "InstanceRef pattern",
      },
      {
        features: `FuncRef closureFunction;`,
        sequence: ";",
        leadingText: "FuncRef closureFunction",
      },
      {
        features: `ContextRef closureContext;`,
        sequence: ";",
        leadingText: "ContextRef closureContext",
      },
      {
        features: `int portId;`,
        sequence: ";",
        leadingText: "int portId",
      },
      {
        features: `InstanceRef allocationLocation;`,
        sequence: ";",
        leadingText: "InstanceRef allocationLocation",
      },
      {
        features: `String debugName;`,
        sequence: ";",
        leadingText: "String debugName",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is InstanceRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Instance parse() => json == null ? null : Instance._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Instance parse",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `bool valueAsStringIsTruncated;`,
        sequence: ";",
        leadingText: "bool valueAsStringIsTruncated",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `int offset;`,
        sequence: ";",
        leadingText: "int offset",
      },
      {
        features: `int count;`,
        sequence: ";",
        leadingText: "int count",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ClassRef typeClass;`,
        sequence: ";",
        leadingText: "ClassRef typeClass",
      },
      {
        features: `ClassRef parameterizedClass;`,
        sequence: ";",
        leadingText: "ClassRef parameterizedClass",
      },
      {
        features: `List<BoundField> fields;`,
        sequence: ";",
        leadingText: "List<BoundField> fields",
      },
      {
        features: `List<dynamic> elements;`,
        sequence: ";",
        leadingText: "List<dynamic> elements",
      },
      {
        features: `List<MapAssociation> associations;`,
        sequence: ";",
        leadingText: "List<MapAssociation> associations",
      },
      {
        features: `String bytes;`,
        sequence: ";",
        leadingText: "String bytes",
      },
      {
        features: `InstanceRef mirrorReferent;`,
        sequence: ";",
        leadingText: "InstanceRef mirrorReferent",
      },
      {
        features: `InstanceRef pattern;`,
        sequence: ";",
        leadingText: "InstanceRef pattern",
      },
      {
        features: `FuncRef closureFunction;`,
        sequence: ";",
        leadingText: "FuncRef closureFunction",
      },
      {
        features: `ContextRef closureContext;`,
        sequence: ";",
        leadingText: "ContextRef closureContext",
      },
      {
        features: `bool isCaseSensitive;`,
        sequence: ";",
        leadingText: "bool isCaseSensitive",
      },
      {
        features: `bool isMultiLine;`,
        sequence: ";",
        leadingText: "bool isMultiLine",
      },
      {
        features: `InstanceRef propertyKey;`,
        sequence: ";",
        leadingText: "InstanceRef propertyKey",
      },
      {
        features: `InstanceRef propertyValue;`,
        sequence: ";",
        leadingText: "InstanceRef propertyValue",
      },
      {
        features: `TypeArgumentsRef typeArguments;`,
        sequence: ";",
        leadingText: "TypeArgumentsRef typeArguments",
      },
      {
        features: `int parameterIndex;`,
        sequence: ";",
        leadingText: "int parameterIndex",
      },
      {
        features: `InstanceRef targetType;`,
        sequence: ";",
        leadingText: "InstanceRef targetType",
      },
      {
        features: `InstanceRef bound;`,
        sequence: ";",
        leadingText: "InstanceRef bound",
      },
      {
        features: `int portId;`,
        sequence: ";",
        leadingText: "int portId",
      },
      {
        features: `InstanceRef allocationLocation;`,
        sequence: ";",
        leadingText: "InstanceRef allocationLocation",
      },
      {
        features: `String debugName;`,
        sequence: ";",
        leadingText: "String debugName",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Instance && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateRef parse() => json == null ? null : IsolateRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateRef parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolate;`,
        sequence: ";",
        leadingText: "bool isSystemIsolate",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Isolate parse() => json == null ? null : Isolate._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Isolate parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolate;`,
        sequence: ";",
        leadingText: "bool isSystemIsolate",
      },
      {
        features: `List<IsolateFlag> isolateFlags;`,
        sequence: ";",
        leadingText: "List<IsolateFlag> isolateFlags",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `bool runnable;`,
        sequence: ";",
        leadingText: "bool runnable",
      },
      {
        features: `int livePorts;`,
        sequence: ";",
        leadingText: "int livePorts",
      },
      {
        features: `bool pauseOnExit;`,
        sequence: ";",
        leadingText: "bool pauseOnExit",
      },
      {
        features: `Event pauseEvent;`,
        sequence: ";",
        leadingText: "Event pauseEvent",
      },
      {
        features: `LibraryRef rootLib;`,
        sequence: ";",
        leadingText: "LibraryRef rootLib",
      },
      {
        features: `List<LibraryRef> libraries;`,
        sequence: ";",
        leadingText: "List<LibraryRef> libraries",
      },
      {
        features: `List<Breakpoint> breakpoints;`,
        sequence: ";",
        leadingText: "List<Breakpoint> breakpoints",
      },
      {
        features: `Error error;`,
        sequence: ";",
        leadingText: "Error error",
      },
      {
        features: `List<String> extensionRPCs;`,
        sequence: ";",
        leadingText: "List<String> extensionRPCs",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Isolate && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateFlag parse() => json == null ? null : IsolateFlag._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateFlag parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateGroupRef parse() => json == null ? null : IsolateGroupRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateGroupRef parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolateGroup;`,
        sequence: ";",
        leadingText: "bool isSystemIsolateGroup",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateGroupRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static IsolateGroup parse() => json == null ? null : IsolateGroup._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateGroup parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `bool isSystemIsolateGroup;`,
        sequence: ";",
        leadingText: "bool isSystemIsolateGroup",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateGroup && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InboundReferences parse() => json == null ? null : InboundReferences._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InboundReferences parse",
      },
      {
        features: `List<InboundReference> references;`,
        sequence: ";",
        leadingText: "List<InboundReference> references",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InboundReference parse() => json == null ? null : InboundReference._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InboundReference parse",
      },
      {
        features: `ObjRef source;`,
        sequence: ";",
        leadingText: "ObjRef source",
      },
      {
        features: `int parentListIndex;`,
        sequence: ";",
        leadingText: "int parentListIndex",
      },
      {
        features: `FieldRef parentField;`,
        sequence: ";",
        leadingText: "FieldRef parentField",
      },
      {
        features: `Map<String, dynamic> toJson() {        }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static InstanceSet parse() => json == null ? null : InstanceSet._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InstanceSet parse",
      },
      {
        features: `int totalCount;`,
        sequence: ";",
        leadingText: "int totalCount",
      },
      {
        features: `List<ObjRef> instances;`,
        sequence: ";",
        leadingText: "List<ObjRef> instances",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static LibraryRef parse() => json == null ? null : LibraryRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LibraryRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is LibraryRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Library parse() => json == null ? null : Library._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Library parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `bool debuggable;`,
        sequence: ";",
        leadingText: "bool debuggable",
      },
      {
        features: `List<LibraryDependency> dependencies;`,
        sequence: ";",
        leadingText: "List<LibraryDependency> dependencies",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `List<FieldRef> variables;`,
        sequence: ";",
        leadingText: "List<FieldRef> variables",
      },
      {
        features: `List<FuncRef> functions;`,
        sequence: ";",
        leadingText: "List<FuncRef> functions",
      },
      {
        features: `List<ClassRef> classes;`,
        sequence: ";",
        leadingText: "List<ClassRef> classes",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Library && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static LibraryDependency parse() => json == null ? null : LibraryDependency._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LibraryDependency parse",
      },
      {
        features: `bool isImport;`,
        sequence: ";",
        leadingText: "bool isImport",
      },
      {
        features: `bool isDeferred;`,
        sequence: ";",
        leadingText: "bool isDeferred",
      },
      {
        features: `String prefix;`,
        sequence: ";",
        leadingText: "String prefix",
      },
      {
        features: `LibraryRef target;`,
        sequence: ";",
        leadingText: "LibraryRef target",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static LogRecord parse() => json == null ? null : LogRecord._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LogRecord parse",
      },
      {
        features: `InstanceRef message;`,
        sequence: ";",
        leadingText: "InstanceRef message",
      },
      {
        features: `int time;`,
        sequence: ";",
        leadingText: "int time",
      },
      {
        features: `int level;`,
        sequence: ";",
        leadingText: "int level",
      },
      {
        features: `int sequenceNumber;`,
        sequence: ";",
        leadingText: "int sequenceNumber",
      },
      {
        features: `InstanceRef loggerName;`,
        sequence: ";",
        leadingText: "InstanceRef loggerName",
      },
      {
        features: `InstanceRef zone;`,
        sequence: ";",
        leadingText: "InstanceRef zone",
      },
      {
        features: `InstanceRef error;`,
        sequence: ";",
        leadingText: "InstanceRef error",
      },
      {
        features: `InstanceRef stackTrace;`,
        sequence: ";",
        leadingText: "InstanceRef stackTrace",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static MapAssociation parse() => json == null ? null : MapAssociation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static MapAssociation parse",
      },
      {
        features: `dynamic key;`,
        sequence: ";",
        leadingText: "dynamic key",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static MemoryUsage parse() => json == null ? null : MemoryUsage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static MemoryUsage parse",
      },
      {
        features: `int externalUsage;`,
        sequence: ";",
        leadingText: "int externalUsage",
      },
      {
        features: `int heapCapacity;`,
        sequence: ";",
        leadingText: "int heapCapacity",
      },
      {
        features: `int heapUsage;`,
        sequence: ";",
        leadingText: "int heapUsage",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Message parse() => json == null ? null : Message._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Message parse",
      },
      {
        features: `int index;`,
        sequence: ";",
        leadingText: "int index",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String messageObjectId;`,
        sequence: ";",
        leadingText: "String messageObjectId",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `FuncRef handler;`,
        sequence: ";",
        leadingText: "FuncRef handler",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NativeFunction parse() => json == null ? null : NativeFunction._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NativeFunction parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `Map<String, dynamic> toJson() {      }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NullValRef parse() => json == null ? null : NullValRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NullValRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is NullValRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NullVal parse() => json == null ? null : NullVal._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NullVal parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is NullVal && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ObjRef parse() => json == null ? null : ObjRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ObjRef parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool fixedId;`,
        sequence: ";",
        leadingText: "bool fixedId",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ObjRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Obj parse() => json == null ? null : Obj._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Obj parse",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool fixedId;`,
        sequence: ";",
        leadingText: "bool fixedId",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Obj && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static PortList parse() => json == null ? null : PortList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static PortList parse",
      },
      {
        features: `List<InstanceRef> ports;`,
        sequence: ";",
        leadingText: "List<InstanceRef> ports",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProfileFunction parse() => json == null ? null : ProfileFunction._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProfileFunction parse",
      },
      {
        features: `String kind;`,
        sequence: ";",
        leadingText: "String kind",
      },
      {
        features: `int inclusiveTicks;`,
        sequence: ";",
        leadingText: "int inclusiveTicks",
      },
      {
        features: `int exclusiveTicks;`,
        sequence: ";",
        leadingText: "int exclusiveTicks",
      },
      {
        features: `String resolvedUrl;`,
        sequence: ";",
        leadingText: "String resolvedUrl",
      },
      {
        features: `dynamic function;`,
        sequence: ";",
        leadingText: "dynamic function",
      },
      {
        features: `Map<String, dynamic> toJson() {          }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProtocolList parse() => json == null ? null : ProtocolList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProtocolList parse",
      },
      {
        features: `List<Protocol> protocols;`,
        sequence: ";",
        leadingText: "List<Protocol> protocols",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Protocol parse() => json == null ? null : Protocol._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Protocol parse",
      },
      {
        features: `String protocolName;`,
        sequence: ";",
        leadingText: "String protocolName",
      },
      {
        features: `int major;`,
        sequence: ";",
        leadingText: "int major",
      },
      {
        features: `int minor;`,
        sequence: ";",
        leadingText: "int minor",
      },
      {
        features: `Map<String, dynamic> toJson() {        }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProcessMemoryUsage parse() => json == null ? null : ProcessMemoryUsage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProcessMemoryUsage parse",
      },
      {
        features: `ProcessMemoryItem root;`,
        sequence: ";",
        leadingText: "ProcessMemoryItem root",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ProcessMemoryItem parse() => json == null ? null : ProcessMemoryItem._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProcessMemoryItem parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String description;`,
        sequence: ";",
        leadingText: "String description",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `List<ProcessMemoryItem> children;`,
        sequence: ";",
        leadingText: "List<ProcessMemoryItem> children",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ReloadReport parse() => json == null ? null : ReloadReport._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ReloadReport parse",
      },
      {
        features: `bool success;`,
        sequence: ";",
        leadingText: "bool success",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static RetainingObject parse() => json == null ? null : RetainingObject._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static RetainingObject parse",
      },
      {
        features: `ObjRef value;`,
        sequence: ";",
        leadingText: "ObjRef value",
      },
      {
        features: `int parentListIndex;`,
        sequence: ";",
        leadingText: "int parentListIndex",
      },
      {
        features: `ObjRef parentMapKey;`,
        sequence: ";",
        leadingText: "ObjRef parentMapKey",
      },
      {
        features: `String parentField;`,
        sequence: ";",
        leadingText: "String parentField",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static RetainingPath parse() => json == null ? null : RetainingPath._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static RetainingPath parse",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `String gcRootType;`,
        sequence: ";",
        leadingText: "String gcRootType",
      },
      {
        features: `List<RetainingObject> elements;`,
        sequence: ";",
        leadingText: "List<RetainingObject> elements",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Response parse() => json == null ? null : Response._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Response parse",
      },
      {
        features: `Map<String, dynamic> json;`,
        sequence: ";",
        leadingText: "Map<String, dynamic> json",
      },
      {
        features: `String type;`,
        sequence: ";",
        leadingText: "String type",
      },
      {
        features: `Map<String, dynamic> toJson() {    }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Sentinel parse() => json == null ? null : Sentinel._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Sentinel parse",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ScriptRef parse() => json == null ? null : ScriptRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ScriptRef parse",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ScriptRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Script parse() => json == null ? null : Script._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Script parse",
      },
      {
        features: `final _tokenToLine = <int, int>{}`,
        sequence: "={}",
        leadingText: "final _tokenToLine",
      },
      {
        features: `final _tokenToColumn = <int, int>{}`,
        sequence: "={}",
        leadingText: "final _tokenToColumn",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `LibraryRef library;`,
        sequence: ";",
        leadingText: "LibraryRef library",
      },
      {
        features: `int lineOffset;`,
        sequence: ";",
        leadingText: "int lineOffset",
      },
      {
        features: `int columnOffset;`,
        sequence: ";",
        leadingText: "int columnOffset",
      },
      {
        features: `String source;`,
        sequence: ";",
        leadingText: "String source",
      },
      {
        features: `List<List<int>> tokenPosTable;`,
        sequence: ";",
        leadingText: "List<List<int>> tokenPosTable",
      },
      {
        features: `int getLineNumberFromTokenPos() => _tokenToLine[tokenPos];`,
        sequence: "()=>[];",
        leadingText: "int getLineNumberFromTokenPos",
      },
      {
        features: `int getColumnNumberFromTokenPos() => _tokenToColumn[tokenPos];`,
        sequence: "()=>[];",
        leadingText: "int getColumnNumberFromTokenPos",
      },
      {
        features: `void _parseTokenPosTable() {                 }`,
        sequence: "(){}",
        leadingText: "void _parseTokenPosTable",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Script && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static ScriptList parse() => json == null ? null : ScriptList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ScriptList parse",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceLocation parse() => json == null ? null : SourceLocation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceLocation parse",
      },
      {
        features: `ScriptRef script;`,
        sequence: ";",
        leadingText: "ScriptRef script",
      },
      {
        features: `int tokenPos;`,
        sequence: ";",
        leadingText: "int tokenPos",
      },
      {
        features: `int endTokenPos;`,
        sequence: ";",
        leadingText: "int endTokenPos",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceReport parse() => json == null ? null : SourceReport._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReport parse",
      },
      {
        features: `List<SourceReportRange> ranges;`,
        sequence: ";",
        leadingText: "List<SourceReportRange> ranges",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceReportCoverage parse() => json == null ? null : SourceReportCoverage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReportCoverage parse",
      },
      {
        features: `List<int> hits;`,
        sequence: ";",
        leadingText: "List<int> hits",
      },
      {
        features: `List<int> misses;`,
        sequence: ";",
        leadingText: "List<int> misses",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static SourceReportRange parse() => json == null ? null : SourceReportRange._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReportRange parse",
      },
      {
        features: `int scriptIndex;`,
        sequence: ";",
        leadingText: "int scriptIndex",
      },
      {
        features: `int startPos;`,
        sequence: ";",
        leadingText: "int startPos",
      },
      {
        features: `int endPos;`,
        sequence: ";",
        leadingText: "int endPos",
      },
      {
        features: `bool compiled;`,
        sequence: ";",
        leadingText: "bool compiled",
      },
      {
        features: `ErrorRef error;`,
        sequence: ";",
        leadingText: "ErrorRef error",
      },
      {
        features: `SourceReportCoverage coverage;`,
        sequence: ";",
        leadingText: "SourceReportCoverage coverage",
      },
      {
        features: `List<int> possibleBreakpoints;`,
        sequence: ";",
        leadingText: "List<int> possibleBreakpoints",
      },
      {
        features: `Map<String, dynamic> toJson() {             }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Stack parse() => json == null ? null : Stack._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Stack parse",
      },
      {
        features: `List<Frame> frames;`,
        sequence: ";",
        leadingText: "List<Frame> frames",
      },
      {
        features: `List<Frame> asyncCausalFrames;`,
        sequence: ";",
        leadingText: "List<Frame> asyncCausalFrames",
      },
      {
        features: `List<Frame> awaiterFrames;`,
        sequence: ";",
        leadingText: "List<Frame> awaiterFrames",
      },
      {
        features: `List<Message> messages;`,
        sequence: ";",
        leadingText: "List<Message> messages",
      },
      {
        features: `bool truncated;`,
        sequence: ";",
        leadingText: "bool truncated",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Success parse() => json == null ? null : Success._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Success parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Timeline parse() => json == null ? null : Timeline._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Timeline parse",
      },
      {
        features: `List<TimelineEvent> traceEvents;`,
        sequence: ";",
        leadingText: "List<TimelineEvent> traceEvents",
      },
      {
        features: `int timeOriginMicros;`,
        sequence: ";",
        leadingText: "int timeOriginMicros",
      },
      {
        features: `int timeExtentMicros;`,
        sequence: ";",
        leadingText: "int timeExtentMicros",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TimelineEvent parse() => json == null ? null : TimelineEvent._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TimelineEvent parse",
      },
      {
        features: `Map<String, dynamic> json;`,
        sequence: ";",
        leadingText: "Map<String, dynamic> json",
      },
      {
        features: `Map<String, dynamic> toJson() {    }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TimelineFlags parse() => json == null ? null : TimelineFlags._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TimelineFlags parse",
      },
      {
        features: `String recorderName;`,
        sequence: ";",
        leadingText: "String recorderName",
      },
      {
        features: `List<String> availableStreams;`,
        sequence: ";",
        leadingText: "List<String> availableStreams",
      },
      {
        features: `List<String> recordedStreams;`,
        sequence: ";",
        leadingText: "List<String> recordedStreams",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Timestamp parse() => json == null ? null : Timestamp._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Timestamp parse",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TypeArgumentsRef parse() => json == null ? null : TypeArgumentsRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TypeArgumentsRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is TypeArgumentsRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static TypeArguments parse() => json == null ? null : TypeArguments._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TypeArguments parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `List<InstanceRef> types;`,
        sequence: ";",
        leadingText: "List<InstanceRef> types",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is TypeArguments && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static UnresolvedSourceLocation parse() => json == null ? null : UnresolvedSourceLocation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static UnresolvedSourceLocation parse",
      },
      {
        features: `ScriptRef script;`,
        sequence: ";",
        leadingText: "ScriptRef script",
      },
      {
        features: `String scriptUri;`,
        sequence: ";",
        leadingText: "String scriptUri",
      },
      {
        features: `int tokenPos;`,
        sequence: ";",
        leadingText: "int tokenPos",
      },
      {
        features: `int line;`,
        sequence: ";",
        leadingText: "int line",
      },
      {
        features: `int column;`,
        sequence: ";",
        leadingText: "int column",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Version parse() => json == null ? null : Version._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Version parse",
      },
      {
        features: `int major;`,
        sequence: ";",
        leadingText: "int major",
      },
      {
        features: `int minor;`,
        sequence: ";",
        leadingText: "int minor",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static VMRef parse() => json == null ? null : VMRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VMRef parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static VM parse() => json == null ? null : VM._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VM parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int architectureBits;`,
        sequence: ";",
        leadingText: "int architectureBits",
      },
      {
        features: `String hostCPU;`,
        sequence: ";",
        leadingText: "String hostCPU",
      },
      {
        features: `String operatingSystem;`,
        sequence: ";",
        leadingText: "String operatingSystem",
      },
      {
        features: `String targetCPU;`,
        sequence: ";",
        leadingText: "String targetCPU",
      },
      {
        features: `String version;`,
        sequence: ";",
        leadingText: "String version",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `List<IsolateGroupRef> isolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> isolateGroups",
      },
      {
        features: `List<IsolateRef> systemIsolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> systemIsolates",
      },
      {
        features: `List<IsolateGroupRef> systemIsolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> systemIsolateGroups",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `Stream<Event> onEvent();`,
        sequence: "();",
        leadingText: "Stream<Event> onEvent",
      },
      {
        features: `Future<Response> callServiceExtension( );`,
        sequence: "();",
        leadingText: "Future<Response> callServiceExtension",
      },
      {
        features: `Future<Breakpoint> addBreakpoint(     );`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpoint",
      },
      {
        features: `Future<Breakpoint> addBreakpointWithScriptUri(     );`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpointWithScriptUri",
      },
      {
        features: `Future<Breakpoint> addBreakpointAtEntry();`,
        sequence: "();",
        leadingText: "Future<Breakpoint> addBreakpointAtEntry",
      },
      {
        features: `Future<Success> clearCpuSamples();`,
        sequence: "();",
        leadingText: "Future<Success> clearCpuSamples",
      },
      {
        features: `Future<Success> clearVMTimeline();`,
        sequence: "();",
        leadingText: "Future<Success> clearVMTimeline",
      },
      {
        features: `Future<Response> invoke(      );`,
        sequence: "();",
        leadingText: "Future<Response> invoke",
      },
      {
        features: `Future<Response> evaluate(      );`,
        sequence: "();",
        leadingText: "Future<Response> evaluate",
      },
      {
        features: `Future<Response> evaluateInFrame(      );`,
        sequence: "();",
        leadingText: "Future<Response> evaluateInFrame",
      },
      {
        features: `Future<AllocationProfile> getAllocationProfile( );`,
        sequence: "();",
        leadingText: "Future<AllocationProfile> getAllocationProfile",
      },
      {
        features: `Future<ClassList> getClassList();`,
        sequence: "();",
        leadingText: "Future<ClassList> getClassList",
      },
      {
        features: `Future<CpuSamples> getCpuSamples( );`,
        sequence: "();",
        leadingText: "Future<CpuSamples> getCpuSamples",
      },
      {
        features: `Future<FlagList> getFlagList();`,
        sequence: "();",
        leadingText: "Future<FlagList> getFlagList",
      },
      {
        features: `Future<InboundReferences> getInboundReferences( );`,
        sequence: "();",
        leadingText: "Future<InboundReferences> getInboundReferences",
      },
      {
        features: `Future<InstanceSet> getInstances( );`,
        sequence: "();",
        leadingText: "Future<InstanceSet> getInstances",
      },
      {
        features: `Future<Isolate> getIsolate();`,
        sequence: "();",
        leadingText: "Future<Isolate> getIsolate",
      },
      {
        features: `Future<IsolateGroup> getIsolateGroup();`,
        sequence: "();",
        leadingText: "Future<IsolateGroup> getIsolateGroup",
      },
      {
        features: `Future<MemoryUsage> getMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<MemoryUsage> getMemoryUsage",
      },
      {
        features: `Future<MemoryUsage> getIsolateGroupMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<MemoryUsage> getIsolateGroupMemoryUsage",
      },
      {
        features: `Future<ScriptList> getScripts();`,
        sequence: "();",
        leadingText: "Future<ScriptList> getScripts",
      },
      {
        features: `Future<Obj> getObject(     );`,
        sequence: "();",
        leadingText: "Future<Obj> getObject",
      },
      {
        features: `Future<PortList> getPorts();`,
        sequence: "();",
        leadingText: "Future<PortList> getPorts",
      },
      {
        features: `Future<RetainingPath> getRetainingPath( );`,
        sequence: "();",
        leadingText: "Future<RetainingPath> getRetainingPath",
      },
      {
        features: `Future<ProcessMemoryUsage> getProcessMemoryUsage();`,
        sequence: "();",
        leadingText: "Future<ProcessMemoryUsage> getProcessMemoryUsage",
      },
      {
        features: `Future<Stack> getStack();`,
        sequence: "();",
        leadingText: "Future<Stack> getStack",
      },
      {
        features: `Future<ProtocolList> getSupportedProtocols();`,
        sequence: "();",
        leadingText: "Future<ProtocolList> getSupportedProtocols",
      },
      {
        features: `Future<SourceReport> getSourceReport(        );`,
        sequence: "();",
        leadingText: "Future<SourceReport> getSourceReport",
      },
      {
        features: `Future<Version> getVersion();`,
        sequence: "();",
        leadingText: "Future<Version> getVersion",
      },
      {
        features: `Future<VM> getVM();`,
        sequence: "();",
        leadingText: "Future<VM> getVM",
      },
      {
        features: `Future<Timeline> getVMTimeline();`,
        sequence: "();",
        leadingText: "Future<Timeline> getVMTimeline",
      },
      {
        features: `Future<TimelineFlags> getVMTimelineFlags();`,
        sequence: "();",
        leadingText: "Future<TimelineFlags> getVMTimelineFlags",
      },
      {
        features: `Future<Timestamp> getVMTimelineMicros();`,
        sequence: "();",
        leadingText: "Future<Timestamp> getVMTimelineMicros",
      },
      {
        features: `Future<Success> pause();`,
        sequence: "();",
        leadingText: "Future<Success> pause",
      },
      {
        features: `Future<Success> kill();`,
        sequence: "();",
        leadingText: "Future<Success> kill",
      },
      {
        features: `Future<Success> registerService();`,
        sequence: "();",
        leadingText: "Future<Success> registerService",
      },
      {
        features: `Future<ReloadReport> reloadSources(      );`,
        sequence: "();",
        leadingText: "Future<ReloadReport> reloadSources",
      },
      {
        features: `Future<Success> removeBreakpoint();`,
        sequence: "();",
        leadingText: "Future<Success> removeBreakpoint",
      },
      {
        features: `Future<Success> requestHeapSnapshot();`,
        sequence: "();",
        leadingText: "Future<Success> requestHeapSnapshot",
      },
      {
        features: `Future<Success> resume( );`,
        sequence: "();",
        leadingText: "Future<Success> resume",
      },
      {
        features: `Future<Success> setExceptionPauseMode( );`,
        sequence: "();",
        leadingText: "Future<Success> setExceptionPauseMode",
      },
      {
        features: `Future<Response> setFlag();`,
        sequence: "();",
        leadingText: "Future<Response> setFlag",
      },
      {
        features: `Future<Success> setLibraryDebuggable( );`,
        sequence: "();",
        leadingText: "Future<Success> setLibraryDebuggable",
      },
      {
        features: `Future<Success> setName();`,
        sequence: "();",
        leadingText: "Future<Success> setName",
      },
      {
        features: `Future<Success> setVMName();`,
        sequence: "();",
        leadingText: "Future<Success> setVMName",
      },
      {
        features: `Future<Success> setVMTimelineFlags();`,
        sequence: "();",
        leadingText: "Future<Success> setVMTimelineFlags",
      },
      {
        features: `Future<Success> streamCancel();`,
        sequence: "();",
        leadingText: "Future<Success> streamCancel",
      },
      {
        features: `Future<Success> streamListen();`,
        sequence: "();",
        leadingText: "Future<Success> streamListen",
      },
      {
        features: `final dynamic originalId;`,
        sequence: ";",
        leadingText: "final dynamic originalId",
      },
      {
        features: `final _completer = Completer<Map<String, Object>>();`,
        sequence: "=();",
        leadingText: "final _completer",
      },
      {
        features: `Future<Map<String, Object>> get future => _completer.future;`,
        sequence: "=>;",
        leadingText: "Future<Map<String, Object>> get future",
      },
      {
        features: `void complete() {   }`,
        sequence: "(){}",
        leadingText: "void complete",
      },
      {
        features: `final _doneCompleter = Completer<Null>();`,
        sequence: "=();",
        leadingText: "final _doneCompleter",
      },
      {
        features: `int _nextServiceRequestId = 0;`,
        sequence: "=;",
        leadingText: "int _nextServiceRequestId",
      },
      {
        features: `final _pendingServiceExtensionRequests = <dynamic, _PendingServiceRequest>{}`,
        sequence: "={}",
        leadingText: "final _pendingServiceExtensionRequests",
      },
      {
        features: `final Stream<Map<String, Object>> _requestStream;`,
        sequence: ";",
        leadingText: "final Stream<Map<String, Object>> _requestStream",
      },
      {
        features: `final StreamSink<Map<String, Object>> _responseSink;`,
        sequence: ";",
        leadingText: "final StreamSink<Map<String, Object>> _responseSink",
      },
      {
        features: `final ServiceExtensionRegistry _serviceExtensionRegistry;`,
        sequence: ";",
        leadingText: "final ServiceExtensionRegistry _serviceExtensionRegistry",
      },
      {
        features: `final VmServiceInterface _serviceImplementation;`,
        sequence: ";",
        leadingText: "final VmServiceInterface _serviceImplementation",
      },
      {
        features: `final _streamSubscriptions = <String, StreamSubscription>{}`,
        sequence: "={}",
        leadingText: "final _streamSubscriptions",
      },
      {
        features: `Future get done => _doneCompleter.future;`,
        sequence: "=>;",
        leadingText: "Future get done",
      },
      {
        features: `Future<Map<String, Object>> _forwardServiceExtensionRequest( ) {           }`,
        sequence: "(){}",
        leadingText: "Future<Map<String, Object>> _forwardServiceExtensionRequest",
      },
      {
        features: `void _delegateRequest() async {                                                                                                                                                                                                                                                                                                                                                                    }`,
        sequence: "(){}",
        leadingText: "void _delegateRequest",
      },
      {
        features: `Map<String, Completer> _completers = {}`,
        sequence: "={}",
        leadingText: "Map<String, Completer> _completers",
      },
      {
        features: `DisposeHandler _disposeHandler;`,
        sequence: ";",
        leadingText: "DisposeHandler _disposeHandler",
      },
      {
        features: `Map<String, StreamController<Event>> _eventControllers = {}`,
        sequence: "={}",
        leadingText: "Map<String, StreamController<Event>> _eventControllers",
      },
      {
        features: `int _id = 0;`,
        sequence: "=;",
        leadingText: "int _id",
      },
      {
        features: `Log _log;`,
        sequence: ";",
        leadingText: "Log _log",
      },
      {
        features: `Map<String, String> _methodCalls = {}`,
        sequence: "={}",
        leadingText: "Map<String, String> _methodCalls",
      },
      {
        features: `final Completer _onDoneCompleter = Completer();`,
        sequence: "=();",
        leadingText: "final Completer _onDoneCompleter",
      },
      {
        features: `StreamController<String> _onReceive = StreamController.broadcast();`,
        sequence: "=();",
        leadingText: "StreamController<String> _onReceive",
      },
      {
        features: `StreamController<String> _onSend = StreamController.broadcast();`,
        sequence: "=();",
        leadingText: "StreamController<String> _onSend",
      },
      {
        features: `Map<String, ServiceCallback> _services = {}`,
        sequence: "={}",
        leadingText: "Map<String, ServiceCallback> _services",
      },
      {
        features: `StreamSubscription _streamSub;`,
        sequence: ";",
        leadingText: "StreamSubscription _streamSub",
      },
      {
        features: `Function _writeMessage;`,
        sequence: ";",
        leadingText: "Function _writeMessage",
      },
      {
        features: `StreamController<Event> _getEventController() {       }`,
        sequence: "(){}",
        leadingText: "StreamController<Event> _getEventController",
      },
      {
        features: `Stream<Event> get onVMEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onVMEvent",
      },
      {
        features: `Stream<Event> get onIsolateEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onIsolateEvent",
      },
      {
        features: `Stream<Event> get onDebugEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onDebugEvent",
      },
      {
        features: `Stream<Event> get onGCEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onGCEvent",
      },
      {
        features: `Stream<Event> get onExtensionEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onExtensionEvent",
      },
      {
        features: `Stream<Event> get onTimelineEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onTimelineEvent",
      },
      {
        features: `Stream<Event> get onLoggingEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onLoggingEvent",
      },
      {
        features: `Stream<Event> get onServiceEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onServiceEvent",
      },
      {
        features: `Stream<Event> get onHeapSnapshotEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onHeapSnapshotEvent",
      },
      {
        features: `Stream<Event> get onStdoutEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onStdoutEvent",
      },
      {
        features: `Stream<Event> get onStderrEvent => _getEventController().stream;`,
        sequence: "=>();",
        leadingText: "Stream<Event> get onStderrEvent",
      },
      {
        features: `Future<Response> callMethod() {  }`,
        sequence: "(){}",
        leadingText: "Future<Response> callMethod",
      },
      {
        features: `Stream<String> get onSend => _onSend.stream;`,
        sequence: "=>;",
        leadingText: "Stream<String> get onSend",
      },
      {
        features: `Stream<String> get onReceive => _onReceive.stream;`,
        sequence: "=>;",
        leadingText: "Stream<String> get onReceive",
      },
      {
        features: `void dispose() {              }`,
        sequence: "(){}",
        leadingText: "void dispose",
      },
      {
        features: `Future get onDone => _onDoneCompleter.future;`,
        sequence: "=>;",
        leadingText: "Future get onDone",
      },
      {
        features: `Future<T> _call<T>() {               }`,
        sequence: "(){}",
        leadingText: "Future<T> _call<T>",
      },
      {
        features: `void registerServiceCallback() {     }`,
        sequence: "(){}",
        leadingText: "void registerServiceCallback",
      },
      {
        features: `void _processMessage() {             }`,
        sequence: "(){}",
        leadingText: "void _processMessage",
      },
      {
        features: `void _processMessageByteData() {                 }`,
        sequence: "(){}",
        leadingText: "void _processMessageByteData",
      },
      {
        features: `void _processMessageStr() {                       }`,
        sequence: "(){}",
        leadingText: "void _processMessageStr",
      },
      {
        features: `void _processResponse() {                   }`,
        sequence: "(){}",
        leadingText: "void _processResponse",
      },
      {
        features: `Future _processRequest() async {        }`,
        sequence: "(){}",
        leadingText: "Future _processRequest",
      },
      {
        features: `Future _processNotification() async {          }`,
        sequence: "(){}",
        leadingText: "Future _processNotification",
      },
      {
        features: `Future<Map> _routeRequest() async {                  }`,
        sequence: "(){}",
        leadingText: "Future<Map> _routeRequest",
      },
      {
        features: `static const int kInternalError = -32603;`,
        sequence: "=;",
        leadingText: "static const int kInternalError",
      },
      {
        features: `static const int kInvalidParams = -32602;`,
        sequence: "=;",
        leadingText: "static const int kInvalidParams",
      },
      {
        features: `static const int kInvalidRequest = -32600;`,
        sequence: "=;",
        leadingText: "static const int kInvalidRequest",
      },
      {
        features: `static const int kMethodNotFound = -32601;`,
        sequence: "=;",
        leadingText: "static const int kMethodNotFound",
      },
      {
        features: `static const int kServerError = -32000;`,
        sequence: "=;",
        leadingText: "static const int kServerError",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final int code;`,
        sequence: ";",
        leadingText: "final int code",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `final String message;`,
        sequence: ";",
        leadingText: "final String message",
      },
      {
        features: `static RPCError parse() {  }`,
        sequence: "(){}",
        leadingText: "static RPCError parse",
      },
      {
        features: `String get details => data == null ? null : data[''];`,
        sequence: "=>==[];",
        leadingText: "String get details",
      },
      {
        features: `Map<String, dynamic> toMap() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toMap",
      },
      {
        features: `String toString() {      }`,
        sequence: "(){}",
        leadingText: "String toString",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final Sentinel sentinel;`,
        sequence: ";",
        leadingText: "final Sentinel sentinel",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `static ExtensionData parse() => json == null ? null : ExtensionData._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ExtensionData parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `void warning();`,
        sequence: "();",
        leadingText: "void warning",
      },
      {
        features: `void severe();`,
        sequence: "();",
        leadingText: "void severe",
      },
      {
        features: `void warning() {}`,
        sequence: "(){}",
        leadingText: "void warning",
      },
      {
        features: `void severe() {}`,
        sequence: "(){}",
        leadingText: "void severe",
      },
      {
        features: `static const String kCollected = '';`,
        sequence: "=;",
        leadingText: "static const String kCollected",
      },
      {
        features: `static const String kDart = '';`,
        sequence: "=;",
        leadingText: "static const String kDart",
      },
      {
        features: `static const String kNative = '';`,
        sequence: "=;",
        leadingText: "static const String kNative",
      },
      {
        features: `static const String kStub = '';`,
        sequence: "=;",
        leadingText: "static const String kStub",
      },
      {
        features: `static const String kTag = '';`,
        sequence: "=;",
        leadingText: "static const String kTag",
      },
      {
        features: `static const String kInternalError = '';`,
        sequence: "=;",
        leadingText: "static const String kInternalError",
      },
      {
        features: `static const String kLanguageError = '';`,
        sequence: "=;",
        leadingText: "static const String kLanguageError",
      },
      {
        features: `static const String kTerminationError = '';`,
        sequence: "=;",
        leadingText: "static const String kTerminationError",
      },
      {
        features: `static const String kUnhandledException = '';`,
        sequence: "=;",
        leadingText: "static const String kUnhandledException",
      },
      {
        features: `static const String kDebug = '';`,
        sequence: "=;",
        leadingText: "static const String kDebug",
      },
      {
        features: `static const String kExtension = '';`,
        sequence: "=;",
        leadingText: "static const String kExtension",
      },
      {
        features: `static const String kGC = '';`,
        sequence: "=;",
        leadingText: "static const String kGC",
      },
      {
        features: `static const String kHeapSnapshot = '';`,
        sequence: "=;",
        leadingText: "static const String kHeapSnapshot",
      },
      {
        features: `static const String kIsolate = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolate",
      },
      {
        features: `static const String kLogging = '';`,
        sequence: "=;",
        leadingText: "static const String kLogging",
      },
      {
        features: `static const String kService = '';`,
        sequence: "=;",
        leadingText: "static const String kService",
      },
      {
        features: `static const String kStderr = '';`,
        sequence: "=;",
        leadingText: "static const String kStderr",
      },
      {
        features: `static const String kStdout = '';`,
        sequence: "=;",
        leadingText: "static const String kStdout",
      },
      {
        features: `static const String kTimeline = '';`,
        sequence: "=;",
        leadingText: "static const String kTimeline",
      },
      {
        features: `static const String kVM = '';`,
        sequence: "=;",
        leadingText: "static const String kVM",
      },
      {
        features: `static const String kBreakpointAdded = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointAdded",
      },
      {
        features: `static const String kBreakpointRemoved = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointRemoved",
      },
      {
        features: `static const String kBreakpointResolved = '';`,
        sequence: "=;",
        leadingText: "static const String kBreakpointResolved",
      },
      {
        features: `static const String kExtension = '';`,
        sequence: "=;",
        leadingText: "static const String kExtension",
      },
      {
        features: `static const String kGC = '';`,
        sequence: "=;",
        leadingText: "static const String kGC",
      },
      {
        features: `static const String kInspect = '';`,
        sequence: "=;",
        leadingText: "static const String kInspect",
      },
      {
        features: `static const String kIsolateExit = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateExit",
      },
      {
        features: `static const String kIsolateReload = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateReload",
      },
      {
        features: `static const String kIsolateRunnable = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateRunnable",
      },
      {
        features: `static const String kIsolateStart = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateStart",
      },
      {
        features: `static const String kIsolateUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kIsolateUpdate",
      },
      {
        features: `static const String kLogging = '';`,
        sequence: "=;",
        leadingText: "static const String kLogging",
      },
      {
        features: `static const String kNone = '';`,
        sequence: "=;",
        leadingText: "static const String kNone",
      },
      {
        features: `static const String kPauseBreakpoint = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseBreakpoint",
      },
      {
        features: `static const String kPauseException = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseException",
      },
      {
        features: `static const String kPauseExit = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseExit",
      },
      {
        features: `static const String kPauseInterrupted = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseInterrupted",
      },
      {
        features: `static const String kPausePostRequest = '';`,
        sequence: "=;",
        leadingText: "static const String kPausePostRequest",
      },
      {
        features: `static const String kPauseStart = '';`,
        sequence: "=;",
        leadingText: "static const String kPauseStart",
      },
      {
        features: `static const String kResume = '';`,
        sequence: "=;",
        leadingText: "static const String kResume",
      },
      {
        features: `static const String kServiceExtensionAdded = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceExtensionAdded",
      },
      {
        features: `static const String kServiceRegistered = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceRegistered",
      },
      {
        features: `static const String kServiceUnregistered = '';`,
        sequence: "=;",
        leadingText: "static const String kServiceUnregistered",
      },
      {
        features: `static const String kTimelineEvents = '';`,
        sequence: "=;",
        leadingText: "static const String kTimelineEvents",
      },
      {
        features: `static const String kTimelineStreamSubscriptionsUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kTimelineStreamSubscriptionsUpdate",
      },
      {
        features: `static const String kVMFlagUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kVMFlagUpdate",
      },
      {
        features: `static const String kVMUpdate = '';`,
        sequence: "=;",
        leadingText: "static const String kVMUpdate",
      },
      {
        features: `static const String kWriteEvent = '';`,
        sequence: "=;",
        leadingText: "static const String kWriteEvent",
      },
      {
        features: `static const String kBool = '';`,
        sequence: "=;",
        leadingText: "static const String kBool",
      },
      {
        features: `static const String kBoundedType = '';`,
        sequence: "=;",
        leadingText: "static const String kBoundedType",
      },
      {
        features: `static const String kClosure = '';`,
        sequence: "=;",
        leadingText: "static const String kClosure",
      },
      {
        features: `static const String kDouble = '';`,
        sequence: "=;",
        leadingText: "static const String kDouble",
      },
      {
        features: `static const String kFloat32List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32List",
      },
      {
        features: `static const String kFloat32x4 = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32x4",
      },
      {
        features: `static const String kFloat32x4List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat32x4List",
      },
      {
        features: `static const String kFloat64List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64List",
      },
      {
        features: `static const String kFloat64x2 = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64x2",
      },
      {
        features: `static const String kFloat64x2List = '';`,
        sequence: "=;",
        leadingText: "static const String kFloat64x2List",
      },
      {
        features: `static const String kInt = '';`,
        sequence: "=;",
        leadingText: "static const String kInt",
      },
      {
        features: `static const String kInt16List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt16List",
      },
      {
        features: `static const String kInt32List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32List",
      },
      {
        features: `static const String kInt32x4 = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32x4",
      },
      {
        features: `static const String kInt32x4List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt32x4List",
      },
      {
        features: `static const String kInt64List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt64List",
      },
      {
        features: `static const String kInt8List = '';`,
        sequence: "=;",
        leadingText: "static const String kInt8List",
      },
      {
        features: `static const String kList = '';`,
        sequence: "=;",
        leadingText: "static const String kList",
      },
      {
        features: `static const String kMap = '';`,
        sequence: "=;",
        leadingText: "static const String kMap",
      },
      {
        features: `static const String kMirrorReference = '';`,
        sequence: "=;",
        leadingText: "static const String kMirrorReference",
      },
      {
        features: `static const String kNull = '';`,
        sequence: "=;",
        leadingText: "static const String kNull",
      },
      {
        features: `static const String kPlainInstance = '';`,
        sequence: "=;",
        leadingText: "static const String kPlainInstance",
      },
      {
        features: `static const String kReceivePort = '';`,
        sequence: "=;",
        leadingText: "static const String kReceivePort",
      },
      {
        features: `static const String kRegExp = '';`,
        sequence: "=;",
        leadingText: "static const String kRegExp",
      },
      {
        features: `static const String kStackTrace = '';`,
        sequence: "=;",
        leadingText: "static const String kStackTrace",
      },
      {
        features: `static const String kString = '';`,
        sequence: "=;",
        leadingText: "static const String kString",
      },
      {
        features: `static const String kType = '';`,
        sequence: "=;",
        leadingText: "static const String kType",
      },
      {
        features: `static const String kTypeParameter = '';`,
        sequence: "=;",
        leadingText: "static const String kTypeParameter",
      },
      {
        features: `static const String kTypeRef = '';`,
        sequence: "=;",
        leadingText: "static const String kTypeRef",
      },
      {
        features: `static const String kUint16List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint16List",
      },
      {
        features: `static const String kUint32List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint32List",
      },
      {
        features: `static const String kUint64List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint64List",
      },
      {
        features: `static const String kUint8ClampedList = '';`,
        sequence: "=;",
        leadingText: "static const String kUint8ClampedList",
      },
      {
        features: `static const String kUint8List = '';`,
        sequence: "=;",
        leadingText: "static const String kUint8List",
      },
      {
        features: `static const String kWeakProperty = '';`,
        sequence: "=;",
        leadingText: "static const String kWeakProperty",
      },
      {
        features: `static const String kBeingInitialized = '';`,
        sequence: "=;",
        leadingText: "static const String kBeingInitialized",
      },
      {
        features: `static const String kCollected = '';`,
        sequence: "=;",
        leadingText: "static const String kCollected",
      },
      {
        features: `static const String kExpired = '';`,
        sequence: "=;",
        leadingText: "static const String kExpired",
      },
      {
        features: `static const String kFree = '';`,
        sequence: "=;",
        leadingText: "static const String kFree",
      },
      {
        features: `static const String kNotInitialized = '';`,
        sequence: "=;",
        leadingText: "static const String kNotInitialized",
      },
      {
        features: `static const String kOptimizedOut = '';`,
        sequence: "=;",
        leadingText: "static const String kOptimizedOut",
      },
      {
        features: `static const String kAsyncActivation = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncActivation",
      },
      {
        features: `static const String kAsyncCausal = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncCausal",
      },
      {
        features: `static const String kAsyncSuspensionMarker = '';`,
        sequence: "=;",
        leadingText: "static const String kAsyncSuspensionMarker",
      },
      {
        features: `static const String kRegular = '';`,
        sequence: "=;",
        leadingText: "static const String kRegular",
      },
      {
        features: `static const String kCoverage = '';`,
        sequence: "=;",
        leadingText: "static const String kCoverage",
      },
      {
        features: `static const String kPossibleBreakpoints = '';`,
        sequence: "=;",
        leadingText: "static const String kPossibleBreakpoints",
      },
      {
        features: `static const String kAll = '';`,
        sequence: "=;",
        leadingText: "static const String kAll",
      },
      {
        features: `static const String kNone = '';`,
        sequence: "=;",
        leadingText: "static const String kNone",
      },
      {
        features: `static const String kUnhandled = '';`,
        sequence: "=;",
        leadingText: "static const String kUnhandled",
      },
      {
        features: `static const String kInto = '';`,
        sequence: "=;",
        leadingText: "static const String kInto",
      },
      {
        features: `static const String kOut = '';`,
        sequence: "=;",
        leadingText: "static const String kOut",
      },
      {
        features: `static const String kOver = '';`,
        sequence: "=;",
        leadingText: "static const String kOver",
      },
      {
        features: `static const String kOverAsyncSuspension = '';`,
        sequence: "=;",
        leadingText: "static const String kOverAsyncSuspension",
      },
      {
        features: `static const String kRewind = '';`,
        sequence: "=;",
        leadingText: "static const String kRewind",
      },
      {
        features: `int dateLastAccumulatorReset;`,
        sequence: ";",
        leadingText: "int dateLastAccumulatorReset",
      },
      {
        features: `int dateLastServiceGC;`,
        sequence: ";",
        leadingText: "int dateLastServiceGC",
      },
      {
        features: `List<ClassHeapStats> members;`,
        sequence: ";",
        leadingText: "List<ClassHeapStats> members",
      },
      {
        features: `MemoryUsage memoryUsage;`,
        sequence: ";",
        leadingText: "MemoryUsage memoryUsage",
      },
      {
        features: `static AllocationProfile parse() => json == null ? null : AllocationProfile._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static AllocationProfile parse",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `FieldRef decl;`,
        sequence: ";",
        leadingText: "FieldRef decl",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `static BoundField parse() => json == null ? null : BoundField._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static BoundField parse",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int declarationTokenPos;`,
        sequence: ";",
        leadingText: "int declarationTokenPos",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int scopeEndTokenPos;`,
        sequence: ";",
        leadingText: "int scopeEndTokenPos",
      },
      {
        features: `int scopeStartTokenPos;`,
        sequence: ";",
        leadingText: "int scopeStartTokenPos",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `static BoundVariable parse() => json == null ? null : BoundVariable._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static BoundVariable parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int breakpointNumber;`,
        sequence: ";",
        leadingText: "int breakpointNumber",
      },
      {
        features: `bool isSyntheticAsyncContinuation;`,
        sequence: ";",
        leadingText: "bool isSyntheticAsyncContinuation",
      },
      {
        features: `dynamic location;`,
        sequence: ";",
        leadingText: "dynamic location",
      },
      {
        features: `bool resolved;`,
        sequence: ";",
        leadingText: "bool resolved",
      },
      {
        features: `static Breakpoint parse() => json == null ? null : Breakpoint._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Breakpoint parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Breakpoint && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `static ClassRef parse() => json == null ? null : ClassRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ClassRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `ErrorRef error;`,
        sequence: ";",
        leadingText: "ErrorRef error",
      },
      {
        features: `List<FieldRef> fields;`,
        sequence: ";",
        leadingText: "List<FieldRef> fields",
      },
      {
        features: `List<FuncRef> functions;`,
        sequence: ";",
        leadingText: "List<FuncRef> functions",
      },
      {
        features: `List<InstanceRef> interfaces;`,
        sequence: ";",
        leadingText: "List<InstanceRef> interfaces",
      },
      {
        features: `bool isAbstract;`,
        sequence: ";",
        leadingText: "bool isAbstract",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `LibraryRef library;`,
        sequence: ";",
        leadingText: "LibraryRef library",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `InstanceRef mixin;`,
        sequence: ";",
        leadingText: "InstanceRef mixin",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `List<ClassRef> subclasses;`,
        sequence: ";",
        leadingText: "List<ClassRef> subclasses",
      },
      {
        features: `ClassRef superClass;`,
        sequence: ";",
        leadingText: "ClassRef superClass",
      },
      {
        features: `InstanceRef superType;`,
        sequence: ";",
        leadingText: "InstanceRef superType",
      },
      {
        features: `static Class parse() => json == null ? null : Class._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Class parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Class && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int accumulatedSize;`,
        sequence: ";",
        leadingText: "int accumulatedSize",
      },
      {
        features: `int bytesCurrent;`,
        sequence: ";",
        leadingText: "int bytesCurrent",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `int instancesAccumulated;`,
        sequence: ";",
        leadingText: "int instancesAccumulated",
      },
      {
        features: `int instancesCurrent;`,
        sequence: ";",
        leadingText: "int instancesCurrent",
      },
      {
        features: `static ClassHeapStats parse() => json == null ? null : ClassHeapStats._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassHeapStats parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<ClassRef> classes;`,
        sequence: ";",
        leadingText: "List<ClassRef> classes",
      },
      {
        features: `static ClassList parse() => json == null ? null : ClassList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ClassList parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `static CodeRef parse() => json == null ? null : CodeRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CodeRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is CodeRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `static Code parse() => json == null ? null : Code._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Code parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Code && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `static ContextRef parse() => json == null ? null : ContextRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ContextRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ContextRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `Context parent;`,
        sequence: ";",
        leadingText: "Context parent",
      },
      {
        features: `List<ContextElement> variables;`,
        sequence: ";",
        leadingText: "List<ContextElement> variables",
      },
      {
        features: `static Context parse() => json == null ? null : Context._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Context parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Context && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `static ContextElement parse() => json == null ? null : ContextElement._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ContextElement parse",
      },
      {
        features: `Map<String, dynamic> toJson() {      }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<ProfileFunction> functions;`,
        sequence: ";",
        leadingText: "List<ProfileFunction> functions",
      },
      {
        features: `int maxStackDepth;`,
        sequence: ";",
        leadingText: "int maxStackDepth",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int sampleCount;`,
        sequence: ";",
        leadingText: "int sampleCount",
      },
      {
        features: `int samplePeriod;`,
        sequence: ";",
        leadingText: "int samplePeriod",
      },
      {
        features: `List<CpuSample> samples;`,
        sequence: ";",
        leadingText: "List<CpuSample> samples",
      },
      {
        features: `int timeExtentMicros;`,
        sequence: ";",
        leadingText: "int timeExtentMicros",
      },
      {
        features: `int timeOriginMicros;`,
        sequence: ";",
        leadingText: "int timeOriginMicros",
      },
      {
        features: `int timeSpan;`,
        sequence: ";",
        leadingText: "int timeSpan",
      },
      {
        features: `static CpuSamples parse() => json == null ? null : CpuSamples._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CpuSamples parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<int> stack;`,
        sequence: ";",
        leadingText: "List<int> stack",
      },
      {
        features: `int tid;`,
        sequence: ";",
        leadingText: "int tid",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `bool truncated;`,
        sequence: ";",
        leadingText: "bool truncated",
      },
      {
        features: `String userTag;`,
        sequence: ";",
        leadingText: "String userTag",
      },
      {
        features: `String vmTag;`,
        sequence: ";",
        leadingText: "String vmTag",
      },
      {
        features: `static CpuSample parse() => json == null ? null : CpuSample._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static CpuSample parse",
      },
      {
        features: `Map<String, dynamic> toJson() {           }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String message;`,
        sequence: ";",
        leadingText: "String message",
      },
      {
        features: `static ErrorRef parse() => json == null ? null : ErrorRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ErrorRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ErrorRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `InstanceRef exception;`,
        sequence: ";",
        leadingText: "InstanceRef exception",
      },
      {
        features: `String message;`,
        sequence: ";",
        leadingText: "String message",
      },
      {
        features: `InstanceRef stacktrace;`,
        sequence: ";",
        leadingText: "InstanceRef stacktrace",
      },
      {
        features: `static Error parse() => json == null ? null : Error._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Error parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Error && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String alias;`,
        sequence: ";",
        leadingText: "String alias",
      },
      {
        features: `bool atAsyncSuspension;`,
        sequence: ";",
        leadingText: "bool atAsyncSuspension",
      },
      {
        features: `Breakpoint breakpoint;`,
        sequence: ";",
        leadingText: "Breakpoint breakpoint",
      },
      {
        features: `String bytes;`,
        sequence: ";",
        leadingText: "String bytes",
      },
      {
        features: `ByteData data;`,
        sequence: ";",
        leadingText: "ByteData data",
      },
      {
        features: `InstanceRef exception;`,
        sequence: ";",
        leadingText: "InstanceRef exception",
      },
      {
        features: `ExtensionData extensionData;`,
        sequence: ";",
        leadingText: "ExtensionData extensionData",
      },
      {
        features: `String extensionKind;`,
        sequence: ";",
        leadingText: "String extensionKind",
      },
      {
        features: `String extensionRPC;`,
        sequence: ";",
        leadingText: "String extensionRPC",
      },
      {
        features: `String flag;`,
        sequence: ";",
        leadingText: "String flag",
      },
      {
        features: `InstanceRef inspectee;`,
        sequence: ";",
        leadingText: "InstanceRef inspectee",
      },
      {
        features: `IsolateRef isolate;`,
        sequence: ";",
        leadingText: "IsolateRef isolate",
      },
      {
        features: `bool last;`,
        sequence: ";",
        leadingText: "bool last",
      },
      {
        features: `LogRecord logRecord;`,
        sequence: ";",
        leadingText: "LogRecord logRecord",
      },
      {
        features: `String method;`,
        sequence: ";",
        leadingText: "String method",
      },
      {
        features: `String newValue;`,
        sequence: ";",
        leadingText: "String newValue",
      },
      {
        features: `List<Breakpoint> pauseBreakpoints;`,
        sequence: ";",
        leadingText: "List<Breakpoint> pauseBreakpoints",
      },
      {
        features: `String service;`,
        sequence: ";",
        leadingText: "String service",
      },
      {
        features: `String status;`,
        sequence: ";",
        leadingText: "String status",
      },
      {
        features: `List<TimelineEvent> timelineEvents;`,
        sequence: ";",
        leadingText: "List<TimelineEvent> timelineEvents",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `Frame topFrame;`,
        sequence: ";",
        leadingText: "Frame topFrame",
      },
      {
        features: `List<String> updatedStreams;`,
        sequence: ";",
        leadingText: "List<String> updatedStreams",
      },
      {
        features: `VMRef vm;`,
        sequence: ";",
        leadingText: "VMRef vm",
      },
      {
        features: `static Event parse() => json == null ? null : Event._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Event parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `InstanceRef declaredType;`,
        sequence: ";",
        leadingText: "InstanceRef declaredType",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isFinal;`,
        sequence: ";",
        leadingText: "bool isFinal",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ObjRef owner;`,
        sequence: ";",
        leadingText: "ObjRef owner",
      },
      {
        features: `static FieldRef parse() => json == null ? null : FieldRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FieldRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is FieldRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `InstanceRef declaredType;`,
        sequence: ";",
        leadingText: "InstanceRef declaredType",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isFinal;`,
        sequence: ";",
        leadingText: "bool isFinal",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ObjRef owner;`,
        sequence: ";",
        leadingText: "ObjRef owner",
      },
      {
        features: `InstanceRef staticValue;`,
        sequence: ";",
        leadingText: "InstanceRef staticValue",
      },
      {
        features: `static Field parse() => json == null ? null : Field._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Field parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Field && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String comment;`,
        sequence: ";",
        leadingText: "String comment",
      },
      {
        features: `bool modified;`,
        sequence: ";",
        leadingText: "bool modified",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `static Flag parse() => json == null ? null : Flag._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Flag parse",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<Flag> flags;`,
        sequence: ";",
        leadingText: "List<Flag> flags",
      },
      {
        features: `static FlagList parse() => json == null ? null : FlagList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FlagList parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `CodeRef code;`,
        sequence: ";",
        leadingText: "CodeRef code",
      },
      {
        features: `FuncRef function;`,
        sequence: ";",
        leadingText: "FuncRef function",
      },
      {
        features: `int index;`,
        sequence: ";",
        leadingText: "int index",
      },
      {
        features: `String kind;`,
        sequence: ";",
        leadingText: "String kind",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `List<BoundVariable> vars;`,
        sequence: ";",
        leadingText: "List<BoundVariable> vars",
      },
      {
        features: `static Frame parse() => json == null ? null : Frame._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Frame parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic owner;`,
        sequence: ";",
        leadingText: "dynamic owner",
      },
      {
        features: `static FuncRef parse() => json == null ? null : FuncRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static FuncRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is FuncRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `CodeRef code;`,
        sequence: ";",
        leadingText: "CodeRef code",
      },
      {
        features: `bool isConst;`,
        sequence: ";",
        leadingText: "bool isConst",
      },
      {
        features: `bool isStatic;`,
        sequence: ";",
        leadingText: "bool isStatic",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `dynamic owner;`,
        sequence: ";",
        leadingText: "dynamic owner",
      },
      {
        features: `static Func parse() => json == null ? null : Func._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Func parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Func && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `InstanceRef allocationLocation;`,
        sequence: ";",
        leadingText: "InstanceRef allocationLocation",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `ContextRef closureContext;`,
        sequence: ";",
        leadingText: "ContextRef closureContext",
      },
      {
        features: `FuncRef closureFunction;`,
        sequence: ";",
        leadingText: "FuncRef closureFunction",
      },
      {
        features: `String debugName;`,
        sequence: ";",
        leadingText: "String debugName",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `ClassRef parameterizedClass;`,
        sequence: ";",
        leadingText: "ClassRef parameterizedClass",
      },
      {
        features: `InstanceRef pattern;`,
        sequence: ";",
        leadingText: "InstanceRef pattern",
      },
      {
        features: `int portId;`,
        sequence: ";",
        leadingText: "int portId",
      },
      {
        features: `ClassRef typeClass;`,
        sequence: ";",
        leadingText: "ClassRef typeClass",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `bool valueAsStringIsTruncated;`,
        sequence: ";",
        leadingText: "bool valueAsStringIsTruncated",
      },
      {
        features: `static InstanceRef parse() => json == null ? null : InstanceRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InstanceRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is InstanceRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `InstanceRef allocationLocation;`,
        sequence: ";",
        leadingText: "InstanceRef allocationLocation",
      },
      {
        features: `List<MapAssociation> associations;`,
        sequence: ";",
        leadingText: "List<MapAssociation> associations",
      },
      {
        features: `InstanceRef bound;`,
        sequence: ";",
        leadingText: "InstanceRef bound",
      },
      {
        features: `String bytes;`,
        sequence: ";",
        leadingText: "String bytes",
      },
      {
        features: `ContextRef closureContext;`,
        sequence: ";",
        leadingText: "ContextRef closureContext",
      },
      {
        features: `FuncRef closureFunction;`,
        sequence: ";",
        leadingText: "FuncRef closureFunction",
      },
      {
        features: `int count;`,
        sequence: ";",
        leadingText: "int count",
      },
      {
        features: `String debugName;`,
        sequence: ";",
        leadingText: "String debugName",
      },
      {
        features: `List<dynamic> elements;`,
        sequence: ";",
        leadingText: "List<dynamic> elements",
      },
      {
        features: `List<BoundField> fields;`,
        sequence: ";",
        leadingText: "List<BoundField> fields",
      },
      {
        features: `bool isCaseSensitive;`,
        sequence: ";",
        leadingText: "bool isCaseSensitive",
      },
      {
        features: `bool isMultiLine;`,
        sequence: ";",
        leadingText: "bool isMultiLine",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `InstanceRef mirrorReferent;`,
        sequence: ";",
        leadingText: "InstanceRef mirrorReferent",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int offset;`,
        sequence: ";",
        leadingText: "int offset",
      },
      {
        features: `int parameterIndex;`,
        sequence: ";",
        leadingText: "int parameterIndex",
      },
      {
        features: `ClassRef parameterizedClass;`,
        sequence: ";",
        leadingText: "ClassRef parameterizedClass",
      },
      {
        features: `InstanceRef pattern;`,
        sequence: ";",
        leadingText: "InstanceRef pattern",
      },
      {
        features: `int portId;`,
        sequence: ";",
        leadingText: "int portId",
      },
      {
        features: `InstanceRef propertyKey;`,
        sequence: ";",
        leadingText: "InstanceRef propertyKey",
      },
      {
        features: `InstanceRef propertyValue;`,
        sequence: ";",
        leadingText: "InstanceRef propertyValue",
      },
      {
        features: `InstanceRef targetType;`,
        sequence: ";",
        leadingText: "InstanceRef targetType",
      },
      {
        features: `TypeArgumentsRef typeArguments;`,
        sequence: ";",
        leadingText: "TypeArgumentsRef typeArguments",
      },
      {
        features: `ClassRef typeClass;`,
        sequence: ";",
        leadingText: "ClassRef typeClass",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `bool valueAsStringIsTruncated;`,
        sequence: ";",
        leadingText: "bool valueAsStringIsTruncated",
      },
      {
        features: `static Instance parse() => json == null ? null : Instance._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Instance parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Instance && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool isSystemIsolate;`,
        sequence: ";",
        leadingText: "bool isSystemIsolate",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `static IsolateRef parse() => json == null ? null : IsolateRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<Breakpoint> breakpoints;`,
        sequence: ";",
        leadingText: "List<Breakpoint> breakpoints",
      },
      {
        features: `Error error;`,
        sequence: ";",
        leadingText: "Error error",
      },
      {
        features: `List<String> extensionRPCs;`,
        sequence: ";",
        leadingText: "List<String> extensionRPCs",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool isSystemIsolate;`,
        sequence: ";",
        leadingText: "bool isSystemIsolate",
      },
      {
        features: `List<IsolateFlag> isolateFlags;`,
        sequence: ";",
        leadingText: "List<IsolateFlag> isolateFlags",
      },
      {
        features: `List<LibraryRef> libraries;`,
        sequence: ";",
        leadingText: "List<LibraryRef> libraries",
      },
      {
        features: `int livePorts;`,
        sequence: ";",
        leadingText: "int livePorts",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `Event pauseEvent;`,
        sequence: ";",
        leadingText: "Event pauseEvent",
      },
      {
        features: `bool pauseOnExit;`,
        sequence: ";",
        leadingText: "bool pauseOnExit",
      },
      {
        features: `LibraryRef rootLib;`,
        sequence: ";",
        leadingText: "LibraryRef rootLib",
      },
      {
        features: `bool runnable;`,
        sequence: ";",
        leadingText: "bool runnable",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `static Isolate parse() => json == null ? null : Isolate._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Isolate parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Isolate && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `static IsolateFlag parse() => json == null ? null : IsolateFlag._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateFlag parse",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool isSystemIsolateGroup;`,
        sequence: ";",
        leadingText: "bool isSystemIsolateGroup",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `static IsolateGroupRef parse() => json == null ? null : IsolateGroupRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateGroupRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateGroupRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `bool isSystemIsolateGroup;`,
        sequence: ";",
        leadingText: "bool isSystemIsolateGroup",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String number;`,
        sequence: ";",
        leadingText: "String number",
      },
      {
        features: `static IsolateGroup parse() => json == null ? null : IsolateGroup._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static IsolateGroup parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is IsolateGroup && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<InboundReference> references;`,
        sequence: ";",
        leadingText: "List<InboundReference> references",
      },
      {
        features: `static InboundReferences parse() => json == null ? null : InboundReferences._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InboundReferences parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `FieldRef parentField;`,
        sequence: ";",
        leadingText: "FieldRef parentField",
      },
      {
        features: `int parentListIndex;`,
        sequence: ";",
        leadingText: "int parentListIndex",
      },
      {
        features: `ObjRef source;`,
        sequence: ";",
        leadingText: "ObjRef source",
      },
      {
        features: `static InboundReference parse() => json == null ? null : InboundReference._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InboundReference parse",
      },
      {
        features: `Map<String, dynamic> toJson() {        }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<ObjRef> instances;`,
        sequence: ";",
        leadingText: "List<ObjRef> instances",
      },
      {
        features: `int totalCount;`,
        sequence: ";",
        leadingText: "int totalCount",
      },
      {
        features: `static InstanceSet parse() => json == null ? null : InstanceSet._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static InstanceSet parse",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `static LibraryRef parse() => json == null ? null : LibraryRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LibraryRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is LibraryRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<ClassRef> classes;`,
        sequence: ";",
        leadingText: "List<ClassRef> classes",
      },
      {
        features: `bool debuggable;`,
        sequence: ";",
        leadingText: "bool debuggable",
      },
      {
        features: `List<LibraryDependency> dependencies;`,
        sequence: ";",
        leadingText: "List<LibraryDependency> dependencies",
      },
      {
        features: `List<FuncRef> functions;`,
        sequence: ";",
        leadingText: "List<FuncRef> functions",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `List<FieldRef> variables;`,
        sequence: ";",
        leadingText: "List<FieldRef> variables",
      },
      {
        features: `static Library parse() => json == null ? null : Library._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Library parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Library && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `bool isDeferred;`,
        sequence: ";",
        leadingText: "bool isDeferred",
      },
      {
        features: `bool isImport;`,
        sequence: ";",
        leadingText: "bool isImport",
      },
      {
        features: `String prefix;`,
        sequence: ";",
        leadingText: "String prefix",
      },
      {
        features: `LibraryRef target;`,
        sequence: ";",
        leadingText: "LibraryRef target",
      },
      {
        features: `static LibraryDependency parse() => json == null ? null : LibraryDependency._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LibraryDependency parse",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `InstanceRef error;`,
        sequence: ";",
        leadingText: "InstanceRef error",
      },
      {
        features: `int level;`,
        sequence: ";",
        leadingText: "int level",
      },
      {
        features: `InstanceRef loggerName;`,
        sequence: ";",
        leadingText: "InstanceRef loggerName",
      },
      {
        features: `InstanceRef message;`,
        sequence: ";",
        leadingText: "InstanceRef message",
      },
      {
        features: `int sequenceNumber;`,
        sequence: ";",
        leadingText: "int sequenceNumber",
      },
      {
        features: `InstanceRef stackTrace;`,
        sequence: ";",
        leadingText: "InstanceRef stackTrace",
      },
      {
        features: `int time;`,
        sequence: ";",
        leadingText: "int time",
      },
      {
        features: `InstanceRef zone;`,
        sequence: ";",
        leadingText: "InstanceRef zone",
      },
      {
        features: `static LogRecord parse() => json == null ? null : LogRecord._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static LogRecord parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `dynamic key;`,
        sequence: ";",
        leadingText: "dynamic key",
      },
      {
        features: `dynamic value;`,
        sequence: ";",
        leadingText: "dynamic value",
      },
      {
        features: `static MapAssociation parse() => json == null ? null : MapAssociation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static MapAssociation parse",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int externalUsage;`,
        sequence: ";",
        leadingText: "int externalUsage",
      },
      {
        features: `int heapCapacity;`,
        sequence: ";",
        leadingText: "int heapCapacity",
      },
      {
        features: `int heapUsage;`,
        sequence: ";",
        leadingText: "int heapUsage",
      },
      {
        features: `static MemoryUsage parse() => json == null ? null : MemoryUsage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static MemoryUsage parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `FuncRef handler;`,
        sequence: ";",
        leadingText: "FuncRef handler",
      },
      {
        features: `int index;`,
        sequence: ";",
        leadingText: "int index",
      },
      {
        features: `SourceLocation location;`,
        sequence: ";",
        leadingText: "SourceLocation location",
      },
      {
        features: `String messageObjectId;`,
        sequence: ";",
        leadingText: "String messageObjectId",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `static Message parse() => json == null ? null : Message._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Message parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `static NativeFunction parse() => json == null ? null : NativeFunction._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NativeFunction parse",
      },
      {
        features: `Map<String, dynamic> toJson() {      }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NullValRef parse() => json == null ? null : NullValRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NullValRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is NullValRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static NullVal parse() => json == null ? null : NullVal._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static NullVal parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is NullVal && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `bool fixedId;`,
        sequence: ";",
        leadingText: "bool fixedId",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `static ObjRef parse() => json == null ? null : ObjRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ObjRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ObjRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `ClassRef classRef;`,
        sequence: ";",
        leadingText: "ClassRef classRef",
      },
      {
        features: `bool fixedId;`,
        sequence: ";",
        leadingText: "bool fixedId",
      },
      {
        features: `String id;`,
        sequence: ";",
        leadingText: "String id",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `static Obj parse() => json == null ? null : Obj._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Obj parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Obj && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<InstanceRef> ports;`,
        sequence: ";",
        leadingText: "List<InstanceRef> ports",
      },
      {
        features: `static PortList parse() => json == null ? null : PortList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static PortList parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int exclusiveTicks;`,
        sequence: ";",
        leadingText: "int exclusiveTicks",
      },
      {
        features: `dynamic function;`,
        sequence: ";",
        leadingText: "dynamic function",
      },
      {
        features: `int inclusiveTicks;`,
        sequence: ";",
        leadingText: "int inclusiveTicks",
      },
      {
        features: `String kind;`,
        sequence: ";",
        leadingText: "String kind",
      },
      {
        features: `String resolvedUrl;`,
        sequence: ";",
        leadingText: "String resolvedUrl",
      },
      {
        features: `static ProfileFunction parse() => json == null ? null : ProfileFunction._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProfileFunction parse",
      },
      {
        features: `Map<String, dynamic> toJson() {          }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<Protocol> protocols;`,
        sequence: ";",
        leadingText: "List<Protocol> protocols",
      },
      {
        features: `static ProtocolList parse() => json == null ? null : ProtocolList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProtocolList parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int major;`,
        sequence: ";",
        leadingText: "int major",
      },
      {
        features: `int minor;`,
        sequence: ";",
        leadingText: "int minor",
      },
      {
        features: `String protocolName;`,
        sequence: ";",
        leadingText: "String protocolName",
      },
      {
        features: `static Protocol parse() => json == null ? null : Protocol._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Protocol parse",
      },
      {
        features: `Map<String, dynamic> toJson() {        }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `ProcessMemoryItem root;`,
        sequence: ";",
        leadingText: "ProcessMemoryItem root",
      },
      {
        features: `static ProcessMemoryUsage parse() => json == null ? null : ProcessMemoryUsage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProcessMemoryUsage parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<ProcessMemoryItem> children;`,
        sequence: ";",
        leadingText: "List<ProcessMemoryItem> children",
      },
      {
        features: `String description;`,
        sequence: ";",
        leadingText: "String description",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int size;`,
        sequence: ";",
        leadingText: "int size",
      },
      {
        features: `static ProcessMemoryItem parse() => json == null ? null : ProcessMemoryItem._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ProcessMemoryItem parse",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `bool success;`,
        sequence: ";",
        leadingText: "bool success",
      },
      {
        features: `static ReloadReport parse() => json == null ? null : ReloadReport._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ReloadReport parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String parentField;`,
        sequence: ";",
        leadingText: "String parentField",
      },
      {
        features: `int parentListIndex;`,
        sequence: ";",
        leadingText: "int parentListIndex",
      },
      {
        features: `ObjRef parentMapKey;`,
        sequence: ";",
        leadingText: "ObjRef parentMapKey",
      },
      {
        features: `ObjRef value;`,
        sequence: ";",
        leadingText: "ObjRef value",
      },
      {
        features: `static RetainingObject parse() => json == null ? null : RetainingObject._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static RetainingObject parse",
      },
      {
        features: `Map<String, dynamic> toJson() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<RetainingObject> elements;`,
        sequence: ";",
        leadingText: "List<RetainingObject> elements",
      },
      {
        features: `String gcRootType;`,
        sequence: ";",
        leadingText: "String gcRootType",
      },
      {
        features: `int length;`,
        sequence: ";",
        leadingText: "int length",
      },
      {
        features: `static RetainingPath parse() => json == null ? null : RetainingPath._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static RetainingPath parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `Map<String, dynamic> json;`,
        sequence: ";",
        leadingText: "Map<String, dynamic> json",
      },
      {
        features: `String type;`,
        sequence: ";",
        leadingText: "String type",
      },
      {
        features: `static Response parse() => json == null ? null : Response._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Response parse",
      },
      {
        features: `Map<String, dynamic> toJson() {    }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String valueAsString;`,
        sequence: ";",
        leadingText: "String valueAsString",
      },
      {
        features: `static Sentinel parse() => json == null ? null : Sentinel._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Sentinel parse",
      },
      {
        features: `String toString() => '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `static ScriptRef parse() => json == null ? null : ScriptRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ScriptRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is ScriptRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int columnOffset;`,
        sequence: ";",
        leadingText: "int columnOffset",
      },
      {
        features: `LibraryRef library;`,
        sequence: ";",
        leadingText: "LibraryRef library",
      },
      {
        features: `int lineOffset;`,
        sequence: ";",
        leadingText: "int lineOffset",
      },
      {
        features: `String source;`,
        sequence: ";",
        leadingText: "String source",
      },
      {
        features: `List<List<int>> tokenPosTable;`,
        sequence: ";",
        leadingText: "List<List<int>> tokenPosTable",
      },
      {
        features: `String uri;`,
        sequence: ";",
        leadingText: "String uri",
      },
      {
        features: `final _tokenToColumn = <int, int>{}`,
        sequence: "={}",
        leadingText: "final _tokenToColumn",
      },
      {
        features: `final _tokenToLine = <int, int>{}`,
        sequence: "={}",
        leadingText: "final _tokenToLine",
      },
      {
        features: `static Script parse() => json == null ? null : Script._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Script parse",
      },
      {
        features: `int getLineNumberFromTokenPos() => _tokenToLine[tokenPos];`,
        sequence: "()=>[];",
        leadingText: "int getLineNumberFromTokenPos",
      },
      {
        features: `int getColumnNumberFromTokenPos() => _tokenToColumn[tokenPos];`,
        sequence: "()=>[];",
        leadingText: "int getColumnNumberFromTokenPos",
      },
      {
        features: `void _parseTokenPosTable() {                 }`,
        sequence: "(){}",
        leadingText: "void _parseTokenPosTable",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is Script && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `static ScriptList parse() => json == null ? null : ScriptList._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static ScriptList parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int endTokenPos;`,
        sequence: ";",
        leadingText: "int endTokenPos",
      },
      {
        features: `ScriptRef script;`,
        sequence: ";",
        leadingText: "ScriptRef script",
      },
      {
        features: `int tokenPos;`,
        sequence: ";",
        leadingText: "int tokenPos",
      },
      {
        features: `static SourceLocation parse() => json == null ? null : SourceLocation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceLocation parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<SourceReportRange> ranges;`,
        sequence: ";",
        leadingText: "List<SourceReportRange> ranges",
      },
      {
        features: `List<ScriptRef> scripts;`,
        sequence: ";",
        leadingText: "List<ScriptRef> scripts",
      },
      {
        features: `static SourceReport parse() => json == null ? null : SourceReport._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReport parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<int> hits;`,
        sequence: ";",
        leadingText: "List<int> hits",
      },
      {
        features: `List<int> misses;`,
        sequence: ";",
        leadingText: "List<int> misses",
      },
      {
        features: `static SourceReportCoverage parse() => json == null ? null : SourceReportCoverage._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReportCoverage parse",
      },
      {
        features: `Map<String, dynamic> toJson() {       }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `bool compiled;`,
        sequence: ";",
        leadingText: "bool compiled",
      },
      {
        features: `SourceReportCoverage coverage;`,
        sequence: ";",
        leadingText: "SourceReportCoverage coverage",
      },
      {
        features: `int endPos;`,
        sequence: ";",
        leadingText: "int endPos",
      },
      {
        features: `ErrorRef error;`,
        sequence: ";",
        leadingText: "ErrorRef error",
      },
      {
        features: `List<int> possibleBreakpoints;`,
        sequence: ";",
        leadingText: "List<int> possibleBreakpoints",
      },
      {
        features: `int scriptIndex;`,
        sequence: ";",
        leadingText: "int scriptIndex",
      },
      {
        features: `int startPos;`,
        sequence: ";",
        leadingText: "int startPos",
      },
      {
        features: `static SourceReportRange parse() => json == null ? null : SourceReportRange._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static SourceReportRange parse",
      },
      {
        features: `Map<String, dynamic> toJson() {             }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<Frame> asyncCausalFrames;`,
        sequence: ";",
        leadingText: "List<Frame> asyncCausalFrames",
      },
      {
        features: `List<Frame> awaiterFrames;`,
        sequence: ";",
        leadingText: "List<Frame> awaiterFrames",
      },
      {
        features: `List<Frame> frames;`,
        sequence: ";",
        leadingText: "List<Frame> frames",
      },
      {
        features: `List<Message> messages;`,
        sequence: ";",
        leadingText: "List<Message> messages",
      },
      {
        features: `bool truncated;`,
        sequence: ";",
        leadingText: "bool truncated",
      },
      {
        features: `static Stack parse() => json == null ? null : Stack._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Stack parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static Success parse() => json == null ? null : Success._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Success parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int timeExtentMicros;`,
        sequence: ";",
        leadingText: "int timeExtentMicros",
      },
      {
        features: `int timeOriginMicros;`,
        sequence: ";",
        leadingText: "int timeOriginMicros",
      },
      {
        features: `List<TimelineEvent> traceEvents;`,
        sequence: ";",
        leadingText: "List<TimelineEvent> traceEvents",
      },
      {
        features: `static Timeline parse() => json == null ? null : Timeline._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Timeline parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `Map<String, dynamic> json;`,
        sequence: ";",
        leadingText: "Map<String, dynamic> json",
      },
      {
        features: `static TimelineEvent parse() => json == null ? null : TimelineEvent._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TimelineEvent parse",
      },
      {
        features: `Map<String, dynamic> toJson() {    }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toJson",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `List<String> availableStreams;`,
        sequence: ";",
        leadingText: "List<String> availableStreams",
      },
      {
        features: `List<String> recordedStreams;`,
        sequence: ";",
        leadingText: "List<String> recordedStreams",
      },
      {
        features: `String recorderName;`,
        sequence: ";",
        leadingText: "String recorderName",
      },
      {
        features: `static TimelineFlags parse() => json == null ? null : TimelineFlags._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TimelineFlags parse",
      },
      {
        features: `String toString() => '' '' '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int timestamp;`,
        sequence: ";",
        leadingText: "int timestamp",
      },
      {
        features: `static Timestamp parse() => json == null ? null : Timestamp._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Timestamp parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `static TypeArgumentsRef parse() => json == null ? null : TypeArgumentsRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TypeArgumentsRef parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is TypeArgumentsRef && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `List<InstanceRef> types;`,
        sequence: ";",
        leadingText: "List<InstanceRef> types",
      },
      {
        features: `static TypeArguments parse() => json == null ? null : TypeArguments._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static TypeArguments parse",
      },
      {
        features: `int get hashCode => id.hashCode;`,
        sequence: "=>;",
        leadingText: "int get hashCode",
      },
      {
        features: `operator ==() => other is TypeArguments && id == other.id;`,
        sequence: "==()=>==;",
        leadingText: "operator",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int column;`,
        sequence: ";",
        leadingText: "int column",
      },
      {
        features: `int line;`,
        sequence: ";",
        leadingText: "int line",
      },
      {
        features: `ScriptRef script;`,
        sequence: ";",
        leadingText: "ScriptRef script",
      },
      {
        features: `String scriptUri;`,
        sequence: ";",
        leadingText: "String scriptUri",
      },
      {
        features: `int tokenPos;`,
        sequence: ";",
        leadingText: "int tokenPos",
      },
      {
        features: `static UnresolvedSourceLocation parse() => json == null ? null : UnresolvedSourceLocation._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static UnresolvedSourceLocation parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int major;`,
        sequence: ";",
        leadingText: "int major",
      },
      {
        features: `int minor;`,
        sequence: ";",
        leadingText: "int minor",
      },
      {
        features: `static Version parse() => json == null ? null : Version._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static Version parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `static VMRef parse() => json == null ? null : VMRef._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VMRef parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int architectureBits;`,
        sequence: ";",
        leadingText: "int architectureBits",
      },
      {
        features: `String hostCPU;`,
        sequence: ";",
        leadingText: "String hostCPU",
      },
      {
        features: `List<IsolateGroupRef> isolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> isolateGroups",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String operatingSystem;`,
        sequence: ";",
        leadingText: "String operatingSystem",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `List<IsolateGroupRef> systemIsolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> systemIsolateGroups",
      },
      {
        features: `List<IsolateRef> systemIsolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> systemIsolates",
      },
      {
        features: `String targetCPU;`,
        sequence: ";",
        leadingText: "String targetCPU",
      },
      {
        features: `String version;`,
        sequence: ";",
        leadingText: "String version",
      },
      {
        features: `static VM parse() => json == null ? null : VM._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VM parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static VM parse() => json == null ? null : VM._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VM parse",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `int architectureBits;`,
        sequence: ";",
        leadingText: "int architectureBits",
      },
      {
        features: `String hostCPU;`,
        sequence: ";",
        leadingText: "String hostCPU",
      },
      {
        features: `String operatingSystem;`,
        sequence: ";",
        leadingText: "String operatingSystem",
      },
      {
        features: `String targetCPU;`,
        sequence: ";",
        leadingText: "String targetCPU",
      },
      {
        features: `String version;`,
        sequence: ";",
        leadingText: "String version",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `List<IsolateGroupRef> isolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> isolateGroups",
      },
      {
        features: `List<IsolateRef> systemIsolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> systemIsolates",
      },
      {
        features: `List<IsolateGroupRef> systemIsolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> systemIsolateGroups",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int architectureBits;`,
        sequence: ";",
        leadingText: "int architectureBits",
      },
      {
        features: `String hostCPU;`,
        sequence: ";",
        leadingText: "String hostCPU",
      },
      {
        features: `List<IsolateGroupRef> isolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> isolateGroups",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String operatingSystem;`,
        sequence: ";",
        leadingText: "String operatingSystem",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `List<IsolateGroupRef> systemIsolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> systemIsolateGroups",
      },
      {
        features: `List<IsolateRef> systemIsolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> systemIsolates",
      },
      {
        features: `String targetCPU;`,
        sequence: ";",
        leadingText: "String targetCPU",
      },
      {
        features: `String version;`,
        sequence: ";",
        leadingText: "String version",
      },
      {
        features: `static VM parse() => json == null ? null : VM._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VM parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `int architectureBits;`,
        sequence: ";",
        leadingText: "int architectureBits",
      },
      {
        features: `String hostCPU;`,
        sequence: ";",
        leadingText: "String hostCPU",
      },
      {
        features: `List<IsolateGroupRef> isolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> isolateGroups",
      },
      {
        features: `List<IsolateRef> isolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> isolates",
      },
      {
        features: `String name;`,
        sequence: ";",
        leadingText: "String name",
      },
      {
        features: `String operatingSystem;`,
        sequence: ";",
        leadingText: "String operatingSystem",
      },
      {
        features: `int pid;`,
        sequence: ";",
        leadingText: "int pid",
      },
      {
        features: `int startTime;`,
        sequence: ";",
        leadingText: "int startTime",
      },
      {
        features: `List<IsolateGroupRef> systemIsolateGroups;`,
        sequence: ";",
        leadingText: "List<IsolateGroupRef> systemIsolateGroups",
      },
      {
        features: `List<IsolateRef> systemIsolates;`,
        sequence: ";",
        leadingText: "List<IsolateRef> systemIsolates",
      },
      {
        features: `String targetCPU;`,
        sequence: ";",
        leadingText: "String targetCPU",
      },
      {
        features: `String version;`,
        sequence: ";",
        leadingText: "String version",
      },
      {
        features: `static VM parse() => json == null ? null : VM._fromJson();`,
        sequence: "()=>==();",
        leadingText: "static VM parse",
      },
      {
        features: `String toString() => '';`,
        sequence: "()=>;",
        leadingText: "String toString",
      },
      {
        features: `static const int kServerError = -32000;`,
        sequence: "=;",
        leadingText: "static const int kServerError",
      },
      {
        features: `static const int kInvalidRequest = -32600;`,
        sequence: "=;",
        leadingText: "static const int kInvalidRequest",
      },
      {
        features: `static const int kMethodNotFound = -32601;`,
        sequence: "=;",
        leadingText: "static const int kMethodNotFound",
      },
      {
        features: `static const int kInvalidParams = -32602;`,
        sequence: "=;",
        leadingText: "static const int kInvalidParams",
      },
      {
        features: `static const int kInternalError = -32603;`,
        sequence: "=;",
        leadingText: "static const int kInternalError",
      },
      {
        features: `static RPCError parse() {  }`,
        sequence: "(){}",
        leadingText: "static RPCError parse",
      },
      {
        features: `final String callingMethod;`,
        sequence: ";",
        leadingText: "final String callingMethod",
      },
      {
        features: `final int code;`,
        sequence: ";",
        leadingText: "final int code",
      },
      {
        features: `final String message;`,
        sequence: ";",
        leadingText: "final String message",
      },
      {
        features: `final Map data;`,
        sequence: ";",
        leadingText: "final Map data",
      },
      {
        features: `String get details => data == null ? null : data[''];`,
        sequence: "=>==[];",
        leadingText: "String get details",
      },
      {
        features: `Map<String, dynamic> toMap() {         }`,
        sequence: "(){}",
        leadingText: "Map<String, dynamic> toMap",
      },
      {
        features: `String toString() {      }`,
        sequence: "(){}",
        leadingText: "String toString",
      },
      {
        features: `final Map<String, dynamic> _initialValues = kReleaseMode ? {} : { 'a':'b' };`,
        sequence: "={}{};",
        leadingText: "final Map<String, dynamic> _initialValues",
      },
      {
        features: `final Map<String, dynamic> _initialValues = kReleaseMode
         ? {}
         : { 'a':'b' };`,
        sequence: "={}{};",
        leadingText: "final Map<String, dynamic> _initialValues",
      },
    ]

    tests.forEach((tt) => {
      const got = findSequenceAndLeadingText(tt.features)

      assert.strictEqual(got.sequence, tt.sequence, `sequence from: "${tt.features}"`)
      assert.strictEqual(got.leadingText, tt.leadingText, `leadingText from: "${tt.features}"`)
    })
  })
})