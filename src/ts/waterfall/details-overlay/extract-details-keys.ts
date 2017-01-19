import {getHeader} from "../../helpers/har";
import {Entry, Header} from "../../typing/har";
import {WaterfallEntry} from "../../typing/waterfall";

let ifValueDefined = (value: number, fn: (_: number) => any) => {
  if (!isFinite(value) || value <= 0) {
    return undefined;
  }
  return fn(value);
};

let formatBytes = (size?: number) => ifValueDefined(size, (s) => `${s} byte (~${Math.round(s / 1024 * 10) / 10}kb)`);

let formatTime = (size?: number) => ifValueDefined(size, (s) => `${s} ms`);

let formatDate = (date?: string) => {
  if (!date) {
    return "";
  }
  let dateToFormat = new Date(date);
  return `${date} </br>(local time: ${dateToFormat.toLocaleString()})`;
};

let asIntPartial = (val: string, ifIntFn: (_: number) => any) => {
  let v = parseInt(val, 10);
  return ifValueDefined(v, ifIntFn);
};

/** get experimental feature (usually WebPageTest) */
let getExp = (harEntry: Entry, name: string): string => {
  return harEntry[name] || harEntry["_" + name] || harEntry.request[name] || harEntry.request["_" + name] || "";
};

/** get experimental feature and ensure it's not a sting of `0` or `` */
let getExpNotNull = (harEntry: Entry, name: string): string => {
  let resp = getExp(harEntry, name);
  return resp !== "0" ? resp : "";
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
    " (" + formatTime(entry.start) + " after page request started)" : "")],
    ["Duration", formatTime(harEntry.time)],
    ["Error/Status Code", harEntry.response.status + " " + harEntry.response.statusText],
    ["Server IPAddress", harEntry.serverIPAddress],
    ["Connection", harEntry.connection],
    ["Browser Priority", harEntry._priority || harEntry._initialPriority],
    ["Was pushed", harEntry._was_pushed],
    ["Initiator (Loaded by)", harEntry._initiator],
    ["Initiator Line", harEntry._initiator_line],
    ["Host", getHeader(harEntry.request.headers, "Host")],
    ["IP", harEntry._ip_addr],
    ["Client Port", harEntry._client_port],
    ["Expires", harEntry._expires],
    ["Cache Time", harEntry._cache_time],
    ["CDN Provider", harEntry._cdn_provider],
    ["ObjectSize", harEntry._objectSize],
    ["Bytes In (downloaded)", getExpAsByte(harEntry, "bytesIn")],
    ["Bytes Out (uploaded)", getExpAsByte(harEntry, "bytesOut")],
    ["JPEG Scan Count", getExpNotNull(harEntry, "jpeg_scan_count")],
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
    ["Headers Size", formatBytes(request.headersSize)],
    ["Body Size", formatBytes(request.bodySize)],
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
    ["Querystring parameters count", request.queryString.length],
    ["Cookies count", request.cookies.length],
  ];
}

function parseResponseDetails(harEntry: Entry): KvTuple[] {
  const response = harEntry.response;
  const content = response.content;
  const headers = response.headers;

  const stringHeader = (title: string, name: string = title): KvTuple => [title, getHeader(headers, name)];
  const dateHeader = (name: string): KvTuple => [name, formatDate(getHeader(headers, name))];

  const contentLength = getHeader(headers, "Content-Length");

  let contentType = getHeader(headers, "Content-Type");
  if (harEntry._contentType && harEntry._contentType !== contentType) {
    contentType = contentType + " | " + harEntry._contentType;
  }

  return [
    ["Status", response.status + " " + response.statusText],
    ["HTTP Version", response.httpVersion],
    ["Bytes In (downloaded)", getExpAsByte(harEntry, "bytesIn")],
    ["Header Size", formatBytes(response.headersSize)],
    ["Body Size", formatBytes(response.bodySize)],
    ["Content-Type", contentType],
    stringHeader("Cache-Control"),
    stringHeader("Content-Encoding"),
    dateHeader("Expires"),
    dateHeader("Last-Modified"),
    stringHeader("Pragma"),
    ["Content-Length", asIntPartial(contentLength, formatBytes)],
    ["Content Size", (contentLength !== content.size.toString() ? formatBytes(content.size) : "")],
    ["Content Compression", formatBytes(content.compression)],
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

  // FIXME should only filter -1 values here, 0 is a valid timing.
  return [
    ["Total", `${entry.total} ms`],
    ["Blocked", formatTime(timings["blocked"])],
    ["DNS", formatTime(timings["dns"])],
    ["Connect", formatTime(timings["connect"])],
    ["SSL (TLS)", formatTime(timings["ssl"])],
    ["Send", formatTime(timings["send"])],
    ["Wait", formatTime(timings["wait"])],
    ["Receive", formatTime(timings["receive"])],
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
