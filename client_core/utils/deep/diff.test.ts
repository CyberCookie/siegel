import diff, { SYMBOL__OBJECT_FIELD_REMOVED, SYMBOL__VALUES_EQUAL } from './diff'


describe('utils/deep/diff', () => {
    test('big structure comparing', () => {
        expect(
            diff(
                {
                    will_be_removed: 'some_str',
                    will_be_removed_undef: undefined,
                    will_be_changed: 'some_str',
                    will_be_same: 'same',
                    will_be_undef: null,
                    will_be_null: undefined,
                    will_be_same_undef: undefined,

                    will_be_same_obj: {
                        will_be_same: 'same',
                        will_be_same_obj: {
                            will_be_same: 'same'
                        }
                    },

                    will_be_changeed_obj: {
                        will_be_changed: 'some_str',
                        will_be_same_array: [ 1, {} ]
                    },
                    will_be_same_array: [ [], [], undefined, null ],
                    will_be_changed_array: [
                        1, { will_be_changed: 12 }, [], null, undefined
                    ]
                },
                {
                    will_be_changed: 'changed',
                    will_be_same: 'same',
                    will_be_undef: undefined,
                    will_be_null: null,
                    will_be_same_undef: undefined,
                    will_be_same_obj: {
                        will_be_same: 'same',
                        will_be_same_obj: {
                            will_be_same: 'same'
                        }
                    },
                    will_be_changeed_obj: {
                        will_be_changed: 'changed',
                        will_be_same_array: [ 1, {} ]
                    },
                    will_be_same_array: [ [], [], undefined, null ],
                    will_be_changed_array: [
                        1, { will_be_changed: 120 }, [], undefined, false, null, []
                    ],
                    will_be_added: [{}]
                }
            )
        ).toEqual({
            will_be_removed: SYMBOL__OBJECT_FIELD_REMOVED,
            will_be_removed_undef: SYMBOL__OBJECT_FIELD_REMOVED,
            will_be_changed: 'changed',
            will_be_undef: undefined,
            will_be_null: null,
            will_be_changeed_obj: {
                will_be_changed: 'changed'
            },
            will_be_changed_array: [
                SYMBOL__VALUES_EQUAL, { will_be_changed: 120 }, SYMBOL__VALUES_EQUAL, undefined, false, null, []
            ],
            will_be_added:[{}]
        })
    })

    test('objects equals', () => {
        expect(
            diff(
                { a: 1, b: null },
                { a: 1, b: null }
            )
        ).toBe(SYMBOL__VALUES_EQUAL)
    })

    test('arrays equals', () => {
        expect(
            diff(
                [ 1, 2, undefined, null ],
                [ 1, 2, undefined, null ]
            )
        ).toBe(SYMBOL__VALUES_EQUAL)
    })
    test('arrays changed elements', () => {
        expect(
            diff(
                [ 1, 2, false ],
                [ 1, 4, false, {} ]
            )
        ).toEqual(
            [ SYMBOL__VALUES_EQUAL, 4, SYMBOL__VALUES_EQUAL, {} ]
        )
    })
    test('array change nested iterables', () => {
        expect(
            diff(
                [{ a: 1 }, { b: 0 }],
                [{ a: 2 }, { b: 0 }]
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
        const thisDate = new Date()
        const afterOneSecDate = new Date(1000)

        expect(
            diff(
                {
                    a: new Date(0),
                    b: thisDate,
                    c: new Set([ 1, 2, 3 ])
                },
                {
                    a: afterOneSecDate,
                    b: thisDate,
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
            a: afterOneSecDate,
            c: new Set([ 1, 2, 3 ])
        })
    })
})