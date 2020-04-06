type SortCBNative = NonNullable<Parameters<typeof Array.prototype.sort>[0]>
type SortCBNativeReturnType = ReturnType<SortCBNative>


function entities<K extends ID>(uniq: K) {
    type Entity = {
        [key in K]: K
    } & Indexable
    type SortCB = (entity_a: Entity, entity_b: Entity) => SortCBNativeReturnType
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

        each(cb: EachCB) {
            for (let i = 0, l = sorted.length; i < l; i++) {
                if (cb(byID[sorted[i]], i)) break;
            }
        },

        len: () => sorted.length
    }
}



export default entities