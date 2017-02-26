// Based on the HAR 1.2 Spec
// http://www.softwareishard.com/blog/har-12-spec/

/**
 * This object (`log`) represents the root of exported data.
 * http://www.softwareishard.com/blog/har-12-spec/#log
 */
export interface Har {
  /** Version number of the format. If empty, string "1.1" is assumed by default. */
  version: string;
  /** Name and version info of the log creator application. */
  creator: Creator;
  /** Name and version info of used browser. */
  browser?: Browser;
  /**
   * List of all exported (tracked) pages.
   *
   * _Leave out this field if the application does not support grouping by pages._
   */
  pages?: Page[];
  /** List of all exported (tracked) requests. */
  entries: Entry[];
  /**  A comment provided by the user or the application. */
  comment?: string;
}

/**
 * Infos about application/browser used to export the log.
 * `Creator` and `Browser` objects share the same structure.
 * http://www.softwareishard.com/blog/har-12-spec/#creator
 */
export interface Creator {
  /** Name of the application/browser used to export the log. */
  name: string;
  /** Version of the application/browser used to export the log. */
  version: string;
  /** A comment provided by the user or the application. */
  comment?: string;
}

/**
 * Infos about application/browser used to export the log.
 * `Browser` and `Creator` objects share the same structure.
 * http://www.softwareishard.com/blog/har-12-spec/#browser
 */
export interface Browser {
  /** Name of the application/browser used to export the log. */
  name: string;
  /** Version of the application/browser used to export the log. */
  version: string;
  /** A comment provided by the user or the application. */
  comment?: string;
}

/**
 * This object represents list of exported pages.
 * http://www.softwareishard.com/blog/har-12-spec/#pages
 */
export interface Page {
  /** Date and time stamp for the beginning of the page load (ISO 8601 - `YYYY-MM-DDThh:mm:ss.sTZD`,
   * e.g. `2009-07-24T19:20:30.45+01:00`).
   */
  startedDateTime: string; // YYYY-MM-DDThh:mm:ss.sTZD
  /** Unique identifier of a page within the `<log>` (HAR doc). Entries use it to refer the parent page. */
  id: string;
  /** Page title. */
  title: string;
  /** Detailed timing info about page load */
  pageTimings: PageTimings;
  /**  A comment provided by the user or the application */
  comment?: string;

  // WPT Custom Fields
  _adult_site?: number;
  _aft?: number;
  _base_page_cdn?: string;
  _base_page_redirects?: number;
  _base_page_ttfb?: number;
  _browser_main_memory_kb?: number;
  _browser_name?: string;
  _browser_other_private_memory_kb?: number;
  _browser_process_count?: number;
  _browser_version?: string;
  _browser_working_set_kb?: number;
  _bytesIn?: number;
  _bytesInDoc?: number;
  _bytesOut?: number;
  _bytesOutDoc?: number;
  _cached?: number;
  _certificate_bytes?: number;
  _connections?: number;
  _date?: number;
  _docCPUms?: number;
  _docCPUpct?: number;
  _docTime?: number;
  _domContentLoadedEventEnd?: number;
  _domContentLoadedEventStart?: number;
  _domElements?: number;
  _domInteractive?: number;
  _domLoading?: number;
  _domTime?: number;
  _effectiveBps?: number;
  _effectiveBpsDoc?: number;
  _eventName?: string;
  _firstPaint?: number;
  _fixed_viewport?: number;
  _fullyLoaded?: number;
  _fullyLoadedCPUms?: number;
  _fullyLoadedCPUpct?: number;
  _gzip_savings?: number;
  _gzip_total?: number;
  _image_savings?: number;
  _image_total?: number;
  _isResponsive?: number;
  _lastVisualChange?: number;
  _loadEventEnd?: number;
  _loadEventStart?: number;
  _loadTime?: number;
  _minify_savings?: number;
  _minify_total?: number;
  _optimization_checked?: number;
  _pageSpeedVersion?: string;
  _render?: number;
  _requests?: number;
  _requestsDoc?: number;
  _requestsFull?: number;
  _responses_200?: number;
  _responses_404?: number;
  _responses_other?: number;
  _result?: number;
  _run?: number;
  _score_cache?: number;
  _score_cdn?: number;
  _score_combine?: number;
  _score_compress?: number;
  _score_cookies?: number;
  _score_etags?: number;
  _score_gzip?: number;
  "_score_keep-alive"?: number;
  _score_minify?: number;
  _score_progressive_jpeg?: number;
  _server_count?: number;
  _server_rtt?: number;
  _SpeedIndex?: number;
  _step?: number;
  _title?: string;
  _titleTime?: number;
  _TTFB?: number;
  _URL?: string;
  _visualComplete?: number;
}

