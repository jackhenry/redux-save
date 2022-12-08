import {
  Action,
  AnyAction,
  Dispatch,
  Observable,
  Reducer,
  Store,
  Unsubscribe
} from 'redux'
import storage from './storage'
import { Config, constants, NonVolatileStore } from './types'

// Set to keep track of localstorage item ids to prevent dupliacte use of item ids
const itemIds = new Set<string>()
let paused = false

export const save = (itemId: string, reducer: Reducer) => {
  if (itemIds.has(itemId)) console.warn(constants.DUPLICATE_ID_WARNING + itemId)
  itemIds.add(itemId)

  const wrappedReducer: Reducer = (
    state,
    action: Action & { [key: string]: any }
  ) => {
    switch (action.type) {
      case constants.HYDRATE_TYPE:
        const value = storage.getItem(itemId)
        if (value) return reducer(value, { type: null })
        // return initial state defined by reducer
        return reducer(undefined, { type: null })
      default:
        const result = reducer(state, action)
        if (action[constants.PERSIST_VALUE]) {
          storage.setItem(itemId, result)
        }
        return result
    }
  }

  return wrappedReducer
}

const defaultConfig: Config = {
  manualHydration: false,
  manualPersistance: false,
  blacklist: []
}

export const nonVolatileStore = (store: Store, config = defaultConfig) => {
  const purge: () => void = () => {
    Array.from(itemIds).forEach(id => localStorage.removeItem(id))
  }

  const dispatch = (action: AnyAction) => {
    const blacklist = config.blacklist || []
    const manualPersistance = config.manualPersistance || false
    action[constants.PERSIST_VALUE] =
      !paused && !blacklist.includes(action.type) && !manualPersistance
    return store.dispatch(action)
  }

  const _store: NonVolatileStore = {
    ...store,
    dispatch,
    purge,
    resume: () => {
      paused = false
    },
    pause: () => {
      paused = true
    },
    persist: () => {
      dispatch({ type: constants.PERSIST_ACTION })
    }
  }

  if (!config.manualHydration) {
    _store.dispatch({ type: constants.HYDRATE_TYPE })
  }
  return _store
}
