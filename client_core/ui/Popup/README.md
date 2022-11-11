# Popup

Site popup implementation<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `content`
    - `close`<br /><br />

- `onClose`
    - **Required**
    - **Function** that is triggered when you close **Popup**. Has **1** argument:
        - **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `onMouseDown`
    - On root tag mousedown event. May prevent inner default onMouseDown event
    - **Function** with the only argument: **event** - **React.MouseEvent<HTMLDivElement>**

- `closeIcon`
    - Icon to put in close control element
    - **React.ReactNode**<br /><br />

- `content`
    - Content to be rendered inside **Popup**
    - **React.ReactNode**