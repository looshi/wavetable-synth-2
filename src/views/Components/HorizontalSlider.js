/*
HorizontalSlider
Label, slider, and number value.
*/
import React from 'react';
import {connect} from 'react-redux';
import Actions from '../../data/Actions.js';

class HorizontalSlider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 10 /** Start value **/
    };
  }

  handleChange(e) {
    const {id, name} = this.props;
    let action = Actions.sliderChanged(id, e.target.value, name);
    this.props.dispatch(action);
  }

  render() {
    return (
      <div className = 'horizontal-slider'>
        <div className='slider-label'>{this.props.name}</div>
        <input
          type="range"
          min = {this.props.min}
          max = {this.props.max}
          defaultValue = {this.props.value}
          onChange = {this.handleChange.bind(this)} />

        <div className='slider-value'>{this.props.value}</div>
      </div>
    );
  }
}

export default connect()(HorizontalSlider);
