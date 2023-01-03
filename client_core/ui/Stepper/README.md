# Stepper

Steps slider built on top of **Ranger** component<br />

[Ranger](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Ranger)

<br />

## Props:

- `refApi`
    - Component root reference params<br /><br />

- `className`
    - Root element class name
    - **String**<br /><br />

- `theme`
    - `root`
        - Root tag applied to **Ranger** element
    - `anchors_wrapper`
        - Wraps all dragable anchors
    - `anchor`
        - Draggable anchors
    - `anchor__active`
        - Anchor state if included in selection range
    - `children_wrapper`
        - Wraps provided children with children passed to **Ranger** component<br /><br />

- `value`
    - **Required**
    - Stepper anchors tied to specific option
    - **String[]**. Array of **props.options** values<br /><br />

- `options`
    - **Required**. Minimal options length is **3**
    - Stepper option labels on top of **Ranger** component
    - **Object[]** with the next fields:
        - `value` - **String**. Option value
        - `label` - **React.ReactNode**. Label text
        - `className` - **String**. Option label className
        - `payload` - **Any**. Some data to store for later usege<br /><br />

- `onChange`
    - Triggered when **Stepper** value is change
    - **Funtion** Has **2** arguments:
        - **newValues** - **Object[]** with the next fields:
            - `value` - value of selected **props.options**
            - `optionIndex` - selected option index
        - **event** - **MouseEvent | React.MouseEvent**<br /><br />

- `children`
    - Stepper children element passed to **Ranger** along with stepper labels<br />
        Wraped into **children_wrapper** element<br /><br />
    - **React.ReactNode**

- `rangerThene` - **Ranger.theme**<br /><br />

- `rangerMemoDeps` - **Ranger.memoDeps**<br /><br />

- `onRangePickStart` - **Ranger.onRangePickStart**<br /><br />

- `onRangePickFinish` - **Ranger.onRangePickFinish**<br /><br />

- `rangersCrossBehavior` - **Ranger.rangersCrossBehavior**<br /><br />

- `rangePickIcon` - **Ranger.rangePickIcon**<br /><br />

- `label` - **Ranger.label**<br /><br />

- `isVertical` - **Ranger.isVertical**<br /><br />

- `disabled` - **Ranger.disabled**