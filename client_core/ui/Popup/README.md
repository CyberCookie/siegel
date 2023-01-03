# Popup

Site popup implementation<br />

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
    - `content`
        - Popup content wrapper
    - `close`
        - Popup close icon<br /><br />

- `onClose`
    - **Required**
    - Triggered when user closes a popup
    - **Function** Has **1** argument:
        - **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `onMouseDown`
    - Root tag onmousewon event. May prevent `props.onClose` event
    - **Function** with the only argument: **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `closeIcon`
    - Popup close icon
    - **React.ReactNode**<br /><br />

- `content`
    - Popup content
    - **React.ReactNode**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes