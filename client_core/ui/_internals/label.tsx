import React from 'react'


type WithLabel = (
    input: JSX.Element,
    labelProps: ReactTagAttributes<HTMLLabelElement>,
    labelTextProps: ReactTagAttributes<HTMLDivElement>
) => JSX.Element


const withLabel: WithLabel = (input, labelProps, labelTextProps) => (
    <label { ...labelProps }>
        <div { ...labelTextProps } />
        { input }
    </label>
)


export default withLabel