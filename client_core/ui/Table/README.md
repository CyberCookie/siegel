# Table

Simple table<br />

<br />

## Props:

- `rootTagAttributes`
    - **table** tag attributes<br /><br />

- `refApi`

- `className`

- `head`
    - **Table** header. Represents each row in **thead** tag
    - **Object[]** with the next fields:
        - `children` - **Object[]**. Represents each cell in footer row. Each **Object** has the next fields:
            - `value` - **React.ReactNode**. table Cell value
            - `attributes` - **th** tag attributes
        - `attributes` - **tr** tag attributes<br /><br />

- `body`
    - **Table** body. Represents each row in **tbody** tag
    - **Object[]** with the next fields:
        - `children` - **Object[]**. Represents each cell in footer row. Each **Object** has the next fields:
            - `value` - **React.ReactNode**. table Cell value
            - `attributes` - **td** tag attributes
        - `attributes` - **tr** tag attributes<br /><br />

- `foot`
    - **Table** footer. Represents each row in **tfoot** tag
    - **Object[]** with the next fields:
        - `children` - **Object[]**. Represents each cell in footer row. Each **Object** has the next fields:
            - `value` - **React.ReactNode**. table Cell value
            - `attributes` - **td** tag attributes
        - `attributes` - **tr** tag attributes<br /><br />

- `caption`
    - **Table** caption
    - **React.ReactNode**