import React, { Component } from 'react';

import SettingsContainer from './components/SettingsContainer'
import LayoutTableContainer from './components/LayoutTableContainer'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <LayoutTableContainer />
          <SettingsContainer />
        </div>
      </div>
    );
  }
}

export default App;
