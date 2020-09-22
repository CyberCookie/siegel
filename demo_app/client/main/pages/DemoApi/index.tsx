import React, { useLayoutEffect } from 'react'
// import { RouteComponentProps } from 'react-router-dom'

import testModule from '../../modules/demo_api'


const DemoApi = (/*props: RouteComponentProps*/) => {
    const [ state, actions ] = testModule()
    
    useLayoutEffect(() => {
        actions.makeSomeFetch('some string')
    }, [])


    return <h1>data from server: { state.someData.received }</h1>
}


export default DemoApi