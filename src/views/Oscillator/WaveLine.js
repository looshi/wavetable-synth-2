/*
WaveLine
Displays a waveform graphic.
*/
import React from 'react';

class WaveLine extends React.Component {
  constructor(props) {
    console.log('waveline', props);
    super(props);
  }
  componentDidMount() {
    this.drawWaveForm();
  }
  shouldComponentUpdate(nextProps, nextState){
    // TODO : Block drawing unless the wave has changed.
    return true;
  }
  componentDidUpdate() {
    console.log('waveline update', this.props);
    this.drawWaveForm();
  }
  drawWaveForm() {
    const context = this.refs.canvas.getContext('2d');
    context.clearRect(0, 0, this.props.width, this.props.height);

    let {waveData, width, height} = this.props;
    let step = 5;
    let sampledWaveData = [];

    // These are mono, get the 'left' channel data.
    // Couldn't figure out how to do this without using decodeAudioData,
    // e.g. something like this : var dataView = new Int32Array(waveData); -- ?
    this.props.audioContext.decodeAudioData(waveData).then(function(audioBuffer) {
      const channelData = audioBuffer.getChannelData(0);

      // Sample only the points we should draw out of the waveData.
      var pixelValue = 0;
      for (let i = 0; i < channelData.length - step; i = i + step) {
        pixelValue = Math.floor(channelData[i] * 50 + 50);
        //if (i%2 == 0) {
          sampledWaveData.push(pixelValue);
        //}

      }

      console.log('drawing', sampledWaveData);

      let rgba = [0, 71, 180, 255];
      drawPixels(sampledWaveData, width, height, context, rgba);

    });

   }
   render() {
     const boxStyle = {
       width: this.props.width,
       height: this.props.height
     }
     return (
       <div className='box' style={boxStyle}>
         <canvas ref='canvas'
          width = {this.props.width}
          height = {this.props.height}/>
        </div>
      );
    }
}
WaveLine.propTypes = {
  //waveData: React.PropTypes.ArrayBuffer,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};
WaveLine.defaultProps = {
  waveData: [],
  width: 300,
  height: 200,
};

export default WaveLine;

function drawPixels(pixels, width, height, context, rgba) {
  const canvasData = context.getImageData(0, 0, width, height);
  context.beginPath();
  context.lineWidth = 4;
  context.strokeStyle = '#0047B4';

  pixels.forEach(function(pixel, index) {
   context.moveTo(index, pixel);
   if(pixels[index+1]){
     context.lineTo(index, pixels[index+1]);
   }
  });
  context.stroke();
}
