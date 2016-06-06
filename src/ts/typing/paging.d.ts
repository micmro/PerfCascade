import {WaterfallData} from "./waterfall-data.d"

//Callback called when the selected HAR page is changes
export interface OnPagingCb {
    (pageIndex: number, activePage: WaterfallData): any;
}
