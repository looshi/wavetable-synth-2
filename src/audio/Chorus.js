/*
Chorus effect.
  usage :
  let chorus = new Chorus()
  signal.connect(chorus.input)
  chorus.connect(output)
*/
export default class Chorus {
  constructor (audioContext) {
    this.gainNode = audioContext.createGain()
    this.gainNode.gain.value = 0.5

    // Left Channel
    this.leftChannel = audioContext.createStereoPanner()
    this.leftChannel.pan.value = -1
    this.delayNodeL = audioContext.createDelay()
    this.delayNodeL.delayTime.value = 0.05
    this.lfoL = audioContext.createOscillator()
    this.lfoGainL = audioContext.createGain()
    this.lfoL.start()
    this.lfoL.type = 'triangle'
    this.lfoL.frequency.value = 0.01
    this.lfoGainL.gain.value = 0.02
    this.lfoL.connect(this.lfoGainL)
    this.lfoGainL.connect(this.delayNodeL.delayTime)
    this.delayNodeL.connect(this.leftChannel)
    this.leftChannel.connect(this.gainNode)

    // Right Channel
    this.rightChannel = audioContext.createStereoPanner()
    this.rightChannel.pan.value = 1
    this.delayNodeR = audioContext.createDelay()
    this.delayNodeR.delayTime.value = 0.04
    this.lfoR = audioContext.createOscillator()
    this.lfoGainR = audioContext.createGain()
    this.lfoR.start()
    this.lfoR.type = 'triangle'
    this.lfoR.frequency.value = 0.02
    this.lfoGainR.gain.value = 0.03
    this.lfoR.connect(this.lfoGainR)
    this.lfoGainR.connect(this.delayNodeR.delayTime)
    this.delayNodeR.connect(this.rightChannel)
    this.rightChannel.connect(this.gainNode)

    this.inputLeft = this.delayNodeL
    this.inputRight = this.delayNodeR
  }
  connect (output) {
    this.gainNode.connect(output)
  }
  disconnect () {
    this.gainNode.disconnect()
  }

  set amount (val) {
    val = Number(val)
    if (!this.isNumeric(val)) return false
    this.gainNode.gain.value = val / 100
  }

  get amount () {
    return this.gainNode.gain.value * 100
  }

  set time (val) {
    val = Number(val)
    if (!this.isNumeric(val)) return false
    this.lfoL.frequency.value = (val / 1000) * 3
    this.lfoR.frequency.value = (val / 1000)
  }

  get time () {
    return this.gainNode.gain.value * 100
  }

  isNumeric (val) {
    if (typeof val !== 'number') {
      return false
    }
    if (isNaN(parseFloat(val))) {
      return false
    }

    return true
  }

}
