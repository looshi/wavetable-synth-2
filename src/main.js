import React from 'react';
import ReactDOM from 'react-dom';
import WaveformView from './views/WaveformView.js';

ReactDOM.render(
  <div>
    <WaveformView
      width = {200}
      height = {300}
      waveData = {[1,2,3,4,5,6,7]} />
    <WaveformView
      width = {200}
      height = {300}
      waveData = {[5,6,7,8,9,10,9,8,7,6,5,4,3,2,1]} />
  </div>
  ,
  document.getElementById('root')
);
