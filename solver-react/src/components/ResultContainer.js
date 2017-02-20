const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class ResultContainer extends React.Component {

  render() {

    return (
      <div id="result-container">
      <p>
        <button type="button" className="btn btn-primary">
          Solve this!
        </button>
      </p>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    layout: state.layout,
    employeeNames: state.employeeNames,
    employeeTags: state.employeeTags,
    distanceConstraints: state.distanceConstraints,
    tableTags: state.tableTags,
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(ResultContainer)
