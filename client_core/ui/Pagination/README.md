# Pagination

Creates paging controls<br />

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
    - `_single`
        - Applied to the root tag if there is only one page to select
    - `separator`
        - Element between side and middle pages
    - `page`
        - Numeric page switcher
    - `page__active`
        - Applied to currently selected numeric page switcher
    - `goto_prev`
        - Go to previous page element
    - `goto_next`
        - Go to next page element
    - `change__disabled`
        - Applied to page change switcher if there is no pages left before or next<br /><br />

- `listLength`
    - **Required**
    - All elements quantity
    - **Number**<br /><br />

- `curPage`
    - **Required**
    - Currently selected page
    - **Number**<br /><br />

- `showPerPage`
    - **Required**
    - Elements to show per page
    - **Number**<br /><br />

- `onChange`
    - **Required**
    - Triggered when active page is changed
    - **Function** Has **3** arguments:
        - **nextPage** - **Number**. next page to be selected
        - **event** - **React.MouseEvent<HTMLDivElement>**
        - **payload** - **props.payload**<br /><br />

- `onMouseDown`
    - Triggered right before `props.onChange` is fired. May prevent props.onCHange
    - **Function** with the only argument: **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `elementsBySide`
    - Number of numeric page switchers by the sides of Paginator
    - **Number**
    - Default is **1**<br /><br />

- `elementsByMiddle`
    - Number of numeric page switchers between side switchers
    - **Number**
    - Default is **1**<br /><br />

- `iconPrev`
    - Go to previous page button icon
    - **React.ReactNode**
    - Default is **'<'**<br /><br />

- `iconNext`
    - Go to next page button icon
    - **React.ReactNode**
    - Default is **'>'**<br /><br />

- `separator`
    - Element between side and midle pages
    - **React.ReactNode**
    - Default is **'...'**<br /><br />

- `payload`
    - Any data to be passed to `props.onChange` callback
    - **Any**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `fixedLength`
    - Number of items at the moment always same
    - **Boolean**
    - Default is **true**