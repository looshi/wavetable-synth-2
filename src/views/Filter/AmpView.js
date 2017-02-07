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
              id='amp-attack'
              name='a'
              min={1}
              max={100}
              step={1}
              value={this.props.attack} />
            <VerticalSlider
              id='amp-decay'
              name='d'
              min={0}
              max={100}
              step={1}
              value={this.props.decay} />
            <VerticalSlider
              id='amp-sustain'
              name='s'
              min={0}
              max={100}
              step={1}
              value={this.props.sustain} />
            <VerticalSlider
              id='amp-release'
              name='r'
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
