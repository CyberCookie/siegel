import mod from './'


describe('common/math/floats_mod', () => {
    test('1.2 % 0.2', () => {
        expect(
            mod(1.2, 0.2, 2)
        ).toBe(0)
    })

    test('2.4 % 0.5', () => {
        expect(
            mod(2.4, 0.5, 2)
        ).toBe(0.4)
    })
})