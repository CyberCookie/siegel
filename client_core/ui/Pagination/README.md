# Pagination

Creates paging controls<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `_single`
        - Applied to the root tag if there is only one page to select
    - `separator`
    - `control`
        - Applied to page change controls and to pages itselfs
    - `control__active`
        - Applied to currently selected page
    - `control__disable`
        - Applied to page change control if there is no pages before or next<br /><br />

- `listLength`
    - **Required**
    - Items count paging is using for
    - **Number**

- `curPage`
    - **Required**
    - Current selected page
    - **Number**

- `showPerPage`
    - **Required**
    - Number of items showing per page
    - **Number**

- `onChange`
    - **Required**
    - **Function** that is triggered when page change occurs. Has **3** arguments:
        - **nextPage** - **Number**. next page to be selected
        - **event** - **React.MouseEvent**
        - **payload** - **props.payload**

- `elementsBySide`
    - Minimum count of pages in the beginnig and in the end of pages row
    - **Number**
    - Default is **1**

- `elementsByMiddle`
    - Minimum count of pages by the middle pages
    - **Number**
    - Default is **1**

- `iconPrev`
    - Icon to be placed into previous page selector control
    - **React.ReactNode**
    - Default is **'<'**

- `iconNext`
    - Icon to be placed into next page selector control
    - **React.ReactNode**
    - Default is **'>'**

- `separator`
    - Space between pages side and middle pages
    - **React.ReactNode**
    - Default is **'...'**

- `fixedLength`
    - Number of items at the moment always same
    - **Boolean**
    - Default is **true**

- `payload`
    - Data to be passet to **props.onChange** handler
    - **Any**