import React, { useState } from 'react'
import { Props } from 'siegel-ui/_form/DropdownSearch/types'

import { DropdownSearch } from 'app/components'


const options: Props['searchOptions'] = ([1, 2, 3, 4, 5]).map(i => {
    const name = 'option ' + i;

    return {
        id: i,
        title: name,
        filter: name 
    }
})

const Demo = () => {
    const [ value, setSearchValue ] = useState('')

    const props: Props = {
        value,
        onChange(value) {
            setSearchValue(value)
        },
        onSelect(id) {
            setSearchValue('')
            console.log(id)
        },
        searchOptions: options
    }


    return <>
        <h1>{DropdownSearch.ID}</h1>

        <h2>simple</h2>
        <DropdownSearch {...props} placeholder={'type "option..."'}/>

        <h2>disabled</h2>
        <DropdownSearch {...props} disabled />
    </>
}
Demo.id = DropdownSearch.ID;


export default Demo