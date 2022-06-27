## Diff

Performs deep comparsion of any JSON like objects<br />
Optionaly may accept comparator cb for to compare complex types like Date, Set, Map etc.

<br />

Receives **3** arguments:
- **object_a** - **Object**. Comparable object
- **object_b** - **Object**. Object to compare with
- **options** - **Object**. Options to help to resolve corner cases. **Object** has the next fields:
    - `valueForEqualArrElement` - **Any**. Value used as a placeholder to mark equal elements in comparable arrays<br />
        Default is **Symbol.for('equal')**
    - `valueForRemovedObjField` - **Any**. Value used as a placeholder to mark removed object fields in comparable objects<br />
    Default is **Symbol.for('removed')** 
    - **complexTypesIsEqual** - **Funcion** comparator that is triggered when both comparable types are not a type of js primitive, array or plain object
        - Has **2** arguments:
            - **value_a** - **Object**. Comparable object
            - **value_b** - **Object**. Object to compare with
        - Returns **Boolean**. **true** if values are not equal

<br />

```js
import diff, { SYMBOL__VALUES_EQUAL, SYMBOL__OBJECT_FIELD_REMOVED } from 'siegel-utils/deep/diff'


diff(
    {
        change: 20,
        equal: 'string',
        remove: 'sone_val',

        object_change: {
            change: 'some_string',
            equal: false,
            remove: 90,
        },
        object_equal: {
            number_equal: 40,
            string_equal: 'qwerty'
        },

        array_change_: [
            10,
            { equal: 'some_val' },
            30
        ],
        array_equal_: [
            'somve_val',
            { equal: 20 }
        ],
        array_add: [ 80, 'some_val' ]
    },

    {
        change: 20000,
        equal: 'string',

        object_change: {
            change: 'some_string_changed',
            equal: false
        },
        object_equal: {
            number_equal: 40,
            string_equal: 'qwerty'
        },

        array_change_: [
            10000,
            { equal: 'some_val' },
            30
        ],
        array_equal_: [
            'somve_val',
            { equal: 20 }
        ],
        array_add: [ 80, 'some_val', 'new_value' ]
    },
)

/*
    result ->> {
        change: 20000,
        remove: SYMBOL__OBJECT_FIELD_REMOVED,

        object_change: {
            change: 'some_string_changed',
            remove: SYMBOL__OBJECT_FIELD_REMOVED
        },

        array_change_: [
            10000,
            SYMBOL__VALUES_EQUAL,
            SYMBOL__VALUES_EQUAL
        ],

        array_add: [ SYMBOL__VALUES_EQUAL, SYMBOL__VALUES_EQUAL, 'new_value' ]
    }
*/
```

<br />

With options:

```js
import diff from 'siegel-utils/deep/diff'

diff(
    {
        date_change: new Date(0),
        remove: 'somve_val'
    },
    {
        date_change: new Date(1000)
    },
    {
        valueForRemovedObjField: '__REMOVED__',
        complexTypesIsEqual(a, b) {
            if (a instanceof Date) {
                return a.valueOf() != b.valueOf()
            }
    
            return false // mark unsupported types as equal 
        }
    }
)

/*
    result ->> {
        date_change: new Date(1000),
        remove: '__REMOVED__'
    }
*/
```