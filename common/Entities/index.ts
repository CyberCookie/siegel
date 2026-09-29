import rangeEach from '../array/range_each'


type BindMethods<M extends Obj<AnyFunc>> = {
    [K in keyof M]: (
        ...args: Parameters<NonNullable<M[K]>>
    ) => ReturnType<NonNullable<M[K]>>
}

type EntitiesIterCB<E, R = boolean> = (entity: E, index: number) => R
type EntitiesSortCB<E> = (entity_a: E, entity_b: E) => number

type SortedEntities = string[]


const DEFAULT_UNIQ_KEY = 'id'

/**
 * Creates data structure to store server entities in and to easily work with them
 */
class Entities<
    E extends Obj,
    M extends Obj<AnyFunc> = Obj<AnyFunc>
> {

    private byID: Obj<E> = Object.create(null)
    private sorted: SortedEntities = []

    private indexes: Obj<number> = Object.create(null)
    private rebuildIndexes(): void {
        const indexes = this.indexes = Object.create(null)
        this.sorted.forEach((id, i) => {
            indexes[id] = i
        })
    }

    private initialMethods: M
    public methods: BindMethods<M>

    private uniqField: keyof E
    private lastUpdated = 0


    constructor(
        ...args: typeof DEFAULT_UNIQ_KEY extends keyof E
            ?   [ methods?: M & ThisType<Entities<E, M>>, uniqField?: keyof E ]
            :   [ methods: M & ThisType<Entities<E, M>>, uniqField: keyof E ]
    ) {

        const [
            methods = {} as M,
            uniqField = DEFAULT_UNIQ_KEY
        ] = args

        const boundMethods: BindMethods<M> = Object.create(null)
        Object.keys(methods).forEach(methodName => {
            boundMethods[methodName as keyof M] = (
                ...args: any[]

            ) => methods[methodName]!.apply(this, args)
        })

        this.initialMethods = methods
        this.methods = boundMethods
        this.uniqField = uniqField
        this.lastUpdated = Date.now()
    }


    /**
     * Populates struct with one entity
     * Replaces entity if already exists
     */
    addOrUpdate(entity: E) {

        const id = entity[this.uniqField]
        if (!(id in this.byID)) {
            this.indexes[id] = this.sorted.length
            this.sorted.push(id)
        }

        this.byID[id] = entity

        return this
    }

    /**
     * Populate struct with multiple entities
     * Replaces entity if already exists
     */
    addOrUpdateAll(
        entities: E[],
        postProcess?: EntitiesIterCB<E, void>
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
        return this.byID[id]
    }

    /**
     * Removes an entity from struct
     */
    remove(id: string | number): this {
        if (id in this.byID) {

            const index = this.indexes[id]!
            delete this.indexes[id]

            delete this.byID[id]
            this.sorted.splice(index, 1)

            for (let i = index, l = this.sorted.length; i < l; i++) {
                this.indexes[this.sorted[i]! as string] = i
            }

            this.setLastUpdated()
        }

        return this
    }

    /**
     * Iterates over all entities
     * Breaks iteration if true is returned from callback
     */
    each(
        cb: EntitiesIterCB<E, boolean | void>,
        from = 0,
        to = this.len()
    ) {

        rangeEach(
            this.sorted,
            from,
            to,
            (id, i) => cb(this.byID[id as keyof typeof this.byID]!, i)
        )

        return this
    }

    /**
     * Searches for an entity
     * Breaks iteration if true is returned from callback
     */
    find(cb: EntitiesIterCB<E, boolean | void>) {

        let result: E | undefined
        this.each((entity, i) => {
            if (cb(entity, i)) {
                result = entity
                return true
            }
        })


        return result
    }

    /**
     * Iterates over all entities, map each entity to a new type
     * and returns an array of mapped entities
     */
    map<R = E>(cb: EntitiesIterCB<E, R>) {

        const result: R[] = []
        this.each((entity, i) => {
            result.push( cb(entity, i) )
        })

        return result
    }

    /**
     * Filters the collection entities based on a predicate callback function.
     *
     * Depending on the `isMutate` flag, this method can either perform an in-place destructive
     * mutation on the collection instance (returning the collection for chaining) or act as a
     * pure function (returning a new array of matched entities).
     *
     * @group Queries & Mutations
     * @category Core
     *
     * @param cb The predicate function invoked per iteration. Return `true` to keep the entity, or `false` to discard it.
     * @param isMutate Set to `true` to perform an in-place destructive mutation on the store.
     *        Deletes unmatched elements from memory and re-indexes the collection. Defaults to `false`.
     *
     * @returns
     * - If `isMutate` is true: Returns `this` (the mutated Entities instance) for chaining.
     * - If `isMutate` is false/omitted: Returns a fresh array containing the filtered entities.
     *
     * @see {@link rebuildIndexes} For how the tracking indexes are corrected after an in-place mutation.
     * @see {@link setLastUpdated} For the cache invalidation timestamp triggered on mutation.
     *
     * @example
     * ```ts
     * // Non-mutating path (returns a fresh array)
     * const activeUsers = store.filter(user => user.isActive)
     * ```
     *
     * @example
     * ```ts
     * // Destructive in-place mutation path (returns the chainable instance)
     * store.filter(user => user.role === 'admin', true).len()
     * ```
     */
    filter(cb: EntitiesIterCB<E>, isMutate: true): this
    filter(cb: EntitiesIterCB<E>, isMutate?: false): E[]
    filter(cb: EntitiesIterCB<E>, isMutate?: boolean): this | E[] {

        if (isMutate) {
            const nextSorted: SortedEntities = []
            this.each((entity, i) => {
                cb(entity, i)
                    ?   nextSorted.push(this.sorted[i]!)
                    :   (delete this.byID[this.sorted[i] as string])
            })

            this.sorted = nextSorted
            this.rebuildIndexes()
            this.setLastUpdated()

            return this

        } else {

            const result: E[] = []
            this.each((entity, i) => {
                const cbResult = cb(entity, i)
                cbResult && result.push(entity)
            })

            return result
        }
    }

    /**
     * Sort entities
     */
    sort(cb: EntitiesSortCB<E>, isMutate: true): this
    sort(cb: EntitiesSortCB<E>, isMutate?: false): SortedEntities
    sort(cb: EntitiesSortCB<E>, isMutate?: boolean): this | SortedEntities {

        const sortCB: Parameters<Array<string>['sort']>[0] = (id_a, id_b) => (
            cb(
                this.byID[id_a as E[keyof E]]!,
                this.byID[id_b as E[keyof E]]!
            )
        )

        if (isMutate) {
            this.sorted.sort(sortCB)

            this.rebuildIndexes()
            this.setLastUpdated()

            return this

        } else {
            const clonnedArray = this.sorted.slice()
            return clonnedArray.sort(sortCB)
        }
    }

    /**
     * [ UNSAFE!!! ]
     * Replaces existing entities with the new ones
     */
    setRaw({ byID, sorted }: ReturnType<Entities<E, M>['raw']>) {

        this.byID = byID
        this.sorted = sorted

        this.setLastUpdated()

        return this
    }

    /**
     * Receives mutable entities the way they stored
     */
    raw() {
        return {
            byID: this.byID,
            sorted: this.sorted
        }
    }

    /**
     * Clones entities struct
     */
    clone() {
        const newStruct = new Entities<E, M>(this.initialMethods, this.uniqField)
        newStruct.setRaw(
            structuredClone(this.raw())
        )

        return newStruct
    }

    /**
     * Deletes all the entities from struct
     */
    clear() {
        this.byID = Object.create(null)
        this.sorted = []

        this.setLastUpdated()

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