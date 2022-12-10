/*
MidiInput
Selects a device from available MIDI input devices.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { connect } from 'react-redux'
import Actions from '../../data/Actions.js'

class MidiInput extends React.Component {
  constructor(props) {
    super(props)
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(this.onMidiInit.bind(this), this.onMidiError)
      this.state = {
        options: [{ label: 'Select MIDI device', value: -1, disabled: true }],
        selectedInput: -1
      }
    } else {
      this.state = {
        options: [{ label: 'MIDI not supported, try Chrome', value: -1, disabled: true }],
        selectedInput: -1
      }
    }
    this.notesOn = []
  }

  onMidiInit(midiAccess) {
    let options = this.state.options
    let inputs = midiAccess.inputs.values()
    let hasSelectedInput = false
    for (var input of inputs) {
      input.onmidimessage = this.onMidiMessage.bind(this)
      options.push({ label: input.name, value: input.id })
      // Select the first MIDI input found by default.
      if (!hasSelectedInput) {
        this.setState({ selectedInput: input.id })
        hasSelectedInput = true
      }
    }
    this.setState({ options })
  }

  onMidiError() {

  }
  onInputChanged(e) {
    this.setState({ selectedInput: e.value })
  }

  handleKeyDown(noteNumber) {
    // Change pitch.
    this.props.dispatch(Actions.noteOn(noteNumber))

    // Start Envelope.
    if (this.notesOn.length === 0) {
      this.props.eventEmitter.emit('NOTE_ON', noteNumber)
    }
    // Collect the note for the arpeggiator.
    this.props.eventEmitter.emit('ARP_COLLECT_NOTE', noteNumber)
    this.notesOn.push(noteNumber)
  }

  handleKeyUp(noteNumber) {
    this.props.dispatch(Actions.noteOff(noteNumber))

    this.notesOn = this.notesOn.filter((note) => {
      return note !== noteNumber
    })

    if (this.notesOn.length === 0) {
      this.props.eventEmitter.emit('NOTE_OFF', noteNumber)
    } else {
      let lastNotePlayed = this.notesOn[this.notesOn.length - 1]
      this.props.dispatch(Actions.noteOn(lastNotePlayed))
    }
  }

  onMidiMessage(e) {
    // Only listen to the selected MIDI device.
    if (e.target.id !== this.state.selectedInput) {
      return
    }

    var cmd = e.data[0] >> 4
    // var channel = e.data[0] & 0xf
    // channel = channel + 1  //  TODO, why is zero ch 1, is only my akai ?
    // var timeStamp = e.timeStamp
    // var receivedTime = e.receivedTime
    var noteNumber = e.data[1]
    var velocity = 0

    if (e.data.length > 2) {
      velocity = e.data[2]
    }

    if (cmd === 8 || ((cmd === 9) && (velocity === 0))) {
      // NOTE OFF MIDI noteon with velocity=0 is the same as noteoff
      this.handleKeyUp(noteNumber)
    } else if (cmd === 9) {
      // NOTE ON
      this.handleKeyDown(noteNumber)
    } else if (cmd === 11) {
      // CONTROLLER
    } else if (cmd === 12) {
      // PROGRAM CHANGE
    } else {
      // SYSEX
    }
  }

  render() {
    return (
      <div className='midi-input-container'>
        <Select
          className={'midi-input-list'}
          value={this.state.selectedInput}
          clearable={false}
          searchable={false}
          options={this.state.options}
          onChange={this.onInputChanged.bind(this)} />
      </div>
    )
  }
}

MidiInput.propTypes = {
  eventEmitter: PropTypes.object
}

export default connect()(MidiInput)
