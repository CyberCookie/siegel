import React, { useState, useLayoutEffect } from 'react'

import { msIn } from '../../utils/date_const'
import dateParse from '../../utils/date_parse'
import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'


const componentID = '-ui-clocks'

const defaults: DefaultProps = {
    className: componentID,
    updateInterval: 1000,
    zeroing: true
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const Clocks = (props: Props) => {
    let { className, updateInterval, builder, zeroing } = extractProps(defaults, props)

    const getNextClockState = () => builder && builder(dateParse(Date.now(), zeroing))
    
    let [ parsedDate, setState ] = useState(getNextClockState())

    useLayoutEffect(() => {
        let date = new Date()

        let deltaTime = updateInterval - date.getMilliseconds()
        updateInterval == msIn.minute && (deltaTime -= (date.getSeconds() * 1000))

        let intervalID: number;
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



    return <div className={className} children={parsedDate} />
}


export { setDefaults }
export default Clocks