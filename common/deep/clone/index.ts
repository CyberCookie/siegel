import isPrimitive from '../../is/primitive'

import type { Options } from './types'


/**
 * Clones any object
 *
 * @param value Value to clone
 * @param opts Clone params
 * @returns clonned object
 */
function deepClone<T>(value: T, opts: Options = {}): T {
    if (isPrimitive(value as unknown as object)) return value

    let result: Obj

    if (Array.isArray(value)) {
        result = []
        for (let i = 0, l = value.length; i < l; i++) {
            result[i] = deepClone(value[i])
        }

    } else if ((value as Record<string, unknown>).constructor == Object) {
        result = {}
        for (const i in value) {
            result[i] = deepClone(value[i])
        }

    } else if ((value as unknown as AnyFunc).constructor == Function) {
        result = opts.funcClone?.(value as unknown as AnyFunc) || value as AnyFunc

    } else result = new (value as any).constructor(value)


    return result as T
}


export default deepClone
export type { Options }