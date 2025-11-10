import { useRef, useLayoutEffect } from 'react'


type ExtendedRef = {
    [key in typeof symbolPrevValue]: any
} & React.RefObject<null>


const symbolPrevValue = Symbol('prev_value')

/**
 * Memoize given value to retrieve it at the next component render
 *
 * @param value - Value to retrieve at the next render
 * @param ref - Optional reusable ref created with React.useRef
 * @returns previous value or undefined if it's first render
 */
function usePrevious(value: any, ref = useRef(null)) {
    useLayoutEffect(() => {
        (ref as ExtendedRef)[symbolPrevValue] = value
    }, [ value ])

    return (ref as ExtendedRef)[symbolPrevValue]
}


export default usePrevious
export { symbolPrevValue }