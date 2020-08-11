import React, { useLayoutEffect } from 'react'

import testModule from '../../modules/test'


const X = () => {
    const [ state, { makeSomeFetch }] = testModule()

    useLayoutEffect(() => { makeSomeFetch({ someBody: 'body' }) }, [])


    return <h1>data from server: { state.someData.received }</h1>
}


export default X