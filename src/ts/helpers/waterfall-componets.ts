/**
 * Creation of sub-components of the waterfall chart
 */

import svg from "../helpers/svg"
import dom from "../helpers/dom"
import TimeBlock from "../typing/time-block"

/**
 * Interface for `createRect` parameter
 */
export interface RectData {
	width: number
	height: number
	x: number
	y: number
	cssClass: string
	label?: string
	unit: number
	onRectMouseEnter: EventListener
	onRectMouseLeave: EventListener
}



/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {Array<TimeBlock>} segments Request and Timing Data
 * @return {SVGElement}             Renerated SVG
 */
export function createRect(rectData: RectData, segments?: Array<TimeBlock>): SVGElement {
	let rectHolder
	let rect = svg.newEl("rect", {
        width: (rectData.width / rectData.unit) + "%",
        height: rectData.height - 1,
        x: Math.round((rectData.x / rectData.unit) * 100) / 100 + "%",
        y: rectData.y,
        class: ((segments && segments.length > 0 ? "time-block" : "segment")) + " " + (rectData.cssClass || "block-other")
	})
	if (rectData.label) {
        rect.appendChild(svg.newEl("title", {
			text: rectData.label
        })) // Add tile to wedge path
	}

	rect.addEventListener("mouseenter", rectData.onRectMouseEnter)
	rect.addEventListener("mouseleave", rectData.onRectMouseLeave)

	if (segments && segments.length > 0) {
        rectHolder = svg.newEl("g")
        rectHolder.appendChild(rect)
        segments.forEach((segment) => {
			if (segment.total > 0 && typeof segment.start === "number") {
				let childRectData = {
					width: segment.total,
					height: 8,
					x: segment.start || 0.001,
					y: rectData.y,
					cssClass: segment.cssClass,
					label: segment.name + " (" + Math.round(segment.start) + "ms - " + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
					unit: rectData.unit,
					onRectMouseEnter: rectData.onRectMouseEnter,
					onRectMouseLeave: rectData.onRectMouseLeave
				}
				rectHolder.appendChild(createRect(childRectData))
			}
        })
        return rectHolder
	} else {
        return rect
	}
}



/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 */
export function createTimeWrapper(durationMs: number, diagramHeight: number) {
    var timeHolder = svg.newEl("g", { class: "time-scale full-width" })
    for (let i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
		var lineLabel = svg.newTextEl(i + "sec", diagramHeight)
		if (i > secs - 0.2) {
			lineLabel.setAttribute("x", secPerc * i - 0.5 + "%")
			lineLabel.setAttribute("text-anchor", "end")
		} else {
			lineLabel.setAttribute("x", secPerc * i + 0.5 + "%")
		}

		var lineEl = svg.newEl("line", {
			x1: secPerc * i + "%",
			y1: "0",
			x2: secPerc * i + "%",
			y2: diagramHeight
		})
		timeHolder.appendChild(lineEl)
		timeHolder.appendChild(lineLabel)
    }
    return timeHolder
}



//TODO: Implement - data for this not parsed yet
export function createBgRect(block: TimeBlock, unit: number, diagramHeight: number) {
	let rect = svg.newEl("rect", {
        width: ((block.total || 1) / unit) + "%",
        height: diagramHeight,
        x: ((block.start || 0.001) / unit) + "%",
        y: 0,
        class: block.cssClass || "block-other"
	})

	rect.appendChild(svg.newEl("title", {
        text: block.name
	})) // Add tile to wedge path
	return rect
}



//TODO: Implement - data for this not parsed yet
export function renderMarks(marks: Array<any>, unit: number, diagramHeight: number) {
    var marksHolder = svg.newEl("g", {
		transform: "scale(1, 1)",
		class: "marker-holder"
    })

    marks.forEach((mark, i) => {
		var x = mark.startTime / unit
		var markHolder = svg.newEl("g", {
			class: "mark-holder"
		})
		var lineHolder = svg.newEl("g", {
			class: "line-holder"
		})
		var lineLableHolder = svg.newEl("g", {
			class: "line-lable-holder",
			x: x + "%"
		})
		mark.x = x
		var lineLabel = svg.newTextEl(mark.name, diagramHeight + 25)
		//lineLabel.setAttribute("writing-mode", "tb")
		lineLabel.setAttribute("x", x + "%")
		lineLabel.setAttribute("stroke", "")


		lineHolder.appendChild(svg.newEl("line", {
			x1: x + "%",
			y1: 0,
			x2: x + "%",
			y2: diagramHeight
		}))

		if (marks[i - 1] && mark.x - marks[i - 1].x < 1) {
			lineLabel.setAttribute("x", marks[i - 1].x + 1 + "%")
			mark.x = marks[i - 1].x + 1
		}

		//would use polyline but can't use percentage for points 
		lineHolder.appendChild(svg.newEl("line", {
			x1: x + "%",
			y1: diagramHeight,
			x2: mark.x + "%",
			y2: diagramHeight + 23
		}))

		var isActive = false
		var onLableMouseEnter = function(evt) {
			if (!isActive) {
				isActive = true
				dom.addClass(lineHolder, "active")
				//firefox has issues with this
				markHolder.parentNode.appendChild(markHolder)
			}
		}

		var onLableMouseLeave = function(evt) {
			isActive = false
			dom.removeClass(lineHolder, "active")
		}

		lineLabel.addEventListener("mouseenter", onLableMouseEnter)
		lineLabel.addEventListener("mouseleave", onLableMouseLeave)
		lineLableHolder.appendChild(lineLabel)

		markHolder.appendChild(svg.newEl("title", {
			text: mark.name + " (" + Math.round(mark.startTime) + "ms)",
		}))
		markHolder.appendChild(lineHolder)
		marksHolder.appendChild(markHolder)
		markHolder.appendChild(lineLableHolder)
    })

    return marksHolder
}