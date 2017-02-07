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
              id='filter-freq'
              name='freq'
              min={60}
              max={20000}
              step={10}
              value={this.props.freq} />
            <VerticalSlider
              id='filter-res'
              name='res'
              min={0}
              max={100}
              step={1}
              value={this.props.res} />
            <VerticalSlider
              id='filter-attack'
              name='a'
              min={1}
              max={100}
              step={1}
              value={this.props.attack} />
            <VerticalSlider
              id='filter-decay'
              name='d'
              min={0}
              max={100}
              step={1}
              value={this.props.decay} />
            <VerticalSlider
              id='filter-sustain'
              name='s'
              min={0}
              max={100}
              step={1}
              value={this.props.sustain} />
            <VerticalSlider
              id='filter-release'
              name='r'
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
