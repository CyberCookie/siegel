import React, { useState } from 'react'

import Radio from 'essence-ui/_form/Radio'
import { Props } from 'essence-ui/_form/Radio/types'

import s from './styles.sass'


const theme: Props['theme'] = {
    root: s.radio,
    option: s.option,
    option__selected: s.option__selected,
    _disabled: s._disabled
}

const options = ([1,2,3]).map(i => ({
    id: i,
    content: `option ${i}`
}))

const Demo = () => {
    const [ selected, setSelected ] = useState('')
    const [ selectedMultiple, setSelectedMultiple ] = useState({
        selected: new Set()
    })

    const props: Props = {
        selected, theme, options,
        onChange(value) { setSelected(value as string) },

    }

    const propsForMultiple: Props = {
        theme, options,
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
Demo.id = Radio.ID;


export { theme }
export default Demo