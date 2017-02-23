/*
WaveLine
Displays a waveform graphic.
*/
import React from 'react'
import {lerp} from '../../helpers/helpers.js'

class WaveLine extends React.Component {
  constructor (props) {
    super(props)
    this.hasInitialized = false
    this.newData = []
    this.oldData = []
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!this.hasInitialized) {
      this.hasInitialized = true
      return true
    }
    if (!nextProps.channelData[17]) {
      return false
    }
    // Check every 100th sample ( about 6 times ) to see if the data has changed.
    let shouldUpdate = true
    for (var i = 0; i < nextProps.channelData; i += 100) {
      if (nextProps.channelData[i] !== this.props.channelData[i]) {
        shouldUpdate = false
      }
    }
    return shouldUpdate
  }

  componentDidUpdate () {
    let {channelData, width, height} = this.props
    this.oldData = this.newData
    this.newData = []
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
      this.newData.push(pixelValue)
    }

    const context = this.refs.canvas.getContext('2d')
    context.clearRect(0, 0, width, height)
    this.drawWave(context, width, height, marginLeft, marginTop)
  }

  drawWave (context, width, height, marginLeft, marginTop) {
    let time = 0
    let yValue = 0
    let self = this
    context.lineWidth = 3
    context.strokeStyle = this.props.color

    function step () {
      if (time < 1) {
        context.clearRect(0, 0, width, height)
        context.beginPath()

        for (var i = 0; i < self.newData.length; i++) {
          let x = i + marginLeft
          if (self.newData[i - 1]) {
            yValue = lerp(self.oldData[i - 1], self.newData[i - 1], time)
            context.moveTo(x - 1, yValue + marginTop)
          }

          if (self.newData[i + 1]) {
            yValue = lerp(self.oldData[i + 1], self.newData[i + 1], time)
            context.lineTo(x, yValue + marginTop)
          }
        }
        context.stroke()
        context.closePath()
        time += 0.1

        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
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
  width: React.PropTypes.number,
  height: React.PropTypes.number
}
WaveLine.defaultProps = {
  waveData: [],
  width: 300,
  height: 200
}

export default WaveLine
