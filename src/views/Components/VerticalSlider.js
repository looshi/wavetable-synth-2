/*
VerticalSlider
Label, slider.
*/
import React from 'react'
import {connect} from 'react-redux'

class VerticalSlider extends React.Component {

  sliderClassName () {
    let className = 'fader vertical '
    if (this.props.color) {
      className += this.props.color.split('#').join('color-')
    }
    return className
  }

  render () {
    return (
      <div className='vertical-slider'>

        <div className='slider-amount'>{this.props.value}</div>
        <div className='vertical-silder-container'>
          <input
            type='range'
            orient='vertical'
            className={this.sliderClassName()}
            min={this.props.min}
            max={this.props.max}
            data-name={this.props.name}
            defaultValue={this.props.value}
            onChange={this.props.onChange} />
        </div>
        <div className='slider-label'>{this.props.label}</div>
      </div>
    )
  }
}

export default connect()(VerticalSlider)
