/*
FilterView
UI controls for the filter.
*/
import React from 'react'
import VerticalSlider from '../Components/VerticalSlider.js'

class FilterView extends React.Component {

  render () {
    return (
      <div className='filter'>
        <h1>Filter</h1>
        <div className='box'>
          <div className='filter-sliders'>
            <VerticalSlider
              id='filter-freq'
              name='freq'
              min={60}
              max={20000}
              step={10}
              value={this.props.detune} />
            <VerticalSlider
              id='filter-res'
              name='res'
              min={0}
              max={100}
              step={1}
              value={this.props.octave} />
          </div>
        </div>
      </div>
    )
  }
}

export default FilterView
