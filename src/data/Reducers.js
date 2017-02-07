import { combineReducers } from 'redux'

// Master.
let Master = {
  volume: 50
}

// Filter.
let Filter = {
  freq: 2000,
  res: 20,
  attack: 0.01,
  decay: 0.5,
  sustain: 0.3,
  release: 0.2
}

// Amp.
let Amp = {
  attack: 0.01,
  decay: 0.5,
  sustain: 0.3,
  release: 0.2
}

// Keyboard, notes are represented as object keys, { 22: 'on', 23: 'off' ... }.
let Keyboard = {}
for (let i = 1; i <= 88; i++) {
  Keyboard[i] = 'off'
}

// Oscillator.
function initOscillator (name) {
  return {
    name,
    id: Math.random().toString(),
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
    note: null // The numeric keyboard note, e.g. A is 48.  Lowest C is zero.
  }
}

let initialState = {
  Master,
  Filter,
  Amp,
  Keyboard,
  Oscillators: [
    initOscillator('1'),
    initOscillator('2'),
    initOscillator('3')
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
    case 'SLIDER_CHANGED':
      if (action.id === 'amp-attack') {
        state.Amp.attack = action.value / 100
      } else if (action.id === 'amp-decay') {
        state.Amp.decay = action.value / 100
      } else if (action.id === 'amp-sustain') {
        state.Amp.sustain = action.value / 100
      } else if (action.id === 'amp-release') {
        state.Amp.release = action.value / 100
      }
      return Object.assign({}, state)
    default:
      return state
  }
}

function FilterReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'SLIDER_CHANGED':
      if (action.id === 'filter-freq') {
        state.Filter.freq = action.value
      } else if (action.id === 'filter-res') {
        state.Filter.res = action.value
      } else if (action.id === 'filter-attack') {
        state.Filter.attack = action.value / 100
      } else if (action.id === 'filter-decay') {
        state.Filter.decay = action.value / 100
      } else if (action.id === 'filter-sustain') {
        state.Filter.sustain = action.value / 100
      } else if (action.id === 'filter-release') {
        state.Filter.release = action.value / 100
      }
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
          osc[action.propertyName] = action.value
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
  OscillatorsReducer
})

export default Reducers
