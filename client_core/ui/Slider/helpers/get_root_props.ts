import { useRef } from 'react'

import applyRefApi from '../../_internals/ref_apply'
import mergeTagAttributes from '../../_internals/merge_tag_attributes'

import type { MergedProps } from '../types'


function getRootProps(mergedProps: MergedProps) {
    const { className, rootTagAttributes, refApi } = mergedProps
    let result = {
        className,
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>)
    }
    refApi && (applyRefApi(result, mergedProps))
    rootTagAttributes && (result = mergeTagAttributes(result, rootTagAttributes))


    return result
}


export default getRootProps