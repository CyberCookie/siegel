import isNullable from '../../is/nullable'


// type DeepGet<
//     _Obj extends Obj,
//     _Path extends PathsOf<_Obj>,
//     _ThisPathEl extends _Obj[_Path[0]] = _Obj[_Path[0]],
//     _ThisPathElNoUndef extends _ThisPathEl = Exclude<_ThisPathEl, undefined>,
//     _RestPath = Tail<_Path>
// > =  _RestPath extends PathsOf<_ThisPathElNoUndef>
//     ?   undefined extends _ThisPathEl
//         ?   undefined | DeepGet<_ThisPathElNoUndef, _RestPath>
//         :   DeepGet<_ThisPathEl, _RestPath>
//     :   _ThisPathEl


/**
 * To retrieve deeply nested value
 *
 * @param obj to get value from
 * @param path Path to desired value within object
 * @param defaultVal Value to return if no value by with provided path
 * @returns Seek value
 */
function deepGet(obj: Obj, path: string[], defaultVal?: any): any {
    const deepLink = obj[path[0]]

    return path.length
        ?   isNullable(deepLink)
            ?   defaultVal
            :   deepGet(deepLink, path.slice(1), defaultVal )
        :   obj
}
// function deepGet<
//     _Obj extends Obj,
//     _Keys extends PathsOf<_Obj>,
//     _Default = undefined,
//     _Result = DeepGet<_Obj, _Keys>
// >(
//     obj: _Obj,
//     path: _Keys,
//     defaultVal?: _Default
// ): IsNullable<_Result> extends true
//     ?   Exclude<_Result, null | undefined> | _Default
//     :   _Result
// {

//     const deepLink = obj[path[0]]

//     return path.length
//         ?   isNullable(deepLink)
//             ?   defaultVal
//             :   deepGet(
//                     deepLink,
//                     path.slice(1) as PathsOf<typeof deepLink>,
//                     defaultVal
//                 ) as _Result
//         :   obj as any
// }


export default deepGet
// export type { DeepGet }