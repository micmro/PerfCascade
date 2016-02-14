/**
 * Creation of sub-components used in a ressource request row
 */
import TimeBlock from "../typing/time-block"


/**
 * Interface for `Icon` metadata
 */
export interface Indicator {
  type: string,
  x: number,
  title: string
}

// helper to avoid typing out all key of the helper object
const makeIcon = function(type: string, x: number, title: string) {
  return { "type": type, "x": x, "title": title }
}

/**
 * 
 * @param  {TimeBlock} block
 * @param  {boolean} docIsSsl
 * @returns IconMetadata
 */
export function getIndicators(block: TimeBlock, docIsSsl: boolean): Indicator[] {
  const isSecure = block.name.indexOf("https://") === 0
  const iconWidth = 25
  let output = []
  let xPos = 3

  output.push(makeIcon(block.requestType, xPos, block.requestType))
  xPos += iconWidth

  if (!docIsSsl && isSecure) {
    output.push(makeIcon("lock", xPos, "Secure Connection"))
    xPos += iconWidth
  } else if (docIsSsl && !isSecure) {
    output.push(makeIcon("warning", xPos, "Insecure Connection"))
    xPos += iconWidth
  }

  return output
}
