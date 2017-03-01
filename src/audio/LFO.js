/*
LFO
Given an input of zero to 100 ( our sliders are in this range ),
for affecting frequency values, multiplier is usually 100 or more.
for affecting gain values, mulitiplier should be quite small, around .001.

let lfo = new LFO(options)
let multiplier = 0.001
lfo.connect(node.audioParam, multiplier)
*/

import Coefficients from '../data/Coefficients.js'

export default class LFO {
  constructor (props) {
    this.name = props.name
    this.id = props.id

    this.min = props.min
    this.max = props.max
    this.destinations = props.destinations
    this.multiplier = 1
    this.freqMultiplier = 1

    this._value = 0
    this._shape = props.shape
    this._frequency = 0

    this.audioContext = props.audioContext
    this.lfo = this.audioContext.createOscillator()
    this.lfoGain = this.audioContext.createGain()
    this.lfo.start()
    this.lfo.connect(this.lfoGain)
    this.lfo.frequency.value = props.rate
    this.lfoGain.gain.value = props.amount
    this.updateShape(props.shape)
  }

  connect (destination, multiplier) {
    this.lfoGain.gain.value = this._value * multiplier
    this.multiplier = multiplier
    this.lfoGain.connect(destination)
  }

  disconnect (destination) {
    this.lfoGain.disconnect()
  }

  // Allows an external controller to get a reference to this LFOs frequency.
  get lfoInputFrequency () {
    return this.lfo.frequency
  }

  // Allows an external controller to get a reference to this LFOs amount.
  get lfoInputAmount () {
    return this.lfoGain.gain
  }

  set rate (val) {
    this._frequency = val
    if (val) {
      this.updateRate(val)
    }
  }

  updateRate (val) {
    this.lfo.frequency.value = (val * val / 500) * this.freqMultiplier * 3
  }

  set amount (val) {
    this._value = val
    this.updateAmount()
  }

  updateAmount () {
    this.lfoGain.gain.value = this._value * this.multiplier
  }

  set shape (val) {
    this._shape = val
    this.updateShape(val)
  }

  updateShape (shape) {
    switch (shape) {
      case 'r':
        shape = 'random'
        break
      case 'w':
        shape = 'sawtooth'
        break
      case 's':
        shape = 'square'
        break
      case 't':
        shape = 'triangle'
        break
    }

    if (shape === 'random') {
      let waveData = this.generateRandomShape()
      this.lfo.setPeriodicWave(waveData)
      this.freqMultiplier = 0.01
      this.updateRate(this._frequency)
    } else if (shape === 'square') {
      let waveData = this.generateSquareShape()
      this.lfo.setPeriodicWave(waveData)
      this.freqMultiplier = 1
      this.updateRate(this._frequency)
    } else if (shape === 'sawtooth') {
      let waveData = this.generateSawtoothShape()
      this.lfo.setPeriodicWave(waveData)
      this.freqMultiplier = 1
      this.updateRate(this._frequency)
    } else {
      // We use the default triangle shape only right now.
      this.lfo.type = shape
      this.freqMultiplier = 1
      this.updateRate(this._frequency)
    }
  }

  generateSquareShape () {
    let real = new Float32Array(Coefficients.square.real)
    let imag = new Float32Array(Coefficients.square.imag)
    return this.audioContext.createPeriodicWave(real, imag)
  }

  generateSawtoothShape () {
    let real = new Float32Array(Coefficients.sawtooth.real)
    let imag = new Float32Array(Coefficients.sawtooth.imag)
    return this.audioContext.createPeriodicWave(real, imag)
  }

  generateRandomShape () {
    let real = new Float32Array(Coefficients.noise.real)
    let imag = new Float32Array(Coefficients.noise.imag)
    return this.audioContext.createPeriodicWave(real, imag)
  }
}

// might be better than default triangle ?  :
// let waveData = [0, 1]

// console.log('smooth sq', waveData)
// let real = new Float32Array(waveData)
// let imag = new Float32Array(waveData.length)
// waveData = this.audioContext.createPeriodicWave(real, imag)
// return waveData
