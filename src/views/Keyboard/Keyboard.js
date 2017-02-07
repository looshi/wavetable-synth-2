/*
Keyboard
Sends note on / off events.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class Keyboard extends React.Component {

  handleKeyDown (event) {
    const key = event.target.getAttribute('data-key')
    this.props.dispatch(Actions.noteOn(key))
    this.props.eventEmitter.emit('NOTE_ON', key)
  }

  handleKeyUp (event) {
    const key = event.target.getAttribute('data-key')
    this.props.dispatch(Actions.noteOff(key))
    this.props.eventEmitter.emit('NOTE_OFF', key)
  }

  render () {
    return (
      <div className='key'>
        {
          Object.keys(this.props.Keyboard).map((key) => {
            return (
              <div key={key} className='key'>
                <button
                  data-key={key}
                  onMouseDown={this.handleKeyDown.bind(this)}
                  onMouseUp={this.handleKeyUp.bind(this)}>
                  {key}
                </button>
              </div>
            )
          })
        }
      </div>
    )
  }

}

export default connect()(Keyboard)
