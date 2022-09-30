import React, { useState } from 'react'

import { Radio, RadioProps } from 'app/components'


const options = ([1,2,3]).map(i => ({
    id: i.toString(),
    content: `option ${i}`
}))

const Demo = () => {
    const [ selected, setSelected ] = useState('')
    const [ selectedMultiple, setSelectedMultiple ] = useState({
        selected: new Set() as Set<string>
    })

    const props: RadioProps = {
        selected, options,
        onChange(value) { setSelected(value as string) }
    }


    return <>
        <h2 children='simple single select' />
        <Radio { ...props } />

        <h2 children='multiple select' />
        <Radio options={ options } multiple
            selected={ selectedMultiple.selected }
            onChange={ value => {
                selectedMultiple.selected.has(value)
                    ?   selectedMultiple.selected.delete(value)
                    :   selectedMultiple.selected.add(value)

                setSelectedMultiple({ ...selectedMultiple })
            } } />

        <h2 children='disabled' />
        <Radio { ...props } disabled />
    </>
}
Demo.coreSrcDirName = 'Radio'


export default Demo