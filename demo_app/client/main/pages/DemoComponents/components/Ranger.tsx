import React, { useState } from 'react'
import type { DoubleValue } from 'siegel-ui/_form/Ranger/types'

import { Ranger, RangerProps } from 'app/components'


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
        <h1>{Ranger.ID}</h1>

        <h2>simple</h2>
        <h3>value: {valueSingle.toFixed(2)}</h3>
        <Ranger {...propsSingle} />


        <h2>double slide with label. Cross behavior: stop</h2>
        <h3>
            value from: {valueDouble[0].toFixed(2)}
            <br />
            value to: {valueDouble[1].toFixed(2)}
        </h3>
        <Ranger {...propsDouble} />


        <h2>Cross behavior: move</h2>
        <Ranger {...propsDouble} rangersCrossBehavior='move' />

        <h2>Cross behavior: cross</h2>
        <Ranger {...propsDouble} rangersCrossBehavior='cross' />


        <h2>simple disabled</h2>
        <Ranger {...propsSingle} disabled />
    </>
}
Demo.id = Ranger.ID


export default Demo