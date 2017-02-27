const React = require('react')
const ReactDOM = require('react-dom')
const Provider = require('react-redux').Provider
const Redux = require('redux')
const _ = require('lodash')
const thunk = require('redux-thunk').default
const persistStore = require('redux-persist').persistStore
const autoRehydrate = require('redux-persist').autoRehydrate

require('./index.css')
const App = require('./App')
const mainReducer = require('./reducers')

const composeMiddlewares = () => {
  const middlewares = [
    Redux.applyMiddleware(thunk),
    autoRehydrate()
  ]
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }
  return Redux.compose.apply(Redux.compose, middlewares)
}

let store = Redux.createStore(
  mainReducer,
  mainReducer.initialState(),
  composeMiddlewares()
)

persistStore(store)
window.store = store

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
