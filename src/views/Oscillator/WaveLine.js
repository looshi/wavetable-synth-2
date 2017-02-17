/*
WaveLine
Displays a waveform graphic.
*/
import React from 'react'

class WaveLine extends React.Component {

  componentDidMount () {
    this.drawWaveForm()
  }

  shouldComponentUpdate (nextProps, nextState) {
    // TODO : Block drawing unless the wave has changed.
    return true
  }

  componentDidUpdate () {
    this.drawWaveForm()
  }

  drawWaveForm () {
    let {channelData, width, height} = this.props
    const context = this.refs.canvas.getContext('2d')
    context.clearRect(0, 0, width, height)

    let sampledWaveData = []
    let step = 1

    // Reduce the width to add some padding left and right.
    let padWidth = width * 0.75
    let padHeight = height * 0.75

    if (channelData.length > padWidth) {
      step = Math.ceil(channelData.length / padWidth)
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
      pixelValue = Math.floor((channelData[index] * -padHeight / 2) + padHeight / 2)
      pixelValue = clamp(pixelValue)
      index = index + step
      sampledWaveData.push(pixelValue)
    }

    drawPixels(sampledWaveData, padWidth, padHeight, context, this.props.color)
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
          width={this.props.width * 0.75}
          height={this.props.height * 0.75} />
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

function drawPixels (pixels, width, height, context, color) {
  context.beginPath()
  context.lineWidth = 2
  context.strokeStyle = color

  for (var i = 0; i < pixels.length; i++) {
    if (pixels[i - 1]) {
      context.moveTo(i - 1, pixels[i - 1])
    }

    if (pixels[i + 1]) {
      context.lineTo(i, pixels[i + 1])
    }
  }

  context.stroke()
}
