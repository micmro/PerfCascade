/**
 *  SVG Icons
 */

const toSvg = (x: number, y: number, title: string, className: string, scale: number, svgDoc: string): SVGElement => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<svg x="${x}" y="${y}" xmlns="http://www.w3.org/2000/svg">
    <g class="icon ${className}" transform="scale(${scale})">
      ${svgDoc}
      <title>${title}</title>
    </g>
  </svg>`, "image/svg+xml")
  return doc.firstChild as SVGElement
}

export function lock(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-lock", scale, `<path d="m 6.0863646,8.2727111 5.8181784,0 0,-2.1817778 q 0,-1.2045333 -0.852275,-2.0568
  -0.852267,-0.8523555 -2.05681,-0.8523555 -1.2045512,0 -2.0568267,0.8523555 -0.8522667,0.8522667 -0.8522667,2.0568 l 0,2.1817778 z m
  9.4545434,1.0909329 0,6.545423 q 0,0.454577 -0.318178,0.772711 Q 14.904543,17 14.450001,17 L 3.5409067,17 Q 3.0863644,17
  2.7681778,16.681778 2.45,16.363644 2.45,15.909067 l 0,-6.545423 Q 2.45,8.9090667 2.7681778,8.5909333 3.0863644,8.2727111
  3.5409067,8.2727111 l 0.3636355,0 0,-2.1817778 Q 3.9045422,4 5.4045422,2.5 6.9045424,1 8.995458,1 q 2.090907,0 3.590907,1.5 1.5,1.5
  1.5,3.5909333 l 0,2.1817778 0.363636,0 q 0.454542,0 0.772729,0.3182222 0.318178,0.3181334 0.318178,0.7727107 z" />`) }


export function noTls(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-no-tls", scale, `<path d="m 18,6.2162 0,2.7692 q 0,0.2813 -0.205529,0.4868 -0.205529,0.2055
  -0.486779,0.2055 l -0.692307,0 q -0.28125,0 -0.486779,-0.2055 -0.205529,-0.2055 -0.205529,-0.4868 l 0,-2.7692 q 0,-1.1466
  -0.811298,-1.9579 -0.811298,-0.8113 -1.957933,-0.8113 -1.146634,0 -1.957933,0.8113 -0.811298,0.8113 -0.811298,1.9579 l 0,2.0769 1.038462,0
  q 0.432692,0 0.735577,0.3029 0.302884,0.3029 0.302884,0.7356 l 0,6.2307 q 0,0.4327 -0.302884,0.7356 -0.302885,0.3029 -0.735577,0.3029 l
  -10.384615,0 q -0.432693,0 -0.735577,-0.3029 Q 0,15.995 0,15.5623 L 0,9.3316 Q 0,8.8989 0.302885,8.596 0.605769,8.2931 1.038462,8.2931 l
  7.26923,0 0,-2.0769 q 0,-2.0012 1.422476,-3.4237 1.422476,-1.4225 3.423678,-1.4225 2.001202,0 3.423678,1.4225 Q 18,4.215 18,6.2162 Z" />`)
}


