import React from 'react'

import { Calendar, CalendarProps } from 'app/components'


const { ID } = Calendar

const timestamp = Date.now()

const Demo = () => {
    const props: CalendarProps = {
        initDate: {
            rangeDateStart: timestamp,
            rangeDateEnd: timestamp
        }
    }


    return <>
        <h2 children='simple' />
        <Calendar { ...props } />

        <h2 children='range pick, months before/after 1' />
        <Calendar { ...props } monthsBefore={ 1 } monthsAfter={ 1 } rangePick />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Calendar'


export default Demo