/*
AmpView
ADSR faders for amplitude.
*/
import React from 'react'
import VerticalSlider from '../Components/VerticalSlider.js'

class AmpView extends React.Component {

  render () {
    return (
      <div className='module'>
        <h1>Amp</h1>
        <div className='box'>
          <div className='filter-sliders'>
            <VerticalSlider
              name='amp-attack'
              label='a'
              min={1}
              max={100}
              step={1}
              value={this.props.attack} />
            <VerticalSlider
              name='amp-decay'
              label='d'
              min={0}
              max={100}
              step={1}
              value={this.props.decay} />
            <VerticalSlider
              name='amp-sustain'
              label='s'
              min={0}
              max={100}
              step={1}
              value={this.props.sustain} />
            <VerticalSlider
              name='amp-release'
              label='r'
              min={0}
              max={100}
              step={1}
              value={this.props.release} />
          </div>
        </div>
      </div>
    )
  }
}

export default AmpView
