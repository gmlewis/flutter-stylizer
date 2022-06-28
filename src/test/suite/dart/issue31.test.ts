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

import * as vscode from 'vscode'

import { EntityType } from '../../../dart/entity'
import { runFullStylizer, runParsePhase } from './class.test'

const fs = require('fs')
const path = require('path')

suite('Issue#31 Tests', function() {
  var myExtDir = (vscode.extensions.getExtension('gmlewis-vscode.flutter-stylizer') || {}).extensionPath || process.env.VSCODE_CWD
  const testfilesDir = path.join(myExtDir, 'src', 'test', 'suite', 'testfiles')

  test('Issue#31: case 1', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue31.dart.txt'), 'utf8')

    const want = [
      EntityType.Unknown, // line #1: {
      EntityType.MainConstructor, // line #2:   SnackbarService();
      EntityType.BlankLine, // line #3:
      EntityType.InstanceVariable, // line #4:   final varA1 = 'varA1';
      EntityType.InstanceVariable, // line #5:   String? varA2;
      EntityType.InstanceVariable, // line #6:   String varA3 = 'varA3';
      EntityType.InstanceVariable, // line #7:   final varB1 = 'varB1';
      EntityType.InstanceVariable, // line #8:   String? varB2;
      EntityType.InstanceVariable, // line #9:   String varB3 = 'varB3';
      EntityType.InstanceVariable, // line #10:   final varC1 = 'varC1';
      EntityType.InstanceVariable, // line #11:   String? varC2;
      EntityType.InstanceVariable, // line #12:   String varC3 = 'varC3';
      EntityType.BlankLine, // line #13:
    ]

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'private-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'private-other-methods',
      'build-method',
    ]

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: memberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    runParsePhase(opts, source, [want])
  })

  test('Issue#31: case 2', () => {
    const groupAndSortGetterMethods = true
    const groupAndSortVariableTypes = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue31.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue31.want.txt'), 'utf8')

    const want = [
      EntityType.Unknown, // line #1: {
      EntityType.MainConstructor, // line #2:   SnackbarService();
      EntityType.BlankLine, // line #3:
      EntityType.InstanceVariable, // line #4:   final varA1 = 'varA1';
      EntityType.InstanceVariable, // line #5:   String? varA2;
      EntityType.InstanceVariable, // line #6:   String varA3 = 'varA3';
      EntityType.InstanceVariable, // line #7:   final varB1 = 'varB1';
      EntityType.InstanceVariable, // line #8:   String? varB2;
      EntityType.InstanceVariable, // line #9:   String varB3 = 'varB3';
      EntityType.InstanceVariable, // line #10:   final varC1 = 'varC1';
      EntityType.InstanceVariable, // line #11:   String? varC2;
      EntityType.InstanceVariable, // line #12:   String varC3 = 'varC3';
      EntityType.BlankLine, // line #13:
    ]

    const memberOrdering = [
      'public-constructor',
      'named-constructors',
      'public-static-variables',
      'private-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-instance-variables',
      'public-override-methods',
      'public-other-methods',
      'private-other-methods',
      'build-method',
    ]

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      GroupAndSortVariableTypes: groupAndSortVariableTypes,
      MemberOrdering: memberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    runFullStylizer(opts, source, wantSource, [want])
  })
})
