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
            builder, initDate, zeroing, tickEveryMinute, speedCoef, backward
        } = props

        const dateStore: Store = useState({
            date: initDate ? new Date(initDate) : new Date()
            // dateTickTimestamp: undefined
        })
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

            const processAsTimer = isNotNormalSpeed || backward


            let workerIntervalId: string
            if (processAsTimer) {
                workerIntervalId = `${componentID}_tick_${getUniqId()}`
                worker.addEventListener('message', workerTick)
            }


            function workerTick({ data }: Pick<WorkerMessageOutcome, 'data'>) {
                if (!processAsTimer || data == workerIntervalId) {
                    // let timeChangeValueMSAdjust = timeChangeValueMS
                    // if (processAsTimer) {
                    //     const dateNow = Date.now()
                    //     const prevDateTickTimestamp = dateState.dateTickTimestamp || dateNow
                    //     dateState.dateTickTimestamp = dateNow

                    //     const timeChangeDelta = dateNow - prevDateTickTimestamp
                    //     console.log('prevDateTickTimestamp: ', new Date(prevDateTickTimestamp))
                    //     console.log('new date: ', new Date(dateNow))
                    //     console.log('deltams: ', timeChangeDelta)

                    //     timeChangeValueMSAdjust = timeChangeDelta && timeChangeDelta != updateInterval
                    //         ?   isNotNormalSpeed
                    //             ?   parseInt((timeChangeDelta / updateInterval) * timeChangeValueMS)
                    //             :   timeChangeDelta
                    //         :   timeChangeValueMS
                    //     console.log('timeChangeValueMS: ', timeChangeValueMS)
                    //     console.log('timeChangeValueMSAdjust: ', timeChangeValueMSAdjust, timeChangeDelta, updateInterval)
                    //     console.log('================')
                    // }

                    tick(timeChangeValueMS, dateStore, backward, processAsTimer)
                }
            }

            let tickInterval: number
            const deltaToFirstTickTimeoutID = setTimeout(() => {
                tick(firstTickChangeValue, dateStore, backward, processAsTimer)

                if (processAsTimer) {
                    worker.postMessage({ id: workerIntervalId, ms: updateInterval } as WorkerMessageIncome)

                } else {
                    tickInterval = (setInterval as Window['setInterval'])(() => {
                        workerTick({ data: '' })
                    }, updateInterval)
                }
            }, deltaToFirstTick)


            return () => {
                if (processAsTimer) {
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