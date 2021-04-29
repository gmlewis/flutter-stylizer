'use strict'
import * as vscode from 'vscode'
import buttons from './buttons/buttons'
import createButtons from './utils/create_buttons'
import updateStatusbar from './utils/update_statusbar'
import watchEditors from './utils/watch_editors'
import { defaultMemberOrdering, Client, Options } from './dart/dart'
import { Editor } from './dart/editor'

// const commentRE = /^(.*?)\s*\/\/.*\r?$/

// class DartLine {
//   line: string
//   stripped: string
//   startOffset: number
//   endOffset: number
//   entityType: EntityType = EntityType.Unknown

//   constructor(line: string, startOffset: number) {
//     this.line = line
//     this.startOffset = startOffset
//     this.endOffset = startOffset + line.length - 1
//     const m = commentRE.exec(line)
//     this.stripped = (m ? m[1] : this.line).trim()
//     if (this.stripped.length === 0) {
//       this.entityType = (line.indexOf('//') >= 0) ?
//         EntityType.SingleLineComment : EntityType.BlankLine
//     }
//   }
// }

// // DartEntity represents a single, independent feature of a DartClass.
// class DartEntity {
//   entityType: EntityType = EntityType.Unknown
//   lines: DartLine[] = []
//   name: string = ''  // Used for sorting, but could be "".
// }

// class DartClass {
//   editor: vscode.TextEditor
//   className: string
//   classOffset: number
//   openCurlyOffset: number
//   closeCurlyOffset: number
//   groupAndSortGetterMethods: boolean
//   classBody: string = ''
//   lines: DartLine[] = []  // Line 0 is always the open curly brace.

//   theConstructor?: DartEntity = undefined
//   namedConstructors: DartEntity[] = []
//   staticVariables: DartEntity[] = []
//   instanceVariables: DartEntity[] = []
//   overrideVariables: DartEntity[] = []
//   staticPrivateVariables: DartEntity[] = []
//   privateVariables: DartEntity[] = []
//   overrideMethods: DartEntity[] = []
//   otherMethods: DartEntity[] = []
//   buildMethod?: DartEntity = undefined
//   getterMethods: DartEntity[] = []

//   constructor(editor: vscode.TextEditor, className: string, classOffset: number,
//     openCurlyOffset: number, closeCurlyOffset: number, groupAndSortGetterMethods: boolean) {
//     this.editor = editor
//     this.className = className
//     this.classOffset = classOffset
//     this.openCurlyOffset = openCurlyOffset
//     this.closeCurlyOffset = closeCurlyOffset
//     this.groupAndSortGetterMethods = groupAndSortGetterMethods
//     const lessThanOffset = className.indexOf('<')
//     if (lessThanOffset >= 0) {  // Strip off <T>.
//       this.className = className.substring(0, lessThanOffset)
//     }
//   }

//   async findFeatures(buf: string) {
//     this.classBody = buf
//     const lines = this.classBody.split('\n')
//     let lineOffset = 0
//     lines.forEach((line) => {
//       this.lines.push(new DartLine(line, lineOffset))
//       lineOffset += line.length
//       // Change a blank line following a comment to a SingleLineComment in
//       // order to keep it with the following entity.
//       const numLines = this.lines.length
//       if (numLines > 1 &&
//         this.lines[numLines - 1].entityType === EntityType.BlankLine &&
//         isComment(this.lines[numLines - 2])) {
//         this.lines[numLines - 1].entityType = EntityType.SingleLineComment
//       }
//     })

//     this.identifyMultiLineComments()
//     await this.identifyMainConstructor()
//     await this.identifyNamedConstructors()
//     await this.identifyOverrideMethodsAndVars()
//     await this.identifyOthers()

//     // this.lines.forEach((line, index) => console.log(`line #${index} type=${EntityType[line.entityType]}: ${line.line}`));
//   }

//   private genStripped(startLine: number): string {
//     const strippedLines: string[] = []
//     for (let i = startLine; i < this.lines.length; i++) {
//       strippedLines.push(this.lines[i].stripped)
//     }
//     return strippedLines.join('\n')
//   }

//   private identifyMultiLineComments() {
//     let inComment = false
//     for (let i = 1; i < this.lines.length; i++) {
//       const line = this.lines[i]
//       if (line.entityType !== EntityType.Unknown) {
//         continue
//       }
//       if (inComment) {
//         this.lines[i].entityType = EntityType.MultiLineComment
//         // Note: a multiline comment followed by code on the same
//         // line is not supported.
//         const endComment = line.stripped.indexOf('*/')
//         if (endComment >= 0) {
//           inComment = false
//           if (line.stripped.lastIndexOf('/*') > endComment + 1) {
//             inComment = true
//           }
//         }
//         continue
//       }
//       const startComment = line.stripped.indexOf('/*')
//       if (startComment >= 0) {
//         inComment = true
//         this.lines[i].entityType = EntityType.MultiLineComment
//         if (line.stripped.lastIndexOf('*/') > startComment + 1) {
//           inComment = false
//         }
//       }
//     }
//   }

//   private async identifyMainConstructor() {
//     const className = this.className + '('
//     for (let i = 1; i < this.lines.length; i++) {
//       const line = this.lines[i]
//       if (line.entityType !== EntityType.Unknown) {
//         continue
//       }
//       const offset = line.stripped.indexOf(className)
//       if (offset >= 0) {
//         if (offset > 0) {
//           const char = line.stripped.substring(offset - 1, offset)
//           if (char !== ' ' && char !== '\t') {
//             continue
//           }
//         }
//         if (this.lines[i].entityType > EntityType.MainConstructor) {
//           this.repairIncorrectlyLabeledLine(i)
//         }
//         this.lines[i].entityType = EntityType.MainConstructor
//         this.theConstructor = await this.markMethod(i, className, EntityType.MainConstructor)
//         break
//       }
//     }
//   }

//   private async identifyNamedConstructors() {
//     const className = this.className + '.'
//     for (let i = 1; i < this.lines.length; i++) {
//       const line = this.lines[i]
//       if (line.entityType !== EntityType.Unknown) {
//         continue
//       }
//       const offset = line.stripped.indexOf(className)
//       if (offset >= 0) {
//         if (offset > 0) {
//           const char = line.stripped.substring(offset - 1, offset)
//           if (line.stripped[0] === '?' || line.stripped[0] === ':' || (char !== ' ' && char !== '\t')) {
//             continue
//           }
//         }
//         const openParenOffset = offset + line.stripped.substring(offset).indexOf('(')
//         const namedConstructor = line.stripped.substring(offset, openParenOffset + 1)  // Include open parenthesis.
//         if (this.lines[i].entityType >= EntityType.MainConstructor && this.lines[i].entityType !== EntityType.NamedConstructor) {
//           this.repairIncorrectlyLabeledLine(i)
//         }
//         this.lines[i].entityType = EntityType.NamedConstructor
//         const entity = await this.markMethod(i, namedConstructor, EntityType.NamedConstructor)
//         this.namedConstructors.push(entity)
//       }
//     }
//   }

//   private async identifyOverrideMethodsAndVars() {
//     for (let i = 1; i < this.lines.length; i++) {
//       const line = this.lines[i]
//       if (line.entityType !== EntityType.Unknown) {
//         continue
//       }

