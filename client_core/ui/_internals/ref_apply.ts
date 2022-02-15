//TODO?: refApi fn arguments infer proper types

import { useEffect, useRef } from 'react'

import type { ComponentAttributes, PropsComponentBase } from './types'


function applyRefApi<
    A extends ComponentAttributes,
    P extends PropsComponentBase
>(rootProps: A, mergedProps: P) {

    const { getRef, getOnPropsUpdate } = mergedProps.refApi!
    rootProps.ref = useRef(null)

    const trackDependencies = getOnPropsUpdate
        ?   getOnPropsUpdate(mergedProps)
        :   undefined

    useEffect(() => {
        getRef((rootProps.ref as React.MutableRefObject<HTMLElement>).current, mergedProps)
    }, trackDependencies)
}


export default applyRefApi