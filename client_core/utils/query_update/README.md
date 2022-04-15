## Query update

Updates URL string with new query params<br />

Has **2** signatures:
- Receives **3** parameters, to change one query paramenter:
    - **history** - **window.history** or **history**, created by external **history** package
    - **key** - **String**. Paramenter key
    - **value** - **String**. Paramenter value
- Receives **2** parameters, to change multiple parameters:
    - **history**
    - **paramenters** - **Object** where key is parameter key and value is paramenter value

<br />

```js
import updateURLQuery from 'siegel-utils/query_update'

updateURLQuery(window.history, 'somekey', 'someValue') 
```
