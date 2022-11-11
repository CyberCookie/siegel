# Toggle

Simple two positioned toggle<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes

- `refApi`

- `className`

- `theme`
    - `root`
    - `_toggled`
        - If toggled
    - `_disabled`
        - If disabled
    - `children`
    - `label`
    - `toggle_area`
    - `toggler`<br /><br />

- `value`
    - **Toggle** value
    - **Boolean**<br /><br />

- `labelLeft`
    - **Toggle** label placed before toggler
    - **React.ReactNode**<br /><br />

- `labelRight`
    - **Toggle** label placed after toggler
    - **React.ReactNode**<br /><br />

- `toggleIcon`
    - Toggler icon
    - **React.ReactNode**<br /><br />

- `payload`
    - Payload to be passed to **props.onChange** handler
    - **Any**<br /><br />

- `disabled`
    - Disables **Toggle**
    - **Boolean**<br /><br />

- `onMouseDown`
    - On root tag mousedown event. May prevent inner default onMouseDown event
    - **Function** with the only argument: **event** - **React.MouseEvent<HTMLDivElement>**

- `onChange`
    - **Function** that is triggered when **Toggle** change it's value. Has **3** arguments:
        - **value** - **Boolean**. New **Toggle** value
        - **event** - **React.MouseEvent<HTMLDivElement>**
        - **payload** - **Any**. **props.payload**