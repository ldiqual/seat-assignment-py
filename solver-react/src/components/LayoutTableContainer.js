const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class LayoutTableContainer extends React.Component {

  onLayoutTabClicked = () => {
    this.props.dispatch(Actions.setIsAssigningTags(false))
  }

  onTagTabClicked = () => {
    this.props.dispatch(Actions.setIsAssigningTags(true))
  }

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

    let tags = _.map(this.props.tags, (tag) => {
      const setCurrentTagBeingAssigned = () => {
        this.props.dispatch(Actions.setCurrentTagBeingAssigned(tag))
      }
      const classes = ['btn', 'btn-sm', this.props.currentTagBeingAssigned === tag ? 'btn-primary' : 'btn-default']
      return <button key={ tag } onClick={ setCurrentTagBeingAssigned } className={ classes.join(' ') }>{ tag }</button>
    })

    if (this.props.tags.length === 0) {
      tags = (
        <p>
          <span>No tags to show. Please add tags from the right menu</span>
        </p>
      )
    }

    return (
      <div id="table-container" className="col-xs-7">
        <h2>Table layout</h2>

        <ul className="nav nav-tabs">
          <li role="presentation" className={ this.props.isAssigningTags ? '' : 'active' }><a href="#" onClick={ this.onLayoutTabClicked }>Layout</a></li>
          <li role="presentation" className={ this.props.isAssigningTags ? 'active' : '' }><a href="#" onClick={ this.onTagTabClicked }>Tags</a></li>
        </ul>

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
