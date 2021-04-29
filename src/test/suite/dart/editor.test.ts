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
import { Editor } from '../../../dart/editor'
import { EntityType } from '../../../dart/entity'
import { Line } from '../../../dart/line'

// import * as vscode from 'vscode'
// import * as stylizer from '../../extension'
const fs = require('fs')
const path = require('path')

export function setupEditor(searchFor: string, buf: string): [Editor, number, number, number] {
  const classOffset = buf.indexOf(searchFor)
  const openCurlyOffset = classOffset + searchFor.length - 1
  const closeCurlyOffset = buf[buf.length - 2] === '\r' ? buf.length - 3 : buf.length - 2

  assert.strictEqual(
    buf.substring(classOffset, openCurlyOffset + 1),
    searchFor,
    `open offset error: buf[${classOffset}:${openCurlyOffset + 1}]`,
  )
  assert.strictEqual(
    buf.substring(closeCurlyOffset, closeCurlyOffset + 1),
    '}',
    `close offset error: buf[${closeCurlyOffset}:${closeCurlyOffset + 1}]`,
  )

  const p = buf.substring(0, openCurlyOffset + 1).split('\n')
  const lineOffset = p.length - 1
  assert.strictEqual(
    p[lineOffset],
    searchFor,
  )

  const editor = new Editor(buf, false)

  return [editor, lineOffset, openCurlyOffset, closeCurlyOffset]
}

