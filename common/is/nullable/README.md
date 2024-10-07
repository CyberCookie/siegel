## Is nullable

Check if value is null or undefned<br />

Receives **1** parameter: **Any**. Value to check<br />
Returns **Boolean**. **true** if value is **undefined** or **null**

<br />

```ts
import isNullable from 'siegel/lib/common/is/nullable'

isNullable(undefined)
// true

isNullable(null)
// true

isNullable('')
// false
```