import {Har,
  Page,
  PageTimings,
  Creator,
  NameValueObj,
  Cookie,
  Request,
  Content,
  Response,
  Timings,
  Entry
} from "../typing/har"
import TimeBlock from '../typing/time-block'
import {WaterfallData} from '../typing/waterfall-data'


export default class HarTransformer{
  

  static makeBlockCssClass(mimeType: string) {
    let mimeCssClass = function(mimeType: string){
      //TODO: can we make this more elegant?
      let types = mimeType.split("/");
      switch (types[0]) {
        case "image": return "image"
        case "font": return "font"
      }
      switch (types[1]) {
        case "svg+xml": //TODO: perhaps we can setup a new colour for SVG
        case "html": return "html"
        case "css": return "css"
        case "vnd.ms-fontobject":
        case "font-woff":
        case "font-woff2":
        case "x-font-truetype":
        case "x-font-opentype":
        case "x-font-woff": return "font"
        case "javascript":
        case "x-javascript":
        case "script":
        case "json": return "javascript"
        case "x-shockwave-flash": return "flash"
      }
      return "other"
    }

    return "block-" + mimeCssClass(mimeType)
  }

  static transfrom(data: Har): WaterfallData {
    console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length)
    
    //temp - TODO: remove
    window["data"] = data

    var doneTime = 0;
    //only support one page for now
    let blocks = data.entries
      .filter(entry => entry.pageref === data.pages[0].id)
      .map((entry) => {
        let currPage = data.pages.filter(page => page.id === entry.pageref)[0]
        let pageStartDate = new Date(currPage.startedDateTime)
        let entryStartDate = new Date(entry.startedDateTime)
        let startRelative = entryStartDate.getTime() - pageStartDate.getTime()

        if (doneTime < (startRelative + entry.time)){
          doneTime = startRelative + entry.time
        }

        let subModules = entry.timings

        return new TimeBlock(entry.request.url, 
          startRelative,
          startRelative + entry.time,
          this.makeBlockCssClass(entry.response.content.mimeType),
          this.buildSectionBlocks(startRelative, entry.timings),
          entry
        )
    })
    console["table"](blocks.map(b => {
      return {
        name: b.name,
        start: b.start,
        end: b.end,
        TEMP: b.cssClass,
        total: b.total
      }
    }))

    console.log(blocks)

    return {
      durationMs: doneTime,
      blocks: blocks,
      marks: [],
      lines: [],
    }
  }

  static buildSectionBlocks(startRelative: number, t: Timings) {
    // var timings = []
    return ["blocked", "dns", "connect", "send", "wait", "receive", "ssl"].reduce((collect: Array<TimeBlock>, key) => {
      if (t[key] && t[key] !== -1){
        let start = (collect.length > 0) ? collect[collect.length - 1].end : startRelative
        return collect.concat([new TimeBlock(key, start, start + t[key], "block-" + key)])
      }
      return collect
    }, [])
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
  }
}