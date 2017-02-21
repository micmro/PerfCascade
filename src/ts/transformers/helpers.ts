/** Helpers that are not file-fromat specific */
import { escapeHtml } from "../helpers/parse";
import { RequestType } from "../typing/waterfall";
import { KvTuple } from "./extract-details-keys";

/** render a dl */
export function makeDefinitionList(dlKeyValues: KvTuple[], addClass: boolean = false) {
  let makeClass = (key: string) => {
    if (!addClass) {
      return "";
    }
    let className = key.toLowerCase().replace(/[^a-z-]/g, "");
    return `class="${className || "no-colour"}"`;
  };
  return dlKeyValues
    .filter((tuple: KvTuple) => tuple[1] !== undefined)
    .map((tuple) => `
      <dt ${makeClass(tuple[0])}>${tuple[0]}</dt>
      <dd>${escapeHtml(tuple[1])}</dd>
    `).join("");
}

/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType - a HTTP headers mime-type
 */
export function mimeToRequestType(mimeType: string): RequestType {
  if (mimeType === undefined) {
    return "other";
  }
  let types = mimeType.split("/");
  let part2 = types[1];
  // take care of text/css; charset=UTF-8 etc
  if (part2 !== undefined) {
    part2 = part2.indexOf(";") > -1 ? part2.split(";")[0] : part2;
  }
  switch (types[0]) {
    case "image": {
      if (part2 === "svg+xml") {
        return "svg";
      }
      return "image";
    }
    case "font": return "font";
    case "video": return "video";
    case "audio": return "audio";
    default: break;
  }
  switch (part2) {
    case "xml":
    case "html": return "html";
    case "plain": return "plain";
    case "css": return "css";
    case "vnd.ms-fontobject":
    case "font-woff":
    case "font-woff2":
    case "x-font-truetype":
    case "x-font-opentype":
    case "x-font-woff": return "font";
    case "javascript":
    case "x-javascript":
    case "script":
    case "json": return "javascript";
    case "x-shockwave-flash": return "flash";
    default: return "other";
  }
}
