# Checkbox

Customizable checkbox<br />

<br />

## Props:

- `rootTagAttributes`
    - **div | label** tag attributes. Label attributes if **props.label** is defined<br /><br />

- `refApi`

- `checkboxAttributes`
    - **input** tag attributes<br /><br />

- `className`

- `theme`
    - `root`
    - `_checked`
    - `_disabled`
    - `label`
    - `checkbox`
    - `with_icon_wrapper`
    - `label_wrapper`<br /><br />

- `value`
    - Checkbox state
    - **Boolean**
    - Default is **false**<br /><br />

- `onChange`
    - **Function**. Has **3** arguments:
        - **checked** - **Boolean**
        - **event** - **React.MouseEvent**
        - **payload** - **props.payload**<br /><br />

- `onYearSwitch`
    - Same signature as **props.onMonthSwitch**<br /><br />

- `label`
    - **Checkbox** label
    - **React.ReactNode**<br /><br />

- `icon`
    - **Checkbox** check icon
    - **React.ReactNode**<br /><br />

- `disabled`
    - Disable **Checkbox**
    - **Boolean**<br /><br />

- `payload`
    - Data to be passed to **props.onChange** handler
    - **Any**