const React = require('react')
const ReactRedux = require('react-redux')
const _ = require('lodash')

import SettingsContainer from './components/SettingsContainer'
import LayoutTableContainer from './components/LayoutTableContainer'

import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <LayoutTableContainer/>
          <SettingsContainer/>
        </div>
      </div>
    );
  }
}

module.exports = ReactRedux.connect()(App)