export function err3xx(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-redirect", scale, `<path d="M 17,2.3333333 17,7 q 0,0.2708444 -0.19792,0.4687111 -0.197911,0.1979556
-0.468747,0.1979556 l -4.666666,0 q -0.437503,0 -0.614587,-0.4166223 -0.177084,-0.4063111 0.14584,-0.7187555 L 12.635413,5.0937778 Q
11.093751,3.6666667 9,3.6666667 q -1.0833333,0 -2.0677067,0.4218666 Q 5.94792,4.5104 5.2291644,5.2291556 4.5104178,5.9479111
4.0885422,6.9322667 3.6666667,7.9167111 3.6666667,9 q 0,1.083378 0.4218755,2.067733 0.4218756,0.984356 1.1406222,1.703111 Q 5.94792,13.4896
6.9322933,13.911467 7.9166667,14.333333 9,14.333333 q 1.239582,0 2.343751,-0.541689 1.104169,-0.5416 1.864578,-1.5312 0.07289,-0.104177
0.239591,-0.125066 0.145831,0 0.260409,0.09378 l 1.427084,1.437511 q 0.09375,0.08356 0.09896,0.213511 0.0053,0.130222 -0.07813,0.2344
-1.135413,1.375022 -2.75,2.130222 Q 10.791662,17 9,17 7.3749956,17 5.8958311,16.364622 4.4166667,15.729156 3.3437511,14.656267
2.2708356,13.583378 1.6354133,12.104178 1,10.624978 1,9 1,7.3750222 1.6354133,5.8958222 2.2708356,4.4167111 3.3437511,3.3437333
4.4166667,2.2708444 5.8958311,1.6353778 7.3749956,1 9,1 q 1.531253,0 2.963538,0.5781333 1.432293,0.5781334 2.54688,1.6302223 L
15.864587,1.8646222 Q 16.166667,1.5416889 16.593751,1.7187556 17,1.8958222 17,2.3333333 Z" />`) }


export function err4xx(x: number, y: number, title: string, scale: number = 1): SVGElement { return toSvg(x, y, title, "icon-4xx", scale, `
<path d="m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096 -0.084725,-0.084 -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0
-0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l 0,1.6945 q 0,0.1248 0.084725,0.2096 0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q
0.1159402,0 0.2006658,-0.084 0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356 0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694
-0.115941,-0.098 -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098 -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757 q
0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0 0.2095847,-0.058 0.08473,-0.058 0.09364,-0.1472 z M
9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587 -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l
-13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q 1.3211891,16.1072 1.169575,15.8485 0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676
Q 8.1527449,1.8911 8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0 0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437 z" />`) }


export function err5xx(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-5xx", scale, `<path d="m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096 -0.084725,-0.084
  -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l 0,1.6945 q 0,0.1248 0.084725,0.2096
  0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084 0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356
  0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098 -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098
  -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757 q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0
  0.2095847,-0.058 0.08473,-0.058 0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587
  -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q 1.3211891,16.1072 1.169575,15.8485
  0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911 8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0
  0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437 z" />`) }


export function noCache(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-no-cache", scale, `<path d="m 9,1 q 2.177084,0 4.015627,1.0728889 1.838542,1.0729778 2.911457,2.9114667 Q
  17,6.8229333 17,9 q 0,2.177067 -1.072916,4.015644 -1.072915,1.838489 -2.911457,2.911467 Q 11.177084,17 9,17 6.8229156,17
  4.9843733,15.927111 3.1458311,14.854133 2.0729156,13.015644 1,11.177067 1,9 1,6.8229333 2.0729156,4.9843556 3.1458311,3.1458667
  4.9843733,2.0728889 6.8229156,1 9,1 Z m 1.333333,12.9896 0,-1.9792 q 0,-0.145778 -0.09375,-0.2448 -0.09375,-0.09893 -0.229164,-0.09893 l
  -2.0000001,0 q -0.1354222,0 -0.2395822,0.104177 -0.1041689,0.104178 -0.1041689,0.239556 l 0,1.9792 q 0,0.135378 0.1041689,0.239556
  0.10416,0.104177 0.2395822,0.104177 l 2.0000001,0 q 0.135413,0 0.229164,-0.09893 0.09375,-0.09902 0.09375,-0.2448 z m -0.0208,-3.583378
  0.187503,-6.4687109 q 0,-0.1249778 -0.104169,-0.1874667 -0.104169,-0.083556 -0.25,-0.083556 l -2.2916626,0 q -0.14584,0 -0.25,0.083556
  -0.1041688,0.062222 -0.1041688,0.1874667 L 7.67712,10.406222 q 0,0.104178 0.1041689,0.182311 0.10416,0.07822 0.25,0.07822 l 1.9270755,0 q
  0.1458396,0 0.2447996,-0.07822 0.09895,-0.07822 0.109369,-0.182311 z" />`) }


export function noGzip(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-no-gzip", scale, ` <path d="m 9,1 q 2.177084,0 4.015627,1.0728889 1.838542,1.0729778 2.911457,2.9114667 Q
  17,6.8229333 17,9 q 0,2.177067 -1.072916,4.015644 -1.072915,1.838489 -2.911457,2.911467 Q 11.177084,17 9,17 6.8229156,17
  4.9843733,15.927111 3.1458311,14.854133 2.0729156,13.015644 1,11.177067 1,9 1,6.8229333 2.0729156,4.9843556 3.1458311,3.1458667
  4.9843733,2.0728889 6.8229156,1 9,1 Z m 1.333333,12.9896 0,-1.9792 q 0,-0.145778 -0.09375,-0.2448 -0.09375,-0.09893 -0.229164,-0.09893 l
  -2.0000001,0 q -0.1354222,0 -0.2395822,0.104177 -0.1041689,0.104178 -0.1041689,0.239556 l 0,1.9792 q 0,0.135378 0.1041689,0.239556
  0.10416,0.104177 0.2395822,0.104177 l 2.0000001,0 q 0.135413,0 0.229164,-0.09893 0.09375,-0.09902 0.09375,-0.2448 z m -0.0208,-3.583378
  0.187503,-6.4687109 q 0,-0.1249778 -0.104169,-0.1874667 -0.104169,-0.083556 -0.25,-0.083556 l -2.2916626,0 q -0.14584,0 -0.25,0.083556
  -0.1041688,0.062222 -0.1041688,0.1874667 L 7.67712,10.406222 q 0,0.104178 0.1041689,0.182311 0.10416,0.07822 0.25,0.07822 l 1.9270755,0 q
  0.1458396,0 0.2447996,-0.07822 0.09895,-0.07822 0.109369,-0.182311 z" />`) }


export function plain(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-plain", scale, `<path d="m 17.20312,4.4531 q 0.32813,0.3282 0.5625,0.8907 Q 18,5.9063 18,6.375 l 0,13.5
  q 0,0.4688 -0.32813,0.7969 Q 17.34375,21 16.875,21 L 1.125,21 Q 0.65625,21 0.32812,20.6719 0,20.3438 0,19.875 L 0,1.125 Q 0,0.6563
  0.32812,0.3281 0.65625,0 1.125,0 l 10.5,0 q 0.46875,0 1.03125,0.2344 0.5625,0.2344 0.89062,0.5625 z M 12,1.5938 12,6 16.40625,6 Q
  16.28906,5.6602 16.14844,5.5195 L 12.48047,1.8516 Q 12.33984,1.7109 12,1.5938 Z m 4.5,17.9062 0,-12 -4.875,0 Q 11.15625,7.5
  10.82812,7.1719 10.5,6.8438 10.5,6.375 l 0,-4.875 -9,0 0,18 15,0 z M 4.5,9.375 Q 4.5,9.2109 4.60547,9.1055 4.71094,9 4.875,9 l 8.25,0 Q
  13.28906,9 13.39453,9.1055 13.5,9.2109 13.5,9.375 l 0,0.75 q 0,0.1641 -0.10547,0.2695 Q 13.28906,10.5 13.125,10.5 l -8.25,0 Q 4.71094,10.5
  4.60547,10.3945 4.5,10.2891 4.5,10.125 l 0,-0.75 z M 13.125,12 q 0.16406,0 0.26953,0.1055 Q 13.5,12.2109 13.5,12.375 l 0,0.75 q 0,0.1641
  -0.10547,0.2695 Q 13.28906,13.5 13.125,13.5 l -8.25,0 Q 4.71094,13.5 4.60547,13.3945 4.5,13.2891 4.5,13.125 l 0,-0.75 Q 4.5,12.2109
  4.60547,12.1055 4.71094,12 4.875,12 l 8.25,0 z m 0,3 q 0.16406,0 0.26953,0.1055 Q 13.5,15.2109 13.5,15.375 l 0,0.75 q 0,0.1641
  -0.10547,0.2695 Q 13.28906,16.5 13.125,16.5 l -8.25,0 Q 4.71094,16.5 4.60547,16.3945 4.5,16.2891 4.5,16.125 l 0,-0.75 Q 4.5,15.2109
  4.60547,15.1055 4.71094,15 4.875,15 l 8.25,0 z" />`) }


export function other(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-other", scale, `<path
     d="m 10.801185,13.499991 0,3.000034 q 0,0.199966 -0.149997,0.350003 Q 10.501188,17 10.301185,17 l -2.9999954,0 q -0.200003,0
     -0.350002,-0.149972 -0.149998,-0.150037 -0.149998,-0.350003 l 0,-3.000034 q 0,-0.199966 0.149998,-0.350004 0.149999,-0.149972
     0.350002,-0.149972 l 2.9999954,0 q 0.200003,0 0.350003,0.149972 0.149997,0.150038 0.149997,0.350004 z m 3.950001,-7.4999953 q
     0,0.6749751 -0.193752,1.2624809 -0.193746,0.5875065 -0.437493,0.956246 Q 13.876188,8.587526 13.43244,8.9624908 12.988685,9.337519
     12.713687,9.506231 12.43869,9.675006 11.951191,9.949989 q -0.5125,0.287495 -0.856252,0.8125 -0.343749,0.525 -0.343749,0.837523
     0,0.212477 -0.150001,0.406217 -0.150004,0.193802 -0.349999,0.193802 l -3.0000054,0 q -0.187495,0 -0.318749,-0.231277
     -0.131246,-0.231284 -0.131246,-0.468725 l 0,-0.562543 q 0,-1.037488 0.812497,-1.9562566 Q 8.4261846,8.0625246 9.4011886,7.6249911
     10.138688,7.287504 10.451185,6.9249894 10.76369,6.5624748 10.76369,5.9750331 q 0,-0.525002 -0.58125,-0.9250582 -0.5812494,-0.3999918
     -1.3437494,-0.3999918 -0.812504,0 -1.35,0.3625146 -0.437502,0.3125237 -1.3375,1.4374811 -0.162499,0.2000281 -0.387504,0.2000281
     -0.149997,0 -0.312498,-0.099982 L 3.4011866,4.9875343 Q 3.2386866,4.8625246 3.2074416,4.6750106 3.1761886,4.4874957 3.2761906,4.3250097
     5.2761886,1 9.0761896,1 q 0.9999984,0 2.0124974,0.3874782 1.012501,0.3875423 1.825003,1.0375531 0.812497,0.649947 1.324997,1.5937436
     0.512499,0.9437319 0.512499,1.9812208 z" /> `) }


export function javascript(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-js", scale, `<g transform="matrix(0.03159732,0,0,0.03159732,0.93993349,0.955184)" id="Layer_1"><g><path
  d="m 112.155,67.644 84.212,0 0,236.019 c 0,106.375 -50.969,143.497 -132.414,143.497 -19.944,0 -45.429,-3.324 -62.052,-8.864 L 11.32,370.15
  c 11.635,3.878 26.594,6.648 43.214,6.648 35.458,0 57.621,-16.068 57.621,-73.687 l 0,-235.467 z" /><path id="path9" d="m 269.484,354.634 c
  22.161,11.635 57.62,23.27 93.632,23.27 38.783,0 59.282,-16.066 59.282,-40.998 0,-22.715 -17.729,-36.565 -62.606,-52.079 -62.053,-22.162
  -103.05,-56.512 -103.05,-111.36 0,-63.715 53.741,-111.917 141.278,-111.917 42.662,0 73.132,8.313 95.295,18.838 l -18.839,67.592 c
  -14.404,-7.201 -41.553,-17.729 -77.562,-17.729 -36.567,0 -54.297,17.175 -54.297,36.013 0,23.824 20.499,34.349 69.256,53.188 65.928,24.378
  96.4,58.728 96.4,111.915 0,62.606 -47.647,115.794 -150.143,115.794 -42.662,0 -84.77,-11.636 -105.82,-23.27 l 17.174,-69.257 z"
  /></g></g>`) }


export function image(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-image", scale, `<path d="M 6,6 Q 6,6.75 5.475,7.275 4.95,7.8 4.2,7.8 3.45,7.8 2.925,7.275 2.4,6.75 2.4,6
  2.4,5.25 2.925,4.725 3.45,4.2 4.2,4.2 4.95,4.2 5.475,4.725 6,5.25 6,6 Z m 9.6,3.6 0,4.2 -13.2,0 0,-1.8 3,-3 1.5,1.5 4.8,-4.8 z M 16.5,3
  1.5,3 Q 1.378125,3 1.289063,3.089 1.200003,3.178 1.200003,3.2999 l 0,11.4 q 0,0.1219 0.08906,0.2109 0.08906,0.089 0.210937,0.089 l 15,0 q
  0.121875,0 0.210938,-0.089 0.08906,-0.089 0.08906,-0.2109 l 0,-11.4 q 0,-0.1219 -0.08906,-0.2109 Q 16.621878,3 16.5,3 Z m 1.5,0.3 0,11.4 q
  0,0.6188 -0.440625,1.0594 Q 17.11875,16.2 16.5,16.2 l -15,0 Q 0.88125,16.2 0.440625,15.7594 0,15.3188 0,14.7 L 0,3.3 Q 0,2.6813
  0.440625,2.2406 0.88125,1.8 1.5,1.8 l 15,0 q 0.61875,0 1.059375,0.4406 Q 18,2.6813 18,3.3 Z" />`) }


export function html(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-html", scale, `<path d="m 5.62623,13.310467 -0.491804,0.4919 q -0.09836,0.098 -0.226229,0.098 -0.127869,0
  -0.22623,-0.098 L 0.098361,9.218667 Q 0,9.120367 0,8.992467 q 0,-0.1279 0.09836,-0.2262 l 4.583606,-4.5836 q 0.09836,-0.098 0.22623,-0.098
0.127869,0 0.226229,0.098 l 0.491804,0.4918 q 0.09836,0.098 0.09836,0.2262 0,0.1279 -0.09836,0.2262 l -3.865574,3.8656 3.865574,3.8656 q
0.09836,0.098 0.09836,0.2262 0,0.1279 -0.09836,0.2262 z m 5.813114,-10.495 -3.668852,12.6983 q -0.03934,0.1279 -0.152459,0.1918
-0.113115,0.064 -0.231148,0.025 l -0.609836,-0.1672 q -0.127869,-0.039 -0.191803,-0.1525 -0.06393,-0.1131 -0.02459,-0.2409 l
3.668852,-12.6984 q 0.03934,-0.1279 0.152459,-0.1918 0.113115,-0.064 0.231148,-0.025 l 0.609836,0.1672 q 0.127869,0.039 0.191803,0.1525
0.06393,0.1131 0.02459,0.241 z m 6.462295,6.4032 -4.583606,4.5837 q -0.09836,0.098 -0.22623,0.098 -0.127869,0 -0.226229,-0.098 l
-0.491804,-0.4919 q -0.09836,-0.098 -0.09836,-0.2262 0,-0.1278 0.09836,-0.2262 l 3.865574,-3.8656 -3.865574,-3.8656 q -0.09836,-0.098
-0.09836,-0.2262 0,-0.1279 0.09836,-0.2262 l 0.491804,-0.4918 q 0.09836,-0.098 0.226229,-0.098 0.127869,0 0.22623,0.098 l 4.583606,4.5836 Q
18,8.864567 18,8.992467 q 0,0.1279 -0.09836,0.2262 z" />`) }


export function css(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-css", scale, `<path d="m 15.435754,0.98999905 q 0.625698,0 1.094972,0.41564445 Q 17,1.8212879
  17,2.4469768 q 0,0.5631111 -0.402235,1.3496889 -2.967597,5.6224 -4.156425,6.7217783 -0.867039,0.813421 -1.948602,0.813421 -1.1262576,0
  -1.9351961,-0.826755 -0.8089385,-0.8268443 -0.8089385,-1.9620443 0,-1.1441778 0.8223463,-1.8949333 L 14.273743,1.4726657 Q
  14.801117,0.98999905 15.435754,0.98999905 Z M 7.3106145,10.232488 q 0.3486034,0.679289 0.9519554,1.161955 0.6033519,0.482666
  1.3452513,0.679378 l 0.00894,0.634577 q 0.035753,1.903911 -1.1575432,3.101689 -1.1932962,1.197778 -3.115084,1.197778 -1.0994413,0
  -1.9486032,-0.415644 Q 2.5463687,16.176576 2.0324022,15.452576 1.5184357,14.728576 1.2592179,13.816843 1,12.905109 1,11.850354 q
  0.06257,0.04444 0.3664804,0.268089 0.3039107,0.223466 0.55419,0.397778 0.2502793,0.174311 0.5273743,0.326311 0.2770949,0.151911
  0.4111732,0.151911 0.3664804,0 0.4916201,-0.330756 0.2234637,-0.589866 0.5139664,-1.005511 0.2905029,-0.415644 0.6212291,-0.679377
  0.3307262,-0.263644 0.7865922,-0.424533 0.4558659,-0.160889 0.9206704,-0.228 0.4648044,-0.06667 1.1173184,-0.09378 z" />`) }


export function warning(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-warning", scale, `<path d="m 10.141566,13.833 0,-1.6945 q 0,-0.1249 -0.08472,-0.2096 -0.084725,-0.084
  -0.2006658,-0.084 l -1.7123482,0 q -0.1159402,0 -0.2006658,0.084 -0.084725,0.084 -0.084725,0.2096 l 0,1.6945 q 0,0.1248 0.084725,0.2096
  0.084725,0.084 0.2006658,0.084 l 1.7123482,0 q 0.1159402,0 0.2006658,-0.084 0.08472,-0.084 0.08472,-0.2096 z m -0.01784,-3.3356
  0.160533,-4.0936 q 0,-0.107 -0.08919,-0.1694 -0.115941,-0.098 -0.2140439,-0.098 l -1.9620656,0 q -0.098103,0 -0.2140436,0.098
  -0.089185,0.062 -0.089185,0.1873 l 0.1516221,4.0757 q 0,0.089 0.089185,0.1472 0.089185,0.058 0.2140435,0.058 l 1.6499188,0 q 0.1248588,0
  0.2095847,-0.058 0.08473,-0.058 0.09364,-0.1472 z M 9.9988702,2.1676 16.848263,14.7248 q 0.312147,0.5619 -0.01784,1.1237 -0.151614,0.2587
  -0.414709,0.4103 -0.263093,0.1516 -0.566321,0.1516 l -13.6987852,0 q -0.3032283,0 -0.5663235,-0.1516 Q 1.3211891,16.1072 1.169575,15.8485
  0.83959124,15.2867 1.151738,14.7248 L 8.0011307,2.1676 Q 8.1527449,1.8911 8.4202993,1.7306 8.6878537,1.57 9.0000005,1.57 q 0.3121468,0
  0.5797012,0.1606 0.2675544,0.1605 0.4191685,0.437 z" />`) }


export function font(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-font", scale, `<path d="M 7.9711534,5.7542664 6.3365384,10.0812 q 0.3173075,0 1.3124995,0.01956
  0.9951928,0.01956 1.5432692,0.01956 0.1826924,0 0.5480773,-0.01956 Q 8.9038458,7.6680441 7.9711534,5.754622 Z M 1,16.379245
  1.0192356,15.619601 q 0.2211537,-0.06756 0.5384613,-0.120178 0.3173075,-0.05245 0.5480764,-0.100978 0.2307697,-0.048 0.4759617,-0.139378
  0.245192,-0.09138 0.4278844,-0.278844 0.1826925,-0.187556 0.2980774,-0.4856 L 5.5865429,8.5715107 8.2788503,1.61 l 1.2307688,0 q
  0.076924,0.1346666 0.1057698,0.2019555 L 11.586543,6.427333 q 0.317307,0.7499556 1.01923,2.475911 0.701923,1.726045 1.096153,2.639467
  0.144232,0.326934 0.557693,1.389423 0.413462,1.062489 0.692307,1.620178 0.192309,0.432711 0.336539,0.548089 0.182692,0.144266
  0.846154,0.283644 0.663462,0.139467 0.807692,0.197156 Q 17,15.946534 17,16.129289 q 0,0.03822 -0.0048,0.124978 -0.0048,0.08622
  -0.0048,0.124978 -0.60577,0 -1.826923,-0.07644 -1.221154,-0.07733 -1.836539,-0.07733 -0.730769,0 -2.067307,0.06756 -1.3365382,0.06755
  -1.7115381,0.07733 0,-0.413511 0.038462,-0.750044 L 10.84617,15.351076 q 0.0096,0 0.120192,-0.024 0.110577,-0.024 0.149039,-0.03378
  0.03846,-0.0098 0.139423,-0.04356 0.100961,-0.03378 0.144231,-0.06222 0.04327,-0.02933 0.105769,-0.07733 0.0625,-0.048 0.08653,-0.105777
  0.02403,-0.05778 0.02403,-0.134578 0,-0.153867 -0.298077,-0.927911 -0.298068,-0.774053 -0.692299,-1.706764 -0.394231,-0.932623
  -0.403846,-0.961512 l -4.3269223,-0.01956 q -0.25,0.55769 -0.7355768,1.879823 -0.4855769,1.322044 -0.4855769,1.562489 0,0.211555
  0.1346151,0.360533 0.1346151,0.149067 0.4182693,0.235556 0.2836533,0.08622 0.4663458,0.129866 0.1826924,0.04356 0.5480773,0.08178
  0.365384,0.03822 0.3942302,0.03822 0.00962,0.182667 0.00962,0.557689 0,0.08622 -0.019236,0.259644 -0.5576924,0 -1.6778843,-0.09618
  -1.1201929,-0.09618 -1.6778844,-0.09618 -0.076924,0 -0.254808,0.03822 -0.1778844,0.03822 -0.2067306,0.03822 Q 2.0384613,16.379245
  1,16.379245 Z" />`)
}


export function flash(x: number, y: number, title: string, scale: number = 1): SVGElement {
  return toSvg(x, y, title, "icon-flash", scale, `<path d="m 13.724296,4.737962 q 0.194716,0.216309 0.07572,0.475924 L 7.958654,17.729559
  Q 7.818031,18 7.504329,18 7.461078,18 7.352885,17.97846 7.16899,17.924378 7.0770425,17.772918 6.9850949,17.621512 7.0283513,17.4484 L
  9.15937,8.708015 4.7675305,9.800549 q -0.043251,0.01077 -0.1298072,0.01077 -0.1947161,0 -0.3353388,-0.118981 -0.1947107,-0.162286
  -0.140628,-0.4219 L 6.3360428,0.34617 Q 6.3792939,0.194711 6.5091226,0.097382 6.6389298,0 6.8120043,0 l 3.5480877,0 q 0.205532,0
  0.346154,0.135193 0.140628,0.135248 0.140628,0.319132 0,0.08656 -0.05409,0.194711 l -1.849763,5.008456 4.283664,-1.06011 q
  0.08654,-0.02154 0.129807,-0.02154 0.205532,0 0.367791,0.162285 z" />`) }
