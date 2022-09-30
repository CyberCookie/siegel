import React, { useState } from 'react'

import { Form, FormProps, Input, Checkbox } from 'app/components'

// type X = Parameters<typeof Input>[0]['']
const inputs: FormProps['inputs'] = [
    // [
    //     {
    //         name: 'first',
    //         Component: Input,
    //         props: {

    //             // checkboxAttributes: {}
    //             // autofocus: true
    //             // checkboxAttributes: {}
    //         }
    //     },
    //     {
    //         name: 'second',
    //         Component: Input,
    //         props: {
    //             value: ''
    //         }
    //     }
    // ],
    // [{
    //     name: 'check',
    //     Component: Checkbox,
    //     props: {
    //         disabled: true
    //         // placeholder: '',
    //         // type: 'color',
    //         // inputAttributes: {},
    //         // placeholder: ''
    //     }
    // }]
    {
        name: 'second',
        Component: Input,
        props: {
            value: ''
        }
    },
    {
        name: 'second',
        Component: Input,
        props: {
            value: ''
        }
    },
    {
        name: 'second',
        Component: Checkbox,
        props: {
            value: true
        }
    }
]

const Demo = () => {


    return <>
        <h2 children='simple' />
        <Form inputs={ inputs }
            onSubmit={ () => {console.log('submit')} }/>
    </>
}
Demo.coreSrcDirName = 'Form'


export default Demo