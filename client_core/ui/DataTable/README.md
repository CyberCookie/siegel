# DataTable

Configurable and flexible data grid to manage big amount of data, built on top of **Table** component. Can receive **Pagination** and **Select** components to work with<br />

[Table](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Table)
[Pagination](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Pagination)
[Select](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Select)

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `children`

- `refApi`

- `tableAttributes`
    - **table** tag attributes<br /><br />

- `className`

- `theme`
    - `root`
    - `_with_footer`
        - Applied if **DataTable** has footer
    - `children`
    - `table`
    - `table_resizer`
    - `pagination_wrapper`<br /><br />

- `entities`
    - **Required**
    - **Entities**
    - Data entities created with [entities struct](https://github.com/CyberCookie/siegel/blob/master/client_core/utils/entities_struct.ts)<br /><br />

- `columnsConfig`
    - **Required**
    - Data table columns config. Each array elelemt represents one column. Table column index mathches with column config index
    - **Array of Object** with the next fields:
        - `ID` - **Required** **String**. Column ID used in store manipulations
        - `label` - Column label showiing in table header cell
        - `customParams` - **Any**. some data you may use in extended dataTable
        - `showValue` - **Required** **Function**. Triggers for each entity to be displayed in a **DataTable**
            - Has **2** arguments:
                - **entity** - **Entity**. Represents each entity stored in **Entities** struct
                - **index** - Column index
            - Returns **TableTD**
        - `onSort` - **Function**. Specify how this column should be sorted
            - Has **3** arguments:
                - **IDs** - **Array of strings**. All entity IDs to be sorted
                - **byID** - **Object**. Where key is entity ID and value is **Entity**
                - **value** - **Number**. Sort vakue
            - Returns IDs: **Array of strings**
        - `onFilter` - **Function**. Specify how this column should be filtered
            - Has **3** arguments: Firts 2 arguments are the same as in **onSort**. 3d argument is:
                - **search** - **Any**. Column filter value<br /><br />

- `store`
    - Store, created with **React.useState** store, to be used in **DataTable**
    - State is an **Object** with the next fields:
        - `sortByField` - **Object**. Empty if no sorting applied otherwise has the next fields:
            - `ID` - **String** - column ID to apply sorting to
            - `value` - **Number** - sort value **-1 | 0 | 1**
        - `searchByField` - **Object** where key is column ID and value is **Any**
        - `toggleColumns` - `Set of columns IDs`. Using to toggle specified columns
        - `showPerPage` - `Number`. Quantity of items showing per one page
        - `currentPage` - **Number**. Current selected page<br /><br />

- `withFooter`
    - Describes footer props. Footer uses **Select** and **Pagination** components<br />
         You should explicitly pass these components. It was made to reduce dependency tree
    - **Object** with the next fields:
        - `displayQuantity` - **Function**. To show items count
            - Has **1** argument - quantity: **Number**
            - Returns **React.ReactNode**
        - `select` - **Object**. Select component scope. Has the next fields:
            - `props` - **Select component props**. All props are optional except **props.options**
            - `component` - **Select component** itself
        - `pagination` - **Object**. Pagination component scope. Has the next fields:
            - `props` - **Pagination component props**. All props are optional
            - `component` - **Pagination component itself**<br /><br />

- `resizable`
    - Makes columns resizable by dragging sides of the columns
    - **Boolean**<br /><br />

- `virtualization`
    - Used to speed up performance if you want to display all entities without pagination paging
    - **Object** with the next fields:
        - `itemHeight` - **Required** **Number**. Minimal height of the row
        - `tableHeight` - **Number**. Default is **innerHeight**, Height of the table. Specifying this prop can precise item loading quantity
        - `preloadedItemsBySide` - **Number**. Default is **20**. Quantity of items to preload above and below of visible area
        - `scrollUpdateInterval` - **Number**. Default is **350**ms. Specify how frequent displayed range of items will be updated by scrolling<br /><br />

- `postProcessHeadCell`
    - Post process each head cell and mutates it
    - **Function**. Has **4** arguments:
        - **head cell** - **TableTH**. Represents head column
        - **column config** - **props.columnsConfig[number**. This head cell's column config
        - **index** - **Number**. Index of the column.
        - **dispayed entity IDs** - **Object**. Includes precise information about what entities are will be processed. Has the next fields:
            - `from` - **Number**. Index of entity **DataTable** starts from
            - `to` - **Number**. Index of entity **DataTable** ends with
            - `allPagesIDs` - **Array of IDs**. All entity IDs left after filtering<br /><br />

- `postProcessHeadRow`
    - Post process head row allowing to add new ones by mutating existing rows
    - **Function**. Has **2** arguments:
        - **rows** - **Array of TableHeadRow**. Head rows
        - **dispayedEntityIDs** - Same as **postProcessHeadCell**'s dispayedEntityIDs<br /><br />

- `postProcessBodyRow`
    - Post process each body row by mutating it
    - **Function**. Has **3** arguments:
        - **row** - **Array of TableBodyRow**. Represents table body row
        - **entity** - **Entity**. Entity displayed in this row
        - **index** - **Number**. Row index


<br /><br />

## Store mechanic

Data table itself may only change 2 of 5 state fields:
- `showPerPage` - in the case **props.withFooter.select** is defined
- `currentPage` - in the case **props.withFooter.pagination** is defined

Other state fields `sortByField`, `searchByField` and `toggleColumns` are fully controled by a user,<br /> **DataTable** itself only perform some operations in a case above fields are filled


<br /><br />

## External types

### Table

Data table is made on top of **Table** component<br />
**TableTH** and **TableTD** are types to represent table cells<br />

Both are **Object** with the next fields:
- `attributes` - cell tag (**th**, **td**) attributes
- `value` - **React.ReactNode**. Cell value

**TableHeadRow** and **TableBodyRow** are types to represent table row of cells<br />
Both are **Array of Object** with the next fields:
- `children` - **Array of (TableTH | TableTD)** - Row cells
- `attributes` - **tr** tag attributes

### Entities

As mention above, **Entities** is a struct created with **entities_struct** util<br />
**Entity** is every data **Object** within **Entities** struct