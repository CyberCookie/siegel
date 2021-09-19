import React from 'react'

import { Clocks, ClocksProps } from 'app/components'

import styles from './styles.sass'


const { ID } = Clocks

const timeBuilder = ({ date, month, year, hours, minutes, seconds }: Parameters<NonNullable<ClocksProps['builder']>>[0]) => (
    `${date} . ${month} . ${year} | ${hours} : ${minutes} : ${seconds}`
)

const Demo = () => {
    const initDate = new Date()


    const simpleClocksChild = <Clocks initDate={ initDate } builder={ timeBuilder } />

    const secondsClocksChildParams: ClocksProps = {
        initDate,
        builder: timeBuilder,
        incrementEveryMinute: false
    }

    const secondsClocksChild = <Clocks { ...secondsClocksChildParams } />

    const secondsFastClocksChild = <Clocks { ...secondsClocksChildParams } speedCoef={ 10 } />


    return <>
        <h1 children={ ID } />

        <h2 children='simple (by default update every minute)' />
        <div className={ styles.clocks } children={ simpleClocksChild } />

        <h2 children='update every second' />
        <div className={ styles.clocks } children={ secondsClocksChild } />

        <h2 children='10x faster' />
        <div className={ styles.clocks } children={ secondsFastClocksChild } />
    </>
}
Demo.id = ID


export default Demo