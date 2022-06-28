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
import { runFullStylizer } from './class.test'

const fs = require('fs')
const path = require('path')

suite('Issue#26 Tests', function() {
  var myExtDir = (vscode.extensions.getExtension('gmlewis-vscode.flutter-stylizer') || {}).extensionPath || process.env.VSCODE_CWD
  const testfilesDir = path.join(myExtDir, 'src', 'test', 'suite', 'testfiles')

  test('Issue#26: case 1', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue26_case1.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue26_case1.want.txt'), 'utf8')

    const want = [
      EntityType.Unknown, // line #5: {
      EntityType.MainConstructor, // line #6:   SnackbarService();
      EntityType.BlankLine, // line #7:
      EntityType.PrivateInstanceVariable, // line #8:   final Map<dynamic, SnackBar Function(SnackBarConfigBase)> _snackbars = {};
      EntityType.OtherMethod, // line #9:   SnackBar Function(SnackBarConfigBase) getSnackbar(dynamic key) {
      EntityType.OtherMethod, // line #10:     return _snackbars[key]!;
      EntityType.OtherMethod, // line #11:   }
      EntityType.BlankLine, // line #12:
      EntityType.InstanceVariable, // line #13:   final GlobalKey<ScaffoldMessengerState> snackbarKey = GlobalKey<ScaffoldMessengerState>();
      EntityType.BlankLine, // line #14:
      EntityType.OtherMethod, // line #15:   bool containsKey(dynamic key) {
      EntityType.OtherMethod, // line #16:     return _snackbars.containsKey(key);
      EntityType.OtherMethod, // line #17:   }
      EntityType.BlankLine, // line #18:
      EntityType.OtherMethod, // line #19:   void registerSnackbar(
      EntityType.OtherMethod, // line #20:       {required dynamic key, required SnackBar Function(SnackBarConfigBase) snackbarBuilder}) {
      EntityType.OtherMethod, // line #21:     _snackbars[key] = snackbarBuilder;
      EntityType.OtherMethod, // line #22:   }
      EntityType.BlankLine, // line #23:
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

    runFullStylizer(opts, source, wantSource, [want])
  })

  test('Issue#26: case 2', () => {
    const groupAndSortGetterMethods = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue26_case2.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue26_case2.want.txt'), 'utf8')

    const want = [
      EntityType.Unknown, // line #1: {
      EntityType.PrivateInstanceVariable, // line #2:   final Map<dynamic, Widget Function(DialogRequest)> _dialogs = {};
      EntityType.PrivateInstanceVariable, // line #3:   late Function(DialogRequest) _dialogHandler;
      EntityType.BlankLine, // line #4:
      EntityType.PrivateInstanceVariable, // line #5:   late Completer<DialogReponse>? _dialogCompleter;
      EntityType.PrivateInstanceVariable, // line #6:   late final NavigatorService _navigatorService;
      EntityType.BlankLine, // line #7:
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

    runFullStylizer(opts, source, wantSource, [want])
  })
})
