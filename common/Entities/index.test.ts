import { describe, test, expect, mock } from 'bun:test'

import Entities from './'


type TestEntity = {
    id: string
    data?: string
    newField?: string
}

type TestMethods = {
    getData(id: TestEntity['id']): TestEntity['data']
}


describe('common/entities', () => {
    const entitiesData = new Entities<TestEntity, TestMethods>({
        getData(id) {
            return this.raw().byID[id]!.data
        }
    })


    test('create', () => {
        expect(
            entitiesData.len()
        ).toBe(0)
    })

    test('add', () => {
        const id = 'a'
        const newEntity: TestEntity = { id }
        entitiesData.addOrUpdate(newEntity)

        expect(
            entitiesData.get(id)
        ).toStrictEqual(newEntity)
    })

    test('update', () => {
        const id = 'a'
        const newEntity = { data: 'data_a', id }
        entitiesData.addOrUpdate(newEntity)

        expect(
            entitiesData.get(id)
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

        expect(
            entitiesData.get('b')?.newField
        ).toBe('bdata_b')
    })

    test('remove', () => {
        const entitiesClonned = entitiesData.clone()
        entitiesClonned.remove('b')

        expect(
            entitiesClonned.len()
        ).toEqual(4)
    })

    test('iterate', () => {
        const iterateCB: Parameters<Entities<TestEntity>['each']>[0] = mock(() => {})
        entitiesData.each(iterateCB, 2)

        expect(iterateCB)
            .toBeCalledTimes(3)
    })

    test('find', () => {
        expect(
            entitiesData.find(({ id }) => id == 'a')!.data
        ).toBe('data_a')
    })

    test('sort', () => {
        expect(
            entitiesData.sort((entity_a, entity_b) => (
                entity_b.id.localeCompare(entity_a.id)
            ))[0]
        ).toBe('e')

        const entitiesClonned = entitiesData.clone()
        expect(
            entitiesClonned
                .sort(
                    (entity_a, entity_b) => entity_b.id.localeCompare(entity_a.id),
                    true
                )
                .raw()
                .sorted[0]
        ).toBe('e')
    })

    test('filter', () => {
        expect(
            entitiesData.filter(({ id }) => id == 'a')
        ).toEqual(
            [{
                id: 'a',
                data: 'data_a'
            }]
        )

        const entitiesClonned = entitiesData.clone()
        expect(
            entitiesClonned
                .filter(
                    ({ id }) => id == 'a',
                    true
                )
                .len()
        ).toBe(1)
    })

    test('map', () => {
        expect(
            entitiesData.map<string>(({ id }) => id)
        ).toEqual(
            [ 'a', 'b', 'c', 'd', 'e' ]
        )
    })

    test('custom metod', () => {
        expect(
            entitiesData.methods.getData('a')
        ).toBe('data_a')
    })

    test('clear', () => {
        entitiesData.clear()

        expect(
            entitiesData.len()
        ).toBe(0)
    })
})