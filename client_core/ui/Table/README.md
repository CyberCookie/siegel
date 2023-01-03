# Table

Simple table<br />

<br />

## Props:

- `refApi`
    - Component root reference params<br /><br />

- `className`
    - Root element class name
    - **String**<br /><br />

- `head`
    - **Table** header, represents each row in **thead** tag
    - **Object[]** with the next fields:
        - `children` - **Object[]**. Represents each cell in footer row. Each **Object** has the next fields:
            - `value` - **React.ReactNode**. table Cell value
            - `attributes` - **th** tag attributes
        - `attributes` - **tr** tag attributes<br /><br />

- `body`
    - **Table** body, represents each row in **tbody** tag
    - **Object[]** with the next fields:
        - `children` - **Object[]**. Represents each cell in footer row. Each **Object** has the next fields:
            - `value` - **React.ReactNode**. table Cell value
            - `attributes` - **td** tag attributes
        - `attributes` - **tr** tag attributes<br /><br />

- `foot`
    - **Table** footer, represents each row in **tfoot** tag
    - **Object[]** with the next fields:
        - `children` - **Object[]**. Represents each cell in footer row. Each **Object** has the next fields:
            - `value` - **React.ReactNode**. table Cell value
            - `attributes` - **td** tag attributes
        - `attributes` - **tr** tag attributes<br /><br />

- `caption`
    - **Table** caption
    - **React.ReactNode**<br /><br />

- `rootTagAttributes`
    - **table** tag attributes