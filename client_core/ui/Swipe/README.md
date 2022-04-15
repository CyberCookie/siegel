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

- `onSwipe`
    - **Function** that is triggered when swipe gesture occurs. Has **2** arguments:
        - **dirrection** - **Boolean**. Swipe dirrection. **true** if swipe to left and top
        - **event** - **MouseEvent | TouchEvent**