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
import { Entity } from './entity'
import { isComment } from './line'

// Edit represents an edit of an editor buffer.
export interface Edit {
  startPos: number,
  endPos: number,
  text: string,
}

export interface Options {
  GroupAndSortGetterMethods?: boolean,
  MemberOrdering?: string[],
  SortOtherMethods?: boolean,
  Verbose?: boolean,
}

export const defaultMemberOrdering = [
  'public-constructor',
  'named-constructors',
  'public-static-variables',
  'public-instance-variables',
  'public-override-variables',
  'private-static-variables',
  'private-instance-variables',
  'public-override-methods',
  'public-other-methods',
  'build-method'
]

export class Client {
  constructor(opts: Options | null) {
    this.opts = opts || {
      GroupAndSortGetterMethods: false,
      MemberOrdering: defaultMemberOrdering,
      SortOtherMethods: false,
      Verbose: false,
    }
  }
  opts: Options

  generateEdits(classes: Class[]): Edit[] {
    const edits: Edit[] = []

    for (let i = classes.length - 1; i >= 0; i--) {
      const dc = classes[i]
      const startPos = dc.openCurlyOffset
      const endPos = dc.closeCurlyOffset

      const [lines, changesMade] = this.reorderClass(dc)
      if (!changesMade) {
        continue
      }

      const edit: Edit = {
        startPos: startPos,
        endPos: endPos,
        text: lines.join('\n'),
      }

      edits.push(edit)
    }

    return edits
  }

  reorderClass(dc: Class): [string[], boolean] {
    const lines: string[] = []

    lines.push(dc.lines[0].line) // Curly brace.

    const addEntity = (entity: Entity | null, separateEntities: boolean) => {
      if (entity === null) {
        return
      }

      entity.lines.forEach((line) => lines.push(line.line))

      if (separateEntities !== false || entity.lines.length > 1) {
        if (lines.length > 0 && lines[lines.length - 1] !== '') {
          lines.push('')
          this.logf(`reorderClass.addEntity(${entity.entityType}): adding blank line #${lines.length}`)
        }
      }
    }

    const addEntities = (entities: Entity[], separateEntities: boolean) => {
      if (entities.length === 0) {
        return
      }
      entities.forEach((e) => addEntity(e, separateEntities))
      if (!separateEntities && lines.length > 0 && lines[lines.length - 1] !== '') {
        lines.push('')
        this.logf(`reorderClass.addEntities(${entities[0].entityType}): separateEntities=${separateEntities}, adding blank line #${lines.length}`)
      }
    }

    // const sortFunc = (a: Entity, b: Entity) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    const sortFunc = (a: Entity, b: Entity) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1

    const ordering = this.opts.MemberOrdering || defaultMemberOrdering
    ordering.forEach((el, order) => {
      // if (!this.opts.Quiet) {
      this.logf(`Ordering step #${order + 1}: placing all '${el}'...`)
      // }

      // Strip trailing blank lines.
      while (lines.length > 2 && lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
        this.logf(`reorderClass(el='${el}'): removing blank line #${lines.length}`)
        lines.pop()
      }

      switch (el) {
        case 'public-constructor':
          addEntity(dc.theConstructor, true)
          break
        case 'named-constructors':
          dc.namedConstructors.sort(sortFunc)
          addEntities(dc.namedConstructors, true)
          break
        case 'public-static-variables':
          dc.staticVariables.sort(sortFunc)
          addEntities(dc.staticVariables, false)
          break
        case 'public-instance-variables':
          dc.instanceVariables.sort(sortFunc)
          addEntities(dc.instanceVariables, false)
          break
        case 'public-override-variables':
          dc.overrideVariables.sort(sortFunc)
          addEntities(dc.overrideVariables, false)
          break
        case 'private-static-variables':
          dc.staticPrivateVariables.sort(sortFunc)
          addEntities(dc.staticPrivateVariables, false)
          break
        case 'private-instance-variables':
          dc.privateVariables.sort(sortFunc)
          addEntities(dc.privateVariables, false)
          break
        case 'public-override-methods':
          dc.overrideMethods.sort(sortFunc)
          addEntities(dc.overrideMethods, true)
          break
        case 'public-other-methods':
          if (this.opts.GroupAndSortGetterMethods) {
            dc.getterMethods.sort(sortFunc)
            addEntities(dc.getterMethods, false)
          }

          if (this.opts.SortOtherMethods) {
            dc.otherMethods.sort(sortFunc)
          }
          addEntities(dc.otherMethods, true)

          // Preserve random single-line and multi-line comments.
          for (let i = 1; i < dc.lines.length; i++) {
            let foundComment = false
            for (; i < dc.lines.length && isComment(dc.lines[i]); i++) {
              lines.push(dc.lines[i].line)
              foundComment = true
            }
            if (foundComment) {
              lines.push('')
            }
          }
          break
        case 'build-method':
          addEntity(dc.buildMethod, true)
      }
    })

    this.logf(`Ordering done. Placed ${lines.length} lines.`)

    let changesMade = false
    if (dc.lines.length !== lines.length) {
      changesMade = true
    } else {
      for (let i = 0; i < dc.lines.length; i++) {
        if (dc.lines[i].line !== lines[i]) {
          changesMade = true
          break
        }
      }
    }

    return [lines, changesMade]
  }

  rewriteClasses(buf: string, edits: Edit[]): string {
    let newBuf = buf
    edits.forEach((edit) => {
      newBuf = `${newBuf.substring(0, edit.startPos)}${edit.text}${newBuf.substring(edit.endPos)}`
    })
    return newBuf
  }

  // logf logs the line if verbose is true.
  logf(s: string) {
    if (this.opts.Verbose) {
      console.log(s)
    }
  }
}
