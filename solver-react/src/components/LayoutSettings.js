import React, { Component } from 'react';

class LayoutSettings extends Component {
  render() {
    return (
      <div>
        <h3>Layout</h3>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="rows-input" className="col-sm-2 control-label">Rows</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="rows-input" value="10" placeholder="0" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cols-input" className="col-sm-2 control-label">Cols</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="cols-input" value="10" placeholder="0" />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default LayoutSettings
