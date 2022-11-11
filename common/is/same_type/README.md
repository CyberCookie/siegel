## Is exists

Check if both values have the same type<br />

Receives **2** parameters:
- **value_a** - **Any**. Comparable value
- **value_b** - **Any**. Value to compare with

Returns **Boolean**. **true** if values have the same type

<br />

```js
import isSameType from 'siegel/lib/common/is/same_type'

isSameType(undefined, null)
// false

isSameType(null, null)
// true

isSameType({}, new Date())
// false

isSameType([], {})
// false

isSameType(new Set(), new Set())
// true
```