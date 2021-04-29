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

import { EntityType } from './entity'

// Line represents a line of Dart code.
export class Line {
  constructor(line: string, startOffset: number, originalIndex: number) {
    this.line = line
    if (/\r$/.test(this.line)) {  // Process all lines in unix-style.
      this.line = this.line.substring(0, this.line.length - 1)
    }
    this.stripped = line.trim()
    this.entityType = this.stripped ? EntityType.Unknown : EntityType.BlankLine
    this.strippedOffset = line.indexOf(this.stripped)

    this.originalIndex = originalIndex

    this.startOffset = startOffset
    this.endOffset = startOffset + line.length
  }

  line: string // original, unmodified line
  stripped: string // removes comments and surrounding whitespace
  strippedOffset: number    // offset to start of stripped line, compared to 'line'
  classLevelText = '' // preserved text at braceLevel==1 - Note that this is untrimmed.

  classLevelTextOffsets: number[] = [] // absolute offsets for each character within classLevelText.

  originalIndex: number

  startOffset: number
  endOffset: number
  entityType: EntityType

  isCommentOrString = false // used when searching for new classes
}

export const isComment = (line: Line): boolean =>
  line.entityType === EntityType.SingleLineComment
  || line.entityType === EntityType.MultiLineComment
