import * as svg from "../helpers/svg";
import {baseCssClassName} from "../state/global-static-settings";
import {requestTypeToCssClass} from "../transformers/styling-converters";
import {ChartOptions} from "../typing/options";
import {RectData} from "../typing/rect-data";
import {HoverEvtListeners} from "../typing/svg-alignment-helpers";
import {Mark} from "../typing/waterfall";
import {WaterfallData, WaterfallEntry} from "../typing/waterfall";
import * as overlayChangesPubSub from "./details-overlay/overlay-changes-pub-sub";
import * as overlayManager from "./details-overlay/svg-details-overlay-manager";
import * as indicators from "./row/svg-indicators";
import * as row from "./row/svg-row";
import * as alignmentHelper from  "./sub-components/svg-alignment-helper";
import * as generalComponents from "./sub-components/svg-general-components";
import * as marks from  "./sub-components/svg-marks";

/**
 * Calculate the height of the SVG chart in px
 * @param {Mark[]}       marks      [description]
 * @param  {number} diagramHeight
 * @returns Number
 */
function getSvgHeight(marks: Mark[], diagramHeight: number): number {
  const maxMarkTextLength = marks.reduce((currMax: number, currValue: Mark) => {
    const attributes = {x: 0, y: 0};
    return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, attributes), true));
  }, 0);

  return Math.floor(diagramHeight + maxMarkTextLength + 35);
}

/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data  Object containing the setup parameter
 * @param {ChartOptions} options
 * @return {SVGSVGElement}            SVG Element ready to render
 */
export function createWaterfallSvg(data: WaterfallData, options: ChartOptions): SVGSVGElement {
  // constants

  /** horizontal unit (duration in ms of 1%) */
  const unit: number = data.durationMs / 100;
  const entriesToShow = data.entries
    .filter((entry) => (typeof entry.start === "number" && typeof entry.total === "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0));
  const docIsSsl = (data.entries[0].name.indexOf("https://") === 0);
  /** height of the requests part of the diagram in px */
  const diagramHeight = (entriesToShow.length + 1) * options.rowHeight;
  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, diagramHeight);
  /** random generated `id` used to identify overlay updates */
  const overlayId = "overlay-" + (Math.random() * 100000000).toFixed(0);

  /** Main SVG Element that holds all data */
  let timeLineHolder = svg.newSvg(baseCssClassName, {
    "height": chartHolderHeight,
  });

  /** Holder of request-details overlay */
  let overlayHolder = svg.newG("overlays", {
    "id": overlayId,
  });
  /** Holder for scale, event and marks */
  let scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
    "width": `${100 - options.leftColumnWith}%`,
    "x": `${options.leftColumnWith}%`,
  });
  /** Holds all rows */
  let rowHolder = svg.newG("rows-holder");

  /** Holder for on-hover vertical comparison bars */
  let hoverOverlayHolder: SVGGElement;
  let mouseListeners: HoverEvtListeners;
  if (options.showAlignmentHelpers) {
    hoverOverlayHolder = svg.newG("hover-overlays");
    let hoverEl = alignmentHelper.createAlignmentLines(diagramHeight);
    hoverOverlayHolder.appendChild(hoverEl.startline);
    hoverOverlayHolder.appendChild(hoverEl.endline);
    mouseListeners = alignmentHelper.makeHoverEvtListeners(hoverEl);
  }

  // Start appending SVG elements to the holder element (timeLineHolder)

  scaleAndMarksHolder.appendChild(generalComponents.createTimeScale(data.durationMs, diagramHeight));
  scaleAndMarksHolder.appendChild(marks.createMarks(data.marks, unit, diagramHeight));

  data.lines.forEach((entry) => {
    timeLineHolder.appendChild(generalComponents.createBgRect(entry, unit, diagramHeight));
  });

  let labelXPos = 5;

  // This assumes all icons (mime and indicators) have the same width
  const iconWidth = indicators.getMimeTypeIcon(entriesToShow[0]).width;

  if (options.showMimeTypeIcon) {
    labelXPos += iconWidth;
  }

  if (options.showIndicatorIcons) {
    const iconsPerBlock = entriesToShow.map((entry: WaterfallEntry) =>
      indicators.getIndicatorIcons(entry, docIsSsl).length);
    labelXPos += iconWidth * Math.max.apply(null, iconsPerBlock);
  }

  let barEls: SVGGElement[] = [];

  function getChartHeight(overlayHolderId: string): string {
    return (chartHolderHeight + overlayManager.getCombinedOverlayHeight(overlayHolderId)).toString() + "px";
  }
  overlayChangesPubSub.subscribeToOverlayChanges((e) => {
    if (e.overlayHolderId !== overlayId) {
      return;
    }
    timeLineHolder.style.height = getChartHeight(e.overlayHolderId);
  });

  /** Renders single row and hooks up behaviour */
  function renderRow(entry: WaterfallEntry, i: number) {
    const entryWidth = entry.total || 1;
    const y = options.rowHeight * i;
    const x = (entry.start || 0.001);
    const accordionHeight = 450;
    const rectData = {
      "cssClass": requestTypeToCssClass(entry.requestType),
      "height": options.rowHeight,
      "hideOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseLeavePartial : undefined,
      "label": entry.name + " (" + entry.start + "ms - " + entry.end + "ms | total: " + entry.total + "ms)",
      "showOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseEnterPartial : undefined,
      "unit": unit,
      "width": entryWidth,
      "x": x,
      "y": y,
    } as RectData;

    let showDetailsOverlay = () => {
      overlayManager.openOverlay(i, y + options.rowHeight, accordionHeight, entry, overlayHolder, barEls);
    };

    let rowItem = row.createRow(i, rectData, entry, labelXPos,
      options, docIsSsl, showDetailsOverlay);

    barEls.push(rowItem);
    rowHolder.appendChild(rowItem);
  }

  // Main loop to render rows with blocks
  entriesToShow.forEach(renderRow);

  if (options.showAlignmentHelpers) {
    scaleAndMarksHolder.appendChild(hoverOverlayHolder);
  }
  timeLineHolder.appendChild(scaleAndMarksHolder);
  timeLineHolder.appendChild(rowHolder);
  timeLineHolder.appendChild(overlayHolder);

  return timeLineHolder;
}
