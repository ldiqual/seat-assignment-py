import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Actions from '../actions'

class TagSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tag: ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const tag = this.state.tag
    if (!tag || tag.length === 0) {
      return
    }

    if (_.includes(this.props.tags, tag)) {
      return
    }

    this.setState({ tag: '' })
    this.props.dispatch(Actions.addTag(tag))
  }

  setTagName = (event) => {
    this.setState({ tag: event.target.value })
  }

  render() {

    let tagRows = null

    if (this.props.tags.length > 0) {
      tagRows = _.map(this.props.tags, (tag) => {

        const deleteTag = (event) => {
          this.props.dispatch(Actions.deleteTag(tag))
        }

        return (
          <tr key={ tag }>
            <td key="actions" className="shrink">
              <button type="button" className="btn btn-danger btn-xs" onClick={ deleteTag }>
                <span className="glyphicon glyphicon-remove"></span>
              </button>
            </td>
            <td key="tag"  className="expand">{ tag }</td>
          </tr>
        )
      })
    } else {
      tagRows = [
        <tr key="-1">
          <td>–</td>
        </tr>
      ]
    }

    return (
      <div id="tag-container">
        <h2>Teams</h2>

        <p>Add teams that take part of your workplace. Examples: "Engineering", "Sales", or "Marketing".</p>

        <form id="tag-form" onSubmit={ this.handleSubmit } className="form-horizontal">
          <div className="form-group">
            <label htmlFor="tag-input" className="col-sm-2 control-label">Team</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="tag-input" onChange={ this.setTagName } value={ this.state.tag } placeholder="Engineering" />
            </div>
          </div>
        </form>

        <table id="tag-table" className="table table-striped">
          <tbody>{ tagRows }</tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    tags: state.tags
  }
}

export default connect(mapStateToProps)(TagSettings)
