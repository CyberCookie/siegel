type StateWithUpdater<State extends Obj> = State & { __updated: number }

type HookStore<State, Actions extends ActionsUnbinded<State>> = Required<InnerStore<StateWithUpdater<State>, Actions>>


type SetState<State extends Obj> = (newState: StateWithUpdater<State>) => void

type HookSetState<State extends Obj> = React.Dispatch<React.SetStateAction<State>>

type InnerStore<State extends Obj, A extends ActionsUnbinded<State>> = {
    state: State
    listeners: HookSetState<State>[]
    setState?: SetState<State>
    actions?: ActionsBinded<A>
}


type ActionBinded<_Action> = (...args: Tail<Parameters<_Action>>) => ReturnType<_Action>
type ActionsBinded<A extends ActionsUnbinded<any>> = {
    [action in keyof A]: ActionBinded<A[action]>
}

type ActionsUnbinded<State extends Obj, Store = HookStore<State, any>> = {
    [actions: string]: (store: Store, ...args: any[]) => void
}


export type {
    SetState, HookSetState,
    HookStore, InnerStore, StateWithUpdater,
    ActionsUnbinded, ActionsBinded, ActionBinded
}