/*
HorizontalSlider
Label, slider, and number value.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { lerp } from '../../helpers/helpers.js'

class HorizontalSlider extends React.Component {

  componentDidMount() {
    this.animate(this.sliderInput.value, this.props.value, this)
  }

  handleChange(e) {
    this.props.onChange(e)
  }

  sliderClassName() {
    let className = 'fader horizontal '
    if (this.props.color) {
      className += this.props.color.split('#').join('color-')
    }
    return className
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.sliderInput.value !== nextProps.value) {
      // This happens only when something external has updated this value.
      // Internal changes will always have equal values as the redux store.
      this.animate(this.sliderInput.value, nextProps.value, this)
    }
  }

  animate(start, end, self) {
    let time = 0
    function step() {
      if (time < 1) {
        self.sliderInput.value = lerp(start, end, time)
        time += 0.05
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  render() {
    const textStyle = {
      color: this.props.color
    }
    return (
      <div className='horizontal-slider'>
        <div className='slider-label' style={textStyle}>{this.props.label}</div>
        <input
          className={this.sliderClassName()}
          ref={(input) => { this.sliderInput = input }}
          type='range'
          min={this.props.min}
          max={this.props.max}
          onChange={this.handleChange.bind(this)} />

        <div className='slider-value' style={textStyle}>{this.props.value}</div>
      </div>
    )
  }
}

HorizontalSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.string
}

export default connect()(HorizontalSlider)
