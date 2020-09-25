import React from 'react'
import { _Clocks as ClocksComponent } from 'siegel-ui/Clocks/types'

import { Clocks } from 'app/components'

import styles from './styles.sass'


const Demo = () => {
    const initDate = new Date()


    const simpleClocksChild = (
        <Clocks initDate={initDate}
            builder={({ date, month, year, hours, minutes }) => `${date} . ${month} . ${year} | ${hours} : ${minutes}` } />
    )


    const secondsClocksChildParams: Parameters<ClocksComponent>[0] = {
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
        <div className={styles.clocks} children={simpleClocksChild} />

        <h2>update every second</h2>
        <div className={styles.clocks} children={secondsClocksChild} />

        <h2>10x faster</h2>
        <div className={styles.clocks} children={secondsFastClocksChild} />
    </>
}
Demo.id = Clocks.ID;


export default Demo