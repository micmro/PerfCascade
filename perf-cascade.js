/*! github.com/micmro/PerfCascade Version:2.6.1 (27/05/2019) */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.perfCascade = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adds class `className` to `el`
 * @param  {Element} el
 * @param  {string} className
 */
function addClass(el, className) {
    var classList = el.classList;
    if (classList) {
        className.split(" ").forEach(function (c) { return classList.add(c); });
    }
    else {
        // IE doesn't support classList in SVG - also no need for duplication check i.t.m.
        el.setAttribute("class", el.getAttribute("class") + " " + className);
    }
    return el;
}
exports.addClass = addClass;
/**
 * Removes class `className` from `el`
 * @param  {Element} el
 * @param  {string} className
 */
function removeClass(el, className) {
    var classList = el.classList;
    if (classList) {
        classList.remove(className);
    }
    else {
        // IE doesn't support classList in SVG
        el.setAttribute("class", (el.getAttribute("class") || "")
            .replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
    }
    return el;
}
exports.removeClass = removeClass;
/**
 * Helper to recursively find parent with the `className` class
 * @param base `Element` to start from
 * @param className class that the parent should have
 */
function getParentByClassName(base, className) {
    if (typeof base.closest === "function") {
        return base.closest("." + className);
    }
    while (base) {
        if (base.classList.contains(className)) {
            return base;
        }
        base = base.parentElement;
    }
    return null;
}
exports.getParentByClassName = getParentByClassName;
/**
 * Removes all child DOM nodes from `el`
 * @param  {Element} el
 */
function removeChildren(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
    return el;
}
exports.removeChildren = removeChildren;
/**
 * Get last element of `NodeList`
 * @param list NodeListOf e.g. return value of `getElementsByClassName`
 */
function getLastItemOfNodeList(list) {
    if (!list || list.length === 0) {
        return undefined;
    }
    return list.item(list.length - 1);
}
exports.getLastItemOfNodeList = getLastItemOfNodeList;
/** Calls `fn` with each element of `els` */
function forEachNodeList(els, fn) {
    Array.prototype.forEach.call(els, fn);
}
exports.forEachNodeList = forEachNodeList;
/** Sets a CSS style property, but only if property exists on `el` */
function safeSetStyle(el, property, value) {
    if (property in el.style) {
        el.style[property] = value;
    }
    else {
        // tslint:disable-next-line:no-console
        console.warn(new Error("Trying to set non-existing style " +
            (property + " = " + value + " on a <" + el.tagName.toLowerCase() + ">.")));
    }
}
exports.safeSetStyle = safeSetStyle;
/** Sets an attribute, but only if `name` exists on `el` */
function safeSetAttribute(el, name, value) {
    if (!(name in el)) {
        // tslint:disable-next-line:no-console
        console.warn(new Error("Trying to set non-existing attribute " +
            (name + " = " + value + " on a <" + el.tagName.toLowerCase() + ">.")));
    }
    el.setAttributeNS("", name, value);
}
exports.safeSetAttribute = safeSetAttribute;
/** Sets multiple CSS style properties, but only if property exists on `el` */
function safeSetStyles(el, css) {
    Object.keys(css).forEach(function (property) {
        safeSetStyle(el, property, css[property].toString());
    });
}
exports.safeSetStyles = safeSetStyles;
/** Sets attributes, but only if they exist on `el` */
function safeSetAttributes(el, attributes) {
    Object.keys(attributes).forEach(function (name) {
        safeSetAttribute(el, name, attributes[name].toString());
    });
}
exports.safeSetAttributes = safeSetAttributes;
function makeHtmlEl() {
    var html = document.createElement("html");
    html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");
    return html;
}
exports.makeHtmlEl = makeHtmlEl;
function makeBodyEl(css, innerHTML) {
    if (css === void 0) { css = {}; }
    if (innerHTML === void 0) { innerHTML = ""; }
    var body = document.createElement("body");
    body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    safeSetStyles(body, css);
    body.innerHTML = innerHTML;
    return body;
}
exports.makeBodyEl = makeBodyEl;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Partial function that buils a filter predicate function */
var matchHeaderPartialFn = function (lowercaseName) {
    return function (header) { return header.name.toLowerCase() === lowercaseName; };
};
/**
 * @param headers List of `Header` to search in
 * @param headerName Name of `Header` to find
 */
function hasHeader(headers, headerName) {
    var headerFilter = matchHeaderPartialFn(headerName.toLowerCase());
    return headers.some(headerFilter);
}
exports.hasHeader = hasHeader;
/** feature detection if browser supports `find` for arrays */
var browserHasFind = !!Array.prototype["find"];
/**
 * Returns the fist instances of `headerName` in `headers`
 * @param headers List of `Header` to search in
 * @param headerName Name of `Header` to find
 */
function getHeader(headers, headerName) {
    var headerFilter = matchHeaderPartialFn(headerName.toLowerCase());
    var firstItem;
    if (browserHasFind) {
        firstItem = headers["find"](headerFilter);
    }
    else {
        firstItem = headers.map(headerFilter).pop();
    }
    return firstItem ? firstItem.value : undefined;
}
exports.getHeader = getHeader;
/**
 * Returns all instances of `headerName` in `headers` as `KvTuple`
 * @param headers List of `Header` to search in
 * @param headerName Name of `Header` to find
 */
function getHeaders(headers, headerName) {
    var headerFilter = matchHeaderPartialFn(headerName.toLowerCase());
    return headers.filter(headerFilter).map(function (h) { return [headerName, h.value]; });
}
exports.getHeaders = getHeaders;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svgLib = require("./svg");
/**
 *  SVG Icons
 */
var wrapSvgIcon = function (x, y, title, className, scale, svgEl) {
    var holder = svgLib.newSvg("", {
        x: x,
        y: y,
    });
    var el = svgLib.newG("icon " + className, {
        transform: "scale(" + scale + ")",
    });
    // el.innerHTML = svgDoc;
    el.appendChild(svgEl);
    el.appendChild(svgLib.newTitle(title));
    holder.appendChild(el);
    return holder;
};
var noTlsIconLazy;
function noTls(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (noTlsIconLazy === undefined) {
        var d = "M18 6.216v2.77q0 .28-.206.486-.205.206-.486.206h-.693q-.28 0-.486-.206-.21-.205-.21\n  -.487v-2.77q0-1.145-.81-1.957-.813-.81-1.96-.81-1.146 0-1.957.81-.81.812-.81 1.958v2.077h1.037q.434\n  0 .737.303.302.303.302.736v6.23q0 .433-.305.736t-.737.303H1.038q-.433 0-.736-.3Q0 15.996 0\n  15.56V9.33q0-.433.303-.736t.735-.303h7.27V6.218q0-2 1.422-3.423 1.423-1.423 3.424-1.423 2\n  0 3.424 1.424Q18 4.214 18 6.216";
        noTlsIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-no-tls", scale, noTlsIconLazy.cloneNode(false));
}
exports.noTls = noTls;
var err3xxIconLazy;
function err3xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (err3xxIconLazy === undefined) {
        var d = "M17 2.333V7q0 .27-.198.47-.198.197-.47.197h-4.665q-.438 0-.615-.417-.177-.406.146-.72l1.437-1.436Q11.095\n  3.667 9 3.667q-1.083 0-2.068.422-.984.42-1.703 1.14-.72.715-1.14 1.7-.426.984-.426 2.07 0 1.08.422 2.065.42.984\n  1.14 1.703.718.72 1.702 1.14.984.422 2.067.422 1.24 0 2.344-.54 1.104-.543 1.864-1.533.073-.105.24-.126.146 0\n  .26.095l1.427 1.436q.095.084.1.214.006.13-.08.234-1.133 1.376-2.75 2.13Q10.793 17 9 17q-1.625\n  0-3.104-.635-1.48-.636-2.552-1.71-1.073-1.072-1.71-2.55Q1 10.625 1 9t.635-3.104q.636-1.48 1.71-2.552\n  1.072-1.073 2.55-1.71Q7.375 1 9 1q1.53 0 2.964.578 1.432.578 2.546\n  1.63l1.355-1.343q.302-.323.73-.146.405.173.405.61z";
        err3xxIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-redirect", scale, err3xxIconLazy.cloneNode(false));
}
exports.err3xx = err3xx;
function err4xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return warning(x, y, title, scale);
}
exports.err4xx = err4xx;
function err5xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return warning(x, y, title, scale);
}
exports.err5xx = err5xx;
var plainIconLazy;
function plain(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (plainIconLazy === undefined) {
        var d = "M15.247 4.393q.25.25.43.678.177.43.177.79v10.287q0\n  .357-.25.607t-.607.25h-12q-.357 0-.607-.25t-.25-.606V1.858q0-.358.25-.608T2.997 1h8q.357 0\n  .786.18.428.177.678.427zm-3.964-2.18V5.57h3.357q-.09-.256-.196-.364L11.65 2.41q-.108-.106-.367\n  -.196zm3.428 13.644V6.714H11q-.357 0-.607-.25t-.25-.607V2.143h-6.86v13.714H14.71zM5.57\n  8.143q0-.125.08-.205.08-.08.204-.08h6.286q.125 0 .205.08.08.08.08.205v.57q0 .126-.08.207-.08.08\n  -.205.08H5.854q-.125 0-.205-.08-.08-.08-.08-.206v-.57zm6.57 2q.125 0 .205.08.08.08.08.206V11q0\n  .125-.08.205-.08.08-.205.08H5.854q-.125 0-.205-.08-.08-.08-.08-.205v-.57q0-.126.08-.207.08-.08.2\n  -.08h6.286zm0 2.286q.125 0 .205.08.08.08.08.2v.572q0 .125-.08.205-.08.08-.205.08H5.854q-.125 0-.205\n  -.08-.08-.08-.08-.205v-.572q0-.124.08-.204.08-.08.2-.08h6.286z";
        plainIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-plain", scale, plainIconLazy.cloneNode(false));
}
exports.plain = plain;
var otherIconLazy;
function other(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (otherIconLazy === undefined) {
        var d = "M10.8 13.5v3q0 .2-.15.35-.15.15-.35.15h-3q-.2 0-.35-.15-.15-.15-.15-.35v-3q0-.2.15-.35.15\n  -.15.35-.15h3q.2 0 .35.15.15.15.15.35zM14.75 6q0 .675-.193 1.262-.193.588-.437.957-.244.365\n  -.688.74-.443.375-.718.543-.275.17-.763.444-.51.286-.852.81-.344.526-.344.84 0 .21-.15.405-.15.194\n  -.35.194h-3q-.186 0-.318-.23-.13-.234-.13-.47v-.564q0-1.037.812-1.956.812-.917 1.787-1.355.74-.336\n  1.05-.7.314-.362.314-.95 0-.524-.583-.924-.58-.4-1.343-.4-.814 0-1.35.362-.44.312-1.34 1.437-.16.2\n  -.386.2-.15 0-.313-.1L3.4 4.987q-.16-.124-.193-.312-.03-.188.07-.35Q5.277 1 9.077 1q1 0 2.01.387\n  1.01.388 1.825 1.038.812.65 1.325 1.594.51.94.51 1.98z";
        otherIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-other", scale, otherIconLazy.cloneNode(false));
}
exports.other = other;
var javascriptIconLazy;
function javascript(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (javascriptIconLazy === undefined) {
        var d = "M13.516 2.9c-2.766 0-4.463 1.522-4.463 3.536 0 1.733 1.295 2.82 3.256 3.52\n  1.413.49 1.973.926 1.973 1.644 0 .787-.647 1.296-1.873 1.296-1.137 0-2.26-.368-2.96-.736l-.54\n  2.19c.665.367 1.996.734 3.344.734 3.238 0 4.744-1.68 4.744-3.658\n  0-1.68-.966-2.767-3.05-3.537-1.54-.6-2.186-.93-2.186-1.68 0-.6.56-1.14 1.714-1.14\n  1.137 0 1.996.33 2.45.56l.596-2.138c-.7-.332-1.663-.596-3.01-.596zm-9.032.192v7.44c0\n  1.822-.702 2.33-1.822 2.33-.525 0-.997-.09-1.365-.212L1 14.805c.525.175 1.33.28 1.96.28\n  2.574 0 4.185-1.173 4.185-4.534V3.097h-2.66z";
        javascriptIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-js", scale, javascriptIconLazy.cloneNode(false));
}
exports.javascript = javascript;
var imageIconLazy;
function image(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (imageIconLazy === undefined) {
        var d = "M6 6q0 .75-.525 1.275Q4.95 7.8 4.2 7.8q-.75 0-1.275-.525Q2.4 6.75 2.4\n  6q0-.75.525-1.275Q3.45 4.2 4.2 4.2q.75 0 1.275.525Q6 5.25 6 6zm9.6 3.6v4.2H2.4V12l3-3\n  1.5 1.5 4.8-4.8zm.9-6.6h-15q-.122 0-.21.09-.09.088-.09.21v11.4q0\n  .122.09.21.088.09.21.09h15q.122 0 .21-.09.09-.088.09-.21V3.3q0-.122-.09-.21Q16.623\n  3 16.5 3zm1.5.3v11.4q0 .62-.44 1.06-.44.44-1.06.44h-15q-.62 0-1.06-.44Q0 15.32 0\n  14.7V3.3q0-.62.44-1.06.44-.44 1.06-.44h15q.62 0 1.06.44.44.44.44 1.06z";
        imageIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-image", scale, imageIconLazy.cloneNode(false));
}
exports.image = image;
function svg(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return image(x, y, title, scale);
}
exports.svg = svg;
var htmlIconLazy;
function html(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (htmlIconLazy === undefined) {
        var d = "M5.626 13.31l-.492.492q-.098.098-.226.098t-.226-.098L.098 9.22Q0 9.12 0\n  8.99q0-.127.098-.226L4.682 4.18q.098-.097.226-.097t.226.098l.492.49q.1.1.1.23t-.1.23L1.76\n  8.99l3.866 3.866q.1.098.1.226t-.1.226zM11.44 2.815l-3.67\n  12.7q-.04.127-.152.19-.113.065-.23.026l-.61-.162q-.13-.04-.193-.152-.064-.112-.024-.24l3.67-12.698q.04\n  -.128.157-.192.113-.064.23-.025l.61.167q.13.04.193.152.063.113.023.24zM17.9\n  9.22l-4.582 4.58q-.098.098-.226.098t-.226-.098l-.492-.492q-.1-.098-.1-.226t.1-.226L16.24\n  8.99l-3.867-3.865q-.1-.098-.1-.226t.1-.23l.492-.49q.098-.1.226-.1t.23.1l4.58 4.583q.1.1.1.226 0 .13-.1.23z";
        htmlIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-html", scale, htmlIconLazy.cloneNode(false));
}
exports.html = html;
var cssIconLazy;
function css(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (cssIconLazy === undefined) {
        var d = "M15.436.99q.625 0 1.095.416.47.415.47 1.04 0 .564-.4 1.35-2.97 5.624-4.16 6.724-.865.814\n  -1.946.814-1.127 0-1.935-.827-.81-.827-.81-1.962 0-1.144.822-1.895l5.705-5.175Q14.8.99\n  15.435.99zM7.31 10.232q.35.68.953 1.162.603.483 1.345.68l.01.634q.035 1.904-1.16 3.102-1.192\n  1.198-3.114 1.198-1.1 0-1.948-.416-.85-.415-1.364-1.14-.514-.723-.773-1.635Q1 12.905 1\n  11.85l.366.268q.304.224.555.398.25.175.53.327.277.15.41.15.368 0 .493-.33.224-.59.515-1.005.29\n  -.415.62-.68.332-.263.788-.424.455-.16.92-.228.465-.066 1.118-.094z";
        cssIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-css", scale, cssIconLazy.cloneNode(false));
}
exports.css = css;
var warningIconLazy;
function warning(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (warningIconLazy === undefined) {
        var d = "M6 6q0 .75-.525 1.275Q4.95 7.8 4.2 7.8q-.75 0-1.275-.525Q2.4 6.75 2.4\n  6q0-.75.525-1.275Q3.45 4.2 4.2 4.2q.75 0 1.275.525Q6 5.25 6 6zm9.6 3.6v4.2H2.4V12l3-3\n  1.5 1.5 4.8-4.8zm.9-6.6h-15q-.122 0-.21.09-.09.088-.09.21v11.4q0\n  .122.09.21.088.09.21.09h15q.122 0 .21-.09.09-.088.09-.21V3.3q0-.122-.09-.21Q16.623\n  3 16.5 3zm1.5.3v11.4q0 .62-.44 1.06-.44.44-1.06.44h-15q-.62 0-1.06-.44Q0 15.32 0\n  14.7V3.3q0-.62.44-1.06.44-.44 1.06-.44h15q.62 0 1.06.44.44.44.44 1.06z";
        warningIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-warning", scale, warningIconLazy.cloneNode(false));
}
exports.warning = warning;
var errorIconLazy;
function error(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (errorIconLazy === undefined) {
        var d = "M9 1q2.177 0 4.016 1.073 1.838 1.073 2.91 2.91Q17 6.823 17 9q0 2.177-1.073 4.016-1.073\n  1.838-2.91 2.91Q11.177 17 9 17q-2.177 0-4.016-1.073-1.838-1.073-2.91-2.91Q1 11.177 1 9q0-2.177 1.073-4.016\n  1.073-1.838 2.91-2.91Q6.823 1 9 1zm1.333 12.99v-1.98q0-.145-.093-.244-.094-.1-.23-.1h-2q-.135 0-.24.105\n  -.103.106-.103.24v1.98q0 .136.104.24.106.104.24.104h2q.137 0 .23-.1.094-.098.094-.243zm-.02-3.584l.187\n  -6.468q0-.125-.104-.188-.104-.084-.25-.084H7.854q-.146 0-.25.084-.104.062-.104.188l.177 6.468q0\n  .104.104.183.106.076.25.076h1.93q.146 0 .245-.078.1-.08.11-.184z";
        errorIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-no-gzip", scale, errorIconLazy.cloneNode(false));
}
exports.error = error;
var fontIconLazy;
function font(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (fontIconLazy === undefined) {
        var d = "M7.97 5.754L6.338 10.08q.317 0 1.312.02.994.02 1.542.02.183 0 .548-.02-.836-2.432-1.77\n  -4.345zM1 16.38l.02-.76q.22-.068.538-.12.317-.053.548-.102.23-.048.476-.14.245-.09.428-.278.182\n  -.187.298-.485l2.28-5.923 2.69-6.962H9.51q.077.135.105.202l1.972 4.615q.317.75 1.02 2.476.7 1.726\n  1.095 2.64.144.327.558 1.39.413 1.062.692 1.62.192.432.336.547.183.145.847.284.663.14.807.197.058.37.058.55\n  0 .04-.005.13t-.005.128q-.605 0-1.827-.076-1.22-.08-1.836-.08-.73 0-2.067.07-1.337.067-1.712.076 0-.412.04\n  -.75l1.258-.27q.01 0 .12-.022l.15-.033q.038-.01.14-.044.1-.034.143-.06l.1-.08q.06-.048.082-.106.024-.056.024\n  -.133 0-.152-.298-.926t-.693-1.71q-.392-.93-.402-.96l-4.325-.02q-.25.56-.734 1.88-.487 1.32-.487 1.56 0\n  .213.136.362.134.15.418.235.285.087.467.13.185.044.55.08.366.04.395.04.01.183.01.558 0 .087-.02.26-.558\n  0-1.678-.095-1.12-.098-1.678-.098-.08 0-.26.04-.18.037-.208.037-.77.136-1.808.136Z";
        fontIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-font", scale, fontIconLazy.cloneNode(false));
}
exports.font = font;
var flashIconLazy;
function flash(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (flashIconLazy === undefined) {
        var d = "M13.724 4.738q.195.216.076.476L7.96 17.73q-.142.27-.456.27-.043 0-.15-.022-.185-.054-.277\n  -.205-.092-.15-.05-.325l2.132-8.74L4.765 9.8q-.044.01-.13.01-.195 0-.336-.118-.193-.162-.14-.422L6.337.346q.043\n  -.15.173-.25Q6.64 0 6.81 0h3.548q.206 0 .346.135.14.135.14.32 0 .086-.053.194L8.94 5.654l4.285\n  -1.06q.086-.02.13-.02.205 0 .367.16z";
        flashIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-flash", scale, flashIconLazy.cloneNode(false));
}
exports.flash = flash;
var videoIconLazy;
function video(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (videoIconLazy === undefined) {
        var d = "M17 4.107v9.714q0 .38-.348.53-.116.05-.223.05-.25 0-.41-.17l-3.6-3.6v1.48q0 1.067-.757 1.82-.754.756\n  -1.817.756H3.57q-1.06 0-1.816-.753Q1 13.17 1 12.106V5.82q0-1.06.754-1.816.755-.754 1.817-.754h6.29q1.07 0\n  1.82.754.76.755.76 1.817V7.3l3.597-3.59q.16-.17.4-.17.107 0 .22.045.35.153.35.528z";
        videoIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-video", scale, videoIconLazy.cloneNode(false));
}
exports.video = video;
var audioIconLazy;
function audio(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    if (audioIconLazy === undefined) {
        var d = "M8.385 3.756v10.46q0 .252-.183.434-.183.183-.433.183t-.44-.183l-3.2-3.202H1.61q-.25\n  0-.43-.183-.18-.182-.18-.432V7.14q0-.25.182-.432.182-.183.432-.183h2.52l3.202-3.202q.182-.183.432\n  -.183t.43.183q.182.183.182.433zm3.692 5.23q0 .73-.41 1.36-.407.63-1.08.9-.097.048-.24.048-.25 0\n  -.434-.178-.182-.177-.182-.437 0-.21.12-.35.12-.14.28-.24.16-.1.33-.22.166-.12.28-.34.117-.22.117\n  -.55 0-.33-.115-.55-.115-.224-.28-.344-.163-.12-.326-.22-.165-.1-.28-.24-.116-.14-.116-.34 0-.26.183\n  -.44t.43-.176q.146 0 .24.048.676.26 1.08.894.41.636.41 1.367zm2.46 0q0 1.472-.816 2.717t-2.16 1.813q\n  -.12.048-.24.048-.26 0-.44-.183-.18-.18-.18-.43 0-.37.378-.56.54-.28.73-.42.713-.52 1.11-1.302.4\n  -.783.4-1.667 0-.886-.4-1.67-.4-.783-1.11-1.303-.192-.145-.73-.424-.376-.192-.376-.567 0-.25.183\n  -.434.183-.18.433-.18.123 0 .25.047 1.344.567 2.16 1.812.82 1.244.82 2.716zm2.463 0q0 2.212\n  -1.22 4.063-1.222 1.85-3.25 2.72-.126.05-.25.05-.25 0-.434-.19-.183-.183-.183-.433 0-.346.375\n  -.568.068-.04.217-.1.15-.064.216-.1.45-.244.79-.494 1.19-.875 1.85-2.183.67-1.306.67-2.777 0\n  -1.47-.663-2.78-.664-1.304-1.846-2.18-.346-.25-.79-.49-.065-.035-.214-.1-.15-.06-.22-.1\n  -.375-.22-.375-.57 0-.25.183-.43.183-.182.433-.182.123 0 .25.047 2.027.876 3.25 2.727Q17 6.775 17 8.99Z";
        audioIconLazy = svgLib.newPath(d);
    }
    return wrapSvgIcon(x, y, title, "icon-audio", scale, audioIconLazy.cloneNode(false));
}
exports.audio = audio;

},{"./svg":6}],4:[function(require,module,exports){
"use strict";
/**
 *  Misc Helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses URL into its components
 * @param  {string} url
 */
function parseUrl(url) {
    var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    var matches = url.match(pattern) || [];
    return {
        authority: matches[4],
        fragment: matches[9],
        path: matches[5],
        query: matches[7],
        scheme: matches[2],
    };
}
/**
 * @param  {T[]} arr - array to search
 * @param  {T} item - item to search for
 * @returns boolean - true if `item` is in `arr`
 */
function contains(arr, item) {
    return arr.some(function (x) { return x === item; });
}
exports.contains = contains;
/**
 * Returns Index of first match to `predicate` in `arr`
 * @param arr Array to search
 * @param predicate Function that returns true for a match
 */
function findIndex(arr, predicate) {
    var i = 0;
    if (!arr || arr.length < 1) {
        return undefined;
    }
    var len = arr.length;
    while (i < len) {
        if (predicate(arr[i], i)) {
            return i;
        }
        i++;
    }
    return undefined;
}
exports.findIndex = findIndex;
/**
 * Returns first match to `predicate` in `arr`
 * @param arr Array to search
 * @param predicate Function that returns true for a match
 */
function find(arr, predicate) {
    var index = findIndex(arr, predicate);
    if (index === undefined) {
        return undefined;
    }
    return arr[index];
}
exports.find = find;
/**
 * Formats and shortens a url for ui
 * @param  {string} url
 * @param  {number} maxLength - max length of shortened url
 * @returns string
 */
function resourceUrlFormatter(url, maxLength) {
    if (url.length < maxLength) {
        return url.replace(/https?:\/\//, "");
    }
    var matches = parseUrl(url);
    if ((matches.authority + matches.path).length < maxLength) {
        return matches.authority + matches.path;
    }
    var maxAuthLength = Math.floor(maxLength / 2) - 3;
    var maxPathLength = Math.floor(maxLength / 2) - 5;
    // maybe we could fine tune these numbers
    var p = matches.path.split("/");
    if (matches.authority.length > maxAuthLength) {
        return matches.authority.substr(0, maxAuthLength) + "..." + p[p.length - 1].substr(-maxPathLength);
    }
    return matches.authority + "..." + p[p.length - 1].substr(-maxPathLength);
}
exports.resourceUrlFormatter = resourceUrlFormatter;
/**
 * Helper to add a precision to `Math.round`.
 *
 * _defaults to 2 decimals_
 * @param  {number} num - number to round
 * @param  {number} [decimals=2] - decimal precision to round to
 */
function roundNumber(num, decimals) {
    if (decimals === void 0) { decimals = 2; }
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
exports.roundNumber = roundNumber;
/**
 *
 * Checks if `status` code is `>= lowerBound` and `<= upperBound`
 * @param  {number} status  HTTP status code
 * @param  {number} lowerBound  inclusive lower bound
 * @param  {number} upperBound  inclusive upper bound
 */
function isInStatusCodeRange(status, lowerBound, upperBound) {
    return status >= lowerBound && status <= upperBound;
}
exports.isInStatusCodeRange = isInStatusCodeRange;
/** precompiled regex */
var cssClassRegEx = /[^a-z-]/g;
/**
 * Converts a seed string to a CSS class by stripping out invalid characters
 * @param {string} seed string to base the CSS class off
 */
function toCssClass(seed) {
    return seed.toLowerCase().replace(cssClassRegEx, "");
}
exports.toCssClass = toCssClass;
/**
 * Conditionally pluralizes (adding 's') `word` based on `count`
 * @param {string} word word to pluralize
 * @param {number} count counter to deceide weather or not `word` should be pluralized
 */
function pluralize(word, count) {
    return word + (count > 1 ? "s" : "");
}
exports.pluralize = pluralize;
/**
 * Check if event is `tab` + `shift` key, to move to previous input element
 * @param {KeyboardEvent} evt Keyboard event
 */
function isTabUp(evt) {
    return evt.which === 9 && evt.shiftKey;
}
exports.isTabUp = isTabUp;
/**
 * Check if event is only `tab` key, to move to next input element
 * @param {KeyboardEvent} evt Keyboard event
 */
function isTabDown(evt) {
    return evt.which === 9 && !evt.shiftKey;
}
exports.isTabDown = isTabDown;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("./misc");
/**
 * Type safe and null safe way to transform, filter and format an input value, e.g. parse a Date from a string,
 * rejecting invalid dates, and formatting it as a localized string. If the input value is undefined, or the parseFn
 * returns undefined, the function returns undefined.
 * @param input
 * @param parseFn an optional function to transform and/or filter the input value.
 * @param formatFn an optional function to format the parsed input value.
 * @returns {string} a formatted string representation of the input, or undefined.
 */
function parseAndFormat(input, parseFn, formatFn) {
    if (formatFn === void 0) { formatFn = toString; }
    if (input === undefined) {
        return undefined;
    }
    var parsed = parseFn(input);
    if (parsed === undefined) {
        return undefined;
    }
    return formatFn(parsed);
}
exports.parseAndFormat = parseAndFormat;
function toString(source) {
    if (typeof source["toString"] === "function") {
        return source.toString();
    }
    else {
        throw TypeError("Can't convert type " + typeof source + " to string");
    }
}
function parseNonEmpty(input) {
    return input.trim().length > 0 ? input : undefined;
}
exports.parseNonEmpty = parseNonEmpty;
function parseDate(input) {
    var date = new Date(input);
    if (isNaN(date.getTime())) {
        return undefined;
    }
    return date;
}
exports.parseDate = parseDate;
function parseNonNegative(input) {
    if (input === undefined || input === null) {
        return undefined;
    }
    var filter = function (n) { return (n >= 0); };
    return parseToNumber(input, filter);
}
exports.parseNonNegative = parseNonNegative;
function parsePositive(input) {
    if (input === undefined || input === null) {
        return undefined;
    }
    var filter = function (n) { return (n > 0); };
    return parseToNumber(input, filter);
}
exports.parsePositive = parsePositive;
function parseToNumber(input, filterFn) {
    var filter = function (n) { return filterFn(n) ? n : undefined; };
    if (typeof input === "string") {
        var n = parseInt(input, 10);
        if (!isFinite(n)) {
            return undefined;
        }
        return filter(n);
    }
    return filter(input);
}
function formatMilliseconds(millis) {
    return (millis !== undefined) ? misc_1.roundNumber(millis, 3) + " ms" : undefined;
}
exports.formatMilliseconds = formatMilliseconds;
var secondsPerMinute = 60;
var secondsPerHour = 60 * secondsPerMinute;
var secondsPerDay = 24 * secondsPerHour;
function formatSeconds(seconds) {
    if (seconds === undefined) {
        return undefined;
    }
    var raw = misc_1.roundNumber(seconds, 3) + " s";
    if (seconds > secondsPerDay) {
        return raw + " (~" + misc_1.roundNumber(seconds / secondsPerDay, 0) + " days)";
    }
    if (seconds > secondsPerHour) {
        return raw + " (~" + misc_1.roundNumber(seconds / secondsPerHour, 0) + " hours)";
    }
    if (seconds > secondsPerMinute) {
        return raw + " (~" + misc_1.roundNumber(seconds / secondsPerMinute, 0) + " minutes)";
    }
    return raw;
}
exports.formatSeconds = formatSeconds;
function formatDateLocalized(date) {
    return (date !== undefined) ? date.toUTCString() + "<br/>(local time: " + date.toLocaleString() + ")" : undefined;
}
exports.formatDateLocalized = formatDateLocalized;
var bytesPerKB = 1024;
var bytesPerMB = 1024 * bytesPerKB;
function formatBytes(bytes) {
    if (bytes === undefined) {
        return "";
    }
    var raw = bytes + " bytes";
    if (bytes >= bytesPerMB) {
        return raw + " (~" + misc_1.roundNumber(bytes / bytesPerMB, 1) + " MB)";
    }
    if (bytes >= bytesPerKB) {
        return raw + " (~" + misc_1.roundNumber(bytes / bytesPerKB, 0) + " kB)";
    }
    return raw;
}
exports.formatBytes = formatBytes;
/** HTML character to escape */
var htmlCharMap = {
    "\"": "&quot",
    "&": "&amp",
    "'": "&#039",
    "<": "&lt",
    ">": "&gt",
};
/**
 * Reusable regex to escape HTML chars
 * Combined to improve performance
 */
var htmlChars = new RegExp(Object.keys(htmlCharMap).join("|"), "g");
/**
 * Escapes unsafe characters in a string to render safely in HTML
 * @param  {string} unsafe - string to be rendered in HTML
 */
function escapeHtml(unsafe) {
    if (unsafe === void 0) { unsafe = ""; }
    if (unsafe === null || unsafe === undefined) {
        return ""; // See https://github.com/micmro/PerfCascade/issues/217
    }
    if (typeof unsafe !== "string") {
        if (typeof unsafe["toString"] === "function") {
            unsafe = unsafe.toString();
        }
        else {
            throw TypeError("Invalid parameter");
        }
    }
    return unsafe.replace(htmlChars, function (match) {
        return htmlCharMap[match];
    });
}
exports.escapeHtml = escapeHtml;
/** Whitelist of save-ish URL chars */
var unSafeUrlChars = new RegExp("[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]", "g");
/** returns a cleaned http:// or https:// based URL  */
function sanitizeUrlForLink(unsafeUrl) {
    var cleaned = unsafeUrl.replace(unSafeUrlChars, "_");
    if (cleaned.indexOf("http://") === 0 || cleaned.indexOf("https://") === 0) {
        return cleaned;
    }
    // tslint:disable-next-line:no-console
    console.warn("skipped link, due to potentially unsafe url", unsafeUrl);
    return "";
}
exports.sanitizeUrlForLink = sanitizeUrlForLink;
/** whitelist basic chars */
var requestTypeTypeRegEx = new RegExp("[^a-zA-Z0-9]", "g");
/**  returns cleaned sting - stipps out not a-zA-Z0-9 */
function sanitizeAlphaNumeric(unsafe) {
    return unsafe.toString().replace(requestTypeTypeRegEx, "");
}
exports.sanitizeAlphaNumeric = sanitizeAlphaNumeric;
/** Ensures `input` is casted to `number` */
function toInt(input) {
    if (typeof input === "number") {
        return input;
    }
    else if (typeof input === "string") {
        return parseInt(input, 10);
    }
    else {
        return undefined;
    }
}
exports.toInt = toInt;
/** Validates the `ChartOptions` attributes types */
function validateOptions(options) {
    var validateInt = function (name) {
        var val = toInt(options[name]);
        if (val === undefined) {
            throw TypeError("option \"" + name + "\" needs to be a number");
        }
        options[name] = val;
    };
    var ensureBoolean = function (name) {
        options[name] = !!options[name];
    };
    validateInt("leftColumnWidth");
    validateInt("rowHeight");
    validateInt("selectedPage");
    ensureBoolean("showAlignmentHelpers");
    ensureBoolean("showIndicatorIcons");
    ensureBoolean("showMimeTypeIcon");
    return options;
}
exports.validateOptions = validateOptions;

},{"./misc":4}],6:[function(require,module,exports){
"use strict";
/**
 *  SVG Helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("./dom");
/** Namespace for SVG Elements */
var svgNamespaceUri = "http://www.w3.org/2000/svg";
function newElement(tagName, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.attributes, attributes = _c === void 0 ? {} : _c, _d = _b.css, css = _d === void 0 ? {} : _d, _e = _b.text, text = _e === void 0 ? "" : _e, _f = _b.className, className = _f === void 0 ? "" : _f;
    var element = document.createElementNS(svgNamespaceUri, tagName);
    if (className) {
        dom_1.addClass(element, className);
    }
    if (text) {
        element.textContent = text;
    }
    dom_1.safeSetStyles(element, css);
    dom_1.safeSetAttributes(element, attributes);
    return element;
}
function newSvg(className, attributes, css) {
    if (css === void 0) { css = {}; }
    return newElement("svg", { className: className, attributes: attributes, css: css });
}
exports.newSvg = newSvg;
function newG(className, attributes, css) {
    if (attributes === void 0) { attributes = {}; }
    if (css === void 0) { css = {}; }
    return newElement("g", { className: className, attributes: attributes, css: css });
}
exports.newG = newG;
function newClipPath(id) {
    var attributes = { id: id };
    return newElement("clipPath", { attributes: attributes });
}
exports.newClipPath = newClipPath;
function newForeignObject(attributes, className, css) {
    if (className === void 0) { className = ""; }
    if (css === void 0) { css = {}; }
    return newElement("foreignObject", { attributes: attributes, className: className, css: css });
}
exports.newForeignObject = newForeignObject;
function newA(className) {
    return newElement("a", { className: className });
}
exports.newA = newA;
function newRect(attributes, className, css) {
    if (className === void 0) { className = ""; }
    if (css === void 0) { css = {}; }
    return newElement("rect", { attributes: attributes, className: className, css: css });
}
exports.newRect = newRect;
function newLine(attributes, className) {
    if (className === void 0) { className = ""; }
    return newElement("line", { className: className, attributes: attributes });
}
exports.newLine = newLine;
function newTitle(text) {
    var title = document.createElementNS(svgNamespaceUri, "title");
    title.setAttribute("text", text);
    return title;
}
exports.newTitle = newTitle;
function newTextEl(text, attributes, css) {
    if (attributes === void 0) { attributes = {}; }
    if (css === void 0) { css = {}; }
    return newElement("text", { text: text, attributes: attributes, css: css });
}
exports.newTextEl = newTextEl;
function newPath(d) {
    var path = document.createElementNS(svgNamespaceUri, "path");
    path.setAttribute("d", d);
    return path;
}
exports.newPath = newPath;
/** temp SVG element for size measurements  */
var getTestSVGEl = (function () {
    /** Reference to Temp SVG element for size measurements */
    var svgTestEl;
    var removeSvgTestElTimeout;
    return function () {
        // lazy init svgTestEl
        if (svgTestEl === undefined) {
            var attributes = {
                className: "water-fall-chart temp",
                width: "9999px",
            };
            var css = {
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
        if (svgTestEl.parentElement === undefined) {
            window.document.body.appendChild(svgTestEl);
        }
        // debounced time-deleayed cleanup, so the element can be re-used in tight loops
        clearTimeout(removeSvgTestElTimeout);
        removeSvgTestElTimeout = setTimeout(function () {
            svgTestEl.parentNode.removeChild(svgTestEl);
        }, 500);
        return svgTestEl;
    };
})();
/**
 * Measure the width of a SVGTextElement in px
 * @param  {SVGTextElement} textNode
 * @param  {boolean=false} skipClone - do not clone `textNode` and use original
 * @returns number
 */
function getNodeTextWidth(textNode, skipClone) {
    if (skipClone === void 0) { skipClone = false; }
    if ((textNode.textContent || "").length === 0) {
        return 0;
    }
    var tmp = getTestSVGEl();
    var tmpTextNode;
    var shadow;
    if (skipClone) {
        shadow = textNode.style.textShadow;
        tmpTextNode = textNode;
    }
    else {
        tmpTextNode = textNode.cloneNode(true);
        tmpTextNode.setAttribute("x", "0");
        tmpTextNode.setAttribute("y", "0");
    }
    // make sure to turn of shadow for performance
    tmpTextNode.style.textShadow = "0";
    tmp.appendChild(tmpTextNode);
    window.document.body.appendChild(tmp);
    var width = tmpTextNode.getComputedTextLength();
    if (skipClone && shadow !== undefined) {
        textNode.style.textShadow = shadow;
    }
    return width;
}
exports.getNodeTextWidth = getNodeTextWidth;

},{"./dom":1}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates the html for diagrams legend
 */
function makeLegend() {
    var ulNode = document.createElement("ul");
    ulNode.className = "resource-legend";
    ulNode.innerHTML = "\n        <li class=\"legend-blocked\" title=\"Time spent in a queue waiting for a network connection.\">Blocked</li>\n        <li class=\"legend-dns\" title=\"DNS resolution time.\">DNS</li>\n        <li class=\"legend-connect\" title=\"Time required to create TCP connection.\">Connect</li>\n        <li class=\"legend-ssl\" title=\"Time required for SSL/TLS negotiation.\">SSL (TLS)</li>\n        <li class=\"legend-send\" title=\"Time required to send HTTP request to the server.\">Send</li>\n        <li class=\"legend-wait\" title=\"Waiting for a response from the server.\">Wait</li>\n        <li class=\"legend-receive\"\n        title=\"Time required to read entire response from the server (or cache).\">Receive</li>";
    return ulNode;
}
exports.makeLegend = makeLegend;

},{}],8:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("./helpers/parse");
var legend_1 = require("./legend/legend");
var paging_1 = require("./paging/paging");
var HarTransformer = require("./transformers/har");
var svg_chart_1 = require("./waterfall/svg-chart");
/** default options to use if not set in `options` parameter */
var defaultChartOptions = {
    leftColumnWidth: 25,
    legendHolder: undefined,
    onParsed: undefined,
    pageSelector: undefined,
    rowHeight: 23,
    selectedPage: 0,
    showAlignmentHelpers: true,
    showIndicatorIcons: true,
    showMimeTypeIcon: true,
};
/** default options to use if not set in `options` parameter */
var defaultHarTransformerOptions = {
    showUserTiming: false,
    showUserTimingEndMarker: false,
};
/**
 * Creates the html for diagrams legend
 * @returns {HTMLUListElement} - Legend `<ul>` element
 */
function makeLegend() {
    return legend_1.makeLegend();
}
exports.makeLegend = makeLegend;
function PerfCascade(waterfallDocsData, chartOptions) {
    if (chartOptions === void 0) { chartOptions = {}; }
    if (chartOptions["leftColumnWith"] !== undefined) {
        // tslint:disable-next-line: no-console
        console.warn("Depreciation Warning: The option 'leftColumnWith' has been fixed to 'leftColumnWidth', " +
            "please update your code as this will get deprecated in the future");
        chartOptions.leftColumnWidth = chartOptions["leftColumnWith"];
    }
    var options = parse_1.validateOptions(__assign({}, defaultChartOptions, chartOptions));
    // setup paging helper
    var paging = new paging_1.default(waterfallDocsData, options.selectedPage);
    var doc = svg_chart_1.createWaterfallSvg(paging.getSelectedPage(), options);
    // page update behaviour
    paging.onPageUpdate(function (_pageIndex, pageDoc) {
        var el = doc.parentElement;
        var newDoc = svg_chart_1.createWaterfallSvg(pageDoc, options);
        el.replaceChild(newDoc, doc);
        doc = newDoc;
    });
    if (options.pageSelector) {
        paging.initPagingSelectBox(options.pageSelector);
    }
    if (options.legendHolder) {
        options.legendHolder.innerHTML = "";
        options.legendHolder.appendChild(legend_1.makeLegend());
    }
    return doc;
}
/**
 * Create new PerfCascade from HAR data
 * @param  {Har} harData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromHar(harData, options) {
    if (options === void 0) { options = {}; }
    var harTransformerOptions = __assign({}, defaultHarTransformerOptions, options);
    var data = HarTransformer.transformDoc(harData, harTransformerOptions);
    if (typeof options.onParsed === "function") {
        options.onParsed(data);
    }
    return PerfCascade(data, options);
}
exports.fromHar = fromHar;

},{"./helpers/parse":5,"./legend/legend":7,"./paging/paging":9,"./transformers/har":13,"./waterfall/svg-chart":27}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../helpers/dom");
/** Class to keep track of run of a multi-run har is beeing shown  */
var Paging = /** @class */ (function () {
    function Paging(doc, selectedPageIndex) {
        if (selectedPageIndex === void 0) { selectedPageIndex = 0; }
        this.doc = doc;
        this.selectedPageIndex = selectedPageIndex;
        this.onPageUpdateCbs = [];
        if (selectedPageIndex >= this.doc.pages.length) {
            // fall back to last item if doc has too few pages.
            this.selectedPageIndex = this.doc.pages.length - 1;
        }
    }
    /**
     * Returns number of pages
     * @returns number - number of pages in current doc
     */
    Paging.prototype.getPageCount = function () {
        return this.doc.pages.length;
    };
    /**
     * Returns selected pages
     * @returns WaterfallData - currently selected page
     */
    Paging.prototype.getSelectedPage = function () {
        return this.doc.pages[this.selectedPageIndex];
    };
    /**
     * Returns index of currently selected page
     * @returns number - index of current page (0 based)
     */
    Paging.prototype.getSelectedPageIndex = function () {
        return this.selectedPageIndex;
    };
    /**
     * Update which pageIndex is currently update.
     * Published `onPageUpdate`
     * @param  {number} pageIndex
     */
    Paging.prototype.setSelectedPageIndex = function (pageIndex) {
        var _this = this;
        if (this.selectedPageIndex === pageIndex) {
            return;
        }
        if (pageIndex < 0 || pageIndex >= this.getPageCount()) {
            throw new Error("Page does not exist - Invalid pageIndex selected");
        }
        this.selectedPageIndex = pageIndex;
        var selectedPage = this.doc.pages[this.selectedPageIndex];
        this.onPageUpdateCbs.forEach(function (cb) {
            cb(_this.selectedPageIndex, selectedPage);
        });
    };
    /**
     * Register subscriber callbacks to be called when the pageindex updates
     * @param  {OnPagingCb} cb
     * @returns number - index of the callback
     */
    Paging.prototype.onPageUpdate = function (cb) {
        if (this.getPageCount() > 1) {
            return this.onPageUpdateCbs.push(cb);
        }
        return undefined;
    };
    /**
     * hooks up select box with paging options
     * @param  {HTMLSelectElement} selectbox
     */
    Paging.prototype.initPagingSelectBox = function (selectbox) {
        var _this = this;
        var self = this;
        if (this.getPageCount() <= 1) {
            selectbox.style.display = "none";
            return;
        }
        // remove all existing options, like placeholders
        dom_1.removeChildren(selectbox);
        this.doc.pages.forEach(function (p, i) {
            var option = new Option(p.title, i.toString(), false, i === _this.selectedPageIndex);
            selectbox.add(option);
        });
        selectbox.style.display = "block";
        selectbox.addEventListener("change", function (evt) {
            var val = parseInt(evt.target.value, 10);
            self.setSelectedPageIndex(val);
        });
    };
    return Paging;
}());
exports.default = Paging;

},{"../helpers/dom":1}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var har_1 = require("../helpers/har");
var parse_1 = require("../helpers/parse");
var helpers_1 = require("./helpers");
var byteSizeProperty = function (title, input) {
    return [title, parse_1.parseAndFormat(input, parse_1.parsePositive, parse_1.formatBytes)];
};
var countProperty = function (title, input) {
    return [title, parse_1.parseAndFormat(input, parse_1.parsePositive)];
};
/** Predicate to filter out invalid or empty `KvTuple` */
var notEmpty = function (kv) {
    return kv.length > 1 && kv[1] !== undefined && kv[1] !== "";
};
function parseGeneralDetails(entry, startRelative, requestID) {
    return [
        ["Request Number", "#" + requestID],
        ["Started", new Date(entry.startedDateTime).toLocaleString() + ((startRelative > 0) ?
                " (" + parse_1.formatMilliseconds(startRelative) + " after page request started)" : "")],
        ["Duration", parse_1.formatMilliseconds(entry.time)],
        ["Error/Status Code", entry.response.status + " " + entry.response.statusText],
        ["Server IPAddress", entry.serverIPAddress],
        ["Connection", entry.connection],
        ["Browser Priority", entry._priority || entry._initialPriority],
        ["Was pushed", parse_1.parseAndFormat(entry._was_pushed, parse_1.parsePositive, function () { return "yes"; })],
        ["Initiator (Loaded by)", entry._initiator],
        ["Initiator Line", entry._initiator_line],
        ["Initiator Type", entry._initiator_type],
        ["Host", har_1.getHeader(entry.request.headers, "Host")],
        ["IP", entry._ip_addr],
        ["Client Port", parse_1.parseAndFormat(entry._client_port, parse_1.parsePositive)],
        ["Expires", entry._expires],
        ["Cache Time", parse_1.parseAndFormat(entry._cache_time, parse_1.parsePositive, parse_1.formatSeconds)],
        ["CDN Provider", entry._cdn_provider],
        byteSizeProperty("ObjectSize", entry._objectSize),
        byteSizeProperty("Bytes In (downloaded)", entry._bytesIn),
        byteSizeProperty("Bytes Out (uploaded)", entry._bytesOut),
        byteSizeProperty("JPEG Scan Count", entry._jpeg_scan_count),
        byteSizeProperty("Gzip Total", entry._gzip_total),
        byteSizeProperty("Gzip Save", entry._gzip_save),
        byteSizeProperty("Minify Total", entry._minify_total),
        byteSizeProperty("Minify Save", entry._minify_save),
        byteSizeProperty("Image Total", entry._image_total),
        byteSizeProperty("Image Save", entry._image_save),
    ].filter(notEmpty);
}
function parseRequestDetails(harEntry) {
    var request = harEntry.request;
    var stringHeader = function (name) { return har_1.getHeaders(request.headers, name); };
    return helpers_1.flattenKvTuple([
        ["Method", request.method],
        ["HTTP Version", request.httpVersion],
        byteSizeProperty("Bytes Out (uploaded)", harEntry._bytesOut),
        byteSizeProperty("Headers Size", request.headersSize),
        byteSizeProperty("Body Size", request.bodySize),
        ["Comment", parse_1.parseAndFormat(request.comment, parse_1.parseNonEmpty)],
        stringHeader("User-Agent"),
        stringHeader("Host"),
        stringHeader("Connection"),
        stringHeader("Accept"),
        stringHeader("Accept-Encoding"),
        stringHeader("Expect"),
        stringHeader("Forwarded"),
        stringHeader("If-Modified-Since"),
        stringHeader("If-Range"),
        stringHeader("If-Unmodified-Since"),
        countProperty("Querystring parameters count", request.queryString.length),
        countProperty("Cookies count", request.cookies.length),
    ]).filter(notEmpty);
}
function parseResponseDetails(entry) {
    var response = entry.response;
    var content = response.content;
    var headers = response.headers;
    var stringHeader = function (title, name) {
        if (name === void 0) { name = title; }
        return har_1.getHeaders(headers, name);
    };
    var dateHeader = function (name) {
        var header = har_1.getHeader(headers, name);
        return [name, parse_1.parseAndFormat(header, parse_1.parseDate, parse_1.formatDateLocalized)];
    };
    var contentLength = har_1.getHeader(headers, "Content-Length");
    var contentSize;
    if (content.size && content.size !== -1 && contentLength !== content.size.toString()) {
        contentSize = content.size;
    }
    var contentType = har_1.getHeader(headers, "Content-Type");
    if (entry._contentType && entry._contentType !== contentType) {
        contentType = contentType + " | " + entry._contentType;
    }
    return helpers_1.flattenKvTuple([
        ["Status", response.status + " " + response.statusText],
        ["HTTP Version", response.httpVersion],
        byteSizeProperty("Bytes In (downloaded)", entry._bytesIn),
        byteSizeProperty("Headers Size", response.headersSize),
        byteSizeProperty("Body Size", response.bodySize),
        ["Content-Type", contentType],
        stringHeader("Cache-Control"),
        stringHeader("Content-Encoding"),
        dateHeader("Expires"),
        dateHeader("Last-Modified"),
        stringHeader("Pragma"),
        byteSizeProperty("Content-Length", contentLength),
        byteSizeProperty("Content Size", contentSize),
        byteSizeProperty("Content Compression", content.compression),
        stringHeader("Connection"),
        stringHeader("ETag"),
        stringHeader("Accept-Patch"),
        ["Age", parse_1.parseAndFormat(har_1.getHeader(headers, "Age"), parse_1.parseNonNegative, parse_1.formatSeconds)],
        stringHeader("Allow"),
        stringHeader("Content-Disposition"),
        stringHeader("Location"),
        stringHeader("Strict-Transport-Security"),
        stringHeader("Trailer (for chunked transfer coding)", "Trailer"),
        stringHeader("Transfer-Encoding"),
        stringHeader("Upgrade"),
        stringHeader("Vary"),
        stringHeader("Timing-Allow-Origin"),
        ["Redirect URL", parse_1.parseAndFormat(response.redirectURL, parse_1.parseNonEmpty)],
        ["Comment", parse_1.parseAndFormat(response.comment, parse_1.parseNonEmpty)],
    ]).filter(notEmpty);
}
function parseTimings(entry, start, end) {
    var timings = entry.timings;
    var optionalTiming = function (timing) { return parse_1.parseAndFormat(timing, parse_1.parseNonNegative, parse_1.formatMilliseconds); };
    var total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
    var connectVal = optionalTiming(timings.connect);
    if (timings.ssl && timings.ssl > 0 && timings.connect) {
        // SSL time is also included in the connect field (to ensure backward compatibility with HAR 1.1).
        connectVal = connectVal + " (without TLS: " + optionalTiming(timings.connect - timings.ssl) + ")";
    }
    return [
        ["Total", parse_1.formatMilliseconds(total)],
        ["Blocked", optionalTiming(timings.blocked)],
        ["DNS", optionalTiming(timings.dns)],
        ["Connect", connectVal],
        ["SSL (TLS)", optionalTiming(timings.ssl)],
        ["Send", parse_1.formatMilliseconds(timings.send)],
        ["Wait", parse_1.formatMilliseconds(timings.wait)],
        ["Receive", parse_1.formatMilliseconds(timings.receive)],
    ].filter(notEmpty);
}
/**
 * Data to show in overlay tabs
 * @param  {number} requestID - request number
 * @param  {WaterfallEntry} entry
 */
function getKeys(entry, requestID, startRelative, endRelative) {
    var requestHeaders = entry.request.headers;
    var responseHeaders = entry.response.headers;
    var headerToKvTuple = function (header) { return [header.name, header.value]; };
    return {
        general: parseGeneralDetails(entry, startRelative, requestID),
        request: parseRequestDetails(entry),
        requestHeaders: requestHeaders.map(headerToKvTuple).filter(notEmpty),
        response: parseResponseDetails(entry),
        responseHeaders: responseHeaders.map(headerToKvTuple).filter(notEmpty),
        timings: parseTimings(entry, startRelative, endRelative),
    };
}
exports.getKeys = getKeys;

},{"../helpers/har":2,"../helpers/parse":5,"./helpers":14}],11:[function(require,module,exports){
"use strict";
/**
 * Heuristics used at parse-time for HAR data
 */
Object.defineProperty(exports, "__esModule", { value: true });
var har_1 = require("../helpers/har");
var misc = require("../helpers/misc");
var parse_1 = require("../helpers/parse");
function isCompressible(entry, requestType) {
    var minCompressionSize = 1000;
    // small responses
    if (entry.response.bodySize < minCompressionSize) {
        return false;
    }
    if (misc.contains(["html", "css", "javascript", "svg", "plain"], requestType)) {
        return true;
    }
    var mime = entry.response.content.mimeType;
    var compressableMimes = ["application/vnd.ms-fontobject",
        "application/x-font-opentype",
        "application/x-font-truetype",
        "application/x-font-ttf",
        "application/xml",
        "font/eot",
        "font/opentype",
        "font/otf",
        "image/vnd.microsoft.icon"];
    if (misc.contains(["text"], mime.split("/")[0]) || misc.contains(compressableMimes, mime.split(";")[0])) {
        return true;
    }
    return false;
}
/**
 * Checks if response could be cacheable, but isn't due to lack of cache header.
 * @param {Entry} entry -  the waterfall entry.
 * @returns {boolean}
 */
function hasCacheIssue(entry) {
    if (!entry.request.method || entry.request.method.toLowerCase() !== "get") {
        return false;
    }
    if (entry.response.status === 204 || !misc.isInStatusCodeRange(entry.response.status, 200, 299)) {
        return false;
    }
    var headers = entry.response.headers;
    return !(har_1.hasHeader(headers, "Cache-Control") || har_1.hasHeader(headers, "Expires"));
}
function hasCompressionIssue(entry, requestType) {
    var headers = entry.response.headers;
    return (!har_1.hasHeader(headers, "Content-Encoding") && isCompressible(entry, requestType));
}
/** Checks if the ressource uses https */
function isSecure(entry) {
    return entry.request.url.indexOf("https://") === 0;
}
function isInitialRedirect(entry, index) {
    return index === 0 && !!entry.response.redirectURL;
}
function isPush(entry) {
    if (entry._was_pushed === undefined || entry._was_pushed === null) {
        return false;
    }
    return parse_1.toInt(entry._was_pushed) === 1;
}
/**
 * Check if the document (disregarding any initial http->https redirects) is loaded over a secure connection.
 * @param {Entry[]} data - the waterfall entries data.
 * @returns {boolean}
 */
function documentIsSecure(data) {
    var rootDocument = data.filter(function (e) { return !e.response.redirectURL; })[0];
    // check if request is a redirect chain
    if (rootDocument === undefined) {
        return (data.length > 0) ? isSecure(data[0]) : false;
    }
    return isSecure(rootDocument);
}
exports.documentIsSecure = documentIsSecure;
/** Scans `entry` for noteworthy issues or infos and highlights them */
function collectIndicators(entry, index, docIsTLS, requestType) {
    // const harEntry = entry;
    var output = [];
    if (isPush(entry)) {
        output.push({
            description: "Response was pushed by the server using HTTP2 push.",
            displayType: "inline",
            icon: "push",
            id: "push",
            title: "Response was pushed by the server",
            type: "info",
        });
    }
    if (docIsTLS && !(isSecure(entry) || isInitialRedirect(entry, index))) {
        output.push({
            description: "Insecure request, it should use HTTPS.",
            displayType: "icon",
            id: "noTls",
            title: "Insecure Connection",
            type: "error",
        });
    }
    if (hasCacheIssue(entry)) {
        output.push({
            description: "The response is not allow to be cached on the client. Consider setting 'Cache-Control' headers.",
            displayType: "icon",
            id: "noCache",
            title: "Response not cached",
            type: "error",
        });
    }
    if (hasCompressionIssue(entry, requestType)) {
        output.push({
            description: "The response is not compressed. Consider enabling HTTP compression on your server.",
            displayType: "icon",
            id: "noGzip",
            title: "no gzip",
            type: "error",
        });
    }
    if (!entry.response.content.mimeType &&
        misc.isInStatusCodeRange(entry.response.status, 200, 299) &&
        entry.response.status !== 204) {
        output.push({
            description: "Response doesn't contain a 'Content-Type' header.",
            displayType: "icon",
            id: "warning",
            title: "No MIME Type defined",
            type: "warning",
        });
    }
    return output;
}
exports.collectIndicators = collectIndicators;

},{"../helpers/har":2,"../helpers/misc":4,"../helpers/parse":5}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("../helpers/misc");
var parse_1 = require("../helpers/parse");
var extract_details_keys_1 = require("./extract-details-keys");
var helpers_1 = require("./helpers");
var escapedNewLineRegex = /\\n/g;
var newLineRegex = /\n/g;
var escapedTabRegex = /\\t/g;
/**
 * Generates the tabs for the details-overlay of a `Entry`
 * @param  {Entry} entry - the entry to parse
 * @param  {number} requestID
 * @param  {RequestType} requestType
 * @param  {number} startRelative - start time in ms, relative to the page's start time
 * @param  {number} endRelative - end time in ms, relative to the page's start time
 * @param  {number} detailsHeight - height of the details-overlay
 * @param  {WaterfallEntryIndicator[]} indicators
 * @returns WaterfallEntryTab
 */
function makeTabs(entry, requestID, requestType, startRelative, endRelative, indicators) {
    var tabs = [];
    var tabsData = extract_details_keys_1.getKeys(entry, requestID, startRelative, endRelative);
    tabs.push(makeGeneralTab(tabsData.general, indicators));
    tabs.push(makeRequestTab(tabsData.request, tabsData.requestHeaders));
    tabs.push(makeResponseTab(tabsData.response, tabsData.responseHeaders));
    tabs.push(makeWaterfallEntryTab("Timings", helpers_1.makeDefinitionList(tabsData.timings, true)));
    tabs.push(makeRawData(entry));
    if (requestType === "image") {
        tabs.push(makeImgTab(entry));
    }
    if (entry.response.content && entry.response.content.mimeType.indexOf("text/") === 0 && entry.response.content.text) {
        tabs.push(makeContentTab(entry));
    }
    return tabs.filter(function (t) { return t !== undefined; });
}
exports.makeTabs = makeTabs;
/** Helper to create `WaterfallEntryTab` object literal  */
function makeWaterfallEntryTab(title, content, tabClass) {
    if (tabClass === void 0) { tabClass = ""; }
    return {
        content: content,
        tabClass: tabClass,
        title: title,
    };
}
/** Helper to create `WaterfallEntryTab` object literal that is evaluated lazily at runtime (e.g. for performance) */
function makeLazyWaterfallEntryTab(title, renderContent, tabClass) {
    if (tabClass === void 0) { tabClass = ""; }
    return {
        renderContent: renderContent,
        tabClass: tabClass,
        title: title,
    };
}
/** General tab with warnings etc. */
function makeGeneralTab(generalData, indicators) {
    var mainContent = helpers_1.makeDefinitionList(generalData);
    if (indicators.length === 0) {
        return makeWaterfallEntryTab("General", mainContent);
    }
    var general = "<h2>General</h2>\n<dl>" + mainContent + "<dl>";
    var content = "";
    // Make indicator sections
    var errors = indicators
        .filter(function (i) { return i.type === "error"; })
        .map(function (i) { return [i.title, i.description]; });
    var warnings = indicators
        .filter(function (i) { return i.type === "warning"; })
        .map(function (i) { return [i.title, i.description]; });
    // all others
    var info = indicators
        .filter(function (i) { return i.type !== "error" && i.type !== "warning"; })
        .map(function (i) { return [i.title, i.description]; });
    if (errors.length > 0) {
        content += "<h2 class=\"no-boder\">" + misc_1.pluralize("Error", errors.length) + "</h2>\n    <dl>" + helpers_1.makeDefinitionList(errors) + "</dl>";
    }
    if (warnings.length > 0) {
        content += "<h2 class=\"no-boder\">" + misc_1.pluralize("Warning", warnings.length) + "</h2>\n    <dl>" + helpers_1.makeDefinitionList(warnings) + "</dl>";
    }
    if (info.length > 0) {
        content += "<h2 class=\"no-boder\">Info</h2>\n    <dl>" + helpers_1.makeDefinitionList(info) + "</dl>";
    }
    return makeWaterfallEntryTab("General", content + general);
}
function makeRequestTab(request, requestHeaders) {
    var content = "<dl>\n      " + helpers_1.makeDefinitionList(request) + "\n    </dl>\n    <h2>All Request Headers</h2>\n    <dl>\n      " + helpers_1.makeDefinitionList(requestHeaders) + "\n    </dl>";
    return makeWaterfallEntryTab("Request", content);
}
function makeResponseTab(respose, responseHeaders) {
    var content = "<dl>\n      " + helpers_1.makeDefinitionList(respose) + "\n    </dl>\n    <h2>All Response Headers</h2>\n    <dl>\n      " + helpers_1.makeDefinitionList(responseHeaders) + "\n    </dl>";
    return makeWaterfallEntryTab("Response", content);
}
/** Tab to show the returned (text-based) payload (HTML, CSS, JS etc.) */
function makeContentTab(entry) {
    var escapedText = entry.response.content.text || "";
    var unescapedText = escapedText.replace(escapedNewLineRegex, "\n").replace(escapedTabRegex, "\t");
    var newLines = escapedText.match(newLineRegex);
    var lineCount = newLines ? newLines.length : 1;
    return makeLazyWaterfallEntryTab("Content (" + lineCount + " Line" + (lineCount > 1 ? "s" : "") + ")", function () { return "<pre><code>" + parse_1.escapeHtml(unescapedText) + "</code></pre> "; }, "content rendered-data");
}
function makeRawData(entry) {
    return makeLazyWaterfallEntryTab("Raw Data", function () { return "<pre><code>" + parse_1.escapeHtml(JSON.stringify(entry, null, 2)) + "</code></pre>"; }, "raw-data rendered-data");
}
/** Image preview tab */
function makeImgTab(entry) {
    return makeLazyWaterfallEntryTab("Preview", function (detailsHeight) { return "<img class=\"preview\" style=\"max-height:" + (detailsHeight - 100) + "px\"\n    data-src=\"" + parse_1.sanitizeUrlForLink(entry.request.url) + "\" />"; });
}

},{"../helpers/misc":4,"../helpers/parse":5,"./extract-details-keys":10,"./helpers":14}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("../helpers/misc");
var parse_1 = require("../helpers/parse");
var har_heuristics_1 = require("./har-heuristics");
var har_tabs_1 = require("./har-tabs");
var helpers_1 = require("./helpers");
/**
 * Transforms the full HAR doc, including all pages
 * @param  {Har} harData - raw HAR object
 * @param {HarTransformerOptions} options - HAR-parser-specific options
 * @returns WaterfallDocs
 */
function transformDoc(harData, options) {
    // make sure it's the *.log base node
    var data = (harData["log"] !== undefined ? harData["log"] : harData);
    var pages = getPages(data);
    return {
        pages: pages.map(function (_page, i) { return transformPage(data, i, options); }),
    };
}
exports.transformDoc = transformDoc;
/**
 * Converts an HAR `Entry` into PerfCascads `WaterfallEntry`
 *
 * @param  {Entry} entry
 * @param  {number} index - resource entry index
 * @param  {number} startRelative - entry start time relative to the document in ms
 * @param  {boolean} isTLS
 */
function toWaterFallEntry(entry, index, startRelative, isTLS) {
    startRelative = Math.round(startRelative);
    var endRelative = Math.round(parse_1.toInt(entry._all_end) || (startRelative + entry.time));
    var requestType = helpers_1.mimeToRequestType(entry.response.content.mimeType);
    var indicators = har_heuristics_1.collectIndicators(entry, index, isTLS, requestType);
    var responseDetails = createResponseDetails(entry, indicators);
    return helpers_1.createWaterfallEntry(entry.request.url, startRelative, endRelative, buildDetailTimingBlocks(startRelative, entry), responseDetails, har_tabs_1.makeTabs(entry, (index + 1), requestType, startRelative, endRelative, indicators));
}
/** retuns the page or a mock page object */
var getPages = function (data) {
    if (data.pages && data.pages.length > 0) {
        return data.pages;
    }
    var statedTime = data.entries.reduce(function (earliest, curr) {
        var currDate = Date.parse(curr.startedDateTime);
        var earliestDate = Date.parse(earliest);
        return earliestDate < currDate ? earliest : curr.startedDateTime;
    }, data.entries[0].startedDateTime);
    return [{
            id: "",
            pageTimings: {},
            startedDateTime: statedTime,
            title: "n/a",
        }];
};
/**
 * Transforms a HAR object into the format needed to render the PerfCascade
 * @param  {Har} harData - HAR document
 * @param {number=0} pageIndex - page to parse (for multi-page HAR)
 * @param {ChartOptions} options - HAR-parser-specific options
 * @returns WaterfallData
 */
function transformPage(harData, pageIndex, options) {
    if (pageIndex === void 0) { pageIndex = 0; }
    // make sure it's the *.log base node
    var data = (harData["log"] !== undefined ? harData["log"] : harData);
    var pages = getPages(data);
    var currPage = pages[pageIndex];
    if (!currPage.startedDateTime) {
        throw new TypeError("Invalid HAR document: \"log.pages[" + pageIndex + "].startedDateTime\" is not set");
    }
    var pageStartTime = new Date(currPage.startedDateTime).getTime();
    var pageTimings = currPage.pageTimings;
    var doneTime = 0;
    var isTLS = har_heuristics_1.documentIsSecure(data.entries);
    var entries = data.entries
        .filter(function (entry) {
        // filter inline data
        if (entry.request.url.indexOf("data:") === 0 || entry.request.url.indexOf("javascript:") === 0) {
            return false;
        }
        if (pages.length === 1 && currPage.id === "") {
            return true;
        }
        return entry.pageref === currPage.id;
    })
        .map(function (entry, index) {
        var startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime;
        if (!isNaN(startRelative)) {
            doneTime = Math.max(doneTime, startRelative + entry.time);
        }
        else {
            // tslint:disable-next-line:no-console
            console.warn("Entry has no valid 'startedDateTime' time", entry.request.url, entry);
        }
        return toWaterFallEntry(entry, index, startRelative, isTLS);
    });
    var marks = getMarks(pageTimings, currPage, options);
    // if marks happens later than doneTime, increase the doneTime
    marks.forEach(function (mark) {
        if (mark.startTime > doneTime) {
            doneTime = mark.startTime;
        }
    });
    // if we configured fixed length from the outside, use that!
    if (options.fixedLengthMs) {
        doneTime = options.fixedLengthMs;
    }
    // Add 100ms margin to make room for labels
    doneTime += 100;
    return {
        docIsTLS: isTLS,
        durationMs: doneTime,
        entries: entries,
        marks: marks,
        title: currPage.title,
    };
}
exports.transformPage = transformPage;
/**
 * Extract all `Mark`s based on `PageTiming` and `UserTiming`
 * @param {PageTiming} pageTimings - HARs `PageTiming` object
 * @param {Page} currPage - active page
 * @param {ChartOptions} options - HAR options
 */
var getMarks = function (pageTimings, currPage, options) {
    if (pageTimings === undefined) {
        return [];
    }
    var sortFn = function (a, b) { return a.startTime - b.startTime; };
    var marks = Object.keys(pageTimings)
        .filter(function (k) { return (typeof pageTimings[k] === "number" && pageTimings[k] >= 0); })
        .map(function (k) { return ({
        name: parse_1.escapeHtml(k.replace(/^[_]/, "")) + " (" + misc_1.roundNumber(pageTimings[k], 0) + " ms)",
        startTime: pageTimings[k],
    }); });
    if (!options.showUserTiming) {
        return marks.sort(sortFn);
    }
    return getUserTimimngs(currPage, options)
        .concat(marks)
        .sort(sortFn);
};
/**
 * Extract all `Mark`s based on `UserTiming`
 * @param {Page} currPage - active page
 * @param {ChartOptions} options - HAR options
 */
var getUserTimimngs = function (currPage, options) {
    var baseFilter = options.showUserTimingEndMarker ?
        function (k) { return k.indexOf("_userTime.") === 0; } :
        function (k) { return k.indexOf("_userTime.") === 0 && k.indexOf("_userTime.endTimer-") !== 0; };
    var filterFn = baseFilter;
    if (Array.isArray(options.showUserTiming)) {
        var findTimings_1 = options.showUserTiming;
        filterFn = function (k) { return (baseFilter(k) &&
            findTimings_1.indexOf(k.replace(/^_userTime\./, "")) >= 0); };
    }
    var findName = /^_userTime\.((?:startTimer-)?(.+))$/;
    var extractUserTiming = function (k) {
        var _a;
        var name;
        var fullName;
        var duration;
        _a = findName.exec(k) || [, undefined, undefined], fullName = _a[1], name = _a[2];
        fullName = parse_1.escapeHtml(fullName);
        name = parse_1.escapeHtml(name);
        if (fullName !== name && currPage["_userTime.endTimer-" + name]) {
            duration = currPage["_userTime.endTimer-" + name] - currPage[k];
            return {
                duration: duration,
                name: (options.showUserTimingEndMarker ? fullName : name) + " (" + currPage[k] + " - " + (currPage[k] + duration) + " ms)",
                startTime: currPage[k],
            };
        }
        return {
            name: fullName,
            startTime: currPage[k],
        };
    };
    return Object.keys(currPage)
        .filter(filterFn)
        .map(extractUserTiming);
};
/**
 * Create `WaterfallEntry`s to represent the subtimings of a request
 * ("blocked", "dns", "connect", "send", "wait", "receive")
 * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
 * @param  {Entry} harEntry
 * @returns Array
 */
var buildDetailTimingBlocks = function (startRelative, harEntry) {
    var t = harEntry.timings;
    var types = ["blocked", "dns", "connect", "send", "wait", "receive"];
    return types.reduce(function (collect, key) {
        var time = getTimePair(key, harEntry, collect, startRelative);
        if (time.end && time.start >= time.end) {
            return collect;
        }
        // special case for 'connect' && 'ssl' since they share time
        // http://www.softwareishard.com/blog/har-12-spec/#timings
        if (key === "connect" && t.ssl && t.ssl !== -1) {
            var sslStart = parseInt("" + harEntry["_ssl_start"], 10) || time.start;
            var sslEnd = parseInt("" + harEntry["_ssl_end"], 10) || time.start + t.ssl;
            var connectStart = (!!parseInt("" + harEntry["_ssl_start"], 10)) ? time.start : sslEnd;
            return collect
                .concat([helpers_1.createWaterfallEntryTiming("ssl", Math.round(sslStart), Math.round(sslEnd))])
                .concat([helpers_1.createWaterfallEntryTiming(key, Math.round(connectStart), Math.round(time.end))]);
        }
        return collect.concat([helpers_1.createWaterfallEntryTiming(key, Math.round(time.start), Math.round(time.end))]);
    }, []);
};
/**
 * Returns Object containing start and end time of `collect`
 *
 * @param  {string} key
 * @param  {Entry} harEntry
 * @param  {WaterfallEntry[]} collect
 * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
 * @returns {Object}
 */
var getTimePair = function (key, harEntry, collect, startRelative) {
    var wptKey;
    switch (key) {
        case "wait":
            wptKey = "ttfb";
            break;
        case "receive":
            wptKey = "download";
            break;
        default: wptKey = key;
    }
    var preciseStart = parseInt(harEntry["_" + wptKey + "_start"], 10);
    var preciseEnd = parseInt(harEntry["_" + wptKey + "_end"], 10);
    var start = isNaN(preciseStart) ?
        ((collect.length > 0) ? collect[collect.length - 1].end : startRelative) : preciseStart;
    var end = isNaN(preciseEnd) ? (start + harEntry.timings[key]) : preciseEnd;
    return {
        end: Math.round(end),
        start: Math.round(start),
    };
};
/**
 * Helper to create a requests `WaterfallResponseDetails`
 *
 * @param  {Entry} entry
 * @param  {WaterfallEntryIndicator[]} indicators
 * @returns WaterfallResponseDetails
 */
var createResponseDetails = function (entry, indicators) {
    var requestType = helpers_1.mimeToRequestType(entry.response.content.mimeType);
    var statusClean = parse_1.toInt(entry.response.status) || 0;
    return {
        icon: helpers_1.makeMimeTypeIcon(statusClean, entry.response.statusText, requestType, entry.response.redirectURL),
        indicators: indicators,
        requestType: requestType,
        rowClass: helpers_1.makeRowCssClasses(statusClean),
        statusCode: statusClean,
    };
};

},{"../helpers/misc":4,"../helpers/parse":5,"./har-heuristics":11,"./har-tabs":12,"./helpers":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Helpers that are not file-fromat specific */
var misc_1 = require("../helpers/misc");
var parse_1 = require("../helpers/parse");
var svg_indicators_1 = require("../waterfall/row/svg-indicators");
/** Escapes all HTML except linebreaks `<br/>` */
var escapeHtmlLight = function (str) { return parse_1.escapeHtml(str).replace("&ltbr/&gt", "<br/>"); };
/**
 * Converts `dlKeyValues` to the contennd a definition list, without the outer `<dl>` tags
 * @param {SafeKvTuple[]} dlKeyValues array of Key/Value pair
 * @param {boolean} [addClass=false] if `true` the key in `dlKeyValues`
 * is converted to a class name andd added to the `<dt>`
 * @returns {string} stringified HTML definition list
 */
function makeDefinitionList(dlKeyValues, addClass) {
    if (addClass === void 0) { addClass = false; }
    var makeClass = function (key) {
        if (!addClass) {
            return "";
        }
        var className = misc_1.toCssClass(key) || "no-colour";
        return "class=\"" + className + "\"";
    };
    return dlKeyValues
        .map(function (tuple) { return "\n      <dt " + makeClass(tuple[0]) + ">" + escapeHtmlLight(tuple[0]) + "</dt>\n      <dd>" + escapeHtmlLight(tuple[1]) + "</dd>\n    "; }).join("");
}
exports.makeDefinitionList = makeDefinitionList;
/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType - a HTTP headers mime-type
 */
function mimeToRequestType(mimeType) {
    if (mimeType === undefined) {
        return "other";
    }
    var types = mimeType.split("/");
    var part2 = types[1];
    // take care of text/css; charset=UTF-8 etc
    if (part2 !== undefined) {
        part2 = part2.indexOf(";") > -1 ? part2.split(";")[0] : part2;
    }
    switch (types[0]) {
        case "image": {
            if (part2 === "svg+xml") {
                return "svg";
            }
            return "image";
        }
        case "font": return "font";
        case "video": return "video";
        case "audio": return "audio";
        default: break;
    }
    switch (part2) {
        case "xml":
        case "html": return "html";
        case "plain": return "plain";
        case "css": return "css";
        case "vnd.ms-fontobject":
        case "font-woff":
        case "font-woff2":
        case "x-font-truetype":
        case "x-font-opentype":
        case "x-font-woff": return "font";
        case "javascript":
        case "x-javascript":
        case "script":
        case "json": return "javascript";
        case "x-shockwave-flash": return "flash";
        default: return "other";
    }
}
exports.mimeToRequestType = mimeToRequestType;
/** helper to create a `WaterfallEntry` */
function createWaterfallEntry(url, start, end, segments, responseDetails, tabs) {
    if (segments === void 0) { segments = []; }
    var total = (typeof start !== "number" || typeof end !== "number") ? NaN : (end - start);
    return {
        end: end,
        responseDetails: responseDetails,
        segments: segments,
        start: start,
        tabs: tabs,
        total: total,
        url: url,
    };
}
exports.createWaterfallEntry = createWaterfallEntry;
/** helper to create a `WaterfallEntryTiming` */
function createWaterfallEntryTiming(type, start, end) {
    var total = (typeof start !== "number" || typeof end !== "number") ? NaN : (end - start);
    var typeClean = parse_1.sanitizeAlphaNumeric(type);
    return {
        end: end,
        start: start,
        total: total,
        type: typeClean,
    };
}
exports.createWaterfallEntryTiming = createWaterfallEntryTiming;
/**
 * Creates the css classes for a row based on it's status code
 * @param  {number} status - HTTP status code
 * @returns string - concatinated css class names
 */
function makeRowCssClasses(status) {
    var classes = ["row-item"];
    if (misc_1.isInStatusCodeRange(status, 500, 599)) {
        classes.push("status5xx");
    }
    else if (misc_1.isInStatusCodeRange(status, 400, 499)) {
        classes.push("status4xx");
    }
    else if (status !== 304 &&
        misc_1.isInStatusCodeRange(status, 300, 399)) {
        // 304 == Not Modified, so not an issue
        classes.push("status3xx");
    }
    return classes.join(" ");
}
exports.makeRowCssClasses = makeRowCssClasses;
/**
 * Create icon that fits the response and highlights issues
 *
 * @param  {number} status - HTTP status code
 * @param  {string} statusText - HTTP status text
 * @param  {RequestType} requestType
 * @param  {string=""} redirectURL - pass the URL for `301` or `302`
 * @returns Icon
 */
function makeMimeTypeIcon(status, statusText, requestType, redirectURL) {
    if (redirectURL === void 0) { redirectURL = ""; }
    // highlight redirects
    if (!!redirectURL) {
        var url = encodeURI(redirectURL.split("?")[0] || "");
        return svg_indicators_1.makeIcon("err3xx", status + " response status: Redirect to " + parse_1.escapeHtml(url) + "...");
    }
    else if (misc_1.isInStatusCodeRange(status, 400, 499)) {
        return svg_indicators_1.makeIcon("err4xx", status + " response status: " + parse_1.escapeHtml(statusText));
    }
    else if (misc_1.isInStatusCodeRange(status, 500, 599)) {
        return svg_indicators_1.makeIcon("err5xx", status + " response status: " + parse_1.escapeHtml(statusText));
    }
    else if (status === 204) {
        return svg_indicators_1.makeIcon("plain", "No content");
    }
    else {
        return svg_indicators_1.makeIcon(parse_1.sanitizeAlphaNumeric(requestType), parse_1.escapeHtml(requestType));
    }
}
exports.makeMimeTypeIcon = makeMimeTypeIcon;
/**
 * Flattens out a second level of `KvTuple` nesting (and removed empty and `undefined` entries)
 *
 * @param nestedKvPairs - nested `KvTuple`s (possibly sub-nested)
 */
exports.flattenKvTuple = function (nestedKvPairs) {
    var returnKv = [];
    nestedKvPairs.forEach(function (maybeKv) {
        if (maybeKv === undefined || maybeKv.length === 0) {
            return;
        }
        if (Array.isArray(maybeKv[0])) {
            returnKv.push.apply(returnKv, maybeKv);
            return;
        }
        returnKv.push(maybeKv);
    });
    return returnKv;
};

},{"../helpers/misc":4,"../helpers/parse":5,"../waterfall/row/svg-indicators":20}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert a RequestType into a CSS class
 * @param {RequestType} requestType
 */
function requestTypeToCssClass(requestType) {
    return "block-" + requestType;
}
exports.requestTypeToCssClass = requestTypeToCssClass;
/**
 * Convert a TimingType into a CSS class
 * @param {TimingType} timingType
 */
function timingTypeToCssClass(timingType) {
    return "block-" + timingType;
}
exports.timingTypeToCssClass = timingTypeToCssClass;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var parse_1 = require("../../helpers/parse");
/**
 * Creates the HTML body for the overlay
 *
 * _All tabable elements are set to `tabindex="-1"` to avoid tabing issues_
 * @param requestID ID
 * @param detailsHeight
 * @param entry
 */
function createDetailsBody(requestID, detailsHeight, entry) {
    var html = dom_1.makeHtmlEl();
    var body = dom_1.makeBodyEl();
    var tabMenu = entry.tabs.map(function (t) {
        return "<li><button class=\"tab-button\">" + t.title + "</button></li>";
    }).join("\n");
    var tabBody = entry.tabs.map(function (t) {
        var cssClasses = "tab";
        if (t.tabClass) {
            cssClasses += " " + t.tabClass;
        }
        var content = "";
        if (t.content) {
            content = t.content;
        }
        else if (typeof t.renderContent === "function") {
            content = t.renderContent(detailsHeight);
            // keep content for later
            t.content = content;
        }
        else {
            throw TypeError("Invalid Details Tab");
        }
        return "<div class=\"tab " + cssClasses + "\">" + content + "</div>";
    }).join("\n");
    body.innerHTML = "\n    <div class=\"wrapper\">\n      <header class=\"type-" + entry.responseDetails.requestType + "\">\n        <h3><strong>#" + requestID + "</strong> <a href=\"" + parse_1.sanitizeUrlForLink(entry.url) + "\">\n          " + parse_1.escapeHtml(entry.url) + "\n        </a></h3>\n        <nav class=\"tab-nav\">\n          <ul>\n            " + tabMenu + "\n          </ul>\n        </nav>\n      </header>\n      " + tabBody + "\n    </div>\n    ";
    html.appendChild(body);
    return html;
}
exports.createDetailsBody = createDetailsBody;

},{"../../helpers/dom":1,"../../helpers/parse":5}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var misc_1 = require("../../helpers/misc");
var svg_details_overlay_1 = require("./svg-details-overlay");
/** Overlay (popup) instance manager */
var OverlayManager = /** @class */ (function () {
    function OverlayManager(context) {
        this.context = context;
        /** Collection of currely open overlays */
        this.openOverlays = [];
        /**
         * Sets the offset for a request-bar
         * @param {SVGAElement[]} rowItems
         * @param {number} offset
         */
        this.realignRow = function (rowItem, offset) {
            rowItem.setAttribute("transform", "translate(0, " + offset + ")");
        };
    }
    /** all open overlays height combined */
    OverlayManager.prototype.getCombinedOverlayHeight = function () {
        return this.openOverlays.reduce(function (pre, curr) { return pre + (curr.height || 0); }, 0);
    };
    /**
     * Opens an overlay - rerenders others internaly
     */
    OverlayManager.prototype.openOverlay = function (index, y, detailsHeight, entry, rowItems) {
        if (this.openOverlays.some(function (o) { return o.index === index; })) {
            return;
        }
        var self = this;
        var newOverlay = {
            defaultY: y,
            entry: entry,
            index: index,
            onClose: function () {
                self.closeOverlay(index, detailsHeight, rowItems);
            },
            openTabIndex: 0,
        };
        this.openOverlays.push(newOverlay);
        this.openOverlays = this.openOverlays.sort(function (a, b) { return a.index > b.index ? 1 : -1; });
        this.renderOverlays(detailsHeight, rowItems);
        this.context.pubSub.publishToOverlayChanges({
            changedIndex: index,
            combinedOverlayHeight: self.getCombinedOverlayHeight(),
            type: "open",
        });
    };
    /**
     * Toggles an overlay - rerenders others
     */
    OverlayManager.prototype.toggleOverlay = function (index, y, detailsHeight, entry, rowItems) {
        if (this.openOverlays.some(function (o) { return o.index === index; })) {
            this.closeOverlay(index, detailsHeight, rowItems);
        }
        else {
            this.openOverlay(index, y, detailsHeight, entry, rowItems);
        }
    };
    /**
     * closes on overlay - rerenders others internally
     */
    OverlayManager.prototype.closeOverlay = function (index, detailsHeight, rowItems) {
        var self = this;
        this.openOverlays.splice(this.openOverlays.reduce(function (prev, curr, i) {
            return (curr.index === index) ? i : prev;
        }, -1), 1);
        this.renderOverlays(detailsHeight, rowItems);
        this.context.pubSub.publishToOverlayChanges({
            changedIndex: index,
            combinedOverlayHeight: self.getCombinedOverlayHeight(),
            type: "closed",
        });
    };
    /**
     * Renders / Adjusts Overlays
     *
     * @summary this is to re-set the "y" position since there is a bug in chrome with
     * tranform of an SVG and positioning/scoll of a foreignObjects
     * @param  {number} detailsHeight
     * @param  {SVGAElement[]} rowItems
     */
    OverlayManager.prototype.renderOverlays = function (detailsHeight, rowItems) {
        var _this = this;
        /** shared variable to keep track of heigth */
        var currY = 0;
        var updateHeight = function (overlay, y, currHeight) {
            currY += currHeight;
            overlay.actualY = y;
            overlay.height = currHeight;
        };
        var addNewOverlay = function (overlayHolder, overlay) {
            var y = overlay.defaultY + currY;
            var infoOverlay = svg_details_overlay_1.createRowInfoOverlay(overlay, y, detailsHeight);
            // if overlay has a preview image show it
            var previewImg = infoOverlay.querySelector("img.preview");
            if (previewImg && !previewImg.src) {
                previewImg.setAttribute("src", (previewImg.attributes.getNamedItem("data-src") || { value: "" }).value);
            }
            infoOverlay.querySelector("a")
                .addEventListener("keydown", OverlayManager.firstElKeypress);
            dom_1.getLastItemOfNodeList(infoOverlay.querySelectorAll("button"))
                .addEventListener("keydown", OverlayManager.lastElKeypress);
            overlayHolder.appendChild(infoOverlay);
            updateHeight(overlay, y, infoOverlay.getBoundingClientRect().height);
        };
        var updateRow = function (rowItem, index) {
            var overlay = misc_1.find(_this.openOverlays, function (o) { return o.index === index; });
            var nextRowItem = rowItem.nextElementSibling;
            var overlayEl = nextRowItem.firstElementChild;
            _this.realignRow(rowItem, currY);
            if (overlay === undefined) {
                if (overlayEl && nextRowItem !== null) {
                    // remove closed overlay
                    nextRowItem.querySelector("a")
                        .removeEventListener("keydown", OverlayManager.firstElKeypress);
                    dom_1.getLastItemOfNodeList(nextRowItem.querySelectorAll("button"))
                        .removeEventListener("keydown", OverlayManager.lastElKeypress);
                    dom_1.removeChildren(nextRowItem);
                }
                return; // not open
            }
            if (overlayEl && overlay.actualY !== undefined) {
                var bg = overlayEl.querySelector(".info-overlay-bg");
                var fo = overlayEl.querySelector("foreignObject");
                var btnRect = overlayEl.querySelector(".info-overlay-close-btn rect");
                var btnText = overlayEl.querySelector(".info-overlay-close-btn text");
                updateHeight(overlay, overlay.defaultY + currY, overlay.height);
                // needs updateHeight
                bg.setAttribute("y", overlay.actualY.toString());
                fo.setAttribute("y", overlay.actualY.toString());
                btnText.setAttribute("y", overlay.actualY.toString());
                btnRect.setAttribute("y", overlay.actualY.toString());
                return;
            }
            addNewOverlay(rowItem.nextElementSibling, overlay);
        };
        rowItems.forEach(updateRow);
    };
    OverlayManager.showFullName = function (el) {
        el.getElementsByClassName("row-fixed").item(0)
            .dispatchEvent(new MouseEvent("mouseenter"));
    };
    /**
     * Keypress Event handler for fist el in Overlay,
     * to manage highlighting of the element above
     */
    OverlayManager.firstElKeypress = function (evt) {
        if (misc_1.isTabUp(evt)) {
            var par = dom_1.getParentByClassName(evt.target, "row-overlay-holder");
            if (par && par.previousElementSibling) {
                OverlayManager.showFullName(par.previousElementSibling);
            }
        }
    };
    /**
     * Keypress Event handler for last el in Overlay,
     * to manage highlighting of the element below
     */
    OverlayManager.lastElKeypress = function (evt) {
        if (misc_1.isTabDown(evt)) {
            var par = dom_1.getParentByClassName(evt.target, "row-overlay-holder");
            if (par && par.nextElementSibling) {
                OverlayManager.showFullName(par.nextElementSibling);
            }
        }
    };
    return OverlayManager;
}());
exports.OverlayManager = OverlayManager;
exports.default = OverlayManager;

},{"../../helpers/dom":1,"../../helpers/misc":4,"./svg-details-overlay":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PubSub = /** @class */ (function () {
    function PubSub() {
        this.subscribers = [];
    }
    /** Call `fn` whenever a new change is publisched on OverlayChanges channel */
    PubSub.prototype.subscribeToOverlayChanges = function (fn) {
        this.subscribers.push(fn);
    };
    /**
     * Call `fn` whenever a new change for `index` are publisched
     * on OverlayChanges channel
     */
    PubSub.prototype.subscribeToSpecificOverlayChanges = function (index, fn) {
        this.subscribers.push(function (evt) {
            if (evt.changedIndex === index) {
                fn(evt);
            }
        });
    };
    /** Publish a change on OverlayChanges channel  */
    PubSub.prototype.publishToOverlayChanges = function (change) {
        this.subscribers.forEach(function (fn) { return fn(change); });
    };
    return PubSub;
}());
exports.PubSub = PubSub;
exports.default = PubSub;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var svg = require("../../helpers/svg");
var html_details_body_1 = require("./html-details-body");
function createCloseButtonSvg(y) {
    var closeBtn = svg.newA("info-overlay-close-btn");
    closeBtn.appendChild(svg.newRect({
        height: 23,
        width: 23,
        x: "100%",
        y: y,
    }));
    closeBtn.appendChild(svg.newTextEl("✕", {
        dx: 7,
        dy: 16,
        x: "100%",
        y: y,
    }));
    closeBtn.appendChild(svg.newTitle("Close Overlay"));
    return closeBtn;
}
function createHolder(y, detailsHeight) {
    var holder = svg.newG("info-overlay-holder");
    var bg = svg.newRect({
        height: detailsHeight,
        rx: 2,
        ry: 2,
        width: "100%",
        x: "0",
        y: y,
    }, "info-overlay-bg");
    holder.appendChild(bg);
    return holder;
}
function createRowInfoOverlay(overlay, y, detailsHeight) {
    var requestID = overlay.index + 1;
    var holder = createHolder(y, detailsHeight);
    var foreignObject = svg.newForeignObject({
        height: detailsHeight,
        width: "100%",
        x: "0",
        y: y,
    });
    var closeBtn = createCloseButtonSvg(y);
    closeBtn.addEventListener("click", function () { return overlay.onClose(overlay.index); });
    var body = html_details_body_1.createDetailsBody(requestID, detailsHeight, overlay.entry);
    // need to re-fetch the elements to fix Edge "Invalid Calling Object" bug
    var getButtons = function () { return body.getElementsByClassName("tab-button"); };
    var getTabs = function () { return body.getElementsByClassName("tab"); };
    var setTabStatus = function (tabIndex) {
        overlay.openTabIndex = tabIndex;
        dom_1.forEachNodeList(getTabs(), function (tab, j) {
            tab.style.display = (tabIndex === j) ? "block" : "none";
            getButtons().item(j).classList.toggle("active", (tabIndex === j));
        });
    };
    dom_1.forEachNodeList(getButtons(), function (btn, tabIndex) {
        btn.addEventListener("click", function () { return setTabStatus(tabIndex); });
    });
    setTabStatus(overlay.openTabIndex);
    foreignObject.appendChild(body);
    holder.appendChild(foreignObject);
    holder.appendChild(closeBtn);
    return holder;
}
exports.createRowInfoOverlay = createRowInfoOverlay;

},{"../../helpers/dom":1,"../../helpers/svg":6,"./html-details-body":16}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("../../helpers/misc");
/**
 * Convinience helper to create a new `Icon`
 *
 * _Width of icons is fixed_
 */
function makeIcon(type, title) {
    return { type: type, title: title, width: 20 };
}
exports.makeIcon = makeIcon;
/**
 * Gets the Indicators in Icon format
 * @param  {WaterfallEntry} entry
 * @returns {Icon[]}
 */
function getIndicatorIcons(entry) {
    var indicators = entry.responseDetails.indicators.filter(function (i) { return i.displayType === "icon"; });
    if (indicators.length === 0) {
        return [];
    }
    var combinedTitle = [];
    var icon = "";
    var errors = indicators.filter(function (i) { return i.type === "error"; });
    var warnings = indicators.filter(function (i) { return i.type === "warning"; });
    var info = indicators.filter(function (i) { return i.type !== "error" && i.type !== "warning"; });
    if (errors.length > 0) {
        combinedTitle.push(misc_1.pluralize("Error", errors.length) + ":\n " + errors.map(function (e) { return e.title; }).join("\n"));
        icon = "error";
    }
    if (warnings.length > 0) {
        combinedTitle.push(misc_1.pluralize("Warning", warnings.length) + ":\n" + warnings.map(function (w) { return w.title; }).join("\n"));
        icon = icon || "warning";
    }
    if (info.length > 0) {
        combinedTitle.push("Info:\n" + info.map(function (i) { return i.title; }).join("\n"));
        if (!icon && info.length === 1) {
            icon = info[0].icon || info[0].type;
        }
        else {
            icon = icon || "info";
        }
    }
    return [makeIcon(icon, combinedTitle.join("\n"))];
}
exports.getIndicatorIcons = getIndicatorIcons;

},{"../../helpers/misc":4}],21:[function(require,module,exports){
"use strict";
/**
 * Creation of sub-components used in a ressource request row
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var misc = require("../../helpers/misc");
var svg = require("../../helpers/svg");
var styling_converters_1 = require("../../transformers/styling-converters");
var svg_tooltip_1 = require("./svg-tooltip");
/**
 * Creates the `rect` that represent the timings in `rectData`
 * @param  {RectData} rectData - Data for block
 * @param  {string} className - className for block `rect`
 */
function makeBlock(rectData, className) {
    var holder = svg.newG("");
    var blockHeight = rectData.height - 1;
    var rectX = misc.roundNumber(rectData.x / rectData.unit) + "%";
    var rect = svg.newRect({
        height: blockHeight,
        width: misc.roundNumber(rectData.width / rectData.unit) + "%",
        x: rectX,
        y: rectData.y,
    }, className);
    holder.appendChild(rect);
    if (rectData.label) {
        var showDelayTimeOut_1;
        var foreignElLazy_1;
        rect.addEventListener("mouseenter", function () {
            if (!foreignElLazy_1) {
                foreignElLazy_1 = dom_1.getParentByClassName(rect, "water-fall-chart")
                    .querySelector(".tooltip");
            }
            showDelayTimeOut_1 = setTimeout(function () {
                showDelayTimeOut_1 = null;
                svg_tooltip_1.onHoverInShowTooltip(rect, rectData, foreignElLazy_1);
            }, 100);
        });
        rect.addEventListener("mouseleave", function () {
            if (showDelayTimeOut_1) {
                clearTimeout(showDelayTimeOut_1);
            }
            else {
                svg_tooltip_1.onHoverOutShowTooltip(rect);
            }
        });
    }
    if (rectData.showOverlay && rectData.hideOverlay) {
        rect.addEventListener("mouseenter", rectData.showOverlay(rectData));
        rect.addEventListener("mouseleave", rectData.hideOverlay(rectData));
    }
    return holder;
}
/**
 * Converts a segment to RectData
 * @param  {WaterfallEntryTiming} segment
 * @param  {RectData} rectData
 * @returns RectData
 */
function segmentToRectData(segment, rectData) {
    var total = (!isNaN(segment.total)) ? "<br/>total: " + Math.round(segment.total) + "ms" : "";
    return {
        cssClass: styling_converters_1.timingTypeToCssClass(segment.type),
        height: (rectData.height - 6),
        hideOverlay: rectData.hideOverlay,
        label: "<strong>" + segment.type + "</strong><br/>" +
            (Math.round(segment.start) + "ms - " + Math.round(segment.end) + "ms" + total),
        showOverlay: rectData.showOverlay,
        unit: rectData.unit,
        width: segment.total,
        x: segment.start || 0.001,
        y: rectData.y,
    };
}
/**
 * @param  {RectData} rectData
 * @param  {number} timeTotal
 * @param  {number} firstX
 * @returns SVGTextElement
 */
function createTimingLabel(rectData, timeTotal, firstX) {
    var minWidth = 500; // minimum supported diagram width that should show the timing label uncropped
    var spacingPerc = (5 / minWidth * 100);
    var y = rectData.y + rectData.height / 1.5;
    var totalLabel = Math.round(timeTotal) + " ms";
    var percStart = (rectData.x + rectData.width) / rectData.unit + spacingPerc;
    var txtEl = svg.newTextEl(totalLabel, { x: misc.roundNumber(percStart) + "%", y: y });
    // (pessimistic) estimation of text with to avoid performance penalty of `getBBox`
    var roughTxtWidth = totalLabel.length * 8;
    if (percStart + (roughTxtWidth / minWidth * 100) > 100) {
        percStart = firstX / rectData.unit - spacingPerc;
        txtEl = svg.newTextEl(totalLabel, { x: misc.roundNumber(percStart) + "%", y: y }, { textAnchor: "end" });
    }
    return txtEl;
}
function createPushIndicator(rectData) {
    var y = rectData.y + rectData.height / 1.5;
    var x = misc.roundNumber(rectData.x / rectData.unit) + "%";
    var el = svg.newG("http2-inidicator-holder");
    el.appendChild(svg.newTextEl("→", {
        transform: "translate(-5)",
        x: x,
        y: y,
    }, {
        "fillOpacity": "0.6",
        "text-anchor": "end",
    }));
    el.appendChild(svg.newTitle("http2 Push"));
    return el;
}
/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {WaterfallEntry}   entry Request Details, e.g. Request and Timing Data
 * @return {SVGElement}       Renerated SVG (rect or g element)
 */
function createRect(rectData, entry) {
    var segments = entry.segments;
    var rect = makeBlock(rectData, "time-block " + rectData.cssClass);
    var rectHolder = svg.newG("rect-holder");
    var firstX = rectData.x;
    rectHolder.appendChild(rect);
    if (segments && segments.length > 0) {
        segments.forEach(function (segment) {
            if (!isNaN(segment.total) && segment.total > 0 && typeof segment.start === "number") {
                var childRectData = segmentToRectData(segment, rectData);
                var childRect = makeBlock(childRectData, "segment " + childRectData.cssClass);
                firstX = Math.min(firstX, childRectData.x);
                rectHolder.appendChild(childRect);
            }
        });
        if (misc.find(entry.responseDetails.indicators, function (indicator) { return indicator.id === "push"; })) {
            rectHolder.appendChild(createPushIndicator(rectData));
        }
        rectHolder.appendChild(createTimingLabel(rectData, entry.total, firstX));
    }
    return rectHolder;
}
exports.createRect = createRect;
/**
 * Create a SVG text element for the request number label, right aligned within the specified width.
 * @param {number} x horizontal position (in px).
 * @param {number} y vertical position of related request block (in px).
 * @param {string} requestNumber the request number string
 * @param {number} height height of row
 * @param {number} width width of the space within the right align the label.
 * @returns {SVGTextElement}
 */
function createRequestNumberLabel(x, y, requestNumber, height, width) {
    y += Math.round(height / 2) + 5;
    x += width;
    return svg.newTextEl(requestNumber, { x: x, y: y }, { "text-anchor": "end" });
}
exports.createRequestNumberLabel = createRequestNumberLabel;
/**
 * Create a new clipper SVG Text element to label a request block to fit the left panel width
 * @param  {number}         x                horizontal position (in px)
 * @param  {number}         y                vertical position of related request block (in px)
 * @param  {string}         name             URL
 * @param  {number}         height           height of row
 * @return {SVGTextElement}                  label SVG element
 */
function createRequestLabelClipped(x, y, name, height) {
    var blockLabel = createRequestLabel(x, y, name, height);
    blockLabel.style.clipPath = "url(#titleClipPath)";
    return blockLabel;
}
exports.createRequestLabelClipped = createRequestLabelClipped;
/**
 * Create a new full width SVG Text element to label a request block
 * @param  {number}         x                horizontal position (in px)
 * @param  {number}         y                vertical position of related request block (in px)
 * @param  {string}         name             URL
 * @param  {number}         height           height of row
 */
function createRequestLabelFull(x, y, name, height) {
    var blockLabel = createRequestLabel(x, y, name, height);
    var labelHolder = svg.newG("full-label", {}, {
        clipPath: "url(#titleFullClipPath)",
    });
    labelHolder.appendChild(svg.newRect({
        height: height - 4,
        rx: 5,
        ry: 5,
        // for initial load performance use 500px as base width
        // it's updated one by one on hover
        width: 500,
        x: x - 3,
        y: y + 3,
    }, "label-full-bg"));
    labelHolder.appendChild(blockLabel);
    return labelHolder;
}
exports.createRequestLabelFull = createRequestLabelFull;
// private helper
function createRequestLabel(x, y, name, height) {
    var blockName = misc.resourceUrlFormatter(name, 125);
    y = y + Math.round(height / 2) + 5;
    var blockLabel = svg.newTextEl(blockName, { x: x, y: y });
    blockLabel.appendChild(svg.newTitle(name));
    blockLabel.style.opacity = name.match(/js.map$/) ? "0.5" : "1";
    return blockLabel;
}
var supportsAnimationFrame = (typeof window.requestAnimationFrame === "function" &&
    typeof window.cancelAnimationFrame === "function");
/**
 * Appends the labels to `rowFixed` - TODO: see if this can be done more elegant
 * @param {SVGGElement}    rowFixed   [description]
 * @param {SVGTextElement} requestNumberLabel a label placed in front of every shortLabel
 * @param {SVGTextElement} shortLabel [description]
 * @param {SVGGElement}    fullLabel  [description]
 */
function appendRequestLabels(rowFixed, requestNumberLabel, shortLabel, fullLabel) {
    var labelFullBg = fullLabel.getElementsByTagName("rect")[0];
    var fullLabelText = fullLabel.getElementsByTagName("text")[0];
    // use display: none to not render it and visibility to remove it from search results (crt+f in chrome at least)
    fullLabel.style.display = "none";
    fullLabel.style.visibility = "hidden";
    rowFixed.appendChild(requestNumberLabel);
    rowFixed.appendChild(shortLabel);
    rowFixed.appendChild(fullLabel);
    /** the size adjustment only needs to happend once, this var keeps track of that */
    var isAdjusted = false;
    /** store AnimationFrame id, to cancel it if hovering was too fast */
    var updateAnimFrame;
    rowFixed.addEventListener("mouseenter", function () {
        fullLabel.style.display = "block";
        shortLabel.style.display = "none";
        fullLabel.style.visibility = "visible";
        // offload doublecheck of width
        var update = function () {
            var newWidth = fullLabelText.getComputedTextLength() + 10;
            labelFullBg.setAttribute("width", newWidth.toString());
            isAdjusted = true;
            updateAnimFrame = undefined;
        };
        if (!isAdjusted) {
            if (supportsAnimationFrame) {
                updateAnimFrame = window.requestAnimationFrame(update);
            }
            else {
                update();
            }
        }
    });
    rowFixed.addEventListener("mouseleave", function () {
        shortLabel.style.display = "block";
        fullLabel.style.display = "none";
        fullLabel.style.visibility = "hidden";
        if (supportsAnimationFrame && updateAnimFrame !== undefined) {
            cancelAnimationFrame(updateAnimFrame);
        }
    });
}
exports.appendRequestLabels = appendRequestLabels;
/**
 * Stripe for BG
 * @param  {number}      y              [description]
 * @param  {number}      height         [description]
 * @param  {boolean}     isEven         [description]
 * @return {SVGRectElement}                [description]
 */
function createBgStripe(y, height, isEven) {
    var className = isEven ? "even" : "odd";
    return svg.newRect({
        height: height,
        width: "100%",
        x: 0,
        y: y,
    }, className);
}
exports.createBgStripe = createBgStripe;
function createNameRowBg(y, rowHeight) {
    var rowFixed = svg.newG("row row-fixed");
    rowFixed.appendChild(svg.newRect({
        height: rowHeight,
        width: "100%",
        x: "0",
        y: y,
    }, "", {
        opacity: 0,
    }));
    return rowFixed;
}
exports.createNameRowBg = createNameRowBg;
function createRowBg(y, rowHeight) {
    var rowFixed = svg.newG("row row-flex");
    rowFixed.appendChild(svg.newRect({
        height: rowHeight,
        width: "100%",
        x: "0",
        y: y,
    }, "", {
        opacity: 0,
    }));
    return rowFixed;
}
exports.createRowBg = createRowBg;

},{"../../helpers/dom":1,"../../helpers/misc":4,"../../helpers/svg":6,"../../transformers/styling-converters":15,"./svg-tooltip":23}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var icons = require("../../helpers/icons");
var misc_1 = require("../../helpers/misc");
var svg = require("../../helpers/svg");
var svg_indicators_1 = require("./svg-indicators");
var rowSubComponents = require("./svg-row-subcomponents");
// initial clip path
var clipPathElProto = svg.newClipPath("titleClipPath");
clipPathElProto.appendChild(svg.newRect({
    height: "100%",
    width: "100%",
}));
var clipPathElFullProto = svg.newClipPath("titleFullClipPath");
clipPathElFullProto.appendChild(svg.newRect({
    height: "100%",
    width: "100%",
}));
var ROW_LEFT_MARGIN = 3;
// Create row for a single request
function createRow(context, index, maxIconsWidth, maxNumberWidth, rectData, entry, onDetailsOverlayShow) {
    var y = rectData.y;
    var rowHeight = rectData.height;
    var leftColumnWidth = context.options.leftColumnWidth;
    var rowItem = svg.newA(entry.responseDetails.rowClass || "");
    rowItem.setAttribute("tabindex", "0");
    rowItem.setAttribute("xlink:href", "javascript:void(0)");
    var leftFixedHolder = svg.newSvg("left-fixed-holder", {
        width: leftColumnWidth + "%",
        x: "0",
    });
    var flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
        width: 100 - leftColumnWidth + "%",
        x: leftColumnWidth + "%",
    });
    var rect = rowSubComponents.createRect(rectData, entry);
    var rowName = rowSubComponents.createNameRowBg(y, rowHeight);
    var rowBar = rowSubComponents.createRowBg(y, rowHeight);
    var bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0));
    var x = ROW_LEFT_MARGIN + maxIconsWidth;
    if (context.options.showMimeTypeIcon) {
        var icon = entry.responseDetails.icon;
        x -= icon.width;
        rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
    }
    if (context.options.showIndicatorIcons) {
        // Create and add warnings for potentia;l issues
        svg_indicators_1.getIndicatorIcons(entry).forEach(function (icon) {
            x -= icon.width;
            rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
        });
    }
    // Jump to the largest offset of all rows
    x = ROW_LEFT_MARGIN + maxIconsWidth;
    var requestNumber = "" + (index + 1);
    var requestNumberLabel = rowSubComponents.createRequestNumberLabel(x, y, requestNumber, rowHeight, maxNumberWidth);
    // 4 is slightly bigger than the hover "glow" around the url
    x += maxNumberWidth + 4;
    var shortLabel = rowSubComponents.createRequestLabelClipped(x, y, misc_1.resourceUrlFormatter(entry.url, 40), rowHeight);
    var fullLabel = rowSubComponents.createRequestLabelFull(x, y, entry.url, rowHeight);
    // create and attach request block
    rowBar.appendChild(rect);
    rowSubComponents.appendRequestLabels(rowName, requestNumberLabel, shortLabel, fullLabel);
    context.pubSub.subscribeToSpecificOverlayChanges(index, function (change) {
        hasOpenOverlay = (change.type === "open");
    });
    if (index > 0) {
        context.pubSub.subscribeToSpecificOverlayChanges(index - 1, function (change) {
            hasPrevOpenOverlay = (change.type === "open");
        });
    }
    var hasOpenOverlay;
    var hasPrevOpenOverlay;
    rowItem.addEventListener("click", function (evt) {
        evt.preventDefault();
        onDetailsOverlayShow(evt);
    });
    rowItem.addEventListener("keydown", function (evt) {
        var e = evt; // need to type this manually
        // space on enter
        if (e.which === 32 || e.which === 13) {
            e.preventDefault();
            return onDetailsOverlayShow(e);
        }
        // tab without open overlays around
        if (misc_1.isTabUp(e) && !hasPrevOpenOverlay && index > 0) {
            if (rowItem.previousSibling &&
                rowItem.previousSibling.previousSibling &&
                rowItem.previousSibling.previousSibling.lastChild &&
                rowItem.previousSibling.previousSibling.lastChild.lastChild) {
                rowItem.previousSibling.previousSibling.lastChild.lastChild.dispatchEvent(new MouseEvent("mouseenter"));
            }
            return;
        }
        if (misc_1.isTabDown(e) && !hasOpenOverlay) {
            if (rowItem.nextSibling &&
                rowItem.nextSibling.nextSibling &&
                rowItem.nextSibling.nextSibling.lastChild &&
                rowItem.nextSibling.nextSibling.lastChild.lastChild) {
                rowItem.nextSibling.nextSibling.lastChild.lastChild.dispatchEvent(new MouseEvent("mouseenter"));
            }
            return;
        }
    });
    rowItem.addEventListener("focusout", function () {
        rowName.dispatchEvent(new MouseEvent("mouseleave"));
    });
    flexScaleHolder.appendChild(rowBar);
    leftFixedHolder.appendChild(clipPathElProto.cloneNode(true));
    leftFixedHolder.appendChild(rowName);
    rowItem.appendChild(clipPathElFullProto.cloneNode(true));
    rowItem.appendChild(bgStripe);
    rowItem.appendChild(flexScaleHolder);
    rowItem.appendChild(leftFixedHolder);
    return rowItem;
}
exports.createRow = createRow;

},{"../../helpers/icons":3,"../../helpers/misc":4,"../../helpers/svg":6,"./svg-indicators":20,"./svg-row-subcomponents":21}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var svg = require("../../helpers/svg");
var translateYRegEx = /(?:translate)\(.+[, ]+(.+)\)/;
var tooltipMaxWidth = 200;
var getTranslateY = function (str) {
    if (str === void 0) { str = ""; }
    str = (str === null) ? "" : str;
    var res = translateYRegEx.exec(str);
    if (res && res.length >= 2) {
        return parseInt(res[1], 10);
    }
    return 0;
};
/** static event-handler to show tooltip */
exports.onHoverInShowTooltip = function (base, rectData, foreignEl) {
    var innerDiv = foreignEl.querySelector(".tooltip-payload");
    var row = dom_1.getParentByClassName(base, "row-item");
    var yTransformOffsest = getTranslateY(row.getAttribute("transform"));
    /** Base Y */
    var yInt = parseInt(base.getAttribute("y") || "", 10);
    /** Base X */
    var x = base.getAttribute("x") || "";
    /** X Positon of parent in Percent */
    var xPercInt = parseFloat(x);
    var offsetY = 50;
    /** Row's width in Pixel */
    var rowWidthPx = base.width.baseVal.value || base.getBoundingClientRect().width;
    /** current ratio: 1% ≙ `pxPerPerc` Pixel */
    var pxPerPerc = rowWidthPx / (rectData.width / rectData.unit);
    var percPerPx = (rectData.width / rectData.unit) / rowWidthPx;
    var isLeftOfRow = xPercInt > 50 && ((95 - xPercInt) * pxPerPerc < tooltipMaxWidth);
    innerDiv.innerHTML = rectData.label || "";
    // Disable animation for size-gathering
    dom_1.addClass(innerDiv, "no-anim");
    foreignEl.style.display = "block";
    innerDiv.style.opacity = "0.01";
    /** First heigth, floating might change this later, since with is not fixed */
    var initialHeight = innerDiv.clientHeight + 5;
    if (yInt + yTransformOffsest - initialHeight > 0) { // above row
        offsetY = yTransformOffsest - initialHeight;
    }
    else { // below row: more offset to not hide text with mouse
        offsetY = yTransformOffsest + rectData.height + 10;
    }
    if (isLeftOfRow) {
        var newLeft = xPercInt - ((innerDiv.clientWidth + 5) * percPerPx);
        var leftOffset = parseInt(foreignEl.querySelector("body").style.left || "", 10);
        var ratio = 1 / (1 / 100 * (100 - leftOffset));
        leftOffset = ratio * leftOffset;
        if (newLeft > -leftOffset) { // tooltip still visible
            innerDiv.style.left = newLeft + "%";
        }
        else {
            // change value to not crop tooltip
            innerDiv.style.left = -leftOffset + "%";
        }
    }
    else {
        innerDiv.style.left = x;
    }
    foreignEl.setAttribute("y", "" + (yInt + offsetY));
    foreignEl.setAttribute("height", initialHeight.toString());
    dom_1.removeClass(innerDiv, "no-anim");
    innerDiv.style.opacity = "1";
    var diff = (innerDiv.clientHeight + 5) - initialHeight;
    if (diff !== 0) {
        // make adjustments if the initial height was wrong
        foreignEl.setAttribute("height", (initialHeight + diff).toString());
        foreignEl.setAttribute("y", "" + (yInt + offsetY - diff));
    }
};
exports.onHoverOutShowTooltip = function (base) {
    var holder = dom_1.getParentByClassName(base, "water-fall-chart");
    var foreignEl = holder.querySelector(".tooltip");
    var innerDiv = foreignEl.querySelector(".tooltip-payload");
    foreignEl.style.display = "none";
    foreignEl.setAttribute("height", "250"); // set to high value
    innerDiv.style.opacity = "0";
};
/**
 * Creates the Tooltip base elements
 * @param {ChartOptions} options - Chart config/customization options
 */
