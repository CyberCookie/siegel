## Is exists

Check if value is not undefned<br />

Receives **1** parameter: **Any**. Value to check<br />
Returns **Boolean**. **false** if value is **undefined**

<br />

```ts
import isExists from 'siegel/lib/common/is/exists'

isExists(undefined)
// false

isExists('')
// true
```