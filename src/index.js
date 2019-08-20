import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

import './index.css'
import App from './App'
import mainReducer from './reducers'

const composeMiddlewares = () => {
  const middlewares = [
    applyMiddleware(thunk),
  ]
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }
  return compose.apply(compose, middlewares)
}

const persistedReducer = persistReducer({
  key: 'root',
  storage,
}, mainReducer)

let store = createStore(
  persistedReducer,
  composeMiddlewares()
)

const persistor = persistStore(store)
window.store = store

ReactDOM.render(
  <Provider store={ store }>
    <PersistGate loading={ null } persistor={ persistor }>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
