const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class ResultContainer extends React.Component {

  solve = () => {
    this.props.dispatch(Actions.solve())
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
          const hasTable = employeeName !== '-'
          return <td key={ colIndex } className={ hasTable ? 'selected' : '' }>{ employeeName }</td>
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

    return (
      <div id="result-container">
      <p>
        <button type="button" onClick={ this.solve } className={ buttonClasses.join(' ') }>
          { span } { isLoading ? 'Solving...' : 'Solve this!' }
        </button>
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

module.exports = ReactRedux.connect(mapStateToProps)(ResultContainer)
