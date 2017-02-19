const React = require('react')
const ReactDOM = require('react-dom')
const Provider = require('react-redux').Provider
const Redux = require('redux')
const _ = require('lodash')

require('./index.css')
const App = require('./App')
const mainReducer = require('./reducers')
const Actions = require('./actions')

let initialLayout = _.map(_.range(10), function() {
  return _.map(_.range(10), function() {
    return false
  })
})

let initialState = {
    layout: initialLayout,
    employeeNames: [],
    tags: [],
    employeeTags: {},
}

let store = Redux.createStore(mainReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
