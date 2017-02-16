/* global AudioContext */
import React from 'react'
import OscillatorView from './views/Oscillator/OscillatorView.js'
import FilterView from './views/Filter/FilterView.js'
import ChorusView from './views/Effects/ChorusView.js'
import AmpView from './views/Filter/AmpView.js'
import LFOView from './views/LFO/LFOView.js'
import WaveFiles from './data/WaveFiles.js'
import {connect} from 'react-redux'

import Synth from './audio/Synth.js'
import HorizontalSlider from './views/Components/HorizontalSlider.js'
import Keyboard from './views/Keyboard/Keyboard.js'
import EventEmitter from 'event-emitter'

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
            label='master gain'
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
            <FilterView
              id={this.props.Filter.id}
              freq={this.props.Filter.freq}
              res={this.props.Filter.res}
              attack={this.props.Filter.attack}
              decay={this.props.Filter.decay}
              sustain={this.props.Filter.sustain}
              release={this.props.Filter.release}
              />
            <AmpView
              id={this.props.Amp.id}
              attack={this.props.Amp.attack}
              decay={this.props.Amp.decay}
              sustain={this.props.Amp.sustain}
              release={this.props.Amp.release} />
            <ChorusView
              amount={this.props.Chorus.amount}
              time={this.props.Chorus.time} />
          </div>
          <div>
            {
              this.props.LFOs.map((LFO) => {
                return (
                  <LFOView
                    key={LFO.id}
                    id={LFO.id}
                    name={LFO.name}
                    shape={LFO.shape}
                    amount={LFO.amount}
                    rate={LFO.rate}
                    destination={LFO.destination}
                    destinations={LFO.destinations} />
                )
              })
            }
          </div>
          <div className='scroll-footer'>&nbsp;</div>
        </div>

        <Keyboard
          eventEmitter={eventEmitter}
          Keyboard={this.props.Keyboard} />

        <Synth
          store={this.props.store}
          eventEmitter={eventEmitter}
          audioContext={audioContext}
          Master={this.props.Master}
          Filter={this.props.Filter}
          Chorus={this.props.Chorus}
          Amp={this.props.Amp}
          Oscillators={this.props.Oscillators} />

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    Master: state.Master,
    Filter: state.Filter,
    Amp: state.Amp,
    Chorus: state.Chorus,
    LFOs: state.LFOs,
    Keyboard: state.Keyboard,
    Oscillators: state.Oscillators
  }
}

export default connect(mapStateToProps, null)(App)
