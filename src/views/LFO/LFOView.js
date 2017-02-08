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
    const {id, dispatch} = this.props
    const destination = event.target.value
    let action = Actions.lfoDestinationChanged(id, destination)
    dispatch(action)
  }

  onShapeChanged (event) {
    const {id, dispatch} = this.props
    const shape = event.target.getAttribute('data-shape')
    let action = Actions.lfoShapeChanged(id, shape)
    dispatch(action)
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
            <div data-shape={'saw'} className={this.buttonClassName('saw', selected)}>/\/\</div>
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
              value={this.props.amount} />
            <VerticalSlider
              id={this.props.id}
              name='lfo-rate'
              label='rate'
              min={1}
              max={100}
              step={1}
              value={this.props.rate} />
          </div>
        </div>
        <select
          onChange={this.onDestinationChanged.bind(this)}
          value={this.props.destination} >
          <option
            key='none'
            value='none'
            disabled >
            Select Destination
          </option>
          {
            this.props.destinations.map((destination) => {
              return (
                <option
                  key={destination}
                  value={destination}>
                  {destination}
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
