import React, { useState, useLayoutEffect } from 'react'

import { dateLocalizationByLocale, msIn } from 'core/utils/date_const'
import dateParse from 'core/utils/date_parse'


const componentID = '-ui-clocks'

const defaults = {
    className: componentID,
    locale: 'en',
    updateInterval: 1000,
    zeroing: true,
    builder: null
}

const setDefaults = customDefaults => Object.assign(defaults, customDefaults)


const Clocks = props => {
    let className = defaults.className;
    props.className && (className += ` ${props.className}`)

    let { locale, updateInterval, builder, zeroing } = Object.assign({}, defaults, props)

    let [ parsedDate, setState ] = useState(getNextClockState())

    useLayoutEffect(() => {
        let date = new Date()

        let deltaTime = updateInterval - date.getMilliseconds()
        updateInterval == msIn.minute && (deltaTime -= (date.getSeconds() * 1000))

        let intervalID;
        let timeoutID = setTimeout(() => {
            tick()
            intervalID = setInterval(tick, updateInterval)
        }, deltaTime)
        

        return () => {
            clearTimeout(timeoutID)
            clearInterval(intervalID)
        }
    }, [])


    function tick() { setState(getNextClockState()) }

    function getNextClockState() {
        let { monthsShort, daysShort } = dateLocalizationByLocale[locale];
        let parsedDate = dateParse(Date.now(), zeroing)

        
        return builder && builder({
            ...parsedDate,
            monthShort: monthsShort[parsedDate.month - 1],
            dayShort: daysShort[parsedDate.day]
        })
    }


    return <div className={className} children={parsedDate} />
}


export { setDefaults }
export default Clocks