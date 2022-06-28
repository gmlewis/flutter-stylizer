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

suite('Issue#6 Tests', function() {
  var myExtDir = (vscode.extensions.getExtension('gmlewis-vscode.flutter-stylizer') || {}).extensionPath || process.env.VSCODE_CWD
  const testfilesDir = path.join(myExtDir, 'src', 'test', 'suite', 'testfiles')

  test('Issue#6: case 1', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue6.dart.txt'), 'utf8')

    const want = [
      EntityType.Unknown, // line #1: {
      EntityType.StaticVariable, // line #2:   static const kReleaseMode = true;
      EntityType.PrivateInstanceVariable, // line #3:   final Map<String, dynamic> _initialValues = kReleaseMode
      EntityType.PrivateInstanceVariable, // line #4:       ? {}
      EntityType.PrivateInstanceVariable, // line #5:       : {
      EntityType.PrivateInstanceVariable, // line #6:           'hubType': 'test',
      EntityType.PrivateInstanceVariable, // line #7:           'ht.localIP': '192.168.1.1',
      EntityType.PrivateInstanceVariable, // line #8:           'ht.makerAppID': '2233',
      EntityType.PrivateInstanceVariable, // line #9:           'ht.accessToken': '7de3-yyyyyy-xxxxxxxxxxx',
      EntityType.PrivateInstanceVariable, // line #10:         };
      EntityType.BlankLine, // line #11:
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

  test('Issue#6: case 2', () => {
    const groupAndSortGetterMethods = true
    const groupAndSortVariableTypes = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue6.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue6_want.txt'), 'utf8')

    const want = [
      EntityType.Unknown, // line #1: {
      EntityType.StaticVariable, // line #2:   static const kReleaseMode = true;
      EntityType.PrivateInstanceVariable, // line #3:   final Map<String, dynamic> _initialValues = kReleaseMode
      EntityType.PrivateInstanceVariable, // line #4:       ? {}
      EntityType.PrivateInstanceVariable, // line #5:       : {
      EntityType.PrivateInstanceVariable, // line #6:           'hubType': 'test',
      EntityType.PrivateInstanceVariable, // line #7:           'ht.localIP': '192.168.1.1',
      EntityType.PrivateInstanceVariable, // line #8:           'ht.makerAppID': '2233',
      EntityType.PrivateInstanceVariable, // line #9:           'ht.accessToken': '7de3-yyyyyy-xxxxxxxxxxx',
      EntityType.PrivateInstanceVariable, // line #10:         };
      EntityType.BlankLine, // line #11:
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
