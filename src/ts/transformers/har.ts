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
  static transfrom(data: Har): WaterfallData {
    console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length)
    
    //temp - TODO: remove
    window["data"] = data

    console["table"](data.entries)
    var lastEndTime = 0;
    //only support one page for now
    let blocks = data.entries
      .filter(entry => entry.pageref === data.pages[0].id)
      .map((entry) => {
        let currPage = data.pages.filter(page => page.id === entry.pageref)[0]
        let pageStartDate = new Date(currPage.startedDateTime)
        let entryStartDate = new Date(entry.startedDateTime)
        let startRelative = entryStartDate.getTime() - pageStartDate.getTime()
        console.log(startRelative)

        if (lastEndTime < (startRelative + entry.time)){
          lastEndTime = startRelative + entry.time
        }
        return new TimeBlock(entry.request.url.substr(0,20)+"...", startRelative, startRelative + entry.time, {}, [], entry)
    })
    console["table"](blocks)

    return {
      durationMs: lastEndTime,
      blocks: blocks,
      marks: [],
      lines: [],
    }
  }
}