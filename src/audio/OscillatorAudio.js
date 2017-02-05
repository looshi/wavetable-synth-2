/*
OscillatorAudio
Audio output for a single oscillator.
*/

import React from 'react';
import {connect} from 'react-redux';

class OscillatorAudio extends React.Component {
  constructor(props) {
    super(props);
    const {audioContext, masterGain} = this.props;
    this.gainNode = audioContext.createGain();
    this.gainNode.connect(masterGain);
  }

  arrayEqual(a, b) {
    for (var i=0; i < a.length; i++) {
      if(a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const {audioContext, computedChannelData} = this.props;

    // Only update the computed waveform if it actually changed.
    let hasWaveDataChanged = true;
    if(prevProps.computedChannelData.length) {
      hasWaveDataChanged = !this.arrayEqual(prevProps.computedChannelData, computedChannelData);
    }
    if(hasWaveDataChanged && computedChannelData.length) {

      // Stop and disconnect the current oscillator.
      if (this.wavSource && this.wavSource._started) {
        this.wavSource.stop();
      }
      this.wavSource = audioContext.createBufferSource();
      this.wavSource.disconnect();

      // Read the computed data which came from the two selected wave files.
      this.audioBuffer = audioContext.createBuffer(1, computedChannelData.length, 44100);
      this.audioBuffer.copyToChannel(computedChannelData, 0);

      // Set the computed data to this oscillator, and start it.
      this.wavSource.buffer = this.audioBuffer;
      this.wavSource.loop = true;
      this.wavSource.start();
      this.wavSource._started = true;
      this.wavSource.connect(this.gainNode);
    }

    // Update oscillator volume, octave, and detune.
    const {detune, octave, amount} = this.props;
    if (this.wavSource) {
      this.wavSource.detune.value = detune;
       // 100 cents * 12 notes = 1 octave.
      this.wavSource.detune.value += octave * 100 * 12;
    }

    this.gainNode.gain.value = amount / 100;


  }

  render() {return null;}

}

export default connect()(OscillatorAudio);
