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
    console.log('this.props', this.props);
   return (
     <div className='oscillator'>
       <h1>Oscillator {this.props.name}</h1>
       <div className='wavetable-boxes'>
         <div className='wavetable-box'>
           <WaveLine
             width = {140}
             height = {135}
             audioContext = {this.props.audioContext}
             waveData = {this.props.waveTableA} />

           <WaveFileLoader
             id = {this.props.id}
             side = {'A'}
             selectedFile = {this.props.fileA}
             files = {this.props.files} />
         </div>
         <div className='wavetable-box'>
           <WaveLine
             width = {140}
             height = {135}
             audioContext = {this.props.audioContext}
             waveData= {this.props.waveTableB} />

           <WaveFileLoader
             id = {this.props.id}
             side = {'B'}
             selectedFile = {this.props.fileB}
             files = {this.props.files} />
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
