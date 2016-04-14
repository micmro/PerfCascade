import TimeBlock from "../typing/time-block"
import {RectData} from "../typing/rect-data"
import svg from "../helpers/svg"
import icons from "../helpers/icons"
import misc from "../helpers/misc"
import {
  createRect,
  createRequestLabelFull,
  createRequestLabelClipped,
  appendRequestLabels,
  createBgStripe,
  createFixedRow,
  createFlexRow
} from "./svg-row-subcomponents"
import {
Indicator,
getIndicators
} from "./svg-indicators"


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
  labelXPos: number, leftFixedWidthPerc: number, docIsSsl: boolean,
  onDetailsOverlayShow: EventListener): SVGGElement {

  const y = rectData.y
  const requestBarHeight = rectData.height

  let rowItem = svg.newG("row-item")
  let leftFixedHolder = svg.newSvg("left-fixed-holder", {
    "x": "0",
    "width": `${leftFixedWidthPerc}%`
  })
  let flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
    "x": `${leftFixedWidthPerc}%`,
    "width": `${100 - leftFixedWidthPerc}%`
  })

  let rect = createRect(rectData, block.segments)
  let shortLabel = createRequestLabelClipped(labelXPos, y, misc.ressourceUrlFormater(block.name), requestBarHeight, "clipPath")
  let fullLabel = createRequestLabelFull(labelXPos, y, block.name, requestBarHeight)

  let rowFixed = createFixedRow(y, requestBarHeight, onDetailsOverlayShow, leftFixedWidthPerc)
  let rowFlex = createFlexRow(y, requestBarHeight, onDetailsOverlayShow)
  let bgStripe = createBgStripe(y, requestBarHeight, (index % 2 === 0))

  //create and attach request block
  rowFlex.appendChild(rect)

  //Add create and add warnings
  getIndicators(block, docIsSsl).forEach((value: Indicator) => {
    rowFixed.appendChild(icons[value.type](value.x, y + 3, value.title))
  })

  //Add create and add warnings
  getIndicators(block, docIsSsl).forEach((value: Indicator) => {
    rowFixed.appendChild(icons[value.type](value.x, y + 3, value.title))
  })
  appendRequestLabels(rowFixed, shortLabel, fullLabel)

  flexScaleHolder.appendChild(rowFlex)
  leftFixedHolder.appendChild(clipPathElProto.cloneNode(true))
  leftFixedHolder.appendChild(rowFixed)

  rowItem.appendChild(bgStripe)
  rowItem.appendChild(flexScaleHolder)
  rowItem.appendChild(leftFixedHolder)

  return rowItem
}
