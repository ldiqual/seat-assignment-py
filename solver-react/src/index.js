const React = require('react')
const ReactDOM = require('react-dom')
const Provider = require('react-redux').Provider
const Redux = require('redux')

require('./index.css')
const App = require('./App')
const mainReducer = require('./reducers')

console.log(mainReducer)

let initialState = {
    layout: [],
    employees: [],
    tags: [],
    employeeTags: {},
}

let store = Redux.createStore(mainReducer, initialState)

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
)
