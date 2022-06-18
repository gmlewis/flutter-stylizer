# flutter-stylizer README

[![CodeQL](https://github.com/gmlewis/flutter-stylizer/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/gmlewis/flutter-stylizer/actions/workflows/codeql-analysis.yml)

Flutter Stylizer is a VSCode extension that organizes your Flutter classes
in an opinionated and consistent manner.

Note that as of release `0.1.1`, there is now a standalone version of
`flutter-stylizer` (with identical output to this plugin) that is available here:
- https://github.com/gmlewis/go-flutter-stylizer

## Features

Flutter Stylizer organizes the class(es) within a `*.dart` file
in the following manner (with a blank line separating these parts):

* The main (possibly factory) constructor is listed first, if it exists.
  - (`public-constructor` in configuration)
* Any named constructors are listed next, in sorted order.
  - (`named-constructors` in configuration)
* Any static (class) variables are listed next, in sorted order.
  - (`public-static-variables` in configuration)
* Any instance variables are listed next, in sorted order.
  (As of version `v0.1.8`, a new option flag affects this section; see below.)
  - (`public-instance-variables` in configuration)
* Any `@override` variables are listed next, in sorted order.
  - (`public-override-variables` in configuration)
* Any private static (class) variables are listed next, in sorted order.
  - (`private-static-variables` in configuration)
* Any private instance variables are listed next, in sorted order.
  - (`private-instance-variables` in configuration)
* Any `@override` methods are listed next, in sorted order.
  - (`public-override-methods` in configuration)
* Any other methods are listed next in their original (unchanged) order.
  (As of version `v0.0.19`, two new option flags affect this section; see below.)
  - (`public-other-methods` in configuration)
* If `private-other-methods` is (optionally) specified, these will be sorted
  separately from `public-other-methods`.
* The `build` method is listed last.
  - (`build-method` in configuration)

I have found that developer productivity increases when all code in
large projects follows a consistent and opinionated style.

Additionally, bringing new developers into a team with a large code base
is easier when the code is consistently written and therefore easier
to navigate and understand.

Without tooling to enforce a consistent style, developing code is less fun.
Having an automated tool to do this ugly work for you, however, makes
coding a lot more enjoyable, as you don't have to worry about the rules,
but can just run the plugin on file save, and the rules are automatically
enforced. Note that this plugin doesn't natively support format-on-save,
but you could use another extension... possibly something like this:
https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave
or you could use the stand-alone [Go flutter-stylizer]
in your GitHub Actions or CI pipeline to perform this action for you.

## Configuration

To override the default order of the stylizer, add a section to your
VSCode User Preferences (`Control/Cmd-,`) like this:

```
  "flutterStylizer": {
    "groupAndSortGetterMethods": false,
    "groupAndSortVariableTypes": false,
    "memberOrdering": [
      "public-constructor",
      "named-constructors",
      "public-static-variables",
      "public-instance-variables",
      "public-override-variables",
      "private-static-variables",
      "private-instance-variables",
      "public-override-methods",
      "public-other-methods",
      "private-other-methods",
      "build-method",
    ],
    "sortOtherMethods": false,
  }
```

And then rearrange member names as desired.

### Other option flags

Note that as of `v0.0.19`, two new option flags were added to modify the
behavior of the "public-other-methods" as requested in #18:

- `groupAndSortGetterMethods` (default: `false`)
  - Whether to group getters separately (before 'public-other-methods')
    and sort them within their group.

- `sortOtherMethods` (default: `false`)
  - Whether to sort the 'public-other-methods' within their group.

As of `v0.1.5`, a new `private-other-methods` field was added.
If not specified, private methods will continue to be grouped within
the `public-other-methods` section.

As of `v0.1.8`, a new option flag was added:

- `groupAndSortVariableTypes` (default: `false`)
  - Whether to group public variables separately by type and sort
    them within their groups. Types are: "final", "optional" (`?`), and "normal".

These features are experimental and should be used with caution.
Please file any bugs you find on the [GitHub issue tracker].

## Run Flutter Stylizer on all files - Option 1

If you want a super-fast way to process all files in a very large project,
and aren't averse to the command-line terminal (:smile:) please remember
to check out the stand-alone command-line companion tool:
https://github.com/gmlewis/go-flutter-stylizer

## Run Flutter Stylizer on all files - Option 2

If you install the [Command on All Files](https://marketplace.visualstudio.com/items?itemName=rioj7.commandOnAllFiles)
VSCode extension, you can then run the Flutter Stylizer on all files
within your project.

To do so, edit your VSCode `settings.json` file and add this section:

```json
"commandOnAllFiles.commands": {
    "Format File": {
        "command": "editor.action.formatDocument",
        "includeFileExtensions": [
            ".dart"
        ]
    },
    "Flutter Stylizer": {
        "command": "extension.flutterStylizer",
        "includeFileExtensions": [
            ".dart"
        ]
    }
}
```

Then run the command "Flutter Stylizer" and all `.dart` files in your project
will be stylized.

Note that this command can take upwards of 20 seconds just to get going due
to the time it takes to scan your project for `.dart` files.

Many thanks to `@longtimedeveloper` for this
[recommendation](https://github.com/gmlewis/flutter-stylizer/issues/23#issuecomment-1014781798)!

## Limitations

This plugin does not have a full-featured Dart syntax tree parser.
As a result, it may come across Dart code that it doesn't handle properly.
See the [Known Issues](#known-issues) section below for more details.

## Reporting Problems

It is my goal to be able to use this plugin on large group projects, so
every attempt has been made to make this robust. If, however, problems
are found, please raise issues on the [GitHub issue tracker] for this repo
along with a (short) example demonstrating the "before" and "after" results
of running this plugin on the example code.

Even better, please submit a PR with your new "before"/"after" example coded-up
as a unit test along with the code to fix the problem, and I'll try to
incorporate the fix into the plugin.

***Please remember to state which version of the plugin you are using and include your configuration settings!***

[GitHub issue tracker]: https://github.com/gmlewis/flutter-stylizer/issues
[Go flutter-stylizer]: https://github.com/gmlewis/go-flutter-stylizer

## Known Issues

* Flutter Stylizer is line-oriented. It is meant to be run on code that
  is nicely separated by lines.  The `dartfmt` tool typically makes
  sane-looking code, and this is the type of code that is being targeted
  by this extension.
* Code that follows the end of a multiline comment on the same
  line is not supported. Unusual code like this will most likely not ever be
  supported even though the Dart compiler can handle it.

## Release Notes

### v0.1.10

- Update vsce version.

### v0.1.9

- Add sponsorship ability.

### v0.1.8

- Add new option [issue #31](https://github.com/gmlewis/flutter-stylizer/issues/31):
  - `groupAndSortVariableTypes` (default: `false`)

### v0.1.7

- Fix [issue #26](https://github.com/gmlewis/flutter-stylizer/issues/26) caused by `Function()`.

### 0.1.6

- Process all `mixin` blocks in addition to all `class` blocks.

### 0.1.5

- `private-other-methods` can optionally be added to the member ordering.

### 0.1.3

- Add plugin icon image.

### 0.1.2

- Update dependencies.

### 0.1.1

- Complete rewrite of Dart parser to identically match output from
  standalone [Go flutter-stylizer](https://github.com/gmlewis/go-flutter-stylizer).
  This VSCode plugin can now be used in the same CI/CD projects with
  the standalone `flutter-stylizer`.

### 0.0.21

- Fix incorrectly identified NamedConstructor bug reported in #20.

### 0.0.20

- Fix plugin broken on Windows bug reported in #19.

### 0.0.19

- Add two new configuration booleans for experimental features,
  requested in #18. Please use these features with caution and
  file any bugs you find on GitHub.
  - `groupAndSortGetterMethods` (default: `false`)
  - `sortOtherMethods` (default: `false`)

### 0.0.18

- Fix incorrectly-identified Function-type variable reported in #17.

### 0.0.17

- Breaking change:
  Add `"public-override-variables"` configuration property to allow
  customization of `@override` variables ordering, requested in #16.
  You will need to add this new property to your `flutterStylizer.memberOrdering`,
  otherwise it will use the default built-in ordering.

### 0.0.16

- Add `flutterStylizer.memberOrdering` configuration property to allow
  customization of member ordering, requested in #11.

### 0.0.15

- Fix incorrectly-identified named constructor reported in #9.

### 0.0.14

- Upgrade lodash to fix security vulnerability in #8.

### 0.0.13

- Adds a statusbar button (on the lower left) to run the stylizer command on the current file.
  The button appears whenever an editor with the language type `dart` is the active editor.
  This is accomplished with a language-based "activation event" for "flutter-stylizer".
- Adds an extension dependency to the Dart extension (this adds `dart` as an editor language).
- This feature was generously added by @sketchbuch in #7.

### 0.0.12

- Incorporate vulnerability fixes from #3, #4, and #5.

### 0.0.11

- Fix bugs running on flutter package.

### 0.0.10

- Fix await bug.

### 0.0.9

- npm update vscode.

### 0.0.8

- Improve spacing for single-line variables.

### 0.0.7

- Fix instance variable bug.

### 0.0.6

- Keep groups of comments associated with following entity.

### 0.0.5

- Fix bugs found with abstract classes, getters, and @overrides.

### 0.0.4

- Add support for missing getters.

### 0.0.3

- Fix placement of getters with other methods.

### 0.0.2

- Preserve solitary single- and multi-line comments.

### 0.0.1

- Initial release, "Flutter Stylizer" is the provided command.

-----------------------------------------------------------------------------------------------------------

**Enjoy!**

----------------------------------------------------------------------

# License

Copyright 2018 Glenn M. Lewis. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
