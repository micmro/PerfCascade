
export interface HoverElements {
  endline: SVGLineElement;
  startline: SVGLineElement;
}

export interface HoverEvtListeners {
    onMouseEnterPartial(): (evt: MouseEvent) => void;
    onMouseLeavePartial(): (evt: MouseEvent) => void;
}
