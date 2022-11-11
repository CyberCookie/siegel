# DropdownSerch

Searchable input with select hints built on top of **Input** component<br />

[Input](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Input)

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `children`

- `refApi`

- `className`

- `theme`
    - `root`
    - `_with_suggestions`
        - Applied if suggestions are visible
    - `_disabled`
        - Applied if `props.disabled` is `true`
    - `_focused`
        - Applied if component is focused
    - `_error`
        - Applied if `props.errorMsg` is defined
    - `reset`
        - Applied to reset btn if defined
    - `input_wrapper`
        - Wrapps input and options elements if label is defined
    - `label`
    - `children`
    - `options`
    - `option`
    - `option__selected`
    - `option__disabled`<br /><br />

- `searchOptions`
    - **Required**
    - All options that may display as a hints
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

- `onChange`
    - **Required**
    - **Function** that fires when hint has been chosen. Have **3** arguments:
        - **value** - **Any**. Hint value
        - **event** - **React.MouseEvent | React.FocusEvent | React.KeyboardEvent**. Type depends on which way hint has been chosen<br /><br />

- `onSearch`
    - **Function** that is trigered on input text change. Has **2** arguments:
        - **SearchValue** - **String**. Input field text
        - **event** - Input component **props.onChange** event<br /><br />

- `onKeyDown`
    - On root tag keydown event. May prevent inner default onKeyDown event
    - **Function** with the only argument: **event** - **React.KeyboardEvent**

- `onRootBlur`
    - On root tag blur event. May prevent inner default onBlur event
    - **Function** with the only argument: **event** - **React.FocusEvent**

- `store`
    - **Static**
    - Store, created with **React.useState** store, to be used in **DropdownSearch**
    - State is an **Object** with the next fields:
        - `searchString` - **String | undefined**. Input field text
        - `arrowSelectIndex` - **Number | undefined**. Hint index choosen with keyboard arrows,<br />
        before you press __Enter__ to select it<br />
        This field specify currently selected hint index
    - Component exports `getDefaultState` function to init outer store's state<br /><br />

- `minInputLength`
    - **Number**
    - Minimal search length to display hints
    - Default is **3**<br /><br />

- `showOnFocus`
    - **Boolean**
    - Show all hints on input focus<br /><br />

- `listDisabledOptions`
    - Whether to show disabled options in a options list
    - **Boolean**
    - Default is **true**<br /><br />

- `showAll`
    - **Boolean**
    - Show all hints<br /><br />

- `selected`
    - **Any**
    - Selected hint. Should match **props.searcOptions[number].value**<br /><br />

- `resetIcon`
    - **React.ReactNode**
    - Icon to reset selection. There is no reset control if icon is not specified<br /><br />

- `children`- **Input.children**

- `inputClassName` - **Input.className**

- `inputTheme` - **Input.theme**

- `inputStore` - **Input.store**

- `autofocus` - **Input.autofocus**

- `placeholder` - **Input.placeholder**

- `inputTagAttributes` - **Input.inputAttributes**

- `inputRootTagAttributes` - **Input.rootTagAttributes**

- `inputMemoDeps` - **Input.memoDeps**

- `errorMsg` - **Input.errorMsg**

- `debounceMs` - **Input.debounceMs**

- `mask` - **Input.mask**

- `regexp` - **Input.regexp**

- `onBlur` - **Input.onBlur**

- `onFocus` - **Input.onFocus**

- `disabled` - **Input.disabled**

- `label` - **Input.label**

- `inputProps`
    - **Input props** except of **type**, **onChange**, **value**, **rootTagAttributes**
    - Underlying Input component props