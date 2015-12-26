import {createWaterfallSvg} from "./waterfall/svg-chart"

import TimeBlock from './typing/time-block'
import {Har,
  Page,
  PageTimings,
  Creator,
  Cookie,
  Request,
  Content,
  Response,
  Entry
} from "./typing/har"
import dom from './helpers/dom'
import HarTransformer from './transformers/har'


function showErrorMsg(msg){
  alert(msg)
}


const outputHolder = document.getElementById("output")


function renderHar(logData: Har) {
  const data = HarTransformer.transfrom(logData)
  dom.removeAllChildren(outputHolder)
  outputHolder.appendChild(createWaterfallSvg(data))
}


function onFileSubmit(evt) {
  let files = evt.target.files 
  if(!files) {
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

document.getElementById('fileinput').addEventListener('change', onFileSubmit, false)



//TODO: remove Dev/Test only - load test file
window["fetch"]("test-data/www.bbc.com.har").then(f => f.json().then(j => renderHar(j.log)))