//       if (line.stripped.startsWith('@override') && i < this.lines.length - 1) {
//         const offset = this.lines[i + 1].stripped.indexOf('(')
//         if (offset >= 0) {
//           // Include open paren in name.
//           const ss = this.lines[i + 1].stripped.substring(0, offset + 1)
//           // Search for beginning of method name.
//           const nameOffset = ss.lastIndexOf(' ') + 1
//           const name = ss.substring(nameOffset)
//           const entityType = (name === 'build(') ? EntityType.BuildMethod : EntityType.OverrideMethod
//           if (this.lines[i].entityType >= EntityType.MainConstructor && this.lines[i].entityType !== entityType) {
//             this.repairIncorrectlyLabeledLine(i)
//           }
//           this.lines[i].entityType = entityType
//           const entity = await this.markMethod(i + 1, name, entityType)
//           if (name === 'build(') {
//             this.buildMethod = entity
//           } else {
//             this.overrideMethods.push(entity)
//           }
//         } else {
//           const entity = new DartEntity()
//           entity.entityType = EntityType.OverrideMethod
//           let lineNum = i + 1
//           // No open paren - could be a getter. See if it has a body.
//           if (this.lines[i + 1].stripped.indexOf('{') >= 0) {
//             const lineOffset = this.classBody.indexOf(this.lines[i + 1].line)
//             const inLineOffset = this.lines[i + 1].line.indexOf('{')
//             const relOpenCurlyOffset = lineOffset + inLineOffset
//             assert.strictEqual(this.classBody[relOpenCurlyOffset], '{', 'Expected open curly bracket at relative offset')
//             const absOpenCurlyOffset = this.openCurlyOffset + relOpenCurlyOffset
//             const absCloseCurlyOffset = await findMatchingBracket(this.editor, absOpenCurlyOffset)
//             const relCloseCurlyOffset = absCloseCurlyOffset - this.openCurlyOffset
//             assert.strictEqual(this.classBody[relCloseCurlyOffset], '}', 'Expected close curly bracket at relative offset')
//             const nextOffset = absCloseCurlyOffset - this.openCurlyOffset
//             const bodyBuf = this.classBody.substring(lineOffset, nextOffset + 1)
//             const numLines = bodyBuf.split('\n').length
//             for (let j = 0; j < numLines; j++) {
//               if (this.lines[lineNum + j].entityType >= EntityType.MainConstructor && this.lines[lineNum + j].entityType !== entity.entityType) {
//                 this.repairIncorrectlyLabeledLine(lineNum + j)
//               }
//               this.lines[lineNum + j].entityType = entity.entityType
//               entity.lines.push(this.lines[lineNum + j])
//             }
//           } else {
//             // Does not have a body - if it has no fat arrow, it is a variable.
//             if (this.lines[i + 1].stripped.indexOf('=>') < 0) {
//               entity.entityType = EntityType.OverrideVariable
//             }
//             // Find next ';', marking entityType forward.
//             for (let j = i + 1; j < this.lines.length; j++) {
//               if (this.lines[j].entityType >= EntityType.MainConstructor && this.lines[j].entityType !== entity.entityType) {
//                 this.repairIncorrectlyLabeledLine(j)
//               }
//               this.lines[j].entityType = entity.entityType
//               entity.lines.push(this.lines[j])
//               const semicolonOffset = this.lines[j].stripped.indexOf(';')
//               if (semicolonOffset >= 0) {
//                 break
//               }
//             }
//           }
//           // Preserve the comment lines leading up to the method.
//           for (lineNum--; lineNum > 0; lineNum--) {
//             if (isComment(this.lines[lineNum]) || this.lines[lineNum].stripped.startsWith('@')) {
//               this.lines[lineNum].entityType = entity.entityType
//               entity.lines.unshift(this.lines[lineNum])
//               continue
//             }
//             break
//           }
//           if (entity.entityType === EntityType.OverrideVariable) {
//             this.overrideVariables.push(entity)
//           } else {
//             this.overrideMethods.push(entity)
//           }
//         }
//       }
//     }
//   }

//   private async identifyOthers() {
//     for (let i = 1; i < this.lines.length; i++) {
//       const line = this.lines[i]
//       if (line.entityType !== EntityType.Unknown) {
//         continue
//       }

//       const entity = await this.scanMethod(i)
//       if (entity.entityType === EntityType.Unknown) {
//         continue
//       }

//       // Preserve the comment lines leading up to the entity.
//       for (let lineNum = i - 1; lineNum > 0; lineNum--) {
//         if (isComment(this.lines[lineNum])) {
//           this.lines[lineNum].entityType = entity.entityType
//           entity.lines.unshift(this.lines[lineNum])
//           continue
//         }
//         break
//       }

