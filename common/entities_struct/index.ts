import rangeEach from '../array_range_each'

import type { Entities } from './types'


/**
 * Creates data structure to store server entities in and to easily work with them (CRUD)
 *
 * @param uniq Uniq field in each entity. Default is 'id'
 * @returns Object to perform CRUD operations with entities
 */
function entities<E extends Obj>(uniq: keyof E = 'id') {
    let byID: Obj<E> = {}
    let sorted: string[] = []


    const entityStruct: Entities<E> = {
        clear() {
            byID = {}
            sorted = []

            return entityStruct
        },

        addOrUpdate(entity) {
            const entityID = entity[uniq]

            byID[entityID] || sorted.push(entityID)
            byID[entityID] = entity

            return entityStruct
        },

        addAll(entities, postProcessEach) {
            for (let i = 0, l = entities.length; i < l; i++) {
                const entity = entities[i]

                postProcessEach?.(entity, i)
                this.addOrUpdate(entity)
            }

            return entityStruct
        },

        remove(entityID) {
            if (byID[entityID]) {
                const indexOfEntity = sorted.findIndex(ID => entityID == ID)

                sorted.splice(indexOfEntity, 1)
                delete byID[entityID]
            }

            return entityStruct
        },

        sort(cb) {
            sorted.sort((ID_a, ID_b) => cb(byID[ID_a], byID[ID_b]))

            return entityStruct
        },

        each(cb, from = 0, to = sorted.length) {
            rangeEach(sorted, from, to, (id, index) => cb(byID[id], index))

            return entityStruct
        },

        get: entityID => byID[entityID],

        len: () => sorted.length,

        raw: () => ({ byID, sorted })
    }


    return entityStruct
}


export default entities
export type { Entities }