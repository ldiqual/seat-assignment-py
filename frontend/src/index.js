const React = require('react')
const ReactDOM = require('react-dom')
const Provider = require('react-redux').Provider
const Redux = require('redux')
const _ = require('lodash')

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
}

let store = Redux.createStore(
  mainReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

window.store = store

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
