import TimeBlock from '../typing/time-block'

export interface WaterfallData {
	durationMs: number,
	blocks: Array<TimeBlock>,
	marks: Array<any>,
	lines: Array<any>
}