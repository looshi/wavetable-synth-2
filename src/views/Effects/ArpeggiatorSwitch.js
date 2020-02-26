/*
ArpeggiatorSwitch
Switches between on / off / hold.
Eventually could have shapes like UP / DOWN / UPDOWN etc.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class ArpeggiatorSwitch extends React.Component {

  onArpValueChanged (event) {
    const name = event.target.getAttribute('data-name')
    if (name === 'on') {
      this.props.dispatch(Actions.arpIsOn(true))
    } else if (name === 'off') {
      this.props.dispatch(Actions.arpIsOn(false))
    }
  }

  buttonClassName (type, selected) {
    let className = 'toggle-button'
    if (type === selected) {
      className += ' selected'
    }
    return className
  }

  render () {
    let selected = this.props.arpIsOn
    return (
      <div>
        <div className='arp-switch-label'>arpeggiator</div>
          <div onClick={this.onArpValueChanged.bind(this)} className='arpeggiator-switch'>
            <div data-name={'on'} className={this.buttonClassName(true, selected)}>ON</div>
            <div data-name={'off'} className={this.buttonClassName(false, selected)}>OFF</div>
        </div>
      </div>
    )
  }
}
ArpeggiatorSwitch.propTypes = {
  arpIsOn: React.PropTypes.bool
}

export default connect()(ArpeggiatorSwitch)
