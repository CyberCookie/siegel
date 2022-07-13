import classNames from './'


describe('common/classNames', () => {
    const classesConditions = {
        class_a: true,
        class_b: false
    }


    test('with default class', () => {
        expect(
            classNames('default', classesConditions)
        ).toBe('default class_a')
    })

    test('empty default', () => {
        expect(
            classNames('', classesConditions)
        ).toBe(' class_a')
    })
})