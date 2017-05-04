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
  if (base.parentElement === undefined) {
    return undefined;
  }
  if (base.parentElement.classList.contains(className)) {
    return base.parentElement;
  }
  return getParentByClassName(base.parentElement, className);
};

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

/**
 * Helper to make `NodeListOf` iterable
 * @param list NodeListOf e.g. return value of `getElementsByClassName`
 * @param fn Function called for
 */
export function forEachNodeList<T extends Node>(list: NodeListOf<T>, fn: {(el: T, index: number): void}): void {
  if (!list || list.length === 0) {
    return undefined;
  }
  for (let i = 0, len = list.length; i < len; i ++) {
    fn(list.item(i), i);
  }
}
