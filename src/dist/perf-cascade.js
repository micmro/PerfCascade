/*PerfCascade build:25/01/2016 */

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
var icons = {
    lock: function (x, y, title, scale) {
        if (scale === void 0) { scale = 1; }
        var parser = new DOMParser();
        var doc = parser.parseFromString("\n    <svg x=\"" + x + "\" y=\"" + y + "\" xmlns=\"http://www.w3.org/2000/svg\">\n      <g class=\"icon icon-lock\" transform=\"scale(" + scale + ")\">\n        <g transform=\"scale(0.833333)\">\n          <path stroke-width=\"2\" stroke-miterlimit=\"10\" d=\"M9 8v-4c0-1.7-1.3-3-3-3s-3 1.3-3 3v2\" fill=\"none\"></path>\n          <path d=\"M0 6h12v8h-12z\"></path>\n          <title>" + title + "</title>\n        </g>\n      </g>\n    </svg>\n    ", "image/svg+xml");
        return doc.firstChild;
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = icons;

},{}],3:[function(require,module,exports){
/**
 *  Misc Helpers
 */
var misc = {
    parseUrl: function (url) {
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
            if (attr != "text") {
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
var dom_1 = require('./helpers/dom');
var har_1 = require('./transformers/har');
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
document.getElementById('fileinput').addEventListener('change', onFileSubmit, false);
//TODO: remove Dev/Test only - load test file
if (location.host.indexOf("127.0.0.1") === 0) {
    //http://www.webpagetest.org/result/151226_X7_b43d35e592fab70e0ba012fe11a41020/
    window["fetch"]("test-data/github.com.151226_X7_b43d35e592fab70e0ba012fe11a41020.har").then(function (f) { return f.json().then(function (j) { return renderHar(j.log); }); });
}

},{"./helpers/dom":1,"./transformers/har":6,"./waterfall/svg-chart":9}],6:[function(require,module,exports){
var time_block_1 = require('../typing/time-block');
var styling_converters_1 = require('./styling-converters');
var HarTransformer = (function () {
    function HarTransformer() {
    }
    HarTransformer.transfrom = function (data) {
        var _this = this;
        console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length);
        //temp - TODO: remove
        window["data"] = data;
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
            var subModules = entry.timings;
            return new time_block_1.default(entry.request.url, startRelative, parseInt(entry._all_end) || (startRelative + entry.time), styling_converters_1.mimeToCssClass(entry.response.content.mimeType), _this.buildDetailTimingBlocks(startRelative, entry), entry);
        });
        var marks = Object.keys(pageTimings)
            .filter(function (k) { return (pageTimings[k] != undefined && pageTimings[k] >= 0); })
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
        var preciseStart = parseInt(entry[("_" + wptKey + "_start")]);
        var preciseEnd = parseInt(entry[("_" + wptKey + "_end")]);
        var start = preciseStart || ((collect.length > 0) ? collect[collect.length - 1].end : startRelative);
        var end = preciseEnd || (start + entry.timings[key]);
        return {
            "start": start,
            "end": end
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
                var sslStart = parseInt(entry["_ssl_start"]) || time.start;
                var sslEnd = parseInt(entry["_ssl_end"]) || time.start + t.ssl;
                var connectStart = (!!parseInt(entry["_ssl_start"])) ? time.start : sslEnd;
                return collect
                    .concat([new time_block_1.default("ssl", sslStart, sslEnd, "block-ssl")])
                    .concat([new time_block_1.default(key, connectStart, time.end, "block-" + key)]);
            }
            return collect.concat([new time_block_1.default(key, time.start, time.end, "block-" + key)]);
        }, []);
    };
    return HarTransformer;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HarTransformer;

},{"../typing/time-block":8,"./styling-converters":7}],7:[function(require,module,exports){
/**
 * Convert a MIME type into a CSS class
 * @param {string} mimeType
 */
function mimeToCssClass(mimeType) {
    var mimeCssClass = function (mimeType) {
        //TODO: can we make this more elegant?
        var types = mimeType.split("/");
        switch (types[0]) {
            case "image": return "image";
            case "font": return "font";
        }
        switch (types[1]) {
            case "svg+xml": //TODO: perhaps we can setup a new colour for SVG
            case "html": return "html";
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
    };
    return "block-" + mimeCssClass(mimeType);
}
exports.mimeToCssClass = mimeToCssClass;

},{}],8:[function(require,module,exports){
var TimeBlock = (function () {
    function TimeBlock(name, start, end, cssClass, segments, rawResource) {
        if (cssClass === void 0) { cssClass = ""; }
        if (segments === void 0) { segments = []; }
        this.name = name;
        this.start = start;
        this.end = end;
        this.cssClass = cssClass;
        this.segments = segments;
        this.rawResource = rawResource;
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
var dom_1 = require('../helpers/dom');
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
        .filter(function (block) { return (typeof block.start == "number" && typeof block.total == "number"); })
        .sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
    /** height of the requests part of the diagram in px */
    var diagramHeight = (barsToShow.length + 1) * requestBarHeight;
    /** full height of the SVG chart in px */
    var chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight);
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
        var shortLabel = svg_row_components_1.createRequestLabelClipped(25, y, ressourceUrlFormater(block.name), requestBarHeight, "clipPath");
        var fullLabel = svg_row_components_1.createRequestLabelFull(25, y, block.name, requestBarHeight);
        var infoOverlay = svg_details_overlay_1.createRowInfoOverlay(i + 1, x, y + requestBarHeight, block, leftFixedWidth, unit);
        var showOverlay = function (evt) {
            dom_1.default.removeAllChildren(overlayHolder);
            overlayHolder.appendChild(infoOverlay);
        };
        var rowFixed = svg_row_components_1.createFixedRow(y, requestBarHeight, showOverlay, leftFixedWidth);
        var rowFlex = svg_row_components_1.createFlexRow(y, requestBarHeight, showOverlay);
        //create and attach request block
        rowFlex.appendChild(rect);
        //TODO: Add indicators / Warnings
        var isSecure = block.name.indexOf("https://") === 0;
        if (isSecure) {
            rowFixed.appendChild(icons_1.default.lock(5, y + 3, "Secure Connection", 1.2));
        }
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

},{"../helpers/dom":1,"../helpers/icons":2,"../helpers/misc":3,"../helpers/svg":4,"./svg-details-overlay":10,"./svg-general-components":11,"./svg-row-components":12}],10:[function(require,module,exports){
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
    var formatBytes = function (size) { return ifValueDefined(size, function (size) {
        return (size + " byte (~" + Math.round(size / 1024 * 10) / 10 + "kb)");
    }); };
    var formatTime = function (size) { return ifValueDefined(size, function (size) {
        return (size + "ms");
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
        return entry["name"] || "";
    };
    var emptyHeader = { "value": "" };
    return {
        "general": {
            "Request Number": "#" + requestID,
            "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page reqest started)",
            "Duration": formatTime(entry.time),
            "Status": entry.response.status + " " + entry.response.statusText,
            "Server IPAddress": entry.serverIPAddress,
            "Connection": entry.connection,
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
            "Expires": getResponseHeader("Expires"),
            "Last-Modified": getResponseHeader("Last-Modified"),
            "Server": getResponseHeader("Server"),
            "Timing-Allow-Origin": getResponseHeader("Timing-Allow-Origin"),
            "Content-Length": getResponseHeader("Content-Length"),
            "Content Size": entry.response.content.size,
            "Content Compression": entry.response.content.compression,
            "Connection": getResponseHeader("Connection"),
            "X-Served-By": getResponseHeader("X-Served-By"),
            "Vary": getResponseHeader("Vary"),
            "Redirect URL": entry.response.redirectURL,
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
    body.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
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
    closeBtn.addEventListener('click', function (evt) { return holder.parentElement.removeChild(holder); });
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
            "text": mark.name + " (" + Math.round(mark.startTime) + "ms)",
        }));
        markHolder.appendChild(lineHolder);
        markHolder.appendChild(lineLabelHolder);
        marksHolder.appendChild(markHolder);
    });
    return marksHolder;
}
exports.createMarks = createMarks;

},{"../helpers/svg":4}],12:[function(require,module,exports){
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
    rowFixed.addEventListener('click', onClick);
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
    rowFixed.addEventListener('click', onClick);
    return rowFixed;
}
exports.createFlexRow = createFlexRow;

},{"../helpers/svg":4}]},{},[5]);
