import { WaterfallEntry } from "../../typing/waterfall";

export function createDetailsBody(requestID: number, detailsHeight: number, entry: WaterfallEntry) {

  let html = document.createElement("html") as HTMLHtmlElement;
  let body = document.createElement("body");
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
      <header class="type-${entry.requestType}">
        <h3><strong>#${requestID}</strong> <a href="${entry.url}">${entry.url}</a></h3>
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
