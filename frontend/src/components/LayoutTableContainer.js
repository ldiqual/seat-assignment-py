import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Actions from '../actions'

class LayoutTableContainer extends React.Component {

  setNumRows = (event) => {
    const numRows = parseInt(event.target.value, 10)
    this.props.dispatch(Actions.setNumRows(numRows))
  }

  setNumCols = (event) => {
    const numCols = parseInt(event.target.value, 10)
    this.props.dispatch(Actions.setNumCols(numCols))
  }

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {
        const onClick = () => {
          this.props.dispatch(Actions.setLocationHasTable(rowIndex, colIndex, !hasTable))
        }
        return <td key={ colIndex } className={ hasTable ? 'selected' : '' } onClick={ onClick }></td>
      })
      return <tr key={ rowIndex }>{ cols }</tr>
    })

    const numRows = this.props.layout.length
    const numCols = numRows > 0 ? this.props.layout[0].length : 0

    return (
      <div id="layout-container">
        <h2>Table layout</h2>

        <p>First, define how your workspace is laid out by clicking on the cells where tables are placed.</p>

        <form id="layout-form" className="form-inline">
          <div className="form-group">
            <label htmlFor="rows-input">Rows</label>
            <input type="number" className="form-control" id="rows-input" value={ numRows } onChange={ this.setNumRows } placeholder="0" />
          </div>
          <div className="form-group">
            <label htmlFor="cols-input">Cols</label>
            <input type="number" className="form-control" id="cols-input" value={ numCols } onChange={ this.setNumCols } placeholder="0" />
          </div>
        </form>

        <table id="layout-table">
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    layout: state.layout
  }
}

export default connect(mapStateToProps)(LayoutTableContainer)
