const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class LayoutTableContainer extends React.Component {

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {
        const onClick = () => {
          this.props.dispatch(Actions.setLocationHasTable(rowIndex, colIndex, !hasTable))
        }
        return <td key={ colIndex } className={ hasTable ? 'selected' : '' } onClick={ onClick }></td>
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
