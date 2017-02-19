import React, { Component } from 'react';

class EmployeeSettings extends Component {
  render() {
    return (
      <div>
        <h3>Employees</h3>
        <form id="employee-form" className="form-inline">
          <div className="form-group">
            <label htmlFor="employee-name-input">Name</label>
            <input type="text" className="form-control" id="employee-name-input" placeholder="Jane Doe" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>

        <table id="employee-table" className="table">
          <tbody></tbody>
        </table>
      </div>
    )
  }
}

export default EmployeeSettings
