/*
AlgorithmSwitch
Switches between multiply, divide, minus, and plus.
*/
import React from 'react';
import {connect} from 'react-redux';
import Actions from '../../data/Actions.js';


class AlgorithmSwitch extends React.Component {
  constructor(props) {
    super(props);
  }
  onAlgorithmChanged(event){
    const {id, dispatch} = this.props;
    const algo = event.target.getAttribute('data-algo');
    let action = Actions.oscAlgorithmChanged(id, algo)
    dispatch(action);
  }
  render() {
    return (
      <div onClick={this.onAlgorithmChanged.bind(this)} >
        <button data-algo={'plus'}>+</button>
        <button data-algo={'minus'}>-</button>
        <button data-algo={'divide'}>/</button>
        <button data-algo={'multiply'}>*</button>
      </div>
    );
  }
}

export default connect()(AlgorithmSwitch);
