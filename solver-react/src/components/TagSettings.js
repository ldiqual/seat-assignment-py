const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

class TagSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
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

    this.props.dispatch(Actions.addTag(tag))
  }

  setTagName = (event) => {
    this.setState({ tag: event.target.value })
  }

  toggleIsAssigningTags = (event) => {
    const isAssigningTags = this.props.isAssigningTags
    this.props.dispatch(Actions.setIsAssigningTags(!isAssigningTags))
  }

  render() {

    const tagRows = _.map(this.props.tags, (tag) => {
      return (
        <tr key={ tag }>
          <td>{ tag }</td>
        </tr>
      )
    })

    const isAssigningTags = this.props.isAssigningTags

    return (
      <div>
        <h3>Tags</h3>
        <form id="tag-form" onSubmit={ this.handleSubmit } className="form-inline">
          <div className="form-group">
            <label htmlFor="tag-input">Tag</label>
            <input type="text" className="form-control" id="tag-input" onChange={ this.setTagName } placeholder="Engineering" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>

        <table id="tag-table" className="table">
          <tbody>{ tagRows }</tbody>
        </table>

        <button onClick={ this.toggleIsAssigningTags } className={ isAssigningTags ? 'btn btn-warning' : 'btn btn-default' }>
          { isAssigningTags ? 'Stop assigning tags' : 'Start assigning tags' }
        </button>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    tags: state.tags,
    isAssigningTags: state.isAssigningTags
  }
}

module.exports = ReactRedux.connect(mapStateToProps)(TagSettings)
