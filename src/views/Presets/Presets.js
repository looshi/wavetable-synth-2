/*
Presets
Dropdown list of available presets.
*/
import React from 'react'
import Select from 'react-select'
import PresetData from '../../data/PresetData.js'

class Presets extends React.Component {

  onPresetChanged (e) {
    console.log('preset changed', e)
  }

  render () {
    const presetData = Object.keys(PresetData).map((preset) => {
      return {label: preset, value: PresetData[preset]}
    })
    return (
      <div className='preset-list-container'>
        <Select
          className='preset-list'
          value={this.props.preset}
          clearable={false}
          searchable={false}
          options={presetData}
          onChange={this.onPresetChanged.bind(this)} />
      </div>
    )
  }
}

export default Presets
