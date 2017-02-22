/*
Keyboard
Sends note on / off events.
*/
import React from 'react'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'

class Keyboard extends React.Component {

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
      ']': 36
    }

    this.keydown = false

    document.addEventListener('keydown', (event) => {
      if (!this.keydown) {
        this.keydown = true
        const midiNote = keys[event.key] + 23
        this.props.dispatch(Actions.noteOn(midiNote))
        this.props.eventEmitter.emit('NOTE_ON', midiNote)
      }
    })

    document.addEventListener('keyup', (event) => {
      this.keydown = false
      const midiNote = keys[event.key] + 23
      this.props.dispatch(Actions.noteOff(midiNote))
      this.props.eventEmitter.emit('NOTE_OFF', midiNote)
    })
  }

  handleMouseDown (event) {
    const midiNote = event.target.getAttribute('data-midi')
    this.props.dispatch(Actions.noteOn(midiNote))
    this.props.eventEmitter.emit('NOTE_ON', midiNote)
  }

  handleMouseUp (event) {
    const midiNote = event.target.getAttribute('data-midi')
    this.props.dispatch(Actions.noteOff(midiNote))
    this.props.eventEmitter.emit('NOTE_OFF', midiNote)
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
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
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
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
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
