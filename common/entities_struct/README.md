## Entities struct

Creates data structure to store server entities in and to easily work with them **(CRUD)**

<br />

Receives **1** paremeter:
- **uniq field** - **String**. Uniq field in each entity. Usually it's something like _id_

<br />

Returns **Object** to perform CRUD operations with entities:
- `addOrUpdate` - **Function** to populate struct with one entity<br />
    Replaces entity it already exists (by checking **uniq field**)<br />
    Receives **1** paramenter:
        - **entity** - **Object**. Entity **Object** to add

- `addAll` - **Function**. Same as `addOrUpdate`, but receives **Array of Objects** entities<br />
    Returns **Entities** struct

- `get` - **Function** to get an entity by given **uniq field**. Returns **Entity**

- `remove` - **Function** to remove an entity from struct by given **uniq field**<br />
    Returns **Entities** struct

- `len` - **Function** to get entities count. Returns **Number**

- `each` - **Function** to iterate over all entities. Has **3** arguments:
    - **callback** - **Function**. Callback that is triggered for each **Entity**
    - **from** - **Number**. Index to start to iterate from
    - **to** - **Number**. Index to iterate to

- `sort` - **Function** to sort entities. Has **1** argument:
    - **callback** - **Function**. Callback that is triggered for each **Entity**
        Has **2** arguments:
            - **entity_a** - Comparable **Entity**
            - **entity_b** - **Entity** to compare with
        Returns comaprator value **-1 | 0 | 1**

- `clear` - **Function** to delete all the entities from struct

- `raw` - **Function** to receive all the entities. Returns **Object** with the next fields:
    - `byID` - **Object** where key is **Entity**'s **uniq field**'s value and value is **Entity itself**
    - `sorted` - **Array of uniq field's values**

<br />

```js
import entitiesStruct from 'siegel-ui-utils/entities_struct'

const entities = entitiesStruct('id')

entities
    .addOrUpdate({ id: '1', someData: '' })
    .addOrUpdate({ id: '2', someData: 'value' })
    .get('1')
// { id: '1', someData: '' }

entities
    .addOrUpdate({ id: '1', someData: 'new data' })
    .get('1')
// { id: '1', someData: 'new data' }

entities.len()
// 2


entities.each((elem, index) => {
    // perform some operations
})

entities
    .remove('2')
    .get('2')
// undefined

entities.len()
// 1

entities.raw()
/*
    {
        byID: {
            1: { id: '1', someData: 'new data' }
        },
        sorted: [ '1' ]
    }
*/
```