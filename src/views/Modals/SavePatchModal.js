/*
SavePatchModal
*/
import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

export default class SavePatchModal extends React.Component {

  render() {
    return (
      <div>
        <ReactModal
          isOpen={this.props.isOpen}
          contentLabel='Save Your Patch'>
          <div className='modal-close-button' onClick={this.props.onClose}>
            X
          </div>
          <div>
            <h1 className='text-center'>Save Patch</h1>
            <p className='inverted'>{window.location.href}</p>
            <p>Copy and paste the above link to save the current patch.</p>
            <p>You can also copy the URL from the address bar.</p>
          </div>
        </ReactModal>
      </div>
    )
  }
}

SavePatchModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}
