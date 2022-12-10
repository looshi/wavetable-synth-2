/*
Synth
Contains all the audio components which comprise the synth.
Nodes are connected in this order :
Oscillators -> Osc Bus -> Distortion (subtle) -> Filter -> VCA -> Master
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Oscillator from './Oscillator.js'
import Chorus from './Chorus.js'
import Filter from './Filter.js'
import LFO from './LFO.js'
import Arpeggiator from './Arpeggiator/Arpeggiator.js'
import observeStore from '../data/ObserveStore'
import { limit } from '../helpers/helpers.js'
import Actions from '../data/Actions.js'

class Synth extends React.Component {
  constructor(props, context) {
    super(props, context)
    let { audioContext, eventEmitter } = this.props

    // Amp
    this.masterGain = audioContext.createGain()
    this.vcaGain = audioContext.createGain()
    this.vcaGain.gain.value = 0

    // Limiter
    this.limiter = audioContext.createDynamicsCompressor()
    this.limiter.threshold.value = 0.0
    this.limiter.knee.value = 0.0
    this.limiter.ratio.value = 20.0
    this.limiter.attack.value = 0.005
    this.limiter.release.value = 0.050

    // Distortion
    this.distortion = audioContext.createWaveShaper()
    this.distortion.curve = this.makeDistortionCurve()
    this.distortion.oversample = '4x'

    // Oscillators bus
    this.oscillatorsBus = audioContext.createGain()
    this.oscillatorsBus.gain.value = 1
    this.oscillators = []
    this.initOscillators(this.props)

    // Filter
    this.biquadFilter = new Filter(audioContext)

    // Chorus
    this.chorus = new Chorus(audioContext, props.store)
    this.chorus.amount = this.props.Effects.chorusAmount
    this.chorus.time = this.props.Effects.chorusTime

    // Arpeggiator
    let options = {
      audioContext,
      eventEmitter: eventEmitter,
      ampEnvelopeOn: this.ampEnvelopeOn.bind(this),
      ampEnvelopeOff: this.ampEnvelopeOff.bind(this)
    }
    this.Arpeggiator = new Arpeggiator(options)
    this.ArpNotes = []

    // Connections
    this.oscillatorsBus.connect(this.distortion)
    this.distortion.connect(this.biquadFilter.input)
    this.biquadFilter.output.connect(this.vcaGain)

    this.vcaGain.connect(this.chorus.inputLeft)
    this.vcaGain.connect(this.chorus.inputRight)
    this.chorus.connect(this.masterGain)
    this.vcaGain.connect(this.masterGain)

    this.masterGain.connect(this.limiter)
    this.limiter.connect(audioContext.destination)

    // LFOs
    this.LFOs = []
    this.initLFOs(this.props)

    this.startListeners(eventEmitter, props.store)
  }

  initOscillators(props) {
    props.Oscillators.map((o, index) => {
      let options = {
        id: o.id,
        name: o.name,
        computedChannelData: o.computedChannelData,
        detune: o.detune,
        octave: o.octave,
        amount: o.amount,
        note: o.note,
        audioContext: props.audioContext,
        output: this.oscillatorsBus,
        glide: props.Effects.glide
      }

      let osc = new Oscillator(options)
      this.oscillators.push(osc)

      let observableProps = [
        'amount',
        'detune',
        'note',
        'octave',
        'computedChannelData',
        'glide'
      ]
      observableProps.forEach((prop) => {
        observeStore(props.store, `Oscillators[${index}].${prop}`, (val) => {
          osc[prop] = val
        })
      })
    })
  }

  initLFOs(props) {
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
      this.LFOs.push(lfo)
    })

    // Keep this as a separate pass.
    // Fixes issue where LFO tries to map to another LFO that isn't created yet.
    props.LFOs.map((l, index) => {
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
          this.LFOs[index][prop] = val
        })
      })
      // Wire up destination changes in a separate function.
      observeStore(props.store, `LFOs[${index}].destination`, (destination) => {
        this.routeLFO(this.LFOs[index], destination)
      })
    })
  }

  // Route LFOs to targets.
  routeLFO(lfo, destination) {
    lfo.disconnect()
    // Disconnect the LFO from any oscillators ( if it was set to any ).
    this.oscillators.map((osc) => {
      osc.disconnectPitchFromLFO(lfo)
      osc.disconnectAmountFromLFO(lfo)
    })

    let id = destination.moduleId

    // LFO to Amp.
    if (id === 'amp') {
      lfo.connect(this.oscillatorsBus.gain, 0.04)
    }

    // LFO to Filter.
    if (id === 'filter') {
      // Have to do this for each filter instance.
      this.biquadFilter.filters.forEach((filter) => {
        lfo.connect(filter.detune, 50)
      })
    }

    // LFO to oscillator detune and amount.
    if (id === 'oscAll') {
      this.oscillators.map((osc) => {
        osc.connectPitchToLFO(lfo, true)
      })
    }
    if (id && id[0] === 'o' && id !== 'oscAll') {
      let osc = this.oscillators.find((osc) => osc.id === id)
      if (destination.property === 'detune') {
        osc.connectPitchToLFO(lfo)
      } else if (destination.property === 'amount') {
        osc.connectAmountToLFO(lfo)
      }
    }

    // LFO to Effects.
    if (id === 'effects') {
      if (destination.property === 'chorusTime') {
        lfo.connect(this.chorus.lfoInputTime, 0.01)
      } else if (destination.property === 'chorusAmount') {
        lfo.connect(this.chorus.lfoInputAmount, 0.05)
      }
    }

    // LFO to LFO.
    if (id && id[0] === 'l') {
      let targetLFO = this.LFOs.find((l) => l.id === id)
      lfo.connect(targetLFO.lfoInputFrequency, 1)
    }
  }

  // Stores the notes played in the last few seconds from the last note played.
  // The notes will played in the order recieved by the arpeggiator.
  // Modeled after how the Akai Ax60 collects notes for its arpeggiator.
  collectArpNotes(noteNumber) {
    this.ArpNotes = this.ArpNotes.filter((note) => {
      return note.time > Date.now() - 5000
    })
    this.ArpNotes.push({ noteNumber, time: Date.now() })

    let notes = this.ArpNotes.map((n) => n.noteNumber)
    this.Arpeggiator.notes = notes
  }

  startListeners(eventEmitter, store) {
    // Keyboard note on / off events.  These should happen "now" = currentTime.
    eventEmitter.on('NOTE_ON', (noteNumber) => {
      this.ampEnvelopeOn(this.props.audioContext.currentTime)
      this.filterEnvelopeOn(this.props.audioContext.currentTime)
    })
    eventEmitter.on('NOTE_OFF', (noteNumber) => {
      this.ampEnvelopeOff(this.props.audioContext.currentTime)
      this.filterEnvelopeOff(this.props.audioContext.currentTime)
    })

    // Chorus properties.
    observeStore(store, 'Effects.chorusAmount', (amount) => {
      this.chorus.amount = amount
    })
    observeStore(store, 'Effects.chorusTime', (time) => {
      this.chorus.time = time
    })

    //  Arpeggiator properties.
    observeStore(store, 'Effects.arpIsOn', (isOn) => {
      this.Arpeggiator.isOn = isOn
    })
    observeStore(store, 'Effects.arpTempo', (tempo) => {
      this.Arpeggiator.tempo = tempo
    })
    observeStore(store, 'Amp.decay', (decay) => {
      let { attack, sustain } = this.props.Amp
      this.Arpeggiator.noteLength = attack + decay + sustain
    })
    observeStore(store, 'Amp.attack', (attack) => {
      let { decay, sustain } = this.props.Amp
      this.Arpeggiator.noteLength = attack + decay + sustain
    })
    observeStore(store, 'Amp.sustain', (sustain) => {
      let { attack, decay } = this.props.Amp
      this.Arpeggiator.noteLength = attack + decay + sustain
    })
    // Arpeggiator events.  These notes are scheduled in the near future.
    eventEmitter.on('ARP_NOTE_ON', (time, noteNumber) => {
      this.props.dispatch(Actions.keyboardNoteShow(noteNumber))
      this.ampEnvelopeOn(time)
      this.filterEnvelopeOn(time)
      this.oscillators.map((osc) => {
        osc.scheduleNote(time, noteNumber)
      })
    })
    eventEmitter.on('ARP_NOTE_OFF', (time, noteNumber) => {
      setTimeout(() => {
        this.props.dispatch(Actions.keyboardNoteHide(noteNumber))
      }, 50)
      this.ampEnvelopeOff(time)
      this.filterEnvelopeOff(time)
    })
    // Collects the recent notes played when the ARP is ON to form a sequence.
    eventEmitter.on('ARP_COLLECT_NOTE', (noteNumber) => {
      this.collectArpNotes(noteNumber)
    })
  }

  filterEnvelopeOn(now) {
    let { attack, decay, sustain, freq } = this.props.Filter
    attack = limit(0.001, 1, attack / 100)
    decay = limit(0.001, 1, decay / 100)
    sustain = (sustain / 100) * freq // Sustain is a percentage of freq.
    sustain = limit(60, 20000, sustain * 100)
    freq = limit(60, 20000, freq * 100)

    this.biquadFilter.cancelScheduledValues(now)
    this.biquadFilter.setTargetAtTime(freq, now, attack)
    this.biquadFilter.setTargetAtTime(sustain, now + attack, decay)
  }

  filterEnvelopeOff(now) {
    let { release } = this.props.Filter
    release = limit(0.02, 1, release / 50)

    this.biquadFilter.cancelScheduledValues(now)
    this.biquadFilter.setTargetAtTime(60, now, release)
  }

  ampEnvelopeOn(now) {
    let { gain } = this.vcaGain
    let { attack, decay, sustain } = this.props.Amp
    attack = limit(0.003, 1, attack / 100)
    decay = limit(0.001, 1, decay / 100)
    sustain = limit(0.001, 1, sustain / 100)

    gain.cancelScheduledValues(now)
    gain.setTargetAtTime(1, now, attack)
    gain.setTargetAtTime(sustain, now + attack, decay)
  }

  ampEnvelopeOff(now) {
    let { gain } = this.vcaGain
    let { release } = this.props.Amp
    release = limit(0.02, 1, release / 100)

    gain.cancelScheduledValues(now)
    gain.setTargetAtTime(0, now, release)
  }

  componentDidUpdate(prevProps, prevState) {
    // Amp
    this.masterGain.gain.value = limit(0, 1, this.props.Master.volume / 100)

    // Filter Res ( freq is set in envelopOn event )
    this.biquadFilter.Q = this.props.Filter.res
  }

  render() {
    return null
  }

  // http://www.carbon111.com/waveshaping1.html
  // f(x)=(arctan x)/pi
  makeDistortionCurve(amount) {
    let nSamples = 44100
    let curve = new Float32Array(nSamples)
    let x
    for (var i = 0; i < nSamples; ++i) {
      x = i * 2 / nSamples - 1
      curve[i] = Math.atan(x) / (Math.PI / 2)
    }
    return curve
  }
}

export default connect()(Synth)
