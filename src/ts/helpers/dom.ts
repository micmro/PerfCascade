/**
 *  DOM Helpers
 */


export function removeAllChildren(el: HTMLElement | SVGElement) {
  while (el.childNodes.length > 0) {
    el.removeChild(el.childNodes[0])
  }
}

export function forEach(els: NodeListOf<Element>, fn: (el: Element, index: number) => any) {
  Array.prototype.forEach.call(els, fn)
}

export function filter(els: NodeListOf<Element>, predicat: (el: Element, index: number) => boolean): NodeListOf<Element> {
  return Array.prototype.filter.call(els, predicat)
}
