## Deep set

To set property deeply into an object

<br />

Receives **3** parameters:
- **object** - **Object** to set value to
- **path** - **String[]**. Path to to set value by
- **value** - **Any**. Value to set by provided **path**

Returns updated **object**<br />

<br />

```tsx
import deepSet from 'siegel/lib/common/deep/set'

const someObject = {}

deepSet(someObject, ['a', 'b', 'c', 'd'], 'value to set')
```