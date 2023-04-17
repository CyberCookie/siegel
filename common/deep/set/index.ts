import type { DeepGet } from '../get'


type DeepSet<
    _Obj extends Obj,
    _Path extends PathsOf<_Obj>,
    _Value extends DeepGet<_Obj, _Path>,
    _FirstKey extends keyof Required<_Obj> = _Path[0]
> = _FirstKey extends keyof Required<_Obj>
    ?   {
            [key in _FirstKey]: DeepSet<
                Required<_Obj>[_FirstKey],
                // @ts-expect-error
                Tail<_Path>,
                _Value
            >
        } & Omit<Obj, _FirstKey>
    :   _Obj


/**
 * To set property deeply into an object
 *
 * @param iterable Object to set value to
 * @param path Path to to set value by
 * @param value Value to set by provided path
 */
function deepSet<
    _Obj extends Obj,
    _Full extends PathsOf<_Obj>,
    _Value extends DeepGet<_Obj, _Full>,
    // @ts-expect-error
    _Result = DeepSet<_Obj, _Full, _Value>
>
(iterable: _Obj, path: _Full, value: _Value): _Result {

    let link = iterable
    for (let i = 0, l = path.length; i < l; i++) {
        const pathPart = path[i] as keyof _Obj

        if (i == l - 1) link[pathPart] = value as _Obj[keyof _Obj]
        else {
            link[pathPart] ||= {} as _Obj[keyof _Obj]
            link = link[pathPart]
        }
    }


    return iterable as unknown as _Result
}


export default deepSet