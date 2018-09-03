import { Har } from "har-format";

// use zip
const getConfiguredZipJs = () => {
  const zip = window["zip"] || {};
  zip.useWebWorkers = false;
  return zip;
};

/** handle client side file upload */
export function readFile(file: File,
                         fileName: string,
                         callback: (e: Error | null, har?: Har) => void,
                         onProgress?: (progress: number) => void) {
  if (!file) {
    return callback(new Error("Failed to load HAR file"));
  }

  function parseJson(rawData) {
    try {
      const harData = JSON.parse(rawData);
      callback(null, harData.log);
    } catch (e) {
      callback(e);
    }
  }

  /** start reading the file */
  const extension = (fileName.match(/\.[0-9a-z]+$/i) || [])[0];
  const zip = getConfiguredZipJs();

  if ([".zhar", ".zip"].indexOf(extension) !== -1) {
    /** zhar */
    zip.createReader(new zip.BlobReader(file), (zipReader) => {
      zipReader.getEntries((x) => {
        x[0].getData(new zip.TextWriter(), (txt) => {
          parseJson(txt);
          // close the zip reader
          zipReader.close();
        }, onProgress);
      });
    });
  } else {

    const reader = new FileReader();

    /** try to parse the file once uploaded to browser */
    reader.addEventListener("load", (e: any) => {
      parseJson(e.target.result);
    });

    reader.readAsText(file);
  }
}
