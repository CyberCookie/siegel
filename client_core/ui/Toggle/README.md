# Toggle

Simple two positioned toggle<br />

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
    - `_toggled`
        - Root tag state if Toggle is toggled
    - `_disabled`
        - Root tag state if Toggle is disabled
    - `children`
        - `props.children` element
    - `label`
        - Toggle labels element
    - `toggle_area`
        - Toggle area element which keeps toggler element
    - `toggler`
        - Toggler element<br /><br />

- `children`
    - Children element to be rendered at the root level
    - **React.ReactNode**

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
    - Payload to be passed to **props.onChange** callback
    - **Any**<br /><br />

- `disabled`
    - Disables **Toggle**
    - **Boolean**<br /><br />

- `onChange`
    - Triggered when user change **Toggle** value
    - **Function** Has **3** arguments:
        - **value** - **Boolean**. New **Toggle** value
        - **event** - **React.MouseEvent<HTMLDivElement>**
        - **payload** - **Any**. **props.payload**<br /><br />

- `onMouseDown`
    - Root tag mousedown event handler. May prevent inner default onMouseDown event
    - **Function** with the only argument: **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes