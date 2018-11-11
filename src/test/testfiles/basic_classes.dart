// This is a test file. After running this through `Flutter Stylizer`,
// the output should match the content of file `basic_classes_out.dart`.

import 'dart:math';

// Class1 is the first class.
class Class1 {
  // _pvi is a private instance variable.
  List<String> _pvi = ['one', 'two'];

  // This is a random single-line comment somewhere in the class.

  // _spv is a static private variable.
  static final String _spv = 'spv';

  /* This is a
   * random multi-
   * line comment
   * somewhere in the middle
   * of the class */

  // _spvni is a static private variable with no initializer.
  static double _spvni;
  int _pvini;
  static int sv;
  int v;
  final double fv = 42.0;
  Class1();
  Class1.fromNum();
  var myfunc = (int n) => n;
  get vv => v; // getter
  @override
  toString() {
    print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
    return '';
  }
}
