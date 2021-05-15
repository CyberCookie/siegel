import React from 'react'

import { Clocks, ClocksProps } from 'app/components'

import styles from './styles.sass'


const timeBuilder = ({ date, month, year, hours, minutes, seconds }: Parameters<NonNullable<ClocksProps['builder']>>[0]) => (
    `${date} . ${month} . ${year} | ${hours} : ${minutes} : ${seconds}`
)

const Demo = () => {
    const initDate = new Date()


    const simpleClocksChild = <Clocks initDate={initDate} builder={timeBuilder} />

    const secondsClocksChildParams: ClocksProps = {
        initDate,
        builder: timeBuilder,
        incrementEveryMinute: false
    }

    const secondsClocksChild = <Clocks { ...secondsClocksChildParams } />

    const secondsFastClocksChild = <Clocks { ...secondsClocksChildParams } speedCoef={10} />


    return <>
        <h1>{Clocks.ID}</h1>

        <h2>simple (by default update every minute)</h2>
        <div className={styles.clocks} children={simpleClocksChild} />

        <h2>update every second</h2>
        <div className={styles.clocks} children={secondsClocksChild} />

        <h2>10x faster</h2>
        <div className={styles.clocks} children={secondsFastClocksChild} />
    </>
}
Demo.id = Clocks.ID


export default Demo