import * as vscode from 'vscode'
import * as assert from 'assert'
import * as sinon from 'sinon'
import createButtons from '../../../utils/create_buttons'
import mockButtons from '../mocks/mockButtons'
import watchEditors from '../../../utils/watch_editors'

suite('watchEditors()', function() {
  test('updateStatusbar() called', function() {
    const spiedUpdateStatusbar: sinon.SinonSpy = sinon.spy(vscode.window, 'onDidChangeActiveTextEditor')
    const mockStatusButtons: vscode.StatusBarItem[] = createButtons(mockButtons)
    watchEditors(mockStatusButtons)
    assert(spiedUpdateStatusbar.called)
    spiedUpdateStatusbar.restore()
  })
})
