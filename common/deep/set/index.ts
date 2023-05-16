//TODO typing: tyre return value to reflect updated one


import type { DeepGet } from '../get'


// type DeepSet<
//     _Obj extends Obj,
//     _Path extends PathsOf<_Obj>,
//     _Value extends DeepGet<_Obj, _Path>,
//     _FirstKey extends keyof Required<_Obj> = _Path[0]
// > = _FirstKey extends never
//     ?   _Obj
//     :   {
//             [key in _FirstKey]: DeepSet<
//                 Required<_Obj>[_FirstKey],
//                 Tail<_Path>,
//                 _Value
//             >
//         } & Omit<Obj, _FirstKey>


/**
 * To set property deeply into an object
 *
 * @param iterable Object to set value to
 * @param path Path to to set value by
 * @param value Value to set by provided path
 */
// function deepSet<_Obj extends Obj>
// (iterable: _Obj, path: string[], value: any): _Obj {

//     let link = iterable
//     for (let i = 0, l = path.length; i < l; i++) {
//         const pathPart = path[i] as keyof _Obj

//         if (i == l - 1) link[pathPart] = value
//         else {
//             link[pathPart] ||= {} as _Obj[keyof _Obj]
//             link = link[pathPart]
//         }
//     }


//     return iterable
// }
function deepSet<
    _Obj extends Obj,
    _Full extends PathsOf<_Obj>,
    // _Value extends DeepGet<_Obj, _Full>,
    //// @ts-expect-error
    // _Result = DeepSet<_Obj, _Full, _Value>
>
(iterable: _Obj, path: _Full, value: DeepGet<_Obj, _Full>): _Obj {

    let link = iterable
    for (let i = 0, l = path.length; i < l; i++) {
        const pathPart = path[i] as keyof _Obj
        // @ts-expect-error
        if (i == l - 1) link[pathPart] = value as  _Obj[keyof _Obj]
        else {
            link[pathPart] ||= {} as _Obj[keyof _Obj]
            link = link[pathPart]
        }
    }


    return iterable// as DeepSet<_Obj, _Full, DeepGet<_Obj, _Full>>
}
// const xxx = 20 as number

// type Prov = 1 | 2 | 3
// type Spor = 1 | 2 | 3

// type X = Partial<{
//     [p in Prov]: Partial<{
//         [s in Spor]: number
//     }>
// }>

// const xx: X = {
//     1: {
//         1: 20
//     }
// }

// function y(param: Prov, deep: Spor) {
//     const x = deepSet(xx, [ param, deep ], 20)
// }


export default deepSet