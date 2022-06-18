# Change Log

All notable changes to the "flutter-stylizer" extension will be documented in
this file.

Please make sure you have a backup (preferably in git) of your code before running
"Flutter Stylizer" in case it doesn't handle your code properly.

## [0.1.10] - 2022-06-17

- Update vsce version to 2.9.1.

## [0.1.9] - 2022-06-17

- Add sponsorship ability.

## [0.1.8] - 2022-06-14

- Add new option [issue #31](https://github.com/gmlewis/flutter-stylizer/issues/31):
  - `groupAndSortVariableTypes` (default: `false`)

## [0.1.7] - 2022-01-12

- Fix [issue #26](https://github.com/gmlewis/flutter-stylizer/issues/26) caused by `Function()`.

## [0.1.6] - 2022-01-08

- Process all `mixin` blocks in addition to all `class` blocks.

## [0.1.5] - 2021-12-12

- `private-other-methods` can optionally be added to the member ordering.

## [0.1.3] - 2021-10-06

- Add plugin icon image.

## [0.1.2] - 2021-10-05

- Update dependencies.

## [0.1.1] - 2021-04-29

- Complete rewrite of Dart parser to identically match output from
  standalone [Go flutter-stylizer](https://github.com/gmlewis/go-flutter-stylizer).
  This VSCode plugin can now be used in the same CI/CD projects with
  the standalone `flutter-stylizer`.

## [0.0.21] - 2021-04-17

- Fix incorrectly identified NamedConstructor bug reported in #20.

## [0.0.20] - 2021-04-17

- Fix plugin broken on Windows bug reported in #19.

## [0.0.19] - 2021-04-15

- Add two new configuration booleans for experimental features,
  requested in #18. Please use these features with caution and
  file any bugs you find on GitHub.
  - `groupAndSortGetterMethods` (default: `false`)
  - `sortOtherMethods` (default: `false`)

## [0.0.18] - 2021-04-15

- Fix incorrectly-identified Function-type variable reported in #17.

## [0.0.17] - 2021-04-14

- Breaking change:
  Add `"public-override-variables"` configuration property to allow
  customization of `@override` variables ordering, requested in #16.
  You will need to add this new property to your `flutterStylizer.memberOrdering`,
  otherwise it will use the default built-in ordering.

## [0.0.16] - 2020-04-05

- Add `flutterStylizer.memberOrdering` configuration property to allow
  customization of member ordering, requested in #11.

## [0.0.15] - 2020-02-07

- Fix incorrectly-identified named constructor reported in #9.

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
