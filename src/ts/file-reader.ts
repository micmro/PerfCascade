declare var zip: any

// use zip
zip.useWebWorkers = false

/** handle client side file upload */
export function readFile(file: File, fileName: string, callback: Function) {
  if (!file) {
    return callback(new Error("Failed to load HAR file"))
  }

  function parseJson(rawData) {
    try {
      let harData = JSON.parse(rawData)
      callback(null, harData.log)
    } catch (e) {
      callback(e)
    }
  }

  /** start reading the file */
  let extension = fileName.match(/\.[0-9a-z]+$/i)[0]
  if ([".zhar", ".zip"].indexOf(extension) !== -1) {
    /** zhar */
    zip.createReader(new zip.BlobReader(file), (zipReader) => {
      zipReader.getEntries((x) => {
        x[0].getData(new zip.TextWriter(), (txt) => {
          parseJson(txt)
          // close the zip reader
          zipReader.close()
        }, (progress: number) => {
          console.log(`unzip progress: ${progress / 100}%`)
        })
      })
    })
  } else {

    let reader = new FileReader()

    /** try to parse the file once uploaded to browser */
    reader.addEventListener("load", (e: any) => {
      parseJson(e.target.result)
    })

    reader.readAsText(file)
  }
}
