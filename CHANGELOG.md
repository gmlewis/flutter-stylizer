# Change Log

All notable changes to the "flutter-stylizer" extension will be documented in
this file.

Please make sure you have a backup (preferably in git) of your code before running
"Flutter Stylizer" in case it doesn't handle your code properly.

## [0.0.14] - 2019-07-14

- Upgrade lodash to fix security vulnerability in #8.

## [0.0.13] - 2019-07-09
- Adds a statusbar button (on the lower left) to run the stylizer command on the current file.
  The button appears whenever an editor with the language type `dart` is the active editor.
  This is accomplished with a language-based "activation event" for "flutter-stylizer".
- Adds an extension dependency to the Dart extension (this adds `dart` as an editor language).
- This feature was generously added by @sketchbuch in #7.

## [0.0.12] - 2019-07-02
- Incorporate vulnerability fixes from #3, #4, and #5.

## [0.0.11] - 2019-03-22
- Fix bugs running on flutter package.

## [0.0.10] - 2019-03-22
- Fix await bug.

## [0.0.9] - 2018-12-08
- npm update vscode.

## [0.0.8] - 2018-11-22
- Improve spacing for single-line variables.

## [0.0.7] - 2018-11-20
- Fix instance variable bug.

## [0.0.6] - 2018-11-20
- Keep groups of comments associated with following entity.

## [0.0.5] - 2018-11-18
- Fix bugs found with abstract classes, getters, and @overrides.

## [0.0.4] - 2018-11-10
- Add support for missing getters.

## [0.0.3] - 2018-11-10
- Fix placement of getters with other methods.

## [0.0.2] - 2018-11-10
- Preserve solitary single- and multi-line comments.

## [0.0.1] - 2018-11-10
- Initial release, "Flutter Stylizer" is the provided command.
