# Accordion

Recursively expandable list of items<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `item`
    - `item__empty`
        - Applied to item if it has no children
    - `item__expanded`
    - `item_title_wrapper`
    - `item_title`
    - `nested_list`<br /><br />

- `list`
    - **Required**
    - List of items to render
    - **Object[]** with fields:
        - `title` - **Required** **React.ReactNode**
        - `children` - **props.list** - recursion
        - `id` - **String** - item ID used for proper item selection.<br />
            By default item index is using<br /><br />

- `soloOpen`
    - Only one expanded list at the moment
    - **Boolean**
    - Default is **false**<br /><br />

- `autoExpand`
    - **Static**
    - Render list with all the items already expanded
    - **Boolean**
    - Default is **false**<br /><br />

- `store`
    - **Static**
    - Store, created with **React.useState** store, to be used in **Accordion**
    - State is an **Object** with the next fields:
        - `expandedPaths` - **Object** where key is a path to expandable list and value is boolean to determine whether this list is expanded<br />
            Key is concatenated string IDs, separated with dot ( *'id1.id2.id3...'* )
    - Component exports `getDefaultState` function to init outer store's state<br />
        `autoExpand` wont affect this component if you are passing `store` to it<br />
        To achieve `autoExpand` behavior - you should pass `list` to `getDefaultState` function<br /><br />

- `builder`
    - Postprocess callback that executes during an iteration over provided list
    - **Function**
        - Has **1** argument:
            - **Object** with the next fields:
                - `listItemTheme` - **Object**. **Mutatable**. Current item's theme with the next fields:
                    - `item` - **String**
                    - `item__empty` - **String**
                    - `item__expanded` - **String**
                    - `item_title_wrapper` - **String**
                    - `item_title` - **String**
                    - `nested_list` - **String**
                - `listItem` - **React.ReactNode**. Item title element
                - `index` - **Number** - list item index
                - `acc` - **Any**. Accumulator persists during an iteration over same nesting level
        - Returns an **Object** with the next fields:
            - `elem` - **React.ReactNode**. Updated item title element
            - `acc` - **Any**. Updated accumulator

- `accordionIcon`
    - Icon to place next from item title
    - **React.ReactNode**