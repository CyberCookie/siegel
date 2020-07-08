import React from 'react'

import { ComponentAttributes } from '../ui_utils'


type WithLabel = (
    input: JSX.Element,
    labelProps: ComponentAttributes<HTMLLabelElement>,
    labelTextProps: ComponentAttributes
) => JSX.Element

const withLabel: WithLabel = (input, labelProps, labelTextProps) => (
    <label { ...labelProps }>
        <div { ...labelTextProps } />
        
        { input }
    </label>
)


export default withLabel