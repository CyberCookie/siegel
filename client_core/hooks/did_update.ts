import { useLayoutEffect, useState } from 'react'


function useDidUpdate(
    fn: () => void,
    dependencies: React.DependencyList,
    retFn: () => void
) {
    const state = useState({ rendered: false })[0]
    useLayoutEffect(() => {
        state.rendered
            ?   fn()
            :   (state.rendered = true)
 
        if (retFn) return () => retFn()
    }, dependencies)
}


export default useDidUpdate