type StateUpdater = {
    /** Value that incremented every time store is updated */
    __updated: number
}
type PartialUpdater = Partial<StateUpdater>

type StateWithUpdater<State extends Obj> = State & StateUpdater


type HookStore<
    State extends Obj,
    Actions extends ActionsUnbound<State>,
> = {
    state: StateWithUpdater<State>
    setState(newState: State & PartialUpdater): void
    actions: ActionsBound<Actions>
    listeners: (
        React.Dispatch<
            React.SetStateAction<
                StateWithUpdater<State>
            >
        >
        |   StoreListenerWithPrevState<
                StateWithUpdater<State>
            >
    )[]
}


type StoreShouldUpdate<State extends StateWithUpdater<Obj>> = (
    prevState: State,
    newState: State
) => boolean

type StoreListenerWithPrevState<State = StateWithUpdater<Obj>> = {
    (newState: State, prevState: State): void
    withShouldUpdateCb: boolean
}


type ActionBinded<_Action extends (...args: any[]) => void> = (...args: Tail<Parameters<_Action>>) => ReturnType<_Action>
type ActionsBound<A extends ActionsUnbound<any>> = {
    [action in keyof A]: ActionBinded<A[action]>
}

type ActionsUnbound<State extends Obj> = {
    [actions: string]: (store: HookStore<State, any>, ...args: any[]) => void
}


export type {
    StoreShouldUpdate, StateWithUpdater, StoreListenerWithPrevState,
    ActionsUnbound, ActionsBound, HookStore
}