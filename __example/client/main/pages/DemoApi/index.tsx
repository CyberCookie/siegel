import React, { useLayoutEffect } from 'react'

import testModule from '../../modules/demo_api'


const DemoApi = () => {
    const [ state, actions ] = testModule()
    
    useLayoutEffect(() => {
        actions.makeSomeFetch({ someBody: 'body' })
    }, [])


    return <h1>data from server: { state.someData.received }</h1>
}


export default DemoApi