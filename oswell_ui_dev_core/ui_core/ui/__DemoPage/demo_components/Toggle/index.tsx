import React, { useState } from 'react'

import Toggle from '../../../_form/Toggle'
import { Props } from '../../../_form/Toggle/types'
import { icon } from '../../icons'

import s from './styles.sass'


const theme: Props['theme'] = {
    root: s.wrapper,
    _toggled: s._toggled,
    _disabled: s._disabled,
    label: s.label,
    toggle_area: s.toggle_area,
    toggler: s.toggler
}

const Demo = () => {
    const [ isToggled, setToggle ] = useState(false)

    const props: Props = {
        isToggled, theme,
        onChange: value => setToggle(value)
    }


    return <>
        <h1>{Toggle.ID}</h1>

        <h2>simple</h2>
        <h3>toggled: {isToggled + ''}</h3>
        <Toggle {...props} />

        <h2>with icon and labels</h2>
        <Toggle {...props} toggleIcon={icon}
            labelLeft='Left label'
            labelRight='Left label' />
        
        <h2>disabled</h2>
        <Toggle {...props} disabled />
    </>
}
Demo.id = Toggle.ID;


export default Demo