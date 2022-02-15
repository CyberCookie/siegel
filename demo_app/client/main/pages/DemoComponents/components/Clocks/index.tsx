import React from 'react'

import { Clocks, ClocksProps } from 'app/components'

import styles from './styles.sass'


const { ID } = Clocks

const timeBuilder = ({ date, month, year, hours, minutes, seconds }: Parameters<NonNullable<ClocksProps['builder']>>[0]) => (
    `${date} . ${month} . ${year} | ${hours} : ${minutes} : ${seconds}`
)

const Demo = () => {
    const initDate = new Date()

    const secondsClocksChildParams: ClocksProps = {
        initDate,
        builder: timeBuilder,
        tickEveryMinute: false
    }


    return <>
        <h1 children={ ID } />

        <h2 children='simple (by default update every minute)' />
        <div className={ styles.clocks }>
            <Clocks initDate={ initDate } builder={ timeBuilder } />
        </div>

        <h2 children='update every second' />
        <div className={ styles.clocks }>
            <Clocks { ...secondsClocksChildParams } />
        </div>

        <h2 children='10x faster' />
        <div className={ styles.clocks }>
            <Clocks { ...secondsClocksChildParams } speedCoef={ 10 } />
        </div>

        <h2 children='backward 5x slower' />
        <div className={ styles.clocks }>
            <Clocks { ...secondsClocksChildParams } backward speedCoef={ 0.2 } />
        </div>
    </>
}
Demo.id = ID


export default Demo