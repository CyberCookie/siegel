import { useLayoutEffect, useState } from 'react'


type EffectCB = Parameters<typeof useLayoutEffect>[0]

function useDidUpdate(
    fn: EffectCB,
    dependencies: React.DependencyList
) {
    const state = useState({ rendered: false })[0]
    useLayoutEffect(() => {
        let retFn: ReturnType<EffectCB>
        
        if (state.rendered) retFn = fn() as ReturnType<EffectCB>
        else state.rendered = true;
 
        if (retFn) return retFn
    }, dependencies)
}


export default useDidUpdate