// Defines a Mocha test suite to group tests of similar kind together
suite('DartEditor Parsing Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')
  const basicClasses = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.txt'), 'utf8')
  const bcWindoze = fs.readFileSync(path.join(testfilesDir, 'basic_classes.dart.windz.txt'), 'utf8')
  const utf8Text = fs.readFileSync(path.join(testfilesDir, 'utf8_text.dart.txt'), 'utf8')

  test('FindLineIndexAtOffset', () => {
    const [bc, /* _unused1 */, bcOCO, /* _unused2 */] = setupEditor('class Class1 {', basicClasses)
    const [wz, /* _unused3 */, wzOCO, /* _unused4 */] = setupEditor('class Class1 {', bcWindoze)

    const tests: {
      name: string,
      editor: Editor,
      openOffset: number,
      wantLineIndex: number,
      wantRelOffset: number,
    }[] = [
        // *nix file
        {
          name: 'top-level',
          editor: bc,
          openOffset: bcOCO,
          wantLineIndex: 6,
          wantRelOffset: 13,
        },
        {
          name: 'build()',
          editor: bc,
          openOffset: basicClasses.indexOf('build()') + 5,
          wantLineIndex: 10,
          wantRelOffset: 5,
        },
        {
          name: 'build() {}',
          editor: bc,
          openOffset: basicClasses.indexOf('build() {}') + 8,
          wantLineIndex: 10,
          wantRelOffset: 8,
        },
        {
          name: 'Class1();',
          editor: bc,
          openOffset: basicClasses.indexOf('Class1();') + 6,
          wantLineIndex: 29,
          wantRelOffset: 6,
        },
        {
          name: 'Class1.fromNum();',
          editor: bc,
          openOffset: basicClasses.indexOf('Class1.fromNum();') + 14,
          wantLineIndex: 30,
          wantRelOffset: 14,
        },
        {
          name: 'var myfunc = (int n) => n;',
          editor: bc,
          openOffset: basicClasses.indexOf('var myfunc = (int n) => n;') + 13,
          wantLineIndex: 31,
          wantRelOffset: 13,
        },
        {
          name: 'toString()',
          editor: bc,
          openOffset: basicClasses.indexOf('toString()') + 8,
          wantLineIndex: 34,
          wantRelOffset: 8,
        },
        {
          name: 'toString() {',
          editor: bc,
          openOffset: basicClasses.indexOf('toString() {') + 11,
          wantLineIndex: 34,
          wantRelOffset: 11,
        },
        {
          name: 'print(\'$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}\');',
          editor: bc,
          openOffset: basicClasses.indexOf('print(\'$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}\');') + 5,
          wantLineIndex: 35,
          wantRelOffset: 5,
        },
        {
          name: '${sqrt(2)}',
          editor: bc,
          openOffset: basicClasses.indexOf('${sqrt(2)}') + 1,
          wantLineIndex: 35,
          wantRelOffset: 40,
        },
        {
          name: 'sqrt(2)',
          editor: bc,
          openOffset: basicClasses.indexOf('sqrt(2)') + 4,
          wantLineIndex: 35,
          wantRelOffset: 45,
        },

        // Windoze file
        {
          name: 'windoze top-level',
          editor: wz,
          openOffset: wzOCO,
          wantLineIndex: 6,
          wantRelOffset: 13,
        },
        {
          name: 'windoze build()',
          editor: wz,
          openOffset: bcWindoze.indexOf('build()') + 5,
          wantLineIndex: 10,
          wantRelOffset: 5,
        },
        {
          name: 'windoze build() {}',
          editor: wz,
          openOffset: bcWindoze.indexOf('build() {}') + 8,
          wantLineIndex: 10,
          wantRelOffset: 8,
        },
        {
          name: 'windoze Class1();',
          editor: wz,
          openOffset: bcWindoze.indexOf('Class1();') + 6,
          wantLineIndex: 29,
          wantRelOffset: 6,
        },
        {
          name: 'windoze Class1.fromNum();',
          editor: wz,
          openOffset: bcWindoze.indexOf('Class1.fromNum();') + 14,
          wantLineIndex: 30,
          wantRelOffset: 14,
        },
        {
          name: 'windoze var myfunc = (int n) => n;',
          editor: wz,
          openOffset: bcWindoze.indexOf('var myfunc = (int n) => n;') + 13,
          wantLineIndex: 31,
          wantRelOffset: 13,
        },
        {
          name: 'windoze toString()',
          editor: wz,
          openOffset: bcWindoze.indexOf('toString()') + 8,
          wantLineIndex: 34,
          wantRelOffset: 8,
        },
        {
          name: 'windoze toString() {',
          editor: wz,
          openOffset: bcWindoze.indexOf('toString() {') + 11,
          wantLineIndex: 34,
          wantRelOffset: 11,
        },
        {
          name: 'windoze print(\'$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}\');',
          editor: wz,
          openOffset: bcWindoze.indexOf('print(\'$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}\');') + 5,
          wantLineIndex: 35,
          wantRelOffset: 5,
        },
        {
          name: 'windoze ${sqrt(2)}',
          editor: wz,
          openOffset: bcWindoze.indexOf('${sqrt(2)}') + 1,
          wantLineIndex: 35,
          wantRelOffset: 40,
        },
        {
          name: 'windoze sqrt(2)',
          editor: wz,
          openOffset: bcWindoze.indexOf('sqrt(2)') + 4,
          wantLineIndex: 35,
          wantRelOffset: 45,
        },
      ]

    for (let tt of tests) {
      const [gotLineIndex, gotRelOffset] = tt.editor.findLineIndexAtOffset(tt.openOffset)
      assert.strictEqual(gotLineIndex, tt.wantLineIndex, `name='${tt.name}': lineIndex: findLineIndexAtOffset(${tt.openOffset})`)
      assert.strictEqual(gotRelOffset, tt.wantRelOffset, `name='${tt.name}': relOffset: findLineIndexAtOffset(${tt.openOffset})`)
    }
  })

  test('New Editor with utf8', () => {
    const tests: {
      name: string,
      buf: string,
      want: Line[],
    }[] = [
        {
          name: 'utf8 string',
          buf: utf8Text,
          want: [
            {
              line: 'abstract class ElementImpl implements Element {',
              stripped: 'abstract class ElementImpl implements Element {',
              strippedOffset: 0,
              originalIndex: 0,
              startOffset: 0,
              endOffset: 47,
              entityType: 0,
              classLevelText: '',
              classLevelTextOffsets: [],
              isCommentOrString: false,
            },
            {
              line: '  /// An Unicode right arrow.',
              stripped: '',
              strippedOffset: 2,
              classLevelText: '',
              classLevelTextOffsets: [],
              originalIndex: 1,
              startOffset: 48,
              endOffset: 77,
              entityType: EntityType.SingleLineComment,
              isCommentOrString: false,
            },
            {
              line: '  @deprecated',
              stripped: '@deprecated',
              strippedOffset: 2,
              classLevelText: '@deprecated',
              classLevelTextOffsets: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
              originalIndex: 2,
              startOffset: 78,
              endOffset: 91,
              entityType: 0,
              isCommentOrString: false,
            },
            {
              line: `  static final String RIGHT_ARROW = " \\u2192 ";`,
              stripped: `static final String RIGHT_ARROW = " \\u2192 ";`,
              strippedOffset: 2,
              classLevelText: `static final String RIGHT_ARROW = "";`,
              classLevelTextOffsets: [94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 137, 138],
              originalIndex: 3,
              startOffset: 92,
              endOffset: 139,
              entityType: 0,
              isCommentOrString: false,
            },
            {
              line: '}',
              stripped: '}',
              strippedOffset: 0,
              classLevelTextOffsets: [],
              originalIndex: 4,
              startOffset: 140,
              endOffset: 141,
              entityType: 0,
              classLevelText: '',
              isCommentOrString: false,
            },
          ],
        },
      ]

    for (let tt of tests) {
      const editor = new Editor(tt.buf, false)
      assert.strictEqual(editor.lines.length, tt.want.length)
      editor.lines.forEach((line, i) => {
        assert.strictEqual(line.line, tt.want[i].line, `name=${tt.name}, i=${i}, field='line'`)
        assert.strictEqual(line.stripped, tt.want[i].stripped, `name=${tt.name}, i=${i}, field='stripped'`)
        assert.strictEqual(line.strippedOffset, tt.want[i].strippedOffset, `name=${tt.name}, i=${i}, field='strippedOffset'`)
        assert.strictEqual(line.originalIndex, tt.want[i].originalIndex, `name=${tt.name}, i=${i}, field='originalIndex'`)
        assert.strictEqual(line.startOffset, tt.want[i].startOffset, `name=${tt.name}, i=${i}, field='startOffset'`)
        assert.strictEqual(line.endOffset, tt.want[i].endOffset, `name=${tt.name}, i=${i}, field='endOffset'`)
        assert.strictEqual(line.entityType, tt.want[i].entityType, `name=${tt.name}, i=${i}, field='entityType'`)
        assert.strictEqual(line.classLevelText, tt.want[i].classLevelText, `name=${tt.name}, i=${i}, field='classLevelText'`)
        assert.strictEqual(line.classLevelTextOffsets.length, tt.want[i].classLevelTextOffsets.length, `name=${tt.name}, i=${i}, field='classLevelTextOffsets.length'`)
        const want = tt.want[i].classLevelTextOffsets
        line.classLevelTextOffsets.forEach((offset, j) => {
          assert.strictEqual(offset, want[j], `name=${tt.name}, i=${i}, field='classLevelTextOffsets[${j}]'`)
        })
        assert.strictEqual(line.isCommentOrString, tt.want[i].isCommentOrString, `name=${tt.name}, i=${i}, field='isCommentOrString'`)
        // assert.deepStrictEqual<Line>(line, tt.want[i])  // Doesn't give useful information in output.  :-(
        // t.Errorf('line[%v] =\n%#v\nwant\n%#v', i, e.lines[i], tt.want[i])
      })
    }
  })
})
