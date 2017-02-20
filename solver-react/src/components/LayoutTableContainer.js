const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class LayoutTableContainer extends React.Component {

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {
        const onClick = () => {
          if (this.props.isAssigningTags) {
            if (!this.props.layout[rowIndex][colIndex]) {
              return
            }
            this.props.dispatch(Actions.toggleTagForTable(rowIndex, colIndex, this.props.currentTagBeingAssigned))
          } else {
            this.props.dispatch(Actions.setLocationHasTable(rowIndex, colIndex, !hasTable))
          }
        }
        const tags = this.props.tableTags[rowIndex][colIndex]
        const td = (
          <td key={ colIndex } className={ hasTable ? 'selected' : '' } onClick={ onClick }>
            { tags.join('\n') }
          </td>
        )
        return td
      })
      return <tr key={ rowIndex }>{ cols }</tr>
    })

    const tags = _.map(this.props.tags, (tag) => {
      const setCurrentTagBeingAssigned = () => {
        this.props.dispatch(Actions.setCurrentTagBeingAssigned(tag))
      }
      const classes = ['label', this.props.currentTagBeingAssigned === tag ? 'label-primary' : 'label-default']
      return <span key={ tag } onClick={ setCurrentTagBeingAssigned } className={ classes.join(' ') }>{ tag }</span>
    })

    return (
      <div id="table-container" className="col-xs-7">
        <h2>Table layout</h2>

        { this.props.isAssigningTags ? <p id="tag-assignment-selector">{ tags }</p> : '' }

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
    layout: state.layout,
    tags: state.tags,
    currentTagBeingAssigned: state.currentTagBeingAssigned,
    isAssigningTags: state.isAssigningTags,
    tableTags: state.tableTags,
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(LayoutTableContainer)
