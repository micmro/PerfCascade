import {getHeader} from "../../helpers/har";
import {
  formatBytes, formatDateLocalized, formatMilliseconds, parseAndFormat, parseDate,
  parseNonNegative, parsePositive,
} from "../../helpers/parse";
import {Entry, Header} from "../../typing/har";
import {WaterfallEntry} from "../../typing/waterfall";

/** get experimental feature (usually WebPageTest) */
let getExp = (harEntry: Entry, name: string): string => {
  return harEntry[name] || harEntry["_" + name] || harEntry.request[name] || harEntry.request["_" + name] || "";
};

/** get experimental feature and format it as byte */
let getExpAsByte = (harEntry: Entry, name: string): string => {
  let resp = parseInt(getExp(harEntry, name), 10);
  return (isNaN(resp) || resp <= 0) ? "" : formatBytes(resp);
};

function parseGeneralDetails(entry: WaterfallEntry, requestID: number): KvTuple[] {
  const harEntry = entry.rawResource;
  return [
    ["Request Number", `#${requestID}`],
    ["Started", new Date(harEntry.startedDateTime).toLocaleString() + ((entry.start > 0) ?
      " (" + formatMilliseconds(entry.start) + " after page request started)" : "")],
    ["Duration", formatMilliseconds(harEntry.time)],
    ["Error/Status Code", harEntry.response.status + " " + harEntry.response.statusText],
    ["Server IPAddress", harEntry.serverIPAddress],
    ["Connection", harEntry.connection],
    ["Browser Priority", harEntry._priority || harEntry._initialPriority],
    ["Was pushed", harEntry._was_pushed],
    ["Initiator (Loaded by)", harEntry._initiator],
    ["Initiator Line", harEntry._initiator_line],
    ["Host", getHeader(harEntry.request.headers, "Host")],
    ["IP", harEntry._ip_addr],
    ["Client Port", parseAndFormat(harEntry._client_port, parsePositive)],
    ["Expires", harEntry._expires],
    ["Cache Time", parseAndFormat(harEntry._cache_time, parsePositive)],
    ["CDN Provider", harEntry._cdn_provider],
    ["ObjectSize", parseAndFormat(harEntry._objectSize, parsePositive, formatBytes)],
    ["Bytes In (downloaded)", getExpAsByte(harEntry, "bytesIn")],
    ["Bytes Out (uploaded)", getExpAsByte(harEntry, "bytesOut")],
    ["JPEG Scan Count", parseAndFormat(harEntry._jpeg_scan_count, parsePositive)],
    ["Gzip Total", getExpAsByte(harEntry, "gzip_total")],
    ["Gzip Save", getExpAsByte(harEntry, "gzip_save")],
    ["Minify Total", getExpAsByte(harEntry, "minify_total")],
    ["Minify Save", getExpAsByte(harEntry, "minify_save")],
    ["Image Total", getExpAsByte(harEntry, "image_total")],
    ["Image Save", getExpAsByte(harEntry, "image_save")],
  ];
}

function parseRequestDetails(harEntry: Entry): KvTuple[] {
  const request = harEntry.request;

  const stringHeader = (name: string): KvTuple => [name, getHeader(request.headers, name)];

  return [
    ["Method", request.method],
    ["HTTP Version", request.httpVersion],
    ["Bytes Out (uploaded)", getExpAsByte(harEntry, "bytesOut")],
    ["Headers Size", parseAndFormat(request.headersSize, parseNonNegative, formatBytes)],
    ["Body Size", parseAndFormat(request.bodySize, parseNonNegative, formatBytes)],
    ["Comment", request.comment],
    stringHeader("User-Agent"),
    stringHeader("Host"),
    stringHeader("Connection"),
    stringHeader("Accept"),
    stringHeader("Accept-Encoding"),
    stringHeader("Expect"),
    stringHeader("Forwarded"),
    stringHeader("If-Modified-Since"),
    stringHeader("If-Range"),
    stringHeader("If-Unmodified-Since"),
    ["Querystring parameters count", parseAndFormat(request.queryString.length, parsePositive)],
    ["Cookies count", request.cookies.length],
  ];
}

