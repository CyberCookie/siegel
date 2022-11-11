# Swipe

Renders element to catch swipe gesture<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `children`

- `xAxis`
    - Swipe dirrection. If **true** then horizontal swipe is handling
    - **Boolean**<br /><br />

- `deltaPos`
    -  Pixels count to drag before swipe occurs
    - **Number**
    - Default is **60**<br /><br />

- `onMouseDown`
    - On root tag mousedown event. May prevent inner default onMouseDown event
    - **Function** with the only argument: **event** - **React.MouseEvent**

- `onTouchStart`
    - On root tag touchstart event. May prevent inner default onTouchStart event
    - **Function** with the only argument: **event** - **React.TouchEvent**

- `onSwipe`
    - **Function** that is triggered when swipe gesture occurs. Has **2** arguments:
        - **dirrection** - **Boolean**. Swipe dirrection. **true** if swipe to left and top
        - **event** - **MouseEvent | TouchEvent**