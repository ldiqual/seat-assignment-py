import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faSync, faRedo } from '@fortawesome/free-solid-svg-icons'

import Actions from '../actions'

class ResultContainer extends React.Component {

  solve = () => {
    this.props.dispatch(Actions.solve())
  }

  reset = () => {
    this.props.dispatch(Actions.reset())
  }

  render() {

    const isLoading = this.props.solverState.state === 'loading'
    const span = isLoading
      ? <FontAwesomeIcon icon={ faSync } className="spinning" />
      : <FontAwesomeIcon icon={ faPlay } />

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
          <Button variant={ isLoading ? "info" : "primary" } onClick={ this.solve }>
            { span } { isLoading ? 'Solving...' : 'Solve this!' }
          </Button>
          <Button variant="danger" onClick={ this.reset }>
            <FontAwesomeIcon icon={ faRedo } /> Start over
          </Button>
          { error }
        </p>

        { table }

      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    solverState: state.solverState,
    layout: state.layout
  }
}

export default connect(mapStateToProps)(ResultContainer)
