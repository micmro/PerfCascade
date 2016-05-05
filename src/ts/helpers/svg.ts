/**
 *  SVG Helpers
 */

export function newEl(tagName: string, settings?: Object, css?: Object): SVGElement {
  let el = document.createElementNS("http://www.w3.org/2000/svg", tagName) as SVGGElement;
  settings = settings || {};
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


export function newTextEl(text: string, y: number, x?: number | string, css?: Object): SVGTextElement {
  css = css || {}
  let opt = {
    fill: "#111",
    y: y.toString(),
    text: text
  }
  if (x !== undefined) {
    opt["x"] = x
  }
  if (css["textShadow"] === undefined) {
    css["textShadow"] = "0 0 4px #fff"
  }
  return newEl("text", opt, css) as SVGTextElement
}

//needs access to body to measure size
//TODO: refactor for server side use
export function getNodeTextWidth(textNode: SVGTextElement): number {
  let tmp = newEl("svg:svg", {}, {
    "visibility": "hidden"
  }) as SVGSVGElement
  tmp.appendChild(textNode)
  window.document.body.appendChild(tmp)

  const nodeWidth = textNode.getBBox().width
  tmp.parentNode.removeChild(tmp)
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
