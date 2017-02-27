const React = require('react')
const ReactDOM = require('react-dom')
const Provider = require('react-redux').Provider
const Redux = require('redux')
const _ = require('lodash')
const thunk = require('redux-thunk').default

require('./index.css')
const App = require('./App')
const mainReducer = require('./reducers')

let initialLayout = _.map(_.range(10), function() {
  return _.map(_.range(10), function() {
    return false
  })
})

let initialTableTags = _.map(_.range(10), function() {
  return _.map(_.range(10), function() {
    return []
  })
})

let initialState = {
    layout: initialLayout,
    employeeNames: [],
    tags: [],
    employeeTags: {},
    tableTags: initialTableTags,
    distanceConstraints: [],
    solverState: {
      state: 'idle'
    }
}

const composeMiddlewares = () => {
  const middlewares = [ Redux.applyMiddleware(thunk) ]
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }
  return Redux.compose.apply(Redux.compose, middlewares)
}

let store = Redux.createStore(
  mainReducer,
  initialState,
  composeMiddlewares()
)

window.store = store

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
