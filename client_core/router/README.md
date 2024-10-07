# Router

Siegel router allows you to construct site routing of any complexity<br />
including such features as page wrapping with `Layout`, URL params support, dynamicaly changing path `basename`, permissions check, redirects and more.

<br />

Router is a React component, that can have the next props:

- `children` - **Required** **Object**. Routes config. Where _key_ is a route URL and _value_ is **Object** that represents route config<br />
**Object** has the next fields:
    - `Page` - **React.ComponentType | React.LazyExoticComponent**. Page to render
    - `Layout` - React component to wrap all the children pages
    - `fallback` - **React.ReactNode**. Component to display while `Page` or `Layout` is lazy loading
    - `onEnter` - **Function** that executes before first page render<br />
        Data returned from the function is passed as `onEnterData` prop to the page props<br />
        - Function has **1** argument:
            - **URLParams** - **Object** with parsed URL params
        - Returns **void | Object**
    - `onLeave` - **Function** that is triggered before current component was replaced with another one 
    - `paramName` - **String**. URL parameter name in dynamic route
    - `redirectTo` - **String** | **Object**. Path to redirect to if current route URL was matched<br />
        You may also provide history state, if using **Object**. the **Object** has the next fields:
        - `path` - **String**. Redirect path
        - `state` - **Any** | **Function**. New history state.<br />
            **Function** is triggered right before redirection occures and returns **Any** state
    - `transition` - **False | Object**. Defines children transition params or disables global ones for the nested children<br />
        **False** prevents upper level transition params from being applied to this routing level
    - `permissions`- **Boolean | Function**. Specify whether user has permissions to visit this page<br />
        **Function** has **1** argument - urlParams<br />
        Returns **Boolean**
    - `children` - **Object**. Nested routes config
- `Layout` - **React.ComponentType | React.LazyExoticComponent**.<br />
    React component to wrap all the children pages
- `basename` - URL path prefix
- `transition` - **Object**. Defines global cross pages transition params<br />
    **Object** has the next fields:
    - `duration` - **Required** **Number**. Transition duration in ms.
    - `wrapperClassName` - **String**. ClassName to be applied to a wrapper that wraps previous and next pages<br />
        Pages itself are wrapped in `div` with no className applied
    - `performOnHistoryStateChange` - **Boolean**. Whether to perform transition if same page but different history states

<br />

Lets say you need to have *www.somesite.com/goods/fruits/orange* URL on your site, where *orange* is URL parameter.<br />
Also we need to have *contacts* page accessible by *www.somesite.com/contacts* URL.<br />
We define 404 page as well for the cases when users type incorrect URL.<br />
And one more thing - we add restricted admin page with URL *www.somesite.com/admin*. User will be redirected to home page if has no rights to visit the admin page.<br />

Config:

```ts
const routesConfig = {
    '': {
        Page: () => <div>home page</div>
    },
    goods: {
        Page: () => <div>goods</div>,
        children: {
            fruits: {
                Page: () => <div>fruits</div>,
                children: {
                    '*': {
                        Page: ({ urlParams }) => <div>{ urlParams.fruit }</div>,
                        paramName: 'fruit'
                    }
                }
            }
        }
    },
    contacts: {
        Page: () => <div>contacts</div>
    },
    admin: {
        Page: () => <div>admin pannel</div>,
        permissions() => {
            // perform some checks
            return false
        },
        redirectTo: '!'
    },
    404: {
        Page: () => <div>page not found</div>
    },
    '*': {
        redirectTo: {
            path: '/404',
            state: () => ({
                prevPath: location.pathname
            })
        }
    }
}
```

First we defined top level routes with URL parts `goods`, `contacts` and empty path for the home page.<br />
We also applied pages that should be rendered if we type related URLs in browser address bar, for example *www.somesite.com/goods* <br />
Defining `children` opens us the way to describe nested routes.<br />
At the deepest path level we used wildcard ( * ) - this symbols means we match every route at this level<br />
and any fruit we type in URL eventually will fall down in this route, for example *www.somesite.com/goods/fruits/kiwi*<br />
Finally, at the top level we defined *all routes* path ( * ) to match any route we didn't specify and, in this case, redirect to 404 page with state applied to history.<br />
Admin page with permissions check is also here.<br />

<br />

### Redirects

In example above we used */404* path to say we want to redirect to *www.somesite.com/404* page.<br />
There are few symbols we can place at the beginning of redirection path string to explicitly say which path we want redirect to:
- / - defines absolute path
- ! - redirects to the same level replacing last path piece
- no symbol - redirecs relatively to the current path, adding new path piece

