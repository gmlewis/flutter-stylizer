/*
Copyright © 2021 Glenn M. Lewis

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or impliee.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Class } from './class'
import { Cursor } from './cursor'
import { Line } from './line'
import { MatchingPairsMap } from './pairs'


// Editor represents a text editor that understands Dart syntax.
export class Editor {
  constructor(buf: string, processEnumsLikeClasses: boolean, verbose: boolean) {
    this.fullBuf = buf
    this.verbose = verbose
    this.classMatcher = processEnumsLikeClasses ? Class.matchClassOrMixinOrEnumRE : Class.matchClassOrMixinRE

    const lines = this.fullBuf.split('\n')
    let lineStartOffset = 0
    lines.forEach((line, i) => {
      this.lines.push(new Line(line, lineStartOffset, i))
      lineStartOffset += line.length + 1
    })

    const cursor = new Cursor(this)
    const err = cursor.parse(this.matchingPairs)
    if (err) {
      throw new Error(`parse: ${err}`)
    }

    this.eofOffset = cursor.absOffset
    this.classLineIndices = cursor.classLineIndices
  }

  fullBuf: string
  lines: Line[] = []
  eofOffset: number

  matchingPairs: MatchingPairsMap = {}
  // classLineIndices contains line indices where a class or abstract class starts.
  classLineIndices: number[] = []

  classMatcher: RegExp

  verbose: boolean

  getClasses(groupAndSortGetterMethods: boolean, separatePrivateMethods: boolean): [Class[], Error | null] {
    const classes: Class[] = []

    for (let i = 0; i < this.classLineIndices.length; i++) {
      const lineIndex = this.classLineIndices[i]
      const line = this.lines[lineIndex]
      const mm = this.classMatcher.exec(line.line)
      if (!mm || mm.length !== 3) {
        return [[], Error(`programming error: expected class on line #${lineIndex + 1}, got '${line.line}'`)]
      }

      const classType = mm[1]
      const className = mm[2]
      const classOffset = line.startOffset
      const openCurlyOffset = this.findStartOfClass(classOffset)
      if (this.fullBuf[openCurlyOffset] === ';') { // this is valid and can be ignored: class D = Object with Function;
        continue
      }

      this.logf(`\n\nFound new ${classType} '${className}' at classOffset=${classOffset}, openCurlyOffset=${openCurlyOffset}, line=${line.line}`)
      const pair = this.matchingPairs[openCurlyOffset]
      if (!pair) {
        return [[], Error(`programming error: no matching pair found at openCurlyOffset ${openCurlyOffset}`)]
      }

      const closeCurlyOffset = pair.closeAbsOffset
      this.logf(`\n\nFound end of ${classType} '${className}' at closeCurlyOffset=${closeCurlyOffset}`)

      const dartClass = new Class(this, classType, className, openCurlyOffset, closeCurlyOffset, groupAndSortGetterMethods, separatePrivateMethods)
      const err = dartClass.findFeatures()
      if (err !== null) {
        return [[], err]
      }

      classes.push(dartClass)
    }

    return [classes, null]
  }

  // findStartOfClass returns the absolute offset of the next top-level '{' or ';'
  // starting at offset startOffset.
  //
  // Note that this class definition is valid: "class D = Object with Function;"
  findStartOfClass(startOffset: number) {
    while (startOffset < this.eofOffset) {
      if (this.fullBuf[startOffset] === '{' || this.fullBuf[startOffset] === ';') {
        return startOffset
      }
      const pair = this.matchingPairs[startOffset]
      if (pair) {
        startOffset = pair.closeAbsOffset + 1
        continue
      }
      startOffset++
    }

    throw new Error(`programming error: findStartOfClass(${startOffset}) should not reach here`)
  }

  // findLineIndexAtOffset finds the line index and relative offset for the
  // absolute offset within the text buffer. Note that the returned
  // relStrippedOffset may be greater than the length of the stripped string
  // or even negative, before the stripped string.
  findLineIndexAtOffset(absOffset: number) {
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i]
      if (absOffset <= line.endOffset) {
        const relStrippedOffset = absOffset - line.startOffset - line.strippedOffset
        return [i, relStrippedOffset]
      }
    }
    return [this.lines.length, 0]
  }

  // findClassAbsoluteStart finds the very first absolute offset either at the
  // beginning of the buffer or after the last blank line before a class is defined.
  findClassAbsoluteStart(dc: Class) {
    let result = dc.openCurlyOffset
    for (; result > 0; result--) {
      if (result > 1 && this.fullBuf.substring(result - 2, result) === "\n\n") { break }
      if (result > 3 && this.fullBuf.substring(result - 4, result) === "\r\n\r\n") { break }
    }
    return result
  }

  // logf logs the line if verbose is true.
  logf(s: string) {
    if (this.verbose) {
      console.log(s)
    }
  }
}