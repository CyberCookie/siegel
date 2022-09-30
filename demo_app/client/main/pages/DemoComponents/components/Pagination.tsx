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
        <h2 children='simple' />
        <Pagination { ...props } />

        <h2 children='2 by center; 3 by sides' />
        <Pagination { ...props } elementsByMiddle={ 2 } elementsBySide={ 3 } />

        <h2 children='2 by center; 3 by sides; fixed width = false' />
        <Pagination { ...props } elementsByMiddle={ 2 } elementsBySide={ 3 } fixedWidth={ false } />
    </>
}
Demo.coreSrcDirName = 'Pagination'


export default Demo