exports.makeTooltip = function (options) {
    var leftColOffsetPerc = options.leftColumnWidth;
    var holder = svg.newSvg("tooltip-holder", {
        width: "100%",
        x: "0",
        y: "0",
    });
    var foreignEl = svg.newForeignObject({
        width: "100%",
        x: "0",
        y: leftColOffsetPerc + "%",
    }, "tooltip", {
        display: "none",
    });
    var html = dom_1.makeHtmlEl();
    var body = dom_1.makeBodyEl({
        left: leftColOffsetPerc + "%",
        width: 100 - leftColOffsetPerc + "%",
    }, "<div class=\"tooltip-payload\" style=\"max-width: " + tooltipMaxWidth + "px; opacity: 0;\"></div>");
    html.appendChild(body);
    foreignEl.appendChild(html);
    holder.appendChild(foreignEl);
    return holder;
};

},{"../../helpers/dom":1,"../../helpers/svg":6}],24:[function(require,module,exports){
"use strict";
/**
 * vertical alignment helper lines
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var svg = require("../../helpers/svg");
/**
 * Creates verticale alignment bars
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
function createAlignmentLines(diagramHeight) {
    return {
        endline: svg.newLine({
            x1: "0",
            x2: "0",
            y1: "0",
            y2: diagramHeight,
        }, "line-end"),
        startline: svg.newLine({
            x1: "0",
            x2: "0",
            y1: "0",
            y2: diagramHeight,
        }, "line-start"),
    };
}
exports.createAlignmentLines = createAlignmentLines;
/**
 * Partially appliable Eventlisteners for verticale alignment bars to be shown on hover
 * @param {HoverElements} hoverEl  verticale alignment bars SVG Elements
 */
function makeHoverEvtListeners(hoverEl) {
    return {
        onMouseEnterPartial: function () {
            return function (evt) {
                var targetRect = evt.target;
                dom_1.addClass(targetRect, "active");
                var xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits +
                    targetRect.width.baseVal.valueInSpecifiedUnits + "%";
                var xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";
                hoverEl.endline.x1.baseVal.valueAsString = xPosEnd;
                hoverEl.endline.x2.baseVal.valueAsString = xPosEnd;
                hoverEl.startline.x1.baseVal.valueAsString = xPosStart;
                hoverEl.startline.x2.baseVal.valueAsString = xPosStart;
                dom_1.addClass(hoverEl.endline, "active");
                dom_1.addClass(hoverEl.startline, "active");
            };
        },
        onMouseLeavePartial: function () {
            return function (evt) {
                var targetRect = evt.target;
                dom_1.removeClass(targetRect, "active");
                dom_1.removeClass(hoverEl.endline, "active");
                dom_1.removeClass(hoverEl.startline, "active");
            };
        },
    };
}
exports.makeHoverEvtListeners = makeHoverEvtListeners;

},{"../../helpers/dom":1,"../../helpers/svg":6}],25:[function(require,module,exports){
"use strict";
/**
 * Creation of sub-components of the waterfall chart
 */
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("../../helpers/misc");
var svg = require("../../helpers/svg");
/**
 * Renders a per-second marker line and appends it to `timeHolder`
 *
 * @param  {Context} context  Execution context object
 * @param  {SVGGElement} timeHolder element that the second marker is appended to
 * @param  {number} secsTotal  total number of seconds in the timeline
 * @param  {number} sec second of the time marker to render
 * @param  {boolean} addLabel  if true a time label is added to the marker-line
 */
var appendSecond = function (context, timeHolder, secsTotal, sec, addLabel) {
    if (addLabel === void 0) { addLabel = false; }
    var diagramHeight = context.diagramHeight;
    var secPerc = 100 / secsTotal;
    /** just used if `addLabel` is `true` - for full seconds */
    var lineLabel;
    var lineClass = "sub-second-line";
    var x;
    if (addLabel) {
        var showTextBefore = (sec > secsTotal - 0.2);
        lineClass = "second-line";
        x = misc_1.roundNumber(secPerc * sec) + 0.5 + "%";
        var css = {};
        if (showTextBefore) {
            x = misc_1.roundNumber(secPerc * sec) - 0.5 + "%";
            css["text-anchor"] = "end";
        }
        lineLabel = svg.newTextEl(sec + "s", { x: x, y: diagramHeight }, css);
    }
    x = misc_1.roundNumber(secPerc * sec) + "%";
    var lineEl = svg.newLine({
        x1: x,
        x2: x,
        y1: 0,
        y2: diagramHeight,
    }, lineClass);
    context.pubSub.subscribeToOverlayChanges(function (change) {
        var offset = change.combinedOverlayHeight;
        // figure out why there is an offset
        var scale = (diagramHeight + offset) / (diagramHeight);
        lineEl.setAttribute("transform", "scale(1, " + scale + ")");
        if (addLabel) {
            lineLabel.setAttribute("transform", "translate(0, " + offset + ")");
        }
    });
    timeHolder.appendChild(lineEl);
    if (addLabel) {
        timeHolder.appendChild(lineLabel);
    }
};
/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param  {Context} context  Execution context object
 * @param {number} durationMs    Full duration of the waterfall
 */
function createTimeScale(context, durationMs) {
    var timeHolder = svg.newG("time-scale full-width");
    var subStepMs = Math.ceil(durationMs / 10000) * 200;
    /** steps between each major second marker */
    var subStep = 1000 / subStepMs;
    var secs = durationMs / 1000;
    var steps = durationMs / subStepMs;
    for (var i = 0; i <= steps; i++) {
        var isMarkerStep = i % subStep < 0.000000001; // to avoid rounding issues
        var secValue = i / subStep;
        appendSecond(context, timeHolder, secs, secValue, isMarkerStep);
    }
    return timeHolder;
}
exports.createTimeScale = createTimeScale;

},{"../../helpers/misc":4,"../../helpers/svg":6}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var misc_1 = require("../../helpers/misc");
var svg = require("../../helpers/svg");
/**
 * Renders global marks for events like the onLoad event etc
 * @param  {Context} context  Execution context object
 * @param {Mark[]} marks         [description]
 */
function createMarks(context, marks) {
    var diagramHeight = context.diagramHeight;
    var marksHolder = svg.newG("marker-holder", {
        transform: "scale(1, 1)",
    });
    marks.forEach(function (mark, i) {
        var x = misc_1.roundNumber(mark.startTime / context.unit);
        var markHolder = svg.newG("mark-holder type-" + mark.name.toLowerCase().replace(/([0-9]+[ ]?ms)|\W/g, ""));
        var lineHolder = svg.newG("line-holder");
        var lineLabelHolder = svg.newG("line-label-holder");
        var lineLabel = svg.newTextEl(mark.name, { x: x + "%", y: diagramHeight + 25 });
        lineLabel.setAttribute("writing-mode", "tb");
        var lineRect;
        mark.x = x;
        var line = svg.newLine({
            x1: x + "%",
            x2: x + "%",
            y1: 0,
            y2: diagramHeight,
        });
        var lastMark = marks[i - 1];
        var minDistance = 2.5; // minimum distance between marks
        if (lastMark && lastMark.x !== undefined && mark.x - lastMark.x < minDistance) {
            lineLabel.setAttribute("x", lastMark.x + minDistance + "%");
            mark.x = lastMark.x + minDistance;
        }
        // would use polyline but can't use percentage for points
        var lineConnection = svg.newLine({
            x1: x + "%",
            x2: mark.x + "%",
            y1: diagramHeight,
            y2: diagramHeight + 23,
        });
        lineHolder.appendChild(line);
        lineHolder.appendChild(lineConnection);
        if (mark.duration) {
            lineRect = createLineRect(context, mark);
            lineHolder.appendChild(lineRect);
        }
        context.pubSub.subscribeToOverlayChanges(function (change) {
            var offset = change.combinedOverlayHeight;
            var scale = (diagramHeight + offset) / (diagramHeight);
            line.setAttribute("transform", "scale(1, " + scale + ")");
            lineLabelHolder.setAttribute("transform", "translate(0, " + offset + ")");
            lineConnection.setAttribute("transform", "translate(0, " + offset + ")");
            if (lineRect) {
                lineRect.setAttribute("transform", "translate(0, " + offset + ")");
            }
        });
        var isHoverActive = false;
        /** click indicator - overwrites `isHoverActive` */
        var isClickActive = false;
        var onLabelMouseEnter = function () {
            if (!isHoverActive) {
                // move marker to top
                markHolder.parentNode.appendChild(markHolder);
                isHoverActive = true;
                // assign class later to not break animation with DOM re-order
                if (typeof window.requestAnimationFrame === "function") {
                    window.requestAnimationFrame(function () { return dom_1.addClass(lineHolder, "active"); });
                }
                else {
                    dom_1.addClass(lineHolder, "active");
                }
            }
        };
        var onLabelMouseLeave = function () {
            isHoverActive = false;
            if (!isClickActive) {
                dom_1.removeClass(lineHolder, "active");
            }
        };
        var onLabelClick = function () {
            if (isClickActive) {
                // deselect
                isHoverActive = false;
                dom_1.removeClass(lineHolder, "active");
            }
            else if (!isHoverActive) {
                // for touch devices
                dom_1.addClass(lineHolder, "active");
            }
            else {
                isHoverActive = false;
            }
            // set new state
            isClickActive = !isClickActive;
        };
        lineLabel.addEventListener("mouseenter", onLabelMouseEnter);
        lineLabel.addEventListener("mouseleave", onLabelMouseLeave);
        lineLabel.addEventListener("click", onLabelClick);
        lineLabelHolder.appendChild(lineLabel);
        markHolder.appendChild(svg.newTitle(mark.name));
        markHolder.appendChild(lineHolder);
        markHolder.appendChild(lineLabelHolder);
        marksHolder.appendChild(markHolder);
    });
    return marksHolder;
}
exports.createMarks = createMarks;
/**
 * Converts a `Mark` with a duration (e.g. a UserTiming with `startTimer` and `endTimer`) into a rect.
 * @param {Context} context Execution context object
 * @param {Mark} entry  Line entry
 */
function createLineRect(context, entry) {
    var holder = svg.newG("line-mark-holder line-marker-" + misc_1.toCssClass(entry.name));
    holder.appendChild(svg.newTitle(entry.name.replace(/^startTimer-/, "")));
    holder.appendChild(svg.newRect({
        height: context.diagramHeight,
        width: ((entry.duration || 1) / context.unit) + "%",
        x: ((entry.startTime || 0.001) / context.unit) + "%",
        y: 0,
    }, "line-mark"));
    return holder;
}
exports.createLineRect = createLineRect;

},{"../../helpers/dom":1,"../../helpers/misc":4,"../../helpers/svg":6}],27:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var svg = require("../helpers/svg");
var styling_converters_1 = require("../transformers/styling-converters");
var overlay_manager_1 = require("./details-overlay/overlay-manager");
var pub_sub_1 = require("./details-overlay/pub-sub");
var row = require("./row/svg-row");
var svg_tooltip_1 = require("./row/svg-tooltip");
var svgAlignmentHelper = require("./sub-components/svg-alignment-helper");
var svgGeneralComponents = require("./sub-components/svg-general-components");
var svgMarks = require("./sub-components/svg-marks");
/**
 * Get a string that's as wide, or wider than any number from 0-n.
 * @param {number} n the highest number that should fit within the returned string's width.
 * @returns {string}
 */
