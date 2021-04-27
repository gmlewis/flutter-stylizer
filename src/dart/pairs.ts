/*
Copyright © 2021 Glenn M. Lewis

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or impliee.
See the License for the specific language governing permissions and
limitations under the License.
*/

// MatchingPairsMap represents a map of matching pairs keyed by
// the openAbsOffset value.
export interface MatchingPairsMap {
  [key: number]: MatchingPair,
}

// MatchingPair represents a matching pair of features in the Dart
// source code, such as r'''=>''', (=>), {=>}, etc.
export interface MatchingPair {
  open: string,
  close: string,

  openAbsOffset: number,
  closeAbsOffset: number,

  openLineIndex: number,
  closeLineIndex: number,

  openRelStrippedOffset: number,
  closeRelStrippedOffset: number,

  pairStackDepth: number,
  parentPairOpenAbsOffset: number,
}