type StateWithUpdater<State extends Indexable> = State & { __updated: number }

type HookStore<State, Actions extends ActionsUnbinded<State>> = Required<InnerStore<StateWithUpdater<State>, Actions>>


type SetState<State extends Indexable> = (newState: StateWithUpdater<State>) => void

type HookSetState<State extends Indexable> = React.Dispatch<React.SetStateAction<State>>

type InnerStore<State extends Indexable, A extends ActionsUnbinded<State>> = {
    state: State
    listeners: HookSetState<State>[]
    setState?: SetState<State>
    actions?: ActionsBinded<A>
}


type ActionBinded<_Action> = (...args: Tail<Parameters<_Action>>) => ReturnType<_Action>

type ActionsBinded<A extends ActionsUnbinded<any>> = {
    [action in keyof A]: ActionBinded<A[action]>//(...args: Tail<Parameters<A[action]>>) => ReturnType<A[action]>
}
type ActionsUnbinded<State extends Indexable, Store = HookStore<State, any>> = {
    [actions: string]: (store: Store, ...args: any[]) => void
}


export type {
    SetState, HookSetState,
    HookStore, InnerStore, StateWithUpdater,
    ActionsUnbinded, ActionsBinded, ActionBinded
}