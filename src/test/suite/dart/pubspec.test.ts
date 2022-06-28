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

import * as assert from 'assert'
import * as vscode from 'vscode'

import { Editor } from '../../../dart/editor'
import { EntityType } from '../../../dart/entity'
import { runFullStylizer } from './class.test'

const fs = require('fs')
const path = require('path')

suite('Pubspec Tests', function() {
  var myExtDir = (vscode.extensions.getExtension('gmlewis-vscode.flutter-stylizer') || {}).extensionPath || process.env.VSCODE_CWD
  const testfilesDir = path.join(myExtDir, 'src', 'test', 'suite', 'testfiles')

  test('Pubspec get classes', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'pubspec.dart.txt'), 'utf8')

    const e = new Editor(source, false, false)

    const [got, err] = e.getClasses(false, false)
    if (err !== null) {
      throw Error(err.message)  // Make the compiler happy.
    }

    assert.strictEqual(got.length, 1, 'classes')
  })

  test('Pubspec class 1', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'pubspec.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'pubspec_want.txt'), 'utf8')

    const want = [
      EntityType.Unknown,          // line #14: {
      EntityType.InstanceVariable, // line #15:   // TODO: executables
      EntityType.InstanceVariable, // line #16:
      EntityType.InstanceVariable, // line #17:   final String name;
      EntityType.BlankLine,        // line #18:
      EntityType.InstanceVariable, // line #19:   @JsonKey(fromJson: _versionFromString)
      EntityType.InstanceVariable, // line #20:   final Version version;
      EntityType.BlankLine,        // line #21:
      EntityType.InstanceVariable, // line #22:   final String description;
      EntityType.BlankLine,        // line #23:
      EntityType.InstanceVariable, // line #24:   /// This should be a URL pointing to the website for the package.
      EntityType.InstanceVariable, // line #25:   final String homepage;
      EntityType.BlankLine,        // line #26:
      EntityType.InstanceVariable, // line #27:   /// Specifies where to publish this package.
      EntityType.InstanceVariable, // line #28:   ///
      EntityType.InstanceVariable, // line #29:   /// Accepted values: `null`, `'none'` or an `http` or `https` URL.
      EntityType.InstanceVariable, // line #30:   ///
      EntityType.InstanceVariable, // line #31:   /// [More information](https://dart.dev/tools/pub/pubspec#publish_to).
      EntityType.InstanceVariable, // line #32:   final String publishTo;
      EntityType.BlankLine,        // line #33:
      EntityType.InstanceVariable, // line #34:   /// Optional field to specify the source code repository of the package.
      EntityType.InstanceVariable, // line #35:   /// Useful when a package has both a home page and a repository.
      EntityType.InstanceVariable, // line #36:   final Uri repository;
      EntityType.BlankLine,        // line #37:
      EntityType.InstanceVariable, // line #38:   /// Optional field to a web page where developers can report new issues or
      EntityType.InstanceVariable, // line #39:   /// view existing ones.
      EntityType.InstanceVariable, // line #40:   final Uri issueTracker;
      EntityType.BlankLine,        // line #41:
      EntityType.OtherMethod,      // line #42:   /// If there is exactly 1 value in [authors], returns it.
      EntityType.OtherMethod,      // line #43:   ///
      EntityType.OtherMethod,      // line #44:   /// If there are 0 or more than 1, returns `null`.
      EntityType.OtherMethod,      // line #45:   @Deprecated(
      EntityType.OtherMethod,      // line #46:       'Here for completeness, but not recommended. Use `authors` instead.')
      EntityType.OtherMethod,      // line #47:   String get author {
      EntityType.OtherMethod,      // line #48:     if (authors.length == 1) {
      EntityType.OtherMethod,      // line #49:       return authors.single;
      EntityType.OtherMethod,      // line #50:     }
      EntityType.OtherMethod,      // line #51:     return null;
      EntityType.OtherMethod,      // line #52:   }
      EntityType.BlankLine,        // line #53:
      EntityType.InstanceVariable, // line #54:   final List<String> authors;
      EntityType.InstanceVariable, // line #55:   final String documentation;
      EntityType.BlankLine,        // line #56:
      EntityType.InstanceVariable, // line #57:   @JsonKey(fromJson: _environmentMap)
      EntityType.InstanceVariable, // line #58:   final Map<String, VersionConstraint> environment;
      EntityType.BlankLine,        // line #59:
      EntityType.InstanceVariable, // line #60:   @JsonKey(fromJson: parseDeps, nullable: false)
      EntityType.InstanceVariable, // line #61:   final Map<String, Dependency> dependencies;
      EntityType.BlankLine,        // line #62:
      EntityType.InstanceVariable, // line #63:   @JsonKey(fromJson: parseDeps, nullable: false)
      EntityType.InstanceVariable, // line #64:   final Map<String, Dependency> devDependencies;
      EntityType.BlankLine,        // line #65:
      EntityType.InstanceVariable, // line #66:   @JsonKey(fromJson: parseDeps, nullable: false)
      EntityType.InstanceVariable, // line #67:   final Map<String, Dependency> dependencyOverrides;
      EntityType.BlankLine,        // line #68:
      EntityType.InstanceVariable, // line #69:   /// Optional configuration specific to [Flutter](https://flutter.io/)
      EntityType.InstanceVariable, // line #70:   /// packages.
      EntityType.InstanceVariable, // line #71:   ///
      EntityType.InstanceVariable, // line #72:   /// May include
      EntityType.InstanceVariable, // line #73:   /// [assets](https://flutter.io/docs/development/ui/assets-and-images)
      EntityType.InstanceVariable, // line #74:   /// and other settings.
      EntityType.InstanceVariable, // line #75:   final Map<String, dynamic> flutter;
      EntityType.BlankLine,        // line #76:
      EntityType.MainConstructor,  // line #77:   /// If [author] and [authors] are both provided, their values are combined
      EntityType.MainConstructor,  // line #78:   /// with duplicates eliminated.
      EntityType.MainConstructor,  // line #79:   Pubspec(
      EntityType.MainConstructor,  // line #80:     this.name, {
      EntityType.MainConstructor,  // line #81:     this.version,
      EntityType.MainConstructor,  // line #82:     this.publishTo,
      EntityType.MainConstructor,  // line #83:     String author,
      EntityType.MainConstructor,  // line #84:     List<String> authors,
      EntityType.MainConstructor,  // line #85:     Map<String, VersionConstraint> environment,
      EntityType.MainConstructor,  // line #86:     this.homepage,
      EntityType.MainConstructor,  // line #87:     this.repository,
      EntityType.MainConstructor,  // line #88:     this.issueTracker,
      EntityType.MainConstructor,  // line #89:     this.documentation,
      EntityType.MainConstructor,  // line #90:     this.description,
      EntityType.MainConstructor,  // line #91:     Map<String, Dependency> dependencies,
      EntityType.MainConstructor,  // line #92:     Map<String, Dependency> devDependencies,
      EntityType.MainConstructor,  // line #93:     Map<String, Dependency> dependencyOverrides,
      EntityType.MainConstructor,  // line #94:     this.flutter,
      EntityType.MainConstructor,  // line #95:   })  : authors = _normalizeAuthors(author, authors),
      EntityType.MainConstructor,  // line #96:         environment = environment ?? const {},
      EntityType.MainConstructor,  // line #97:         dependencies = dependencies ?? const {},
      EntityType.MainConstructor,  // line #98:         devDependencies = devDependencies ?? const {},
      EntityType.MainConstructor,  // line #99:         dependencyOverrides = dependencyOverrides ?? const {} {
      EntityType.MainConstructor,  // line #100:     if (name == null || name.isEmpty) {
      EntityType.MainConstructor,  // line #101:       throw ArgumentError.value(name, 'name', '"name" cannot be empty.');
      EntityType.MainConstructor,  // line #102:     }
      EntityType.MainConstructor,  // line #103:
      EntityType.MainConstructor,  // line #104:     if (publishTo != null && publishTo != 'none') {
      EntityType.MainConstructor,  // line #105:       try {
      EntityType.MainConstructor,  // line #106:         final targetUri = Uri.parse(publishTo);
      EntityType.MainConstructor,  // line #107:         if (!(targetUri.isScheme('http') || targetUri.isScheme('https'))) {
      EntityType.MainConstructor,  // line #108:           throw const FormatException('Must be an http or https URL.');
      EntityType.MainConstructor,  // line #109:         }
      EntityType.MainConstructor,  // line #110:       } on FormatException catch (e) {
      EntityType.MainConstructor,  // line #111:         throw ArgumentError.value(publishTo, 'publishTo', e.message);
      EntityType.MainConstructor,  // line #112:       }
      EntityType.MainConstructor,  // line #113:     }
      EntityType.MainConstructor,  // line #114:   }
      EntityType.BlankLine,        // line #115:
      EntityType.NamedConstructor, // line #116:   factory Pubspec.fromJson(Map json, {bool lenient = false}) {
      EntityType.NamedConstructor, // line #117:     lenient ??= false;
      EntityType.NamedConstructor, // line #118:
      EntityType.NamedConstructor, // line #119:     if (lenient) {
      EntityType.NamedConstructor, // line #120:       while (json.isNotEmpty) {
      EntityType.NamedConstructor, // line #121:         // Attempting to remove top-level properties that cause parsing errors.
      EntityType.NamedConstructor, // line #122:         try {
      EntityType.NamedConstructor, // line #123:           return _$PubspecFromJson(json);
      EntityType.NamedConstructor, // line #124:         } on CheckedFromJsonException catch (e) {
      EntityType.NamedConstructor, // line #125:           if (e.map == json && json.containsKey(e.key)) {
      EntityType.NamedConstructor, // line #126:             json = Map.from(json)..remove(e.key);
      EntityType.NamedConstructor, // line #127:             continue;
      EntityType.NamedConstructor, // line #128:           }
      EntityType.NamedConstructor, // line #129:           rethrow;
      EntityType.NamedConstructor, // line #130:         }
      EntityType.NamedConstructor, // line #131:       }
      EntityType.NamedConstructor, // line #132:     }
      EntityType.NamedConstructor, // line #133:
      EntityType.NamedConstructor, // line #134:     return _$PubspecFromJson(json);
      EntityType.NamedConstructor, // line #135:   }
      EntityType.BlankLine,        // line #136:
      EntityType.NamedConstructor, // line #137:   /// Parses source [yaml] into [Pubspec].
      EntityType.NamedConstructor, // line #138:   ///
      EntityType.NamedConstructor, // line #139:   /// When [lenient] is set, top-level property-parsing or type cast errors are
      EntityType.NamedConstructor, // line #140:   /// ignored and `null` values are returned.
      EntityType.NamedConstructor, // line #141:   factory Pubspec.parse(String yaml, {sourceUrl, bool lenient = false}) {
      EntityType.NamedConstructor, // line #142:     lenient ??= false;
      EntityType.NamedConstructor, // line #143:
      EntityType.NamedConstructor, // line #144:     return checkedYamlDecode(
      EntityType.NamedConstructor, // line #145:         yaml, (map) => Pubspec.fromJson(map, lenient: lenient),
      EntityType.NamedConstructor, // line #146:         sourceUrl: sourceUrl);
      EntityType.NamedConstructor, // line #147:   }
      EntityType.BlankLine,        // line #148:
      EntityType.OtherMethod,      // line #149:   static List<String> _normalizeAuthors(String author, List<String> authors) {
      EntityType.OtherMethod,      // line #150:     final value = <String>{};
      EntityType.OtherMethod,      // line #151:     if (author != null) {
      EntityType.OtherMethod,      // line #152:       value.add(author);
      EntityType.OtherMethod,      // line #153:     }
      EntityType.OtherMethod,      // line #154:     if (authors != null) {
      EntityType.OtherMethod,      // line #155:       value.addAll(authors);
      EntityType.OtherMethod,      // line #156:     }
      EntityType.OtherMethod,      // line #157:     return value.toList();
      EntityType.OtherMethod,      // line #158:   }
      EntityType.BlankLine,        // line #159:
    ]

    runFullStylizer(null, source, wantSource, [want])
    runFullStylizer(null, wantSource, wantSource, null)
  })
})
