# Wavetable Synth

Web audio synthesizer using wavetable synthesis.  Features 3 oscillators, LFO, chorus, glide, and an arpeggiator!  Suitable for retro-synth music productions.

![screenshot of synth](https://github.com/looshi/wavetable-synth-2/blob/main/images/wavetable-screenshot.png)


## Install and run:
```sh
git clone https://github.com/looshi/wavetable-synth-2.git
npm install
npm run dev
# Navigate to http://localhost:9000
```

## How to play
Play the keyboard keys to trigger notes, or click on the piano keys at the bottom of the screen.  Turn the arpeggiator ON and play a couple of notes to make sequences.  The arpeggiator will play all notes from the last 5 seconds and loop them.  Adjust the arpeggiator tempo at the top of the screen to slow down or speed up your sequence.

## About Wavetable Synthesis
Wavetable synthesis refers to the technique of interpolating from one array of samples ( a "table" ), to another over time. This technique made it possible for digital synthesizers of the 1980s to generate complex and evolving sounds using very little processing power and memory.

One of the first wavetable synthesizers was the PPG Wave https://en.wikipedia.org/wiki/PPG_Wave used by many bands at the time such Depeche Mode.

The storage of each table is a small memory footprint, and the interpolation algorithms are simple arithmetic, however combining different tables over time allows for a very complex sound.

## How this synth was built
This uses the web audio api for mixing and effects.  The sound generation itself is done by looping short sample of wavetables, this wavetable data collected from various internet sources and stored as json data.

This data is loaded and fed to an oscillator, these oscillators are then combined with each other using interplolation.  The combination is an interpolation from one table to the next, if you increase the "cycles" slide you can hear the sound changing over time due to this interpolation done here: https://github.com/looshi/wavetable-synth-2/blob/e3a89d6a932a86288366989e3f1ab2c53c855918/src/data/Reducers.js#L357

Three pairs of these wavetables are then mixed together and sent to an filter and amp envelope and LFOs provide further processing.

Most of the audio code is broken out here:
https://github.com/looshi/wavetable-synth-2/tree/main/src/audio
The rest of the codebase is mostly just UI.

One thing I like are the custom wave shapes for the LFO, this data was found on the internet ( forget where, sorry ) and stored here as json:
https://github.com/looshi/wavetable-synth-2/blob/main/src/data/Coefficients.js

So rather than use the perfect saw, square, sine of web audio api these custom LFO shapes will deviate slightly.  If you slow down the square shape LFO you can hear this effect -- it slopes slightly versus being a binary on/off change.
https://github.com/looshi/wavetable-synth-2/blob/main/src/audio/LFO.js#L123


