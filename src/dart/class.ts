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
import { Entity, EntityType, isPrivate } from './entity'
import { isComment, Line } from './line'
import { MatchingPair } from './pairs'

// FindNextResult represents the return value of findNext.
interface FindNextResult {
  features?: string,
  classLineNum?: number,
  absOffsetIndex?: number,
  err: Error | null,
}

// FindSequenceReturn represents the return value of findSequence.
interface FindSequenceReturn {
  sequence?: string,
  lineCount?: number,
  leadingText?: string,
  err: Error | null,
}

// exported for testing purposes:
export const findSequenceAndLeadingText = (features: string) => {
  // two special cases to ignore:
  const sc1 = ' Function()> '
  const sc2 = ' Function() '
  // Note that these should be 'replaceAll' but am not sure if
  // the VSCode extension compiler can be set to es2021:
  const modified = features.replace(sc1, ' '.repeat(sc1.length))
    .replace(sc2, ' '.repeat(sc2.length))

  let sequence = ''
  let buildLeadingText = true
  let buildStr = ''
  Array.from(modified).forEach((f, i) => {
    if (/[\(\)\[\]\{\}\=\;]/g.test(f)) {
      buildLeadingText = false
      if (f === '=' && i < modified.length - 1 && modified[i + 1] === '>') {
        sequence += '=>'
        return
      }
      sequence += f
    }
    if (buildLeadingText) {
      buildStr += features.substring(i, i + 1)
    }
  })
  const leadingText = buildStr.trim()
  return { sequence, leadingText }
}

// Class represents a Dart class or mixin.
export class Class {
  // editor is the editor used to parse the class.
  // className is the name of the class.
  // openCurlyOffset is the position of the "{" for that class.
  // closeCurlyOffset is the position of the "}" for that class.
  // groupAndSortGetterMethods determines how getter methods are processed.
  constructor(editor: Editor, classType: string, className: string,
    openCurlyOffset: number, closeCurlyOffset: number,
    groupAndSortGetterMethods: boolean, separatePrivateMethods: boolean) {
    const lessThanOffset = className.indexOf('<')
    if (lessThanOffset >= 0) { // Strip off <T>.
      className = className.substring(0, lessThanOffset)
    }

    const classBody = editor.fullBuf.substring(openCurlyOffset, closeCurlyOffset)
    const p = classBody.split('\n')
    const numClassLines = p.length

    const [lineIndex, /* _unused */] = editor.findLineIndexAtOffset(openCurlyOffset)
    const classLines = editor.lines.slice(lineIndex, lineIndex + numClassLines)

    const p0Stripped = p[0].trim()
    classLines[0] = {
      line: p[0], // Keep only the open curly brace and what follows.
      stripped: p0Stripped,
      strippedOffset: classLines[0].strippedOffset + p0Stripped.length - classLines[0].stripped.length,
      originalIndex: classLines[0].originalIndex,
      startOffset: openCurlyOffset,
      endOffset: classLines[0].endOffset,
      entityType: classLines[0].entityType,
      isCommentOrString: classLines[0].isCommentOrString,
      classLevelText: '',
      classLevelTextOffsets: [],
    }
    // this.e.logf(`p[${}]='${}'(${}), closeCurlyOffset=${}, len(classBody)=${}, last classLine=${}", len(p)-1, p[len(p)-1], len(p[len(p)-1]), closeCurlyOffset, len(classBody), classLines[classLines.length-1])

    // Replace last line for truncated classBody:
    const ll = classLines[classLines.length - 1]
    classLines[classLines.length - 1] = {
      line: p[p.length - 1],
      stripped: p[p.length - 1].trim(),
      strippedOffset: ll.strippedOffset,
      startOffset: ll.startOffset,
      endOffset: ll.endOffset,
      entityType: EntityType.BlankLine,
      classLevelText: '',
      classLevelTextOffsets: [],
      originalIndex: ll.originalIndex,
      isCommentOrString: ll.isCommentOrString,
    }

    this.e = editor
    this.classBody = classBody
    this.lines = classLines
    this.classType = classType
    this.className = className
    this.openCurlyOffset = openCurlyOffset
    this.closeCurlyOffset = closeCurlyOffset

    this.groupAndSortGetterMethods = groupAndSortGetterMethods
    this.separatePrivateMethods = separatePrivateMethods
  }

