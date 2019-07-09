import * as assert from 'assert';
import * as vscode from 'vscode';
import createButtons from '../../utils/create_buttons';
import mockButtons from '../mocks/mockButtons';

suite('createButtons()', function() {
  const result: vscode.StatusBarItem[] = createButtons(mockButtons);

  test('Returns the correct number of buttons', function() {
    assert.strictEqual(result.length, mockButtons.length);
  });

  result.forEach((button: vscode.StatusBarItem, index: number) => {
    suite(`Button ${index}:`, function() {
      test(`command is "${button.command}"`, function() {
        assert.strictEqual(result[index].command, button.command);
      });

      test(`text is "${button.text}"`, function() {
        assert.strictEqual(result[index].text, button.text);
      });

      test(`tooltip is "${button.tooltip}"`, function() {
        assert.strictEqual(result[index].tooltip, button.tooltip);
      });
    });
  });
});
