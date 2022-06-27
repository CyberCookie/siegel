## Floats arifmetic

In JS just like in many other languages **0.2 + 0.1 != 0.3**<br />
This function is to perform _add_ and _subtract_ math operations with float numbers to always get correct result<br />

Function receives **unlimited** parameters count:
- **precision** - **Number**. Maximmal digits count after dot among all the next provided numbers
- **...numbers** - **Number**. All the numbers to perform operations with

<br />

```js
import floatsArifmetic from 'siegel-utils/math/floats_arifmetic'

floatsArifmetic(3, 0.09, -0.03, -0.16, 1.251) // ->> 1.151

floatsArifmetic(1, 0.1, 0.2) // ->> 0.3
```