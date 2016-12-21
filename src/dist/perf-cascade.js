/*! github.com/micmro/PerfCascade Version:0.2.14 (21/12/2016) */

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
 * @param  {(el:Element,index:number)=>boolean} predicate
 * @returns NodeListOf
 */
function filter(els, predicate) {
    return Array.prototype.filter.call(els, predicate);
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
function isCompressible(block) {
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
    return (getResponseHeader(block.rawResource, "Content-Encoding") === undefined && isCompressible(block));
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
    return toSvg(x, y, title, "icon-lock", scale, "<path d=\"m 6.0863646,8.2727111 5.8181784,0 0,-2.1817778 q 0,-1.2045333 -0.852275,-2.0568\n  -0.852267,-0.8523555 -2.05681,-0.8523555 -1.2045512,0 -2.0568267,0.8523555 -0.8522667,0.8522667 -0.8522667,2.0568 l 0,2.1817778 z m\n  9.4545434,1.0909329 0,6.545423 q 0,0.454577 -0.318178,0.772711 Q 14.904543,17 14.450001,17 L 3.5409067,17 Q 3.0863644,17\n  2.7681778,16.681778 2.45,16.363644 2.45,15.909067 l 0,-6.545423 Q 2.45,8.9090667 2.7681778,8.5909333 3.0863644,8.2727111\n  3.5409067,8.2727111 l 0.3636355,0 0,-2.1817778 Q 3.9045422,4 5.4045422,2.5 6.9045424,1 8.995458,1 q 2.090907,0 3.590907,1.5 1.5,1.5\n  1.5,3.5909333 l 0,2.1817778 0.363636,0 q 0.454542,0 0.772729,0.3182222 0.318178,0.3181334 0.318178,0.7727107 z\" />");
}
exports.lock = lock;
function noTls(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-tls", scale, "<path d=\"m 18,6.2162 0,2.7692 q 0,0.2813 -0.205529,0.4868 -0.205529,0.2055\n  -0.486779,0.2055 l -0.692307,0 q -0.28125,0 -0.486779,-0.2055 -0.205529,-0.2055 -0.205529,-0.4868 l 0,-2.7692 q 0,-1.1466\n  -0.811298,-1.9579 -0.811298,-0.8113 -1.957933,-0.8113 -1.146634,0 -1.957933,0.8113 -0.811298,0.8113 -0.811298,1.9579 l 0,2.0769 1.038462,0\n  q 0.432692,0 0.735577,0.3029 0.302884,0.3029 0.302884,0.7356 l 0,6.2307 q 0,0.4327 -0.302884,0.7356 -0.302885,0.3029 -0.735577,0.3029 l\n  -10.384615,0 q -0.432693,0 -0.735577,-0.3029 Q 0,15.995 0,15.5623 L 0,9.3316 Q 0,8.8989 0.302885,8.596 0.605769,8.2931 1.038462,8.2931 l\n  7.26923,0 0,-2.0769 q 0,-2.0012 1.422476,-3.4237 1.422476,-1.4225 3.423678,-1.4225 2.001202,0 3.423678,1.4225 Q 18,4.215 18,6.2162 Z\" />");
}
exports.noTls = noTls;
function err3xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-redirect", scale, "<path d=\"M 17,2.3333333 17,7 q 0,0.2708444 -0.19792,0.4687111 -0.197911,0.1979556\n-0.468747,0.1979556 l -4.666666,0 q -0.437503,0 -0.614587,-0.4166223 -0.177084,-0.4063111 0.14584,-0.7187555 L 12.635413,5.0937778 Q\n11.093751,3.6666667 9,3.6666667 q -1.0833333,0 -2.0677067,0.4218666 Q 5.94792,4.5104 5.2291644,5.2291556 4.5104178,5.9479111\n4.0885422,6.9322667 3.6666667,7.9167111 3.6666667,9 q 0,1.083378 0.4218755,2.067733 0.4218756,0.984356 1.1406222,1.703111 Q 5.94792,13.4896\n6.9322933,13.911467 7.9166667,14.333333 9,14.333333 q 1.239582,0 2.343751,-0.541689 1.104169,-0.5416 1.864578,-1.5312 0.07289,-0.104177\n0.239591,-0.125066 0.145831,0 0.260409,0.09378 l 1.427084,1.437511 q 0.09375,0.08356 0.09896,0.213511 0.0053,0.130222 -0.07813,0.2344\n-1.135413,1.375022 -2.75,2.130222 Q 10.791662,17 9,17 7.3749956,17 5.8958311,16.364622 4.4166667,15.729156 3.3437511,14.656267\n2.2708356,13.583378 1.6354133,12.104178 1,10.624978 1,9 1,7.3750222 1.6354133,5.8958222 2.2708356,4.4167111 3.3437511,3.3437333\n4.4166667,2.2708444 5.8958311,1.6353778 7.3749956,1 9,1 q 1.531253,0 2.963538,0.5781333 1.432293,0.5781334 2.54688,1.6302223 L\n15.864587,1.8646222 Q 16.166667,1.5416889 16.593751,1.7187556 17,1.8958222 17,2.3333333 Z\" />");
}
exports.err3xx = err3xx;
function err4xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-4xx", scale, "\n<path d=\"m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096 -0.084725,-0.084 -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0\n-0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l 0,1.6945 q 0,0.1248 0.084725,0.2096 0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q\n0.1159402,0 0.2006658,-0.084 0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356 0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694\n-0.115941,-0.098 -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098 -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757 q\n0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0 0.2095847,-0.058 0.08473,-0.058 0.09364,-0.1472 z M\n9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587 -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l\n-13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q 1.3211891,16.1072 1.169575,15.8485 0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676\nQ 8.1527449,1.8911 8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0 0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437 z\" />");
}
exports.err4xx = err4xx;
function err5xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-5xx", scale, "<path d=\"m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096 -0.084725,-0.084\n  -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l 0,1.6945 q 0,0.1248 0.084725,0.2096\n  0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084 0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356\n  0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098 -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098\n  -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757 q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0\n  0.2095847,-0.058 0.08473,-0.058 0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587\n  -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q 1.3211891,16.1072 1.169575,15.8485\n  0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911 8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0\n  0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437 z\" />");
}
exports.err5xx = err5xx;
function noCache(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-cache", scale, "<path d=\"m 9,1 q 2.177084,0 4.015627,1.0728889 1.838542,1.0729778 2.911457,2.9114667 Q\n  17,6.8229333 17,9 q 0,2.177067 -1.072916,4.015644 -1.072915,1.838489 -2.911457,2.911467 Q 11.177084,17 9,17 6.8229156,17\n  4.9843733,15.927111 3.1458311,14.854133 2.0729156,13.015644 1,11.177067 1,9 1,6.8229333 2.0729156,4.9843556 3.1458311,3.1458667\n  4.9843733,2.0728889 6.8229156,1 9,1 Z m 1.333333,12.9896 0,-1.9792 q 0,-0.145778 -0.09375,-0.2448 -0.09375,-0.09893 -0.229164,-0.09893 l\n  -2.0000001,0 q -0.1354222,0 -0.2395822,0.104177 -0.1041689,0.104178 -0.1041689,0.239556 l 0,1.9792 q 0,0.135378 0.1041689,0.239556\n  0.10416,0.104177 0.2395822,0.104177 l 2.0000001,0 q 0.135413,0 0.229164,-0.09893 0.09375,-0.09902 0.09375,-0.2448 z m -0.0208,-3.583378\n  0.187503,-6.4687109 q 0,-0.1249778 -0.104169,-0.1874667 -0.104169,-0.083556 -0.25,-0.083556 l -2.2916626,0 q -0.14584,0 -0.25,0.083556\n  -0.1041688,0.062222 -0.1041688,0.1874667 L 7.67712,10.406222 q 0,0.104178 0.1041689,0.182311 0.10416,0.07822 0.25,0.07822 l 1.9270755,0 q\n  0.1458396,0 0.2447996,-0.07822 0.09895,-0.07822 0.109369,-0.182311 z\" />");
}
exports.noCache = noCache;
function noGzip(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-gzip", scale, " <path d=\"m 9,1 q 2.177084,0 4.015627,1.0728889 1.838542,1.0729778 2.911457,2.9114667 Q\n  17,6.8229333 17,9 q 0,2.177067 -1.072916,4.015644 -1.072915,1.838489 -2.911457,2.911467 Q 11.177084,17 9,17 6.8229156,17\n  4.9843733,15.927111 3.1458311,14.854133 2.0729156,13.015644 1,11.177067 1,9 1,6.8229333 2.0729156,4.9843556 3.1458311,3.1458667\n  4.9843733,2.0728889 6.8229156,1 9,1 Z m 1.333333,12.9896 0,-1.9792 q 0,-0.145778 -0.09375,-0.2448 -0.09375,-0.09893 -0.229164,-0.09893 l\n  -2.0000001,0 q -0.1354222,0 -0.2395822,0.104177 -0.1041689,0.104178 -0.1041689,0.239556 l 0,1.9792 q 0,0.135378 0.1041689,0.239556\n  0.10416,0.104177 0.2395822,0.104177 l 2.0000001,0 q 0.135413,0 0.229164,-0.09893 0.09375,-0.09902 0.09375,-0.2448 z m -0.0208,-3.583378\n  0.187503,-6.4687109 q 0,-0.1249778 -0.104169,-0.1874667 -0.104169,-0.083556 -0.25,-0.083556 l -2.2916626,0 q -0.14584,0 -0.25,0.083556\n  -0.1041688,0.062222 -0.1041688,0.1874667 L 7.67712,10.406222 q 0,0.104178 0.1041689,0.182311 0.10416,0.07822 0.25,0.07822 l 1.9270755,0 q\n  0.1458396,0 0.2447996,-0.07822 0.09895,-0.07822 0.109369,-0.182311 z\" />");
}
exports.noGzip = noGzip;
function plain(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-plain", scale, "<path d=\"m 15.247139,4.3928381 q 0.250004,0.2500571 0.428571,0.6786286 0.178575,0.4285714\n  0.178575,0.7856761 l 0,10.2857142 q 0,0.357181 -0.250003,0.607162 Q 15.354285,17 14.997143,17 L 2.9971428,17 Q 2.64,17 2.3899962,16.750019\n  2.14,16.500038 2.14,16.142857 l 0,-14.2857142 Q 2.14,1.5000381 2.3899962,1.249981 2.64,1 2.9971428,1 l 8.0000002,0 q 0.357142,0\n  0.785714,0.1785905 0.428571,0.1785905 0.678568,0.4285714 z m -3.964282,-2.1785143 0,3.3571047 3.357143,0 Q 14.550712,5.3125333\n  14.443573,5.2053333 L 11.64893,2.4107428 q -0.107147,-0.1072 -0.366073,-0.196419 z m 3.428571,13.6428192 0,-9.1428573 -3.714285,0 q\n  -0.357143,0 -0.607147,-0.2499809 Q 10.14,6.2143238 10.14,5.8571428 l 0,-3.7142856 -6.8571428,0 0,13.7142858 11.4285708,0 z M\n  5.5685715,8.1428569 q 0,-0.1250285 0.080358,-0.2053333 0.080358,-0.080382 0.2053562,-0.080382 l 6.2857143,0 q 0.124998,0 0.205356,0.080382\n  0.08036,0.080302 0.08036,0.2053333 l 0,0.5714284 q 0,0.1250294 -0.08036,0.2053334 Q 12.264998,9 12.14,9 L 5.8542857,9 Q 5.7292876,9\n  5.6489295,8.9196178 5.5685713,8.8393156 5.5685713,8.7142844 l 0,-0.5714284 z M 12.14,10.142857 q 0.124998,0 0.205356,0.08038\n  0.08036,0.0803 0.08036,0.205333 l 0,0.571429 q 0,0.125028 -0.08036,0.205333 -0.08036,0.08038 -0.205356,0.08038 l -6.2857143,0 q\n  -0.1249981,0 -0.2053562,-0.08038 -0.080358,-0.0803 -0.080358,-0.205333 l 0,-0.571429 q 0,-0.125028 0.080358,-0.205333 0.080358,-0.08038\n  0.2053562,-0.08038 l 6.2857143,0 z m 0,2.285715 q 0.124998,0 0.205356,0.08038 0.08036,0.0803 0.08036,0.205333 l 0,0.571429 q 0,0.125029\n  -0.08036,0.205334 -0.08036,0.08038 -0.205356,0.08038 l -6.2857143,0 q -0.1249981,0 -0.2053562,-0.08038 -0.080358,-0.0803\n  -0.080358,-0.205334 l 0,-0.571429 q 0,-0.125028 0.080358,-0.205333 0.080358,-0.08038 0.2053562,-0.08038 l 6.2857143,0 z\" />");
}
exports.plain = plain;
function other(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-other", scale, "<path\n     d=\"m 10.801185,13.499991 0,3.000034 q 0,0.199966 -0.149997,0.350003 Q 10.501188,17 10.301185,17 l -2.9999954,0 q -0.200003,0\n     -0.350002,-0.149972 -0.149998,-0.150037 -0.149998,-0.350003 l 0,-3.000034 q 0,-0.199966 0.149998,-0.350004 0.149999,-0.149972\n     0.350002,-0.149972 l 2.9999954,0 q 0.200003,0 0.350003,0.149972 0.149997,0.150038 0.149997,0.350004 z m 3.950001,-7.4999953 q\n     0,0.6749751 -0.193752,1.2624809 -0.193746,0.5875065 -0.437493,0.956246 Q 13.876188,8.587526 13.43244,8.9624908 12.988685,9.337519\n     12.713687,9.506231 12.43869,9.675006 11.951191,9.949989 q -0.5125,0.287495 -0.856252,0.8125 -0.343749,0.525 -0.343749,0.837523\n     0,0.212477 -0.150001,0.406217 -0.150004,0.193802 -0.349999,0.193802 l -3.0000054,0 q -0.187495,0 -0.318749,-0.231277\n     -0.131246,-0.231284 -0.131246,-0.468725 l 0,-0.562543 q 0,-1.037488 0.812497,-1.9562566 Q 8.4261846,8.0625246 9.4011886,7.6249911\n     10.138688,7.287504 10.451185,6.9249894 10.76369,6.5624748 10.76369,5.9750331 q 0,-0.525002 -0.58125,-0.9250582 -0.5812494,-0.3999918\n     -1.3437494,-0.3999918 -0.812504,0 -1.35,0.3625146 -0.437502,0.3125237 -1.3375,1.4374811 -0.162499,0.2000281 -0.387504,0.2000281\n     -0.149997,0 -0.312498,-0.099982 L 3.4011866,4.9875343 Q 3.2386866,4.8625246 3.2074416,4.6750106 3.1761886,4.4874957 3.2761906,4.3250097\n     5.2761886,1 9.0761896,1 q 0.9999984,0 2.0124974,0.3874782 1.012501,0.3875423 1.825003,1.0375531 0.812497,0.649947 1.324997,1.5937436\n     0.512499,0.9437319 0.512499,1.9812208 z\" /> ");
}
exports.other = other;
function javascript(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-js", scale, "<g transform=\"matrix(0.03159732,0,0,0.03159732,0.93993349,0.955184)\" id=\"Layer_1\"><g><path\n  d=\"m 112.155,67.644 84.212,0 0,236.019 c 0,106.375 -50.969,143.497 -132.414,143.497 -19.944,0 -45.429,-3.324 -62.052,-8.864 L 11.32,370.15\n  c 11.635,3.878 26.594,6.648 43.214,6.648 35.458,0 57.621,-16.068 57.621,-73.687 l 0,-235.467 z\" /><path id=\"path9\" d=\"m 269.484,354.634 c\n  22.161,11.635 57.62,23.27 93.632,23.27 38.783,0 59.282,-16.066 59.282,-40.998 0,-22.715 -17.729,-36.565 -62.606,-52.079 -62.053,-22.162\n  -103.05,-56.512 -103.05,-111.36 0,-63.715 53.741,-111.917 141.278,-111.917 42.662,0 73.132,8.313 95.295,18.838 l -18.839,67.592 c\n  -14.404,-7.201 -41.553,-17.729 -77.562,-17.729 -36.567,0 -54.297,17.175 -54.297,36.013 0,23.824 20.499,34.349 69.256,53.188 65.928,24.378\n  96.4,58.728 96.4,111.915 0,62.606 -47.647,115.794 -150.143,115.794 -42.662,0 -84.77,-11.636 -105.82,-23.27 l 17.174,-69.257 z\"\n  /></g></g>");
}
exports.javascript = javascript;
function image(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-image", scale, "<path d=\"M 6,6 Q 6,6.75 5.475,7.275 4.95,7.8 4.2,7.8 3.45,7.8 2.925,7.275 2.4,6.75 2.4,6\n  2.4,5.25 2.925,4.725 3.45,4.2 4.2,4.2 4.95,4.2 5.475,4.725 6,5.25 6,6 Z m 9.6,3.6 0,4.2 -13.2,0 0,-1.8 3,-3 1.5,1.5 4.8,-4.8 z M 16.5,3\n  1.5,3 Q 1.378125,3 1.289063,3.089 1.200003,3.178 1.200003,3.2999 l 0,11.4 q 0,0.1219 0.08906,0.2109 0.08906,0.089 0.210937,0.089 l 15,0 q\n  0.121875,0 0.210938,-0.089 0.08906,-0.089 0.08906,-0.2109 l 0,-11.4 q 0,-0.1219 -0.08906,-0.2109 Q 16.621878,3 16.5,3 Z m 1.5,0.3 0,11.4 q\n  0,0.6188 -0.440625,1.0594 Q 17.11875,16.2 16.5,16.2 l -15,0 Q 0.88125,16.2 0.440625,15.7594 0,15.3188 0,14.7 L 0,3.3 Q 0,2.6813\n  0.440625,2.2406 0.88125,1.8 1.5,1.8 l 15,0 q 0.61875,0 1.059375,0.4406 Q 18,2.6813 18,3.3 Z\" />");
}
exports.image = image;
function html(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-html", scale, "<path d=\"m 5.62623,13.310467 -0.491804,0.4919 q -0.09836,0.098 -0.226229,0.098 -0.127869,0\n  -0.22623,-0.098 L 0.098361,9.218667 Q 0,9.120367 0,8.992467 q 0,-0.1279 0.09836,-0.2262 l 4.583606,-4.5836 q 0.09836,-0.098 0.22623,-0.098\n0.127869,0 0.226229,0.098 l 0.491804,0.4918 q 0.09836,0.098 0.09836,0.2262 0,0.1279 -0.09836,0.2262 l -3.865574,3.8656 3.865574,3.8656 q\n0.09836,0.098 0.09836,0.2262 0,0.1279 -0.09836,0.2262 z m 5.813114,-10.495 -3.668852,12.6983 q -0.03934,0.1279 -0.152459,0.1918\n-0.113115,0.064 -0.231148,0.025 l -0.609836,-0.1672 q -0.127869,-0.039 -0.191803,-0.1525 -0.06393,-0.1131 -0.02459,-0.2409 l\n3.668852,-12.6984 q 0.03934,-0.1279 0.152459,-0.1918 0.113115,-0.064 0.231148,-0.025 l 0.609836,0.1672 q 0.127869,0.039 0.191803,0.1525\n0.06393,0.1131 0.02459,0.241 z m 6.462295,6.4032 -4.583606,4.5837 q -0.09836,0.098 -0.22623,0.098 -0.127869,0 -0.226229,-0.098 l\n-0.491804,-0.4919 q -0.09836,-0.098 -0.09836,-0.2262 0,-0.1278 0.09836,-0.2262 l 3.865574,-3.8656 -3.865574,-3.8656 q -0.09836,-0.098\n-0.09836,-0.2262 0,-0.1279 0.09836,-0.2262 l 0.491804,-0.4918 q 0.09836,-0.098 0.226229,-0.098 0.127869,0 0.22623,0.098 l 4.583606,4.5836 Q\n18,8.864567 18,8.992467 q 0,0.1279 -0.09836,0.2262 z\" />");
}
exports.html = html;
function css(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-css", scale, "<path d=\"m 15.435754,0.98999905 q 0.625698,0 1.094972,0.41564445 Q 17,1.8212879\n  17,2.4469768 q 0,0.5631111 -0.402235,1.3496889 -2.967597,5.6224 -4.156425,6.7217783 -0.867039,0.813421 -1.948602,0.813421 -1.1262576,0\n  -1.9351961,-0.826755 -0.8089385,-0.8268443 -0.8089385,-1.9620443 0,-1.1441778 0.8223463,-1.8949333 L 14.273743,1.4726657 Q\n  14.801117,0.98999905 15.435754,0.98999905 Z M 7.3106145,10.232488 q 0.3486034,0.679289 0.9519554,1.161955 0.6033519,0.482666\n  1.3452513,0.679378 l 0.00894,0.634577 q 0.035753,1.903911 -1.1575432,3.101689 -1.1932962,1.197778 -3.115084,1.197778 -1.0994413,0\n  -1.9486032,-0.415644 Q 2.5463687,16.176576 2.0324022,15.452576 1.5184357,14.728576 1.2592179,13.816843 1,12.905109 1,11.850354 q\n  0.06257,0.04444 0.3664804,0.268089 0.3039107,0.223466 0.55419,0.397778 0.2502793,0.174311 0.5273743,0.326311 0.2770949,0.151911\n  0.4111732,0.151911 0.3664804,0 0.4916201,-0.330756 0.2234637,-0.589866 0.5139664,-1.005511 0.2905029,-0.415644 0.6212291,-0.679377\n  0.3307262,-0.263644 0.7865922,-0.424533 0.4558659,-0.160889 0.9206704,-0.228 0.4648044,-0.06667 1.1173184,-0.09378 z\" />");
}
exports.css = css;
function warning(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-warning", scale, "<path d=\"m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096 -0.084725,-0.084\n  -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l 0,1.6945 q 0,0.1248 0.084725,0.2096\n  0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084 0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356\n  0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098 -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098\n  -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757 q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0\n  0.2095847,-0.058 0.08473,-0.058 0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587\n  -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q 1.3211891,16.1072 1.169575,15.8485\n  0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911 8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0\n  0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437 z\" />");
}
exports.warning = warning;
function font(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-font", scale, "<path d=\"M 7.9711534,5.7542664 6.3365384,10.0812 q 0.3173075,0 1.3124995,0.01956\n  0.9951928,0.01956 1.5432692,0.01956 0.1826924,0 0.5480773,-0.01956 Q 8.9038458,7.6680441 7.9711534,5.754622 Z M 1,16.379245\n  1.0192356,15.619601 q 0.2211537,-0.06756 0.5384613,-0.120178 0.3173075,-0.05245 0.5480764,-0.100978 0.2307697,-0.048 0.4759617,-0.139378\n  0.245192,-0.09138 0.4278844,-0.278844 0.1826925,-0.187556 0.2980774,-0.4856 L 5.5865429,8.5715107 8.2788503,1.61 l 1.2307688,0 q\n  0.076924,0.1346666 0.1057698,0.2019555 L 11.586543,6.427333 q 0.317307,0.7499556 1.01923,2.475911 0.701923,1.726045 1.096153,2.639467\n  0.144232,0.326934 0.557693,1.389423 0.413462,1.062489 0.692307,1.620178 0.192309,0.432711 0.336539,0.548089 0.182692,0.144266\n  0.846154,0.283644 0.663462,0.139467 0.807692,0.197156 Q 17,15.946534 17,16.129289 q 0,0.03822 -0.0048,0.124978 -0.0048,0.08622\n  -0.0048,0.124978 -0.60577,0 -1.826923,-0.07644 -1.221154,-0.07733 -1.836539,-0.07733 -0.730769,0 -2.067307,0.06756 -1.3365382,0.06755\n  -1.7115381,0.07733 0,-0.413511 0.038462,-0.750044 L 10.84617,15.351076 q 0.0096,0 0.120192,-0.024 0.110577,-0.024 0.149039,-0.03378\n  0.03846,-0.0098 0.139423,-0.04356 0.100961,-0.03378 0.144231,-0.06222 0.04327,-0.02933 0.105769,-0.07733 0.0625,-0.048 0.08653,-0.105777\n  0.02403,-0.05778 0.02403,-0.134578 0,-0.153867 -0.298077,-0.927911 -0.298068,-0.774053 -0.692299,-1.706764 -0.394231,-0.932623\n  -0.403846,-0.961512 l -4.3269223,-0.01956 q -0.25,0.55769 -0.7355768,1.879823 -0.4855769,1.322044 -0.4855769,1.562489 0,0.211555\n  0.1346151,0.360533 0.1346151,0.149067 0.4182693,0.235556 0.2836533,0.08622 0.4663458,0.129866 0.1826924,0.04356 0.5480773,0.08178\n  0.365384,0.03822 0.3942302,0.03822 0.00962,0.182667 0.00962,0.557689 0,0.08622 -0.019236,0.259644 -0.5576924,0 -1.6778843,-0.09618\n  -1.1201929,-0.09618 -1.6778844,-0.09618 -0.076924,0 -0.254808,0.03822 -0.1778844,0.03822 -0.2067306,0.03822 Q 2.0384613,16.379245\n  1,16.379245 Z\" />");
}
exports.font = font;
function flash(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-flash", scale, "<path d=\"m 13.724296,4.737962 q 0.194716,0.216309 0.07572,0.475924 L 7.958654,17.729559\n  Q 7.818031,18 7.504329,18 7.461078,18 7.352885,17.97846 7.16899,17.924378 7.0770425,17.772918 6.9850949,17.621512 7.0283513,17.4484 L\n  9.15937,8.708015 4.7675305,9.800549 q -0.043251,0.01077 -0.1298072,0.01077 -0.1947161,0 -0.3353388,-0.118981 -0.1947107,-0.162286\n  -0.140628,-0.4219 L 6.3360428,0.34617 Q 6.3792939,0.194711 6.5091226,0.097382 6.6389298,0 6.8120043,0 l 3.5480877,0 q 0.205532,0\n  0.346154,0.135193 0.140628,0.135248 0.140628,0.319132 0,0.08656 -0.05409,0.194711 l -1.849763,5.008456 4.283664,-1.06011 q\n  0.08654,-0.02154 0.129807,-0.02154 0.205532,0 0.367791,0.162285 z\" />");
}
exports.flash = flash;

},{}],4:[function(require,module,exports){
/**
 *  Misc Helpers
 */
"use strict";
/**
 * Parses URL into its components
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
 * Pormats and shortens a url for ui
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
/**
 * Creates the html for diagrams legend
 */
function makeLegend() {
    var ulNode = document.createElement("ul");
    ulNode.className = "resource-legend";
    ulNode.innerHTML = "\n        <li class=\"legend-blocked\" title=\"Time spent in a queue waiting for a network connection.\">Blocked</li>\n        <li class=\"legend-dns\" title=\"DNS resolution time.\">DNS</li>\n        <li class=\"legend-connect\" title=\"Time required to create TCP connection.\">Connect</li>\n        <li class=\"legend-ssl\" title=\"Time required for SSL/TLS negotiation.\">SSL (TLS)</li>\n        <li class=\"legend-send\" title=\"Time required to send HTTP request to the server.\">Send</li>\n        <li class=\"legend-wait\" title=\"Waiting for a response from the server.\">Wait</li>\n        <li class=\"legend-receive\" title=\"Time required to read entire response from the server (or cache).\">Receive</li>";
    return ulNode;
}
exports.makeLegend = makeLegend;

},{}],7:[function(require,module,exports){
"use strict";
var svg_chart_1 = require("./waterfall/svg-chart");
var paging = require("./paging/paging");
var har_1 = require("./transformers/har");
var legend_1 = require("./legend/legend");
exports.makeLegend = legend_1.makeLegend;
var waterfallDocsService = require("./state/waterfall-docs-service");
var globalStateService = require("./state/global-state");
var misc = require("./helpers/misc");
/** default options to use if not set in `options` parameter */
var defaultOptions = {
    rowHeight: 23,
    showAlignmentHelpers: true,
    showMimeTypeIcon: true,
    showIndicatorIcons: true,
    leftColumnWith: 25
};
function PerfCascade(waterfallDocsData, chartOptions) {
    var options = misc.assign(defaultOptions, chartOptions || {});
    //setup state services
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
    if (options.legendHolder) {
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
    return PerfCascade(har_1.default.transformDoc(harData), options);
}
exports.fromHar = fromHar;
/**
 * Create new PerfCascade from PerfCascade's internal WaterfallData format
 * @param {WaterfallDocs} waterfallDocsData Object containing data to render
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromPerfCascadeFormat(waterfallDocsData, options) {
    return PerfCascade(waterfallDocsData, options);
}
exports.fromPerfCascadeFormat = fromPerfCascadeFormat;
var transformHarToPerfCascade = har_1.default.transformDoc;
exports.transformHarToPerfCascade = transformHarToPerfCascade;
var paging_1 = require("./paging/paging");
exports.changePage = paging_1.setSelectedPageIndex;

},{"./helpers/misc":4,"./legend/legend":6,"./paging/paging":8,"./state/global-state":9,"./state/waterfall-docs-service":10,"./transformers/har":11,"./waterfall/svg-chart":25}],8:[function(require,module,exports){
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
 * @returns WaterfallData - currently selected page
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

},{"../state/waterfall-docs-service":10}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";
var time_block_1 = require("../typing/time-block");
var styling_converters_1 = require("./styling-converters");
var HarTransformer = (function () {
    function HarTransformer() {
    }
    /**
     * Transforms the full HAR doc, including all pages
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
            doneTime = Math.max(doneTime, startRelative + entry.time);
            return new time_block_1.default(entry.request.url, startRelative, parseInt(entry._all_end, 10) || (startRelative + entry.time), styling_converters_1.mimeToCssClass(entry.response.content.mimeType), _this.buildDetailTimingBlocks(startRelative, entry), entry, styling_converters_1.mimeToRequestType(entry.response.content.mimeType));
        });
        var marks = Object.keys(pageTimings)
            .filter(function (k) { return (typeof pageTimings[k] === "number" && pageTimings[k] >= 0); })
            .sort(function (a, b) { return pageTimings[a] > pageTimings[b] ? 1 : -1; })
            .map(function (k) {
            var startRelative = pageTimings[k];
            doneTime = Math.max(doneTime, startRelative);
            return {
                "name": k.replace(/^[_]/, "") + " (" + startRelative + "ms)",
                "startTime": startRelative
            };
        });
        // Add 100ms margin to make room for labels
        doneTime += 100;
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
        var preciseStart = parseInt(entry["_" + wptKey + "_start"], 10);
        var preciseEnd = parseInt(entry["_" + wptKey + "_end"], 10);
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

},{"../typing/time-block":13,"./styling-converters":12}],12:[function(require,module,exports){
"use strict";
/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
"use strict";
var ifValueDefined = function (value, fn) {
    if (!isFinite(value) || value <= 0) {
        return undefined;
    }
    return fn(value);
};
var formatBytes = function (size) { return ifValueDefined(size, function (s) { return s + " byte (~" + Math.round(s / 1024 * 10) / 10 + "kb)"; }); };
var formatTime = function (size) { return ifValueDefined(size, function (s) { return s + " ms"; }); };
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
    /** get experimental feature (usually WebPageTest) */
    var getExp = function (name) {
        return entry[name] || entry["_" + name] || entry.request[name] || entry.request["_" + name] || "";
    };
    var getHarTiming = function (name) {
        if (entry.timings[name] && entry.timings[name] > 0) {
            return entry.timings[name] + " ms";
        }
        return "";
    };
    /** get experimental feature and ensure it's not a sting of `0` or `` */
    var getExpNotNull = function (name) {
        var resp = getExp(name);
        return resp !== "0" ? resp : "";
    };
    /** get experimental feature and format it as byte */
    var getExpAsByte = function (name) {
        var resp = parseInt(getExp(name), 10);
        return (isNaN(resp) || resp <= 0) ? "" : formatBytes(resp);
    };
    return {
        "general": [
            ["Request Number", "#" + requestID],
            ["Started", new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page request started)"],
            ["Duration", formatTime(entry.time)],
            ["Error/Status Code", entry.response.status + " " + entry.response.statusText],
            ["Server IPAddress", entry.serverIPAddress],
            ["Connection", entry.connection],
            ["Browser Priority", getExp("priority") || getExp("initialPriority")],
            ["Was pushed", getExp("was_pushed")],
            ["Initiator (Loaded by)", getExp("initiator")],
            ["Initiator Line", getExp("initiator_line")],
            ["Host", getRequestHeader("Host")],
            ["IP", getExp("ip_addr")],
            ["Client Port", getExpNotNull("client_port")],
            ["Expires", getExp("expires")],
            ["Cache Time", getExp("cache_time")],
            ["CDN Provider", getExp("cdn_provider")],
            ["ObjectSize", getExp("objectSize")],
            ["Bytes In (downloaded)", getExpAsByte("bytesIn")],
            ["Bytes Out (uploaded)", getExpAsByte("bytesOut")],
            ["JPEG Scan Count", getExpNotNull("jpeg_scan_count")],
            ["Gzip Total", getExpAsByte("gzip_total")],
            ["Gzip Save", getExpAsByte("gzip_safe")],
            ["Minify Total", getExpAsByte("minify_total")],
            ["Minify Save", getExpAsByte("minify_save")],
            ["Image Total", getExpAsByte("image_total")],
            ["Image Save", getExpAsByte("image_save")],
        ],
        "timings": [
            ["Total", block.total + " ms"],
            ["Blocked", getHarTiming("blocked")],
            ["DNS", getHarTiming("dns")],
            ["Connect", getHarTiming("connect")],
            ["SSL (TLS)", getHarTiming("ssl")],
            ["Send", getHarTiming("send")],
            ["Wait", getHarTiming("wait")],
            ["Receive", getHarTiming("receive")],
        ],
        "request": [
            ["Method", entry.request.method],
            ["HTTP Version", entry.request.httpVersion],
            ["Bytes Out (uploaded)", getExpAsByte("bytesOut")],
            ["Headers Size", formatBytes(entry.request.headersSize)],
            ["Body Size", formatBytes(entry.request.bodySize)],
            ["Comment", entry.request.comment],
            ["User-Agent", getRequestHeader("User-Agent")],
            ["Host", getRequestHeader("Host")],
            ["Connection", getRequestHeader("Connection")],
            ["Accept", getRequestHeader("Accept")],
            ["Accept-Encoding", getRequestHeader("Accept-Encoding")],
            ["Expect", getRequestHeader("Expect")],
            ["Forwarded", getRequestHeader("Forwarded")],
            ["If-Modified-Since", getRequestHeader("If-Modified-Since")],
            ["If-Range", getRequestHeader("If-Range")],
            ["If-Unmodified-Since", getRequestHeader("If-Unmodified-Since")],
            ["Querystring parameters count", entry.request.queryString.length],
            ["Cookies count", entry.request.cookies.length],
        ],
        "response": [
            ["Status", entry.response.status + " " + entry.response.statusText],
            ["HTTP Version", entry.response.httpVersion],
            ["Bytes In (downloaded)", getExpAsByte("bytesIn")],
            ["Header Size", formatBytes(entry.response.headersSize)],
            ["Body Size", formatBytes(entry.response.bodySize)],
            ["Content-Type", getContentType()],
            ["Cache-Control", getResponseHeader("Cache-Control")],
            ["Content-Encoding", getResponseHeader("Content-Encoding")],
            ["Expires", formatDate(getResponseHeader("Expires"))],
            ["Last-Modified", formatDate(getResponseHeader("Last-Modified"))],
            ["Pragma", getResponseHeader("Pragma")],
            ["Content-Length", asIntPartial(getResponseHeader("Content-Length"), formatBytes)],
            ["Content Size", (getResponseHeader("Content-Length") !== entry.response.content.size.toString() ?
                    formatBytes(entry.response.content.size) : "")],
            ["Content Compression", formatBytes(entry.response.content.compression)],
            ["Connection", getResponseHeader("Connection")],
            ["ETag", getResponseHeader("ETag")],
            ["Accept-Patch", getResponseHeader("Accept-Patch")],
            ["Age", getResponseHeader("Age")],
            ["Allow", getResponseHeader("Allow")],
            ["Content-Disposition", getResponseHeader("Content-Disposition")],
            ["Location", getResponseHeader("Location")],
            ["Strict-Transport-Security", getResponseHeader("Strict-Transport-Security")],
            ["Trailer (for chunked transfer coding)", getResponseHeader("Trailer")],
            ["Transfer-Encoding", getResponseHeader("Transfer-Encoding")],
            ["Upgrade", getResponseHeader("Upgrade")],
            ["Vary", getResponseHeader("Vary")],
            ["Timing-Allow-Origin", getResponseHeader("Timing-Allow-Origin")],
            ["Redirect URL", entry.response.redirectURL],
            ["Comment", entry.response.comment],
        ]
    };
}
exports.getKeys = getKeys;

},{}],15:[function(require,module,exports){
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
    return dlKeyValues
        .filter(function (tuple) { return (tuple[1] !== undefined && tuple[1] !== -1 && tuple[1] !== 0 && tuple[1] !== ""); })
        .map(function (tuple) { return "\n      <dt " + makeClass(tuple[0]) + ">" + tuple[0] + "</dt>\n      <dd>" + tuple[1] + "</dd>\n    "; }).join("");
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
    var requestHeadersDl = makeDefinitionList(block.rawResource.request.headers.map(function (h) { return [h.name, h.value]; }));
    var responseDl = makeDefinitionList(tabsData.response);
    var responseHeadersDl = makeDefinitionList(block.rawResource.response.headers.map(function (h) { return [h.name, h.value]; }));
    var imgTab = makeImgTab(accordeonHeight, block);
    body.innerHTML = "\n    <div class=\"wrapper\">\n      <header class=\"type-" + block.requestType + "\">\n        <h3><strong>#" + requestID + "</strong> " + block.name + "</h3>\n        <nav class=\"tab-nav\">\n        <ul>\n          " + makeTabBtn("General", generalTab) + "\n          <li><button class=\"tab-button\">Request</button></li>\n          <li><button class=\"tab-button\">Response</button></li>\n          " + makeTabBtn("Timings", timingsTab) + "\n          <li><button class=\"tab-button\">Raw Data</button></li>\n          " + makeTabBtn("Preview", imgTab) + "\n        </ul>\n        </nav>\n      </header>\n      " + generalTab + "\n      <div class=\"tab\">\n        <dl>\n          " + requestDl + "\n        </dl>\n        <h2>All Request Headers</h2>\n        <dl>\n          " + requestHeadersDl + "\n        </dl>\n      </div>\n      <div class=\"tab\">\n        <dl>\n          " + responseDl + "\n        </dl>\n        <h2>All Response Headers</h2>\n        <dl>\n          " + responseHeadersDl + "\n        </dl>\n      </div>\n      " + timingsTab + "\n      <div class=\"tab\">\n        <code>\n          <pre>" + JSON.stringify(block.rawResource, null, 2) + "</pre>\n        </code>\n      </div>\n      " + imgTab + "\n    </div>\n    ";
    html.appendChild(body);
    return html;
}
exports.createDetailsBody = createDetailsBody;

},{"./extract-details-keys":14}],16:[function(require,module,exports){
//simple pub/sub for change to the overlay
"use strict";
exports.eventTypes = {
    "OPEN": "open",
    "CLOSE": "closed"
};
var subscribers = [];
function subscribeToOverlayChanges(fn) {
    subscribers.push(fn);
}
exports.subscribeToOverlayChanges = subscribeToOverlayChanges;
//no need for unsubscribe in the moment
function publishToOverlayChanges(change) {
    subscribers.forEach(function (fn) { return fn(change); });
}
exports.publishToOverlayChanges = publishToOverlayChanges;

},{}],17:[function(require,module,exports){
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
 * closes on overlay - rerenders others internally
 */
function closeOverlay(index, holder, overlayHolder, barX, accordionHeight, barEls, unit) {
    openOverlays.splice(openOverlays.reduce(function (prev, curr, i) {
        return (curr.index === index) ? i : prev;
    }, -1), 1);
    renderOverlays(barX, accordionHeight, overlayHolder, unit);
    overlayChangesPubSub.publishToOverlayChanges({
        "type": overlayChangesPubSub.eventTypes.CLOSE,
        "openOverlays": openOverlays,
        "combinedOverlayHeight": getCombinedOverlayHeight()
    });
    realignBars(barEls);
}
exports.closeOverlay = closeOverlay;
/**
 * Opens an overlay - rerenders others internaly
 */
function openOverlay(index, barX, y, accordionHeight, block, overlayHolder, barEls, unit) {
    var _this = this;
    if (openOverlays.filter(function (o) { return o.index === index; }).length > 0) {
        return;
    }
    openOverlays.push({
        "index": index,
        "defaultY": y,
        "block": block,
        "onClose": function () {
            _this.closeOverlay(index, null, overlayHolder, barX, accordionHeight, barEls, unit);
        }
    });
    renderOverlays(barX, accordionHeight, overlayHolder, unit);
    overlayChangesPubSub.publishToOverlayChanges({
        "type": overlayChangesPubSub.eventTypes.OPEN,
        "openOverlays": openOverlays,
        "combinedOverlayHeight": getCombinedOverlayHeight()
    });
    realignBars(barEls);
}
exports.openOverlay = openOverlay;
/**
 * sets the offset for request-bars
 * @param  {SVGGElement[]} barEls
 */
function realignBars(barEls) {
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
 * @param  {number} accordionHeight
 * @param  {SVGGElement} overlayHolder
 * @param  {number} unit
 */
function renderOverlays(barX, accordionHeight, overlayHolder, unit) {
    while (overlayHolder.firstChild) {
        overlayHolder.removeChild(overlayHolder.firstChild);
    }
    var currY = 0;
    openOverlays
        .sort(function (a, b) { return a.index > b.index ? 1 : -1; })
        .forEach(function (overlay) {
        var y = overlay.defaultY + currY;
        var infoOverlay = svg_details_overlay_1.createRowInfoOverlay(overlay.index, barX, y, accordionHeight, overlay.block, overlay.onClose, unit);
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

},{"./overlay-changes-pub-sub":16,"./svg-details-overlay":18}],18:[function(require,module,exports){
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
function createHolder(y, accordionHeight) {
    var innerHolder = svg.newG("info-overlay-holder", {
        "width": "100%"
    });
    var bg = svg.newEl("rect", {
        "width": "100%",
        "height": accordionHeight,
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
    var requestID = parseInt(block.rawResource._index + 1, 10) || indexBackup + 1;
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

},{"../../helpers/dom":1,"../../helpers/svg":5,"./html-details-body":15}],19:[function(require,module,exports){
/**
 * Creation of sub-components used in a resource request row
 */
"use strict";
var heuristics = require("../../helpers/heuristics");
// helper to avoid typing out all key of the helper object
function makeIcon(type, title) {
    return { "type": type, "title": title, "width": 20 };
}
/**
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @returns {Icon}
 */
function getMimeTypeIcon(block) {
    return makeIcon(block.requestType, block.requestType);
}
exports.getMimeTypeIcon = getMimeTypeIcon;
/**
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @param  {boolean} docIsSsl
 * @returns {Icon[]}
 */
function getIndicatorIcons(block, docIsSsl) {
    var entry = block.rawResource;
    var output = [];
    //highlight redirects
    if (!!entry.response.redirectURL) {
        var url = encodeURI(entry.response.redirectURL.split("?")[0] || "");
        output.push(makeIcon("err3xx", entry.response.status + " response status: Redirect to " + url + "..."));
    }
    if (!docIsSsl && heuristics.isSecure(block)) {
        output.push(makeIcon("lock", "Secure Connection"));
    }
    else if (docIsSsl && !heuristics.isSecure(block)) {
        output.push(makeIcon("noTls", "Insecure Connection"));
    }
    if (heuristics.hasCacheIssue(block)) {
        output.push(makeIcon("noCache", "Response not cached"));
    }
    if (heuristics.hasCompressionIssue(block)) {
        output.push(makeIcon("noGzip", "no gzip"));
    }
    if (heuristics.isInStatusCodeRange(entry, 400, 499)) {
        output.push(makeIcon("err4xx", entry.response.status + " response status: " + entry.response.statusText));
    }
    if (heuristics.isInStatusCodeRange(entry, 500, 599)) {
        output.push(makeIcon("err5xx", entry.response.status + " response status: " + entry.response.statusText));
    }
    if (!entry.response.content.mimeType && heuristics.isInStatusCodeRange(entry, 200, 299)) {
        output.push(makeIcon("warning", "No MIME Type defined"));
    }
    return output;
}
exports.getIndicatorIcons = getIndicatorIcons;

},{"../../helpers/heuristics":2}],20:[function(require,module,exports){
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
function createTimingLabel(rectData, timeTotal, firstX) {
    var minWidth = 500; // minimum supported diagram width that should show the timing label uncropped
    var spacingPerc = (5 / minWidth * 100);
    var y = rectData.y + rectData.height / 1.5;
    var totalLabel = Math.round(timeTotal) + " ms";
    var percStart = (rectData.x + rectData.width) / rectData.unit + spacingPerc;
    var txtEl = svg.newTextEl(totalLabel, y, misc.roundNumber(percStart, 2) + "%");
    //(pessimistic) estimation of text with to avoid performance penalty of `getBBox`
    var roughTxtWidth = totalLabel.length * 8;
    if (percStart + (roughTxtWidth / minWidth * 100) > 100) {
        percStart = firstX / rectData.unit - spacingPerc;
        txtEl = svg.newTextEl(totalLabel, y, misc.roundNumber(percStart, 2) + "%", { "textAnchor": "end" });
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
        rectHolder.appendChild(createTimingLabel(rectData, timeTotal, firstX));
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
 * @return {SVGTextElement}                  label SVG element
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
    var labelHolder = svg.newG("full-label");
    labelHolder.appendChild(svg.newEl("rect", {
        "class": "label-full-bg",
        "x": x - 3,
        "y": y + 3,
        "width": svg.getNodeTextWidth(blockLabel),
        "height": height - 4,
        "rx": 5,
        "ry": 5
    }));
    labelHolder.appendChild(blockLabel);
    return labelHolder;
}
exports.createRequestLabelFull = createRequestLabelFull;
// private helper
function createRequestLabel(x, y, name, height) {
    var blockName = misc.resourceUrlFormatter(name, 125);
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
    var labelFullBg = fullLabel.getElementsByTagName("rect")[0];
    var fullLabelText = fullLabel.getElementsByTagName("text")[0];
    //use display: none to not render it and visibility to remove it from search results (crt+f in chrome at least)
    fullLabel.style.display = "none";
    fullLabel.style.visibility = "hidden";
    rowFixed.appendChild(shortLabel);
    rowFixed.appendChild(fullLabel);
    rowFixed.addEventListener("mouseenter", function () {
        fullLabel.style.display = "block";
        shortLabel.style.display = "none";
        fullLabel.style.visibility = "visible";
        labelFullBg.style.width = (fullLabelText.clientWidth + 10).toString();
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

},{"../../helpers/misc":4,"../../helpers/svg":5}],21:[function(require,module,exports){
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
        "width": 100 - leftColumnWith + "%"
    });
    var requestNumber = index + 1 + ". ";
    var rect = rowSubComponents.createRect(rectData, block.segments, block.total);
    var shortLabel = rowSubComponents.createRequestLabelClipped(labelXPos, y, requestNumber + misc.resourceUrlFormatter(block.name, 40), rowHeight, "clipPath");
    var fullLabel = rowSubComponents.createRequestLabelFull(labelXPos, y, requestNumber + block.name, rowHeight);
    var rowName = rowSubComponents.createNameRowBg(y, rowHeight, onDetailsOverlayShow, leftColumnWith);
    var rowBar = rowSubComponents.createRowBg(y, rowHeight, onDetailsOverlayShow);
    var bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0));
    //create and attach request block
    rowBar.appendChild(rect);
    var x = 3;
    if (options.showMimeTypeIcon) {
        var icon = indicators.getMimeTypeIcon(block);
        rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
        x += icon.width;
    }
    if (options.showIndicatorIcons) {
        //Create and add warnings for potential issues
        indicators.getIndicatorIcons(block, docIsSsl).forEach(function (icon) {
            rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
            x += icon.width;
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

},{"../../helpers/heuristics":2,"../../helpers/icons":3,"../../helpers/misc":4,"../../helpers/svg":5,"./svg-indicators":19,"./svg-row-subcomponents":20}],22:[function(require,module,exports){
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

},{"../../helpers/svg":5}],23:[function(require,module,exports){
/**
 * Creation of sub-components of the waterfall chart
 */
"use strict";
var svg = require("../../helpers/svg");
var overlayChangesPubSub = require("../details-overlay/overlay-changes-pub-sub");
/**
 * Renders a per-second marker line and appends it to `timeHolder`
 *
 * @param  {SVGGElement} timeHolder element that the second marker is appended to
 * @param  {number} diagramHeight  Full height of SVG in px
 * @param  {number} secsTotal  total number of seconds in the timeline
 * @param  {number} sec second of the time marker to render
 * @param  {boolean} addLabel  if true a time label is added to the marker-line
 */
var appendSecond = function (timeHolder, diagramHeight, secsTotal, sec, addLabel) {
    if (addLabel === void 0) { addLabel = false; }
    var secPerc = 100 / secsTotal;
    /** just used if `addLabel` is `true` - for full seconds */
    var lineLabel;
    var lineClass = "sub-second-line";
    if (addLabel) {
        lineClass = "second-line";
        lineLabel = svg.newTextEl(sec + "s", diagramHeight);
        if (sec > secsTotal - 0.2) {
            lineLabel.setAttribute("x", secPerc * sec - 0.5 + "%");
            lineLabel.setAttribute("text-anchor", "end");
        }
        else {
            lineLabel.setAttribute("x", secPerc * sec + 0.5 + "%");
        }
    }
    var lineEl = svg.newEl("line", {
        "class": lineClass,
        "x1": secPerc * sec + "%",
        "y1": "0",
        "x2": secPerc * sec + "%",
        "y2": diagramHeight
    });
    overlayChangesPubSub.subscribeToOverlayChanges(function (change) {
        var offset = change.combinedOverlayHeight;
        //figure out why there is an offset
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
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 * @param {number} subSecondStepMs  Distant (time in ms) between sub-second time-scales
 */
function createTimeScale(durationMs, diagramHeight, subSecondStepMs) {
    if (subSecondStepMs === void 0) { subSecondStepMs = 200; }
    var timeHolder = svg.newEl("g", { class: "time-scale full-width" });
    /** steps between each second marker */
    var subSecondSteps = 1000 / subSecondStepMs;
    var secs = durationMs / 1000;
    var steps = durationMs / subSecondStepMs;
    for (var i = 0; i <= steps; i++) {
        var isFullSec = i % subSecondSteps === 0;
        var secValue = i / subSecondSteps;
        appendSecond(timeHolder, diagramHeight, secs, secValue, isFullSec);
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

},{"../../helpers/svg":5,"../details-overlay/overlay-changes-pub-sub":16}],24:[function(require,module,exports){
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
        overlayChangesPubSub.subscribeToOverlayChanges(function (change) {
            var offset = change.combinedOverlayHeight;
            var scale = (diagramHeight + offset) / (diagramHeight);
            line.setAttribute("transform", "scale(1, " + scale + ")");
            lineLabelHolder.setAttribute("transform", "translate(0, " + offset + ")");
            lineConnection.setAttribute("transform", "translate(0, " + offset + ")");
        });
        var isActive = false;
        var onLabelMouseEnter = function (evt) {
            if (!isActive) {
                isActive = true;
                svg.addClass(lineHolder, "active");
                //firefox has issues with this
                markHolder.parentNode.appendChild(markHolder);
            }
        };
        var onLabelMouseLeave = function (evt) {
            isActive = false;
            svg.removeClass(lineHolder, "active");
        };
        lineLabel.addEventListener("mouseenter", onLabelMouseEnter);
        lineLabel.addEventListener("mouseleave", onLabelMouseLeave);
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

},{"../../helpers/svg":5,"../details-overlay/overlay-changes-pub-sub":16}],25:[function(require,module,exports){
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
        "width": 100 - options.leftColumnWith + "%"
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
    var labelXPos = 5;
    // This assumes all icons (mime and indicators) have the same width
    var iconWidth = indicators.getMimeTypeIcon(barsToShow[0]).width;
    if (options.showMimeTypeIcon) {
        labelXPos += iconWidth;
    }
    if (options.showIndicatorIcons) {
        var iconsPerBlock = barsToShow.map(function (block) { return indicators.getIndicatorIcons(block, docIsSsl).length; });
        labelXPos += iconWidth * Math.max.apply(null, iconsPerBlock);
    }
    var barEls = [];
    function getChartHeight() {
        return (chartHolderHeight + overlayManager.getCombinedOverlayHeight()).toString() + "px";
    }
    overlayChangesPubSub.subscribeToOverlayChanges(function (evt) {
        timeLineHolder.style.height = getChartHeight();
    });
    /** Renders single row and hooks up behaviour */
    function renderRow(block, i) {
        var blockWidth = block.total || 1;
        var y = options.rowHeight * i;
        var x = (block.start || 0.001);
        var accordionHeight = 450;
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
            overlayManager.openOverlay(i, x, y + options.rowHeight, accordionHeight, block, overlayHolder, barEls, unit);
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

},{"../helpers/svg":5,"../state/global-state":9,"./details-overlay/overlay-changes-pub-sub":16,"./details-overlay/svg-details-overlay-manager":17,"./row/svg-indicators":19,"./row/svg-row":21,"./sub-components/svg-alignment-helper":22,"./sub-components/svg-general-components":23,"./sub-components/svg-marks":24}]},{},[7])(7)
});