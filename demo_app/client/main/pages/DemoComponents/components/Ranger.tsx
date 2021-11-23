import React, { useState } from 'react'
import type { DoubleValue } from 'siegel-ui/Ranger'

import { Ranger, RangerProps } from 'app/components'


const { ID } = Ranger

const Demo = () => {
    const [ state, setState ] = useState({
        valueSingle: 0.5,
        valueDouble: [ 0.2, 0.8 ] as DoubleValue
    })
    const { valueSingle, valueDouble } = state

    const propsSingle: RangerProps = {
        value: valueSingle,
        onChange(value: number) {
            state.valueSingle = value
            setState({ ...state })
        }
    }

    const propsDouble: RangerProps = {
        value: valueDouble,
        label: 'some label',
        onChange(value: DoubleValue) {
            state.valueDouble = value
            setState({ ...state })
        }
    }


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <h3 children={ `value: ${valueSingle.toFixed(2)}` } />
        <Ranger { ...propsSingle } />


        <h2 children='double slide with label. Cross behavior: stop' />
        <h3>
            value from: {valueDouble[0].toFixed(2)}
            <br />
            value to: {valueDouble[1].toFixed(2)}
        </h3>
        <Ranger { ...propsDouble } />


        <h2 children='Cross behavior: move' />
        <Ranger { ...propsDouble } rangersCrossBehavior='move' />

        <h2 children='Cross behavior: cross' />
        <Ranger { ...propsDouble } rangersCrossBehavior='cross' />

        <h2 children='simple disabled' />
        <Ranger { ...propsSingle } disabled />
    </>
}
Demo.id = ID


export default Demo