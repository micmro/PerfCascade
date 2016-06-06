import {RectData} from "../../typing/rect-data.d"
import {ChartOptions} from "../../typing/options"
import TimeBlock from "../../typing/time-block"

import * as svg from "../../helpers/svg"
import * as icons from "../../helpers/icons"
import * as misc from "../../helpers/misc"
import * as heuristics from "../../helpers/heuristics"
import * as rowSubComponents from "./svg-row-subcomponents"
import * as indicators from "./svg-indicators"

//initial clip path
let clipPathElProto = svg.newEl("clipPath", {
  "id": "titleClipPath"
}) as SVGClipPathElement
clipPathElProto.appendChild(svg.newEl("rect", {
  "width": "100%",
  "height": "100%"
}))



//Creates single reques's row
export function createRow(index: number, rectData: RectData, block: TimeBlock,
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
    //304 == Not Modified, so not an issue
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

  let rect = rowSubComponents.createRect(rectData, block.segments, block.total)
  let shortLabel = rowSubComponents.createRequestLabelClipped(labelXPos, y,
    misc.ressourceUrlFormater(block.name, 40), rowHeight, "clipPath")
  let fullLabel = rowSubComponents.createRequestLabelFull(labelXPos, y, block.name, rowHeight)

  let rowName = rowSubComponents.createNameRowBg(y, rowHeight, onDetailsOverlayShow, leftColumnWith)
  let rowBar = rowSubComponents.createRowBg(y, rowHeight, onDetailsOverlayShow)
  let bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0))

  //create and attach request block
  rowBar.appendChild(rect)

  if (options.showIndicatorIcons) {
    //Create and add warnings for potential issues
    indicators.getIndicators(block, docIsSsl).forEach((value: indicators.Indicator) => {
      rowName.appendChild(icons[value.type](value.x, y + 3, value.title))
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
