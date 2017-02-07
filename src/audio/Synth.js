/*
Synth
Contains all the audio components which comprise the synth.
Nodes are connected in this order :
Oscillators -> Filter -> VCA -> Master
*/
import React from 'react'
import {connect} from 'react-redux'
import OscillatorAudio from './OscillatorAudio.js'

class Synth extends React.Component {
  constructor (props, context) {
    super(props, context)
    let {audioContext, eventEmitter} = this.props

    this.masterGain = audioContext.createGain()
    this.vcaGain = audioContext.createGain()
    this.vcaGain.gain.value = 0

    this.biquadFilter = audioContext.createBiquadFilter()
    this.biquadFilter.type = 'lowpass'
    this.biquadFilter.frequency.value = 300
    this.biquadFilter.gain.value = 200

    this.biquadFilter.connect(this.vcaGain)
    this.vcaGain.connect(this.masterGain)
    this.masterGain.connect(audioContext.destination)

    // Note On / Off events are handled manually here.
    eventEmitter.on('NOTE_ON', (note) => {
      this.ampEnvelopeOn()
    })
    eventEmitter.on('NOTE_OFF', (note) => {
      this.ampEnvelopeOff()
    })
  }

  ampEnvelopeOn () {
    let now = this.props.audioContext.currentTime
    let {gain} = this.vcaGain
    let {attack, decay, sustain} = this.props.Amp
    // // Prevent clicking by fading out very fast, then fading back up.
    let clickOffset = 0.001
    gain.cancelScheduledValues(0)
    gain.setValueAtTime(gain.value, now)
    gain.linearRampToValueAtTime(0, now + clickOffset)
    clickOffset += 0.001
    gain.setValueAtTime(0, now + clickOffset)
    gain.linearRampToValueAtTime(1, now + attack + clickOffset)
    gain.linearRampToValueAtTime(sustain, now + attack + decay + clickOffset)
  }

  ampEnvelopeOff () {
    let now = this.props.audioContext.currentTime
    let {gain} = this.vcaGain
    let {release} = this.props.Amp
    gain.cancelScheduledValues(0)
    gain.setValueAtTime(gain.value, now)
    gain.linearRampToValueAtTime(0, now + release)
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
