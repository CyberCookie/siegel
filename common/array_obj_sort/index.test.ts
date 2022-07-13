import objectsSortFn from './'


describe('common/array_obj_sort_fn', () => {
    const obj_a = {
        a: 1,
        b: 2
    }

    const obj_b = {
        a: 1,
        b: 3
    }

    const obj_c = {
        a: 3,
        b: 2
    }


    test('equal first keys', () => {
        expect(
            objectsSortFn(
                'a', 'b', 1,
                obj_a,
                obj_b
            )
        ).toBe(-1)
    })

    test('prevent', () => {
        expect(
            objectsSortFn(
                'a', 'b', 1,
                obj_b,
                obj_c
            )
        ).toBe(-1)
    })
})