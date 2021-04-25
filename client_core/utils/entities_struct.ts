type Entities<Entity extends Indexable = Indexable> = {
    clear(): Entities<Entity>
    addOrUpdate(entity: Entity): Entities<Entity>
    addAll(entities: Entity[]): Entities<Entity>
    remove(entityID: ID): Entities<Entity>
    sort(cb: (entity_a: Entity, entity_b: Entity) => number): void
    each(cb: (entity: Entity, index: number) => boolean | void): void
    get(id: ID): Entity
    len(): number
    raw(): ({
        byID: Indexable<Entity>,
        sorted: ID[]
    })
}


function entities<E extends Indexable>(uniq: keyof E = 'id') {
    type SortCB = (entity_a: E, entity_b: E) => number
    type EachCB = (entity: E, index: number) => boolean | void

    let byID: Indexable<E> = {}
    let sorted: ID[] = []


    const entityStruct = {
        clear() {
            byID = {}
            sorted = []

            return entityStruct
        },

        addOrUpdate(entity: E) {
            const entityID = entity[uniq]

            byID[entityID] || sorted.push(entityID)
            byID[entityID] = entity

            return entityStruct
        },

        addAll(entities: E[]) {
            for (let i = 0, l = entities.length; i < l; i++) {
                this.addOrUpdate(entities[i])
            }

            return entityStruct
        },

        remove(entityID: ID) {
            if (byID[entityID]) {
                const indexOfEntity = sorted.findIndex(ID => entityID === ID)

                sorted.splice(indexOfEntity, 1)
                delete byID[entityID]
            }

            return entityStruct
        },

        sort(cb: SortCB) {
            sorted.sort((ID_a, ID_b) => cb(byID[ID_a], byID[ID_b]))

            return entityStruct
        },

        each(cb: EachCB, from = 0, to = sorted.length) {
            for (let i = from; i < to; i++) {
                if (cb(byID[sorted[i]], i)) break
            }

            return entityStruct
        },

        get: (entityID: ID) => byID[entityID],

        len: () => sorted.length,

        raw: () => ({ byID, sorted })
    }


    return entityStruct as Entities<E>
}


export default entities
export type { Entities }