## Deep set

To set property deeply into an object

<br />

Receives **3** parameters:
- **object** - **Object** to set value to
- **path** - **Array of String** - Path to to set value by
- **value** - **Any**. Value to set by provided **path**

<br />

```jsx
import deepSet from 'siegel-utils/deep/set'

const someObject = {}

deepSet(someObject, ['a', 'b', 'c', 'd'], 'value to set')
```