<h1>Utils</h1>

<br/>
<h3>To UTC date</h3>
Adjust hours in date object to match UTC date. 
<br/>

```js
import toUTCDate from 'siegel-utils/date/toUTCDate'

const date = new Date() // Fri Jan 01 2020 04:00:00 GMT+0300 (Eastern European Summer Time)

toUTCDate(date)

console.log(date)
// Fri Jan 01 2020 01:00:00 GMT+0300 (Eastern European Summer Time)
```



<br/>
<h3>Date parse</h3>
Parse date into parts. accepts zeroPrefix as second argument to prefix values less than 10 with `0` symbol. Returns an object that includes year, month, date, hours, minutes, seconds, day.

```js
import dateParse from 'siegel-utils/date/parse'


let date = new Date() // Fri Jan 01 2020 04:00:00 GMT+0300 (Eastern European Summer Time)

let { year, month, date, hours, minutes, day } = dateParse(new Date(), true)

console.log(year, month, date, hours, minutes, day) // 2020, 00, 00, 04, 00, 01
```



<br />
<h3>Deep clone</h3>
If you want to clone an object with nested objects and arrays:

```js
import clone from 'siegel-utils/deep/clone'

const someObject = {
    someProp: 22,
    anotherProp: {
        someProp: 22,
        someArray: [1,2,3]
    }
}

const clonnedObject = clone(someObject)
```



<br />
<h3>Deep get</h3>
To retrieve deeply nested value:

```js
import deepGet from 'siegel-utils/deep/get'

const someObject = {
    a: {
        b: {
            c: 22
        }
    }
}
deepGet(someObject, ['a', 'b', 'c'], 'default value')
```



<br />
<h3>Deep set</h3>
To set property deeply into an object:

```jsx
import deepSet from 'siegel-utils/deep/set'

const someObject = {}

deepSet(someObject, ['a', 'b', 'c', 'd'], 'value to set')
```



<br />
<h3>Deep find</h3>
To find some property in recursive object:

```js
import deepFind from 'siegel-utils/deep/find'

const someObject = {}
```



<br />
<h3>Array objects sort</h3>
To sort objects in array.<br />

<ul>
    Accepts 3 parameters:
    <li>primary key - primary object property key to sort by.</li>
    <li>secondary key - secondary object property key to sort by if primaries are equal (==)</li>
    <li>sort value  - comparator [ -1 | 0 | 1 ]</li>
</ul>


```js
import objectsSort from 'siegel-utils/array_obj_sort'

const mock = [
    { id: 1, name: 'qwerty', birth: 2020 },
    { id: 5, name: 'qwerty', birth: 1970 },
    { id: 3, name: 'somebody', birth: 2000 }
]

mock.sort(objectsSort.bind(null, 'name', 'birth'))
// [{ id: 5... }, { id: 1... }, { id: 3... }]
```



<br />
<h3>Array range each</h3>
Iterates through array in range. Execs callback on each iteration step. Breaks a loop if callback returns <i>true</i>

<ul>
    Accepts 4 parameters:
    <li>array - aray to iterate throug.</li>
    <li>
        callback - function to xecute on each step. Has 2 arguments: array element and index. Return true if you want to break a loop.
    </li>
    <li>from - index to start from. By default iterates from the beginning.</li>
    <li>to  - index to iterate to. By default iterates to the end.</li>
</ul>

```js
import rangeEach from 'siegel-utils/array_range_each'


const mock = (new Array(10)).fill(1)

rangeEach(mock, (elem, index) => index == 3, 2, 5)
```



<br />
<h3>Classname</h3>
Builds element className regarding to passed conditions.

```js
import getClassName from 'siegel-utils/classname'


getClassName('initial_class', {
    'first': true,
    'second': false,
    'third': true
})
// 'initial_class first third'
```



<br />
<h3>Entities struct</h3>
Creates data structure to store server entities in and to easily work with them (CRUD).
Accepts uniq entity key. 

<ul>
    Returns and interface to perform CRUD operations:
    <li>addOrUpdate - add entity or update it if already exists</li>
    <li>
        addAll - adds an array of entities all together.<br />
        Performs `addOrUpdate` on each element<br />
        Accepts postProcessEntity callback as a second argument, where you can mutate each entity
    </li>
    <li>get - retrieves an entity by id</li>
    <li>remove - removes an entity by id</li>
    <li>len - to get all entities count</li>
    <li>each - works like <b>array_range_each</b> but accepts callback as first argument, from and to as second and third</li>
    <li>sort - sort an entities. Accepts <b>Array.sort</b> callback</li>
    <li>clear - removes all stored entities</li>
    <li>raw - returns muttable entities how they stored inside</li>
</ul>

```js
import entitiesStruct from 'siegel-utils/entities_struct'

const entities = entitiesStruct('id')

entities
    .addOrUpdate({ id: 1, someData: '' })
    .addOrUpdate({ id: 2, someData: 'value' })
    .get(1)
// { id: 1, someData: '' }

entities
    .addOrUpdate({ id: 1, someData: 'new data' })
    .get(1)
// { id: 1, someData: 'new data' }

entities.len()
// 2


entities.each((elem, index) => {
    // perform some operations
})

entities
    .remove(2)
    .get(2)
// undefined

entities.len()
// 1

entities.raw()
/*
    {
        byID: {
            1: { id: 1, someData: 'new data' }
        },
        sorted: [1]
    }
*/
```



<br />
<h3>Is exists</h3>
Is not undefind.

```js
import isExists from 'siegel-utils/is_exists'

isExists(undefined)
// false

isExists('')
// true
```



<br />
<h3>Is touchscreen</h3>
Check if device has touch events.

```js
import isTouchScreen from 'siegel-utils/is_touchscreen'

isTouchScreen()
// false
```



<br />
<h3>Parse jwt</h3>
Parses tocken string and extract a data from it

```js
import parseJWT from 'siegel-utils/parse_jwt'

parseJWT(someString)
// {}

```



<br />
<h3>Query update</h3>
Updates URL string with new query param.
Accepts browser history (or those one created with <b>history</b> module) object as first parameter.

```js
import updateURLQuery from 'siegel-utils/query_update'

updateURLQuery(window.history, 'somekey', 'someValue') 
```



<br />
<h3>Float math</h3>
In JS like in many other languages 0.2 + 0.1 != 0.3.<br />
You may use this float math function to perform such operations with float numbers,<br />
always receiving correct result.<br />
The first argument is a maximum number precision of all the other arguments that you need to sum.

```js
import floatMath from 'siegel-utils/float_math'

floatMath(2, 0.09, -0.03) // ->> 0.06

floatMath(1, 0.1, 0.2) // ->> 0.3
```



<br />
<h3>SEO</h3>
Some crawlers may execute your client side JS code.<br />
Using this SEO function it is easy to update SEO tags providing valuable SEO information to a crawler.<br />
The best way to use it is in a router configuration inside of <b>beforeEnter</b> func.

```js
import seo from 'siegel-utils/seo'

seo({
    title: 'new title',
    keywords: 'some, new, keywords',
    description: 'updated description'
})
```