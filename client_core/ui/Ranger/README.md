# Ranger

Provides sliding point(s) to specify some range values from 0 to 1<br />

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
    - `_readonly`
        - Root tag state if no `props.onChange` hanler provided
    - `_disabled`
        - Root tag state if component is disabled
    - `_single_picker`
        - Root tag state if there is only one picker (`props.value`.length == **1**)
    - `_vertical`
        - Root tag state if `props.isVertical` is true
    - `children`
        - `props.children` children
    - `label`
        - Ranger label
    - `ranger_content_wrapper`
        - Wraps children and range area elements if props.children is provided
    - `range_area`
         - Range area element
    - `range__selected`
        - Range element that is a part of selected range
    - `range__unselected`
        - Range element that is not a part of selected range
    - `range_slider`
        - Range slider element
    - `range_slider__active`
        - Range slider element if currently draggable<br /><br />

- `value`
    - Range pick value
    - **Number[]**. Number of elements should always be even. Special case is single mode<br />
    Then there is only one element in the array<br /><br />

- `onChange`
    - Triggered when you change selected range
    - **Function** Has **2** arguments:
        - **value** - new range value
        - **event** - **MouseEvent | React.MouseEvent<HTMLDivElement>**<br /><br />

- `onRangePickStart`
    - Triggered when start slide dragging
    - **Function** Has **1** argument:
        - **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `onRangePickFinish`
    - Triggered when finish slide dragging
    - **Function** Has **1** argument:
        - **event** - **MouseEvent**<br /><br />

- `isVertical`
    - Enables vertical mode
    - **Boolean**<br /><br />

- `children`
    - Any element that will be rendered along ranger area
    - **React.ReactNode**<br /><br />

- `rangersCrossBehavior`
    - Determined range pick behavior when it 'bumps' another range pick<br />
        This is for the case when `props.value` has length > 1
    - **'stop' | 'move' | 'cross'**
        - **stop** - Range pick stops at another pick's position
        - **cross** - Range pick crosses another range pick
        - **move** - Range pick moves another range pick as it 'bumps' it
    - Default is **'stop'**<br /><br />

- `rangePickIcon`
    - Range picker icon
    - **React.ReactNode**
    - Default is **'+'**<br /><br />

- `label`
    - Range picker label
    - **React.ReactNode**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `disabled`
    - Disable range picker
    - **Boolean**