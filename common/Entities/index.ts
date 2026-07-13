import rangeEach from '../array/range_each'


const DEFAULT_UNIQ_KEY = 'id'

/**
 * Creates data structure to store server entities in and to easily work with them
 */
class Entities<E extends Obj> {
    private lastUpdated = 0
    private uniqField: keyof E

    private byId: Obj<E> = Object.create(null)
    private sorted: (typeof this.uniqField)[] = []

    constructor(
        ...args: typeof DEFAULT_UNIQ_KEY extends keyof E
            ?   [ uniqField?: keyof E ]
            :   [ uniqField: keyof E ]
    ) {

        const [ uniqField ] = args

        this.uniqField = uniqField ?? DEFAULT_UNIQ_KEY

        this.lastUpdated = Date.now()
    }


    /**
     * [ UNSAFE!!! ]
     * Replaces existing entities with the new ones
     */
    setRaw(state: ReturnType<Entities<E>['raw']>) {
        this.byId = { ...state.byId }
        this.sorted = [ ...state.sorted ]

        this.setLastUpdated()

        return this
    }

    /**
     * Populates struct with one entity
     * Replaces entity if already exists
     */
    addOrUpdate(entity: E) {
        const id = entity[this.uniqField]

        if (!(id in this.byId)) {
            this.sorted.push(id)
        }

        this.byId[id] = entity

        return this
    }

    /**
     * Populate struct with multiple entities
     * Replaces entity if already exists
     */
    addOrUpdateAll(
        entities: E[],
        postProcess?: (entity: E, index: number) => void
    ) {

        for (let i = 0, l = entities.length; i < l; i++) {
            const entity = entities[i]

            postProcess?.(entity, i)

            this.addOrUpdate(entity)
        }

        return this
    }

    /**
     * Get entity by id
     */
    get(id: string | number): E | undefined {
        return this.byId[id]
    }

    /**
     * Clones entities struct
     */
    clone() {
        const newStruct = new Entities<E>(this.uniqField)
        newStruct.setRaw(
            structuredClone(this.raw())
        )

        return newStruct
    }

    /**
     * Receives entities the way they stored
     */
    raw() {
        return {
            byId: { ...this.byId },
            sorted: [ ...this.sorted ]
        }
    }

    /**
     * Removes an entity from struct
     */
    remove(id: string | number): this {
        if (id in this.byId) {
            delete this.byId[id]
            this.sorted = this.sorted.filter(item => item !== id)

            this.setLastUpdated()
        }

        return this
    }

    /**
     * Deletes all the entities from struct
     */
    clear() {
        this.byId = Object.create(null)
        this.sorted = []

        this.setLastUpdated()

        return this
    }

    /**
     * Iterates over all entities
     * Breaks iteration if true is returned from callback
     */
    each(
        cb: (entity: E, index: number) => boolean | void,
        from = 0,
        to = this.len()
    ) {

        rangeEach(
            this.sorted,
            from,
            to,
            (id, index) => cb(this.byId[id as keyof typeof this.byId]!, index)
        )

        return this
    }

    /**
     * Iterates over all entities, map each entity to a new type
     * and returns an array of mapped entities
     */
    map<R>(
        cb: (entity: E, index: number) => R
    ) {

        const result: R[] = []
        this.each((entity, index) => {
            result.push(
                cb(entity, index)
            )
        })

        return result
    }

    /**
     * Sort entities
     */
    sort(
        cb: (entity_a: E, entity_b: E) => number
    ) {

        this.sorted.sort((id_a, id_b) => (
            cb(
                this.byId[id_a as keyof typeof this.byId]!,
                this.byId[id_b as keyof typeof this.byId]!
            )
        ))

        return this
    }

    /**
     * Get entities count
     */
    len(): number {
        return this.sorted.length
    }

    /**
     * Triggers last update occured timestamp update
     */
    setLastUpdated(): void {
        this.lastUpdated = Date.now()
    }

    /**
     * Get last update occured timestamp
     */
    getLastUpdated() {
        return this.lastUpdated
    }
}


export default Entities