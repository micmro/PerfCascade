import {WaterfallData} from "./waterfall-data.d"

//Callback called when the selected HAR page is changes
export interface onPagingCb {
    (pageIndex: number, activePage: WaterfallData): any;
}