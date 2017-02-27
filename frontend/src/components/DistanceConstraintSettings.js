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
      <select id="employee1-name-input" value={ this.state.employee1Name } onChange={ this.setEmployee1Name } className="form-control">
        <option value=''>Employee 1</option>
        { employeeOptions }
      </select>
    )

    const employee2Select = (
      <select id="employee2-name-input" value={ this.state.employee2Name } onChange={ this.setEmployee2Name } className="form-control">
        <option value=''>Employee 2</option>
        { employeeOptions }
      </select>
    )

    const constraintRows = _.map(this.props.distanceConstraints, (constraint) => {

      const deleteConstraint = (event) => {
        this.props.dispatch(Actions.deleteDistanceConstraint(constraint))
      }

      return (
        <tr key={ constraint.id }>
          <td key="actions">
            <button type="button" className="btn btn-danger btn-xs" onClick={ deleteConstraint }>
              <span className="glyphicon glyphicon-remove"></span>
            </button>
          </td>
          <td key="employee1Name">{ constraint.employee1Name }</td>
          <td key="employee2Name">{ constraint.employee2Name }</td>
          <td key="constraint">{ constraint.distance }</td>
          <td></td>
        </tr>
      )
    })

    return (
      <div id="distance-constraint-container">
        <h2>Distance Constraints</h2>

        <p>
          You can restrict the distance between two employees by adding a distance constraint.<br/>
          Two adjacent tables have a distance of 1.
        </p>

        <form id="distance-constraint-form" onSubmit={ this.handleSubmit } className="form-inline">
          <table id="distance-constraint-table" className="table table-striped">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="employee1-name-input" className="sr-only">Employee 1</label>
                  { employee1Select }
                </td>
                <td>
                  <label htmlFor="employee1-name-input" className="sr-only">Employee 2</label>
                  { employee2Select }
                </td>
                <td>
                  <label htmlFor="distance-input">Distance</label>
                  <input id="distance-input" type="number" className="form-control" onChange={ this.setDistance } value={ this.state.distance } placeholder="1" />
                </td>
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
