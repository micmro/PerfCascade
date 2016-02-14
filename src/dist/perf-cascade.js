/*PerfCascade build:14/02/2016 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *  DOM Helpers
 */
var dom = {
    removeAllChildren: function (el) {
        while (el.childNodes.length > 0) {
            el.removeChild(el.childNodes[0]);
        }
    },
    forEach: function (els, fn) {
        Array.prototype.forEach.call(els, fn);
    },
    filter: function (els, predicat) {
        return Array.prototype.filter.call(els, predicat);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dom;

},{}],2:[function(require,module,exports){
/**
 *  SVG Icons
 */
var toSvg = function (x, y, title, className, scale, svgDoc) {
    var parser = new DOMParser();
    var doc = parser.parseFromString("<svg x=\"" + x + "\" y=\"" + y + "\" xmlns=\"http://www.w3.org/2000/svg\">\n    <g class=\"icon " + className + "\" transform=\"scale(" + scale + ")\">\n      " + svgDoc + "\n      <title>" + title + "</title>\n    </g>\n  </svg>", "image/svg+xml");
    return doc.firstChild;
};
var icons = {
    lock: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-lock", scale, "<g>\n    <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0 \n      C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n      C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n  </g>\n  <path fill=\"#A452A0\" d=\"M13,8V6.5C13,5,12,3,9,3S5,5,5,6.5V8H4v7h10V8H13z M10,12.5c0,0.3-0.7,0.5-1,0.5s-1-0.2-1-0.5v-2\n    C8,10.2,8.7,10,9,10s1,0.2,1,0.5V12.5z M11,8H7V6.5C7,5.7,7.5,5,9,5s2,0.7,2,1.5V8z\"/>");
    },
    noTls: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-no-tls", scale, "<g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <path fill=\"#414042\" d=\"M13,8V6.5C13,5,12,3,9,3S5,5,5,6.5V8H4v7h10V8H13z M10,12.5c0,0.3-0.7,0.5-1,0.5s-1-0.2-1-0.5v-2\n        C8,10.2,8.7,10,9,10s1,0.2,1,0.5V12.5z M11,8H7V6.5C7,5.7,7.5,5,9,5s2,0.7,2,1.5V8z\"/>\n    <line fill=\"#CC6666\" stroke=\"#CC6666\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"15\" x2=\"15\" y2=\"3\"/>");
    },
    err3xx: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-redirect", scale, "<g>\n        <path fill=\"#F9EF66\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5\n            L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <polygon fill=\"#414042\" points=\"9,5 9,10 12,7.5 \"/>\n    <polyline fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" points=\"9,7.5 4.5,7.5 4.5,11.5 13,11.5 \"/>\n    <path fill=\"#414042\" d=\"M11,10\"/>");
    },
    err4xx: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-4xx", scale, "<g>\n        <path fill=\"#F16062\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n        <path fill=\"#FFFFFF\" d=\"M5.6,14v-1.7H3.1v-0.8l2.6-4.6h0.6v4.6h0.8v0.8H6.3V14H5.6z M5.6,11.5V8.3l-1.8,3.2H5.6z\"/>\n        <path fill=\"#FFFFFF\" d=\"M7.5,14L9,11.3L7.6,8.8h0.9L9.1,10c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8l-1.4,2.4\n            l1.5,2.7h-0.9l-0.9-1.6L9.4,12l-1.1,2H7.5z\"/>\n        <path fill=\"#FFFFFF\" d=\"M11.5,14l1.5-2.7l-1.4-2.5h0.9l0.6,1.2c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8\n            l-1.4,2.4l1.5,2.7h-0.9l-0.9-1.6L13.4,12l-1.1,2H11.5z\"/>\n    </g>");
    },
    err5xx: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-5xx", scale, " <g>\n        <path fill=\"#F16061\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E6E7E8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n        <path fill=\"#FFFFFF\" d=\"M3.3,12.1L4.1,12c0.1,0.4,0.2,0.8,0.4,1c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.6-0.2,0.9-0.5s0.4-0.7,0.4-1.3\n            c0-0.5-0.1-0.9-0.3-1.2S5.5,10,5.2,10c-0.2,0-0.4,0.1-0.6,0.2c-0.2,0.1-0.3,0.3-0.4,0.5l-0.7-0.1L4,6.9h2.8v0.8H4.6L4.3,9.7\n            C4.6,9.4,5,9.3,5.3,9.3c0.5,0,0.9,0.2,1.3,0.6c0.3,0.4,0.5,1,0.5,1.7c0,0.6-0.2,1.2-0.5,1.7c-0.4,0.6-0.9,0.9-1.5,0.9\n            c-0.5,0-0.9-0.2-1.3-0.5S3.4,12.7,3.3,12.1z\"/>\n        <path fill=\"#FFFFFF\" d=\"M7.5,14L9,11.3L7.6,8.8h0.9L9.1,10c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8l-1.4,2.4\n            l1.5,2.7h-0.9l-0.9-1.6L9.4,12l-1.1,2H7.5z\"/>\n        <path fill=\"#FFFFFF\" d=\"M11.5,14l1.5-2.7l-1.4-2.5h0.9l0.6,1.2c0.1,0.2,0.2,0.4,0.3,0.6c0.1-0.2,0.2-0.4,0.3-0.6l0.7-1.2h0.8\n            l-1.4,2.4l1.5,2.7h-0.9l-0.9-1.6L13.4,12l-1.1,2H11.5z\"/>\n    </g>");
    },
    noCache: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-no-cache", scale, "<g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n        <path fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" d=\"M5,7v4.5C5,12.3,6.8,13,9,13s4-0.7,4-1.5V7H5z\"/>\n        <path fill=\"#FFFFFF\" stroke=\"#414042\" stroke-miterlimit=\"10\" d=\"M9,8c1.7,0,3.2-0.4,3.8-1C12.9,6.8,13,6.7,13,6.5\n            C13,5.7,11.2,5,9,5S5,5.7,5,6.5C5,6.7,5.1,6.8,5.2,7C5.8,7.6,7.3,8,9,8z\"/>\n    </g>\n    <line fill=\"#CC6666\" stroke=\"#CC6666\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"15\" x2=\"15\" y2=\"3\"/>");
    },
    noGzip: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-no-gzip", scale, "<g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n            C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n            C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <rect x=\"7.5\" y=\"2\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"9\" y=\"3\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"7.5\" y=\"4\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"9\" y=\"5\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <rect x=\"7.5\" y=\"6\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <polygon fill=\"#414042\" points=\"10,15 8,15 7,14 7,10 8,8 10,8 11,10 11,14   \"/>\n    <polygon fill=\"#FFFFFF\" points=\"9,13.5 9,13.5 8,13 8,11.5 10,11.5 10,13     \"/>\n    <rect x=\"9\" y=\"7\" fill=\"#414042\" width=\"1.5\" height=\"1\"/>\n    <line fill=\"#CC6666\" stroke=\"#CC6666\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"15\" x2=\"15\" y2=\"3\"/>");
    },
    plain: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-plain", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#B3B4B4\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"4.5\" x2=\"15\" y2=\"4.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"6.5\" x2=\"13\" y2=\"6.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"8.5\" x2=\"15\" y2=\"8.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"10.5\" x2=\"10\" y2=\"10.5\"/>\n      <line fill=\"none\" stroke=\"#414042\" stroke-miterlimit=\"10\" x1=\"3\" y1=\"12.5\" x2=\"15\" y2=\"12.5\"/>\n    </g>");
    },
    other: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-other", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#B3B4B4\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path fill=\"#414042\" d=\"M11.8,7c0,0.4-0.1,0.7-0.2,1c-0.1,0.3-0.3,0.5-0.4,0.7C11,8.8,10.8,9,10.5,9.2C10.3,9.3,10,9.5,9.6,9.6\n          v1.2H7.8V9.1C8,9,8.2,8.9,8.5,8.8c0.2-0.1,0.5-0.2,0.6-0.3C9.3,8.3,9.5,8.2,9.6,8c0.1-0.2,0.2-0.4,0.2-0.7c0-0.4-0.1-0.6-0.3-0.8\n          S8.9,6.3,8.5,6.3c-0.3,0-0.6,0.1-1,0.2C7.2,6.7,6.9,6.8,6.8,6.9H6.6V5.3c0.2-0.1,0.6-0.2,1-0.3S8.5,4.8,9,4.8\n          c0.5,0,0.8,0.1,1.2,0.2c0.3,0.1,0.6,0.3,0.9,0.4c0.2,0.2,0.4,0.4,0.5,0.7C11.8,6.4,11.8,6.6,11.8,7z M9.8,13H7.7v-1.4h2.1V13z\"/>\n      </g>\n    </g>");
    },
    javascript: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-js", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5\n          L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E0B483\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path fill=\"#414042\" d=\"M7.6,11.8c0,0.3-0.1,0.6-0.2,0.9s-0.3,0.5-0.5,0.7c-0.2,0.2-0.5,0.4-0.8,0.5S5.4,13.9,5,13.9\n          c-0.3,0-0.6,0-0.9,0s-0.5-0.1-0.7-0.1v-1.4h0.2c0.1,0.1,0.3,0.1,0.4,0.2c0.2,0,0.4,0.1,0.6,0.1c0.3,0,0.5,0,0.7-0.1\n          c0.2-0.1,0.3-0.2,0.4-0.4c0.1-0.2,0.1-0.3,0.1-0.5s0-0.4,0-0.7V8.1H4.2V6.8h3.4V11.8z\"/>\n        <path fill=\"#414042\" d=\"M11.1,13.9c-0.5,0-1-0.1-1.4-0.2c-0.4-0.1-0.8-0.2-1.1-0.4v-1.7h0.2c0.4,0.3,0.7,0.5,1.2,0.7\n          c0.4,0.2,0.8,0.2,1.2,0.2c0.1,0,0.2,0,0.4,0s0.3-0.1,0.4-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.1-0.1,0.1-0.2,0.1-0.4\n          c0-0.2-0.1-0.3-0.2-0.4s-0.3-0.2-0.5-0.2c-0.2-0.1-0.5-0.1-0.8-0.2c-0.3-0.1-0.5-0.1-0.8-0.2c-0.5-0.2-0.9-0.4-1.2-0.8\n          S8.6,9.4,8.6,8.9c0-0.7,0.3-1.2,0.8-1.6c0.6-0.4,1.2-0.6,2.1-0.6c0.4,0,0.8,0,1.2,0.1c0.4,0.1,0.8,0.2,1.1,0.3v1.6h-0.2\n          c-0.3-0.2-0.6-0.4-0.9-0.6C12.4,8,12,8,11.6,8c-0.2,0-0.3,0-0.4,0c-0.1,0-0.2,0.1-0.4,0.1c-0.1,0.1-0.2,0.1-0.3,0.2\n          s-0.1,0.2-0.1,0.3c0,0.2,0.1,0.3,0.2,0.4c0.1,0.1,0.4,0.2,0.7,0.3c0.2,0.1,0.5,0.1,0.7,0.2s0.4,0.1,0.7,0.2\n          c0.5,0.2,0.8,0.4,1.1,0.7c0.2,0.3,0.4,0.7,0.4,1.2c0,0.7-0.3,1.3-0.8,1.7S12,13.9,11.1,13.9z\"/>\n      </g>\n    </g>");
    },
    image: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-image", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#B294C5\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <polygon points=\"2.6,14 8.2,9.9 12,11.4 15,8.2 15,14 \t\"/>\n      <circle cx=\"6.6\" cy=\"5.8\" r=\"1.8\"/>\n    </g>");
    },
    html: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-html", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5\n          L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#82A7D8\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path d=\"M7.9,6.5l-2.2,6.9H4.6l2.2-6.9H7.9z\"/>\n        <path d=\"M14,10.2l-4.7,2v-1l3.3-1.3L9.3,8.4v-1l4.7,2V10.2z\"/>\n      </g>\n    </g>");
    },
    css: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-css", scale, "<g>\n      <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n        C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      <path fill=\"none\" stroke=\"#A6D08E\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n        C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n    </g>\n    <g>\n      <path d=\"M7.8,13.7h-1c-0.5,0-0.9-0.1-1.2-0.4c-0.3-0.3-0.4-0.6-0.4-1.1v-0.6c0-0.4-0.1-0.8-0.3-0.9s-0.5-0.3-1-0.3H3.6V9.5h0.3\n        c0.5,0,0.8-0.1,1-0.3C5.1,9,5.2,8.7,5.2,8.2V7.6c0-0.5,0.1-0.9,0.4-1.1c0.3-0.3,0.7-0.4,1.2-0.4h1V7H7.4C7.3,7,7.1,7,7,7\n        C6.9,7,6.8,7.1,6.7,7.1C6.6,7.2,6.5,7.3,6.5,7.4c0,0.1-0.1,0.3-0.1,0.5v0.4c0,0.4-0.1,0.7-0.3,0.9S5.6,9.8,5.2,9.9V10\n        c0.4,0.1,0.6,0.3,0.9,0.6s0.3,0.6,0.3,0.9v0.4c0,0.2,0,0.4,0.1,0.5c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.3,0.1\n        c0.1,0,0.3,0,0.4,0h0.4V13.7z\"/>\n      <path d=\"M14.3,10.4h-0.3c-0.5,0-0.8,0.1-1,0.3c-0.2,0.2-0.3,0.5-0.3,0.9v0.6c0,0.5-0.1,0.9-0.4,1.1c-0.3,0.3-0.7,0.4-1.2,0.4h-1\n        v-0.9h0.4c0.2,0,0.3,0,0.4,0c0.1,0,0.2-0.1,0.3-0.1c0.1-0.1,0.2-0.2,0.2-0.3c0-0.1,0.1-0.3,0.1-0.5v-0.4c0-0.4,0.1-0.7,0.3-0.9\n        s0.5-0.4,0.9-0.6V9.9c-0.4-0.1-0.6-0.3-0.9-0.6s-0.3-0.6-0.3-0.9V7.9c0-0.2,0-0.4-0.1-0.5c0-0.1-0.1-0.2-0.2-0.3\n        C11.2,7.1,11.1,7,10.9,7c-0.1,0-0.3,0-0.4,0h-0.4V6.1h1c0.5,0,0.9,0.1,1.2,0.4c0.3,0.3,0.4,0.6,0.4,1.1v0.6c0,0.4,0.1,0.8,0.3,0.9\n        c0.2,0.2,0.5,0.3,1,0.3h0.3V10.4z\"/>\n    </g>");
    },
    warning: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-warning", scale, "<g>\n          <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n              C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n          <path fill=\"none\" stroke=\"#CC6666\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n              C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <path fill=\"#414042\" d=\"M9,3L3,14h12L9,3z M10,13H8v-1h2V13z M9.5,11h-1L8,10V7l0.5-1h1L10,7v3L9.5,11z\"/>");
    },
    font: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-font", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5\n          L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#E15D4E\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1h13C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n      <g>\n        <path fill=\"#414042\" d=\"M3.8,10l-0.6,0.6C3.1,10.3,3.1,10,3.1,9.8c0-0.6,0.3-1.2,0.8-1.6c0.5-0.3,1.3-0.5,2.4-0.5\n          c0.2,0,0.4,0,0.5,0c0.4,0,0.6,0,0.6,0h0.3c-0.2,0.3-0.3,1-0.3,1.9l0,0.2l0,0.4c0,0.5,0.1,1.1,0.2,1.7c0.1,0.2,0.1,0.4,0.2,0.4\n          c0,0.1,0.1,0.1,0.3,0.1c0.1,0,0.3,0,0.5-0.1c0,0,0,0.1,0,0.1c0,0.1-0.1,0.1-0.2,0.2l-0.2,0.1l-1,0.4c-0.2-0.7-0.3-1.3-0.4-2.1\n          l-0.3,0.2H5.2c-0.2,0.6-0.6,1-1,1.3l0.8,0l-0.4,0.4L3.1,13l0.5-0.5l0.4,0c0.2-0.1,0.3-0.3,0.5-0.5s0.3-0.7,0.6-1.4l0.1-0.3\n          c0.2-0.7,0.5-1.1,0.7-1.4s0.5-0.5,0.9-0.7C6.3,8.1,5.8,8.1,5.4,8.1c-1.2,0-1.7,0.4-1.7,1.2C3.7,9.5,3.7,9.7,3.8,10z M6.8,10.9\n          c0-0.5-0.1-0.8-0.1-1.1c0-0.1,0-0.3,0-0.4l0-0.5c0-0.3,0-0.5,0.1-0.7C6.4,8.6,6,9.2,5.6,10.2c-0.1,0.3-0.1,0.4-0.2,0.5l-0.1,0.2\n          H6.8z\"/>\n        <path fill=\"#414042\" d=\"M9.8,10.9c0.3-0.5,0.6-0.9,0.9-1.2s0.6-0.5,0.9-0.5c0.4,0,0.6,0.3,0.6,1c0,0.8-0.2,1.4-0.7,2\n          c-0.5,0.6-1.1,0.8-1.8,0.8c-0.1,0-0.2,0-0.2,0l-0.3,0c0,0-0.1,0-0.1,0C9,12.8,9,12.6,9,12.4L9.4,9c0.1-0.8,0.4-1.5,0.9-2.1\n          s1.1-0.9,1.7-0.9c0.1,0,0.3,0,0.4,0l-0.6,0.6c-0.1,0-0.3-0.1-0.4-0.1c-0.8,0-1.2,0.6-1.4,1.8L9.8,10.9z M9.6,12.5\n          c0.2,0.1,0.5,0.2,0.7,0.2c0.4,0,0.6-0.2,0.9-0.6c0.2-0.4,0.3-1,0.3-1.6c0-0.4-0.1-0.6-0.3-0.6c-0.2,0-0.5,0.2-0.8,0.5\n          c-0.4,0.5-0.7,1-0.7,1.7L9.6,12.5z\"/>\n        <path fill=\"#414042\" d=\"M15.4,9.4l-0.4,0.5c-0.2-0.1-0.4-0.1-0.6-0.1c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.3-0.3,0.7-0.3,1.2\n          c0,0.4,0.1,0.6,0.2,0.9c0.1,0.2,0.3,0.3,0.6,0.3c0.4,0,0.7-0.3,0.9-0.8c0.1,0.1,0.1,0.1,0.1,0.2c0,0.2-0.2,0.5-0.5,0.7\n          c-0.3,0.3-0.6,0.4-0.9,0.4c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.8c0-0.7,0.2-1.3,0.7-1.8c0.5-0.6,1-0.8,1.5-0.8\n          C15,9.3,15.2,9.3,15.4,9.4z\"/>\n      </g>\n    </g>");
    },
    flash: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        return toSvg(x, y, title, "icon-flash", scale, "<g>\n      <g>\n        <path fill=\"#FFFFFF\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0\n          C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n        <path fill=\"none\" stroke=\"#42AAB1\" stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M17,15.5c0,0.8-0.7,1.5-1.5,1.5h-13\n          C1.7,17,1,16.3,1,15.5v-13C1,1.7,1.7,1,2.5,1l13,0C16.3,1,17,1.7,17,2.5L17,15.5z\"/>\n      </g>\n    </g>\n    <path fill=\"#414042\" d=\"M13.1,6.2c-2.1-0.1-2.9,2.3-2.9,2.3h1.7l0,2.1l-2.5,0C8.8,11.9,7.6,15,4,15c0-0.1,0-1.8,0-2.1\n      c2.1-0.1,3.2-2.4,3.7-4.1c1.4-4.1,3.5-4.6,5.3-4.8V6.2z\"/>");
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = icons;

},{}],3:[function(require,module,exports){
/**
 *  Misc Helpers
 */
var misc = {
    parseUrl: function parseUrl(url) {
        var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
        var matches = url.match(pattern);
        return {
            scheme: matches[2],
            authority: matches[4],
            path: matches[5],
            query: matches[7],
            fragment: matches[9]
        };
    },
    contains: function contains(arr, item) {
        return arr.filter(function (x) { return x === item; }).length > 0;
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = misc;

},{}],4:[function(require,module,exports){
/**
 *  SVG Helpers
 */
var svg = {
    newEl: function (tagName, settings, css) {
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
    },
    newSvg: function (cssClass, settings, css) {
        settings = settings || {};
        settings["class"] = cssClass;
        return svg.newEl("svg:svg", settings, css);
    },
    newG: function (cssClass, settings, css) {
        settings = settings || {};
        settings["class"] = cssClass;
        return svg.newEl("g", settings, css);
    },
    newTextEl: function (text, y, x, css) {
        css = css || {};
        var opt = {
            fill: "#111",
            y: y.toString(),
            text: text
        };
        if (x !== undefined) {
            opt["x"] = x;
        }
        if (css["textShadow"] === undefined) {
            css["textShadow"] = "0 0 4px #fff";
        }
        return svg.newEl("text", opt, css);
    },
    //needs access to body to measure size
    //TODO: refactor for server side use
    getNodeTextWidth: function (textNode) {
        var tmp = svg.newEl("svg:svg", {}, {
            "visibility": "hidden"
        });
        tmp.appendChild(textNode);
        window.document.body.appendChild(tmp);
        var nodeWidth = textNode.getBBox().width;
        tmp.parentNode.removeChild(tmp);
        return nodeWidth;
    },
    addClass: function (el, className) {
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
            el.setAttribute("class", el.getAttribute("class") + " " + className);
        }
        return el;
    },
    removeClass: function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            //IE doesn't support classList in SVG - also no need for dublication check i.t.m.
            el.setAttribute("class", el.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
        }
        return el;
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = svg;

},{}],5:[function(require,module,exports){
var svg_chart_1 = require("./waterfall/svg-chart");
var dom_1 = require("./helpers/dom");
var har_1 = require("./transformers/har");
function showErrorMsg(msg) {
    alert(msg);
}
var outputHolder = document.getElementById("output");
function renderHar(logData) {
    var data = har_1.default.transfrom(logData);
    dom_1.default.removeAllChildren(outputHolder);
    outputHolder.appendChild(svg_chart_1.createWaterfallSvg(data, (window.innerWidth > 920 ? 250 : 200), 23));
}
function onFileSubmit(evt) {
    var files = evt.target.files;
    if (!files) {
        showErrorMsg("Failed to load HAR file");
        return;
    }
    var reader = new FileReader();
    reader.onload = (function (e) {
        var harData;
        try {
            //TODO: add proper check for HAR files and later other formats
            harData = JSON.parse(e.target["result"]);
        }
        catch (e) {
            showErrorMsg("File does not seem to be a valid HAR file");
            return undefined;
        }
        renderHar(harData.log);
    });
    reader.readAsText(files[0]);
}
document.getElementById("fileinput").addEventListener("change", onFileSubmit, false);
//TODO: remove Dev/Test only - load test file
if (location.host.indexOf("127.0.0.1") === 0) {
    //http://www.webpagetest.org/result/151226_X7_b43d35e592fab70e0ba012fe11a41020/
    window["fetch"]("test-data/github.com.MODIFIED.151226_X7_b43d35e592fab70e0ba012fe11a41020.har")
        .then(function (f) { return f.json().then(function (j) { return renderHar(j.log); }); });
}

},{"./helpers/dom":1,"./transformers/har":6,"./waterfall/svg-chart":9}],6:[function(require,module,exports){
var time_block_1 = require("../typing/time-block");
var styling_converters_1 = require("./styling-converters");
var HarTransformer = (function () {
    function HarTransformer() {
    }
    HarTransformer.transfrom = function (data) {
        var _this = this;
        console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length);
        //only support one page (first) for now
        var currentPageIndex = 0;
        var currPage = data.pages[currentPageIndex];
        var pageStartTime = new Date(currPage.startedDateTime).getTime();
        var pageTimings = currPage.pageTimings;
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
                "name": k.replace(/^[_]/, ""),
                "startTime": startRelative
            };
        });
        return {
            durationMs: doneTime,
            blocks: blocks,
            marks: marks,
            lines: [],
        };
    };
    HarTransformer.buildDetailTimingBlocks = function (startRelative, entry) {
        var _this = this;
        var t = entry.timings;
        // var timings = []
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
        var start = preciseStart || ((collect.length > 0) ? collect[collect.length - 1].end : startRelative);
        var end = preciseEnd || (start + entry.timings[key]);
        return {
            "start": start,
            "end": end
        };
    };
    return HarTransformer;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HarTransformer;

},{"../typing/time-block":8,"./styling-converters":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeBlock;

},{}],9:[function(require,module,exports){
var svg_1 = require("../helpers/svg");
var icons_1 = require("../helpers/icons");
var misc_1 = require("../helpers/misc");
var svg_general_components_1 = require("./svg-general-components");
var svg_row_components_1 = require("./svg-row-components");
var svg_details_overlay_1 = require("./svg-details-overlay");
var svg_indicators_1 = require("./svg-indicators");
var dom_1 = require("../helpers/dom");
/**
 * Function to format the shortened URL
 * @param  {string} url       URL of ressource
 * @param  {number} maxLength maximal
 * @return {string}           [description]
 */
function ressourceUrlFormater(url) {
    var maxLength = 40;
    if (url.length < maxLength) {
        return url.replace(/http[s]\:\/\//, "");
    }
    var matches = misc_1.default.parseUrl(url);
    if ((matches.authority + matches.path).length < maxLength) {
        return matches.authority + matches.path;
    }
    var p = matches.path.split("/");
    return matches.authority + "…/" + p[p.length - 1];
}
/**
 * Calculate the height of the SVG chart in px
 * @param {any[]}       marks      [description]
 * @param {TimeBlock[]} barsToShow [description]
 */
function getSvgHeight(marks, barsToShow, diagramHeight) {
    var maxMarkTextLength = marks.reduce(function (currMax, currValue) {
        return Math.max(currMax, svg_1.default.getNodeTextWidth(svg_1.default.newTextEl(currValue.name, 0)));
    }, 0);
    return diagramHeight + maxMarkTextLength + 35;
}
/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data  Object containing the setup parameter
 * @param {leftFixedWidth} number     Width of the url and highlight rule column in pixel
 * @param {requestBarHeight} number   Height of every request bar block plus spacer pixel
 * @return {SVGSVGElement}            SVG Element ready to render
 */
function createWaterfallSvg(data, leftFixedWidth, requestBarHeight) {
    //constants
    if (leftFixedWidth === void 0) { leftFixedWidth = 250; }
    if (requestBarHeight === void 0) { requestBarHeight = 23; }
    /** horizontal unit (duration in ms of 1%) */
    var unit = data.durationMs / 100;
    var barsToShow = data.blocks
        .filter(function (block) { return (typeof block.start === "number" && typeof block.total === "number"); })
        .sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
    /** height of the requests part of the diagram in px */
    var diagramHeight = (barsToShow.length + 1) * requestBarHeight;
    /** full height of the SVG chart in px */
    var chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight);
    var docIsSsl = (data.blocks[0].name.indexOf("https://") === 0);
    //Main holder
    var timeLineHolder = svg_1.default.newSvg("water-fall-chart", {
        "height": Math.floor(chartHolderHeight)
    }, {
        "paddingLeft": leftFixedWidth + "px"
    });
    //Other holder elements
    var leftFixedHolder = svg_1.default.newSvg("left-fixed-holder", {
        "x": "-" + leftFixedWidth,
        "width": leftFixedWidth
    });
    var flexScaleHolder = svg_1.default.newSvg("flex-scale-waterfall");
    var hoverOverlayHolder = svg_1.default.newG("hover-overlays");
    var overlayHolder = svg_1.default.newG("overlays");
    var bgStripesHolder = svg_1.default.newG("bg-stripes");
    var clipPathEl = svg_1.default.newEl("clipPath", {
        "id": "titleClipPath"
    });
    clipPathEl.appendChild(svg_1.default.newEl("rect", {
        "width": leftFixedWidth,
        "height": "100%"
    }));
    leftFixedHolder.appendChild(clipPathEl);
    var hoverEl = svg_general_components_1.createAlignmentLines(diagramHeight);
    hoverOverlayHolder.appendChild(hoverEl.startline);
    hoverOverlayHolder.appendChild(hoverEl.endline);
    var mouseListeners = svg_general_components_1.makeHoverEvtListeners(hoverEl);
    //Start appending SVG elements to the holder element (timeLineHolder)
    flexScaleHolder.appendChild(svg_general_components_1.createTimeScale(data.durationMs, diagramHeight));
    flexScaleHolder.appendChild(svg_general_components_1.createMarks(data.marks, unit, diagramHeight));
    data.lines.forEach(function (block, i) {
        timeLineHolder.appendChild(svg_general_components_1.createBgRect(block, unit, diagramHeight));
    });
    //calculate x position for label based on number of icons
    var labelXPos = barsToShow.reduce(function (prev, curr) {
        var i = svg_indicators_1.getIndicators(curr, docIsSsl);
        var lastIndicator = i[i.length - 1];
        var x = (!!lastIndicator ? (lastIndicator.x + lastIndicator.x / Math.max(i.length - 1, 1)) : 0);
        return Math.max(prev, x);
    }, 5);
    //Main loop to render rows with blocks
    barsToShow.forEach(function (block, i) {
        var blockWidth = block.total || 1;
        var y = requestBarHeight * i;
        var x = (block.start || 0.001);
        var rectData = {
            "width": blockWidth,
            "height": requestBarHeight,
            "x": x,
            "y": y,
            "cssClass": block.cssClass,
            "label": block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)",
            "unit": unit,
            "showOverlay": mouseListeners.onMouseEnterPartial,
            "hideOverlay": mouseListeners.onMouseLeavePartial
        };
        var rect = svg_row_components_1.createRect(rectData, block.segments);
        var shortLabel = svg_row_components_1.createRequestLabelClipped(labelXPos, y, ressourceUrlFormater(block.name), requestBarHeight, "clipPath");
        var fullLabel = svg_row_components_1.createRequestLabelFull(labelXPos, y, block.name, requestBarHeight);
        var infoOverlay = svg_details_overlay_1.createRowInfoOverlay(i + 1, x, y + requestBarHeight, block, leftFixedWidth, unit);
        var showOverlay = function (evt) {
            dom_1.default.removeAllChildren(overlayHolder);
            overlayHolder.appendChild(infoOverlay);
        };
        var rowFixed = svg_row_components_1.createFixedRow(y, requestBarHeight, showOverlay, leftFixedWidth);
        var rowFlex = svg_row_components_1.createFlexRow(y, requestBarHeight, showOverlay);
        //create and attach request block
        rowFlex.appendChild(rect);
        //Add create and add warnings 
        svg_indicators_1.getIndicators(block, docIsSsl).forEach(function (value) {
            rowFixed.appendChild(icons_1.default[value.type](value.x, y + 3, value.title));
        });
        svg_row_components_1.appendRequestLabels(rowFixed, shortLabel, fullLabel);
        flexScaleHolder.appendChild(rowFlex);
        leftFixedHolder.appendChild(rowFixed);
        bgStripesHolder.appendChild(svg_row_components_1.createBgStripe(y, requestBarHeight, leftFixedWidth, (i % 2 === 0)));
    });
    flexScaleHolder.appendChild(hoverOverlayHolder);
    timeLineHolder.appendChild(bgStripesHolder);
    timeLineHolder.appendChild(flexScaleHolder);
    timeLineHolder.appendChild(leftFixedHolder);
    timeLineHolder.appendChild(overlayHolder);
    return timeLineHolder;
}
exports.createWaterfallSvg = createWaterfallSvg;

},{"../helpers/dom":1,"../helpers/icons":2,"../helpers/misc":3,"../helpers/svg":4,"./svg-details-overlay":10,"./svg-general-components":11,"./svg-indicators":12,"./svg-row-components":13}],10:[function(require,module,exports){
var svg_1 = require("../helpers/svg");
var dom_1 = require("../helpers/dom");
function createCloseButtonSvg(y) {
    var closeBtn = svg_1.default.newEl("a", {
        "class": "info-overlay-close-btn"
    });
    closeBtn.appendChild(svg_1.default.newEl("rect", {
        "width": 25,
        "height": 25,
        "x": "100%",
        "y": y,
        "rx": 5,
        "ry": 5
    }));
    closeBtn.appendChild(svg_1.default.newEl("text", {
        "width": 25,
        "height": 25,
        "x": "100%",
        "y": y,
        "dx": 9,
        "dy": 17,
        "fill": "#111",
        "text": "X",
        "textAnchor": "middle"
    }));
    closeBtn.appendChild(svg_1.default.newEl("title", {
        "text": "Close Overlay"
    }));
    return closeBtn;
}
function createHolder(y, leftFixedWidth) {
    var holder = svg_1.default.newEl("g", {
        "class": "info-overlay-holder",
        "transform": "translate(-" + leftFixedWidth + ")"
    });
    var bg = svg_1.default.newEl("rect", {
        "width": "100%",
        "height": 350,
        "x": "0",
        "y": y,
        "rx": 2,
        "ry": 2,
        "class": "info-overlay"
    });
    holder.appendChild(bg);
    return holder;
}
function getKeys(requestID, block) {
    //TODO: dodgy casting - will not work for other adapters
    var entry = block.rawResource;
    var ifValueDefined = function (value, fn) {
        if (typeof value !== "number" || value <= 0) {
            return undefined;
        }
        return fn(value);
    };
    var formatBytes = function (size) { return ifValueDefined(size, function (s) {
        return (s + " byte (~" + Math.round(s / 1024 * 10) / 10 + "kb)");
    }); };
    var formatTime = function (size) { return ifValueDefined(size, function (s) {
        return (s + "ms");
    }); };
    var getRequestHeader = function (name) {
        var header = entry.request.headers.filter(function (h) { return h.name.toLowerCase() === name.toLowerCase(); })[0];
        return header ? header.value : "";
    };
    var getResponseHeader = function (name) {
        var header = entry.response.headers.filter(function (h) { return h.name.toLowerCase() === name.toLowerCase(); })[0];
        return header ? header.value : "";
    };
    /** get experimental feature */
    var getExp = function (name) {
        return entry[name] || "";
    };
    return {
        "general": {
            "Request Number": "#" + requestID,
            "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page reqest started)",
            "Duration": formatTime(entry.time),
            "Status": entry.response.status + " " + entry.response.statusText,
            "Server IPAddress": entry.serverIPAddress,
            "Connection": entry.connection,
            "Browser Priority": getExp("_priority"),
            "Initiator": getExp("_initiator"),
            "Initiator Line": getExp("_initiator_line"),
            "Expires": getExp("_expires"),
            "Cache Time": getExp("_cache_time"),
            "CDN Provider": getExp("_cdn_provider"),
            "Gzip Total": getExp("_gzip_total"),
            "Minify Total": getExp("_minify_total"),
            "Minify Save": getExp("_minify_save"),
            "Image Total": getExp("_image_total"),
            "Image Save": getExp("_image_save")
        },
        "request": {
            "Method": entry.request.method,
            "HTTP Version": entry.request.httpVersion,
            "Headers Size": formatBytes(entry.request.headersSize),
            "Body Size": formatBytes(entry.request.bodySize),
            "Comment": entry.request.comment,
            "User-Agent": getRequestHeader("User-Agent"),
            "Host": getRequestHeader("Host"),
            "Connection": getRequestHeader("Connection"),
            "Accept": getRequestHeader("Accept"),
            "Accept-Encoding": getRequestHeader("Accept-Encoding"),
            "Accept-Language": getRequestHeader("Accept-Language"),
            "Authorization": getRequestHeader("Authorization"),
            "Expect": getRequestHeader("Expect"),
            "Forwarded": getRequestHeader("Forwarded"),
            "If-Modified-Since": getRequestHeader("If-Modified-Since"),
            "If-Range": getRequestHeader("If-Range"),
            "If-Unmodified-Since": getRequestHeader("If-Unmodified-Since"),
            "Via": getRequestHeader("Via"),
            "Warning": getRequestHeader("Warning"),
            "X-Forwarded-For	": getRequestHeader("X-Forwarded-For	"),
            "X-Forwarded-Host": getRequestHeader("X-Forwarded-Host"),
            "Front-End-Https": getRequestHeader("Front-End-Https"),
            "Querystring parameters count": entry.request.queryString.length,
            "Cookies count": entry.request.cookies.length
        },
        "response": {
            "Status": entry.response.status + " " + entry.response.statusText,
            "HTTP Version": entry.response.httpVersion,
            "Header Size": formatBytes(entry.response.headersSize),
            "Body Size": formatBytes(entry.response.bodySize),
            "Content-Type": getResponseHeader("Content-Type"),
            "Cache-Control": getResponseHeader("Cache-Control"),
            "Content-Encoding": getResponseHeader("Content-Encoding"),
            "Expires": getResponseHeader("Expires"),
            "Last-Modified": getResponseHeader("Last-Modified"),
            "Pragma": getResponseHeader("Pragma"),
            "Server": getResponseHeader("Server"),
            "Timing-Allow-Origin": getResponseHeader("Timing-Allow-Origin"),
            "Content-Length": getResponseHeader("Content-Length"),
            "Content Size": entry.response.content.size,
            "Content Compression": entry.response.content.compression,
            "Connection": getResponseHeader("Connection"),
            "X-Served-By": getResponseHeader("X-Served-By"),
            "Redirect URL": entry.response.redirectURL,
            "ETag": getResponseHeader("ETag"),
            "Date": getResponseHeader("Date"),
            "Access-Control-Allow-Origin": getResponseHeader("Access-Control-Allow-Origin"),
            "Accept-Patch": getResponseHeader("Accept-Patch"),
            "Accept-Ranges": getResponseHeader("Accept-Ranges"),
            "Age": getResponseHeader("Age"),
            "Allow": getResponseHeader("Allow"),
            "Content-Disposition": getResponseHeader("Content-Disposition"),
            "Location": getResponseHeader("Location"),
            "Proxy-Authenticate": getResponseHeader("Proxy-Authenticate"),
            "Retry-After": getResponseHeader("Retry-After"),
            "Set-Cookie": getResponseHeader("Set-Cookie"),
            "Strict-Transport-Security": getResponseHeader("Strict-Transport-Security"),
            "Trailer (for chunked transfer coding)": getResponseHeader("Trailer"),
            "Transfer-Encoding": getResponseHeader("Transfer-Encoding"),
            "TSV (Tracking Status Value)": getResponseHeader("TSV"),
            "Upgrade": getResponseHeader("Upgrade"),
            "Vary": getResponseHeader("Vary"),
            "Via": getResponseHeader("Via"),
            "Warning": getResponseHeader("Warning"),
            "X-XSS-Protection": getResponseHeader("X-XSS-Protection"),
            "Content-Security-Policy": getResponseHeader("Content-Security-Policy"),
            "X-Content-Security-Policy": getResponseHeader("X-Content-Security-Policy"),
            "X-WebKit-CSP": getResponseHeader("X-WebKit-CSP"),
            "X-Content-Type-Options": getResponseHeader("X-Content-Type-Options"),
            "X-UA-Compatible": getResponseHeader("X-UA-Compatible"),
            "Upgrade-Insecure-Requests": getResponseHeader("Upgrade-Insecure-Requests"),
            "Comment": entry.response.comment
        }
    };
}
function makeDefinitionList(dlKeyValues) {
    return Object.keys(dlKeyValues)
        .filter(function (key) { return (dlKeyValues[key] !== undefined && dlKeyValues[key] !== -1 && dlKeyValues[key] !== 0 && dlKeyValues[key] !== ""); })
        .map(function (key) { return ("\n      <dt>" + key + "</dt>\n      <dd>" + dlKeyValues[key] + "</dd>\n    "); }).join("");
}
function createBody(requestID, block) {
    var body = document.createElement("body");
    body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    var tabsData = getKeys(requestID, block);
    var generalDl = makeDefinitionList(tabsData.general);
    var requestDl = makeDefinitionList(tabsData.request);
    var responseDl = makeDefinitionList(tabsData.response);
    body.innerHTML = "\n    <div class=\"wrapper\">\n      <h3>#" + requestID + " " + block.name + "</h3>\n      <nav class=\"tab-nav\">\n      <ul>\n        <li><button class=\"tab-button\">General</button></li>\n        <li><button class=\"tab-button\">Request</button></li>\n        <li><button class=\"tab-button\">Response</button></li>\n        <li><button class=\"tab-button\">Raw Data</button></li>\n      </ul>\n      </nav>\n      <div class=\"tab\">\n        <dl>\n          " + generalDl + "\n        </dl>\n      </div>\n      <div class=\"tab\">\n        <dl>\n          " + requestDl + "\n        </dl>\n      </div>\n      <div class=\"tab\">\n        <dl>\n          " + responseDl + "\n        </dl>\n      </div>\n      <div class=\"tab\">\n        <code>\n          <pre>" + JSON.stringify(block.rawResource, null, 2) + "</pre>\n        </code>\n      </div>\n    </div>\n    ";
    return body;
}
function createRowInfoOverlay(requestID, barX, y, block, leftFixedWidth, unit) {
    var holder = createHolder(y, leftFixedWidth);
    var html = svg_1.default.newEl("foreignObject", {
        "width": "100%",
        "height": 250,
        "x": "0",
        "y": y,
        "dy": "5",
        "dx": "5"
    });
    var closeBtn = createCloseButtonSvg(y);
    closeBtn.addEventListener("click", function (evt) { return holder.parentElement.removeChild(holder); });
    var body = createBody(requestID, block);
    var buttons = body.getElementsByClassName("tab-button");
    var tabs = body.getElementsByClassName("tab");
    var setTabStatus = function (index) {
        dom_1.default.forEach(tabs, function (tab, j) {
            tab.style.display = (index === j) ? "block" : "none";
            buttons.item(j).classList.toggle("active", (index === j));
        });
    };
    dom_1.default.forEach(buttons, function (btn, i) {
        btn.addEventListener("click", function () { setTabStatus(i); });
    });
    setTabStatus(0);
    html.appendChild(body);
    holder.appendChild(html);
    holder.appendChild(closeBtn);
    return holder;
}
exports.createRowInfoOverlay = createRowInfoOverlay;

},{"../helpers/dom":1,"../helpers/svg":4}],11:[function(require,module,exports){
/**
 * Creation of sub-components of the waterfall chart
 */
var svg_1 = require("../helpers/svg");
/**
 * Creates verticale alignment bars
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
function createAlignmentLines(diagramHeight) {
    return {
        endline: svg_1.default.newEl("line", {
            "x1": "0",
            "y1": "0",
            "x2": "0",
            "y2": diagramHeight,
            "class": "line-end"
        }),
        startline: svg_1.default.newEl("line", {
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
                svg_1.default.addClass(targetRect, "active");
                var xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits +
                    targetRect.width.baseVal.valueInSpecifiedUnits + "%";
                var xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";
                hoverEl.endline.x1.baseVal.valueAsString = xPosEnd;
                hoverEl.endline.x2.baseVal.valueAsString = xPosEnd;
                hoverEl.startline.x1.baseVal.valueAsString = xPosStart;
                hoverEl.startline.x2.baseVal.valueAsString = xPosStart;
                svg_1.default.addClass(hoverEl.endline, "active");
                svg_1.default.addClass(hoverEl.startline, "active");
            };
        },
        onMouseLeavePartial: function () {
            return function (evt) {
                var targetRect = evt.target;
                svg_1.default.removeClass(targetRect, "active");
                svg_1.default.removeClass(hoverEl.endline, "active");
                svg_1.default.removeClass(hoverEl.startline, "active");
            };
        }
    };
}
exports.makeHoverEvtListeners = makeHoverEvtListeners;
/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 */
function createTimeScale(durationMs, diagramHeight) {
    var timeHolder = svg_1.default.newEl("g", { class: "time-scale full-width" });
    for (var i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
        var lineLabel = svg_1.default.newTextEl(i + "sec", diagramHeight);
        if (i > secs - 0.2) {
            lineLabel.setAttribute("x", secPerc * i - 0.5 + "%");
            lineLabel.setAttribute("text-anchor", "end");
        }
        else {
            lineLabel.setAttribute("x", secPerc * i + 0.5 + "%");
        }
        var lineEl = svg_1.default.newEl("line", {
            "x1": secPerc * i + "%",
            "y1": "0",
            "x2": secPerc * i + "%",
            "y2": diagramHeight
        });
        timeHolder.appendChild(lineEl);
        timeHolder.appendChild(lineLabel);
    }
    return timeHolder;
}
exports.createTimeScale = createTimeScale;
//TODO: Implement - data for this not parsed yet
function createBgRect(block, unit, diagramHeight) {
    var rect = svg_1.default.newEl("rect", {
        "width": ((block.total || 1) / unit) + "%",
        "height": diagramHeight,
        "x": ((block.start || 0.001) / unit) + "%",
        "y": 0,
        "class": block.cssClass || "block-other"
    });
    rect.appendChild(svg_1.default.newEl("title", {
        "text": block.name
    })); // Add tile to wedge path
    return rect;
}
exports.createBgRect = createBgRect;
/**
 * Renders global markes for events like the onLoad event etc
 * @param {Array<Mark>} marks         [description]
 * @param {number}      unit          horizontal unit (duration in ms of 1%)
 * @param {number}      diagramHeight Full height of SVG in px
 */
function createMarks(marks, unit, diagramHeight) {
    var marksHolder = svg_1.default.newEl("g", {
        "transform": "scale(1, 1)",
        "class": "marker-holder"
    });
    marks.forEach(function (mark, i) {
        var x = mark.startTime / unit;
        var markHolder = svg_1.default.newEl("g", {
            "class": "mark-holder type-" + mark.name.toLowerCase()
        });
        var lineHolder = svg_1.default.newEl("g", {
            "class": "line-holder"
        });
        var lineLabelHolder = svg_1.default.newEl("g", {
            "class": "line-label-holder",
            "x": x + "%"
        });
        mark.x = x;
        var lineLabel = svg_1.default.newTextEl(mark.name, diagramHeight + 25);
        //lineLabel.setAttribute("writing-mode", "tb")
        lineLabel.setAttribute("x", x + "%");
        lineLabel.setAttribute("stroke", "");
        lineHolder.appendChild(svg_1.default.newEl("line", {
            "x1": x + "%",
            "y1": 0,
            "x2": x + "%",
            "y2": diagramHeight
        }));
        var lastMark = marks[i - 1];
        if (lastMark && mark.x - lastMark.x < 1) {
            lineLabel.setAttribute("x", lastMark.x + 1 + "%");
            mark.x = lastMark.x + 1;
        }
        //would use polyline but can't use percentage for points 
        lineHolder.appendChild(svg_1.default.newEl("line", {
            "x1": x + "%",
            "y1": diagramHeight,
            "x2": mark.x + "%",
            "y2": diagramHeight + 23
        }));
        var isActive = false;
        var onLableMouseEnter = function (evt) {
            if (!isActive) {
                isActive = true;
                svg_1.default.addClass(lineHolder, "active");
                //firefox has issues with this
                markHolder.parentNode.appendChild(markHolder);
            }
        };
        var onLableMouseLeave = function (evt) {
            isActive = false;
            svg_1.default.removeClass(lineHolder, "active");
        };
        lineLabel.addEventListener("mouseenter", onLableMouseEnter);
        lineLabel.addEventListener("mouseleave", onLableMouseLeave);
        lineLabelHolder.appendChild(lineLabel);
        markHolder.appendChild(svg_1.default.newEl("title", {
            "text": mark.name + " (" + Math.round(mark.startTime) + "ms)"
        }));
        markHolder.appendChild(lineHolder);
        markHolder.appendChild(lineLabelHolder);
        marksHolder.appendChild(markHolder);
    });
    return marksHolder;
}
exports.createMarks = createMarks;

},{"../helpers/svg":4}],12:[function(require,module,exports){
var misc_1 = require("../helpers/misc");
function getResponseHeader(entry, headerName) {
    return entry.response.headers.filter(function (h) { return h.name.toLowerCase() === headerName.toLowerCase(); })[0];
}
function isCompressable(block) {
    var entry = block.rawResource;
    var minCompressionSize = 1000;
    //ignore non GET and small responses
    if (entry.request.method.toLocaleLowerCase() !== "get" || entry.response.bodySize < minCompressionSize) {
        return false;
    }
    if (misc_1.default.contains(["html", "css", "javascript", "svg", "plain"], block.requestType)) {
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
    if (misc_1.default.contains(["text"], mime.split("/")[0]) || misc_1.default.contains(compressableMimes, mime)) {
        return true;
    }
    return false;
}
/**
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @param  {boolean} docIsSsl
 * @returns IconMetadata
 */
function getIndicators(block, docIsSsl) {
    var isSecure = block.name.indexOf("https://") === 0;
    var iconWidth = 20;
    var entry = block.rawResource;
    var output = [];
    var xPos = 3;
    // helper to avoid typing out all key of the helper object
    var makeIcon = function (type, title) {
        output.push({ "type": type, "x": xPos, "title": title });
        xPos += iconWidth;
    };
    var respHeader = function (headerName) {
        return getResponseHeader(entry, headerName);
    };
    var respHeaderValue = function (headerName) {
        var header = getResponseHeader(entry, headerName);
        if (header !== undefined) {
            return header.value;
        }
        else {
            return "";
        }
    };
    makeIcon(block.requestType, block.requestType);
    //highlight redirects
    if (!!entry.response.redirectURL) {
        var url = encodeURI(entry.response.redirectURL.split("?")[0] || "");
        makeIcon("err3xx", entry.response.status + " response status: Redirect to " + url + "...");
    }
    if (!docIsSsl && isSecure) {
        makeIcon("lock", "Secure Connection");
    }
    else if (docIsSsl && !isSecure) {
        makeIcon("noTls", "Insecure Connection");
    }
    if (entry.request.method.toLocaleLowerCase() === "get") {
        if ((respHeader("Cache-Control") === undefined
            && respHeader("Expires") === undefined)
            || respHeaderValue("Cache-Control").indexOf("no-cache") > -1
            || respHeaderValue("Pragma") === "no-cache") {
            makeIcon("noCache", "Response not cached");
        }
    }
    if (respHeader("Content-Encoding") === undefined && isCompressable(block)) {
        makeIcon("noGzip", "no gzip");
    }
    if (entry.response.status > 399 && entry.response.status < 500) {
        makeIcon("err4xx", entry.response.status + " response status: " + entry.response.statusText);
    }
    if (entry.response.status > 499 && entry.response.status < 600) {
        makeIcon("err5xx", entry.response.status + " response status: " + entry.response.statusText);
    }
    if (!entry.response.content.mimeType) {
        makeIcon("warning", "No MIME Type defined");
    }
    return output;
}
exports.getIndicators = getIndicators;

},{"../helpers/misc":3}],13:[function(require,module,exports){
/**
 * Creation of sub-components used in a ressource request row
 */
var svg_1 = require("../helpers/svg");
/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {Array<TimeBlock>} segments Request and Timing Data
 * @return {SVGElement}                Renerated SVG (rect or g element)
 */
function createRect(rectData, segments) {
    var blockHeight = rectData.height - 1;
    var rectHolder;
    var rect = svg_1.default.newEl("rect", {
        "width": (rectData.width / rectData.unit) + "%",
        "height": blockHeight,
        "x": Math.round((rectData.x / rectData.unit) * 100) / 100 + "%",
        "y": rectData.y,
        "class": ((segments && segments.length > 0 ? "time-block" : "segment")) + " "
            + (rectData.cssClass || "block-other")
    });
    if (rectData.label) {
        rect.appendChild(svg_1.default.newEl("title", {
            "text": rectData.label
        })); // Add tile to wedge path
    }
    rect.addEventListener("mouseenter", rectData.showOverlay(rectData));
    rect.addEventListener("mouseleave", rectData.hideOverlay(rectData));
    if (segments && segments.length > 0) {
        rectHolder = svg_1.default.newEl("g", {
            "class": "rect-holder"
        });
        rectHolder.appendChild(rect);
        segments.forEach(function (segment) {
            if (segment.total > 0 && typeof segment.start === "number") {
                var childRectData = {
                    "width": segment.total,
                    "height": (blockHeight - 5),
                    "x": segment.start || 0.001,
                    "y": rectData.y,
                    "cssClass": segment.cssClass,
                    "label": segment.name + " (" + Math.round(segment.start) + "ms - "
                        + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
                    "unit": rectData.unit,
                    "showOverlay": rectData.showOverlay,
                    "hideOverlay": rectData.hideOverlay
                };
                rectHolder.appendChild(createRect(childRectData));
            }
        });
        return rectHolder;
    }
    else {
        return rect;
    }
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
    var lableHolder = svg_1.default.newG("full-lable");
    lableHolder.appendChild(svg_1.default.newEl("rect", {
        "class": "label-full-bg",
        "x": x - 3,
        "y": y + 3,
        "width": svg_1.default.getNodeTextWidth(blockLabel),
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
    var blockName = name.replace(/http[s]\:\/\//, "");
    var blockLabel = svg_1.default.newTextEl(blockName, (y + Math.round(height / 2) + 5));
    blockLabel.appendChild(svg_1.default.newEl("title", {
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
 * @param  {number}      leftFixedWidth [description]
 * @param  {boolean}     isEven         [description]
 * @return {SVGGElement}                [description]
 */
function createBgStripe(y, height, leftFixedWidth, isEven) {
    var stripeHolder = svg_1.default.newEl("g", {
        "class": isEven ? "even" : "odd"
    });
    stripeHolder.appendChild(svg_1.default.newEl("rect", {
        "width": "100%",
        "height": height,
        "x": 0,
        "y": y,
        "class": "flex"
    }));
    stripeHolder.appendChild(svg_1.default.newEl("rect", {
        "width": leftFixedWidth,
        "height": height,
        "x": "-" + leftFixedWidth,
        "y": y,
        "class": "fixed"
    }));
    return stripeHolder;
}
exports.createBgStripe = createBgStripe;
function createFixedRow(y, requestBarHeight, onClick, leftFixedWidth) {
    var rowFixed = svg_1.default.newEl("g", {
        "class": "row row-fixed"
    });
    rowFixed.appendChild(svg_1.default.newEl("rect", {
        "width": leftFixedWidth,
        "height": requestBarHeight,
        "x": "0",
        "y": y,
        "opacity": "0"
    }));
    rowFixed.addEventListener("click", onClick);
    return rowFixed;
}
exports.createFixedRow = createFixedRow;
function createFlexRow(y, requestBarHeight, onClick) {
    var rowFixed = svg_1.default.newEl("g", {
        "class": "row row-flex"
    });
    rowFixed.appendChild(svg_1.default.newEl("rect", {
        "width": "100%",
        "height": requestBarHeight,
        "x": "0",
        "y": y,
        "opacity": "0"
    }));
    rowFixed.addEventListener("click", onClick);
    return rowFixed;
}
exports.createFlexRow = createFlexRow;

},{"../helpers/svg":4}]},{},[5]);
