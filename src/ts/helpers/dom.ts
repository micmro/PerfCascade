/**
 *  DOM Helpers
 */

var dom = {
  removeAllChildren: function(el: HTMLElement | SVGElement){
    while(el.childNodes.length > 0){
      el.removeChild(el.childNodes[0])
    }
  }
}

export default dom