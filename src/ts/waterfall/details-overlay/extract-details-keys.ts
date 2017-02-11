import {getHeader} from "../../helpers/har";
import {
  formatBytes, formatDateLocalized, formatMilliseconds, formatSeconds, parseAndFormat, parseDate, parseNonEmpty,
  parseNonNegative, parsePositive,
} from "../../helpers/parse";
import {Entry, Header} from "../../typing/har";
import {WaterfallEntry} from "../../typing/waterfall";

const byteSizeProperty = (title: string, input: string | number): KvTuple => {
  return [title, parseAndFormat(input, parsePositive, formatBytes)];
};
const countProperty = (title: string, input: string | number): KvTuple => {
  return [title, parseAndFormat(input, parsePositive)];
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
    ["Was pushed", parseAndFormat(harEntry._was_pushed, parsePositive, () => "yes")],
    ["Initiator (Loaded by)", harEntry._initiator],
    ["Initiator Line", harEntry._initiator_line],
    ["Host", getHeader(harEntry.request.headers, "Host")],
    ["IP", harEntry._ip_addr],
    ["Client Port", parseAndFormat(harEntry._client_port, parsePositive)],
    ["Expires", harEntry._expires],
    ["Cache Time", parseAndFormat(harEntry._cache_time, parsePositive, formatSeconds)],
    ["CDN Provider", harEntry._cdn_provider],
    byteSizeProperty("ObjectSize", harEntry._objectSize),
    byteSizeProperty("Bytes In (downloaded)", harEntry._bytesIn),
    byteSizeProperty("Bytes Out (uploaded)", harEntry._bytesOut),
    byteSizeProperty("JPEG Scan Count", harEntry._jpeg_scan_count),
    byteSizeProperty("Gzip Total", harEntry._gzip_total),
    byteSizeProperty("Gzip Save", harEntry._gzip_save),
    byteSizeProperty("Minify Total", harEntry._minify_total),
    byteSizeProperty("Minify Save", harEntry._minify_save),
    byteSizeProperty("Image Total", harEntry._image_total),
    byteSizeProperty("Image Save", harEntry._image_save),
  ];
}

function parseRequestDetails(harEntry: Entry): KvTuple[] {
  const request = harEntry.request;

  const stringHeader = (name: string): KvTuple => [name, getHeader(request.headers, name)];

  return [
    ["Method", request.method],
    ["HTTP Version", request.httpVersion],
    byteSizeProperty("Bytes Out (uploaded)", harEntry._bytesOut),
    byteSizeProperty("Headers Size", request.headersSize),
    byteSizeProperty("Body Size", request.bodySize),
    ["Comment", parseAndFormat(request.comment, parseNonEmpty)],
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
    countProperty("Querystring parameters count", request.queryString.length),
    countProperty("Cookies count", request.cookies.length),
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
  let contentSize = undefined;
  if (content.size !== -1 && contentLength !== content.size.toString()) {
    contentSize = content.size;
  }

  let contentType = getHeader(headers, "Content-Type");
  if (harEntry._contentType && harEntry._contentType !== contentType) {
    contentType = contentType + " | " + harEntry._contentType;
  }

  return [
    ["Status", response.status + " " + response.statusText],
    ["HTTP Version", response.httpVersion],
    byteSizeProperty("Bytes In (downloaded)", harEntry._bytesIn),
    byteSizeProperty("Headers Size", response.headersSize),
    byteSizeProperty("Body Size", response.bodySize),
    ["Content-Type", contentType],
    stringHeader("Cache-Control"),
    stringHeader("Content-Encoding"),
    dateHeader("Expires"),
    dateHeader("Last-Modified"),
    stringHeader("Pragma"),
    byteSizeProperty("Content-Length", contentLength),
    byteSizeProperty("Content Size", contentSize),
    byteSizeProperty("Content Compression", content.compression),
    stringHeader("Connection"),
    stringHeader("ETag"),
    stringHeader("Accept-Patch"),
    ["Age", parseAndFormat(getHeader(headers, "Age"), parseNonNegative, formatSeconds)],
    stringHeader("Allow"),
    stringHeader("Content-Disposition"),
    stringHeader("Location"),
    stringHeader("Strict-Transport-Security"),
    stringHeader("Trailer (for chunked transfer coding)", "Trailer"),
    stringHeader("Transfer-Encoding"),
    stringHeader("Upgrade"),
    stringHeader("Vary"),
    stringHeader("Timing-Allow-Origin"),
    ["Redirect URL", parseAndFormat(response.redirectURL, parseNonEmpty)],
    ["Comment", parseAndFormat(response.comment, parseNonEmpty)],
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
export type KvTuple = [string, string];

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
