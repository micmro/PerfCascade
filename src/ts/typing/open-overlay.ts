import TimeBlock from "./time-block"

export interface OpenOverlay {
  index: number
  defaultY: number
  block: TimeBlock
  onClose: Function
   /* instance  info **/
  actualY?: number
  height?: number
}

