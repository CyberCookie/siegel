import React from 'react'


type WithLabel = (
    input: React.JSX.Element,
    labelProps: ReactTagAttributes<HTMLLabelElement>,
    labelTextProps: ReactTagAttributes<HTMLDivElement>
) => React.JSX.Element


const withLabel: WithLabel = (input, labelProps, labelTextProps) => (
    <label { ...labelProps }>
        <div { ...labelTextProps } />
        { input }
    </label>
)


export default withLabel