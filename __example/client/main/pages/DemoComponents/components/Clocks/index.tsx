import React from 'react'

import Clocks from 'essence-ui/Clocks'
import { _Clocks } from 'essence-ui/Clocks/types'

import s from './styles.sass'


const Demo = () => {
    const initDate = new Date()


    const simpleClocksChild = (
        <Clocks initDate={initDate}
            builder={({ date, month, year, hours, minutes }) => `${date} . ${month} . ${year} | ${hours} : ${minutes}` } />
    )


    const secondsClocksChildParams: Parameters<_Clocks>[0] = {
        initDate,
        builder: ({ date, month, year, hours, minutes, seconds }) => (
            `${date} . ${month} . ${year} | ${hours} : ${minutes} : ${seconds}`
        ),
        incrementEveryMinute: false
    }

    const secondsClocksChild = <Clocks {...secondsClocksChildParams} />

    const secondsFastClocksChild = <Clocks {...secondsClocksChildParams} speedCoef={10} />


    return <>
        <h1>{Clocks.ID}</h1>

        <h2>simple</h2>
        <div children={simpleClocksChild} className={s.clocks} />

        <h2>update every second</h2>
        <div children={secondsClocksChild} className={s.clocks} />

        <h2>10x faster</h2>
        <div children={secondsFastClocksChild} className={s.clocks} />
    </>
}
Demo.id = Clocks.ID;


export default Demo