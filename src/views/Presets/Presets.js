/*
Presets
Dropdown list of available presets.
*/
import React from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import PresetData from '../../data/PresetData.js'
import Actions from '../../data/Actions.js'
import _ from 'lodash'

class Presets extends React.Component {
  constructor (props) {
    super(props)
    let options = PresetData.map((preset) => {
      let label = preset.name + ' by ' + preset.author
      return {label, value: preset.id}
    })
    options = _.orderBy(options, 'label', 'asc')
    options.unshift({ label: 'Select Preset', value: -1, disabled: true })
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
          value={this.props.presetId}
          placeholder={'Select Preset'}
          clearable={false}
          searchable={false}
          options={this.state.options}
          onChange={this.onPresetChanged.bind(this)} />
      </div>
    )
  }
}
Presets.propTypes = {
  presetId: React.PropTypes.number
}

export default connect()(Presets)
