# Ranger

Provides sliding point(s) to specify some range values from 0 to 1<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `children`

- `refApi`

- `className`

- `theme`
    - `root`
    - `_single_picker`
        - If there is only one picker (**props.value**.length == 1)
    - `_readonly`
        - If no **props.onChange** hanler provided
    - `_disabled`
        - If **Ranger** is disabled
    - `children`
    - `label`
    - `ranger_content_wrapper`
    - `range_area`
    - `range__selected`
        - Piece of range area that is in selected range
    - `range__unselected`
        - Piece of range area that is out of selected range
    - `range_slider`
    - `range_slider__active`
        - Slider when you drag it<br /><br />

- `value`
    - Range pick value
    - **Number[]**. Number of elements should always be even. Special case is single mode<br />
    Then there is only one element in the array<br /><br />

- `onChange`
    - **Function** that is triggered when you change selected range. Has **2** arguments:
        - **value** - new range value
        - **event** - **MouseEvent | React.MouseEvent**<br /><br />

- `onRangePickStart`
    - **Function** that is triggered when start slide dragging. Has **1** arguments:
        - **event** - **React.MouseEvent**<br /><br />

- `onRangePickFinish`
    - **Function** that is triggered when finish slide dragging. Has **1** arguments:
        - **event** - **MouseEvent**<br /><br />

- `isVertical`
    - Enables vertical mode
    - **Boolean**<br /><br />

- `rangersCrossBehavior`
    - Determined range pick behaviour when it 'bumps' another range pick<br />
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

- `disabled`
    - Disable range picker
    - **Boolean**