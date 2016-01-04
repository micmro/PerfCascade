import svg from "../helpers/svg"

/**
 *  SVG Icons
 */

var icons = {
  lock : function(x, y, width, height): SVGElement{
    let parser = new DOMParser();
    let template = `
    <svg xmlns="http://www.w3.org/2000/svg" style="overflow:visible" x="${x}" y="${y}" width="${width}" height="${height}">
      <g transform="translate(6,-1036.3622)">
        <path style="fill:#999;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;stroke-dashoffset:0"
           d="M 10 0 C 6.6862915 0 4 2.6862915 4 6 L 4 9 L 3 9 L 3 20 L 17 20 L 17 9 L 16 9 L 16 6 C 16 2.6862915 13.313708 0 10 0 z M 10 2 C 12.209139 2 14 3.7908602 14 6 L 14 9 L 6 9 L 6 6 C 6 3.7908602 7.790861 2 10 2 z "
           transform="translate(-6,1036.3622)" />
      </g>
    </svg>
    `
    var doc = parser.parseFromString(template, "image/svg+xml");
    return doc.firstChild as SVGElement
  }

}

export default icons