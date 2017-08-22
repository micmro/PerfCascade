/**
 * Adds class `className` to `el`
 * @param  {Element} el
 * @param  {string} className
 */
export function addClass<T extends Element>(el: T, className: string): T {
  const classList = el.classList;
  if (classList) {
    className.split(" ").forEach((c) => classList.add(c));
  } else {
    // IE doesn't support classList in SVG - also no need for duplication check i.t.m.
    el.setAttribute("class", el.getAttribute("class") + " " + className);
  }
  return el;
}

/**
 * Removes class `className` from `el`
 * @param  {Element} el
 * @param  {string} className
 */
export function removeClass<T extends Element>(el: T, className: string): T {
  const classList = el.classList;
  if (classList) {
    classList.remove(className);
  } else {
    // IE doesn't support classList in SVG
    el.setAttribute("class", el.getAttribute("class")
      .replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
  }
  return el;
}

/**
 * Helper to recursively find parent with the `className` class
 * @param base `Element` to start from
 * @param className class that the parent should have
 */
export function getParentByClassName(base: Element, className: string) {
  if (typeof base.closest === "function") {
    return base.closest(`.${className}`);
  }
  while (base) {
    if (base.classList.contains(className)) {
      return base;
    }
    base = base.parentElement;
  }
  return undefined;
}

/**
 * Removes all child DOM nodes from `el`
 * @param  {Element} el
 */
export function removeChildren<T extends Element>(el: T): T {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
  return el;
}

/**
 * Get last element of `NodeList`
 * @param list NodeListOf e.g. return value of `getElementsByClassName`
 */
export function getLastItemOfNodeList<T extends Node>(list: NodeListOf<T>) {
  if (!list || list.length === 0) {
    return undefined;
  }
  return list.item(list.length - 1);
}

/** Calls `fn` with each element of `els` */
export function forEachNodeList<T extends Node>(els: NodeListOf<T>, fn: (el: T, index: number) => any) {
  Array.prototype.forEach.call(els, fn);
}

export interface StringOrNumberMap { [key: string]: string | number; }

/** Sets a CSS style property, but only if property exists on `el` */
export function safeSetStyle(el: HTMLElement | SVGElement, property: string, value: string) {
  if (property in el.style) {
    el.style[property] = value;
  } else {
// tslint:disable-next-line:no-console
    console.warn(new Error(`Trying to set non-existing style ` +
      `${property} = ${value} on a <${el.tagName.toLowerCase()}>.`));
  }
}

/** Sets an attribute, but only if `name` exists on `el` */
export function safeSetAttribute(el: HTMLElement | SVGElement, name: string, value: string) {
  if (!(name in el)) {
// tslint:disable-next-line:no-console
    console.warn(new Error(`Trying to set non-existing attribute ` +
      `${name} = ${value} on a <${el.tagName.toLowerCase()}>.`));
  }
  el.setAttributeNS(null, name, value);
}

/** Sets multiple CSS style properties, but only if property exists on `el` */
export function safeSetStyles(el: HTMLElement | SVGElement, css: StringOrNumberMap) {
  Object.keys(css).forEach((property) => {
    safeSetStyle(el, property, css[property].toString());
  });
}

/** Sets attributes, but only if they exist on `el` */
export function safeSetAttributes(el: HTMLElement | SVGElement, attributes: StringOrNumberMap) {
  Object.keys(attributes).forEach((name) => {
    safeSetAttribute(el, name, attributes[name].toString());
  });
}

export function makeHtmlEl() {
  const html = document.createElement("html");
  html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");
  return html;
}

export function makeBodyEl(css: StringOrNumberMap = {}, innerHTML = "") {
  const body = document.createElement("body");
  body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  safeSetStyles(body, css);
  body.innerHTML =  innerHTML;
  return body;
}
