# Input

Input field to type text into<br />

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
    - `_filled`
        - Root tag state if input is not empty
    - `_error`
        - Root tag state if `props.errorMsg` is defined
    - `_disabled`
        - Root tag state if Input `props.disabled` is true
    - `_focused`
        - Root tag state if Input component is focused
    - `_touched`
        - Applied to root tag if there was an interaction with input field, like focus
    - `_readonly`
        - Root tag state if no `props.onChange` handler provided
    - `_textarea`
        - Root tag state if props.type is textarea
    - `children`
        - `props.children` element
    - `label`
        - Input label wrapper
    - `label_text`
        - Input label text
    - `field`
        - Input tag
    - `error_text`
        - Error text<br /><br />

- `children`
    - Any children element to be rendered next to input tag element
    - **React.ReactNode**<br /><br />

- `value`
    - Input value
    - **String**<br /><br />

- `store`
    - **Static**
    - Inner store
    - State is an **Object** with the next fields:
        - `isTouched` - If input been focused at least once
        - `isFocused` - If currently focused
    - Component exports `getDefaultState` function to init outer store's state<br /><br />

- `disabled`
    - Disables Input component
    - **Boolean**<br /><br />

- `autofocus`
    - **Static**
    - Autofocus Input component on first render
    - **Boolean**<br /><br />

- `placeholder`
    - Input tag placeholder
    - **String**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `inputAttributes`
    - **input** tag attributes<br /><br />

- `label`
    - Input label text
    - **React.ReactNode**<br /><br />

- `errorMsg`
    - Error text
    - **React.ReactNode**<br /><br />

- `type`
    - Input tag type
    - **'input' | 'textarea' | 'password' | 'color' | 'date' | 'week' | 'month' | 'time' | 'datetime-local'**<br /><br />

- `payload`
    - Any data to be returned in `props.onChange` callback
    - **Any**<br /><br />

- `regexp`
    - Input value regexp
    - **RegExp**<br /><br />

- `debounceMs`
    - **Static**
    - Provides delay after which props.onChange is triggers
    - **Number**<br /><br />

- `prefix`
    - Input value to be applied before `props.value`
    - **String**<br /><br />

- `suffix`
    - Input value to be applied after `props.value`
    - **String**<br /><br />

- `mask`
    - Applies input mask
    - **Object** with the next fields:
        - `pattern` - **Required** **String**. Provides string pattern to describe a mask
        - `patterValueChar` - **Required** **Char**. Pattern char to be replaced with `props.value` chars
        - `processor` - **Required**. Mask processor you should import from Input component and apply separately
        - `valuePlaceholderChar`
            - Char to be placed instead empty `props.value` chars
            - **Char**
            - Default is **' '** (empty space)
        - `shiftNextChar`
            - Whether to shift next chars during typing
            - **Boolean**
            - Default is **true**
        - `copyMask` - **Boolean**. Whether to copy the whole mask or only `props.value` when perform ctrl+c on input
        - `formatterMode` - **Boolean**. Enables lazy mask appliance - new mask characters appears during value update<br /><br />

- `onChange`
    - Triggered when user updates input value 
    - **Function** has **3** arguments:
        - **value** - **String**. New **Input** value
        - **event** - **React.ChangeEvent | React.KeyboardEvent**
        - **payload** - **props.payload**<br /><br />

- `onBlur`
    - Triggered when Input component lost its focus<br />
    - **Function**  has **1** argument:
        - **event** - **React.FocusEvent**<br /><br />

- `onFocus`
    - Triggered when Input component takes focus
    - **Function** has **1** argument:
        - **event** - **React.FocusEvent**


</br>

## Mask

Example of mask usage:

```tsx
import React from 'react'
import Input from 'siegel/lib/client_core/ui/Input'
import maskProcessor from 'siegel/lib/client_core/ui/Input/mask_processor'


const mask = {
    processor: maskProcessor,
    pattern: '`*--`---*',
    patternValueChar: '*',
    valuePlaceholderChar: '_'
}


// Will render input with value: '345--2_---_'
<Input value='3452' mask={ mask } />
```