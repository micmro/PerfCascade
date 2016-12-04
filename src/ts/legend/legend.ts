/**
 * Creates the html for diagrams legend
 */
export function makeLegend(): HTMLUListElement {
  let ulNode = document.createElement("ul") as HTMLUListElement
  ulNode.className = "resource-legend"

  ulNode.innerHTML = `
        <li class="legend-stalled">Stalled/Blocking</li>
        <li class="legend-redirect">Redirect</li>
        <li class="legend-app-cache">App Cache</li>
        <li class="legend-dns-lookup">DNS Lookup</li>
        <li class="legend-tcp">Initial Connection (TCP)</li>
        <li class="legend-tls">TLS/SSL Negotiation</li>
        <li class="legend-ttfb">Time to First Byte</li>
        <li class="legend-download">Content Download</li>`
  return ulNode
}
