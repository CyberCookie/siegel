import { useRef } from 'react'

import resolveTagAttributes from '../../_internals/resolve_tag_attributes'
import applyRefApi from '../../_internals/ref_apply'

import type { MergedProps } from '../types'


function getRootProps(mergedProps: MergedProps) {
    const { className, rootTagAttributes } = mergedProps
    let result = {
        className,
        ref: useRef(null)
    }
    applyRefApi(result, mergedProps)
    result = resolveTagAttributes(result, rootTagAttributes)


    return result
}


export default getRootProps