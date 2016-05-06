import TimeBlock from "../../typing/time-block"
import {Entry} from "../../typing/har.d" //TODO: Delete - temp only - need to greate source agnostic data structure

/**
 * Data to show in overlay tabs
 * @param  {number} requestID - request number
 * @param  {TimeBlock} block
 */
export function getKeys(requestID: number, block: TimeBlock) {
  //TODO: dodgy casting - will not work for other adapters
  let entry = block.rawResource as Entry

  let ifValueDefined = (value: number, fn: (number) => any) => {
    if (typeof value !== "number" || value <= 0) {
      return undefined
    }
    return fn(value)
  }

  let formatBytes = (size?: number) => ifValueDefined(size, s =>
    `${s} byte (~${Math.round(s / 1024 * 10) / 10}kb)`)
  let formatTime = (size?: number) => ifValueDefined(size, s =>
    `${s}ms`)

  let getRequestHeader = (name: string): string => {
    let header = entry.request.headers.filter(h => h.name.toLowerCase() === name.toLowerCase())[0]
    return header ? header.value : ""
  }

  let getResponseHeader = (name: string): string => {
    let header = entry.response.headers.filter(h => h.name.toLowerCase() === name.toLowerCase())[0]
    return header ? header.value : ""
  }

  /** get experimental feature */
  let getExp = (name: string): string => {
    return entry[name] || entry["_" + name] || entry.request[name] ||  entry.request["_" + name] || ""
  }

  let getExpNotNull = (name: string): string => {
    let resp = getExp(name)
    return  resp !== "0" ? resp : ""
  }

  let getExpAsByte = (name: string): string => {
    let resp = parseInt(getExp(name), 10)
    return  (isNaN(resp) || resp <= 0) ? "" : formatBytes(resp)
  }

  let getExpTimeRange = (name: string): string => {
    let ms = getExp(name + "_ms").toString()
    let start = getExp(name + "_start")
    let end = getExp(name + "_end")
    let resp = []
    if (start && end && start < end) {
      resp.push(`${start}ms - ${end}ms`)
    }
    if (ms && ms !== "-1") {
      resp.push(`(${ms}ms)`)
    }
    return resp.join(" ")
  }

  return {
    "general": {
      "Request Number": `#${requestID}`,
      "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page reqest started)",
      "Duration": formatTime(entry.time),
      "Error/Status Code": entry.response.status + " " + entry.response.statusText,
      "Server IPAddress": entry.serverIPAddress,
      "Connection": entry.connection,
      "Browser Priority": getExp("priority") || getExp("initialPriority"),
      "Initiator (Loaded by)": getExp("initiator"),
      "Initiator Line": getExp("initiator_line"),
      "Host": getRequestHeader("Host"),
      "IP": getExp("ip_addr"),
      "Client Port": getExpNotNull("client_port"),
      "Expires": getExp("expires"),
      "Cache Time": getExp("cache_time"),
      "CDN Provider": getExp("cdn_provider"),
      "ObjectSize": getExp("objectSize"),
      "Bytes In (downloaded)":  getExpAsByte("bytesIn"),
      "Bytes Out (uploaded)":  getExpAsByte("bytesOut"),
      "JPEG Scan Count": getExpNotNull("jpeg_scan_count"),
      "Gzip Total": getExpAsByte("gzip_total"),
      "Gzip Save": getExpAsByte("gzip_safe"),
      "Minify Total": getExpAsByte("minify_total"),
      "Minify Save": getExpAsByte("minify_save"),
      "Image Total": getExpAsByte("image_total"),
      "Image Save": getExpAsByte("image_save"),
    },
    "timings": {
      "Server RTT": getExpTimeRange("server_rtt"),
      "all (combined)": getExpTimeRange("all"),
      "DNS": getExpTimeRange("dns"),
      "Connect": getExpTimeRange("connect"),
      "TLS/SSL": getExpTimeRange("ssl"),
      "Load": getExpTimeRange("load"),
      "TTFB": getExpTimeRange("ttfb"),
      "Download": getExpTimeRange("download"),
    },
    "request": {
      "Method": entry.request.method,
      "HTTP Version": entry.request.httpVersion,
      "Headers Size": formatBytes(entry.request.headersSize),
      "Body Size": formatBytes(entry.request.bodySize),
      "Comment": entry.request.comment,
      "User-Agent": getRequestHeader("User-Agent"),
      "Host": getRequestHeader("Host"),
      "Connection": getRequestHeader("Connection"),
      "Accept": getRequestHeader("Accept"),
      "Accept-Encoding": getRequestHeader("Accept-Encoding"),
      "Expect": getRequestHeader("Expect"),
      "Forwarded": getRequestHeader("Forwarded"),
      "If-Modified-Since": getRequestHeader("If-Modified-Since"),
      "If-Range": getRequestHeader("If-Range"),
      "If-Unmodified-Since": getRequestHeader("If-Unmodified-Since"),
      "Querystring parameters count": entry.request.queryString.length,
      "Cookies count": entry.request.cookies.length
    },
    "response": {
      "Status": entry.response.status + " " + entry.response.statusText,
      "HTTP Version": entry.response.httpVersion,
      "Header Size": formatBytes(entry.response.headersSize),
      "Body Size": formatBytes(entry.response.bodySize),
      "Content-Type": getResponseHeader("Content-Type") + " | " + entry._contentType,
      "Cache-Control": getResponseHeader("Cache-Control"),
      "Content-Encoding": getResponseHeader("Content-Encoding"),
      "Expires": getResponseHeader("Expires"),
      "Last-Modified": getResponseHeader("Last-Modified"),
      "Pragma": getResponseHeader("Pragma"),
      "Content-Length": getResponseHeader("Content-Length"),
      "Content Size": entry.response.content.size,
      "Content Compression": entry.response.content.compression,
      "Connection": getResponseHeader("Connection"),
      "ETag": getResponseHeader("ETag"),
      "Accept-Patch": getResponseHeader("Accept-Patch"),
      "Age": getResponseHeader("Age"),
      "Allow": getResponseHeader("Allow"),
      "Content-Disposition": getResponseHeader("Content-Disposition"),
      "Location": getResponseHeader("Location"),
      "Strict-Transport-Security": getResponseHeader("Strict-Transport-Security"),
      "Trailer (for chunked transfer coding)": getResponseHeader("Trailer"),
      "Transfer-Encoding": getResponseHeader("Transfer-Encoding"),
      "Upgrade": getResponseHeader("Upgrade"),
      "Vary": getResponseHeader("Vary"),
      "Timing-Allow-Origin": getResponseHeader("Timing-Allow-Origin"),
      "Redirect URL": entry.response.redirectURL,
      "Comment": entry.response.comment
    }
  }
}
