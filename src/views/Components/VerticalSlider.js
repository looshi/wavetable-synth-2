/*
VerticalSlider
Label, slider.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class VerticalSlider extends React.Component {

  handleChange (e) {
    const {id, name} = this.props
    let action = Actions.sliderChanged(id, e.target.value, name)
    this.props.dispatch(action)
  }

  render () {
    return (
      <div className='vertical-slider'>

        <input
          type='range'
          orient='vertical'
          min={this.props.min}
          max={this.props.max}
          defaultValue={this.props.value}
          onChange={this.handleChange.bind(this)} />

        <div className='slider-label'>{this.props.label}</div>
      </div>
    )
  }
}

export default connect()(VerticalSlider)
