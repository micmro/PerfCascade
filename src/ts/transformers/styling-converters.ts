/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType 
 */
export function mimeToRequestType(mimeType: string) {
  let types = mimeType.split("/");
  switch (types[0]) {
    case "image": return "image"
    case "font": return "font"
  }
  switch (types[1]) {
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
 * Convert a MIME type into a CSS class
 * @param {string} mimeType 
 */
export function mimeToCssClass(mimeType: string) {
  return "block-" + mimeToRequestType(mimeType)
}
