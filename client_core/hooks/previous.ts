import { useRef, useLayoutEffect } from 'react'


function usePrevious(value: any) {
    const ref = useRef()

    useLayoutEffect(() => {
        ref.current = value
    })

    return ref.current
}


export default usePrevious