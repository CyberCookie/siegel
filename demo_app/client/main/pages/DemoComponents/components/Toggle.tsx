import React, { useState } from 'react'

import { Toggle, ToggleProps, icons } from 'app/components'


const { ID } = Toggle

const Demo = () => {
    const [ value, setToggle ] = useState(false)

    const props: ToggleProps = {
        value,
        onChange: value => setToggle(value)
    }


    return <>
        <h2 children='simple' />
        <h3 children={ `toggled: ${ value + '' }` } />
        <Toggle { ...props } />

        <h2 children='with icon and labels' />
        <Toggle { ...props } toggleIcon={ icons.edit }
            labelLeft='Left label'
            labelRight='Left label' />

        <h2 children='disabled' />
        <Toggle { ...props } disabled />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Toggle'


export default Demo