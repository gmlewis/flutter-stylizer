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
const fs = require('fs')
const path = require('path')

import { Editor } from '../../../dart/editor'
import { EntityType } from '../../../dart/entity'
import { runFullStylizer, runParsePhase } from './class.test'

suite('Scope Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')

  test('Scope get classes', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8')

    const e = new Editor(source, false)

    const [got, err] = e.getClasses(false)
    if (err !== null) {
      throw Error(err.message)  // Make the compiler happy.
    }

    assert.strictEqual(got.length, 10, 'classes')
  })

  test('Scope class 1', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(560, 769)
    // const wantSource = fs.readFileSync(path.join(testfilesDir, 'scope_want.txt'), 'utf8')

    const want = [
      EntityType.Unknown,         // line #1: {
      EntityType.MainConstructor, // line #2:   ClassScope(Scope parent, ClassElement element) : super(parent) {
      EntityType.MainConstructor, // line #3:     element.accessors.forEach(_addPropertyAccessor);
      EntityType.MainConstructor, // line #4:     element.methods.forEach(_addGetter);
      EntityType.MainConstructor, // line #5:   }
      EntityType.BlankLine,       // line #6:
    ]

    runParsePhase(null, source, want)
  })


  test('Scope class 2', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(769, 1027)
    // wantSource := scope_want_txt[560:769]

    const want: EntityType[] = [
      EntityType.Unknown,         // line #2: {
      EntityType.MainConstructor, // line #3:   ConstructorInitializerScope(Scope parent, ConstructorElement element)
      EntityType.MainConstructor, // line #4:       : super(parent) {
      EntityType.MainConstructor, // line #5:     element.parameters.forEach(_addGetter);
      EntityType.MainConstructor, // line #6:   }
      EntityType.BlankLine,       // line #7:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 3', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(1027, 2248)
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'scope_want.txt'), 'utf8').substring(1027, 2248)

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #2: {
      EntityType.PrivateInstanceVariable, // line #3:   final Scope _parent;
      EntityType.PrivateInstanceVariable, // line #4:   final Map<String, Element> _getters = {};
      EntityType.PrivateInstanceVariable, // line #5:   final Map<String, Element> _setters = {};
      EntityType.BlankLine,               // line #6:
      EntityType.MainConstructor,         // line #7:   EnclosedScope(Scope parent) : _parent = parent;
      EntityType.BlankLine,               // line #8:
      EntityType.OtherMethod,             // line #9:   Scope get parent => _parent;
      EntityType.BlankLine,               // line #10:
      EntityType.OverrideMethod,          // line #11:   @Deprecated('Use lookup2() that is closer to the language specification')
      EntityType.OverrideMethod,          // line #12:   @override
      EntityType.OverrideMethod,          // line #13:   Element lookup({@required String id, @required bool setter}) {
      EntityType.OverrideMethod,          // line #14:     var result = lookup2(id);
      EntityType.OverrideMethod,          // line #15:     return setter ? result.setter : result.getter;
      EntityType.OverrideMethod,          // line #16:   }
      EntityType.BlankLine,               // line #17:
      EntityType.OverrideMethod,          // line #18:   @override
      EntityType.OverrideMethod,          // line #19:   ScopeLookupResult lookup2(String id) {
      EntityType.OverrideMethod,          // line #20:     var getter = _getters[id];
      EntityType.OverrideMethod,          // line #21:     var setter = _setters[id];
      EntityType.OverrideMethod,          // line #22:     if (getter != null || setter != null) {
      EntityType.OverrideMethod,          // line #23:       return ScopeLookupResult(getter, setter);
      EntityType.OverrideMethod,          // line #24:     }
      EntityType.OverrideMethod,          // line #25:
      EntityType.OverrideMethod,          // line #26:     return _parent.lookup2(id);
      EntityType.OverrideMethod,          // line #27:   }
      EntityType.BlankLine,               // line #28:
      EntityType.OtherMethod,             // line #29:   void _addGetter(Element element) {
      EntityType.OtherMethod,             // line #30:     _addTo(_getters, element);
      EntityType.OtherMethod,             // line #31:   }
      EntityType.BlankLine,               // line #32:
      EntityType.OtherMethod,             // line #33:   void _addPropertyAccessor(PropertyAccessorElement element) {
      EntityType.OtherMethod,             // line #34:     if (element.isGetter) {
      EntityType.OtherMethod,             // line #35:       _addGetter(element);
      EntityType.OtherMethod,             // line #36:     } else {
      EntityType.OtherMethod,             // line #37:       _addSetter(element);
      EntityType.OtherMethod,             // line #38:     }
      EntityType.OtherMethod,             // line #39:   }
      EntityType.BlankLine,               // line #40:
      EntityType.OtherMethod,             // line #41:   void _addSetter(Element element) {
      EntityType.OtherMethod,             // line #42:     _addTo(_setters, element);
      EntityType.OtherMethod,             // line #43:   }
      EntityType.BlankLine,               // line #44:
      EntityType.OtherMethod,             // line #45:   void _addTo(Map<String, Element> map, Element element) {
      EntityType.OtherMethod,             // line #46:     var id = element.displayName;
      EntityType.OtherMethod,             // line #47:     map[id] ??= element;
      EntityType.OtherMethod,             // line #48:   }
      EntityType.BlankLine,               // line #49:
    ]

    // runParsePhase(null, source, want)
    runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 4', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(2248, 2521)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,         // line #2: {
      EntityType.MainConstructor, // line #3:   ExtensionScope(
      EntityType.MainConstructor, // line #4:     Scope parent,
      EntityType.MainConstructor, // line #5:     ExtensionElement element,
      EntityType.MainConstructor, // line #6:   ) : super(parent) {
      EntityType.MainConstructor, // line #7:     element.accessors.forEach(_addPropertyAccessor);
      EntityType.MainConstructor, // line #8:     element.methods.forEach(_addGetter);
      EntityType.MainConstructor, // line #9:   }
      EntityType.BlankLine,       // line #10:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 5', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(2521, 2818)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,         // line #1: {
      EntityType.MainConstructor, // line #2:   FormalParameterScope(
      EntityType.MainConstructor, // line #3:     Scope parent,
      EntityType.MainConstructor, // line #4:     List<ParameterElement> elements,
      EntityType.MainConstructor, // line #5:   ) : super(parent) {
      EntityType.MainConstructor, // line #6:     for (var parameter in elements) {
      EntityType.MainConstructor, // line #7:       if (parameter is! FieldFormalParameterElement) {
      EntityType.MainConstructor, // line #8:         _addGetter(parameter);
      EntityType.MainConstructor, // line #9:       }
      EntityType.MainConstructor, // line #10:     }
      EntityType.MainConstructor, // line #11:   }
      EntityType.BlankLine,       // line #12:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 6', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(2818, 5338)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #1: {
      EntityType.PrivateInstanceVariable, // line #2:   final LibraryElement _element;
      EntityType.InstanceVariable,        // line #3:   final List<ExtensionElement> extensions = [];
      EntityType.BlankLine,               // line #4:
      EntityType.MainConstructor,         // line #5:   LibraryScope(LibraryElement element)
      EntityType.MainConstructor,         // line #6:       : _element = element,
      EntityType.MainConstructor,         // line #7:         super(_LibraryImportScope(element)) {
      EntityType.MainConstructor,         // line #8:     extensions.addAll((_parent as _LibraryImportScope).extensions);
      EntityType.MainConstructor,         // line #9:
      EntityType.MainConstructor,         // line #10:     _element.prefixes.forEach(_addGetter);
      EntityType.MainConstructor,         // line #11:     _element.units.forEach(_addUnitElements);
      EntityType.MainConstructor,         // line #12:   }
      EntityType.BlankLine,               // line #13:
      EntityType.OtherMethod,             // line #14:   bool shouldIgnoreUndefined({
      EntityType.OtherMethod,             // line #15:     @required String prefix,
      EntityType.OtherMethod,             // line #16:     @required String name,
      EntityType.OtherMethod,             // line #17:   }) {
      EntityType.OtherMethod,             // line #18:     Iterable<NamespaceCombinator> getShowCombinators(
      EntityType.OtherMethod,             // line #19:         ImportElement importElement) {
      EntityType.OtherMethod,             // line #20:       return importElement.combinators.whereType<ShowElementCombinator>();
      EntityType.OtherMethod,             // line #21:     }
      EntityType.OtherMethod,             // line #22:
      EntityType.OtherMethod,             // line #23:     if (prefix != null) {
      EntityType.OtherMethod,             // line #24:       for (var importElement in _element.imports) {
      EntityType.OtherMethod,             // line #25:         if (importElement.prefix?.name == prefix &&
      EntityType.OtherMethod,             // line #26:             importElement.importedLibrary?.isSynthetic != false) {
      EntityType.OtherMethod,             // line #27:           var showCombinators = getShowCombinators(importElement);
      EntityType.OtherMethod,             // line #28:           if (showCombinators.isEmpty) {
      EntityType.OtherMethod,             // line #29:             return true;
      EntityType.OtherMethod,             // line #30:           }
      EntityType.OtherMethod,             // line #31:           for (ShowElementCombinator combinator in showCombinators) {
      EntityType.OtherMethod,             // line #32:             if (combinator.shownNames.contains(name)) {
      EntityType.OtherMethod,             // line #33:               return true;
      EntityType.OtherMethod,             // line #34:             }
      EntityType.OtherMethod,             // line #35:           }
      EntityType.OtherMethod,             // line #36:         }
      EntityType.OtherMethod,             // line #37:       }
      EntityType.OtherMethod,             // line #38:     } else {
      EntityType.OtherMethod,             // line #39:       // TODO(scheglov) merge for(s).
      EntityType.OtherMethod,             // line #40:       for (var importElement in _element.imports) {
      EntityType.OtherMethod,             // line #41:         if (importElement.prefix == null &&
      EntityType.OtherMethod,             // line #42:             importElement.importedLibrary?.isSynthetic != false) {
      EntityType.OtherMethod,             // line #43:           for (ShowElementCombinator combinator
      EntityType.OtherMethod,             // line #44:               in getShowCombinators(importElement)) {
      EntityType.OtherMethod,             // line #45:             if (combinator.shownNames.contains(name)) {
      EntityType.OtherMethod,             // line #46:               return true;
      EntityType.OtherMethod,             // line #47:             }
      EntityType.OtherMethod,             // line #48:           }
      EntityType.OtherMethod,             // line #49:         }
      EntityType.OtherMethod,             // line #50:       }
      EntityType.OtherMethod,             // line #51:
      EntityType.OtherMethod,             // line #52:       if (name.startsWith(r'_$')) {
      EntityType.OtherMethod,             // line #53:         for (var partElement in _element.parts) {
      EntityType.OtherMethod,             // line #54:           if (partElement.isSynthetic &&
      EntityType.OtherMethod,             // line #55:               isGeneratedSource(partElement.source)) {
      EntityType.OtherMethod,             // line #56:             return true;
      EntityType.OtherMethod,             // line #57:           }
      EntityType.OtherMethod,             // line #58:         }
      EntityType.OtherMethod,             // line #59:       }
      EntityType.OtherMethod,             // line #60:     }
      EntityType.OtherMethod,             // line #61:
      EntityType.OtherMethod,             // line #62:     return false;
      EntityType.OtherMethod,             // line #63:   }
      EntityType.BlankLine,               // line #64:
      EntityType.OtherMethod,             // line #65:   void _addExtension(ExtensionElement element) {
      EntityType.OtherMethod,             // line #66:     _addGetter(element);
      EntityType.OtherMethod,             // line #67:     if (!extensions.contains(element)) {
      EntityType.OtherMethod,             // line #68:       extensions.add(element);
      EntityType.OtherMethod,             // line #69:     }
      EntityType.OtherMethod,             // line #70:   }
      EntityType.BlankLine,               // line #71:
      EntityType.OtherMethod,             // line #72:   void _addUnitElements(CompilationUnitElement compilationUnit) {
      EntityType.OtherMethod,             // line #73:     compilationUnit.accessors.forEach(_addPropertyAccessor);
      EntityType.OtherMethod,             // line #74:     compilationUnit.enums.forEach(_addGetter);
      EntityType.OtherMethod,             // line #75:     compilationUnit.extensions.forEach(_addExtension);
      EntityType.OtherMethod,             // line #76:     compilationUnit.functions.forEach(_addGetter);
      EntityType.OtherMethod,             // line #77:     compilationUnit.functionTypeAliases.forEach(_addGetter);
      EntityType.OtherMethod,             // line #78:     compilationUnit.mixins.forEach(_addGetter);
      EntityType.OtherMethod,             // line #79:     compilationUnit.types.forEach(_addGetter);
      EntityType.OtherMethod,             // line #80:   }
      EntityType.BlankLine,               // line #81:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 7', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(5338, 5486)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,         // line #1: {
      EntityType.MainConstructor, // line #2:   LocalScope(Scope parent) : super(parent);
      EntityType.BlankLine,       // line #3:
      EntityType.OtherMethod,     // line #4:   void add(Element element) {
      EntityType.OtherMethod,     // line #5:     _addGetter(element);
      EntityType.OtherMethod,     // line #6:   }
      EntityType.BlankLine,       // line #7:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 8', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(5486, 8326)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #1: {
      EntityType.PrivateInstanceVariable, // line #2:   final LibraryElement _library;
      EntityType.PrivateInstanceVariable, // line #3:   final Map<String, Element> _getters = {};
      EntityType.PrivateInstanceVariable, // line #4:   final Map<String, Element> _setters = {};
      EntityType.PrivateInstanceVariable, // line #5:   final Set<ExtensionElement> _extensions = {};
      EntityType.PrivateInstanceVariable, // line #6:   LibraryElement _deferredLibrary;
      EntityType.BlankLine,               // line #7:
      EntityType.MainConstructor,         // line #8:   PrefixScope(this._library, PrefixElement prefix) {
      EntityType.MainConstructor,         // line #9:     for (var import in _library.imports) {
      EntityType.MainConstructor,         // line #10:       if (import.prefix == prefix) {
      EntityType.MainConstructor,         // line #11:         var elements = impl.NamespaceBuilder().getImportedElements(import);
      EntityType.MainConstructor,         // line #12:         elements.forEach(_add);
      EntityType.MainConstructor,         // line #13:         if (import.isDeferred) {
      EntityType.MainConstructor,         // line #14:           _deferredLibrary ??= import.importedLibrary;
      EntityType.MainConstructor,         // line #15:         }
      EntityType.MainConstructor,         // line #16:       }
      EntityType.MainConstructor,         // line #17:     }
      EntityType.MainConstructor,         // line #18:   }
      EntityType.BlankLine,               // line #19:
      EntityType.OverrideMethod,          // line #20:   @Deprecated('Use lookup2() that is closer to the language specification')
      EntityType.OverrideMethod,          // line #21:   @override
      EntityType.OverrideMethod,          // line #22:   Element lookup({@required String id, @required bool setter}) {
      EntityType.OverrideMethod,          // line #23:     var result = lookup2(id);
      EntityType.OverrideMethod,          // line #24:     return setter ? result.setter : result.getter;
      EntityType.OverrideMethod,          // line #25:   }
      EntityType.BlankLine,               // line #26:
      EntityType.OverrideMethod,          // line #27:   @override
      EntityType.OverrideMethod,          // line #28:   ScopeLookupResult lookup2(String id) {
      EntityType.OverrideMethod,          // line #29:     if (_deferredLibrary != null && id == FunctionElement.LOAD_LIBRARY_NAME) {
      EntityType.OverrideMethod,          // line #30:       return ScopeLookupResult(_deferredLibrary.loadLibraryFunction, null);
      EntityType.OverrideMethod,          // line #31:     }
      EntityType.OverrideMethod,          // line #32:
      EntityType.OverrideMethod,          // line #33:     var getter = _getters[id];
      EntityType.OverrideMethod,          // line #34:     var setter = _setters[id];
      EntityType.OverrideMethod,          // line #35:     return ScopeLookupResult(getter, setter);
      EntityType.OverrideMethod,          // line #36:   }
      EntityType.BlankLine,               // line #37:
      EntityType.OtherMethod,             // line #38:   void _add(Element element) {
      EntityType.OtherMethod,             // line #39:     if (element is PropertyAccessorElement && element.isSetter) {
      EntityType.OtherMethod,             // line #40:       _addTo(map: _setters, element: element);
      EntityType.OtherMethod,             // line #41:     } else {
      EntityType.OtherMethod,             // line #42:       _addTo(map: _getters, element: element);
      EntityType.OtherMethod,             // line #43:       if (element is ExtensionElement) {
      EntityType.OtherMethod,             // line #44:         _extensions.add(element);
      EntityType.OtherMethod,             // line #45:       }
      EntityType.OtherMethod,             // line #46:     }
      EntityType.OtherMethod,             // line #47:   }
      EntityType.BlankLine,               // line #48:
      EntityType.OtherMethod,             // line #49:   void _addTo({
      EntityType.OtherMethod,             // line #50:     @required Map<String, Element> map,
      EntityType.OtherMethod,             // line #51:     @required Element element,
      EntityType.OtherMethod,             // line #52:   }) {
      EntityType.OtherMethod,             // line #53:     var id = element.displayName;
      EntityType.OtherMethod,             // line #54:
      EntityType.OtherMethod,             // line #55:     var existing = map[id];
      EntityType.OtherMethod,             // line #56:     if (existing != null && existing != element) {
      EntityType.OtherMethod,             // line #57:       map[id] = _merge(existing, element);
      EntityType.OtherMethod,             // line #58:       return;
      EntityType.OtherMethod,             // line #59:     }
      EntityType.OtherMethod,             // line #60:
      EntityType.OtherMethod,             // line #61:     map[id] = element;
      EntityType.OtherMethod,             // line #62:   }
      EntityType.BlankLine,               // line #63:
      EntityType.OtherMethod,             // line #64:   Element _merge(Element existing, Element other) {
      EntityType.OtherMethod,             // line #65:     if (_isSdkElement(existing)) {
      EntityType.OtherMethod,             // line #66:       if (!_isSdkElement(other)) {
      EntityType.OtherMethod,             // line #67:         return other;
      EntityType.OtherMethod,             // line #68:       }
      EntityType.OtherMethod,             // line #69:     } else {
      EntityType.OtherMethod,             // line #70:       if (_isSdkElement(other)) {
      EntityType.OtherMethod,             // line #71:         return existing;
      EntityType.OtherMethod,             // line #72:       }
      EntityType.OtherMethod,             // line #73:     }
      EntityType.OtherMethod,             // line #74:
      EntityType.OtherMethod,             // line #75:     var conflictingElements = <Element>{};
      EntityType.OtherMethod,             // line #76:     _addElement(conflictingElements, existing);
      EntityType.OtherMethod,             // line #77:     _addElement(conflictingElements, other);
      EntityType.OtherMethod,             // line #78:
      EntityType.OtherMethod,             // line #79:     return MultiplyDefinedElementImpl(
      EntityType.OtherMethod,             // line #80:       _library.context,
      EntityType.OtherMethod,             // line #81:       _library.session,
      EntityType.OtherMethod,             // line #82:       conflictingElements.first.name,
      EntityType.OtherMethod,             // line #83:       conflictingElements.toList(),
      EntityType.OtherMethod,             // line #84:     );
      EntityType.OtherMethod,             // line #85:   }
      EntityType.BlankLine,               // line #86:
      EntityType.OtherMethod,             // line #87:   static void _addElement(
      EntityType.OtherMethod,             // line #88:     Set<Element> conflictingElements,
      EntityType.OtherMethod,             // line #89:     Element element,
      EntityType.OtherMethod,             // line #90:   ) {
      EntityType.OtherMethod,             // line #91:     if (element is MultiplyDefinedElementImpl) {
      EntityType.OtherMethod,             // line #92:       conflictingElements.addAll(element.conflictingElements);
      EntityType.OtherMethod,             // line #93:     } else {
      EntityType.OtherMethod,             // line #94:       conflictingElements.add(element);
      EntityType.OtherMethod,             // line #95:     }
      EntityType.OtherMethod,             // line #96:   }
      EntityType.BlankLine,               // line #97:
      EntityType.OtherMethod,             // line #98:   static bool _isSdkElement(Element element) {
      EntityType.OtherMethod,             // line #99:     if (element is DynamicElementImpl || element is NeverElementImpl) {
      EntityType.OtherMethod,             // line #100:       return true;
      EntityType.OtherMethod,             // line #101:     }
      EntityType.OtherMethod,             // line #102:     if (element is MultiplyDefinedElement) {
      EntityType.OtherMethod,             // line #103:       return false;
      EntityType.OtherMethod,             // line #104:     }
      EntityType.OtherMethod,             // line #105:     return element.library.isInSdk;
      EntityType.OtherMethod,             // line #106:   }
      EntityType.BlankLine,               // line #107:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 9', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(8326, 8519)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,         // line #1: {
      EntityType.MainConstructor, // line #2:   TypeParameterScope(
      EntityType.MainConstructor, // line #3:     Scope parent,
      EntityType.MainConstructor, // line #4:     List<TypeParameterElement> elements,
      EntityType.MainConstructor, // line #5:   ) : super(parent) {
      EntityType.MainConstructor, // line #6:     elements.forEach(_addGetter);
      EntityType.MainConstructor, // line #7:   }
      EntityType.BlankLine,       // line #8:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })

  test('Scope class 10', async () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'scope.dart.txt'), 'utf8').substring(8519, 9323)
    // wantSource := scope_want_txt[2248:]

    const want: EntityType[] = [
      EntityType.Unknown,                 // line #1: {
      EntityType.PrivateInstanceVariable, // line #2:   final LibraryElement _library;
      EntityType.PrivateInstanceVariable, // line #3:   final PrefixScope _nullPrefixScope;
      EntityType.PrivateInstanceVariable, // line #4:   List<ExtensionElement> _extensions;
      EntityType.BlankLine,               // line #5:
      EntityType.MainConstructor,         // line #6:   _LibraryImportScope(LibraryElement library)
      EntityType.MainConstructor,         // line #7:       : _library = library,
      EntityType.MainConstructor,         // line #8:         _nullPrefixScope = PrefixScope(library, null);
      EntityType.BlankLine,               // line #9:
      EntityType.OtherMethod,             // line #10:   List<ExtensionElement> get extensions {
      EntityType.OtherMethod,             // line #11:     return _extensions ??= {
      EntityType.OtherMethod,             // line #12:       ..._nullPrefixScope._extensions,
      EntityType.OtherMethod,             // line #13:       for (var prefix in _library.prefixes)
      EntityType.OtherMethod,             // line #14:         ...(prefix.scope as PrefixScope)._extensions,
      EntityType.OtherMethod,             // line #15:     }.toList();
      EntityType.OtherMethod,             // line #16:   }
      EntityType.BlankLine,               // line #17:
      EntityType.OverrideMethod,          // line #18:   @Deprecated('Use lookup2() that is closer to the language specification')
      EntityType.OverrideMethod,          // line #19:   @override
      EntityType.OverrideMethod,          // line #20:   Element lookup({@required String id, @required bool setter}) {
      EntityType.OverrideMethod,          // line #21:     throw UnimplementedError();
      EntityType.OverrideMethod,          // line #22:   }
      EntityType.BlankLine,               // line #23:
      EntityType.OverrideMethod,          // line #24:   @override
      EntityType.OverrideMethod,          // line #25:   ScopeLookupResult lookup2(String id) {
      EntityType.OverrideMethod,          // line #26:     return _nullPrefixScope.lookup2(id);
      EntityType.OverrideMethod,          // line #27:   }
      EntityType.BlankLine,               // line #28:
    ]

    runParsePhase(null, source, want)
    // runFullStylizer(null, source, wantSource, want)
  })
})
