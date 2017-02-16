/*
Synth
Contains all the audio components which comprise the synth.
Nodes are connected in this order :
Oscillators -> Osc Bus -> Filter -> postFilter -> VCA -> Master
*/
import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import Oscillator from './Oscillator.js'
import Chorus from './Chorus.js'
import LFO from './LFO.js'
import observeStore from '../data/ObserveStore'

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
    this.oscillators = []
    this.initOscillators(this.props)

    // Filter
    this.biquadFilter = audioContext.createBiquadFilter()
    this.biquadFilter.type = 'lowpass'
    this.biquadFilter.frequency.value = 0
    this.biquadFilter.gain.value = 5000  // We can add a slider for this.



    // The filter LFO targets this postFilter.
    this.postFilter = audioContext.createBiquadFilter()
    this.postFilter.type = 'lowpass'
    this.postFilter.frequency.value = 10000
    this.postFilter.gain.value = 5000

    // Chorus
    this.chorus = new Chorus(audioContext, props.store)
    this.chorus.amount = this.props.Chorus.amount
    this.chorus.time = this.props.Chorus.time

    // Connections
    // oscillator bus is sent to postFilter when Filter LFO is on.

    this.oscillatorsBus.connect(this.biquadFilter)
    this.biquadFilter.connect(this.postFilter)
    this.postFilter.connect(this.vcaGain)

    this.vcaGain.connect(this.chorus.inputLeft)
    this.vcaGain.connect(this.chorus.inputRight)
    this.chorus.connect(this.masterGain)
    this.vcaGain.connect(this.masterGain)
    this.masterGain.connect(audioContext.destination)

    this.startListeners(eventEmitter, props.store)

    // LFOs
    this.initLFOs(this.props)
  }

  initOscillators (props) {
    props.Oscillators.map((o, index) => {
      let options = {
        id: o.id,
        name: o.name,
        computedChannelData: o.computedChannelData,
        detune: o.detune,
        octave: o.octave,
        amount: o.amount,
        note: o.note,
        audioContext: this.props.audioContext,
        output: this.oscillatorsBus
      }

      let osc = new Oscillator(options)
      this.oscillators.push(osc)

      let observableProps = [
        'amount',
        'detune',
        'note',
        'octave',
        'computedChannelData'
      ]
      observableProps.forEach((prop) => {
        observeStore(props.store, `Oscillators[${index}].${prop}`, (val) => {
          osc[prop] = val
        })
      })
    })
  }

  initLFOs (props) {
    props.LFOs.map((l, index) => {
      let options = {
        name: l.name,
        id: l.id,
        shape: l.shape,
        amount: l.amount,
        rate: l.rate,
        min: l.min,
        max: l.max,
        destination: l.destination,
        audioContext: this.props.audioContext
      }

      let lfo = new LFO(options)

      let observableProps = [
        'destination', // Has to be first, else race condition occurs.
        'amount',
        'rate',
        'min',
        'max',
        'shape'
      ]
      observableProps.forEach((prop) => {
        observeStore(props.store, `LFOs[${index}].${prop}`, (val) => {
          lfo[prop] = val
        })
      })
      // Wire up destination changes in a separate function.
      observeStore(props.store, `LFOs[${index}].destination`, (destination) => {
        this.routeLFO(lfo, destination)
      })
    })
  }

  // Route LFOs to targets.
  routeLFO (lfo, destination) {
    lfo.disconnect()
    let id = destination.moduleId

    if (id === 'amp') {
      lfo.connect(this.oscillatorsBus.gain, 0.01)
    }
    if (id === 'filter') {
      lfo.connect(this.biquadFilter.frequency, 1000)
    }
    if (id === 'oscAll') {
      this.oscillators.map((osc) => {
        osc.connectToLFO(lfo, true)
      })
    }
    if (_.includes(id, 'osc') && id !== 'oscAll') {
      let osc = this.oscillators.find((osc) => osc.id === id)
      if (destination.property === 'detune') {
        osc.connectPitchToLFO(lfo)
      } else if (destination.property === 'amount') {
        osc.connectAmountToLFO(lfo)
      }
    }
    // if (_.includes(id, 'lfo')) {
    //   return this.props.LFOs.find((osc) => osc.id === id)
    // }
    // this.oscillatorsBus.connect(this.biquadFilter)
  }

  startListeners (eventEmitter, store) {
    // Keyboard note on / off events.
    eventEmitter.on('NOTE_ON', () => {
      this.ampEnvelopeOn()
      this.filterEnvelopeOn()
    })
    eventEmitter.on('NOTE_OFF', () => {
      this.ampEnvelopeOff()
      this.filterEnvelopeOff()
    })

    observeStore(store, 'Chorus.amount', (amount) => {
      this.chorus.amount = amount
    })
    observeStore(store, 'Chorus.time', (time) => {
      this.chorus.time = time
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
    // if (this.props.Filter.lfoFreqOn) {
    //   this.oscillatorsBus.connect(this.lfoFilter)
    //
    //   let freq = this.clampToMinMax(60, 20000, this.props.Filter.freq * 100 - 8000)
    //   this.lfoFilter.frequency.value = freq
    //
    //   let {lfoFreqRate, lfoFreqShape} = this.props.Filter
    //   this.lfoFreq.connect(this.lfoFreqGain)
    //   this.lfoFreq.type = lfoFreqShape
    //   this.lfoFreq.frequency.value = lfoFreqRate / 10
    //   this.lfoFreqGain.gain.value = 1000 // this.clampToMinMax(100, this.props.Filter.freq, 1)
    //
    //   this.lfoFreqGain.connect(this.lfoFilter.frequency)
    // } else {
    //   // Disconnect the oscillators from the filter LFO.
    //   this.oscillatorsBus.connect(this.biquadFilter)
    //   this.lfoFreq.disconnect()
    //   this.lfoFreqGain.disconnect()
    // }

    // Amp LFO
  //   if (this.props.Amp.lfoOn) {
  //     let {lfoAmount, lfoRate, lfoShape} = this.props.Amp
  //     this.lfoAmp.connect(this.lfoAmpGain)
  //     this.lfoAmp.type = lfoShape
  //     this.lfoAmp.frequency.value = lfoRate / 10
  //     this.lfoAmpGain.gain.value = lfoAmount / 100
  //     this.lfoAmpGain.connect(this.oscillatorsBus.gain)
  //   } else {
  //     // Stop the LFO Amp.
  //     this.lfoAmp.disconnect()
  //     this.lfoAmpGain.disconnect()
  //   }
  }

  render () {
    return null
  }
}

export default connect()(Synth)
