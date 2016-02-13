/**
 * Creation of sub-components used in a ressource request row
 */

import svg from "../helpers/svg"
import TimeBlock from "../typing/time-block"


/**
 * Interface for `createRect` parameter
 */
export interface Icon {
  type: string,
  x: number,
  title: string
}

const makeIcon = function( type: string, x: number, title: string) {
  return {"type": type, "x": x, "title": title}
}

export function getIndicators(block: TimeBlock, docIsSsl: boolean): Icon[] {
  const isSecure = block.name.indexOf("https://") === 0
  const iconWidth = 25
  var output = []
  var xPos = 3
  console.log(block.requestType)
  output.push(makeIcon( block.requestType, xPos,  block.requestType))
  xPos += iconWidth
   
  if(!docIsSsl && isSecure){
    
    xPos += iconWidth
  } else if(docIsSsl && !isSecure){
    output.push(makeIcon("warning", xPos, "Insecure Connection"))
    xPos += iconWidth
  }
  
  return output
}