type Entities = ReturnType<typeof entities>


function entities<K extends ID = ''>(uniq: K) {
    type Entity = {
        [key in K]: ID
    } & Indexable
    type SortCB = (entity_a: Entity, entity_b: Entity) => SortReturnValue
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


export { Entities }
export default entities