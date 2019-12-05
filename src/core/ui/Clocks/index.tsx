import React, { useState, useLayoutEffect } from 'react'

import { dateLocalization } from 'core-utils/date_const'
import dateParse from 'core-utils/date_parse'

interface Props {
    locale?: string,
    zeroing?: boolean
}

interface DefaultProps {
    locale: string
}


const defaults: DefaultProps = {
    locale: 'en'
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const Clocks = (props: Props) => {
    let { locale, zeroing } = Object.assign({}, defaults, props)
    let [{ time, day, date }, setState ] = useState(getNextClockState())

    useLayoutEffect(() => {
        let date = new Date()
        let deltaTime = 60000 - (date.getSeconds() * 1000) - date.getMilliseconds()

        let intervalID: number;
        let timeoutID = setTimeout(() => {
            tick()
            intervalID = setInterval(tick, 60000)
        }, deltaTime)
        

        return () => {
            clearTimeout(timeoutID)
            clearInterval(intervalID)
        }
    }, [])

    function tick() { setState(getNextClockState()) }

    function getNextClockState() {
        let { monthsShort, daysShort } = dateLocalization[locale]
        let { month, date, day, hours, minutes } = dateParse(undefined, zeroing)

        return {
            time: `${hours}:${minutes}`,
            date: `${date} ${monthsShort[month]}`,
            day: daysShort[day]
        }
    }


    return (
        <div className='clocks'>
            <div className='time' children={time} />
            <div className='date' children={date} />
            <div className='day' children={day} />
        </div>
    )
}


export { setDefaults }
export default Clocks