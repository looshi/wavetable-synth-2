import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import '../css/index.scss'
import '../css/keyboard.scss'
import '../css/fader.scss'
import '../css/react-select-overrides.scss'
import App from './App.js'
import Reducers from './data/Reducers.js'

let store = createStore(Reducers)
let audioContext
const createAudioContext = () => {
  audioContext = new AudioContext()
  renderApp();
}

const renderApp = () => {
  if (!audioContext) {
    return render(
      <div className="get-started">
        <h1>Welcome to Wavetable synth!</h1>
        <p>Click on the piano keys, type keys on your keyboard, or even hook up a MIDI keyboard to hear it in action!</p>
        <button
          onClick={createAudioContext}>
          Click Here to Start
        </button>
      </div>,
      document.getElementById('root')
    );
  }

  return render(
    <Provider store={store}>
      <App
        store={store}
        audioContext={audioContext}
        createAudioContext={createAudioContext}
      />
    </Provider>,
    document.getElementById('root')
  )
}

renderApp();
