# UI Components

<br />

### Siegel provides a big set of fast and lightweight components.

<br />

Components list:
- [Accordion](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Accordion)
- [Breadcrumbs](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Breadcrumbs)
- [Button](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Button)
- [Calendar](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Calendar)
- [Checkbox](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Checkbox)
- [Clocks](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Clocks)
- [DataTable](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/DataTable)
- [DropdownSearch](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/DropdownSearch)
- [ErrorBoundary](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/ErrorBoundary)
- [Input](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Input)
- [Link](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Link)
- [NumberPicker](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/NumberPicker)
- [Pagination](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Pagination)
- [Popup](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Popup)
- [Radio](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Radio)
- [Ranger](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Ranger)
- [Select](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Select)
- [Slider](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Slider)
- [Stepper](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Stepper)
- [Swipe](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Swipe)
- [Table](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Table)
- [Tabs](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Tabs)
- [Toggle](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Toggle)


<br /><br />

## Theming

<br />

You may theme any Siegel component with `withDefaults` HOC it provides<br />
Moreover, you can do this many times with single component wraping it in the new theme on top of existing

```tsx
import React from 'react'
import withDefaults from 'siegel/lib/client_core/ui/with_defaults'
import Button from 'siegel/lib/client_core/ui/Button'

const ThemedButton = withDefaults(Button, {
    className: 'some_class',
    value: 42
})

// Render Button with value 42 and 'some_class' className applied
<ThemedButton />


const SubmitButton = withDefaults(ThemedButton, {
    type: 'submit'
})

// Render Button with 'some_class' className applied along with new type
// and new value 'send data'
<SpecialButton value='send data' />
```

<br />

Every property passed into a new theme rewrites the same property from a previous theme (if exists) with the only exception:<br />
`className` propery concatenates with previous one:

```tsx
import withDefaults from 'siegel/lib/client_core/ui/with_defaults'
import Checkbox from 'siegel/lib/client_core/ui/Checkbox'

const ThemedCheckbox = withDefaults(Checkbox, {
    className: 'some_class',
    value: true
})

// Render Checkbox with 'some_class new_class' className applied
<ThemedCheckbox className='new_class' />
```

<br />

