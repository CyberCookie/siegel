<h1>ui_core</h1>
<ul>Front-end related part compatible with all modern browsers that includes:
    <li>Services to work with api (wrappers around SignalR client and browser's FetchAPI).</li>
    <li>Utils and helpers to compute some common operations.</li>
    <li>Service worker that provides the best caching strategy.</li>
    <li>
        <ul>React related parts:
        <li>Widely used UI components that are lightweight, perfomant and flexible.</li>
        <li>State managers created with react hooks or redux abstractions for those dinosaurs who still uses it :).</li>
        <li>Custom hooks.</li>
        <li>React-router-dom wrapper to provide more declarative interface to build routers of any complexity.</li>
        </ul>
    </li>
</ul>

<hr />

<h2>Services</h2>
<details>
<summary><b>request</b></summary>
Wrapper around FetchAPI with more convinient interface to make your request easier.<br />

```js
import request from 'essence-services/request'

request({
    url: 'someurl.com',
    method: 'PUT', // GET by default. Or POST if you pass body data.
    body: {
        some: 'data'
    },
    query: {
        param1: 42,
        param2: 'some param'
    },
    headers: {
        auth: 'token',
        contentType: 'application/json'
    },
    credentials: 'same-origin',
    parseMethod: 'json' // method to be executed on response to retrieve actual data. By default request service sets this prop regarding to response content type
})
```

Request service can also be configured with beforeRequest, afterRequest and errorHandler hooks
```js
import { setup } from 'essence-services/request'

setup({
    beforeRequest(request) {
        request.url = 'api/' + request.url;
    },
    afterRequest(request, parsedResponse) {
        /* do some logic */
    },
    errorHandler(error) {
        let { req, res, status, message } = error;
        console.error(`${status}. ${message}`)
    }
})
```
</details>
<h4>signalr...</h4>

<hr />

<h2>State managers</h2>
<details>
<summary><b>hook_store</b></summary>
<ul>
    Store creator accepts three arguments:
    <li>initialState - object</li>
    <li>actions - object</li>
    <li>with reset - boolean</li>
</ul>

example:

```js
import React, { useLayoutEffect } from 'react'
import createHookStore from 'essence-store/hook_store'


// create store
const initState = {
    someKey: 0
}
const actions = {
    update(store, data) {
        const { state, setState } = store;
        state.someKey = data;
        setState(state)
    }
}
const { store, useStore, reset } = createHookStore(initState, actions)


// you can work with the store directly
const storeUpdate = store.actions.update;
storeUpdate(Date.now())


//or to use inside some component subscribing this store to it.
const Component = () => {
    // subscribe on store changes
    const [ state, actions ] = useStore()
    
    // reset store to inital state anytime
    useLayoutEffect(() => {
        return () => { reset() }
    }, [])
    
    
    return (
        <div onMouseDown={() => { actions.update(Date.now()) }}>
            { state.someKey }
        </div>
    )
}
```

Hook store provides ready to use `fetch module` which is usefull for requests tracking in order to spin some loaders. Docs will be soon...
</details>
<h4>redux</h4>
...

<hr />

<h2>Hooks</h2>
<details>
<summary><b>did_update</b></summary>
Hook to check whether some props have been changed. Works like <b>componenDidUpdate</b>.

``` js
import React from 'react'
import useDidUpdate from 'essence-hooks/did_update'


const Component = props => {
    useDidUpdate(
        () => { console.log('props have been updated') },
        [ props.propToWatch1, props.propToWatch2 ],
        () => { console.log('component will unmount') }
    )
    
    ...
}
```
</details>


<hr />

<details>
<summary style='display: flex;align-items: center'><h2>Router</h2></summary>
This abstraction around react-router-dom module is to provide better declarative interface that allows to build recursive routing with dynamic pages.
`essence-router` exports default routerCreator and history module.

<h3>createRouter = (options: RouterOptions) => Router</h3>

<h4>RouterOptions</h4>
- routes - router config
- Layout - react component to wrap all the pages you put into routes.
- notFound - page to render if no url was matched
- history - browser history cteated with history module

