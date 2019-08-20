const React = require('react')
const ReactRedux = require('react-redux')

const LayoutTableContainer = require('./components/LayoutTableContainer')
const EmployeeSettings = require('./components/EmployeeSettings')
const TagSettings = require('./components/TagSettings')
const TableTagSettings = require('./components/TableTagSettings')
const DistanceConstraintSettings = require('./components/DistanceConstraintSettings')
const SummaryContainer = require('./components/SummaryContainer')
const ResultContainer = require('./components/ResultContainer')

require('bootstrap/dist/css/bootstrap.css')
require('./App.css')

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
        <div className="row">
          <ResultContainer/>
        </div>
      </div>
    );
  }
}

module.exports = ReactRedux.connect()(App)
