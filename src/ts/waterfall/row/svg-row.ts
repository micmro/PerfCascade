import * as icons from "../../helpers/icons";
import * as misc from "../../helpers/misc";
import * as svg from "../../helpers/svg";
import { Context } from "../../typing/context";
import { RectData } from "../../typing/rect-data";
import { WaterfallEntry } from "../../typing/waterfall";
import { getIndicatorIcons } from "./svg-indicators";
import * as rowSubComponents from "./svg-row-subcomponents";

// initial clip path
const clipPathElProto = svg.newClipPath("titleClipPath");
clipPathElProto.appendChild(svg.newRect({
  "height": "100%",
  "width": "100%",
}));

const ROW_LEFT_MARGIN = 3;

// Create row for a single request
export function createRow(context: Context, index: number,
                          maxIconsWidth: number, maxNumberWidth: number,
                          rectData: RectData, entry: WaterfallEntry,
                          onDetailsOverlayShow: EventListener): SVGGElement {

  const y = rectData.y;
  const rowHeight = rectData.height;
  const leftColumnWith = context.options.leftColumnWith;
  let rowItem = svg.newG(entry.responseDetails.rowClass);
  let leftFixedHolder = svg.newSvg("left-fixed-holder", {
    "width": `${leftColumnWith}%`,
    "x": "0",
  });
  let flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
    "width": `${100 - leftColumnWith}%`,
    "x": `${leftColumnWith}%`,
  });

  let rect = rowSubComponents.createRect(rectData, entry.segments, entry.total);
  let rowName = rowSubComponents.createNameRowBg(y, rowHeight, onDetailsOverlayShow);
  let rowBar = rowSubComponents.createRowBg(y, rowHeight, onDetailsOverlayShow);
  let bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0));

  let x = ROW_LEFT_MARGIN + maxIconsWidth;

  if (context.options.showMimeTypeIcon) {
    const icon = entry.responseDetails.icon;
    x -= icon.width;
    rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
  }

  if (context.options.showIndicatorIcons) {
    // Create and add warnings for potentia;l issues
    getIndicatorIcons(entry).forEach((icon) => {
      x -= icon.width;
      rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
    });
  }

  // Jump to the largest offset of all rows
  x = ROW_LEFT_MARGIN + maxIconsWidth;

  let requestNumber = `${index + 1}`;

  const requestNumberLabel = rowSubComponents.createRequestNumberLabel(x, y, requestNumber, rowHeight, maxNumberWidth);
  // 4 is slightly bigger than the hover "glow" around the url
  x += maxNumberWidth + 4;
  let shortLabel = rowSubComponents.createRequestLabelClipped(x, y, misc.resourceUrlFormatter(entry.url, 40),
    rowHeight);
  let fullLabel = rowSubComponents.createRequestLabelFull(x, y, entry.url, rowHeight);

  // create and attach request block
  rowBar.appendChild(rect);

  rowSubComponents.appendRequestLabels(rowName, requestNumberLabel, shortLabel, fullLabel);

  flexScaleHolder.appendChild(rowBar);
  leftFixedHolder.appendChild(clipPathElProto.cloneNode(true));
  leftFixedHolder.appendChild(rowName);

  rowItem.appendChild(bgStripe);
  rowItem.appendChild(flexScaleHolder);
  rowItem.appendChild(leftFixedHolder);

  return rowItem;
}
