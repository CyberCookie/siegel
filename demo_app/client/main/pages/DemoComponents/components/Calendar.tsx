import React from 'react'

import { Calendar, CalendarProps } from 'app/components'


const timestamp = Date.now()

const Demo = () => {
    const props: CalendarProps = {
        initDate: {
            rangeDateStart: timestamp,
            rangeDateEnd: timestamp
        }
    }


    return <>
        <h1>{Calendar.ID}</h1>

        <h2>simple</h2>
        <Calendar {...props} />

        <h2>range pick, months before/after 1</h2>
        <Calendar {...props} monthsBefore={1} monthsAfter={1} rangePick />
    </>
}
Demo.id = Calendar.ID


export default Demo