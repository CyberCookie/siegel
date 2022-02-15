import { useState, useLayoutEffect } from 'react'

import dateParse from '../../utils/date/parse'
import { msIn } from '../../utils/date/consts'
import extractProps from '../_internals/props_extract'
import type { Component, MergedProps, Props } from './types'


const componentID = '-ui-clocks'

const Clocks: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Clocks.defaults, props, false)
        :   (props as MergedProps)

    const {
        builder, initDate, zeroing, tickEveryMinute, speedCoef, backward
    } = mergedProps

    const [ date, setDate ] = useState(initDate ? new Date(initDate) : new Date())


    useLayoutEffect(() => {
        function tick(timeChangeValueMS: number) {
            const currentMS = date.getMilliseconds()
            const newDate = new Date(
                date.setMilliseconds(
                    backward
                        ?   currentMS - timeChangeValueMS
                        :   currentMS + timeChangeValueMS
                )
            )

            setDate(newDate)
        }

        const isNotNormalSpeed = speedCoef != 1


        let timeChangeValueMS: number
        let deltaToFirstMinuteTick: number
        if (tickEveryMinute) {
            timeChangeValueMS = msIn.minute

            deltaToFirstMinuteTick = date.getSeconds() * msIn.second
            backward || (deltaToFirstMinuteTick *= -1)
        } else {
            timeChangeValueMS = msIn.second
        }

        const currentMS = date.getMilliseconds()
        let deltaToFirstTick = backward
            ?   currentMS
            :   timeChangeValueMS - currentMS

        deltaToFirstMinuteTick! && (deltaToFirstTick += deltaToFirstMinuteTick)

        const firstTickChangeValue = deltaToFirstTick

        let updateInterval = timeChangeValueMS
        if (isNotNormalSpeed) {
            deltaToFirstTick /= speedCoef
            updateInterval /= speedCoef
        }


        let intervalID: number
        const deltaToFirstTickTimeoutID = setTimeout(() => {
            tick(firstTickChangeValue)

            intervalID = (setInterval as Window['setInterval'])(() => {
                tick(timeChangeValueMS)
            }, updateInterval)
        }, deltaToFirstTick)


        return () => {
            clearTimeout(deltaToFirstTickTimeoutID)
            clearInterval(intervalID)
        }
    }, [])


    return (
        builder
            ?   builder(dateParse(date, zeroing))
            :   date.toISOString()
    ) as React.ReactElement
}
Clocks.defaults = {
    speedCoef: 1,
    tickEveryMinute: true,
    zeroing: true
}
Clocks.ID = componentID


export { componentID }
export default Clocks
export type { Props }