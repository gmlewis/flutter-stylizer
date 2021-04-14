import * as assert from 'assert'
import buttons from '../../../buttons/buttons'

suite('buttons:', function() {
  test('Contains 1 button', function() {
    assert.strictEqual(buttons.length, 1)
  })

  test('Button 0.command is "extension.flutterStylizer"', function() {
    assert.strictEqual(buttons[0].command, 'extension.flutterStylizer')
  })
})
