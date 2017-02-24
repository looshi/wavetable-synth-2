/*
Synth
Contains all the audio components which comprise the synth.
Nodes are connected in this order :
Oscillators -> Osc Bus -> Filter -> postFilter -> VCA -> Master
*/
import React from 'react'
import {connect} from 'react-redux'
import Oscillator from './Oscillator.js'
import Chorus from './Chorus.js'
import LFO from './LFO.js'
import Arpeggiator from './Arpeggiator/Arpeggiator.js'
import observeStore from '../data/ObserveStore'
import {limit} from '../helpers/helpers.js'

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
    this.oscillatorsBus.connect(this.biquadFilter)
    this.biquadFilter.connect(this.postFilter)
    this.postFilter.connect(this.vcaGain)

    this.vcaGain.connect(this.chorus.inputLeft)
    this.vcaGain.connect(this.chorus.inputRight)
    this.chorus.connect(this.masterGain)
    this.vcaGain.connect(this.masterGain)
    this.masterGain.connect(audioContext.destination)

    // LFOs
    this.LFOs = []
    this.initLFOs(this.props)

    this.startListeners(eventEmitter, props.store)
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
  routeLFO (lfo, destination) {
    lfo.disconnect()
    let id = destination.moduleId

    if (id === 'amp') {
      lfo.connect(this.oscillatorsBus.gain, 0.04)
    }
    if (id === 'filter') {
      lfo.connect(this.biquadFilter.detune, 50)
      this.biquadFilter.connect(lfo.lfoInputAmount)
    }
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

    if (id === 'chorus') {
      if (destination.property === 'time') {
        lfo.connect(this.chorus.lfoInputTime, 0.001)
      } else if (destination.property === 'amount') {
        lfo.connect(this.chorus.lfoInputAmount, 0.01)
      }
    }

    // LFO to LFO mappings.  Sort of works.
    if (id && id[0] === 'l') {
      let targetLFO = this.LFOs.find((osc) => osc.id === id)
      lfo.connect(targetLFO.lfoInputFrequency, 1, true)
    }
  }

  // Stores the notes played in the last two seconds from the last note played.
  // The notes will played in the order recieved by the arpeggiator.
  // Modeled after how the Akai Ax60 collects notes for its arpeggiator.
  collectArpNotes (noteNumber) {
    this.ArpNotes = this.ArpNotes.filter((note) => {
      return note.time > Date.now() - 2000
    })
    this.ArpNotes.push({noteNumber, time: Date.now()})

    let notes = this.ArpNotes.map((n) => n.noteNumber)
    this.Arpeggiator.notes = notes
  }

  startListeners (eventEmitter, store) {
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
      let {attack, sustain} = this.props.Amp
      this.Arpeggiator.noteLength = attack + decay + sustain
    })
    observeStore(store, 'Amp.attack', (attack) => {
      let {decay, sustain} = this.props.Amp
      this.Arpeggiator.noteLength = attack + decay + sustain
    })
    observeStore(store, 'Amp.sustain', (sustain) => {
      let {attack, decay} = this.props.Amp
      this.Arpeggiator.noteLength = attack + decay + sustain
    })
    // Arpeggiator events.  These notes are scheduled in the near future.
    eventEmitter.on('ARP_NOTE_ON', (time, noteNumber) => {
      this.ampEnvelopeOn(time)
      this.filterEnvelopeOn(time)
      this.oscillators.map((osc) => {
        osc.scheduleNote(time, noteNumber)
      })
    })
    eventEmitter.on('ARP_NOTE_OFF', (time) => {
      this.ampEnvelopeOff(time)
      this.filterEnvelopeOff(time)
    })
    // Collects the recent notes played when the ARP is ON to form a sequence.
    eventEmitter.on('ARP_COLLECT_NOTE', (noteNumber) => {
      if (this.Arpeggiator.isOn) {
        this.collectArpNotes(noteNumber)
      }
    })
  }

  filterEnvelopeOn (now) {
    let {frequency} = this.biquadFilter

    let {attack, decay, sustain, freq} = this.props.Filter
    attack = limit(0.001, 1, attack / 100)
    decay = limit(0.001, 1, decay / 100)
    sustain = (sustain / 100) * freq // Sustain is a percentage of freq.
    sustain = limit(60, 20000, sustain * 100)
    freq = limit(60, 20000, freq * 100)

    frequency.cancelScheduledValues(now)
    frequency.setTargetAtTime(freq, now, attack)
    frequency.setTargetAtTime(sustain, now + attack, decay)
  }

  filterEnvelopeOff (now) {
    let {release} = this.props.Filter
    let {frequency} = this.biquadFilter
    release = limit(0.02, 1, release / 50)

    frequency.cancelScheduledValues(now)
    frequency.setTargetAtTime(60, now, release)
  }

  ampEnvelopeOn (now) {
    let {gain} = this.vcaGain
    let {attack, decay, sustain} = this.props.Amp
    attack = limit(0.003, 1, attack / 100)
    decay = limit(0.001, 1, decay / 100)
    sustain = limit(0.001, 1, sustain / 100)

    gain.cancelScheduledValues(now)
    gain.setTargetAtTime(1, now, attack)
    gain.setTargetAtTime(sustain, now + attack, decay)
  }

  ampEnvelopeOff (now) {
    let {gain} = this.vcaGain
    let {release} = this.props.Amp
    release = limit(0.02, 1, release / 100)

    gain.cancelScheduledValues(now)
    gain.setTargetAtTime(0, now, release)
  }

  componentDidUpdate (prevProps, prevState) {
    // Amp
    this.masterGain.gain.value = limit(0, 1, this.props.Master.volume / 100)

    // Filter Res ( freq is set in envelopOn event )
    this.biquadFilter.Q.value = this.props.Filter.res / 3
  }

  render () {
    return null
  }
}

export default connect()(Synth)
