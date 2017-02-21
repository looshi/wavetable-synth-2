/*
Oscillator
Audio output for a single oscillator.
*/
import {limit} from '../helpers/helpers.js'

export default class Oscillator {
  constructor (props) {
    this.id = props.id
    this._detune = props.detune
    this._octave = props.octave
    this._note = props._note
    this._lfoPitch = null
    this._persistLFO = false
    this._lfoAmount = null

    this.output = props.output
    this.audioContext = props.audioContext

    this.gainNode = props.audioContext.createGain()
    this.gainNode.connect(this.output)
  }

  // Will connect immediately, but later on if the waveform is loaded
  // it will connect again below.
  // Only one LFO can be set on page load, however multiple LFOs can be
  // set after page load.  TODO : allow multiple on page load.
  // 'persist' parameter fixes an issue in setting LFO from filter to volume -
  // Very loud pops happen when a note is on and setting lfo to volume.
  connectPitchToLFO (lfo, persist = false) {
    this._lfoPitch = lfo
    this._persistLFO = persist
    if (this.wavSource) {
      this._lfoPitch.connect(this.wavSource.detune, 10, persist)
    }
  }

  connectAmountToLFO (lfo, persist = false) {
    this._lfoAmount = lfo
    this._persistLFO = persist
    if (this.wavSource) {
      this._lfoAmount.connect(this.gainNode.gain, 0.01, persist)
    }
  }

  // Limits gain between zero and 1.
  set amount (val) {
    this.gainNode.gain.value = limit(0, 1, val / 100)
  }

  set detune (val) {
    this._detune = val
    this.updatePitch()
  }

  set octave (val) {
    this._octave = val
    this.updatePitch()
  }

  set note (val) {
    this._note = val
    this.updatePitch()
  }

  updatePitch () {
    if (!this.wavSource || !this._note) return
    // Calculate pitch.
    this.wavSource.detune.value = this._detune
    // Add note value (note value * 100 cents per note).
    this.wavSource.detune.value += this._note * 100
     // Add Octave value  (100 cents * 12 notes = 1 octave).
    this.wavSource.detune.value += this._octave * 100 * 12
  }

  set computedChannelData (data) {
    // Bad data.
    if (!data[0]) {
      return
    }

    // Make sure things actually changed.
    if (!this.arraysChanged(data, this._computedChannelData)) {
      return false
    }
    this._computedChannelData = data

    // Reset the oscillator data.
    if (this.wavSource && this.wavSource._started) {
      this.wavSource.stop()
    }
    this.wavSource = this.audioContext.createBufferSource()
    this.wavSource.disconnect()

    this.audioBuffer = this.audioContext.createBuffer(1, data.length, 44100)
    this.audioBuffer.copyToChannel(data, 0)

    // Set the data to this oscillator, and start it.
    this.wavSource.buffer = this.audioBuffer
    this.wavSource.loop = true
    this.wavSource.start()
    this.wavSource._started = true
    this.wavSource.connect(this.gainNode)

    if (this._lfoPitch) {
      this._lfoPitch.connect(this.wavSource.detune, 10, this._persistLFO)
    }
    if (this._lfoAmount) {
      this._lfoAmount.connect(this.gainNode.gain, 0.01)
    }
    this.updatePitch()
  }

  arraysChanged (a, b) {
    if (!b) {
      return true
    }
    for (var i = 0; i < b.length; i++) {
      // Allow only numbers.
      if (typeof b[i] !== 'number' || isNaN(parseFloat(b[i]))) {
        return false
      }
      // Make sure the array actually changed before we update the wavetable.
      if (a[i] !== b[i]) {
        return true
      }
    }
    return false
  }
}
