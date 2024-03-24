import type { HookStore } from '../index'


type AnyError = {
    date: number
} & Obj


type State = {
    requests: Obj<number>
    errRes: Obj<AnyError[]>
    lastError: AnyError
}

type Actions = {
    addToReqQueue(store: StoreInitialized, ID: string): void
    removeFromReqQueue(store: StoreInitialized, ID: string, cleanupErrors?: boolean): void
    addToErrRes(store: StoreInitialized, res: any, ID: string): void
    clearErrRes(store: StoreInitialized, ID: string): void
    getLastErrorMsgByID(store: StoreInitialized, ID: string): string
}

type StoreInitialized = HookStore<State, Actions>


export type { State, Actions, StoreInitialized, AnyError }