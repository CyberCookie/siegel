# Select

Dropdown options selector<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `_active`
        - Applied if select is in focus
    - `_disabled`
        - Applied if select is disabled
    - `_filled`
        - Applied if select has selected value
    - `_error`
        - Applied if `props.errorMsg` is not empty
    - `children`
    - `label`
    - `title`
    - `title_text`
    - `input_wrapper`
    - `reset`
    - `error_text`
    - `options`
    - `option`
    - `option__active`
    - `option__disabled`<br /><br />

- `options`
    - **Required**
    - Possible options to choose
    - **Object[]** with the next fields
        - `value` - **Any**. Option's value
        - `title` - **React.ReactNode**. Option's text
        - `disabled` - **Boolean**. Disable this option
        - `payload` - **Any**
        - `className` - **String**. Option's clas name<br /><br />
    
- `onChange`
    - **Function** that is triggered when you change selected range. Has **3** arguments:
        - **value** - **Any**. Option's value
        - **event** - **React.KeyboardEvent | React.MouseEvent**
        - **payload** - **props.options[number].payload**. Option's payload<br /><br />

- `selected`
    - Selected option
    -  **Any**. Should be equal to **value** of some **props.opions** option<br /><br />

- `filterSelected`
    - Whether to filter out selected option from the options list
    - **Boolean**
    - Default is **true**<br /><br />

- `store`
    - Store, created with **React.useState** store, to be used in select component
    - State is an **Object** with the next fields:
        - `isActive` - **Boolean**. Whether select is in focus
        - `arrowSelectIndex` - **Number**. Option index, choosen with keyboard arrows, before you press __Enter__ to select it<br /><br />

- `getDisplayValue`
    - **Function** to construct select component input title
        - Has **1** argument: **props.options** option
        - Returns: **React.ReactNode**<br /><br />

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
    - **Select** component lbel
    - **React.ReactNode**<br /><br />

- `errorMsg`
    - Error message
    - **React.ReactNode**

- `placeholder`
    - String to place instead of **props.getDisplayValue()** when option is not selected
    - **React.ReactNode**<br /><br />

- `disabled`
    - Disalbes select component
    - **Boolean**