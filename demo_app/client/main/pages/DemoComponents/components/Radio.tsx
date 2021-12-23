import React, { useState } from 'react'

import { Radio, RadioProps } from 'app/components'


const { ID } = Radio

const options = ([1,2,3]).map(i => ({
    id: i.toString(),
    content: `option ${i}`
}))

const Demo = () => {
    const [ selected, setSelected ] = useState('')
    const [ selectedMultiple, setSelectedMultiple ] = useState({
        selected: new Set()
    })

    const props: RadioProps = {
        selected, options,
        onChange(value) { setSelected(value as string) }
    }

    const propsForMultiple: RadioProps = {
        options,
        multiple: true,
        selected: selectedMultiple.selected as Set<string>,
        onChange(value) {
            selectedMultiple.selected.has(value)
                ?   selectedMultiple.selected.delete(value)
                :   selectedMultiple.selected.add(value)

            setSelectedMultiple({ ...selectedMultiple })
        }
    }


    return <>
        <h1 children={ ID } />

        <h2 children='simple single select' />
        <Radio { ...props } />

        <h2 children='multiple select' />
        <Radio { ...propsForMultiple } />

        <h2 children='disabled' />
        <Radio { ...props } disabled />
    </>
}
Demo.id = ID


export default Demo