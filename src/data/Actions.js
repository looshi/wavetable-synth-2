let Actions = {}

// Loads the list of wave files based on the server's "wavs" directory.
Actions.waveFileListLoaded = function waveFileListLoaded (files) {
  return {type: 'WAVE_FILE_LIST_LOADED', files}
}

// An oscillator started to load a wave file.
Actions.waveFileLoadStarted = function waveFileLoadStarted (id, side, file) {
  return {
    type: 'WAVE_FILE_LOAD_STARTED',
    id,
    side,    // This will be either 'A' or 'B'.
    file    // The filename selected.
  }
}

// An oscillator wave file has been loaded.
Actions.waveFileLoadCompleted = function waveFileLoadCompleted (id, side, channelData) {
  return {
    type: 'WAVE_FILE_LOAD_COMPLETED',
    id,
    side,           // This will be either 'A' or 'B'.
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

Actions.oscCyclesChanged = function oscCyclesChanged (id, value) {
  return {type: 'OSC_CYCLES_CHANGED', id, value}
}

Actions.oscDetuneChanged = function oscDetuneChanged (id, value) {
  return {type: 'OSC_DETUNE_CHANGED', id, value}
}

Actions.oscOctaveChanged = function oscDetuneChanged (id, value) {
  return {type: 'OSC_OCTAVE_CHANGED', id, value}
}

Actions.onAmountChanged = function onAmountChanged (id, value) {
  return {type: 'OSC_AMOUNT_CHANGED', id, value}
}

Actions.masterGainChanged = function masterGainChanged (value) {
  return {type: 'MASTER_GAIN_CHANGED', value}
}

Actions.glideChanged = function oscGlideChanged (value) {
  return { type: 'GLIDE_CHANGED', value }
}

// A Filter value has changed.
Actions.filterSliderChanged = function filterSliderChanged (id, value, name) {
  return { type: 'FILTER_SLIDER_CHANGED', id, value, name }
}

// An Amp value has changed.
Actions.ampSliderChanged = function ampSliderChanged (id, value, name) {
  return { type: 'AMP_SLIDER_CHANGED', id, value, name }
}

// Effects
// A Chorus value has changed.
Actions.chorusSliderChanged = function chorusSliderChanged (id, value, name) {
  return { type: 'CHORUS_SLIDER_CHANGED', id, value, name }
}
Actions.arpTempoChanged = function arpTempoChanged (value) {
  return { type: 'ARP_TEMPO_CHANGED', value }
}
Actions.arpIsOn = function arpIsOn (value) {
  return { type: 'ARP_IS_ON', value }
}

// LFO shape changed.
Actions.lfoShapeChanged = function sliderChanged (id, shape, destination) {
  return { type: 'LFO_SHAPE_CHANGED', id, shape, destination }
}
Actions.lfoDestinationChanged = function sliderChanged (id, oldDestination, newDestination) {
  return { type: 'LFO_DESTINATION_CHANGED', id, oldDestination, newDestination }
}
Actions.lfoAmountChanged = function lfoAmountChanged (id, amount, destination) {
  return { type: 'LFO_AMOUNT_CHANGED', id, amount, destination }
}
Actions.lfoRateChanged = function sliderChanged (id, rate, destination) {
  return { type: 'LFO_RATE_CHANGED', id, rate, destination }
}

// Keyboard note on.  Oscillators respond to these and play notes.
Actions.noteOn = function noteOn (note) {
  return { type: 'NOTE_ON', note }
}
// Keyboard note off.
Actions.noteOff = function noteOff (note) {
  return { type: 'NOTE_OFF', note }
}
// Highlight a keyboard note.  Oscillators do not respond to these actions.
Actions.keyboardNoteShow = function noteOff (note) {
  return { type: 'KEYBOARD_NOTE_SHOW', note }
}
Actions.keyboardNoteHide = function noteOff (note) {
  return { type: 'KEYBOARD_NOTE_HIDE', note }
}

// Re-initializes the entire state based on the current url hash.
Actions.loadPresetURLData = function loadPresetURLData (presetId) {
  return { type: 'LOAD_PRESET_URL_DATA', presetId }
}

export default Actions
