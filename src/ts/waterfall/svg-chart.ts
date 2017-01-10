import * as svg from "../helpers/svg";
import {baseCssClassName} from "../state/global-static-settings";
import {requestTypeToCssClass} from "../transformers/styling-converters";
import {Context} from "../typing/context";
import {ChartOptions} from "../typing/options";
import {RectData} from "../typing/rect-data";
import {HoverEvtListeners} from "../typing/svg-alignment-helpers";
import {Mark} from "../typing/waterfall";
import {WaterfallData, WaterfallEntry} from "../typing/waterfall";
import PubSub from "./details-overlay/overlay-changes-pub-sub";
import OverlayManager from "./details-overlay/svg-details-overlay-manager";
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
 * Intitializes the context object
 * @param {WaterfallData} data - Object containing the setup parameter
 * @param {ChartOptions} options - Chart config/customization options
 * @param {WaterfallEntry[]} entriesToShow - Filtered array of entries that will be rendered
 * @return {Context} Context object
 */
function createContext(data: WaterfallData, options: ChartOptions,
                       entriesToShow: WaterfallEntry[], overlayHolder: SVGGElement): Context {
  const unit = data.durationMs / 100;
  const diagramHeight = (entriesToShow.length + 1) * options.rowHeight;
  const docIsSsl = (data.entries[0].name.indexOf("https://") === 0);

  let context = {
    diagramHeight,
    overlayManager: undefined,
    pubSub : new PubSub(),
    unit,
    options,
    docIsSsl,
  };
  // `overlayManager` needs the `context` reference, so it's attached later
  context.overlayManager = new OverlayManager(context, overlayHolder);

  return context;
}

/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data - Object containing the setup parameter
 * @param {ChartOptions} options - Chart config/customization options
 * @return {SVGSVGElement} - SVG Element ready to render
 */
export function createWaterfallSvg(data: WaterfallData, options: ChartOptions): SVGSVGElement {
  // constants
  const entriesToShow = data.entries
    .filter((entry) => (typeof entry.start === "number" && typeof entry.total === "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0));

  /** Holder of request-details overlay */
  let overlayHolder = svg.newG("overlays");

  const context = createContext(data, options, entriesToShow, overlayHolder);

  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, context.diagramHeight);

  /** Main SVG Element that holds all data */
  let timeLineHolder = svg.newSvg(baseCssClassName, {
    "height": chartHolderHeight,
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
    let hoverEl = alignmentHelper.createAlignmentLines(context.diagramHeight);
    hoverOverlayHolder.appendChild(hoverEl.startline);
    hoverOverlayHolder.appendChild(hoverEl.endline);
    mouseListeners = alignmentHelper.makeHoverEvtListeners(hoverEl);
  }

  // Start appending SVG elements to the holder element (timeLineHolder)

  scaleAndMarksHolder.appendChild(generalComponents.createTimeScale(context, data.durationMs));
  scaleAndMarksHolder.appendChild(marks.createMarks(context, data.marks));

  data.lines.forEach((entry) => {
    timeLineHolder.appendChild(generalComponents.createBgRect(context, entry));
  });

  let labelXPos = 5;

  // This assumes all icons (mime and indicators) have the same width
  const iconWidth = indicators.getMimeTypeIcon(entriesToShow[0]).width;

  if (options.showMimeTypeIcon) {
    labelXPos += iconWidth;
  }

  if (options.showIndicatorIcons) {
    const iconsPerBlock = entriesToShow.map((entry: WaterfallEntry) =>
      indicators.getIndicatorIcons(entry, context.docIsSsl).length);
    labelXPos += iconWidth * Math.max.apply(null, iconsPerBlock);
  }

  let barEls: SVGGElement[] = [];

  function getChartHeight(): string {
    return (chartHolderHeight + context.overlayManager.getCombinedOverlayHeight()).toString() + "px";
  }
  context.pubSub.subscribeToOverlayChanges(() => {
    timeLineHolder.style.height = getChartHeight();
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
      "unit": context.unit,
      "width": entryWidth,
      "x": x,
      "y": y,
    } as RectData;

    let showDetailsOverlay = () => {
      context.overlayManager.openOverlay(i, y + options.rowHeight, accordionHeight, entry, barEls);
    };

    let rowItem = row.createRow(context, i, rectData, entry, labelXPos, showDetailsOverlay);

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
