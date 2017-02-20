const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

import LayoutTableContainer from './components/LayoutTableContainer'
import EmployeeSettings from './components/EmployeeSettings'
import TagSettings from './components/TagSettings'
import TableTagSettings from './components/TableTagSettings'
import DistanceConstraintSettings from './components/DistanceConstraintSettings'
import SummaryContainer from './components/SummaryContainer'

import './App.css';

class App extends React.Component {
  render() {
    return (
      <div id="app-container" className="container">
        <div className="row">
          <h1>Seat assignment solver</h1>
          <p className="lead">Using linear constraints and a LP/MIP solver</p>
        </div>
        <div className="row">
          <LayoutTableContainer/>
        </div>
        <div className="row">
          <TagSettings/>
        </div>
        <div className="row">
          <EmployeeSettings/>
        </div>
        <div className="row">
          <TableTagSettings/>
        </div>
        <div className="row">
          <DistanceConstraintSettings/>
        </div>
        <div className="row">
          <SummaryContainer/>
        </div>
      </div>
    );
  }
}

module.exports = ReactRedux.connect()(App)
