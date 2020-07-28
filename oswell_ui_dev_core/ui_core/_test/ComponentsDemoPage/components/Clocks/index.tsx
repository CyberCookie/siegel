import React from 'react'

import Clocks from '../../../../ui/Clocks'
import { Props } from '../../../../ui/Clocks/types'

import s from './styles.sass'


const Demo = () => {
    const props: Props = {
        className: s.clocks,
        builder: ({ date, month, year, hours, minutes, seconds }) => (
            `${date} . ${month} . ${year} | ${hours} : ${minutes} : ${seconds}`
        )
    }


    return <>
        <h1>{Clocks.ID}</h1>

        <h2>simple</h2>
        <Clocks {...props} />
    </>
}
Demo.id = Clocks.ID;


export default Demo