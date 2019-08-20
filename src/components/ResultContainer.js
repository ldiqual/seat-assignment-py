import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Actions from '../actions'

class ResultContainer extends React.Component {

  solve = () => {
    this.props.dispatch(Actions.solve())
  }

  reset = () => {
    this.props.dispatch(Actions.reset())
  }

  render() {

    let isLoading = this.props.solverState.state === 'loading'
    let buttonClasses = ['btn', isLoading ? 'btn-info' : 'btn-primary']
    let span = isLoading
      ? <span className="glyphicon glyphicon-refresh spinning"></span>
      : <span className="glyphicon glyphicon-play"></span>

    let table
    if (this.props.solverState.state === 'succeeded') {
      const assignments = this.props.solverState.assignments
      const rows = _.map(assignments, (row, rowIndex) => {
        const cols = _.map(row, (employeeName, colIndex) => {
          const hasTable = this.props.layout[rowIndex][colIndex]
          return <td key={ colIndex } className={ hasTable ? 'selected' : '' }>{ employeeName || '' }</td>
        })
        return <tr key={ rowIndex }>{ cols }</tr>
      })

      table = (
        <table id="result-table">
          <tbody>
            { rows }
          </tbody>
        </table>
      )
    }

    let error
    if (this.props.solverState.state === 'failed') {
      error = <span id="result-error" className="text-danger">We couldn't find an optimal seat layout given the data you provided.</span>
    }

    return (
      <div id="result-container">
        <p id="result-actions">
          <button type="button" onClick={ this.solve } className={ buttonClasses.join(' ') }>
            { span } { isLoading ? 'Solving...' : 'Solve this!' }
          </button>
          <button type="button" onClick={ this.reset } className="btn btn-danger">
            <span className="glyphicon glyphicon-repeat"></span> Start over
          </button>
          { error }
        </p>

        { table }

      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    layout: state.layout,
    employeeNames: state.employeeNames,
    employeeTags: state.employeeTags,
    distanceConstraints: state.distanceConstraints,
    tableTags: state.tableTags,
    solverState: state.solverState
  }
}

export default connect(mapStateToProps)(ResultContainer)
