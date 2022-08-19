import { useState, useLayoutEffect } from 'react'

import dateParse from '../../../common/date/parse'
import msIn from '../../../common/date/constants'
import useDidUpdate from '../../hooks/did_update'
import component from '../_internals/component'

import type { Component, Props } from './types'


const componentID = '-ui-clocks'

const Clocks: Component = component(
    componentID,
    {
        speedCoef: 1,
        tickEveryMinute: true,
        zeroing: true
    },
    props => {

        const {
            builder, initDate, zeroing, tickEveryMinute, speedCoef, backward
        } = props

        const [ dateState, setDate ] = useState({
            date: initDate ? new Date(initDate) : new Date()
        })
        const { date } = dateState

        useDidUpdate(() => {
            dateState.date = initDate
            setDate({ ...dateState  })
        }, [ initDate ])

        useLayoutEffect(() => {
            const { date } = dateState

            function tick(timeChangeValueMS: number) {
                const currentMS = date.getMilliseconds()
                const newDate = new Date(
                    date.setMilliseconds(
                        backward
                            ?   currentMS - timeChangeValueMS
                            :   currentMS + timeChangeValueMS
                    )
                )

                dateState.date = newDate
                setDate({ ...dateState })
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
        }, [ initDate ])


        return (
            builder
                ?   builder(dateParse(date, zeroing))
                :   date.toISOString()
        ) as React.ReactElement
    }
)


export default Clocks
export { componentID }
export type { Component, Props }