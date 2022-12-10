/*
VerticalSlider
Label, slider.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { lerp } from '../../helpers/helpers.js'

class VerticalSlider extends React.Component {

  componentDidMount() {
    this.animate(this.sliderInput.value, this.props.value, this)
  }

  sliderClassName() {
    let className = 'fader vertical '
    if (this.props.color) {
      className += this.props.color.split('#').join('color-')
    }
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    return className
  }

  handleChange(e) {
    this.props.onChange(e)
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
    return (
      <div className='vertical-slider'>

        <div className='slider-amount'>{this.props.value}</div>
        <div className={'vertical-slider-container ' + this.props.className}>
          <input
            type='range'
            ref={(input) => { this.sliderInput = input }}
            orient='vertical'
            className={this.sliderClassName()}
            min={this.props.min}
            max={this.props.max}
            data-name={this.props.name}
            onChange={this.handleChange.bind(this)} />
        </div>
        <div className={'slider-label ' + this.props.className}>{this.props.label}</div>
      </div>
    )
  }
}

VerticalSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.string
}

export default connect()(VerticalSlider)
