/**
 *  SVG Icons
 */

var icons = {
  lock : function(x: number, y: number, title: string, scale: number = 1): SVGElement{
    const parser = new DOMParser()
    const doc = parser.parseFromString(`
    <svg x="${x}" y="${y}" xmlns="http://www.w3.org/2000/svg">
      <g class="icon icon-lock" transform="scale(${scale})">
        <g transform="scale(0.833333)">
          <path stroke-width="2" stroke-miterlimit="10" d="M9 8v-4c0-1.7-1.3-3-3-3s-3 1.3-3 3v2" fill="none"></path>
          <path d="M0 6h12v8h-12z"></path>
          <title>${title}</title>
        </g>
      </g>
    </svg>
    `, "image/svg+xml")
    return doc.firstChild as SVGElement
  }

}

export default icons