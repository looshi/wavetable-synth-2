import { combineReducers } from 'redux'

// Oscillator.
function initOscillator(name){
  return {
    name,
    id: Math.random().toString(),
    fileA: 'none',
    fileB: 'none',
    waveTableA: new ArrayBuffer(0),
    waveTableB: new ArrayBuffer(0),
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
          if(action.side === 'A'){
            osc.waveTableA = action.data;
          } else if(action.side === 'B'){
            osc.waveTableB = action.data;
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
