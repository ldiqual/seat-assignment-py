import React, { Component } from 'react';

class TagSettings extends Component {
  render() {
    return (
      <div>
        <h3>Tags</h3>
        <form id="tag-form" className="form-inline">
          <div className="form-group">
            <label htmlFor="tag-input">Tag</label>
            <input type="text" className="form-control" id="tag-input" placeholder="Engineering" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>

        <table id="tag-table" className="table">
          <tbody></tbody>
        </table>
      </div>
    )
  }
}

export default TagSettings
