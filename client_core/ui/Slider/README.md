# Slider

Simple slider built on top of **Swipe** component<br />

[Swipe](https://github.com/CyberCookie/siegel/tree/master/client_core/ui/Swipe)

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `_slided_forward`
        - Applied to the root if previous slide was slide forward
    - `_slided_backward`
        - Applied to the root if previous slide was slide backward
    - `children`
    - `slides_wrapper`
    - `slide`
    - `slide__active`
        - Current selectd slide
    - `slide__prev`
        - Previous selected slide
    - `slide__next`
        - Next selected slide
    - `controls_wrapper`
    - `control`
        - Slide pick controls
    - `control__active`
        - Control that represents active slide<br /><br />

- `slides`
    - **Required**
    - Slides elements
    - **( ((slideIndex: number) => React.ReactNode) | React.ReactNode )[]**<br /><br />

- `onChange`
    - Triggered whenever current slide changes. Has **2** arguments:
        - **mewSlideIndex** - **Number**. New slide index
        - **prevSlideIndex** - **Number**. Previous slide index

- `store`
    - **Static**
    - Store, created with **React.useState** store, to be used in **Slider** component
    - State is an **Number** and represents currently selected slide index<br /><br />

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
    - **Number**