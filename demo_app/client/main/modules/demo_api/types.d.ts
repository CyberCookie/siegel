import type { HookStore } from 'siegel-store/index'
import type { EchoReqBody } from 'dto/demo_api'


type State = {
    received: string
    proxyRes: Obj<unknown>
    counter: number
}

type Actions = {
    api_echo(store: StoreInitialized, body: EchoReqBody): void
    api_proxyGet(store: StoreInitialized, id: string): void
    updateCounter(store: StoreInitialized): void
}

type StoreInitialized = HookStore<State, Actions>


export type { State, Actions, StoreInitialized, EchoReqBody }