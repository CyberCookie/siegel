import { useEffect, useRef } from 'react'

import type { PropsComponentBase } from './types'


function applyRefApi<
    A extends ReactTagAttributes,
    P extends PropsComponentBase
>(rootProps: A, mergedProps: P) {

    const { refApi } = mergedProps

    if (refApi) {
        const { getRef, getOnPropsUpdate } = refApi
        rootProps.ref ||= useRef(null)

        const trackDependencies = getOnPropsUpdate
            ?   getOnPropsUpdate(mergedProps)
            :   undefined

        useEffect(() => {
            getRef((rootProps.ref as React.RefObject<HTMLElement>).current!, mergedProps)
        }, trackDependencies)
    }
}


export default applyRefApi