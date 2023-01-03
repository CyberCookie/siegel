# Select

Dropdown options selector<br />

<br />

## Props:

- `refApi`
    - Component root reference params<br /><br />

- `className`
    - Root element class name
    - **String**<br /><br />

- `theme`
    - `root`
        Root tag
    - `_active`
        - Root tag state if select is in focus
    - `_disabled`
        - Root tag state if select is disabled
    - `_error`
        - Root tag state if `props.errorMsg` is defined
    - `_filled`
        - Root tag state if select has selected value
    - `children`
        - `props.children` element
    - `label`
        - Select component label
    - `title_wrapper`
        - Wraps title_text, reset and `props.dropdownIcon`
    - `title_text`
        - Title text element
    - `input_wrapper`
        - Wraps `title_wrapper`, `options` and `error_text`, if label is applied
    - `reset`
        - `props.resetIcon` element
    - `error_text`
        - `props.errorMsg` element
    - `options`
        - Select options
    - `option`
        - Each Select option
    - `option__active`
        - Currently selected option
    - `option__disabled`
        - Disabled option<br /><br />

- `options`
    - **Required**
    - Possible options to choose
    - **Object[]** with the next fields
        - `value` - **Any**. Option value
        - `title` - **React.ReactNode**. Option text element
        - `disabled` - **Boolean**. Disable this option
        - `payload` - **Any**. Any value to be passed to `props.onChange` callback
        - `className` - **String**. Option class name<br /><br />
    
- `onChange`
    - Triggered when you choose new option
    - **Function** Has **3** arguments:
        - **value** - **Any**. Option's value
        - **event** - **React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>**
        - **payload** - **props.options[number].payload**. Option payload<br /><br />

- `onFocus`
    - Root tag focus event handler. May prevent inner default onFocus event
    - **Function** with the only argument: **event** - **React.FocusEvent<HTMLDivElement>**<br /><br />

- `onBlur`
    - Root tag blur event handler. May prevent inner default onBlur event
    - **Function** with the only argument: **event** - **React.FocusEvent<HTMLDivElement>**<br /><br />

- `onKeyDown`
    - Root tag keydown event handler. May prevent inner default onKeyDown event
    - **Function** with the only argument: **event** - **React.KeyboardEvent<HTMLDivElement>**<br /><br />

- `children`
    - Children element to be rendered at root level
    - **React.ReactNode**<br /><br />

- `store`
    - **Static**
    - Select inner store
    - State is an **Object** with the next fields:
        - `isActive` - **Boolean**. Whether select is in focus
        - `arrowSelectIndex` - **Number | undefined**. Option index, choosen with keyboard arrows,<br />
        before you press __Enter__ to select it<br />
        This field specify currently selected option index
    - Component exports `getDefaultState` function to init outer store's state<br /><br />

- `getDisplayValue`
    - Constructs component input title
    - **Function**
        - Has **1** argument: **props.options** option
        - Returns: **React.ReactNode**<br /><br />

- `errorMsg`
    - Error message
    - **React.ReactNode**<br /><br />

- `dropdownIcon`
    - Icon to use near title
    - **React.ReactNode**<br /><br />

- `resetIcon`
    - Icon to use to reset selected option. Definition of this icon provides reset functionality
    - **React.ReactNode**<br /><br />

- `closeOnSelect`
    - Whether to close options list when an option has been picked
    - **Boolean**
    - Default is **true**<br /><br />

- `label`
    - **Select** component label
    - **React.ReactNode**<br /><br />

- `placeholder`
    - String to place instead of **props.getDisplayValue()** when option is not selected
    - **React.ReactNode**<br /><br />

- `selected`
    - Selected option
    -  **Any**. Should be equal to **value** of some **props.opions** option<br /><br />

- `listSelectedOption`
    - Whether to filter out selected option from the options list
    - **Boolean**
    - Default is **true**<br /><br />

- `listDisabledOptions`
    - Whether to show disabled options in a options list
    - **Boolean**
    - Default is **true**<br /><br />

- `disabled`
    - Disalbes select component
    - **Boolean**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes