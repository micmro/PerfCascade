import {Har,
  Page,
  PageTimings,
  Creator,
  NameValueObj,
  Cookie,
  Request,
  Content,
  Response,
  Entry
} from "../typing/har"
import TimeBlock from '../typing/time-block'
import {WaterfallData} from '../typing/waterfall-data'


export default class HarTransformer{
  static makeBlockCssClass(mimeType: string){
    let types = mimeType.split("/");
    switch (types[0]){
      case "image": return "block-image"
    }
    switch(types[1]){
      case "x-font-woff": return "block-font"
    }
    return "block-" + mimeType.split("/")[1]
  }

  static transfrom(data: Har): WaterfallData {
    console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length)
    
    //temp - TODO: remove
    window["data"] = data

    var lastEndTime = 0;
    //only support one page for now
    let blocks = data.entries
      .filter(entry => entry.pageref === data.pages[0].id)
      .map((entry) => {
        let currPage = data.pages.filter(page => page.id === entry.pageref)[0]
        let pageStartDate = new Date(currPage.startedDateTime)
        let entryStartDate = new Date(entry.startedDateTime)
        let startRelative = entryStartDate.getTime() - pageStartDate.getTime()

        if (lastEndTime < (startRelative + entry.time)){
          lastEndTime = startRelative + entry.time
        }
        return new TimeBlock(entry.request.url, startRelative, startRelative + entry.time, this.makeBlockCssClass(entry.response.content.mimeType), [], entry)
    })
    console["table"](blocks.map(b => {
      return {
        name: b.name,
        start: b.start,
        end: b.end,
        total: b.total
      }
    }))

    return {
      durationMs: lastEndTime,
      blocks: blocks,
      marks: [],
      lines: [],
    }
  }
}