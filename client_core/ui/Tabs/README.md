# Tabs

Provides content distributed for each tab specified<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `children`

- `refApi`

- `className`

- `theme`
    - `root`
    - `children`
    - `labels_wrapper`
    - `label`
    - `label__active`
        - Active tab's label
    - `content`
    - `content__empty`
        - If tab content is empty<br /><br />

- `tabs`
    - Represents each tab data
    - **Array of Object**. Each **Object** has the next fields:
        - `id` - **String**. Tab ID should match **props.activeTab** in order to render this tab content
        - `label` - **React.ReactNode**. Tab label content
        - `content` - **React.ReactNode | (() => React.ReactNode)**<br />
            Tab content
        - `payload` - **Any**. Data to be passed to **props.onChange** if this tab will be selected<br /><br />

- `activeTab`
    - ID of tab to show
    - **String**<br /><br />

- `onChange`
    - **Function** that is triggered when tab is selected. Has **3** arguments:
        - **id** - **String**. Selected tab ID
        - **event** - **React.MouseEvent**
        - **payload** - **Any**. Selected tab payload<br /><br />

- `renderAll`
    - Whether to render all tabs at one time. Only actie tab will be displayed though
    - **Boolean**<br /><br />

- `showEmpty`
    - Renders content wrapper if it empty
    - **Boolean**