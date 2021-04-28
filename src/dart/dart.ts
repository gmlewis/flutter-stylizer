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

// import { Class } from './class'
// import { Editor } from './editor'
// import { Entity, EntityType } from './entity'
// import { Line } from './line'

export class Client {

}

export interface Options {
  GroupAndSortGetterMethods: boolean,
  MemberOrdering: string[],
  SortOtherMethods: boolean,
  Verbose: boolean,
}

export const defaultMemberOrdering = [
  'public-constructor',
  'named-constructors',
  'public-static-variables',
  'public-instance-variables',
  'public-override-variables',
  'private-static-variables',
  'private-instance-variables',
  'public-override-methods',
  'public-other-methods',
  'build-method'
]
