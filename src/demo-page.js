/**
* functionality for example page
* `perfCascade` is a global object if not running in AMD or CommonJS context (it uses UMD)
*/
(function (perfCascade) {

  /** holder DOM element to render PerfCascade into */
  var outputHolder = document.getElementById("output")

  /** options for PerfCascade (all have defaults)
   * Source: /src/ts/typing/options.d.ts
  */
  var perfCascadeOptions = {
    rowHeight: 23, //default: 23
    showAlignmentHelpers: true, //default: true
    showIndicatorIcons: true, //default: true
    leftColumnWith: 25 //default: 25
  }

  /**
   * THIS IS WHERE THE MAGIC HAPPENS
   */
  function renderPerfCascadeChart(harData) {
    /** remove all children of `outputHolder`,
     * so you can upload new HAR files and get a new SVG  */
    while (outputHolder.childNodes.length > 0) {
      outputHolder.removeChild(outputHolder.childNodes[0])
    }

    /**
     * THIS IS WHERE THE MAGIC HAPPENS
     * pass HAR and options to `newPerfCascadeHar` to generate the SVG element
     */
    var perfCascadeSvg = perfCascade.fromHar(harData.log, perfCascadeOptions)

    /** append SVG to page - that's it */
    outputHolder.appendChild(perfCascadeSvg)
  }

  /** handle client side file upload */
  function onFileSubmit(evt) {
    var files = evt.target.files
    if (!files) {
      alert("Failed to load HAR file")
      return
    }

    var reader = new FileReader()

    /** try to parse the file once uploaded to browser */
    reader.onload = (e => {
      var harData
      try {
        harData = JSON.parse(e.target["result"])
      } catch (e) {
        alert("File does not seem to be a valid HAR file")
        return undefined
      }
      renderPerfCascadeChart(harData)
    })

    /** start reading the file */
    reader.readAsText(files[0])
  }
  document.getElementById("fileinput").addEventListener("change", onFileSubmit, false)



  /** functionality for "use example HAR" */
  function getExampleHar() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./src/github.com.prep.har", true);
    xhr.addEventListener("readystatechange", function(){
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        renderPerfCascadeChart(response)
      }
    })
    xhr.send();
  }
  document.getElementById("use-example").addEventListener("click", getExampleHar, false);

})(window.perfCascade)
