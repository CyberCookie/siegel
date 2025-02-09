# Tabs

Provides content distributed for each tab specified<br />

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
    - `children`
        - `props.children` element
    - `labels_wrapper`
        - Wraps all the tabs labels
    - `label`
        - Tab label
    - `label__active`
        - Active tab's label
    - `content`
        - Tab content
    - `content__empty`
        - Tab content state if there is no content defined<br /><br />

- `tabs`
    - Represents each tab data
    - **Object[]**. Each **Object** has the next fields:
        - `id` - **String**. Tab ID
        - `label` - **React.ReactNode**. Tab label content
        - `content` - **React.ReactNode | (() => React.ReactNode)**<br />
            Tab content
        - `contentClassName` - **String**. Classname to be applied to tab's content when active
        - `labelClassName` - **String**. Classname to be applied to this label
        - `payload` - **Any**. Data to be passed to **props.onChange** callback
        - `prerender` - **Boolean**. Always render tab with display: none if not selected<br /><br />

- `onChange`
    - Triggered when tab is selected
    - **Function** Has **3** arguments:
        - **id** - **String**. Selected tab ID
        - **event** - **React.MouseEvent<HTMLDivElement>**
        - **payload** - **Any**. Payload to be passed to `props.onChange` callback<br /><br />

- `children`
    - Children content to be rendered at the root level
    - **React.ReactNode**<br /><br />

- `showEmpty`
    - Renders content wrapper if it's empty
    - **Boolean**<br /><br />

- `activeTab`
    - Active tab ID
    - **String**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes