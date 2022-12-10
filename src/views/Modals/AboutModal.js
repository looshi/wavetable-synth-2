import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

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
            <h2 className='text-center'>How to use</h2>
            <p>Play the keyboard keys to trigger notes, or click on the piano keys at the bottom of your screen.  The arpeggiator will play all notes from the last 5 seconds.  Turn the arpeggiator ON and play a couple of notes to make sequences.</p>
            <h2 className='text-center'>Wavetable Synthesis</h2>
            <p>Wavetable synthesis refers to the technique of interpolating from one array of samples ( a "table" ), to another over time. This technique made it possible for digital synthesizers of the 1980s to generate complex and evolving sounds using very little processing power and memory.
              One of the first wavetable synthesizers was the PPG Wave <a href="https://en.wikipedia.org/wiki/PPG_Wave">en.wikipedia.org/wiki/PPG_Wav</a> used by many bands at the time such Depeche Mode.</p>
            <p> The storage of each table is a small memory footprint, and the interpolation algorithms are simple arithmetic, however combining different tables over time allows for a very complex sound.</p>
            <h2 className='text-center'>How does this web audio synth work?</h2>

            <img src='./images/interpolated-waves.png' />
            <p>Pairs of wave forms are combined with each other over time -- either added/subtracted/multiplied or divided. To hear this effect turn the cycles slider all the way up, notice the sound changing over a few seconds.
              Three pairs of these waveforms are then mixed together and sent to a filter, amp envelope, and effects lfos for further processing.
            </p>
            <h2 className='text-center'>Added Texture</h2>
            <p>In addition to the common synthesizer features shown in the UI, various techniques are used behind the scenes to add color and texture to the sound.  On each note played, the pitch is altered randomly between 0 and 6 cents per oscillator.  The square LFO uses a custom square waveform sample versus the preset square available in the web audio api, which does some very subtle ramping up and down and has some wobble to it.  The filter uses 10 filters in sequence.</p>
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
