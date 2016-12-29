/**
 *  SVG Helpers
 */

export function newEl(tagName: string, settings?: Object, css?: Object): SVGElement {
  let el = document.createElementNS("http://www.w3.org/2000/svg", tagName) as SVGGElement
  settings = settings || {}
  for (let attr in settings) {
    if (attr !== "text") {
      el.setAttributeNS(null, attr, settings[attr])
    }
  }
  el.textContent = settings["text"] || ""
  if (css && el.style) {
    Object.keys(css).forEach(key => {
      el.style[key] = css[key]
    })
  }
  return el
}


export function newSvg(cssClass: string, settings?: Object, css?: Object): SVGSVGElement {
  settings = settings || {}
  settings["class"] = cssClass
  return newEl("svg:svg", settings, css) as SVGSVGElement
}


export function newG(cssClass: string, settings?: Object, css?: Object): SVGGElement {
  settings = settings || {}
  settings["class"] = cssClass
  return newEl("g", settings, css) as SVGGElement
}


export function newRect(settings: Object): SVGRectElement {
  return newEl("rect", settings) as SVGRectElement
}


export function newLine(settings: Object): SVGLineElement {
  return newEl("line", settings) as SVGLineElement
}


export function newTitle(text: string): SVGTitleElement {
  return newEl("title", {text}) as SVGTitleElement
}


export function newTextEl(text: string, x: number|string, y: number, settings?: Object, css?: Object): SVGTextElement {
  css = css || {}
  settings = settings || {}
  settings["fill"] = "#111"
  settings["x"] = x.toString()
  settings["y"] = y.toString()
  settings["text"] = text
  return newEl("text", settings, css) as SVGTextElement
}



/** temp SVG element for size measurements  */
let getTestSVGEl = (() => {
  /** Reference to Temp SVG element for size measurements */
  let svgTestEl: SVGSVGElement
  let removeSvgTestElTimeout

  return function getTestSVGElInner(): SVGSVGElement {
    // lazy init svgTestEl
    if (svgTestEl === undefined) {
      svgTestEl = newEl("svg:svg", {
        "className": "water-fall-chart temp",
        "width": "9999px"
      }, {
        "visibility": "hidden",
        "position": "absoulte",
        "top": "0px",
        "left": "0px",
        "z-index": "99999"
      }) as SVGSVGElement
    }

    //needs access to body to measure size
    //TODO: refactor for server side use
    if (svgTestEl.parentElement === undefined ) {
      window.document.body.appendChild(svgTestEl)
    }

    //debounced time-deleayed cleanup, so the element can be re-used in tight loops
    clearTimeout(removeSvgTestElTimeout)
    removeSvgTestElTimeout = setTimeout(() => {
      svgTestEl.parentNode.removeChild(svgTestEl)
    }, 1000)

    return svgTestEl
  }
})()

/**
 * Measure the width of a SVGTextElement in px
 * @param  {SVGTextElement} textNode
 * @param  {boolean=false} skipClone - do not clone `textNode` and use original
 * @returns number
 */
export function getNodeTextWidth(textNode: SVGTextElement, skipClone: boolean = false): number {
  let tmp = getTestSVGEl()
  let tmpTextNode
  if (skipClone) {
    tmpTextNode = textNode
  } else {
    tmpTextNode = textNode.cloneNode(false) as SVGTextElement
  }
  tmp.appendChild(tmpTextNode)
  //make sure to turn of shadow for performance
  tmpTextNode.style.textShadow = "0"
  window.document.body.appendChild(tmp)
  const nodeWidth = tmpTextNode.getBBox().width
  return nodeWidth
}


/**
 * Adds class `className` to `el`
 * @param  {SVGElement} el
 * @param  {string} className
 */
export function addClass(el: SVGElement, className: string) {
  if (el.classList) {
    el.classList.add(className)
  } else {
    // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class") + " " + className)
  }
  return el
}

/**
 * Removes class `className` from `el`
 * @param  {SVGElement} el
 * @param  {string} className
 */
export function removeClass(el: SVGElement, className: string) {
  if (el.classList) {
    el.classList.remove(className)
  } else {
    //IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"))
  }
  return el
}
