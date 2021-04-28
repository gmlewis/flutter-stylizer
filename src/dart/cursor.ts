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

      this.editor.logf("nf=%q matchingPairStack=%v, abs=%v, ind=%v, rel=%v", nf, len(matchingPairStack), this.absOffset, this.lineIndex, this.relStrippedOffset)

      switch nf {
        case "//":
          if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 {
            continue
          }
          this.relStrippedOffset -= 2
          this.absOffset -= 2
          beforeLen:= this.relStrippedOffset
          this.editor.lines[this.lineIndex].stripped = strings.TrimSpace(this.editor.lines[this.lineIndex].stripped[0: this.relStrippedOffset])
          afterLen:= len(this.editor.lines[this.lineIndex].stripped)
          this.absOffset -= beforeLen - afterLen
          // Reset the reader because we chopped off the stripped line and have no more to parse on this line.
          this.reader = strings.NewReader("")
          if afterLen == 0 {
            this.editor.logf("parse: marking line #%v as type SingleLineComment", this.lineIndex + 1)
            this.editor.lines[this.lineIndex].entityType = SingleLineComment
          }
        // this.editor.logf("STRIPPED MODIFIED! singleLineComment=true: stripped=%q(%v), beforeLen=%v, afterLen=%v, cursor=%v", this.editor.lines[this.lineIndex].stripped, len(this.editor.lines[this.lineIndex].stripped), beforeLen, afterLen, c)
        case "/*":
          if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble {
            continue
          }
          this.inMultiLineComment++
          // do NOT mark an entire line as MultiLineCommand unless there is not other top-level text on the line.
          if strings.TrimSpace(this.editor.lines[this.lineIndex].classLevelText) == "" {
            this.editor.logf("advanceUntil: marking line #%v as type MultiLineComment", this.lineIndex + 1)
            this.editor.lines[this.lineIndex].entityType = MultiLineComment
          }
          this.editor.logf("inMultiLineComment=%v: cursor=%v", this.inMultiLineComment, c)
          matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
        case "*/":
          if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble {
            continue
          }
          if this.inMultiLineComment == 0 {
            return fmt.Errorf("ERROR: Found */ before /*: cursor=%v", c)
          }
          // do NOT mark an entire line as MultiLineCommand unless there is not other top-level text on the line.
          if strings.TrimSpace(this.editor.lines[this.lineIndex].classLevelText) == "" {
            this.editor.logf("advanceUntil: marking line %v as type MultiLineComment", this.lineIndex + 1)
            this.editor.lines[this.lineIndex].entityType = MultiLineComment
          }
          this.inMultiLineComment--
          this.editor.logf("inMultiLineComment=%v: cursor=%v", this.inMultiLineComment, c)
          matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
        case "'''":
          if this.inMultiLineComment > 0 {
            continue
          }
          if this.inSingleQuote {
            return fmt.Errorf("ERROR: Found ''' after ': cursor=%v", c)
          }
          if this.inDoubleQuote || this.inTripleDouble {
            continue
          }
          this.inTripleSingle = !this.inTripleSingle
          this.stringIsRaw = this.inTripleSingle && lastFeature == "r"
          this.editor.logf("inTripleSingle: cursor=%v", c)
          if this.inTripleSingle {
            if this.stringIsRaw {
              matchingPairStack = this.NewMatchingPair("r'''", matchingPairs, matchingPairStack)
            } else {
              matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
            }
          } else {
            matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
          }
          if this.parenLevels == 0 && len(this.braceLevels) == 1 {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1, this.absOffset, this.absOffset + 1)
          }
        case `"""`:
          if this.inMultiLineComment > 0 {
            continue
          }
          if this.inDoubleQuote {
            return fmt.Errorf(`ERROR: Found """ after ": cursor=%v`, c)
          }
          if this.inSingleQuote || this.inTripleSingle {
            continue
          }
          this.inTripleDouble = !this.inTripleDouble
          this.stringIsRaw = this.inTripleDouble && lastFeature == "r"
          this.editor.logf("inTripleDouble: cursor=%v", c)
          if this.inTripleDouble {
            if this.stringIsRaw {
              matchingPairStack = this.NewMatchingPair(`r"""`, matchingPairs, matchingPairStack)
            } else {
              matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
            }
          } else {
            matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
          }
          if this.parenLevels == 0 && len(this.braceLevels) == 1 {
            this.editor.lines[this.lineIndex].classLevelText += nf
            this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1, this.absOffset, this.absOffset + 1)
          }
        case "${":
          switch {
            case this.inMultiLineComment > 0:
            case this.inSingleQuote:
            if this.stringIsRaw {
					continue
      }
      this.inSingleQuote = false
      this.braceLevels = append(this.braceLevels, BraceSingle)
      this.editor.logf("${: inSingleQuote: cursor=%v", c)
      matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
			case this.inDoubleQuote:
      if this.stringIsRaw {
        continue
      }
      this.inDoubleQuote = false
      this.braceLevels = append(this.braceLevels, BraceDouble)
      this.editor.logf("${: inDoubleQuote: cursor=%v", c)
      matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
			case this.inTripleSingle:
      if this.stringIsRaw {
        continue
      }
      this.inTripleSingle = false
      this.braceLevels = append(this.braceLevels, BraceTripleSingle)
      this.editor.logf("${: inTripleSingle: cursor=%v", c)
      matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
			case this.inTripleDouble:
      if this.stringIsRaw {
        continue
      }
      this.inTripleDouble = false
      this.braceLevels = append(this.braceLevels, BraceTripleDouble)
      this.editor.logf("${: inTripleDouble: cursor=%v", c)
      matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
			default:
    return fmt.Errorf("ERROR: Found ${ outside of a string: cursor=%v", c)
}
		case "'":
