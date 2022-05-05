import React, { useState } from 'react'

import { DropdownSearch, DropdownSearchProps, icons } from 'app/components'


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
        placeholder: 'type "option..."',
        onChange(id) {
            setSelected(id!)
        },
        searchOptions: options
    }


    return <>
        <h2 children='simple' />
        <DropdownSearch { ...props } />

        <h2 children='with reset icon and show options on focus' />
        <DropdownSearch { ...props } label='label' showOnFocus
            resetIcon={ icons.close } />

        <h2 children='disabled' />
        <DropdownSearch { ...props } disabled />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'DropdownSearch'


export default Demo