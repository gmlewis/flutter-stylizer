// This is a test file. After running this through `Flutter Stylizer`,
// the output should match the content of file `basic_classes_out.dart`.

import 'dart:math';

// Class1 is the first class.
class Class1 {
  Class1();

  Class1.fromNum();

  static int sv;

  final double fv = 42.0;
  int v;

  // _spv is a static private variable.
  static final String _spv = 'spv';
  // _spvni is a static private variable with no initializer.
  static double _spvni;

  // _pvi is a private instance variable.
  List<String> _pvi = ['one', 'two'];
  int _pvini;

  @override
  toString() {
    print('$_pvi, $_spv, $_spvni, $_pvini, ${sqrt(2)}');
    return '';
  }

  var myfunc = (int n) => n;

  get vv => v; // getter

  // This is a random single-line comment somewhere in the class.

  /* This is a
   * random multi-
   * line comment
   * somewhere in the middle
   * of the class */
}
