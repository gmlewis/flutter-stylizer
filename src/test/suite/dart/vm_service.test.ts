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

const getClass = (src: string, from: string, to: string): string => {
  const start = src.indexOf(from)
  const end = src.indexOf(to)
  return src.substring(start, end)
}

suite('VM Service Tests', function() {
  const testfilesDir = path.join(process.env.VSCODE_CWD, 'src', 'test', 'suite', 'testfiles')

  test('VM Service get classes', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'vm_service.dart.txt'), 'utf8')

    const e = new Editor(source, false)

    const [got, err] = e.getClasses(false, false)
    if (err !== null) {
      throw Error(err.message)  // Make the compiler happy.
    }

    assert.strictEqual(got.length, 96, 'classes')
  })

  test('VM Service source', () => {
    const source = fs.readFileSync(path.join(testfilesDir, 'vm_service.dart.txt'), 'utf8')
    const wantSource = fs.readFileSync(path.join(testfilesDir, 'vm_service_want.txt'), 'utf8')

    runFullStylizer(null, source, wantSource, null)
    runFullStylizer(null, wantSource, wantSource, null)
  })


  test('VM Service class 96', () => {
    const vm_service_dart_txt = fs.readFileSync(path.join(testfilesDir, 'vm_service.dart.txt'), 'utf8')
    const vm_service_want_txt = fs.readFileSync(path.join(testfilesDir, 'vm_service_want.txt'), 'utf8')

    const source = vm_service_dart_txt.substring(vm_service_dart_txt.indexOf('class VM '))
    const wantSource = vm_service_want_txt.substring(vm_service_want_txt.indexOf('class VM '))

    const want: EntityType[] = [
      EntityType.Unknown,          // line #1: {
      EntityType.OtherMethod,      // line #2:   static VM parse(Map<String, dynamic> json) =>
      EntityType.OtherMethod,      // line #3:       json == null ? null : VM._fromJson(json);
      EntityType.BlankLine,        // line #4:
      EntityType.InstanceVariable, // line #5:   /// A name identifying this vm. Not guaranteed to be unique.
      EntityType.InstanceVariable, // line #6:   String name;
      EntityType.BlankLine,        // line #7:
      EntityType.InstanceVariable, // line #8:   /// Word length on target architecture (e.g. 32, 64).
      EntityType.InstanceVariable, // line #9:   int architectureBits;
      EntityType.BlankLine,        // line #10:
      EntityType.InstanceVariable, // line #11:   /// The CPU we are actually running on.
      EntityType.InstanceVariable, // line #12:   String hostCPU;
      EntityType.BlankLine,        // line #13:
      EntityType.InstanceVariable, // line #14:   /// The operating system we are running on.
      EntityType.InstanceVariable, // line #15:   String operatingSystem;
      EntityType.BlankLine,        // line #16:
      EntityType.InstanceVariable, // line #17:   /// The CPU we are generating code for.
      EntityType.InstanceVariable, // line #18:   String targetCPU;
      EntityType.BlankLine,        // line #19:
      EntityType.InstanceVariable, // line #20:   /// The Dart VM version string.
      EntityType.InstanceVariable, // line #21:   String version;
      EntityType.BlankLine,        // line #22:
      EntityType.InstanceVariable, // line #23:   /// The process id for the VM.
      EntityType.InstanceVariable, // line #24:   int pid;
      EntityType.BlankLine,        // line #25:
      EntityType.InstanceVariable, // line #26:   /// The time that the VM started in milliseconds since the epoch.
      EntityType.InstanceVariable, // line #27:   ///
      EntityType.InstanceVariable, // line #28:   /// Suitable to pass to DateTime.fromMillisecondsSinceEpoch.
      EntityType.InstanceVariable, // line #29:   int startTime;
      EntityType.BlankLine,        // line #30:
      EntityType.InstanceVariable, // line #31:   /// A list of isolates running in the VM.
      EntityType.InstanceVariable, // line #32:   List<IsolateRef> isolates;
      EntityType.BlankLine,        // line #33:
      EntityType.InstanceVariable, // line #34:   /// A list of isolate groups running in the VM.
      EntityType.InstanceVariable, // line #35:   List<IsolateGroupRef> isolateGroups;
      EntityType.BlankLine,        // line #36:
      EntityType.InstanceVariable, // line #37:   /// A list of system isolates running in the VM.
      EntityType.InstanceVariable, // line #38:   List<IsolateRef> systemIsolates;
      EntityType.BlankLine,        // line #39:
      EntityType.InstanceVariable, // line #40:   /// A list of isolate groups which contain system isolates running in the VM.
      EntityType.InstanceVariable, // line #41:   List<IsolateGroupRef> systemIsolateGroups;
      EntityType.BlankLine,        // line #42:
      EntityType.MainConstructor,  // line #43:   VM({
      EntityType.MainConstructor,  // line #44:     @required this.name,
      EntityType.MainConstructor,  // line #45:     @required this.architectureBits,
      EntityType.MainConstructor,  // line #46:     @required this.hostCPU,
      EntityType.MainConstructor,  // line #47:     @required this.operatingSystem,
      EntityType.MainConstructor,  // line #48:     @required this.targetCPU,
      EntityType.MainConstructor,  // line #49:     @required this.version,
      EntityType.MainConstructor,  // line #50:     @required this.pid,
      EntityType.MainConstructor,  // line #51:     @required this.startTime,
      EntityType.MainConstructor,  // line #52:     @required this.isolates,
      EntityType.MainConstructor,  // line #53:     @required this.isolateGroups,
      EntityType.MainConstructor,  // line #54:     @required this.systemIsolates,
      EntityType.MainConstructor,  // line #55:     @required this.systemIsolateGroups,
      EntityType.MainConstructor,  // line #56:   });
      EntityType.BlankLine,        // line #57:
      EntityType.NamedConstructor, // line #58:   VM._fromJson(Map<String, dynamic> json) : super._fromJson(json) {
      EntityType.NamedConstructor, // line #59:     name = json['name'];
      EntityType.NamedConstructor, // line #60:     architectureBits = json['architectureBits'];
      EntityType.NamedConstructor, // line #61:     hostCPU = json['hostCPU'];
      EntityType.NamedConstructor, // line #62:     operatingSystem = json['operatingSystem'];
      EntityType.NamedConstructor, // line #63:     targetCPU = json['targetCPU'];
      EntityType.NamedConstructor, // line #64:     version = json['version'];
      EntityType.NamedConstructor, // line #65:     pid = json['pid'];
      EntityType.NamedConstructor, // line #66:     startTime = json['startTime'];
      EntityType.NamedConstructor, // line #67:     isolates = List<IsolateRef>.from(
      EntityType.NamedConstructor, // line #68:         createServiceObject(json['isolates'], const ['IsolateRef']) ?? []);
      EntityType.NamedConstructor, // line #69:     isolateGroups = List<IsolateGroupRef>.from(
      EntityType.NamedConstructor, // line #70:         createServiceObject(json['isolateGroups'], const ['IsolateGroupRef']) ??
      EntityType.NamedConstructor, // line #71:             []);
      EntityType.NamedConstructor, // line #72:     systemIsolates = List<IsolateRef>.from(
      EntityType.NamedConstructor, // line #73:         createServiceObject(json['systemIsolates'], const ['IsolateRef']) ??
      EntityType.NamedConstructor, // line #74:             []);
      EntityType.NamedConstructor, // line #75:     systemIsolateGroups = List<IsolateGroupRef>.from(createServiceObject(
      EntityType.NamedConstructor, // line #76:             json['systemIsolateGroups'], const ['IsolateGroupRef']) ??
      EntityType.NamedConstructor, // line #77:         []);
      EntityType.NamedConstructor, // line #78:   }
      EntityType.BlankLine,        // line #79:
      EntityType.OverrideMethod,   // line #80:   @override
      EntityType.OverrideMethod,   // line #81:   Map<String, dynamic> toJson() {
      EntityType.OverrideMethod,   // line #82:     var json = <String, dynamic>{};
      EntityType.OverrideMethod,   // line #83:     json['type'] = 'VM';
      EntityType.OverrideMethod,   // line #84:     json.addAll({
      EntityType.OverrideMethod,   // line #85:       'name': name,
      EntityType.OverrideMethod,   // line #86:       'architectureBits': architectureBits,
      EntityType.OverrideMethod,   // line #87:       'hostCPU': hostCPU,
      EntityType.OverrideMethod,   // line #88:       'operatingSystem': operatingSystem,
      EntityType.OverrideMethod,   // line #89:       'targetCPU': targetCPU,
      EntityType.OverrideMethod,   // line #90:       'version': version,
      EntityType.OverrideMethod,   // line #91:       'pid': pid,
      EntityType.OverrideMethod,   // line #92:       'startTime': startTime,
      EntityType.OverrideMethod,   // line #93:       'isolates': isolates.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #94:       'isolateGroups': isolateGroups.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #95:       'systemIsolates': systemIsolates.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #96:       'systemIsolateGroups':
      EntityType.OverrideMethod,   // line #97:           systemIsolateGroups.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #98:     });
      EntityType.OverrideMethod,   // line #99:     return json;
      EntityType.OverrideMethod,   // line #100:   }
      EntityType.BlankLine,        // line #101:
      EntityType.OtherMethod,      // line #102:   String toString() => '[VM]';
      EntityType.BlankLine,        // line #103:
    ]

    runFullStylizer(null, source, wantSource, want)

    const wantAfter: EntityType[] = [
      EntityType.Unknown,          // line #1: {
      EntityType.MainConstructor,  // line #43:   VM({
      EntityType.MainConstructor,  // line #44:     @required this.name,
      EntityType.MainConstructor,  // line #45:     @required this.architectureBits,
      EntityType.MainConstructor,  // line #46:     @required this.hostCPU,
      EntityType.MainConstructor,  // line #47:     @required this.operatingSystem,
      EntityType.MainConstructor,  // line #48:     @required this.targetCPU,
      EntityType.MainConstructor,  // line #49:     @required this.version,
      EntityType.MainConstructor,  // line #50:     @required this.pid,
      EntityType.MainConstructor,  // line #51:     @required this.startTime,
      EntityType.MainConstructor,  // line #52:     @required this.isolates,
      EntityType.MainConstructor,  // line #53:     @required this.isolateGroups,
      EntityType.MainConstructor,  // line #54:     @required this.systemIsolates,
      EntityType.MainConstructor,  // line #55:     @required this.systemIsolateGroups,
      EntityType.MainConstructor,  // line #56:   });
      EntityType.BlankLine,        // line #57:
      EntityType.NamedConstructor, // line #58:   VM._fromJson(Map<String, dynamic> json) : super._fromJson(json) {
      EntityType.NamedConstructor, // line #59:     name = json['name'];
      EntityType.NamedConstructor, // line #60:     architectureBits = json['architectureBits'];
      EntityType.NamedConstructor, // line #61:     hostCPU = json['hostCPU'];
      EntityType.NamedConstructor, // line #62:     operatingSystem = json['operatingSystem'];
      EntityType.NamedConstructor, // line #63:     targetCPU = json['targetCPU'];
      EntityType.NamedConstructor, // line #64:     version = json['version'];
      EntityType.NamedConstructor, // line #65:     pid = json['pid'];
      EntityType.NamedConstructor, // line #66:     startTime = json['startTime'];
      EntityType.NamedConstructor, // line #67:     isolates = List<IsolateRef>.from(
      EntityType.NamedConstructor, // line #68:         createServiceObject(json['isolates'], const ['IsolateRef']) ?? []);
      EntityType.NamedConstructor, // line #69:     isolateGroups = List<IsolateGroupRef>.from(
      EntityType.NamedConstructor, // line #70:         createServiceObject(json['isolateGroups'], const ['IsolateGroupRef']) ??
      EntityType.NamedConstructor, // line #71:             []);
      EntityType.NamedConstructor, // line #72:     systemIsolates = List<IsolateRef>.from(
      EntityType.NamedConstructor, // line #73:         createServiceObject(json['systemIsolates'], const ['IsolateRef']) ??
      EntityType.NamedConstructor, // line #74:             []);
      EntityType.NamedConstructor, // line #75:     systemIsolateGroups = List<IsolateGroupRef>.from(createServiceObject(
      EntityType.NamedConstructor, // line #76:             json['systemIsolateGroups'], const ['IsolateGroupRef']) ??
      EntityType.NamedConstructor, // line #77:         []);
      EntityType.NamedConstructor, // line #78:   }
      EntityType.BlankLine,        // line #79:
      EntityType.InstanceVariable, // line #8:   /// Word length on target architecture (e.g. 32, 64).
      EntityType.InstanceVariable, // line #9:   int architectureBits;
      EntityType.BlankLine,        // line #10:
      EntityType.InstanceVariable, // line #11:   /// The CPU we are actually running on.
      EntityType.InstanceVariable, // line #12:   String hostCPU;
      EntityType.BlankLine,        // line #13:
      EntityType.InstanceVariable, // line #34:   /// A list of isolate groups running in the VM.
      EntityType.InstanceVariable, // line #35:   List<IsolateGroupRef> isolateGroups;
      EntityType.BlankLine,        // line #36:
      EntityType.InstanceVariable, // line #31:   /// A list of isolates running in the VM.
      EntityType.InstanceVariable, // line #32:   List<IsolateRef> isolates;
      EntityType.BlankLine,        // line #33:
      EntityType.InstanceVariable, // line #5:   /// A name identifying this vm. Not guaranteed to be unique.
      EntityType.InstanceVariable, // line #6:   String name;
      EntityType.BlankLine,        // line #7:
      EntityType.InstanceVariable, // line #14:   /// The operating system we are running on.
      EntityType.InstanceVariable, // line #15:   String operatingSystem;
      EntityType.BlankLine,        // line #16:
      EntityType.InstanceVariable, // line #23:   /// The process id for the VM.
      EntityType.InstanceVariable, // line #24:   int pid;
      EntityType.BlankLine,        // line #25:
      EntityType.InstanceVariable, // line #26:   /// The time that the VM started in milliseconds since the epoch.
      EntityType.InstanceVariable, // line #27:   ///
      EntityType.InstanceVariable, // line #28:   /// Suitable to pass to DateTime.fromMillisecondsSinceEpoch.
      EntityType.InstanceVariable, // line #29:   int startTime;
      EntityType.BlankLine,        // line #30:
      EntityType.InstanceVariable, // line #37:   /// A list of system isolates running in the VM.
      EntityType.InstanceVariable, // line #38:   List<IsolateRef> systemIsolates;
      EntityType.BlankLine,        // line #39:
      EntityType.InstanceVariable, // line #40:   /// A list of isolate groups which contain system isolates running in the VM.
      EntityType.InstanceVariable, // line #41:   List<IsolateGroupRef> systemIsolateGroups;
      EntityType.BlankLine,        // line #42:
      EntityType.InstanceVariable, // line #17:   /// The CPU we are generating code for.
      EntityType.InstanceVariable, // line #18:   String targetCPU;
      EntityType.BlankLine,        // line #19:
      EntityType.InstanceVariable, // line #20:   /// The Dart VM version string.
      EntityType.InstanceVariable, // line #21:   String version;
      EntityType.BlankLine,        // line #22:
      EntityType.OverrideMethod,   // line #80:   @override
      EntityType.OverrideMethod,   // line #81:   Map<String, dynamic> toJson() {
      EntityType.OverrideMethod,   // line #82:     var json = <String, dynamic>{};
      EntityType.OverrideMethod,   // line #83:     json['type'] = 'VM';
      EntityType.OverrideMethod,   // line #84:     json.addAll({
      EntityType.OverrideMethod,   // line #85:       'name': name,
      EntityType.OverrideMethod,   // line #86:       'architectureBits': architectureBits,
      EntityType.OverrideMethod,   // line #87:       'hostCPU': hostCPU,
      EntityType.OverrideMethod,   // line #88:       'operatingSystem': operatingSystem,
      EntityType.OverrideMethod,   // line #89:       'targetCPU': targetCPU,
      EntityType.OverrideMethod,   // line #90:       'version': version,
      EntityType.OverrideMethod,   // line #91:       'pid': pid,
      EntityType.OverrideMethod,   // line #92:       'startTime': startTime,
      EntityType.OverrideMethod,   // line #93:       'isolates': isolates.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #94:       'isolateGroups': isolateGroups.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #95:       'systemIsolates': systemIsolates.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #96:       'systemIsolateGroups':
      EntityType.OverrideMethod,   // line #97:           systemIsolateGroups.map((f) => f.toJson()).toList(),
      EntityType.OverrideMethod,   // line #98:     });
      EntityType.OverrideMethod,   // line #99:     return json;
      EntityType.OverrideMethod,   // line #100:   }
      EntityType.BlankLine,        // line #101:
      EntityType.OtherMethod,      // line #2:   static VM parse(Map<String, dynamic> json) =>
      EntityType.OtherMethod,      // line #3:       json == null ? null : VM._fromJson(json);
      EntityType.BlankLine,        // line #4:
      EntityType.OtherMethod,      // line #102:   String toString() => '[VM]';
      EntityType.BlankLine,        // line #103:
    ]

    runParsePhase(null, wantSource, wantAfter)
    runFullStylizer(null, wantSource, wantSource, null)
  })

  test('VM Service RPCError class', () => {
    const vm_service_dart_txt = fs.readFileSync(path.join(testfilesDir, 'vm_service.dart.txt'), 'utf8')
    const vm_service_want_txt = fs.readFileSync(path.join(testfilesDir, 'vm_service_want.txt'), 'utf8')

    const source = getClass(vm_service_dart_txt, 'class RPCError ', 'class SentinelException ')
    const wantSource = getClass(vm_service_want_txt, 'class RPCError ', 'class SentinelException ')

    const want: EntityType[] = [
      EntityType.Unknown,          // line #1: {
      EntityType.StaticVariable,   // line #2:   /// Application specific error codes.
      EntityType.StaticVariable,   // line #3:   static const int kServerError = -32000;
      EntityType.BlankLine,        // line #4:
      EntityType.StaticVariable,   // line #5:   /// The JSON sent is not a valid Request object.
      EntityType.StaticVariable,   // line #6:   static const int kInvalidRequest = -32600;
      EntityType.BlankLine,        // line #7:
      EntityType.StaticVariable,   // line #8:   /// The method does not exist or is not available.
      EntityType.StaticVariable,   // line #9:   static const int kMethodNotFound = -32601;
      EntityType.BlankLine,        // line #10:
      EntityType.StaticVariable,   // line #11:   /// Invalid method parameter(s), such as a mismatched type.
      EntityType.StaticVariable,   // line #12:   static const int kInvalidParams = -32602;
      EntityType.BlankLine,        // line #13:
      EntityType.StaticVariable,   // line #14:   /// Internal JSON-RPC error.
      EntityType.StaticVariable,   // line #15:   static const int kInternalError = -32603;
      EntityType.BlankLine,        // line #16:
      EntityType.OtherMethod,      // line #17:   static RPCError parse(String callingMethod, dynamic json) {
      EntityType.OtherMethod,      // line #18:     return RPCError(callingMethod, json['code'], json['message'], json['data']);
      EntityType.OtherMethod,      // line #19:   }
      EntityType.BlankLine,        // line #20:
      EntityType.InstanceVariable, // line #21:   final String callingMethod;
      EntityType.InstanceVariable, // line #22:   final int code;
      EntityType.InstanceVariable, // line #23:   final String message;
      EntityType.InstanceVariable, // line #24:   final Map data;
      EntityType.BlankLine,        // line #25:
      EntityType.MainConstructor,  // line #26:   RPCError(this.callingMethod, this.code, this.message, [this.data]);
      EntityType.BlankLine,        // line #27:
      EntityType.NamedConstructor, // line #28:   RPCError.withDetails(this.callingMethod, this.code, this.message,
      EntityType.NamedConstructor, // line #29:       {Object details})
      EntityType.NamedConstructor, // line #30:       : data = details == null ? null : <String, dynamic>{} {
      EntityType.NamedConstructor, // line #31:     if (details != null) {
      EntityType.NamedConstructor, // line #32:       data['details'] = details;
      EntityType.NamedConstructor, // line #33:     }
      EntityType.NamedConstructor, // line #34:   }
      EntityType.BlankLine,        // line #35:
      EntityType.OtherMethod,      // line #36:   String get details => data == null ? null : data['details'];
      EntityType.BlankLine,        // line #37:
      EntityType.OtherMethod,      // line #38:   /// Return a map representation of this error suitable for converstion to
      EntityType.OtherMethod,      // line #39:   /// json.
      EntityType.OtherMethod,      // line #40:   Map<String, dynamic> toMap() {
      EntityType.OtherMethod,      // line #41:     Map<String, dynamic> map = {
      EntityType.OtherMethod,      // line #42:       'code': code,
      EntityType.OtherMethod,      // line #43:       'message': message,
      EntityType.OtherMethod,      // line #44:     };
      EntityType.OtherMethod,      // line #45:     if (data != null) {
      EntityType.OtherMethod,      // line #46:       map['data'] = data;
      EntityType.OtherMethod,      // line #47:     }
      EntityType.OtherMethod,      // line #48:     return map;
      EntityType.OtherMethod,      // line #49:   }
      EntityType.BlankLine,        // line #50:
      EntityType.OtherMethod,      // line #51:   String toString() {
      EntityType.OtherMethod,      // line #52:     if (details == null) {
      EntityType.OtherMethod,      // line #53:       return '$callingMethod: ($code) $message';
      EntityType.OtherMethod,      // line #54:     } else {
      EntityType.OtherMethod,      // line #55:       return '$callingMethod: ($code) $message\n$details';
      EntityType.OtherMethod,      // line #56:     }
      EntityType.OtherMethod,      // line #57:   }
      EntityType.BlankLine,        // line #58:
    ]

    // runParsePhase(null, source, want)
    runFullStylizer(null, source, wantSource, want)
  })
})
