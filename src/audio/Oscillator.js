/*
Oscillator
Audio output for a single oscillator.
*/

export default class Oscillator {
  constructor (props) {
    this._detune = props.detune
    this._octave = props.octave
    this._note = props._note

    this.output = props.output
    this.audioContext = props.audioContext

    this.gainNode = props.audioContext.createGain()
    this.gainNode.connect(this.output)
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

  set amount (val) {
    this.gainNode.gain.value = val / 100
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
    if (!this.wavSource) return
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
  }
}
