import rangeEach from './'


describe('common/parse_jwt', () => {
    const someArr = new Array(20)


    test('range', () => {
        let counter = 0
        rangeEach(someArr, 0, 5, () => { counter++ })

        expect(counter).toBe(5)
    })

    test('prevent', () => {
        let counter = 0
        rangeEach(someArr, 0, someArr.length, (_, index) => {
            counter++
            return index == 10
        })

        expect(counter).toBe(11)
    })
})