import React, { useState } from 'react'

import { DropdownSearch, DropdownSearchProps } from 'app/components'


type DemoDropdownSearchProps = DropdownSearchProps<number>


const { ID } = DropdownSearch

const options: DemoDropdownSearchProps['searchOptions'] = ([1, 2, 3, 4, 5]).map((i: number) => ({
    inputValue: 'option ' + i,
    value: i
}))

const Demo = () => {
    const [ selected, setSelected ] = useState(0)

    const props: DemoDropdownSearchProps = {
        selected,
        onChange(id) {
            setSelected(id!)
        },
        searchOptions: options
    }


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <DropdownSearch { ...props }
            inputProps={{
                placeholder: 'type "option..."'
            }} />

        <h2 children='show options on focus' />
        <DropdownSearch { ...props } showOnFocus
            inputProps={{
                placeholder: 'type "option..."'
            }} />

        <h2 children='disabled' />
        <DropdownSearch { ...props } disabled />
    </>
}
Demo.id = ID


export default Demo