const _ = require('lodash')

let mainReducer = function(state, action) {

  switch (action.type) {

  case 'SET_NUM_ROWS': {
    const numCols = state.layout.length > 0 ? state.layout[0].length : 0
    const layout = _.map(_.range(action.numRows), function() {
      return _.map(_.range(numCols), function() {
        return false
      })
    })
    return _.assign({}, state, {
      layout: layout
    })
  }

  case 'SET_NUM_COLS': {
    const numRows = state.layout.length
    const layout = _.map(_.range(numRows), function() {
      return _.map(_.range(action.numCols), function() {
        return false
      })
    })
    return _.assign({}, state, {
      layout: layout
    })
  }

  case 'ADD_EMPLOYEE':
    return _.assign({}, state, {
      employeeNames: [...state.employeeNames, action.employeeName]
    })

  case 'ADD_TAG':
    return _.assign({}, state, {
      tags: [...state.tags, action.tag]
    })

  default:
    return _.assign({}, state)
  }
}

module.exports = mainReducer
