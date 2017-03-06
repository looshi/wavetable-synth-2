/*
OscillatorView
UI controls for a single oscillator.
Combines two waveforms and calculates a new waveform based on the selected
operator.
*/
import React from 'react'
import WaveFileLoader from './WaveFileLoader.js'
import WaveLine from './WaveLine.js'
import AlgorithmSwitch from './AlgorithmSwitch.js'
import HorizontalSlider from '../Components/HorizontalSlider.js'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class OscillatorView extends React.Component {

  onCyclesChanged (e) {
    let action = Actions.oscCyclesChanged(this.props.id, Number(e.target.value))
    this.props.dispatch(action)
  }

  onDetuneChanged (e) {
    let action = Actions.oscDetuneChanged(this.props.id, Number(e.target.value))
    this.props.dispatch(action)
  }

  onOctaveChanged (e) {
    let action = Actions.oscOctaveChanged(this.props.id, Number(e.target.value))
    this.props.dispatch(action)
  }

  onAmountChanged (e) {
    let action = Actions.onAmountChanged(this.props.id, Number(e.target.value))
    this.props.dispatch(action)
  }

  render () {
    const colorStyle = {
      color: this.props.color
    }

    return (
      <div className='oscillator'>
        <h1 style={colorStyle}>Oscillator {this.props.name}</h1>
        <div className='wavetable-boxes'>
          <div className='wavetable-box'>
            <WaveLine
              width={140}
              height={136}
              color={this.props.color}
              channelData={this.props.channelDataA} />

            <WaveFileLoader
              id={this.props.id}
              color={this.props.color}
              side={'A'}
              selectedFile={this.props.fileA}
              audioContext={this.props.audioContext}
              files={this.props.files} />
          </div>

          <div className='wavetable-box'>
            <WaveLine
              width={140}
              height={136}
              color={this.props.color}
              channelData={this.props.channelDataB} />

            <WaveFileLoader
              id={this.props.id}
              color={this.props.color}
              side={'B'}
              selectedFile={this.props.fileB}
              audioContext={this.props.audioContext}
              files={this.props.files} />
          </div>
          <div className='algorithm-switch-horizontal'>
            <AlgorithmSwitch
              id={this.props.id}
              color={this.props.color}
              algorithm={this.props.algorithm} />
          </div>
          <div className='wavetable-computed'>
            <WaveLine
              width={300}
              height={136}
              color={this.props.color}
              channelData={this.props.computedChannelData} />
          </div>
          <div className='oscillator-sliders'>
            <HorizontalSlider
              id={this.props.id}
              name='cycles'
              label='cycles'
              min={1}
              max={1024}
              step={1}
              onChange={this.onCyclesChanged.bind(this)}
              color={this.props.color}
              value={this.props.cycles} />
            <HorizontalSlider
              id={this.props.id}
              name='detune'
              label='detune'
              min={-12}
              max={12}
              step={1}
              onChange={this.onDetuneChanged.bind(this)}
              color={this.props.color}
              value={this.props.detune} />
            <HorizontalSlider
              id={this.props.id}
              name='octave'
              label='octave'
              min={-3}
              max={3}
              step={1}
              onChange={this.onOctaveChanged.bind(this)}
              color={this.props.color}
              value={this.props.octave} />
            <HorizontalSlider
              id={this.props.id}
              name='amount'
              label='amount'
              min={0}
              max={100}
              step={1}
              onChange={this.onAmountChanged.bind(this)}
              color={this.props.color}
              value={this.props.amount} />
          </div>

        </div>
      </div>
    )
  }
}
OscillatorView.propTypes = {
  waveData: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  detune: React.PropTypes.number,
  octave: React.PropTypes.number,
  amount: React.PropTypes.number,
  // channelDataA: React.PropTypes.array, ?
  // channelDataB: React.PropTypes.array,
  files: React.PropTypes.object,
  fileA: React.PropTypes.string,
  fileB: React.PropTypes.string
}
OscillatorView.defaultProps = {
  waveData: [],
  width: 300,
  height: 200
}

export default connect()(OscillatorView)
