import {WaterfallData} from "./waterfall"

//Callback called when the selected HAR page is changes
export interface OnPagingCb {
    (pageIndex: number, activePage: WaterfallData): any
}
