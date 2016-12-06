/**
 * Creates the html for diagrams legend
 */
export function makeLegend(): HTMLUListElement {
  let ulNode = document.createElement("ul") as HTMLUListElement
  ulNode.className = "resource-legend"

  ulNode.innerHTML = `
        <li class="legend-blocked">Blocked</li>
        <li class="legend-dns">DNS</li>
        <li class="legend-ssl">SSL (TLS)</li>
        <li class="legend-connect">Connect</li>
        <li class="legend-send">Send</li>
        <li class="legend-wait">Wait</li>
        <li class="legend-receive">Receive</li>`
  return ulNode
}
