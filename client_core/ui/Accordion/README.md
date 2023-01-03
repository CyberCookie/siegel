# Accordion

Recursively expandable list of items<br />

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
    - `item`
        - List item wrapper
    - `item__empty`
        - List item wrapper state when it has no nested list
    - `item__expanded`
        - List item wrapper state when its nested list is expanded
    - `item_title_wrapper`
        - List item title wrapper
    - `item_title`
        - List item title
    - `nested_list`
        - List item nested list<br /><br />

- `list`
    - **Required**
    - List items data
    - **Object[]** with fields:
        - `title` - **Required** **React.ReactNode** - List item title element
        - `children` - `props.list` - List item nested list
        - `id` - **String** - List item optional id.<br />
            By default item index is using<br /><br />

- `builder`
    - Allows you to provide list items with custom properties and construct the output list elements using this function
    - **Function**
        - Has **1** argument:
            - **Object** with the next fields:
                - `listItemTheme` - **Object**. **Mutatable**. List item theme to be applied to the current list item with the next fields:
                    - `item` - **String**
                    - `item__empty` - **String**
                    - `item__expanded` - **String**
                    - `item_title_wrapper` - **String**
                    - `item_title` - **String**
                    - `nested_list` - **String**
                - `listItem` - **React.ReactNode**. List item object with custom properties
                - `index` - **Number**. List item index
                - `acc` - **Any**. Accumulated value in the scope of mutual parent
        - Returns an **Object** with the next fields:
            - `elem` - **React.ReactNode**. Updated item title element
            - `acc` - **Any**. Updated accumulator<br /><br />

- `accordionIcon`
    - Icon to place next to item title
    - **React.ReactNode**<br /><br />

- `soloOpen`
    - Forces only one list to be expanded at the moment
    - **Boolean**
    - Default is **false**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `autoExpand`
    - **Static**
    - Renders list with all the nested lists already expanded
    - **Boolean**
    - Default is **false**<br /><br />

- `store`
    - **Static**
    - External store, created with **React.useState**, to controll expanding of nested lists **Accordion**
    - State is an **Object** with the next fields:
        - `expandedPaths` - **Object** Expanded lists paths, where key is dot separeted nested lists ids, and value is boolean.<br />
            Key is concatenated string IDs, separated with dot ( *'id1.id2.id3...'* )
    - Component exports `getDefaultState` function to init outer store's state<br />
        `autoExpand` wont affect this component if you are passing `store` to it<br />
        To achieve `autoExpand` behavior - you should pass `list` to `getDefaultState` function<br /><br />