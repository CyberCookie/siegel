## JSON keys replace

Replaces JSON keys with minified ones and vice versa


```ts
import createJsonKeysReplacer from 'siegel/lib/common/json_keys_replace'


const testObj = {
    name: 'test',
    age: 30,
    data: {
        id: 'some_id'
    }
}
const testObjJson = JSON.stringify(testObj)


const jsonKeysReplacer_1 = createJsonKeysReplacer([ 'name', 'age', 'data', 'id' ])

const minifiedJson_1 = jsonKeysReplacer_1(testObjJson, true)
const restoredJson_1 = jsonKeysReplacer_1(minifiedJson_1, false)

console.log(minifiedJson_1) // {"a":"test","b":30,"c":{"d":"some_id"}}

console.log(restoredJson_1) // {"name":"test","age":30,"data":{"id":"some_id"}}



const jsonKeysReplacer_2 = createJsonKeysReplacer({
    name: '1',
    age: '&',
    data: 'a',
    id: '*'
})

const minifiedJson_2 = jsonKeysReplacer_2(testObjJson, true)
const restoredJson_2 = jsonKeysReplacer_2(minifiedJson_2, false)

console.log(minifiedJson_2) // {"1":"test","&":30,"a":{"*":"some_id"}}

console.log(restoredJson_2) // {"name":"test","age":30,"data":{"id":"some_id"}}
```