import React, { useState } from 'react'

import { Pagination, PaginationProps } from 'app/components'


const Demo = () => {
    const [ curPage, setCur ] = useState(1)

    const props: PaginationProps = {
        listLength: 100,
        showPerPage: 6,
        curPage: curPage,
        onChange(page) { setCur(page) }
    }


    return <>
        <h1>{Pagination.ID}</h1>

        <h2>simple</h2>
        <Pagination {...props} />

        <h2>2 by center; 3 by sides</h2>
        <Pagination {...props} elementsByMiddle={2} elementsBySide={3} />

        <h2>2 by center; 3 by sides; fixed width = false</h2>
        <Pagination {...props} elementsByMiddle={2} elementsBySide={3} fixedWidth={false} />
    </>
}
Demo.id = Pagination.ID


export default Demo