function parseResponseDetails(harEntry: Entry): KvTuple[] {
  const response = harEntry.response;
  const content = response.content;
  const headers = response.headers;

  const stringHeader = (title: string, name: string = title): KvTuple => [title, getHeader(headers, name)];
  const dateHeader = (name: string): KvTuple => {
    const header = getHeader(headers, name);
    return [name, parseAndFormat(header, parseDate, formatDateLocalized)];
  };

  const contentLength = getHeader(headers, "Content-Length");

  let contentType = getHeader(headers, "Content-Type");
  if (harEntry._contentType && harEntry._contentType !== contentType) {
    contentType = contentType + " | " + harEntry._contentType;
  }

  return [
    ["Status", response.status + " " + response.statusText],
    ["HTTP Version", response.httpVersion],
    ["Bytes In (downloaded)", getExpAsByte(harEntry, "bytesIn")],
    ["Headers Size", parseAndFormat(response.headersSize, parseNonNegative, formatBytes)],
    ["Body Size", parseAndFormat(response.bodySize, parseNonNegative, formatBytes)],
    ["Content-Type", contentType],
    stringHeader("Cache-Control"),
    stringHeader("Content-Encoding"),
    dateHeader("Expires"),
    dateHeader("Last-Modified"),
    stringHeader("Pragma"),
    ["Content-Length", parseAndFormat(contentLength, parseNonNegative, formatBytes)],
    ["Content Size", (contentLength !== content.size.toString() ? formatBytes(content.size) : "")],
    ["Content Compression", parseAndFormat(content.compression, parsePositive, formatBytes)],
    stringHeader("Connection"),
    stringHeader("ETag"),
    stringHeader("Accept-Patch"),
    stringHeader("Age"),
    stringHeader("Allow"),
    stringHeader("Content-Disposition"),
    stringHeader("Location"),
    stringHeader("Strict-Transport-Security"),
    stringHeader("Trailer (for chunked transfer coding)", "Trailer"),
    stringHeader("Transfer-Encoding"),
    stringHeader("Upgrade"),
    stringHeader("Vary"),
    stringHeader("Timing-Allow-Origin"),
    ["Redirect URL", response.redirectURL],
    ["Comment", response.comment],
  ];
}

function parseTimings(entry: WaterfallEntry): KvTuple[] {
  const timings = entry.rawResource.timings;

  const optionalTiming = (timing?: number) => parseAndFormat(timing, parseNonNegative, formatMilliseconds);

  return [
    ["Total", formatMilliseconds(entry.total)],
    ["Blocked", optionalTiming(timings.blocked)],
    ["DNS", optionalTiming(timings.dns)],
    ["Connect", optionalTiming(timings.connect)],
    ["SSL (TLS)", optionalTiming(timings.ssl)],
    ["Send", formatMilliseconds(timings.send)],
    ["Wait", formatMilliseconds(timings.wait)],
    ["Receive", formatMilliseconds(timings.receive)],
  ];
}

/** Key/Value pair in array `["key", "value"]` */
export type KvTuple = [string, string|number];

/**
 * Data to show in overlay tabs
 * @param  {number} requestID - request number
 * @param  {WaterfallEntry} entry
 */
export function getKeys(requestID: number, entry: WaterfallEntry) {
  const harEntry = entry.rawResource;
  const requestHeaders = harEntry.request.headers;
  const responseHeaders = harEntry.response.headers;

  let headerToKvTuple = (header: Header): KvTuple => [header.name, header.value];

  return {
    "general": parseGeneralDetails(entry, requestID),
    "request": parseRequestDetails(harEntry),
    "requestHeaders": requestHeaders.map(headerToKvTuple),
    "response": parseResponseDetails(harEntry),
    "responseHeaders": responseHeaders.map(headerToKvTuple),
    "timings": parseTimings(entry),
  };
}
