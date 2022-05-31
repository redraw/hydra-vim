const html = require('choo/html')
const Component = require('choo/component')
const HydraSynth = require('hydra-synth')
const P5  = require('./../lib/p5-wrapper.js')
const PatchBay = require('./../lib/patch-bay/pb-live.js')



module.exports = class Hydra extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.hydra = this // hacky
    this.emit = emit
  }

  load (element) {
    const params = new URLSearchParams(window.location.search)

    let isIOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;
  let precisionValue = isIOS ? 'highp' : 'mediump'

    const pb = new PatchBay()

    let canvas

    if (params.get("popup")) {
      const popup = window.open("","hydra",`width=500,height=300`);
      popup.document.body.style = "background: black; margin: 0"
      canvas = popup.document.createElement("canvas")
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style = "imageRendering:pixelated; width:100%;height:100%"
      popup.document.body.innerHTML = ""
      popup.document.body.appendChild(canvas)
    } else {
      canvas = document.querySelector("canvas")
    }

    const hydra = new HydraSynth({ pb: pb, detectAudio: true, canvas: canvas, precision: precisionValue})
    // console.log(hydra)
    this.hydra = hydra
     osc().out()

    pb.init(hydra.captureStream, {
      server: "https://hydra.ojack.xyz",
      room: 'iclc'
    })

    window.P5 = P5
    window.pb = pb
    this.emit('hydra loaded')
  }

  update (center) {
    return false
  }

  createElement ({ width = window.innerWidth, height = window.innerHeight} = {}) {

    return html`<div style="width:100%;height:100%;">
        <canvas class="bg-black" style="imageRendering:pixelated; width:100%;height:100%" width="${width}" height="${height}"></canvas></div>`
  }
}
