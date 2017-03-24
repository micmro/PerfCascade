# PerfCascade
Extensible waterfall-viewer that works with [HAR](http://www.softwareishard.com/blog/har-12-spec/) and other formats (in the future).

[![Build status][travis-image]][travis-url]

Install via `npm install perf-cascade`
Live example at: https://micmro.github.io/PerfCascade/

<img src="https://raw.githubusercontent.com/micmro/PerfCascade/gh-pages/img/PerfCascade-sample2.png" alt="example screenshot" width="704" height="707">

## How to use PerfCascade
PerfCascade is exported with [UMD](https://github.com/umdjs/umd), so you can use it as global object, via AMD (e.g. requireJS) or commonJS (internally it uses ES6 modules).

If using it without any module system it exports as a global object `perfCascade`, you can use as following:
```javascript
/** override selected options for PerfCascade (all have defaults) */
var options = {
  showIndicatorIcons: false, //default: true
  leftColumnWith: 30 //default: 25
}

/** pass HAR and options to `perfCascade.fromHar` to generate the SVG element*/
var perfCascadeSvg =  perfCascade.fromHar(harData.log, options)
```

You can find the compiled (and minified) JS in the [releases tab](https://github.com/micmro/PerfCascade/releases). For the basic version without zHAR support you need [`perf-cascade.min.js`](https://github.com/micmro/PerfCascade/blob/release/perf-cascade.min.js) and some basic CSS styles [`perf-cascade.css`](https://github.com/micmro/PerfCascade/blob/release/perf-cascade.css).

### Use via npm
You can install PerfCascade via NPM as well:
```
npm install perf-cascade
```

Directories:
- `node_modules/perf-cascade/dist/`: bundled UMD modules and the css file in the directory.
- `node_modules/perf-cascade/lib`: contains the full project exported as seperate ES6 modules
- `node_modules/perf-cascade/types`: Typescript typings

## Options
see [options.d.ts](https://github.com/micmro/PerfCascade/blob/master/src/ts/typing/options.ts) for source

### `rowHeight`
`number`, default: `23`<br/>
Height of every request bar block plus spacer pixel (in px) default: 23

### `showAlignmentHelpers`
`boolean`, default: `true`<br/>
Show verticale lines to easier spot potential dependencies/blocking between requests

### `showMimeTypeIcon`
`boolean`, default: `true`<br/>
Show mime type icon on the left

### `showIndicatorIcons`
`boolean`, default: `true`<br/>
Show warning icons for potential issues on the left

### `leftColumnWith`
`number`, default: `25`<br/>
Relative width of the info column on the left (in percent)

### `pageSelector`
`HTMLSelectElement`, default: `undefined`<br/>
DOM `<select>` element to use to select a run if the HAR contains multiple runs.

### `selectedPage`
`number`, default: `0`<br/>
Zero-based index of the page to initially render.<br/>
If `selectedPage` is larger than the number of pages the last page will be selected.

### `legendHolder`
`HTMLElement` (DOM element), default: `undefined` (not shown)<br/>
If set a legend explaining the waterfall colours is rendered in the `legendHolder` DOM element.

### `showUserTiming`
`boolean`, default: `false`<br/>
If enabled the [UserTiming](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) data
in WebPageTest's format `_userTime.*` get parsed and rendered as well.
Matching `_userTime.startTimer-*` and `_userTime.endTimer-*` entries get combined into one block.

### `showUserTimingEndMarker`
`boolean`, default: `false` (requires `showUserTiming` to be `true`)<br/>
If `showUserTiming` is enabled all `_userTime.endTimer-*` marker are hidden by default, only the UserTiming's
start and duration is shown. This option also adds an `_userTime.endTimer-*` marker.

## `*.zhar` - zipped HAR files
By loading `/perf-cascade-file-reader.min.js` as in [this example](https://github.com/micmro/PerfCascade/blob/master/src/index.html#L78-L86) you can use `perfCascadeFileReader.readFile` to read a zip file and convert it to a JSON HAR object.

```javascript
perfCascadeFileReader.readFile(fileFromTheFileInput, fileName, function(error, data){
  if(error){
    // handle error
    console.error(error)
  }else{
    // handle success
    renderPerfCascadeChart(data)
  }
})
```

Optionally `perfCascadeFileReader.readFile` also takes a callback (`(progress:number) => void`) as a forth argument
that gets called whenever a new unzip progress status is available.


## Dev
- Start live-reload server and Typescript compiler with watch: `npm run watch`
- Create uglified version: `npm run build` (not tracked ITM)

See `package.json` for other useful tasks like linting, release etc.

## Specs and resources

- [W3C HAR Spec](https://w3c.github.io/web-performance/specs/HAR/Overview.html)
- [HAR 1.2 Spec](http://www.softwareishard.com/blog/har-12-spec)
- [HAR Resources](https://github.com/ahmadnassri/har-resources)

[travis-image]: https://img.shields.io/travis/micmro/PerfCascade.svg?style=flat-square
[travis-url]: https://travis-ci.org/micmro/PerfCascade
