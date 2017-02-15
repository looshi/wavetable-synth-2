/*
AmpView
ADSR faders for amplitude.
*/
import React from 'react'
import {connect} from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'

class ChorusView extends React.Component {

  onSliderChange (event) {
    const {id} = this.props
    const name = event.target.getAttribute('data-name')
    const action = Actions.chorusSliderChanged(id, event.target.value, name)
    this.props.dispatch(action)
    if (name === 'chorus-amount') {
      this.props.eventEmitter.emit('CHORUS_AMOUNT_CHANGED', event.target.value)
    } else if (name === 'chorus-time') {
      this.props.eventEmitter.emit('CHORUS_TIME_CHANGED', event.target.value)
    }
  }

  render () {
    return (
      <div className='module'>
        <h1>Chorus</h1>
        <div className='box'>
          <div className='filter-sliders'>
            <VerticalSlider
              name='chorus-amount'
              label='amount'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.amount} />
            <VerticalSlider
              name='chorus-time'
              label='time'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.time} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(ChorusView)
