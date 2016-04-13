import {createWaterfallSvg} from "./waterfall/svg-chart"
import {Har} from "./typing/har"
import dom from "./helpers/dom"
import HarTransformer from "./transformers/har"


function showErrorMsg(msg) {
  alert(msg)
}

const outputHolder = document.getElementById("output")

function renderHar(logData: Har) {
  const data = HarTransformer.transfrom(logData)
  dom.removeAllChildren(outputHolder)
  outputHolder.appendChild(createWaterfallSvg(data, 23))
}

function onFileSubmit(evt) {
  let files = evt.target.files
  if (!files) {
    showErrorMsg("Failed to load HAR file")
    return
  }

  let reader = new FileReader()
  reader.onload = (e => {
    let harData
    try {
      //TODO: add proper check for HAR files and later other formats
      harData = JSON.parse(e.target["result"])
    } catch (e) {
      showErrorMsg("File does not seem to be a valid HAR file")
      return undefined
    }
    renderHar(harData.log)
  })
  reader.readAsText(files[0])
}

document.getElementById("fileinput").addEventListener("change", onFileSubmit, false)





// TEMP: create public and renderHar
if (window["define"] === undefined) {
  window["perfCascade"] = {
    renderHar : renderHar,
    createWaterfallSvg: createWaterfallSvg
  }
}
export default {
  renderHar : renderHar,
  createWaterfallSvg: createWaterfallSvg
}
