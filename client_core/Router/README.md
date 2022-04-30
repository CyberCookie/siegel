# Router

Siegel router allows you to construct site routing of any complexity<br />
with such features as page wrapping with `Layout`, URL params support, dynamicaly changing path `basename` and more.

<br />

Router is a React component, that can have the next props:

- `Layout` - **React.ComponentType | React.LazyExoticComponent**.<br />
    React component to wrap all the children pages
- `basename` - url path prefix
- `children` - **Object**. Router config. Where _key_ is a route url and _value_ is **Object** that represents route config<br />
**Object** has the next fields:
    - `Page` - **React.ComponentType | React.LazyExoticComponent**. Page to render
    - `Layout` - Same as Router props `Layout`
    - `fallback` - **React.ReactNode**. Component to display while `page` or `Layout` is lazy loading
    - `onEnter` - **Function** that executes before first page render<br />
        Data returned from the function is passed as `onEnterData` prop to the page props<br />
        - Function has **1** argument:
            - **URLParams** - **Object** with parsed url params
        - Returns **void | Object**
    - `onLeave` - **Function** that is triggered before current component will be replaced with another one 
    - `paramName` - **String**. URL parameter name in dynamic route
    - `redirectTo` - **String**. Path to redirect to if current route url was matched
    - `children` - **Object**. Nested routes - recursion.

<br />

Lets say you need to have *www.somesite.com/goods/fruits/orange* url on your site, where *orange* is URL parameter.<br />
Also we need to have *contacts* page accessible by *www.somesite.com/contacts* url.<br />
Sometimes users type incorrect url that is not present on site. For such cases we need to have 404 page users will be redirected to in a case user typed incorrect url.<br />
Config:

```js
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
    404: {
        Page: () => <div>page not found</div>
    },
    '*': {
        redirectTo: '/404'
    }
}
```

First we defined top level routes with url parts `goods`, `contacts` and empty path for the home page.<br />
We also applied pages that should be rendered if we type related urls in browser address bar, for example *www.somesite.com/goods* <br />
Defining `children` opens us the way to describe nested routes.<br />
At the deepest path level we used wildcard ( * ) - this symbols means we match every route at this level<br />
and any fruit we type in url eventually will fall down in this route, for example *www.somesite.com/goods/fruits/kiwi*<br />
Finally, at the top level we defined *all routes* path ( * ) to match any route we didn't specify and, in this case, redirect to 404 page.<br />

<br />

### Redirects

In example above we used */404* path to say we want to redirect to *www.somesite.com/404* page.<br />
There are few symbols we can place at the beginning of redirection path string to explicitly say which path we want redirect to:
- / - defines absolute path
- ! - redirects to the same level replacing last path piece
- no symbol - redirecs relatively to the current path, adding new path piece

For example, with url *www.somesite.com/goods/vegetables*<br />
redirectTo **/contacts** will throw us on *www.somesite.com/**contacts***<br />
redirectTo **!fruits** -> *www.somesite.com/goods/**fruits***<br />
redirectTo **potato** -> *www.somesite.com/goods/vegetables/**potato***<br />

<br /><br />

## History

Router component patches `history` with own `push` method in order to intercept and react on location changes. Under the hood it uses `history.pushState` and `history.replaceState`.<br />
Newly added method `history.push` receives **3** arguments:
- **url** - **String**. url to change path to. Same as url in `history.pushState / replaceState`
- **state** - **Any**. Same as `history.pushState / replaceState` state
- **isReplace** - **Boolean | undefined**. Whether to use `history.replaceState` or `history.pushState`

URL strings in `push` method have the same behaviour as `redirectTo`, described above.

<br />

Also router component patches `history` with `history.basename` property and `history.updateBasename` method<br />
in the case you've provided `basename` prop to the Router.<br />
`history.basename` holds actual basename, while `history.updateBasename` is here to update it.<br />
`updateBasename` receives **1** argument - **newBasename** (**String**)

<br />


## Site navigation

Router exports component for inner site navigation. It's fully compatible with html `a` tag<br />
but with `onCLick` handler included, that you may prevent of extend.<br />
And new prop `activeClassName`, which defines class for this link if it points to currently active url.

```js
import A from 'siegel-router/Link'

const link = <A href='/contacts' activeClassName='link_active'>
```

<br /><br />


Another example with all the features included:

```js
import React, { lazy } from 'react'
import { render } from 'react-dom'
import Router from 'siegel-router'
import A from 'siegel-router/Link'


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