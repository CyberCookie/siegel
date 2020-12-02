import { useLayoutEffect, useRef } from 'react'


function useDidUpdate(
    fn: () => void,
    dependencies: React.DependencyList,
    retFn: () => void,
    ref: React.MutableRefObject<boolean> = useRef(true)
) {
    useLayoutEffect(() => {
        ref.current ? fn() : (ref.current = true)
        if (retFn) return () => retFn()
    }, dependencies)
}


export default useDidUpdate