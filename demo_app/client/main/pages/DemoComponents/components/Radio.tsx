import React, { useState } from 'react'

import { Radio, RadioProps } from 'app/components'


const options = ([1,2,3]).map(i => ({
    id: i,
    content: `option ${i}`
}))

const Demo = () => {
    const [ selected, setSelected ] = useState('')
    const [ selectedMultiple, setSelectedMultiple ] = useState({
        selected: new Set()
    })

    const props: RadioProps = {
        selected, options,
        onChange(value) { setSelected(value as string) },

    }

    const propsForMultiple: RadioProps = {
        options,
        multiple: true,
        selected: selectedMultiple.selected as Set<ID>,
        onChange(value) {
            selectedMultiple.selected.has(value)
                ?   selectedMultiple.selected.delete(value)
                :   selectedMultiple.selected.add(value)

            setSelectedMultiple({ ...selectedMultiple })
        }
    }


    return <>
        <h1>{Radio.ID}</h1>

        <h2>simple single select</h2>
        <Radio {...props} />

        <h2>multiple select</h2>
        <Radio {...propsForMultiple} />

        <h2>disabled</h2>
        <Radio {...props} disabled />
    </>
}
Demo.id = Radio.ID


export default Demo