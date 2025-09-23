import React, { useState } from 'react'

import { Select, SelectProps, icons } from 'app/components'


type DemoSelectState = number | undefined
type DemoSelectStore = ReactStore<DemoSelectState>

type DemoSelectProps = SelectProps<DemoSelectState>


const getSelectDisplayValue = ({ title }: DemoSelectProps['options'][number]) => 'selected - ' + title

const Demo = () => {
    const [ multiselectOptionsState, setSelectedOptions ] = useState({
        selectedOptions: new Set<number>()
    })
    const { selectedOptions } = multiselectOptionsState

    const [ selectedOption, setSelectedOption ] = useState() as DemoSelectStore

    const singleOptionSelectProps: DemoSelectProps = {
        placeholder: 'placeholder',
        selected: selectedOption,
        options: [
            { value: 1, title: 'option 1' },
            { value: 2, title: 'option option 2', disabled: true },
            { value: 3, title: 'option 3' },
            { value: 4, title: 'option 4' },
            { value: 5, title: 'disabled option 5', disabled: true }
        ],
        onChange(value) {
            setSelectedOption(value)
        }
    }


    return <>
        <h2 children='simple' />
        <Select { ...singleOptionSelectProps } />

        <h2 children='with label and displayTitle processing' />
        <Select { ...singleOptionSelectProps } label='some label' getDisplayValue={ getSelectDisplayValue } />

        <h2 children='filter selected: false; with reset' />
        <Select { ...singleOptionSelectProps } listSelectedOption={ false } resetIcon={ icons.close } />

        <h2 children='multiselect' />
        <Select { ...singleOptionSelectProps } multiselect listSelectedOption
            selected={ selectedOptions }
            onChange={ (selectedOptions: Set<number>) => {
                multiselectOptionsState.selectedOptions = selectedOptions
                setSelectedOptions({ ...multiselectOptionsState })
            } } />

        <h2 children='disabled' />
        <Select { ...singleOptionSelectProps } disabled />
    </>
}
Demo.coreSrcDirName = 'Select'


export default Demo