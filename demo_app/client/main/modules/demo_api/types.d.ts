import type { HookStore } from 'siegel-store'
import type { EchoReqBody } from 'dto/demo_api'


type State = {
    received: string
    proxyRes: Indexable
    counter: number
}

type Actions = {
    api_echo(store: StoreInitialized, body: EchoReqBody): void
    api_proxyGet(store: StoreInitialized, id: string): void
    updateCounter(store: StoreInitializedz, id: string): void
}

type StoreInitialized = HookStore<State, Actions>


export type { State, Actions, StoreInitialized, EchoReqBody }