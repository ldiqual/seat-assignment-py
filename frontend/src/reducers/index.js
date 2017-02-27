const _ = require('lodash')
const uuid = require('uuid/v4')

let mainReducer = function(state, action) {

  switch (action.type) {

  case 'SET_NUM_ROWS': {

    const currentNumRows = state.layout.length = state.layout.length
    const numCols = state.layout.length > 0 ? state.layout[0].length : 0
    const numRows = action.payload

    let layout
    if (numRows <= currentNumRows) {
      layout = _.take(state.layout, numRows)
    } else {
      const oldLayout = _.cloneDeep(state.layout)
      const newRows = _.times(numRows - currentNumRows, () => _.times(numCols, () => false))
      layout = _.concat(oldLayout, newRows)
    }

    let tableTags
    if (numRows <= currentNumRows) {
      tableTags = _.take(state.tableTags, numRows)
    } else {
      const oldTableTags = _.cloneDeep(state.tableTags)
      const newRows = _.times(numRows - currentNumRows, () => _.times(numCols, () => []))
      tableTags = _.concat(oldTableTags, newRows)
    }

    return _.assign({}, state, {
      layout: layout,
      tableTags: tableTags
    })
  }

  case 'SET_NUM_COLS': {
    const numRows = state.layout.length
    const numCols = action.payload
    const currentNumCols = state.layout.length > 0 ? state.layout[0].length : 0

    let layout
    if (numCols <= currentNumCols) {
      layout = _.map(state.layout, (row) => {
        return _.take(row, numCols)
      })
    } else {
      layout = _.map(state.layout, (row) => {
        let newRow = _.cloneDeep(row)
        _.each(_.range(numCols - currentNumCols), () => {
          newRow.push(false)
        })
        return newRow
      })
    }

    let tableTags
    if (numCols <= currentNumCols) {
      tableTags = _.map(state.tableTags, (row) => {
        return _.take(row, numCols)
      })
    } else {
      tableTags = _.map(state.tableTags, (row) => {
        let newRow = _.cloneDeep(row)
        _.each(_.range(numCols - currentNumCols), () => {
          newRow.push([])
        })
        return newRow
      })
    }

    return _.assign({}, state, {
      layout: layout,
      tableTags: tableTags
    })
  }

  case 'ADD_EMPLOYEE': {
    const employeeName = action.payload
    return _.assign({}, state, {
      employeeNames: [...state.employeeNames, employeeName]
    })
  }

  case 'ADD_TAG': {
    const tag = action.payload
    let currentTagBeingAssigned = state.currentTagBeingAssigned
    if (!currentTagBeingAssigned && state.isAssigningTags) {
      currentTagBeingAssigned = tag
    }
    return _.assign({}, state, {
      tags: [...state.tags, tag],
      currentTagBeingAssigned: currentTagBeingAssigned
    })
  }

  case 'SET_EMPLOYEE_TAG': {
    const { employeeName, tag } = action.payload
    const newEmployeeTags = _.assign({}, state.employeeTags)
    newEmployeeTags[employeeName] = tag
    return _.assign({}, state, {
      employeeTags: newEmployeeTags
    })
  }

  case 'SET_LOCATION_HAS_TABLE': {
    const { rowIndex, colIndex, hasTable } = action.payload
    const layout = _.cloneDeep(state.layout)
    layout[rowIndex][colIndex] = hasTable
    const tableTags = _.cloneDeep(state.tableTags)
    tableTags[rowIndex][colIndex] = []
    return _.assign({}, state, {
      layout: layout,
      tableTags: tableTags
    })
  }

  case 'TOGGLE_TAG_FOR_TABLE': {
    const { rowIndex, colIndex, tag } = action.payload
    const tags = state.tableTags[rowIndex][colIndex]
    const tableAlreadyHasThisTag = _.includes(tags, tag)
    const tableTags = _.cloneDeep(state.tableTags)
    tableTags[rowIndex][colIndex] = tableAlreadyHasThisTag
      ? _.without(tags, tag)
      : _.concat(tags, tag)
    return _.assign({}, state, {
      tableTags: tableTags
    })
  }

  case 'ADD_DISTANCE_CONSTRAINT': {
    const { employee1Name, employee2Name, distance } = action.payload
    const distanceConstraints = _.clone(state.distanceConstraints)
    distanceConstraints.push({
      id: uuid(),
      employee1Name: employee1Name,
      employee2Name: employee2Name,
      distance: distance,
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
    const employeeName = action.payload
    const employeeNames = _.without(state.employeeNames, employeeName)
    const employeeTags = _.omit(state.employeeTags, employeeName)
    const distanceConstraints = _.reject(state.distanceConstraints, (constraint) => {
      return constraint.employee1Name === employeeName || constraint.employee2Name === employeeName
    })

    return _.assign({}, state, {
      employeeNames: employeeNames,
      employeeTags: employeeTags,
      distanceConstraints: distanceConstraints
    })
  }

  case 'DELETE_TAG': {
    const tag = action.payload
    const tags = _.without(state.tags, tag)
    const tableTags = _.cloneDeep(state.tableTags)
    _.each(tableTags, (row) => {
      _.each(row, (tags) => {
        _.pull(tags, tag)
      })
    })
    const employeeTags = _.omitBy(state.employeeTags, value => value === tag)
    return _.assign({}, state, {
      tags: tags,
      tableTags: tableTags,
      employeeTags: employeeTags
    })
  }

  case 'DELETE_DISTANCE_CONSTRAINT': {
    const constraintId = action.payload
    const constraints = _.reject(state.distanceConstraints, constraint => constraint.id === constraintId)
    return _.assign({}, state, {
      distanceConstraints: constraints
    })
  }

  case 'RESET': {
    return mainReducer.initialState()
  }

  default:
    return _.assign({}, state)
  }
}

mainReducer.initialState = function() {

  const initialLayout = _.times(10, () => _.times(10, () => false))
  const initialTableTags = _.times(10, () => _.times(10, () => []))

  return {
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
}

module.exports = mainReducer
