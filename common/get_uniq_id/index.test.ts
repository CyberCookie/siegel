import getUniqId from './'


describe('common/classNames', () => {
    test('with default class', () => {
        expect( getUniqId() )
            .not.toBe( getUniqId() )
    })
})