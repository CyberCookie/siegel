// TODO: custom methods


import rangeEach from '../array_range_each'

import type { Entities } from './types'


/**
 * Creates data structure to store server entities in and to easily work with them (CRUD)
 *
 * @param uniq - Uniq field in each entity. Default is 'id'
 * @returns Object to perform CRUD operations with entities
 */
function entities<E extends Obj>(uniq: keyof E = 'id') {
    let byID: Obj<E> = {}
    let sorted: string[] = []

    let lastUpdated: number


    const entityStruct: Entities<E> = {
        clear() {
            byID = {}
            sorted = []

            this.setLastUpdated()
            return entityStruct
        },

        addOrUpdate(entity) {
            const entityID = entity[uniq]

            byID[entityID] || sorted.push(entityID)
            byID[entityID] = entity


            this.setLastUpdated()
            return entityStruct
        },

        addOrUpdateAll(entities, postProcessEach) {
            for (let i = 0, l = entities.length; i < l; i++) {
                const entity = entities[i]

                postProcessEach?.(entity, i)
                this.addOrUpdate(entity)
            }


            return entityStruct
        },

        remove(entityID) {
            if (byID[entityID]) {
                const indexOfEntity = sorted.indexOf(entityID)

                sorted.splice(indexOfEntity, 1)
                delete byID[entityID]
            }


            this.setLastUpdated()
            return entityStruct
        },

        sort(cb) {
            sorted.sort((ID_a, ID_b) => cb(byID[ID_a]!, byID[ID_b]!))

            return entityStruct
        },

        each(cb, from = 0, to = sorted.length) {
            rangeEach(sorted, from, to, (id, index) => cb(byID[id]!, index))

            return entityStruct
        },

        map(cb) {
            const result: any[] = []
            this.each((entity, index) => {
                result.push(
                    cb(entity, index)
                )
            })

            return result
        },

        get: entityID => byID[entityID],

        len: () => sorted.length,

        raw: () => ({ byID, sorted }),

        setRaw(newState) {
            byID = newState.byID
            sorted = newState.sorted

            this.setLastUpdated()
            return entityStruct
        },

        clone() {
            const newEntites = entities<E>(uniq)
            newEntites.setRaw(
                structuredClone(this.raw())
            )

            return newEntites
        },

        setLastUpdated() {
            lastUpdated = Date.now()
        },

        getLastUpdated: () => lastUpdated
    }


    return entityStruct
}


export default entities
export type { Entities }