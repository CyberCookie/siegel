# DataTable

Configurable and flexible data grid to manage big amount of data, built on top of **Table** component. Can receive **Pagination** and **Select** components to work with<br />

[Table](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Table)
[Pagination](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Pagination)
[Select](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Select)

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
    - `_with_footer`
        - Root tag state if footer is applied
    - `table`
        - Underlaying table tag
    - `children`
        - `props.children` element
    - `table_resizer`
        - Data table column resizers elemnts
    - `pagination_wrapper`
        - Pagination wrapper element
    - `pagination_single_page`
        - Applied to pagination wrapper if there is only one page in pagination<br /><br />

- `entities`
    - **Required**
    - Data table entities to be listed
    - **Object** with the next fields:
        - `byID` - **Object**. represents all the entities where key is an entity uniq ID<br />
            and value as an entity itself
        - `sorted` - **String[]**. Array of uniq IDs thats represent entities order within DataTable<br /><br />

- `columnsConfig`
    - **Required**
    - Data table columns configurations
    - **Object[]** with the next fields:
        - `ID` - **Required** **String**. Column ID
        - `label` - **React.ReactNode**. Column TH tag text
        - `customParams` - **Any**. Any custom params you may extend column config with
        - `showValue` - **Required** **Function**. Get display value
            - Has **2** arguments:
                - **entity** - **Object**. Table entity
                - **indexes** - **Object** with the next fields:
                    - **gridIndex** - **Number**. Data grid row index
                    - **pageIndex** - **Number**. Data grid row index of the current page
            - Returns **TableTD**
        - `onSort` - **Function**. Sorts list of entities by sorting their IDs
            - Has **3** arguments:
                - **IDs** - **props.entities.sorted**. entities IDs array
                - **byID** - **props.entities.byID**. entities hashtable where key is entity ID and value is entity
                - **value** - **Number**. sorting value
            - Returns IDs: **String[]**
        - `onFilter` - **Function**. Filters list of entities by filtering out their IDs
            - Has **3** arguments:
                - **IDs** - **props.entities.sorted**. entities IDs array
                - **byID** - **props.entities.byID**. entities hashtable where key is entity ID and value is entity
                - **search** - **Any**. search value you put into DataTable store<br /><br />

- `pinnedEntities`
    - Data table entitites that always appear on top of the table.<bt />
        The entities can't be filtered out
    - **Object** - same structure as `props.entities`<br /><br />

- `store`
    - **Static**
    - Data table inner store
    - State is an **Object** with the next fields:
        - `sortByField` - **Object**. Entities sorting params. Has the next fields:
            - `ID` - **String | undefined** - Active sorting column ID
            - `value` - **Number** - sort value **-1 | 0 | 1**
        - `searchByField` - **Object** Entities filtering params, where key is a column ID and value is a filtering value
        - `toggleColumns` - **Set<props.columnsConfig.ID>**. Column IDs to be hidden
        - `showPerPage` - **Number**. Number of entities showed per one pagination page
        - `currentPage` - **Number**. Current pagination page starting from 1
        - `__resultIDs` - **string[]**. Readonly inner filtered `props.entities.sorted` array of entities IDs */<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `withFooter`
    - Table footer you may apply pagination parameters to
    - **Object** with the next fields:
        - `defaultShowPerPage` - **Required** **Number**. Default number of entities to show per paginationPage
        - `displayQuantity` - **Function**. Helps to render all entities quantity label
            - Has **1** argument - quantity: **Number**
            - Returns **React.ReactNode**
        - `select` - **Object**. Show per page select params. Has the next fields:
            - `props` - Siegel **Select** props where option value is show per page value
            - `component` - Siegel **Select** component
        - `pagination` - **Object**. Pagination params. Has the next fields:
            - `props` - Siegel **Pagination** props
            - `component` - Siegel **Pagination** component
            - `isRenderForSinglePage` - **Boolean**. Render paginator component if there is only one page available<br /><br />

- `virtualization`
    - Allows you to render infinite list of entities applying scrolling window
    - **Object** with the next fields:
        - `itemHeight` - **Required** **Number**. Row height
        - `tableHeight` - **Number**. Table height. Default is **innerHeight**
        - `preloadedItemsBySide` - **Number**. Defines number of rows to preload by the side of scrolling window. Default is **20**
        - `scrollUpdateInterval` - **Number**. After scrolling delay in ms after which rows will be updated. Default is **350**ms<br /><br />

- `onScroll`
    - Triggered when you scroll the data table. May prevent virtualization scroll event
    - **Function** with the only argument: **event** - **React.UIEvent<HTMLDivElement>**<br /><br />

- `children`
    - Any children element you may put inside DataTable markup at the root level
    - **React.ReactNode**<br /><br />

- `tableAttributes`
    - **table** tag attributes<br /><br />

- `resizable`
    - Makes table columns to be resizable horizontally
    - **Boolean**<br /><br />

- `postProcessHeadCell`
    - Post processes every column header to be rendered in DataTable by mutating resulting headCell
    - **Function**. Has **4** arguments:
        - **head cell** - **TableTH**. table cell data
        - **column config** - **props.columnsConfig[number]**. column config
        - **index** - **Number**. Column index
        - **dispayed entity IDs** - **Object**. final list entities IDs to be rendered on the active page. Has the next fields:
            - `from` - **Number**. First visible entity index
            - `to` - **Number**. Last visible entity index
            - `allPagesIDs` - **ID[]**. All pages entity IDs<br /><br />

- `postProcessHeadRow`
    - Post processes every DataTable head row by mutating resulting rows array
    - **Function**. Has **2** arguments:
        - **rows** - **TableHeadRow[]**. rows array
        - **dispayedEntityIDs** - final list entities IDs to be rendered on the active page<br /><br />

- `postProcessBodyRow`
    - Post process evenry DataTable body row by mutating resulting rows array
    - **Function**. Has **3** arguments:
        - **row** - **TableBodyRow[]**. rows array
        - **entity** - **Object**. list entity
        - **indexes** - **Object** with the next fields:
            - **gridIndex** - **Number**. Data grid row index
            - **pageIndex** - **Number**. Data grid row index of the current page


<br /><br />

## Store mechanic

DataTable component may only change 2 of 5 state fields:
- `showPerPage` - in the case **props.withFooter.select** is defined
- `currentPage` - in the case **props.withFooter.pagination** is defined

Other state fields like `sortByField`, `searchByField` and `toggleColumns` are fully controled by a user,<br /> **DataTable** itself only perform some operations in a case above fields are filled<br />

To init store with default state - you may use exported `getDefaultState` function



<br /><br />

## External types

### Table

Data table is made on top of **Table** component<br />
**TableTH** and **TableTD** are types to represent table cells<br />

Both are **Object** with the next fields:
- `attributes` - cell tag (**th**, **td**) attributes
- `value` - **React.ReactNode**. Cell value

**TableHeadRow** and **TableBodyRow** are types to represent table row of cells<br />
Both are **Object[]** with the next fields:
- `children` - **(TableTH | TableTD)[]** - Row cells
- `attributes` - **tr** tag attributes
