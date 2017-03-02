import React from 'react'
import { connect } from 'react-redux'

import LayoutTableContainer from './components/LayoutTableContainer'
import EmployeeSettings from './components/EmployeeSettings'
import TagSettings from './components/TagSettings'
import TableTagSettings from './components/TableTagSettings'
import DistanceConstraintSettings from './components/DistanceConstraintSettings'
import PositionConstraintSettings from './components/PositionConstraintSettings'
import SummaryContainer from './components/SummaryContainer'
import ResultContainer from './components/ResultContainer'

import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

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
          <PositionConstraintSettings/>
        </div>
        <div className="row">
          <SummaryContainer/>
        </div>
        <div className="row">
          <ResultContainer/>
        </div>
      </div>
    );
  }
}

export default connect()(App)
