/*
Dropdown, shows a list of files.
On select, loads the file.
*/
import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Actions from '../../data/Actions.js';
const baseUrl = 'http://davedave.us/wavetable-synth/wavs/';

class WaveFileLoader extends React.Component {
  constructor(props) {
    super(props);
  }
  onFileSelected(e) {
    const {id, side, audioContext, dispatch} = this.props;
    let action = Actions.waveFileLoadStarted(id, side, e.target.value);
    this.props.dispatch(action);

    // Load the .wav file from the server.
    const filePath = baseUrl + e.target.value;
    const self = this;
    axios.get(filePath, { responseType: 'arraybuffer' })
      .then(function (response) {

        // Extract the data to draw each waveform.
        audioContext.decodeAudioData(response.data).then(function(buffer) {
          const channelData = buffer.getChannelData(0);
          let action = Actions.waveFileLoadCompleted(id, side, buffer, channelData);
          dispatch(action);
        });

      })
      .catch(function (error) {
        console.warn('Error loading wav', error);
      });
  }

  render() {
   return (
     <div>
      <select onChange={this.onFileSelected.bind(this)}>
      {
        this.props.files.map( (file) => {
          return (
            <option key={file} >{file}</option>
          );
        })
      }
      </select>
     </div>
    );
  }
}
WaveFileLoader.propTypes = {
  files: React.PropTypes.array,
  id: React.PropTypes.string
};
WaveFileLoader.defaultProps = {
  files: [],
};


function mapDispatchToProps(dispatch){
  return {
    eventHandlerName: function(args) {
      dispatch({
        type: 'EVENT_NAME',
        arg1: 'value',
        arg2: 'value'
      });
    }
  }
}

// By default, invoking connect with no arguments will inject dispatch as
// a prop to the component.
export default connect()(WaveFileLoader);

function loadFile(file) {

}
