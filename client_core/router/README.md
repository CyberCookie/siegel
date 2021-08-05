<h1>Router</h1>

This abstraction around react-router-dom module is to provide better declarative interface that allows to build recursive routing with dynamic pages, apply global NotFound page etc.

`siegel-router` default export is routerCreator.<br />
Also exports createBrowserHistory func and useUpdateChildren hook.

<h3>createRouter = (options: RouterOptions) => Router</h3>

<h4>RouterOptions</h4>

- children - router config. key - value object where key is a page url and value is a page route config. Config can have the next properties:
    - Page - normal page to render.
    - LazyPage - lazy loaded `Page` to render.
    - LazyFallback - fallback component to display while lazy loading `Page` is fetching.
    - Layout - like a root `Layout`, this one provides common view for nested `children` routes.
    - children - nested routes.
    - exact - `react-router-dom`'s exact.
    - redirectTo - path to redirect to if current page url was matched.
    - redirectUseParentBase - whether to use parent's path url as a base.
    - updateFromLayout - allows for the page to be updatable from Layout using `useUpdateChildren` hook
    - beforeEnter - function that executes before first page render.
        Data returned from the function is passing to the page props.
        First argument is a page props.
- Layout - react component to wrap all the pages you put into routes.
- notFound - page to render if no url was matched
    - Page - page to render
    - path - url path for 404 `Page`
- history - browser history cteated with history module

```js
import { lazy } from 'react'
import { render } from 'react-dom'
import createRouter from 'siegel-router'


const routesConfig = {
    '': {
        Page: props => <div>home page</div>,
        redirectTo: 'url_to_redirect'
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