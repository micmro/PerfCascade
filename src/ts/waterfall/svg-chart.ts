import * as svg from "../helpers/svg";
import { requestTypeToCssClass } from "../transformers/styling-converters";
import { Context } from "../typing/context";
import { ChartRenderOption } from "../typing/options";
import { RectData } from "../typing/rect-data";
import { HoverEvtListeners } from "../typing/svg-alignment-helpers";
import { Mark } from "../typing/waterfall";
import { WaterfallData, WaterfallEntry } from "../typing/waterfall";
import OverlayManager from "./details-overlay/overlay-manager";
import { PubSub } from "./details-overlay/pub-sub";
import * as row from "./row/svg-row";
import * as alignmentHelper from "./sub-components/svg-alignment-helper";
import * as generalComponents from "./sub-components/svg-general-components";
import * as marks from "./sub-components/svg-marks";

/**
 * Get a string that's as wide, or wider than any number from 0-n.
 * @param {number} n the highest number that should fit within the returned string's width.
 * @returns {string}
 */
function getWidestDigitString(n: number): string {
  const numDigits = Math.floor((Math.log(n) / Math.LN10)) + 1;
  let s = "";
  for (let i = 0; i < numDigits; i++) {
    // No number should take more horizontal space than "0" does.
    s += "0";
  }
  return s;
}

/**
 * Calculate the height of the SVG chart in px
 * @param {Mark[]}       marks      [description]
 * @param  {number} diagramHeight
 * @returns Number
 */
function getSvgHeight(marks: Mark[], diagramHeight: number): number {
  const maxMarkTextLength = marks.reduce((currMax: number, currValue: Mark) => {
    const attributes = { x: 0, y: 0 };
    return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, attributes), true));
  }, 0);

  return Math.floor(diagramHeight + maxMarkTextLength + 35);
}

/**
 * Intitializes the context object
 * @param {WaterfallData} data - Object containing the setup parameter
 * @param {ChartOptions} options - Chart config/customization options
 * @param {WaterfallEntry[]} entriesToShow - Filtered array of entries that will be rendered
 * @return {Context} Context object
 */
function createContext(data: WaterfallData, options: ChartRenderOption,
                       entriesToShow: WaterfallEntry[]): Context {
  const unit = data.durationMs / 100;
  const diagramHeight = (entriesToShow.length + 1) * options.rowHeight;
  const context = {
    diagramHeight,
    overlayManager: undefined,
    pubSub : new PubSub(),
    unit,
    options,
  };
  // `overlayManager` needs the `context` reference, so it's attached later
  context.overlayManager = new OverlayManager(context);

  return context;
}

/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data - Object containing the setup parameter
 * @param {ChartOptions} options - Chart config/customization options
 * @return {SVGSVGElement} - SVG Element ready to render
 */
export function createWaterfallSvg(data: WaterfallData, options: ChartRenderOption): SVGSVGElement {
  // constants
  const entriesToShow = data.entries
    .filter((entry) => (typeof entry.start === "number" && typeof entry.total === "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0));

  /** Holder of request-details overlay */
  const overlayHolder = svg.newG("overlays");

  /** Holds all rows */
  const rowHolder = svg.newG("rows-holder");

  const context = createContext(data, options, entriesToShow);

  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, context.diagramHeight);

  /** Main SVG Element that holds all data */
  const timeLineHolder = svg.newSvg("water-fall-chart", {
    height: chartHolderHeight,
  });

  /** Holder for scale, event and marks */
  const scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
    width: `${100 - options.leftColumnWith}%`,
    x: `${options.leftColumnWith}%`,
  });

  /** Holder for on-hover vertical comparison bars */
  let hoverOverlayHolder: SVGGElement;
  let mouseListeners: HoverEvtListeners;
  if (options.showAlignmentHelpers) {
    hoverOverlayHolder = svg.newG("hover-overlays");
    const hoverEl = alignmentHelper.createAlignmentLines(context.diagramHeight);
    hoverOverlayHolder.appendChild(hoverEl.startline);
    hoverOverlayHolder.appendChild(hoverEl.endline);
    mouseListeners = alignmentHelper.makeHoverEvtListeners(hoverEl);
  }

  // Start appending SVG elements to the holder element (timeLineHolder)

  scaleAndMarksHolder.appendChild(generalComponents.createTimeScale(context, data.durationMs));
  scaleAndMarksHolder.appendChild(marks.createMarks(context, data.marks));

  // This assumes all icons (mime and indicators) have the same width
  const perIconWidth = entriesToShow[0].responseDetails.icon.width;

  let maxIcons = 0;

  if (options.showMimeTypeIcon) {
    maxIcons += 1;
  }

  if (options.showIndicatorIcons) {
    const iconsPerBlock = entriesToShow.map((entry: WaterfallEntry) =>
      entry.responseDetails.indicators.length > 0 ? 1 : 0);
    maxIcons += Math.max.apply(null, iconsPerBlock);
  }

  const maxIconsWidth = maxIcons * perIconWidth;

  const widestRequestNumber = getWidestDigitString(entriesToShow.length);
  const maxNumberWidth = svg.getNodeTextWidth(svg.newTextEl(`${widestRequestNumber}`), true);

  const rowItems: SVGAElement[] = [];

  function getChartHeight(): number {
    return chartHolderHeight + context.overlayManager.getCombinedOverlayHeight();
  }

  context.pubSub.subscribeToOverlayChanges(() => {
    const newHeight = getChartHeight();
    timeLineHolder.classList.toggle("closing", newHeight < timeLineHolder.clientHeight);
    timeLineHolder.style.height = `${newHeight}px`;
  });

  /** Renders single row and hooks up behaviour */
  function renderRow(entry: WaterfallEntry, i: number) {
    const entryWidth = entry.total || 1;
    const y = options.rowHeight * i;
    const x = (entry.start || 0.001);
    const detailsHeight = 450;
    const rectData = {
      cssClass: requestTypeToCssClass(entry.responseDetails.requestType),
      height: options.rowHeight,
      hideOverlay: options.showAlignmentHelpers ? mouseListeners.onMouseLeavePartial : undefined,
      label: `${entry.url} (${Math.round(entry.start)}ms - ` +
        `${Math.round(entry.end)}ms | total: ${Math.round(entry.total)}ms)`,
      showOverlay: options.showAlignmentHelpers ? mouseListeners.onMouseEnterPartial : undefined,
      unit: context.unit,
      width: entryWidth,
      x,
      y,
    } as RectData;

    const showDetailsOverlay = () => {
      context.overlayManager.toggleOverlay(i, y + options.rowHeight, detailsHeight, entry, rowItems);
    };

    const rowItem = row.createRow(context, i, maxIconsWidth, maxNumberWidth, rectData, entry, showDetailsOverlay);

    rowItems.push(rowItem);
    rowHolder.appendChild(rowItem);
    rowHolder.appendChild(svg.newG("row-overlay-holder"));
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
