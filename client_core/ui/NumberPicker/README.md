# NumberPicker

Input for numbers with various validations built on top of `Input` component<br />

[Input](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Input)

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `childtren`
    - `_disabled_all`
    - `children`
    - `controls`
    - `button_minus`
    - `button_plus`
    - All the theme keys from **Input** component, except:
        - _children_ , _textarea_<br /><br />

- `value`
    - Number picker value
    - **String** | **Number**

- `precision`
    - Number precission
    - **Number**<br /><br />

- `onChange`
    - **Function** that is triggeres when input changes or blur event occurs.<br />
    Has **1** arguments - **Object** with the next props:
        - `value` - **String**. New editable value
        - `numberValue` - **Number** value. **NaN** if `value` is en empty **String**
        - `isValid` - **Boolean**. **True** if `numberValue` is not **NaN**<br />
            and `numberValue` lays between `props.min` and `props.max`<br />
            and `value` is valid number
        - `event` - **FocusEvent | MouseEvent | KeyboardEvent | ChangeEvent**
        - `isKeyboardArrowUp` - **True** if **arrowUp** was pressed. **False** if **arrowUp** was. Othervice **undefined**
        - `payload` - **props.payload**<br /><br />

- `disabledInput`
    - Disable typing into input field
    - **Boolean**<br /><br />

- `inputStore`
    - **Input** component **props.store**<br /><br />

- `minusIcon`
    - Icon for value decrement control
    - **React.ReactNode**
    - Default is **'-'**<br /><br />

- `plusIcon`
    - Icon for value increment control
    - **React.ReactNode**
    - Default is **'+'**<br /><br />

- `step`
    - Value change step if you change with _plus_ / _minus_ controls<br /><br />

- `min`
    - Minimal possible value
    - **Number**
    - Default is **-Infinity**<br /><br />

- `max`
    - Maximal possible value
    - **Number**
    - Default is **Infinity**<br /><br />

- `payload`
    - Data to be passed to **props.onChange** handler
    - **Any**<br /><br />

- `children`- **Input.children**

- `inputClassName` - **Input.className**

- `label` - **Input.label**

- `errorMsg` - **Input.errorMsg**

- `inputTheme` - **Input.theme**

- `placeholder` - **Input.placeholder**

- `inputAttributes` - **Input.inputAttributes**

- `inputMemoDeps` - **Input.memoDeps**

- `inputRootAttributes` - **Input.rootTagAttributes**

- `debounceMs` - **Input.debounceMs**

- `inputStore` - **Input.store**

- `onFocus` - **Input.onFocus**