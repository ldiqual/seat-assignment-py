import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button } from 'react-bootstrap'

import Actions from '../actions'

class TableTagSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentTagBeingAssigned: null
    }
  }

  render() {

    const rows = _.map(this.props.layout, (row, rowIndex) => {
      const cols = _.map(row, (hasTable, colIndex) => {
        const onClick = () => {
          if (!this.state.currentTagBeingAssigned) {
            return
          }
          if (!this.props.layout[rowIndex][colIndex]) {
            return
          }
          this.props.dispatch(Actions.toggleTagForTable(rowIndex, colIndex, this.state.currentTagBeingAssigned))
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
        this.setState({ currentTagBeingAssigned: tag })
      }
      return <Button
        key={ tag }
        size="sm"
        variant={ this.state.currentTagBeingAssigned === tag ? 'primary' : 'secondary' }
        onClick={ setCurrentTagBeingAssigned }>
        { tag }
      </Button>
    })

    if (this.props.tags.length === 0) {
      tags = (
        <p>
          <span>No tags to show. Please add tags from the right menu</span>
        </p>
      )
    }

    let tagParagraph
    if (this.props.tags.length > 0) {
      tagParagraph = <p id="tag-assignment-selector">{ tags }</p>
    } else {
      tagParagraph = <p className="text-danger">You didn't add a team yet. Please do so in the section above.</p>
    }

    const errors = []
    _.each(this.props.tags, (tag) => {
      const allTableTags = _.flatten(this.props.tableTags)
      const tableCountForTag = _.reduce(allTableTags, (sum, tags) => {
        return _.includes(tags, tag) ? sum + 1 : sum
      }, 0)
      const employeeCountForTag = _.reduce(this.props.employeeTags, (sum, employeeTag) => {
        return employeeTag === tag ? sum + 1 : sum
      }, 0)
      if (tableCountForTag < employeeCountForTag) {
        errors.push(<li key={ `employeeCountForTag_${ tag }` }>
          There are <b>{ employeeCountForTag }</b> employees in the <b>{ tag }</b> team but only <b>{ tableCountForTag }</b> tables are tagged with this team.
        </li>)
      }
    })

    let errorParagraph
    if (errors.length > 0) {
      errorParagraph = (
        <ul className="text-danger">
          { errors }
        </ul>
      )
    }

    return (
      <div id="table-tag-container">
        <h2>Table teams</h2>

        <p>Assign tables to specific teams by selecting a team and clicking on the tables that belong to that team. A table can belong to multiple teams.</p>

        { tagParagraph }
        { errorParagraph }

        <table id="table-tag-table">
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
    tableTags: state.tableTags,
    employeeTags: state.employeeTags,
  }
}

export default connect(mapStateToProps)(TableTagSettings)
