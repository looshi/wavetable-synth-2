/*
WaveLine
Displays a waveform graphic.
*/
import React from 'react'

class WaveLine extends React.Component {
  constructor (props) {
    super(props)
    this.hasInitialized = false
  }

  shouldComponentUpdate (nextProps, nextState) {
    // Don't redraw unless the wave has changed.  Assume the 17th amplitude
    // value is different for all our wavs vs. comparing the whole array.
    return nextProps.channelData[17] !== this.props.channelData[17]
  }

  componentDidUpdate () {
    this.drawWaveForm()
  }

  drawWaveForm () {
    let {channelData, width, height} = this.props
    let sampledWaveData = []
    let step = 1

    // Add some margins and padding.
    let padWidth = width - 36
    let padHeight = height - 36
    let marginLeft = 12
    let marginTop = 12
    if (this.props.width === 300) marginTop = 14

    if (channelData.length > padWidth) {
      step = channelData.length / padWidth
    }

    // Clamp the pixels so they don't go beyond upper or lower bounds.
    function clamp (val) {
      if (val > padHeight) return padHeight - 1
      if (val < 0) return 1
      return val
    }

    // Sample only the points we should draw out of the waveData.
    var pixelValue = 0
    var index = 0

    for (let i = 0; i < padWidth; i++) {
      pixelValue = Math.floor((channelData[Math.ceil(index)] * -padHeight / 2) + padHeight / 2)
      pixelValue = clamp(pixelValue)
      index = index + step
      sampledWaveData.push(pixelValue)
    }

    const context = this.refs.canvas.getContext('2d')
    context.clearRect(0, 0, width, height)
    context.beginPath()
    context.lineWidth = 3
    context.strokeStyle = this.props.color

    for (var i = 0; i < sampledWaveData.length; i++) {
      let x = i + marginLeft
      if (sampledWaveData[i - 1]) {
        context.moveTo(x - 1, sampledWaveData[i - 1] + marginTop)
      }

      if (sampledWaveData[i + 1]) {
        context.lineTo(x, sampledWaveData[i + 1] + marginTop)
      }
    }

    context.stroke()
  }

  render () {
    const boxStyle = {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: 'white',
      borderColor: this.props.color
    }
    return (
      <div className='box' style={boxStyle}>
        <canvas ref='canvas' className='waveline-canvas'
          width={this.props.width}
          height={this.props.height} />
      </div>
    )
  }
}
WaveLine.propTypes = {
  // waveData: React.PropTypes.ArrayBuffer,
  width: React.PropTypes.number,
  height: React.PropTypes.number
}
WaveLine.defaultProps = {
  waveData: [],
  width: 300,
  height: 200
}

export default WaveLine
