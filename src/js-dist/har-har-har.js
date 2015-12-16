/*HarHarHar build:16/12/2015 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/*
DOM Helpers
*/
var dom = {};

dom.newTextNode = function (text) {
  return document.createTextNode(text);
};

//creat html tag
dom.newTag = function (tagName, settings, css) {
  settings = settings || {};
  var tag = document.createElement(tagName);
  for (var attr in settings) {
    if (attr != "text") {
      tag[attr] = settings[attr];
    }
  }
  if (settings.text) {
    tag.textContent = settings.text;
  } else if (settings.childElement) {
    if (_typeof(settings.childElement) === "object") {
      //if childNodes NodeList is passed in
      if (settings.childElement instanceof NodeList) {
        //NodeList is does not inherit from array
        Array.prototype.slice.call(settings.childElement, 0).forEach(function (childNode) {
          tag.appendChild(childNode);
        });
      } else {
        tag.appendChild(settings.childElement);
      }
    } else {
      tag.appendChild(dom.newTextNode(settings.childElement));
    }
  }
  if (settings.class) {
    tag.className = settings.class;
  }
  tag.style.cssText = css || "";
  return tag;
};

dom.tableFactory = function (id, headerBuilder, rowBuilder) {
  var tableHolder = dom.newTag("div", {
    id: id || "",
    class: "table-holder"
  });
  var table = dom.newTag("table");
  var thead = dom.newTag("thead");

  thead.appendChild(headerBuilder(dom.newTag("tr")));
  table.appendChild(thead);
  table.appendChild(rowBuilder(dom.newTag("tbody")));
  tableHolder.appendChild(table);
  return tableHolder;
};

dom.combineNodes = function (a, b) {
  var wrapper = document.createElement("div");
  if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === "object") {
    wrapper.appendChild(a);
  } else if (typeof a === "string") {
    wrapper.appendChild(dom.newTextNode(a));
  }
  if ((typeof b === "undefined" ? "undefined" : _typeof(b)) === "object") {
    wrapper.appendChild(b);
  } else if (typeof b === "string") {
    wrapper.appendChild(dom.newTextNode(b));
  }
  return wrapper.childNodes;
};

dom.addClass = function (el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    // IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class") + " " + className);
  }
  return el;
};

dom.removeClass = function (el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    //IE doesn't support classList in SVG - also no need for dublication check i.t.m.
    el.setAttribute("class", el.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2"));
  }
  return el;
};

exports.default = dom;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
SVG Helpers
*/

var svg = {};

svg.newEl = function (tagName, settings, css) {
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
};

svg.newTextEl = function (text, y, css) {
  return svg.newEl("text", {
    fill: "#111",
    y: y,
    text: text
  }, (css || "") + " text-shadow:0 0 4px #fff;");
};

//needs access to iFrame
// svg.getNodeTextWidth = function(textNode){
//  var tmp = svg.newEl("svg:svg", {}, "visibility:hidden;");
//  tmp.appendChild(textNode);
//  getOutputIFrame().body.appendChild(tmp);

//  const nodeWidth = textNode.getBBox().width;
//  tmp.parentNode.removeChild(tmp);
//  return nodeWidth;
// };

exports.default = svg;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svg = require("../helpers/svg");

var _svg2 = _interopRequireDefault(_svg);

var _dom = require("../helpers/dom");

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Helper to create waterfall timelines 
*/

var waterfall = {};

//model for block and segment
waterfall.timeBlock = function (name, start, end, cssClass, segments, rawResource) {
  return {
    name: name,
    start: start,
    end: end,
    total: typeof start !== "number" || typeof end !== "number" ? undefined : end - start,
    cssClass: cssClass,
    segments: segments,
    rawResource: rawResource
  };
};

