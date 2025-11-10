import { useLayoutEffect, useRef } from 'react'


type EffectCB = Parameters<typeof useLayoutEffect>[0]

type ExtendedRef = {
    [key in ((typeof symbolIsRendered) | typeof symbolIsCalled)]: undefined | boolean
} & React.RefObject<null>


const symbolIsRendered = Symbol('rendered')
const symbolIsCalled = Symbol('called')

/**
 * Works the same way as React.useLayoutEffect do, but doesn't trigger at first render
 *
 * @param cb - React.useLayoutEffect's first parameter (callback)
 * @param dependencies - React.useLayoutEffect's second parameter (dependencies)
 * @param onlyOnce - shouuld trigger callback function only once
 * @param ref - Optional reusable ref created with React.useRef
 */
function useDidUpdate(
    cb: EffectCB,
    dependencies: React.DependencyList,
    onlyOnce?: boolean,
    ref = useRef(null)
) {

    useLayoutEffect(() => {
        let retFn!: ReturnType<EffectCB>

        if ((ref as ExtendedRef)[symbolIsRendered]) {
            if (!onlyOnce || !(ref as ExtendedRef)[symbolIsCalled]) {
                retFn = cb() as ReturnType<EffectCB>
                (ref as ExtendedRef)[symbolIsCalled] = true
            }

        } else (ref as ExtendedRef)[symbolIsRendered] = true

        return retFn
    }, dependencies)
}


export default useDidUpdate
export { symbolIsRendered, symbolIsCalled }