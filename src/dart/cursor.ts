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

import { Class } from './class'
import { Editor } from './editor'
import { EntityType } from './entity'
import { MatchingPair, MatchingPairsMap } from './pairs'

// BraceLevel represents the current brace level the cursor is within.
enum BraceLevel {
  BraceUnknown,

  BraceNormal,       // Most recent unmatched '{' was not string literal related.
  BraceSingle,       // Most recent unmatched '{' was `'...${`.
  BraceDouble,       // Most recent unmatched '{' was `"...${`.
  BraceTripleSingle, // Most recent unmatched '{' was `'''...${`.
  BraceTripleDouble, // Most recent unmatched '{' was `"""...${`.
}

// NextRune is the return value of getRune.
interface NextRune {
  r: string,
  size: number,
  err: Error | null,
}

// NextFeature is the return value of advanceToNextFeature.
interface NextFeature {
  nf: string,
  err: Error | null,
}

// Cursor represents an editor cursor and is used to advance through
// the Dart source code.
export class Cursor {
  constructor(editor: Editor) {
    this.editor = editor
    this.reader = Array.from(editor.lines[0].stripped)
  }

  editor: Editor

  absOffset = 0
  lineIndex = 0

  relStrippedOffset = 0

  reader: string[]

  braceLevels: BraceLevel[] = []
  parenLevels = 0
  inSingleQuote = false
  inDoubleQuote = false
  inTripleSingle = false
  inTripleDouble = false
  inMultiLineComment = 0 // multiline comments can nest
  stringIsRaw = false

  // UnreadRune can not be called twice in succession, so we need to keep track
  // of our lookahead stack ourselves.
  runeBuf: string[] = []

  // classLineIndices keeps track of line indices where a class or abstract class starts.
  classLineIndices: number[] = []

  toString() {
    let line = ''
    let stripped = ''
    if (this.lineIndex < this.editor.lines.length) {
      line = this.editor.lines[this.lineIndex].line
      stripped = this.editor.lines[this.lineIndex].stripped
    }
    return `{absOffset=${this.absOffset}, lineIndex=${this.lineIndex}, relStrippedOffset=${this.relStrippedOffset}, stripped=${stripped}(${stripped.length}), line=${line}(${line.length}), raw=${this.stringIsRaw}, '=${this.inSingleQuote}, "=${this.inDoubleQuote}, '''=${this.inTripleSingle}, """=${this.inTripleDouble}, /*=${this.inMultiLineComment}, (=${this.parenLevels}, braceLevels=${this.braceLevels}}`
  }

  // newMatchingPair adds the start of a new matching pair onto the stack.
  newMatchingPair(open: string, matchingPairs: MatchingPairsMap, matchingPairStack: MatchingPair[]) {
    const absOffset = this.absOffset - open.length
    const pair: MatchingPair = {
      open: open,
      openAbsOffset: absOffset,
      openLineIndex: this.lineIndex,
      openRelStrippedOffset: this.relStrippedOffset,
      pairStackDepth: matchingPairStack.length,

      close: '',
      closeAbsOffset: 0,
      closeLineIndex: 0,
      closeRelStrippedOffset: 0,
      parentPairOpenAbsOffset: 0,
    }

    const got = this.editor.fullBuf.substring(pair.openAbsOffset, pair.openAbsOffset + open.length)
    if (got !== open) {
      throw new Error(`programming error: openAbsOffset = '${got}', want '${open}`)
    }

    const i = matchingPairStack.length
    if (i > 0) {
      pair.parentPairOpenAbsOffset = matchingPairStack[i - 1].openAbsOffset
    }

    matchingPairs[absOffset] = pair

    matchingPairStack.push(pair)
  }

  // closeMatchingPair closes the last open matching pair on the stack.
  closeMatchingPair(close: string, matchingPairStack: MatchingPair[]) {
    const pair = matchingPairStack[matchingPairStack.length - 1]

    pair.close = close
    pair.closeAbsOffset = this.absOffset - close.length
    pair.closeLineIndex = this.lineIndex
    pair.closeRelStrippedOffset = this.relStrippedOffset

    const got = this.editor.fullBuf.substring(pair.closeAbsOffset, pair.closeAbsOffset + close.length)
    if (got !== close) {
      throw new Error(`programming error: closeAbsOffset = '${got}', want '${close}'`)
    }

    matchingPairStack.splice(matchingPairStack.length - 1, 1)
  }

