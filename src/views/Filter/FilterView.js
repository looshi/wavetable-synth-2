/*
FilterView
UI controls for the filter.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import VerticalSlider from '../Components/VerticalSlider.js'
import Actions from '../../data/Actions.js'

class FilterView extends React.Component {

  onSliderChange(event) {
    const { id } = this.props
    const name = event.target.getAttribute('data-name')
    const value = Number(event.target.value)
    const action = Actions.filterSliderChanged(id, value, name)
    this.props.dispatch(action)
  }

  render() {
    return (
      <div className='module'>
        <h1>Filter</h1>
        <div className='box'>
          <div className='filter-sliders'>
            <VerticalSlider
              name='filter-freq'
              label='freq'
              min={0}
              max={100}
              step={10}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.freq} />
            <VerticalSlider
              name='filter-res'
              label='res'
              min={0}
              max={100}
              step={1}
              onChange={this.onSliderChange.bind(this)}
              value={this.props.res} />
            <div className='asdr-sliders'>
              <VerticalSlider
                name='filter-attack'
                label='a'
                min={0}
                max={100}
                step={1}
                onChange={this.onSliderChange.bind(this)}
                value={this.props.attack} />
              <VerticalSlider
                name='filter-decay'
                label='d'
                min={0}
                max={100}
                step={1}
                onChange={this.onSliderChange.bind(this)}
                value={this.props.decay} />
              <VerticalSlider
                name='filter-sustain'
                label='s'
                min={0}
                max={100}
                step={10}
                onChange={this.onSliderChange.bind(this)}
                value={this.props.sustain} />
              <VerticalSlider
                name='filter-release'
                label='r'
                min={0}
                max={100}
                step={1}
                onChange={this.onSliderChange.bind(this)}
                value={this.props.release} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FilterView.propTypes = {
  freq: PropTypes.number,
  res: PropTypes.number,
  attack: PropTypes.number,
  decay: PropTypes.number,
  sustain: PropTypes.number,
  release: PropTypes.number
}

export default connect()(FilterView)
