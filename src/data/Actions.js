let Actions = {};

// A wave file associated with one of the wave tables has started loading.
Actions.waveFileLoadStarted = function waveFileLoadStarted(id, waveFile) {
  return {
    type: 'WAVE_FLE_LOAD_STARTED',
    id,
    waveFile,
  };
};

// A wave file associated with one of the wave tables has been loaded.
Actions.waveFileLoadCompleted = function waveFileLoadCompleted(id, waveData) {
  return {
    type: 'WAVE_FLE_LOAD_COMPLETED',
    id,
    waveData,
  };
};

export default Actions;
