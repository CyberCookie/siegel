## Deep get

To retrieve deeply nested value

Receives **3** arguments:
- **object** - **Object** to get value from
- **path** - **String | String[]**. Path to desired value within **object**
- **default value** - **Any**. Value to return if no value by with provided **path**

<br />

```js
import deepGet from 'siegel/lib/common/deep/get'

const someObject = {
    a: {
        b: {
            c: 22
        }
    }
}
deepGet(someObject, ['a', 'b', 'c'], 'default value')