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

const fs = require('fs')
const path = require('path')

import { EntityType } from '../../../dart/entity'
import { runFullStylizer } from './class.test'

suite('Issue#20 Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')

  test('Issue#20: spurious lines should not be added', () => {
    const groupAndSortGetterMethods = false
    const sortOtherMethods = false

    const source = fs.readFileSync(path.join(testfilesDir, 'issue20.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'issue20_want.txt'), 'utf8')

    const want = [
      EntityType.Unknown,  // {
      EntityType.InstanceVariable,  //   final String typeName;
      EntityType.PrivateInstanceVariable,  //   final int _attributes;
      EntityType.InstanceVariable,  //   final int baseTypeToken;
      EntityType.InstanceVariable,  //   final TypeIdentifier? typeSpec;
      EntityType.BlankLine,  //
      EntityType.PrivateInstanceVariable,  //   final _interfaces = <TypeDef>[];
      EntityType.PrivateInstanceVariable,  //   final _fields = <Field>[];
      EntityType.PrivateInstanceVariable,  //   final _methods = <Method>[];
      EntityType.PrivateInstanceVariable,  //   final _properties = <Property>[];
      EntityType.PrivateInstanceVariable,  //   final _events = <Event>[];
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   TypeVisibility get typeVisibility =>
      EntityType.OtherMethod,  //       TypeVisibility.values[_attributes & CorTypeAttr.tdVisibilityMask];
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   TypeLayout get typeLayout {
      EntityType.OtherMethod,  //     switch (_attributes & CorTypeAttr.tdLayoutMask) {
      EntityType.OtherMethod,  //       case CorTypeAttr.tdAutoLayout:
      EntityType.OtherMethod,  //         return TypeLayout.auto;
      EntityType.OtherMethod,  //       case CorTypeAttr.tdSequentialLayout:
      EntityType.OtherMethod,  //         return TypeLayout.sequential;
      EntityType.OtherMethod,  //       case CorTypeAttr.tdExplicitLayout:
      EntityType.OtherMethod,  //         return TypeLayout.explicit;
      EntityType.OtherMethod,  //       default:
      EntityType.OtherMethod,  //         throw WinmdException('Attribute missing type layout information');
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Is the type a class?
      EntityType.OtherMethod,  //   bool get isClass =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdClassSemanticsMask == CorTypeAttr.tdClass;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Is the type an interface?
      EntityType.OtherMethod,  //   bool get isInterface =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdClassSemanticsMask == CorTypeAttr.tdInterface;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isAbstract =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdAbstract == CorTypeAttr.tdAbstract;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isSealed =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdSealed == CorTypeAttr.tdSealed;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isSpecialName =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdSpecialName == CorTypeAttr.tdSpecialName;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isImported =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdImport == CorTypeAttr.tdImport;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isSerializable =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdSerializable == CorTypeAttr.tdSerializable;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isWindowsRuntime =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdWindowsRuntime ==
      EntityType.OtherMethod,  //       CorTypeAttr.tdWindowsRuntime;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isRTSpecialName =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdRTSpecialName == CorTypeAttr.tdRTSpecialName;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   StringFormat get stringFormat {
      EntityType.OtherMethod,  //     switch (_attributes & CorTypeAttr.tdStringFormatMask) {
      EntityType.OtherMethod,  //       case CorTypeAttr.tdAnsiClass:
      EntityType.OtherMethod,  //         return StringFormat.ansi;
      EntityType.OtherMethod,  //       case CorTypeAttr.tdUnicodeClass:
      EntityType.OtherMethod,  //         return StringFormat.unicode;
      EntityType.OtherMethod,  //       case CorTypeAttr.tdAutoClass:
      EntityType.OtherMethod,  //         return StringFormat.auto;
      EntityType.OtherMethod,  //       case CorTypeAttr.tdCustomFormatClass:
      EntityType.OtherMethod,  //         return StringFormat.custom;
      EntityType.OtherMethod,  //       default:
      EntityType.OtherMethod,  //         throw WinmdException('Attribute missing string format information');
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isBeforeFieldInit =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdBeforeFieldInit ==
      EntityType.OtherMethod,  //       CorTypeAttr.tdBeforeFieldInit;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   bool get isForwarder =>
      EntityType.OtherMethod,  //       _attributes & CorTypeAttr.tdForwarder == CorTypeAttr.tdForwarder;
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Is the type a delegate?
      EntityType.OtherMethod,  //   bool get isDelegate => parent?.typeName == 'System.MulticastDelegate';
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Retrieve class layout information.
      EntityType.OtherMethod,  //   ///
      EntityType.OtherMethod,  //   /// This includes the packing alignment, the minimum class size, and the field
      EntityType.OtherMethod,  //   /// layout (e.g. for sparsely or overlapping structs).
      EntityType.OtherMethod,  //   ClassLayout get classLayout => ClassLayout(reader, token);
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Is the type a non-Windows Runtime type, such as System.Object or
      EntityType.OtherMethod,  //   /// IInspectable?
      EntityType.OtherMethod,  //   ///
      EntityType.OtherMethod,  //   /// More information at:
      EntityType.OtherMethod,  //   /// https://docs.microsoft.com/en-us/uwp/winrt-cref/winmd-files#type-system-encoding
      EntityType.OtherMethod,  //   bool get isSystemType => systemTokens.containsValue(typeName);
      EntityType.BlankLine,  //
      EntityType.MainConstructor,  //   /// Create a typedef.
      EntityType.MainConstructor,  //   ///
      EntityType.MainConstructor,  //   /// Typically, typedefs should be obtained from a [WinmdScope] object rather
      EntityType.MainConstructor,  //   /// than being created directly.
      EntityType.MainConstructor,  //   TypeDef(IMetaDataImport2 reader,
      EntityType.MainConstructor,  //       [int token = 0,
      EntityType.MainConstructor,  //       this.typeName = '',
      EntityType.MainConstructor,  //       this._attributes = 0,
      EntityType.MainConstructor,  //       this.baseTypeToken = 0,
      EntityType.MainConstructor,  //       this.typeSpec])
      EntityType.MainConstructor,  //       : super(reader, token);
      EntityType.BlankLine,  //
      EntityType.NamedConstructor,  //   /// Creates a typedef object from its given token.
      EntityType.NamedConstructor,  //   factory TypeDef.fromToken(IMetaDataImport2 reader, int token) {
      EntityType.NamedConstructor,  //     switch (token & 0xFF000000) {
      EntityType.NamedConstructor,  //       case CorTokenType.mdtTypeRef:
      EntityType.NamedConstructor,  //         return TypeDef.fromTypeRefToken(reader, token);
      EntityType.NamedConstructor,  //       case CorTokenType.mdtTypeDef:
      EntityType.NamedConstructor,  //         return TypeDef.fromTypeDefToken(reader, token);
      EntityType.NamedConstructor,  //       case CorTokenType.mdtTypeSpec:
      EntityType.NamedConstructor,  //         return TypeDef.fromTypeSpecToken(reader, token);
      EntityType.NamedConstructor,  //       default:
      EntityType.NamedConstructor,  //         throw WinmdException('Unrecognized token ${token.toHexString(32)}');
      EntityType.NamedConstructor,  //     }
      EntityType.NamedConstructor,  //   }
      EntityType.BlankLine,  //
      EntityType.NamedConstructor,  //   /// Instantiate a typedef from a TypeDef token.
      EntityType.NamedConstructor,  //   factory TypeDef.fromTypeDefToken(IMetaDataImport2 reader, int typeDefToken) {
      EntityType.NamedConstructor,  //     final szTypeDef = stralloc(MAX_STRING_SIZE);
      EntityType.NamedConstructor,  //     final pchTypeDef = calloc<ULONG>();
      EntityType.NamedConstructor,  //     final pdwTypeDefFlags = calloc<DWORD>();
      EntityType.NamedConstructor,  //     final ptkExtends = calloc<mdToken>();
      EntityType.NamedConstructor,  //
      EntityType.NamedConstructor,  //     try {
      EntityType.NamedConstructor,  //       final hr = reader.GetTypeDefProps(typeDefToken, szTypeDef,
      EntityType.NamedConstructor,  //           MAX_STRING_SIZE, pchTypeDef, pdwTypeDefFlags, ptkExtends);
      EntityType.NamedConstructor,  //
      EntityType.NamedConstructor,  //       if (SUCCEEDED(hr)) {
      EntityType.NamedConstructor,  //         return TypeDef(reader, typeDefToken, szTypeDef.toDartString(),
      EntityType.NamedConstructor,  //             pdwTypeDefFlags.value, ptkExtends.value);
      EntityType.NamedConstructor,  //       } else {
      EntityType.NamedConstructor,  //         throw WindowsException(hr);
      EntityType.NamedConstructor,  //       }
      EntityType.NamedConstructor,  //     } finally {
      EntityType.NamedConstructor,  //       free(pchTypeDef);
      EntityType.NamedConstructor,  //       free(pdwTypeDefFlags);
      EntityType.NamedConstructor,  //       free(ptkExtends);
      EntityType.NamedConstructor,  //       free(szTypeDef);
      EntityType.NamedConstructor,  //     }
      EntityType.NamedConstructor,  //   }
      EntityType.BlankLine,  //
      EntityType.NamedConstructor,  //   /// Instantiate a typedef from a TypeRef token.
      EntityType.NamedConstructor,  //   ///
      EntityType.NamedConstructor,  //   /// Unless the TypeRef token is `IInspectable`, the COM parent interface for
      EntityType.NamedConstructor,  //   /// Windows Runtime classes, the TypeRef is used to obtain the host scope
      EntityType.NamedConstructor,  //   /// metadata file, from which the TypeDef can be found and returned.
      EntityType.NamedConstructor,  //   factory TypeDef.fromTypeRefToken(IMetaDataImport2 reader, int typeRefToken) {
      EntityType.NamedConstructor,  //     final ptkResolutionScope = calloc<mdToken>();
      EntityType.NamedConstructor,  //     final szName = stralloc(MAX_STRING_SIZE);
      EntityType.NamedConstructor,  //     final pchName = calloc<ULONG>();
      EntityType.NamedConstructor,  //
      EntityType.NamedConstructor,  //     try {
      EntityType.NamedConstructor,  //       final hr = reader.GetTypeRefProps(
      EntityType.NamedConstructor,  //           typeRefToken, ptkResolutionScope, szName, MAX_STRING_SIZE, pchName);
      EntityType.NamedConstructor,  //
      EntityType.NamedConstructor,  //       if (SUCCEEDED(hr)) {
      EntityType.NamedConstructor,  //         final typeName = szName.toDartString();
      EntityType.NamedConstructor,  //         try {
      EntityType.NamedConstructor,  //           final newScope = MetadataStore.getScopeForType(typeName);
      EntityType.NamedConstructor,  //           return newScope.findTypeDef(typeName)!;
      EntityType.NamedConstructor,  //         } catch (exception) {
      EntityType.NamedConstructor,  //           // a token like IInspectable is out of reach of GetTypeRefProps, since it is
      EntityType.NamedConstructor,  //           // a plain COM object. These objects are returned as system types.
      EntityType.NamedConstructor,  //           if (systemTokens.containsKey(typeRefToken)) {
      EntityType.NamedConstructor,  //             return TypeDef(reader, 0, systemTokens[typeRefToken]!);
      EntityType.NamedConstructor,  //           }
      EntityType.NamedConstructor,  //           if (systemTokens.containsValue(typeName)) {
      EntityType.NamedConstructor,  //             return TypeDef(reader, 0, typeName);
      EntityType.NamedConstructor,  //           }
      EntityType.NamedConstructor,  //           // Perhaps we can find it in the current scope after all (for example,
      EntityType.NamedConstructor,  //           // it's a nested class)
      EntityType.NamedConstructor,  //           try {
      EntityType.NamedConstructor,  //             final typedef = TypeDef.fromTypeDefToken(reader, typeRefToken);
      EntityType.NamedConstructor,  //             return typedef;
      EntityType.NamedConstructor,  //           } catch (exception) {
      EntityType.NamedConstructor,  //             throw WinmdException(
      EntityType.NamedConstructor,  //                 'Unable to find scope for $typeName [${typeRefToken.toHexString(32)}]...');
      EntityType.NamedConstructor,  //           }
      EntityType.NamedConstructor,  //         }
      EntityType.NamedConstructor,  //       } else {
      EntityType.NamedConstructor,  //         throw WindowsException(hr);
      EntityType.NamedConstructor,  //       }
      EntityType.NamedConstructor,  //     } finally {
      EntityType.NamedConstructor,  //       free(ptkResolutionScope);
      EntityType.NamedConstructor,  //       free(szName);
      EntityType.NamedConstructor,  //       free(pchName);
      EntityType.NamedConstructor,  //     }
      EntityType.NamedConstructor,  //   }
      EntityType.BlankLine,  //
      EntityType.NamedConstructor,  //   /// Instantiate a typedef from a TypeSpec token.
      EntityType.NamedConstructor,  //   factory TypeDef.fromTypeSpecToken(
      EntityType.NamedConstructor,  //       IMetaDataImport2 reader, int typeSpecToken) {
      EntityType.NamedConstructor,  //     final ppvSig = calloc<PCCOR_SIGNATURE>();
      EntityType.NamedConstructor,  //     final pcbSig = calloc<ULONG>();
      EntityType.NamedConstructor,  //
      EntityType.NamedConstructor,  //     try {
      EntityType.NamedConstructor,  //       final hr =
      EntityType.NamedConstructor,  //           reader.GetTypeSpecFromToken(typeSpecToken, ppvSig.cast(), pcbSig);
      EntityType.NamedConstructor,  //       final signature = ppvSig.value.asTypedList(pcbSig.value);
      EntityType.NamedConstructor,  //       final typeTuple = parseTypeFromSignature(signature, reader);
      EntityType.NamedConstructor,  //
      EntityType.NamedConstructor,  //       if (SUCCEEDED(hr)) {
      EntityType.NamedConstructor,  //         return TypeDef(
      EntityType.NamedConstructor,  //             reader, typeSpecToken, '', 0, 0, typeTuple.typeIdentifier);
      EntityType.NamedConstructor,  //       } else {
      EntityType.NamedConstructor,  //         throw WindowsException(hr);
      EntityType.NamedConstructor,  //       }
      EntityType.NamedConstructor,  //     } finally {
      EntityType.NamedConstructor,  //       free(ppvSig);
      EntityType.NamedConstructor,  //       free(pcbSig);
      EntityType.NamedConstructor,  //     }
      EntityType.NamedConstructor,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Converts an individual interface into a type.
      EntityType.OtherMethod,  //   TypeDef processInterfaceToken(int token) {
      EntityType.OtherMethod,  //     final ptkClass = calloc<mdTypeDef>();
      EntityType.OtherMethod,  //     final ptkIface = calloc<mdToken>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //     try {
      EntityType.OtherMethod,  //       final hr = reader.GetInterfaceImplProps(token, ptkClass, ptkIface);
      EntityType.OtherMethod,  //       if (SUCCEEDED(hr)) {
      EntityType.OtherMethod,  //         final interfaceToken = ptkIface.value;
      EntityType.OtherMethod,  //         return TypeDef.fromToken(reader, interfaceToken);
      EntityType.OtherMethod,  //       } else {
      EntityType.OtherMethod,  //         throw WindowsException(hr);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     } finally {
      EntityType.OtherMethod,  //       free(ptkClass);
      EntityType.OtherMethod,  //       free(ptkIface);
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Enumerate all interfaces that this type implements.
      EntityType.OtherMethod,  //   List<TypeDef> get interfaces {
      EntityType.OtherMethod,  //     if (_interfaces.isEmpty) {
      EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      EntityType.OtherMethod,  //       final rImpls = calloc<mdInterfaceImpl>();
      EntityType.OtherMethod,  //       final pcImpls = calloc<ULONG>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //       try {
      EntityType.OtherMethod,  //         var hr = reader.EnumInterfaceImpls(phEnum, token, rImpls, 1, pcImpls);
      EntityType.OtherMethod,  //         while (hr == S_OK) {
      EntityType.OtherMethod,  //           final interfaceToken = rImpls.value;
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //           _interfaces.add(processInterfaceToken(interfaceToken));
      EntityType.OtherMethod,  //           hr = reader.EnumInterfaceImpls(phEnum, token, rImpls, 1, pcImpls);
      EntityType.OtherMethod,  //         }
      EntityType.OtherMethod,  //       } finally {
      EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      EntityType.OtherMethod,  //         free(phEnum);
      EntityType.OtherMethod,  //         free(rImpls);
      EntityType.OtherMethod,  //         free(pcImpls);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //     return _interfaces;
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Enumerate all fields contained within this type.
      EntityType.OtherMethod,  //   List<Field> get fields {
      EntityType.OtherMethod,  //     if (_fields.isEmpty) {
      EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      EntityType.OtherMethod,  //       final rgFields = calloc<mdFieldDef>();
      EntityType.OtherMethod,  //       final pcTokens = calloc<ULONG>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //       try {
      EntityType.OtherMethod,  //         var hr = reader.EnumFields(phEnum, token, rgFields, 1, pcTokens);
      EntityType.OtherMethod,  //         while (hr == S_OK) {
      EntityType.OtherMethod,  //           final fieldToken = rgFields.value;
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //           _fields.add(Field.fromToken(reader, fieldToken));
      EntityType.OtherMethod,  //           hr = reader.EnumFields(phEnum, token, rgFields, 1, pcTokens);
      EntityType.OtherMethod,  //         }
      EntityType.OtherMethod,  //       } finally {
      EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      EntityType.OtherMethod,  //         free(phEnum);
      EntityType.OtherMethod,  //         free(rgFields);
      EntityType.OtherMethod,  //         free(pcTokens);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //     return _fields;
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Enumerate all methods contained within this type.
      EntityType.OtherMethod,  //   List<Method> get methods {
      EntityType.OtherMethod,  //     if (_methods.isEmpty) {
      EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      EntityType.OtherMethod,  //       final rgMethods = calloc<mdMethodDef>();
      EntityType.OtherMethod,  //       final pcTokens = calloc<ULONG>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //       try {
      EntityType.OtherMethod,  //         var hr = reader.EnumMethods(phEnum, token, rgMethods, 1, pcTokens);
      EntityType.OtherMethod,  //         while (hr == S_OK) {
      EntityType.OtherMethod,  //           final methodToken = rgMethods.value;
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //           _methods.add(Method.fromToken(reader, methodToken));
      EntityType.OtherMethod,  //           hr = reader.EnumMethods(phEnum, token, rgMethods, 1, pcTokens);
      EntityType.OtherMethod,  //         }
      EntityType.OtherMethod,  //       } finally {
      EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      EntityType.OtherMethod,  //         free(phEnum);
      EntityType.OtherMethod,  //         free(rgMethods);
      EntityType.OtherMethod,  //         free(pcTokens);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //     return _methods;
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Enumerate all properties contained within this type.
      EntityType.OtherMethod,  //   List<Property> get properties {
      EntityType.OtherMethod,  //     if (_properties.isEmpty) {
      EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      EntityType.OtherMethod,  //       final rgProperties = calloc<mdProperty>();
      EntityType.OtherMethod,  //       final pcProperties = calloc<ULONG>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //       try {
      EntityType.OtherMethod,  //         var hr =
      EntityType.OtherMethod,  //             reader.EnumProperties(phEnum, token, rgProperties, 1, pcProperties);
      EntityType.OtherMethod,  //         while (hr == S_OK) {
      EntityType.OtherMethod,  //           final propertyToken = rgProperties.value;
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //           _properties.add(Property.fromToken(reader, propertyToken));
      EntityType.OtherMethod,  //           hr = reader.EnumMethods(phEnum, token, rgProperties, 1, pcProperties);
      EntityType.OtherMethod,  //         }
      EntityType.OtherMethod,  //       } finally {
      EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      EntityType.OtherMethod,  //         free(phEnum);
      EntityType.OtherMethod,  //         free(rgProperties);
      EntityType.OtherMethod,  //         free(pcProperties);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //     return _properties;
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Enumerate all events contained within this type.
      EntityType.OtherMethod,  //   List<Event> get events {
      EntityType.OtherMethod,  //     if (_events.isEmpty) {
      EntityType.OtherMethod,  //       final phEnum = calloc<HCORENUM>();
      EntityType.OtherMethod,  //       final rgEvents = calloc<mdEvent>();
      EntityType.OtherMethod,  //       final pcEvents = calloc<ULONG>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //       try {
      EntityType.OtherMethod,  //         var hr = reader.EnumEvents(phEnum, token, rgEvents, 1, pcEvents);
      EntityType.OtherMethod,  //         while (hr == S_OK) {
      EntityType.OtherMethod,  //           final eventToken = rgEvents.value;
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //           _events.add(Event.fromToken(reader, eventToken));
      EntityType.OtherMethod,  //           hr = reader.EnumEvents(phEnum, token, rgEvents, 1, pcEvents);
      EntityType.OtherMethod,  //         }
      EntityType.OtherMethod,  //       } finally {
      EntityType.OtherMethod,  //         reader.CloseEnum(phEnum.value);
      EntityType.OtherMethod,  //         free(phEnum);
      EntityType.OtherMethod,  //         free(rgEvents);
      EntityType.OtherMethod,  //         free(pcEvents);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //     return _events;
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Get a field matching the name, if one exists.
      EntityType.OtherMethod,  //   ///
      EntityType.OtherMethod,  //   /// Returns null if the field is not found.
      EntityType.OtherMethod,  //   Field? findField(String fieldName) {
      EntityType.OtherMethod,  //     try {
      EntityType.OtherMethod,  //       return fields.firstWhere((field) => field.name == fieldName);
      EntityType.OtherMethod,  //     } on StateError {
      EntityType.OtherMethod,  //       return null;
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Get a method matching the name, if one exists.
      EntityType.OtherMethod,  //   ///
      EntityType.OtherMethod,  //   /// Returns null if the method is not found.
      EntityType.OtherMethod,  //   Method? findMethod(String methodName) {
      EntityType.OtherMethod,  //     final szName = methodName.toNativeUtf16();
      EntityType.OtherMethod,  //     final pmb = calloc<mdMethodDef>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //     try {
      EntityType.OtherMethod,  //       final hr = reader.FindMethod(token, szName, nullptr, 0, pmb);
      EntityType.OtherMethod,  //       if (SUCCEEDED(hr)) {
      EntityType.OtherMethod,  //         return Method.fromToken(reader, pmb.value);
      EntityType.OtherMethod,  //       } else if (hr == CLDB_E_RECORD_NOTFOUND) {
      EntityType.OtherMethod,  //         return null;
      EntityType.OtherMethod,  //       } else {
      EntityType.OtherMethod,  //         throw COMException(hr);
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     } finally {
      EntityType.OtherMethod,  //       free(szName);
      EntityType.OtherMethod,  //       free(pmb);
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Gets the type referencing this type's superclass.
      EntityType.OtherMethod,  //   TypeDef? get parent =>
      EntityType.OtherMethod,  //       token == 0 ? null : TypeDef.fromToken(reader, baseTypeToken);
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   String? getCustomGUIDAttribute(String guidAttributeName) {
      EntityType.OtherMethod,  //     final ptrAttributeName = guidAttributeName.toNativeUtf16();
      EntityType.OtherMethod,  //     final ppData = calloc<Pointer<BYTE>>();
      EntityType.OtherMethod,  //     final pcbData = calloc<ULONG>();
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //     try {
      EntityType.OtherMethod,  //       final hr = reader.GetCustomAttributeByName(
      EntityType.OtherMethod,  //           token, ptrAttributeName, ppData.cast(), pcbData);
      EntityType.OtherMethod,  //       if (SUCCEEDED(hr)) {
      EntityType.OtherMethod,  //         final blob = ppData.value;
      EntityType.OtherMethod,  //         if (pcbData.value > 0) {
      EntityType.OtherMethod,  //           final returnValue = blob.elementAt(2).cast<GUID>();
      EntityType.OtherMethod,  //           return returnValue.ref.toString();
      EntityType.OtherMethod,  //         }
      EntityType.OtherMethod,  //       }
      EntityType.OtherMethod,  //     } finally {
      EntityType.OtherMethod,  //       free(ptrAttributeName);
      EntityType.OtherMethod,  //       free(ppData);
      EntityType.OtherMethod,  //       free(pcbData);
      EntityType.OtherMethod,  //     }
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OtherMethod,  //   /// Get the GUID for this type.
      EntityType.OtherMethod,  //   ///
      EntityType.OtherMethod,  //   /// Returns null if a GUID couldn't be found.
      EntityType.OtherMethod,  //   String? get guid {
      EntityType.OtherMethod,  //     var guid =
      EntityType.OtherMethod,  //         getCustomGUIDAttribute('Windows.Foundation.Metadata.GuidAttribute');
      EntityType.OtherMethod,  //     guid ??= getCustomGUIDAttribute('Windows.Win32.Interop.GuidAttribute');
      EntityType.OtherMethod,  //
      EntityType.OtherMethod,  //     return guid;
      EntityType.OtherMethod,  //   }
      EntityType.BlankLine,  //
      EntityType.OverrideMethod,  //   @override
      EntityType.OverrideMethod,  //   String toString() => 'TypeDef: $typeName';
      EntityType.BlankLine,  //
    ]

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

    const opts = {
      GroupAndSortGetterMethods: groupAndSortGetterMethods,
      MemberOrdering: memberOrdering,
      SortOtherMethods: sortOtherMethods,
    }

    runFullStylizer(opts, source, wantSource, want)
  })
})
