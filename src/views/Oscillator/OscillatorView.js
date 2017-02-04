/*
OscillatorView
Container for each oscillator view.
Contains two file loaders, the row of algorithm operators, and three WaveLine
graphics.
*/
import React from 'react';
import WaveFileLoader from './WaveFileLoader.js'
import WaveLine from './WaveLine.js'

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
             height = {135}
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
             height = {135}
             channelData= {this.props.channelDataB} />

           <WaveFileLoader
             id = {this.props.id}
             side = {'B'}
             selectedFile = {this.props.fileB}
             audioContext = {this.props.audioContext}
             files = {this.props.files} />
           </div>
           <div className='wavetable-computed'>
             <WaveLine
               width = {300}
               height = {135}
               channelData= {this.props.computedChannelData} />
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