//       switch (entity.entityType) {
//         case EntityType.OtherMethod:
//           this.otherMethods.push(entity)
//           break
//         case EntityType.GetterMethod:
//           this.getterMethods.push(entity)
//           break
//         case EntityType.StaticVariable:
//           this.staticVariables.push(entity)
//           break
//         case EntityType.StaticPrivateVariable:
//           this.staticPrivateVariables.push(entity)
//           break
//         case EntityType.InstanceVariable:
//           this.instanceVariables.push(entity)
//           break
//         case EntityType.OverrideVariable:
//           this.overrideVariables.push(entity)
//           break
//         case EntityType.PrivateInstanceVariable:
//           this.privateVariables.push(entity)
//           break
//         default:
//           console.log('UNEXPECTED EntityType=', entity.entityType)
//           break
//       }
//     }
//   }

//   private scanMethod(lineNum: number): DartEntity {
//     const entity = new DartEntity

//     const buf = this.genStripped(lineNum)
//     const result = this.findSequence(buf)
//     const sequence = result[0]
//     const lineCount = result[1]
//     const leadingText = result[2]

//     const nameParts = leadingText.split(' ')
//     let staticKeyword = false
//     let privateVar = false
//     if (nameParts.length > 0) {
//       entity.name = nameParts[nameParts.length - 1]
//       if (entity.name.startsWith('_')) {
//         privateVar = true
//       }
//       if (nameParts[0] === 'static') {
//         staticKeyword = true
//       }
//     }
//     entity.entityType = EntityType.InstanceVariable
//     switch (true) {
//       case privateVar && staticKeyword:
//         entity.entityType = EntityType.StaticPrivateVariable
//         break
//       case staticKeyword:
//         entity.entityType = EntityType.StaticVariable
//         break
//       case privateVar:
//         entity.entityType = EntityType.PrivateInstanceVariable
//         break
//     }

//     switch (sequence) {
//       case '(){}':
//         entity.entityType = EntityType.OtherMethod
//         break

//       case '();':  // instance variable or abstract method.
//         if (!leadingText.endsWith(' Function')) {
//           entity.entityType = EntityType.OtherMethod
//         }
//         break

//       case '=(){}':
//         entity.entityType = EntityType.OtherMethod
//         break

//       default:
//         if (sequence.indexOf('=>') >= 0) {
//           entity.entityType = EntityType.OtherMethod
//         }
//         break
//     }

//     // Force getters to be methods.
//     if (leadingText.indexOf(' get ') >= 0) {
//       if (this.groupAndSortGetterMethods) {
//         entity.entityType = EntityType.GetterMethod
//       } else {
//         entity.entityType = EntityType.OtherMethod
//       }
//     }

//     for (let i = 0; i <= lineCount; i++) {
//       if (this.lines[lineNum + i].entityType >= EntityType.MainConstructor && this.lines[lineNum + i].entityType !== entity.entityType) {
//         this.repairIncorrectlyLabeledLine(lineNum + i)
//       }
//       this.lines[lineNum + i].entityType = entity.entityType
//       entity.lines.push(this.lines[lineNum + i])
//     }

//     return entity
//   }

//   private repairIncorrectlyLabeledLine(lineNum: number): void {
//     const incorrectLabel = this.lines[lineNum].entityType
//     switch (incorrectLabel) {
//       case EntityType.NamedConstructor:
//         for (let i = 0; i < this.namedConstructors.length; i++) {
//           const el = this.namedConstructors[i]
//           for (let j = 0; j < el.lines.length; j++) {
//             const line = el.lines[j]
//             if (line !== this.lines[lineNum]) { continue }
//             this.namedConstructors[i].lines.splice(j, 1)
//             if (this.namedConstructors[i].lines.length === 0) {
//               this.namedConstructors.splice(i)
//             }
//             return
//           }
//         }
//         break
//       default:
//         console.log(`repairIncorrectlyLabeledLine: Unhandled case ${incorrectLabel}. Please report on GitHub Issue Tracker with example test case.`)
//         break
//     }
//   }

