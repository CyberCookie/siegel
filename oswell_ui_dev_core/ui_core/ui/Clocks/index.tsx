import React, { useState, useLayoutEffect } from 'react'

import { msIn } from '../../utils/date/date_const'
import dateParse from '../../utils/date/date_parse'
import { extractProps } from '../ui_utils'
import { _Clocks } from './types'


const componentID = '-ui-clocks'

const Clocks: _Clocks = (props, withDefaults) => {
    const { className, updateInterval, builder, zeroing, attributes } = withDefaults
        ?   (props as _Clocks['defaults'] & typeof props)
        :   extractProps(Clocks.defaults, props)

    const getNextClockState = () => builder && builder(dateParse(Date.now(), zeroing))
    
    const [ parsedDate, setState ] = useState(getNextClockState())

    const clocksRootProps = {
        className,
        children: parsedDate
    }
    attributes && (Object.assign(clocksRootProps, attributes))

    useLayoutEffect(() => {
        const date = new Date()

        let deltaTime = updateInterval - date.getMilliseconds()
        updateInterval == msIn.minute && (deltaTime -= (date.getSeconds() * 1000))

        let intervalID: number;
        const timeoutID = setTimeout(() => {
            tick()
            intervalID = (setInterval as typeof window.setInterval)(tick, updateInterval)
        }, deltaTime)
        

        return () => {
            clearTimeout(timeoutID)
            clearInterval(intervalID)
        }
    }, [])


    function tick() { setState(getNextClockState()) }


    return <div {...clocksRootProps} />
}
Clocks.defaults = {
    className: componentID,
    updateInterval: 1000,
    zeroing: true
}
Clocks.ID = componentID;


export { componentID }
export default Clocks