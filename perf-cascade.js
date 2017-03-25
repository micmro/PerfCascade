/*! github.com/micmro/PerfCascade Version:1.2.0 (25/03/2017) */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.perfCascade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        el.setAttribute("class", el.getAttribute("class")
            .replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
    }
    return el;
}
exports.removeClass = removeClass;
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function matchHeaderFilter(lowercaseName) {
    return function (header) { return header.name.toLowerCase() === lowercaseName; };
}
function hasHeader(headers, headerName) {
    var headerFilter = matchHeaderFilter(headerName.toLowerCase());
    return headers.some(headerFilter);
}
exports.hasHeader = hasHeader;
function getHeader(headers, headerName) {
    var headerFilter = matchHeaderFilter(headerName.toLowerCase());
    var firstMatch = headers.filter(headerFilter).pop();
    return firstMatch ? firstMatch.value : undefined;
}
exports.getHeader = getHeader;

},{}],3:[function(require,module,exports){
/**
 *  SVG Icons
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toSvg = function (x, y, title, className, scale, svgDoc) {
    var parser = new DOMParser();
    var doc = parser.parseFromString("<svg x=\"" + x + "\" y=\"" + y + "\" xmlns=\"http://www.w3.org/2000/svg\">\n    <g class=\"icon " + className + "\" transform=\"scale(" + scale + ")\">\n      " + svgDoc + "\n      <title>" + title + "</title>\n    </g>\n  </svg>", "image/svg+xml");
    return doc.firstChild;
};
function noTls(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-tls", scale, "<path d=\"m 18,6.2162 0,2.7692 q 0,0.2813 -0.205529,0.4868\n    -0.205529,0.2055 -0.486779,0.2055 l -0.692307,0 q -0.28125,0 -0.486779,-0.2055 -0.205529,-0.2055 -0.205529,-0.4868\n    l 0,-2.7692 q 0,-1.1466 -0.811298,-1.9579 -0.811298,-0.8113 -1.957933,-0.8113 -1.146634,0 -1.957933,0.8113\n    -0.811298,0.8113 -0.811298,1.9579 l 0,2.0769 1.038462,0 q 0.432692,0 0.735577,0.3029 0.302884,0.3029\n    0.302884,0.7356 l 0,6.2307 q 0,0.4327 -0.302884,0.7356 -0.302885,0.3029 -0.735577,0.3029 l -10.384615,0 q\n    -0.432693,0 -0.735577,-0.3029 Q 0,15.995 0,15.5623 L 0,9.3316 Q 0,8.8989 0.302885,8.596 0.605769,8.2931\n    1.038462,8.2931 l 7.26923,0 0,-2.0769 q 0,-2.0012 1.422476,-3.4237 1.422476,-1.4225 3.423678,-1.4225 2.001202,0\n    3.423678,1.4225 Q 18,4.215 18,6.2162 Z\" />");
}
exports.noTls = noTls;
function err3xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-redirect", scale, "<path d=\"M 17,2.3333333 17,7 q 0,0.2708444 -0.19792,0.4687111\n    -0.197911,0.1979556 -0.468747,0.1979556 l -4.666666,0 q -0.437503,0 -0.614587,-0.4166223 -0.177084,-0.4063111\n    0.14584,-0.7187555 L 12.635413,5.0937778 Q 11.093751,3.6666667 9,3.6666667 q -1.0833333,0 -2.0677067,0.4218666 Q\n    5.94792,4.5104 5.2291644,5.2291556 4.5104178,5.9479111 4.0885422,6.9322667 3.6666667,7.9167111 3.6666667,9 q\n    0,1.083378 0.4218755,2.067733 0.4218756,0.984356 1.1406222,1.703111 Q 5.94792,13.4896 6.9322933,13.911467\n    7.9166667,14.333333 9,14.333333 q 1.239582,0 2.343751,-0.541689 1.104169,-0.5416 1.864578,-1.5312 0.07289,-0.104177\n    0.239591,-0.125066 0.145831,0 0.260409,0.09378 l 1.427084,1.437511 q 0.09375,0.08356 0.09896,0.213511\n    0.0053,0.130222 -0.07813,0.2344 -1.135413,1.375022 -2.75,2.130222 Q 10.791662,17 9,17 7.3749956,17\n    5.8958311,16.364622 4.4166667,15.729156 3.3437511,14.656267 2.2708356,13.583378 1.6354133,12.104178 1,10.624978 1,9\n    1,7.3750222 1.6354133,5.8958222 2.2708356,4.4167111 3.3437511,3.3437333 4.4166667,2.2708444 5.8958311,1.6353778\n    7.3749956,1 9,1 q 1.531253,0 2.963538,0.5781333 1.432293,0.5781334 2.54688,1.6302223 L 15.864587,1.8646222 Q\n    16.166667,1.5416889 16.593751,1.7187556 17,1.8958222 17,2.3333333 Z\" />");
}
exports.err3xx = err3xx;
function err4xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-4xx", scale, "<path d=\"m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096\n    -0.084725,-0.084 -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096\n    l 0,1.6945 q 0,0.1248 0.084725,0.2096 0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084\n    0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356 0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098\n    -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098 -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757\n    q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0 0.2095847,-0.058 0.08473,-0.058\n    0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587\n    -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q\n    1.3211891,16.1072 1.169575,15.8485 0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911\n    8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0 0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437\n    z\" />");
}
exports.err4xx = err4xx;
function err5xx(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-5xx", scale, "<path d=\"m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096\n    -0.084725,-0.084 -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l\n    0,1.6945 q 0,0.1248 0.084725,0.2096 0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084\n    0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356 0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098\n    -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098 -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757\n    q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0 0.2095847,-0.058 0.08473,-0.058\n    0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587\n    -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q\n    1.3211891,16.1072 1.169575,15.8485 0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911\n    8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0 0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437\n    z\" />");
}
exports.err5xx = err5xx;
function plain(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-plain", scale, "<path d=\"m 15.247139,4.3928381 q 0.250004,0.2500571 0.428571,0.6786286\n    0.178575,0.4285714 0.178575,0.7856761 l 0,10.2857142 q 0,0.357181 -0.250003,0.607162 Q 15.354285,17 14.997143,17 L\n    2.9971428,17 Q 2.64,17 2.3899962,16.750019 2.14,16.500038 2.14,16.142857 l 0,-14.2857142 Q 2.14,1.5000381\n    2.3899962,1.249981 2.64,1 2.9971428,1 l 8.0000002,0 q 0.357142,0 0.785714,0.1785905 0.428571,0.1785905\n    0.678568,0.4285714 z m -3.964282,-2.1785143 0,3.3571047 3.357143,0 Q 14.550712,5.3125333 14.443573,5.2053333 L\n    11.64893,2.4107428 q -0.107147,-0.1072 -0.366073,-0.196419 z m 3.428571,13.6428192 0,-9.1428573 -3.714285,0 q\n    -0.357143,0 -0.607147,-0.2499809 Q 10.14,6.2143238 10.14,5.8571428 l 0,-3.7142856 -6.8571428,0 0,13.7142858\n    11.4285708,0 z M 5.5685715,8.1428569 q 0,-0.1250285 0.080358,-0.2053333 0.080358,-0.080382 0.2053562,-0.080382 l\n    6.2857143,0 q 0.124998,0 0.205356,0.080382 0.08036,0.080302 0.08036,0.2053333 l 0,0.5714284 q 0,0.1250294\n    -0.08036,0.2053334 Q 12.264998,9 12.14,9 L 5.8542857,9 Q 5.7292876,9 5.6489295,8.9196178 5.5685713,8.8393156\n    5.5685713,8.7142844 l 0,-0.5714284 z M 12.14,10.142857 q 0.124998,0 0.205356,0.08038 0.08036,0.0803 0.08036,0.205333\n    l 0,0.571429 q 0,0.125028 -0.08036,0.205333 -0.08036,0.08038 -0.205356,0.08038 l -6.2857143,0 q -0.1249981,0\n    -0.2053562,-0.08038 -0.080358,-0.0803 -0.080358,-0.205333 l 0,-0.571429 q 0,-0.125028 0.080358,-0.205333\n    0.080358,-0.08038 0.2053562,-0.08038 l 6.2857143,0 z m 0,2.285715 q 0.124998,0 0.205356,0.08038 0.08036,0.0803\n    0.08036,0.205333 l 0,0.571429 q 0,0.125029 -0.08036,0.205334 -0.08036,0.08038 -0.205356,0.08038 l -6.2857143,0 q\n    -0.1249981,0 -0.2053562,-0.08038 -0.080358,-0.0803 -0.080358,-0.205334 l 0,-0.571429 q 0,-0.125028\n    0.080358,-0.205333 0.080358,-0.08038 0.2053562,-0.08038 l 6.2857143,0 z\" />");
}
exports.plain = plain;
function other(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-other", scale, "<path d=\"m 10.801185,13.499991 0,3.000034 q 0,0.199966\n    -0.149997,0.350003 Q 10.501188,17 10.301185,17 l -2.9999954,0 q -0.200003,0 -0.350002,-0.149972 -0.149998,-0.150037\n    -0.149998,-0.350003 l 0,-3.000034 q 0,-0.199966 0.149998,-0.350004 0.149999,-0.149972 0.350002,-0.149972 l\n    2.9999954,0 q 0.200003,0 0.350003,0.149972 0.149997,0.150038 0.149997,0.350004 z m 3.950001,-7.4999953 q 0,0.6749751\n    -0.193752,1.2624809 -0.193746,0.5875065 -0.437493,0.956246 Q 13.876188,8.587526 13.43244,8.9624908\n    12.988685,9.337519 12.713687,9.506231 12.43869,9.675006 11.951191,9.949989 q -0.5125,0.287495 -0.856252,0.8125\n    -0.343749,0.525 -0.343749,0.837523 0,0.212477 -0.150001,0.406217 -0.150004,0.193802 -0.349999,0.193802 l\n    -3.0000054,0 q -0.187495,0 -0.318749,-0.231277 -0.131246,-0.231284 -0.131246,-0.468725 l 0,-0.562543 q 0,-1.037488\n    0.812497,-1.9562566 Q 8.4261846,8.0625246 9.4011886,7.6249911 10.138688,7.287504 10.451185,6.9249894\n    10.76369,6.5624748 10.76369,5.9750331 q 0,-0.525002 -0.58125,-0.9250582 -0.5812494,-0.3999918 -1.3437494,-0.3999918\n    -0.812504,0 -1.35,0.3625146 -0.437502,0.3125237 -1.3375,1.4374811 -0.162499,0.2000281 -0.387504,0.2000281\n    -0.149997,0 -0.312498,-0.099982 L 3.4011866,4.9875343 Q 3.2386866,4.8625246 3.2074416,4.6750106 3.1761886,4.4874957\n    3.2761906,4.3250097 5.2761886,1 9.0761896,1 q 0.9999984,0 2.0124974,0.3874782 1.012501,0.3875423 1.825003,1.0375531\n    0.812497,0.649947 1.324997,1.5937436 0.512499,0.9437319 0.512499,1.9812208 z\" />");
}
exports.other = other;
function javascript(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-js", scale, "<g transform=\"matrix(0.03159732,0,0,0.03159732,0.93993349,0.955184)\"\n    id=\"Layer_1\"><g><path d=\"m 112.155,67.644 84.212,0 0,236.019 c 0,106.375 -50.969,143.497 -132.414,143.497 -19.944,0\n    -45.429,-3.324 -62.052,-8.864 L 11.32,370.15 c 11.635,3.878 26.594,6.648 43.214,6.648 35.458,0 57.621,-16.068\n    57.621,-73.687 l 0,-235.467 z\" /><path id=\"path9\" d=\"m 269.484,354.634 c 22.161,11.635 57.62,23.27 93.632,23.27\n    38.783,0 59.282,-16.066 59.282,-40.998 0,-22.715 -17.729,-36.565 -62.606,-52.079 -62.053,-22.162 -103.05,-56.512\n    -103.05,-111.36 0,-63.715 53.741,-111.917 141.278,-111.917 42.662,0 73.132,8.313 95.295,18.838 l -18.839,67.592 c\n    -14.404,-7.201 -41.553,-17.729 -77.562,-17.729 -36.567,0 -54.297,17.175 -54.297,36.013 0,23.824 20.499,34.349\n    69.256,53.188 65.928,24.378 96.4,58.728 96.4,111.915 0,62.606 -47.647,115.794 -150.143,115.794 -42.662,0\n    -84.77,-11.636 -105.82,-23.27 l 17.174,-69.257 z\"/></g></g>");
}
exports.javascript = javascript;
function image(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-image", scale, "<path d=\"M 6,6 Q 6,6.75 5.475,7.275 4.95,7.8 4.2,7.8 3.45,7.8\n    2.925,7.275 2.4,6.75 2.4,6 2.4,5.25 2.925,4.725 3.45,4.2 4.2,4.2 4.95,4.2 5.475,4.725 6,5.25 6,6 Z m 9.6,3.6 0,4.2\n    -13.2,0 0,-1.8 3,-3 1.5,1.5 4.8,-4.8 z M 16.5,3 1.5,3 Q 1.378125,3 1.289063,3.089 1.200003,3.178 1.200003,3.2999 l\n    0,11.4 q 0,0.1219 0.08906,0.2109 0.08906,0.089 0.210937,0.089 l 15,0 q 0.121875,0 0.210938,-0.089 0.08906,-0.089\n    0.08906,-0.2109 l 0,-11.4 q 0,-0.1219 -0.08906,-0.2109 Q 16.621878,3 16.5,3 Z m 1.5,0.3 0,11.4 q\n    0,0.6188 -0.440625,1.0594 Q 17.11875,16.2 16.5,16.2 l -15,0 Q 0.88125,16.2 0.440625,15.7594 0,15.3188 0,14.7 L 0,3.3\n    Q 0,2.6813 0.440625,2.2406 0.88125,1.8 1.5,1.8 l 15,0 q 0.61875,0 1.059375,0.4406 Q 18,2.6813 18,3.3 Z\" />");
}
exports.image = image;
function svg(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return image(x, y, title, scale);
}
exports.svg = svg;
function html(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-html", scale, "<path d=\"m 5.62623,13.310467 -0.491804,0.4919 q -0.09836,0.098\n    -0.226229,0.098 -0.127869,0 -0.22623,-0.098 L 0.098361,9.218667 Q 0,9.120367 0,8.992467 q 0,-0.1279 0.09836,-0.2262\n    l 4.583606,-4.5836 q 0.09836,-0.098 0.22623,-0.098 0.127869,0 0.226229,0.098 l 0.491804,0.4918 q 0.09836,0.098\n    0.09836,0.2262 0,0.1279 -0.09836,0.2262 l -3.865574,3.8656 3.865574,3.8656 q 0.09836,0.098 0.09836,0.2262 0,0.1279\n    -0.09836,0.2262 z m 5.813114,-10.495 -3.668852,12.6983 q -0.03934,0.1279 -0.152459,0.1918 -0.113115,0.064\n    -0.231148,0.025 l -0.609836,-0.1672 q -0.127869,-0.039 -0.191803,-0.1525 -0.06393,-0.1131 -0.02459,-0.2409 l\n    3.668852,-12.6984 q 0.03934,-0.1279 0.152459,-0.1918 0.113115,-0.064 0.231148,-0.025 l 0.609836,0.1672 q\n    0.127869,0.039 0.191803,0.1525 0.06393,0.1131 0.02459,0.241 z m 6.462295,6.4032 -4.583606,4.5837 q -0.09836,0.098\n    -0.22623,0.098 -0.127869,0 -0.226229,-0.098 l -0.491804,-0.4919 q -0.09836,-0.098 -0.09836,-0.2262 0,-0.1278\n    0.09836,-0.2262 l 3.865574,-3.8656 -3.865574,-3.8656 q -0.09836,-0.098 -0.09836,-0.2262 0,-0.1279 0.09836,-0.2262 l\n    0.491804,-0.4918 q 0.09836,-0.098 0.226229,-0.098 0.127869,0 0.22623,0.098 l 4.583606,4.5836 Q 18,8.864567\n    18,8.992467 q 0,0.1279 -0.09836,0.2262 z\" />");
}
exports.html = html;
function css(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-css", scale, "<path d=\"m 15.435754,0.98999905 q 0.625698,0 1.094972,0.41564445 Q\n    17,1.8212879 17,2.4469768 q 0,0.5631111 -0.402235,1.3496889 -2.967597,5.6224 -4.156425,6.7217783 -0.867039,0.813421\n    -1.948602,0.813421 -1.1262576,0 -1.9351961,-0.826755 -0.8089385,-0.8268443 -0.8089385,-1.9620443 0,-1.1441778\n    0.8223463,-1.8949333 L 14.273743,1.4726657 Q 14.801117,0.98999905 15.435754,0.98999905 Z M 7.3106145,10.232488 q\n    0.3486034,0.679289 0.9519554,1.161955 0.6033519,0.482666 1.3452513,0.679378 l 0.00894,0.634577 q 0.035753,1.903911\n    -1.1575432,3.101689 -1.1932962,1.197778 -3.115084,1.197778 -1.0994413,0 -1.9486032,-0.415644 Q 2.5463687,16.176576\n    2.0324022,15.452576 1.5184357,14.728576 1.2592179,13.816843 1,12.905109 1,11.850354 q 0.06257,0.04444\n    0.3664804,0.268089 0.3039107,0.223466 0.55419,0.397778 0.2502793,0.174311 0.5273743,0.326311 0.2770949,0.151911\n    0.4111732,0.151911 0.3664804,0 0.4916201,-0.330756 0.2234637,-0.589866 0.5139664,-1.005511 0.2905029,-0.415644\n    0.6212291,-0.679377 0.3307262,-0.263644 0.7865922,-0.424533 0.4558659,-0.160889 0.9206704,-0.228 0.4648044,-0.06667\n    1.1173184,-0.09378 z\" />");
}
exports.css = css;
function warning(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-warning", scale, "<path d=\"m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096\n    -0.084725,-0.084 -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l\n    0,1.6945 q 0,0.1248 0.084725,0.2096 0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084\n    0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356 0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098\n    -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098 -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757\n    q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0 0.2095847,-0.058 0.08473,-0.058\n    0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587\n    -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q\n    1.3211891,16.1072 1.169575,15.8485 0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911\n    8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0 0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437\n    z\" />");
}
exports.warning = warning;
function error(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-no-gzip", scale, "<path d=\"m 9,1 q 2.177084,0 4.015627,1.0728889 1.838542,1.0729778\n    2.911457,2.9114667 Q 17,6.8229333 17,9 q 0,2.177067 -1.072916,4.015644 -1.072915,1.838489 -2.911457,2.911467 Q\n    11.177084,17 9,17 6.8229156,17 4.9843733,15.927111 3.1458311,14.854133 2.0729156,13.015644 1,11.177067 1,9\n    1,6.8229333 2.0729156,4.9843556 3.1458311,3.1458667 4.9843733,2.0728889 6.8229156,1 9,1 Z m 1.333333,12.9896\n    0,-1.9792 q 0,-0.145778 -0.09375,-0.2448 -0.09375,-0.09893 -0.229164,-0.09893 l -2.0000001,0 q -0.1354222,0\n    -0.2395822,0.104177 -0.1041689,0.104178 -0.1041689,0.239556 l 0,1.9792 q 0,0.135378 0.1041689,0.239556\n    0.10416,0.104177 0.2395822,0.104177 l 2.0000001,0 q 0.135413,0 0.229164,-0.09893 0.09375,-0.09902 0.09375,-0.2448 z\n    m -0.0208,-3.583378 0.187503,-6.4687109 q 0,-0.1249778 -0.104169,-0.1874667 -0.104169,-0.083556 -0.25,-0.083556 l\n    -2.2916626,0 q -0.14584,0 -0.25,0.083556 -0.1041688,0.062222 -0.1041688,0.1874667 L 7.67712,10.406222 q 0,0.104178\n    0.1041689,0.182311 0.10416,0.07822 0.25,0.07822 l 1.9270755,0 q 0.1458396,0 0.2447996,-0.07822 0.09895,-0.07822\n    0.109369,-0.182311 z\" />");
}
exports.error = error;
function font(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-font", scale, "<path d=\"M 7.9711534,5.7542664 6.3365384,10.0812 q 0.3173075,0\n    1.3124995,0.01956 0.9951928,0.01956 1.5432692,0.01956 0.1826924,0 0.5480773,-0.01956 Q 8.9038458,7.6680441\n    7.9711534,5.754622 Z M 1,16.379245 1.0192356,15.619601 q 0.2211537,-0.06756 0.5384613,-0.120178 0.3173075,-0.05245\n    0.5480764,-0.100978 0.2307697,-0.048 0.4759617,-0.139378 0.245192,-0.09138 0.4278844,-0.278844 0.1826925,-0.187556\n    0.2980774,-0.4856 L 5.5865429,8.5715107 8.2788503,1.61 l 1.2307688,0 q 0.076924,0.1346666 0.1057698,0.2019555 L\n    11.586543,6.427333 q 0.317307,0.7499556 1.01923,2.475911 0.701923,1.726045 1.096153,2.639467 0.144232,0.326934\n    0.557693,1.389423 0.413462,1.062489 0.692307,1.620178 0.192309,0.432711 0.336539,0.548089 0.182692,0.144266\n    0.846154,0.283644 0.663462,0.139467 0.807692,0.197156 Q 17,15.946534 17,16.129289 q 0,0.03822 -0.0048,0.124978\n    -0.0048,0.08622 -0.0048,0.124978 -0.60577,0 -1.826923,-0.07644 -1.221154,-0.07733 -1.836539,-0.07733 -0.730769,0\n    -2.067307,0.06756 -1.3365382,0.06755 -1.7115381,0.07733 0,-0.413511 0.038462,-0.750044 L 10.84617,15.351076 q\n    0.0096,0 0.120192,-0.024 0.110577,-0.024 0.149039,-0.03378 0.03846,-0.0098 0.139423,-0.04356 0.100961,-0.03378\n    0.144231,-0.06222 0.04327,-0.02933 0.105769,-0.07733 0.0625,-0.048 0.08653,-0.105777 0.02403,-0.05778\n    0.02403,-0.134578 0,-0.153867 -0.298077,-0.927911 -0.298068,-0.774053 -0.692299,-1.706764 -0.394231,-0.932623\n    -0.403846,-0.961512 l -4.3269223,-0.01956 q -0.25,0.55769 -0.7355768,1.879823 -0.4855769,1.322044\n    -0.4855769,1.562489 0,0.211555 0.1346151,0.360533 0.1346151,0.149067 0.4182693,0.235556 0.2836533,0.08622\n    0.4663458,0.129866 0.1826924,0.04356 0.5480773,0.08178 0.365384,0.03822 0.3942302,0.03822 0.00962,0.182667\n    0.00962,0.557689 0,0.08622 -0.019236,0.259644 -0.5576924,0 -1.6778843,-0.09618 -1.1201929,-0.09618\n    -1.6778844,-0.09618 -0.076924,0 -0.254808,0.03822 -0.1778844,0.03822 -0.2067306,0.03822 Q 2.0384613,16.379245\n    1,16.379245 Z\" />");
}
exports.font = font;
function flash(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-flash", scale, "<path d=\"m 13.724296,4.737962 q 0.194716,0.216309 0.07572,0.475924 L\n    7.958654,17.729559 Q 7.818031,18 7.504329,18 7.461078,18 7.352885,17.97846 7.16899,17.924378 7.0770425,17.772918\n    6.9850949,17.621512 7.0283513,17.4484 L 9.15937,8.708015 4.7675305,9.800549 q -0.043251,0.01077 -0.1298072,0.01077\n    -0.1947161,0 -0.3353388,-0.118981 -0.1947107,-0.162286 -0.140628,-0.4219 L 6.3360428,0.34617 Q 6.3792939,0.194711\n    6.5091226,0.097382 6.6389298,0 6.8120043,0 l 3.5480877,0 q 0.205532,0 0.346154,0.135193 0.140628,0.135248\n    0.140628,0.319132 0,0.08656 -0.05409,0.194711 l -1.849763,5.008456 4.283664,-1.06011 q 0.08654,-0.02154\n    0.129807,-0.02154 0.205532,0 0.367791,0.162285 z\" />");
}
exports.flash = flash;
function video(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-video", scale, "<path d=\"m 17,4.106999 0,9.7143 q 0,0.3751 -0.348214,0.5268\n    -0.116071,0.044 -0.223214,0.044 -0.241072,0 -0.401786,-0.1696 l -3.598214,-3.5983 0,1.4822 q 0,1.0625\n    -0.754464,1.8169 -0.754465,0.7552 -1.8169652,0.7552 l -6.2857143,0 q -1.0625,0 -1.8169642,-0.7545 Q 1,13.169599\n    1,12.106999 l 0,-6.2857 q 0,-1.0624 0.7544643,-1.8169 0.7544642,-0.7544 1.8169642,-0.7544 l 6.2857143,0 q\n    1.0625002,0 1.8169652,0.7544 0.754464,0.7545 0.754464,1.8169 l 0,1.4733 3.598214,-3.5893 q 0.160714,-0.1696\n    0.401786,-0.1696 0.107143,0 0.223214,0.044 Q 17,3.732099 17,4.106999 Z\" />");
}
exports.video = video;
function audio(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-audio", scale, "<path d=\"m 8.384615,3.7559 0,10.4615 q 0,0.2501 -0.182692,0.4327\n    -0.182692,0.1827 -0.432692,0.1827 -0.25,0 -0.432692,-0.1827 l -3.201924,-3.2019 -2.51923,0 q -0.25,0\n    -0.432693,-0.1827 Q 1,11.0828 1,10.8328 L 1,7.1405 Q 1,6.8905 1.182692,6.7078 1.365385,6.5251 1.615385,6.5251 l\n    2.51923,0 3.201924,-3.2019 q 0.182692,-0.1827 0.432692,-0.1827 0.25,0 0.432692,0.1827 0.182692,0.1827\n    0.182692,0.4327 z m 3.692308,5.2308 q 0,0.7307 -0.408654,1.3605 -0.408654,0.6299 -1.08173,0.8991 -0.09615,0.048\n    -0.240385,0.048 -0.25,0 -0.432693,-0.1779 -0.182692,-0.1778 -0.182692,-0.4375 0,-0.2018 0.115385,-0.3413\n    0.115385,-0.1394 0.278846,-0.2404 0.163461,-0.1009 0.326923,-0.2211 0.163462,-0.1202 0.278846,-0.3414\n    0.115385,-0.2211 0.115385,-0.548 0,-0.327 -0.115385,-0.5481 Q 10.615385,8.2174 10.451923,8.0972 10.288461,7.9771\n    10.125,7.8761 9.961539,7.7751 9.846154,7.6357 9.730769,7.4963 9.730769,7.2943 q 0,-0.2596 0.182692,-0.4374\n    0.182693,-0.178 0.432693,-0.178 0.144231,0 0.240385,0.048 0.673076,0.2597 1.08173,0.8942 0.408654,0.6347\n    0.408654,1.3655 z m 2.461538,0 q 0,1.4711 -0.817307,2.7163 -0.817308,1.2452 -2.163462,1.8125 -0.125,0.048\n    -0.240384,0.048 -0.259616,0 -0.442308,-0.1827 -0.182692,-0.1827 -0.182692,-0.4327 0,-0.375 0.375,-0.5673\n    0.538461,-0.2789 0.730769,-0.4231 0.711538,-0.5192 1.110577,-1.3029 0.399038,-0.7836 0.399038,-1.6682 0,-0.8847\n    -0.399038,-1.6683 -0.399039,-0.7836 -1.110577,-1.3029 -0.192308,-0.1442 -0.730769,-0.4231 -0.375,-0.1923\n    -0.375,-0.5672 0,-0.2501 0.182692,-0.4328 0.182692,-0.1826 0.432692,-0.1826 0.125,0 0.25,0.048 1.346154,0.5674\n    2.163462,1.8125 0.817307,1.2452 0.817307,2.7164 z M 17,8.9867 q 0,2.2115 -1.221154,4.0624 -1.221154,1.851\n    -3.25,2.726 -0.125,0.048 -0.25,0.048 -0.25,0 -0.432692,-0.1827 -0.182693,-0.1827 -0.182693,-0.4327 0,-0.3461\n    0.375,-0.5673 0.06731,-0.038 0.216347,-0.1009 0.149038,-0.062 0.216346,-0.101 0.442307,-0.2404 0.788461,-0.4904\n    1.182693,-0.875 1.846154,-2.1827 0.663462,-1.3077 0.663462,-2.7788 0,-1.4712 -0.663462,-2.7789 Q 14.442308,4.9\n    13.259615,4.0251 12.913461,3.775 12.471154,3.5347 q -0.06731,-0.038 -0.216346,-0.101 -0.149039,-0.062\n    -0.216347,-0.101 -0.375,-0.2212 -0.375,-0.5673 0,-0.25 0.182693,-0.4327 0.182692,-0.1827 0.432692,-0.1827 0.125,0\n    0.25,0.048 2.028846,0.8751 3.25,2.726 Q 17,6.7751 17,8.9867 Z\" />");
}
exports.audio = audio;
function push(x, y, title, scale) {
    if (scale === void 0) { scale = 1; }
    return toSvg(x, y, title, "icon-push", scale, "<path d=\"m 14.667614,9 q 0,0.415934 -0.284982,0.700867 L\n      9.3685123,14.715 Q 9.0681257,15 8.6676124,15 8.2747991,15 7.9744123,14.715 L 7.3967524,14.137334 q\n      -0.2926867,-0.292667 -0.2926867,-0.700867 0,-0.408201 0.2926867,-0.700934 l 2.2567399,-2.256734 -5.4223399,0 q\n      -0.4005134,0 -0.6508334,-0.288798 -0.25032,-0.288868 -0.25032,-0.697068 l 0,-0.9858663 q 0,-0.4082 0.25032,\n      -0.6970668 0.25032,-0.2887998 0.6508334,-0.2887998 l 5.4223399,0 L 7.3967524,5.2567334 Q 7.1040657,4.9794667\n      7.1040657,4.5635333 q 0,-0.4159334 0.2926867,-0.6932 L 7.9744123,3.2926666 Q 8.267099,3 8.6676124,3 9.0758256,3\n      9.3685123,3.2926666 L 14.382632,8.3067999 Q 14.667614,8.5764 14.667614,9 Z\" />");
}
exports.push = push;

},{}],4:[function(require,module,exports){
/**
 *  Misc Helpers
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses URL into its components
 * @param  {string} url
 */
function parseUrl(url) {
    var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    var matches = url.match(pattern);
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
    if (parseFn === void 0) { parseFn = identity; }
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
/** Fallback dummy function - just maintains the type */
function identity(source) {
    return source;
}
function toString(source) {
    if (typeof source["toString"] === "function") {
        return source.toString();
    }
    else {
        throw TypeError("Can't convert type ${typeof source} to string");
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
    var filter = function (n) { return (n >= 0); };
    return parseToNumber(input, filter);
}
exports.parseNonNegative = parseNonNegative;
function parsePositive(input) {
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
    return misc_1.roundNumber(millis, 3) + " ms";
}
exports.formatMilliseconds = formatMilliseconds;
var secondsPerMinute = 60;
var secondsPerHour = 60 * secondsPerMinute;
var secondsPerDay = 24 * secondsPerHour;
function formatSeconds(seconds) {
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
    return date.toUTCString() + "</br>(local time: " + date.toLocaleString() + ")";
}
exports.formatDateLocalized = formatDateLocalized;
var bytesPerKB = 1024;
var bytesPerMB = 1024 * bytesPerKB;
function formatBytes(bytes) {
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
        options[name] = toInt(options[name]);
        if (options[name] === undefined) {
            throw TypeError("option \"" + name + "\" needs to be a number");
        }
    };
    var ensureBoolean = function (name) {
        options[name] = !!options[name];
    };
    validateInt("leftColumnWith");
    validateInt("rowHeight");
    validateInt("selectedPage");
    ensureBoolean("showAlignmentHelpers");
    ensureBoolean("showIndicatorIcons");
    ensureBoolean("showMimeTypeIcon");
    return options;
}
exports.validateOptions = validateOptions;

},{"./misc":4}],6:[function(require,module,exports){
/**
 *  SVG Helpers
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("./dom");
function entries(obj) {
    var entries = [];
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var k = _a[_i];
        entries.push([k, String((obj[k]))]);
    }
    return entries;
}
function safeSetAttribute(el, key, s) {
    if (!(key in el)) {
        console.warn(new Error("Trying to set non-existing attribute " + key + " = " + s + " on a <" + el.tagName.toLowerCase() + ">."));
    }
    el.setAttributeNS(null, key, s);
}
function safeSetStyle(el, key, s) {
    if (key in el.style) {
        el.style[key] = s;
    }
    else {
        console.warn(new Error("Trying to set non-existing style " + key + " = " + s + " on a <" + el.tagName.toLowerCase() + ">."));
    }
}
function newElement(tagName, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.attributes, attributes = _c === void 0 ? {} : _c, _d = _b.css, css = _d === void 0 ? {} : _d, _e = _b.text, text = _e === void 0 ? "" : _e, _f = _b.className, className = _f === void 0 ? "" : _f;
    var element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    if (className) {
        dom_1.addClass(element, className);
    }
    if (text) {
        element.textContent = text;
    }
    entries(css).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return safeSetStyle(element, key, value);
    });
    entries(attributes).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return safeSetAttribute(element, key, value);
    });
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
function newForeignObject(attributes) {
    return newElement("foreignObject", { attributes: attributes });
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
    return newElement("title", { text: text });
}
exports.newTitle = newTitle;
function newTextEl(text, attributes, css) {
    if (attributes === void 0) { attributes = {}; }
    if (css === void 0) { css = {}; }
    return newElement("text", { text: text, attributes: attributes, css: css });
}
exports.newTextEl = newTextEl;
/** temp SVG element for size measurements  */
var getTestSVGEl = (function () {
    /** Reference to Temp SVG element for size measurements */
    var svgTestEl;
    var removeSvgTestElTimeout;
    return function () {
        // lazy init svgTestEl
        if (svgTestEl === undefined) {
            var attributes = {
                "className": "water-fall-chart temp",
                "width": "9999px",
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
    // make sure to turn of shadow for performance
    tmpTextNode.style.textShadow = "0";
    window.document.body.appendChild(tmp);
    return tmpTextNode.getBBox().width;
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("./helpers/parse");
var legend_1 = require("./legend/legend");
var paging_1 = require("./paging/paging");
var HarTransformer = require("./transformers/har");
var svg_chart_1 = require("./waterfall/svg-chart");
/** default options to use if not set in `options` parameter */
var defaultChartOptions = {
    leftColumnWith: 25,
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

},{"./helpers/parse":5,"./legend/legend":7,"./paging/paging":9,"./transformers/har":13,"./waterfall/svg-chart":26}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../helpers/dom");
/** Class to keep track of run of a multi-run har is beeing shown  */
var Paging = (function () {
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
var byteSizeProperty = function (title, input) {
    return [title, parse_1.parseAndFormat(input, parse_1.parsePositive, parse_1.formatBytes)];
};
var countProperty = function (title, input) {
    return [title, parse_1.parseAndFormat(input, parse_1.parsePositive)];
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
    ].filter(function (k) { return k[1] !== undefined && k[1] !== ""; });
}
function parseRequestDetails(harEntry) {
    var request = harEntry.request;
    var stringHeader = function (name) { return [name, har_1.getHeader(request.headers, name)]; };
    return [
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
    ].filter(function (k) { return k[1] !== undefined && k[1] !== ""; });
}
function parseResponseDetails(entry) {
    var response = entry.response;
    var content = response.content;
    var headers = response.headers;
    var stringHeader = function (title, name) {
        if (name === void 0) { name = title; }
        return [title, har_1.getHeader(headers, name)];
    };
    var dateHeader = function (name) {
        var header = har_1.getHeader(headers, name);
        return [name, parse_1.parseAndFormat(header, parse_1.parseDate, parse_1.formatDateLocalized)];
    };
    var contentLength = har_1.getHeader(headers, "Content-Length");
    var contentSize = undefined;
    if (content.size !== -1 && contentLength !== content.size.toString()) {
        contentSize = content.size;
    }
    var contentType = har_1.getHeader(headers, "Content-Type");
    if (entry._contentType && entry._contentType !== contentType) {
        contentType = contentType + " | " + entry._contentType;
    }
    return [
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
    ];
}
function parseTimings(entry, start, end) {
    var timings = entry.timings;
    var optionalTiming = function (timing) { return parse_1.parseAndFormat(timing, parse_1.parseNonNegative, parse_1.formatMilliseconds); };
    var total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
    return [
        ["Total", parse_1.formatMilliseconds(total)],
        ["Blocked", optionalTiming(timings.blocked)],
        ["DNS", optionalTiming(timings.dns)],
        ["Connect", optionalTiming(timings.connect)],
        ["SSL (TLS)", optionalTiming(timings.ssl)],
        ["Send", parse_1.formatMilliseconds(timings.send)],
        ["Wait", parse_1.formatMilliseconds(timings.wait)],
        ["Receive", parse_1.formatMilliseconds(timings.receive)],
    ];
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
        "general": parseGeneralDetails(entry, startRelative, requestID),
        "request": parseRequestDetails(entry),
        "requestHeaders": requestHeaders.map(headerToKvTuple),
        "response": parseResponseDetails(entry),
        "responseHeaders": responseHeaders.map(headerToKvTuple),
        "timings": parseTimings(entry, startRelative, endRelative),
    };
}
exports.getKeys = getKeys;

},{"../helpers/har":2,"../helpers/parse":5}],11:[function(require,module,exports){
/**
 * Heuristics used at parse-time for HAR data
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var har_1 = require("../helpers/har");
var misc = require("../helpers/misc");
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
    if (entry.request.method.toLowerCase() !== "get") {
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
function isPush(entry) {
    function toInt(input) {
        if (typeof input === "string") {
            return parseInt(input, 10);
        }
        else {
            return input;
        }
    }
    return toInt(entry._was_pushed) === 1;
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
function collectIndicators(entry, docIsTLS, requestType) {
    // const harEntry = entry;
    var output = [];
    if (isPush(entry)) {
        output.push({
            description: "Response was pushed by the server using HTTP2 push.",
            icon: "push",
            id: "push",
            title: "Response was pushed by the server",
            type: "info",
        });
    }
    if (docIsTLS && !isSecure(entry)) {
        output.push({
            description: "Insecure request, it should use HTTPS.",
            id: "noTls",
            title: "Insecure Connection",
            type: "error",
        });
    }
    if (hasCacheIssue(entry)) {
        output.push({
            description: "The response is not allow to be cached on the client. Consider setting 'Cache-Control' headers.",
            id: "noCache",
            title: "Response not cached",
            type: "error",
        });
    }
    if (hasCompressionIssue(entry, requestType)) {
        output.push({
            description: "The response is not compressed. Consider enabling HTTP compression on your server.",
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
            id: "warning",
            title: "No MIME Type defined",
            type: "warning",
        });
    }
    return output;
}
exports.collectIndicators = collectIndicators;

},{"../helpers/har":2,"../helpers/misc":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("../helpers/parse");
var extract_details_keys_1 = require("./extract-details-keys");
var helpers_1 = require("./helpers");
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
    return tabs.filter(function (t) { return t !== undefined; });
}
exports.makeTabs = makeTabs;
/** Helper to create `WaterfallEntryTab` object literal  */
function makeWaterfallEntryTab(title, content, tabClass) {
    if (tabClass === void 0) { tabClass = ""; }
    return {
        title: title,
        content: content,
        tabClass: tabClass,
    };
}
/** Helper to create `WaterfallEntryTab` object literal that is evaluated lazyly at runtime (e.g. for performance) */
function makeLazyWaterfallEntryTab(title, renderContent, tabClass) {
    if (tabClass === void 0) { tabClass = ""; }
    return {
        title: title,
        renderContent: renderContent,
        tabClass: tabClass,
    };
}
/** General tab with warnings etc. */
function makeGeneralTab(generalData, indicators) {
    var content = helpers_1.makeDefinitionList(generalData);
    if (indicators.length === 0) {
        return makeWaterfallEntryTab("General", content);
    }
    var general = "<h2>General</h2>\n    <dl>" + content + "<dl>";
    content = "";
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
        content += "<h2 class=\"no-boder\">Error" + (errors.length > 1 ? "s" : "") + "</h2>\n    <dl>" + helpers_1.makeDefinitionList(errors) + "</dl>";
    }
    if (warnings.length > 0) {
        content += "<h2 class=\"no-boder\">Warning" + (warnings.length > 1 ? "s" : "") + "</h2>\n    <dl>" + helpers_1.makeDefinitionList(warnings) + "</dl>";
    }
    if (info.length > 0) {
        content += "<h2 class=\"no-boder\">Info</h2>\n    <dl>" + helpers_1.makeDefinitionList(info) + "</dl>";
    }
    makeWaterfallEntryTab("General", content + general);
}
function makeRequestTab(request, requestHeaders) {
    var content = "<dl>\n      " + helpers_1.makeDefinitionList(request) + "\n    </dl>\n    <h2>All Request Headers</h2>\n    <dl>\n      " + helpers_1.makeDefinitionList(requestHeaders) + "\n    </dl>";
    return makeWaterfallEntryTab("Request", content);
}
function makeResponseTab(respose, responseHeaders) {
    var content = "<dl>\n      " + helpers_1.makeDefinitionList(respose) + "\n    </dl>\n    <h2>All Response Headers</h2>\n    <dl>\n      " + helpers_1.makeDefinitionList(responseHeaders) + "\n    </dl>";
    return makeWaterfallEntryTab("Response", content);
}
function makeRawData(entry) {
    // const content = `<pre><code>${escapeHtml(JSON.stringify(entry, null, 2))}</code></pre>`;
    return makeLazyWaterfallEntryTab("Raw Data", function () { return "<pre><code>" + parse_1.escapeHtml(JSON.stringify(entry, null, 2)) + "</code></pre>"; }, "raw-data");
}
/** Image preview tab */
function makeImgTab(entry) {
    return makeLazyWaterfallEntryTab("Preview", function (detailsHeight) { return "<img class=\"preview\" style=\"max-height:" + (detailsHeight - 100) + "px\"\n data-src=\"" + entry.request.url + "\" />"; });
}

},{"../helpers/parse":5,"./extract-details-keys":10,"./helpers":14}],13:[function(require,module,exports){
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
    var _this = this;
    // make sure it's the *.log base node
    var data = (harData["log"] !== undefined ? harData["log"] : harData);
    var pages = getPages(data);
    return {
        pages: pages.map(function (_page, i) { return _this.transformPage(data, i, options); }),
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
    var indicators = har_heuristics_1.collectIndicators(entry, isTLS, requestType);
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
 * @param {HarTransformerOptions} options - HAR-parser-specific options
 * @returns WaterfallData
 */
function transformPage(harData, pageIndex, options) {
    if (pageIndex === void 0) { pageIndex = 0; }
    // make sure it's the *.log base node
    var data = (harData["log"] !== undefined ? harData["log"] : harData);
    var pages = getPages(data);
    var currPage = pages[pageIndex];
    var pageStartTime = new Date(currPage.startedDateTime).getTime();
    var pageTimings = currPage.pageTimings;
    var doneTime = 0;
    var isTLS = har_heuristics_1.documentIsSecure(data.entries);
    var entries = data.entries
        .filter(function (entry) {
        // filter inline data
        if (entry.request.url.indexOf("data:") === 0) {
            return false;
        }
        if (pages.length === 1 && currPage.id === "") {
            return true;
        }
        return entry.pageref === currPage.id;
    })
        .map(function (entry, index) {
        var startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime;
        doneTime = Math.max(doneTime, startRelative + entry.time);
        return toWaterFallEntry(entry, index, startRelative, isTLS);
    });
    var marks = getMarks(pageTimings, currPage, options);
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
 * @param {HarTransformerOptions} options - HAR-parser-specific options
 */
var getMarks = function (pageTimings, currPage, options) {
    var sortFn = function (a, b) { return a.startTime - b.startTime; };
    var marks = Object.keys(pageTimings)
        .filter(function (k) { return (typeof pageTimings[k] === "number" && pageTimings[k] >= 0); })
        .map(function (k) { return ({
        name: k.replace(/^[_]/, "") + " (" + misc_1.roundNumber(pageTimings[k], 0) + " ms)",
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
 * @param {HarTransformerOptions} options - HAR-parser-specific options
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
        var name;
        var fullName;
        var duration;
        _a = findName.exec(k), fullName = _a[1], name = _a[2];
        if (fullName !== name && currPage["_userTime.endTimer-" + name]) {
            duration = currPage["_userTime.endTimer-" + name] - currPage[k];
            return {
                name: (options.showUserTimingEndMarker ? fullName : name) + " (" + currPage[k] + " - " + (currPage[k] + duration) + " ms)",
                duration: duration,
                startTime: currPage[k],
            };
        }
        return {
            name: fullName,
            startTime: currPage[k],
        };
        var _a;
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
    return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce(function (collect, key) {
        var time = getTimePair(key, harEntry, collect, startRelative);
        if (time.end && time.start >= time.end) {
            return collect;
        }
        // special case for 'connect' && 'ssl' since they share time
        // http://www.softwareishard.com/blog/har-12-spec/#timings
        if (key === "connect" && t["ssl"] && t["ssl"] !== -1) {
            var sslStart = parseInt(harEntry["_ssl_start"], 10) || time.start;
            var sslEnd = parseInt(harEntry["_ssl_end"], 10) || time.start + t.ssl;
            var connectStart = (!!parseInt(harEntry["_ssl_start"], 10)) ? time.start : sslEnd;
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
        "end": Math.round(end),
        "start": Math.round(start),
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
    return {
        icon: helpers_1.makeMimeTypeIcon(entry.response.status, entry.response.statusText, requestType, entry.response.redirectURL),
        rowClass: helpers_1.makeRowCssClasses(entry.response.status),
        indicators: indicators,
        requestType: requestType,
        statusCode: entry.response.status,
    };
};

},{"../helpers/misc":4,"../helpers/parse":5,"./har-heuristics":11,"./har-tabs":12,"./helpers":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Helpers that are not file-fromat specific */
var misc_1 = require("../helpers/misc");
var parse_1 = require("../helpers/parse");
var svg_indicators_1 = require("../waterfall/row/svg-indicators");
/** render a dl */
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
        .filter(function (tuple) { return tuple[1] !== undefined; })
        .map(function (tuple) { return "\n      <dt " + makeClass(tuple[0]) + ">" + tuple[0] + "</dt>\n      <dd>" + parse_1.escapeHtml(tuple[1]) + "</dd>\n    "; }).join("");
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
    var total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
    return {
        total: total,
        url: url,
        start: start,
        end: end,
        segments: segments,
        responseDetails: responseDetails,
        tabs: tabs,
    };
}
exports.createWaterfallEntry = createWaterfallEntry;
/** helper to create a `WaterfallEntryTiming` */
function createWaterfallEntryTiming(type, start, end) {
    var total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
    return {
        total: total,
        type: type,
        start: start,
        end: end,
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
        return svg_indicators_1.makeIcon("err3xx", status + " response status: Redirect to " + url + "...");
    }
    else if (misc_1.isInStatusCodeRange(status, 400, 499)) {
        return svg_indicators_1.makeIcon("err4xx", status + " response status: " + statusText);
    }
    else if (misc_1.isInStatusCodeRange(status, 500, 599)) {
        return svg_indicators_1.makeIcon("err5xx", status + " response status: " + statusText);
    }
    else if (status === 204) {
        return svg_indicators_1.makeIcon("plain", "No content");
    }
    else {
        return svg_indicators_1.makeIcon(requestType, requestType);
    }
}
exports.makeMimeTypeIcon = makeMimeTypeIcon;

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
function createDetailsBody(requestID, detailsHeight, entry) {
    var html = document.createElement("html");
    var body = document.createElement("body");
    body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");
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
    body.innerHTML = "\n    <div class=\"wrapper\">\n      <header class=\"type-" + entry.responseDetails.requestType + "\">\n        <h3><strong>#" + requestID + "</strong> <a href=\"" + entry.url + "\">" + entry.url + "</a></h3>\n        <nav class=\"tab-nav\">\n        <ul>\n          " + tabMenu + "\n        </ul>\n        </nav>\n      </header>\n      " + tabBody + "\n    </div>\n    ";
    html.appendChild(body);
    return html;
}
exports.createDetailsBody = createDetailsBody;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../helpers/dom");
var svg_details_overlay_1 = require("./svg-details-overlay");
/** Overlay (popup) instance manager */
var OverlayManager = (function () {
    // TODO: move `overlayHolder` to constructor
    function OverlayManager(context, overlayHolder) {
        this.context = context;
        this.overlayHolder = overlayHolder;
        /** Collection of currely open overlays */
        this.openOverlays = [];
    }
    /** all open overlays height combined */
    OverlayManager.prototype.getCombinedOverlayHeight = function () {
        return this.openOverlays.reduce(function (pre, curr) { return pre + curr.height; }, 0);
    };
    /**
     * Opens an overlay - rerenders others internaly
     */
    OverlayManager.prototype.openOverlay = function (index, y, detailsHeight, entry, barEls) {
        if (this.openOverlays.some(function (o) { return o.index === index; })) {
            return;
        }
        var self = this;
        this.openOverlays.push({
            "defaultY": y,
            "entry": entry,
            "index": index,
            "onClose": function () {
                self.closeOverlay(index, detailsHeight, barEls);
            },
            "openTabIndex": 0,
        });
        this.renderOverlays(detailsHeight);
        this.context.pubSub.publishToOverlayChanges({
            "combinedOverlayHeight": self.getCombinedOverlayHeight(),
            "openOverlays": self.openOverlays,
            "type": "open",
        });
        this.realignBars(barEls);
    };
    /**
     * Toggles an overlay - rerenders others
     */
    OverlayManager.prototype.toggleOverlay = function (index, y, detailsHeight, entry, barEls) {
        if (this.openOverlays.some(function (o) { return o.index === index; })) {
            this.closeOverlay(index, detailsHeight, barEls);
        }
        else {
            this.openOverlay(index, y, detailsHeight, entry, barEls);
        }
    };
    /**
     * closes on overlay - rerenders others internally
     */
    OverlayManager.prototype.closeOverlay = function (index, detailsHeight, barEls) {
        var self = this;
        this.openOverlays.splice(this.openOverlays.reduce(function (prev, curr, i) {
            return (curr.index === index) ? i : prev;
        }, -1), 1);
        this.renderOverlays(detailsHeight);
        this.context.pubSub.publishToOverlayChanges({
            "combinedOverlayHeight": self.getCombinedOverlayHeight(),
            "openOverlays": self.openOverlays,
            "type": "closed",
        });
        this.realignBars(barEls);
    };
    /**
     * sets the offset for request-bars
     * @param  {SVGGElement[]} barEls
     */
    OverlayManager.prototype.realignBars = function (barEls) {
        var _this = this;
        barEls.forEach(function (bar, j) {
            var offset = _this.getOverlayOffset(j);
            bar.style.transform = "translate(0, " + offset + "px)";
        });
    };
    /** y offset to it's default y position */
    OverlayManager.prototype.getOverlayOffset = function (rowIndex) {
        return this.openOverlays.reduce(function (col, overlay) {
            if (overlay.index < rowIndex) {
                return col + overlay.height;
            }
            return col;
        }, 0);
    };
    /**
     * removes all overlays and renders them again
     *
     * @summary this is to re-set the "y" position since there is a bug in chrome with
     * tranform of an SVG and positioning/scoll of a foreignObjects
     * @param  {number} detailsHeight
     * @param  {SVGGElement} overlayHolder
     */
    OverlayManager.prototype.renderOverlays = function (detailsHeight) {
        var _this = this;
        dom_1.removeChildren(this.overlayHolder);
        var currY = 0;
        this.openOverlays
            .sort(function (a, b) { return a.index > b.index ? 1 : -1; })
            .forEach(function (overlay) {
            var y = overlay.defaultY + currY;
            var infoOverlay = svg_details_overlay_1.createRowInfoOverlay(overlay, y, detailsHeight);
            // if overlay has a preview image show it
            var previewImg = infoOverlay.querySelector("img.preview");
            if (previewImg && !previewImg.src) {
                previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value);
            }
            _this.overlayHolder.appendChild(infoOverlay);
            var currHeight = infoOverlay.getBoundingClientRect().height;
            currY += currHeight;
            overlay.actualY = y;
            overlay.height = currHeight;
            return overlay;
        });
    };
    return OverlayManager;
}());
exports.default = OverlayManager;
;

},{"../../helpers/dom":1,"./svg-details-overlay":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PubSub = (function () {
    function PubSub() {
        this.subscribers = [];
    }
    PubSub.prototype.subscribeToOverlayChanges = function (fn) {
        this.subscribers.push(fn);
    };
    PubSub.prototype.publishToOverlayChanges = function (change) {
        this.subscribers.forEach(function (fn) { return fn(change); });
    };
    return PubSub;
}());
exports.default = PubSub;
;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svg = require("../../helpers/svg");
var html_details_body_1 = require("./html-details-body");
function forEach(els, fn) {
    Array.prototype.forEach.call(els, fn);
}
exports.forEach = forEach;
function createCloseButtonSvg(y) {
    var closeBtn = svg.newA("info-overlay-close-btn");
    closeBtn.appendChild(svg.newRect({
        "height": 23,
        "width": 23,
        "x": "100%",
        "y": y,
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
    var innerHolder = svg.newG("info-overlay-holder");
    var bg = svg.newRect({
        "height": detailsHeight,
        "rx": 2,
        "ry": 2,
        "width": "100%",
        "x": "0",
        "y": y,
    }, "info-overlay");
    innerHolder.appendChild(bg);
    return innerHolder;
}
function createRowInfoOverlay(overlay, y, detailsHeight) {
    var requestID = overlay.index + 1;
    var wrapper = svg.newG("outer-info-overlay-holder");
    var holder = createHolder(y, detailsHeight);
    var foreignObject = svg.newForeignObject({
        "height": detailsHeight,
        "width": "100%",
        "x": "0",
        "y": y,
    });
    var closeBtn = createCloseButtonSvg(y);
    closeBtn.addEventListener("click", function () { return overlay.onClose(overlay.index); });
    var body = html_details_body_1.createDetailsBody(requestID, detailsHeight, overlay.entry);
    var buttons = body.getElementsByClassName("tab-button");
    var tabs = body.getElementsByClassName("tab");
    var setTabStatus = function (tabIndex) {
        overlay.openTabIndex = tabIndex;
        forEach(tabs, function (tab, j) {
            tab.style.display = (tabIndex === j) ? "block" : "none";
            buttons.item(j).classList.toggle("active", (tabIndex === j));
        });
    };
    forEach(buttons, function (btn, tabIndex) {
        btn.addEventListener("click", function () { return setTabStatus(tabIndex); });
    });
    setTabStatus(overlay.openTabIndex);
    foreignObject.appendChild(body);
    holder.appendChild(foreignObject);
    holder.appendChild(closeBtn);
    wrapper.appendChild(holder);
    return wrapper;
}
exports.createRowInfoOverlay = createRowInfoOverlay;

},{"../../helpers/svg":6,"./html-details-body":16}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convinience helper to create a new `Icon`
 *
 * _Width of icons is fixed_
 */
function makeIcon(type, title) {
    return { "type": type, "title": title, "width": 20 };
}
exports.makeIcon = makeIcon;
/**
 * Gets the Indicators in Icon format
 * @param  {WaterfallEntry} entry
 * @returns {Icon[]}
 */
function getIndicatorIcons(entry) {
    var indicators = entry.responseDetails.indicators;
    if (indicators.length === 0) {
        return [];
    }
    var combinedTitle = [];
    var icon = "";
    var errors = indicators.filter(function (i) { return i.type === "error"; });
    var warnings = indicators.filter(function (i) { return i.type === "warning"; });
    var info = indicators.filter(function (i) { return i.type !== "error" && i.type !== "warning"; });
    if (errors.length > 0) {
        combinedTitle.push("Error" + (errors.length > 1 ? "s" : "") + ":\n" + errors.map(function (e) { return e.title; }).join("\n"));
        icon = "error";
    }
    if (warnings.length > 0) {
        combinedTitle.push("Warning" + (warnings.length > 1 ? "s" : "") + ":\n" + warnings.map(function (w) { return w.title; }).join("\n"));
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

},{}],21:[function(require,module,exports){
/**
 * Creation of sub-components used in a ressource request row
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc = require("../../helpers/misc");
var svg = require("../../helpers/svg");
var styling_converters_1 = require("../../transformers/styling-converters");
/**
 * Creates the `rect` that represent the timings in `rectData`
 * @param  {RectData} rectData - Data for block
 * @param  {string} className - className for block `rect`
 */
function makeBlock(rectData, className) {
    var blockHeight = rectData.height - 1;
    var rect = svg.newRect({
        "height": blockHeight,
        "width": misc.roundNumber(rectData.width / rectData.unit) + "%",
        "x": misc.roundNumber(rectData.x / rectData.unit) + "%",
        "y": rectData.y,
    }, className);
    if (rectData.label) {
        rect.appendChild(svg.newTitle(rectData.label)); // Add tile to wedge path
    }
    if (rectData.showOverlay && rectData.hideOverlay) {
        rect.addEventListener("mouseenter", rectData.showOverlay(rectData));
        rect.addEventListener("mouseleave", rectData.hideOverlay(rectData));
    }
    return rect;
}
/**
 * Converts a segment to RectData
 * @param  {WaterfallEntryTiming} segment
 * @param  {RectData} rectData
 * @returns RectData
 */
function segmentToRectData(segment, rectData) {
    return {
        "cssClass": styling_converters_1.timingTypeToCssClass(segment.type),
        "height": (rectData.height - 6),
        "hideOverlay": rectData.hideOverlay,
        "label": segment.type + " (" + Math.round(segment.start) + "ms - "
            + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
        "showOverlay": rectData.showOverlay,
        "unit": rectData.unit,
        "width": segment.total,
        "x": segment.start || 0.001,
        "y": rectData.y,
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
        txtEl = svg.newTextEl(totalLabel, { x: misc.roundNumber(percStart) + "%", y: y }, { "textAnchor": "end" });
    }
    return txtEl;
}
/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {WaterfallEntryTiming[]} segments Request and Timing Data
 * @param  {number} timeTotal  - total time of the request
 * @return {SVGElement}                Renerated SVG (rect or g element)
 */
function createRect(rectData, segments, timeTotal) {
    var rect = makeBlock(rectData, "time-block " + rectData.cssClass);
    var rectHolder = svg.newG("rect-holder");
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
    var labelHolder = svg.newG("full-label");
    labelHolder.appendChild(svg.newRect({
        "height": height - 4,
        "rx": 5,
        "ry": 5,
        "width": svg.getNodeTextWidth(blockLabel),
        "x": x - 3,
        "y": y + 3,
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
    var className = isEven ? "even" : "odd";
    return svg.newRect({
        "height": height,
        "width": "100%",
        "x": 0,
        "y": y,
    }, className);
}
exports.createBgStripe = createBgStripe;
function createNameRowBg(y, rowHeight, onClick) {
    var rowFixed = svg.newG("row row-fixed");
    rowFixed.appendChild(svg.newRect({
        "height": rowHeight,
        "width": "100%",
        "x": "0",
        "y": y,
    }, "", {
        "opacity": 0,
    }));
    rowFixed.addEventListener("click", onClick);
    return rowFixed;
}
exports.createNameRowBg = createNameRowBg;
function createRowBg(y, rowHeight, onClick) {
    var rowFixed = svg.newG("row row-flex");
    rowFixed.appendChild(svg.newRect({
        "height": rowHeight,
        "width": "100%",
        "x": "0",
        "y": y,
    }, "", {
        "opacity": 0,
    }));
    rowFixed.addEventListener("click", onClick);
    return rowFixed;
}
exports.createRowBg = createRowBg;

},{"../../helpers/misc":4,"../../helpers/svg":6,"../../transformers/styling-converters":15}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var icons = require("../../helpers/icons");
var misc = require("../../helpers/misc");
var svg = require("../../helpers/svg");
var svg_indicators_1 = require("./svg-indicators");
var rowSubComponents = require("./svg-row-subcomponents");
// initial clip path
var clipPathElProto = svg.newClipPath("titleClipPath");
clipPathElProto.appendChild(svg.newRect({
    "height": "100%",
    "width": "100%",
}));
var ROW_LEFT_MARGIN = 3;
// Create row for a single request
function createRow(context, index, maxIconsWidth, maxNumberWidth, rectData, entry, onDetailsOverlayShow) {
    var y = rectData.y;
    var rowHeight = rectData.height;
    var leftColumnWith = context.options.leftColumnWith;
    var rowItem = svg.newG(entry.responseDetails.rowClass);
    var leftFixedHolder = svg.newSvg("left-fixed-holder", {
        "width": leftColumnWith + "%",
        "x": "0",
    });
    var flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
        "width": 100 - leftColumnWith + "%",
        "x": leftColumnWith + "%",
    });
    var rect = rowSubComponents.createRect(rectData, entry.segments, entry.total);
    var rowName = rowSubComponents.createNameRowBg(y, rowHeight, onDetailsOverlayShow);
    var rowBar = rowSubComponents.createRowBg(y, rowHeight, onDetailsOverlayShow);
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
    var shortLabel = rowSubComponents.createRequestLabelClipped(x, y, misc.resourceUrlFormatter(entry.url, 40), rowHeight);
    var fullLabel = rowSubComponents.createRequestLabelFull(x, y, entry.url, rowHeight);
    // create and attach request block
    rowBar.appendChild(rect);
    rowSubComponents.appendRequestLabels(rowName, requestNumberLabel, shortLabel, fullLabel);
    flexScaleHolder.appendChild(rowBar);
    leftFixedHolder.appendChild(clipPathElProto.cloneNode(true));
    leftFixedHolder.appendChild(rowName);
    rowItem.appendChild(bgStripe);
    rowItem.appendChild(flexScaleHolder);
    rowItem.appendChild(leftFixedHolder);
    return rowItem;
}
exports.createRow = createRow;

},{"../../helpers/icons":3,"../../helpers/misc":4,"../../helpers/svg":6,"./svg-indicators":20,"./svg-row-subcomponents":21}],23:[function(require,module,exports){
/**
 * vertical alignment helper lines
 */
"use strict";
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
            "x1": "0",
            "x2": "0",
            "y1": "0",
            "y2": diagramHeight,
        }, "line-end"),
        startline: svg.newLine({
            "x1": "0",
            "x2": "0",
            "y1": "0",
            "y2": diagramHeight,
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

},{"../../helpers/dom":1,"../../helpers/svg":6}],24:[function(require,module,exports){
/**
 * Creation of sub-components of the waterfall chart
 */
"use strict";
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
    if (addLabel) {
        var showTextBefore = (sec > secsTotal - 0.2);
        lineClass = "second-line";
        var x_1 = misc_1.roundNumber(secPerc * sec) + 0.5 + "%";
        var css = {};
        if (showTextBefore) {
            x_1 = misc_1.roundNumber(secPerc * sec) - 0.5 + "%";
            css["text-anchor"] = "end";
        }
        lineLabel = svg.newTextEl(sec + "s", { x: x_1, y: diagramHeight }, css);
    }
    var x = misc_1.roundNumber(secPerc * sec) + "%";
    var lineEl = svg.newLine({
        "x1": x,
        "x2": x,
        "y1": 0,
        "y2": diagramHeight,
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

},{"../../helpers/misc":4,"../../helpers/svg":6}],25:[function(require,module,exports){
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
        "transform": "scale(1, 1)",
    });
    marks.forEach(function (mark, i) {
        var x = misc_1.roundNumber(mark.startTime / context.unit);
        var markHolder = svg.newG("mark-holder type-" + mark.name.toLowerCase().replace(/([0-9]+[ ]?ms)|\W/g, ""));
        var lineHolder = svg.newG("line-holder");
        var lineLabelHolder = svg.newG("line-label-holder");
        var lineLabel = svg.newTextEl(mark.name, { x: x + "%", y: diagramHeight + 25 });
        var lineRect;
        mark.x = x;
        var line = svg.newLine({
            "x1": x + "%",
            "x2": x + "%",
            "y1": 0,
            "y2": diagramHeight,
        });
        var lastMark = marks[i - 1];
        var minDistance = 2.5; // minimum distance between marks
        if (lastMark && mark.x - lastMark.x < minDistance) {
            lineLabel.setAttribute("x", lastMark.x + minDistance + "%");
            mark.x = lastMark.x + minDistance;
        }
        // would use polyline but can't use percentage for points
        var lineConnection = svg.newLine({
            "x1": x + "%",
            "x2": mark.x + "%",
            "y1": diagramHeight,
            "y2": diagramHeight + 23,
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
        "height": context.diagramHeight,
        "width": ((entry.duration || 1) / context.unit) + "%",
        "x": ((entry.startTime || 0.001) / context.unit) + "%",
        "y": 0,
    }, "line-mark"));
    return holder;
}
exports.createLineRect = createLineRect;

},{"../../helpers/dom":1,"../../helpers/misc":4,"../../helpers/svg":6}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svg = require("../helpers/svg");
var styling_converters_1 = require("../transformers/styling-converters");
var overlay_manager_1 = require("./details-overlay/overlay-manager");
var pub_sub_1 = require("./details-overlay/pub-sub");
var row = require("./row/svg-row");
var alignmentHelper = require("./sub-components/svg-alignment-helper");
var generalComponents = require("./sub-components/svg-general-components");
var marks = require("./sub-components/svg-marks");
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
function createContext(data, options, entriesToShow, overlayHolder) {
    var unit = data.durationMs / 100;
    var diagramHeight = (entriesToShow.length + 1) * options.rowHeight;
    var context = {
        diagramHeight: diagramHeight,
        overlayManager: undefined,
        pubSub: new pub_sub_1.default(),
        unit: unit,
        options: options,
    };
    // `overlayManager` needs the `context` reference, so it's attached later
    context.overlayManager = new overlay_manager_1.default(context, overlayHolder);
    return context;
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
    var context = createContext(data, options, entriesToShow, overlayHolder);
    /** full height of the SVG chart in px */
    var chartHolderHeight = getSvgHeight(data.marks, context.diagramHeight);
    /** Main SVG Element that holds all data */
    var timeLineHolder = svg.newSvg("water-fall-chart", {
        "height": chartHolderHeight,
    });
    /** Holder for scale, event and marks */
    var scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
        "width": 100 - options.leftColumnWith + "%",
        "x": options.leftColumnWith + "%",
    });
    /** Holds all rows */
    var rowHolder = svg.newG("rows-holder");
    /** Holder for on-hover vertical comparison bars */
    var hoverOverlayHolder;
    var mouseListeners;
    if (options.showAlignmentHelpers) {
        hoverOverlayHolder = svg.newG("hover-overlays");
        var hoverEl = alignmentHelper.createAlignmentLines(context.diagramHeight);
        hoverOverlayHolder.appendChild(hoverEl.startline);
        hoverOverlayHolder.appendChild(hoverEl.endline);
        mouseListeners = alignmentHelper.makeHoverEvtListeners(hoverEl);
    }
    // Start appending SVG elements to the holder element (timeLineHolder)
    scaleAndMarksHolder.appendChild(generalComponents.createTimeScale(context, data.durationMs));
    scaleAndMarksHolder.appendChild(marks.createMarks(context, data.marks));
    // This assumes all icons (mime and indicators) have the same width
    var perIconWidth = entriesToShow[0].responseDetails.icon.width;
    var maxIcons = 0;
    if (options.showMimeTypeIcon) {
        maxIcons += 1;
    }
    if (options.showIndicatorIcons) {
        var iconsPerBlock = entriesToShow.map(function (entry) {
            return entry.responseDetails.indicators.length > 0 ? 1 : 0;
        });
        maxIcons += Math.max.apply(null, iconsPerBlock);
    }
    var maxIconsWidth = maxIcons * perIconWidth;
    var widestRequestNumber = getWidestDigitString(entriesToShow.length);
    var maxNumberWidth = svg.getNodeTextWidth(svg.newTextEl("" + widestRequestNumber), true);
    var barEls = [];
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
            "cssClass": styling_converters_1.requestTypeToCssClass(entry.responseDetails.requestType),
            "height": options.rowHeight,
            "hideOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseLeavePartial : undefined,
            "label": entry.url + " (" + Math.round(entry.start) + "ms - " +
                (Math.round(entry.end) + "ms | total: " + Math.round(entry.total) + "ms)"),
            "showOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseEnterPartial : undefined,
            "unit": context.unit,
            "width": entryWidth,
            "x": x,
            "y": y,
        };
        var showDetailsOverlay = function () {
            context.overlayManager.toggleOverlay(i, y + options.rowHeight, detailsHeight, entry, barEls);
        };
        var rowItem = row.createRow(context, i, maxIconsWidth, maxNumberWidth, rectData, entry, showDetailsOverlay);
        barEls.push(rowItem);
        rowHolder.appendChild(rowItem);
    }
    // Main loop to render rows with blocks
    entriesToShow.forEach(renderRow);
    if (options.showAlignmentHelpers) {
        scaleAndMarksHolder.appendChild(hoverOverlayHolder);
    }
    timeLineHolder.appendChild(scaleAndMarksHolder);
    timeLineHolder.appendChild(rowHolder);
    timeLineHolder.appendChild(overlayHolder);
    return timeLineHolder;
}
exports.createWaterfallSvg = createWaterfallSvg;

},{"../helpers/svg":6,"../transformers/styling-converters":15,"./details-overlay/overlay-manager":17,"./details-overlay/pub-sub":18,"./row/svg-row":22,"./sub-components/svg-alignment-helper":23,"./sub-components/svg-general-components":24,"./sub-components/svg-marks":25}]},{},[8])(8)
});