//   private findSequence(buf: string): [string, number, string] {
//     const result: string[] = []

//     let leadingText = ''
//     let lineCount = 0
//     let openParenCount = 0
//     let openBraceCount = 0
//     let openCurlyCount = 0
//     for (let i = 0; i < buf.length; i++) {
//       if (openParenCount > 0) {
//         for (; i < buf.length; i++) {
//           switch (buf[i]) {
//             case '(':
//               openParenCount++
//               break
//             case ')':
//               openParenCount--
//               break
//             case '\n':
//               lineCount++
//               break
//           }
//           if (openParenCount === 0) {
//             result.push(buf[i])
//             break
//           }
//         }
//       } else if (openBraceCount > 0) {
//         for (; i < buf.length; i++) {
//           switch (buf[i]) {
//             case '[':
//               openBraceCount++
//               break
//             case ']':
//               openBraceCount--
//               break
//             case '\n':
//               lineCount++
//               break
//           }
//           if (openBraceCount === 0) {
//             result.push(buf[i])
//             return [result.join(''), lineCount, leadingText]
//           }
//         }
//       } else if (openCurlyCount > 0) {
//         for (; i < buf.length; i++) {
//           switch (buf[i]) {
//             case '{':
//               openCurlyCount++
//               break
//             case '}':
//               openCurlyCount--
//               break
//             case '\n':
//               lineCount++
//               break
//           }
//           if (openCurlyCount === 0) {
//             result.push(buf[i])
//             return [result.join(''), lineCount, leadingText]
//           }
//         }
//       } else {
//         switch (buf[i]) {
//           case '(':
//             openParenCount++
//             result.push(buf[i])
//             if (leadingText === '') {
//               leadingText = buf.substring(0, i).trim()
//             }
//             break
//           case '[':
//             openBraceCount++
//             result.push(buf[i])
//             if (leadingText === '') {
//               leadingText = buf.substring(0, i).trim()
//             }
//             break
//           case '{':
//             openCurlyCount++
//             result.push(buf[i])
//             if (leadingText === '') {
//               leadingText = buf.substring(0, i).trim()
//             }
//             break
//           case ';':
//             result.push(buf[i])
//             if (leadingText === '') {
//               leadingText = buf.substring(0, i).trim()
//             }
//             return [result.join(''), lineCount, leadingText]
//           case '=':
//             if (i < buf.length - 1 && buf[i + 1] === '>') {
//               result.push('=>')
//             } else {
//               result.push(buf[i])
//             }
//             if (leadingText === '') {
//               leadingText = buf.substring(0, i).trim()
//             }
//             break
//           case '\n':
//             lineCount++
//             break
//         }
//       }
//     }
//     return [result.join(''), lineCount, leadingText]
//   }

//   private async markMethod(lineNum: number, methodName: string, entityType: EntityType): Promise<DartEntity> {
//     assert.strictEqual(true, methodName.endsWith('('), 'markMethod: ' + methodName + ' must end with the open parenthesis.')
//     const entity = new DartEntity
//     entity.entityType = entityType
//     entity.lines = []
//     entity.name = methodName

//     // Identify all lines within the main (or factory) constructor.
//     const lineOffset = this.classBody.indexOf(this.lines[lineNum].line)
//     const inLineOffset = this.lines[lineNum].line.indexOf(methodName)
//     const relOpenParenOffset = lineOffset + inLineOffset + methodName.length - 1
//     assert.strictEqual(this.classBody[relOpenParenOffset], '(', 'Expected open parenthesis at relative offset')

//     const absOpenParenOffset = this.openCurlyOffset + relOpenParenOffset
//     const absCloseParenOffset = await findMatchingBracket(this.editor, absOpenParenOffset)
//     const relCloseParenOffset = absCloseParenOffset - this.openCurlyOffset
//     assert.strictEqual(this.classBody[relCloseParenOffset], ')', 'Expected close parenthesis at relative offset')

