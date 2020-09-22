import React, { useState } from 'react'

import Pagination from 'siegel-ui/Pagination'
import { Props } from 'siegel-ui/Pagination/types'
import { chevron } from '../../icons'

import s from './styles.sass'


const theme = {
    root: s.paginator,
    separator: s.separator,
    control: s.control,
    control__active: s.control__active,
    control__disabled: s.control__disabled
}

const Demo = () => {
    const [ curPage, setCur ] = useState(1)

    const props: Props = {
        theme,
        listLength: 100,
        showPerPage: 6,
        curPage: curPage,
        onChange(page) { setCur(page) },
        controlIcon: chevron,
        separator: '---'
    }


    return <>
        <h1>{Pagination.ID}</h1>

        <h2>simple</h2>
        <Pagination {...props} />


        <h2>2 by center; 3 by sides</h2>
        <Pagination {...props} elementsByMiddle={2} elementsBySide={3} />
    </>
}
Demo.id = Pagination.ID;


export { theme }
export default Demo