import { combineReducers } from 'redux'

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
    octave: 0
  }
}

let initialState = {
  Master: {
    volume: 1
  },
  Oscillators: [
    initOscillator('1'),
    initOscillator('2'),
    initOscillator('3')
  ],
  Filter: {
    freq: 2000,
    res: 20
  }
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

function FilterReducer (state, action) {
  state = state || initialState

  switch (action.type) {
    case 'SLIDER_CHANGED':
      if (action.id === 'filter-freq') {
        state.Filter.freq = action.value
      } else if (action.id === 'filter-res') {
        state.Filter.res = action.value
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

    case 'OSC_ALGORITHM_CHANGED':
      state.Oscillators = state.Oscillators.map(function (osc) {
        if (osc.id === action.id) {
          osc.algorithm = action.algorithm
        }
        osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm)
        return osc
      })
      return Object.assign({}, state)

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
  OscillatorsReducer
})

export default Reducers
