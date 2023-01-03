# DropdownSerch

Searchable input with select hints built on top of **Input** component<br />

[Input](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Input)

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
    - `_with_suggestions`
        - Root tag state if search suggestions is visible
    - `_disabled`
        - Root tag state if component is disabled
    - `_focused`
        - Root tag state if component is focused
    - `_error`
        - Root tag state if `props.error` is defined
    - `reset`
        - Applied to reset btn if defined
    - `input_wrapper`
        - Wraps input and options
    - `label_wrapper`
        - Label wrapper element
    - `label_text`
        - Label text element
    - `options`
        - Options wrapper element
    - `option`
        - Suggestion option
    - `option__disabled`
        - Option state if the option is disabled
    - `option__selected`
        - Option state if the option is selected<br /><br />

- `onChange`
    - **Required**
    - Triggered on option selection
    - **Function** Has **3** arguments:
        - **value** - **Any**. option value
        - **event** - **React.MouseEvent | React.FocusEvent | React.KeyboardEvent**. Type depends on which way hint has been chosen<br /><br />

- `searchOptions`
    - **Required**
    - Search suggestion options
    - **Object[]** with the next fields:
        - `inputValue`
            - **Required**
            - String to search for in order to show this hint
            - **String**
        - `value`
            - **Required**
            - Value passed to **props.onChange** if hint is selected
            - **Any**
        - `title`
            - Hint text
            - **React.ReactNode**
        - `className`
            - Class name for this hint
            - **String**
        - `disabled`
            - Disable this hint so it can't be choosed
            - **Boolean**
        - `alwaysVisible`
            - Always show this hint no matter what is typed into the input
            - **Boolean**<br /><br />

- `onSearch`
    - Triggered when user type into component input
    - **Function** Has **2** arguments:
        - **SearchValue** - **String**. input value
        - **event** - Input component **props.onChange** event<br /><br />

- `onRootBlur`
    - Triggered when component root looses focus
    - **Function** with the only argument: **event** - **React.FocusEvent**<br /><br />

- `onKeyDown`
    - Triggered when key was pressed
    - **Function** with the only argument: **event** - **React.KeyboardEvent**<br /><br />

- `children`
    - Any children element to be passed to underlaying Input component
    - **React.ReactNode**<br /><br />

- `store`
    - **Static**
    - Inner store
    - State is an **Object** with the next fields:
        - `searchString` - **String | undefined**. Input search string
        - `arrowSelectIndex` - **Number | undefined**. Keyboard selected option index
    - Component exports `getDefaultState` function to init outer store's state<br /><br />

- `rootTagAttributes`
    - **div** root tag attributes<br /><br />

- `minInputLength`
    - How many characters to type for suggestions to appear
    - **Number**
    - Default is **3**<br /><br />

- `showOnFocus`
    - Always show suggestions on component focus
    - **Boolean**<br /><br />

- `listDisabledOptions`
    - Show disabled options among popup
    - **Boolean**
    - Default is **true**<br /><br />

- `showAll`
    - Show all suggestions
    - **Boolean**<br /><br />

- `selected`
    - Selected option value
    - **Any**<br /><br />

- `resetIcon`
    - Enables reset option capability providing reset icon
    - **React.ReactNode**<br /><br />

- `resetIconKeepChildren`
    - Keeps props.children rendered when resetIcon appears since both are Input component's children
    - **Boolean**<br /><br />

- `disabled`
    - Disables underlaying Input component
    - **Input.disabled**<br /><br />

- `inputTheme`
    - Underlaying Input theme
    - **Input.theme**<br /><br />

- `label`
    - Underlaying Input label
    - **Input.label**<br /><br />

- `inputStore`
    - Underlaying Input inner input store
    - **Input.store**<br /><br />

- `autofocus`
    - Enables underlaying Input component's autofocus
    - **Input.autofocus**<br /><br />

- `placeholder`
    - Underlaying Input placeholder
    - **Input.placeholder**<br /><br />

- `inputClassName`
    - Underlaying Input class name
    - **Input.className**<br /><br />

- `inputTagAttributes`
    - Underlaying Input input tag attributes
    - **Input.inputAttributes**<br /><br />

- `inputRootTagAttributes`
    - Underlaying Input input root tag [<div>] attributes
    - **Input.rootTagAttributes**<br /><br />

- `inputMemoDeps`
    - Underlaying Input memo dependencies params
    - **Input.memoDeps**<br /><br />

- `errorMsg`
    - Underlaying Input error message
    - **Input.errorMsg**<br /><br />

- `regexp`
    - Input regexp
    - **Input.regexp**<br /><br />

- `debounceMs`
    - Search input change debounce in ms
    - **Input.debounceMs**<br /><br />

- `mask`
    - Applies search input mask
    - **Input.mask**<br /><br />

- `onBlur`
    - Triggered on search input focus
    - **Input.onBlur**<br /><br />

- `onFocus`
    - Triggered on search input blur
    - **Input.onFocus**<br /><br />