# redux-save

Redux store in browser LocalStorage

### Features

- Persists redux store to LocalStorage
- Can manually or automatically persist to storage
- Loads reducer data from stroage manually or automatically

### Demo

```js
import { createStore } from 'redux'
import { save, nonVolatileStore } from 'redux-save'
const reducer = (state, action) => state
const persistedReducer = save('example', reducer)
const store = nonVolatileStore(createStore(persistedReducer))
```

When the store is created, store will look for existing data in LocalStorage with the `example` item id. If found, the reducer's state is hydrated from the existing state. This automatic hydration can be disabled by setting the `manualHydration` value to `true` in the store `config` parameter.

When an action is dispatched, the reducer is executed and the result is persisted to the store.

## API

### `save(itemId: string, reducer: Reducer): Reducer`

**parameters**

- `itemID` - The item id when using the `window.localStorage` api. _This must be unique for each reducer._
- `reducer` - The redux reducer to wrap.

### `nonVolatileStore(store: Store, config: Config): NonVolatileStore`

**parameters**

- `store` - The redux store to wrap in order to enable persistance
- `config` - Config object for redux-save

### `Config: Object`

| Key               | Type       | Default | Description                                                                                            |
| ----------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------ |
| manualHydration   | `boolean`  | `false` | If `true`, store values are automatically hydrated from LocalStorage upon store creation.              |
| manualPersistance | `boolean`  | `false` | If `true`, store data for reducers are automatically persisted to LocalStorage when action dispatched. |
| blacklist         | `string[]` | []      | Action types that will not trigger reducer state to be persisted.                                      |

### `NonVolatileStore` extends `Store` from `redux`

Extension of the `Store` object from `redux.` `dispatch(action: Action)` and `getState(): any` are available.

**methods**

- `pause()` - Pauses manual and automatic persistance to `localStore`
- `resume()` - Resumes manual and automatic persistance to `localStore`
- `persist()` - Manually trigger persistance to `localStore`
- `purge()` - Purges all stored data in `localStore`
