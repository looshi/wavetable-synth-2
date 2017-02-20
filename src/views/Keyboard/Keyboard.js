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
        const key = keys[event.key]
        this.props.dispatch(Actions.noteOn(key))
        this.props.eventEmitter.emit('NOTE_ON', key)
      }
    })

    document.addEventListener('keyup', (event) => {
      this.keydown = false
      const key = keys[event.key]
      this.props.dispatch(Actions.noteOff(key))
      this.props.eventEmitter.emit('NOTE_OFF', key)
    })
  }

  handleKeyDown (event) {
    const key = event.target.getAttribute('data-key')
    this.props.dispatch(Actions.noteOn(key))
    this.props.eventEmitter.emit('NOTE_ON', key)
  }

  handleKeyUp (event) {
    const key = event.target.getAttribute('data-key')
    this.props.dispatch(Actions.noteOff(key))
    this.props.eventEmitter.emit('NOTE_OFF', key)
  }

  // Populates black and white key arrays with midi note number data.
  drawKeys () {
    let blackKeys = [1, 3, 6, 8, 10]
    let keys = {
      black: [],
      white: []
    }
    let note = 0
    for (var octave = 0; octave < 5; octave++) {
      for (var i = 0; i <= 11; i++) {
        note = note + 1
        var key = {
          midi: i + (12 * octave) + 36,
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
    return this.props.Keyboard[key.note] === 'on'
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
                    key={Math.random()}
                    data-key={key.note}
                    data-on={this.isKeyOn(key)}
                    onMouseDown={this.handleKeyDown.bind(this)}
                    onMouseUp={this.handleKeyUp.bind(this)}
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
                    key={Math.random()}
                    data-key={key.note}
                    data-on={this.isKeyOn(key)}
                    onMouseDown={this.handleKeyDown.bind(this)}
                    onMouseUp={this.handleKeyUp.bind(this)}
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