For example, with URL *www.somesite.com/goods/vegetables*<br />
`redirectTo: '/contacts'` will throw us on *www.somesite.com/**contacts***<br />
`redirectTo: '!fruits'` -> *www.somesite.com/goods/**fruits***<br />
`redirectTo: '!'` -> *www.somesite.com/goods*<br />
`redirectTo: 'potato'` -> *www.somesite.com/goods/vegetables/**potato***<br />

<br /><br />

### 404 page not found

You may define page to be rendered if required page URL does not exists in your Router config.<br />
To do so, first we need to define 404 page itself with it's own route.<br />
Then we need to define redirect from any page to the 404 page:

```ts
const routerConfig = {
    '': {
        Page: () => <div>home page</div>
    },
    contacts: {
        Page: () => <div>contacts</div>,
        children: {
            contact_us: {
                Page: () => <div>contact us</div>
            },
            404: {
                Page: () => <div>special 404 page</div>
            },
            '*': {
                redirectTo: '!404'
            }
        }
    }
    404: {
        Page: () => <div>404 page</div>
    },
    '*': {
        redirectTo: '/404'
    }
}
```
Here we defined global and path specific 404 pages.<br />
So how it works - when we type addresses:<br />
*somesite.com/unexisted_page* -> redirects us to -> *somesite.com/404*<br />
*somesite.com/contacts/unexisted_page* -> redirects us to -> *somesite.com/contacts/404*<br />

Redirects priority: specified 404 page at global level -> home page -> first path at root level.

<br /><br />

## History

Router component patches `history` with own `push` method in order to intercept and react on location changes. Under the hood it uses `history.pushState` and `history.replaceState`.<br />
Newly added method `history.push` receives **3** arguments:
- **url** - **String**. URL to change path to. Works the same way as **url** param in `history pushState / replaceState`
- **state** - **Optional** **Any**. Works the same way as **state** param in `history pushState / replaceState` state
- **replaceURL** - **Optional** **Boolean | String**. Use `history.replaceState`<br />
    Provide **String** URL to use it as URL to be replaced

URL strings in `push` method have the same behavior as `redirectTo`, described above.

<br />

Also router component patches `history` with `history.basename` property and `history.updateBasename` method<br />
in the case you've provided `basename` prop to the Router.<br />
`history.basename` holds actual basename, while `history.updateBasename` is here to update it.<br />
`updateBasename` receives **1** argument - **newBasename** (**String**)

If you bootstrap your application without basename applied, but the application is capable to apply it at runtime - you should then provide **empty string** as a initial basename parameter.

<br /><br />

## Site navigation

Router exports component for inner site navigation. It's fully compatible with html `a` tag<br />
but with another few props:
- `href` - **String**. Pathname to perform navigation to<br />
    Can be relative or absolute URL with no domain and protocol included<br />
    Follow same string rules as redirect paths do
- `state` - **Any**. History state to be applied when follow this link
- `activeClassName` - **String**. Defines className for this link tag if it points to currently active URL
- `onCLick` - Link click handler, that may prevent default click handler

```ts
import A from 'siegel/lib/client_core/router/Link'

const link = <A href='/contacts' activeClassName='link_active' />
```

This component can be themed with help of `withDefaults` function as other UI components


<br /><br />


Another example with all the features included:

```ts
import React, { lazy } from 'react'
import { render } from 'react-dom'
import Router from 'siegel/lib/client_core/router'
import A from 'siegel/lib/client_core/router/Link'


const routesConfig = {
    '': {
        Page: () => <div>home page</div>
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
            '': {
                onEnter(props) {
                    //...perform some actions...
                    console.log('Entering the page')
                    return {
                        someData: 'data'
                    }
                },
                onLeave() { 
                    console.log('Leving the page')
                },
                Page: () => <div> nested page 1 </div>
            },
            nested_page_2: {
                Page: () => <div> nested page 2 </div>,
                children: {
                    '*': {
                        Page: <div> parameterized page </div>,
                        paramName: 'nestedPage2Param'
                    }
                }
            },
            nested_page_3: {
                Page: lazy(() => import('path/to/lazy_component')),
                fallback: <div>Loading...</div>
            },

            '*': {
                redirectTo: 'some_page'
            }
        }
    }
}

const Layout = props => {
    return <>
        <nav>
            <A href='/' activeClassName='link_active' children='Home' />
            <A href='/some_page' activeClassName='link_active' children='Some page' />
        </nav>

        { props.children }
    </>
}

const AppRouter = Router({
    Layout,
    children: routesConfig,
    basename: '/en'
})

render(AppRouter, document.getElementById('app'))
```