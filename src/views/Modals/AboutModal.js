/*
AboutModal
*/
import React from 'react'
import ReactModal from 'react-modal'
import interpolatedWaves from '../../../images/interpolated-waves.png'

export default class AboutModal extends React.Component {

  render () {
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
            <p>This short video shows how to use the arpeggiator to play a long sequence of notes, it's fun!</p>
            <p>
              <iframe width='500' height='300' src='https://www.youtube.com/embed/jRgZfzzZiyE' frameBorder='0' allowFullScreen />
            </p>
            <h2 className='text-center'>Wavetable Synthesis</h2>
            <p>A wavetable, in the simplest use of the term, is a list of samples for one period of a wave.  In practice, we store an array of 600 numbers for each waveform.  The more complicated use of the term "wavetable" synthesis refers to interpolating from one table to another over time.  Interpolating between these tables made it possible for digital synthesizers of the 1980s to generate complex and evolving sounds using very little processing power and memory.</p>
            <img src={interpolatedWaves} />
            <p>We precompute all the interpolated values from one table to another into a new, and potentially much longer, waveform. The "cycles" slider controls the length of the interpolated waveform, this is how long it will take for the oscillator to smoothly change from one waveform to another.  The plus, minus, divide, and multiply buttons control the slope of interpolation.  Since we're not interpolating in real-time the loop time of each oscillator will change depending on pitch.  We would like to find a way to do this without it being dependent on pitch, if you happen to know please contact us!
            </p>
            <h2 className='text-center'>By No Means Perfect</h2>
            <p>To add texture in a few places we add a bit of randomness.  On each note, the pitch is altered randomly between 0 and 6 cents per oscillator.  Also, our square LFO uses a custom square waveform sample versus the preset square available in the web audio api, which does some very subtle ramping up and down and has some wobble to it.  Our filter is actually using 10 filters in sequence, we figured it's a computer, so why not use 10 filters?</p>
          </div>
        </ReactModal>
      </div>
    )
  }
}

AboutModal.propTypes = {
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func
}
