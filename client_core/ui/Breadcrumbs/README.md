# Breadcrumbs

Site URL breadcrumbs<br />

<br />

## Props:

- `refApi`
    - Component root reference params<br /><br />

- `className`
    - Root element class name
    - **String**<br /><br />

- `theme`
    - `root`
        - Root tag
    - `crumb`
        - Each breadcrumb<br /><br />

- `config`
    - **Required**
    - Breadcrumbs config<br />
        Has the same structure as Siegel router's children config so you can use one for both
    - **Object** where key is **pathname** part and value is **Object** with the next fields:
        - `crumb`
            - crumb value for this **pathname**
            - **React.ReactNode**
            - **Function**
                - has **2** arguments:
                    - **path** - **String**. Full crumb path
                    - **configPath** - **String**. Pathname key from config
                - Returns crumb value **String**
        - `dynamicCrumb`
            - Crumb for this **pathname**, that can be changed at runtime
            - **String** - uniq dynamic crumb ID<br />
            More about working with dynmic crumbs read further
        - `children` - `props.config`<br /><br />

- `onChange`
    - **Required**
    - Triggers when crumb link is clicked
    - **Funcion**. Has **3** arguments:
        - **path** - **String**. Full crumb path
        - **configPath** - **String**. Pathname key from config 
        - **event** - **React.MouseEvent<HTMLAnchorElement>**<br /><br />

- `separator`
    - Crumbs separator element
    - **React.ReactNode**<br /><br />

- `dynamicCrumbsID` - String ID to be used in cutom event to trigger dynamic crumbs update.<br />
    Provide only if you use more than one Breadcrums component with dynamic crumbs in it
    - **String**<br /><br />

- `rootTagAttributes`
    - **div** root tag attributes<br /><br />

<br /><br />

### Dynamic crumbs

Lets say, for URL _products/fruits/:id_ we have the next breadrumbs:<br />
_Products -> Fruits -> Orange_<br />
In this case _Products_ and _Fruits_ are `crumb` since they represent static pathname parts<br />
_Orange_, on the other hand, is `dynamicCrumb`, since it represents _:id_ in URL, and this ID can by any fruit ID<br />

**Breadcrumbs** component has its special approach to update `dynamicCrumb` you may defined in config - by firing a **custom event**:<br />

```jsx
import Breadcrumbs, { componentID as breadcumbsComponentID } from 'siegel/lib/client_core/ui/Breadcrumbs'

// Define breadcrumbs config
const breadcrumbsConfig = {
    products: {
        crumb: 'Product',
        children: {
            fruits: {
                crumb: 'Fruits',
                children: {
                    ':id': {
                        dynamicCrumb: 'fruit_name'
                    }
                }
            }
        }
    }
}


// Top level component
const Layout = props => {
    return (
        <div>
            <Breadcrumbs config={ breadcrumbsConfig } />
            { props.children }
        </div>
    )
}



function getFruitDetails() {
    fetch( ... ).then(fruit => {
        // Changing dynamic crumbs state by firing custom event
        dispatchEvent(
            new CustomEvent(breadcumbsComponentID, {
                detail: {
                    crumbs: {
                        fruit_name: fruit.name
                    }
                }
            })
        )
    })
}


// It is Layout's props.children 
const SomePage = () => {
    return <button onClick={ getFruitDetails }>
}

```



### Using with Router

Since both [Router](https://github.com/CyberCookie/siegel/tree/master/client_core/router) and breadcrumb configs are similar - you may use one config for both components as described below:<br />


```js
import type { RoutesConfig } from 'siegel/lib/client_core/router/types'
import type { CrumbComposedConfig } from 'siegel/lib/client_core/ui/Breadcrumbs'


const routesConfig: RoutesConfig<CrumbComposedConfig> = {
    '': {
        crumb: 'Home',
        Page: <div />
    },

    user: {
        dynamicCrumb: 'user',
        Page: <div />
    },

    contacts: {
        crumb: 'About',
        Page: <div />,
        children: {
            contacts: {
                crumb: 'Contacts',
                Page: <div />
            }
        }
    }
}
```