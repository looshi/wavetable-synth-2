/*
FilterView
UI controls for the filter.
*/
import React from 'react'
import VerticalSlider from '../Components/VerticalSlider.js'

class FilterView extends React.Component {

  render () {
    return (
      <div className='module'>
        <h1>Filter</h1>
        <div className='box'>
          <div className='filter-sliders'>
            <VerticalSlider
              name='filter-freq'
              label='freq'
              min={60}
              max={20000}
              step={10}
              value={this.props.freq} />
            <VerticalSlider
              name='filter-res'
              label='res'
              min={0}
              max={100}
              step={1}
              value={this.props.res} />
            <VerticalSlider
              name='filter-attack'
              label='a'
              min={1}
              max={100}
              step={1}
              value={this.props.attack} />
            <VerticalSlider
              name='filter-decay'
              label='d'
              min={0}
              max={100}
              step={1}
              value={this.props.decay} />
            <VerticalSlider
              name='filter-sustain'
              label='s'
              min={60}
              max={20000}
              step={10}
              value={this.props.sustain} />
            <VerticalSlider
              name='filter-release'
              label='r'
              min={0}
              max={100}
              step={1}
              value={this.props.release} />
          </div>
        </div>
      </div>
    )
  }
}

export default FilterView
