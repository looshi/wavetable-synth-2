/* global AudioContext */
import React from 'react'
import OscillatorView from './views/Oscillator/OscillatorView.js'
import FilterView from './views/Filter/FilterView.js'
import AmpView from './views/Filter/AmpView.js'
import WaveFiles from './data/WaveFiles.js'
import {connect} from 'react-redux'
import { createStore } from 'redux'
import Reducers from './data/Reducers.js'
import Synth from './audio/Synth.js'
import HorizontalSlider from './views/Components/HorizontalSlider.js'
import Keyboard from './views/Keyboard/Keyboard.js'
import EventEmitter from 'event-emitter'

let store = createStore(Reducers)
const audioContext = new AudioContext()
const eventEmitter = new EventEmitter()

class App extends React.Component {

  render () {
    return (
      <div>
        <div className='scroll-container'>
          <HorizontalSlider
            id='master'
            name='master gain'
            min={0}
            max={100}
            step={1}
            value={this.props.Master.volume} />

          {
            this.props.Oscillators.map((oscillator) => {
              return (
                <OscillatorView
                  key={oscillator.id}
                  id={oscillator.id}
                  name={oscillator.name}
                  fileA={oscillator.fileA}
                  fileB={oscillator.fileB}
                  algorithm={oscillator.algorithm}
                  audioBufferA={oscillator.audioBufferA}
                  audioBufferB={oscillator.audioBufferB}
                  channelDataA={oscillator.channelDataA}
                  channelDataB={oscillator.channelDataB}
                  computedChannelData={oscillator.computedChannelData}
                  note={oscillator.note}
                  detune={oscillator.detune}
                  octave={oscillator.octave}
                  amount={oscillator.amount}
                  audioContext={audioContext}
                  files={WaveFiles} />
              )
            })
          }

          <div>
            <FilterView />
            <AmpView attack={this.props.Amp.attack * 100}
              decay={this.props.Amp.decay * 100}
              sustain={this.props.Amp.sustain * 100}
              release={this.props.Amp.release * 100} />
          </div>
          <div className='scroll-footer'>&nbsp;</div>
        </div>

        <Keyboard
          eventEmitter={eventEmitter}
          Keyboard={this.props.Keyboard} />

        <Synth
          store={store}
          eventEmitter={eventEmitter}
          audioContext={audioContext}
          Master={this.props.Master}
          Filter={this.props.Filter}
          Amp={this.props.Amp}
          Oscillators={this.props.Oscillators} />

      </div>
    )
  }
}

function mapStateToProps (reducers) {
  return {
    Master: reducers.MasterReducer.Master,
    Filter: reducers.FilterReducer.Filter,
    Amp: reducers.AmpReducer.Amp,
    Keyboard: reducers.KeyboardReducer.Keyboard,
    Oscillators: reducers.OscillatorsReducer.Oscillators
  }
}

function mapDispatchToProps (dispatch) {
  return {
    eventHandlerName: function (args) {
      dispatch({
        type: 'EVENT_NAME',
        arg1: 'value',
        arg2: 'value'
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
