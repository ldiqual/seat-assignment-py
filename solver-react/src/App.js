import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class LayoutSettings extends Component {
  render() {
    return (
      <div>
        <h3>Layout</h3>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="rows-input" className="col-sm-2 control-label">Rows</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="rows-input" value="10" placeholder="0" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cols-input" className="col-sm-2 control-label">Cols</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="cols-input" value="10" placeholder="0" />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

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

class TagSettings extends Component {
  render() {
    return (
      <div>
        <h3>Tags</h3>
        <form id="tag-form" className="form-inline">
          <div className="form-group">
            <label htmlFor="tag-input">Tag</label>
            <input type="text" className="form-control" id="tag-input" placeholder="Engineering" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>

        <table id="tag-table" className="table">
          <tbody></tbody>
        </table>
      </div>
    )
  }
}

class SettingsContainer extends Component {
  render() {
    return (
      <div id="settings-container" className="col-xs-5">
          <h2>Settings</h2>
          <LayoutSettings />
          <EmployeeSettings />
          <TagSettings />
      </div>
    )
  }
}

class LayoutTableContainer extends Component {
  render() {
    return (
      <div id="table-container" className="col-xs-7">
        <h2>Table layout</h2>
        <table id="layout-table"></table>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <LayoutTableContainer />
          <SettingsContainer />
        </div>
      </div>
    );
  }
}

export default App;
