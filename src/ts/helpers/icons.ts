import * as svgLib from "./svg";
/**
 *  SVG Icons
 */

const wrapSvgIcon = (x: string | number, y: number, title: string,
                     className: string, scale: number, svgEl: SVGElement): SVGElement => {
  const holder = svgLib.newSvg("", {
    x,
    y,
  });
  const el = svgLib.newG(`icon ${className}`, {
    transform: `scale(${scale})`,
  });
  // el.innerHTML = svgDoc;
  el.appendChild(svgEl);
  el.appendChild(svgLib.newTitle(title));
  holder.appendChild(el);
  return holder;
};

let noTlsIconLazy: SVGPathElement;
export function noTls(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (noTlsIconLazy === undefined) {
    const d = `M18 6.216v2.77q0 .28-.206.486-.205.206-.486.206h-.693q-.28 0-.486-.206-.21-.205-.21
  -.487v-2.77q0-1.145-.81-1.957-.813-.81-1.96-.81-1.146 0-1.957.81-.81.812-.81 1.958v2.077h1.037q.434
  0 .737.303.302.303.302.736v6.23q0 .433-.305.736t-.737.303H1.038q-.433 0-.736-.3Q0 15.996 0
  15.56V9.33q0-.433.303-.736t.735-.303h7.27V6.218q0-2 1.422-3.423 1.423-1.423 3.424-1.423 2
  0 3.424 1.424Q18 4.214 18 6.216`;
    noTlsIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-no-tls", scale, noTlsIconLazy.cloneNode(false) as SVGPathElement);
}

let err3xxIconLazy: SVGPathElement;
export function err3xx(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (err3xxIconLazy === undefined) {
    const d = `M17 2.333V7q0 .27-.198.47-.198.197-.47.197h-4.665q-.438 0-.615-.417-.177-.406.146-.72l1.437-1.436Q11.095
  3.667 9 3.667q-1.083 0-2.068.422-.984.42-1.703 1.14-.72.715-1.14 1.7-.426.984-.426 2.07 0 1.08.422 2.065.42.984
  1.14 1.703.718.72 1.702 1.14.984.422 2.067.422 1.24 0 2.344-.54 1.104-.543 1.864-1.533.073-.105.24-.126.146 0
  .26.095l1.427 1.436q.095.084.1.214.006.13-.08.234-1.133 1.376-2.75 2.13Q10.793 17 9 17q-1.625
  0-3.104-.635-1.48-.636-2.552-1.71-1.073-1.072-1.71-2.55Q1 10.625 1 9t.635-3.104q.636-1.48 1.71-2.552
  1.072-1.073 2.55-1.71Q7.375 1 9 1q1.53 0 2.964.578 1.432.578 2.546
  1.63l1.355-1.343q.302-.323.73-.146.405.173.405.61z`;
    err3xxIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-redirect", scale, err3xxIconLazy.cloneNode(false) as SVGPathElement);
}

export function err4xx(x: number, y: number, title: string, scale: number = 1) {
  return warning(x, y, title, scale);
}

export function err5xx(x: number, y: number, title: string, scale: number = 1) {
  return warning(x, y, title, scale);
}

let plainIconLazy: SVGPathElement;
export function plain(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (plainIconLazy === undefined) {
    const d = `M15.247 4.393q.25.25.43.678.177.43.177.79v10.287q0
  .357-.25.607t-.607.25h-12q-.357 0-.607-.25t-.25-.606V1.858q0-.358.25-.608T2.997 1h8q.357 0
  .786.18.428.177.678.427zm-3.964-2.18V5.57h3.357q-.09-.256-.196-.364L11.65 2.41q-.108-.106-.367
  -.196zm3.428 13.644V6.714H11q-.357 0-.607-.25t-.25-.607V2.143h-6.86v13.714H14.71zM5.57
  8.143q0-.125.08-.205.08-.08.204-.08h6.286q.125 0 .205.08.08.08.08.205v.57q0 .126-.08.207-.08.08
  -.205.08H5.854q-.125 0-.205-.08-.08-.08-.08-.206v-.57zm6.57 2q.125 0 .205.08.08.08.08.206V11q0
  .125-.08.205-.08.08-.205.08H5.854q-.125 0-.205-.08-.08-.08-.08-.205v-.57q0-.126.08-.207.08-.08.2
  -.08h6.286zm0 2.286q.125 0 .205.08.08.08.08.2v.572q0 .125-.08.205-.08.08-.205.08H5.854q-.125 0-.205
  -.08-.08-.08-.08-.205v-.572q0-.124.08-.204.08-.08.2-.08h6.286z`;
    plainIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-plain", scale, plainIconLazy.cloneNode(false) as SVGPathElement);
}

let otherIconLazy: SVGPathElement;
export function other(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (otherIconLazy === undefined) {
    const d = `M10.8 13.5v3q0 .2-.15.35-.15.15-.35.15h-3q-.2 0-.35-.15-.15-.15-.15-.35v-3q0-.2.15-.35.15
  -.15.35-.15h3q.2 0 .35.15.15.15.15.35zM14.75 6q0 .675-.193 1.262-.193.588-.437.957-.244.365
  -.688.74-.443.375-.718.543-.275.17-.763.444-.51.286-.852.81-.344.526-.344.84 0 .21-.15.405-.15.194
  -.35.194h-3q-.186 0-.318-.23-.13-.234-.13-.47v-.564q0-1.037.812-1.956.812-.917 1.787-1.355.74-.336
  1.05-.7.314-.362.314-.95 0-.524-.583-.924-.58-.4-1.343-.4-.814 0-1.35.362-.44.312-1.34 1.437-.16.2
  -.386.2-.15 0-.313-.1L3.4 4.987q-.16-.124-.193-.312-.03-.188.07-.35Q5.277 1 9.077 1q1 0 2.01.387
  1.01.388 1.825 1.038.812.65 1.325 1.594.51.94.51 1.98z`;
    otherIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-other", scale, otherIconLazy.cloneNode(false) as SVGPathElement);
}

let javascriptIconLazy: SVGGElement;
export function javascript(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (javascriptIconLazy === undefined) {
    const d = `M13.516 2.9c-2.766 0-4.463 1.522-4.463 3.536 0 1.733 1.295 2.82 3.256 3.52
  1.413.49 1.973.926 1.973 1.644 0 .787-.647 1.296-1.873 1.296-1.137 0-2.26-.368-2.96-.736l-.54
  2.19c.665.367 1.996.734 3.344.734 3.238 0 4.744-1.68 4.744-3.658
  0-1.68-.966-2.767-3.05-3.537-1.54-.6-2.186-.93-2.186-1.68 0-.6.56-1.14 1.714-1.14
  1.137 0 1.996.33 2.45.56l.596-2.138c-.7-.332-1.663-.596-3.01-.596zm-9.032.192v7.44c0
  1.822-.702 2.33-1.822 2.33-.525 0-.997-.09-1.365-.212L1 14.805c.525.175 1.33.28 1.96.28
  2.574 0 4.185-1.173 4.185-4.534V3.097h-2.66z`;
    javascriptIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-js", scale, javascriptIconLazy.cloneNode(false) as SVGPathElement);
}

let imageIconLazy: SVGPathElement;
export function image(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (imageIconLazy === undefined) {
    const d = `M6 6q0 .75-.525 1.275Q4.95 7.8 4.2 7.8q-.75 0-1.275-.525Q2.4 6.75 2.4
  6q0-.75.525-1.275Q3.45 4.2 4.2 4.2q.75 0 1.275.525Q6 5.25 6 6zm9.6 3.6v4.2H2.4V12l3-3
  1.5 1.5 4.8-4.8zm.9-6.6h-15q-.122 0-.21.09-.09.088-.09.21v11.4q0
  .122.09.21.088.09.21.09h15q.122 0 .21-.09.09-.088.09-.21V3.3q0-.122-.09-.21Q16.623
  3 16.5 3zm1.5.3v11.4q0 .62-.44 1.06-.44.44-1.06.44h-15q-.62 0-1.06-.44Q0 15.32 0
  14.7V3.3q0-.62.44-1.06.44-.44 1.06-.44h15q.62 0 1.06.44.44.44.44 1.06z`;
    imageIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-image", scale, imageIconLazy.cloneNode(false) as SVGPathElement);
}

export function svg(x: number, y: number, title: string, scale: number = 1) {
  return image(x, y, title, scale);
}

let htmlIconLazy: SVGPathElement;
export function html(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (htmlIconLazy === undefined) {
    const d = `M5.626 13.31l-.492.492q-.098.098-.226.098t-.226-.098L.098 9.22Q0 9.12 0
  8.99q0-.127.098-.226L4.682 4.18q.098-.097.226-.097t.226.098l.492.49q.1.1.1.23t-.1.23L1.76
  8.99l3.866 3.866q.1.098.1.226t-.1.226zM11.44 2.815l-3.67
  12.7q-.04.127-.152.19-.113.065-.23.026l-.61-.162q-.13-.04-.193-.152-.064-.112-.024-.24l3.67-12.698q.04
  -.128.157-.192.113-.064.23-.025l.61.167q.13.04.193.152.063.113.023.24zM17.9
  9.22l-4.582 4.58q-.098.098-.226.098t-.226-.098l-.492-.492q-.1-.098-.1-.226t.1-.226L16.24
  8.99l-3.867-3.865q-.1-.098-.1-.226t.1-.23l.492-.49q.098-.1.226-.1t.23.1l4.58 4.583q.1.1.1.226 0 .13-.1.23z`;
    htmlIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-html", scale, htmlIconLazy.cloneNode(false) as SVGPathElement);
}

let cssIconLazy: SVGPathElement;
export function css(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (cssIconLazy === undefined) {
    const d = `M15.436.99q.625 0 1.095.416.47.415.47 1.04 0 .564-.4 1.35-2.97 5.624-4.16 6.724-.865.814
  -1.946.814-1.127 0-1.935-.827-.81-.827-.81-1.962 0-1.144.822-1.895l5.705-5.175Q14.8.99
  15.435.99zM7.31 10.232q.35.68.953 1.162.603.483 1.345.68l.01.634q.035 1.904-1.16 3.102-1.192
  1.198-3.114 1.198-1.1 0-1.948-.416-.85-.415-1.364-1.14-.514-.723-.773-1.635Q1 12.905 1
  11.85l.366.268q.304.224.555.398.25.175.53.327.277.15.41.15.368 0 .493-.33.224-.59.515-1.005.29
  -.415.62-.68.332-.263.788-.424.455-.16.92-.228.465-.066 1.118-.094z`;
    cssIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-css", scale, cssIconLazy.cloneNode(false) as SVGPathElement);
}

let warningIconLazy: SVGPathElement;
export function warning(x: number, y: number, title: string, scale: number = 1) {
  if (warningIconLazy === undefined) {
    const d = `M6 6q0 .75-.525 1.275Q4.95 7.8 4.2 7.8q-.75 0-1.275-.525Q2.4 6.75 2.4
  6q0-.75.525-1.275Q3.45 4.2 4.2 4.2q.75 0 1.275.525Q6 5.25 6 6zm9.6 3.6v4.2H2.4V12l3-3
  1.5 1.5 4.8-4.8zm.9-6.6h-15q-.122 0-.21.09-.09.088-.09.21v11.4q0
  .122.09.21.088.09.21.09h15q.122 0 .21-.09.09-.088.09-.21V3.3q0-.122-.09-.21Q16.623
  3 16.5 3zm1.5.3v11.4q0 .62-.44 1.06-.44.44-1.06.44h-15q-.62 0-1.06-.44Q0 15.32 0
  14.7V3.3q0-.62.44-1.06.44-.44 1.06-.44h15q.62 0 1.06.44.44.44.44 1.06z`;
    warningIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-warning", scale, warningIconLazy.cloneNode(false) as SVGPathElement);
}

let errorIconLazy: SVGPathElement;
export function error(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (errorIconLazy === undefined) {
    const d = `M9 1q2.177 0 4.016 1.073 1.838 1.073 2.91 2.91Q17 6.823 17 9q0 2.177-1.073 4.016-1.073
  1.838-2.91 2.91Q11.177 17 9 17q-2.177 0-4.016-1.073-1.838-1.073-2.91-2.91Q1 11.177 1 9q0-2.177 1.073-4.016
  1.073-1.838 2.91-2.91Q6.823 1 9 1zm1.333 12.99v-1.98q0-.145-.093-.244-.094-.1-.23-.1h-2q-.135 0-.24.105
  -.103.106-.103.24v1.98q0 .136.104.24.106.104.24.104h2q.137 0 .23-.1.094-.098.094-.243zm-.02-3.584l.187
  -6.468q0-.125-.104-.188-.104-.084-.25-.084H7.854q-.146 0-.25.084-.104.062-.104.188l.177 6.468q0
  .104.104.183.106.076.25.076h1.93q.146 0 .245-.078.1-.08.11-.184z`;
    errorIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-no-gzip", scale, errorIconLazy.cloneNode(false) as SVGPathElement);
}

let fontIconLazy: SVGPathElement;
export function font(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (fontIconLazy === undefined) {
    const d = `M7.97 5.754L6.338 10.08q.317 0 1.312.02.994.02 1.542.02.183 0 .548-.02-.836-2.432-1.77
  -4.345zM1 16.38l.02-.76q.22-.068.538-.12.317-.053.548-.102.23-.048.476-.14.245-.09.428-.278.182
  -.187.298-.485l2.28-5.923 2.69-6.962H9.51q.077.135.105.202l1.972 4.615q.317.75 1.02 2.476.7 1.726
  1.095 2.64.144.327.558 1.39.413 1.062.692 1.62.192.432.336.547.183.145.847.284.663.14.807.197.058.37.058.55
  0 .04-.005.13t-.005.128q-.605 0-1.827-.076-1.22-.08-1.836-.08-.73 0-2.067.07-1.337.067-1.712.076 0-.412.04
  -.75l1.258-.27q.01 0 .12-.022l.15-.033q.038-.01.14-.044.1-.034.143-.06l.1-.08q.06-.048.082-.106.024-.056.024
  -.133 0-.152-.298-.926t-.693-1.71q-.392-.93-.402-.96l-4.325-.02q-.25.56-.734 1.88-.487 1.32-.487 1.56 0
  .213.136.362.134.15.418.235.285.087.467.13.185.044.55.08.366.04.395.04.01.183.01.558 0 .087-.02.26-.558
  0-1.678-.095-1.12-.098-1.678-.098-.08 0-.26.04-.18.037-.208.037-.77.136-1.808.136Z`;
    fontIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-font", scale, fontIconLazy.cloneNode(false) as SVGPathElement);
}

let flashIconLazy: SVGPathElement;
export function flash(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (flashIconLazy === undefined) {
    const d = `M13.724 4.738q.195.216.076.476L7.96 17.73q-.142.27-.456.27-.043 0-.15-.022-.185-.054-.277
  -.205-.092-.15-.05-.325l2.132-8.74L4.765 9.8q-.044.01-.13.01-.195 0-.336-.118-.193-.162-.14-.422L6.337.346q.043
  -.15.173-.25Q6.64 0 6.81 0h3.548q.206 0 .346.135.14.135.14.32 0 .086-.053.194L8.94 5.654l4.285
  -1.06q.086-.02.13-.02.205 0 .367.16z`;
    flashIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-flash", scale, flashIconLazy.cloneNode(false) as SVGPathElement);
}

let videoIconLazy: SVGPathElement;
export function video(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (videoIconLazy === undefined) {
    const d = `M17 4.107v9.714q0 .38-.348.53-.116.05-.223.05-.25 0-.41-.17l-3.6-3.6v1.48q0 1.067-.757 1.82-.754.756
  -1.817.756H3.57q-1.06 0-1.816-.753Q1 13.17 1 12.106V5.82q0-1.06.754-1.816.755-.754 1.817-.754h6.29q1.07 0
  1.82.754.76.755.76 1.817V7.3l3.597-3.59q.16-.17.4-.17.107 0 .22.045.35.153.35.528z`;
    videoIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-video", scale, videoIconLazy.cloneNode(false) as SVGPathElement);
}

let audioIconLazy: SVGPathElement;
export function audio(x: number, y: number, title: string, scale: number = 1): SVGElement {
  if (audioIconLazy === undefined) {
    const d = `M8.385 3.756v10.46q0 .252-.183.434-.183.183-.433.183t-.44-.183l-3.2-3.202H1.61q-.25
  0-.43-.183-.18-.182-.18-.432V7.14q0-.25.182-.432.182-.183.432-.183h2.52l3.202-3.202q.182-.183.432
  -.183t.43.183q.182.183.182.433zm3.692 5.23q0 .73-.41 1.36-.407.63-1.08.9-.097.048-.24.048-.25 0
  -.434-.178-.182-.177-.182-.437 0-.21.12-.35.12-.14.28-.24.16-.1.33-.22.166-.12.28-.34.117-.22.117
  -.55 0-.33-.115-.55-.115-.224-.28-.344-.163-.12-.326-.22-.165-.1-.28-.24-.116-.14-.116-.34 0-.26.183
  -.44t.43-.176q.146 0 .24.048.676.26 1.08.894.41.636.41 1.367zm2.46 0q0 1.472-.816 2.717t-2.16 1.813q
  -.12.048-.24.048-.26 0-.44-.183-.18-.18-.18-.43 0-.37.378-.56.54-.28.73-.42.713-.52 1.11-1.302.4
  -.783.4-1.667 0-.886-.4-1.67-.4-.783-1.11-1.303-.192-.145-.73-.424-.376-.192-.376-.567 0-.25.183
  -.434.183-.18.433-.18.123 0 .25.047 1.344.567 2.16 1.812.82 1.244.82 2.716zm2.463 0q0 2.212
  -1.22 4.063-1.222 1.85-3.25 2.72-.126.05-.25.05-.25 0-.434-.19-.183-.183-.183-.433 0-.346.375
  -.568.068-.04.217-.1.15-.064.216-.1.45-.244.79-.494 1.19-.875 1.85-2.183.67-1.306.67-2.777 0
  -1.47-.663-2.78-.664-1.304-1.846-2.18-.346-.25-.79-.49-.065-.035-.214-.1-.15-.06-.22-.1
  -.375-.22-.375-.57 0-.25.183-.43.183-.182.433-.182.123 0 .25.047 2.027.876 3.25 2.727Q17 6.775 17 8.99Z`;
    audioIconLazy = svgLib.newPath(d);
  }
  return wrapSvgIcon(x, y, title, "icon-audio", scale, audioIconLazy.cloneNode(false) as SVGPathElement);
}
