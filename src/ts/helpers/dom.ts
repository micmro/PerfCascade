/**
 *  DOM Helpers
 */

let dom = {
  removeAllChildren: function(el: HTMLElement | SVGElement){
    while (el.childNodes.length > 0) {
      el.removeChild(el.childNodes[0])
    }
  },
  forEach: function(els: NodeListOf<Element>, fn: (el: Element, index: number) => any){
    Array.prototype.forEach.call(els, fn)
  },
  filter: function(els: NodeListOf<Element>, predicat: (el: Element, index: number) => boolean): NodeListOf<Element>{
    return Array.prototype.filter.call(els, predicat)
  }
}

export default dom
