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
} from "./interfaces/har"


function showErrorMsg(msg){
  alert(msg)
}



let harHolder = document.getElementById("output")

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
      //TODO: add proper check for HAR file
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
  console.log("HAR created by %s(%s) of %s page(s)", logData.creator.name, logData.creator.version, logData.pages.length)
  window["logData"] = logData

  //var page1 = 
  let blocks = []
  
  logData.entries.map((x) => {
    x.startedDateTime
    console.log(x)
    
    //name, start, end, cssClass, segments, rawResource
    // new waterfall.timeBlock(x.request.url, x.startedDateTime, x.response., cssClass, segments, rawResource)
    blocks.push(x.timings)
  })

  console.log(logData.entries)
  console["table"](logData.entries)
  console.log(logData)

  //durationMs, blocks, marks, lines, title
  // waterfall.setupTimeLine()
}



//Dev/Test only - load test file
// fetch("test-data/www.google.co.kr.har").then(f => f.json().then(j => renderHar(j.log)))

console.log(waterfall)