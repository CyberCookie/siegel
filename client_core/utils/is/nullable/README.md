## Is nullable

Check if value is not null or undefned<br />

Receives **1** parameter: **Any**. Value to check<br />
Returns **Boolean**. **true** if value is **undefined** or **null**

<br />

```js
import isNullable from 'siegel-utils/is/nullable'

isNullable(undefined)
// true

isNullable(null)
// true

isNullable('')
// false
```