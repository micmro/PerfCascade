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

// /** Calls `fn` with each element of `els` */
export function forEachNodeList<T extends Node>(els: NodeListOf<T>, fn: (el: T, index: number) => any) {
  Array.prototype.forEach.call(els, fn);
}
