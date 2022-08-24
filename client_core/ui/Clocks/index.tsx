import { useState, useLayoutEffect } from 'react'

import getUniqId from '../../../common/get_uniq_id'
import dateParse from '../../../common/date/parse'
import msIn from '../../../common/date/constants'
import intervalWorker, {
    MessageIncome as WorkerMessageIncome,
    MessageOutcome as WorkerMessageOutcome
} from '../../intervals__worker'
import useDidUpdate from '../../hooks/did_update'
import component from '../_internals/component'

import type { Component, Props } from './types'


const worker = intervalWorker()

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
            dateState.date = initDate!
            setDate({ ...dateState  })
        }, [ initDate ])

        useLayoutEffect(() => {
            const workerIntervalId = `${componentID}_tick_${getUniqId()}`
            worker.addEventListener('message', workerTick)

            const { date } = dateState


            function workerTick({ data }: WorkerMessageOutcome) {
                data == workerIntervalId && tick(timeChangeValueMS)
            }

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


            const isNotNormalSpeed = speedCoef != 1
            let updateInterval = timeChangeValueMS
            if (isNotNormalSpeed) {
                deltaToFirstTick /= speedCoef
                updateInterval /= speedCoef
            }



            const deltaToFirstTickTimeoutID = setTimeout(() => {
                tick(firstTickChangeValue)

                worker.postMessage({ id: workerIntervalId, ms: updateInterval } as WorkerMessageIncome)
            }, deltaToFirstTick)


            return () => {
                worker.postMessage({ id: workerIntervalId } as WorkerMessageIncome)
                worker.removeEventListener('message', workerTick)

                clearTimeout(deltaToFirstTickTimeoutID)
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