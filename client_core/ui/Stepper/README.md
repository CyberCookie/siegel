# Stepper

Simple slider built on top of **Ranger** component<br />

[Ranger](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Ranger)

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi` - **Ranger.refApi**

- `className`

- `theme`
    - `root`
        - Applied to **Ranger** component
    - `anchors_wrapper`
    - `children_wrapper`
        - Wrapps provided children with children passed to **Ranger** component
    - `anchor`
    - `anchor__active`
        - If anchor label is in selection range<br /><br />

- `value`
    - **Required**
    - Stepper anchors tied to specific option
    - **Array of string**. Array of **props.options** values<br /><br />

- `options`
    - **Required**. Minimal options length is **3**
    - Stepper option labels on top of **Ranger** component
    - **Array of Object** with the next fields:
        - `value` - **String**. Option value
        - `label` - **React.ReactNode**. Label text
        - `className` - **String**. Option label className
        - `payload` - **Any**. Some data to store for later usege<br /><br />

- `onChange`
    - **Funtion** that is triggered when **Stepper** value is change. Has **2** arguments:
        - **newValues** - **Array of Object** with the next fields:
            - `value` - value of selected **props.options**
            - `optionIndex` - selected option index
        - **event** - **MouseEvent | React.MouseEvent**<br /><br />

- `rangerThene` - **Ranger.theme**

- `rangerMemoDeps` - **Ranger.memoDeps**

- `onRangePickStart` - **Ranger.onRangePickStart**

- `onRangePickFinish` - **Ranger.onRangePickFinish**

- `rangersCrossBehavior` - **Ranger.rangersCrossBehavior**

- `rangePickIcon` - **Ranger.rangePickIcon**

- `label` - **Ranger.label**

- `disabled` - **Ranger.disabled**