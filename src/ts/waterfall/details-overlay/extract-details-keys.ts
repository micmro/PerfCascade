import {getHeader} from "../../helpers/har";
import {Header} from "../../typing/har";
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

  let getContentType = () => {
    let respContentType = getHeader(responseHeaders, "Content-Type");
    if (harEntry._contentType && harEntry._contentType !== respContentType) {
      return respContentType + " | " + harEntry._contentType;
    }
    return respContentType;
  };

  /** get experimental feature (usually WebPageTest) */
  let getExp = (name: string): string => {
    return harEntry[name] || harEntry["_" + name] || harEntry.request[name] || harEntry.request["_" + name] || "";
  };

  let getHarTiming = (name: string): string => {
    if (harEntry.timings[name] && harEntry.timings[name] > 0) {
      return harEntry.timings[name] + " ms";
    }
    return "";
  };

  /** get experimental feature and ensure it's not a sting of `0` or `` */
  let getExpNotNull = (name: string): string => {
    let resp = getExp(name);
    return resp !== "0" ? resp : "";
  };

  /** get experimental feature and format it as byte */
  let getExpAsByte = (name: string): string => {
    let resp = parseInt(getExp(name), 10);
    return (isNaN(resp) || resp <= 0) ? "" : formatBytes(resp);
  };

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
      ["Browser Priority", getExp("priority") || getExp("initialPriority")],
      ["Was pushed", getExp("was_pushed")],
      ["Initiator (Loaded by)", getExp("initiator")],
      ["Initiator Line", getExp("initiator_line")],
      ["Host", getHeader(requestHeaders, "Host")],
      ["IP", getExp("ip_addr")],
      ["Client Port", getExpNotNull("client_port")],
      ["Expires", getExp("expires")],
      ["Cache Time", getExp("cache_time")],
      ["CDN Provider", getExp("cdn_provider")],
      ["ObjectSize", getExp("objectSize")],
      ["Bytes In (downloaded)", getExpAsByte("bytesIn")],
      ["Bytes Out (uploaded)", getExpAsByte("bytesOut")],
      ["JPEG Scan Count", getExpNotNull("jpeg_scan_count")],
      ["Gzip Total", getExpAsByte("gzip_total")],
      ["Gzip Save", getExpAsByte("gzip_safe")],
      ["Minify Total", getExpAsByte("minify_total")],
      ["Minify Save", getExpAsByte("minify_save")],
      ["Image Total", getExpAsByte("image_total")],
      ["Image Save", getExpAsByte("image_save")],
    ] as KvTuple[],
    "request": [
      ["Method", harEntry.request.method],
      ["HTTP Version", harEntry.request.httpVersion],
      ["Bytes Out (uploaded)", getExpAsByte("bytesOut")],
      ["Headers Size", formatBytes(harEntry.request.headersSize)],
      ["Body Size", formatBytes(harEntry.request.bodySize)],
      ["Comment", harEntry.request.comment],
      ["User-Agent", getHeader(requestHeaders, "User-Agent")],
      ["Host", getHeader(requestHeaders, "Host")],
      ["Connection", getHeader(requestHeaders, "Connection")],
      ["Accept", getHeader(requestHeaders, "Accept")],
      ["Accept-Encoding", getHeader(requestHeaders, "Accept-Encoding")],
      ["Expect", getHeader(requestHeaders, "Expect")],
      ["Forwarded", getHeader(requestHeaders, "Forwarded")],
      ["If-Modified-Since", getHeader(requestHeaders, "If-Modified-Since")],
      ["If-Range", getHeader(requestHeaders, "If-Range")],
      ["If-Unmodified-Since", getHeader(requestHeaders, "If-Unmodified-Since")],
      ["Querystring parameters count", harEntry.request.queryString.length],
      ["Cookies count", harEntry.request.cookies.length],
    ] as KvTuple[],
    "requestHeaders": requestHeaders.map(headerToKvTuple),
    "response": [
      ["Status", harEntry.response.status + " " + harEntry.response.statusText],
      ["HTTP Version", harEntry.response.httpVersion],
      ["Bytes In (downloaded)", getExpAsByte("bytesIn")],
      ["Header Size", formatBytes(harEntry.response.headersSize)],
      ["Body Size", formatBytes(harEntry.response.bodySize)],
      ["Content-Type", getContentType()],
      ["Cache-Control", getHeader(responseHeaders, "Cache-Control")],
      ["Content-Encoding", getHeader(responseHeaders, "Content-Encoding")],
      ["Expires", formatDate(getHeader(responseHeaders, "Expires"))],
      ["Last-Modified", formatDate(getHeader(responseHeaders, "Last-Modified"))],
      ["Pragma", getHeader(responseHeaders, "Pragma")],
      ["Content-Length", asIntPartial(getHeader(responseHeaders, "Content-Length"), formatBytes)],
      ["Content Size", (getHeader(responseHeaders, "Content-Length") !== harEntry.response.content.size.toString() ?
        formatBytes(harEntry.response.content.size) : "")],
      ["Content Compression", formatBytes(harEntry.response.content.compression)],
      ["Connection", getHeader(responseHeaders, "Connection")],
      ["ETag", getHeader(responseHeaders, "ETag")],
      ["Accept-Patch", getHeader(responseHeaders, "Accept-Patch")],
      ["Age", getHeader(responseHeaders, "Age")],
      ["Allow", getHeader(responseHeaders, "Allow")],
      ["Content-Disposition", getHeader(responseHeaders, "Content-Disposition")],
      ["Location", getHeader(responseHeaders, "Location")],
      ["Strict-Transport-Security", getHeader(responseHeaders, "Strict-Transport-Security")],
      ["Trailer (for chunked transfer coding)", getHeader(responseHeaders, "Trailer")],
      ["Transfer-Encoding", getHeader(responseHeaders, "Transfer-Encoding")],
      ["Upgrade", getHeader(responseHeaders, "Upgrade")],
      ["Vary", getHeader(responseHeaders, "Vary")],
      ["Timing-Allow-Origin", getHeader(responseHeaders, "Timing-Allow-Origin")],
      ["Redirect URL", harEntry.response.redirectURL],
      ["Comment", harEntry.response.comment],
    ] as KvTuple[],
    "responseHeaders": responseHeaders.map(headerToKvTuple),
    "timings": [
      ["Total", `${entry.total} ms`],
      ["Blocked", getHarTiming("blocked")],
      ["DNS", getHarTiming("dns")],
      ["Connect", getHarTiming("connect")],
      ["SSL (TLS)", getHarTiming("ssl")],
      ["Send", getHarTiming("send")],
      ["Wait", getHarTiming("wait")],
      ["Receive", getHarTiming("receive")],
    ] as KvTuple[],
  };
}
