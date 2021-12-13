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

import { Line } from './line'

// Entity represents a single, independent feature of a Dart.Class.
export interface Entity {
  entityType: EntityType,
  lines: Line[],
  name: string, // Used for sorting, but could be "".
}

export const isPrivate = (entity: Entity): boolean => {
  return entity.name.startsWith('_')
}

// EntityType represents a type of Dart Line.
export enum EntityType {
  Unknown,
  BlankLine,
  SingleLineComment,
  MultiLineComment,
  MainConstructor,
  NamedConstructor,
  StaticVariable,
  InstanceVariable,
  OverrideVariable,
  StaticPrivateVariable,
  PrivateInstanceVariable,
  OverrideMethod,
  OtherMethod,
  BuildMethod,
  GetterMethod,
}

