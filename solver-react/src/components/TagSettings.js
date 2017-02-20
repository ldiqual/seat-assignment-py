const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

const Actions = require('../actions')

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

  toggleIsAssigningTags = (event) => {
    const isAssigningTags = this.props.isAssigningTags
    this.props.dispatch(Actions.setIsAssigningTags(!isAssigningTags))
  }

  render() {

    let tagRows = null

    if (this.props.tags.length > 0) {
      tagRows = _.map(this.props.tags, (tag) => {
        return (
          <tr key={ tag }>
            <td>{ tag }</td>
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

    const isAssigningTags = this.props.isAssigningTags

    return (
      <div>
        <h3>Tags</h3>
        <form id="tag-form" onSubmit={ this.handleSubmit } className="form-horizontal">
          <div className="form-group">
            <label htmlFor="tag-input" className="col-sm-2 control-label">Tag</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="tag-input" onChange={ this.setTagName } value={ this.state.tag } placeholder="Engineering" />
            </div>
          </div>
        </form>

        <table id="tag-table" className="table table-striped">
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
