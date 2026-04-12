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

import type { Component, Store, Props, DefaultProps } from './types'


const worker = intervalWorker()

const componentID = '-ui-clocks'


function tick(
    timeChangeValueMS: number,
    dateStore: Store,
    backward: Props['backward'],
    processAsTimer: boolean | undefined
) {

    const [ dateState, setDate ] = dateStore

    let newDate
    if (processAsTimer) {
        const { date } = dateState
        const currentMS = date.getMilliseconds()

        newDate = new Date(
            date.setMilliseconds(
                backward
                    ?   currentMS - timeChangeValueMS
                    :   currentMS + timeChangeValueMS
            )
        )

    } else newDate = new Date()


    dateState.date = newDate
    setDate({ ...dateState })
}

const Clocks = component<Props, DefaultProps>(
    componentID,
    {
        speedCoef: 1,
        tickEveryMinute: true,
        zeroing: true
    },
    props => {

        const {
            builder, initDate, zeroing, tickEveryMinute, speedCoef, backward, processAsTimer
        } = props

        const dateStore: Store = useState(() => ({
            date: initDate ? new Date(initDate) : new Date()
        }))
        const [ dateState, setDate ] = dateStore
        const { date } = dateState

        useDidUpdate(() => {
            dateState.date = initDate!
            setDate({ ...dateState })
        }, [ initDate ])

        useLayoutEffect(() => {
            const { date } = dateState

            let timeChangeValueMS: number
            let deltaToFirstMinuteTick: number
            if (tickEveryMinute) {
                timeChangeValueMS = msIn.minute

                deltaToFirstMinuteTick = date.getSeconds() * msIn.second
                backward || (deltaToFirstMinuteTick *= -1)

            } else timeChangeValueMS = msIn.second

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

            const processAsTimerFinal = processAsTimer || isNotNormalSpeed || backward


            let workerIntervalId: string
            if (processAsTimerFinal) {
                workerIntervalId = `${componentID}_tick_${getUniqId()}`
                worker.addEventListener('message', workerTick)
            }


            function workerTick({ data }: Pick<WorkerMessageOutcome, 'data'>) {
                if (!processAsTimerFinal || data == workerIntervalId) {
                    tick(timeChangeValueMS, dateStore, backward, processAsTimerFinal)
                }
            }

            let tickInterval: number
            const deltaToFirstTickTimeoutID = setTimeout(() => {
                tick(firstTickChangeValue, dateStore, backward, processAsTimerFinal)

                if (processAsTimerFinal) {
                    worker.postMessage({ id: workerIntervalId, ms: updateInterval } as WorkerMessageIncome)

                } else {
                    tickInterval = (setInterval as Window['setInterval'])(() => {
                        workerTick({ data: '' })
                    }, updateInterval)
                }
            }, deltaToFirstTick)


            return () => {
                if (processAsTimerFinal) {
                    worker.postMessage({ id: workerIntervalId } as WorkerMessageIncome)
                    worker.removeEventListener('message', workerTick)

                } else clearInterval(tickInterval)

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