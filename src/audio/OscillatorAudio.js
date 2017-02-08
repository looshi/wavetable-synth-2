/*
OscillatorAudio
Audio output for a single oscillator.
*/

import React from 'react'
import {connect} from 'react-redux'

class OscillatorAudio extends React.Component {
  constructor (props) {
    super(props)
    const {audioContext, output} = this.props
    this.gainNode = audioContext.createGain()
    this.gainNode.connect(output)
    this.lfo = audioContext.createOscillator()
    this.type = 'sine'
    this.lfo.start()
    this.lfoGain = audioContext.createGain()
    this.lfo.connect(this.lfoGain)
  }

  arraysChanged (a, b) {
    // A race condition is allowing the new computed wave 'b'
    // to be set in the reducer with its values as NaN.  This causes the
    // audio to stop entirely in the browser.
    // Temp fix is to check that incoming wavetable values are indeed numbers.
    // TODO : don't allow this race condtion to happen in the first place.
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

  componentDidUpdate (prevProps, prevState) {
    const {audioContext, computedChannelData} = this.props

    // Only update the computed waveform if it actually changed.
    let hasWaveDataChanged = this.arraysChanged(prevProps.computedChannelData, computedChannelData)

    if (hasWaveDataChanged && computedChannelData.length) {
      // Stop and disconnect the current oscillator.
      if (this.wavSource && this.wavSource._started) {
        this.wavSource.stop()
      }
      this.wavSource = audioContext.createBufferSource()
      this.wavSource.disconnect()

      // Read the computed data which came from the two selected wave files.
      this.audioBuffer = audioContext.createBuffer(1, computedChannelData.length, 44100)
      this.audioBuffer.copyToChannel(computedChannelData, 0)

      // Set the computed data to this oscillator, and start it.
      this.wavSource.buffer = this.audioBuffer
      this.wavSource.loop = true
      this.wavSource.start()
      this.wavSource._started = true
      this.wavSource.connect(this.gainNode)
    }

    if (this.wavSource) {
      // Update oscillator volume, octave, and detune.
      const {detune, octave, amount, note} = this.props
      // Local osc detune value.
      this.wavSource.detune.value = detune
      // Master pitch note (note value * 100 cents per note).
      this.wavSource.detune.value += note * 100
       // Local osc octave value  (100 cents * 12 notes = 1 octave).
      this.wavSource.detune.value += octave * 100 * 12

      // Update local pitch lfo.
      const {lfoRate, lfoAmount, lfoShape, lfoOn} = this.props

      if (lfoOn) {
        this.lfo.type = lfoShape
        this.lfo.frequency.value = lfoRate
        this.lfoGain.gain.value = lfoAmount * 48 // 0 to 4800 cents = 4 octaves
        this.lfoGain.connect(this.wavSource.detune)
      } else {
        this.lfoGain.disconnect()
      }

      // Update local gain
      this.gainNode.gain.value = amount / 100
    }
  }

  render () { return null }

}

export default connect()(OscillatorAudio)
