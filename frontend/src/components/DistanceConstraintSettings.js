import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Actions from '../actions'

class DistanceConstraintSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      employee1Name: '',
      employee2Name: '',
      allowedDistances: ['next'] // 'front', 'diagonal'
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const employee1Name = this.state.employee1Name
    const employee2Name = this.state.employee2Name
    const allowedDistances = this.state.allowedDistances

    if (!employee1Name || employee1Name.length === 0) {
      return
    }
    if (!employee2Name || employee2Name.length === 0) {
      return
    }

    this.setState({
      employee1Name: '',
      employee2Name: ''
    })
    this.props.dispatch(Actions.addDistanceConstraint(employee1Name, employee2Name, allowedDistances))
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

  toggleNext = () => {
    const isEnabled = _.includes(this.state.allowedDistances, 'next')
    const allowedDistances = isEnabled
      ? _.without(this.state.allowedDistances, 'next', 'front', 'diagonal')
      : _.union(this.state.allowedDistances, 'next')
    this.setState({ allowedDistances: allowedDistances })
  }

  toggleFront = () => {
    const isEnabled = _.includes(this.state.allowedDistances, 'front')
    const allowedDistances = isEnabled
      ? _.without(this.state.allowedDistances, 'front', 'diagonal')
      : _.union(this.state.allowedDistances, ['next', 'front'])
    this.setState({ allowedDistances: allowedDistances })
  }

  toggleDiagonal = () => {
    const isEnabled = _.includes(this.state.allowedDistances, 'diagonal')
    const allowedDistances = isEnabled
      ? _.without(this.state.allowedDistances, 'diagonal')
      : _.union(this.state.allowedDistances, ['front', 'next', 'diagonal'])
    this.setState({ allowedDistances: allowedDistances })
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
        <tr key={ constraint.id }>
          <td key="actions">
            <Button variant="danger" size="sm" onClick={ deleteConstraint }>
              <FontAwesomeIcon icon={ faTimes } />
            </Button>
          </td>
          <td key="employee1Name">{ constraint.employee1Name }</td>
          <td key="employee2Name">{ constraint.employee2Name }</td>
          <td key="constraint">have to sit { constraintDescriptions.join(', or ') }</td>
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
                <td></td>
                <td>
                  <label htmlFor="employee1-name-input" className="sr-only">Employee 1</label>
                  { employee1Select }
                </td>
                <td>
                  <label htmlFor="employee1-name-input" className="sr-only">Employee 2</label>
                  { employee2Select }
                </td>
                <td>
                  <b>They have have to sit:</b><br/>
                  <input
                    checked={ _.includes(this.state.allowedDistances, 'next') }
                    onChange={ this.toggleNext }
                    type="checkbox" disabled={ true }/> next to each other<br/>
                  <input
                    checked={ _.includes(this.state.allowedDistances, 'front') }
                    onChange={ this.toggleFront }
                    type="checkbox"/> or in front of each other<br/>
                  <input checked={ _.includes(this.state.allowedDistances, 'diagonal') }
                    onChange={ this.toggleDiagonal }
                    type="checkbox"/> or diagonally
                </td>
                <td>
                  <Button type="submit">Add</Button>
                </td>
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

export default connect(mapStateToProps)(DistanceConstraintSettings)
