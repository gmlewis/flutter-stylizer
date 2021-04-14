import * as vscode from 'vscode'
import * as assert from 'assert'
import * as sinon from 'sinon'
import { afterEach, beforeEach } from 'mocha'
import updateStatusbar from '../../../utils/update_statusbar'

const getMockEditor = (languageId: string) => {
  return { document: { languageId } } as vscode.TextEditor
}

suite('updateStatusbar()', function() {
  let mockButton: vscode.StatusBarItem
  let mockButtons: vscode.StatusBarItem[]
  let spiedHide: sinon.SinonSpy
  let spiedShow: sinon.SinonSpy

  beforeEach(() => {
    mockButton = { hide: () => { }, show: () => { } } as vscode.StatusBarItem
    mockButtons = [mockButton]
    spiedHide = sinon.spy(mockButton, 'hide')
    spiedShow = sinon.spy(mockButton, 'show')
  })

  afterEach(() => {
    spiedHide.restore()
    spiedShow.restore()
  })

  test('btn.hide() called if editor is undefined', function() {
    updateStatusbar(undefined, mockButtons)
    assert(spiedHide.calledOnce)
    assert(spiedShow.notCalled)
  })

  test('btn.hide() called if editor is not "dart"', function() {
    const editor = getMockEditor('css')
    updateStatusbar(editor, mockButtons)
    assert(spiedHide.calledOnce)
    assert(spiedShow.notCalled)
  })

  test('btn.show() called if editor is "dart"', function() {
    const editor = getMockEditor('dart')
    updateStatusbar(editor, mockButtons)
    assert(spiedHide.notCalled)
    assert(spiedShow.calledOnce)
  })
})
