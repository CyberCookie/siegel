## Array objects sort

Sorts array of objects

<br />

Receives **5** parameters:
- **primary key** - **String**. Primary object property key to sort by
- **secondary key** - **String**. Secondary object property key to sort by<br />
    if **primary key**'s values of both objects are equal (==)
- **sort value** - **(-1 | 0 | 1)**. Comparator value
- **object_a** - **Object** to compare
- **object_b** - **Object** to compare

<br />

```js
import objectsSort from 'siegel/lib/common/array_obj_sort'

const mock = [
    { id: 1, name: 'qwerty', birth: 2020 },
    { id: 5, name: 'qwerty', birth: 1970 },
    { id: 3, name: 'somebody', birth: 2000 }
]

mock.sort(objectsSort.bind(null, 'name', 'birth'))
// [{ id: 5... }, { id: 1... }, { id: 3... }]
```