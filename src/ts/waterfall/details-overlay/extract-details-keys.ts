import { KvTuple } from "../../typing/misc.d";
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

/**
 * Data to show in overlay tabs
 * @param  {number} requestID - request number
 * @param  {WaterfallEntry} entry
 */
export function getKeys(requestID: number, entry: WaterfallEntry) {
  let harEntry = entry.rawResource;

  let getRequestHeader = (name: string): string => {
    let header = harEntry.request.headers.filter((h) => h.name.toLowerCase() === name.toLowerCase())[0];
    return header ? header.value : "";
  };

  let getResponseHeader = (name: string): string => {
    let header = harEntry.response.headers.filter((h) => h.name.toLowerCase() === name.toLowerCase())[0];
    return header ? header.value : "";
  };

  let getContentType = () => {
    let respContentType = getResponseHeader("Content-Type");
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
      ["Host", getRequestHeader("Host")],
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
      ["User-Agent", getRequestHeader("User-Agent")],
      ["Host", getRequestHeader("Host")],
      ["Connection", getRequestHeader("Connection")],
      ["Accept", getRequestHeader("Accept")],
      ["Accept-Encoding", getRequestHeader("Accept-Encoding")],
      ["Expect", getRequestHeader("Expect")],
      ["Forwarded", getRequestHeader("Forwarded")],
      ["If-Modified-Since", getRequestHeader("If-Modified-Since")],
      ["If-Range", getRequestHeader("If-Range")],
      ["If-Unmodified-Since", getRequestHeader("If-Unmodified-Since")],
      ["Querystring parameters count", harEntry.request.queryString.length],
      ["Cookies count", harEntry.request.cookies.length],
    ] as KvTuple[],
    "response": [
      ["Status", harEntry.response.status + " " + harEntry.response.statusText],
      ["HTTP Version", harEntry.response.httpVersion],
      ["Bytes In (downloaded)", getExpAsByte("bytesIn")],
      ["Header Size", formatBytes(harEntry.response.headersSize)],
      ["Body Size", formatBytes(harEntry.response.bodySize)],
      ["Content-Type", getContentType()],
      ["Cache-Control", getResponseHeader("Cache-Control")],
      ["Content-Encoding", getResponseHeader("Content-Encoding")],
      ["Expires", formatDate(getResponseHeader("Expires"))],
      ["Last-Modified", formatDate(getResponseHeader("Last-Modified"))],
      ["Pragma", getResponseHeader("Pragma")],
      ["Content-Length", asIntPartial(getResponseHeader("Content-Length"), formatBytes)],
      ["Content Size", (getResponseHeader("Content-Length") !== harEntry.response.content.size.toString() ?
        formatBytes(harEntry.response.content.size) : "")],
      ["Content Compression", formatBytes(harEntry.response.content.compression)],
      ["Connection", getResponseHeader("Connection")],
      ["ETag", getResponseHeader("ETag")],
      ["Accept-Patch", getResponseHeader("Accept-Patch")],
      ["Age", getResponseHeader("Age")],
      ["Allow", getResponseHeader("Allow")],
      ["Content-Disposition", getResponseHeader("Content-Disposition")],
      ["Location", getResponseHeader("Location")],
      ["Strict-Transport-Security", getResponseHeader("Strict-Transport-Security")],
      ["Trailer (for chunked transfer coding)", getResponseHeader("Trailer")],
      ["Transfer-Encoding", getResponseHeader("Transfer-Encoding")],
      ["Upgrade", getResponseHeader("Upgrade")],
      ["Vary", getResponseHeader("Vary")],
      ["Timing-Allow-Origin", getResponseHeader("Timing-Allow-Origin")],
      ["Redirect URL", harEntry.response.redirectURL],
      ["Comment", harEntry.response.comment],
    ] as KvTuple[],
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
