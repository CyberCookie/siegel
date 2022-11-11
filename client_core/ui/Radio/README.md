# Radio

Radio buttons allows you to select one or few options out of given group<br />

<br />

## Props:

- `rootTagAttrib**utes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `_disabled`
        - Applied to disabled radio butttons component
    - `option`
    - `option__selected`
        - Selected option<br /><br />

- `selected`
    - Selected options
    - **String | Set<String>**. Depends on **props.multiple**<br /><br />

- `onChange`
    - **Required**
    - **Function** that is triggered when you pick an option. Has **3** arguments:
        - **id** - Option ID
        - **event** - **React.MouseEvent<HTMLDivElement>**
        - **payload** - Option payload<br /><br />

- `multiple`
    - **Required** if type of **props.selected** is **Set**
    - Allows for multiple opions selection
    - **Boolean**<br /><br />

- `disabled`
    - Disables radio buttons component
    - **React.ReactNode**