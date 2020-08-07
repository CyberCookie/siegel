import React, { useState } from 'react'

import Button from 'core-ui/_form/Button'
import { Props } from 'core-ui/_form/Button/types'
import { icon } from '../../icons'

import theme from './styles.sass'


const Demo = () => {
    const [ counter, setCounter ] = useState(0)

    const props: Props = {
        value: <>{icon} click me</>,
        className: theme.button,
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
Demo.id = Button.ID;


export { theme }
export default Demo