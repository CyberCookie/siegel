# Radio

Radio buttons allows you to select one or few options out of given group<br />

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
    - `_disabled`
        - Root tag state if Radio component is disabled
    - `option`
        - Radio option
    - `option__selected`
        - Radio option selected<br /><br />

- `selected`
    - Selected option(s)
    - **String | Set<String>**. Depends on **props.multiple**<br /><br />

- `onChange`
    - **Required**
    - Triggered when you pick an option
    - **Function** Has **3** arguments:
        - **id** - Option ID
        - **event** - **React.MouseEvent<HTMLDivElement>**
        - **payload** - Option payload<br /><br />

- `options`
    - Radio options
    - **Object[]** with the next fields:
        - `id`
            - **Required**
            - Option value
            - **String**

        - `content`
            - **Required**
            - Option text
            - **React.ReactNode**

        - `className`
            - Option class name
            - **String**

        - `payload`
            - Extra value to be passed to callback along with option value
            - **Any**<br /><br />

- `multiple`
    - **Required** if type of **props.selected** is **Set**
    - Allows to select multiple options
    - **Boolean**<br /><br />

- `disabled`
    - Disables radio buttons component
    - **React.ReactNode**<br /><br />

- `rootTagAttrib**utes`
    - **div** tag attributes