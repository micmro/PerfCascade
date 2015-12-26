/*PerfCascade build:26/12/2015 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *  DOM Helpers
 */
var dom = {
    newTextNode: function (text) {
        return document.createTextNode(text);
    },
    //creat html tag
    newTag: function (tagName, settings, css) {
        settings = settings || {};
        var tag = document.createElement(tagName);
        for (var attr in settings) {
            if (attr != "text") {
                tag[attr] = settings[attr];
            }
        }
        if (settings.text) {
            tag.textContent = settings.text;
        }
        else if (settings.childElement) {
            if (typeof settings.childElement === "object") {
                //if childNodes NodeList is passed in
                if (settings.childElement instanceof NodeList) {
                    //NodeList is does not inherit from array
                    Array.prototype.slice.call(settings.childElement, 0).forEach(function (childNode) {
                        tag.appendChild(childNode);
                    });
                }
                else {
                    tag.appendChild(settings.childElement);
                }
            }
            else {
                tag.appendChild(dom.newTextNode(settings.childElement));
            }
        }
        if (settings.class) {
            tag.className = settings.class;
        }
        tag.style.cssText = css || "";
        return tag;
    },
    tableFactory: function (id, headerBuilder, rowBuilder) {
        if (id === void 0) { id = ""; }
        var tableHolder = dom.newTag("div", {
            id: id,
            class: "table-holder"
        });
        var table = dom.newTag("table");
        var thead = dom.newTag("thead");
        thead.appendChild(headerBuilder(dom.newTag("tr")));
        table.appendChild(thead);
        table.appendChild(rowBuilder(dom.newTag("tbody")));
        tableHolder.appendChild(table);
        return tableHolder;
    },
    combineNodes: function (a, b) {
        var wrapper = document.createElement("div");
        if (typeof a === "object") {
            wrapper.appendChild(a);
        }
        else if (typeof a === "string") {
            wrapper.appendChild(dom.newTextNode(a));
        }
        if (typeof b === "object") {
            wrapper.appendChild(b);
        }
        else if (typeof b === "string") {
            wrapper.appendChild(dom.newTextNode(b));
        }
        return wrapper.childNodes;
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
    },
    removeAllChildren: function (el) {
        while (el.childNodes.length > 0) {
            el.removeChild(el.childNodes[0]);
        }
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dom;

},{}],2:[function(require,module,exports){
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
        el.textContent = settings.text || "";
        el.style.cssText = css || "";
        return el;
    },
    newTextEl: function (text, y, css) {
        if (css === void 0) { css = ""; }
        return svg.newEl("text", {
            fill: "#111",
            y: y.toString(),
            text: text
        }, (css + " text-shadow:0 0 4px #fff;"));
    },
    //needs access to body to measure size
    //TODO: refactor for server side use
    getNodeTextWidth: function (textNode) {
        var tmp = svg.newEl("svg:svg", {}, "visibility:hidden;");
        tmp.appendChild(textNode);
        window.document.body.appendChild(tmp);
        var nodeWidth = textNode.getBBox().width;
        tmp.parentNode.removeChild(tmp);
        return nodeWidth;
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = svg;

},{}],3:[function(require,module,exports){
/**
 * Creation of sub-components of the waterfall chart
 */
var svg_1 = require("../helpers/svg");
var dom_1 = require("../helpers/dom");
/**
 * Eventlisteners for verticale alignment bars to be shown on hover
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
function makeHoverEvtListener(diagramHeight) {
    var endline = svg_1.default.newEl("line", {
        x1: "0",
        y1: "0",
        x2: "0",
        y2: diagramHeight,
        class: "line-end"
    });
    var startline = svg_1.default.newEl("line", {
        x1: "0",
        y1: "0",
        x2: "0",
        y2: diagramHeight,
        class: "line-start"
    });
    return {
        onRectMouseEnter: function (evt) {
            var targetRect = evt.target;
            dom_1.default.addClass(targetRect, "active");
            var xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits +
                targetRect.width.baseVal.valueInSpecifiedUnits + "%";
            var xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";
            endline.x1.baseVal.valueAsString = xPosEnd;
            endline.x2.baseVal.valueAsString = xPosEnd;
            startline.x1.baseVal.valueAsString = xPosStart;
            startline.x2.baseVal.valueAsString = xPosStart;
            dom_1.default.addClass(endline, "active");
            dom_1.default.addClass(startline, "active");
            targetRect.parentNode.appendChild(endline);
            targetRect.parentNode.appendChild(startline);
        },
        onRectMouseLeave: function (evt) {
            dom_1.default.removeClass(evt.target, "active");
            dom_1.default.removeClass(endline, "active");
            dom_1.default.removeClass(startline, "active");
        }
    };
}
exports.makeHoverEvtListener = makeHoverEvtListener;
/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {Array<TimeBlock>} segments Request and Timing Data
 * @return {SVGElement}                Renerated SVG (rect or g element)
 */
function createRect(rectData, segments) {
    var rectHolder;
    var rect = svg_1.default.newEl("rect", {
        width: (rectData.width / rectData.unit) + "%",
        height: rectData.height - 1,
        x: Math.round((rectData.x / rectData.unit) * 100) / 100 + "%",
        y: rectData.y,
        class: ((segments && segments.length > 0 ? "time-block" : "segment")) + " "
            + (rectData.cssClass || "block-other")
    });
    if (rectData.label) {
        rect.appendChild(svg_1.default.newEl("title", {
            text: rectData.label
        })); // Add tile to wedge path
    }
    rect.addEventListener("mouseenter", rectData.onRectMouseEnter);
    rect.addEventListener("mouseleave", rectData.onRectMouseLeave);
    if (segments && segments.length > 0) {
        rectHolder = svg_1.default.newEl("g");
        rectHolder.appendChild(rect);
        segments.forEach(function (segment) {
            if (segment.total > 0 && typeof segment.start === "number") {
                var childRectData = {
                    width: segment.total,
                    height: 8,
                    x: segment.start || 0.001,
                    y: rectData.y,
                    cssClass: segment.cssClass,
                    label: segment.name + " (" + Math.round(segment.start) + "ms - "
                        + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
                    unit: rectData.unit,
                    onRectMouseEnter: rectData.onRectMouseEnter,
                    onRectMouseLeave: rectData.onRectMouseLeave
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
 * Create a new SVG Text element to label a request block
 * @param {TimeBlock} block      Asset Request
 * @param {number}    blockWidth Width of request block
 * @param {number}    y          vertical postion (in px)
 * @param {number}    unit       horizontal unit (duration in ms of 1%)
 */
function createRequestLabel(block, blockWidth, y, unit) {
    //crop name if longer than 30 characters
    var clipName = (block.name.length > 30 && block.name.indexOf("?") > 0);
    var blockName = (clipName) ? block.name.split("?")[0] + "?…" : block.name;
    var blockLabel = svg_1.default.newTextEl(blockName + " (" + Math.round(block.total) + "ms)", (y + (block.segments ? 20 : 17)));
    blockLabel.appendChild(svg_1.default.newEl("title", {
        text: block.name
    }));
    if (((block.total || 1) / unit) > 10 && svg_1.default.getNodeTextWidth(blockLabel) < 200) {
        //position label within block
        blockLabel.setAttribute("class", "inner-label");
        blockLabel.setAttribute("x", ((block.start || 0.001) / unit) + 0.5 + "%");
        blockLabel.setAttribute("width", (blockWidth / unit) + "%");
    }
    else if (((block.start || 0.001) / unit) + (blockWidth / unit) < 80) {
        //position label
        blockLabel.setAttribute("x", ((block.start || 0.001) / unit) + (blockWidth / unit) + 0.5 + "%");
    }
    else {
        blockLabel.setAttribute("x", (block.start || 0.001) / unit - 0.5 + "%");
        blockLabel.setAttribute("text-anchor", "end");
    }
    blockLabel.style.opacity = block.name.match(/js.map$/) ? "0.5" : "1";
    return blockLabel;
}
exports.createRequestLabel = createRequestLabel;
/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 */
function createTimeWrapper(durationMs, diagramHeight) {
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
            x1: secPerc * i + "%",
            y1: "0",
            x2: secPerc * i + "%",
            y2: diagramHeight
        });
        timeHolder.appendChild(lineEl);
        timeHolder.appendChild(lineLabel);
    }
    return timeHolder;
}
exports.createTimeWrapper = createTimeWrapper;
//TODO: Implement - data for this not parsed yet
function createBgRect(block, unit, diagramHeight) {
    var rect = svg_1.default.newEl("rect", {
        width: ((block.total || 1) / unit) + "%",
        height: diagramHeight,
        x: ((block.start || 0.001) / unit) + "%",
        y: 0,
        class: block.cssClass || "block-other"
    });
    rect.appendChild(svg_1.default.newEl("title", {
        text: block.name
    })); // Add tile to wedge path
    return rect;
}
exports.createBgRect = createBgRect;
//TODO: Implement - data for this not parsed yet
function renderMarks(marks, unit, diagramHeight) {
    var marksHolder = svg_1.default.newEl("g", {
        transform: "scale(1, 1)",
        class: "marker-holder"
    });
    marks.forEach(function (mark, i) {
        var x = mark.startTime / unit;
        var markHolder = svg_1.default.newEl("g", {
            class: "mark-holder"
        });
        var lineHolder = svg_1.default.newEl("g", {
            class: "line-holder"
        });
        var lineLabelHolder = svg_1.default.newEl("g", {
            class: "line-label-holder",
            x: x + "%"
        });
        mark.x = x;
        var lineLabel = svg_1.default.newTextEl(mark.name, diagramHeight + 25);
        //lineLabel.setAttribute("writing-mode", "tb")
        lineLabel.setAttribute("x", x + "%");
        lineLabel.setAttribute("stroke", "");
        lineHolder.appendChild(svg_1.default.newEl("line", {
            x1: x + "%",
            y1: 0,
            x2: x + "%",
            y2: diagramHeight
        }));
        if (marks[i - 1] && mark.x - marks[i - 1].x < 1) {
            lineLabel.setAttribute("x", marks[i - 1].x + 1 + "%");
            mark.x = marks[i - 1].x + 1;
        }
        //would use polyline but can't use percentage for points 
        lineHolder.appendChild(svg_1.default.newEl("line", {
            x1: x + "%",
            y1: diagramHeight,
            x2: mark.x + "%",
            y2: diagramHeight + 23
        }));
        var isActive = false;
        var onLableMouseEnter = function (evt) {
            if (!isActive) {
                isActive = true;
                dom_1.default.addClass(lineHolder, "active");
                //firefox has issues with this
                markHolder.parentNode.appendChild(markHolder);
            }
        };
        var onLableMouseLeave = function (evt) {
            isActive = false;
            dom_1.default.removeClass(lineHolder, "active");
        };
        lineLabel.addEventListener("mouseenter", onLableMouseEnter);
        lineLabel.addEventListener("mouseleave", onLableMouseLeave);
        lineLabelHolder.appendChild(lineLabel);
        markHolder.appendChild(svg_1.default.newEl("title", {
            text: mark.name + " (" + Math.round(mark.startTime) + "ms)",
        }));
        markHolder.appendChild(lineHolder);
        marksHolder.appendChild(markHolder);
        markHolder.appendChild(lineLabelHolder);
    });
    return marksHolder;
}
exports.renderMarks = renderMarks;

},{"../helpers/dom":1,"../helpers/svg":2}],4:[function(require,module,exports){
var waterfall_1 = require("./waterfall");
var dom_1 = require('./helpers/dom');
var har_1 = require('./transformers/har');
function showErrorMsg(msg) {
    alert(msg);
}
var outputHolder = document.getElementById("output");
function onFileInput(evt) {
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
document.getElementById('fileinput').addEventListener('change', onFileInput, false);
function renderHar(logData) {
    var data = har_1.default.transfrom(logData);
    dom_1.default.removeAllChildren(outputHolder);
    outputHolder.appendChild(waterfall_1.createWaterfallSvg(data));
}
//Dev/Test only - load test file TODO: remove
window["fetch"]("test-data/www.bbc.com.har").then(function (f) { return f.json().then(function (j) { return renderHar(j.log); }); });

},{"./helpers/dom":1,"./transformers/har":5,"./waterfall":7}],5:[function(require,module,exports){
var time_block_1 = require('../typing/time-block');
var HarTransformer = (function () {
    function HarTransformer() {
    }
    HarTransformer.makeBlockCssClass = function (mimeType) {
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
    };
    HarTransformer.transfrom = function (data) {
        var _this = this;
        console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length);
        //temp - TODO: remove
        window["data"] = data;
        var doneTime = 0;
        //only support one page for now
        var blocks = data.entries
            .filter(function (entry) { return entry.pageref === data.pages[0].id; })
            .map(function (entry) {
            var currPage = data.pages.filter(function (page) { return page.id === entry.pageref; })[0];
            var pageStartDate = new Date(currPage.startedDateTime);
            var entryStartDate = new Date(entry.startedDateTime);
            var startRelative = entryStartDate.getTime() - pageStartDate.getTime();
            if (doneTime < (startRelative + entry.time)) {
                doneTime = startRelative + entry.time;
            }
            var subModules = entry.timings;
            return new time_block_1.default(entry.request.url, startRelative, startRelative + entry.time, _this.makeBlockCssClass(entry.response.content.mimeType), _this.buildSectionBlocks(startRelative, entry.timings), entry);
        });
        console["table"](blocks.map(function (b) {
            return {
                name: b.name,
                start: b.start,
                end: b.end,
                TEMP: b.cssClass,
                total: b.total
            };
        }));
        console.log(blocks);
        return {
            durationMs: doneTime,
            blocks: blocks,
            marks: [],
            lines: [],
        };
    };
    HarTransformer.buildSectionBlocks = function (startRelative, t) {
        // var timings = []
        return ["blocked", "dns", "connect", "send", "wait", "receive", "ssl"].reduce(function (collect, key) {
            if (t[key] && t[key] !== -1) {
                var start = (collect.length > 0) ? collect[collect.length - 1].end : startRelative;
                return collect.concat([new time_block_1.default(key, start, start + t[key], "block-" + key)]);
            }
            return collect;
        }, []);
        // "blocked": 0,
        // "dns": -1,
        // "connect": 15,
        // "send": 20,
        // "wait": 38,
        // "receive": 12,
        // "ssl": -1,
        // return [
        //   new TimeBlock("blocked", 0, t.blocked, "block-blocking"),
        //   new TimeBlock("DNS", t.send, t.send, "block-dns"),
        //   new TimeBlock("connect", t.blocked, t.connect, "block-dns"),
        //   new TimeBlock("DNS", t.dns, t.receive, "block-dns")
        // ]
    };
    return HarTransformer;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HarTransformer;

},{"../typing/time-block":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var svg_1 = require("./helpers/svg");
var waterfall_componets_1 = require("./helpers/waterfall-componets");
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
 * @return {SVGSVGElement}      SVG Element ready to render
 */
function createWaterfallSvg(data) {
    //constants
    /** horizontal unit (duration in ms of 1%) */
    var unit = data.durationMs / 100;
    var barsToShow = data.blocks
        .filter(function (block) { return (typeof block.start == "number" && typeof block.total == "number"); })
        .sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
    /** height of the requests part of the diagram in px */
    var diagramHeight = (barsToShow.length + 1) * 25;
    /** full height of the SVG chart in px */
    var chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight);
    //Main holder
    var timeLineHolder = svg_1.default.newEl("svg:svg", {
        height: Math.floor(chartHolderHeight),
        class: "water-fall-chart"
    });
    var timeLineLabelHolder = svg_1.default.newEl("g", {
        class: "labels"
    });
    var mouseListeners = waterfall_componets_1.makeHoverEvtListener(diagramHeight);
    //Start appending SVG elements to the holder element (timeLineHolder)
    timeLineHolder.appendChild(waterfall_componets_1.createTimeWrapper(data.durationMs, diagramHeight));
    timeLineHolder.appendChild(waterfall_componets_1.renderMarks(data.marks, unit, diagramHeight));
    data.lines.forEach(function (block, i) {
        timeLineHolder.appendChild(waterfall_componets_1.createBgRect(block, unit, diagramHeight));
    });
    //Main loop to render blocks
    barsToShow.forEach(function (block, i) {
        var blockWidth = block.total || 1;
        var y = 25 * i;
        var rectData = {
            width: blockWidth,
            height: 25,
            x: block.start || 0.001,
            y: y,
            cssClass: block.cssClass,
            label: block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)",
            unit: unit,
            onRectMouseEnter: mouseListeners.onRectMouseEnter,
            onRectMouseLeave: mouseListeners.onRectMouseLeave
        };
        //create and attach request block
        timeLineHolder.appendChild(waterfall_componets_1.createRect(rectData, block.segments));
        //create and attach request label
        timeLineLabelHolder.appendChild(waterfall_componets_1.createRequestLabel(block, blockWidth, y, unit));
    });
    timeLineHolder.appendChild(timeLineLabelHolder);
    return timeLineHolder;
}
exports.createWaterfallSvg = createWaterfallSvg;

},{"./helpers/svg":2,"./helpers/waterfall-componets":3}]},{},[4]);
