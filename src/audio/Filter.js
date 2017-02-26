/*
Filter
Same API as biquadFilterNode.
Uses multiple instances of the filter for greater effect.
*/
import {limit} from '../helpers/helpers.js'
const FILTER_INSTANCES_COUNT = 10

export default class Filter {
  constructor (audioContext) {
    this.filters = []
    this._frequency = 200
    this.audioContext = audioContext

    for (var i = 0; i < FILTER_INSTANCES_COUNT; i++) {
      let biquadFilter = this.audioContext.createBiquadFilter()
      biquadFilter.type = 'lowpass'
      biquadFilter.frequency.value = this._frequency
      biquadFilter.gain.value = 0 // What does this do ?
      biquadFilter.Q.value = 50
      this.filters.push(biquadFilter)
      // Connect each filter to the previous.
      // The first filter acts as the main output.
      // input -> filter[n] -> filter[1] -> filter[0] -> output
      if (i > 0) {
        biquadFilter.connect(this.filters[i - 1])
      }
    }
    this.output = this.filters[0]
    this.input = this.filters[this.filters.length - 1]
  }

  set frequency (val) {
    this.filters.forEach((filter) => {
      filter.frequency.value = val
    })
  }

  set Q (val) {
    this.filters.forEach((filter) => {
      filter.Q.value = val / (FILTER_INSTANCES_COUNT * 3)
    })
  }

  cancelScheduledValues (now) {
    this.filters.forEach((filter) => {
      filter.frequency.cancelScheduledValues(now)
    })
  }

  setTargetAtTime (freq, start, end) {
    this.filters.forEach((filter, index) => {
      let offset = index * Math.random() * 10
      freq = limit(60, 20000, freq - offset)
      filter.frequency.setTargetAtTime(freq, start, end)
    })
  }

}
