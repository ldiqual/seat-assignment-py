const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

class SummaryContainer extends React.Component {

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {
        const tags = this.props.tableTags[rowIndex][colIndex]
        return (
          <td key={ colIndex } className={ hasTable ? 'selected' : '' }>
            { tags.join('\n') }
          </td>
        )
      })
      return <tr key={ rowIndex }>{ cols }</tr>
    })

    const employeeLis = _.map(this.props.employeeNames, (employeeName) => {
      const tag = this.props.employeeTags[employeeName]
      return <li key={ employeeName }><b>{ employeeName }</b> { tag ? `(${tag})` : ''}</li>
    })

    const constraints = _.map(this.props.distanceConstraints, (constraint) => {
      return (
        <li key={ constraint.id }>
          <b>{ constraint.employee1Name }</b> and <b>{ constraint.employee2Name }</b> have to be <b>{ constraint.distance }</b> tables apart
        </li>
      )
    })

    return (
      <div id="summary-container">
        <h2>Summary</h2>

        <p>Review the following information and click "Solve" to find the perfect seating assignments.</p>

        <div className="row">
          <div className="col-md-8">
            <table id="summary-table">
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <h4>Employees</h4>
            <ul>{ employeeLis }</ul>

            <h4>Constraints</h4>
            <ul>{ constraints }</ul>
          </div>
        </div>

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
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(SummaryContainer)
