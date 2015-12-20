import waterfall from "./helpers/waterfall"

import {Har,
  Page,
  PageTimings,
  Creator,
  NameValueObj,
  Cookie,
  Request,
  Content,
  Response,
  Entry
} from "./typing/har"

import dom from './helpers/dom'
import TimeBlock from './typing/time-block'
import HarTransformer from './transformers/har'

function showErrorMsg(msg){
  alert(msg)
}

let outputHolder = document.getElementById("output")

function onFileInput(evt) {
  let files = evt.target.files 
  if(!files) {
    showErrorMsg("Failed to load HAR file") 
    return
  }

  let reader = new FileReader()
  reader.onload = (e => {
    let harData
    try {
      //TODO: add proper check for HAR file and later other formats
      harData = JSON.parse(e.target["result"])
    } catch (e) {
      showErrorMsg("File does not seem to be a valid HAR file")
      return undefined
    }
    renderHar(harData.log)
  })
  reader.readAsText(files[0])
}
document.getElementById('fileinput').addEventListener('change', onFileInput, false)

function renderHar(logData: Har){
  var data = HarTransformer.transfrom(logData)
  var x = waterfall.setupTimeLine(data)

  dom.removeAllChildren(outputHolder)
  outputHolder.appendChild(x)
  console.log(x)
}



//Dev/Test only - load test file TODO: remove
window["fetch"]("test-data/www.google.co.kr.har").then(f => f.json().then(j => renderHar(j.log)))

console.log(waterfall)