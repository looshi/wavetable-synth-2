/*
Dropdown, shows a list of files.
On select, loads the file.
*/
import React from 'react'
import axios from 'axios'
import Select from 'react-select';
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'
const baseUrl = 'http://davedave.us/wavetable-synth/wavs/'

class WaveFileLoader extends React.Component {
  constructor (props) {
    super(props)
    this.loadWaveFile(this.props.selectedFile)
  }

  onFileSelected (e) {
    console.log('on selected', e)
    const {id, side, dispatch} = this.props
    let action = Actions.waveFileLoadStarted(id, side, e.value)
    dispatch(action)
    this.loadWaveFile(e.value)
  }

  loadWaveFile (fileName) {
    const {id, side, audioContext, dispatch} = this.props
    const filePath = baseUrl + fileName

    axios.get(filePath, { responseType: 'arraybuffer' })
      .then(function (response) {
        // Extract the data to draw each waveform.
        audioContext.decodeAudioData(response.data).then(function (buffer) {
          const channelData = buffer.getChannelData(0)
          let action = Actions.waveFileLoadCompleted(id, side, buffer, channelData)
          dispatch(action)
        })
      })
      .catch(function (error) {
        console.warn('Error loading wav', error)
      })
  }

  render () {
    const options = this.props.files.map((file) => {
      return { value: file, label: file }
    })
    return (
      <div>
        <Select
          className='wave-file-loader'
          value={this.props.selectedFile}
          clearable={false}
          searchable={false}
          options={options}
          onChange={this.onFileSelected.bind(this)} />
      </div>
    )
  }
}
WaveFileLoader.propTypes = {
  files: React.PropTypes.array,
  id: React.PropTypes.string
}
WaveFileLoader.defaultProps = {
  files: []
}

// By default, invoking connect with no arguments will inject dispatch as
// a prop to the component.
export default connect()(WaveFileLoader)
