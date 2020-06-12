import React, { useState } from 'react'

import DataTable/*, { Props }*/ from '../../../DataTable'
import { Props } from '../../../DataTable/types'

import s from './styles.sass'


const theme = {}

const Demo = () => {
    const [ counter, setCounter ] = useState(0)

    const props: Props = {
    }


    return <>
        <h1>{DataTable.ID}</h1>

        <h2>simple</h2>
        <DataTable {...props} />
    </>
}
Demo.id = DataTable.ID;


export default Demo