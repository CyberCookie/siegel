import React, { useState } from 'react'

import { Ranger, RangerProps } from 'app/components'


const { ID } = Ranger

const Demo = () => {
    const [ state, setState ] = useState({
        valueSingle: [ 0.5 ],
        valueDouble: [ 0.2, 0.8 ],
        valueQuarter: [ 0.1, 0.3, 0.5, 0.8 ]
    })
    const { valueSingle, valueDouble, valueQuarter } = state

    const propsSingle: RangerProps = {
        value: valueSingle,
        onChange(value) {
            state.valueSingle = value
            setState({ ...state })
        }
    }

    const propsDouble: RangerProps = {
        value: valueDouble,
        label: 'some label',
        onChange(value) {
            state.valueDouble = value
            setState({ ...state })
        }
    }


    return <>
        <h2 children='simple' />
        <h3 children={ `value: ${valueSingle[0].toFixed(2)}` } />
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


        <h2 children='four points' />
        <h3>
            value from: {valueQuarter[0].toFixed(2)}
            <br />
            value to: {valueQuarter[1].toFixed(2)}
            <br />
            value from: {valueQuarter[2].toFixed(2)}
            <br />
            value to: {valueQuarter[3].toFixed(2)}
        </h3>
        <Ranger value={ valueQuarter } rangersCrossBehavior='cross'
            onChange={ value => {
                state.valueQuarter = value
                setState({ ...state })
            } } />


        <h2 children='simple disabled' />
        <Ranger { ...propsSingle } disabled />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Ranger'


export default Demo