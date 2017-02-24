/*
Keyboard
Sends note on / off events.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'
import _ from 'lodash'

class Keyboard extends React.Component {
  constructor (props) {
    super(props)
    this.notesOn = []
  }

  componentDidMount () {
    let keys = {
      'z': 1,
      'x': 2,
      'c': 3,
      'v': 4,
      'b': 5,
      'n': 6,
      'm': 7,
      ',': 8,
      '.': 9,
      '/': 10,
      'a': 13,
      's': 14,
      'd': 15,
      'f': 16,
      'g': 17,
      'h': 18,
      'j': 19,
      'k': 20,
      'l': 21,
      ';': 22,
      '\'': 23,
      'q': 25,
      'w': 26,
      'e': 27,
      'r': 28,
      't': 29,
      'y': 30,
      'u': 31,
      'i': 32,
      'o': 33,
      'p': 34,
      '[': 35,
      ']': 36,
      '1': 48,
      '2': 49,
      '3': 50,
      '4': 51,
      '5': 52,
      '6': 53,
      '7': 54,
      '8': 55,
      '9': 56,
      '0': 57,
      '-': 58,
      '=': 59
    }

    document.addEventListener('keydown', (event) => {
      if (keys[event.key]) {
        const noteNumber = keys[event.key] + 23
        if (!_.includes(this.notesOn, noteNumber)) {
          this.noteOn(noteNumber)
        }
      }
    })

    document.addEventListener('keyup', (event) => {
      if (keys[event.key]) {
        const noteNumber = keys[event.key] + 23
        this.noteOff(noteNumber)
      }
    })
  }

  onMouseDown (event) {
    const noteNumber = event.target.getAttribute('data-midi')
    this.noteOn(noteNumber)
  }
  onMouseUp (event) {
    const noteNumber = event.target.getAttribute('data-midi')
    this.noteOff(noteNumber)
  }

  noteOn (noteNumber) {
    // Changes pitch.
    this.props.dispatch(Actions.noteOn(noteNumber))

    // Starts Envelope.
    if (this.notesOn.length === 0) {
      this.props.eventEmitter.emit('NOTE_ON', noteNumber)
    }
    // Notify the Arpeggiator if its on.
    this.props.eventEmitter.emit('ARP_COLLECT_NOTE', noteNumber)
    this.notesOn.push(noteNumber)
  }

  noteOff (noteNumber) {
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

  // Populates black and white key arrays with midi note number data.
  // The key numbers start at 24 which is "C0", the second octave of MIDI notes.
  // This is quite low, and usually the lowest key on a keyboard, but not the
  // lowest actual MIDI note, for example ableton shows C-1 and C-1 lower octaves.
  drawKeys () {
    let blackKeys = [1, 3, 6, 8, 10]
    let keys = {
      black: [],
      white: []
    }
    let note = 0
    for (var octave = 0; octave < 7; octave++) {
      for (var i = 0; i <= 11; i++) {
        note = note + 1
        var key = {
          midi: i + (12 * octave) + 24,
          note: note
        }
        if (blackKeys.indexOf(i) !== -1) {
          keys.black.push(key)
        } else {
          keys.white.push(key)
          // Spacers are invisible keys which space out visible black keys.
          let spacer = {
            isSpacer: true
          }
          keys.black.push(spacer)
        }
      }
    }
    return keys
  }

  blackKeyClassName (key) {
    let className = 'key black-key'
    if (key.isSpacer) className += ' spacer'
    return className
  }

  isKeyOn (key) {
    return this.props.Keyboard[key.midi] === 'on'
  }

  render () {
    let {black, white} = this.drawKeys()
    return (
      <div className='keyboard-container'>
        <div className='keyboard'>
          <div className='white-keys'>
            {
              white.map((key) => {
                return (
                  <div
                    key={key.note || Math.random()}
                    data-key={key.note}
                    data-on={this.isKeyOn(key)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                    className='key'
                    data-midi={key.midi} />
                )
              })
            }
          </div>
          <div className='black-keys'>
            {
              black.map((key) => {
                return (
                  <div
                    key={key.note || Math.random()}
                    data-key={key.note}
                    data-on={this.isKeyOn(key)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                    className={this.blackKeyClassName(key)}
                    data-midi={key.midi} />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

export default connect()(Keyboard)
