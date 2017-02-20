import React, { Component } from 'react';
import EmployeeSettings from './EmployeeSettings'
import LayoutSettings from './LayoutSettings'
import TagSettings from './TagSettings'
import DistanceConstraintSettings from './DistanceConstraintSettings'

class SettingsContainer extends Component {
  render() {
    return (
      <div id="settings-container" className="col-xs-5">
          <h2>Settings</h2>
          <LayoutSettings />
          <EmployeeSettings />
          <TagSettings />
          <DistanceConstraintSettings />
      </div>
    )
  }
}

module.exports = SettingsContainer
