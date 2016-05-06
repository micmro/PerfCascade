/**
 *  DOM Helpers
 */

/**
 * Remove all child nodes from `el`
 * @param  {HTMLElement|SVGElement} el
 */
export function removeAllChildren(el: HTMLElement | SVGElement) {
  while (el.childNodes.length > 0) {
    el.removeChild(el.childNodes[0])
  }
}

/**
 * Iterate over list of DOM elements
 * @param  {NodeListOf<Element>} els
 * @param  {(el:Element,index:number)=>any} fn
 */
export function forEach(els: NodeListOf<Element>, fn: (el: Element, index: number) => any) {
  Array.prototype.forEach.call(els, fn)
}

/**
 * Filter list of DOM elements
 *
 * @param  {NodeListOf<Element>} els
 * @param  {(el:Element,index:number)=>boolean} predicat
 * @returns NodeListOf
 */
export function filter(els: NodeListOf<Element>, predicat: (el: Element, index: number) => boolean): NodeListOf<Element> {
  return Array.prototype.filter.call(els, predicat)
}
