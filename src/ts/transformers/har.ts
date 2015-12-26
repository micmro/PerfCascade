import {Har,
  Page,
  PageTimings,
  Creator,
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

    let doneTime = 0;
    //only support one page for now
    const blocks = data.entries
      .filter(entry => entry.pageref === data.pages[0].id)
      .map((entry) => {
        const currPage = data.pages.filter(page => page.id === entry.pageref)[0]
        const pageStartDate = new Date(currPage.startedDateTime)
        const entryStartDate = new Date(entry.startedDateTime)
        const startRelative = entryStartDate.getTime() - pageStartDate.getTime()

        if (doneTime < (startRelative + entry.time)){
          doneTime = startRelative + entry.time
        }

        const subModules = entry.timings

        return new TimeBlock(entry.request.url, 
          startRelative,
          startRelative + entry.time,
          this.makeBlockCssClass(entry.response.content.mimeType),
          this.buildDetailTimingBlocks(startRelative, entry.timings),
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

    return {
      durationMs: doneTime,
      blocks: blocks,
      marks: [],
      lines: [],
    }
  }

  static buildDetailTimingBlocks(startRelative: number, t: Timings): Array<TimeBlock> {
    // var timings = []
    return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce((collect: Array<TimeBlock>, key) => {
      if (t[key] && t[key] !== -1){
        const start = (collect.length > 0) ? collect[collect.length - 1].end : startRelative
        

        //special case for 'connect' && 'ssl' since they share time
        //http://www.softwareishard.com/blog/har-12-spec/#timings
        if (key === "connect" && t["ssl"] && t["ssl"] !== -1){
          return collect
            .concat([new TimeBlock("ssl", start, start + t.ssl, "block-ssl")])
            .concat([new TimeBlock(key, start + t.ssl, start + t[key], "block-" + key)])
        }

        return collect.concat([new TimeBlock(key, start, start + t[key], "block-" + key)])
      }
      return collect
    }, [])
  }
}