###### routes
key - value object where key is a page url and value is a page route config. Config could have the next properties:
- component - can be rendered component or lazy loaded component.
- exact - react-router-dom's exact.
- redirectTo - path to redirect to if current page url was matched.
- beforeEnter - function that executes when page is rendered. Data returned from the function is stored in props.beforeEnter property.
- children - nested routes. The same object as routes.

```js
import { lazy } from 'react'
import { render } from 'react-dom'
import createRouter, { history } from 'essence-router'


const routesConfig = {
    '': {
        component: props => <div>home page</div>,
        redirectTo: 'url_to_redirect'
    },
    some_page: {
        component: lazy(() => import('path/to/lazy_component')),
        children: {
            nested_page_1: {
                component: props => <div> nested page 1 </div>
            },
            nested_page_2: {
                component: props => <div> nested page 2 </div>
            }
        }
    }
}

const Layout = props => {
    return <>
        header
        { props.children }
        footer
    </>
}

const router = createRouter({
    Layout,
    routes: routesConfig
})

render(document.getElementById('app'), router)
```
</details>

<hr />

<h2>Utils</h2>

<h3>Date</h3>
<details>
<summary><b>toUTCDate</b></summary>
Adjust hours in date object to match UTC date. 

```js
import toUTCDate from 'essence-utils/date/toUTCDate'

const date = new Date() // Fri Jan 01 2020 04:00:00 GMT+0300 (Eastern European Summer Time)

toUTCDate(date)

console.log(date)
// Fri Jan 01 2020 01:00:00 GMT+0300 (Eastern European Summer Time)
```

</details>

<details>
<summary><b>parse</b></summary>
Parse date into parts. accepts zeroPrefix as second argument to prefix values less than 10 with *0* symbol. Returns an object that includes year, month, date, hours, minutes, seconds, day.

```js
import dateParse from 'essence-utils/date/parse'


let date = new Date() // Fri Jan 01 2020 04:00:00 GMT+0300 (Eastern European Summer Time)

let { year, month, date, hours, minutes, day } = dateParse(new Date(), true)

console.log(year, month, date, hours, minutes, day) // 2020, 00, 00, 04, 00, 01
```

</details>

<h3>deep</h3>
<details>
<summary><b>clone</b></summary>
If you want to clone an object with nested objects and arrays:

```js

import clone from 'essence-utils/deep/clone'

const someObject = {
    someProp: 22,
    anotherProp: {
        someProp: 22,
        someArray: [1,2,3]
    }
}

const clonnedObject = clone(someObject)
```

</details>

<details>
<summary><b>get</b></summary>
To retrieve deeply nested value:

```js
import deepGet from 'essence-utils/deep/get'

const someObject = {
    a: {
        b: {
            c: 22
        }
    }
}
deepGet(someObject, ['a', 'b', 'c'], 'default value')
```

</details>

<details>
<summary><b>set</b></summary>
To set property deeply into an object:

```jsx
import deepSet from 'essence-utils/deep/set'

const someObject = {}

deepSet(someObject, ['a', 'b', 'c', 'd'], 'value to set')
```

</details>

<details>
<summary><b>find</b></summary>
To find some property in recursive object:

```js
import deepFind from 'essence-utils/deep/find'

const someObject = {}
```

</details>

<h3>deep</h3>

<details>
<summary><b>array_obj_sort</b></summary>
To sort objects in array.<br />
<ul>
    Accepts 3 parameters:
    <li>primary key - primary object property key to sort by.</li>
    <li>secondary key - secondary object property key to sort by if primaries are equal (==)</li>
    <li>sort value  - comparator [ -1 | 0 | 1 ]</li>
</ul>


```js
import objectsSort from 'essence-utils/array_obj_sort'

const mock = [
    { id: 1, name: 'qwerty', birth: 2020 },
    { id: 5, name: 'qwerty', birth: 1970 },
    { id: 3, name: 'somebody', birth: 2000 }
]

mock.sort(objectsSort.bind(null, 'name', 'birth'))
// [{ id: 5... }, { id: 1... }, { id: 3... }]


```

