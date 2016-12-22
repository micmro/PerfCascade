import {RequestType, TimingType} from "../typing/waterfall";
/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType
 */
export function mimeToRequestType(mimeType: string): RequestType {
  if (mimeType === undefined) {
    return "other"
  }
  let types = mimeType.split("/")
  let part2 = types[1]
  // take care of text/css; charset=UTF-8 etc
  if (part2 !== undefined) {
    part2 = part2.indexOf(";") > -1 ? part2.split(";")[0] : part2
  }
  switch (types[0]) {
    case "image": return "image"
    case "font": return "font"
    case "video": return "video"
    case "audio": return "audio"
  }
  switch (part2) {
    case "svg+xml": return "svg"
    case "xml":
    case "html": return "html"
    case "plain": return "plain"
    case "css": return "css"
    case "vnd.ms-fontobject":
    case "font-woff":
    case "font-woff2":
    case "x-font-truetype":
    case "x-font-opentype":
    case "x-font-woff": return "font"
    case "javascript":
    case "x-javascript":
    case "script":
    case "json": return "javascript"
    case "x-shockwave-flash": return "flash"
  }
  return "other"
}

/**
 * Convert a RequestType into a CSS class
 * @param {RequestType} requestType
 */
export function requestTypeToCssClass(requestType: RequestType) {
  return "block-" + requestType
}

/**
 * Convert a TimingType into a CSS class
 * @param {TimingType} timingType
 */
export function timingTypeToCssClass(timingType: TimingType) {
  return "block-" + timingType
}
