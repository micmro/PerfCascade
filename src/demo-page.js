/**
* functionality for example page
* `perfCascade` is a global object if not running in AMD or CommonJS context (it uses UMD)
*/
(function (perfCascade) {

  /** holder DOM element to render PerfCascade into */
  var outputHolder = document.getElementsByClassName("output")[0];
  /** Select box for multi-page HARs */
  var pageSelectorEl = document.getElementById("page-selector");
  /** Holder element for legend HTML */
  var legendHolderEl = document.getElementById("legend-holder");

  /** options for PerfCascade (all have defaults)
   * Source: /src/ts/typing/options.d.ts
  */
  var perfCascadeOptions = {
    rowHeight: 23, //default: 23
    showAlignmentHelpers: true, //default: true
    showIndicatorIcons: true, //default: true
    leftColumnWith: 25, //default: 25
    pageSelector: pageSelectorEl, //default: undefined
    legendHolder: legendHolderEl //default: undefined (hide-legend)
  };

  /** renders the har (passing in the har.log node) */
  function renderPerfCascadeChart(harLogData) {
    /** remove all children of `outputHolder`,
     * so you can upload new HAR files and get a new SVG  */
    while (outputHolder.childNodes.length > 0) {
      outputHolder.removeChild(outputHolder.childNodes[0]);
    }

    /**
     * THIS IS WHERE THE MAGIC HAPPENS
     * pass HAR and options to `newPerfCascadeHar` to generate the SVG element
     */
    var perfCascadeSvg = perfCascade.fromHar(harLogData, perfCascadeOptions);

    /** append SVG to page - that's it */
    outputHolder.appendChild(perfCascadeSvg);
  }

  /** handle client side file upload */
  function onFileSubmit(evt) {
    var files = evt.target.files;
    if (!files) {
      alert("Failed to load HAR file");
      return
    }

    // USE THIS when not supporting compressed *.zhar files
    // var reader = new FileReader();
    // reader.onload = function(loadEvt){
    //   var harData
    //   try {
    //     harData = JSON.parse(loadEvt.target["result"]);
    //   } catch (err) {
    //     alert("File does not seem to be a valid HAR file");
    //     console.error(err)
    //     return undefined
    //   }
    //   renderPerfCascadeChart(harData.log);
    // };
    // reader.readAsText(files[0]);

    // Just needed for gzipped *.zhar files, you can use the standard FileReader api for normal .har files
    perfCascadeFileReader.readFile(files[0], evt.target.value, function(error, data){
      if(error){
        console.error(error)
      }else{
        renderPerfCascadeChart(data)
      }
    });
  }
  document.getElementById("fileinput").addEventListener("change", onFileSubmit, false);



  /** functionality for "use example HAR" */
  function getExampleHar() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./src/github.com_chrome.har", true);
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        renderPerfCascadeChart(response);
      }
    })
    xhr.send();
  }
  document.getElementById("use-example").addEventListener("click", getExampleHar, false);

})(window.perfCascade);
