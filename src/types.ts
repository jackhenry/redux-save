import {
  AnyAction,
  Dispatch,
  Observable,
  Reducer,
  Store,
  Unsubscribe
} from 'redux'

export type Config = {
  manualHydration?: boolean
  [key: string]: any
}

export interface NonVolatileStore {
  resume(): void
  pause(): void
  persist(): void
  purge(): void
  dispatch(action: AnyAction): AnyAction
  getState(): any
  subscribe(callback: () => void): () => any
}

export namespace constants {
  export const HYDRATE_TYPE = '@@redux-save/HYDRATE'
  export const PERSIST_VALUE = '@@redux-save/PERSIST'
  export const PERSIST_ACTION = PERSIST_VALUE + '-ACTION'
  export const DUPLICATE_ID_WARNING = 'Reusing item ID '
}
