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
    let typeClass = ''
    switch (type) {
      case 'p':
        typeClass = 'plus'
        break
      case 'm':
        typeClass = 'minus'
        break
      case 'd':
        typeClass = 'divide'
        break
      case 'x':
        typeClass = 'multiply'
        break
    }
    let className = typeClass + ' toggle-button algorithm-button'
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
        <div data-algo={'p'} className={this.buttonClassName('p', selected)} />
        <div data-algo={'m'} className={this.buttonClassName('m', selected)} />
        <div data-algo={'d'} className={this.buttonClassName('d', selected)} />
        <div data-algo={'x'} className={this.buttonClassName('x', selected)} />
      </div>
    )
  }
}

export default connect()(AlgorithmSwitch)
