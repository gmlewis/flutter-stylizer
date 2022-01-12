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

import { Editor } from '../../../dart/editor'

const fs = require('fs')
const path = require('path')

suite('Flow Analysis Tests', function() {
  var myExtDir = (vscode.extensions.getExtension('gmlewis-vscode.flutter-stylizer') || {}).extensionPath || process.env.VSCODE_CWD
  const testfilesDir = path.join(myExtDir, 'src', 'test', 'suite', 'testfiles')

  test('Flow analysis get classes', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'flow_analysis.dart.txt'), 'utf8')

    const e = new Editor(source, false)

    const [got, err] = e.getClasses(false, false)
    if (err !== null) {
      throw Error(err.message)  // Make the compiler happy.
    }

    assert.strictEqual(got.length, 22, 'classes')
  })
})
