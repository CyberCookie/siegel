// import type { DeepGet } from '../get'


// type DeepSet<
//     _Obj extends Obj,
//     _Path extends PathsOf<_Obj>,
//     _Value extends DeepGet<_Obj, _Path>,
//     _FirstKey extends keyof Required<_Obj> = _Path[0]
// > = _FirstKey extends keyof Required<_Obj>
//     ?   {
//             [key in _FirstKey]: DeepSet<
//                 Required<_Obj>[_FirstKey],
//                 // @ts-expect-error
//                 Tail<_Path>,
//                 _Value
//             >
//         } & Omit<Obj, _FirstKey>
//     :   _Obj


/**
 * To set property deeply into an object
 *
 * @param iterable Object to set value to
 * @param path Path to to set value by
 * @param value Value to set by provided path
 */
function deepSet<_Obj extends Obj>
(iterable: _Obj, path: string[], value: any): _Obj {

    let link = iterable
    for (let i = 0, l = path.length; i < l; i++) {
        const pathPart = path[i] as keyof _Obj

        if (i == l - 1) link[pathPart] = value
        else {
            link[pathPart] ||= {} as _Obj[keyof _Obj]
            link = link[pathPart]
        }
    }


    return iterable
}

// function deepSet<
//     _Obj extends Obj,
//     _Full extends PathsOf<_Obj>,
//     _Value extends DeepGet<_Obj, _Full>,
//     // @ts-expect-error
//     _Result = DeepSet<_Obj, _Full, _Value>
// >
// (iterable: _Obj, path: _Full, value: _Value): _Result {

//     let link = iterable
//     for (let i = 0, l = path.length; i < l; i++) {
//         const pathPart = path[i] as keyof _Obj

//         if (i == l - 1) link[pathPart] = value as _Obj[keyof _Obj]
//         else {
//             link[pathPart] ||= {} as _Obj[keyof _Obj]
//             link = link[pathPart]
//         }
//     }


//     return iterable as unknown as _Result
// }



export default deepSet


// type Prov = 1 | 2
// type Spor = 1 | 2 | 3

// type X = Partial<{
//     [k in Prov]: number
// }>

// const x: X = {
//     '1': 20
// }
// const prov = 1 as Prov
// const spor = 1 as Spor


// function xx(p: Prov, s: Spor) {
//     const y = deepSet(x, [ 'asdas' ], 20)

// }

// type XX = PathsOf<X>


// type _PathsOf<T, R = Required<T>> = Values<{
//     [P in keyof R]: R[P] extends Obj
//         ?   [P] | [P, ...PathsOf<R[P]>]
//         :   {
//                 k: [P]
//                 r: R[P]
//                 if: R[P] extends Obj ? true : false
//                 iff: Exclude<R[P], null | undefined> extends Obj ? true : false
//             }
    // [P in keyof R]: R[P] extends Obj
    //     ?   [P] | [P, ...PathsOf<R[P]>]
    //     :   [P]
// }>

// type X = {
//     a?: {
//         b?: {
//         //     c: number
//         } | null
//     } | null
// }
// type Z = _PathsOf<X>
// const y: _PathsOf<X> = [ 'a', 'b' ]

// type Y = null | Record<string, any> | undefined
// type YY = Exclude<Y, null | undefined>