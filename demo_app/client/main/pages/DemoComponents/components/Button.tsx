import React, { useState } from 'react'

import { Button, ButtonProps, icons } from 'app/components'


const { ID } = Button

const Demo = () => {
    const [ counter, setCounter ] = useState(0)

    const props: ButtonProps = {
        value: <>{icons.edit} click me</>,
        onClick() {
            setCounter(counter + 1)
        }
    }


    return <>
        <h2 children='simple' />
        <h3 children={ `counter: ${counter}` } />

        <Button { ...props } />

        <h2 children='disabled' />
        <Button { ...props } disabled />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Button'


export default Demo