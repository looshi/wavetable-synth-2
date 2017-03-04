/*
AboutModal
*/
import React from 'react'
import ReactModal from 'react-modal'

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
            <h1 className='text-center'>About This Synth</h1>
            <p className='about'>Loosely based on Wavetable synthesis.  More info to come...</p>
          </div>
        </ReactModal>
      </div>
    )
  }
}
