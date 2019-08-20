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

    return {
      ...state,
      layout: layout,
      tableTags: tableTags
    }
  }

  case 'SET_NUM_COLS': {
    const numRows = state.layout.length
    const numCols = action.payload
    const currentNumCols = state.layout.length > 0 ? state.layout[0].length : 0

    let layout
    if (numCols <= currentNumCols) {
      layout = _.map(state.layout, (row) => _.take(row, numCols))
    } else {
      layout = _.map(state.layout, (row) => {
        let oldCols = _.cloneDeep(row)
        let newCols = _.times(numCols - currentNumCols, () => false)
        return _.concat(oldCols, newCols)
      })
    }

    let tableTags
    if (numCols <= currentNumCols) {
      tableTags = _.map(state.tableTags, (row) => _.take(row, numCols))
    } else {
      tableTags = _.map(state.tableTags, (row) => {
        let oldCols = _.cloneDeep(row)
        let newCols = _.times(numCols - currentNumCols, () => [])
        return _.concat(oldCols, newCols)
      })
    }

    return {
      ...state,
      layout: layout,
      tableTags: tableTags
    }
  }

  case 'ADD_EMPLOYEE': {
    const employeeName = action.payload
    return {...state, employeeNames: [...state.employeeNames, employeeName]}
  }

  case 'ADD_TAG': {
    const tag = action.payload
    return {...state, tags: [...state.tags, tag]}
  }

  case 'SET_EMPLOYEE_TAG': {
    const { employeeName, tag } = action.payload
    const newEmployeeTags = _.assign({}, state.employeeTags)
    newEmployeeTags[employeeName] = tag
    return {...state, employeeTags: newEmployeeTags}
  }

  case 'SET_LOCATION_HAS_TABLE': {
    const { rowIndex, colIndex, hasTable } = action.payload
    const layout = _.cloneDeep(state.layout)
    layout[rowIndex][colIndex] = hasTable
    const tableTags = _.cloneDeep(state.tableTags)
    tableTags[rowIndex][colIndex] = []
    return {
      ...state,
      layout: layout,
      tableTags: tableTags
    }
  }

  case 'TOGGLE_TAG_FOR_TABLE': {
    const { rowIndex, colIndex, tag } = action.payload
    const tags = state.tableTags[rowIndex][colIndex]
    const tableAlreadyHasThisTag = _.includes(tags, tag)
    const tableTags = _.cloneDeep(state.tableTags)
    tableTags[rowIndex][colIndex] = tableAlreadyHasThisTag
      ? _.without(tags, tag)
      : _.concat(tags, tag)
    return {...state, tableTags: tableTags}
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
    return {...state, distanceConstraints: distanceConstraints}
  }

  case 'SET_SOLVER_STATE': {
    switch (action.state) {
    case 'loading':
      return {...state, solverState: { state: 'loading' }}
    case 'succeeded':
      return {
        ...state,
        solverState: {
          state: 'succeeded',
          assignments: action.assignments
        }
      }
    case 'failed':
      return {...state, solverState: { state: 'failed' }}
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

    return {
      ...state,
      employeeNames: employeeNames,
      employeeTags: employeeTags,
      distanceConstraints: distanceConstraints
    }
  }

  case 'DELETE_TAG': {
    const tag = action.payload
    const tags = _.without(state.tags, tag)
    let tableTags = _.map(_.cloneDeep(state.tableTags), (cols) => {
      return _.map(cols, (tags) => _.without(tags, tag))
    })
    const employeeTags = _.omitBy(state.employeeTags, value => value === tag)
    return {
      ...state,
      tags: tags,
      tableTags: tableTags,
      employeeTags: employeeTags
    }
  }

  case 'DELETE_DISTANCE_CONSTRAINT': {
    const constraintId = action.payload
    const constraints = _.reject(state.distanceConstraints, constraint => constraint.id === constraintId)
    return {...state, distanceConstraints: constraints}
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