if this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
this.inSingleQuote = !this.inSingleQuote
this.stringIsRaw = this.inSingleQuote && lastFeature == "r"
this.editor.logf("inSingleQuote: lastFeature=%q, cursor=%v", lastFeature, c)
if this.inSingleQuote {
  if this.stringIsRaw {
    matchingPairStack = this.NewMatchingPair("r'", matchingPairs, matchingPairStack)
  } else {
    matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
  }
} else {
  matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
}
if this.parenLevels == 0 && len(this.braceLevels) == 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
		case `"`:
if this.inSingleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
this.inDoubleQuote = !this.inDoubleQuote
this.stringIsRaw = this.inDoubleQuote && lastFeature == "r"
this.editor.logf("inDoubleQuote: cursor=%v", c)
if this.inDoubleQuote {
  if this.stringIsRaw {
    matchingPairStack = this.NewMatchingPair(`r"`, matchingPairs, matchingPairStack)
  } else {
    matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
  }
} else {
  matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
}
if this.parenLevels == 0 && len(this.braceLevels) == 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
		case "(":
if this.inSingleQuote || this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
if this.parenLevels == 0 && len(this.braceLevels) == 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
this.parenLevels++
this.editor.logf("parenLevels++: cursor=%v", c)
matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
		case ")":
if this.inSingleQuote || this.inDoubleQuote || this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  continue
}
this.parenLevels--
this.editor.logf("parenLevels--: cursor=%v", c)
matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
if this.parenLevels == 0 && len(this.braceLevels) == 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
		case "{":
if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 {
  continue
}
if this.parenLevels == 0 && len(this.braceLevels) == 1 {
  this.editor.lines[this.lineIndex].classLevelText += nf
  this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
}
this.braceLevels = append(this.braceLevels, BraceNormal)
this.editor.logf("{: cursor=%v", c)
matchingPairStack = this.NewMatchingPair(nf, matchingPairs, matchingPairStack)
		case "}":