/**
 * This object describes timings for various events (states) fired during the page load.
 * All times are specified in milliseconds.
 * If a time info is not available appropriate field is set to `-1`.
 * http://www.softwareishard.com/blog/har-12-spec/#pageTimings
 */
export interface PageTimings {
  /** Content of the page loaded. Number of milliseconds since page load started (`page.startedDateTime`).
   * Use `-1` if the timing does not apply to the current request.
   */
  onContentLoad?: number;
  /** Page is loaded (`onLoad` event fired). Number of milliseconds since page load started (`page.startedDateTime`).
   * Use `-1` if the timing does not apply to the current request.
   */
  onLoad?: number;
  /**  A comment provided by the user or the application */
  comment?: string;

  // WPT Custom Fields
  _startRender?: number;
}

/**
 * This object represents an array with all exported HTTP requests. Sorting entries by `startedDateTime`
 * (starting from the oldest) is preferred way how to export data since it can make importing faster.
 * However the reader application should always make sure the array is sorted (if required for the import).
 * http://www.softwareishard.com/blog/har-12-spec/#entries
 */
export interface Entry {
  /** Reference to the parent page. Leave out this field if the application does not support grouping by pages. */
  pageref?: string;
  /** Date and time stamp of the request start (ISO 8601 - `YYYY-MM-DDThh:mm:ss.sTZD`). */
  startedDateTime: string; // YYYY-MM-DDThh:mm:ss.sTZD
  /** Total elapsed time of the request in milliseconds.
   * This is the sum of all timings available in the timings object (i.e. not including `-1` values).
   */
  time: number;
  /** Detailed info about the request. */
  request: Request;
  /** Detailed info about the response. */
  response: Response;
  /** Info about cache usage. */
  cache: Cache;
  /** Detailed timing info about request/response round trip. */
  timings: Timings;
  /** IP address of the server that was connected (result of DNS resolution). */
  serverIPAddress?: string;
  /**  Unique ID of the parent TCP/IP connection, can be the client or server port number.
   * Note that a port number doesn't have to be unique identifier
   * in cases where the port is shared for more connections.
   * If the port isn't available for the application, any other unique connection ID can be used instead
   * (e.g. connection index). Leave out this field if the application doesn't support this info.
   */
  connection?: string;
  /**  A comment provided by the user or the application */
  comment?: string;

  // WPT Custom Fields
  _all_end?: number | string;
  _all_ms?: number | string;
  _all_start?: number | string;
  _bytesIn?: number | string;
  _bytesOut?: number | string;
  _cacheControl?: string;
  _cache_time?: number | string;
  _cdn_provider?: string;
  _certificate_bytes?: number | string;
  _client_port?: number | string;
  _connect_end?: number | string;
  _connect_ms?: number | string;
  _connect_start?: number | string;
  _contentEncoding?: string;
  _contentType?: string;
  _dns_end?: number | string;
  _dns_ms?: number | string;
  _dns_start?: number | string;
  _download_end?: number | string;
  _download_ms?: number | string;
  _download_start?: number | string;
  _expires?: string;
  _full_url?: string;
  _gzip_save?: number | string;
  _gzip_total?: number | string;
  _host?: string;
  _http2_stream_dependency?: number | string;
  _http2_stream_exclusive?: number | string;
  _http2_stream_id?: number | string;
  _http2_stream_weight?: number | string;
  _image_save?: number | string;
  _image_total?: number | string;
  _index?: number;
  _initiator?: string;
  _initiator_column?: string;
  _initiator_detail?: string;
  _initiator_function?: string;
  _initiator_line?: string;
  _initiator_type?: string;
  _ip_addr?: string;
  _is_secure?: number | string;
  _jpeg_scan_count?: number | string;
  _load_end?: number | string;
  _load_ms?: number | string;
  _load_start?: number | string;
  _method?: string;
  _minify_save?: number | string;
  _minify_total?: number | string;
  _number?: number;
  _objectSize?: number | string;
  _objectSizeUncompressed?: number | string;
  _priority?: string;
  _protocol?: number | string;
  _request_id?: number | string;
  _responseCode?: number | string;
  _score_cache?: number | string;
  _score_cdn?: number | string;
  _score_combine?: number | string;
  _score_compress?: number | string;
  _score_cookies?: number | string;
  _score_etags?: number | string;
  _score_gzip?: number | string;
  "_score_keep-alive"?: number | string;
  _score_minify?: number | string;
  _score_progressive_jpeg?: number;
  _server_count?: number | string;
  _server_rtt?: number | string;
  _socket?: number | string;
  _ssl_end?: number | string;
  _ssl_ms?: number | string;
  _ssl_start?: number | string;
  _ttfb_end?: number | string;
  _ttfb_ms?: number | string;
  _ttfb_start?: number | string;
  _type?: number | string;
  _url?: string;
  _was_pushed?: number | string;

