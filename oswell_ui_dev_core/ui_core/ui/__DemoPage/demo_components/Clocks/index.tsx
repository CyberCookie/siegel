import React from 'react'

import Clocks/*, { Props }*/ from '../../../Clocks'
import { Props } from '../../../Clocks/types'

import s from './styles.sass'


const Demo = () => {
    const props: Props = {
        className: s.button,
        updateInterval: 1000,
        builder: ({ date, month, year, hours, minutes, seconds }) => {
            console.log(seconds)
            `${date} . ${month} . ${year} | ${hours} : ${minutes} : ${seconds}`
        }
    }


    return <>
        <h1>{Clocks.ID}</h1>

        <h2>simple</h2>
        {/* <Clocks {...props} /> */}
    </>
}
Demo.id = Clocks.ID;


export default Demo