function getWidestDigitString(n) {
    var numDigits = Math.floor((Math.log(n) / Math.LN10)) + 1;
    var s = "";
    for (var i = 0; i < numDigits; i++) {
        // No number should take more horizontal space than "0" does.
        s += "0";
    }
    return s;
}
/**
 * Calculate the height of the SVG chart in px
 * @param {Mark[]}       marks      [description]
 * @param  {number} diagramHeight
 * @returns Number
 */
function getSvgHeight(marks, diagramHeight) {
    var maxMarkTextLength = marks.reduce(function (currMax, currValue) {
        var attributes = { x: 0, y: 0 };
        return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, attributes), true));
    }, 0);
    return Math.floor(diagramHeight + maxMarkTextLength + 35);
}
/**
 * Intitializes the context object
 * @param {WaterfallData} data - Object containing the setup parameter
 * @param {ChartOptions} options - Chart config/customization options
 * @param {WaterfallEntry[]} entriesToShow - Filtered array of entries that will be rendered
 * @return {Context} Context object
 */
function createContext(data, options, entriesToShow) {
    var unit = data.durationMs / 100;
    var diagramHeight = (entriesToShow.length + 1) * options.rowHeight;
    var context = {
        diagramHeight: diagramHeight,
        options: options,
        pubSub: new pub_sub_1.PubSub(),
        unit: unit,
    };
    // `overlayManager` needs the `context` reference, so it's attached later
    return __assign({}, context, { overlayManager: new overlay_manager_1.default(context) });
}
/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data - Object containing the setup parameter
 * @param {ChartOptions} options - Chart config/customization options
 * @return {SVGSVGElement} - SVG Element ready to render
 */
