## Floath mod

Performs mod calculations with given float numbers

Function receives **3** parameters:
- **a** - **Number**. Left hand operand
- **b** - **Number**. Right hand operand
- **precission** - **Number**. Maximmal digits count after dot among all the next provided numbers

<br />

```js
import floatsMod from 'siegel/lib/common/math/floats_mod'

floatsMod(2.1, 0.4, 2) // ->> 0.1

floatsMod(6.65, 0.15, 3) // ->> 0.05
```