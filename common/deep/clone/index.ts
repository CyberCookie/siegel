import isPrimitive from '../../is/primitive'

import type { Options } from './types'


function deepClone<T>(value: T, opts: Options = {}): T {
    if (isPrimitive(value as unknown as object)) return value

    let result: Indexable

    if (Array.isArray(value)) {
        result = []
        for (let i = 0, l = value.length; i < l; i++) {
            result[i] = deepClone(value[i])
        }

    } else if ((value as Record<string, unknown>).constructor === Object) {
        result = {}
        for (const i in value) {
            result[i] = deepClone(value[i])
        }

    } else if ((value as unknown as Function).constructor === Function) {
        result = opts.funcClone?.(value as unknown as Function) || value as Function

    } else result = new (value as any).constructor(value)


    return result as T
}


export default deepClone
export type { Options }