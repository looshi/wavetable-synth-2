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
let OSC_WAV_FILES = {}

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

// Converts string url values into Number values.
// Sets a default if no url value is present.
function urlVal (val, defaultValue) {
  if (val === 0) {
    return 0
  } else if (!val) {
    return defaultValue
  } else {
    return Number(val)
  }
}

function initializeState (URL) {
  // Master.
  Master = {
    id: 'master',
    volume: urlVal(URL.mv, 25),
    presetId: urlVal(URL.p, -1)
  }

  // Filter.
  // Sustain is Hz value. Attack, Decay and Release are time in seconds.
  Filter = {
    id: 'filter',
    freq: urlVal(URL.ff, 50),
    res: urlVal(URL.fr, 20),
    attack: urlVal(URL.fa, 1),
    decay: urlVal(URL.fd, 5),
    sustain: urlVal(URL.fs, 50),
    release: urlVal(URL.fre, 2)
  }

  // Amp.
  Amp = {
    id: 'amp',
    attack: urlVal(URL.aa, 12),
    decay: urlVal(URL.ad, 50),
    sustain: urlVal(URL.as, 30),
    release: urlVal(URL.ar, 20)
  }

  // Effects.
  Effects = {
    id: 'effects',
    chorusAmount: urlVal(URL.ca, 50),
    chorusTime: urlVal(URL.ct, 50),
    glide: urlVal(URL.g, 20),
    arpIsOn: URL.ao === '1',   // Boolean. 1 = on, 0 = off.
    arpTempo: urlVal(URL.at, 100)
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
    channelDataA: [],
    channelDataB: [],
    computedChannelData: [],
    algorithm: URL[id + 'al'] || 'p',
    cycles: urlVal(URL[id + 'c'], 1),
    amount: urlVal(URL[id + 'a'], 75),
    detune: urlVal(URL[id + 'd'], 0),
    octave: urlVal(URL[id + 'o'], 0),
    note: 0, // The numeric keyboard note, e.g. A is 48.  Lowest C is zero.
    color,
    files: OSC_WAV_FILES,
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
    case 'MASTER_GAIN_CHANGED':
      state.volume = Number(action.value)
      updateURL('mv', action.value)
      return Object.assign({}, state)
    default:
      return state
  }
}

function KeyboardReducer (state, action) {
  state = state || initialState.Keyboard

  switch (action.type) {
    case 'KEYBOARD_NOTE_SHOW':
      state[action.note] = 'on'
      return Object.assign({}, state)
    case 'KEYBOARD_NOTE_HIDE':
      state[action.note] = 'off'
      return Object.assign({}, state)
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
      let urlValue = state.arpIsOn ? 1 : 0
      updateURL('ao', urlValue)
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
function computeWaveform (channelDataA, channelDataB, algorithm, cycles) {
  if (!channelDataA || !channelDataB || !algorithm) {
    return []
  }

  let samplesCount = (600 * cycles)
  let interpolatedData = new Float32Array(samplesCount * 2)
  let time = 0

  // Interpolate from A to B.
  for (let i = 0; i < samplesCount; i++) {
    time = i / samplesCount
    interpolatedData[i] = slerp(channelDataA[i % 600], channelDataB[i % 600], time, algorithm)
  }

  // Interpolate from B to A ( mirrors the previous ).
  for (let k = samplesCount; k < samplesCount * 2; k++) {
    time = (k - samplesCount) / (samplesCount)  // Time starts at half way point.
    interpolatedData[k] = slerp(channelDataB[k % 600], channelDataA[k % 600], time, algorithm)
  }

  return interpolatedData
}

// Modified lerp function based on algorithm chosen.
// The 'minus' algorithm uses the normal lerp function.
function slerp (v0, v1, t, algorithm) {
  if (algorithm === 'p') {
    return limit(-1, 1, v0 * (1 - t) + v1 * t) || 0.00001 // Normal lerp function.
  } else if (algorithm === 'm') {
    t = Math.pow(t, 5)
    return limit(-1, 1, v0 * (1 - t) + v1 * t) || 0.00001
  } else if (algorithm === 'd') {
    t = Math.pow(t, 20)
    return limit(-1, 1, v0 * (1 - t) + v1 * t) || 0.00001
  } else if (algorithm === 'x') {
    t = Math.log(t + 1)
    return limit(-1, 1, v0 * (1 + t) + v1 * t) || 0.00001
  }
}

function OscillatorsReducer (state, action) {
  state = state || initialState.Oscillators

  switch (action.type) {
    case 'WAVE_FILE_LIST_LOADED':
      state = state.map(function (osc) {
        OSC_WAV_FILES = action.files
        let hasLoaded = Object.keys(osc.files).length > 0
         // Only set the wavetable data once per page load.
        if (!hasLoaded) {
          osc.files = Object.assign({}, action.files)
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
            osc.channelDataA = action.channelData
          } else if (action.side === 'B') {
            osc.channelDataB = action.channelData
          }
          // If both are noise, just return noise.
          if (osc.fileA === 'noise' && osc.fileB === 'noise') {
            osc.computedChannelData = osc.channelDataA
          } else if (osc.channelDataA.length && osc.channelDataB.length) {
            // When both files have loaded, compute the combined waveform.
            osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm, osc.cycles)
          }
        }
        return osc
      })
      return [...state]

    // The +, -, /, * selected operator was changed, or the number of cycles changed.
    case 'OSC_ALGORITHM_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          osc.algorithm = action.algorithm
          updateURL(osc.id + 'al', action.algorithm)
          if (osc.fileA === 'noise' && osc.fileB === 'noise') {
            osc.computedChannelData = osc.channelDataA
          } else {
            osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm, osc.cycles)
          }
        }
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
    case 'OSC_CYCLES_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id && osc.cycles !== action.value) {
          osc.cycles = action.value
          const paramName = osc.id + 'c' // id + first letter of param.
          updateURL(paramName, action.value)
          if (osc.fileA === 'noise' && osc.fileB === 'noise') {
            osc.computedChannelData = osc.channelDataA
          } else {
            osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm, osc.cycles)
          }
        }

        return osc
      })
      return [...state]

    case 'OSC_DETUNE_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          osc.detune = action.value
          const paramName = osc.id + 'd' // id + first letter of param.
          updateURL(paramName, action.value)
        }
        return osc
      })
      return [...state]

    case 'OSC_OCTAVE_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          osc.octave = action.value
          const paramName = osc.id + 'o' // id + first letter of param.
          updateURL(paramName, action.value)
        }
        return osc
      })
      return [...state]

    case 'OSC_AMOUNT_CHANGED':
      state = state.map(function (osc) {
        if (osc.id === action.id) {
          osc.amount = action.value
          const paramName = osc.id + 'a' // id + first letter of param.
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
    // Persist the arpeggiator values.
    urlData.at = state.Effects.arpTempo
    urlData.ao = state.Effects.arpIsOn ? '1' : '0'
    state = initializeState(urlData)
    state.Master.presetId = action.presetId
  }

  return appReducer(state, action)
}

export default Reducers
