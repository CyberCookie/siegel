import React from 'react'

import Dropdown from 'core-ui/Dropdown'
import { Props } from 'core-ui/Dropdown/types'
import { chevron } from '../../icons'

import s from './styles.sass'


const theme = {
    root: s.dropdown,
    item: s.item,
    item__empty: s.item__empty,
    item_title: s.item_title
}

const Demo = () => {
    const props: Props = {
        theme,
        dropdownIcon: chevron,
        list: [
            { title: 'item 1' },
            { title: 'item 2' },
            { title: 'item 3' },
            { title: 'item 4' },
            {
                title: 'item 5',
                children: [
                    { title: 'subitem 1' },
                    { title: 'subitem 2' }
                ]
            },
            {
                title: 'item 6',
                children: [{
                    title: 'subitem 1',
                    children: [{
                        title: 'subitem 1',
                        children: [{
                            title: 'subitem 1',
                            children: [{ title: 'final' }]
                        }]
                    }]
                }]
            }
        ]
    }


    return <>
        <h1>{Dropdown.ID}</h1>

        <h2>simple</h2>
        <Dropdown {...props} />
    </>
}
Demo.id = Dropdown.ID;


export { theme }
export default Demo