function createWaterfallSvg(data, options) {
    // constants
    var entriesToShow = data.entries
        .filter(function (entry) { return (typeof entry.start === "number" && typeof entry.total === "number"); })
        .sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
    /** Holder of request-details overlay */
    var overlayHolder = svg.newG("overlays");
    /** Holds all rows */
    var rowHolder = svg.newG("rows-holder");
    var context = createContext(data, options, entriesToShow);
    /** full height of the SVG chart in px */
    var chartHolderHeight = getSvgHeight(data.marks, context.diagramHeight);
    /** Main SVG Element that holds all data */
    var timeLineHolder = svg.newSvg("water-fall-chart", {
        height: chartHolderHeight,
    });
    /** Holder for scale, event and marks */
    var scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
        width: 100 - options.leftColumnWidth + "%",
        x: options.leftColumnWidth + "%",
    });
    /** Holder for on-hover vertical comparison bars */
    var hoverOverlayHolder;
    var mouseListeners;
    if (options.showAlignmentHelpers) {
        hoverOverlayHolder = svg.newG("hover-overlays");
        var hoverEl = svgAlignmentHelper.createAlignmentLines(context.diagramHeight);
        hoverOverlayHolder.appendChild(hoverEl.startline);
        hoverOverlayHolder.appendChild(hoverEl.endline);
        mouseListeners = svgAlignmentHelper.makeHoverEvtListeners(hoverEl);
    }
    // Start appending SVG elements to the holder element (timeLineHolder)
    scaleAndMarksHolder.appendChild(svgGeneralComponents.createTimeScale(context, data.durationMs));
    scaleAndMarksHolder.appendChild(svgMarks.createMarks(context, data.marks));
    // This assumes all icons (mime and indicators) have the same width
    var perIconWidth = entriesToShow[0].responseDetails.icon.width;
    var maxIcons = 0;
    if (options.showMimeTypeIcon) {
        maxIcons += 1;
    }
    if (options.showIndicatorIcons) {
        var iconsPerBlock = entriesToShow.map(function (entry) {
            return entry.responseDetails.indicators.filter(function (i) { return i.displayType === "icon"; }).length > 0 ? 1 : 0;
        });
        maxIcons += Math.max.apply(null, iconsPerBlock);
    }
    var maxIconsWidth = maxIcons * perIconWidth;
    var widestRequestNumber = getWidestDigitString(entriesToShow.length);
    var maxNumberWidth = svg.getNodeTextWidth(svg.newTextEl("" + widestRequestNumber), true);
    var rowItems = [];
    function getChartHeight() {
        return chartHolderHeight + context.overlayManager.getCombinedOverlayHeight();
    }
    context.pubSub.subscribeToOverlayChanges(function () {
        var newHeight = getChartHeight();
        timeLineHolder.classList.toggle("closing", newHeight < timeLineHolder.clientHeight);
        timeLineHolder.style.height = newHeight + "px";
    });
    /** Renders single row and hooks up behaviour */
    function renderRow(entry, i) {
        var entryWidth = entry.total || 1;
        var y = options.rowHeight * i;
        var x = (entry.start || 0.001);
        var detailsHeight = 450;
        var rectData = {
            cssClass: styling_converters_1.requestTypeToCssClass(entry.responseDetails.requestType),
            height: options.rowHeight,
            hideOverlay: options.showAlignmentHelpers ? mouseListeners.onMouseLeavePartial : undefined,
            label: "<strong>" + entry.url + "</strong><br/>" +
                (Math.round(entry.start) + "ms - " + Math.round(entry.end) + "ms<br/>") +
                ("total: " + (isNaN(entry.total) ? "n/a " : Math.round(entry.total)) + "ms"),
            showOverlay: options.showAlignmentHelpers ? mouseListeners.onMouseEnterPartial : undefined,
            unit: context.unit,
            width: entryWidth,
            x: x,
            y: y,
        };
        var showDetailsOverlay = function () {
            context.overlayManager.toggleOverlay(i, y + options.rowHeight, detailsHeight, entry, rowItems);
        };
        var rowItem = row.createRow(context, i, maxIconsWidth, maxNumberWidth, rectData, entry, showDetailsOverlay);
        rowItems.push(rowItem);
        rowHolder.appendChild(rowItem);
        rowHolder.appendChild(svg.newG("row-overlay-holder"));
    }
    // Main loop to render rows with blocks
    entriesToShow.forEach(renderRow);
    if (options.showAlignmentHelpers && hoverOverlayHolder !== undefined) {
        scaleAndMarksHolder.appendChild(hoverOverlayHolder);
    }
    timeLineHolder.appendChild(scaleAndMarksHolder);
    timeLineHolder.appendChild(rowHolder);
    timeLineHolder.appendChild(overlayHolder);
    timeLineHolder.appendChild(svg_tooltip_1.makeTooltip(options));
    return timeLineHolder;
}
exports.createWaterfallSvg = createWaterfallSvg;

},{"../helpers/svg":6,"../transformers/styling-converters":15,"./details-overlay/overlay-manager":17,"./details-overlay/pub-sub":18,"./row/svg-row":22,"./row/svg-tooltip":23,"./sub-components/svg-alignment-helper":24,"./sub-components/svg-general-components":25,"./sub-components/svg-marks":26}]},{},[8])(8)
});
