//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert'

import * as vscode from 'vscode'
import * as stylizer from '../../../extension'
const fs = require('fs')
const path = require('path')

// Defines a Mocha test suite to group tests of similar kind together
suite('Issue#20 Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')

  const newDoc = async () => {
    const doc = await vscode.workspace.openTextDocument({ language: 'dart' })
    await vscode.window.showTextDocument(doc)
    return doc
  }

  const newEditor = async (doc: vscode.TextDocument, source: string) => {
    const editor = vscode.window.activeTextEditor
    await editor!.edit((editBuilder: vscode.TextEditorEdit) => {
      editBuilder.insert(doc.positionAt(0), source)
    })
    assert.notStrictEqual(editor, null)
    return editor!
  }

  test('Issue#20: spurious lines should not be added', async () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue20.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue20_want.txt'), 'utf8')

    const doc = await newDoc()
    const editor = await newEditor(doc, source)
    const got = await stylizer.getClasses(editor!, groupAndSortGetterMethods)
    assert.strictEqual(got.length, 1)

    const want = [
      stylizer.EntityType.Unknown,  // {
      stylizer.EntityType.InstanceVariable,  //   final String typeName;
      stylizer.EntityType.PrivateInstanceVariable,  //   final int _attributes;
      stylizer.EntityType.InstanceVariable,  //   final int baseTypeToken;
      stylizer.EntityType.InstanceVariable,  //   final TypeIdentifier? typeSpec;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.PrivateInstanceVariable,  //   final _interfaces = <TypeDef>[];
      stylizer.EntityType.PrivateInstanceVariable,  //   final _fields = <Field>[];
      stylizer.EntityType.PrivateInstanceVariable,  //   final _methods = <Method>[];
      stylizer.EntityType.PrivateInstanceVariable,  //   final _properties = <Property>[];
      stylizer.EntityType.PrivateInstanceVariable,  //   final _events = <Event>[];
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   TypeVisibility get typeVisibility =>
      stylizer.EntityType.OtherMethod,  //       TypeVisibility.values[_attributes & CorTypeAttr.tdVisibilityMask];
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   TypeLayout get typeLayout {
      stylizer.EntityType.OtherMethod,  //     switch (_attributes & CorTypeAttr.tdLayoutMask) {
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdAutoLayout:
      stylizer.EntityType.OtherMethod,  //         return TypeLayout.auto;
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdSequentialLayout:
      stylizer.EntityType.OtherMethod,  //         return TypeLayout.sequential;
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdExplicitLayout:
      stylizer.EntityType.OtherMethod,  //         return TypeLayout.explicit;
      stylizer.EntityType.OtherMethod,  //       default:
      stylizer.EntityType.OtherMethod,  //         throw WinmdException('Attribute missing type layout information');
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Is the type a class?
      stylizer.EntityType.OtherMethod,  //   bool get isClass =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdClassSemanticsMask == CorTypeAttr.tdClass;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Is the type an interface?
      stylizer.EntityType.OtherMethod,  //   bool get isInterface =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdClassSemanticsMask == CorTypeAttr.tdInterface;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isAbstract =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdAbstract == CorTypeAttr.tdAbstract;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isSealed =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdSealed == CorTypeAttr.tdSealed;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isSpecialName =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdSpecialName == CorTypeAttr.tdSpecialName;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isImported =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdImport == CorTypeAttr.tdImport;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isSerializable =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdSerializable == CorTypeAttr.tdSerializable;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isWindowsRuntime =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdWindowsRuntime ==
      stylizer.EntityType.OtherMethod,  //       CorTypeAttr.tdWindowsRuntime;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isRTSpecialName =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdRTSpecialName == CorTypeAttr.tdRTSpecialName;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   StringFormat get stringFormat {
      stylizer.EntityType.OtherMethod,  //     switch (_attributes & CorTypeAttr.tdStringFormatMask) {
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdAnsiClass:
      stylizer.EntityType.OtherMethod,  //         return StringFormat.ansi;
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdUnicodeClass:
      stylizer.EntityType.OtherMethod,  //         return StringFormat.unicode;
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdAutoClass:
      stylizer.EntityType.OtherMethod,  //         return StringFormat.auto;
      stylizer.EntityType.OtherMethod,  //       case CorTypeAttr.tdCustomFormatClass:
      stylizer.EntityType.OtherMethod,  //         return StringFormat.custom;
      stylizer.EntityType.OtherMethod,  //       default:
      stylizer.EntityType.OtherMethod,  //         throw WinmdException('Attribute missing string format information');
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isBeforeFieldInit =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdBeforeFieldInit ==
      stylizer.EntityType.OtherMethod,  //       CorTypeAttr.tdBeforeFieldInit;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   bool get isForwarder =>
      stylizer.EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdForwarder == CorTypeAttr.tdForwarder;
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Is the type a delegate?
      stylizer.EntityType.OtherMethod,  //   bool get isDelegate => parent?.typeName == 'System.MulticastDelegate';
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Retrieve class layout information.
      stylizer.EntityType.OtherMethod,  //   ///
      stylizer.EntityType.OtherMethod,  //   /// This includes the packing alignment, the minimum class size, and the field
      stylizer.EntityType.OtherMethod,  //   /// layout (e.g. for sparsely or overlapping structs).
      stylizer.EntityType.OtherMethod,  //   ClassLayout get classLayout => ClassLayout(reader, token);
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Is the type a non-Windows Runtime type, such as System.Object or
      stylizer.EntityType.OtherMethod,  //   /// IInspectable?
      stylizer.EntityType.OtherMethod,  //   ///
      stylizer.EntityType.OtherMethod,  //   /// More information at:
      stylizer.EntityType.OtherMethod,  //   /// https://docs.microsoft.com/en-us/uwp/winrt-cref/winmd-files#type-system-encoding
      stylizer.EntityType.OtherMethod,  //   bool get isSystemType => systemTokens.containsValue(typeName);
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.MainConstructor,  //   /// Create a typedef.
      stylizer.EntityType.MainConstructor,  //   ///
      stylizer.EntityType.MainConstructor,  //   /// Typically, typedefs should be obtained from a [WinmdScope] object rather
      stylizer.EntityType.MainConstructor,  //   /// than being created directly.
      stylizer.EntityType.MainConstructor,  //   TypeDef(IMetaDataImport2 reader,
      stylizer.EntityType.MainConstructor,  //       [int token = 0,
      stylizer.EntityType.MainConstructor,  //       this.typeName = '',
      stylizer.EntityType.MainConstructor,  //       this._attributes = 0,
      stylizer.EntityType.MainConstructor,  //       this.baseTypeToken = 0,
      stylizer.EntityType.MainConstructor,  //       this.typeSpec])
      stylizer.EntityType.MainConstructor,  //       : super(reader, token);
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.NamedConstructor,  //   /// Creates a typedef object from its given token.
      stylizer.EntityType.NamedConstructor,  //   factory TypeDef.fromToken(IMetaDataImport2 reader, int token) {
      stylizer.EntityType.NamedConstructor,  //     switch (token & 0xFF000000) {
      stylizer.EntityType.NamedConstructor,  //       case CorTokenType.mdtTypeRef:
      stylizer.EntityType.NamedConstructor,  //         return TypeDef.fromTypeRefToken(reader, token);
      stylizer.EntityType.NamedConstructor,  //       case CorTokenType.mdtTypeDef:
      stylizer.EntityType.NamedConstructor,  //         return TypeDef.fromTypeDefToken(reader, token);
      stylizer.EntityType.NamedConstructor,  //       case CorTokenType.mdtTypeSpec:
      stylizer.EntityType.NamedConstructor,  //         return TypeDef.fromTypeSpecToken(reader, token);
      stylizer.EntityType.NamedConstructor,  //       default:
      stylizer.EntityType.NamedConstructor,  //         throw WinmdException('Unrecognized token ${token.toHexString(32)}');
      stylizer.EntityType.NamedConstructor,  //     }
      stylizer.EntityType.NamedConstructor,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.NamedConstructor,  //   /// Instantiate a typedef from a TypeDef token.
      stylizer.EntityType.NamedConstructor,  //   factory TypeDef.fromTypeDefToken(IMetaDataImport2 reader, int typeDefToken) {
      stylizer.EntityType.NamedConstructor,  //     final szTypeDef = stralloc(MAX_STRING_SIZE);
      stylizer.EntityType.NamedConstructor,  //     final pchTypeDef = calloc<ULONG>();
      stylizer.EntityType.NamedConstructor,  //     final pdwTypeDefFlags = calloc<DWORD>();
      stylizer.EntityType.NamedConstructor,  //     final ptkExtends = calloc<mdToken>();
      stylizer.EntityType.NamedConstructor,  //
      stylizer.EntityType.NamedConstructor,  //     try {
      stylizer.EntityType.NamedConstructor,  //       final hr = reader.GetTypeDefProps(typeDefToken, szTypeDef,
      stylizer.EntityType.NamedConstructor,  //           MAX_STRING_SIZE, pchTypeDef, pdwTypeDefFlags, ptkExtends);
      stylizer.EntityType.NamedConstructor,  //
      stylizer.EntityType.NamedConstructor,  //       if (SUCCEEDED(hr)) {
      stylizer.EntityType.NamedConstructor,  //         return TypeDef(reader, typeDefToken, szTypeDef.toDartString(),
      stylizer.EntityType.NamedConstructor,  //             pdwTypeDefFlags.value, ptkExtends.value);
      stylizer.EntityType.NamedConstructor,  //       } else {
      stylizer.EntityType.NamedConstructor,  //         throw WindowsException(hr);
      stylizer.EntityType.NamedConstructor,  //       }
      stylizer.EntityType.NamedConstructor,  //     } finally {
      stylizer.EntityType.NamedConstructor,  //       free(pchTypeDef);
      stylizer.EntityType.NamedConstructor,  //       free(pdwTypeDefFlags);
      stylizer.EntityType.NamedConstructor,  //       free(ptkExtends);
      stylizer.EntityType.NamedConstructor,  //       free(szTypeDef);
      stylizer.EntityType.NamedConstructor,  //     }
      stylizer.EntityType.NamedConstructor,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.NamedConstructor,  //   /// Instantiate a typedef from a TypeRef token.
      stylizer.EntityType.NamedConstructor,  //   ///
      stylizer.EntityType.NamedConstructor,  //   /// Unless the TypeRef token is `IInspectable`, the COM parent interface for
      stylizer.EntityType.NamedConstructor,  //   /// Windows Runtime classes, the TypeRef is used to obtain the host scope
      stylizer.EntityType.NamedConstructor,  //   /// metadata file, from which the TypeDef can be found and returned.
      stylizer.EntityType.NamedConstructor,  //   factory TypeDef.fromTypeRefToken(IMetaDataImport2 reader, int typeRefToken) {
      stylizer.EntityType.NamedConstructor,  //     final ptkResolutionScope = calloc<mdToken>();
      stylizer.EntityType.NamedConstructor,  //     final szName = stralloc(MAX_STRING_SIZE);
      stylizer.EntityType.NamedConstructor,  //     final pchName = calloc<ULONG>();
      stylizer.EntityType.NamedConstructor,  //
      stylizer.EntityType.NamedConstructor,  //     try {
      stylizer.EntityType.NamedConstructor,  //       final hr = reader.GetTypeRefProps(
      stylizer.EntityType.NamedConstructor,  //           typeRefToken, ptkResolutionScope, szName, MAX_STRING_SIZE, pchName);
      stylizer.EntityType.NamedConstructor,  //
      stylizer.EntityType.NamedConstructor,  //       if (SUCCEEDED(hr)) {
      stylizer.EntityType.NamedConstructor,  //         final typeName = szName.toDartString();
      stylizer.EntityType.NamedConstructor,  //         try {
      stylizer.EntityType.NamedConstructor,  //           final newScope = MetadataStore.getScopeForType(typeName);
      stylizer.EntityType.NamedConstructor,  //           return newScope.findTypeDef(typeName)!;
      stylizer.EntityType.NamedConstructor,  //         } catch (exception) {
      stylizer.EntityType.NamedConstructor,  //           // a token like IInspectable is out of reach of GetTypeRefProps, since it is
      stylizer.EntityType.NamedConstructor,  //           // a plain COM object. These objects are returned as system types.
      stylizer.EntityType.NamedConstructor,  //           if (systemTokens.containsKey(typeRefToken)) {
      stylizer.EntityType.NamedConstructor,  //             return TypeDef(reader, 0, systemTokens[typeRefToken]!);
      stylizer.EntityType.NamedConstructor,  //           }
      stylizer.EntityType.NamedConstructor,  //           if (systemTokens.containsValue(typeName)) {
      stylizer.EntityType.NamedConstructor,  //             return TypeDef(reader, 0, typeName);
      stylizer.EntityType.NamedConstructor,  //           }
      stylizer.EntityType.NamedConstructor,  //           // Perhaps we can find it in the current scope after all (for example,
      stylizer.EntityType.NamedConstructor,  //           // it's a nested class)
      stylizer.EntityType.NamedConstructor,  //           try {
      stylizer.EntityType.NamedConstructor,  //             final typedef = TypeDef.fromTypeDefToken(reader, typeRefToken);
      stylizer.EntityType.NamedConstructor,  //             return typedef;
      stylizer.EntityType.NamedConstructor,  //           } catch (exception) {
      stylizer.EntityType.NamedConstructor,  //             throw WinmdException(
      stylizer.EntityType.NamedConstructor,  //                 'Unable to find scope for $typeName [${typeRefToken.toHexString(32)}]...');
      stylizer.EntityType.NamedConstructor,  //           }
      stylizer.EntityType.NamedConstructor,  //         }
      stylizer.EntityType.NamedConstructor,  //       } else {
      stylizer.EntityType.NamedConstructor,  //         throw WindowsException(hr);
      stylizer.EntityType.NamedConstructor,  //       }
      stylizer.EntityType.NamedConstructor,  //     } finally {
      stylizer.EntityType.NamedConstructor,  //       free(ptkResolutionScope);
      stylizer.EntityType.NamedConstructor,  //       free(szName);
      stylizer.EntityType.NamedConstructor,  //       free(pchName);
      stylizer.EntityType.NamedConstructor,  //     }
      stylizer.EntityType.NamedConstructor,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.NamedConstructor,  //   /// Instantiate a typedef from a TypeSpec token.
      stylizer.EntityType.NamedConstructor,  //   factory TypeDef.fromTypeSpecToken(
      stylizer.EntityType.NamedConstructor,  //       IMetaDataImport2 reader, int typeSpecToken) {
      stylizer.EntityType.NamedConstructor,  //     final ppvSig = calloc<PCCOR_SIGNATURE>();
      stylizer.EntityType.NamedConstructor,  //     final pcbSig = calloc<ULONG>();
      stylizer.EntityType.NamedConstructor,  //
      stylizer.EntityType.NamedConstructor,  //     try {
      stylizer.EntityType.NamedConstructor,  //       final hr =
      stylizer.EntityType.NamedConstructor,  //           reader.GetTypeSpecFromToken(typeSpecToken, ppvSig.cast(), pcbSig);
      stylizer.EntityType.NamedConstructor,  //       final signature = ppvSig.value.asTypedList(pcbSig.value);
      stylizer.EntityType.NamedConstructor,  //       final typeTuple = parseTypeFromSignature(signature, reader);
      stylizer.EntityType.NamedConstructor,  //
      stylizer.EntityType.NamedConstructor,  //       if (SUCCEEDED(hr)) {
      stylizer.EntityType.NamedConstructor,  //         return TypeDef(
      stylizer.EntityType.NamedConstructor,  //             reader, typeSpecToken, '', 0, 0, typeTuple.typeIdentifier);
      stylizer.EntityType.NamedConstructor,  //       } else {
      stylizer.EntityType.NamedConstructor,  //         throw WindowsException(hr);
      stylizer.EntityType.NamedConstructor,  //       }
      stylizer.EntityType.NamedConstructor,  //     } finally {
      stylizer.EntityType.NamedConstructor,  //       free(ppvSig);
      stylizer.EntityType.NamedConstructor,  //       free(pcbSig);
      stylizer.EntityType.NamedConstructor,  //     }
      stylizer.EntityType.NamedConstructor,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Converts an individual interface into a type.
      stylizer.EntityType.OtherMethod,  //   TypeDef processInterfaceToken(int token) {
      stylizer.EntityType.OtherMethod,  //     final ptkClass = calloc<mdTypeDef>();
      stylizer.EntityType.OtherMethod,  //     final ptkIface = calloc<mdToken>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //     try {
      stylizer.EntityType.OtherMethod,  //       final hr = reader.GetInterfaceImplProps(token, ptkClass, ptkIface);
      stylizer.EntityType.OtherMethod,  //       if (SUCCEEDED(hr)) {
      stylizer.EntityType.OtherMethod,  //         final interfaceToken = ptkIface.value;
      stylizer.EntityType.OtherMethod,  //         return TypeDef.fromToken(reader, interfaceToken);
      stylizer.EntityType.OtherMethod,  //       } else {
      stylizer.EntityType.OtherMethod,  //         throw WindowsException(hr);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     } finally {
      stylizer.EntityType.OtherMethod,  //       free(ptkClass);
      stylizer.EntityType.OtherMethod,  //       free(ptkIface);
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Enumerate all interfaces that this type implements.
      stylizer.EntityType.OtherMethod,  //   List<TypeDef> get interfaces {
      stylizer.EntityType.OtherMethod,  //     if (_interfaces.isEmpty) {
      stylizer.EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      stylizer.EntityType.OtherMethod,  //       final rImpls = calloc<mdInterfaceImpl>();
      stylizer.EntityType.OtherMethod,  //       final pcImpls = calloc<ULONG>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //       try {
      stylizer.EntityType.OtherMethod,  //         var hr = reader.EnumInterfaceImpls(phEnum, token, rImpls, 1, pcImpls);
      stylizer.EntityType.OtherMethod,  //         while (hr == S_OK) {
      stylizer.EntityType.OtherMethod,  //           final interfaceToken = rImpls.value;
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //           _interfaces.add(processInterfaceToken(interfaceToken));
      stylizer.EntityType.OtherMethod,  //           hr = reader.EnumInterfaceImpls(phEnum, token, rImpls, 1, pcImpls);
      stylizer.EntityType.OtherMethod,  //         }
      stylizer.EntityType.OtherMethod,  //       } finally {
      stylizer.EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      stylizer.EntityType.OtherMethod,  //         free(phEnum);
      stylizer.EntityType.OtherMethod,  //         free(rImpls);
      stylizer.EntityType.OtherMethod,  //         free(pcImpls);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //     return _interfaces;
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Enumerate all fields contained within this type.
      stylizer.EntityType.OtherMethod,  //   List<Field> get fields {
      stylizer.EntityType.OtherMethod,  //     if (_fields.isEmpty) {
      stylizer.EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      stylizer.EntityType.OtherMethod,  //       final rgFields = calloc<mdFieldDef>();
      stylizer.EntityType.OtherMethod,  //       final pcTokens = calloc<ULONG>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //       try {
      stylizer.EntityType.OtherMethod,  //         var hr = reader.EnumFields(phEnum, token, rgFields, 1, pcTokens);
      stylizer.EntityType.OtherMethod,  //         while (hr == S_OK) {
      stylizer.EntityType.OtherMethod,  //           final fieldToken = rgFields.value;
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //           _fields.add(Field.fromToken(reader, fieldToken));
      stylizer.EntityType.OtherMethod,  //           hr = reader.EnumFields(phEnum, token, rgFields, 1, pcTokens);
      stylizer.EntityType.OtherMethod,  //         }
      stylizer.EntityType.OtherMethod,  //       } finally {
      stylizer.EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      stylizer.EntityType.OtherMethod,  //         free(phEnum);
      stylizer.EntityType.OtherMethod,  //         free(rgFields);
      stylizer.EntityType.OtherMethod,  //         free(pcTokens);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //     return _fields;
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Enumerate all methods contained within this type.
      stylizer.EntityType.OtherMethod,  //   List<Method> get methods {
      stylizer.EntityType.OtherMethod,  //     if (_methods.isEmpty) {
      stylizer.EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      stylizer.EntityType.OtherMethod,  //       final rgMethods = calloc<mdMethodDef>();
      stylizer.EntityType.OtherMethod,  //       final pcTokens = calloc<ULONG>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //       try {
      stylizer.EntityType.OtherMethod,  //         var hr = reader.EnumMethods(phEnum, token, rgMethods, 1, pcTokens);
      stylizer.EntityType.OtherMethod,  //         while (hr == S_OK) {
      stylizer.EntityType.OtherMethod,  //           final methodToken = rgMethods.value;
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //           _methods.add(Method.fromToken(reader, methodToken));
      stylizer.EntityType.OtherMethod,  //           hr = reader.EnumMethods(phEnum, token, rgMethods, 1, pcTokens);
      stylizer.EntityType.OtherMethod,  //         }
      stylizer.EntityType.OtherMethod,  //       } finally {
      stylizer.EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      stylizer.EntityType.OtherMethod,  //         free(phEnum);
      stylizer.EntityType.OtherMethod,  //         free(rgMethods);
      stylizer.EntityType.OtherMethod,  //         free(pcTokens);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //     return _methods;
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Enumerate all properties contained within this type.
      stylizer.EntityType.OtherMethod,  //   List<Property> get properties {
      stylizer.EntityType.OtherMethod,  //     if (_properties.isEmpty) {
      stylizer.EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      stylizer.EntityType.OtherMethod,  //       final rgProperties = calloc<mdProperty>();
      stylizer.EntityType.OtherMethod,  //       final pcProperties = calloc<ULONG>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //       try {
      stylizer.EntityType.OtherMethod,  //         var hr =
      stylizer.EntityType.OtherMethod,  //             reader.EnumProperties(phEnum, token, rgProperties, 1, pcProperties);
      stylizer.EntityType.OtherMethod,  //         while (hr == S_OK) {
      stylizer.EntityType.OtherMethod,  //           final propertyToken = rgProperties.value;
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //           _properties.add(Property.fromToken(reader, propertyToken));
      stylizer.EntityType.OtherMethod,  //           hr = reader.EnumMethods(phEnum, token, rgProperties, 1, pcProperties);
      stylizer.EntityType.OtherMethod,  //         }
      stylizer.EntityType.OtherMethod,  //       } finally {
      stylizer.EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      stylizer.EntityType.OtherMethod,  //         free(phEnum);
      stylizer.EntityType.OtherMethod,  //         free(rgProperties);
      stylizer.EntityType.OtherMethod,  //         free(pcProperties);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //     return _properties;
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Enumerate all events contained within this type.
      stylizer.EntityType.OtherMethod,  //   List<Event> get events {
      stylizer.EntityType.OtherMethod,  //     if (_events.isEmpty) {
      stylizer.EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      stylizer.EntityType.OtherMethod,  //       final rgEvents = calloc<mdEvent>();
      stylizer.EntityType.OtherMethod,  //       final pcEvents = calloc<ULONG>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //       try {
      stylizer.EntityType.OtherMethod,  //         var hr = reader.EnumEvents(phEnum, token, rgEvents, 1, pcEvents);
      stylizer.EntityType.OtherMethod,  //         while (hr == S_OK) {
      stylizer.EntityType.OtherMethod,  //           final eventToken = rgEvents.value;
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //           _events.add(Event.fromToken(reader, eventToken));
      stylizer.EntityType.OtherMethod,  //           hr = reader.EnumEvents(phEnum, token, rgEvents, 1, pcEvents);
      stylizer.EntityType.OtherMethod,  //         }
      stylizer.EntityType.OtherMethod,  //       } finally {
      stylizer.EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      stylizer.EntityType.OtherMethod,  //         free(phEnum);
      stylizer.EntityType.OtherMethod,  //         free(rgEvents);
      stylizer.EntityType.OtherMethod,  //         free(pcEvents);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //     return _events;
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Get a field matching the name, if one exists.
      stylizer.EntityType.OtherMethod,  //   ///
      stylizer.EntityType.OtherMethod,  //   /// Returns null if the field is not found.
      stylizer.EntityType.OtherMethod,  //   Field? findField(String fieldName) {
      stylizer.EntityType.OtherMethod,  //     try {
      stylizer.EntityType.OtherMethod,  //       return fields.firstWhere((field) => field.name == fieldName);
      stylizer.EntityType.OtherMethod,  //     } on StateError {
      stylizer.EntityType.OtherMethod,  //       return null;
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Get a method matching the name, if one exists.
      stylizer.EntityType.OtherMethod,  //   ///
      stylizer.EntityType.OtherMethod,  //   /// Returns null if the method is not found.
      stylizer.EntityType.OtherMethod,  //   Method? findMethod(String methodName) {
      stylizer.EntityType.OtherMethod,  //     final szName = methodName.toNativeUtf16();
      stylizer.EntityType.OtherMethod,  //     final pmb = calloc<mdMethodDef>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //     try {
      stylizer.EntityType.OtherMethod,  //       final hr = reader.FindMethod(token, szName, nullptr, 0, pmb);
      stylizer.EntityType.OtherMethod,  //       if (SUCCEEDED(hr)) {
      stylizer.EntityType.OtherMethod,  //         return Method.fromToken(reader, pmb.value);
      stylizer.EntityType.OtherMethod,  //       } else if (hr == CLDB_E_RECORD_NOTFOUND) {
      stylizer.EntityType.OtherMethod,  //         return null;
      stylizer.EntityType.OtherMethod,  //       } else {
      stylizer.EntityType.OtherMethod,  //         throw COMException(hr);
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     } finally {
      stylizer.EntityType.OtherMethod,  //       free(szName);
      stylizer.EntityType.OtherMethod,  //       free(pmb);
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Gets the type referencing this type's superclass.
      stylizer.EntityType.OtherMethod,  //   TypeDef? get parent =>
      stylizer.EntityType.OtherMethod,  //       token == 0 ? null : TypeDef.fromToken(reader, baseTypeToken);
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   String? getCustomGUIDAttribute(String guidAttributeName) {
      stylizer.EntityType.OtherMethod,  //     final ptrAttributeName = guidAttributeName.toNativeUtf16();
      stylizer.EntityType.OtherMethod,  //     final ppData = calloc<Pointer<BYTE>>();
      stylizer.EntityType.OtherMethod,  //     final pcbData = calloc<ULONG>();
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //     try {
      stylizer.EntityType.OtherMethod,  //       final hr = reader.GetCustomAttributeByName(
      stylizer.EntityType.OtherMethod,  //           token, ptrAttributeName, ppData.cast(), pcbData);
      stylizer.EntityType.OtherMethod,  //       if (SUCCEEDED(hr)) {
      stylizer.EntityType.OtherMethod,  //         final blob = ppData.value;
      stylizer.EntityType.OtherMethod,  //         if (pcbData.value > 0) {
      stylizer.EntityType.OtherMethod,  //           final returnValue = blob.elementAt(2).cast<GUID>();
      stylizer.EntityType.OtherMethod,  //           return returnValue.ref.toString();
      stylizer.EntityType.OtherMethod,  //         }
      stylizer.EntityType.OtherMethod,  //       }
      stylizer.EntityType.OtherMethod,  //     } finally {
      stylizer.EntityType.OtherMethod,  //       free(ptrAttributeName);
      stylizer.EntityType.OtherMethod,  //       free(ppData);
      stylizer.EntityType.OtherMethod,  //       free(pcbData);
      stylizer.EntityType.OtherMethod,  //     }
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OtherMethod,  //   /// Get the GUID for this type.
      stylizer.EntityType.OtherMethod,  //   ///
      stylizer.EntityType.OtherMethod,  //   /// Returns null if a GUID couldn't be found.
      stylizer.EntityType.OtherMethod,  //   String? get guid {
      stylizer.EntityType.OtherMethod,  //     var guid =
      stylizer.EntityType.OtherMethod,  //         getCustomGUIDAttribute('Windows.Foundation.Metadata.GuidAttribute');
      stylizer.EntityType.OtherMethod,  //     guid ??= getCustomGUIDAttribute('Windows.Win32.Interop.GuidAttribute');
      stylizer.EntityType.OtherMethod,  //
      stylizer.EntityType.OtherMethod,  //     return guid;
      stylizer.EntityType.OtherMethod,  //   }
      stylizer.EntityType.BlankLine,  //
      stylizer.EntityType.OverrideMethod,  //   @override
      stylizer.EntityType.OverrideMethod,  //   String toString() => 'TypeDef: $typeName';
      stylizer.EntityType.BlankLine,  //
    ]

    assert.strictEqual(got[0].lines.length, want.length)

    for (let i = 0; i < got[0].lines.length; i++) {
      const line = got[0].lines[i]
      // console.log(`stylizer.EntityType.${stylizer.EntityType[line.entityType]},  // ${line.line}`)
      assert.strictEqual(
        stylizer.EntityType[line.entityType].toString(),
        stylizer.EntityType[want[i]].toString(),
        `line #${i + 1}: ${line.line}`)
    }

    const memberOrdering = [
      'public-static-variables',
      'public-instance-variables',
      'public-override-variables',
      'private-static-variables',
      'private-instance-variables',
      'public-constructor',
      'named-constructors',
      'public-override-methods',
      'public-other-methods',
      'build-method',
    ]

    const lines = stylizer.reorderClass(memberOrdering, got[0], groupAndSortGetterMethods, sortOtherMethods)
    const wantLines = wantSource.split('\n')
    // assert.strictEqual(lines.length, wantLines.length)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/, '')
      assert.strictEqual(
        line,
        wantLines[i],
        `line #${i + 1}`)
    }
  })
})
