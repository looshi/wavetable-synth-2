/*
Keyboard
Sends note on / off events.
*/
import React from 'react'
import {connect} from 'react-redux'

class Keyboard extends React.Component {

  handleKeyDown () {
    const {dispatch} = this.props
    dispatch({ type: 'noteOn', key: 33 })
  }

  render () {
    return (
      <div className='box'>
        <button onMouseDown={this.handleKeyDown.bind(this)}>Note</button>
      </div>
    )
  }
}

export default connect()(Keyboard)
