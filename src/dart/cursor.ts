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
    if (got != open) {
      throw new Error(`programming error: openAbsOffset = '${got}', want '${open}`)
    }

    const i = matchingPairStack.length
    if (i > 0) {
      pair.parentPairOpenAbsOffset = matchingPairStack[i - 1].openAbsOffset
    }

    matchingPairs[absOffset] = pair

    matchingPairStack.push(pair)
    return matchingPairStack
  }

  // closeMatchingPair closes the last open matching pair on the stack.
  closeMatchingPair(close: string, matchingPairStack: MatchingPair[]) {
    const pair = matchingPairStack[matchingPairStack.length - 1]

    pair.close = close
    pair.closeAbsOffset = this.absOffset - close.length
    pair.closeLineIndex = this.lineIndex
    pair.closeRelStrippedOffset = this.relStrippedOffset

    const got = this.editor.fullBuf.substring(pair.closeAbsOffset, pair.closeAbsOffset + close.length)
    if (got != close) {
      throw new Error(`programming error: closeAbsOffset = '${got}', want '${close}'`)
    }

    matchingPairStack.splice(matchingPairStack.length - 1)
    return matchingPairStack
  }

  // parse parses the Dart source, identifies line entity types in the source,
  // keeps track of matching pairs, and returns a list of class line indices.
  parse(matchingPairs: MatchingPairsMap) {
    let lastFeature = ''
    let nf = '' // nextFeature
    const matchingPairStack: MatchingPair[] = []

    while (true) {
      lastFeature = nf
      let err: Error
      [nf, err] = this.advanceToNextFeature()
      if (err) {
        if (err != Error('EOF')) {
          return Error(`advanceToNextFeature: ${err}`)
        }
        return null
      }

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
          if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble {
            continue
          }
          this.inMultiLineComment++
          // do NOT mark an entire line as MultiLineCommand unless there is not other top-level text on the line.
          if (this.editor.lines[this.lineIndex].classLevelText === '') {
            this.editor.logf(`advanceUntil: marking line #${this.lineIndex + 1} as type MultiLineComment`)
            this.editor.lines[this.lineIndex].entityType = EntityType.MultiLineComment
          }
          this.editor.logf(`inMultiLineComment=${this.inMultiLineComment}: cursor=${c}`)
          matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
          break
        case '*/':
          if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble {
            continue
          }
          if this.inMultiLineComment === 0 {
            return fmt.Errorf('ERROR: Found */ before /*: cursor=${}`, c)
          }
          // do NOT mark an entire line as MultiLineCommand unless there is not other top-level text on the line.
          if strings.TrimSpace(this.editor.lines[this.lineIndex].classLevelText) === '' {
            this.editor.logf(`advanceUntil: marking line ${} as type MultiLineComment`, this.lineIndex + 1)
            this.editor.lines[this.lineIndex].entityType = MultiLineComment
          }
          this.inMultiLineComment--
          this.editor.logf(`inMultiLineComment=${}: cursor=${}`, this.inMultiLineComment, c)
          matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
          break
        case '\'\'\'':
          if this.inMultiLineComment > 0 {
            continue
          }
          if this.inSingleQuote {
            return fmt.Errorf('ERROR: Found \'\'\' after \': cursor=${}', c)
          }
          if this.inDoubleQuote || this.inTripleDouble {
            continue
          }
          this.inTripleSingle = !this.inTripleSingle
          this.stringIsRaw = this.inTripleSingle && lastFeature === 'r'
          this.editor.logf(`inTripleSingle: cursor = ${}', c)
          if this.inTripleSingle {
        if this.stringIsRaw {
          matchingPairStack = this.newMatchingPair('r\'\'\'', matchingPairs, matchingPairStack)
        } else {
          matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
        }
      } else {
        matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
      }
      if this.parenLevels === 0 && len(this.braceLevels) === 1 {
        this.editor.lines[this.lineIndex].classLevelText += nf
        this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1, this.absOffset, this.absOffset + 1)
      }
      break
        case `"""`:
      if this.inMultiLineComment > 0 {
            continue
          }
          if this.inDoubleQuote {
            return fmt.Errorf(`ERROR: Found """ after ": cursor=${}`, c)
          }
          if this.inSingleQuote || this.inTripleSingle {
            continue
          }
          this.inTripleDouble = !this.inTripleDouble
          this.stringIsRaw = this.inTripleDouble && lastFeature === 'r'
          this.editor.logf(`inTripleDouble: cursor=${}', c)
          if this.inTripleDouble {
            if this.stringIsRaw {
              matchingPairStack = this.newMatchingPair(`r"""`, matchingPairs, matchingPairStack)
            } else {
        matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
      }
    } else {
      matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
    }
    if this.parenLevels === 0 && len(this.braceLevels) === 1 {
      this.editor.lines[this.lineIndex].classLevelText += nf
      this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1, this.absOffset, this.absOffset + 1)
    }
    break
        case '${':
    switch {
      break
            case this.inMultiLineComment > 0:
      break
            case this.inSingleQuote:
      if this.stringIsRaw {
					continue
  }
this.inSingleQuote = false
this.braceLevels = append(this.braceLevels, BraceSingle)
this.editor.logf(`${: inSingleQuote: cursor = ${}', c)
      matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
      break
      case this.inDoubleQuote:
if this.stringIsRaw {
  continue
}
this.inDoubleQuote = false
this.braceLevels = append(this.braceLevels, BraceDouble)
this.editor.logf(`${: inDoubleQuote: cursor = ${}', c)
      matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
      break
      case this.inTripleSingle:
if this.stringIsRaw {
  continue
}
this.inTripleSingle = false
this.braceLevels = append(this.braceLevels, BraceTripleSingle)
this.editor.logf(`${: inTripleSingle: cursor = ${}', c)
      matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
      break
      case this.inTripleDouble:
if this.stringIsRaw {
  continue
}
this.inTripleDouble = false
this.braceLevels = append(this.braceLevels, BraceTripleDouble)
this.editor.logf(`${: inTripleDouble: cursor = ${}', c)
      matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
			default:
    return fmt.Errorf("ERROR: Found ${ outside of a string: cursor=${}", c)
}
break
    case '\'':
if this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
this.inSingleQuote = !this.inSingleQuote
this.stringIsRaw = this.inSingleQuote && lastFeature === 'r'
this.editor.logf(`inSingleQuote: lastFeature=\'${}\', cursor=${}', lastFeature, c)
if this.inSingleQuote {
  if this.stringIsRaw {
    matchingPairStack = this.newMatchingPair('r\'', matchingPairs, matchingPairStack)
  } else {
    matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
  }
} else {
  matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
}
if this.parenLevels === 0 && len(this.braceLevels) === 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
break
    case `"`:
if this.inSingleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
this.inDoubleQuote = !this.inDoubleQuote
this.stringIsRaw = this.inDoubleQuote && lastFeature === 'r'
this.editor.logf(`inDoubleQuote: cursor=${}', c)
if this.inDoubleQuote {
  if this.stringIsRaw {
    matchingPairStack = this.newMatchingPair(`r"`, matchingPairs, matchingPairStack)
  } else {
    matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
  }
} else {
    matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
  }
if this.parenLevels === 0 && len(this.braceLevels) === 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
break
    case '(':
if this.inSingleQuote || this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
if this.parenLevels === 0 && len(this.braceLevels) === 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
this.parenLevels++
this.editor.logf(`parenLevels++: cursor=${}', c)
matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
break
    case ')':
if this.inSingleQuote || this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
this.parenLevels--
this.editor.logf(`parenLevels--: cursor = ${}', c)
matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
if this.parenLevels === 0 && len(this.braceLevels) === 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
break
    case '{':
if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 {
  continue
}
if this.parenLevels === 0 && len(this.braceLevels) === 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
this.braceLevels = append(this.braceLevels, BraceNormal)
this.editor.logf(`{: cursor=${}', c)
matchingPairStack = this.newMatchingPair(nf, matchingPairs, matchingPairStack)
break
    case '}':
if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 {
  continue
}
if len(this.braceLevels) === 0 {
  return fmt.Errorf('ERROR: Found } before {: cursor=${}', c)
}
const braceLevel = this.braceLevels[len(this.braceLevels) - 1]
this.braceLevels = this.braceLevels[: len(this.braceLevels) - 1]
switch braceLevel {
  break
  case BraceNormal:
if this.parenLevels === 0 && len(this.braceLevels) === 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
break
  case BraceSingle:
this.inSingleQuote = true
break
  case BraceDouble:
this.inDoubleQuote = true
break
  case BraceTripleSingle:
this.inTripleSingle = true
break
  case BraceTripleDouble:
this.inTripleDouble = true
  default:
return fmt.Errorf('ERROR: Unknown braceLevel ${}: cursor=${}', braceLevel, c)
}
this.editor.logf(`}: cursor = ${}', c)
matchingPairStack = this.closeMatchingPair(nf, matchingPairStack)
		default:
if this.atTopOfBraceLevel(1) {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
		}
	}
}

// advanceToNextFeature moves the cursor to the next rune and returns
// it as a string, keeping track of where it is within the grammar.
// If it encounters a triple single- or triple double-quote or a "${" while
// within a string, it returns it as a whole string.
func(c * Cursor) advanceToNextFeature()(string, error) {
  const getRune = func()(rune, int, error) {
    if len(this.runeBuf) > 0 {
    this.editor.logf(`Grabbing rune from runeBuf... before=%#v', this.runeBuf)
    const r = this.runeBuf[0]
    const size = len(string(r))
    this.runeBuf = this.runeBuf[1:]
    this.absOffset += size
    this.relStrippedOffset += size
    this.editor.logf(`rune =% c, size = ${}, after =%#v', r, size, this.runeBuf)
    return r, size, nil
  }

  const r, size, err = this.reader.ReadRune()
  if err != nil {
    return 0, 0, err
  }
  this.absOffset += size
  this.relStrippedOffset += size
  return r, size, nil
}

const r, size, err = getRune()
if err != nil {
  const if err = this.advanceToNextLine(); err != nil {
    if !this.atTopOfBraceLevel(0) {
      return '', fmt.Errorf('parse error: reached EOF, cursor=${}', c)
    }
    return '', err
  }
  r, size, err = ' ', 1, nil // replace newline with single space
}

if size > 1 { // a utf-8 rune of no interest; return it.
  return string(r), nil
}

const pushRune = func(r rune) {
  this.runeBuf = append(this.runeBuf, r)
    const size = len(string(r))
    this.absOffset -= size
    this.relStrippedOffset -= size
    this.editor.logf(`Pushing rune=%c, size=${} to runeBuf: after=%#v', r, len(string(r)), this.runeBuf)
  }

switch r {
    break
    case '\\':
if this.stringIsRaw || this.inMultiLineComment > 0 {
  return string(r), nil
}
const nr, _, err = getRune()
if err != nil {
  return `\`, nil
		}
		return fmt.Sprintf("\\%c", nr), nil
	break
  case '\'':
		if (this.stringIsRaw || this.inDoubleQuote || this.inTripleDouble) && !this.inTripleSingle {
			return string(r), nil
		}
		const nr, nsize, err = getRune()
		if err != nil {
			return "'", nil
		}
		if nsize != 1 || nr != '\'' {
			pushRune(nr)
			return "'", nil
		}
		// r === nr === '\' at this point.
		nr, nsize, err = getRune()
		if err != nil {
			pushRune(r)
			return "'", nil
		}
		if nsize != 1 || nr != '\'' {
			pushRune(r)
			pushRune(nr)
			return "'", nil
		}
		return "'''", nil
	break
  case '"':
		if (this.stringIsRaw || this.inSingleQuote || this.inTripleSingle) && !this.inTripleDouble {
			return string(r), nil
		}
		const nr, nsize, err = getRune()
		if err != nil {
			return `"`, nil
}
if nsize != 1 || nr != '"' {
  pushRune(nr)
  return `"`, nil
}
// r === nr === '"' at this point.
nr, nsize, err = getRune()
if err != nil {
  pushRune(r)
  return `"`, nil
}
if nsize != 1 || nr != '"' {
  pushRune(r)
  pushRune(nr)
  return `"`, nil
}
return `"""`, nil
break
    case '$':
if this.stringIsRaw {
  return string(r), nil
}
const nr, nsize, err = getRune()
if err != nil {
  return '$', nil
}
if nsize != 1 || nr != '{' {
  pushRune(nr)
  return '$', nil
}
return '${', nil
break
    case '/':
if this.stringIsRaw {
  return string(r), nil
}
const nr, nsize, err = getRune()
if err != nil {
  return '/', nil
}
if nsize != 1 || (nr != '*' && nr != '/') {
  pushRune(nr)
  return '/', nil
}
if nr === '/' {
  return '//', nil
}
return '/*', nil
break
    case '*':
if this.stringIsRaw {
  return string(r), nil
}
const nr, nsize, err = getRune()
if err != nil {
  return '*', nil
}
if nsize != 1 || nr != '/' {
  pushRune(nr)
  return '*', nil
}
return '*/', nil
}

return string(r), nil
}

func(c * Cursor) atTopOfBraceLevel(braceLevel int) bool {
  if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 || this.parenLevels > 0 {
    return false
  }
  return len(this.braceLevels) === braceLevel
}

// advanceToNextLine advances the cursor to the next line.
// It returns io.EOF when it reaches the end of the file.
//
// It also detects the start of class lines.
func(c * Cursor) advanceToNextLine() error {
  if this.lineIndex === 0 && matchClassRE.FindStringSubmatch(this.editor.lines[this.lineIndex].line) != nil {
    this.classLineIndices = append(this.classLineIndices, this.lineIndex)
  }

  // this.editor.lines[this.lineIndex].classLevelText = strings.TrimSpace(this.editor.lines[this.lineIndex].classLevelText)
  this.editor.lines[this.lineIndex].classLevelText = strings.TrimLeftFunc(this.editor.lines[this.lineIndex].classLevelText, func(r rune) bool {
    if !unicode.IsSpace(r) {
    return false
  }
		this.editor.lines[this.lineIndex].classLevelTextOffsets = this.editor.lines[this.lineIndex].classLevelTextOffsets[1:]
		return true
})

this.editor.lines[this.lineIndex].classLevelText = strings.TrimRightFunc(this.editor.lines[this.lineIndex].classLevelText, func(r rune) bool {
  if !unicode.IsSpace(r) {
  return false
}
		this.editor.lines[this.lineIndex].classLevelTextOffsets = this.editor.lines[this.lineIndex].classLevelTextOffsets[: len(this.editor.lines[this.lineIndex].classLevelTextOffsets) - 1]
		return true
	})

if len(this.editor.lines[this.lineIndex].classLevelText) != len(this.editor.lines[this.lineIndex].classLevelTextOffsets) {
  return fmt.Errorf('programming error: line #${}: classLevelText=${} != classLevelTextOffsets=${}', this.lineIndex + 1, len(this.editor.lines[this.lineIndex].classLevelText), len(this.editor.lines[this.lineIndex].classLevelTextOffsets))
}

this.lineIndex++
if this.lineIndex >= len(this.editor.lines) {
  return io.EOF
}

if this.atTopOfBraceLevel(0) && matchClassRE.FindStringSubmatch(this.editor.lines[this.lineIndex].line) != nil {
  this.classLineIndices = append(this.classLineIndices, this.lineIndex)
}

this.absOffset = this.editor.lines[this.lineIndex].startOffset + this.editor.lines[this.lineIndex].strippedOffset
this.relStrippedOffset = 0

if this.editor.lines[this.lineIndex].stripped != '' && this.editor.fullBuf[this.absOffset] != this.editor.lines[this.lineIndex].stripped[0] {
  return fmt.Errorf('programming error: fullBuf[${}]=%c, want %c', this.absOffset, this.editor.fullBuf[this.absOffset], this.editor.lines[this.lineIndex].stripped[0])
}

this.reader = strings.NewReader(this.editor.lines[this.lineIndex].stripped)
if this.inMultiLineComment > 0 {
  this.editor.logf(`advanceToNextLine: marking line #${} as MultiLineComment', this.lineIndex + 1)
  this.editor.lines[this.lineIndex].entityType = MultiLineComment
}
if this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  this.editor.logf(`advanceToNextLine: marking line #${} as isCommentOrString', this.lineIndex + 1)
  this.editor.lines[this.lineIndex].isCommentOrString = true
}
return nil
}
}