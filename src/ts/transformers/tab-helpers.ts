import { escapeHtml } from "../helpers/parse";
import { KvTuple } from "./extract-details-keys";

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
