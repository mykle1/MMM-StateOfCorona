## MMM-StateOfCorona

* U.S. State statics for Corona Virus. Rotation includes counties, cases and deaths.

* Choose a U.S. State.
* Total state cases of Corona Virus
* Cases by county rotation
* Deaths by county

## Examples

![](images/1.png)

## Installation

* `git clone https://github.com/mykle1/MMM-StateOfCorona` into the `~/MagicMirror/modules` directory.

* cd MMM-StateOfCorona

* 'npm install'

* Annotated .css file included for your convenience.

## Config.js entry and options
```
{
disabled: false,
module: 'MMM-StateOfCorona',
position: 'middle center',
config: {
  state: "New York",                // Choose a U.S. state
  apiKey: "Your api key goes here", // Get your api key at https://rapidapi.com/
  useHeader: false,                 // False if you don't want a header
  header: "",                       // Any text you want. useHeader must be true
  animationSpeed: 0,                // fade speed
  rotateInterval: 30 * 1000,        // switch to next county in rotation
        }
},
```

## Special thanks to cowboysdude for continuous support and wizardry

* Why can't I loop an object? ;-)
