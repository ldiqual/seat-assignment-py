import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

class SummaryContainer extends React.Component {

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {

        const tags = this.props.tableTags[rowIndex][colIndex]
        const constraintForTable = _.find(this.props.positionConstraints, constraint => {
          return constraint.tableLocation.rowIndex === rowIndex && constraint.tableLocation.colIndex === colIndex
        })

        let text
        if (constraintForTable) {
          text = <b>{ constraintForTable.employeeName }</b>
        } else {
          text = <i>{ tags.join('\n') }</i>
        }

        return (
          <td key={ colIndex } className={ hasTable ? 'selected' : '' }>
            { text }
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

      const constraintDescriptions = _.map(constraint.allowedDistances, distance => {
        switch (distance) {
        case 'next':
          return 'next to each other'
        case 'front':
          return 'in front of each other'
        case 'diagonal':
          return 'diagonally'
        default:
          return '?'
        }
      })

      return (
        <li key={ constraint.id }>
          <b>{ constraint.employee1Name }</b> and <b>{ constraint.employee2Name }</b> have to sit { constraintDescriptions.join(', or ') }
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
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
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
    positionConstraints: state.positionConstraints,
    tableTags: state.tableTags,
  }
}

export default connect(mapStateToProps)(SummaryContainer)
