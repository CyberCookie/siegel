## Query update

Updates URL query with new query parameters<br />

Has **2** signatures:
- Receives **2** parameters, to change one query paramenter:
    - **key** - **String**. Paramenter key
    - **value** - **String**. Paramenter value
- Receives **1** parameter, to change multiple parameters:
    - **paramenters** - **Object** where **key** is parameter key and **value** is paramenter value

<br />

```ts
import buildURLQuery from 'siegel/lib/client_core/ui/utils/query_build'

console.log(location.search) // '?paramKey=paramValue'


// Update single key (1st parameters) with value (2nd parameter) 
console.log(
    buildURLQuery('paramKey', 'newParamValue')
)
// '?paramKey=newParamValue'



// Update using key value hashmap
console.log(
    buildURLQuery({
        paramKey: 123,
        anotherKey: false,
        emptyValueKey: ''
    })
)
// '?paramKey=123&anotherKey=false&emptyValueKey='



// Remove some keys passing undefined / null as values
console.log(
    buildURLQuery({
        paramKey: null,
        anotherKey: 'another_value',
        emptyValueKey: undefined
    })
)
// '?anotherKey=another_value'
```
