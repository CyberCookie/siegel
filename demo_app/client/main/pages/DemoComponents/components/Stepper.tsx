import React, { useState } from 'react'

import { Stepper } from 'app/components'


type State = {
    selectedOnePoint: string[]
    selectedTwoPoints: string[]
    selectFourPoints: string[]
}


const { ID } = Stepper

const stepIDsMap = {
    first: 'first',
    second: 'second',
    third: 'third',
    fourth: 'fourth',
    fifth: 'fifth'
} as const

const Demo = () => {
    const [ state, setState ] = useState<State>({
        selectedOnePoint: [ stepIDsMap.second ],
        selectedTwoPoints: [ stepIDsMap.first, stepIDsMap.third ],
        selectFourPoints: [ stepIDsMap.first, stepIDsMap.second, stepIDsMap.third, stepIDsMap.fourth ]
    })
    const { selectedOnePoint, selectedTwoPoints, selectFourPoints } = state


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <Stepper value={ selectedOnePoint }
            options={ [
                { value: stepIDsMap.first, label: 'First' },
                { value: stepIDsMap.second, label: 'Second' },
                { value: stepIDsMap.third, label: 'Third' }
            ] }
            onChange={ values => {
                const [ selected ] = values
                state.selectedOnePoint = [ selected.value ]
                setState({ ...state })
            } } />

        <h2 children='3 anchors' />
        <Stepper value={ selectedTwoPoints }
            options={ [
                { value: stepIDsMap.first, label: 'First' },
                { value: stepIDsMap.second, label: 'Second' },
                { value: stepIDsMap.third, label: 'Third' }
            ] }
            onChange={ values => {
                const [ from, to ] = values
                state.selectedTwoPoints = [ from.value, to.value ]
                setState({ ...state })
            } } />

        <h2 children='5 anchors, 4 values' />
        <Stepper value={ selectFourPoints }
            options={ [
                { value: stepIDsMap.first, label: 'First' },
                { value: stepIDsMap.second, label: 'Second' },
                { value: stepIDsMap.third, label: 'Third' },
                { value: stepIDsMap.fourth, label: 'Fourth' },
                { value: stepIDsMap.fifth, label: 'Fifth' }
            ] }
            onChange={ values => {
                const [ from_1, to_1, from_2, to_2 ] = values
                state.selectFourPoints = [ from_1.value, to_1.value, from_2.value, to_2.value ]
                setState({ ...state })
            } } />
    </>
}
Demo.id = ID


export default Demo