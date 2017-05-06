import { escapeHtml, sanitizeUrlForLink } from "../../helpers/parse";
import { WaterfallEntry } from "../../typing/waterfall";

/**
 * Creates the HTML body for the overlay
 *
 * _All tabable elements are set to `tabindex="-1"` to avoid tabing issues_
 * @param requestID ID
 * @param detailsHeight
 * @param entry
 */
export function createDetailsBody(requestID: number, detailsHeight: number, entry: WaterfallEntry) {

  const html = document.createElement("html") as HTMLHtmlElement;
  const body = document.createElement("body");
  body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");

  const tabMenu = entry.tabs.map((t) => {
    return `<li><button class="tab-button">${t.title}</button></li>`;
  }).join("\n");

  const tabBody = entry.tabs.map((t) => {
    let cssClasses = "tab";
    if (t.tabClass) {
      cssClasses += ` ${t.tabClass}`;
    }
    let content = "";
    if (t.content) {
      content = t.content;
    } else if (typeof t.renderContent === "function") {
      content = t.renderContent(detailsHeight);
      // keep content for later
      t.content = content;
    } else {
      throw TypeError("Invalid Details Tab");
    }
    return `<div class="tab ${cssClasses}">${content}</div>`;
  }).join("\n");

  body.innerHTML = `
    <div class="wrapper">
      <header class="type-${entry.responseDetails.requestType}">
        <h3><strong>#${requestID}</strong> <a href="${sanitizeUrlForLink(entry.url)}">
          ${escapeHtml(entry.url)}
        </a></h3>
        <nav class="tab-nav">
          <ul>
            ${tabMenu}
          </ul>
        </nav>
      </header>
      ${tabBody}
    </div>
    `;

  html.appendChild(body);
  return html;
}
