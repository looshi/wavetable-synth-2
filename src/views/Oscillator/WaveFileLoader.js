/*
Dropdown, shows a list of files.
On select, loads the file.
*/
import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import {connect} from 'react-redux'
import Actions from '../../data/Actions.js'
const baseUrl = 'http://davedave.us/wavetable-synth/wavs/'

class WaveFileLoader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: []
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.files.length !== nextProps.files.length) {
      let options = nextProps.files.map((file) => {
        let fileName = file.split('.')[0]
        return { value: fileName, label: file.split('.')[0] }
      })
      this.setState({options})
    }

    // Wait until the file list is ready.
    if (this.props.files.length) {
      this.loadWaveFile(nextProps.selectedFile)
    }
  }

  onFileSelected (e) {
    const {id, side, dispatch} = this.props
    let action = Actions.waveFileLoadStarted(id, side, e.value)
    dispatch(action)
  }

  loadWaveFile (fileName) {
    const {id, side, audioContext, dispatch} = this.props
    const filePath = baseUrl + fileName + '.wav'

    if (fileName.toLowerCase().indexOf('noise') !== -1) {
      // Generate some noise, don't bother to load and parse a file.
      // The "noise.wav" is actually not noise, it's just another wavetable
      // file renamed to "noise.wav" so it shows up as an option in the dropdown.
      let channelData = new Float32Array(44100)
      for (var i = 0; i < 44100; i++) {
        channelData[i] = Math.random()
      }
      let action = Actions.waveFileLoadCompleted(id, side, channelData)
      dispatch(action)
    } else {
      axios.get(filePath, { responseType: 'arraybuffer' })
        .then(function (response) {
          // Extract the data to draw each waveform.
          audioContext.decodeAudioData(response.data).then(function (buffer) {
            let channelData = buffer.getChannelData(0)
            let action = Actions.waveFileLoadCompleted(id, side, channelData)
            dispatch(action)
          })
        })
    }
  }

  render () {
    // Can't pass "options" via props.  "options" must be a reference to state.options.
    // Otherwise, react-select component will lose selected value in list.
    // Seems okay to pass in "value" via props.selectedFile.
    // To inspect the dropdown CSS add this handler to stop js and prevent
    // the dropdown from closing : onBlur={() => { debugger } } .
    return (
      <div>
        <Select
          className={'wave-file-loader color-' + this.props.color.split('#')[1]}
          value={this.props.selectedFile}
          clearable={false}
          searchable={false}
          options={this.state.options}
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
