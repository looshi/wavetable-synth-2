/*
Synth
Contains all the audio components which comprise the synth.
Nodes are connected in this order :
Oscillators -> Filter -> Master
*/
import React from 'react'
import {connect} from 'react-redux'
import OscillatorAudio from './OscillatorAudio.js'

class Synth extends React.Component {
  constructor (props, context) {
    super(props, context)
    let {audioContext, store} = this.props

    this.masterGain = audioContext.createGain()

    this.biquadFilter = audioContext.createBiquadFilter()
    this.biquadFilter.type = 'lowpass'
    this.biquadFilter.frequency.value = 300
    this.biquadFilter.gain.value = 200
    this.biquadFilter.connect(this.masterGain)

    this.masterGain.connect(audioContext.destination)

    // Note On / Off events are handled manually here.
    store.subscribe(() => {
      let state = store.getState()
      const keyboard = state.KeyboardReducer.Keyboard

      Object.keys(keyboard, (note) => {
        console.log('note', note)
      })
    })
  }

  componentDidUpdate (prevProps, prevState) {
    this.masterGain.gain.value = this.props.Master.volume / 100

    this.biquadFilter.frequency.value = this.props.Filter.freq
    this.biquadFilter.Q.value = this.props.Filter.res

    let {store} = this.props
    store.dispatch({ type: 'synth updated.' })
  }

  render () {
    return (
      <div>
        {
          this.props.Oscillators.map((oscillator) => {
            return (
              <OscillatorAudio
                key={oscillator.id}
                id={oscillator.id}
                name={oscillator.name}
                computedChannelData={oscillator.computedChannelData}
                detune={oscillator.detune}
                octave={oscillator.octave}
                amount={oscillator.amount}
                note={oscillator.note}
                audioContext={this.props.audioContext}
                output={this.biquadFilter} />
            )
          })
        }
      </div>
    )
  }
}

export default connect()(Synth)
