/**
 * Based on the HAR 1.2 Spec
 * http://www.softwareishard.com/blog/har-12-spec/
 */

//http://www.softwareishard.com/blog/har-12-spec/#log
export interface Har {
  version: string
  creator: Creator
  browser?: Browser
  pages?: Array<Page>
  entries: Array<Entry>
  comment?: string
  label?: string //TODO: Verify if this does exist
}

// http://www.softwareishard.com/blog/har-12-spec/#creator
export interface Creator {
  name: string
  version: string
}

// http://www.softwareishard.com/blog/har-12-spec/#browser
export interface Browser {
  name: string
  version: string
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#pages
export interface Page {
  startedDateTime: string //YYYY-MM-DDThh:mm:ss.sTZD
  id: string
  title: string
  pageTimings: PageTimings
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#pageTimings
export interface PageTimings {
  onContentLoad?: number
  onLoad?: number
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#entries
export interface Entry {
  pageref?: string
  startedDateTime: string //YYYY-MM-DDThh:mm:ss.sTZD
  time: number
  request: Request
  response: Response
  cache: Cache
  timings: Timings
  serverIPAddress?: string
  connection?: string
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#request
export interface Request {
  method: string
  url: string
  httpVersion: string
  cookies: Array<Cookie>
  headers: Array<Header>
  queryString: Array<QueryString>
  postData?: PostData
  headersSize: number
  bodySize: number
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#response
export interface Response {
  status: number
  statusText: string
  httpVersion: string
  cookies: Array<Cookie>
  headers: Array<Header>
  content: Content
  redirectURL: string
  headersSize: number
  bodySize: number
  comment?: string
  _transferSize?: number
}

//http://www.softwareishard.com/blog/har-12-spec/#cookies
export interface Cookie {
  name: string
  value: string
  path?: string
  domain?: string
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  comment?: string
}

//custom helper type
interface NameValuePair {
  name: string
  value: string
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#headers
export interface Header extends NameValuePair { }

//http://www.softwareishard.com/blog/har-12-spec/#queryString
export interface QueryString extends NameValuePair { }

//http://www.softwareishard.com/blog/har-12-spec/#postData
export interface PostData {
  mimeType: string
  params: Array<Param>
  text: string
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#params
export interface Param {
  name: string
  value?: string
  fileName?: string
  contentType?: string
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#content
export interface Content {
  size: number
  compression?: number
  mimeType: string
  text?: string
  encoding?: string
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#cache
export interface Cache {
  beforeRequest?: CacheDetails
  afterRequest?: CacheDetails
  comment ?: string
}

export interface CacheDetails{
  expires?: string
  lastAccess: string
  eTag: string
  hitCount: number
  comment?: string
}

//http://www.softwareishard.com/blog/har-12-spec/#timings
export interface Timings {
  /**  Time spent in a queue waiting for a network connection. Use -1 if the timing does not apply to the current request. */
  blocked?: number
  /**  DNS resolution time. The time required to resolve a host name. Use -1 if the timing does not apply to the current request. */
  dns?: number
  /** Time required to create TCP connection. Use -1 if the timing does not apply to the current request. */
  connect?: number
  /** Time required to send HTTP request to the server. */
  send?: number
  /** Waiting for a response from the server.] */
  wait: number
  /** Time required to read entire response from the server (or cache). */
  receive: number
  /** Time required for SSL/TLS negotiation. If this field is defined then the time is also included in the connect field (to ensure backward compatibility with HAR 1.1). Use -1 if the timing does not apply to the current request. */
  ssl?: number
  comment?: string
}