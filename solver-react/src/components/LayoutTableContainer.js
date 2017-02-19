const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

class LayoutTableContainer extends React.Component {

  render() {

    const rows = _.map(this.props.layout, function(row, rowIndex) {
      const cols = _.map(row, function(hasTable, colIndex) {
        return <td key={ colIndex } className={ hasTable ? 'selected' : '' }></td>
      })
      return <tr key={ rowIndex }>{ cols }</tr>
    })

    return (
      <div id="table-container" className="col-xs-7">
        <h2>Table layout</h2>
        <table id="layout-table">
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    layout: state.layout
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(LayoutTableContainer)
