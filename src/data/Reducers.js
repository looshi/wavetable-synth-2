import { combineReducers } from 'redux'

// Master.
let Master = {
  id: 'master',
  volume: 25
}

// Filter.
// sustain is Hz value. attack, decay, release are time in seconds.
let Filter = {
  id: 'filter',
  freq: 50,
  res: 20,
  attack: 1,
  decay: 5,
  sustain: 50,
  release: 2
}

// Amp.
let Amp = {
  id: 'amp',
  attack: 12,
  decay: 50,
  sustain: 30,
  release: 20
}

// Keyboard, notes are represented as object keys, { 22: 'on', 23: 'off' ... }.
let Keyboard = {}
for (let i = 1; i <= 88; i++) {
  Keyboard[i] = 'off'
}

// Oscillator.
function initOscillator (name, id) {
  return {
    name,
    id,
    fileA: 'AKWF_bsaw_0005.wav',
    fileB: 'AKWF_cheeze_0001.wav',
    audioBufferA: null,
    audioBufferB: null,
    channelDataA: [],
    channelDataB: [],
    computedChannelData: [],
    algorithm: 'plus',
    amount: 75,
    detune: 0,
    octave: 0,
    note: null, // The numeric keyboard note, e.g. A is 48.  Lowest C is zero.
    lfoOn: false,
    lfoAmount: 0,
    lfoRate: 0,
    lfoShape: 'sine'
  }
}

// LFOs
function initLFO (name, id) {
  return {
    name,
    id,
    shape: 'triangle',
    amount: 50,
    rate: 50,
    destination: {id: '-1', label: 'none', active: true},
    destinations: [
      {id: '-1', label: 'none', active: true},
      {id: '0', label: 'amp amount', moduleId: 'amp', property: 'gain', active: false},
      {id: '1', label: 'filter frequency', moduleId: 'filter', property: 'freq', active: false},
      {id: '2', label: 'filter resonance', moduleId: 'filter', property: 'res', active: false},
      {id: '3', label: 'filter frequency', moduleId: 'filter', property: 'frequency', active: false},
      {id: '4', label: 'osc 1 pitch', moduleId: 'osc1', property: 'detune', active: false},
      {id: '5', label: 'osc 2 pitch', moduleId: 'osc2', property: 'detune', active: false},
      {id: '6', label: 'osc 3 pitch', moduleId: 'osc3', property: 'detune', active: false}
    ]
  }
}

let initialState = {
  Master,
  Filter,
  Amp,
  Keyboard,
  Oscillators: [
    initOscillator('1', 'osc1'),
    initOscillator('2', 'osc2'),
    initOscillator('3', 'osc3')
  ],
  LFOs: [
    initLFO('1', 'lfo1'),
    initLFO('2', 'lfo2'),
    initLFO('3', 'lfo3')
  ]
}

function MasterReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'SLIDER_CHANGED':
      if (action.id === 'master') {
        state.Master.volume = action.value
        return Object.assign({}, state)
      } else {
        return state
      }
    default:
      return state
  }
}

function KeyboardReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'NOTE_ON':
      state.Keyboard[action.note] = 'on'
      return Object.assign({}, state)
    case 'NOTE_OFF':
      state.Keyboard[action.note] = 'off'
      return Object.assign({}, state)
    default:
      return state
  }
}

function AmpReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'AMP_SLIDER_CHANGED':
      let Amp = Object.assign({}, state.Amp)
      if (action.name === 'amp-attack') {
        Amp.attack = action.value
      } else if (action.name === 'amp-decay') {
        Amp.decay = action.value
      } else if (action.name === 'amp-sustain') {
        Amp.sustain = action.value
      } else if (action.name === 'amp-release') {
        Amp.release = action.value
      }
      state.Amp = Amp
      return Object.assign({}, state)
    default:
      return state
  }
}

function FilterReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'FILTER_SLIDER_CHANGED':
    console.log('filter slider changed', action)
      let Filter = Object.assign({}, state.Filter)
      if (action.name === 'filter-freq') {
        Filter.freq = action.value
      } else if (action.name === 'filter-res') {
        Filter.res = action.value
      } else if (action.name === 'filter-attack') {
        Filter.attack = action.value
      } else if (action.name === 'filter-decay') {
        Filter.decay = action.value
      } else if (action.name === 'filter-sustain') {
        Filter.sustain = action.value
      } else if (action.name === 'filter-release') {
        Filter.release = action.value
      }
      state.Filter = Filter
      return Object.assign({}, state)
    default:
      return state
  }
}

function LFOsReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'LFO_SHAPE_CHANGED':
      state.LFOs = state.LFOs.map(function (lfo) {
        if (lfo.id === action.id) {
          lfo.shape = action.shape
        }
        return lfo
      })
      return Object.assign({}, state)

    case 'LFO_RATE_CHANGED':
      let lfo = state.LFOs.find((l) => l.id === action.id)
      lfo.rate = action.rate
      return Object.assign({}, state)

    case 'LFO_AMOUNT_CHANGED':
      lfo = state.LFOs.find((l) => l.id === action.id)
      lfo.amount = action.amount
      return Object.assign({}, state)

    case 'LFO_DESTINATION_CHANGED':
      // Mark new destination as active:true to disable it in LFO dropdowns.
      // Mark previous destination as active:false to enable it in dropdown.
      state.LFOs = state.LFOs.map(function (lfo) {
        lfo.destination.active = false
        let destinations = [...lfo.destinations]
        destinations.forEach((dest) => {
          if (dest.id === action.oldDestination.id) {
            dest.active = false
          } else if (dest.id === action.newDestination.id && dest.id !== '-1') {
            dest.active = true
          }
        })
        lfo.destinations = destinations

        if (lfo.id === action.id) {
          lfo.destination = action.newDestination
        }
        return lfo
      })
      return Object.assign({}, state)

    case 'SLIDER_CHANGED':
      state.LFOs = state.LFOs.map(function (lfo) {
        if (lfo.id === action.id) {
          if (action.name === 'lfo-amount') {
            lfo.amount = action.value
          } else if (action.name === 'lfo-rate') {
            lfo.rate = action.value
          }
        }
        return lfo
      })
      return Object.assign({}, state)
    default:
      return state
  }
}

// Update the computed waveform based on the current algorithm.
function computeWaveform (channelDataA, channelDataB, algorithm) {
  if (!channelDataA || !channelDataB || !algorithm) {
    return []
  }

  return channelDataB.map(function (data, index) {
    if (algorithm === 'plus') {
      return channelDataA[index] + channelDataB[index]
    } else if (algorithm === 'minus') {
      return channelDataA[index] - channelDataB[index]
    } else if (algorithm === 'divide') {
      return channelDataA[index] / channelDataB[index]
    } else if (algorithm === 'multiply') {
      return channelDataA[index] * channelDataB[index]
    }
  })
}

function OscillatorsReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'WAVE_FLE_LOAD_STARTED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.id) {
          if (action.side === 'A') {
            osc.fileA = action.file
          } else if (action.side === 'B') {
            osc.fileB = action.file
          }
        }
        return osc
      })
      return Object.assign({}, state)

    case 'WAVE_FLE_LOAD_COMPLETED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.id) {
          // Update the A or B channel data and audio buffer on load.
          if (action.side === 'A') {
            osc.audioBufferA = action.audioBuffer
            osc.channelDataA = action.channelData
          } else if (action.side === 'B') {
            osc.audioBufferB = action.audioBuffer
            osc.channelDataB = action.channelData
          }
          osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm)
        }
        return osc
      })
      return Object.assign({}, state)

    // The +, -, /, * selected operator was changed.
    case 'OSC_ALGORITHM_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.id) {
          osc.algorithm = action.algorithm
        }
        osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm)
        return osc
      })
      return Object.assign({}, state)

    // A key was pressed on the keyboard, updates each oscillators' pitch.
    case 'NOTE_ON':
      state.Oscillators = state.Oscillators.map(function (osc) {
        osc.note = action.note
        return osc
      })
      return Object.assign({}, state)

    // Updates local osc values, detune, octave, and amt.
    case 'SLIDER_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.id) {
          osc[action.name] = action.value
        }
        return osc
      })
      return Object.assign({}, state)

    case 'LFO_AMOUNT_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.destination.moduleId) {
          osc.lfoAmount = action.amount
        }
        return osc
      })
      return Object.assign({}, state)

    case 'LFO_RATE_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.destination.moduleId) {
          osc.lfoRate = action.rate
        }
        return osc
      })
      return Object.assign({}, state)

    case 'LFO_SHAPE_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.destination.moduleId) {
          osc.lfoShape = action.shape
        }
        return osc
      })
      return Object.assign({}, state)

    // Turn on the LFO if an oscillator was selected as a destination.
    case 'LFO_DESTINATION_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        // Turn off LFO.
        if (osc.id === action.oldDestination.moduleId) {
          osc.lfoOn = false
        }
        // Turn on LFO.
        if (osc.id === action.newDestination.moduleId) {
          let lfo = state.LFOs.find((l) => l.id === action.id)
          osc.lfoOn = true
          osc.lfoRate = lfo.rate
          osc.lfoAmount = lfo.amount
          osc.lfoShape = lfo.shape
        }
        return osc
      })
      return Object.assign({}, state)

    default:
      return state
  }
}

const Reducers = combineReducers({
  MasterReducer,
  FilterReducer,
  AmpReducer,
  KeyboardReducer,
  LFOsReducer,
  OscillatorsReducer
})

export default Reducers
