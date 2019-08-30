import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Actions from '../actions'

class EmployeeSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      employeeName: ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const employeeName = this.state.employeeName
    if (!employeeName || employeeName.length === 0) {
      return
    }

    if (_.includes(this.props.employeeNames, employeeName)) {
      return
    }

    this.setState({ employeeName: '' })
    this.props.dispatch(Actions.addEmployee(employeeName))
  }

  setEmployeeName = (event) => {
    const employeeName = event.target.value
    this.setState({ employeeName: employeeName })
  }

  render() {

    var employeeRows = _.map(this.props.employeeNames, (employeeName) => {

      const employeeTag = this.props.employeeTags[employeeName]
      const setEmployeeTag = (event) => {
        let tag = event.target.value
        this.props.dispatch(Actions.setEmployeeTag(employeeName, tag))
      }

      const deleteEmployee = (event) => {
        this.props.dispatch(Actions.deleteEmployee(employeeName))
      }

      const tagOptions = _.map(this.props.tags, (tag) => {
        return <option value={ tag } key={ tag }>{ tag }</option>
      })

      const cols = [
        <td key="actions" className="shrink">
          <button type="button" className="btn btn-danger btn-xs" onClick={ deleteEmployee }>
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        </td>,
        <td key="name" className="shrink">{ employeeName }</td>,
        <td key="tag" className="expand">
          <select value={ employeeTag } defaultValue="none" onChange={ setEmployeeTag } className="form-control">
            <option disabled value="none">Select a team</option>
            { tagOptions }
          </select>
        </td>
      ]

      return <tr key={ employeeName }>{ cols }</tr>
    })

    if (this.props.employeeNames.length === 0) {
      employeeRows = [
        <tr key="-1">
          <td key="actions">–</td>
          <td key="name"></td>
          <td key="tag"></td>
        </tr>
      ]
    }

    const errors = []
    _.each(this.props.employeeNames, (employeeName) => {
      const tag = this.props.employeeTags[employeeName]
      if (!tag) {
        errors.push(<li key={ `tag_${ employeeName }` }>Please select a team for <b>{ employeeName }</b></li>)
      }
    })

    const numEmployees = this.props.employeeNames.length
    const numTables = _.reduce(this.props.layout, (count, cols) => {
      return count + _.reduce(cols, (count, hasTable) => {
        return hasTable ? count + 1 : count
      }, 0)
    }, 0)
    if (numEmployees > numTables) {
      errors.push(
        <li key="too-many-tables">
          There are more employees <b>({ numEmployees })</b> than there are tables <b>({ numTables })</b>
        </li>
      )
    }

    let errorParagraph
    if (errors.length > 0) {
      errorParagraph = (
        <ul className="text-danger">
          { errors }
        </ul>
      )
    }

    return (
      <div id="employee-container">
        <h2>Employees</h2>

        <p>Add members of your company and indicate the team they belong to.</p>

        <form id="employee-form" onSubmit={ this.handleSubmit } className="form-horizontal">
          <div className="form-group">
            <label htmlFor="employee-name-input" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="employee-name-input" onChange={ this.setEmployeeName } value={ this.state.employeeName } placeholder="Jane Doe" />
            </div>
          </div>
        </form>

        { errorParagraph }

        <table id="employee-table" className="table table-striped">
          <tbody>{ employeeRows }</tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    employeeNames: state.employeeNames,
    employeeTags: state.employeeTags,
    tags: state.tags,
    layout: state.layout
  }
}

export default connect(mapStateToProps)(EmployeeSettings)
