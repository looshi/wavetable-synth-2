import { combineReducers } from 'redux'

// Oscillator.
function initOscillator(name){
  return {
    name,
    id: Math.random().toString(),
    fileA: 'none',
    fileB: 'none',
    audioBufferA: null,
    audioBufferB: null,
    channelDataA: [],
    channelDataB: [],
    computedChannelData: [],
    algorithm: 'plus',
    amount: 75,
    detune: 0,
    octave: 0,
  }
}
let initialState = {
  Oscillators: [
    initOscillator('1'),
    initOscillator('2'),
    initOscillator('3'),
  ],
}


// Update the computed waveform based on the current algorithm.
function computeWaveform(channelDataA, channelDataB, algorithm) {
  if (!channelDataA || !channelDataB || !algorithm){
    return [];
  }

  return channelDataB.map(function(data, index) {
    if(algorithm === 'plus'){
      return channelDataA[index] + channelDataB[index];
    } else if(algorithm === 'minus'){
      return channelDataA[index] - channelDataB[index];
    } else if(algorithm === 'divide'){
      return channelDataA[index] / channelDataB[index];
    } else if(algorithm === 'multiply'){
      return channelDataA[index] * channelDataB[index];
    }
  });

}

function OscillatorsReducer(state, action) {
  state = state || initialState;

  switch (action.type) {
    case 'WAVE_FLE_LOAD_STARTED':
      state.Oscillators = state.Oscillators.map(function(osc){
        if(osc.id === action.id) {
          if(action.side === 'A'){
            osc.fileA = action.file;
          } else if(action.side === 'B'){
            osc.fileB = action.file;
          }
        }
        return osc;
      });
      return Object.assign({}, state);

    case 'WAVE_FLE_LOAD_COMPLETED':
      state.Oscillators = state.Oscillators.map(function(osc){
        if(osc.id === action.id) {
          // Update the A or B channel data and audio buffer on load.
          if(action.side === 'A'){
            osc.audioBufferA = action.audioBuffer;
            osc.channelDataA = action.channelData;
          } else if(action.side === 'B'){
            osc.audioBufferB = action.audioBuffer;
            osc.channelDataB = action.channelData;
          }
          osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm);
        }
        return osc;
      });
      return Object.assign({}, state);

    case 'OSC_ALGORITHM_CHANGED':
      state.Oscillators = state.Oscillators.map(function(osc){
        if(osc.id === action.id) {
          osc.algorithm = action.algorithm;
        }
        osc.computedChannelData = computeWaveform(osc.channelDataA, osc.channelDataB, osc.algorithm);
        return osc;
      });
      return Object.assign({}, state);

    case 'OSC_SLIDER_CHANGED':
      state.Oscillators = state.Oscillators.map(function(osc) {
        if(osc.id === action.id) {
          osc[action.propertyName] = action.value;
          console.log('osc reducer',action.propertyName, osc[action.propertyName], action[action.propertyName]);
        }
        return osc;
      });
      return Object.assign({}, state);

    default:
      return state;
  }
}

const Reducers = combineReducers({
  OscillatorsReducer,
});

export default Reducers;
