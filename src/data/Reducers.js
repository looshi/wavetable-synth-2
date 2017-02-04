import { combineReducers } from 'redux'

// Oscillator.
function initOscillator(){
  return {
    id: Math.random().toString(),
    fileA: 'none',
    fileB: 'none',
    volume: 100,
    detune: 0,
    pitch: 440,
    waveData: [5,6,7,8,9,10,9,8,7,6,5,4,3,2,1],
  }
}
let initialState = {
  Oscillators: [
    initOscillator(),
    initOscillator(),
    initOscillator(),
  ],
}

function OscillatorsReducer(state, action) {
  state = state || initialState;

  switch (action.type) {
    case 'WAVE_FLE_LOAD_STARTED':
      console.log('state', state, action);
      state.Oscillators = state.Oscillators.map(function(osc){
        if(osc.id === action.id){
          osc.fileA = 'loading';
        }
        return osc;
      });
      return Object.assign({}, state);

    case 'WAVE_FLE_LOAD_COMPLETED':
      console.log('load done', action);
      return 'dave';

    default:
      return state;
  }
}

const Reducers = combineReducers({
  OscillatorsReducer,
});

export default Reducers;


// function merge(objectA, objectB) {
//   return _.extend({}, objectA, objectB);
// }
