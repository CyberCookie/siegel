import { useState, useLayoutEffect } from 'react'

import dateParse from '../../utils/date/parse'
import { msIn } from '../../utils/date/consts'
import { extractProps } from '../ui_utils'
import type { _Clocks } from './types'


const componentID = '-ui-clocks'

const Clocks: _Clocks = (props, noDefaults) => {
    const { builder, initDate, zeroing, incrementEveryMinute, speedCoef } = noDefaults
        ?   extractProps(Clocks.defaults, props, false)
        :   (props as _Clocks['defaults'] & typeof props)


    const [ date, setDate ] = useState(initDate ? new Date(initDate) : new Date())

    
    useLayoutEffect(() => {
        const isNotNormalSpeed = speedCoef != 1

        function tick() {
            const newDate = isNotNormalSpeed
                ?   (new Date(date.setMilliseconds(date.getMilliseconds() + msInIncrementValue)))
                :   (new Date())

            setDate(newDate)
        }
        
        const msInIncrementValue = incrementEveryMinute ? msIn.minute : msIn.second;

        let deltaToFirstTick = msInIncrementValue - date.getMilliseconds()
        incrementEveryMinute && (deltaToFirstTick -= (date.getSeconds() * msIn.second))
        
        let updateInterval = msInIncrementValue;
        if (isNotNormalSpeed) {
            deltaToFirstTick /= speedCoef;
            updateInterval /= speedCoef
        }


        let intervalID: number;
        const deltaToFirstTickTimeoutID = setTimeout(() => {
            tick()
            intervalID = (setInterval as typeof window.setInterval)(tick, updateInterval)
        }, deltaToFirstTick)
        

        return () => {
            clearTimeout(deltaToFirstTickTimeoutID)
            clearInterval(intervalID)
        }
    }, [])


    return (builder ? builder(dateParse(date, zeroing)) : date.toISOString()) as React.ReactElement
}
Clocks.defaults = {
    speedCoef: 1,
    incrementEveryMinute: true,
    zeroing: true
}
Clocks.ID = componentID;


export { componentID }
export default Clocks