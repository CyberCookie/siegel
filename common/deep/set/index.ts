import isExists from '../../is/exists'


type Key = string | number


/**
 * To set property deeply into an object
 *
 * @param iterable Object to set value to
 * @param path Path to to set value by
 * @param value Value to set by provided path
 */
function deepSet<
    O extends Obj,
    K extends PathsOf<O>
>(
    iterable: O,
    path: K,
    value: any
): void {

    let link = iterable
    const pathSequence = path

    for (let i = 0, l = pathSequence.length; i < l; i++) {
        const pathPart = pathSequence[i] as keyof typeof link

        if (i == l - 1) link[pathPart] = value
        else {
            link[pathPart] ||= {} as O[keyof O]
            link = link[pathPart]
        }
    }
}


// type XX = {
//     a?: {
//         a?: {
//             b: {
//                 c?: number
//             }
//         }
//     }
// }
// const x: XX = {
//     a: {
//         a: {
//             b: {}
//         }
//     }
// }
// const y: PathsOf<XX> = ['a', 'a', 'b']


// type TypeFromPath<
//     T extends Obj,
//     Path extends string, // Or, if you prefer, NestedPaths<T>
//     > = {
//     [K in Path]: K extends keyof T
//     ? T[K]
//     : K extends `${infer P}.${infer S}`
//         ? T[P] extends Obj
//         ? TypeFromPath<T[P], S>
//         : never
//         : never;
//     }[Path];

type ElementType <T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
    infer ElementType
>
    ?   ElementType
    :   never

// type LastArrayElement<ValueType extends readonly unknown[]> =
// 	ValueType extends readonly [infer ElementType]
// 		? ElementType
// 		: ValueType extends readonly [infer _, ...infer Tail]
// 			? LastArrayElement<Tail>
// 			: ValueType extends ReadonlyArray<infer ElementType>
// 				? ElementType
// 				: never;

type RemoveIndex<T> = {
    [ K in keyof T as string extends K ? never : number extends K ? never : K ] : T[K]
};

// type KnownKeys<T> = {
//     [K in keyof T]: string extends K ? never : number extends K ? never : K
// } extends { [_ in keyof T]: infer U } ? U : never;

type Get<
    _Obj extends Obj,
    _Keys extends PathsOf<_Obj>
> = {
    [T in ElementType<_Keys> as keyof Required<_Obj>]: T extends keyof Required<_Obj>
        ?   Get<
                _Obj[T],
                PathsOf<_Obj[T]>
            >
        :   never
    }


type ZZ = {
    a: {
        b: {
            c: number
        },
        // a?: number
    }
}

type Z = Get<ZZ, ['a', 'b']>['a']['b']
type EE = PathsOf<ZZ>
type EEE = ElementType<EE>

// type PP = Extract<keyof EE, number>
type O = Exclude<
    Values<
        Omit<
            RemoveIndex<{[K in keyof EE]: EE[K]}>,
            keyof any[]
        >
    >,
    undefined | never
>
// const z: Z = {
//     a: {
//         b: {}
//     }
// }
// type X = PathsOf<typeof x>
deepSet({a: {b: 30}}, ['a', 'a'], {})

export default deepSet