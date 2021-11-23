import React from 'react'

import { ComponentAttributes } from './types'


type WithLabel = (
    input: JSX.Element,
    labelProps: ComponentAttributes<HTMLLabelElement>,
    labelTextProps: ComponentAttributes<HTMLDivElement>
) => JSX.Element

const withLabel: WithLabel = (input, labelProps, labelTextProps) => (
    <label { ...labelProps }>
        <div { ...labelTextProps } />
        { input }
    </label>
)


export default withLabel