if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 {
  continue
}
if len(this.braceLevels) == 0 {
  return fmt.Errorf("ERROR: Found } before {: cursor=%v", c)
}
braceLevel:= this.braceLevels[len(this.braceLevels) - 1]
this.braceLevels = this.braceLevels[: len(this.braceLevels) - 1]
switch braceLevel {
  case BraceNormal:
    if this.parenLevels == 0 && len(this.braceLevels) == 1 {
      this.editor.lines[this.lineIndex].classLevelText += nf
      this.editor.lines[this.lineIndex].classLevelTextOffsets = append(this.editor.lines[this.lineIndex].classLevelTextOffsets, this.absOffset - 1)
    }
  case BraceSingle:
    this.inSingleQuote = true
  case BraceDouble:
    this.inDoubleQuote = true
  case BraceTripleSingle:
    this.inTripleSingle = true
  case BraceTripleDouble:
    this.inTripleDouble = true
  default:
    return fmt.Errorf("ERROR: Unknown braceLevel %v: cursor=%v", braceLevel, c)
}
this.editor.logf("}: cursor=%v", c)
matchingPairStack = this.CloseMatchingPair(nf, matchingPairStack)
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
  getRune:= func()(rune, int, error) {
    if len(this.runeBuf) > 0 {
      this.editor.logf("Grabbing rune from runeBuf... before=%#v", this.runeBuf)
      r:= this.runeBuf[0]
      size:= len(string(r))
      this.runeBuf = this.runeBuf[1:]
      this.absOffset += size
      this.relStrippedOffset += size
      this.editor.logf("rune=%c, size=%v, after=%#v", r, size, this.runeBuf)
      return r, size, nil
    }

    r, size, err := this.reader.ReadRune()
    if err != nil {
      return 0, 0, err
    }
    this.absOffset += size
    this.relStrippedOffset += size
    return r, size, nil
  }

  r, size, err := getRune()
  if err != nil {
    if err := this.advanceToNextLine(); err != nil {
      if !this.atTopOfBraceLevel(0) {
        return "", fmt.Errorf("parse error: reached EOF, cursor=%v", c)
      }
      return "", err
    }
    r, size, err = ' ', 1, nil // replace newline with single space
  }

  if size > 1 { // a utf-8 rune of no interest; return it.
    return string(r), nil
  }

  pushRune:= func(r rune) {
    this.runeBuf = append(this.runeBuf, r)
    size:= len(string(r))
    this.absOffset -= size
    this.relStrippedOffset -= size
    this.editor.logf("Pushing rune=%c, size=%v to runeBuf: after=%#v", r, len(string(r)), this.runeBuf)
  }

  switch r {
    case '\\':
      if this.stringIsRaw || this.inMultiLineComment > 0 {
        return string(r), nil
      }
      nr, _, err := getRune()
      if err != nil {
        return `\`, nil
		}
		return fmt.Sprintf("\\%c", nr), nil
	case '\'':
		if (this.stringIsRaw || this.inDoubleQuote || this.inTripleDouble) && !this.inTripleSingle {
			return string(r), nil
		}
		nr, nsize, err := getRune()
		if err != nil {
			return "'", nil
		}
		if nsize != 1 || nr != '\'' {
			pushRune(nr)
			return "'", nil
		}
		// r == nr == '\' at this point.
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
	case '"':
		if (this.stringIsRaw || this.inSingleQuote || this.inTripleSingle) && !this.inTripleDouble {
			return string(r), nil
		}
		nr, nsize, err := getRune()
		if err != nil {
			return `"`, nil
      }
      if nsize != 1 || nr != '"' {
        pushRune(nr)
        return `"`, nil
      }
      // r == nr == '"' at this point.
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
    case '$':
      if this.stringIsRaw {
        return string(r), nil
      }
      nr, nsize, err := getRune()
      if err != nil {
        return "$", nil
      }
      if nsize != 1 || nr != '{' {
        pushRune(nr)
        return "$", nil
      }
      return "${", nil
    case '/':
      if this.stringIsRaw {
        return string(r), nil
      }
      nr, nsize, err := getRune()
      if err != nil {
        return "/", nil
      }
      if nsize != 1 || (nr != '*' && nr != '/') {
        pushRune(nr)
        return "/", nil
      }
      if nr == '/' {
        return "//", nil
      }
      return "/*", nil
    case '*':
      if this.stringIsRaw {
        return string(r), nil
      }
      nr, nsize, err := getRune()
      if err != nil {
        return "*", nil
      }
      if nsize != 1 || nr != '/' {
        pushRune(nr)
        return "*", nil
      }
      return "*/", nil
  }

  return string(r), nil
}

func(c * Cursor) atTopOfBraceLevel(braceLevel int) bool {
  if this.inSingleQuote || this.inDoubleQuote || this.inTripleSingle || this.inTripleDouble || this.inMultiLineComment > 0 || this.parenLevels > 0 {
    return false
  }
  return len(this.braceLevels) == braceLevel
}

// advanceToNextLine advances the cursor to the next line.
// It returns io.EOF when it reaches the end of the file.
//
// It also detects the start of class lines.
func(c * Cursor) advanceToNextLine() error {
  if this.lineIndex == 0 && matchClassRE.FindStringSubmatch(this.editor.lines[this.lineIndex].line) != nil {
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
  return fmt.Errorf("programming error: line #%v: classLevelText=%v != classLevelTextOffsets=%v", this.lineIndex + 1, len(this.editor.lines[this.lineIndex].classLevelText), len(this.editor.lines[this.lineIndex].classLevelTextOffsets))
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

if this.editor.lines[this.lineIndex].stripped != "" && this.editor.fullBuf[this.absOffset] != this.editor.lines[this.lineIndex].stripped[0] {
  return fmt.Errorf("programming error: fullBuf[%v]=%c, want %c", this.absOffset, this.editor.fullBuf[this.absOffset], this.editor.lines[this.lineIndex].stripped[0])
}

this.reader = strings.NewReader(this.editor.lines[this.lineIndex].stripped)
if this.inMultiLineComment > 0 {
  this.editor.logf("advanceToNextLine: marking line #%v as MultiLineComment", this.lineIndex + 1)
  this.editor.lines[this.lineIndex].entityType = MultiLineComment
}
if this.inTripleDouble || this.inTripleSingle || this.inMultiLineComment > 0 {
  this.editor.logf("advanceToNextLine: marking line #%v as isCommentOrString", this.lineIndex + 1)
  this.editor.lines[this.lineIndex].isCommentOrString = true
}
return nil
}
}