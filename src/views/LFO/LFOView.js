/*
LFOView
Set shape, amount, rate, and destination.
*/
import React from 'react'
import {connect} from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'

class LFOView extends React.Component {

  onDestinationChanged (event) {
    const {id, dispatch, destinations} = this.props
    const newDestination = destinations.find((dest) => dest.id === event.target.value)
    const oldDestination = this.props.destination
    let action = Actions.lfoDestinationChanged(id, oldDestination, newDestination)
    dispatch(action)
  }

  onShapeChanged (event) {
    const {id, destination} = this.props
    const shape = event.target.getAttribute('data-shape')
    let action = Actions.lfoShapeChanged(id, shape, destination)
    this.props.dispatch(action)
  }

  onAmountChanged (e) {
    const {id, destination} = this.props
    let action = Actions.lfoAmountChanged(id, e.target.value, destination)
    this.props.dispatch(action)
  }

  onRateChanged (e) {
    const {id, destination} = this.props
    let action = Actions.lfoRateChanged(id, e.target.value, destination)
    this.props.dispatch(action)
  }

  buttonClassName (type, selected) {
    let className = 'toggle-button shape-button'
    if (type === selected) {
      className += ' selected'
    }
    return className
  }

  isSelectedDestination (destination) {
    return this.props.destination === destination
  }

  render () {
    let selected = this.props.shape
    return (
      <div className='module lfo'>
        <h1>LFO {this.props.name}</h1>
        <div className='box'>
          <div onClick={this.onShapeChanged.bind(this)} className='shape-switch'>
            <div data-shape={'sine'} className={this.buttonClassName('sine', selected)}>~</div>
            <div data-shape={'triangle'} className={this.buttonClassName('triangle', selected)}>&#94;</div>
            <div data-shape={'sawtooth'} className={this.buttonClassName('sawtooth', selected)}>/\/\</div>
            <div data-shape={'square'} className={this.buttonClassName('square', selected)}>|-|</div>
            <div className='wave-label'>shape</div>
          </div>
          <div className='sliders'>
            <VerticalSlider
              id={this.props.id}
              name='lfo-amount'
              label='amt'
              min={0}
              max={100}
              step={1}
              onChange={this.onAmountChanged.bind(this)}
              value={this.props.amount} />
            <VerticalSlider
              id={this.props.id}
              name='lfo-rate'
              label='rate'
              min={1}
              max={100}
              step={1}
              onChange={this.onRateChanged.bind(this)}
              value={this.props.rate} />
          </div>
        </div>
        <select
          onChange={this.onDestinationChanged.bind(this)}
          value={this.props.destination.id} >
          <option
            key='none'
            value='none'
            disabled >
            Select Destination
          </option>
          {
            this.props.destinations.map((destination) => {
              let options = {
                key: destination.id,
                value: destination.id
              }
              if (destination.active) options.disabled = 'disabled'
              return (
                <option {...options}>
                  {destination.label}
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }
}

export default connect()(LFOView)
