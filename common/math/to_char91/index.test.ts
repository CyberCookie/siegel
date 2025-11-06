import toChar91 from '.'


describe('common/toChar91', () => {
    test('transform 10', () => {
        expect(
            toChar91(10)
        ).toBe('k')
    })

    test('transform 12321451', () => {
        expect(
            toChar91(12321451)
        ).toBe('pE:Z')
    })
})