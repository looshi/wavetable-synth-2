let Actions = {};

// An oscillator started to load a wave file.
Actions.waveFileLoadStarted = function waveFileLoadStarted(id, side, file) {
  return {
    type: 'WAVE_FLE_LOAD_STARTED',
    id,
    side,    // This will be either 'A' or 'B'.
    file,    // The filename selected.
  };
};

// An oscillator wave file has been loaded.
Actions.waveFileLoadCompleted = function waveFileLoadCompleted(id, side, audioBuffer, channelData) {
  return {
    type: 'WAVE_FLE_LOAD_COMPLETED',
    id,
    side,           // This will be either 'A' or 'B'.
    audioBuffer,    // The AudioBuffer object.
    channelData,    // Compressed array of wave data for use in graphics.
  };
};

// An oscillator algorithm has changed.
Actions.oscAlgorithmChanged = function oscAlgorithmChanged(id, algorithm) {
  return {
    type: 'OSC_ALGORITHM_CHANGED',
    id,
    algorithm,
  };
};

// An oscillator detune has changed.
Actions.oscSliderChanged = function oscSliderChanged(id, value, propertyName) {
  return {
    type: 'OSC_SLIDER_CHANGED',
    id,
    value,
    propertyName,
  };
};


export default Actions;
