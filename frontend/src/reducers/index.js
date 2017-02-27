const _ = require('lodash')
const uuid = require('uuid/v4')

let mainReducer = function(state, action) {

  switch (action.type) {

  case 'SET_NUM_ROWS': {
    const numCols = state.layout.length > 0 ? state.layout[0].length : 0
    const layout = _.map(_.range(action.numRows), function() {
      return _.map(_.range(numCols), function() {
        return false
      })
    })
    const tableTags = _.map(_.range(action.numRows), function() {
      return _.map(_.range(numCols), function() {
        return []
      })
    })
    return _.assign({}, state, {
      layout: layout,
      tableTags: tableTags
    })
  }

  case 'SET_NUM_COLS': {
    const numRows = state.layout.length
    const layout = _.map(_.range(numRows), function() {
      return _.map(_.range(action.numCols), function() {
        return false
      })
    })
    const tableTags = _.map(_.range(numRows), function() {
      return _.map(_.range(action.numCols), function() {
        return []
      })
    })
    return _.assign({}, state, {
      layout: layout,
      tableTags: tableTags
    })
  }

  case 'ADD_EMPLOYEE': {
    return _.assign({}, state, {
      employeeNames: [...state.employeeNames, action.employeeName]
    })
  }

  case 'ADD_TAG': {
    let currentTagBeingAssigned = state.currentTagBeingAssigned
    if (!currentTagBeingAssigned && state.isAssigningTags) {
      currentTagBeingAssigned = action.tag
    }
    return _.assign({}, state, {
      tags: [...state.tags, action.tag],
      currentTagBeingAssigned: currentTagBeingAssigned
    })
  }

  case 'SET_EMPLOYEE_TAG': {
    const newEmployeeTags = _.assign({}, state.employeeTags)
    newEmployeeTags[action.employeeName] = action.tag
    return _.assign({}, state, {
      employeeTags: newEmployeeTags
    })
  }

  case 'SET_LOCATION_HAS_TABLE': {
    const layout = _.cloneDeep(state.layout)
    layout[action.rowIndex][action.colIndex] = action.hasTable
    const tableTags = _.cloneDeep(state.tableTags)
    tableTags[action.rowIndex][action.colIndex] = []
    return _.assign({}, state, {
      layout: layout,
      tableTags: tableTags
    })
  }

  case 'SET_IS_ASSIGNING_TAGS': {
    return _.assign({}, state, {
      isAssigningTags: action.isAssigningTags,
      currentTagBeingAssigned: state.tags[0]
    })
  }

  case 'SET_CURRENT_TAG_BEING_ASSIGNED': {
    return _.assign({}, state, {
      currentTagBeingAssigned: action.tag
    })
  }

  case 'TOGGLE_TAG_FOR_TABLE': {
    const tags = state.tableTags[action.rowIndex][action.colIndex]
    const tableAlreadyHasThisTag = _.includes(tags, action.tag)
    const tableTags = _.cloneDeep(state.tableTags)
    tableTags[action.rowIndex][action.colIndex] = tableAlreadyHasThisTag
      ? _.without(tags, action.tag)
      : _.concat(tags, action.tag)
    return _.assign({}, state, {
      tableTags: tableTags
    })
  }

  case 'ADD_DISTANCE_CONSTRAINT': {
    const distanceConstraints = _.clone(state.distanceConstraints)
    distanceConstraints.push({
      id: uuid(),
      employee1Name: action.employee1Name,
      employee2Name: action.employee2Name,
      distance: action.distance,
    })
    return _.assign({}, state, {
      distanceConstraints: distanceConstraints
    })
  }

  case 'SET_SOLVER_STATE': {
    switch (action.state) {
    case 'loading':
      return _.assign({}, state, {
        solverState: { state: 'loading' }
      })
    case 'succeeded':
      return _.assign({}, state, {
        solverState: {
          state: 'succeeded',
          assignments: action.assignments
        }
      })
    case 'failed':
      return _.assign({}, state, {
        solverState: { state: 'failed' }
      })
    default:
      return;
    }
  }

  case 'DELETE_EMPLOYEE': {
    const employeeNames = _.without(state.employeeNames, action.employeeName)
    const employeeTags = _.omit(state.employeeTags, action.employeeName)
    const distanceConstraints = _.reject(state.distanceConstraints, (constraint) => {
      return constraint.employee1Name === action.employeeName || constraint.employee2Name === action.employeeName
    })

    return _.assign({}, state, {
      employeeNames: employeeNames,
      employeeTags: employeeTags,
      distanceConstraints: distanceConstraints
    })
  }

  case 'DELETE_TAG': {
    const tags = _.without(state.tags, action.tag)
    const tableTags = _.cloneDeep(state.tableTags)
    _.each(tableTags, (row) => {
      _.each(row, (tags) => {
        _.pull(tags, action.tag)
      })
    })
    const employeeTags = _.omitBy(state.employeeTags, value => value === action.tag)
    return _.assign({}, state, {
      tags: tags,
      tableTags: tableTags,
      employeeTags: employeeTags
    })
  }

  case 'DELETE_DISTANCE_CONSTRAINT': {
    const constraints = _.reject(state.distanceConstraints, constraint => constraint.id === action.constraintId)
    return _.assign({}, state, {
      distanceConstraints: constraints
    })
  }

  default:
    return _.assign({}, state)
  }
}

module.exports = mainReducer
