/*
WaveFormView
Displays a waveform line inside a box.
*/
import React from 'react';

class WaveFormView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.drawWaveForm();
  }
  componentDidUpdate() {
    this.drawWaveForm();
  }
  drawWaveForm() {
    const context = this.refs.canvas.getContext('2d');
    context.clearRect(0, 0, this.props.width, this.props.height);

    let {waveData, width, height} = this.props;
    let step = 1;
    let sampledWaveData = [];

    // Sample only the points we should draw out of the waveData.
    for (let i = 0; i < waveData.length - step; i = i + step) {
      sampledWaveData.push(waveData[i]);
    }
    let rgba = [255,0,0,100];
    drawPixels(sampledWaveData, width, height, context, rgba);
   }
   render() {
     return (
       <div>
         <h4>Oscillator</h4>
         <canvas ref='canvas'
          width={this.props.width}
          height={this.props.width}/>
        </div>
      );
    }
}
WaveFormView.propTypes = {
  waveData: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};
WaveFormView.defaultProps = {
  waveData: [],
  width: 300,
  height: 200,
};

export default WaveFormView;

/*
Draws the raw waveform data on the canvas.
*/
function drawPixels(pixels, width, height, context, rgba) {
  const canvasData = context.getImageData(0, 0, width, height);
  const thickness = 16;
  pixels.forEach(function(pixel, index) {
    var index = (index + pixel * width) * 4;
    var thick = 0;
    while(thick < thickness) {
      canvasData.data[index + 0 + thick] = rgba[0];
      canvasData.data[index + 1 + thick] = rgba[1];
      canvasData.data[index + 2 + thick] = rgba[2];
      canvasData.data[index + 3 + thick] = rgba[3];
      thick = thick + 4;
    }
  });
  context.putImageData(canvasData, 0, 0);
}
