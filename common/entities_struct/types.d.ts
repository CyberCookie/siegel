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
    addAll(
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
     * Last update occured timestamp
     */
    lastUpdated: number

    /**
     * [ UNSAFE !!! ]
     * Replaces existing entities with new ones
     */
    setRaw(newState: State<Entity>): Entities<Entity>
}


export type { Entities }