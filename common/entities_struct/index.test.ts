import entities from './'


type TestEntity = {
    id: string
    data?: string
    newField?: string
}


describe('common/entities', () => {
    const entitiesData = entities<TestEntity>('id')


    test('created', () => {
        expect(
            entitiesData.len()
        ).toBe(0)
    })

    test('add', () => {
        const newEntity: TestEntity = { id: 'a' }
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
        entitiesData.addOrUpdateAll(
            [
                { id: 'b', data: 'data_b' },
                { id: 'c', data: 'data_c' },
                { id: 'd', data: 'data_d' },
                { id: 'e', data: 'data_e' }
            ],
            entity => { entity.newField = entity.id + entity.data }
        )

        expect(
            entitiesData.len()
        ).toStrictEqual(5)

        expect(entitiesData.get('b')?.newField)
            .toBe('bdata_b')
    })

    test('clear', () => {
        entitiesData.clear()

        expect(
            entitiesData.len()
        ).toBe(0)
    })
})