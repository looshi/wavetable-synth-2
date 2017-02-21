/*
AlgorithmSwitch
Switches between multiply, divide, minus, and plus.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class AlgorithmSwitch extends React.Component {

  onAlgorithmChanged (event) {
    const {id, dispatch} = this.props
    const algo = event.target.getAttribute('data-algo')
    if (!algo) {
      return
    }
    let action = Actions.oscAlgorithmChanged(id, algo)
    dispatch(action)
  }

  buttonClassName (type, selected) {
    let className = type + ' toggle-button algorithm-button'
    className += ' ' + this.props.color.split('#').join('color-')
    if (type === selected) {
      className += ' selected'
    }
    return className
  }

  render () {
    let selected = this.props.algorithm
    const textStyle = {
      color: this.props.color
    }

    return (
      <div onClick={this.onAlgorithmChanged.bind(this)} className='algorithm-switch'>
        <div className='combine-prompt' style={textStyle}>combine</div>
        <div data-algo={'plus'} className={this.buttonClassName('plus', selected)} />
        <div data-algo={'minus'} className={this.buttonClassName('minus', selected)} />
        <div data-algo={'divide'} className={this.buttonClassName('divide', selected)} />
        <div data-algo={'multiply'} className={this.buttonClassName('multiply', selected)} />
      </div>
    )
  }
}

export default connect()(AlgorithmSwitch)
