import { isEqual } from 'lodash'
import { Action, createStore } from 'redux'
import { nonVolatileStore, save } from '../src/index'
import { constants, NonVolatileStore } from '../src/types'
import storage from '../src/storage'

type State = {
  [key: string]: any
}

const ITEM_ID = 'fake'

describe('redux save', () => {
  describe('simple state', () => {
    const initialState: State = {
      title: 'fake',
      description: 'fake description'
    }
    const mockReducer = jest.fn(
      (state: State = initialState, action: Action) => {
        return state
      }
    )
    const reducer = save(ITEM_ID, mockReducer)
    let store: NonVolatileStore

    beforeEach(() => {
      localStorage.clear()
      store = nonVolatileStore(createStore(reducer))
      mockReducer.mockClear()
      store.purge()
    })

    test('getState returns proper initial state', () => {
      const state = store.getState()
      expect(isEqual(state, initialState)).toEqual(true)
    })

    test('Action should contain persist key', () => {
      store.dispatch({ type: 'MOCK' })
      const call = mockReducer.mock.calls[0]
      const [_, action] = call
      expect(constants.PERSIST_VALUE in action).toEqual(true)
    })

    test('Reducer should receive correct state', () => {
      store.dispatch({ type: 'MOCK' })
      const call = mockReducer.mock.calls[0]
      const [state, action] = call
      expect(isEqual(initialState, state)).toEqual(true)
    })

    test('Warning thrown when duplicate IDs used', () => {
      const createWithDuplicateItemId = () => {
        save(ITEM_ID, mockReducer)
      }
      console.warn = jest.fn()

      createWithDuplicateItemId()
      expect(console.warn).toBeCalledWith(
        constants.DUPLICATE_ID_WARNING + ITEM_ID
      )
    })

    test('State is in local storage after dispatch', () => {
      store.dispatch({ type: 'MOCK' })
      const value = localStorage.getItem(ITEM_ID)
      expect(value).not.toBeNull()
      const retrievedState = JSON.parse(value as string)
      expect(isEqual(retrievedState, initialState))
    })

    test('Manual hydration setting should prevent initial hydration', () => {
      let previousState: State = { ...initialState, title: 'previous' }
      localStorage.setItem(ITEM_ID, JSON.stringify(previousState))
      store = nonVolatileStore(createStore(reducer), { manualHydration: true })
      const state = store.getState()
      expect(isEqual(state, initialState)).toBe(true)
      expect(isEqual(state, previousState)).toBe(false)
    })

    test('State should be hydrated on initialization when manualHydration is false', () => {
      let previousState: State = { ...initialState, title: 'previous' }
      localStorage.setItem(ITEM_ID, JSON.stringify(previousState))
      store = nonVolatileStore(createStore(reducer), { manualHydration: false })
      const state = store.getState()
      expect(isEqual(state, previousState)).toBe(true)
      expect(isEqual(state, initialState)).toBe(false)
    })
  })

  describe('Nested State', () => {
    const initialState: State = {
      title: 'nested',
      children: [
        { title: 'child' },
        { title: 'child' },
        { title: 'childWithChildren', children: [{ title: 'grandchild' }] }
      ]
    }
    const mockReducer = jest.fn(
      (state: State = initialState, action: Action) => {
        return state
      }
    )
    const reducer = save(ITEM_ID, mockReducer)
    let store: NonVolatileStore

    beforeEach(() => {
      localStorage.clear()
      store = nonVolatileStore(createStore(reducer))
      mockReducer.mockClear()
      store.purge()
    })

    test('getState returns proper initial state', () => {
      const state = store.getState()
      expect(isEqual(state, initialState)).toEqual(true)
    })

    test('Store is hydrated with previous state if manualHydration is false', () => {
      const previousState = { ...initialState, title: 'previous' }
      localStorage.setItem(ITEM_ID, JSON.stringify(previousState))
      store = nonVolatileStore(createStore(reducer), { manualHydration: false })
      const state = store.getState()
      expect(isEqual(state, previousState)).toEqual(true)
      expect(isEqual(state, initialState)).toEqual(false)
    })

    test('Store is not hydrated with previous state if manualHydration is true', () => {
      const previousState = { ...initialState, title: 'previous' }
      localStorage.setItem(ITEM_ID, JSON.stringify(previousState))
      store = nonVolatileStore(createStore(reducer), { manualHydration: false })
      const state = store.getState()
      expect(isEqual(state, previousState)).toEqual(true)
      expect(isEqual(state, initialState)).toEqual(false)
    })

    test('Pause prevents writes to storage', () => {
      store.pause()
      store.dispatch({ type: 'MOCK' })
      expect(localStorage.getItem(ITEM_ID)).toBeNull()
      store.persist()
      expect(localStorage.getItem(ITEM_ID)).toBeNull()
      store.resume()
      store.persist()
      expect(localStorage.getItem(ITEM_ID)).not.toBeNull()
    })
  })

  describe('Storage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    test('setItem', () => {
      const state = {
        title: 'test'
      }
      storage.setItem(ITEM_ID, state)
      const value = storage.getItem(ITEM_ID)
      expect(isEqual(value, state)).toEqual(true)
    })

    test('getItem returns null if item id does not exist.', () => {
      const value = storage.getItem('invalid')
      expect(value).toBeNull()
    })
  })
})
