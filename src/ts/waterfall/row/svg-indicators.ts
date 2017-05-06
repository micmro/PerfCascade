import { pluralize } from "../../helpers/misc";
import {
  Icon,
  WaterfallEntry,
} from "../../typing/waterfall";

/**
 * Convinience helper to create a new `Icon`
 *
 * _Width of icons is fixed_
 */
export function makeIcon(type: string, title: string): Icon {
  return { "type": type, "title": title, "width": 20 };
}

/**
 * Gets the Indicators in Icon format
 * @param  {WaterfallEntry} entry
 * @returns {Icon[]}
 */
export function getIndicatorIcons(entry: WaterfallEntry): Icon[] {
  const indicators = entry.responseDetails.indicators;
  if (indicators.length === 0) {
    return [];
  }

  const combinedTitle = [];
  let icon = "";
  const errors = indicators.filter((i) => i.type === "error");
  const warnings = indicators.filter((i) => i.type === "warning");
  const info = indicators.filter((i) => i.type !== "error" && i.type !== "warning");

  if (errors.length > 0) {
    combinedTitle.push(pluralize("Error", errors.length) + ":\n " + errors.map((e) => e.title).join("\n"));
    icon = "error";
  }
  if (warnings.length > 0) {
    combinedTitle.push(pluralize("Warning", warnings.length) + ":\n" + warnings.map((w) => w.title).join("\n"));
    icon = icon || "warning";
  }
  if (info.length > 0) {
    combinedTitle.push(`Info:\n${info.map((i) => i.title).join("\n")}`);
    if (!icon && info.length === 1) {
      icon = info[0].icon || info[0].type;
    } else {
      icon = icon || "info";
    }
  }

  return [makeIcon(icon, combinedTitle.join("\n"))];
}
