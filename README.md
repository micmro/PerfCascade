# PerfCascade
Responsive, SVG based [HAR](http://www.softwareishard.com/blog/har-12-spec/) waterfall viewer .

[![npm version](https://img.shields.io/npm/v/perf-cascade.svg?style=flat-square)](https://www.npmjs.com/package/perf-cascade)
[![npm downloads](https://img.shields.io/npm/dt/perf-cascade.svg?style=flat-square)](https://www.npmjs.com/package/perf-cascade)
[![Build status][travis-image]][travis-url]

Install via `npm install perf-cascade`<br/>
Live example: https://micmro.github.io/PerfCascade/

<img src="https://raw.githubusercontent.com/micmro/PerfCascade/gh-pages/img/PerfCascade-sample2.png" alt="example screenshot" width="704" height="707">

## Contents

- [How to use PerfCascade](#how-to-use-perfcascade)
  * [With ES6 Compatible Module Loader (Webpack, Babel, Typescript...)](#with-es6-compatible-module-loader--webpack--babel--typescript-)
  * [As Global Object](#as-global-object)
  * [Use via npm](#use-via-npm)
- [Options](#options)
- [`*.zhar` - zipped HAR files](#--zhar----zipped-har-files)
- [Rendering other formats (than HAR)](#rendering-other-formats--than-har-)
- [Dev](#dev)
- [Specs and resources](#specs-and-resources)

## How to use PerfCascade
PerfCascade is exported with [UMD](https://github.com/umdjs/umd), so you can use it as global object, via AMD (e.g. requireJS) or commonJS (internally it uses ES6 modules).

### With ES6 Compatible Module Loader (Webpack, Babel, Typescript...)
Install the package
```
npm install perf-cascade --save
````

```javascript
import {fromHar} from 'perf-cascade'

// `myHarDoc` represents your HAR doc

const perfCascadeSvg = fromHar(myHarDoc)
document.appendChild(perfCascadeSvg)
```

_With TypeScript you can additionally import TypeDefinitions for `ChartOptions` (PerfCascade Options) and `harFormat` (namespace for HAR Typings)_

### As Global Object
When using PerfCascade without any module system it just exports as a global object `perfCascade`, you can use as following:
```javascript
/** pass HAR `perfCascade.fromHar` to generate the SVG element*/
var perfCascadeSvg =  perfCascade.fromHar(harData)
document.appendChild(perfCascadeSvg)
```

Or with options:
```javascript
/** override selected options for PerfCascade (all have defaults) */
var options = {
  showIndicatorIcons: false, //default: true
  leftColumnWidth: 30 //default: 25
}

var perfCascadeSvg =  perfCascade.fromHar(harData, options)
document.appendChild(perfCascadeSvg)
```

You can find the compiled (and minified) JS in the [releases tab](https://github.com/micmro/PerfCascade/releases). For the basic version without zHAR support you need [`perf-cascade.min.js`](https://github.com/micmro/PerfCascade/blob/release/perf-cascade.min.js) and some basic CSS styles [`perf-cascade.css`](https://github.com/micmro/PerfCascade/blob/release/perf-cascade.css).

### Use via npm
You can install PerfCascade via NPM as well:
```
npm install perf-cascade
```

Directories:
- `node_modules/perf-cascade/dist/`: bundled UMD modules and the css file in the directory.
- `node_modules/perf-cascade/lib`: contains the full project exported as separate ES6 modules
- `node_modules/perf-cascade/types`: Typescript typings

## Options
see [options.d.ts](https://github.com/micmro/PerfCascade/blob/main/src/ts/typing/options.ts) for source

| Option      | Type | Default Value | Description |
| ----------- | ---- | ------- | ----------- |
| `rowHeight` | `number` | `23` | Height of every request bar block plus spacer pixel (in px) default: 23 |
| `showAlignmentHelpers` | `boolean` | `true` | Show vertical lines to easier spot potential dependencies/blocking between requests |
| `showMimeTypeIcon` | `boolean` | `true` |  Show mime type icon on the left |
| `showIndicatorIcons` | `boolean` | `true` |  Show warning icons for potential issues on the left |
| `leftColumnWidth` | `number` | `25` | Relative width of the info column on the left (in percent) |
| `pageSelector` | `HTMLSelectElement` | `undefined` | DOM `<select>` element to use to select a run if the HAR contains multiple runs. |
| `selectedPage` | `number` | `0` | Zero-based index of the page to initially render.<br/>If `selectedPage` is larger than the number of pages the last page will be selected. |
| `legendHolder` | `HTMLElement`<br/>(DOM element) | `undefined` <br/>(not shown) | If set a legend explaining the waterfall colours is rendered in the `legendHolder` DOM element. |
| `showUserTiming` | `boolean` | `false` | If enabled the [UserTiming](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) data in WebPageTest's format `_userTime.*` get parsed and rendered as well.<br/>Matching `_userTime.startTimer-*` and `_userTime.endTimer-*` entries get combined into one block. |
| `showUserTimingEndMarker` | `boolean` | `false` (requires `showUserTiming` to be `true`) | If `showUserTiming` is enabled all `_userTime.endTimer-*` marker are hidden by default, only the UserTiming's start and duration is shown. This option also adds an `_userTime.endTimer-*` marker.

## `*.zhar` - zipped HAR files
By loading `/perf-cascade-file-reader.min.js` as in [this example](https://github.com/micmro/PerfCascade/blob/main/src/index.html#L78-L86) you can use `perfCascadeFileReader.readFile` to read a zip file and convert it to a JSON HAR object.

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

## Rendering other formats (than HAR)
PerfCascade is composed of a parser [`src/ts/transformers/har.ts`](https://github.com/micmro/PerfCascade/blob/main/src/ts/transformers/har.ts) that parsed HAR into PerfCascade's agnostic [`WaterfallDocs`](https://github.com/micmro/PerfCascade/blob/main/src/ts/typing/waterfall.ts) format and the renderer (see `PerfCascade()` in [`src/ts/main.ts`](https://github.com/micmro/PerfCascade/blob/main/src/ts/main.ts) that creates the chart SVG.

If you want to render another format, you could fork the repo and create a new parser in [`src/ts/transformers/`](https://github.com/micmro/PerfCascade/blob/main/src/ts/transformers/) and implement a new `fromMyNewFormat` function similar to `fromHar()`in [`src/ts/main.ts`](https://github.com/micmro/PerfCascade/blob/main/src/ts/main.ts) that takes your format, calls its parser and then calls the main `PerfCascade()` function with it and returns it.

It would also be possible to separate the renderer into a separate package, if there is enough interest to justify the effort (create an issue and we can discuss it).

## Dev
- Start live-reload server and Typescript compiler with watch: `npm run watch`
- Create uglified version: `npm run build`

_See `package.json` for other useful tasks like linting, release etc._

## Specs and resources

- [W3C HAR Spec](https://w3c.github.io/web-performance/specs/HAR/Overview.html)
- [HAR 1.2 Spec](http://www.softwareishard.com/blog/har-12-spec)
- [HAR Resources](https://github.com/ahmadnassri/har-resources)

[travis-image]: https://img.shields.io/travis/micmro/PerfCascade.svg?style=flat-square
[travis-url]: https://travis-ci.org/micmro/PerfCascade
