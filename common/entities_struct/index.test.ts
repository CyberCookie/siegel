import entities from './'


describe('common/entities', () => {
    const entitiesData = entities<Indexable>('id')


    test('created', () => {
        expect(
            entitiesData.len()
        ).toBe(0)
    })

    test('add', () => {
        const newEntity = { id: 'a' }
        entitiesData.addOrUpdate(newEntity)

        expect(
            entitiesData.get('a')
        ).toStrictEqual(newEntity)
    })

    test('update', () => {
        const newEntity = { id: 'a', data: 'data_a' }
        entitiesData.addOrUpdate(newEntity)

        expect(
            entitiesData.get('a')
        ).toStrictEqual(newEntity)
    })

    test('update mass', () => {
        entitiesData.addAll([
            { id: 'b', data: 'data_b' },
            { id: 'c', data: 'data_c' },
            { id: 'd', data: 'data_d' },
            { id: 'e', data: 'data_e' }
        ])

        expect(
            entitiesData.len()
        ).toStrictEqual(5)
    })

    test('clear', () => {
        entitiesData.clear()

        expect(
            entitiesData.len()
        ).toBe(0)
    })
})