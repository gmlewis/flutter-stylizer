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

const fs = require('fs')
const path = require('path')

import { EntityType } from '../../../dart/entity'
import { runFullStylizer } from './class.test'

suite('Block Kind Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')

  test('Block kind example', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'block_kind.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'block_kind_want.txt'), 'utf8')

    const want = [
      EntityType.Unknown,          // line #5: {
      EntityType.InstanceVariable, // line #6:   final String name;
      EntityType.BlankLine,        // line #7:
      EntityType.InstanceVariable, // line #8:   final bool useNameForMissingBlock;
      EntityType.BlankLine,        // line #9:
      EntityType.NamedConstructor, // line #10:   const BlockKind._(this.name, this.useNameForMissingBlock);
      EntityType.BlankLine,        // line #11:
      EntityType.OtherMethod,      // line #12:   /// Returns the name to use for this block if it is missing in
      EntityType.OtherMethod,      // line #13:   /// [templateExpectedClassOrMixinBody].
      EntityType.OtherMethod,      // line #14:   ///
      EntityType.OtherMethod,      // line #15:   /// If `null` the generic [templateExpectedButGot] is used instead.
      EntityType.OtherMethod,      // line #16:   String get missingBlockName => useNameForMissingBlock ? name : null;
      EntityType.BlankLine,        // line #17:
      EntityType.OtherMethod,      // line #18:   String toString() => 'BlockKind($name)';
      EntityType.BlankLine,        // line #19:
      EntityType.StaticVariable,   // line #20:   static const BlockKind catchClause =
      EntityType.StaticVariable,   // line #21:       const BlockKind._('catch clause', /* useNameForMissingBlock = */ true);
      EntityType.StaticVariable,   // line #22:   static const BlockKind classDeclaration = const BlockKind._(
      EntityType.StaticVariable,   // line #23:       'class declaration', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #24:   static const BlockKind enumDeclaration = const BlockKind._(
      EntityType.StaticVariable,   // line #25:       'enum declaration', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #26:   static const BlockKind extensionDeclaration = const BlockKind._(
      EntityType.StaticVariable,   // line #27:       'extension declaration', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #28:   static const BlockKind finallyClause =
      EntityType.StaticVariable,   // line #29:       const BlockKind._('finally clause', /* useNameForMissingBlock = */ true);
      EntityType.StaticVariable,   // line #30:   static const BlockKind functionBody =
      EntityType.StaticVariable,   // line #31:       const BlockKind._('function body', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #32:   static const BlockKind invalid =
      EntityType.StaticVariable,   // line #33:       const BlockKind._('invalid', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #34:   static const BlockKind mixinDeclaration = const BlockKind._(
      EntityType.StaticVariable,   // line #35:       'mixin declaration', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #36:   static const BlockKind statement =
      EntityType.StaticVariable,   // line #37:       const BlockKind._('statement', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #38:   static const BlockKind switchStatement = const BlockKind._(
      EntityType.StaticVariable,   // line #39:       'switch statement', /* useNameForMissingBlock = */ false);
      EntityType.StaticVariable,   // line #40:   static const BlockKind tryStatement =
      EntityType.StaticVariable,   // line #41:       const BlockKind._('try statement', /* useNameForMissingBlock = */ true);
      EntityType.BlankLine,        // line #42:
    ]

    runFullStylizer(null, source, wantSource, want)
  })

  test('Block kind example stays the same', () => {
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'block_kind_want.txt'), 'utf8')

    runFullStylizer(null, wantSource, wantSource, null)
  })
})
