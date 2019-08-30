import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button } from 'react-bootstrap'

import Actions from '../actions'

class PositionConstraintSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      employeeName: undefined,
      tableLocation: undefined
    }
  }

  submit = (event) => {

    const employeeName = this.state.employeeName
    const tableLocation = this.state.tableLocation

    if (!employeeName || !tableLocation) {
      return
    }

    const constraintForEmployee = _.find(this.props.positionConstraints, constraint => constraint.employeeName === employeeName)
    if (constraintForEmployee) {
      return
    }

    const constraintForTable = _.find(this.props.positionConstraints, constraint => {
      return constraint.tableLocation.rowIndex === tableLocation.rowIndex && constraint.tableLocation.colIndex === tableLocation.colIndex
    })
    if (constraintForTable) {
      return
    }

    this.setState({
      employeeName: undefined,
      tableLocation: undefined
    })

    this.props.dispatch(Actions.addPositionConstraint(employeeName, tableLocation))
  }

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {
        const selectTable = () => {

          if (!this.state.employeeName) {
            return
          }

          this.setState({
            tableLocation: {
              rowIndex: rowIndex,
              colIndex: colIndex
            }
          }, this.submit)
        }

        const constraintForTable = _.find(this.props.positionConstraints, constraint => {
          return constraint.tableLocation.rowIndex === rowIndex && constraint.tableLocation.colIndex === colIndex
        })

        const classes = []
        let text
        if (constraintForTable) {
          classes.push('assigned')
          text = constraintForTable.employeeName
        } else if (hasTable) {
          classes.push('selected')
          text = ''
        }

        const deleteConstraint = (event) => {
          if (!constraintForTable) {
            return
          }
          this.props.dispatch(Actions.deletePositionConstraint(constraintForTable))
        }

        const dropdownId = `dropdown-position-constraint-row-${rowIndex}-col-${colIndex}`

        return (
          <td key={ colIndex } onClick={ selectTable } className={ classes }>
            <div className="dropdown">
              <div className="dropdown-toggle" id={ dropdownId } data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                { text }
              </div>
              <ul className="dropdown-menu" aria-labelledby={ dropdownId }>
                <li>
                  <a onClick={ deleteConstraint }>
                    <span className="text-danger">Delete</span>
                  </a>
                </li>
              </ul>
            </div>
          </td>
        )
      })
      return <tr key={ rowIndex }>{ cols }</tr>
    })

    const assignedEmployeeNames = _.map(this.props.positionConstraints, constraint => constraint.employeeName)
    const unassignedEmployeeNames = _.difference(this.props.employeeNames, assignedEmployeeNames)

    let employeeLis

    if (unassignedEmployeeNames.length > 0) {
      employeeLis = _.map(unassignedEmployeeNames, (employeeName) => {

        const selectEmployee = () => {
          this.setState({ employeeName: employeeName })
        }

        const variant = this.state.employeeName === employeeName ? 'primary' : 'secondary'
        return (
          <li key={ employeeName }>
            <Button size="sm" variant={ variant } onClick={ selectEmployee }>
              { employeeName }
            </Button>
          </li>
        )
      })
    } else {
      employeeLis = [
        <li key="noEmployee">No employees to assign</li>
      ]
    }

    return (
      <div id="position-constraint-container">
        <h2>Position constraints</h2>

        <p>You can force the solver to assign specific employees to specific tables.</p>

        <div className="row">
          <div className="col-md-4">
            <h5>Step 1 – Choose an employee</h5>
            <ul>{ employeeLis }</ul>
          </div>
          <div className="col-md-8">
            <h5>Step 2 – Choose a table</h5>
            <table id="position-constraint-table">
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    employeeNames: state.employeeNames,
    layout: state.layout,
    positionConstraints: state.positionConstraints
  }
}

export default connect(mapStateToProps)(PositionConstraintSettings)
