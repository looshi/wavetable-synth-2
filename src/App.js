import React from 'react';
import ReactDOM from 'react-dom';
import OscillatorView from './views/OscillatorView.js';
import WaveFiles from './data/WaveFiles.js'
import {connect} from 'react-redux';
import { createStore } from 'redux';
import Reducers from './data/Reducers.js';
let store = createStore(Reducers);

class App extends React.Component {

  render() {
    return (
      <div>
        {
          this.props.Oscillators.map( (oscillator) => {
            return (
              <OscillatorView
                key = {oscillator.id}
                id = {oscillator.id}
                fileA = {oscillator.fileA}
                fileB = {oscillator.fileB}
                detune = {oscillator.detune}
                pitch = {oscillator.pitch}
                waveData = {oscillator.waveData}
                files = {WaveFiles} />
            );
          })
        }
      </div>
    );
  }
}

// Container components can be described by these two functions :
function mapStateToProps(reducers){
  return {
    Oscillators: reducers.OscillatorsReducer.Oscillators,
  };
}

function mapDispatchToProps(dispatch){
  return {
    eventHandlerName: function(args) {
      dispatch({
        type: 'EVENT_NAME',
        arg1: 'value',
        arg2: 'value'
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
