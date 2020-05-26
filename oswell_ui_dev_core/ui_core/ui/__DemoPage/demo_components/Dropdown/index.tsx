import React, { useState } from 'react'

import Dropdown from '../../../Dropdown'
import { Props } from '../../../Dropdown/types'
import { chevron } from '../../icons'

import s from './styles.sass'


const theme = {
}

const Demo = () => {
    const [ curPage, setCur ] = useState(1)

    const props: Props = {
        theme,

    }


    return <>
        <h1>{Dropdown.ID}</h1>

        <h2>simple</h2>
        {/* <Dropdown {...props} /> */}
    </>
}
Demo.id = Dropdown.ID;


export default Demo