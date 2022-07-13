import parseJWT from './'


describe('common/parse_jwt', () => {
    const tokenEmptyArr = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.W10.iMN3Ucoao_H6K4OnnNBdQtVbzff3kRIl05LgDEVkuuA'
    const tokenEmptyObj = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U'
    const tokenData = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZGF0YSJ9.L2a0VTJJsk7r2NK5aIW2qzmFZTrocq8vvMMHzbuJ9tY'


    test('empty arr', () => {
        expect(
            parseJWT(tokenEmptyArr)
        ).toStrictEqual([])
    })

    test('empty obj', () => {
        expect(
            parseJWT(tokenEmptyObj)
        ).toStrictEqual({})
    })

    test('fullfilled json', () => {
        expect(
            parseJWT(tokenData)
        ).toStrictEqual({ data: 'data' })
    })
})