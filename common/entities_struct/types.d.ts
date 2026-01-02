type State<_E> = {
    byID: Obj<_E>,
    sorted: string[]
}


type Entities<Entity extends Obj = Obj> = {
    /**
     * Deletes all the entities from struct
     */
    clear(): Entities<Entity>

    /**
     * Populates struct with one entity
     * Replaces entity if already exists
     */
    addOrUpdate(entity: Entity): Entities<Entity>

    /**
     * Populate struct with multiple entities
     * Replaces entity if already exists
     */
    addOrUpdateAll(
        entities: Entity[],
        postProcessEach?: (entity: Entity, index: number) => void
    ): Entities<Entity>

    /**
     * Removes an entity from struct
     */
    remove(entityID: string): Entities<Entity>

    /**
     * Sort entities
     */
    sort(cb: (entity_a: Entity, entity_b: Entity) => number): Entities<Entity>

    /**
     * Iterates over all entities
     * Breaks iteration if true is returned from callback
     */
    each(cb: (entity: Entity, index: number) => boolean | void): Entities<Entity>

    /**
     * Iterates over all entities, map each entity to a new type
     * and returns an array of mapped entities
     */
    map<T>(cb: (entity: Entity, index: number) => T): T[]

    /**
     * Get entity by id
     */
    get(id: string): Entity | undefined

    /**
     * Entities count
     */
    len(): number

    /**
     * Receives entities the way they stored
     */
    raw(): State<Entity>

    /**
     * Clones entities struct
     */
    clone(): Entities<Entity>

    /**
     * [ UNSAFE !!! ]
     * Replaces existing entities with the new ones
     */
    setRaw(newState: State<Entity>): Entities<Entity>

    /**
     * Get last update occured timestamp
     */
    getLastUpdated(): number

    /**
     * Triggers last update occured timestamp update
     */
    setLastUpdated(): void
}


export type { Entities }