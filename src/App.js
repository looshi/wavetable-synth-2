/* global AudioContext */
import axios from 'axios'
import React from 'react'
import Actions from './data/Actions'
import OscillatorView from './views/Oscillator/OscillatorView.js'
import FilterView from './views/Filter/FilterView.js'
import EffectsView from './views/Effects/EffectsView.js'
import AmpView from './views/Filter/AmpView.js'
import LFOView from './views/LFO/LFOView.js'
import Presets from './views/Presets/Presets.js'
import MidiInput from './views/Midi/MidiInput.js'
import {connect} from 'react-redux'

import Synth from './audio/Synth.js'
import HorizontalSlider from './views/Components/HorizontalSlider.js'
import Keyboard from './views/Keyboard/Keyboard.js'
import EventEmitter from 'event-emitter'

import WaveTableData from './data/WaveTableData.json'

let audioContext
const eventEmitter = new EventEmitter()

if (window.AudioContext) {
  audioContext = new AudioContext()
}

class App extends React.Component {
  constructor (props) {
    super(props)
    axios.get(WaveTableData).then(function (response) {
      let action = Actions.waveFileListLoaded(response.data)
      props.dispatch(action)
    })
  }

  render () {
    // Shows a message if no audio support in the browser.
    if (!window.AudioContext) {
      return (
        <div>
          <h1 style={{textAlign: 'center'}}>Bummer, this browser doesn't support audio.</h1>
          <h1 style={{textAlign: 'center'}}>Try this synth in Chrome.</h1>
        </div>
      )
    }
    // Shows a message if not Chrome.
    const isChrome = !!window.chrome && !!window.chrome.webstore
    return (
      <div>
        <div className='scroll-container'>
          {!isChrome &&
            <div>
              <h1 className='text-center'>
                Try this synth in Chrome for better audio quality and MIDI support.
              </h1>
            </div>
          }
          <header>
            <div>
              <h1>Dog Synth</h1>
              <HorizontalSlider
                id='master'
                name='master gain'
                label='volume'
                min={0}
                max={100}
                step={1}
                value={this.props.Master.volume} />
              <MidiInput eventEmitter={eventEmitter} />
              <Presets presetId={this.props.Master.presetId} />
            </div>

          </header>
          <div className='scroll-contents'>
            {
              this.props.Oscillators.map((oscillator) => {
                return (
                  <OscillatorView
                    key={oscillator.id}
                    audioContext={audioContext}
                    {...oscillator} />
                )
              })
            }

            <div>
              <FilterView
                {...this.props.Filter} />
              <AmpView
                {...this.props.Amp} />
              <EffectsView
                {...this.props.Effects} />
            </div>
            <div>
              {
                this.props.LFOs.map((LFO) => {
                  return (
                    <LFOView
                      key={LFO.id}
                      {...LFO} />
                  )
                })
              }
            </div>
            <div className='scroll-footer' />
          </div>

          <footer>
            <Keyboard
              eventEmitter={eventEmitter}
              Keyboard={this.props.Keyboard} />
          </footer>

          <Synth
            store={this.props.store}
            eventEmitter={eventEmitter}
            audioContext={audioContext}
            Master={this.props.Master}
            Filter={this.props.Filter}
            Effects={this.props.Effects}
            Amp={this.props.Amp}
            Oscillators={this.props.Oscillators}
            LFOs={this.props.LFOs} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    Master: state.Master,
    Filter: state.Filter,
    Amp: state.Amp,
    Effects: state.Effects,
    LFOs: state.LFOs,
    Keyboard: state.Keyboard,
    Oscillators: state.Oscillators
  }
}

export default connect(mapStateToProps, null)(App)
