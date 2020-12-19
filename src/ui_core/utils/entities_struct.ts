//TODO?
// type _Entities<Entity extends Indexable> = {
//     clear: () => void
//     get: (id: ID) => Entity[ID]
//     addOrUpdate: (entity: Entity) => void
//     addAll: (entities: Entity[]) => void
//     remove: (entityID: ID) => void
//     sort: (cb: (entity_a: Entity, entity_b: Entity) => number) => void
//     each: (cb: (entity: Entity, index: number) => boolean | void) => void
//     len: () => number
//     raw: () => ({
//         byID: Indexable<Entity>,
//         sorted: ID[]
//     })
// }
// type EntityCreator<Entity> = (uniq: keyof Entity) => _Entities<Entity>

type Entities = ReturnType<typeof entities>

function entities<E extends Indexable>(uniq: keyof E) {
    type Entity = E & Indexable
    type SortCB = (entity_a: Entity, entity_b: Entity) => number
    type EachCB = (entity: Entity, index: number) => boolean | void

    let byID: Indexable<Entity> = {}
    let sorted: ID[] = []


    return {
        clear() {
            byID = {}
            sorted = []
        },

        get: (entityID: ID) => byID[entityID],

        addOrUpdate(entity: Entity) {
            const entityID = entity[uniq]
    
            byID[entityID] || sorted.push(entityID)
            byID[entityID] = entity
        },
        
        addAll(entities: Entity[]) {
            for (let i = 0, l = entities.length; i < l; i++)
                this.addOrUpdate(entities[i])
        },

        remove(entityID: ID) {
            if (byID[entityID]) {
                const indexOfEntity = sorted.findIndex(ID => entityID === ID)
    
                sorted.splice(indexOfEntity, 1)
                delete byID[entityID]
            }
        },

        sort(cb: SortCB) {
            sorted.sort((ID_a, ID_b) => cb(byID[ID_a], byID[ID_b]))
        },

        each(cb: EachCB, from = 0, to = sorted.length) {
            for (let i = from; i < to; i++) {
                if (cb(byID[sorted[i]], i)) break;
            }
        },

        len: () => sorted.length,

        raw: () => ({ byID, sorted })
    }
}


export default entities
export type { Entities }