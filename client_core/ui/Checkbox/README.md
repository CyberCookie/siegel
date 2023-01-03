# Checkbox

Customizable checkbox<br />

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
    - `_checked`
        - Root tag state if checkbox is checked
    - `_disabled`
        - Root tag state if checkbox is disabled
    - `label`
        - Checkbox label
    - `checkbox`
        - Checkbox input tag
    - `with_icon_wrapper`
        - Applied to checkbox tag wrapper if icon is applied
    - `label_wrapper`
        - Applied to label wrapper tag if label is applied<br /><br />

- `value`
    - Checkbox value
    - **Boolean**
    - Default is **false**<br /><br />

- `onChange`
    - Triggered on checkbox click
    - **Function**. Has **3** arguments:
        - **checked** - **Boolean**. New checkbox value
        - **event** - **React.MouseEvent<HTMLDivElement | HTMLLabelElement | HTMLInputElement>**
        - **payload** - `props.payload`<br /><br />

- `onMouseDown`
    - Triggered right before `props.onChange` handler is fired. Can prevent props.onChange from beeing triggered
    - **Function** with the only argument:
        -   **event** - **React.MouseEvent<HTMLDivElement | HTMLLabelElement | HTMLInputElement>**<br /><br />

- `checkboxAttributes`
    - **input** tag attributes<br /><br />

- `rootTagAttributes`
    - **div | label** tag attributes. Label attributes if **props.label** is defined<br /><br />

- `label`
    - **Checkbox** label
    - **React.ReactNode**<br /><br />

- `icon`
    - **Checkbox** checked icon
    - **React.ReactNode**<br /><br />

- `disabled`
    - Disables **Checkbox**
    - **Boolean**<br /><br />

- `payload`
    - Any value to be present in `props.onChange` callback
    - **Any**