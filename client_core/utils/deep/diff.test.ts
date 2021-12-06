import diff, { SYMBOL__OBJECT_FIELD_REMOVED, SYMBOL__VALUES_EQUAL } from './diff'


describe('deep/diff', () => {
    test('objects are equal', () => {
        expect(
            diff(
                { a: 1, b: { c: 2 } },
                { a: 1, b: { c: 2 } }
            )
        ).toBe(SYMBOL__VALUES_EQUAL)
    })
    test('object change field primitive values', () => {
        expect(
            diff(
                { a: 20, b: 'qaaa' },
                { a: 40, c: 'new_prop' }
            )
        ).toEqual({
            a: 40,
            b: SYMBOL__OBJECT_FIELD_REMOVED,
            c: 'new_prop'
        })
    })
    test('object change field iterable values', () => {
        expect(
            diff(
                {
                    a: [ 1, 2, 3 ],
                    b: {
                        c: 2,
                        d: 'some_str'
                    },
                    c: [ 1, 2, 3 ]
                },
                {
                    a: [ 1, 2, {} ],
                    b: {
                        a: 'some_str',
                        c: 2,
                        d: 'some_str'
                    },
                    c: [ 1, 2, 3 ]
                }
            )
        ).toEqual({
            a: [ SYMBOL__VALUES_EQUAL, SYMBOL__VALUES_EQUAL, {} ],
            b: {
                a: 'some_str'
            }
        })
    })


    test('arrays are equal', () => {
        expect(
            diff(
                [ 1, 2 ,3 ],
                [ 1, 2, 3 ]
            )
        ).toBe(SYMBOL__VALUES_EQUAL)
    })
    test('array change elements', () => {
        expect(
            diff(
                [ 1, 2, 3 ],
                [ 1, 4, 1, 2 ]
            )
        ).toEqual(
            [ SYMBOL__VALUES_EQUAL, 4, 1, 2 ]
        )
    })
    test('array change nested iterables', () => {
        expect(
            diff(
                [{ a: 1 }, { b: 2 }],
                [{ a: 2 }, { b: 2 }]
            )
        ).toEqual([{ a: 2 }, SYMBOL__VALUES_EQUAL])
    })


    test('custom placeholders', () => {
        expect(
            diff(
                {
                    a: 2,
                    b: [ 1 ]
                },
                {
                    b: [ 1, 2 ]
                },
                {
                    valueForEqualArrElement: '__EQUAL__',
                    valueForRemovedObjField: '__REMOVED__'
                }
            )
        ).toEqual({
            a: '__REMOVED__',
            b: [ '__EQUAL__', 2 ]
        })
    })


    test('hande complex types', () => {
        expect(
            diff(
                {
                    a: new Date(0),
                    b: new Date(),
                    c: new Set([ 1, 2, 3 ])
                },
                {
                    a: new Date(1000),
                    b: new Date(),
                    c: new Set([ 1, 2, 3 ])
                },
                {
                    complexTypesIsEqual(a, b) {
                        if (a.constructor === Date) {
                            return (a as Date).valueOf() == b.valueOf()
                        }

                        return false
                    }
                }
            )
        ).toEqual({
            a: new Date(1000),
            c: new Set([ 1, 2, 3 ])
        })
    })
})