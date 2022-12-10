import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { createRoot } from 'react-dom/client';
import App from './App.js'
import Reducers from './data/Reducers.js'
import '../css/index.scss'
import '../css/keyboard.scss'
import '../css/fader.scss'
import '../css/react-select-overrides.scss'


let store = createStore(Reducers)

const AppContainer = () => {
  const [audioContext, setAudioContext] = useState(null);

  if (!audioContext) {
    return (
      <div className="get-started">
        <h1>Welcome to Wavetable synth!</h1>
        <p>Click on the piano keys, type keys on your keyboard, or even hook up a MIDI keyboard to hear it in action!</p>
        <button
          onClick={() => setAudioContext(new AudioContext())}>
          Click Here to Start
        </button>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <App
        store={store}
        audioContext={audioContext}
      />
    </Provider>
  )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppContainer />)
