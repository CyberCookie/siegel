import '../../../global.d'
import deepMerge, { resolveAsUndefSymbol } from './'


describe('common/deep/merge', () => {
    test('simple', () => {
        expect(
            deepMerge(
                {
                    a: 20,
                    b: 'qwerty',
                    c: {
                        ca: 30
                    }
                },
                {
                    b: 'some_str',
                    d: 30,
                    c: {
                        cb: 40
                    },
                    e: {
                        ea: 40
                    }
                }
            )
        ).toEqual({
            a: 20,
            b: 'some_str',
            c: {
                ca: 30,
                cb: 40
            },
            d: 30,
            e: {
                ea: 40
            }
        })
    })

    test('with weird objects', () => {
        expect(
            deepMerge(
                {
                    c: {
                        ca: [ 1, 2, { a: 1 }]
                    }
                },
                {
                    c: {
                        ca: [ 2, [], { b: 1 }],
                        cb: new Set([ 1, 2 ])
                    }
                }
            )
        ).toEqual({
            c: {
                ca: [ 2, [], { b: 1 }],
                cb: new Set([ 1, 2 ])
            }
        })
    })

    test('with resolveObject', () => {
        expect(
            deepMerge(
                {
                    a: {
                        __aa: 'some_string-__aa',
                        b: 20
                    },
                    b: {
                        $$qwerty: 'some_string-$$qwerty',
                        c: 60
                    },
                    c: {
                        d: [ 1, 2, 3 ]
                    }
                },
                {
                    a: {
                        __aa: 'another_string',
                        b: 20
                    },
                    b: {
                        $$qwerty: 'another_string',
                        c: 60
                    },
                    c: {
                        ca: false
                    }
                },
                {
                    resolveObject: (obj_a, obj_b) => (
                        obj_a.__aa && obj_b.__aa
                            ?   obj_b
                            :   obj_a.$$qwerty && obj_b.$$qwerty
                                ?   resolveAsUndefSymbol
                                :   undefined
                    )
                }
            )
        ).toEqual({
            a: {
                __aa: 'another_string',
                b: 20
            },
            b: undefined,
            c: {
                d: [ 1, 2, 3 ],
                ca: false
            }
        })
    })

    test('with mergeResolve', () => {
        const date_a = new Date()

        const date_b = new Date()
        date_b.setSeconds( date_b.getSeconds() + 1 )

        expect(
            deepMerge(
                {
                    a: new Set([ 1, 2 ]),
                    b: date_a,
                    c: {
                        ca: [ 1, 2, { a: 1 }]
                    }
                },
                {
                    a: new Set([ 3, 4 ]),
                    b: date_b,
                    c: {
                        ca: [ 2, [], { b: 1 }]
                    }
                },
                {
                    mergeResolve(a, b) {
                        if (a.constructor == Set && b.constructor == Set) {
                            return new Set(Array.from(a).concat(Array.from(b)))

                        } else if (a.constructor == Array && b.constructor == Array) {
                            return (a as any[]).concat(b)

                        } else if (a.constructor == Date && b.constructor == Date) {
                            return (a as Date).valueOf() > (b as Date).valueOf() ? a : b
                        }
                    }
                }
            )
        ).toEqual({
            a: new Set([ 1, 2, 3, 4 ]),
            b: date_b,
            c: {
                ca: [ 1, 2, { a: 1 }, 2, [], { b: 1 }]
            }
        })
    })
})