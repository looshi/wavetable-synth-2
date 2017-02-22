/*
AmpView
ADSR faders for amplitude.
*/
import React from 'react'
import {connect} from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'

class AmpView extends React.Component {

  onSliderChange (event) {
    const {id} = this.props
    const name = event.target.getAttribute('data-name')
    const action = Actions.ampSliderChanged(id, event.target.value, name)
    this.props.dispatch(action)
  }

  render () {
    return (
      <div className='module'>
        <h1>Amp</h1>
        <div className='box'>
          <div className='amp-sliders'>
            <VerticalSlider
              name='amp-attack'
              label='a'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.attack} />
            <VerticalSlider
              name='amp-decay'
              label='d'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.decay} />
            <VerticalSlider
              name='amp-sustain'
              label='s'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.sustain} />
            <VerticalSlider
              name='amp-release'
              label='r'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.release} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(AmpView)
