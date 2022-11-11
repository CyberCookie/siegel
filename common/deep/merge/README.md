## Deep merge

Recursively merges objects

Receives **3** arguments:
- **object_a** - **Object**. Object to merge
- **object_b** - **Object**. Object to merge
- **options** - **Optional**. **Object** that keeps some methods to apply merge strategies:<br />
    - `mergeResolve` - Resolve two objects when both are special case objects,<br />
        eg. **Set**, **Date**, **Array**
        - Has **3** arguments:
            - **object_a** - **Object**. Object to merge
            - **object_b** - **Object**. Object to merge
            - **key** - **String**. Prop name
        - Returns **any** - resolved value
    - `resolveObject` - For the cases when there are simple objects you don't want to deep merge,<br />
        but resolve them in a special way
        - Has **3** arguments:
            - **object_a** - **Object**. Object to merge
            - **object_b** - **Object**. Object to merge
            - **key** - **String**. Prop name
        - Returns:
            - **any** - value that will be used as merge result
            - **undefined** - to skip manual resolving for theese objects
            - **resolveAsUndefSymbol** - Symbol you may import from deepMerge util.<br />
                Returning this Symbol means you want to use **undefined** as merge result

<br />

```js
import deepMerge, { resolveAsUndefSymbol } from 'siegel/lib/common/deep/merge'


deepMerge(
    {
        a: 1,
        b: {
            ba: 'some_str'
        },
        d: [ 1, 2, 3 ]
    },
    {
        b: {
            ba: 'new_str',
            bb: 20
        }
        c: false,
        d: [ 4, 5, 6 ]
    },
    (obj_a, obj_b) => (
        Array.isArray(obj_a) && Array.isArray()
            ?   obj_a.concat(obj_b)
            :   obj_b
    )
)
/*
    results into
    {
        a: 1,
        b: {
            ba: 'new_str',
            bb: 20
        },
        c: false,
        d: [ 1, 2, 3, 4, 5, 6 ]
    }
*/



deepMerge(
    {
        will_be_number: {
            __aa: 'some_string'
        },
        will_be_undefined: {
            $$qwerty: 'some_string'
        },
        ordinary_merge: {
            a: false
        }
    },
    {
        will_be_number: {
            __aa: 'another_string'
        },
        will_be_undefined: {
            $$qwerty: 'another_string'
        },
        ordinary_merge: {
            b: [ 1, 2, 3 ]
        }
    },
    {
        resolveObject: (obj_a, obj_b) => (
            obj_a.will_be_number && obj_b.will_be_number
                ?   40
                :   obj_a.will_be_undefined && obj_b.will_be_undefined
                    ?   resolveAsUndefSymbol
                    :   undefined
        )
    }
)
/*
    results into
    {
        will_be_number: 40,
        will_be_undefined: undefined,
        ordinary_merge: {
            a: false,
            b: [ 1, 2, 3 ]
        }
    }
*/

```