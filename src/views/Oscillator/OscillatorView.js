/*
OscillatorView
UI controls for a single oscillator.
Combines two waveforms and calculates a new waveform based on the selected
operator.
*/
import React from 'react';
import WaveFileLoader from './WaveFileLoader.js';
import WaveLine from './WaveLine.js';
import AlgorithmSwitch from './AlgorithmSwitch.js';
import HorizontalSlider from '../Components/HorizontalSlider.js';

class OscillatorView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  componentDidUpdate() {
  }
  render() {
   return (
     <div className='oscillator'>
       <h1>Oscillator {this.props.name}</h1>
       <div className='wavetable-boxes'>
         <div className='wavetable-box'>
           <WaveLine
             width = {140}
             height = {136}
             channelData = {this.props.channelDataA} />

           <WaveFileLoader
             id = {this.props.id}
             side = {'A'}
             selectedFile = {this.props.fileA}
             audioContext = {this.props.audioContext}
             files = {this.props.files} />
         </div>

         <div className='wavetable-box'>
           <WaveLine
             width = {140}
             height = {136}
             channelData= {this.props.channelDataB} />

           <WaveFileLoader
             id = {this.props.id}
             side = {'B'}
             selectedFile = {this.props.fileB}
             audioContext = {this.props.audioContext}
             files = {this.props.files} />
           </div>
           <div className = 'algorithm-switch-horizontal'>
             <AlgorithmSwitch
               id = {this.props.id}
               algorithm = {this.props.algorithm} />
           </div>
           <div className='wavetable-computed'>
             <WaveLine
               width = {300}
               height = {136}
               channelData= {this.props.computedChannelData} />
          </div>
          <div className='oscillator-sliders'>
            <HorizontalSlider
              id = {this.props.id}
              name = "detune"
              min = {-12}
              max = {12}
              step = {1}
              value = {this.props.detune} />
            <HorizontalSlider
              id = {this.props.id}
              name = "octave"
              min = {-3}
              max = {3}
              step = {1}
              value = {this.props.octave} />
            <HorizontalSlider
              id = {this.props.id}
              name = "amount"
              min = {0}
              max = {100}
              step = {1}
              value = {this.props.amount} />
          </div>

        </div>
      </div>
    );
  }
}
OscillatorView.propTypes = {
  waveData: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};
OscillatorView.defaultProps = {
  waveData: [],
  width: 300,
  height: 200,
};

// Container components can be described by these two functions :
function mapStateToProps(state){
  return {
    state: state,
  };
}
export default OscillatorView;
