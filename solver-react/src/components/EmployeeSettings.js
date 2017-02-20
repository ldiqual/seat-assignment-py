const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class EmployeeSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const employeeName = this.state.employeeName
    if (!employeeName || employeeName.length === 0) {
      return
    }

    this.props.dispatch(Actions.addEmployee(employeeName))
  }

  setEmployeeName = (event) => {
    const employeeName = event.target.value
    this.setState({ employeeName: employeeName })
  }

  render() {

    const employeeRows = _.map(this.props.employeeNames, (employeeName) => {

      const employeeTag = this.props.employeeTags[employeeName]
      const setEmployeeTag = (event) => {
        let tag = event.target.value
        this.props.dispatch(Actions.setEmployeeTag(employeeName, tag))
      }

      const tagOptions = _.map(this.props.tags, (tag) => {
        return <option value={ employeeTag } key={ tag }>{ tag }</option>
      })

      const cols = [
        <td key="name">{ employeeName }</td>,
        <td key="tag">
          <select value={ employeeTag } onChange={ setEmployeeTag }>
            <option disabled selected value>Select a tag</option>
            { tagOptions }
          </select>
        </td>
      ]

      return <tr key={ employeeName }>{ cols }</tr>
    })

    return (
      <div>
        <h3>Employees</h3>
        <form id="employee-form" onSubmit={ this.handleSubmit } className="form-inline">
          <div className="form-group">
            <label htmlFor="employee-name-input">Name</label>
            <input type="text" className="form-control" id="employee-name-input" onChange={ this.setEmployeeName } placeholder="Jane Doe" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>

        <table id="employee-table" className="table">
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
    tags: state.tags
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(EmployeeSettings)
