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

import { runFullStylizer, } from './class.test'

suite('Separate Private Methods', function() {

  test('default behavior', () => {
    const source = `
class MyClass {
  myMethod(){};

  _myMethod(){};
}
`

    runFullStylizer(null, source, source, null)
  })


  test('place private methods before public', () => {
    const source = `
class MyClass {
  myMethod(){};

  _myMethod(){};
}
`

    const wantSource = `
class MyClass {
  _myMethod(){};

  myMethod(){};
}
`

    const opts = {
      SeparatePrivateMethods: true,
      MemberOrdering: [
        'public-constructor',
        'named-constructors',
        'public-static-variables',
        'public-instance-variables',
        'public-override-variables',
        'public-override-methods',
        'private-other-methods',
        'public-other-methods',
        'private-static-variables',
        'private-instance-variables',
        'build-method',
      ],
    }
    runFullStylizer(opts, source, wantSource, null)
  })

})