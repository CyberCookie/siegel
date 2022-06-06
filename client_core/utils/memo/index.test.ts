import memo, { getUniqID, clearState } from './'


describe('utils/memo', () => {
    const memoExecutionID = getUniqID()

    let calculationsCount = 0
    const calculationFunc = () => {
        calculationsCount++
        return calculationsCount
    }


    test('memoize', () => {
        expect(
            memo(calculationFunc, 'dep string', memoExecutionID)
        ).toBe(1)
    })

    test('use memoized', () => {
        expect(
            memo(calculationFunc, 'dep string', memoExecutionID)
        ).toBe(1)
    })

    test('perform new calculation', () => {
        expect(
            memo(calculationFunc, 'new dep string', memoExecutionID)
        ).toBe(2)
    })


    test('clear state', () => {
        clearState(memoExecutionID)
        calculationsCount = 0

        expect(
            memo(calculationFunc, 'new dep string', memoExecutionID)
        ).toBe(1)
    })
})