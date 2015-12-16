import waterfall from "./helpers/waterfall.js";


function showErrorMsg(msg){
  alert(msg);
}

var harHolder = document.getElementById(output)

function onFileInput(evt) {
  var files = evt.target.files; 
  if(!files) {
    showErrorMsg("Failed to load HAR file"); 
    return;
  }

  var reader = new FileReader();
  reader.onload = (e => {
    var harData;
    try {
      //TODO: add proper check for HAR file
      harData = JSON.parse(e.target.result);
    } catch (e) {
      showErrorMsg("File does not seem to be a valid HAR file")
      return undefined;
    }
    renderHar(harData.log);
  });
  reader.readAsText(files[0]);
}
document.getElementById('fileinput').addEventListener('change', onFileInput, false);


function renderHar(logData){
  console.log("HAR created by %s(%s) of %s page(s)", logData.creator.name, logData.creator.version, logData.pages.length)
  console.log(logData.entries)
  console.table(logData.entries)
  console.log(logData)
}



//Dev/Test only - load test file
fetch("test-data/www.google.co.kr.har").then(f => f.json().then(j => renderHar(j.log)))

console.log(waterfall)