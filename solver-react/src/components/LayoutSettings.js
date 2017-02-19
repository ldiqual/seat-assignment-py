const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class LayoutSettings extends React.Component {

  setNumRows = (event) => {
    const numRows = parseInt(event.target.value, 10)
    this.props.dispatch(Actions.setNumRows(numRows))
  }

  setNumCols = (event) => {
    const numCols = parseInt(event.target.value, 10)
    this.props.dispatch(Actions.setNumCols(numCols))
  }

  render() {

    const numRows = this.props.layout.length
    const numCols = numRows > 0 ? this.props.layout[0].length : 0

    return (
      <div>
        <h3>Layout</h3>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="rows-input" className="col-sm-2 control-label">Rows</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="rows-input" value={ numRows } onChange={ this.setNumRows } placeholder="0" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cols-input" className="col-sm-2 control-label">Cols</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="cols-input" value={ numCols } onChange={ this.setNumCols } placeholder="0" />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    layout: state.layout
  }
}

module.exports =  ReactRedux.connect(mapStateToProps)(LayoutSettings)
