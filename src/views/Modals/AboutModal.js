/*
AboutModal
*/
import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import interpolatedWaves from '../../../images/interpolated-waves.png'

export default class AboutModal extends React.Component {

  render() {
    return (
      <div className='module'>
        <ReactModal
          isOpen={this.props.isOpen}
          contentLabel='Save Your Patch'>
          <div className='modal-close-button' onClick={this.props.onClose}>
            X
          </div>
          <div>
            <h2 className='text-center'>Using The Arpeggiator</h2>
            <p>This short video shows how to use the arpeggiator to play a long sequence of notes.  This is a really fun way to interact with the synthesizer!</p>
            <p>
              <iframe width='500' height='300' src='https://www.youtube.com/embed/jRgZfzzZiyE' frameBorder='0' allowFullScreen />
            </p>
            <h2 className='text-center'>Wavetable Synthesis</h2>
            <p>Wavetable synthesis refers to the technique of interpolating from one array of samples, a "table", to another over time. Interpolating between arrays in this manner made it possible for digital synthesizers of the 1980s to generate complex and evolving sounds using very little processing power and memory.</p>
            <img src={interpolatedWaves} />
            <p>In practice, this synthesizer stores 600 numbers for each "table" in an array. The interpolated values are precomputed into a new, and potentially much longer, waveform. The "cycles" slider controls the length of the interpolated waveform. This is how long it will take for the oscillator to smoothly change from one wave shape to another. The plus, minus, divide, and multiply buttons control the slope of interpolation.</p>
            <h2 className='text-center'>Added Texture</h2>
            <p>In addition to the common synthesizer features shown in the UI, we also use various techniques behind the scenes to add color and depth to the sound.  On each note played, the pitch is altered randomly between 0 and 6 cents per oscillator.  The square LFO uses a custom square waveform sample versus the preset square available in the web audio api, which does some very subtle ramping up and down and has some wobble to it.  The filter is actually using 10 filters in sequence, we figured it's a computer, so why not use 10 filters?</p>
          </div>
        </ReactModal>
      </div>
    )
  }
}

AboutModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}
