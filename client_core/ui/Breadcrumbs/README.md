# Breadcrumbs

Site URL breadcrumbs<br />
_Only one instance of this compoent can be present at the moment<br />


<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `crumb`<br /><br />

- `config`
    - **Required**
    - Recursive crumbs config<br />
        Has the same structure as Siegel router's children config so you can use one for both
    - **Object** where key is **pathname** part and value is **Object** with the next fields:
        - `crumb`
            - crumb value for this **pathname**
            - **String**
            - **Function**
                - has **2** arguments:
                    - **path** - **String**. Full crumb path
                    - **configPath** - **String**. Pathname key from config
                - Returns crumb value **String**
        - `dynamicCrumb`
            - Crumb for this **pathname**, that can be changed at runtime
            - **String** - uniq dynamic crumb ID<br />
            More about working with dynmic crumbs read further
        - `children` - **props.config** - recursion<br /><br />

- `separator`
    - Separator between crumbs
    - **React.ReactNode**<br /><br />

- `onChange`
    - **Required**
    - Triggered when crumb is being selected
    - **Funcion**. Has **3** arguments:
        - **path** - **String**. Full crumb path
        - **configPath** - **String**. pathname key from config 
        - **event** - **React.MouseEvent**



<br /><br />

### Dynamic crumbs

Lets say, for URL _products/fruits/:id_ we have the next breadrumbs:<br />
_Products -> Fruits -> Orange_<br />
In this case _Products_ and _Fruits_ are `crumb` since they represent static pathname parts<br />
_Orange_, on the other hand, is `dynamicCrumb`, since it represents _:id_ in URL, and this ID can by any fruit ID<br />

The fact we usually place **Breadcrumbs** in layout along with header and footer makes it diffucult to pass some deep level props, like current sele<br /><br />cted fruit, not violating _dependency inversion_ principle<br />
For this reasons **Breadcrumbs** component has it's special approach to update `dynamicCrumb` defined within config<br />
To update dynamic props we should fire **custom event**:

```jsx

import Breadcrumbs, { componentID as breadcumbsID } from 'siegel-ui/Breadcrumbs'

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
            new CustomEvent(breadcumbsID, {
                detail: {
                    fruit_name: fruit.name
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