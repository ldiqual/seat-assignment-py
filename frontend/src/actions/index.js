const axios = require('axios')
const _ = require('lodash')

function setNumRows(numRows) {
  return {
    type: 'SET_NUM_ROWS',
    numRows: numRows
  }
}

function setNumCols(numCols) {
  return {
    type: 'SET_NUM_COLS',
    numCols: numCols
  }
}

function addEmployee(employeeName) {
  return {
    type: 'ADD_EMPLOYEE',
    employeeName: employeeName
  }
}

function addTag(tag) {
  return {
    type: 'ADD_TAG',
    tag: tag
  }
}

function setEmployeeTag(employeeName, tag) {
  return {
    type: 'SET_EMPLOYEE_TAG',
    employeeName: employeeName,
    tag: tag
  }
}

function setLocationHasTable(rowIndex, colIndex, hasTable) {
  return {
    type: 'SET_LOCATION_HAS_TABLE',
    rowIndex: rowIndex,
    colIndex: colIndex,
    hasTable: hasTable
  }
}

function setIsAssigningTags(isAssigningTags) {
  return {
    type: 'SET_IS_ASSIGNING_TAGS',
    isAssigningTags: isAssigningTags
  }
}

function setCurrentTagBeingAssigned(tag) {
  return {
    type: 'SET_CURRENT_TAG_BEING_ASSIGNED',
    tag: tag
  }
}

function toggleTagForTable(rowIndex, colIndex, tag) {
  return {
    type: 'TOGGLE_TAG_FOR_TABLE',
    rowIndex: rowIndex,
    colIndex: colIndex,
    tag: tag
  }
}

function addDistanceConstraint(employee1Name, employee2Name, distance) {
  return {
    type: 'ADD_DISTANCE_CONSTRAINT',
    employee1Name: employee1Name,
    employee2Name: employee2Name,
    distance: distance
  }
}

function solve() {
  return (dispatch, getState) => {

    const state = _.pick(getState(), [
      'layout',
      'employeeNames',
      'employeeTags',
      'tableTags',
      'distanceConstraints'
    ])

    dispatch({
      type: 'SET_SOLVER_STATE',
      state: 'loading'
    })

    let url = process.env.NODE_ENV === 'production'
      ? 'https://table-seating-solver-api.herokuapp.com/solve'
      : 'http://localhost:5000/solve'

    axios.post(url, state)
    .then(result => {
      if (!result.data.success) {
        dispatch({
          type: 'SET_SOLVER_STATE',
          state: 'failed'
        })
        return
      }

      dispatch({
        type: 'SET_SOLVER_STATE',
        state: 'succeeded',
        assignments: result.data.assignments
      })
    })
    .catch(error => {
      dispatch({
        type: 'SET_SOLVER_STATE',
        state: 'failed'
      })
    })
  }
}

function deleteEmployee(employeeName) {
  return {
    type: 'DELETE_EMPLOYEE',
    employeeName: employeeName
  }
}

function deleteTag(tag) {
  return {
    type: 'DELETE_TAG',
    tag: tag
  }
}

function deleteDistanceConstraint(constraint) {
  return {
    type: 'DELETE_DISTANCE_CONSTRAINT',
    constraintId: constraint.id
  }
}

export {
  setNumRows,
  setNumCols,
  addEmployee,
  addTag,
  setEmployeeTag,
  setLocationHasTable,
  setIsAssigningTags,
  setCurrentTagBeingAssigned,
  toggleTagForTable,
  addDistanceConstraint,
  solve,
  deleteEmployee,
  deleteTag,
  deleteDistanceConstraint,
}
