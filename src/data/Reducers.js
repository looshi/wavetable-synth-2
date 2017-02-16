import { combineReducers } from 'redux'
import queryString from 'query-string'

const URL = queryString.parse(window.location.hash)

// Master.
let Master = {
  id: 'master',
  volume: URL.mv || 25
}

// Filter.
// sustain is Hz value. attack, decay, release are time in seconds.
let Filter = {
  id: 'filter',
  freq: URL.ff || 50,
  res: URL.fr || 20,
  attack: URL.fa || 1,
  decay: URL.fd || 5,
  sustain: URL.fs || 50,
  release: URL.fre || 2,
  lfoFreqOn: false,
  lfoFreqAmount: 0,
  lfoFreqRate: 0,
  lfoFreqShape: 'sine'
}

// Amp.
let Amp = {
  id: 'amp',
  attack: URL.aa || 12,
  decay: URL.ad || 50,
  sustain: URL.as || 30,
  release: URL.ar || 20,
  lfoOn: false,
  lfoAmount: 0,
  lfoRate: 0,
  lfoShape: 'sine'
}

// Chorus.
let Chorus = {
  id: 'chorus',
  amount: URL.ca || 50,
  time: URL.ct || 50
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
    fileA: URL[id + 'fa'] || 'AKWF_bsaw_0005.wav',
    fileB: URL[id + 'fb'] || 'AKWF_cheeze_0001.wav',
    audioBufferA: null,
    audioBufferB: null,
    channelDataA: [],
    channelDataB: [],
    computedChannelData: [],
    algorithm: URL[id + 'al'] || 'plus',
    amount: URL[id + 'a'] || 75,
    detune: URL[id + 'd'] || 0,
    octave: URL[id + 'o'] || 0,
    note: 0 // The numeric keyboard note, e.g. A is 48.  Lowest C is zero.
  }
}

// LFOs
const LFODestinations = [
  {id: '-1', label: 'None'},
  {id: '0', label: 'Amp', moduleId: 'amp', property: 'gain'},
  {id: '1', label: 'Filter', moduleId: 'filter', property: 'freq'},
  {id: '6', label: 'Osc ALL pitch', moduleId: 'oscAll', property: 'detune'},
  {id: '3', label: 'Osc 1 pitch', moduleId: 'osc1', property: 'detune'},
  {id: '4', label: 'Osc 2 pitch', moduleId: 'osc2', property: 'detune'},
  {id: '5', label: 'Osc 3 pitch', moduleId: 'osc3', property: 'detune'},
]

function initLFO (name, id) {
  return {
    name,
    id,
    shape: 'triangle',
    amount: 1,
    rate: 1,
    min: 0,
    max: 1,
    destination: LFODestinations[0],
    destinations: LFODestinations
  }
}

