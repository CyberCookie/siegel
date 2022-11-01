import { useLayoutEffect, useRef } from 'react'


type EffectCB = Parameters<typeof useLayoutEffect>[0]

type ExtendedRef = {
    [key in typeof symbolIsRendered]: undefined | boolean
} & React.MutableRefObject<undefined>


const symbolIsRendered = Symbol('rendered')

/**
 * Works the same way as React.useLayoutEffect do, but doesn't trigger at first render
 *
 * @param fn React.useLayoutEffect's first parameter
 * @param dependencies React.useLayoutEffect's second parameter
 * @param ref Optional reusable ref created with React.useRef
 */
function useDidUpdate(fn: EffectCB, dependencies: React.DependencyList, ref = useRef()) {
    useLayoutEffect(() => {
        let retFn: ReturnType<EffectCB>

        if ((ref as ExtendedRef)[symbolIsRendered]) retFn = fn() as ReturnType<EffectCB>
        else (ref as ExtendedRef)[symbolIsRendered] = true

        return retFn
    }, dependencies)
}


export default useDidUpdate
export { symbolIsRendered }