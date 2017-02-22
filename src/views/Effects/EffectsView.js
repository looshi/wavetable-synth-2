/*
AmpView
ADSR faders for amplitude.
*/
import React from 'react'
import {connect} from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'

class ChorusView extends React.Component {

  onChorusChange (event) {
    const {id} = this.props
    const name = event.target.getAttribute('data-name')
    const action = Actions.chorusSliderChanged(id, event.target.value, name)
    this.props.dispatch(action)
  }

  onGlideChange (event) {
    const action = Actions.glideChanged(event.target.value)
    this.props.dispatch(action)
  }

  render () {
    return (
      <div className='module'>
        <h1>Effects</h1>
        <div className='box'>
          <div className='effects-sliders'>
            <VerticalSlider
              className='short'
              name='chorus-amount'
              label='chorus amt'
              min={0}
              max={100}
              step={1}
              onChange={this.onChorusChange.bind(this)}
              value={this.props.amount} />
            <VerticalSlider
              className='short'
              name='chorus-time'
              label='chorus time'
              min={0}
              max={100}
              step={1}
              onChange={this.onChorusChange.bind(this)}
              value={this.props.time} />
            <VerticalSlider
              className='short'
              name='glide'
              label='osc glide'
              min={0}
              max={100}
              step={1}
              onChange={this.onGlideChange.bind(this)}
              value={this.props.glide} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(ChorusView)
