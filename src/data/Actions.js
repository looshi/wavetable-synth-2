let Actions = {}

// An oscillator started to load a wave file.
Actions.waveFileLoadStarted = function waveFileLoadStarted (id, side, file) {
  return {
    type: 'WAVE_FLE_LOAD_STARTED',
    id,
    side,    // This will be either 'A' or 'B'.
    file    // The filename selected.
  }
}

// An oscillator wave file has been loaded.
Actions.waveFileLoadCompleted = function waveFileLoadCompleted (id, side, audioBuffer, channelData) {
  return {
    type: 'WAVE_FLE_LOAD_COMPLETED',
    id,
    side,           // This will be either 'A' or 'B'.
    audioBuffer,    // The AudioBuffer object.
    channelData    // Compressed array of wave data for use in graphics.
  }
}

// An oscillator algorithm has changed.
Actions.oscAlgorithmChanged = function oscAlgorithmChanged (id, algorithm) {
  return {
    type: 'OSC_ALGORITHM_CHANGED',
    id,
    algorithm
  }
}

// An oscillator detune has changed.
Actions.sliderChanged = function sliderChanged (id, value, name) {
  return {
    type: 'SLIDER_CHANGED',
    id,
    value,
    name
  }
}

// LFO shape changed.
Actions.lfoShapeChanged = function sliderChanged (id, shape) {
  return { type: 'LFO_SHAPE_CHANGED', id, shape }
}
Actions.lfoDestinationChanged = function sliderChanged (id, destination) {
  return { type: 'LFO_DESTINATION_CHANGED', id, destination }
}

// Keyboard note on.
Actions.noteOn = function noteOn (note) {
  return { type: 'NOTE_ON', note }
}
// Keyboard note off.
Actions.noteOff = function noteOff (note) {
  return { type: 'NOTE_OFF', note }
}

export default Actions
