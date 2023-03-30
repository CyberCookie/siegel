type Entities<Entity extends Obj = Obj> = {
    clear(): Entities<Entity>
    addOrUpdate(entity: Entity): Entities<Entity>
    addAll(
        entities: Entity[],
        postProcessEach?: (entity: Entity, index: number) => void
    ): Entities<Entity>
    remove(entityID: string): Entities<Entity>
    sort(cb: (entity_a: Entity, entity_b: Entity) => number): Entities<Entity>
    each(cb: (entity: Entity, index: number) => boolean | void): Entities<Entity>
    get(id: string): Entity | undefined
    len(): number
    raw(): ({
        byID: Obj<Entity>,
        sorted: string[]
    })
}


export type { Entities }