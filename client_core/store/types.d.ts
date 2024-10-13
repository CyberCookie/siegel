type StateUpdater = {
    /** Value thats incremented every time store is updated */
    __updated: number
}

type StateWithUpdater<State extends Obj> = State & StateUpdater

type HookStore<
    State extends Obj,
    Actions extends ActionsUnbinded<State>
> = Required<InnerStore<StateWithUpdater<State>, Actions>>


type SetState<State extends Obj> = (
    newState: Omit<StateWithUpdater<State>, keyof StateUpdater> & Partial<StateUpdater>
) => void

type HookSetState<State extends Obj> = React.Dispatch<React.SetStateAction<State>>

type InnerStore<State extends Obj, A extends ActionsUnbinded<State>> = {
    state: State
    listeners: (HookSetState<State> | StoreListenerWithPrevState<State>)[]
    setState?: SetState<State>
    actions?: ActionsBinded<A>
}

type StoreShouldUpdate<State extends StateWithUpdater<object>> = (
    prevState: State,
    newState: State
) => boolean

type StoreListenerWithPrevState<State = StateWithUpdater<object>> = {
    (newState: State, prevState: State): void
    withShouldUpdateCb: boolean
}


type ActionBinded<_Action extends (...args: any[]) => void> = (...args: Tail<Parameters<_Action>>) => ReturnType<_Action>
type ActionsBinded<A extends ActionsUnbinded<any>> = {
    [action in keyof A]: ActionBinded<A[action]>
}

type ActionsUnbinded<State extends Obj, Store = HookStore<State, any>> = {
    [actions: string]: (store: Store, ...args: any[]) => void
}


export type {
    SetState, StoreShouldUpdate,
    HookStore, InnerStore, StateWithUpdater, StoreListenerWithPrevState,
    ActionsUnbinded, ActionsBinded, ActionBinded
}