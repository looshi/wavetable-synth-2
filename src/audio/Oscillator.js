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
    this._glide = Number(props.glide) / 100

    // LFOs attached to this oscillator.
    this.pitchLFOs = []
    this.amountLFOs = []

    this.output = props.output
    this.audioContext = props.audioContext

    this.gainNode = props.audioContext.createGain()
    this.gainNode.connect(this.output)
  }

  connectPitchToLFO (lfo, persist = false) {
    if (this.wavSource) {
      // Connect now if wave is loaded.
      lfo.connect(this.wavSource.detune, 10, persist)
    }
    this.pitchLFOs.push(lfo)
  }

  disconnectPitchFromLFO (lfo) {
    lfo.disconnect()
    this.pitchLFOs = this.pitchLFOs.filter((_lfo) => {
      return _lfo.id !== lfo.id
    })
  }

  connectAmountToLFO (lfo) {
    this.amountLFOs.push(lfo)
    if (this.wavSource) {
      // Connect now if wave is loaded.
      lfo.connect(this.gainNode.gain, 0.01)
    }
  }

  disconnectAmountFromLFO (lfo) {
    lfo.disconnect()
    this.amountLFOs = this.amountLFOs.filter((_lfo) => {
      return _lfo.id !== lfo.id
    })
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

  set glide (val) {
    this._glide = val / 100
  }

  scheduleNote (time, noteNumber) {
    this._note = noteNumber
    this.updatePitch(time)
  }

  updatePitch (now = this.audioContext.currentTime) {
    if (!this.wavSource || !this._note) return
    let next = this._detune + this._note * 100 // Note value * 100 cents per note.
    next += this._octave * 100 * 12 // 100 cents * 12 notes = 1 octave
    // Manually do some tuning :
    next = next - 200 // lower by two notes
    next = next - 3600 // lower by three octaves
    // Schedule glide based on the current glide amount.
    this.wavSource.detune.cancelScheduledValues(0)

    // Add some subtle drift to each osc.
    next += Math.random() * 6

    // Randomize glide slightly so it's different for each osc.
    let glideTime = 0
    if (this._glide > 0.01) {
      glideTime = this._glide + Math.random() * 0.001
    }

    if (this._glide > 0) {
      this.wavSource.detune.linearRampToValueAtTime(next, now + glideTime)
    } else {
      this.wavSource.detune.setValueAtTime(next, now)
    }
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

    // Reconnect lfos to the new wavSource instance (if any were connected).
    this.pitchLFOs.forEach((lfo) => {
      lfo.connect(this.wavSource.detune, 10)
    })
    this.amountLFOs.forEach((lfo) => {
      lfo.connect(this.gainNode.gain, 0.01, 10)
    })

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
