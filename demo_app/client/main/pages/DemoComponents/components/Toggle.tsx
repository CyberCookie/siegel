import React, { useState } from 'react'

import { Toggle, ToggleProps, icons } from 'app/components'


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
            labelRight='Right label' />

        <h2 children='disabled' />
        <Toggle { ...props } disabled />
    </>
}
Demo.coreSrcDirName = 'Toggle'


export default Demo