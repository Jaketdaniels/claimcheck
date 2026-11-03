This repository is `jexl-extended`, published to npm. It adds extra functions and transforms to the Jexl expression language.

Bug report from a user: the `descending` flag of the `sort` transform is inverted.

```js
import jexl from 'jexl-extended';
const users = [{ age: 3 }, { age: 1 }, { age: 2 }];
jexl.evalSync('users|sort("age", true)|mapField("age")', { users });  // gives [1, 2, 3], expected [3, 2, 1]
jexl.evalSync('users|sort("age", false)|mapField("age")', { users }); // gives [3, 2, 1], expected [1, 2, 3]
```

The C# (JexlNet) and Python (pyjexl-extended) ports both treat `true` as descending and `false` as ascending, so expressions written against this library give the opposite order elsewhere. The existing test for `sort("age", true)` asserts the ascending order, so it is wrong too.

Please fix `sort` so that `true` means descending, and correct the test.
