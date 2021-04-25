import React, { useState } from 'react'

import { Button, ButtonProps, icons } from 'app/components'


const Demo = () => {
    const [ counter, setCounter ] = useState(0)

    const props: ButtonProps = {
        value: <>{icons.edit} click me</>,
        onClick() {
            setCounter(counter + 1)
        }
    }


    return <>
        <h1>{Button.ID}</h1>

        <h2>simple</h2>
        <h3>counter: {counter}</h3>
        <Button {...props} />

        <h2>disabled</h2>
        <Button {...props} disabled />
    </>
}
Demo.id = Button.ID


export default Demo