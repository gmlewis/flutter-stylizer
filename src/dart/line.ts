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
export interface Line {
  line: string, // original, unmodified line
  stripped: string, // removes comments and surrounding whitespace
  strippedOffset: number,    // offset to start of stripped line, compared to 'line'
  classLevelText: string, // preserved text at braceLevel==1 - Note that this is untrimmed.

  classLevelTextOffsets: Array<number>, // absolute offsets for each character within classLevelText.

  originalIndex: number,

  startOffset: number,
  endOffset: number,
  entityType: EntityType,

  isCommentOrString: boolean, // used when searching for new classes
}

// NewLine returns a new Line.
export const NewLine = (line: string, startOffset: number, originalIndex: number): Line => {
  const stripped = line.trim()
  const entityType = stripped ? EntityType.Unknown : EntityType.BlankLine
  const strippedOffset = line.indexOf(stripped)

  return {
    line: line,
    stripped: stripped,
    strippedOffset: strippedOffset,
    classLevelText: '',

    classLevelTextOffsets: [],

    originalIndex: originalIndex,

    startOffset: startOffset,
    endOffset: startOffset + line.length,
    entityType: entityType,

    isCommentOrString: false,
  }
}

export const isComment = (line: Line): boolean =>
  line.entityType === EntityType.SingleLineComment
  || line.entityType === EntityType.MultiLineComment