//     const curlyDeltaOffset = this.classBody.substring(relCloseParenOffset).indexOf('{')
//     const semicolonOffset = this.classBody.substring(relCloseParenOffset).indexOf(';')
//     let nextOffset = 0
//     if (curlyDeltaOffset < 0 || (curlyDeltaOffset >= 0 && semicolonOffset >= 0 && semicolonOffset < curlyDeltaOffset)) { // no body.
//       nextOffset = relCloseParenOffset + semicolonOffset
//     } else {
//       const absOpenCurlyOffset = absCloseParenOffset + curlyDeltaOffset
//       const absCloseCurlyOffset = await findMatchingBracket(this.editor, absOpenCurlyOffset)
//       nextOffset = absCloseCurlyOffset - this.openCurlyOffset
//     }
//     const constructorBuf = this.classBody.substring(lineOffset, nextOffset + 1)
//     const numLines = constructorBuf.split('\n').length
//     for (let i = 0; i < numLines; i++) {
//       if (this.lines[lineNum + i].entityType >= EntityType.MainConstructor && this.lines[lineNum + i].entityType !== entityType) {
//         this.repairIncorrectlyLabeledLine(lineNum + i)
//       }
//       this.lines[lineNum + i].entityType = entityType
//       entity.lines.push(this.lines[lineNum + i])
//     }

//     // Preserve the comment lines leading up to the method.
//     for (lineNum--; lineNum > 0; lineNum--) {
//       if (isComment(this.lines[lineNum]) || this.lines[lineNum].stripped.startsWith('@')) {
//         this.lines[lineNum].entityType = entityType
//         entity.lines.unshift(this.lines[lineNum])
//         continue
//       }
//       break
//     }
//     return entity
//   }
// }

// // const matchClassRE = /^(?:abstract\s+)?class\s+(\S+)\s*.*$/mg  // Fails on Windows!!!
// // const matchClassRE = /^(?:abstract\s+)?class\s+(\S+)\s*.*\r?$/mg  // Fails on Windows!!!
// // const matchClassRE = /^(?:abstract\s+)?class\s+(\S+).*\r?$/mg  // Fails on Windows!!!
// // const matchClassRE = /^(?:abstract\s+)?class\s+(\S+).*$/mg  // Fails on Windows!!!
// // const matchClassRE = /^(?:abstract\s+)?class\s+(\S+).*$/m  // Fails on Windows!!!
// const matchClassRE = /^(?:abstract\s+)?class\s+(\S+).*$/  // WHAT A HACK!!! Workaround below.

// const findMatchingBracket = async (editor: vscode.TextEditor, openParenOffset: number) => {
//   const position = editor.document.positionAt(openParenOffset)
//   editor.selection = new vscode.Selection(position, position)
//   await vscode.commands.executeCommand('editor.action.jumpToBracket')
//   const result = editor.document.offsetAt(editor.selection.active)
//   return result
// }

// const isComment = (line: DartLine) => {
//   return (line.entityType === EntityType.SingleLineComment ||
//     line.entityType === EntityType.MultiLineComment)
// }

// const findOpenCurlyOffset = (buf: string, startOffset: number) => {
//   const offset = buf.substring(startOffset).indexOf('{')
//   return startOffset + offset
// }

// // export for testing only.
// export const getClasses = async (editor: vscode.TextEditor, groupAndSortGetterMethods: boolean) => {
//   const document = editor.document
//   const classes: DartClass[] = []
//   const buf = document.getText()
//   // Regular expressions are totally broken in VSCode on Windows!
//   // This section was rewritten to manually split up the lines so that this plugin works on Windows.
//   const windowsResiliantBuf = buf.replace(/\r/g, '')
//   const lines = windowsResiliantBuf.split(/\n/)
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i]
//     const mm = matchClassRE.exec(line)
//     if (!mm) { continue }
//     const className = mm[1]
//     const classOffset = buf.indexOf(mm[0])
//     const openCurlyOffset = findOpenCurlyOffset(buf, classOffset)
//     if (openCurlyOffset <= classOffset) {
//       console.log('expected "{" after "class" at offset ' + classOffset.toString())
//       return classes
//     }
//     const closeCurlyOffset = await findMatchingBracket(editor, openCurlyOffset)
//     if (closeCurlyOffset <= openCurlyOffset) {
//       console.log('expected "}" after "{" at offset ' + openCurlyOffset.toString())
//       return classes
//     }
//     const dartClass = new DartClass(editor, className, classOffset, openCurlyOffset, closeCurlyOffset, groupAndSortGetterMethods)
//     await dartClass.findFeatures(buf.substring(openCurlyOffset, closeCurlyOffset))
//     classes.push(dartClass)
//   }
//   return classes
// }

const validateMemberOrdering = (config: vscode.WorkspaceConfiguration): string[] => {
  const memberOrdering = config.get<string[]>('memberOrdering')
  if (memberOrdering === null || memberOrdering === undefined || memberOrdering.length !== defaultMemberOrdering.length) {
    console.log(`flutterStylizer.memberOrdering must have ${defaultMemberOrdering.length} values. Ignoring and using defaults.`)
    return defaultMemberOrdering
  }

  const lookup = new Map(defaultMemberOrdering.map((el: string) => [el, true]))
  const seen = new Map<string, boolean>()
  for (let i = 0; i < memberOrdering.length; i++) {
    const el = memberOrdering[i]
    if (!lookup.get(el)) {
      console.log(`Unknown member ${el} in flutterStylizer.memberOrdering. Ignoring and using defaults.`)
      return defaultMemberOrdering
    }
    if (seen.get(el)) {
      console.log(`Duplicate member ${el} in flutterStylizer.memberOrdering. Ignoring and using defaults.`)
      return defaultMemberOrdering
    }
    seen.set(el, true)
  }

  return memberOrdering
}

// // export for testing only.
// export const reorderClass = (memberOrdering: string[], dc: DartClass, groupAndSortGetterMethods: boolean, sortOtherMethods: boolean): string[] => {
//   const lines: string[] = []
//   lines.push(dc.lines[0].line)  // Curly brace.
//   const addEntity = (entity?: DartEntity, separateEntities?: boolean) => {  // separateEntities default is true.
//     if (entity === undefined) { return }
//     entity.lines.forEach((line) => lines.push(line.line))
//     if (separateEntities !== false || entity.lines.length > 1) {
//       if (lines.length > 0 && lines[lines.length - 1] !== '\n') { lines.push('') }
//     }
//   }
//   const addEntities = (entities: DartEntity[], separateEntities?: boolean) => {  // separateEntities default is true.
//     if (entities.length === 0) { return }
//     entities.forEach((e) => addEntity(e, separateEntities))
//     if (separateEntities === false && lines.length > 0 && lines[lines.length - 1] !== '\n') {
//       lines.push('')
//     }
//   }
//   const sortFunc = (a: DartEntity, b: DartEntity) => a.name.localeCompare(b.name)

//   for (let order = 0; order < memberOrdering.length; order++) {
//     const el = memberOrdering[order]
//     console.log(`Ordering step #${order + 1}: placing all '${el}'...`)

//     // Strip trailing blank lines.
//     while (lines.length > 2 && lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
//       lines.pop()
//     }