  e: Editor
  classBody: string
  lines: Line[]

  classType: string
  className: string
  openCurlyOffset: number
  closeCurlyOffset: number
  groupAndSortGetterMethods: boolean
  separatePrivateMethods: boolean

  theConstructor: Entity | null = null
  namedConstructors: Entity[] = []
  staticVariables: Entity[] = []
  instanceVariables: Entity[] = []
  overrideVariables: Entity[] = []
  staticPrivateVariables: Entity[] = []
  privateVariables: Entity[] = []
  overrideMethods: Entity[] = []
  otherAllOrPublicMethods: Entity[] = []
  otherPrivateMethods: Entity[] = []
  buildMethod: Entity | null = null
  getterMethods: Entity[] = []

  static matchClassOrMixinRE = /^(?:abstract\s+)?(class|mixin)\s+(\S+).*\r?$/
  static matchClassOrMixinOrEnumRE = /^(?:abstract\s+)?(class|mixin|enum)\s+(\S+).*\r?$/

  findFeatures(): Error | null {
    this.lines.forEach((line, i) => {
      // Change a blank line following a full-line comment to a SingleLineComment in
      // order to keep it with the following entity.
      if (line.entityType === EntityType.Unknown && line.stripped === '') {
        this.e.logf(`findFeatures: marking line #${i + 1} as type BlankLine`)
        line.entityType = EntityType.BlankLine
      }
      if (i > 1 && this.lines[i - 1].entityType === EntityType.BlankLine && isComment(this.lines[i - 2]) && this.lines[i - 2].stripped === '') {
        this.e.logf(`findFeatures: marking line #${i + 1} as type SingleLineComment`)
        this.lines[i - 1].entityType = EntityType.SingleLineComment
      }
    })

    // if (this.e.Verbose) {
    // 	this.e.logf("\n\nBEFORE IDENTIFICATION:")
    // 	for i := 0; i < this.lines.length; i++ {
    // 		line := this.lines[i]
    // 		this.e.logf("line #${} type=${}: ${}", i+1, line.entityType, line.line)
    // 	}
    // }

    // this.identifyMultiLineComments()  // This step is not needed, as the editor marked these already.
    let err = this.identifyDecoratorsAsComments()
    if (err !== null) {
      return Error(`identifyDecoratorsAsComments: ${err.message}`)
    }
    err = this.identifyMainConstructor()
    if (err !== null) {
      return Error(`identifyMainConstructor: ${err.message}`)
    }
    err = this.identifyNamedConstructors()
    if (err !== null) {
      return Error(`identifyNamedConstructors: ${err.message}`)
    }
    err = this.identifyOverrideMethodsAndVars()
    if (err !== null) {
      return Error(`identifyOverrideMethodsAndVars: ${err.message}`)
    }
    err = this.identifyOthers()
    if (err !== null) {
      return Error(`identifyOthers: ${err.message}`)
    }

    if (this.e.verbose) {
      this.lines.forEach((line, i) => {
        this.e.logf(`line #${i + 1} type=${line.entityType}: ${line.line}`)
      })
    }

    // sanity check... better to catch errors early.
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i]
      if (i > 0 && line.entityType === EntityType.Unknown) {
        return Error(`programming error: unhandled line #${i + 1}: ${line.line}`)
      }
    }

    return null
  }

  static ternary1RE = /\?\s+\{/
  static ternary2RE = /:\s+\{/

  // findNext finds the next occurrence of one of the searchFor terms
  // within the classLevelText (possibly spanning multiple lines).
  //
  // It returns a "features" string which is all class-level text up to
  // and including the searched-for string.
  //
  // It also returns the absolute offset index (into the editor.fullBuf)
  // of the last character returned.
  //
  // If no search terms can be found, the error io.EOF is returned.
  findNext(lineNum: number, ...searchFor: string[]): FindNextResult {
    let features = ''
    for (let classLineNum = lineNum; classLineNum < this.lines.length; classLineNum++) {
      const line = this.lines[classLineNum]
      features += line.classLevelText
      if (!line.classLevelText) {
        features += ' '
        continue
      }

      let classLevelIndex = -1
      let s = ''
      for (let si = 0; si < searchFor.length; si++) {
        const ss = searchFor[si]
        const i = line.classLevelText.indexOf(ss)
        if (i < 0) {
          continue
        }
        if (si !== 0 && classLevelIndex >= 0 && i >= classLevelIndex) {
          continue
        }

        // If the matched "ending" item is a "}"
        // and before that we found a "?" followed by a "{",
        // then we need to keep reading and find a ":" followed by another "}".
        if (ss === '}' && features.match(Class.ternary1RE) && !features.match(Class.ternary2RE)) {
          continue
        }

        classLevelIndex = i
        s = ss
      }

      if (classLevelIndex >= 0) {
        const i = features.lastIndexOf(s)
        if (i > 0) {
          features = features.slice(0, i + s.length)
        }

        if (classLevelIndex >= line.classLevelTextOffsets.length) {
          return { err: Error(`programming error: classLevelIndex = ${classLevelIndex} but should be less than ${line.classLevelTextOffsets.length}, line=${line}`) }
        }

        const absOffsetIndex = line.classLevelTextOffsets[classLevelIndex]

        return { features, classLineNum, absOffsetIndex, err: null }
      }

      features += ' ' // instead of newline.
    }

    return { err: Error('EOF') }
  }

  identifyDecoratorsAsComments(): Error | null {
    const override = '@override'

    for (let i = 1; i < this.lines.length; i++) {
      const line = this.lines[i]
      if (line.entityType !== EntityType.Unknown || line.isCommentOrString || line.classLevelText === '') {
        continue
      }

      const lineText = line.classLevelText.trim()
      if (!lineText.startsWith('@') || lineText.startsWith(override)) {
        continue
      }

      // Making the simplifying assumption here that if a decorator has arguments,
      // they should start on the same line as the decorator.
      let lineIndex = i
      if (lineText.includes('(')) {
        const { features, classLineNum } = this.findNext(i, ' ', '=', ';', '{', '(')
        lineIndex = classLineNum || i  // Not an error if undefined... just reached EOF.

        const p = (features || '').split(' ')
        if ((features || '').endsWith('(') && (p.length === 1 || p[1] === '(')) { // decorator includes args after '('
          const { classLineNum, err } = this.findNext(i, ')')
          if (err !== null) {
            return Error(`unable to find end of decorator ')' with args from line #${this.lines[0].originalIndex + i + 1}`)
          }
          lineIndex = classLineNum || lineIndex
        }
      }

      while (i <= lineIndex) {
        this.e.logf(`identifyDecoratorsAsComments: marking decorator line #${i + 1} as type SingleLineComment`)
        this.lines[i].entityType = EntityType.SingleLineComment
        i++
      }
      i--
    }

    return null
  }

  identifyMainConstructor(): Error | null {
    const className = this.className + '('
    for (let i = 1; i < this.lines.length; i++) {
      const line = this.lines[i]
      if (line.entityType !== EntityType.Unknown || line.isCommentOrString || line.classLevelText === '') {
        continue
      }

      const { features: retFeatures, classLineNum, absOffsetIndex, err } = this.findNext(i, '=', '{', ';', '(')
      if (err !== null) {
        // An error here is OK... it just means we reached EOF.
        return null
      }
      let features = retFeatures || ''
      let lineIndex = classLineNum || 0
      let lastCharAbsOffset = absOffsetIndex || 0

      const advanceToNextLineIndex = () => {
        if (!features.endsWith('}') && !features.endsWith(';')) {
          const { features: retFeatures, classLineNum, absOffsetIndex, err } = this.findNext(i, '}', ';')
          if (err !== null) {
            // An error here is OK... it just means we reached EOF.
            return
          }
          features = retFeatures || features
          lineIndex = classLineNum || lineIndex
          lastCharAbsOffset = absOffsetIndex || lastCharAbsOffset
        }
        while (i + 1 < this.lines.length && i + 1 <= lineIndex) {
          i++
        }
      }

      if (!features.endsWith('(')) {
        advanceToNextLineIndex()
        continue
      }

      if (this.e.fullBuf[lastCharAbsOffset] !== '(') {
        return Error(`programming error: expected fullBuf[${lastCharAbsOffset}]='(' but got '${this.e.fullBuf[lastCharAbsOffset]}'`)
      }

      const classNameIndex = features.indexOf(className)
      if (classNameIndex < 0) {
        advanceToNextLineIndex()
        continue
      }

      if (classNameIndex > 0) {
        const char = features[classNameIndex - 1]
        if (!/\s/.test(char)) {
          advanceToNextLineIndex()
          continue
        }
      }

      if (line.entityType > EntityType.MainConstructor) {
        const err = this.repairIncorrectlyLabeledLine(i)
        if (err !== null) {
          return err
        }
      }
      this.e.logf(`identifyMainConstructor: marking line #${i + 1} as type MainConstructor`)
      line.entityType = EntityType.MainConstructor

      this.e.logf(`identifyMainConstructor: calling markMethod(line #${i + 1}, className='${className}', MainConstructor)`)
      const [tc, err2] = this.markMethod(i, className, EntityType.MainConstructor, lastCharAbsOffset)
      if (err2 !== null) {
        return err2
      }
      this.theConstructor = tc
      break
    }

    return null
  }

  identifyNamedConstructors(): Error | null {
    const className = this.className + '.'
    for (let i = 1; i < this.lines.length; i++) {
      const line = this.lines[i]
      if (line.entityType !== EntityType.Unknown || line.isCommentOrString || line.classLevelText === '') {
        continue
      }

      let lineNum = i

      const { features: retFeatures, classLineNum, absOffsetIndex, err } = this.findNext(lineNum, '=', '{', ';', '(')
      if (err !== null) {
        // An error here is OK... it just means we reached EOF.
        return null
      }
      let features = retFeatures || ''
      let lineIndex = classLineNum || 0
      let lastCharAbsOffset = absOffsetIndex || 0

      const advanceToNextLineIndex = () => {
        if (!features.endsWith('}') && !features.endsWith(';')) {
          const { features: retFeatures, classLineNum, absOffsetIndex, err } = this.findNext(i, '}', ';')
          if (err !== null) {
            // An error here is OK... it just means we reached EOF.
            return
          }
          features = retFeatures || features
          lineIndex = classLineNum || lineIndex
          lastCharAbsOffset = absOffsetIndex || lastCharAbsOffset
        }
        while (i + 1 < this.lines.length && i + 1 <= lineIndex) {
          i++
        }
      }

      if (!features.endsWith('(')) {
        advanceToNextLineIndex()
        continue
      }

      if (this.e.fullBuf[lastCharAbsOffset] !== '(') {
        return Error(`programming error: expected fullBuf[${lastCharAbsOffset}]='(' but got 'this.e.fullBuf[lastCharAbsOffset]'`)
      }

      const classNameIndex = features.indexOf(className)
      if (classNameIndex < 0) {
        advanceToNextLineIndex()
        continue
      }

      const leadingText = features.substring(0, classNameIndex)
      const namedConstructor = features.substring(classNameIndex)
      this.e.logf(`identifyNamedConstructors: leadingText='${leadingText}', classNameIndex=${classNameIndex}, namedConstructor='${namedConstructor}', lastCharAbsOffset=${lastCharAbsOffset}, features='${features}'`)

      if (/[\?\:]/g.test(leadingText)) {
        advanceToNextLineIndex()
        continue
      }

      if (this.lines[i].entityType >= EntityType.MainConstructor && this.lines[i].entityType !== EntityType.NamedConstructor) {
        const err = this.repairIncorrectlyLabeledLine(i)
        if (err !== null) {
          return err
        }
      }
      this.e.logf(`identifyNamedConstructors: marking line #${i + 1} as type NamedConstructor`)
      this.lines[i].entityType = EntityType.NamedConstructor

      this.e.logf(`identifyNamedConstructor: calling markMethod(line #${i + 1}, namedConstructor = '${namedConstructor}', NamedConstructor)`)
      const [entity, err2] = this.markMethod(i, namedConstructor, EntityType.NamedConstructor, lastCharAbsOffset)
      if (err2 !== null) {
        return err2
      }
      this.namedConstructors.push(entity!)
    }

    return null
  }

  identifyOverrideMethodsAndVars(): Error | null {
    for (let i = 1; i < this.lines.length; i++) {
      if (this.lines[i].entityType !== EntityType.Unknown || this.lines[i].isCommentOrString || this.lines[i].classLevelText === '') {
        continue
      }

      if (!this.lines[i].classLevelText.startsWith('@override') || i >= this.lines.length - 1) {
        continue
      }

      const lineNum = i

      const { features: resFeatures, classLineNum, absOffsetIndex, err } = this.findNext(lineNum, '=>', '=', '{', ';', '(')
      if (err !== null) {
        return Error(`expected valid @override method on line #${lineNum + 1}: ${err.message}`)
      }
      let features = resFeatures || ''
      let lineIndex = classLineNum || 0
      let lastCharAbsOffset = absOffsetIndex || 0

      if (features?.startsWith('operator') || features?.includes(' operator')) {
        // redo the search, but don't include "=" since "operator" is
        // a reserved keyword and must be an OverrideMethod.
        const { features: resFeatures, classLineNum, absOffsetIndex, err } = this.findNext(lineNum, '{', '(', ';')
        if (err !== null || features === '') {
          return Error(`expected valid @override operator method on line #${lineNum + 1}: ${err}`)
        }
        features = resFeatures || ''
        lineIndex = classLineNum || 0
        lastCharAbsOffset = absOffsetIndex || 0
      }

      const f = (i: number): string => {
        const v = features.substring(0, i).trim()
        const nameOffset = v.lastIndexOf(' ')
        if (nameOffset >= 0) {
          return v.substring(nameOffset + 1)
        }
        return v
      }

      if (features.endsWith('(')) {
        // There might be multiple parens, so find the first one to get the name:
        const name = f(features.indexOf('('))
        const entityType = name === 'build' ? EntityType.BuildMethod : EntityType.OverrideMethod

        this.e.logf(`identifyOverrideMethodsAndVars: calling markMethod(line #${i + 1}, name = '${name}', ${entityType}), line = '${this.lines[i].line}'`)
        const [entity, err] = this.markMethod(lineNum, name + '(', entityType, lastCharAbsOffset)
        if (err !== null) {
          return err
        }
        if (name === 'build') {
          this.buildMethod = entity
        } else {
          this.overrideMethods.push(entity!)
        }
        continue
      }

      const entity: Entity = {
        name: '',
        lines: [],
        entityType: EntityType.OverrideMethod,
      }

      // No open paren - could be a getter. See if it has a body.
      if (features.endsWith('{')) {
        if (this.e.fullBuf[lastCharAbsOffset] !== '{') {
          return Error(`programming error: expected '{' at offset ${lastCharAbsOffset} but got '${this.e.fullBuf[lastCharAbsOffset]}'`)
        }

        entity.name = f(features.length - 1)
      } else {
        // Does not have a body - if it has no fat arrow, it is a variable.
        if (features.endsWith('=>')) {
          entity.name = f(features.length - 2)
        } else {
          entity.entityType = EntityType.OverrideVariable
          entity.name = f(features.length - 1)
        }

        if (!features.endsWith(';')) {
          const { features: resFeatures, classLineNum, absOffsetIndex, err } = this.findNext(lineNum, ';')
          if (err !== null || features === '') {
            return Error(`expected trailing ';' for @override operator method on line #${lineNum + 1}: ${err}`)
          }
          features = resFeatures || ''
          lineIndex = classLineNum || 0
          lastCharAbsOffset = absOffsetIndex || 0
        }
      }

      const [/* entity */, err2] = this.markBody(entity, lineNum, entity.entityType, lineIndex, lastCharAbsOffset)
      if (err2 !== null) {
        return err2
      }

      if (entity.entityType === EntityType.OverrideVariable) {
        this.overrideVariables.push(entity)
      } else {
        this.overrideMethods.push(entity)
      }
    }

    return null
  }

  identifyOthers(): Error | null {
    for (let i = 1; i < this.lines.length; i++) {
      const line = this.lines[i]
      if (line.entityType !== EntityType.Unknown || line.isCommentOrString || line.classLevelText === '') {
        continue
      }

      const [entity, err] = this.scanMethod(i)
      if (err !== null) {
        if (err.message.includes('EOF')) {
          // OK to have a class or enum with no other content.
          // Mark all unmarked lines as LeaveUnmodified.
          for (let j = 1; j < this.lines.length; j++) {
            if (this.lines[j].entityType === EntityType.Unknown) {
              this.lines[j].entityType = EntityType.LeaveUnmodified
            }
          }
          return null
        }
        return err
      }

      if (entity.entityType === EntityType.Unknown) {
        continue
      }

      // Preserve the comment lines leading up to the entity.
      for (let lineNum = i - 1; lineNum > 0; lineNum--) {
        if (isComment(this.lines[lineNum])) {
          this.e.logf(`identifyOthers: marking line #${lineNum + 1} as type ${entity.entityType}`)
          this.lines[lineNum].entityType = entity.entityType
          entity.lines.unshift(this.lines[lineNum])
          continue
        }
        break
      }

      switch (entity.entityType) {
        case EntityType.OtherMethod:
          if (this.separatePrivateMethods && isPrivate(entity)) {
            this.otherPrivateMethods.push(entity)
          } else {
            this.otherAllOrPublicMethods.push(entity)
          }
          break
        case EntityType.GetterMethod:
          this.getterMethods.push(entity)
          break
        case EntityType.StaticVariable:
          this.staticVariables.push(entity)
          break
        case EntityType.StaticPrivateVariable:
          this.staticPrivateVariables.push(entity)
          break
        case EntityType.InstanceVariable:
          this.instanceVariables.push(entity)
          break
        case EntityType.OverrideVariable:
          this.overrideVariables.push(entity)
          break
        case EntityType.PrivateInstanceVariable:
          this.privateVariables.push(entity)
          break
        case EntityType.LeaveUnmodified:
          break
        default:
          return Error(`unexpected EntityType=${entity.entityType}`)
      }
    }

    return null
  }

  scanMethod(lineNum: number): [Entity, Error | null] {
    const entity: Entity = {
      name: '',
      lines: [],
      entityType: EntityType.Unknown,
    }

    const { sequence, lineCount, leadingText, err } = this.findSequence(lineNum)
    if (err !== null) {
      return [entity, err]
    }
    this.e.logf(`scanMethod(line =#${lineNum + 1}), sequence = ${sequence}, lineCount = ${lineCount}, leadingText = '${leadingText}'`)

    const nameParts = (leadingText || '').split(' ')
    let staticKeyword = false
    let privateVar = false
    if (nameParts.length > 0) {
      entity.name = nameParts[nameParts.length - 1]
      if (entity.name.startsWith('_')) {
        privateVar = true
      }
      if (nameParts[0] === 'static') {
        staticKeyword = true
      }
    }

    entity.entityType = EntityType.InstanceVariable
    switch (true) {
      case this.classType === 'enum' && lineNum === 1:
        entity.entityType = EntityType.LeaveUnmodified
        break
      case privateVar && staticKeyword:
        entity.entityType = EntityType.StaticPrivateVariable
        break
      case staticKeyword:
        entity.entityType = EntityType.StaticVariable
        break
      case privateVar:
        entity.entityType = EntityType.PrivateInstanceVariable
        break
    }

    switch (sequence) {
      case '(){}':
        entity.entityType = EntityType.OtherMethod
        break
      case '();': // instance variable or abstract method.
        if (this.classType !== 'enum' && !leadingText?.endsWith(' Function')) {
          entity.entityType = EntityType.OtherMethod
        }
        break
      case '=(){}':
        entity.entityType = EntityType.OtherMethod
        break
      default:
        if ((sequence || '')?.indexOf('=>') >= 0) {
          entity.entityType = EntityType.OtherMethod
        }
    }

    // Force getters to be methods.
    if ((leadingText || '').indexOf(' get ') >= 0) {
      if (this.groupAndSortGetterMethods) {
        entity.entityType = EntityType.GetterMethod
      } else {
        entity.entityType = EntityType.OtherMethod
      }
    }

    for (let i = 0; i < (lineCount || 0); i++) {
      if (lineNum + i >= this.lines.length) {
        break
      }

      if (this.lines[lineNum + i].entityType >= EntityType.MainConstructor && this.lines[lineNum + i].entityType !== entity.entityType) {
        this.e.logf(`scanMethod: Changing line #${lineNum + i + 1} from type ${this.lines[lineNum + i].entityType} to type ${entity.entityType}`)
        const err = this.repairIncorrectlyLabeledLine(lineNum + i)
        if (err !== null) {
          return [entity, err]
        }
      }

      this.e.logf(`scanMethod: marking line #${lineNum + i + 1} as type ${entity.entityType}`)
      this.lines[lineNum + i].entityType = entity.entityType
      entity.lines.push(this.lines[lineNum + i])
    }

    return [entity, null]
  }

  repairIncorrectlyLabeledLine(lineNum: number): Error | null {
    const incorrectLabel = this.lines[lineNum].entityType
    switch (incorrectLabel) {
      default:
        return Error(`repairIncorrectlyLabeledLine: class '${this.className}', class line #${lineNum + 1}, file line #${this.lines[0].originalIndex + lineNum + 1}, unhandled case ${incorrectLabel}.Please report on GitHub Issue Tracker with example test case.`)
    }
  }

  findSequence(lineNum: number): FindSequenceReturn {
    const { features: resFeatures, classLineNum, err } = this.findNext(lineNum, ';', '}')
    if (err !== null || resFeatures === '') {
      return { err: Error(`findNext: ${err} `) }
    }
    const features = resFeatures || ''
    const lineIndex = classLineNum || 0
    const lineCount = lineIndex - lineNum + 1

    const { sequence, leadingText } = findSequenceAndLeadingText(features)

    return { sequence, lineCount, leadingText, err: null }
  }

  // markMethod marks an entire method with the same entityType.
  // methodName must end with "(" and absOpenParenOffset must point to that open paren.
  markMethod(classLineNum: number, methodName: string, entityType: EntityType, absOpenParenOffset: number): [Entity | null, Error | null] {
    if (!methodName.endsWith('(')) {
      return [null, Error(`programming error: markMethod: '${methodName}' must end with the open parenthesis '('`)]
    }

    const entity: Entity = {
      name: methodName,
      lines: [],
      entityType: entityType,
    }

    const pair = this.e.matchingPairs[absOpenParenOffset]
    if (!pair) {
      return [null, Error(`programming error: expected '()' pair at absOpenParenOffset = ${absOpenParenOffset}, line = ${this.lines[classLineNum]}`)]
    }
    const classCloseLineIndex = this.classCloseLineIndex(pair)

    const { features: resFeatures, classLineNum: resClassLineNum, absOffsetIndex, err } = this.findNext(classCloseLineIndex, '=>', '{', ';')
    if (err !== null) {
      return [null, Error(`expected method body starting at classCloseLineIndex=${classCloseLineIndex}: ${err}`)]
    }
    const features = resFeatures || ''
    let classLineIndex = resClassLineNum || 0
    let lastCharAbsOffset = absOffsetIndex || 0

    if (features.endsWith('{')) {
      this.e.logf(`markMethod '${methodName}': moving past initializers: classLineIndex #${classLineIndex + this.lines[0].originalIndex + 1}, features=${features}`)
      while (classLineIndex < this.lines.length - 1 &&
        !this.lines[classLineIndex].classLevelText.endsWith(' {') &&
        !this.lines[classLineIndex].classLevelText.endsWith('}')) {
        classLineIndex++
      }
      const v = this.lines[classLineIndex].classLevelTextOffsets.length
      if (v !== this.lines[classLineIndex].classLevelText.length) {
        return [null, Error(`programming error: line #${classLineIndex + 1}: classLevelText = ${this.e.lines[classLineIndex].classLevelText.length} !== classLevelTextOffsets=${this.e.lines[classLineIndex].classLevelTextOffsets.length}`)]
      }
      if (v > 0) {
        lastCharAbsOffset = this.lines[classLineIndex].classLevelTextOffsets[v - 1]
      }

      this.e.logf(`markMethod '${methodName}': after move past initializers: lastCharAbsOffset=${lastCharAbsOffset}, classLineIndex #${classLineIndex + this.lines[0].originalIndex + 1}, classLevelText=${this.lines[classLineIndex].classLevelText}`)
    }

    if (features.endsWith('=>')) {
      const { classLineNum: resClassLineNum, absOffsetIndex, err } = this.findNext(classCloseLineIndex, '{', ';')
      if (err !== null) {
        return [null, Error(`expected fat arrow method body starting at classCloseLineIndex=${classCloseLineIndex}: ${err.message}`)]
      }
      classLineIndex = resClassLineNum || 0
      lastCharAbsOffset = absOffsetIndex || 0
    }

    return this.markBody(entity, classLineNum, entityType, classLineIndex, lastCharAbsOffset)
  }

  classCloseLineIndex(pair: MatchingPair): number {
    return pair.closeLineIndex - this.lines[0].originalIndex
  }

  // markBody marks an entire body with the same entityType.
  // startClassLineNum is the starting class line index of the body.
  // endClassLineNum is the ending class line index of the body (if ";" was used).
  // lastCharAbsOffset must either point to the body's opening "{" or to its ending ";".
  markBody(entity: Entity, startClassLineNum: number, entityType: EntityType, endClassLineNum: number, lastCharAbsOffset: number): [Entity | null, Error | null] {
    if (this.e.fullBuf[lastCharAbsOffset] === '{') {
      const pair = this.e.matchingPairs[lastCharAbsOffset]
      if (!pair) {
        return [null, Error(`expected matching '}' pair at lastCharAbsOffset = ${lastCharAbsOffset}`)]
      }
      if (pair.open !== '{' || pair.close !== '}') {
        return [null, Error(`programming error: expected '{' but got pair =% ${pair}`)]
      }
      endClassLineNum = this.classCloseLineIndex(pair)
    }

    this.e.logf(`markBody marking lines #${startClassLineNum + 1} -${endClassLineNum + 1} as ${entityType} ...`)
    for (let i = startClassLineNum; i <= endClassLineNum; i++) {
      if (i >= this.lines.length) {
        break
      }

      if (this.lines[i].entityType >= EntityType.MainConstructor && this.lines[i].entityType !== entityType) {
        const err = this.repairIncorrectlyLabeledLine(i)
        if (err !== null) {
          return [null, err]
        }
      }

      this.e.logf(`markMethod: marking line #${i + 1} as type ${entityType}`)
      this.lines[i].entityType = entityType
      entity.lines.push(this.lines[i])
    }

    // Preserve the comment lines leading up to the method.
    for (startClassLineNum--; startClassLineNum > 0; startClassLineNum--) {
      if (isComment(this.lines[startClassLineNum]) || this.lines[startClassLineNum].stripped.startsWith('@')) {
        this.e.logf(`markMethod: marking comment line #${startClassLineNum + 1} as type ${entityType}`)
        this.lines[startClassLineNum].entityType = entityType
        entity.lines.unshift(this.lines[startClassLineNum])
        continue
      }
      break
    }

    return [entity, null]
  }
}
