## Query update

Updates URL string with new query params<br />

Has **2** signatures:
- Receives **2** parameters, to change one query paramenter:
    - **key** - **String**. Paramenter key
    - **value** - **String**. Paramenter value
- Receives **1** parameter, to change multiple parameters:
    - **paramenters** - **Object** where key is parameter key and value is paramenter value

<br />

```js
import updateURLQuery from 'siegel-utils/query_update'

updateURLQuery(history, 'somekey', 'someValue') 
```
