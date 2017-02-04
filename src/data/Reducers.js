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
    algorithm: null,
    volume: 100,
    detune: 0,
    pitch: 440,
  }
}
let initialState = {
  Oscillators: [
    initOscillator('1'),
    // initOscillator('2'),
    // initOscillator('3'),
  ],
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

          // Update the computed waveform based on the current algorithm.
          if(osc.channelDataA.length && osc.channelDataB.length){
            osc.computedChannelData =  osc.channelDataB.map(function(data, index) {
              return osc.channelDataA[index] - osc.channelDataB[index];
            });
          }

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
