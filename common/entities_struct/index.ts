type Entities<Entity extends Indexable = Indexable> = {
    clear(): Entities<Entity>
    addOrUpdate(entity: Entity): Entities<Entity>
    addAll(entities: Entity[], postProcessEach?: (entity: Entity) => void): Entities<Entity>
    remove(entityID: string): Entities<Entity>
    sort(cb: (entity_a: Entity, entity_b: Entity) => number): Entities<Entity>
    each(cb: (entity: Entity, index: number) => boolean | void): Entities<Entity>
    get(id: string): Entity
    len(): number
    raw(): ({
        byID: Indexable<Entity>,
        sorted: string[]
    })
}


function entities<E extends Indexable>(uniq: keyof E = 'id') {
    let byID: Indexable<E> = {}
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

                postProcessEach?.(entity)
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
            for (let i = from; i < to; i++) {
                if (cb(byID[sorted[i]], i)) break
            }

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