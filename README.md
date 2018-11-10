# flutter-stylizer README

Flutter Stylizer is a VSCode extension that organizes your Flutter classes
in an opinionated and consistent manner.

## Features

Flutter Stylizer organizes the class(es) within a `*.dart` file
in the following manner (with a blank line separating these parts):

* The main (possibly factory) constructor is listed first, if it exists.
* Any named constructors are listed next, in sorted order.
* Any static (class) variables are listed next, in sorted order.
* Any instance variables are listed next, in sorted order.
* Any private static (class) variables are listed next, in sorted order.
* Any private instance variables are listed next, in sorted order.
* Any `@override` methods are listed next, in sorted order.
* Any other methods are listed next in their original (unchanged) order.
* The `build` method is listed last.

I have found that developer productivity increases when all code in
large projects follows a consistent and opinionated style.

Additionally, bringing new developers into a team with a large code base
is easier when the code is consistently written and therefore easier
to navigate and understand.

Without tooling to enforce a consistent style, developing code is less fun.
Having an automated tool to do this ugly work for you, however, makes
coding a lot more enjoyable, as you don't have to worry about the rules,
but can just run the plugin on file save, and the rules are automatically
enforced.

## Limitations

This plugin does not have a full-featured Dart syntax tree parser.
As a result, it may come across Dart code that it doesn't handle properly.
See the [Known Issues]() section below for more details.

It is my goal to be able to use this plugin on large group projects, so
every attempt has been made to make this robust. If, however, problems
are found, please raise issues on the GitHub issue tracker for this repo
along with a (short) example demonstrating the "before" and "after" results
of running this plugin on the example code.

Even better, please submit a PR with your new "before"/"after" example coded-up
as a unit test along with the code to fix the problem, and I'll try to
incorporate the fix into the plugin.

## Known Issues

* Flutter Stylizer is line-oriented. It is meant to be run on code that
  is nicely separated by lines.  The `dartfmt` tool typically makes
  sane-looking code, and this is the type of code that is being targeted
  by this extension.
* Code that follows the end of a multiline comment on the same
  line is not supported. Unusual code like this will most likely not ever be
  supported even though the Dart compiler can handle it.

## Release Notes

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
