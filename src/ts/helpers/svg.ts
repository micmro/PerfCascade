/**
 *  SVG Helpers
 */

export type StringToStringOrNumberMap = {[key: string]: string|number};
export type DomAttributeMap = StringToStringOrNumberMap;
export type CssStyleMap = StringToStringOrNumberMap;

function entries(obj: StringToStringOrNumberMap): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  for (let k of Object.keys(obj)) {
    entries.push([k, String((obj[k]))]);
  }
  return entries;
}

function safeSetAttribute(el: SVGElement, key: string, s: string) {
  if (!(key in el)) {
    console.warn(new Error(`Trying to set non-existing attribute ${key} = ${s} on a <${el.tagName.toLowerCase()}>.`));
  }
  el.setAttributeNS(null, key, s);
}

interface StylableSVGElement extends SVGElement, SVGStylable {
}

function safeSetStyle(el: StylableSVGElement, key: string, s: string) {
  if (key in el.style) {
    el.style[key] = s;
  } else {
    console.warn(new Error(`Trying to set non-existing style ${key} = ${s} on a <${el.tagName.toLowerCase()}>.`));
  }
}

interface SvgElementOptions {
  attributes?: DomAttributeMap;
  css?: CssStyleMap;
  text?: string;
  className?: string;
}

function newElement<T extends StylableSVGElement>(tagName: string,
                                                  {
                                                    attributes = {},
                                                    css = {},
                                                    text = "",
                                                    className = "",
                                                  }: SvgElementOptions = {}): T {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName) as T;
  if (className) {
    addClass(element, className);
  }
  if (text) {
    element.textContent = text;
  }
  entries(css).forEach(([key, value]) => safeSetStyle(element, key, value));
  entries(attributes).forEach(([key, value]) => safeSetAttribute(element, key, value));

  return element;
}

export function newSvg(className: string, attributes: DomAttributeMap, css: CssStyleMap = {}): SVGSVGElement {
  return newElement<SVGSVGElement>("svg:svg", {className, attributes, css});
}

export function newG(className: string, attributes: DomAttributeMap = {}, css: CssStyleMap = {}): SVGGElement {
  return newElement<SVGGElement>("g", {className, attributes, css});
}

export function newClipPath(id: string): SVGClipPathElement {
  const attributes = {id};
  return newElement<SVGClipPathElement>("clipPath", {attributes});
}

export function newForeignObject(attributes: DomAttributeMap): SVGForeignObjectElement {
  return newElement<SVGForeignObjectElement>("foreignObject", {attributes});
}

export function newA(className: string): SVGAElement {
  return newElement<SVGAElement>("a", {className});
}

export function newRect(attributes: DomAttributeMap, className: string = "", css: CssStyleMap = {}): SVGRectElement {
  return newElement<SVGRectElement>("rect", {attributes, className, css});
}

export function newLine(attributes: DomAttributeMap, className: string = ""): SVGLineElement {
  return newElement<SVGLineElement>("line", {className, attributes});
}

export function newTitle(text: string): SVGTitleElement {
  return newElement<SVGTitleElement>("title", {text});
}

export function newTextEl(text: string, attributes: DomAttributeMap = {},
                          css: CssStyleMap = {}): SVGTextElement {
  return newElement<SVGTextElement>("text", {text, attributes, css});
}

/** temp SVG element for size measurements  */
let getTestSVGEl = (() => {
  /** Reference to Temp SVG element for size measurements */
  let svgTestEl: SVGSVGElement;
  let removeSvgTestElTimeout;

  return () => {
    // lazy init svgTestEl
    if (svgTestEl === undefined) {
      const attributes = {
        "className": "water-fall-chart temp",
        "width": "9999px",
      };
      const css = {
        "left": "0px",
        "position": "absolute",
        "top": "0px",
        "visibility": "hidden",
        "z-index": "99999",
      };
      svgTestEl = newSvg("water-fall-chart temp", attributes, css);
    }

    // needs access to body to measure size
    // TODO: refactor for server side use
    if (svgTestEl.parentElement === undefined ) {
      window.document.body.appendChild(svgTestEl);
    }

    // debounced time-deleayed cleanup, so the element can be re-used in tight loops
    clearTimeout(removeSvgTestElTimeout);
    removeSvgTestElTimeout = setTimeout(() => {
      svgTestEl.parentNode.removeChild(svgTestEl);
    }, 1000);

    return svgTestEl;
  };
})();

/**
 * Measure the width of a SVGTextElement in px
 * @param  {SVGTextElement} textNode
 * @param  {boolean=false} skipClone - do not clone `textNode` and use original
 * @returns number
 */
export function getNodeTextWidth(textNode: SVGTextElement, skipClone: boolean = false): number {
  let tmp = getTestSVGEl();
  let tmpTextNode;
  if (skipClone) {
    tmpTextNode = textNode;
  } else {
    tmpTextNode = textNode.cloneNode(false) as SVGTextElement;
  }
  tmp.appendChild(tmpTextNode);
  // make sure to turn of shadow for performance
  tmpTextNode.style.textShadow = "0";
  window.document.body.appendChild(tmp);
  return tmpTextNode.getBBox().width;
}

/**
 * Adds class `className` to `el`
 * @param  {SVGElement|HTMLElement} el
 * @param  {string} className
 */
export function addClass<T extends SVGElement | HTMLElement>(el: T, className: string): T {
  const classList = el.classList;
  if (classList) {
    className.split(" ").forEach((c) => classList.add(c));
  } else {
    // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class") + " " + className);
  }
  return el;
}

/**
 * Removes class `className` from `el`
 * @param  {SVGElement|HTMLElement} el
 * @param  {string} className
 */
export function removeClass<T extends SVGElement | HTMLElement>(el: T, className: string): T {
  const classList = el.classList;
  if (classList) {
    classList.remove(className);
  } else {
    // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class")
      .replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
  }
  return el;
}

/**
 * Removes all child DOM nodes from `el`
 * @param  {SVGElement|HTMLElement} el
 */
export function removeChildren<T extends SVGElement | HTMLElement>(el: T): T {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
  return el;
}
