/*
VerticalSlider
Label, slider.
*/
import React from 'react'
import {connect} from 'react-redux'

class VerticalSlider extends React.Component {

  render () {
    return (
      <div className='vertical-slider'>

        <div className='slider-amount'>{this.props.value}</div>

        <input
          type='range'
          orient='vertical'
          min={this.props.min}
          max={this.props.max}
          data-name={this.props.name}
          defaultValue={this.props.value}
          onChange={this.props.onChange} />

        <div className='slider-label'>{this.props.label}</div>
      </div>
    )
  }
}

export default connect()(VerticalSlider)
