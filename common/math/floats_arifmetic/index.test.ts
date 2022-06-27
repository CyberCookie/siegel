import arifmetic from './'


describe('common/is/exists', () => {
    test('0.1 + 0.2', () => {
        expect(
            arifmetic(2, 0.1, 0.2)
        ).toBe(0.3)
    })

    test('0.4 - 0.1', () => {
        expect(
            arifmetic(2, 0.4, -0.1)
        ).toBe(0.3)
    })
})