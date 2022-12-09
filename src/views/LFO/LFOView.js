/*
LFOView
Set shape, amount, rate, and destination.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { connect } from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'

class LFOView extends React.Component {
  constructor(props) {
    super(props)
    let options = this.props.destinations.map((destination) => {
      return {
        label: destination.label,
        value: destination.id
      }
    })
    this.state = { options }
  }

  onDestinationChanged(event) {
    const { id, dispatch, destinations } = this.props
    const newDestination = destinations.find((dest) => dest.id === event.value)
    const oldDestination = this.props.destination
    let action = Actions.lfoDestinationChanged(id, oldDestination, newDestination)
    dispatch(action)
  }

  onShapeChanged(event) {
    const { id, destination } = this.props
    const shape = event.target.getAttribute('data-shape')
    let action = Actions.lfoShapeChanged(id, shape, destination)
    this.props.dispatch(action)
  }

  onAmountChanged(e) {
    const { id, destination } = this.props
    let value = Number(e.target.value)
    let action = Actions.lfoAmountChanged(id, value, destination)
    this.props.dispatch(action)
  }

  onRateChanged(e) {
    const { id, destination } = this.props
    let value = Number(e.target.value)
    let action = Actions.lfoRateChanged(id, value, destination)
    this.props.dispatch(action)
  }

  buttonClassName(type, selected) {
    let typeClass = ''
    switch (type) {
      case 't':
        typeClass = 'triangle'
        break
      case 'w':
        typeClass = 'sawtooth'
        break
      case 's':
        typeClass = 'square'
        break
      case 'r':
        typeClass = 'random'
        break
    }
    let className = 'toggle-button shape-button ' + typeClass
    if (type === selected) {
      className += ' selected'
    }
    return className
  }

  isSelectedDestination(destination) {
    return this.props.destination === destination
  }

  render() {
    let selected = this.props.shape
    return (
      <div className='module lfo'>
        <h1>LFO {this.props.name}</h1>
        <div className='box'>
          <div onClick={this.onShapeChanged.bind(this)} className='shape-switch'>
            <div data-shape={'t'} className={this.buttonClassName('t', selected)} />
            <div data-shape={'w'} className={this.buttonClassName('w', selected)} />
            <div data-shape={'s'} className={this.buttonClassName('s', selected)} />
            <div data-shape={'r'} className={this.buttonClassName('r', selected)} />
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
        <div className='destination-selector'>
          <Select
            className='lfo-destination'
            value={this.props.destination.id}
            clearable={false}
            searchable={false}
            options={this.state.options}
            onChange={this.onDestinationChanged.bind(this)} />
        </div>
      </div>
    )
  }
}

const { string, number, arrayOf, object } = PropTypes
LFOView.propTypes = {
  id: string.isRequired,
  name: string.isRequired,
  shape: string.isRequired,
  amount: number.isRequired,
  rate: number.isRequired,
  destination: object.isRequired,
  destinations: arrayOf(PropTypes.object)
}

export default connect()(LFOView)
