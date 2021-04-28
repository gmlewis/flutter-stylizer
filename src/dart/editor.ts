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

import { Cursor } from './cursor'
import { Line } from './line'
import { MatchingPairsMap } from './pairs'

// Editor represents a text editor that understands Dart syntax.
export class Editor {
  constructor(buf: string, verbose: boolean) {
    this.fullBuf = buf
    this.verbose = verbose

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
  eofOffset

  matchingPairs: MatchingPairsMap = {}
  // classLineIndices contains line indices where a class or abstract class starts.
  classLineIndices: number[] = []

  verbose: boolean

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

  // logf logs the line if verbose is true.
  logf(s: string) {
    if (this.verbose) {
      console.log(s)
    }
  }
}