  // parse parses the Dart source, identifies line entity types in the source,
  // keeps track of matching pairs, and returns a list of class line indices.
  parse(matchingPairs: MatchingPairsMap): Error | null {
    let lastFeature = ''
    let nf = '' // nextFeature
    const matchingPairStack: MatchingPair[] = []

    while (true) {
      lastFeature = nf
      const nextFeature = this.advanceToNextFeature()
      if (nextFeature.err) {
        if (nextFeature.err.message !== 'EOF') {
          return Error(`advanceToNextFeature: ${nextFeature.err.message}`)
        }
        this.editor.logf(`parse: Success! Done parsing.`)
        return null
      }
      nf = nextFeature.nf

      this.editor.logf(`nf='${nf}' matchingPairStack=${matchingPairStack.length}, abs=${this.absOffset}, ind=${this.lineIndex}, rel=${this.relStrippedOffset}`)

      switch (nf) {
        case '//':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0) {
            continue
          }
          this.relStrippedOffset -= 2
          this.absOffset -= 2
          const beforeLen = this.relStrippedOffset
          this.editor.lines[this.lineIndex].stripped = this.editor.lines[this.lineIndex].stripped.substring(0, this.relStrippedOffset).trim()
          const afterLen = this.editor.lines[this.lineIndex].stripped.length
          this.absOffset -= beforeLen - afterLen
          // Reset the reader because we chopped off the stripped line and have no more to parse on this line.
          this.reader = []
          if (afterLen === 0) {
            this.editor.logf(`parse: marking line #${this.lineIndex + 1} as type SingleLineComment`)
            this.editor.lines[this.lineIndex].entityType = EntityType.SingleLineComment
          }
          // this.editor.logf("STRIPPED MODIFIED! singleLineComment=true: stripped='${}'(${}), beforeLen=${}, afterLen=${}, cursor=${}", this.editor.lines[this.lineIndex].stripped, len(this.editor.lines[this.lineIndex].stripped), beforeLen, afterLen, c)
          break
        case '/*':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble) {
            continue
          }
          this.inMultiLineComment++
          // do NOT mark an entire line as MultiLineCommand unless there is not other top-level text on the line.
          if (this.editor.lines[this.lineIndex].classLevelText === '') {
            this.editor.logf(`advanceUntil: marking line #${this.lineIndex + 1} as type MultiLineComment`)
            this.editor.lines[this.lineIndex].entityType = EntityType.MultiLineComment
          }
          this.editor.logf(`inMultiLineComment=${this.inMultiLineComment}: cursor=${this}`)
          this.newMatchingPair(nf, matchingPairs, matchingPairStack)
          break
        case '*/':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble) {
            continue
          }
          if (this.inMultiLineComment === 0) {
            return Error(`ERROR: Found */ before /*: cursor=${this}`)
          }
          // do NOT mark an entire line as MultiLineCommand unless there is not other top-level text on the line.
          if (this.editor.lines[this.lineIndex].classLevelText === '') {
            this.editor.logf(`advanceUntil: marking line ${this.lineIndex + 1} as type MultiLineComment`)
            this.editor.lines[this.lineIndex].entityType = EntityType.MultiLineComment
          }
          this.inMultiLineComment--
          this.editor.logf(`inMultiLineComment=${this.inMultiLineComment}: cursor=${this}`)
          this.closeMatchingPair(nf, matchingPairStack)
          break
        case `'''`:
          if (this.inMultiLineComment > 0) {
            continue
          }
          if (this.inSingleQuote) {
            return Error(`ERROR: Found ''' after ': cursor=${this}`)
          }
          if (this.inDoubleQuote || this.inTripleDouble) {
            continue
          }
          this.inTripleSingle = !this.inTripleSingle
          this.stringIsRaw = this.inTripleSingle && lastFeature === 'r'
          this.editor.logf(`inTripleSingle: cursor = ${this}`)
          if (this.inTripleSingle) {
            if (this.stringIsRaw) {
              this.newMatchingPair(`r'''`, matchingPairs, matchingPairStack)
            } else {
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
            }
          } else {
            this.closeMatchingPair(nf, matchingPairStack)
          }
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1, this.absOffset, this.absOffset + 1)
          }
          break
        case '"""':
          if (this.inMultiLineComment > 0) {
            continue
          }
          if (this.inDoubleQuote) {
            return Error(`ERROR: Found """ after ": cursor=${this}`)
          }
          if (this.inSingleQuote || this.inTripleSingle) {
            continue
          }
          this.inTripleDouble = !this.inTripleDouble
          this.stringIsRaw = this.inTripleDouble && lastFeature === 'r'
          this.editor.logf(`inTripleDouble: cursor=${this}`)
          if (this.inTripleDouble) {
            if (this.stringIsRaw) {
              this.newMatchingPair(`r"""`, matchingPairs, matchingPairStack)
            } else {
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
            }
          } else {
            this.closeMatchingPair(nf, matchingPairStack)
          }
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1, this.absOffset, this.absOffset + 1)
          }
          break
        case '${':
          switch (true) {
            case this.inMultiLineComment > 0:
              break
            case this.inSingleQuote:
              if (this.stringIsRaw) {
                continue
              }
              this.inSingleQuote = false
              this.braceLevels.push(BraceLevel.BraceSingle)
              this.editor.logf(`\${: inSingleQuote: cursor = ${this}`)
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
              break
            case this.inDoubleQuote:
              if (this.stringIsRaw) {
                continue
              }
              this.inDoubleQuote = false
              this.braceLevels.push(BraceLevel.BraceDouble)
              this.editor.logf(`\${: inDoubleQuote: cursor = ${this}`)
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
              break
            case this.inTripleSingle:
              if (this.stringIsRaw) {
                continue
              }
              this.inTripleSingle = false
              this.braceLevels.push(BraceLevel.BraceTripleSingle)
              this.editor.logf(`\${: inTripleSingle: cursor = ${this}`)
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
              break
            case this.inTripleDouble:
              if (this.stringIsRaw) {
                continue
              }
              this.inTripleDouble = false
              this.braceLevels.push(BraceLevel.BraceTripleDouble)
              this.editor.logf(`\${: inTripleDouble: cursor = ${this}`)
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
              break
            default:
              return Error(`ERROR: Found \${ outside of a string: cursor=${this}`)
          }
          break
        case '\'':
          if (this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0) {
            continue
          }
          this.inSingleQuote = !this.inSingleQuote
          this.stringIsRaw = this.inSingleQuote && lastFeature === 'r'
          this.editor.logf(`inSingleQuote: lastFeature='${lastFeature}', cursor=${this}`)
          if (this.inSingleQuote) {
            if (this.stringIsRaw) {
              this.newMatchingPair('r\'', matchingPairs, matchingPairStack)
            } else {
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
            }
          } else {
            this.closeMatchingPair(nf, matchingPairStack)
          }
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
          }
          break
        case `"`:
          if (this.inSingleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0) {
            continue
          }
          this.inDoubleQuote = !this.inDoubleQuote
          this.stringIsRaw = this.inDoubleQuote && lastFeature === 'r'
          this.editor.logf(`inDoubleQuote: cursor=${this}`)
          if (this.inDoubleQuote) {
            if (this.stringIsRaw) {
              this.newMatchingPair(`r"`, matchingPairs, matchingPairStack)
            } else {
              this.newMatchingPair(nf, matchingPairs, matchingPairStack)
            }
          } else {
            this.closeMatchingPair(nf, matchingPairStack)
          }
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
          }
          break
        case '(':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0) {
            continue
          }
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
          }
          this.parenLevels++
          this.editor.logf(`parenLevels++: cursor=${this}`)
          this.newMatchingPair(nf, matchingPairs, matchingPairStack)
          break
        case ')':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0) {
            continue
          }
          this.parenLevels--
          this.editor.logf(`parenLevels--: cursor = ${this}`)
          this.closeMatchingPair(nf, matchingPairStack)
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
          }
          break
        case '{':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0) {
            continue
          }
          if (this.parenLevels === 0 && this.braceLevels.length === 1) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
          }
          this.braceLevels.push(BraceLevel.BraceNormal)
          this.editor.logf(`{: cursor=${this}`)
          this.newMatchingPair(nf, matchingPairs, matchingPairStack)
          break
        case '}':
          if (this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0) {
            continue
          }
          if (this.braceLevels.length === 0) {
            return Error(`ERROR: Found } before {: cursor=${this}`)
          }
          const braceLevel = this.braceLevels.splice(this.braceLevels.length - 1)[0]
          switch (braceLevel) {
            case BraceLevel.BraceNormal:
              if (this.parenLevels === 0 && this.braceLevels.length === 1) {
                this.editor.lines[this.lineIndex].classLevelText += nf
                this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
              }
              break
            case BraceLevel.BraceSingle:
              this.inSingleQuote = true
              break
            case BraceLevel.BraceDouble:
              this.inDoubleQuote = true
              break
            case BraceLevel.BraceTripleSingle:
              this.inTripleSingle = true
              break
            case BraceLevel.BraceTripleDouble:
              this.inTripleDouble = true
              break
            default:
              return Error(`ERROR: Unknown braceLevel ${braceLevel}: cursor=${this}`)
          }
          this.editor.logf(`}: cursor = ${this}`)
          this.closeMatchingPair(nf, matchingPairStack)
          break
        default:
          if (this.atTopOfBraceLevel(1)) {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets.push(this.absOffset - 1)
          }
      }
    }
  }

  getRune(): NextRune {
    let r: string
    let size: number
    if (this.runeBuf.length > 0) {
      // this.editor.logf(`getRune: grabbing rune from runeBuf... before=${this.runeBuf}`)
      r = this.runeBuf.splice(0, 1)[0]
      size = r.length
      this.absOffset += size
      this.relStrippedOffset += size
      // this.editor.logf(`getRune: grabbing rune from runeBuf... rune='${r}', size=${size}, after=${this.runeBuf}`)
      return { r, size, err: null }
    }

    if (this.reader.length === 0) {
      // this.editor.logf(`getRune: empty reader: returning EOF`)
      return { r: '', size: 0, err: Error('EOF') }
    }
    // this.editor.logf(`reader=${this.reader}, length=${this.reader.length}`)
    r = this.reader.shift() || ''  // Make TypeScript compiler happy.
    size = r.length
    this.absOffset += size
    this.relStrippedOffset += size
    // this.editor.logf(`getRune: returning rune from reader... rune='${r}', size=${size}, after: reader=${this.reader}, length=${this.reader.length}`)
    return { r, size, err: null }
  }

  pushRune(r: string) {
    this.runeBuf.push(r)
    let size = r.length
    this.absOffset -= size
    this.relStrippedOffset -= size
    this.editor.logf(`Pushing rune='${r}, size=${size} to runeBuf: after=${this.runeBuf}`)
  }

  // advanceToNextFeature moves the cursor to the next rune and returns
  // it as a string, keeping track of where it is within the grammar.
  // If it encounters a triple single- or triple double-quote or a "${" while
  // within a string, it returns it as a whole string.
  advanceToNextFeature(): NextFeature {
    const firstRune = this.getRune()
    let r = firstRune.r
    let size = firstRune.size
    // this.editor.logf(`firstRune: r=${r}, size=${size}`)

    if (firstRune.err !== null) {
      const err = this.advanceToNextLine()
      if (err !== null) {
        if (!this.atTopOfBraceLevel(0)) {
          return { nf: '', err: Error(`parse error: reached EOF, cursor=${this}`) }
        }
        return { nf: '', err }
      }
      // this.editor.logf(`advanceToNextFeature: replacing newline with single space`)
      r = ' ' // replace newline with single space
      size = 1
      firstRune.err = null
    }

    if (size > 1) { // a utf-8 rune of no interest; return it.
      return { nf: r, err: null }
    }

    let nextRune: NextRune = { r: '', size: 0, err: null }
    // this.editor.logf(`switch: r=${r}, size=${size}`)
    switch (r) {
      case '\\':
        if (this.stringIsRaw || this.inMultiLineComment > 0) {
          return { nf: r, err: null }
        }
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          return { nf: '\\', err: null }
        }
        return { nf: `\\${nextRune.r}`, err: null }
        break
      case `'`:
        if ((this.stringIsRaw || this.inDoubleQuote || this.inTripleDouble) && !this.inTripleSingle) {
          return { nf: r, err: null }
        }
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          return { nf: `'`, err: null }
        }
        if (nextRune.size !== 1 || nextRune.r !== '\'') {
          this.pushRune(nextRune.r)
          return { nf: `'`, err: null }
        }
        // r === nextRune.r === `'` at this point.
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          this.pushRune(r)
          return { nf: `'`, err: null }
        }
        if (nextRune.size !== 1 || nextRune.r !== '\'') {
          this.pushRune(r)
          this.pushRune(nextRune.r)
          return { nf: `'`, err: null }
        }
        return { nf: `'''`, err: null }
        break
      case '"':
        if ((this.stringIsRaw || this.inSingleQuote || this.inTripleSingle) && !this.inTripleDouble) {
          return { nf: r, err: null }
        }
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          return { nf: `"`, err: null }
        }
        if (nextRune.size !== 1 || nextRune.r !== '"') {
          this.pushRune(nextRune.r)
          return { nf: `"`, err: null }
        }
        // r === nextRune.r === '"' at this point.
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          this.pushRune(r)
          return { nf: `"`, err: null }
        }
        if (nextRune.size !== 1 || nextRune.r !== '"') {
          this.pushRune(r)
          this.pushRune(nextRune.r)
          return { nf: `"`, err: null }
        }
        return { nf: `"""`, err: null }
        break
      case '$':
        if (this.stringIsRaw) {
          return { nf: r, err: null }
        }
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          return { nf: '$', err: null }
        }
        if (nextRune.size !== 1 || nextRune.r !== '{') {
          this.pushRune(nextRune.r)
          return { nf: '$', err: null }
        }
        return { nf: '${', err: null }
        break
      case '/':
        if (this.stringIsRaw) {
          return { nf: r, err: null }
        }
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          return { nf: '/', err: null }
        }
        if (nextRune.size !== 1 || (nextRune.r !== '*' && nextRune.r !== '/')) {
          this.pushRune(nextRune.r)
          return { nf: '/', err: null }
        }
        if (nextRune.r === '/') {
          return { nf: '//', err: null }
        }
        return { nf: '/*', err: null }
        break
      case '*':
        if (this.stringIsRaw) {
          return { nf: r, err: null }
        }
        nextRune = this.getRune()
        if (nextRune.err !== null) {
          return { nf: '*', err: null }
        }
        if (nextRune.size !== 1 || nextRune.r !== '/') {
          this.pushRune(nextRune.r)
          return { nf: '*', err: null }
        }
        return { nf: '*/', err: null }
    }

    return { nf: r, err: null }
  }

  atTopOfBraceLevel(braceLevel: number) {
    if (this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 || this.parenLevels > 0) {
      return false
    }
    return this.braceLevels.length === braceLevel
  }

  // advanceToNextLine advances the cursor to the next line.
  // It returns io.EOF when it reaches the end of the file.
  //
  // It also detects the start of class lines.
  advanceToNextLine() {
    const mm = Class.matchClassRE.exec(this.editor.lines[this.lineIndex].line)
    if (this.lineIndex === 0 && mm) {
      this.classLineIndices.push(this.lineIndex)
    }

    const arr = Array.from(this.editor.lines[this.lineIndex].classLevelText)
    while (arr.length > 0 && /\s/.test(arr[0])) {
      arr.shift()
      this.editor.lines[this.lineIndex].classLevelTextOffsets.splice(0, 1)
    }

    while (arr.length > 0 && /\s/.test(arr[arr.length - 1])) {
      arr.pop()
      this.editor.lines[this.lineIndex].classLevelTextOffsets.splice(0, 1)
    }

    this.editor.lines[this.lineIndex].classLevelText = arr.join('')

    if (this.editor.lines[this.lineIndex].classLevelText.length !== this.editor.lines[this.lineIndex].classLevelTextOffsets.length) {
      return Error(`programming error: line #${this.lineIndex + 1}: classLevelText=${this.editor.lines[this.lineIndex].classLevelText.length} !== classLevelTextOffsets=${this.editor.lines[this.lineIndex].classLevelTextOffsets.length}`)
    }

    this.lineIndex++
    if (this.lineIndex >= this.editor.lines.length) {
      return Error('EOF')
    }

    if (this.atTopOfBraceLevel(0) && mm) {
      this.classLineIndices.push(this.lineIndex)
    }

    this.absOffset = this.editor.lines[this.lineIndex].startOffset + this.editor.lines[this.lineIndex].strippedOffset
    this.relStrippedOffset = 0

    if (this.editor.lines[this.lineIndex].stripped !== '' && this.editor.fullBuf[this.absOffset] !== this.editor.lines[this.lineIndex].stripped[0]) {
      return Error(`programming error: fullBuf[${this.absOffset}]=${this.editor.fullBuf[this.absOffset]}, want ${this.editor.lines[this.lineIndex].stripped[0]}`)
    }

    this.reader = Array.from(this.editor.lines[this.lineIndex].stripped)
    if (this.inMultiLineComment > 0) {
      this.editor.logf(`advanceToNextLine: marking line #${this.lineIndex + 1} as MultiLineComment`)
      this.editor.lines[this.lineIndex].entityType = EntityType.MultiLineComment
    }
    if (this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0) {
      this.editor.logf(`advanceToNextLine: marking line #${this.lineIndex + 1} as isCommentOrString`)
      this.editor.lines[this.lineIndex].isCommentOrString = true
    }
    return null
  }
}