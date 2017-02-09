/*
Synth
Contains all the audio components which comprise the synth.
Nodes are connected in this order :
Oscillators -> Osc Bus -> LFOFilter (if on) -> Filter -> VCA -> Master
*/
import React from 'react'
import {connect} from 'react-redux'
import OscillatorAudio from './OscillatorAudio.js'

class Synth extends React.Component {
  constructor (props, context) {
    super(props, context)
    let {audioContext, eventEmitter} = this.props

    // Amp
    this.masterGain = audioContext.createGain()
    this.vcaGain = audioContext.createGain()
    this.vcaGain.gain.value = 0

    // Oscillators bus
    this.oscillatorsBus = audioContext.createGain()
    this.oscillatorsBus.gain.value = 1

    // Filter
    this.biquadFilter = audioContext.createBiquadFilter()
    this.biquadFilter.type = 'lowpass'
    this.biquadFilter.frequency.value = 0
    this.biquadFilter.gain.value = 300  // We can add a slider for this.

    // Filter LFO
    this.lfoFilter = audioContext.createBiquadFilter()
    this.lfoFilter.type = 'lowpass'
    this.lfoFilter.frequency.value = 100
    this.lfoFilter.gain.value = 300  // We can add a slider for this.
    this.lfoFreq = audioContext.createOscillator()
    this.lfoFreqGain = audioContext.createGain()
    this.lfoFreq.start()

    // Amp LFO
    this.lfoAmp = audioContext.createOscillator()
    this.lfoAmpGain = audioContext.createGain()
    this.lfoAmp.start()

    // Connections
    this.lfoFilter.connect(this.biquadFilter)
    this.oscillatorsBus.connect(this.biquadFilter)
    this.biquadFilter.connect(this.vcaGain)
    this.vcaGain.connect(this.masterGain)
    this.masterGain.connect(audioContext.destination)

    // Note On / Off events are handled manually here.
    eventEmitter.on('NOTE_ON', (note) => {
      this.ampEnvelopeOn()
      this.filterEnvelopeOn()
    })
    eventEmitter.on('NOTE_OFF', (note) => {
      this.ampEnvelopeOff()
      this.filterEnvelopeOff()
    })
  }

  filterEnvelopeOn () {
    let now = this.props.audioContext.currentTime
    let {frequency} = this.biquadFilter
    let {attack, decay, sustain, freq} = this.props.Filter

    attack = this.clampToMinMax(0.001, 1, attack / 50)
    decay = decay / 50
    sustain = (sustain / 100) * freq // Sustain is a percentage of freq.
    sustain = this.clampToMinMax(60, 20000, sustain * 100)
    freq = this.clampToMinMax(60, 20000, freq * 100)

    frequency.cancelScheduledValues(0)
    frequency.setValueAtTime(60, now)
    frequency.linearRampToValueAtTime(freq, now + attack)
    frequency.linearRampToValueAtTime(sustain, now + attack + decay)
  }

  filterEnvelopeOff () {
    this.biquadFilter.frequency.cancelScheduledValues(0)
    let now = this.props.audioContext.currentTime
    let {frequency} = this.biquadFilter
    let {release} = this.props.Filter
    release = release / 50
    frequency.cancelScheduledValues(0)
    frequency.setValueAtTime(frequency.value, now)
    frequency.linearRampToValueAtTime(60, now + release)
  }

  ampEnvelopeOn () {
    let now = this.props.audioContext.currentTime
    let {gain} = this.vcaGain
    let {attack, decay, sustain} = this.props.Amp
    attack = this.clampToMinMax(0.001, 1, attack / 100)
    decay = decay / 100
    sustain = sustain / 100
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
    release = this.clampToMinMax(0.001, 1, release / 100)
    gain.cancelScheduledValues(0)
    gain.setValueAtTime(gain.value, now)
    gain.linearRampToValueAtTime(0, now + release)
  }

  // Helper function to keep a value within a range.
  clampToMinMax (min, max, val) {
    if (val < min) return min
    if (val > max) return max
    return val
  }

  componentDidUpdate (prevProps, prevState) {
    // Amp
    this.masterGain.gain.value = this.props.Master.volume / 100

    // Filter Res ( freq is set in envelopOn event )
    this.biquadFilter.Q.value = this.props.Filter.res / 3

    // Filter LFO
    // TODO : only run this if things changed.
    if (this.props.Filter.lfoFreqOn) {
      this.oscillatorsBus.connect(this.lfoFilter)

      let freq = this.clampToMinMax(60, 20000, this.props.Filter.freq * 100 - 8000)
      this.lfoFilter.frequency.value = freq

      let {lfoFreqAmount, lfoFreqRate, lfoFreqShape} = this.props.Filter
      this.lfoFreq.connect(this.lfoFreqGain)
      this.lfoFreq.type = lfoFreqShape
      this.lfoFreq.frequency.value = lfoFreqRate / 10
      this.lfoFreqGain.gain.value = this.clampToMinMax(100, this.props.Filter.freq * 100, lfoFreqAmount * 20)
      this.lfoFreqGain.connect(this.lfoFilter.frequency)
    } else {
      // Disconnect the oscillators from the filter LFO.
      console.log('synth filter lfo disconnect')
      this.oscillatorsBus.connect(this.biquadFilter)
      this.lfoFreq.disconnect()
      this.lfoFreqGain.disconnect()
    }

    // Amp LFO
    if (this.props.Amp.lfoOn) {
      let {lfoAmount, lfoRate, lfoShape} = this.props.Amp
      this.lfoAmp.connect(this.lfoAmpGain)
      this.lfoAmp.type = lfoShape
      this.lfoAmp.frequency.value = lfoRate / 10
      this.lfoAmpGain.gain.value = lfoAmount / 100
      this.lfoAmpGain.connect(this.oscillatorsBus.gain)
    } else {
      // Stop the LFO Amp.
      this.lfoAmp.disconnect()
      this.lfoAmpGain.disconnect()
    }
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
                output={this.oscillatorsBus}
                lfoOn={oscillator.lfoOn}
                lfoRate={oscillator.lfoRate}
                lfoAmount={oscillator.lfoAmount}
                lfoShape={oscillator.lfoShape} />
            )
          })
        }
      </div>
    )
  }
}

export default connect()(Synth)
