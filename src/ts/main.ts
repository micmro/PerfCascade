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
  outputHolder.appendChild(createWaterfallSvg(data, (window.innerWidth > 920 ? 250 : 200), 23))
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



//TODO: remove Dev/Test only - load test file
if (location.host.indexOf("127.0.0.1") === 0) {
  //http://www.webpagetest.org/result/151226_X7_b43d35e592fab70e0ba012fe11a41020/
  window["fetch"]("test-data/github.com.MODIFIED.151226_X7_b43d35e592fab70e0ba012fe11a41020.har")
    .then(f => f.json().then(j => renderHar(j.log)))
}
