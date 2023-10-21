## Classname

Builds element className regarding to passed conditions

<br />

Receives **2** parameters:
- **initial class name** - **String**. Class name to concatenate new classes with
- **Classes object** - **Record<string, unknown>** where key is a class name to apply<br />
    and value is a condition to determine whether to apply this class name to **initial class name**

<br />

```js
import getClassName from 'siegel/lib/common/classname'


getClassName('initial_class', {
    'first': true,
    'second': false,
    'third': true
})
// 'initial_class first third'
```