import isPrimitive from '../../is/primitive'

import type { Options } from './types'


/**
 * Clones any object
 *
 * @param value - Value to clone
 * @param opts - Clone params
 * @returns clonned object
 */
function deepClone<T>(value: T, opts: Options = {}): T {
    if (isPrimitive(value as unknown as object)) return value

    if (Array.isArray(value)) {
        const l = value.length
        const result = new Array(l)
        for (let i = 0; i < l; i++) {
            result[i] = deepClone(value[i])
        }

        return result as T

    }

    const proto = Object.getPrototypeOf(value)
    if (proto === null || proto === Object.prototype) {
        const result = Object.create(proto)
        Object.keys(value as object).forEach(key => {
            result[key] = deepClone(value[key as keyof typeof value], opts)
        })

        return result
    }

    if (value instanceof Date) {
        return new Date(value.getTime()) as T
    }

    if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags) as T
    }

    if (value instanceof Set) {
        const result = new Set()
        value.forEach(val => (
            result.add(
                deepClone(val, opts)
            )
        ))

        return result as T
    }

    if (value instanceof Map) {
        const result = new Map()
        value.forEach((val, key) => (
            result.set(
                key,
                deepClone(val, opts)
            )
        ))

        return result as T
    }

    if (value instanceof Function) {
        return (opts.funcClone?.(value as unknown as AnyFunc) || value as AnyFunc) as T
    }


    return new (value as any).constructor(value)
}


export default deepClone
export type { Options }