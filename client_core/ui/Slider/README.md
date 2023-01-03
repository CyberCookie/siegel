# Slider

Simple slider built on top of **Swipe** component<br />

[Swipe](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Swipe)

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
    - `_slided_forward`
        - Root tag state if previous slide was slide forward
    - `_slided_backward`
        - Root tag state if previous slide was slide backward
    - `children`
        - `props.children` element
    - `slides_wrapper`
        - Underlaying Swipe element. Wraps slide elements
    - `slide`
        Slide element
    - `slide__active`
        - Currently selectd slide
    - `slide__prev`
        - Previous slide
    - `slide__next`
        - Next slide
    - `controls_wrapper`
        - Wraps slides switch buttons
    - `control`
        - Slide pick controls
    - `control__active`
        - Control that represents active slide<br /><br />

- `slides`
    - **Required**
    - Slides elements
    - **( ((slideIndex: number) => React.ReactNode) | React.ReactNode )[]**<br /><br />

- `onChange`
    - Triggered whenever current slide changes
    - **Function**. Has **2** arguments:
        - **mewSlideIndex** - **Number**. New slide index
        - **prevSlideIndex** - **Number**. Previous slide index<br /><br />

- `store`
    - **Static**
    - Inner store
    - State is an **Number** and represents currently selected slide index<br /><br />

- `children`
    - Children element to be redered at the root level
    - **React.ReactNode**<br /><br />

- `startFrom`
    - Slide index to show first
    - **Number**<br /><br />

- `withControls`
    - Adds slide pick controls
    - **Boolean**<br /><br />

- `swipeDelta`
    - Pixels value you should drag before slide change will occur
    - **Number**
    - Default is **30**<br /><br />

- `loop`
    - Whether to loop slides
    - **Boolean**<br /><br />

- `autoslideInterval`
    - Enabled automatic slides change with provided interval in ms.
    - **Number**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes