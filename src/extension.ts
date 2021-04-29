'use strict'
import * as vscode from 'vscode'
import buttons from './buttons/buttons'
import createButtons from './utils/create_buttons'
import updateStatusbar from './utils/update_statusbar'
import watchEditors from './utils/watch_editors'
import { defaultMemberOrdering, Client, Options } from './dart/dart'
import { Editor } from './dart/editor'

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

    console.log(`Found ${got.length} classes and stylized ${edits.length}.`)

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
