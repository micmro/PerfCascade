import {WaterfallData} from "./waterfall";

// Callback called when the selected HAR page is changes
export type OnPagingCb = (pageIndex: number, activePage: WaterfallData) => any;
