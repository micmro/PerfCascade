/**
 *  SVG Helpers
 */

export type DomAttributeMap = {[key: string]: string|number}
export type CssStyleMap = {[key: string]: string|number}

function newEl(tagName: string, settings: DomAttributeMap = {}, css: CssStyleMap = {}): SVGElement {
  let el = document.createElementNS("http://www.w3.org/2000/svg", tagName) as SVGGElement
  for (let attr in settings) {
    if (attr !== "text") {
      el.setAttributeNS(null, attr, String(settings[attr]))
    }
  }
  el.textContent = String(settings["text"] || "")
  if (css && el.style) {
    Object.keys(css).forEach((key) => {
      el.style[key] = css[key]
    })
  }
  return el
}

export function newSvg(cssClass: string, attributes: DomAttributeMap = {}, css: CssStyleMap = {}): SVGSVGElement {
  attributes["class"] = cssClass
  return newEl("svg:svg", attributes, css) as SVGSVGElement
}

export function newG(cssClass: string, attributes: DomAttributeMap = {}, css: CssStyleMap = {}): SVGGElement {
  attributes["class"] = cssClass
  return newEl("g", attributes, css) as SVGGElement
}

export function newClipPath(id: string): SVGClipPathElement {
  return newEl("clipPath", {id}) as SVGClipPathElement
}

export function newForeignObject(attributes: DomAttributeMap): SVGForeignObjectElement {
  return newEl("foreignObject", attributes) as SVGForeignObjectElement
}

export function newA(className: string): SVGAElement {
  return newEl("a", {"class": className}) as SVGAElement
}

export function newRect(attributes: DomAttributeMap): SVGRectElement {
  return newEl("rect", attributes) as SVGRectElement
}

export function newLine(attributes: DomAttributeMap): SVGLineElement {
  return newEl("line", attributes) as SVGLineElement
}

export function newTitle(text: string): SVGTitleElement {
  return newEl("title", {text}) as SVGTitleElement
}

export function newTextEl(text: string, x: number|string, y: number, attributes: DomAttributeMap = {},
                          css: CssStyleMap = {}): SVGTextElement {
  attributes["fill"] = "#111"
  attributes["x"] = x.toString()
  attributes["y"] = y.toString()
  attributes["text"] = text
  return newEl("text", attributes, css) as SVGTextElement
}

/** temp SVG element for size measurements  */
let getTestSVGEl = (() => {
  /** Reference to Temp SVG element for size measurements */
  let svgTestEl: SVGSVGElement
  let removeSvgTestElTimeout

  return () => {
    // lazy init svgTestEl
    if (svgTestEl === undefined) {
      svgTestEl = newEl("svg:svg", {
        "className": "water-fall-chart temp",
        "width": "9999px"
      }, {
        "visibility": "hidden",
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "z-index": "99999"
      }) as SVGSVGElement
    }

    // needs access to body to measure size
    // TODO: refactor for server side use
    if (svgTestEl.parentElement === undefined ) {
      window.document.body.appendChild(svgTestEl)
    }

    // debounced time-deleayed cleanup, so the element can be re-used in tight loops
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
  // make sure to turn of shadow for performance
  tmpTextNode.style.textShadow = "0"
  window.document.body.appendChild(tmp)
  return tmpTextNode.getBBox().width
}

/**
 * Adds class `className` to `el`
 * @param  {SVGElement} el
 * @param  {string} className
 */
export function addClass(el: SVGElement, className: string) {
  const classList = el.classList;
  if (classList) {
    className.split(" ").forEach((c) => classList.add(c))
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
  const classList = el.classList;
  if (classList) {
    classList.remove(className)
  } else {
    // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"))
  }
  return el
}
