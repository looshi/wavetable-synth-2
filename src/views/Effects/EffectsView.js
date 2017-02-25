/*
AmpView
ADSR faders for amplitude.
*/
import React from 'react'
import {connect} from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'
import ArpeggiatorSwitch from './ArpeggiatorSwitch'

class EffectsView extends React.Component {

  onChorusChange (event) {
    const {id} = this.props
    const name = event.target.getAttribute('data-name')
    const value = Number(event.target.value)
    const action = Actions.chorusSliderChanged(id, value, name)
    this.props.dispatch(action)
  }

  onGlideChange (event) {
    const action = Actions.glideChanged(Number(event.target.value))
    this.props.dispatch(action)
  }

  onArpTempoChange (event) {
    let action = Actions.arpTempoChanged(Number(event.target.value))
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
              value={this.props.chorusAmount} />
            <VerticalSlider
              className='short'
              name='chorus-time'
              label='chorus time'
              min={0}
              max={100}
              step={1}
              onChange={this.onChorusChange.bind(this)}
              value={this.props.chorusTime} />
            <VerticalSlider
              className='short'
              name='glide'
              label='osc glide'
              min={0}
              max={100}
              step={1}
              onChange={this.onGlideChange.bind(this)}
              value={this.props.glide} />
            <ArpeggiatorSwitch
              arpIsOn={this.props.arpIsOn} />
            <VerticalSlider
              className='short'
              name='arpTempo'
              label='arp tempo'
              min={10}
              max={160}
              step={1}
              onChange={this.onArpTempoChange.bind(this)}
              value={this.props.arpTempo} />
          </div>
        </div>
      </div>
    )
  }
}

EffectsView.propTypes = {
  arpTempo: React.PropTypes.number,
  arpIsOn: React.PropTypes.bool,
  glide: React.PropTypes.number,
  chorusTime: React.PropTypes.number,
  chorusAmount: React.PropTypes.number
}

export default connect()(EffectsView)
