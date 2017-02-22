/*
Presets
Dropdown list of available presets.
*/
import React from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import PresetData from '../../data/PresetData.js'
import Actions from '../../data/Actions.js'

class Presets extends React.Component {
  constructor (props) {
    super(props)
    const options = PresetData.map((preset) => {
      let label = preset.name + ' by ' + preset.author
      return {label, value: preset.id}
    })
    this.state = { options }
  }

  onPresetChanged (e) {
    let preset = PresetData.find((p) => p.id === e.value)
    window.location.hash = preset.data
    let action = Actions.loadPresetURLData(e.value)
    this.props.dispatch(action)
  }

  render () {
    return (
      <div className='preset-list-container'>
        <Select
          className={'preset-list'}
          value={Number(this.props.presetId)}
          clearable={false}
          searchable={false}
          options={this.state.options}
          onChange={this.onPresetChanged.bind(this)} />
      </div>
    )
  }
}

export default connect()(Presets)
