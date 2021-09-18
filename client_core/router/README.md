<h1>Router</h1>

This abstraction around `react-router-dom` module provides `better declarative interface` allowing to build `recursive routing`<br />
with dynamically loaded pages, apply global NotFound page, layouts etc.

`siegel-router` default export is `createRouter`.<br />
Also exports `createBrowserHistory` func and `useUpdateChildren` hook.

<br />
<h3>createRouter = (options: RouterOptions) => Router</h3>
<br />

<h4>RouterOptions</h4>

- <b>children</b> - router config. key - value object where key is a route url and value is a route config.<br />
Config can have the next properties, which `visually divided into the groups`, meaning,<br />
`not all the properties could be together in the same time`:
    - <b>exact</b> - `react-router-dom`'s exact.<br /><br />
    - <b>Page</b> - `normal page` to render.
    - <b>LazyPage</b> - `lazy loaded page` to render.
    - <b>LazyFallback</b> - `fallback` component to display while `lazy loading page` is fetching.
    - <b>beforeEnter</b> - function that executes before first page render.<br />
        Data returned from the function is passing to the page props.<br />
        First argument is a page props.
    - <b>updateFromLayout</b> - allows for the page to be updatable from Layout using `useUpdateChildren` hook<br /><br />
    - <b>Layout</b> - like a root `Layout`, this one provides common view for nested `children` routes.
    - <b>children</b> - `nested` routes.<br /><br />
    - <b>redirectTo</b> - `path to redirect to` if current page url was matched.
    - <b>redirectUseParentBase</b> - whether to use `parent's path url as a base`.<br /><br />
- <b>Layout</b> - react component to `wrap all the pages` you put into routes.
- <b>notFound</b> - `404 page` to render if no url was matched
    - <b>Page</b> - `page` to render
    - <b>path</b> - `url path` for 404 page
- <b>history</b> - `browser history` cteated with history module

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
<h3>useUpdateChildren</h3><br />

Sometimes when some updates happens in Layout, you need to update underneath pages.<br />
Since that pages are rendered outside of Layout, we need some tweek to force them rerender.<br />
For such purposes Siegel Router provides hook, that you should place in Layout.

<ul>
    signature:
    <li>Layout - Layout it self</li>
    <li>Path - current pathname</li>
    <li>Extra condition - optional condition for children update. True by default</li>
</ul>


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

Also in router config you should mark pages that will be updatable from the Layout:

```js
const routesConfig = {
    '': {
        Page: props => <div>home page</div>,
        updateFromLayout: true
    }
}
```