  // Browsertime Custom Fields
  _initialPriority?: string;
}

/**
 * This object contains detailed info about performed request.
 * http://www.softwareishard.com/blog/har-12-spec/#request
 */
export interface Request {
  /** Request method (`GET`, `POST`, ...). */
  method: string;
  /** Absolute URL of the request (fragments are not included). */
  url: string;
  /** Request HTTP Version. */
  httpVersion: string;
  /** List of cookie objects. */
  cookies: Cookie[];
  /** List of header objects. */
  headers: Header[];
  /** List of query parameter objects. */
  queryString: QueryString[];
  /** Posted data info. */
  postData?: PostData;
  /** Total number of bytes from the start of the HTTP request message until (and including)
   * the double CRLF before the body. Set to `-1` if the info is not available.
   */
  headersSize: number;
  /** Size of the request body (POST data payload) in bytes. Set to `-1` if the info is not available. */
  bodySize: number;
  /**  A comment provided by the user or the application */
  comment?: string;
}

/**
 * This object contains detailed info about the response.
 * http://www.softwareishard.com/blog/har-12-spec/#response
 */
export interface Response {
  /** Response status. */
  status: number;
  /** Response status description. */
  statusText: string;
  /** Response HTTP Version. */
  httpVersion: string;
  /** List of cookie objects. */
  cookies: Cookie[];
  /** List of header objects. */
  headers: Header[];
  /** Details about the response body. */
  content: Content;
  /** Redirection target URL from the Location response header. */
  redirectURL: string;
  /** Total number of bytes from the start of the HTTP response message until (and including)
   * the double CRLF before the body. Set to `-1` if the info is not available.
   *
   * _The size of received response-headers is computed only from headers that are really received from the server.
   * Additional headers appended by the browser are not included in this number,
   * but they appear in the list of header objects._
   */
  headersSize: number;
  /** Size of the received response body in bytes. Set to zero in case of responses coming from the cache (`304`).
   * Set to `-1` if the info is not available.
   */
  bodySize: number;
  /**  A comment provided by the user or the application */
  comment?: string;
  _transferSize?: number;
}

/**
 * This object contains list of all cookies (used in `request` and `response` objects).
 * http://www.softwareishard.com/blog/har-12-spec/#cookies
 */
export interface Cookie {
  /** The name of the cookie. */
  name: string;
  /** The cookie value. */
  value: string;
  /** The path pertaining to the cookie. */
  path?: string;
  /** The host of the cookie. */
  domain?: string;
  /** Cookie expiration time. (ISO 8601 - `YYYY-MM-DDThh:mm:ss.sTZD`, e.g. `2009-07-24T19:20:30.123+02:00`). */
  expires?: Date;
  /** Set to true if the cookie is HTTP only, false otherwise. */
  httpOnly?: boolean;
  /** True if the cookie was transmitted over ssl, false otherwise. */
  secure?: boolean;
  /**  A comment provided by the user or the application */
  comment?: string;
}

// custom helper type
export interface NameValuePair {
  name: string;
  value: string;
  /**  A comment provided by the user or the application */
  comment?: string;
}

/**
 * This object represents a headers (used in `request` and `response` objects).
 * http://www.softwareishard.com/blog/har-12-spec/#headers
 */
export interface Header extends NameValuePair { }

/**
 *  This object represents a parameter & value parsed from a query string, if any (embedded in `request` object).
 * http://www.softwareishard.com/blog/har-12-spec/#queryString
 */
export interface QueryString extends NameValuePair { }

