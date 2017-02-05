/*
Synth
Contains all the audio components which comprise the synth.
*/
import React from 'react';
import {connect} from 'react-redux';
import OscillatorAudio from './OscillatorAudio.js';


class Synth extends React.Component {
  constructor(props, context) {
    super(props, context);
    let {audioContext} = this.props;
    this.masterGain = audioContext.createGain();

    this.masterGain.gain.value = 1;

    this.biquadFilter = audioContext.createBiquadFilter();
    this.biquadFilter.type = 'lowpass';
    this.biquadFilter.frequency.value = 300;
    this.biquadFilter.gain.value = 200;
    this.biquadFilter.connect(this.masterGain);

    this.masterGain.connect(audioContext.destination);

  }

  componentDidUpdate(prevProps, prevState) {
    this.masterGain.gain.value = this.props.Master.volume / 100;

    this.biquadFilter.frequency.value = this.props.Filter.freq;
    this.biquadFilter.Q.value = this.props.Filter.res;
  }

  render() {
    return (
      <div>
        {
          this.props.Oscillators.map( (oscillator) => {
            return (
              <OscillatorAudio
                key = {oscillator.id}
                id = {oscillator.id}
                name = {oscillator.name}
                computedChannelData = {oscillator.computedChannelData}
                detune = {oscillator.detune}
                octave = {oscillator.octave}
                amount = {oscillator.amount}
                audioContext = {this.props.audioContext}
                output = {this.biquadFilter} />
            );
          })
        }
      </div>
    )
  }
}

export default connect()(Synth);
