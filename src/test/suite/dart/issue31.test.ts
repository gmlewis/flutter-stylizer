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
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue31.dart.txt'), 'utf8')

    const want = [
      [
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
      ],
      [
        EntityType.Unknown,                 // line #15: {
        EntityType.MainConstructor,         // line #16:   User({
        EntityType.MainConstructor,         // line #17:     required this.firstNameFinal,
        EntityType.MainConstructor,         // line #18:     required this.idFinal,
        EntityType.MainConstructor,         // line #19:     required this.lastNameFinal,
        EntityType.MainConstructor,         // line #20:     required this.middleNameFinal,
        EntityType.MainConstructor,         // line #21:     required this.phoneNumberFinal,
        EntityType.MainConstructor,         // line #22:     required this.usernameFinal,
        EntityType.MainConstructor,         // line #23:     required this.firstNameRegular,
        EntityType.MainConstructor,         // line #24:     required this.idRegular,
        EntityType.MainConstructor,         // line #25:     required this.lastNameRegular,
        EntityType.MainConstructor,         // line #26:     required this.usernameRegular,
        EntityType.MainConstructor,         // line #27:   });
        EntityType.BlankLine,               // line #28:
        EntityType.InstanceVariable,        // line #29:   final String firstNameFinal;
        EntityType.InstanceVariable,        // line #30:   final int idFinal;
        EntityType.InstanceVariable,        // line #31:   final String lastNameFinal;
        EntityType.InstanceVariable,        // line #32:   final String? middleNameFinal;
        EntityType.InstanceVariable,        // line #33:   final String? phoneNumberFinal;
        EntityType.InstanceVariable,        // line #34:   final String usernameFinal;
        EntityType.BlankLine,               // line #35:
        EntityType.InstanceVariable,        // line #36:   String firstNameRegular;
        EntityType.InstanceVariable,        // line #37:   int idRegular;
        EntityType.InstanceVariable,        // line #38:   String lastNameRegular;
        EntityType.InstanceVariable,        // line #39:   String usernameRegular;
        EntityType.BlankLine,               // line #40:
        EntityType.InstanceVariable,        // line #41:   int? ageOptional;
        EntityType.InstanceVariable,        // line #42:   String? birthdateOptional;
        EntityType.InstanceVariable,        // line #43:   String? emailOptional;
        EntityType.InstanceVariable,        // line #44:   String? middleNameRegular;
        EntityType.InstanceVariable,        // line #45:   String? phoneNumberRegular;
        EntityType.BlankLine,               // line #46:
        EntityType.PrivateInstanceVariable, // line #47:   int? _agePrivate;
        EntityType.PrivateInstanceVariable, // line #48:   String? _birthdatePrivate;
        EntityType.PrivateInstanceVariable, // line #49:   String? _emailPrivate;
        EntityType.PrivateInstanceVariable, // line #50:   final String _firstNamePrivate = 'Secret';
        EntityType.PrivateInstanceVariable, // line #51:   final int _idPrivate = 0;
        EntityType.PrivateInstanceVariable, // line #52:   final String _lastNamePrivate = 'Secret';
        EntityType.PrivateInstanceVariable, // line #53:   String? _middleNamePrivate;
        EntityType.PrivateInstanceVariable, // line #54:   final String _phoneNumberPrivate = 'Secret';
        EntityType.PrivateInstanceVariable, // line #55:   final String _usernamePrivate = 'Secret';
        EntityType.BlankLine,               // line #56:
      ]
    ]

    const memberOrdering = [
      "public-constructor",
      "named-constructors",
      "public-static-variables",
      "private-static-variables",
      "public-instance-variables",
      "public-override-variables",
      "private-instance-variables",
      "public-override-methods",
      "public-other-methods",
      "private-other-methods",
      "build-method",
    ]

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: memberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    runParsePhase(opts, source, want)
  })

  test('Issue#31: case 2', () => {
    const groupAndSortVariableTypes = true
    const sortOtherMethods = true

    const source = fs.readFileSync(path.join(testfilesDir, 'issue31.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue31.want.txt'), 'utf8')

    const want = [
      [
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
      ],
      [
        EntityType.Unknown,                 // line #15: {
        EntityType.MainConstructor,         // line #16:   User({
        EntityType.MainConstructor,         // line #17:     required this.firstNameFinal,
        EntityType.MainConstructor,         // line #18:     required this.idFinal,
        EntityType.MainConstructor,         // line #19:     required this.lastNameFinal,
        EntityType.MainConstructor,         // line #20:     required this.middleNameFinal,
        EntityType.MainConstructor,         // line #21:     required this.phoneNumberFinal,
        EntityType.MainConstructor,         // line #22:     required this.usernameFinal,
        EntityType.MainConstructor,         // line #23:     required this.firstNameRegular,
        EntityType.MainConstructor,         // line #24:     required this.idRegular,
        EntityType.MainConstructor,         // line #25:     required this.lastNameRegular,
        EntityType.MainConstructor,         // line #26:     required this.usernameRegular,
        EntityType.MainConstructor,         // line #27:   });
        EntityType.BlankLine,               // line #28:
        EntityType.InstanceVariable,        // line #29:   final String firstNameFinal;
        EntityType.InstanceVariable,        // line #30:   final int idFinal;
        EntityType.InstanceVariable,        // line #31:   final String lastNameFinal;
        EntityType.InstanceVariable,        // line #32:   final String? middleNameFinal;
        EntityType.InstanceVariable,        // line #33:   final String? phoneNumberFinal;
        EntityType.InstanceVariable,        // line #34:   final String usernameFinal;
        EntityType.BlankLine,               // line #35:
        EntityType.InstanceVariable,        // line #36:   String firstNameRegular;
        EntityType.InstanceVariable,        // line #37:   int idRegular;
        EntityType.InstanceVariable,        // line #38:   String lastNameRegular;
        EntityType.InstanceVariable,        // line #39:   String usernameRegular;
        EntityType.BlankLine,               // line #40:
        EntityType.InstanceVariable,        // line #41:   int? ageOptional;
        EntityType.InstanceVariable,        // line #42:   String? birthdateOptional;
        EntityType.InstanceVariable,        // line #43:   String? emailOptional;
        EntityType.InstanceVariable,        // line #44:   String? middleNameRegular;
        EntityType.InstanceVariable,        // line #45:   String? phoneNumberRegular;
        EntityType.BlankLine,               // line #46:
        EntityType.PrivateInstanceVariable, // line #47:   int? _agePrivate;
        EntityType.PrivateInstanceVariable, // line #48:   String? _birthdatePrivate;
        EntityType.PrivateInstanceVariable, // line #49:   String? _emailPrivate;
        EntityType.PrivateInstanceVariable, // line #50:   final String _firstNamePrivate = 'Secret';
        EntityType.PrivateInstanceVariable, // line #51:   final int _idPrivate = 0;
        EntityType.PrivateInstanceVariable, // line #52:   final String _lastNamePrivate = 'Secret';
        EntityType.PrivateInstanceVariable, // line #53:   String? _middleNamePrivate;
        EntityType.PrivateInstanceVariable, // line #54:   final String _phoneNumberPrivate = 'Secret';
        EntityType.PrivateInstanceVariable, // line #55:   final String _usernamePrivate = 'Secret';
        EntityType.BlankLine,               // line #56:
      ]
    ]

    const memberOrdering = [
      "public-constructor",
      "named-constructors",
      "public-static-variables",
      "public-instance-variables",
      "public-override-variables",
      "private-static-variables",
      "private-instance-variables",
      "public-other-methods",
      "public-override-methods",
      "private-other-methods",
      "build-method",
    ]

    const opts = {
      GroupAndSortVariableTypes: groupAndSortVariableTypes,
      MemberOrdering: memberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    runFullStylizer(opts, source, wantSource, want)
  })
})