/**
 * This object describes posted data, if any (embedded in `request` object).
 * http://www.softwareishard.com/blog/har-12-spec/#postData
 */
export interface PostData {
  /** Mime type of posted data. */
  mimeType: string;
  /** List of posted parameters (in case of URL encoded parameters).
   *
   * _`text` and `params` fields are mutually exclusive._
   */
  params: Param[];
  /** Plain text posted data
   *
   * _`params` and `text` fields are mutually exclusive._
   */
  text: string;
  /**  A comment provided by the user or the application */
  comment?: string;
}

/**
 * List of posted parameters, if any (embedded in `postData` object).
 * http://www.softwareishard.com/blog/har-12-spec/#params
 */
export interface Param {
  /** name of a posted parameter. */
  name: string;
  /** value of a posted parameter or content of a posted file */
  value?: string;
  /** name of a posted file. */
  fileName?: string;
  /** content type of a posted file. */
  contentType?: string;
  /**  A comment provided by the user or the application */
  comment?: string;
}

/**
 * This object describes details about response content (embedded in `response` object).
 * http://www.softwareishard.com/blog/har-12-spec/#content
 */
export interface Content {
  /** Length of the returned content in bytes.
   *
   * Should be equal to `response.bodySize` if there is no compression and bigger when the content has been compressed.
   */
  size: number;
  /** Number of bytes saved. Leave out this field if the information is not available. */
  compression?: number;
  /** MIME type of the response text (value of the Content-Type response header).
   * The charset attribute of the MIME type is included (if available).
   */
  mimeType: string;
  /** Response body sent from the server or loaded from the browser cache.
   * This field is populated with textual content only.
   * The text field is either HTTP decoded text or a encoded (e.g. `base64`)
   * representation of the response body. Leave out this field if the information is not available.
   */
  text?: string;
  /**  Encoding used for response text field e.g `base64`.
   * Leave out this field if the text field is HTTP decoded (decompressed & unchunked),
   * than trans-coded from its original character set into UTF-8.
   */
  encoding?: string;
  /**  A comment provided by the user or the application */
  comment?: string;
}

/**
 * This objects contains info about a request coming from browser cache.
 * http://www.softwareishard.com/blog/har-12-spec/#cache
 */
export interface Cache {
  /**  State of a cache entry before the request. Leave out this field if the information is not available. */
  beforeRequest?: CacheDetails;
  /** State of a cache entry after the request. Leave out this field if the information is not available. */
  afterRequest?: CacheDetails;
  /**  A comment provided by the user or the application */
  comment?: string;
}

export interface CacheDetails {
  /** Expiration time of the cache entry.
   *
   * _(Format not documente but assumingly ISO 8601 - `YYYY-MM-DDThh:mm:ss.sTZD`)_
   */
  expires?: string;
  /** The last time the cache entry was opened.
   *    *
   * _(Format not documente but assumingly ISO 8601 - `YYYY-MM-DDThh:mm:ss.sTZD`)_
   */
  lastAccess: string;
  /** Etag */
  eTag: string;
  /** The number of times the cache entry has been opened. */
  hitCount: number;
  /**  A comment provided by the user or the application */
  comment?: string;
}

/**
 * This object describes various phases within request-response round trip. All times are specified in milliseconds.
 * http://www.softwareishard.com/blog/har-12-spec/#timings
 */
export interface Timings {
  /**  Time spent in a queue waiting for a network connection.
   * Use `-1` if the timing does not apply to the current request.
   */
  blocked?: number;
  /**  DNS resolution time. The time required to resolve a host name.
   * Use `-1` if the timing does not apply to the current request.
   */
  dns?: number;
  /** Time required to create TCP connection. Use `-1` if the timing does not apply to the current request. */
  connect?: number;
  /** Time required to send HTTP request to the server.
   *
   * _Not optional and must have non-negative values._
   */
  send?: number;
  /** Waiting for a response from the server.
   *
   * _Not optional and must have non-negative values._
   */
  wait: number;
  /** Time required to read entire response from the server (or cache).
   *
   * _Not optional and must have non-negative values._
   */
  receive: number;
  /** Time required for SSL/TLS negotiation. If this field is defined then the time is also included in the
   * connect field (to ensure backward compatibility with HAR 1.1).
   * Use `-1` if the timing does not apply to the current request.
   */
  ssl?: number;
  /**  A comment provided by the user or the application */
  comment?: string;
}
