import React, { useState } from 'react'

import DropdownSearch from '../../../_form/DropdownSearch'
import { Props } from '../../../_form/DropdownSearch/types'

import s from './styles.sass'

const theme = {
    root: s.dropdown_search,
    field: s.field,
    label_text: s.label_text,
    options: s.options,
    option: s.option,
    _focused: s._focused,
    _disabled: s._disabled,
    _with_suggestions: s._with_suggestions
}

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
        value, theme,
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