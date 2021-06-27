import React, { useState } from 'react'

import { DropdownSearch, DropdownSearchProps } from 'app/components'


const options: DropdownSearchProps['searchOptions'] = ([1, 2, 3, 4, 5]).map((i: number) => ({
    inputValue: 'option ' + i,
    value: i
}))

const Demo = () => {
    const [ selected, setSelected ] = useState(0)

    const props: DropdownSearchProps<number> = {
        selected,
        onChange(id) {
            setSelected(id!)
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
Demo.id = DropdownSearch.ID


export default Demo