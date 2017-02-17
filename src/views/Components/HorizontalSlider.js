/*
HorizontalSlider
Label, slider, and number value.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class HorizontalSlider extends React.Component {

  handleChange (e) {
    const {id, name} = this.props
    let action = Actions.sliderChanged(id, e.target.value, name)
    this.props.dispatch(action)
  }

  sliderClassName () {
    let className = 'fader horizontal '
    if (this.props.color) {
      className += this.props.color.split('#').join('color-')
    }
    return className
  }

  render () {
    const textStyle = {
      color: this.props.color
    }
    return (
      <div className='horizontal-slider'>
        <div className='slider-label' style={textStyle}>{this.props.label}</div>
        <input
          className={this.sliderClassName()}
          type='range'
          min={this.props.min}
          max={this.props.max}
          defaultValue={this.props.value}
          onChange={this.handleChange.bind(this)} />

        <div className='slider-value' style={textStyle}>{this.props.value}</div>
      </div>
    )
  }
}

export default connect()(HorizontalSlider)
