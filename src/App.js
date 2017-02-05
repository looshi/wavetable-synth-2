import React from 'react';
import ReactDOM from 'react-dom';
import OscillatorView from './views/Oscillator/OscillatorView.js';
import FilterView from './views/Filter/FilterView.js';
import WaveFiles from './data/WaveFiles.js'
import {connect} from 'react-redux';
import { createStore } from 'redux';
import Reducers from './data/Reducers.js';
import Synth from './audio/Synth.js';
import HorizontalSlider from './views/Components/HorizontalSlider.js';

let store = createStore(Reducers);
const audioContext = new AudioContext();

class App extends React.Component {

  render() {
    return (
      <div>
        <HorizontalSlider
          id = "master"
          name = "master gain"
          min = {0}
          max = {100}
          step = {1}
          value = {this.props.Master.volume} />
        {
          this.props.Oscillators.map( (oscillator) => {
            return (
              <OscillatorView
                key = {oscillator.id}
                id = {oscillator.id}
                name = {oscillator.name}
                fileA = {oscillator.fileA}
                fileB = {oscillator.fileB}
                algorithm = {oscillator.algorithm}
                audioBufferA = {oscillator.audioBufferA}
                audioBufferB = {oscillator.audioBufferB}
                channelDataA = {oscillator.channelDataA}
                channelDataB = {oscillator.channelDataB}
                computedChannelData = {oscillator.computedChannelData}
                detune = {oscillator.detune}
                octave = {oscillator.octave}
                amount = {oscillator.amount}
                audioContext = {audioContext}
                files = {WaveFiles} />
            );
          })
        }

        <FilterView />

        <Synth
          audioContext = {audioContext}
          Master = {this.props.Master}
          Filter = {this.props.Filter}
          Oscillators = {this.props.Oscillators} />

      </div>
    );
  }
}

// Container components can be described by these two functions :
function mapStateToProps(reducers){
  return {
    Filter: reducers.FilterReducer.Filter,
    Master: reducers.MasterReducer.Master,
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
