# Router

This abstraction around `react-router-dom` module provides `better declarative interface` allowing to build `recursive routing`<br />
with dynamically loaded pages, apply global NotFound page, layouts etc.

`siegel-router` default export is router creator<br />
Also exports `createBrowserHistory` func and `useUpdateChildren` hook

<br />

Router creator is a **Function** that receives **1** parameter - **Object** with the next fields:

- `children` - **Object**. Router config. Where _key_ is a route url and _value_ is **Object** that represents route config<br />
**Object** has the next fields, which **visually divided into the groups**, meaning,<br />
**not all the properties could be together at the same time**:
    - `exact` - Same as **react-router-dom** exact<br /><br />
    - `Page` - **React.ComponentType**. Page to render
    - `LazyPage` - **React.LazyExoticComponent**. Lazy page to render
    - `LazyFallback` - **React.ReactNode**. Component to display while **LazyPage** is fetching
    - `beforeEnter` - **Function** that executes before first page render<br />
        Data returned from the function is passing to the page props<br />
        - Has **1** argument:
            - **pageProps** - **RouteComponentProps**. Page props
        - Returns **void | Object**
    - `updateFromLayout` - **Boolean**. Allows for the page to be updatable from Layout using `useUpdateChildren` hook<br /><br />
    - `Layout` - Same as router creator **Layout**
    - `children` - **Object**. Router creator's **children** - recursion<br /><br />
    - `redirectTo` - **String**. Path to redirect to if current page url was matched
    - `redirectUseParentBase` - **Boolean** whether to use parent's path url as a base<br /><br />
- `Layout` - **React.ComponentType**. React component to **wrap all the pages** you put into routes
- `notFound` - **Object**. 404 page to render if no url was matched. **Object** has the next fields:
    - `Page` - Same as router creator **Page**
    - `path` - **String**. URL path for 404 page
- `history` - **History**. Created with **createBrowserHistory** `history` module

<br />

```js
import { lazy } from 'react'
import { render } from 'react-dom'
import createRouter from 'siegel-router'


const routesConfig = {
    '': {
        Page: props => <div>home page</div>
    },
    some_page: {
        Layout: props => (
            <>
                some_page's sub header
                some_page's sidebar
                { props.children }
            </>
        ),
        children: {
            nested_page_1: {
                beforeEnter(props) {
                    // do some logic before page render, like updating seo tags.
                },
                Page: props => <div> nested page 1 </div>
            },
            nested_page_2: {
                Page: props => <div> nested page 2 </div>
            },
            nested_page_3: {
                LazyPage: lazy(() => import('path/to/lazy_component')),
                LazyFallback: <div>Loading...</div>
            },

            redirect: {
                redirectTo: 'some_page'
            },

            redirect_scope: {
                redirectTo: 'nested_page_2',
                redirectUseParentBase: true
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
    notFound: {
        path: '404',
        Page: () => <div>404</div>
    }
    children: routesConfig
})

render(router, document.getElementById('app'))
```


<br />

### useUpdateChildren

<br />

Sometimes when some updates happens in Layout, you need to update underneath pages<br />
Since that pages are rendered outside of Layout, we need some tweek to force them rerender<br />
For such purposes Siegel Router provides hook, that you should place in Layout

Receives **3** parameters:
- **Layout** - **React.ComponentType**. Layout itself
- **Path** - **String**. Current pathname
- **Extra condition** - **Boolean**. Update condition<br />
    Default is **true**


```js
import React from 'react'
import { useUpdateChildren } from 'siegel-router'

const Layout = props => {
    useUpdateChildren(Layout, props.location.pathname)

    return <>
        { props.children }
    </>
}
```

<br />

Also in router config you should mark pages that will be updatable from the Layout:

```js
const routesConfig = {
    '': {
        Page: props => <div>home page</div>,
        updateFromLayout: true
    }
}
```