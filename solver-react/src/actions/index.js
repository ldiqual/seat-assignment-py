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

export {
  setNumRows,
  setNumCols
}
