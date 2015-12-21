/**
 *  DOM Helpers
 */

var dom = {

  newTextNode: function(text): Node {
    return document.createTextNode(text)
  },

  //creat html tag
  newTag : function(tagName: string, settings?, css?): Node {
    settings = settings || {}
    var tag = document.createElement(tagName)
    for (var attr in settings) {
      if (attr != "text") {
        tag[attr] = settings[attr]
      }
    }
    if (settings.text) {
      tag.textContent = settings.text
    } else if (settings.childElement) {
      if (typeof settings.childElement === "object") {
        //if childNodes NodeList is passed in
        if (settings.childElement instanceof NodeList) {
          //NodeList is does not inherit from array
          Array.prototype.slice.call(settings.childElement, 0).forEach((childNode) => {
            tag.appendChild(childNode)
          })
        } else {
          tag.appendChild(settings.childElement)
        }
      } else {
        tag.appendChild(dom.newTextNode(settings.childElement))
      }
    }
    if (settings.class) {
      tag.className = settings.class
    }
    tag.style.cssText = css || ""
    return tag
  },


  tableFactory : function(id = "", headerBuilder: Function, rowBuilder: Function) {
    var tableHolder = dom.newTag("div", {
      id: id,
      class: "table-holder"
    })
    var table = dom.newTag("table")
    var thead = dom.newTag("thead")

    thead.appendChild(headerBuilder(dom.newTag("tr")))
    table.appendChild(thead)
    table.appendChild(rowBuilder(dom.newTag("tbody")))
    tableHolder.appendChild(table)
    return tableHolder
  },


  combineNodes: function(a: Node | String, b: Node | String) {
    var wrapper = document.createElement("div")
    if (typeof a === "object") {
      wrapper.appendChild(a as Node)
    } else if (typeof a === "string") {
      wrapper.appendChild(dom.newTextNode(a))
    }
    if (typeof b === "object") {
      wrapper.appendChild(b as Node)
    } else if (typeof b === "string") {
      wrapper.appendChild(dom.newTextNode(b))
    }
    return wrapper.childNodes
  },

  addClass: function(el: HTMLElement | SVGElement, className: string) {
    if (el.classList) {
      el.classList.add(className)
    } else {
      // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
      el.setAttribute("class", el.getAttribute("class") + " " + className)
    }
    return el
  },


  removeClass: function(el: HTMLElement | SVGElement, className: string) {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      //IE doesn't support classList in SVG - also no need for dublication check i.t.m.
      el.setAttribute("class", el.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"))
    }
    return el
  },

  removeAllChildren: function(el: HTMLElement | SVGElement){
    while(el.childNodes.length > 0){
      el.removeChild(el.childNodes[0])
    }
  }
}

export default dom