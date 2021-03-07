import React, { useState } from 'react'
import { Props } from 'siegel-ui/_form/DropdownSearch/types'

import { DropdownSearch } from 'app/components'


const options: Props['searchOptions'] = {}
;([1, 2, 3, 4, 5]).forEach((i: number) => {
    const name = 'option ' + i;

    options[i] = {
        title: name,
        value: name 
    }
})

const Demo = () => {
    const [ selected, setSelected ] = useState(0)
    
    const props: Props = {
        selected,
        onChange(id) {
            setSelected(id as number)
        },
        searchOptions: options
    }


    return <>
        <h1>{DropdownSearch.ID}</h1>

        <h2>simple</h2>
        <DropdownSearch {...props}
            inputProps={{
                placeholder: 'type "option..."'
            }} />

        <h2>show options on focus</h2>
        <DropdownSearch {...props} showOnFocus
            inputProps={{
                placeholder: 'type "option..."'
            }} />

        <h2>disabled</h2>
        <DropdownSearch {...props} disabled />
    </>
}
Demo.id = DropdownSearch.ID;


export default Demo