Examples of component theming and usage you may find in demo project:<br />
[How to theme](https://github.com/CyberCookie/siegel/tree/demo_app/main/components/theme)<br/>
[How to use](https://github.com/CyberCookie/siegel/tree/demo_app/main/pages/DemoComponents/components)

<br /><br />

## Common props

<br />

### className

Defines `className` for a root tag

<br />

### theme

More complex components with nested html structure accept `theme` prop<br />
Theme is a key value pairs where key is a tag className and value is className's value<br />
Each theme has _root_ key which is root tag's className<br />
Class name, that applied to component depending on its state, has extra underscore in its name<br />
All the components are unstyled by default. In some components only required styles are applied

```tsx
import React from 'react'
import Toggle from 'siegel/lib/client_core/ui/Toggle'
import styles from './styles.sass'

<Toggle value={true}
    theme={{
        root: styles.toggle,
        label: styles.toggle_label,
        _disabled: styles.toggle__disabled
    }} />
```

<br />

### Root tag attributes

Almost every component receives `rootTagAttributes` prop, which defines all the attributes thats could be passed into a component root tag<br />


```tsx
import React from 'react'
import Table from 'siegel/lib/client_core/ui/Table'

<Table
    rootTagAttributes={{
        id: 'some_id',
        draggable: true,
        onScroll: () => {...}
    }} />
```

<br />

### Children

Some components may accept `children` as a property. Having this prop defined,<br />
component adds the children content to a special place and wrap it with _div_ tag with _children_ `theme` class name  

<br />

### Ref api

Each component receives optional ref params to provide better control over component during renders<br />

`Props.refApi` is an **Object** with the next fields:
- `getRef` - **Required** **Function**. Callback that triggered after each render. Has **2** arguments:<br />
    - **ref** - component **reference object**
    - **props** - component props
- `getOnPropsUpdate` - **Function**. Defines prop dependencies to track for changes<br />
    If defined props are changed - **getRef** callback will be fired
    - **Function** has **1** argument - component **props**
    - **Function** returns **Array of props keys**

```tsx
import React from 'react'
import Button from 'siegel/lib/client_core/ui/Button'

<Button value={42} disabled={false}
    refApi={{
        getRef(ref, props) {
            if (props.disabled) {
                ref.style.setProperty('--color', 'grey')
            }
        },
        getOnPropsUpdate: (props: ButtonProps) => [ props.disabled ]
    }}
/>
```

<br />

### Memoization

You may pass `memoDeps` prop to any Siegel component.<br />
Property itself is just a second parameter of `React.memo` function.<br />
Returns **true** if component should not update.

```tsx
import React from 'react'
import Button from 'siegel/lib/client_core/ui/Button'

<Button value={Date.now()} disabled={false}
    memoDeps={(prevProps, nextProps) => prevProps.value == nextProps.value}
/>
```


<br />

## Another mechanics worth of mentioning

<br />

### onClick

Mostly everywhere inside Siegel components **onClick** handler is replaced with **onMosueDown**<br />
This approach helps to speed up interaface by **~200ms**<br />
In some rear cases it can, though, lead to some unexpected behaviors<br />
But it can be easily handled with numerous technics, like wrapping a compoennt into another one or by preventing event bubling.

<br />

### componentID

Every component exports `componentID`. It's just a **String** that holds component uniq name, like **-ui-dropdown_search**<br />
Component function has field `ID` with this string too

<br />

### Expose component inner store with props

Store is creating with **React.useState** hook and provides state and action to update the state<br />

There are components that accept store as a property. It's because some data passed to such components can be changed within this components itself or by user outside of this component<br />
Components, that accepts store, exports `getDefaultState` function to help initialize the store

```tsx
import React, { useState } from 'react'
import Input, { getDefaultState } from 'siegel/lib/client_core/ui/Input'


const SomeComponent = () => {
    // now you can change input state.
    const inputStore = useState( getDefaultState() )
    const [{ isFocused, isTouched }, setInputState ] = inputStore


    return <Input store={ inputStore } />
}
```

<br /><br /><br />

## SASS Utils

Siegel provides several sass utility functions to help you write less<br />

You may include all the utils by importing them directly to your main css file:

```sass
@import '~siegel/lib/client_core/ui/utils'
```

<br /><br />

## font

```sass
.class
    +font(12px, 14px, grey, 600)
```

Produces
```sass
.class
    font-size: 12px
    line-height: 14px
    color: grey
    font-weight: 600
```

<br /><br />

## flex

```sass
.class
    +flex(space-between, center)
```

Produces
```sass
.class
    display: flex
    justify-content: space-between
    align-items: center
```

<br /><br />

## absolute

```sass
.class
    +absolute(8px, 0px, 16px, 0px)
```

Produces
```sass
.class
    position: absolute
    top: 8px
    right: 0
    bottom: 16px
    left: 0px
```

<br /><br />


All the util parameters are optional:

```sass
.class_a
    +absolute(5px)

.class_b
    +absolute('', '', '', 16px !important)

.class_c
    +font(16px, '', white)

.class_d
    +flex()
```

Procuces
```sass
.class_a
    position: absolute
    top: 5px

.class_b
    position: absolute
    bottom: 16px !important

.class_c
    font-size: 16px
    color: white

.class_d
display: flex
```


You may use another utility function to easily build such mixins -  __if_not_empty__ :
```sass
=border_vertical($left_width: '', $right_width: '', $color: '')
    +if_not_empty($left_width)
        border-left-width: $left_width
    
    +if_not_empty($right_width)
        border-right-width: $right_width
    
    +if_not_empty($color)
        border-color: $color

.class
    +border('', 4px, red)
```

Will result into
```sass
.class
    border-right-width: 4px
    border-color: red
```

<br />

Sintatic sugar to read variable with optional fallback:

```sass
    .class_a
        --some_var: red
        color: v(some_var, green)
    
    .class_a
        --some_var: red
        color: var(--some_var, green)
```