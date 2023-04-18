# NumberPicker

Input for numbers with various validations built on top of `Input` component<br />

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
    - `_disabled_all`
        - Root tag state if both props.disabled and `props.diabledInput` is true
    - `_focused`
        - Root tag state if NumberPicker os focused
    - `_error`
        - Root tag state if `props.errorMsg` is defined
    - `label_wrapper`
        - Wraps input_wrapper and label_text
    - `label_text`
        - Label text element
    - `input_wrapper`
        - Wraps Input and step controls elements
    - `controls`
        - Holds step buttons controls
    - `button_minus`
        - Decrease value button
    - `button_plus`
        - Increase value button
    - `button__disabled`
        - If button is disabled<br /><br />

- `onChange`
    - Triggered when NumberPicker value is changing
    - **Function** Has **1** argument - **Object** with the next props:
        - `value` - **String**. New value
        - `prevValue` - `props.value`. Previous NumberPicker value
        - `numberValue` - **Number** value. **NaN** if `value` is en empty **String**
        - `isValidNumberString` - **Boolean**. **True** if `numberValue` is not **NaN**<br />
            and `numberValue` lays between `props.min` and `props.max`<br />
            and `value` is valid number string without open comma '.'
        - `prevValidNumer` - **Number | undefined**. Last valid `numberValue`<br />
        - `event` - **FocusEvent | MouseEvent | KeyboardEvent | ChangeEvent**
        - `isKeyboardArrowUp` - **True** if **arrowUp** was pressed. **False** if **arrowUp** was. Othervice **undefined**
        - `payload` - **props.payload**<br /><br />

- `value`
    - Number picker value
    - **String** | **Number**<br /><br />

- `children`
    - Children element to be passed to an underlaying Input component
    - **Input.children**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `regexp`
    - NumberPicker regexp to be passed to underlaying Input component
    - **RegExp | ((defaultRegExp: string) => RegExp**<br /><br />

- `label`
    - Number picker label
    - **React.ReactNode**<br /><br />

- `step`
    - Renders change value step buttons with defined value step
    - **Number**<br /><br />

- `min`
    - Minimum value
    - **Number**
    - Default is **-Infinity**<br /><br />

- `max`
    - Maximum value
    - **Number**
    - Default is **Infinity**<br /><br />

- `minusIcon`
    - Step decrease value button icon
    - **React.ReactNode**<br /><br />

- `plusIcon`
    - Step increase value button icon
    - **React.ReactNode**<br /><br />

- `payload`
    - Any value to be passed to `props.onChange` params
    - **Any**<br /><br />

- `precision`
    - Value precission (number of digits after dot)
    - **Number**<br /><br />

- `precisionKeepZeroes`
    - Keeps fractional ending zeroes
    - **Boolean**
    - Default is **true**<br /><br />

- `zeroesPadLeft`
    - Adds zeroes before value
    - **Number**<br /><br />

- `disabledInput`
    - Disables NumbrPicker input
    - **Boolean**<br /><br />

- `onFocus`
    - Triggered if NumberPicker takes focus
    - **Function** with the only argument: **event** - **React.FocusEventHandler<HTMLDivElement | HTMLButtonElement>**<br /><br />

- `onBlur`
    - Triggered if NumberPicker loses its focus
    - **Function** with the only argument: **event** - **React.FocusEventHandler<HTMLDivElement | HTMLButtonElement>**<br /><br />

- `onKeyDown`
    - Triggered if some key pressed when NumberPicker is focused
    - **Function** with the only argument: **event** - **React.KeyboardEvent<HTMLDivElement>**<br /><br />

- `inputClassName`
    - Underlaying Input class name
    - **Input.className**<br /><br />

- `inputTheme` - **Input.theme**<br /><br />

- `inputStore` - **Input.store**<br /><br />

- `inputMemoDeps` - **Input.memoDeps**<br /><br />

- `inputRootAttributes` - **Input.rootTagAttributes**<br /><br />

- `debounceMs` - **Input.debounceMs**<br /><br />

- `suffix` - **Input.suffix**<br /><br />

- `prefix` - **Input.prefix**<br /><br />

- `label` - **Input.label**<br /><br />

- `errorMsg` - **Input.errorMsg**<br /><br />

- `placeholder` - **Input.placeholder**<br /><br />

- `inputAttributes` - **Input.inputAttributes**<br /><br />