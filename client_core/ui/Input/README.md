# Input

Input field to type text into<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `inputAttributes`
    - **input** tag attributes<br /><br />

- `className`

- `theme`
    - `root`
    - `_filled`
        - Text field is not empty
    - `_focused`
        - Text field is in focus
    - `_touched`
        - Applied to root tag if there was an interaction with input field, like focus
    - `_error`
        - Input has errors
    - `_readonly`
        - Inpt is in **readonly** mode
    - `_disabled`
        - Input is disabled
    - `label`
    - `label_text`
    - `field`
    - `error_text`
    - `textarea`
        - Applied to input field if **props.type** is **textarea**
    - `children`<br /><br />

- `value`
    - Input value
    - **String**<br /><br />

- `store`
    - **Static**
    - Store, created with **React.useState** store, to be used in data table
    - State is an **Object** with the next fields:
        - `isTouched` - if input has been focused at least one time
        - `isFocused` - if input is focused<br /><br />

- `disabled`
    - Disables input field
    - **Boolean**<br /><br />

- `autofocus`
    - **Static**
    - Focuses input field on first render
    - **Boolean**<br /><br />

- `placeholder`
    - Input field placeholder
    - **String**<br /><br />

- `label`
    - Input field label
    - **React.ReactNode**<br /><br />

- `errorMsg`
    - Error message to be displayed near input field
    - **React.ReactNode**<br /><br />

- `type`
    - Input field type
    - **'input' | 'textarea' | 'password' | 'color' | 'date' | 'week' | 'month' | 'time' | 'datetime-local'**<br /><br />

- `payload`
    - Data to be passed to **props.onChange** handler
    - **Any**<br /><br />

- `regexp`
    - Input field regexp validator
    - **RegExp**<br /><br />

- `debounceMs`
    - **Static**
    - Set onChange debounce miliseconds
    - **Number**<br /><br />

- `mask`
    - Applies mask to input field
    - **Object** with the next fields:
        - `pattern` - **Required** **String**. Mask pattern
        - `patterValueChar` - **Required** **Char**. Specify what char in the pattern is value, when editing
        - `processor` - **Required**. Mask processor. Imported separately in order to reduce component size
        - `valuePlaceholderChar`
            - Specify what char in the pattern represents empty value
            - **Char**
            - Default is **' '** (empty space)
        - `shiftNextChar`
            - Determines behavior when we input value before existing one. If **false** then next value is replasing by new one
            - **Boolean**
            - Default is **true**
        - `copyMask` - **Boolean**. Whether to copy full mask or only its value<br /><br />

- `onBlur`
    - Triggered when input field loses focus<br />
    **Function**  has **1** argument:
        - **event** - **React.FocusEvent**<br /><br />

- `onFocus`
    - Triggered when input field gets focus
    - **Function** has **1** argument:
        - **event** - **React.FocusEvent**<br /><br />

- `onChange`
    - Triggered on input field change and when field loses focus<br />
        Input will have _read mode_ If no **props.onChange** handler is specified 
    - **Function** has **3** arguments:
        - **value** - **String**. New **Input** value
        - **event** - **React.ChangeEvent | React.KeyboardEvent**
        - **payload** - **props.payload**


</br>

## Mask

Example of mask usage:

```jsx
import React from 'react'
import Input from 'siegel-ui/Input'
import maskProcessor from 'siegel-ui/Input/mask_processor'


const mask = {
    processor: maskProcessor,
    pattern: '`*--`---*',
    patternValueChar: '*',
    valuePlaceholderChar: '_'
}


// Will render input with value: '345--2_---_'
<Input value='3452' mask={ mask } />
```