waterfall.setupTimeLine = function (durationMs, blocks, marks, lines, title) {
  var unit = durationMs / 100,
      barsToShow = blocks.filter(function (block) {
    return typeof block.start == "number" && typeof block.total == "number";
  }).sort(function (a, b) {
    return (a.start || 0) - (b.start || 0);
  }),
      maxMarkTextLength = marks.length > 0 ? marks.reduce(function (currMax, currValue) {
    return Math.max(typeof currMax == "number" ? currMax : 0, _svg2.default.getNodeTextWidth(_svg2.default.newTextEl(currValue.name, "0")));
  }) : 0,
      diagramHeight = (barsToShow.length + 1) * 25,
      chartHolderHeight = diagramHeight + maxMarkTextLength + 35;

  var chartHolder = _dom2.default.newTag("section", {
    class: "resource-timing water-fall-holder chart-holder"
  });
  var timeLineHolder = _svg2.default.newEl("svg:svg", {
    height: Math.floor(chartHolderHeight),
    class: "water-fall-chart"
  });
  var timeLineLabelHolder = _svg2.default.newEl("g", { class: "labels" });

  var endline = _svg2.default.newEl("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: diagramHeight,
    class: "line-end"
  });

  var startline = _svg2.default.newEl("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: diagramHeight,
    class: "line-start"
  });

  var onRectMouseEnter = function onRectMouseEnter(evt) {
    var targetRect = evt.target;
    _dom2.default.addClass(targetRect, "active");

    var xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits + targetRect.width.baseVal.valueInSpecifiedUnits + "%";
    var xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";

    endline.x1.baseVal.valueAsString = xPosEnd;
    endline.x2.baseVal.valueAsString = xPosEnd;
    startline.x1.baseVal.valueAsString = xPosStart;
    startline.x2.baseVal.valueAsString = xPosStart;
    _dom2.default.addClass(endline, "active");
    _dom2.default.addClass(startline, "active");

    targetRect.parentNode.appendChild(endline);
    targetRect.parentNode.appendChild(startline);
  };

  var onRectMouseLeave = function onRectMouseLeave(evt) {
    _dom2.default.removeClass(evt.target, "active");
    _dom2.default.removeClass(endline, "active");
    _dom2.default.removeClass(startline, "active");
  };

  var createRect = function createRect(width, height, x, y, cssClass, label, segments) {
    var rectHolder;
    var rect = _svg2.default.newEl("rect", {
      width: width / unit + "%",
      height: height - 1,
      x: Math.round(x / unit * 100) / 100 + "%",
      y: y,
      class: (segments && segments.length > 0 ? "time-block" : "segment") + " " + (cssClass || "block-undefined")
    });
    if (label) {
      rect.appendChild(_svg2.default.newEl("title", {
        text: label
      })); // Add tile to wedge path
    }

    rect.addEventListener("mouseenter", onRectMouseEnter);
    rect.addEventListener("mouseleave", onRectMouseLeave);

    if (segments && segments.length > 0) {
      rectHolder = _svg2.default.newEl("g");
      rectHolder.appendChild(rect);
      segments.forEach(function (segment) {
        if (segment.total > 0 && typeof segment.start === "number") {
          rectHolder.appendChild(createRect(segment.total, 8, segment.start || 0.001, y, segment.cssClass, segment.name + " (" + Math.round(segment.start) + "ms - " + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)"));
        }
      });
      return rectHolder;
    } else {
      return rect;
    }
  };

  var createBgRect = function createBgRect(block) {
    var rect = _svg2.default.newEl("rect", {
      width: (block.total || 1) / unit + "%",
      height: diagramHeight,
      x: (block.start || 0.001) / unit + "%",
      y: 0,
      class: block.cssClass || "block-undefined"
    });

    rect.appendChild(_svg2.default.newEl("title", {
      text: block.name
    })); // Add tile to wedge path
    return rect;
  };

  var createTimeWrapper = function createTimeWrapper() {
    var timeHolder = _svg2.default.newEl("g", { class: "time-scale full-width" });
    for (var i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
      var lineLabel = _svg2.default.newTextEl(i + "sec", diagramHeight);
      if (i > secs - 0.2) {
        lineLabel.setAttribute("x", secPerc * i - 0.5 + "%");
        lineLabel.setAttribute("text-anchor", "end");
      } else {
        lineLabel.setAttribute("x", secPerc * i + 0.5 + "%");
      }

      var lineEl = _svg2.default.newEl("line", {
        x1: secPerc * i + "%",
        y1: "0",
        x2: secPerc * i + "%",
        y2: diagramHeight
      });
      timeHolder.appendChild(lineEl);
      timeHolder.appendChild(lineLabel);
    }
    return timeHolder;
  };

  var renderMarks = function renderMarks() {
    var marksHolder = _svg2.default.newEl("g", {
      transform: "scale(1, 1)",
      class: "marker-holder"
    });

    marks.forEach(function (mark, i) {
      var x = mark.startTime / unit;
      var markHolder = _svg2.default.newEl("g", {
        class: "mark-holder"
      });
      var lineHolder = _svg2.default.newEl("g", {
        class: "line-holder"
      });
      var lineLableHolder = _svg2.default.newEl("g", {
        class: "line-lable-holder",
        x: x + "%"
      });
      mark.x = x;
      var lineLabel = _svg2.default.newTextEl(mark.name, diagramHeight + 25);
      //lineLabel.setAttribute("writing-mode", "tb");
      lineLabel.setAttribute("x", x + "%");
      lineLabel.setAttribute("stroke", "");

      lineHolder.appendChild(_svg2.default.newEl("line", {
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
      lineHolder.appendChild(_svg2.default.newEl("line", {
        x1: x + "%",
        y1: diagramHeight,
        x2: mark.x + "%",
        y2: diagramHeight + 23
      }));

      var isActive = false;
      var onLableMouseEnter = function onLableMouseEnter(evt) {
        if (!isActive) {
          isActive = true;
          _dom2.default.addClass(lineHolder, "active");
          //firefox has issues with this
          markHolder.parentNode.appendChild(markHolder);
        }
      };

      var onLableMouseLeave = function onLableMouseLeave(evt) {
        isActive = false;
        _dom2.default.removeClass(lineHolder, "active");
      };

      lineLabel.addEventListener("mouseenter", onLableMouseEnter);
      lineLabel.addEventListener("mouseleave", onLableMouseLeave);
      lineLableHolder.appendChild(lineLabel);

      markHolder.appendChild(_svg2.default.newEl("title", {
        text: mark.name + " (" + Math.round(mark.startTime) + "ms)"
      }));
      markHolder.appendChild(lineHolder);
      marksHolder.appendChild(markHolder);
      markHolder.appendChild(lineLableHolder);
    });

    return marksHolder;
  };

  timeLineHolder.appendChild(createTimeWrapper());
  timeLineHolder.appendChild(renderMarks());

  lines.forEach(function (block, i) {
    timeLineHolder.appendChild(createBgRect(block));
  });

  barsToShow.forEach(function (block, i) {
    var blockWidth = block.total || 1;

    var y = 25 * i;
    timeLineHolder.appendChild(createRect(blockWidth, 25, block.start || 0.001, y, block.cssClass, block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)", block.segments));

    var blockLabel = _svg2.default.newTextEl(block.name + " (" + Math.round(block.total) + "ms)", y + (block.segments ? 20 : 17));

    if ((block.total || 1) / unit > 10 && _svg2.default.getNodeTextWidth(blockLabel) < 200) {
      blockLabel.setAttribute("class", "inner-label");
      blockLabel.setAttribute("x", (block.start || 0.001) / unit + 0.5 + "%");
      blockLabel.setAttribute("width", blockWidth / unit + "%");
    } else if ((block.start || 0.001) / unit + blockWidth / unit < 80) {
      blockLabel.setAttribute("x", (block.start || 0.001) / unit + blockWidth / unit + 0.5 + "%");
    } else {
      blockLabel.setAttribute("x", (block.start || 0.001) / unit - 0.5 + "%");
      blockLabel.setAttribute("text-anchor", "end");
    }
    blockLabel.style.opacity = block.name.match(/js.map$/) ? "0.5" : "1";
    timeLineLabelHolder.appendChild(blockLabel);
  });

  timeLineHolder.appendChild(timeLineLabelHolder);

  if (title) {
    chartHolder.appendChild(_dom2.default.newTag("h1", {
      text: title
    }));
  }
  chartHolder.appendChild(timeLineHolder);

  return chartHolder;
};

exports.default = waterfall;

},{"../helpers/dom":1,"../helpers/svg":2}],4:[function(require,module,exports){
"use strict";

var _waterfall = require("./helpers/waterfall.js");

var _waterfall2 = _interopRequireDefault(_waterfall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showErrorMsg(msg) {
  alert(msg);
}

var harHolder = document.getElementById(output);

function onFileInput(evt) {
  var files = evt.target.files;
  if (!files) {
    showErrorMsg("Failed to load HAR file");
    return;
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    var harData;
    try {
      //TODO: add proper check for HAR file
      harData = JSON.parse(e.target.result);
    } catch (e) {
      showErrorMsg("File does not seem to be a valid HAR file");
      return undefined;
    }
    renderHar(harData.log);
  };
  reader.readAsText(files[0]);
}
document.getElementById('fileinput').addEventListener('change', onFileInput, false);

function renderHar(logData) {
  console.log("HAR created by %s(%s) of %s page(s)", logData.creator.name, logData.creator.version, logData.pages.length);
  console.log(logData.entries);
  console.table(logData.entries);
  console.log(logData);
}

//Dev/Test only - load test file
fetch("test-data/www.google.co.kr.har").then(function (f) {
  return f.json().then(function (j) {
    return renderHar(j.log);
  });
});

console.log(_waterfall2.default);

},{"./helpers/waterfall.js":3}]},{},[1,2,3,4]);
