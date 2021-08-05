import { useRef, useLayoutEffect } from 'react'


function usePrevious(value: any, ref = useRef(), storeKey = '_prevValue') {
    type StoreKey = keyof typeof ref

    useLayoutEffect(() => {
        ref[storeKey as StoreKey] = value
    }, [ value ])

    return ref[storeKey as StoreKey]
}


export default usePrevious