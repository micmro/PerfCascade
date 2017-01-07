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

function parseRequestDetails(harEntry: Entry): KvTuple[] {
  const request = harEntry.request;

  const header = (name: string) => getHeader(request.headers, name);

  return [
    ["Method", request.method],
    ["HTTP Version", request.httpVersion],
    ["Bytes Out (uploaded)", getExpAsByte(harEntry, "bytesOut")],
    ["Headers Size", formatBytes(request.headersSize)],
    ["Body Size", formatBytes(request.bodySize)],
    ["Comment", request.comment],
    ["User-Agent", header("User-Agent")],
    ["Host", header("Host")],
    ["Connection", header("Connection")],
    ["Accept", header("Accept")],
    ["Accept-Encoding", header("Accept-Encoding")],
    ["Expect", header("Expect")],
    ["Forwarded", header("Forwarded")],
    ["If-Modified-Since", header("If-Modified-Since")],
    ["If-Range", header("If-Range")],
    ["If-Unmodified-Since", header("If-Unmodified-Since")],
    ["Querystring parameters count", request.queryString.length],
    ["Cookies count", request.cookies.length],
  ];
}

function parseResponseDetails(harEntry: Entry): KvTuple[] {
  const response = harEntry.response;
  const content = response.content;

  const header = (name: string) => getHeader(response.headers, name);

  let contentType = header("Content-Type");
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
    ["Cache-Control", header("Cache-Control")],
    ["Content-Encoding", header("Content-Encoding")],
    ["Expires", formatDate(header("Expires"))],
    ["Last-Modified", formatDate(header("Last-Modified"))],
    ["Pragma", header("Pragma")],
    ["Content-Length", asIntPartial(header("Content-Length"), formatBytes)],
    ["Content Size", (header("Content-Length") !== content.size.toString() ?
      formatBytes(content.size) : "")],
    ["Content Compression", formatBytes(content.compression)],
    ["Connection", header("Connection")],
    ["ETag", header("ETag")],
    ["Accept-Patch", header("Accept-Patch")],
    ["Age", header("Age")],
    ["Allow", header("Allow")],
    ["Content-Disposition", header("Content-Disposition")],
    ["Location", header("Location")],
    ["Strict-Transport-Security", header("Strict-Transport-Security")],
    ["Trailer (for chunked transfer coding)", header("Trailer")],
    ["Transfer-Encoding", header("Transfer-Encoding")],
    ["Upgrade", header("Upgrade")],
    ["Vary", header("Vary")],
    ["Timing-Allow-Origin", header("Timing-Allow-Origin")],
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
    "general": [
      ["Request Number", `#${requestID}`],
      ["Started", new Date(harEntry.startedDateTime).toLocaleString() + " (" + formatTime(entry.start) +
      " after page request started)"],
      ["Duration", formatTime(harEntry.time)],
      ["Error/Status Code", harEntry.response.status + " " + harEntry.response.statusText],
      ["Server IPAddress", harEntry.serverIPAddress],
      ["Connection", harEntry.connection],
      ["Browser Priority", getExp(harEntry, "priority") || getExp(harEntry, "initialPriority")],
      ["Was pushed", getExp(harEntry, "was_pushed")],
      ["Initiator (Loaded by)", getExp(harEntry, "initiator")],
      ["Initiator Line", getExp(harEntry, "initiator_line")],
      ["Host", getHeader(requestHeaders, "Host")],
      ["IP", getExp(harEntry, "ip_addr")],
      ["Client Port", getExpNotNull(harEntry, "client_port")],
      ["Expires", getExp(harEntry, "expires")],
      ["Cache Time", getExp(harEntry, "cache_time")],
      ["CDN Provider", getExp(harEntry, "cdn_provider")],
      ["ObjectSize", getExp(harEntry, "objectSize")],
      ["Bytes In (downloaded)", getExpAsByte(harEntry, "bytesIn")],
      ["Bytes Out (uploaded)", getExpAsByte(harEntry, "bytesOut")],
      ["JPEG Scan Count", getExpNotNull(harEntry, "jpeg_scan_count")],
      ["Gzip Total", getExpAsByte(harEntry, "gzip_total")],
      ["Gzip Save", getExpAsByte(harEntry, "gzip_save")],
      ["Minify Total", getExpAsByte(harEntry, "minify_total")],
      ["Minify Save", getExpAsByte(harEntry, "minify_save")],
      ["Image Total", getExpAsByte(harEntry, "image_total")],
      ["Image Save", getExpAsByte(harEntry, "image_save")],
    ] as KvTuple[],
    "request": parseRequestDetails(harEntry),
    "requestHeaders": requestHeaders.map(headerToKvTuple),
    "response": parseResponseDetails(harEntry),
    "responseHeaders": responseHeaders.map(headerToKvTuple),
    "timings": parseTimings(entry),
  };
}
