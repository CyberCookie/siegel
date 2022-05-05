## Array range each

Iterates through array in range. Execs callback on each iteration step. Breaks a loop if callback returns **true**

<br />

Receives **4** parameters:
- **array** - **Array**. Array to iterate over
- **callback** - **Function** to xecute on each step
    - Has **2** arguments:
        - **element** - **Any**. Array element
        - **index** - **Number**. Array element index
    - Opionaly returns **true** if you want to break a loop
- **from** - **Number**. Index to start iteration from<br />
    By default iterates from the beginning
- **to** - **Number**. Index to iterate to<br />
    By default iterates till the end

<br />

```js
import rangeEach from 'siegel-utils/array_range_each'

const mock = (new Array(10)).fill(1)

rangeEach(mock, (elem, index) => index == 3, 2, 5)
```