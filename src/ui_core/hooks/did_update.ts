import { useLayoutEffect, useRef } from 'react'


function useDidUpdate(
    fn: () => void,
    dependencies: React.DependencyList,
    retFn: () => void
) {
    const didMountRef = useRef(true)
  
    useLayoutEffect(() => {
        didMountRef.current ? fn() : (didMountRef.current = true)
        if (retFn) return () => retFn()
    }, dependencies)
}


export default useDidUpdate