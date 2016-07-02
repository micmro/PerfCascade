/*! github.com/micmro/PerfCascade Version:0.1.6 (02/07/2016) */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.perfCascade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *  DOM Helpers
 */
"use strict";
/**
 * Remove all child nodes from `el`
 * @param  {HTMLElement|SVGElement} el
 */
function removeAllChildren(el) {
    while (el.childNodes.length > 0) {
        el.removeChild(el.childNodes[0]);
    }
}
exports.removeAllChildren = removeAllChildren;
/**
 * Iterate over list of DOM elements
 * @param  {NodeListOf<Element>} els
 * @param  {(el:Element,index:number)=>any} fn
 */
function forEach(els, fn) {
    Array.prototype.forEach.call(els, fn);
}
exports.forEach = forEach;
/**
 * Filter list of DOM elements
 *
 * @param  {NodeListOf<Element>} els
 * @param  {(el:Element,index:number)=>boolean} predicat
 * @returns NodeListOf
 */
function filter(els, predicat) {
    return Array.prototype.filter.call(els, predicat);
}
exports.filter = filter;

},{}],2:[function(require,module,exports){
"use strict";
var misc = require("./misc");
function getResponseHeader(entry, headerName) {
    return entry.response.headers.filter(function (h) { return h.name.toLowerCase() === headerName.toLowerCase(); })[0];
}
exports.getResponseHeader = getResponseHeader;
function getResponseHeaderValue(entry, headerName) {
    var header = getResponseHeader(entry, headerName);
    if (header !== undefined) {
        return header.value;
    }
    else {
        return "";
    }
}
exports.getResponseHeaderValue = getResponseHeaderValue;
/**
 *
 * Checks if `entry.response.status` code is `>= lowerBound` and `<= upperBound`
 * @param  {Entry} entry
 * @param  {number} lowerBound - inclusive lower bound
 * @param  {number} upperBound - inclusive upper bound
 */
function isInStatusCodeRange(entry, lowerBound, upperBound) {
    return entry.response.status >= lowerBound && entry.response.status <= upperBound;
}
exports.isInStatusCodeRange = isInStatusCodeRange;
function isCompressable(block) {
    var entry = block.rawResource;
    var minCompressionSize = 1000;
    //small responses
    if (entry.response.bodySize < minCompressionSize) {
        return false;
    }
    if (misc.contains(["html", "css", "javascript", "svg", "plain"], block.requestType)) {
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
function isCachable(block) {
    var entry = block.rawResource;
    //do not cache non-gets,204 and non 2xx status codes
    if (entry.request.method.toLocaleLowerCase() !== "get" ||
        entry.response.status === 204 ||
        !isInStatusCodeRange(entry, 200, 299)) {
        return false;
    }
    if (getResponseHeader(entry, "Cache-Control") === undefined
        && getResponseHeader(entry, "Expires") === undefined) {
        return true;
    }
    if (getResponseHeaderValue(entry, "Cache-Control").indexOf("no-cache") > -1
        || getResponseHeaderValue(entry, "Pragma") === "no-cache") {
        return true;
    }
    return false;
}
function hasCacheIssue(block) {
    return (getResponseHeader(block.rawResource, "Content-Encoding") === undefined && isCachable(block));
}
exports.hasCacheIssue = hasCacheIssue;
function hasCompressionIssue(block) {
    return (getResponseHeader(block.rawResource, "Content-Encoding") === undefined && isCompressable(block));
}
exports.hasCompressionIssue = hasCompressionIssue;
function isSecure(block) {
    return block.name.indexOf("https://") === 0;
}
exports.isSecure = isSecure;

},{"./misc":4}],3:[function(require,module,exports){
/**
 *  SVG Icons
 */
"use strict";
var toSvg = function (x, y, title, className, scale, svgDoc) {
    var parser = new DOMParser();
    var doc = parser.parseFromString("<svg x=\"" + x + "\" y=\"" + y + "\" xmlns=\"http://www.w3.org/2000/svg\">\n    <g class=\"icon " + className + "\" transform=\"scale(" + scale + ")\">\n      " + svgDoc + "\n      <title>" + title + "</title>\n    </g>\n  </svg>", "image/svg+xml");
    return doc.firstChild;
};
function lock(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-lock", scale, "<g>\n    <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n      C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n      C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n  </g>\n  <path fill=\"#A452A0\" d=\"M13,8V6.5C13,5,12,3,9,3S5,5,5,6.5V8H4v7h10V8H13z M10,12.5c0,0.3-0.7,0.5-1,0.5s-1-0.2-1-0.5v-2\n    C8,10.2,8.7,10,9,10s1,0.2,1,0.5V12.5z M11,8H7V6.5C7,5.7,7.5,5,9,5s2,0.7,2,1.5V8z\"/>");
}
exports.lock = lock;
function noTls(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-tls", scale, "<g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <path fill=\"#414042\" d=\"M13,8V6.5C13,5,12,3,9,3S5,5,5,6.5V8H4v7h10V8H13z M10,12.5c0,0.3-0.7,0.5-1,0.5s-1-0.2-1-0.5v-2\n        C8,10.2,8.7,10,9,10s1,0.2,1,0.5V12.5z M11,8H7V6.5C7,5.7,7.5,5,9,5s2,0.7,2,1.5V8z\"/>\n    <line fill=\"#CC6666\" stroke=\"#CC6666\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"15\" x2=\"15\" y2=\"3\"/>");
}
exports.noTls = noTls;
function err3xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-redirect", scale, "<g>\n        <path fill=\"#F9EF66\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5\n            L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <polygon fill=\"#414042\" points=\"9,5 9,10 12,7.5 \"/>\n    <polyline fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" points=\"9,7.5 4.5,7.5 4.5,11.5 13,11.5 \"/>\n    <path fill=\"#414042\" d=\"M11,10\"/>");
}
exports.err3xx = err3xx;
function err4xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-4xx", scale, "<g>\n        <path fill=\"#F16062\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n        <path fill=\"#FFFFFF\" d=\"M5.6,14v-1.7H3.1v-0.8l2.6-4.6h0.6v4.6h0.8v0.8H6.3V14H5.6z M5.6,11.5V8.3l-1.8,3.2H5.6z\"/>\n        <path fill=\"#FFFFFF\" d=\"M7.5,14L9,11.3L7.6,8.8h0.9L9.1,10c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8l-1.4,2.4\n            l1.5,2.7h-0.9l-0.9-1.6L9.4,12l-1.1,2H7.5z\"/>\n        <path fill=\"#FFFFFF\" d=\"M11.5,14l1.5-2.7l-1.4-2.5h0.9l0.6,1.2c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8\n            l-1.4,2.4l1.5,2.7h-0.9l-0.9-1.6L13.4,12l-1.1,2H11.5z\"/>\n    </g>");
}
exports.err4xx = err4xx;
function err5xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-5xx", scale, " <g>\n        <path fill=\"#F16061\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n        <path fill=\"#FFFFFF\" d=\"M3.3,12.1L4.1,12c0.1,0.4,0.2,0.8,0.4,1c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.6-0.2,0.9-0.5s0.4-0.7,0.4-1.3\n            c0-0.5-0.1-0.9-0.3-1.2S5.5,10,5.2,10c-0.2,0-0.4,0.1-0.6,0.2c-0.2,0.1-0.3,0.3-0.4,0.5l-0.7-0.1L4,6.9h2.8v0.8H4.6L4.3,9.7\n            C4.6,9.4,5,9.3,5.3,9.3c0.5,0,0.9,0.2,1.3,0.6c0.3,0.4,0.5,1,0.5,1.7c0,0.6-0.2,1.2-0.5,1.7c-0.4,0.6-0.9,0.9-1.5,0.9\n            c-0.5,0-0.9-0.2-1.3-0.5S3.4,12.7,3.3,12.1z\"/>\n        <path fill=\"#FFFFFF\" d=\"M7.5,14L9,11.3L7.6,8.8h0.9L9.1,10c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8l-1.4,2.4\n            l1.5,2.7h-0.9l-0.9-1.6L9.4,12l-1.1,2H7.5z\"/>\n        <path fill=\"#FFFFFF\" d=\"M11.5,14l1.5-2.7l-1.4-2.5h0.9l0.6,1.2c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8\n            l-1.4,2.4l1.5,2.7h-0.9l-0.9-1.6L13.4,12l-1.1,2H11.5z\"/>\n    </g>");
}
exports.err5xx = err5xx;
function noCache(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-cache", scale, "<g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n        <path fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" d=\"M5,7v4.5C5,12.3,6.8,13,9,13s4-0.7,4-1.5V7H5z\"/>\n        <path fill=\"#FFFFFF\" stroke=\"#414042\" stroke-miterlimit=\"10\" d=\"M9,8c1.7,0,3.2-0.4,3.8-1C12.9,6.8,13,6.7,13,6.5\n            C13,5.7,11.2,5,9,5S5,5.7,5,6.5C5,6.7,5.1,6.8,5.2,7C5.8,7.6,7.3,8,9,8z\"/>\n    </g>\n    <line fill=\"#CC6666\" stroke=\"#CC6666\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"15\" x2=\"15\" y2=\"3\"/>");
}
exports.noCache = noCache;
function noGzip(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-gzip", scale, "<g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <rect x=\"7.5\" y=\"2\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"9\" y=\"3\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"7.5\" y=\"4\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"9\" y=\"5\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"7.5\" y=\"6\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <polygon fill=\"#414042\" points=\"10,15 8,15 7,14 7,10 8,8 10,8 11,10 11,14   \"/>\n    <polygon fill=\"#FFFFFF\" points=\"9,13.5 9,13.5 8,13 8,11.5 10,11.5 10,13     \"/>\n    <rect x=\"9\" y=\"7\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <line fill=\"#CC6666\" stroke=\"#CC6666\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"15\" x2=\"15\" y2=\"3\"/>");
}
exports.noGzip = noGzip;
function plain(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-plain", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#B3B4B4\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"4.5\" x2=\"15\" y2=\"4.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"6.5\" x2=\"13\" y2=\"6.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"8.5\" x2=\"15\" y2=\"8.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"10.5\" x2=\"10\" y2=\"10.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"12.5\" x2=\"15\" y2=\"12.5\"/>\n    </g>");
}
exports.plain = plain;
function other(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-other", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#B3B4B4\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path fill=\"#414042\" d=\"M11.8,7c0,0.4-0.1,0.7-0.2,1c-0.1,0.3-0.3,0.5-0.4,0.7C11,8.8,10.8,9,10.5,9.2C10.3,9.3,10,9.5,9.6,9.6\n          v1.2H7.8V9.1C8,9,8.2,8.9,8.5,8.8c0.2-0.1,0.5-0.2,0.6-0.3C9.3,8.3,9.5,8.2,9.6,8c0.1-0.2,0.2-0.4,0.2-0.7c0-0.4-0.1-0.6-0.3-0.8\n          S8.9,6.3,8.5,6.3c-0.3,0-0.6,0.1-1,0.2C7.2,6.7,6.9,6.8,6.8,6.9H6.6V5.3c0.2-0.1,0.6-0.2,1-0.3S8.5,4.8,9,4.8\n          c0.5,0,0.8,0.1,1.2,0.2c0.3,0.1,0.6,0.3,0.9,0.4c0.2,0.2,0.4,0.4,0.5,0.7C11.8,6.4,11.8,6.6,11.8,7z M9.8,13H7.7v-1.4h2.1V13z\"/>\n      </g>\n    </g>");
}
exports.other = other;
function javascript(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-js", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5\n          L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E0B483\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path fill=\"#414042\" d=\"M7.6,11.8c0,0.3-0.1,0.6-0.2,0.9s-0.3,0.5-0.5,0.7c-0.2,0.2-0.5,0.4-0.8,0.5S5.4,13.9,5,13.9\n          c-0.3,0-0.6,0-0.9,0s-0.5-0.1-0.7-0.1v-1.4h0.2c0.1,0.1,0.3,0.1,0.4,0.2c0.2,0,0.4,0.1,0.6,0.1c0.3,0,0.5,0,0.7-0.1\n          c0.2-0.1,0.3-0.2,0.4-0.4c0.1-0.2,0.1-0.3,0.1-0.5s0-0.4,0-0.7V8.1H4.2V6.8h3.4V11.8z\"/>\n        <path fill=\"#414042\" d=\"M11.1,13.9c-0.5,0-1-0.1-1.4-0.2c-0.4-0.1-0.8-0.2-1.1-0.4v-1.7h0.2c0.4,0.3,0.7,0.5,1.2,0.7\n          c0.4,0.2,0.8,0.2,1.2,0.2c0.1,0,0.2,0,0.4,0s0.3-0.1,0.4-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.1-0.1,0.1-0.2,0.1-0.4\n          c0-0.2-0.1-0.3-0.2-0.4s-0.3-0.2-0.5-0.2c-0.2-0.1-0.5-0.1-0.8-0.2c-0.3-0.1-0.5-0.1-0.8-0.2c-0.5-0.2-0.9-0.4-1.2-0.8\n          S8.6,9.4,8.6,8.9c0-0.7,0.3-1.2,0.8-1.6c0.6-0.4,1.2-0.6,2.1-0.6c0.4,0,0.8,0,1.2,0.1c0.4,0.1,0.8,0.2,1.1,0.3v1.6h-0.2\n          c-0.3-0.2-0.6-0.4-0.9-0.6C12.4,8,12,8,11.6,8c-0.2,0-0.3,0-0.4,0c-0.1,0-0.2,0.1-0.4,0.1c-0.1,0.1-0.2,0.1-0.3,0.2\n          s-0.1,0.2-0.1,0.3c0,0.2,0.1,0.3,0.2,0.4c0.1,0.1,0.4,0.2,0.7,0.3c0.2,0.1,0.5,0.1,0.7,0.2s0.4,0.1,0.7,0.2\n          c0.5,0.2,0.8,0.4,1.1,0.7c0.2,0.3,0.4,0.7,0.4,1.2c0,0.7-0.3,1.3-0.8,1.7S12,13.9,11.1,13.9z\"/>\n      </g>\n    </g>");
}
exports.javascript = javascript;
function image(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-image", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#B294C5\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <polygon points=\"2.6,14 8.2,9.9 12,11.4 15,8.2 15,14 \t\"/>\n      <circle cx=\"6.6\" cy=\"5.8\" r=\"1.8\"/>\n    </g>");
}
exports.image = image;
function html(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-html", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5\n          L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#82A7D8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path d=\"M7.9,6.5l-2.2,6.9H4.6l2.2-6.9H7.9z\"/>\n        <path d=\"M14,10.2l-4.7,2v-1l3.3-1.3L9.3,8.4v-1l4.7,2V10.2z\"/>\n      </g>\n    </g>");
}
exports.html = html;
function css(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-css", scale, "<g>\n      <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n        C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      <path fill=\"none\" stroke=\"#A6D08E\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n        C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n      <path d=\"M7.8,13.7h-1c-0.5,0-0.9-0.1-1.2-0.4c-0.3-0.3-0.4-0.6-0.4-1.1v-0.6c0-0.4-0.1-0.8-0.3-0.9s-0.5-0.3-1-0.3H3.6V9.5h0.3\n        c0.5,0,0.8-0.1,1-0.3C5.1,9,5.2,8.7,5.2,8.2V7.6c0-0.5,0.1-0.9,0.4-1.1c0.3-0.3,0.7-0.4,1.2-0.4h1V7H7.4C7.3,7,7.1,7,7,7\n        C6.9,7,6.8,7.1,6.7,7.1C6.6,7.2,6.5,7.3,6.5,7.4c0,0.1-0.1,0.3-0.1,0.5v0.4c0,0.4-0.1,0.7-0.3,0.9S5.6,9.8,5.2,9.9V10\n        c0.4,0.1,0.6,0.3,0.9,0.6s0.3,0.6,0.3,0.9v0.4c0,0.2,0,0.4,0.1,0.5c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.3,0.1\n        c0.1,0,0.3,0,0.4,0h0.4V13.7z\"/>\n      <path d=\"M14.3,10.4h-0.3c-0.5,0-0.8,0.1-1,0.3c-0.2,0.2-0.3,0.5-0.3,0.9v0.6c0,0.5-0.1,0.9-0.4,1.1c-0.3,0.3-0.7,0.4-1.2,0.4h-1\n        v-0.9h0.4c0.2,0,0.3,0,0.4,0c0.1,0,0.2-0.1,0.3-0.1c0.1-0.1,0.2-0.2,0.2-0.3c0-0.1,0.1-0.3,0.1-0.5v-0.4c0-0.4,0.1-0.7,0.3-0.9\n        s0.5-0.4,0.9-0.6V9.9c-0.4-0.1-0.6-0.3-0.9-0.6s-0.3-0.6-0.3-0.9V7.9c0-0.2,0-0.4-0.1-0.5c0-0.1-0.1-0.2-0.2-0.3\n        C11.2,7.1,11.1,7,10.9,7c-0.1,0-0.3,0-0.4,0h-0.4V6.1h1c0.5,0,0.9,0.1,1.2,0.4c0.3,0.3,0.4,0.6,0.4,1.1v0.6c0,0.4,0.1,0.8,0.3,0.9\n        c0.2,0.2,0.5,0.3,1,0.3h0.3V10.4z\"/>\n    </g>");
}
exports.css = css;
function warning(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-warning", scale, "<g>\n          <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n              C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n          <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n              C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <path fill=\"#414042\" d=\"M9,3L3,14h12L9,3z M10,13H8v-1h2V13z M9.5,11h-1L8,10V7l0.5-1h1L10,7v3L9.5,11z\"/>");
}
exports.warning = warning;
function font(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-font", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5\n          L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E15D4E\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path fill=\"#414042\" d=\"M3.8,10l-0.6,0.6C3.1,10.3,3.1,10,3.1,9.8c0-0.6,0.3-1.2,0.8-1.6c0.5-0.3,1.3-0.5,2.4-0.5\n          c0.2,0,0.4,0,0.5,0c0.4,0,0.6,0,0.6,0h0.3c-0.2,0.3-0.3,1-0.3,1.9l0,0.2l0,0.4c0,0.5,0.1,1.1,0.2,1.7c0.1,0.2,0.1,0.4,0.2,0.4\n          c0,0.1,0.1,0.1,0.3,0.1c0.1,0,0.3,0,0.5-0.1c0,0,0,0.1,0,0.1c0,0.1-0.1,0.1-0.2,0.2l-0.2,0.1l-1,0.4c-0.2-0.7-0.3-1.3-0.4-2.1\n          l-0.3,0.2H5.2c-0.2,0.6-0.6,1-1,1.3l0.8,0l-0.4,0.4L3.1,13l0.5-0.5l0.4,0c0.2-0.1,0.3-0.3,0.5-0.5s0.3-0.7,0.6-1.4l0.1-0.3\n          c0.2-0.7,0.5-1.1,0.7-1.4s0.5-0.5,0.9-0.7C6.3,8.1,5.8,8.1,5.4,8.1c-1.2,0-1.7,0.4-1.7,1.2C3.7,9.5,3.7,9.7,3.8,10z M6.8,10.9\n          c0-0.5-0.1-0.8-0.1-1.1c0-0.1,0-0.3,0-0.4l0-0.5c0-0.3,0-0.5,0.1-0.7C6.4,8.6,6,9.2,5.6,10.2c-0.1,0.3-0.1,0.4-0.2,0.5l-0.1,0.2\n          H6.8z\"/>\n        <path fill=\"#414042\" d=\"M9.8,10.9c0.3-0.5,0.6-0.9,0.9-1.2s0.6-0.5,0.9-0.5c0.4,0,0.6,0.3,0.6,1c0,0.8-0.2,1.4-0.7,2\n          c-0.5,0.6-1.1,0.8-1.8,0.8c-0.1,0-0.2,0-0.2,0l-0.3,0c0,0-0.1,0-0.1,0C9,12.8,9,12.6,9,12.4L9.4,9c0.1-0.8,0.4-1.5,0.9-2.1\n          s1.1-0.9,1.7-0.9c0.1,0,0.3,0,0.4,0l-0.6,0.6c-0.1,0-0.3-0.1-0.4-0.1c-0.8,0-1.2,0.6-1.4,1.8L9.8,10.9z M9.6,12.5\n          c0.2,0.1,0.5,0.2,0.7,0.2c0.4,0,0.6-0.2,0.9-0.6c0.2-0.4,0.3-1,0.3-1.6c0-0.4-0.1-0.6-0.3-0.6c-0.2,0-0.5,0.2-0.8,0.5\n          c-0.4,0.5-0.7,1-0.7,1.7L9.6,12.5z\"/>\n        <path fill=\"#414042\" d=\"M15.4,9.4l-0.4,0.5c-0.2-0.1-0.4-0.1-0.6-0.1c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.3-0.3,0.7-0.3,1.2\n          c0,0.4,0.1,0.6,0.2,0.9c0.1,0.2,0.3,0.3,0.6,0.3c0.4,0,0.7-0.3,0.9-0.8c0.1,0.1,0.1,0.1,0.1,0.2c0,0.2-0.2,0.5-0.5,0.7\n          c-0.3,0.3-0.6,0.4-0.9,0.4c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.8c0-0.7,0.2-1.3,0.7-1.8c0.5-0.6,1-0.8,1.5-0.8\n          C15,9.3,15.2,9.3,15.4,9.4z\"/>\n      </g>\n    </g>");
}
exports.font = font;
function flash(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-flash", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#42AAB1\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n    </g>\n    <path fill=\"#414042\" d=\"M13.1,6.2c-2.1-0.1-2.9,2.3-2.9,2.3h1.7l0,2.1l-2.5,0C8.8,11.9,7.6,15,4,15c0-0.1,0-1.8,0-2.1\n      c2.1-0.1,3.2-2.4,3.7-4.1c1.4-4.1,3.5-4.6,5.3-4.8V6.2z\"/>");
}
exports.flash = flash;

},{}],4:[function(require,module,exports){
/**
 *  Misc Helpers
 */
"use strict";
/**
 * Parses URL into it's components
 * @param  {string} url
 */
function parseUrl(url) {
    var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    var matches = url.match(pattern);
    return {
        scheme: matches[2],
        authority: matches[4],
        path: matches[5],
        query: matches[7],
        fragment: matches[9]
    };
}
exports.parseUrl = parseUrl;
/**
 * @param  {Array<T>} arr - array to search
 * @param  {T} item - item to search for
 * @returns boolean - true if `item` is in `arr`
 */
function contains(arr, item) {
    return arr.filter(function (x) { return x === item; }).length > 0;
}
exports.contains = contains;
/**
 * formats and shortes a url for ui
 * @param  {string} url
 * @param  {number} maxLength - max length of shortened url
 * @returns string
 */
function ressourceUrlFormater(url, maxLength) {
    if (url.length < maxLength) {
        return url.replace(/http[s]\:\/\//, "");
    }
    var matches = parseUrl(url);
    if ((matches.authority + matches.path).length < maxLength) {
        return matches.authority + matches.path;
    }
    var maxAuthLength = Math.floor(maxLength / 2) - 3;
    var maxPathLenth = Math.floor(maxLength / 2) - 5;
    // maybe we could finetune these numbers
    var p = matches.path.split("/");
    if (matches.authority.length > maxAuthLength) {
        return matches.authority.substr(0, maxAuthLength) + "..." + p[p.length - 1].substr(-maxPathLenth);
    }
    return matches.authority + "..." + p[p.length - 1].substr(-maxPathLenth);
}
exports.ressourceUrlFormater = ressourceUrlFormater;
/**
 * Helper to add a precision to `Math.round`
 * @param  {number} num - number to round
 * @param  {number} decimals - decimal precision to round to
 */
function roundNumber(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
exports.roundNumber = roundNumber;
/**
 *
 * Helper to polyfill `Object.assign` since the target is not ES6
 * @param  {Object} target
 * @param  {Object[]} ...sources
 */
function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (target === undefined || target === null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
}
exports.assign = assign;

},{}],5:[function(require,module,exports){
/**
 *  SVG Helpers
 */
"use strict";
function newEl(tagName, settings, css) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    settings = settings || {};
    for (var attr in settings) {
        if (attr !== "text") {
            el.setAttributeNS(null, attr, settings[attr]);
        }
    }
    el.textContent = settings["text"] || "";
    if (css && el.style) {
        Object.keys(css).forEach(function (key) {
            el.style[key] = css[key];
        });
    }
    return el;
}
exports.newEl = newEl;
function newSvg(cssClass, settings, css) {
    settings = settings || {};
    settings["class"] = cssClass;
    return newEl("svg:svg", settings, css);
}
exports.newSvg = newSvg;
function newG(cssClass, settings, css) {
    settings = settings || {};
    settings["class"] = cssClass;
    return newEl("g", settings, css);
}
exports.newG = newG;
function newTextEl(text, y, x, css) {
    css = css || {};
    var opt = {
        fill: "#111",
        y: y.toString(),
        text: text
    };
    if (x !== undefined) {
        opt["x"] = x;
    }
    return newEl("text", opt, css);
}
exports.newTextEl = newTextEl;
/** temp SVG element for size measurements  */
var getTestSVGEl = (function () {
    /** Reference to Temp SVG element for size measurements */
    var svgTestEl;
    var removeSvgTestElTimeout;
    return function getTestSVGElInner() {
        // lazy init svgTestEl
        if (svgTestEl === undefined) {
            svgTestEl = newEl("svg:svg", {
                "className": "water-fall-chart temp",
                "width": "9999px"
            }, {
                "visibility": "hidden",
                "position": "absoulte",
                "top": "0px",
                "left": "0px",
                "z-index": "99999"
            });
        }
        //needs access to body to measure size
        //TODO: refactor for server side use
        if (svgTestEl.parentElement === undefined) {
            window.document.body.appendChild(svgTestEl);
        }
        //debounced time-deleayed cleanup, so the element can be re-used in tight loops
        clearTimeout(removeSvgTestElTimeout);
        removeSvgTestElTimeout = setTimeout(function () {
            svgTestEl.parentNode.removeChild(svgTestEl);
        }, 1000);
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
    var tmp = getTestSVGEl();
    var tmpTextNode;
    if (skipClone) {
        tmpTextNode = textNode;
    }
    else {
        tmpTextNode = textNode.cloneNode(false);
    }
    tmp.appendChild(tmpTextNode);
    //make sure to turn of shadow for performance
    tmpTextNode.style.textShadow = "0";
    window.document.body.appendChild(tmp);
    var nodeWidth = tmpTextNode.getBBox().width;
    return nodeWidth;
}
exports.getNodeTextWidth = getNodeTextWidth;
/**
 * Adds class `className` to `el`
 * @param  {SVGElement} el
 * @param  {string} className
 */
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    }
    else {
        // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
        el.setAttribute("class", el.getAttribute("class") + " " + className);
    }
    return el;
}
exports.addClass = addClass;
/**
 * Removes class `className` from `el`
 * @param  {SVGElement} el
 * @param  {string} className
 */
function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    }
    else {
        //IE doesn't support classList in SVG - also no need for dublication check i.t.m.
        el.setAttribute("class", el.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
    }
    return el;
}
exports.removeClass = removeClass;

},{}],6:[function(require,module,exports){
"use strict";
var svg_chart_1 = require("./waterfall/svg-chart");
var paging = require("./paging/paging");
var har_1 = require("./transformers/har");
var waterfallDocsService = require("./state/waterfall-docs-service");
var globalStateService = require("./state/global-state");
var misc = require("./helpers/misc");
/** default options to use if not set in `options` parameter */
var defaultOptions = {
    rowHeight: 23,
    showAlignmentHelpers: true,
    showIndicatorIcons: true,
    leftColumnWith: 25
};
function PerfCascade(waterfallDocsData, chartOptions) {
    var options = misc.assign(defaultOptions, chartOptions || {});
    //setup state setvices
    globalStateService.init(options);
    waterfallDocsService.storeDocs(waterfallDocsData);
    var doc = svg_chart_1.createWaterfallSvg(paging.getSelectedPage());
    //page update behaviour
    paging.onPageUpdate(function (pageIndex, pageDoc) {
        var el = doc.parentElement;
        var newDoc = svg_chart_1.createWaterfallSvg(pageDoc);
        el.replaceChild(newDoc, doc);
        doc = newDoc;
    });
    if (options.pageSelector) {
        paging.initPagingSelectBox(options.pageSelector);
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
    return PerfCascade(har_1.default.transformDoc(harData), options);
}
/**
 * Create new PerfCascade from PerfCascade's internal WaterfallData format
 * @param {WaterfallDocs} waterfallDocsData Object containing data to render
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromPerfCascadeFormat(waterfallDocsData, options) {
    return PerfCascade(waterfallDocsData, options);
}
module.exports = {
    fromHar: fromHar,
    fromPerfCascadeFormat: fromPerfCascadeFormat,
    transformHarToPerfCascade: har_1.default.transformDoc,
    changePage: paging.setSelectedPageIndex
};

},{"./helpers/misc":4,"./paging/paging":7,"./state/global-state":8,"./state/waterfall-docs-service":9,"./transformers/har":10,"./waterfall/svg-chart":24}],7:[function(require,module,exports){
"use strict";
var waterfallDocsService = require("../state/waterfall-docs-service");
var selectedPageIndex = 0;
var onPageUpdateCbs = [];
/**
 * Returns number of pages
 * @returns number - number of pages in current doc
 */
function getPageCount() {
    return waterfallDocsService.getDocs().pages.length;
}
exports.getPageCount = getPageCount;
/**
 * Returns selected pages
 * @returns WaterfallData - currerently selected page
 */
function getSelectedPage() {
    return waterfallDocsService.getDocs().pages[selectedPageIndex];
}
exports.getSelectedPage = getSelectedPage;
/**
 * Returns index of currently selected page
 * @returns number - index of current page (0 based)
 */
function getSelectedPageIndex() {
    return selectedPageIndex;
}
exports.getSelectedPageIndex = getSelectedPageIndex;
/**
 * Update which pageIndex is currently update.
 * Published `onPageUpdate`
 * @param  {number} pageIndex
 */
function setSelectedPageIndex(pageIndex) {
    if (selectedPageIndex === pageIndex) {
        return;
    }
    if (pageIndex < 0 || pageIndex >= getPageCount()) {
        throw new Error("Page does not exist - Invalid pageIndex selected");
    }
    selectedPageIndex = pageIndex;
    var selectedPage = waterfallDocsService.getDocs().pages[selectedPageIndex];
    onPageUpdateCbs.forEach(function (cd) {
        cd(selectedPageIndex, selectedPage);
    });
}
exports.setSelectedPageIndex = setSelectedPageIndex;
/**
 * Register subscriber callbacks to be called when the pageindex updates
 * @param  {OnPagingCb} cb
 * @returns number - index of the callback
 */
function onPageUpdate(cb) {
    if (getPageCount() > 1) {
        return onPageUpdateCbs.push(cb);
    }
    return undefined;
}
exports.onPageUpdate = onPageUpdate;
/**
 * hooks up select box with paging options
 * @param  {HTMLSelectElement} selectbox
 */
function initPagingSelectBox(selectbox) {
    if (getPageCount() <= 1) {
        return;
    }
    waterfallDocsService.getDocs().pages.forEach(function (p, i) {
        var option = new Option(p.title, i.toString(), i === selectedPageIndex);
        selectbox.add(option);
    });
    selectbox.style.display = "block";
    selectbox.addEventListener("change", function (evt) {
        var val = parseInt(evt.target.value, 10);
        setSelectedPageIndex(val);
    });
}
exports.initPagingSelectBox = initPagingSelectBox;

},{"../state/waterfall-docs-service":9}],8:[function(require,module,exports){
"use strict";
var optionsStore;
/**
 * Setup all (generic) global state
 * @param  {ChartOptions} options
 */
function init(options) {
    optionsStore = options;
}
exports.init = init;
/**
 * Returns PerfCascade's init options
 * @returns ChartOptions
 */
function getOptions() {
    return optionsStore;
}
exports.getOptions = getOptions;

},{}],9:[function(require,module,exports){
"use strict";
/*
* Central service to store HAR data
* and make it accessible everywhere by importing this module
*/
var docs;
/**
 * Store Waterfall-Docs data centrally for Multi-page HARs
 * @param  {WaterfallDocs} waterfallDocs
 */
function storeDocs(waterfallDocs) {
    docs = waterfallDocs;
}
exports.storeDocs = storeDocs;
/**
 * Get stored Waterfall-Docs
 * @returns WaterfallDocs
 */
function getDocs() {
    return docs;
}
exports.getDocs = getDocs;

},{}],10:[function(require,module,exports){
"use strict";
var time_block_1 = require("../typing/time-block");
var styling_converters_1 = require("./styling-converters");
var HarTransformer = (function () {
    function HarTransformer() {
    }
    /**
     * Trasforms the full HAR doc, including all pages
     * @param  {Har} harData - raw hhar object
     * @returns WaterfallDocs
     */
    HarTransformer.transformDoc = function (harData) {
        var _this = this;
        //make sure it's the *.log base node
        var data = (harData["log"] !== undefined ? harData["log"] : harData);
        console.log("HAR created by %s(%s) %s page(s)", data.creator.name, data.creator.version, data.pages.length);
        var waterfallDocs = {
            pages: data.pages.map(function (page, i) { return _this.transformPage(data, i); })
        };
        return waterfallDocs;
    };
    /**
     * Transforms a HAR object into the format needed to render the PerfCascade
     * @param  {Har} harData - HAR document
     * @param {number=0} pageIndex - page to parse (for multi-page HAR)
     * @returns WaterfallData
     */
    HarTransformer.transformPage = function (harData, pageIndex) {
        var _this = this;
        if (pageIndex === void 0) { pageIndex = 0; }
        //make sure it's the *.log base node
        var data = (harData["log"] !== undefined ? harData["log"] : harData);
        //only support one page (first) for now
        var currentPageIndex = pageIndex;
        var currPage = data.pages[currentPageIndex];
        var pageStartTime = new Date(currPage.startedDateTime).getTime();
        var pageTimings = currPage.pageTimings;
        console.log("%s: %s of %s page(s)", currPage.title, pageIndex + 1, data.pages.length);
        var doneTime = 0;
        var blocks = data.entries
            .filter(function (entry) { return entry.pageref === currPage.id; })
            .map(function (entry) {
            var startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime;
            if (doneTime < (startRelative + entry.time)) {
                doneTime = startRelative + entry.time;
            }
            return new time_block_1.default(entry.request.url, startRelative, parseInt(entry._all_end, 10) || (startRelative + entry.time), styling_converters_1.mimeToCssClass(entry.response.content.mimeType), _this.buildDetailTimingBlocks(startRelative, entry), entry, styling_converters_1.mimeToRequestType(entry.response.content.mimeType));
        });
        var marks = Object.keys(pageTimings)
            .filter(function (k) { return (pageTimings[k] !== undefined && pageTimings[k] >= 0); })
            .sort(function (a, b) { return pageTimings[a] > pageTimings[b] ? 1 : -1; })
            .map(function (k) {
            var startRelative = pageTimings[k];
            return {
                "name": k.replace(/^[_]/, "") + " (" + startRelative + "ms)",
                "startTime": startRelative
            };
        });
        return {
            durationMs: doneTime,
            blocks: blocks,
            marks: marks,
            lines: [],
            title: currPage.title,
        };
    };
    /**
     * Create `TimeBlock`s to represent the subtimings of a request ("blocked", "dns", "connect", "send", "wait", "receive")
     * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
     * @param  {Entry} entry
     * @returns Array
     */
    HarTransformer.buildDetailTimingBlocks = function (startRelative, entry) {
        var _this = this;
        var t = entry.timings;
        return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce(function (collect, key) {
            var time = _this.getTimePair(key, entry, collect, startRelative);
            if (time.end && time.start >= time.end) {
                return collect;
            }
            //special case for 'connect' && 'ssl' since they share time
            //http://www.softwareishard.com/blog/har-12-spec/#timings
            if (key === "connect" && t["ssl"] && t["ssl"] !== -1) {
                var sslStart = parseInt(entry["_ssl_start"], 10) || time.start;
                var sslEnd = parseInt(entry["_ssl_end"], 10) || time.start + t.ssl;
                var connectStart = (!!parseInt(entry["_ssl_start"], 10)) ? time.start : sslEnd;
                return collect
                    .concat([new time_block_1.default("ssl", sslStart, sslEnd, "block-ssl")])
                    .concat([new time_block_1.default(key, connectStart, time.end, "block-" + key)]);
            }
            return collect.concat([new time_block_1.default(key, time.start, time.end, "block-" + key)]);
        }, []);
    };
    /**
     * Returns Object containing start and end time of `collect`
     *
     * @param  {string} key
     * @param  {Entry} entry
     * @param  {Array<TimeBlock>} collect
     * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
     * @returns {Object}
     */
    HarTransformer.getTimePair = function (key, entry, collect, startRelative) {
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
        var preciseStart = parseInt(entry[("_" + wptKey + "_start")], 10);
        var preciseEnd = parseInt(entry[("_" + wptKey + "_end")], 10);
        var start = isNaN(preciseStart) ? ((collect.length > 0) ? collect[collect.length - 1].end : startRelative) : preciseStart;
        var end = isNaN(preciseEnd) ? (start + entry.timings[key]) : preciseEnd;
        return {
            "start": start,
            "end": end
        };
    };
    return HarTransformer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HarTransformer;

},{"../typing/time-block":12,"./styling-converters":11}],11:[function(require,module,exports){
"use strict";
/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType
 */
function mimeToRequestType(mimeType) {
    var types = mimeType.split("/");
    var part2 = types[1];
    // take care of text/css; charset=UTF-8 etc
    if (part2 !== undefined) {
        part2 = part2.indexOf(";") > -1 ? part2.split(";")[0] : part2;
    }
    switch (types[0]) {
        case "image": return "image";
        case "font": return "font";
    }
    switch (part2) {
        case "svg+xml": return "svg";
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
    }
    return "other";
}
exports.mimeToRequestType = mimeToRequestType;
/**
 * Convert a MIME type into a CSS class
 * @param {string} mimeType
 */
function mimeToCssClass(mimeType) {
    return "block-" + mimeToRequestType(mimeType);
}
exports.mimeToCssClass = mimeToCssClass;

},{}],12:[function(require,module,exports){
"use strict";
var TimeBlock = (function () {
    function TimeBlock(name, start, end, cssClass, segments, rawResource, requestType) {
        if (cssClass === void 0) { cssClass = ""; }
        if (segments === void 0) { segments = []; }
        this.name = name;
        this.start = start;
        this.end = end;
        this.cssClass = cssClass;
        this.segments = segments;
        this.rawResource = rawResource;
        this.requestType = requestType;
        this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
    }
    return TimeBlock;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeBlock;

},{}],13:[function(require,module,exports){
"use strict";
var ifValueDefined = function (value, fn) {
    if (typeof value !== "number" || value <= 0) {
        return undefined;
    }
    return fn(value);
};
var formatBytes = function (size) { return ifValueDefined(size, function (s) { return (s + " byte (~" + Math.round(s / 1024 * 10) / 10 + "kb)"); }); };
var formatTime = function (size) { return ifValueDefined(size, function (s) { return (s + "ms"); }); };
var formatDate = function (date) {
    if (!date) {
        return "";
    }
    var dateToFormat = new Date(date);
    return date + " </br>(local time: " + dateToFormat.toLocaleString() + ")";
};
var asIntPartial = function (val, ifIntFn) {
    var v = parseInt(val, 10);
    return ifValueDefined(v, ifIntFn);
};
/**
 * Data to show in overlay tabs
 * @param  {number} requestID - request number
 * @param  {TimeBlock} block
 */
function getKeys(requestID, block) {
    //TODO: dodgy casting - will not work for other adapters
    var entry = block.rawResource;
    var getRequestHeader = function (name) {
        var header = entry.request.headers.filter(function (h) { return h.name.toLowerCase() === name.toLowerCase(); })[0];
        return header ? header.value : "";
    };
    var getResponseHeader = function (name) {
        var header = entry.response.headers.filter(function (h) { return h.name.toLowerCase() === name.toLowerCase(); })[0];
        return header ? header.value : "";
    };
    var getContentType = function () {
        var respContentType = getResponseHeader("Content-Type");
        if (entry._contentType && entry._contentType !== respContentType) {
            return respContentType + " | " + entry._contentType;
        }
        return respContentType;
    };
    /** get experimental feature */
    var getExp = function (name) {
        return entry[name] || entry["_" + name] || entry.request[name] || entry.request["_" + name] || "";
    };
    var getExpNotNull = function (name) {
        var resp = getExp(name);
        return resp !== "0" ? resp : "";
    };
    var getExpAsByte = function (name) {
        var resp = parseInt(getExp(name), 10);
        return (isNaN(resp) || resp <= 0) ? "" : formatBytes(resp);
    };
    var getExpTimeRange = function (name) {
        var ms = getExp(name + "_ms").toString();
        var start = getExp(name + "_start");
        var end = getExp(name + "_end");
        var resp = [];
        if (start && end && start < end) {
            resp.push(start + "ms - " + end + "ms");
        }
        if (ms && ms !== "-1") {
            resp.push("(" + ms + "ms)");
        }
        return resp.join(" ");
    };
    return {
        "general": {
            "Request Number": "#" + requestID,
            "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page reqest started)",
            "Duration": formatTime(entry.time),
            "Error/Status Code": entry.response.status + " " + entry.response.statusText,
            "Server IPAddress": entry.serverIPAddress,
            "Connection": entry.connection,
            "Browser Priority": getExp("priority") || getExp("initialPriority"),
            "Initiator (Loaded by)": getExp("initiator"),
            "Initiator Line": getExp("initiator_line"),
            "Host": getRequestHeader("Host"),
            "IP": getExp("ip_addr"),
            "Client Port": getExpNotNull("client_port"),
            "Expires": getExp("expires"),
            "Cache Time": getExp("cache_time"),
            "CDN Provider": getExp("cdn_provider"),
            "ObjectSize": getExp("objectSize"),
            "Bytes In (downloaded)": getExpAsByte("bytesIn"),
            "Bytes Out (uploaded)": getExpAsByte("bytesOut"),
            "JPEG Scan Count": getExpNotNull("jpeg_scan_count"),
            "Gzip Total": getExpAsByte("gzip_total"),
            "Gzip Save": getExpAsByte("gzip_safe"),
            "Minify Total": getExpAsByte("minify_total"),
            "Minify Save": getExpAsByte("minify_save"),
            "Image Total": getExpAsByte("image_total"),
            "Image Save": getExpAsByte("image_save"),
        },
        "timings": {
            "Server RTT": getExpTimeRange("server_rtt"),
            "all (combined)": getExpTimeRange("all"),
            "DNS": getExpTimeRange("dns"),
            "Connect": getExpTimeRange("connect"),
            "TLS/SSL": getExpTimeRange("ssl"),
            "Load": getExpTimeRange("load"),
            "TTFB": getExpTimeRange("ttfb"),
            "Download": getExpTimeRange("download"),
        },
        "request": {
            "Method": entry.request.method,
            "HTTP Version": entry.request.httpVersion,
            "Bytes Out (uploaded)": getExpAsByte("bytesOut"),
            "Headers Size": formatBytes(entry.request.headersSize),
            "Body Size": formatBytes(entry.request.bodySize),
            "Comment": entry.request.comment,
            "User-Agent": getRequestHeader("User-Agent"),
            "Host": getRequestHeader("Host"),
            "Connection": getRequestHeader("Connection"),
            "Accept": getRequestHeader("Accept"),
            "Accept-Encoding": getRequestHeader("Accept-Encoding"),
            "Expect": getRequestHeader("Expect"),
            "Forwarded": getRequestHeader("Forwarded"),
            "If-Modified-Since": getRequestHeader("If-Modified-Since"),
            "If-Range": getRequestHeader("If-Range"),
            "If-Unmodified-Since": getRequestHeader("If-Unmodified-Since"),
            "Querystring parameters count": entry.request.queryString.length,
            "Cookies count": entry.request.cookies.length
        },
        "response": {
            "Status": entry.response.status + " " + entry.response.statusText,
            "HTTP Version": entry.response.httpVersion,
            "Bytes In (downloaded)": getExpAsByte("bytesIn"),
            "Header Size": formatBytes(entry.response.headersSize),
            "Body Size": formatBytes(entry.response.bodySize),
            "Content-Type": getContentType(),
            "Cache-Control": getResponseHeader("Cache-Control"),
            "Content-Encoding": getResponseHeader("Content-Encoding"),
            "Expires": formatDate(getResponseHeader("Expires")),
            "Last-Modified": formatDate(getResponseHeader("Last-Modified")),
            "Pragma": getResponseHeader("Pragma"),
            "Content-Length": asIntPartial(getResponseHeader("Content-Length"), formatBytes),
            "Content Size": getResponseHeader("Content-Length") !== entry.response.content.size.toString() ?
                formatBytes(entry.response.content.size) : "",
            "Content Compression": formatBytes(entry.response.content.compression),
            "Connection": getResponseHeader("Connection"),
            "ETag": getResponseHeader("ETag"),
            "Accept-Patch": getResponseHeader("Accept-Patch"),
            "Age": getResponseHeader("Age"),
            "Allow": getResponseHeader("Allow"),
            "Content-Disposition": getResponseHeader("Content-Disposition"),
            "Location": getResponseHeader("Location"),
            "Strict-Transport-Security": getResponseHeader("Strict-Transport-Security"),
            "Trailer (for chunked transfer coding)": getResponseHeader("Trailer"),
            "Transfer-Encoding": getResponseHeader("Transfer-Encoding"),
            "Upgrade": getResponseHeader("Upgrade"),
            "Vary": getResponseHeader("Vary"),
            "Timing-Allow-Origin": getResponseHeader("Timing-Allow-Origin"),
            "Redirect URL": entry.response.redirectURL,
            "Comment": entry.response.comment
        }
    };
}
exports.getKeys = getKeys;

},{}],14:[function(require,module,exports){
"use strict";
var extract_details_keys_1 = require("./extract-details-keys");
function makeDefinitionList(dlKeyValues, addClass) {
    if (addClass === void 0) { addClass = false; }
    var makeClass = function (key) {
        if (!addClass) {
            return "";
        }
        var className = key.toLowerCase().replace(/[^a-z-]/g, "");
        return "class=\"" + (className || "no-colour") + "\"";
    };
    return Object.keys(dlKeyValues)
        .filter(function (key) { return (dlKeyValues[key] !== undefined && dlKeyValues[key] !== -1 && dlKeyValues[key] !== 0 && dlKeyValues[key] !== ""); })
        .map(function (key) { return ("\n      <dt " + makeClass(key) + ">" + key + "</dt>\n      <dd>" + dlKeyValues[key] + "</dd>\n    "); }).join("");
}
function makeTab(innerHtml, renderDl) {
    if (renderDl === void 0) { renderDl = true; }
    if (innerHtml.trim() === "") {
        return "";
    }
    var inner = renderDl ? "<dl>" + innerHtml + "</dl>" : innerHtml;
    return "<div class=\"tab\">\n    " + inner + "\n  </div>";
}
function makeImgTab(accordeonHeight, block) {
    if (block.requestType !== "image") {
        return "";
    }
    var imgTag = "<img class=\"preview\" style=\"max-height:" + (accordeonHeight - 100) + "px\" data-src=\"" + block.rawResource.request.url + "\" />";
    return makeTab(imgTag, false);
}
function makeTabBtn(name, tab) {
    return !!tab ? "<li><button class=\"tab-button\">" + name + "</button></li>" : "";
}
function createDetailsBody(requestID, block, accordeonHeight) {
    var html = document.createElement("html");
    var body = document.createElement("body");
    body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");
    var tabsData = extract_details_keys_1.getKeys(requestID, block);
    var generalTab = makeTab(makeDefinitionList(tabsData.general));
    var timingsTab = makeTab(makeDefinitionList(tabsData.timings, true));
    var requestDl = makeDefinitionList(tabsData.request);
    var requestHeadersDl = makeDefinitionList(block.rawResource.request.headers.reduce(function (pre, curr) {
        pre[curr.name] = curr.value;
        return pre;
    }, {}));
    var responseDl = makeDefinitionList(tabsData.response);
    var responseHeadersDl = makeDefinitionList(block.rawResource.response.headers.reduce(function (pre, curr) {
        pre[curr.name] = curr.value;
        return pre;
    }, {}));
    var imgTab = makeImgTab(accordeonHeight, block);
    body.innerHTML = "\n    <div class=\"wrapper\">\n      <header class=\"type-" + block.requestType + "\">\n        <h3><strong>#" + requestID + "</strong> " + block.name + "</h3>\n        <nav class=\"tab-nav\">\n        <ul>\n          " + makeTabBtn("Preview", imgTab) + "\n          " + makeTabBtn("General", generalTab) + "\n          <li><button class=\"tab-button\">Request</button></li>\n          <li><button class=\"tab-button\">Response</button></li>\n          " + makeTabBtn("Timings", timingsTab) + "\n          <li><button class=\"tab-button\">Raw Data</button></li>\n        </ul>\n        </nav>\n      </header>\n      " + imgTab + "\n      " + generalTab + "\n      <div class=\"tab\">\n        <dl>\n          " + requestDl + "\n        </dl>\n        <h2>All Request Headers</h2>\n        <dl>\n          " + requestHeadersDl + "\n        </dl>\n      </div>\n      <div class=\"tab\">\n        <dl>\n          " + responseDl + "\n        </dl>\n        <h2>All Response Headers</h2>\n        <dl>\n          " + responseHeadersDl + "\n        </dl>\n      </div>\n      " + timingsTab + "\n      <div class=\"tab\">\n        <code>\n          <pre>" + JSON.stringify(block.rawResource, null, 2) + "</pre>\n        </code>\n      </div>\n    </div>\n    ";
    html.appendChild(body);
    return html;
}
exports.createDetailsBody = createDetailsBody;

},{"./extract-details-keys":13}],15:[function(require,module,exports){
//simple pub/sub for change to the overlay
"use strict";
exports.eventTypes = {
    "OPEN": "open",
    "CLOSE": "closed"
};
var subscribers = [];
function subscribeToOvelayChanges(fn) {
    subscribers.push(fn);
}
exports.subscribeToOvelayChanges = subscribeToOvelayChanges;
//no need for unsubscribe in the moment
function publishToOvelayChanges(change) {
    subscribers.forEach(function (fn) { return fn(change); });
}
exports.publishToOvelayChanges = publishToOvelayChanges;

},{}],16:[function(require,module,exports){
"use strict";
var svg_details_overlay_1 = require("./svg-details-overlay");
var overlayChangesPubSub = require("./overlay-changes-pub-sub");
/** Collection of currely open overlays */
var openOverlays = [];
/** all open overlays height combined */
function getCombinedOverlayHeight() {
    return openOverlays.reduce(function (pre, curr) { return pre + curr.height; }, 0);
}
exports.getCombinedOverlayHeight = getCombinedOverlayHeight;
/** y offset to it's default y position */
function getOverlayOffset(rowIndex) {
    return openOverlays.reduce(function (col, overlay) {
        if (overlay.index < rowIndex) {
            return col + overlay.height;
        }
        return col;
    }, 0);
}
exports.getOverlayOffset = getOverlayOffset;
/**
 * closes on overlay - rerenders others internaly
 */
function closeOvelay(index, holder, overlayHolder, barX, accordeonHeigh, barEls, unit) {
    openOverlays.splice(openOverlays.reduce(function (prev, curr, i) {
        return (curr.index === index) ? i : prev;
    }, -1), 1);
    renderOverlays(barX, accordeonHeigh, overlayHolder, unit);
    overlayChangesPubSub.publishToOvelayChanges({
        "type": overlayChangesPubSub.eventTypes.CLOSE,
        "openOverlays": openOverlays,
        "combinedOverlayHeight": getCombinedOverlayHeight()
    });
    reAlignBars(barEls);
}
exports.closeOvelay = closeOvelay;
/**
 * Opens an overlay - rerenders others internaly
 */
function openOverlay(index, barX, y, accordeonHeight, block, overlayHolder, barEls, unit) {
    var _this = this;
    if (openOverlays.filter(function (o) { return o.index === index; }).length > 0) {
        return;
    }
    openOverlays.push({
        "index": index,
        "defaultY": y,
        "block": block,
        "onClose": function () {
            _this.closeOvelay(index, null, overlayHolder, barX, accordeonHeight, barEls, unit);
        }
    });
    renderOverlays(barX, accordeonHeight, overlayHolder, unit);
    overlayChangesPubSub.publishToOvelayChanges({
        "type": overlayChangesPubSub.eventTypes.OPEN,
        "openOverlays": openOverlays,
        "combinedOverlayHeight": getCombinedOverlayHeight()
    });
    reAlignBars(barEls);
}
exports.openOverlay = openOverlay;
/**
 * sets the offset for request-bars
 * @param  {SVGGElement[]} barEls
 */
function reAlignBars(barEls) {
    barEls.forEach(function (bar, j) {
        var offset = getOverlayOffset(j);
        bar.style.transform = "translate(0, " + offset + "px)";
    });
}
/**
 * removes all overlays and renders them again
 *
 * @summary this is to re-set the "y" position since there is a bug in chrome with
 * tranform of an SVG and positioning/scoll of a foreignObjects
 * @param  {number} barX
 * @param  {number} accordeonHeight
 * @param  {SVGGElement} overlayHolder
 * @param  {number} unit
 */
function renderOverlays(barX, accordeonHeight, overlayHolder, unit) {
    while (overlayHolder.firstChild) {
        overlayHolder.removeChild(overlayHolder.firstChild);
    }
    var currY = 0;
    openOverlays
        .sort(function (a, b) { return a.index > b.index ? 1 : -1; })
        .forEach(function (overlay) {
        var y = overlay.defaultY + currY;
        var infoOverlay = svg_details_overlay_1.createRowInfoOverlay(overlay.index, barX, y, accordeonHeight, overlay.block, overlay.onClose, unit);
        //if overlay has a preview image show it
        var previewImg = infoOverlay.querySelector("img.preview");
        if (previewImg && !previewImg.src) {
            previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value);
        }
        overlayHolder.appendChild(infoOverlay);
        var currHeight = infoOverlay.getBoundingClientRect().height;
        currY += currHeight;
        overlay.actualY = y;
        overlay.height = currHeight;
        return overlay;
    });
}

},{"./overlay-changes-pub-sub":15,"./svg-details-overlay":17}],17:[function(require,module,exports){
"use strict";
var svg = require("../../helpers/svg");
var dom = require("../../helpers/dom");
var html_details_body_1 = require("./html-details-body");
function createCloseButtonSvg(y) {
    var closeBtn = svg.newEl("a", {
        "class": "info-overlay-close-btn"
    });
    closeBtn.appendChild(svg.newEl("rect", {
        "width": 23,
        "height": 23,
        "x": "100%",
        "y": y
    }));
    closeBtn.appendChild(svg.newEl("text", {
        "width": 23,
        "height": 23,
        "x": "100%",
        "y": y,
        "dx": 7,
        "dy": 16,
        "fill": "#111",
        "text": "X",
        "textAnchor": "middle"
    }));
    closeBtn.appendChild(svg.newEl("title", {
        "text": "Close Overlay"
    }));
    return closeBtn;
}
function createHolder(y, accordeonHeight) {
    var innerHolder = svg.newG("info-overlay-holder", {
        "width": "100%"
    });
    var bg = svg.newEl("rect", {
        "width": "100%",
        "height": accordeonHeight,
        "x": "0",
        "y": y,
        "rx": 2,
        "ry": 2,
        "class": "info-overlay"
    });
    innerHolder.appendChild(bg);
    return innerHolder;
}
function createRowInfoOverlay(indexBackup, barX, y, accordeonHeight, block, onClose, unit) {
    var requestID = parseInt(block.rawResource._index, 10) || indexBackup;
    var wrapper = svg.newG("outer-info-overlay-holder", {
        "width": "100%"
    });
    var holder = createHolder(y, accordeonHeight);
    var foreignObject = svg.newEl("foreignObject", {
        "width": "100%",
        "height": accordeonHeight,
        "x": "0",
        "y": y,
        "dy": "5",
        "dx": "5"
    });
    var closeBtn = createCloseButtonSvg(y);
    closeBtn.addEventListener("click", function (evt) { return onClose(indexBackup, holder); });
    var body = html_details_body_1.createDetailsBody(requestID, block, accordeonHeight);
    var buttons = body.getElementsByClassName("tab-button");
    var tabs = body.getElementsByClassName("tab");
    var setTabStatus = function (index) {
        dom.forEach(tabs, function (tab, j) {
            tab.style.display = (index === j) ? "block" : "none";
            buttons.item(j).classList.toggle("active", (index === j));
        });
    };
    dom.forEach(buttons, function (btn, i) {
        btn.addEventListener("click", function () { setTabStatus(i); });
    });
    setTabStatus(0);
    foreignObject.appendChild(body);
    holder.appendChild(foreignObject);
    holder.appendChild(closeBtn);
    wrapper.appendChild(holder);
    return wrapper;
}
exports.createRowInfoOverlay = createRowInfoOverlay;

},{"../../helpers/dom":1,"../../helpers/svg":5,"./html-details-body":14}],18:[function(require,module,exports){
/**
 * Creation of sub-components used in a ressource request row
 */
"use strict";
var heuristics = require("../../helpers/heuristics");
/**
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @param  {boolean} docIsSsl
 * @returns IconMetadata
 */
function getIndicators(block, docIsSsl) {
    var iconWidth = 20;
    var entry = block.rawResource;
    var output = [];
    var xPos = 3;
    // helper to avoid typing out all key of the helper object
    var makeIcon = function (type, title) {
        output.push({ "type": type, "x": xPos, "title": title });
        xPos += iconWidth;
    };
    makeIcon(block.requestType, block.requestType);
    //highlight redirects
    if (!!entry.response.redirectURL) {
        var url = encodeURI(entry.response.redirectURL.split("?")[0] || "");
        makeIcon("err3xx", entry.response.status + " response status: Redirect to " + url + "...");
    }
    if (!docIsSsl && heuristics.isSecure(block)) {
        makeIcon("lock", "Secure Connection");
    }
    else if (docIsSsl && !heuristics.isSecure(block)) {
        makeIcon("noTls", "Insecure Connection");
    }
    if (heuristics.hasCacheIssue(block)) {
        makeIcon("noCache", "Response not cached");
    }
    if (heuristics.hasCompressionIssue(block)) {
        makeIcon("noGzip", "no gzip");
    }
    if (heuristics.isInStatusCodeRange(entry, 400, 499)) {
        makeIcon("err4xx", entry.response.status + " response status: " + entry.response.statusText);
    }
    if (heuristics.isInStatusCodeRange(entry, 500, 599)) {
        makeIcon("err5xx", entry.response.status + " response status: " + entry.response.statusText);
    }
    if (!entry.response.content.mimeType && heuristics.isInStatusCodeRange(entry, 200, 299)) {
        makeIcon("warning", "No MIME Type defined");
    }
    return output;
}
exports.getIndicators = getIndicators;

},{"../../helpers/heuristics":2}],19:[function(require,module,exports){
/**
 * Creation of sub-components used in a ressource request row
 */
"use strict";
var svg = require("../../helpers/svg");
var misc = require("../../helpers/misc");
/**
 * Creates the `rect` that represent the timings in `rectData`
 * @param  {RectData} rectData - Data for block
 * @param  {string} className - className for block `rect`
 */
function makeBlock(rectData, className) {
    var blockHeight = rectData.height - 1;
    var rect = svg.newEl("rect", {
        "width": misc.roundNumber(rectData.width / rectData.unit, 2) + "%",
        "height": blockHeight,
        "x": misc.roundNumber(rectData.x / rectData.unit, 2) + "%",
        "y": rectData.y,
        "class": className
    });
    if (rectData.label) {
        rect.appendChild(svg.newEl("title", {
            "text": rectData.label
        })); // Add tile to wedge path
    }
    if (rectData.showOverlay && rectData.hideOverlay) {
        rect.addEventListener("mouseenter", rectData.showOverlay(rectData));
        rect.addEventListener("mouseleave", rectData.hideOverlay(rectData));
    }
    return rect;
}
/**
 * Converts a segment to RectData
 * @param  {TimeBlock} segment
 * @param  {RectData} rectData
 * @returns RectData
 */
function segmentToRectData(segment, rectData) {
    return {
        "width": segment.total,
        "height": (rectData.height - 6),
        "x": segment.start || 0.001,
        "y": rectData.y,
        "cssClass": segment.cssClass,
        "label": segment.name + " (" + Math.round(segment.start) + "ms - "
            + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
        "unit": rectData.unit,
        "showOverlay": rectData.showOverlay,
        "hideOverlay": rectData.hideOverlay
    };
}
/**
 * @param  {RectData} rectData
 * @param  {number} timeTotal
 * @param  {number} firstX
 * @returns SVGTextElement
 */
function createTimingLable(rectData, timeTotal, firstX) {
    var minWidth = 500; // minimum supported diagram width that should show the timing lable uncropped
    var spacingPerc = (5 / minWidth * 100);
    var y = rectData.y + rectData.height / 1.5;
    var percStart = (rectData.x + rectData.width) / rectData.unit + spacingPerc;
    var txtEl = svg.newTextEl(timeTotal + "ms", y, misc.roundNumber(percStart, 2) + "%");
    //(pessimistic) estimation of text with to avoid performance penalty of `getBBox`
    var roughTxtWidth = (timeTotal + "ms").length * 8;
    if (percStart + (roughTxtWidth / minWidth * 100) > 100) {
        percStart = firstX / rectData.unit - spacingPerc;
        txtEl = svg.newTextEl(timeTotal + "ms", y, misc.roundNumber(percStart, 2) + "%", { "textAnchor": "end" });
    }
    return txtEl;
}
/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {Array<TimeBlock>} segments Request and Timing Data
 * @param  {number} timeTotal  - total time of the request
 * @return {SVGElement}                Renerated SVG (rect or g element)
 */
function createRect(rectData, segments, timeTotal) {
    var rect = makeBlock(rectData, "time-block " + (rectData.cssClass || "block-other"));
    var rectHolder = svg.newEl("g", {
        "class": "rect-holder"
    });
    var firstX = rectData.x;
    rectHolder.appendChild(rect);
    if (segments && segments.length > 0) {
        segments.forEach(function (segment) {
            if (segment.total > 0 && typeof segment.start === "number") {
                var childRectData = segmentToRectData(segment, rectData);
                var childRect = makeBlock(childRectData, "segment " + childRectData.cssClass);
                firstX = Math.min(firstX, childRectData.x);
                rectHolder.appendChild(childRect);
            }
        });
        rectHolder.appendChild(createTimingLable(rectData, timeTotal, firstX));
    }
    return rectHolder;
}
exports.createRect = createRect;
/**
 * Create a new clipper SVG Text element to label a request block to fit the left panel width
 * @param  {number}         x                horizontal position (in px)
 * @param  {number}         y                vertical position of related request block (in px)
 * @param  {string}         name             URL
 * @param  {number}         height           height of row
 * @return {SVGTextElement}                  lable SVG element
 */
function createRequestLabelClipped(x, y, name, height, clipPathId) {
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
    var lableHolder = svg.newG("full-lable");
    lableHolder.appendChild(svg.newEl("rect", {
        "class": "label-full-bg",
        "x": x - 3,
        "y": y + 3,
        "width": svg.getNodeTextWidth(blockLabel),
        "height": height - 4,
        "rx": 5,
        "ry": 5
    }));
    lableHolder.appendChild(blockLabel);
    return lableHolder;
}
exports.createRequestLabelFull = createRequestLabelFull;
// private helper
function createRequestLabel(x, y, name, height) {
    var blockName = misc.ressourceUrlFormater(name, 125);
    var blockLabel = svg.newTextEl(blockName, (y + Math.round(height / 2) + 5));
    blockLabel.appendChild(svg.newEl("title", {
        "text": name
    }));
    blockLabel.setAttribute("x", x.toString());
    blockLabel.style.opacity = name.match(/js.map$/) ? "0.5" : "1";
    return blockLabel;
}
/**
 * Appends the labels to `rowFixed` - TODO: see if this can be done more elegant
 * @param {SVGGElement}    rowFixed   [description]
 * @param {SVGTextElement} shortLabel [description]
 * @param {SVGGElement}    fullLabel  [description]
 */
function appendRequestLabels(rowFixed, shortLabel, fullLabel) {
    var lableFullBg = fullLabel.getElementsByTagName("rect")[0];
    var fullLableText = fullLabel.getElementsByTagName("text")[0];
    //use display: none to not render it and visibility to remove it from search results (crt+f in chrome at least)
    fullLabel.style.display = "none";
    fullLabel.style.visibility = "hidden";
    rowFixed.appendChild(shortLabel);
    rowFixed.appendChild(fullLabel);
    rowFixed.addEventListener("mouseenter", function () {
        fullLabel.style.display = "block";
        shortLabel.style.display = "none";
        fullLabel.style.visibility = "visible";
        lableFullBg.style.width = (fullLableText.clientWidth + 10).toString();
    });
    rowFixed.addEventListener("mouseleave", function () {
        shortLabel.style.display = "block";
        fullLabel.style.display = "none";
        fullLabel.style.visibility = "hidden";
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
    return svg.newEl("rect", {
        "width": "100%",
        "height": height,
        "x": 0,
        "y": y,
        "class": isEven ? "even" : "odd"
    });
}
exports.createBgStripe = createBgStripe;
function createNameRowBg(y, rowHeight, onClick, leftColumnWith) {
    var rowFixed = svg.newEl("g", {
        "class": "row row-fixed"
    });
    rowFixed.appendChild(svg.newEl("rect", {
        "width": "100%",
        "height": rowHeight,
        "x": "0",
        "y": y,
        "opacity": "0"
    }));
    rowFixed.addEventListener("click", onClick);
    return rowFixed;
}
exports.createNameRowBg = createNameRowBg;
function createRowBg(y, rowHeight, onClick) {
    var rowFixed = svg.newEl("g", {
        "class": "row row-flex"
    });
    rowFixed.appendChild(svg.newEl("rect", {
        "width": "100%",
        "height": rowHeight,
        "x": "0",
        "y": y,
        "opacity": "0"
    }));
    rowFixed.addEventListener("click", onClick);
    return rowFixed;
}
exports.createRowBg = createRowBg;

},{"../../helpers/misc":4,"../../helpers/svg":5}],20:[function(require,module,exports){
"use strict";
var svg = require("../../helpers/svg");
var icons = require("../../helpers/icons");
var misc = require("../../helpers/misc");
var heuristics = require("../../helpers/heuristics");
var rowSubComponents = require("./svg-row-subcomponents");
var indicators = require("./svg-indicators");
//initial clip path
var clipPathElProto = svg.newEl("clipPath", {
    "id": "titleClipPath"
});
clipPathElProto.appendChild(svg.newEl("rect", {
    "width": "100%",
    "height": "100%"
}));
//Creates single reques's row
function createRow(index, rectData, block, labelXPos, options, docIsSsl, onDetailsOverlayShow) {
    var y = rectData.y;
    var rowHeight = rectData.height;
    var leftColumnWith = options.leftColumnWith;
    var rowCssClass = ["row-item"];
    if (heuristics.isInStatusCodeRange(block.rawResource, 500, 599)) {
        rowCssClass.push("status5xx");
    }
    if (heuristics.isInStatusCodeRange(block.rawResource, 400, 499)) {
        rowCssClass.push("status4xx");
    }
    else if (block.rawResource.response.status !== 304 &&
        heuristics.isInStatusCodeRange(block.rawResource, 300, 399)) {
        //304 == Not Modified, so not an issue
        rowCssClass.push("status3xx");
    }
    var rowItem = svg.newG(rowCssClass.join(" "));
    var leftFixedHolder = svg.newSvg("left-fixed-holder", {
        "x": "0",
        "width": leftColumnWith + "%"
    });
    var flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
        "x": leftColumnWith + "%",
        "width": (100 - leftColumnWith) + "%"
    });
    var rect = rowSubComponents.createRect(rectData, block.segments, block.total);
    var shortLabel = rowSubComponents.createRequestLabelClipped(labelXPos, y, misc.ressourceUrlFormater(block.name, 40), rowHeight, "clipPath");
    var fullLabel = rowSubComponents.createRequestLabelFull(labelXPos, y, block.name, rowHeight);
    var rowName = rowSubComponents.createNameRowBg(y, rowHeight, onDetailsOverlayShow, leftColumnWith);
    var rowBar = rowSubComponents.createRowBg(y, rowHeight, onDetailsOverlayShow);
    var bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0));
    //create and attach request block
    rowBar.appendChild(rect);
    if (options.showIndicatorIcons) {
        //Create and add warnings for potential issues
        indicators.getIndicators(block, docIsSsl).forEach(function (value) {
            rowName.appendChild(icons[value.type](value.x, y + 3, value.title));
        });
    }
    rowSubComponents.appendRequestLabels(rowName, shortLabel, fullLabel);
    flexScaleHolder.appendChild(rowBar);
    leftFixedHolder.appendChild(clipPathElProto.cloneNode(true));
    leftFixedHolder.appendChild(rowName);
    rowItem.appendChild(bgStripe);
    rowItem.appendChild(flexScaleHolder);
    rowItem.appendChild(leftFixedHolder);
    return rowItem;
}
exports.createRow = createRow;

},{"../../helpers/heuristics":2,"../../helpers/icons":3,"../../helpers/misc":4,"../../helpers/svg":5,"./svg-indicators":18,"./svg-row-subcomponents":19}],21:[function(require,module,exports){
/**
 * vertical alignment helper lines
 * */
"use strict";
var svg = require("../../helpers/svg");
/**
 * Creates verticale alignment bars
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
function createAlignmentLines(diagramHeight) {
    return {
        endline: svg.newEl("line", {
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": diagramHeight,
            "class": "line-end"
        }),
        startline: svg.newEl("line", {
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": diagramHeight,
            "class": "line-start"
        })
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
                svg.addClass(targetRect, "active");
                var xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits +
                    targetRect.width.baseVal.valueInSpecifiedUnits + "%";
                var xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";
                hoverEl.endline.x1.baseVal.valueAsString = xPosEnd;
                hoverEl.endline.x2.baseVal.valueAsString = xPosEnd;
                hoverEl.startline.x1.baseVal.valueAsString = xPosStart;
                hoverEl.startline.x2.baseVal.valueAsString = xPosStart;
                svg.addClass(hoverEl.endline, "active");
                svg.addClass(hoverEl.startline, "active");
            };
        },
        onMouseLeavePartial: function () {
            return function (evt) {
                var targetRect = evt.target;
                svg.removeClass(targetRect, "active");
                svg.removeClass(hoverEl.endline, "active");
                svg.removeClass(hoverEl.startline, "active");
            };
        }
    };
}
exports.makeHoverEvtListeners = makeHoverEvtListeners;

},{"../../helpers/svg":5}],22:[function(require,module,exports){
/**
 * Creation of sub-components of the waterfall chart
 */
"use strict";
var svg = require("../../helpers/svg");
var overlayChangesPubSub = require("../details-overlay/overlay-changes-pub-sub");
/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 */
function createTimeScale(durationMs, diagramHeight) {
    var timeHolder = svg.newEl("g", { class: "time-scale full-width" });
    for (var i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
        (function (i, secs, secPerc) {
            var lineLabel = svg.newTextEl(i + "sec", diagramHeight);
            if (i > secs - 0.2) {
                lineLabel.setAttribute("x", secPerc * i - 0.5 + "%");
                lineLabel.setAttribute("text-anchor", "end");
            }
            else {
                lineLabel.setAttribute("x", secPerc * i + 0.5 + "%");
            }
            var lineEl = svg.newEl("line", {
                "x1": secPerc * i + "%",
                "y1": "0",
                "x2": secPerc * i + "%",
                "y2": diagramHeight
            });
            overlayChangesPubSub.subscribeToOvelayChanges(function (change) {
                var offset = change.combinedOverlayHeight;
                //figure out why there is an offset
                var scale = (diagramHeight + offset) / (diagramHeight);
                lineEl.setAttribute("transform", "scale(1, " + scale + ")");
                lineLabel.setAttribute("transform", "translate(0, " + offset + ")");
            });
            timeHolder.appendChild(lineEl);
            timeHolder.appendChild(lineLabel);
        })(i, secs, secPerc);
    }
    return timeHolder;
}
exports.createTimeScale = createTimeScale;
//TODO: Implement - data for this not parsed yet
function createBgRect(block, unit, diagramHeight) {
    var rect = svg.newEl("rect", {
        "width": ((block.total || 1) / unit) + "%",
        "height": diagramHeight,
        "x": ((block.start || 0.001) / unit) + "%",
        "y": 0,
        "class": block.cssClass || "block-other"
    });
    rect.appendChild(svg.newEl("title", {
        "text": block.name
    })); // Add tile to wedge path
    return rect;
}
exports.createBgRect = createBgRect;

},{"../../helpers/svg":5,"../details-overlay/overlay-changes-pub-sub":15}],23:[function(require,module,exports){
"use strict";
var svg = require("../../helpers/svg");
var overlayChangesPubSub = require("../details-overlay/overlay-changes-pub-sub");
/**
 * Renders global markes for events like the onLoad event etc
 * @param {Array<Mark>} marks         [description]
 * @param {number}      unit          horizontal unit (duration in ms of 1%)
 * @param {number}      diagramHeight Full height of SVG in px
 */
function createMarks(marks, unit, diagramHeight) {
    var marksHolder = svg.newEl("g", {
        "transform": "scale(1, 1)",
        "class": "marker-holder"
    });
    marks.forEach(function (mark, i) {
        var x = mark.startTime / unit;
        var markHolder = svg.newEl("g", {
            "class": "mark-holder type-" + mark.name.toLowerCase()
        });
        var lineHolder = svg.newEl("g", {
            "class": "line-holder"
        });
        var lineLabelHolder = svg.newEl("g", {
            "class": "line-label-holder",
            "x": x + "%"
        });
        mark.x = x;
        var lineLabel = svg.newTextEl(mark.name, diagramHeight + 25);
        lineLabel.setAttribute("x", x + "%");
        lineLabel.setAttribute("stroke", "");
        var line = svg.newEl("line", {
            "x1": x + "%",
            "y1": 0,
            "x2": x + "%",
            "y2": diagramHeight
        });
        var lastMark = marks[i - 1];
        if (lastMark && mark.x - lastMark.x < 1) {
            lineLabel.setAttribute("x", lastMark.x + 1 + "%");
            mark.x = lastMark.x + 1;
        }
        //would use polyline but can't use percentage for points
        var lineConnection = svg.newEl("line", {
            "x1": x + "%",
            "y1": diagramHeight,
            "x2": mark.x + "%",
            "y2": diagramHeight + 23
        });
        lineHolder.appendChild(line);
        lineHolder.appendChild(lineConnection);
        overlayChangesPubSub.subscribeToOvelayChanges(function (change) {
            var offset = change.combinedOverlayHeight;
            var scale = (diagramHeight + offset) / (diagramHeight);
            line.setAttribute("transform", "scale(1, " + scale + ")");
            lineLabelHolder.setAttribute("transform", "translate(0, " + offset + ")");
            lineConnection.setAttribute("transform", "translate(0, " + offset + ")");
        });
        var isActive = false;
        var onLableMouseEnter = function (evt) {
            if (!isActive) {
                isActive = true;
                svg.addClass(lineHolder, "active");
                //firefox has issues with this
                markHolder.parentNode.appendChild(markHolder);
            }
        };
        var onLableMouseLeave = function (evt) {
            isActive = false;
            svg.removeClass(lineHolder, "active");
        };
        lineLabel.addEventListener("mouseenter", onLableMouseEnter);
        lineLabel.addEventListener("mouseleave", onLableMouseLeave);
        lineLabelHolder.appendChild(lineLabel);
        markHolder.appendChild(svg.newEl("title", {
            "text": mark.name + " (" + Math.round(mark.startTime) + "ms)"
        }));
        markHolder.appendChild(lineHolder);
        markHolder.appendChild(lineLabelHolder);
        marksHolder.appendChild(markHolder);
    });
    return marksHolder;
}
exports.createMarks = createMarks;

},{"../../helpers/svg":5,"../details-overlay/overlay-changes-pub-sub":15}],24:[function(require,module,exports){
"use strict";
var svg = require("../helpers/svg");
var generalComponents = require("./sub-components/svg-general-components");
var alignmentHelper = require("./sub-components/svg-alignment-helper");
var marks = require("./sub-components/svg-marks");
var row = require("./row/svg-row");
var indicators = require("./row/svg-indicators");
var overlayManager = require("./details-overlay/svg-details-overlay-manager");
var overlayChangesPubSub = require("./details-overlay/overlay-changes-pub-sub");
var globalStateService = require("../state/global-state");
/**
 * Calculate the height of the SVG chart in px
 * @param {any[]}       marks      [description]
 * @param {TimeBlock[]} barsToShow [description]
 * @param  {number} diagramHeight
 * @returns Number
 */
function getSvgHeight(marks, barsToShow, diagramHeight) {
    var maxMarkTextLength = marks.reduce(function (currMax, currValue) {
        return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, 0), true));
    }, 0);
    return Math.floor(diagramHeight + maxMarkTextLength + 35);
}
/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data  Object containing the setup parameter
 * @return {SVGSVGElement}            SVG Element ready to render
 */
function createWaterfallSvg(data) {
    var options = globalStateService.getOptions();
    //constants
    /** horizontal unit (duration in ms of 1%) */
    var unit = data.durationMs / 100;
    var barsToShow = data.blocks
        .filter(function (block) { return (typeof block.start === "number" && typeof block.total === "number"); })
        .sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
    var docIsSsl = (data.blocks[0].name.indexOf("https://") === 0);
    /** height of the requests part of the diagram in px */
    var diagramHeight = (barsToShow.length + 1) * options.rowHeight;
    /** full height of the SVG chart in px */
    var chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight);
    /** Main SVG Element that holds all data */
    var timeLineHolder = svg.newSvg("water-fall-chart", {
        "height": chartHolderHeight
    });
    /** Holder of request-details overlay */
    var overlayHolder = svg.newG("overlays");
    /** Holder for scale, event and marks */
    var scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
        "x": options.leftColumnWith + "%",
        "width": (100 - options.leftColumnWith) + "%"
    });
    /** Holds all rows */
    var rowHolder = svg.newG("rows-holder");
    /** Holder for on-hover vertical comparison bars */
    var hoverOverlayHolder;
    var mouseListeners;
    if (options.showAlignmentHelpers) {
        hoverOverlayHolder = svg.newG("hover-overlays");
        var hoverEl = alignmentHelper.createAlignmentLines(diagramHeight);
        hoverOverlayHolder.appendChild(hoverEl.startline);
        hoverOverlayHolder.appendChild(hoverEl.endline);
        mouseListeners = alignmentHelper.makeHoverEvtListeners(hoverEl);
    }
    //Start appending SVG elements to the holder element (timeLineHolder)
    scaleAndMarksHolder.appendChild(generalComponents.createTimeScale(data.durationMs, diagramHeight));
    scaleAndMarksHolder.appendChild(marks.createMarks(data.marks, unit, diagramHeight));
    data.lines.forEach(function (block, i) {
        timeLineHolder.appendChild(generalComponents.createBgRect(block, unit, diagramHeight));
    });
    var labelXPos;
    //calculate x position for label based on number of icons
    if (options.showIndicatorIcons) {
        labelXPos = barsToShow.reduce(function (prev, curr) {
            var i = indicators.getIndicators(curr, docIsSsl);
            var lastIndicator = i[i.length - 1];
            var x = (!!lastIndicator ? (lastIndicator.x + lastIndicator.x / Math.max(i.length - 1, 1)) : 0);
            return Math.max(prev, x);
        }, 5);
    }
    else {
        labelXPos = 5;
    }
    var barEls = [];
    function getChartHeight() {
        return (chartHolderHeight + overlayManager.getCombinedOverlayHeight()).toString() + "px";
    }
    overlayChangesPubSub.subscribeToOvelayChanges(function (evt) {
        timeLineHolder.style.height = getChartHeight();
    });
    /** Renders single row and hooks up behaviour */
    function renderRow(block, i) {
        var blockWidth = block.total || 1;
        var y = options.rowHeight * i;
        var x = (block.start || 0.001);
        var accordeonHeight = 450;
        var rectData = {
            "width": blockWidth,
            "height": options.rowHeight,
            "x": x,
            "y": y,
            "cssClass": block.cssClass,
            "label": block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)",
            "unit": unit,
            "showOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseEnterPartial : undefined,
            "hideOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseLeavePartial : undefined
        };
        var showDetailsOverlay = function (evt) {
            overlayManager.openOverlay(i, x, y + options.rowHeight, accordeonHeight, block, overlayHolder, barEls, unit);
        };
        var rowItem = row.createRow(i, rectData, block, labelXPos, options, docIsSsl, showDetailsOverlay);
        barEls.push(rowItem);
        rowHolder.appendChild(rowItem);
    }
    //Main loop to render rows with blocks
    barsToShow.forEach(renderRow);
    if (options.showAlignmentHelpers) {
        scaleAndMarksHolder.appendChild(hoverOverlayHolder);
    }
    timeLineHolder.appendChild(scaleAndMarksHolder);
    timeLineHolder.appendChild(rowHolder);
    timeLineHolder.appendChild(overlayHolder);
    return timeLineHolder;
}
exports.createWaterfallSvg = createWaterfallSvg;

},{"../helpers/svg":5,"../state/global-state":8,"./details-overlay/overlay-changes-pub-sub":15,"./details-overlay/svg-details-overlay-manager":16,"./row/svg-indicators":18,"./row/svg-row":20,"./sub-components/svg-alignment-helper":21,"./sub-components/svg-general-components":22,"./sub-components/svg-marks":23}]},{},[6])(6)
});