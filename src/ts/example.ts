import perfCascade from "./main"
import {Har} from "./typing/har.d"
import * as dom  from "./helpers/dom"
import {ChartOptions} from "./typing/options.d"

function showErrorMsg(msg) {
  alert(msg)
}

const outputHolder = document.getElementById("output")

function renderHar(logData: Har) {
  dom.removeAllChildren(outputHolder)
  let options = {
    rowHeight: 23,
    showAlignmentHelpers : true,
    showIndicatorIcons: true,
    leftColumnWith: 25
  } as ChartOptions

  let perfCascadeSvg =  perfCascade.newPerfCascadeHar(logData, options)
  // const data = HarTransformer.transfrom(logData)
  outputHolder.appendChild(perfCascadeSvg)
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

if (location.host.indexOf("127.0.0.1") === 0) {
  //http://www.webpagetest.org/result/151226_X7_b43d35e592fab70e0ba012fe11a41020/
  window["fetch"]("test-data/github.com.MODIFIED.151226_X7_b43d35e592fab70e0ba012fe11a41020.har")
    .then(f => f.json().then(j => renderHar(j.log)))
}

document.getElementById("fileinput").addEventListener("change", onFileSubmit, false)
