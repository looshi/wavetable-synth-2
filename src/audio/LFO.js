/*
LFO
useage :
let options = {
  rate: 1
  amount: 10
  shape: 'sine'
}
let lfo = new LFO(options)
lfo.connect(node.audioParam)
*/

export default class LFO {
  constructor (props) {
    this.name = props.name
    this.id = props.id

    this.min = props.min
    this.max = props.max
    this.destinations = props.destinations
    this.multiplier = 1

    this._value = 0
    this._shape = props.shape
    this.audioContext = props.audioContext

    this.init(props.rate, props.shape, props.amount)
  }

  init (rate, shape, amount) {
    this.lfo = this.audioContext.createOscillator()
    this.lfoGain = this.audioContext.createGain()
    this.lfo.start()
    this.lfo.connect(this.lfoGain)
    this.lfo.type = shape
    this.lfo.frequency.value = rate
    this.lfoGain.gain.value = amount
  }

  connect (destination, multiplier) {
    this.lfoGain.gain.value = this._value * multiplier
    this.multiplier = multiplier
    console.log('init lfo gain', this.lfoGain.gain.value)
    this.init(this.lfo.frequency.value, this._shape, this.lfoGain.gain.value)
    this.lfoGain.connect(destination)
    //this.updateAmount()
  }

  disconnect (destination) {
    this.lfoGain.disconnect()
  }

  set rate (val) {
    console.log('lfo rate', val)
    this.lfo.frequency.value = val
  }

  set amount (val) {
    this._value = val
    this.updateAmount()
  }

  updateAmount () {
    this.lfoGain.gain.value = this._value * this.multiplier
    console.log('lfo amount', this.lfoGain.gain.value)
  }

  set shape (val) {
    this._shape = val
    this.lfo.type = val
  }

}
