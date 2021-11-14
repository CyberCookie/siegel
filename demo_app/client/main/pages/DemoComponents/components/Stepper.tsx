import React, { useState } from 'react'

import { Stepper, StepperProps } from 'app/components'


type State = {
    selectedFrom: string
    selectedTo: string | undefined
}


const { ID } = Stepper

const stepIDsMap = {
    first: 'first',
    second: 'second',
    third: 'third'
}

const Demo = () => {
    const [ state, setState ] = useState({
        selectedFrom: stepIDsMap.first,
        selectedTo: stepIDsMap.second
    } as State)
    const { selectedFrom, selectedTo } = state


    const props: StepperProps = {
        selectedFrom, selectedTo,
        options: [
            { value: stepIDsMap.first, label: 'First' },
            { value: stepIDsMap.second, label: 'Second' },
            { value: stepIDsMap.third, label: 'Third' }
        ],
        onChange(selectedFrom, selectedTo) {
            setState({ selectedFrom, selectedTo })
        }
    }


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <Stepper { ...props } />
    </>
}
Demo.id = ID


export default Demo