//     switch (el) {
//       case 'public-constructor': {
//         addEntity(dc.theConstructor)
//         break
//       }
//       case 'named-constructors': {
//         dc.namedConstructors.sort(sortFunc)
//         addEntities(dc.namedConstructors)
//         break
//       }
//       case 'public-static-variables': {
//         dc.staticVariables.sort(sortFunc)
//         addEntities(dc.staticVariables, false)
//         break
//       }
//       case 'public-instance-variables': {
//         dc.instanceVariables.sort(sortFunc)
//         addEntities(dc.instanceVariables, false)
//         break
//       }
//       case 'public-override-variables': {
//         dc.overrideVariables.sort(sortFunc)
//         addEntities(dc.overrideVariables, false)
//         break
//       }
//       case 'private-static-variables': {
//         dc.staticPrivateVariables.sort(sortFunc)
//         addEntities(dc.staticPrivateVariables, false)
//         break
//       }
//       case 'private-instance-variables': {
//         dc.privateVariables.sort(sortFunc)
//         addEntities(dc.privateVariables, false)
//         break
//       }
//       case 'public-override-methods': {
//         dc.overrideMethods.sort(sortFunc)
//         addEntities(dc.overrideMethods)
//         break
//       }
//       case 'public-other-methods': {
//         if (groupAndSortGetterMethods) {
//           dc.getterMethods.sort(sortFunc)
//           addEntities(dc.getterMethods, false)
//         }

//         if (sortOtherMethods) {
//           dc.otherMethods.sort(sortFunc)
//         }
//         addEntities(dc.otherMethods)

//         // Preserve random single-line and multi-line comments.
//         for (let i = 1; i < dc.lines.length; i++) {
//           let foundComment = false
//           for (; i < dc.lines.length && isComment(dc.lines[i]); i++) {
//             lines.push(dc.lines[i].line)
//             foundComment = true
//           }
//           if (foundComment) { lines.push('') }
//         }
//         break
//       }
//       case 'build-method': {
//         addEntity(dc.buildMethod)
//         break
//       }
//     }
//   }

//   console.log(`Ordering done. Placed ${lines.length} lines.`)
//   return lines
// }

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, "Flutter Stylizer" is now active!')

  const disposable = vscode.commands.registerCommand('extension.flutterStylizer', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return // No open text editor
    }
    const saveSelection = editor.selection

    const config = vscode.workspace.getConfiguration('flutterStylizer')
    const memberOrdering = validateMemberOrdering(config)

    const groupAndSortGetterMethods = config.get<boolean>('groupAndSortGetterMethods') || false
    const sortOtherMethods = config.get<boolean>('sortOtherMethods') || false

    const document = editor.document
    const source = document.getText()

    const opts: Options = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: memberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    const e = new Editor(source, false)
    const c = new Client(opts)
    const [got, err] = e.getClasses(groupAndSortGetterMethods)
    if (err !== null) {
      throw Error(err.message)  // Make the compiler happy.
    }

    const edits = c.generateEdits(got)
    const newBuf = c.rewriteClasses(source, edits)

    const startPos = editor.document.positionAt(0)
    const endPos = editor.document.positionAt(source.length)
    editor.selection = new vscode.Selection(startPos, endPos)
    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
      editBuilder.replace(editor.selection, newBuf)
    })

    // const classes = await getClasses(editor, groupAndSortGetterMethods)
    // console.log('Found ' + classes.length.toString() + ' classes.')

    // // Rewrite the classes.
    // for (let i = classes.length - 1; i >= 0; i--) {
    //   const dc = classes[i]
    //   const startPos = editor.document.positionAt(dc.openCurlyOffset)
    //   const endPos = editor.document.positionAt(dc.closeCurlyOffset)
    //   editor.selection = new vscode.Selection(startPos, endPos)

    //   const lines = reorderClass(memberOrdering, dc, groupAndSortGetterMethods, sortOtherMethods)

    //   await editor.edit((editBuilder: vscode.TextEditorEdit) => {
    //     editBuilder.replace(editor.selection, lines.join('\n'))
    //   })
    // }

    editor.selection = saveSelection
  })

  context.subscriptions.push(disposable)

  if (vscode.extensions.getExtension('dart-code.dart-code') !== undefined) {
    const statusButtons: vscode.StatusBarItem[] = createButtons(buttons)
    watchEditors(statusButtons)
    updateStatusbar(vscode.window.activeTextEditor, statusButtons)
  }
}

export function deactivate() {
}
