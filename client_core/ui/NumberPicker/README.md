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

- `precision`
    - Number precission
    - **Number**<br /><br />

- `onChange`
    - **Function** that is triggeres when input changes or blur event occurs. Has **4** arguments:
        - **value** - **String**. New value
        - **event** - **FocusEvent | MouseEvent | KeyboardEvent | ChangeEvent**
        - **is keyboard arrow up** - If **arrowUp** key was pressed while edit
        - **payload** - **props.payload**<br /><br />

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

- `inputTheme` - **Input.theme**

- `label` - **Input.label**

- `errorMsg` - **Input.errorMsg**

- `placeholder` - **Input.placeholder**

- `inputAttributes` - **Input.inputAttributes**

- `inputRootAttributes` - **Input.rootTagAttributes**

- `inputStore` - **Input.store**

- `onFocus` - **Input.onFocus**