import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import '../css/index.scss';
import App from './App.js';
import Reducers from './data/Reducers.js';

let store = createStore(Reducers);

render (
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
