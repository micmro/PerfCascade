import {ChartOptions} from "../typing/options.d"

let optionsStore: ChartOptions

/**
 * Setup all (generic) global state
 * @param  {ChartOptions} options
 */
export function init(options: ChartOptions) {
  optionsStore = options
}

/**
 * Returns PerfCascade's init options
 * @returns ChartOptions
 */
export function getOptions(): ChartOptions {
  return optionsStore
}
