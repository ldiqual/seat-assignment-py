const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class DistanceConstraintSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      employee1Name: '',
      employee2Name: '',
      distance: 1
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const employee1Name = this.state.employee1Name
    const employee2Name = this.state.employee2Name
    const distance = this.state.distance

    if (!employee1Name || employee1Name.length === 0) {
      return
    }
    if (!employee2Name || employee2Name.length === 0) {
      return
    }
    if (!distance || distance < 1) {
      return
    }

    this.setState({
      employee1Name: '',
      employee2Name: '',
      distance: 1
    })
    this.props.dispatch(Actions.addDistanceConstraint(employee1Name, employee2Name, distance))
  }

  setEmployee1Name = (event) => {
    this.setState({ employee1Name: event.target.value })
  }

  setEmployee2Name = (event) => {
    this.setState({ employee2Name: event.target.value })
  }

  setDistance = (event) => {
    this.setState({ distance: parseInt(event.target.value, 10) })
  }

  render() {

    const employeeOptions = _.map(this.props.employeeNames, (tag) => {
      return <option value={ tag } key={ tag }>{ tag }</option>
    })

    const employee1Select = (
      <select value={ this.state.employee1Name } onChange={ this.setEmployee1Name } className="form-control">
        <option value=''>Employee 1</option>
        { employeeOptions }
      </select>
    )

    const employee2Select = (
      <select value={ this.state.employee2Name } onChange={ this.setEmployee2Name } className="form-control">
        <option value=''>Employee 2</option>
        { employeeOptions }
      </select>
    )

    const constraintRows = _.map(this.props.distanceConstraints, (constraint) => {
      return (
        <tr key={ constraint.id }>
          <td key="employee1Name">{ constraint.employee1Name }</td>
          <td key="employee2Name">{ constraint.employee2Name }</td>
          <td key="constraint">{ constraint.distance }</td>
          <td></td>
        </tr>
      )
    })

    return (
      <div>
        <h3>Distance Constraints</h3>

        <form id="distance-constraint-form" onSubmit={ this.handleSubmit } className="form-horizontal">
          <table id="distance-constraint-table" className="table table-striped">
            <tbody>
              <tr>
                <td>{ employee1Select }</td>
                <td>{ employee2Select }</td>
                <td><input type="number" className="form-control" id="employee-name-input" onChange={ this.setDistance } value={ this.state.distance } placeholder="1" /></td>
                <td><button type="submit" className="btn btn-default">Add</button></td>
              </tr>
              { constraintRows }
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    employeeNames: state.employeeNames,
    distanceConstraints: state.distanceConstraints
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(DistanceConstraintSettings)
