# Swipe

Renders element to catch swipe gesture<br />

<br />

## Props:

- `refApi`
    - Component root reference params<br /><br />

- `className`
    - Root element class name
    - **String**<br /><br />

- `onSwipe`
    - Triggered when swipe gesture occurs
    - **Function** Has **2** arguments:
        - **dirrection** - **Boolean**. Swipe dirrection. **true** if swipe to left or top
        - **event** - **MouseEvent | TouchEvent**<br /><br />

- `onTouchStart`
    - Root tag touchstart event handler. May prevent inner default onTouchStart event
    - **Function** with the only argument: **event** - **React.TouchEvent<HTMLDivElement>**<br /><br />

- `onMouseDown`
    - Root tag mousedown event handler. May prevent inner default onMouseDown event
    - **Function** with the only argument: **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `children`
    - Inner content
    - **React.ReactNode**<br /><br />

- `xAxis`
    - Swipe dirrection. **true** means horizontal swipes
    - **Boolean**<br /><br />

- `deltaPos`
    - Drag length to trigger swipe
    - **Number**
    - Default is **60**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes