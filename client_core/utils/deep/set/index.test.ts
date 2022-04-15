import deepSet from './'


describe('utils/deep/set', () => {
    test('set', () => {
        const obj = {
            a: {
                b: [
                    {},
                    {
                        a: [{ val: 'val' }]
                    }
                ]
            }
        }
        deepSet(obj, [ 'a', 'b', '1', 'a', '0', 'val' ], 'new_value')

        expect(obj).toEqual({
            a: {
                b: [
                    {},
                    {
                        a: [{ val: 'new_value' }]
                    }
                ]
            }
        })
    })

    test('set new in obj', () => {
        const obj = {
            a: {}
        }
        deepSet(obj, [ 'a', 'b', 1 ], null)

        expect(obj).toEqual({
            a: {
                b: [ undefined, null ]
            }
        })
    })

    test('set new in array', () => {
        const arr: any[] = []
        deepSet(arr, [ 1, 0, 1 ], 'new_value')

        expect(arr).toEqual([
            undefined, [[ undefined, 'new_value' ]]
        ])
    })
})