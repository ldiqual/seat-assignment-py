import axios from 'axios'
import _ from 'lodash'
import { createAction } from 'redux-actions'

const setNumRows = createAction('SET_NUM_ROWS')
const setNumCols = createAction('SET_NUM_COLS')

const addEmployee = createAction('ADD_EMPLOYEE')
const deleteEmployee = createAction('DELETE_EMPLOYEE')
const addTag = createAction('ADD_TAG')
const deleteTag = createAction('DELETE_TAG')

const setEmployeeTag = createAction('SET_EMPLOYEE_TAG', (employeeName, tag) => {
  return { employeeName, tag }
})

const setLocationHasTable = createAction('SET_LOCATION_HAS_TABLE', (rowIndex, colIndex, hasTable) => {
  return { rowIndex, colIndex, hasTable }
})

const toggleTagForTable = createAction('TOGGLE_TAG_FOR_TABLE', (rowIndex, colIndex, tag) => {
  return { rowIndex, colIndex, tag }
})

const addDistanceConstraint = createAction('ADD_DISTANCE_CONSTRAINT', (employee1Name, employee2Name, allowedDistances) => {
  return { employee1Name, employee2Name, allowedDistances }
})

const addPositionConstraint = createAction('ADD_POSITION_CONSTRAINT', (employeeName, tableLocation) => {
  return { employeeName, tableLocation }
})

const deleteDistanceConstraint = createAction('DELETE_DISTANCE_CONSTRAINT', constraint => constraint.id)
const deletePositionConstraint = createAction('DELETE_POSITION_CONSTRAINT', constraint => constraint.id)

const reset = createAction('RESET')

function solve() {
  return (dispatch, getState) => {

    const state = _.pick(getState(), [
      'layout',
      'employeeNames',
      'employeeTags',
      'tableTags',
      'distanceConstraints',
      'positionConstraints',
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
      console.error(error)
      dispatch({
        type: 'SET_SOLVER_STATE',
        state: 'failed'
      })
    })
  }
}

export default {
  setNumRows,
  setNumCols,
  addEmployee,
  addTag,
  setEmployeeTag,
  setLocationHasTable,
  toggleTagForTable,
  addDistanceConstraint,
  deleteDistanceConstraint,
  addPositionConstraint,
  deletePositionConstraint,
  solve,
  deleteEmployee,
  deleteTag,
  reset
}
