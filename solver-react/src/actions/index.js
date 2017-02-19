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

export {
  setNumRows,
  setNumCols,
  addEmployee,
  addTag,
  setEmployeeTag,
}