</details>

<details>
<summary><b>array_range_each</b></summary>
Iterates through array in range. Execs callback on each iteration step. Breaks a loop if callback returns <i>true</i>
<ul>
    Accepts 4 parameters:
    <li>array - aray to iterate throug.</li>
    <li>
        callback - function to xecute on each step. Has 2 arguments: array element and index. Return true if you want to break a loop
    </li>
    <li>from - index to start from.</li>
    <li>to  - index to iterate to.</li>
</ul>

```js
import rangeEach from 'essence-utils/array_range_each'


const mock = (new Array(10)).fill(1)

rangeEach(mock, (elem, index) => index == 3, 2, 5)
```

</details>

<details>
<summary><b>classname</b></summary>
Builds element className regarding to passed conditions.

```js
import getClassName from 'essence-utils/classname'


getClassName('initial_class', {
    'first': true,
    'second': false,
    'third': true
})
// 'initial_class first third'
```

</details>

<details>
<summary><b>entities_struct</b></summary>
Creates data structure to store server entities in and to easily work with them (CRUD).
Accepts uniq entity key. 

<ul>
    Returns and interface to perform CRUD operations:
    <li>addOrUpdate - add entity or update it if already exists</li>
    <li>get - retrieves an entity by id</li>
    <li>remove - removes an entity by id</li>
    <li>len - to get all entities count</li>
    <li>each - works like <b>array_range_each</b> but accepts callback as first argument, from and to as second and third</li>
    <li>sort - sort an entities. Accepts <b>Array.sort</b> callback</li>
    <li>clear - removes all stored entities</li>
    <li>raw - returns muttable entities how they stored inside</li>
</ul>

```js
import entitiesStruct from 'essence-utils/entities_struct'

const entities = entitiesStruct('id')

entities.addOrUpdate({ id: 1, someData: '' })
entities.addOrUpdate({ id: 2, someData: 'value' })
entities.get(1)
// { id: 1, someData: '' }

entities.addOrUpdate({ id: 1, someData: 'new data' })
entities.get(1)
// { id: 1, someData: 'new data' }

entities.len()
// 2


entities.each((elem, index) => {
    // perform some operations
})

entities.remove(2)
entities.get(2)
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

</details>

<details>
<summary><b>is_exists</b></summary>
Is not undefind.

```js
import isExists from 'essence-utils/is_exists'

isExists(undefined)
// false

isExists('')
// true
```

</details>

<details>
<summary><b>is_touchscreen</b></summary>
Check if device has touch events.

```js
import isTouchScreen from 'essence-utils/is_touchscreen'

isTouchScreen()
// false
```

</details>

<details>
<summary><b>parse_jwt</b></summary>
Parses tocken string and extract a data from it

```js
import parseJWT from 'essence-utils/parse_jwt'

parseJWT(someString)
// {}

```

</details>

<details>
<summary><b>query_update</b></summary>
Updates URL string with new query param.
Accepts browser history (or those one created with <b>history</b> module) object as first parameter.

```js
import updateURLQuery from 'essence-utils/'

updateURLQuery(window.history, 'somekey', 'someValue') 
```

</details>


<hr />

<details>
<summary style='display: flex;align-items: center'><h2>Components</h2></summary>
`essence` provides big set of widely used components.
Components support theming. Any component can receive className prop. Those one that consists of more than one DOM element receive theme property. theme is a key - value object where key is tied to component DOM element and value is a className string.
Every component receives attributes prop which is valid set of attributes for a component root DOM element.
`essence` provides HOC to theme components and set default props:

```jsx
import Button from 'essence-ui/_form/Button'
import { withDefaults } from 'essence-ui/ui_utils'

const ThemedButton = withDefaults(Button, {
    className: 'some-class',
    value: 42
})

<ThemeButton />
the same as
<Button className='some-class' value={42} />
```

You can look at how to use them in [demo project demo components folder](../../example/main/pages/DemoComponents/components).
</details>