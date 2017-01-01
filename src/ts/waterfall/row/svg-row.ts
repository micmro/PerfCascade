import * as heuristics from "../../helpers/heuristics"
import * as icons from "../../helpers/icons"
import * as misc from "../../helpers/misc"
import * as svg from "../../helpers/svg"
import { ChartOptions } from "../../typing/options"
import { RectData } from "../../typing/rect-data"
import {WaterfallEntry} from "../../typing/waterfall";
import * as indicators from "./svg-indicators"
import * as rowSubComponents from "./svg-row-subcomponents"

// initial clip path
const clipPathElProto = svg.newClipPath("titleClipPath")
clipPathElProto.appendChild(svg.newRect({
  "width": "100%",
  "height": "100%"
}))

// Creates single reques's row
export function createRow(index: number, rectData: RectData, block: WaterfallEntry,
                          labelXPos: number, options: ChartOptions, docIsSsl: boolean,
                          onDetailsOverlayShow: EventListener): SVGGElement {

  const y = rectData.y
  const rowHeight = rectData.height
  const leftColumnWith = options.leftColumnWith

  let rowCssClass = ["row-item"]
  if (heuristics.isInStatusCodeRange(block.rawResource, 500, 599)) {
    rowCssClass.push("status5xx")
  }
  if (heuristics.isInStatusCodeRange(block.rawResource, 400, 499)) {
    rowCssClass.push("status4xx")
  } else if (block.rawResource.response.status !== 304 &&
    heuristics.isInStatusCodeRange(block.rawResource, 300, 399)) {
    // 304 == Not Modified, so not an issue
    rowCssClass.push("status3xx")
  }

  let rowItem = svg.newG(rowCssClass.join(" "))
  let leftFixedHolder = svg.newSvg("left-fixed-holder", {
    "x": "0",
    "width": `${leftColumnWith}%`
  })
  let flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
    "x": `${leftColumnWith}%`,
    "width": `${100 - leftColumnWith}%`
  })

  let requestNumber = `${index + 1}. `

  let rect = rowSubComponents.createRect(rectData, block.segments, block.total)
  let shortLabel = rowSubComponents.createRequestLabelClipped(labelXPos, y,
    requestNumber + misc.resourceUrlFormatter(block.name, 40), rowHeight)
  let fullLabel = rowSubComponents.createRequestLabelFull(labelXPos, y, requestNumber + block.name, rowHeight)

  let rowName = rowSubComponents.createNameRowBg(y, rowHeight, onDetailsOverlayShow)
  let rowBar = rowSubComponents.createRowBg(y, rowHeight, onDetailsOverlayShow)
  let bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0))

  // create and attach request block
  rowBar.appendChild(rect)

  let x = 3

  if (options.showMimeTypeIcon) {
    const icon = indicators.getMimeTypeIcon(block)
    rowName.appendChild(icons[icon.type](x, y + 3, icon.title))
    x += icon.width
  }

  if (options.showIndicatorIcons) {
    // Create and add warnings for potential issues
    indicators.getIndicatorIcons(block, docIsSsl).forEach((icon: indicators.Icon) => {
      rowName.appendChild(icons[icon.type](x, y + 3, icon.title))
      x += icon.width
    })
  }
  rowSubComponents.appendRequestLabels(rowName, shortLabel, fullLabel)

  flexScaleHolder.appendChild(rowBar)
  leftFixedHolder.appendChild(clipPathElProto.cloneNode(true))
  leftFixedHolder.appendChild(rowName)

  rowItem.appendChild(bgStripe)
  rowItem.appendChild(flexScaleHolder)
  rowItem.appendChild(leftFixedHolder)

  return rowItem
}
