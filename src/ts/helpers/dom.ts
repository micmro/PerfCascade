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
 * Removes all child DOM nodes from `el`
 * @param  {Element} el
 */
export function removeChildren<T extends Element>(el: T): T {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
  return el;
}
