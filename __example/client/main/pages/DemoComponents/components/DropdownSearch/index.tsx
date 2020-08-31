import React, { useState } from 'react'

import DropdownSearch from 'essence-ui/_form/DropdownSearch'
import { Props } from 'essence-ui/_form/DropdownSearch/types'
import { theme as inputTheme } from '../Input'
import { theme as selectTheme } from '../Select'

import s from './styles.sass'

const theme = {
    root: s.dropdown_search,
    field: `${inputTheme.field} ${s.field}`,
    label_text: inputTheme.label_text,
    options: `${selectTheme.options} ${s.options}`,
    option: selectTheme.option,
    _focused: inputTheme._focused,
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


export { theme }
export default Demo