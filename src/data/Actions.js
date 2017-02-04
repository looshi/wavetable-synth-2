let Actions = {};

// A wave file associated with one of the wave tables has started loading.
Actions.waveFileLoadStarted = function waveFileLoadStarted(id, side, file) {
  return {
    type: 'WAVE_FLE_LOAD_STARTED',
    id,
    side,    // This will be either 'A' or 'B'.
    file,    // The filename selected.
  };
};

// A wave file associated with one of the wave tables has been loaded.
Actions.waveFileLoadCompleted = function waveFileLoadCompleted(id, side, data) {
  return {
    type: 'WAVE_FLE_LOAD_COMPLETED',
    id,
    side,    // This will be either 'A' or 'B'.
    data,    // Array of wave data.
  };
};

export default Actions;