let initialState = {
  Master,
  Filter,
  Amp,
  Chorus,
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

// Set the LFO initial destinations based on URL.
initialState.LFOs.forEach((lfo, index) => {
  // LFO destinations initial settings.
  const dest = lfo.id + 'd'
  const amount = lfo.id + 'a'
  const rate = lfo.id + 'r'
  const shape = lfo.id + 's'
  if (URL[dest]) lfo.destination = lfo.destinations.find((d) => d.id === URL[dest])
  if (URL[amount]) lfo.amount = URL[amount]
  if (URL[rate]) lfo.rate = URL[rate]
  if (URL[shape]) lfo.shape = URL[shape]

  // Amp LFO initial settings.
  if (lfo.destination.id === '0') {
    initialState.Amp.lfoOn = true
    initialState.Amp.lfoAmount = lfo.amount
    initialState.Amp.lfoRate = lfo.rate
    initialState.Amp.lfoShape = lfo.shape
  }

  // Filter LFO initial settings
  if (lfo.destination.id === '1') {
    initialState.Filter.lfoFreqOn = true
    initialState.Filter.lfoFreqAmount = lfo.amount
    initialState.Filter.lfoFreqRate = lfo.rate
    initialState.Filter.lfoFreqShape = lfo.shape
  }
})

// Stores the parameters in the url.
function updateURL (paramName, value) {
  URL[paramName] = value
  window.location.hash = queryString.stringify(URL)
}

function MasterReducer (state, action) {
  state = state || initialState.Master
  switch (action.type) {
    case 'SLIDER_CHANGED':
      if (action.id === 'master') {
        state.volume = action.value
        updateURL('mv', action.value)
        return Object.assign({}, state)
      } else {
        return state
      }
    default:
      return state
  }
}

function KeyboardReducer (state, action) {
  state = state || initialState.Keyboard

  switch (action.type) {
    case 'NOTE_ON':
      state[action.note] = 'on'
      return Object.assign({}, state)
    case 'NOTE_OFF':
      state[action.note] = 'off'
      return Object.assign({}, state)
    default:
      return state
  }
}

function AmpReducer (state, action) {
  state = state || initialState.Amp

  switch (action.type) {
    case 'AMP_SLIDER_CHANGED':
      if (action.name === 'amp-attack') {
        state.attack = action.value
        updateURL('aa', action.value)
      } else if (action.name === 'amp-decay') {
        state.decay = action.value
        updateURL('ad', action.value)
      } else if (action.name === 'amp-sustain') {
        state.sustain = action.value
        updateURL('as', action.value)
      } else if (action.name === 'amp-release') {
        state.release = action.value
        updateURL('ar', action.value)
      }
      return Object.assign({}, state)

    default:
      return state
  }
}

function FilterReducer (state, action) {
  state = state || initialState.Filter

  switch (action.type) {
    case 'FILTER_SLIDER_CHANGED':
      if (action.name === 'filter-freq') {
        state.freq = action.value
        updateURL('ff', action.value)
      } else if (action.name === 'filter-res') {
        state.res = action.value
        updateURL('fr', action.value)
      } else if (action.name === 'filter-attack') {
        state.attack = action.value
        updateURL('fa', action.value)
      } else if (action.name === 'filter-decay') {
        state.decay = action.value
        updateURL('fd', action.value)
      } else if (action.name === 'filter-sustain') {
        state.sustain = action.value
        updateURL('fs', action.value)
      } else if (action.name === 'filter-release') {
        state.release = action.value
        updateURL('fre', action.value)
      }
      return Object.assign({}, state)

    default:
      return state
  }
}

function ChorusReducer (state, action) {
  state = state || initialState.Chorus
  switch (action.type) {
    case 'CHORUS_SLIDER_CHANGED':
      if (action.name === 'chorus-amount') {
        state.amount = action.value
        updateURL('ca', action.value)
      } else if (action.name === 'chorus-time') {
        state.time = action.value
        updateURL('ct', action.value)
      }
      return Object.assign({}, state)
    default:
      return state
  }
}

function LFOsReducer (state, action) {
  state = state || initialState.LFOs
  switch (action.type) {
    case 'LFO_SHAPE_CHANGED':
      state = state.map(function (lfo) {
        if (lfo.id === action.id) {
          lfo.shape = action.shape
          updateURL(lfo.id + 's', action.shape)
        }
        return lfo
      })
      return [...state]

    case 'LFO_RATE_CHANGED':
      let lfo = state.find((l) => l.id === action.id)
      lfo.rate = action.rate
      updateURL(lfo.id + 'r', action.rate)
      return [...state]

    case 'LFO_AMOUNT_CHANGED':
      lfo = state.find((l) => l.id === action.id)
      lfo.amount = action.amount
      updateURL(lfo.id + 'a', action.amount)
      return [...state]

    case 'LFO_DESTINATION_CHANGED':
      state = state.map(function (lfo) {
        if (lfo.id === action.id) {
          lfo.destination = action.newDestination
          updateURL(lfo.id + 'd', action.newDestination.id)
        }
        return lfo
      })
      return [...state]
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
  state = state || initialState.Oscillators

  switch (action.type) {
    case 'WAVE_FLE_LOAD_STARTED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          if (action.side === 'A') {
            osc.fileA = action.file
            updateURL(osc.id + 'fa', action.file)
          } else if (action.side === 'B') {
            osc.fileB = action.file
            updateURL(osc.id + 'fb', action.file)
          }
        }
        return osc
      })
      return [...state]

    case 'WAVE_FLE_LOAD_COMPLETED':
      state = state.map(function (osc) {
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
      return [...state]

    // The +, -, /, * selected operator was changed.
    case 'OSC_ALGORITHM_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          osc.algorithm = action.algorithm
          updateURL(osc.id + 'al', action.algorithm)
        }
        osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm)
        return osc
      })
      return [...state]

    // A key was pressed on the keyboard, updates each oscillators' pitch.
    case 'NOTE_ON':
      state = state.map(function (osc) {
        osc.note = action.note
        return osc
      })
      return [...state]

    // Updates local osc values, detune, octave, and amt.
    case 'SLIDER_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          osc[action.name] = action.value
          const paramName = osc.id + action.name[0] // id + first letter of param.
          updateURL(paramName, action.value)
        }
        return osc
      })
      return [...state]

    default:
      return state
  }
}

const Reducers = combineReducers({
  Master: MasterReducer,
  Filter: FilterReducer,
  Amp: AmpReducer,
  Chorus: ChorusReducer,
  Keyboard: KeyboardReducer,
  LFOs: LFOsReducer,
  Oscillators: OscillatorsReducer
})

export default Reducers
