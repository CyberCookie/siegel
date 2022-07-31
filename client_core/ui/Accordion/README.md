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
    - `item_title_wrapper`
    - `item_title`
    - `item_children_wrapper`<br /><br />

- `list`
    - **Required**
    - List of items to render
    - **Object[]** with fields:
        - `title` - **React.ReactNode**
        - **expanded** - **Boolean** (default is false) 
        - **children** - **props.list** - recursion<br /><br />

- `soloOpen`
    - Only one expanded list at a moment
    - **Boolean** (default is false)<br /><br />

- `autoExpand`
    - Render list with all the items already expanded
    - **Boolean** (default is false)<br /><br />

- `builder`
    - Postprocess callback that executes during an iteration over provided list
    - **Function**
        - Has **1** argument:
            - **Object** with the next fields:
                - `listItemTheme` - **Object**. **Mutatable**. Current item's theme with the next fields:
                    - `item` - **String**
                    - `item_title_wrapper` - **String**
                    - `item_title` - **String**
                    - `item_children_wrapper` - **String**
                    - `item__empty` - **String**
                - `listItem` - **React.ReactNode**. Item title element
                - `index` - **Number** - list item index
                - `acc` - **Any**. Accumulator persists during an iteration over same nesting level
        - Returns an **Object** with the next fields:
            - `elem` - **React.ReactNode**. Updated item title element
            - `acc` - **Any**. Updated accumulator
            - `expanded` - **Boolean**. Whether this item is expanded
            - `replaceParentIfLast` - **Boolean**. Whether to replace title wrapper with a title if it has no nested children<br /><br />

- `accordionIcon`
    - Icon to place next from item title
    - **React.ReactNode**