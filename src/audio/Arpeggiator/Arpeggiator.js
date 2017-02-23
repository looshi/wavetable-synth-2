/*
Arpeggiator
This is an adapted version of the Metronome by Chris Wilson :
https://github.com/cwilso/metronome
*/
import TimerWorker from './TimerWorker.worker.js'

export default class Arpeggiator {
  constructor (options) {
    this.audioContext = options.audioContext
    this.filterEnvelopeOn = options.filterEnvelopeOn
    this.filterEnvelopeOff = options.filterEnvelopeOff
    this.ampEnvelopeOn = options.ampEnvelopeOn
    this.ampEnvelopeOff = options.ampEnvelopeOff

    this.isPlaying = false
    this.startTime = 0           // The start time of the entire sequence.
    this.current16thNote        // What note is currently last scheduled?
    this.tempo = 80.0          // tempo (in beats per minute)
    this.lookahead = 25.0       // How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1    // How far ahead to schedule audio (sec)
                                // This is calculated from lookahead, and overlaps
                                // with next interval (in case the timer is late)
    this.nextNoteTime = 0.0     // when the next note is due.
    this.noteResolution = 0     // 0 == 16th, 1 == 8th, 2 == quarter note

    // This should be equal to the Amp Filter sustain ?
    this.noteLength = 0.001      // length of 'beep' (in seconds)

    this.last16thNoteDrawn = -1 // the last 'box' we drew on the screen
    this.notesInQueue = []      // the notes that have been put into the web audio,
                                // and may or may not have played yet. {note, time}

    // The Web Worker used to fire timer messages
    this.timerWorker = new TimerWorker()
    this.timerWorker.onmessage = (e) => {
      if (e.data === 'tick') {
        this.scheduler()
      }
    }
    this.timerWorker.postMessage({ 'interval': this.lookahead })
  }

  nextNote () {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / this.tempo    // Notice this picks up the CURRENT
                                          // tempo value to calculate beat length.
    this.nextNoteTime += 0.25 * secondsPerBeat    // Add beat length to last beat time

    this.current16thNote++    // Advance the beat number, wrap to zero
    if (this.current16thNote === 16) {
      this.current16thNote = 0
    }
  }

  scheduleNote (beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    // this.notesInQueue.push({ note: beatNumber, time: time })

    if ((this.noteResolution === 1) && (beatNumber % 2)) return // we're not playing non-8th 16th notes
    if ((this.noteResolution === 2) && (beatNumber % 4)) return // we're not playing non-quarter 8th notes

    // // create an oscillator
    // var osc = this.audioContext.createOscillator()
    // osc.connect(this.audioContext.destination)
    // if (beatNumber % 16 === 0) {
    //   osc.frequency.value = 880.0
    // } else if (beatNumber % 4 === 0) {
    //   osc.frequency.value = 440.0
    // } else {
    //   osc.frequency.value = 220.0
    // }
    // osc.start(time)
    // osc.stop(time + this.noteLength)
    this.filterEnvelopeOn(time)
    this.filterEnvelopeOff(time + this.noteLength)
    this.ampEnvelopeOn(time)
    this.ampEnvelopeOff(time + this.noteLength)
  }

  scheduler () {
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime)
      this.nextNote()
    }
  }

  set isOn (val = false) {
    this.isPlaying = val

    if (this.isPlaying) { // start playing
      this.current16thNote = 0
      this.nextNoteTime = this.audioContext.currentTime
      this.timerWorker.postMessage('start')
    } else {
      this.timerWorker.postMessage('stop')
    }
  }

}
