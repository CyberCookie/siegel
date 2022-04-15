## Is primitive

Check if value is primitive and not nullable<br />

Receives **1** parameter: **Any**. Value to check<br />
Returns **Boolean**. **true** if value is primitive

<br />

```js
import isPrimitive from 'siegel-utils/is/primitive'

isPrimitive(undefined)
// false

isPrimitive('')
// true

isPrimitive(24)
// true

isPrimitive(false)
// true
```