import { combineReducers } from 'redux'
import queryString from 'query-string'
import {limit} from '../helpers/helpers.js'

let Master = {}
let Filter = {}
let Amp = {}
let Effects = {}
let Keyboard = {}

// The list of waveforms should only be loaded once when the page loads,
// not reloaded each time a preset changes.
let OSC_WAV_FILES = []

// LFOs
const LFODestinations = [
  {id: '-1', label: 'None'},
  {id: '0', label: 'Amp', moduleId: 'amp', property: 'gain'},
  {id: '1', label: 'Filter', moduleId: 'filter', property: 'freq'},
  {id: '6', label: 'Osc ALL Pitch', moduleId: 'oscAll', property: 'detune'},
  {id: '3', label: 'Osc 1 Pitch', moduleId: 'o1', property: 'detune'},
  {id: '4', label: 'Osc 2 Pitch', moduleId: 'o2', property: 'detune'},
  {id: '5', label: 'Osc 3 Pitch', moduleId: 'o3', property: 'detune'},
  {id: '7', label: 'Osc 1 Amount', moduleId: 'o1', property: 'amount'},
  {id: '8', label: 'Osc 2 Amount', moduleId: 'o2', property: 'amount'},
  {id: '9', label: 'Osc 3 Amount', moduleId: 'o3', property: 'amount'},
  {id: '10', label: 'Chorus Amount', moduleId: 'effects', property: 'chorusAmount'},
  {id: '11', label: 'Chorus Time', moduleId: 'effects', property: 'chorusTime'},
  {id: '12', label: 'LFO 1', moduleId: 'l1', property: 'amount'},
  {id: '13', label: 'LFO 2', moduleId: 'l2', property: 'amount'},
  {id: '14', label: 'LFO 3', moduleId: 'l3', property: 'amount'}
]

function initializeState (URL) {
  // Master.
  Master = {
    id: 'master',
    volume: URL.mv || 25,
    presetId: URL.p || 'Custom'
  }

  // Filter.
  // Sustain is Hz value. Attack, Decay and Release are time in seconds.
  Filter = {
    id: 'filter',
    freq: URL.ff || 50,
    res: URL.fr || 20,
    attack: URL.fa || 1,
    decay: URL.fd || 5,
    sustain: URL.fs || 50,
    release: URL.fre || 2
  }

  // Amp.
  Amp = {
    id: 'amp',
    attack: URL.aa || 12,
    decay: URL.ad || 50,
    sustain: URL.as || 30,
    release: URL.ar || 20
  }

  // Effects.
  Effects = {
    id: 'effects',
    chorusAmount: URL.ca || 50,
    chorusTime: URL.ct || 50,
    glide: URL.g || 20,
    arpIsOn: URL.ao || true,
    arpTempo: URL.at || 100
  }

  // Keyboard, notes are represented as object keys, { 24: 'on', 25: 'off' ... }.
  // 24 is the lowest note.
  Keyboard = {}
  for (let i = 24; i <= 88 + 24; i++) {
    Keyboard[i] = 'off'
  }

  let initialState = {
    Master,
    Filter,
    Amp,
    Effects,
    Keyboard,
    Oscillators: [
      initOscillator(URL, '1', 'o1', '#00BBBE'),
      initOscillator(URL, '2', 'o2', '#FF7403'),
      initOscillator(URL, '3', 'o3', '#A7CA33')
    ],
    LFOs: [
      initLFO('1', 'l1'),
      initLFO('2', 'l2'),
      initLFO('3', 'l3')
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
    if (URL[amount]) lfo.amount = Number(URL[amount])
    if (URL[rate]) lfo.rate = Number(URL[rate])
    if (URL[shape]) lfo.shape = URL[shape]
  })

  return initialState
}

// Oscillator.
function initOscillator (URL, name, id, color) {
  return {
    name,
    id,
    fileA: URL[id + 'fa'] || 'dbass',
    fileB: URL[id + 'fb'] || 'cheeze',
    audioBufferA: null,
    audioBufferB: null,
    channelDataA: [],
    channelDataB: [],
    computedChannelData: [],
    algorithm: URL[id + 'al'] || 'p',
    amount: URL[id + 'a'] || 75,
    detune: URL[id + 'd'] || 0,
    octave: URL[id + 'o'] || 0,
    note: 0, // The numeric keyboard note, e.g. A is 48.  Lowest C is zero.
    color,
    waveFiles: OSC_WAV_FILES,
    glide: URL.g || 20
  }
}

function initLFO (name, id) {
  return {
    name,
    id,
    shape: 't',
    amount: 1,
    rate: 1,
    min: 0,
    max: 1,
    destination: LFODestinations[0],
    destinations: LFODestinations
  }
}

// Stores the parameters in the url.
function updateURL (paramName, value) {
  let urlData = queryString.parse(window.location.hash)
  urlData[paramName] = value
  window.location.hash = queryString.stringify(urlData)
}

// Initialize the state.
let urlData = queryString.parse(window.location.hash)
let initialState = initializeState(urlData)

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

function EffectsReducer (state, action) {
  state = state || initialState.Effects
  switch (action.type) {
    case 'CHORUS_SLIDER_CHANGED':
      if (action.name === 'chorus-amount') {
        state.chorusAmount = action.value
        updateURL('ca', action.value)
      } else if (action.name === 'chorus-time') {
        state.chorusTime = action.value
        updateURL('ct', action.value)
      }
      return Object.assign({}, state)
    case 'GLIDE_CHANGED':
      state.glide = action.value
      updateURL('g', action.value)
      return Object.assign({}, state)
    case 'ARP_TEMPO_CHANGED':
      state.arpTempo = action.value
      updateURL('at', action.value)
      return Object.assign({}, state)
    case 'ARP_IS_ON':
      state.arpIsOn = action.value
      updateURL('ao', action.value)
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
    if (algorithm === 'p') {
      return limit(-1, 1, channelDataA[index] + channelDataB[index])
    } else if (algorithm === 'm') {
      return limit(-1, 1, channelDataA[index] - channelDataB[index])
    } else if (algorithm === 'd') {
      return limit(-1, 1, channelDataA[index] / (channelDataB[index] * 2))
    } else if (algorithm === 'x') {
      return limit(-1, 1, channelDataA[index] * channelDataB[index])
    }
  })
}

function OscillatorsReducer (state, action) {
  state = state || initialState.Oscillators

  switch (action.type) {
    case 'WAVE_FILE_LIST_LOADED':
      state = state.map(function (osc) {
        OSC_WAV_FILES = action.files
        if (!osc.waveFiles.length) {
          osc.waveFiles = [...action.files] // Only set this once per page load.
        }
        return osc
      })
      return [...state]

    case 'WAVE_FILE_LOAD_STARTED':
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

    case 'WAVE_FILE_LOAD_COMPLETED':
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

    case 'GLIDE_CHANGED':
      state = state.map(function (osc) {
        osc.glide = action.value
        return osc
      })
      return [...state]

    default:
      return state
  }
}

const appReducer = combineReducers({
  Master: MasterReducer,
  Filter: FilterReducer,
  Amp: AmpReducer,
  Effects: EffectsReducer,
  Keyboard: KeyboardReducer,
  LFOs: LFOsReducer,
  Oscillators: OscillatorsReducer
})

const Reducers = (state, action) => {
  if (action.type === 'LOAD_PRESET_URL_DATA') {
    let urlData = queryString.parse(window.location.hash)
    state = initializeState(urlData)
    state.Master.presetId = action.presetId
  }

  return appReducer(state, action)
}

export default Reducers
