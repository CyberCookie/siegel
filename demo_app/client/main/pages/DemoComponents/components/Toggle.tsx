import React, { useState } from 'react'

import { Toggle, ToggleProps, icons } from 'app/components'


const Demo = () => {
    const [ isToggled, setToggle ] = useState(false)

    const props: ToggleProps = {
        isToggled,
        onChange: value => setToggle(value)
    }


    return <>
        <h1>{Toggle.ID}</h1>

        <h2>simple</h2>
        <h3>toggled: {isToggled + ''}</h3>
        <Toggle {...props} />

        <h2>with icon and labels</h2>
        <Toggle {...props} toggleIcon={icons.edit}
            labelLeft='Left label'
            labelRight='Left label' />

        <h2>disabled</h2>
        <Toggle {...props} disabled />
    </>
}
Demo.id = Toggle.ID


export default Demo